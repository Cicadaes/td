/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package td.enterprise.wanalytics.kafka;

import kafka.message.Message;
import org.apache.storm.Config;
import org.apache.storm.kafka.*;
import org.apache.storm.metric.api.IMetric;
import org.apache.storm.spout.SpoutOutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseRichSpout;
import org.apache.storm.tuple.Fields;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.wanalytics.kafka.BitmapPartitionManager.KafkaMessageId;

import java.util.*;

public class BitmapKafkaSpout extends BaseRichSpout {

	private static final long serialVersionUID = -8486739238855133007L;

	Logger logger = LoggerFactory.getLogger(BitmapKafkaSpout.class);

	public static class MessageAndRealOffset {
		public Message msg;
		public long offset;

		public MessageAndRealOffset(Message msg, long offset) {
			this.msg = msg;
			this.offset = offset;
		}
	}

	static enum EmitState {
		EMITTED_MORE_LEFT, EMITTED_END, NO_EMITTED
	}

	public static final Logger LOG = LoggerFactory.getLogger(BitmapKafkaSpout.class);

	String _uuid = UUID.randomUUID().toString();
	SpoutConfig _spoutConfig;
	SpoutOutputCollector _collector;
	BitmapPartitionCoordinator _coordinator;
	DynamicPartitionConnections _connections;
	ZkState _state;

	long _lastUpdateMs = 0;

	int _currPartitionIndex = 0;

	public BitmapKafkaSpout(SpoutConfig spoutConf) {
		_spoutConfig = spoutConf;
	}

	@Override
	public void open(Map conf, final TopologyContext context, final SpoutOutputCollector collector) {
		_collector = collector;

		Map stateConf = new HashMap(conf);
		List<String> zkServers = _spoutConfig.zkServers;
		if (zkServers == null) {
			zkServers = (List<String>) conf.get(Config.STORM_ZOOKEEPER_SERVERS);
		}
		Integer zkPort = _spoutConfig.zkPort;
		if (zkPort == null) {
			zkPort = ((Number) conf.get(Config.STORM_ZOOKEEPER_PORT)).intValue();
		}
		stateConf.put(Config.TRANSACTIONAL_ZOOKEEPER_SERVERS, zkServers);
		stateConf.put(Config.TRANSACTIONAL_ZOOKEEPER_PORT, zkPort);
		stateConf.put(Config.TRANSACTIONAL_ZOOKEEPER_ROOT, _spoutConfig.zkRoot);
		_state = new ZkState(stateConf);

		_connections = new DynamicPartitionConnections(_spoutConfig, KafkaUtils.makeBrokerReader(conf, _spoutConfig));

		// using TransactionalState like this is a hack
		int totalTasks = context.getComponentTasks(context.getThisComponentId()).size();
		if (_spoutConfig.hosts instanceof StaticHosts) {
			// _coordinator = new StaticCoordinator(_connections, conf,
			// _spoutConfig, _state, context.getThisTaskIndex(), totalTasks,
			// _uuid);
		} else {
			_coordinator = new BitmapZkCoordinator(_connections, conf, _spoutConfig, _state, context.getThisTaskIndex(), totalTasks, _uuid);
		}

		context.registerMetric("kafkaOffset", new IMetric() {
			KafkaUtils.KafkaOffsetMetric _kafkaOffsetMetric = new KafkaUtils.KafkaOffsetMetric(_connections);

			@Override
			public Object getValueAndReset() {
				List<BitmapPartitionManager> pms = _coordinator.getMyManagedPartitions();
				Set<Partition> latestPartitions = new HashSet();
				for (BitmapPartitionManager pm : pms) {
					latestPartitions.add(pm.getPartition());
				}
				_kafkaOffsetMetric.refreshPartitions(latestPartitions);
				for (BitmapPartitionManager pm : pms) {
					_kafkaOffsetMetric.setOffsetData(pm.getPartition(), pm.getOffsetData());
				}
				return _kafkaOffsetMetric.getValueAndReset();
			}
		}, _spoutConfig.metricsTimeBucketSizeInSecs);

		context.registerMetric("kafkaPartition", new IMetric() {
			@Override
			public Object getValueAndReset() {
				List<BitmapPartitionManager> pms = _coordinator.getMyManagedPartitions();
				Map concatMetricsDataMaps = new HashMap();
				for (BitmapPartitionManager pm : pms) {
					concatMetricsDataMaps.putAll(pm.getMetricsDataMap());
				}
				return concatMetricsDataMaps;
			}
		}, _spoutConfig.metricsTimeBucketSizeInSecs);
	}

	@Override
	public void close() {
		_state.close();
	}

	@Override
	public void nextTuple() {
		List<BitmapPartitionManager> managers = _coordinator.getMyManagedPartitions();
		for (int i = 0; i < managers.size(); i++) {

			try {
				// in case the number of managers decreased
				_currPartitionIndex = _currPartitionIndex % managers.size();
				EmitState state = managers.get(_currPartitionIndex).next(_collector);
				if (state != EmitState.EMITTED_MORE_LEFT) {
					_currPartitionIndex = (_currPartitionIndex + 1) % managers.size();
				}
				if (state != EmitState.NO_EMITTED) {
					break;
				}
			} catch (FailedFetchException e) {
				LOG.warn("Fetch failed", e);
				_coordinator.refresh();
			}
		}

		long now = System.currentTimeMillis();
		if ((now - _lastUpdateMs) > _spoutConfig.stateUpdateIntervalMs) {
			commit();
		}
	}

	@Override
	public void ack(Object msgId) {
		// LOG.info("======================================== ack:"+msgId);
		KafkaMessageId id = (KafkaMessageId) msgId;
		BitmapPartitionManager m = _coordinator.getManager(id.partition);
		if (m != null) {
			m.ack(id.offset);
		}
	}

	@Override
	public void fail(Object msgId) {
		KafkaMessageId id = (KafkaMessageId) msgId;
		BitmapPartitionManager m = _coordinator.getManager(id.partition);

		// to get real data
		if (m != null) {
			m.fail(id.offset);
			logger.error("=========== failed:partition->" + id.partition + ",offset:" + id.offset);
		}
	}

	@Override
	public void deactivate() {
		commit();
	}

	@Override
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		// declarer.declare(_spoutConfig.scheme.getOutputFields());
		declarer.declareStream("bitmap",new Fields("cubeName", "recordKey", "data"));
		declarer.declareStream("counter",new Fields("data"));
	}

	private void commit() {
		_lastUpdateMs = System.currentTimeMillis();
		for (BitmapPartitionManager manager : _coordinator.getMyManagedPartitions()) {
			manager.commit();
		}
	}
	
}
