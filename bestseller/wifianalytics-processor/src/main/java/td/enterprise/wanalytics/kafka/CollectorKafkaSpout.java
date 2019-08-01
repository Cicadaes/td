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
import td.enterprise.wanalytics.kafka.CollectorPartitionManager.KafkaMessageId;

import java.util.*;

public class CollectorKafkaSpout extends BaseRichSpout {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	Logger logger = LoggerFactory.getLogger(CollectorKafkaSpout.class);

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

	public static final Logger LOG = LoggerFactory.getLogger(CollectorKafkaSpout.class);

	String _uuid = UUID.randomUUID().toString();
	SpoutConfig _spoutConfig;
	SpoutOutputCollector _collector;
	CollectorPartitionCoordinator _coordinator;
	DynamicPartitionConnections _connections;
	ZkState _state;

	long _lastUpdateMs = 0;

	int _currPartitionIndex = 0;

	public CollectorKafkaSpout(SpoutConfig spoutConf) {
		_spoutConfig = spoutConf;
	}

	@Override
	public void open(Map conf, final TopologyContext context, final SpoutOutputCollector collector) {
		_collector = collector;
		String topologyInstanceId = context.getStormId();
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
			_coordinator = new CollectorZkCoordinator(_connections, conf, _spoutConfig, _state,
					context.getThisTaskIndex(), totalTasks, topologyInstanceId);
		}

		context.registerMetric("kafkaOffset", new IMetric() {
			KafkaUtils.KafkaOffsetMetric _kafkaOffsetMetric = new KafkaUtils.KafkaOffsetMetric(_connections);

			@Override
			public Object getValueAndReset() {
				List<CollectorPartitionManager> pms = _coordinator.getMyManagedPartitions();
				Set<Partition> latestPartitions = new HashSet();
				for (CollectorPartitionManager pm : pms) {
					latestPartitions.add(pm.getPartition());
				}
				_kafkaOffsetMetric.refreshPartitions(latestPartitions);
				for (CollectorPartitionManager pm : pms) {
					_kafkaOffsetMetric.setOffsetData(pm.getPartition(), pm.getOffsetData());
				}
				return _kafkaOffsetMetric.getValueAndReset();
			}
		}, _spoutConfig.metricsTimeBucketSizeInSecs);

		context.registerMetric("kafkaPartition", new IMetric() {
			@Override
			public Object getValueAndReset() {
				List<CollectorPartitionManager> pms = _coordinator.getMyManagedPartitions();
				Map concatMetricsDataMaps = new HashMap();
				for (CollectorPartitionManager pm : pms) {
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
		List<CollectorPartitionManager> managers = _coordinator.getMyManagedPartitions();
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
		CollectorPartitionManager m = _coordinator.getManager(id.partition);
		if (m != null) {
			m.ack(id.offset);
		}
	}

	@Override
	public void fail(Object msgId) {
		KafkaMessageId id = (KafkaMessageId) msgId;
		CollectorPartitionManager m = _coordinator.getManager(id.partition);

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
		declarer.declare(new Fields("mac", "data"));
	}

	private void commit() {
		_lastUpdateMs = System.currentTimeMillis();
		for (CollectorPartitionManager manager : _coordinator.getMyManagedPartitions()) {
			manager.commit();
		}
	}
	
	
}
