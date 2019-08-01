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

import com.google.common.collect.ImmutableMap;
import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.databean.WifiData;
import com.talkingdata.analytics.wifi.collector.databean.WifiTa;
import kafka.javaapi.consumer.SimpleConsumer;
import kafka.javaapi.message.ByteBufferMessageSet;
import kafka.message.MessageAndOffset;
import org.apache.storm.Config;
import org.apache.storm.kafka.*;
import org.apache.storm.kafka.PartitionManager.OffsetData;
import org.apache.storm.kafka.trident.MaxMetric;
import org.apache.storm.metric.api.CombinedMetric;
import org.apache.storm.metric.api.CountMetric;
import org.apache.storm.metric.api.MeanReducer;
import org.apache.storm.metric.api.ReducedMetric;
import org.apache.storm.spout.SpoutOutputCollector;
import org.apache.storm.tuple.Values;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.dmp.common.util.JsonUtils;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.wanalytics.common.Constants.JsonDataDevType;
import td.enterprise.wanalytics.kafka.CollectorKafkaSpout.EmitState;
import td.enterprise.wanalytics.processor.utils.LineKeyConstants;
import td.enterprise.wanalytics.processor.utils.MurmurHash;
import td.enterprise.wanalytics.processor.utils.TimespendLogger;

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.net.URLEncoder;
import java.util.*;

public class CollectorPartitionManager {
    public static final Logger LOG = LoggerFactory.getLogger(CollectorPartitionManager.class);
    private final CombinedMetric _fetchAPILatencyMax;
    private final ReducedMetric _fetchAPILatencyMean;
    private final CountMetric _fetchAPICallCount;
    private final CountMetric _fetchAPIMessageCount;
    private final CountMetric _lostMessageCount;
    private final CountMetric _messageIneligibleForRetryCount;
    
    Long _emittedToOffset;
    private SortedMap<Long,Long> _pending = new TreeMap<Long,Long>();
    private final FailedMsgRetryManager _failedMsgRetryManager;
    
    SortedSet<Long> failed = new TreeSet<Long>();
    Long _committedTo;
    LinkedList<MessageAndOffset> _waitingToEmit = new LinkedList<MessageAndOffset>();
    Partition _partition;
    SpoutConfig _spoutConfig;
    String _topologyInstanceId;
    SimpleConsumer _consumer;
    DynamicPartitionConnections _connections;
    ZkState _state;
    Map _stormConf;
    long numberFailed, numberAcked;
    public CollectorPartitionManager(DynamicPartitionConnections connections, String topologyInstanceId, ZkState state, Map stormConf, SpoutConfig spoutConfig, Partition id) {
        _partition = id;
        _connections = connections;
        _spoutConfig = spoutConfig;
        _topologyInstanceId = topologyInstanceId;
        _consumer = connections.register(id.host, id.topic, id.partition);
        _state = state;
        _stormConf = stormConf;
        numberAcked = numberFailed = 0;
        
        try {
            _failedMsgRetryManager = (FailedMsgRetryManager) Class.forName(spoutConfig.failedMsgRetryManagerClass).newInstance();
            _failedMsgRetryManager.prepare(spoutConfig, _stormConf);
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            throw new IllegalArgumentException(String.format("Failed to create an instance of <%s> from: <%s>",
                                                             FailedMsgRetryManager.class,
                                                             spoutConfig.failedMsgRetryManagerClass), e);
        }

        String jsonTopologyId = null;
        Long jsonOffset = null;
        String path = committedPath();
        try {
            Map<Object, Object> json = _state.readJSON(path);
            LOG.info("Read partition information from: " + path +  "  --> " + json );
            if (json != null) {
                jsonTopologyId = (String) ((Map<Object, Object>) json.get("topology")).get("id");
                jsonOffset = (Long) json.get("offset");
            }
        } catch (Throwable e) {
            LOG.warn("Error reading and/or parsing at ZkNode: " + path, e);
        }

        String topic = _partition.topic;
        Long currentOffset = KafkaUtils.getOffset(_consumer, topic, id.partition, spoutConfig);

        if (jsonTopologyId == null || jsonOffset == null) { // failed to parse JSON?
            _committedTo = currentOffset;
            LOG.info("No partition information found, using configuration to determine offset");
        } else if (!topologyInstanceId.equals(jsonTopologyId) && spoutConfig.ignoreZkOffsets) {
            _committedTo = KafkaUtils.getOffset(_consumer, spoutConfig.topic, id.partition, spoutConfig.startOffsetTime);
            LOG.info("Topology change detected and reset from start forced, using configuration to determine offset");
        } else {
            _committedTo = jsonOffset;
            LOG.info("Read last commit offset from zookeeper: " + _committedTo + "; old topology_id: " + jsonTopologyId + " - new topology_id: " + topologyInstanceId );
        }

        if (currentOffset - _committedTo > spoutConfig.maxOffsetBehind || _committedTo <= 0) {
            LOG.info("Last commit offset from zookeeper: " + _committedTo);
            _committedTo = currentOffset;
            LOG.info("Commit offset " + _committedTo + " is more than " +
                    spoutConfig.maxOffsetBehind + " behind, resetting to startOffsetTime=" + spoutConfig.startOffsetTime);
        }

        LOG.info("Starting Kafka " + _consumer.host() + ":" + id.partition + " from offset " + _committedTo);
        _emittedToOffset = _committedTo;

        _fetchAPILatencyMax = new CombinedMetric(new MaxMetric());
        _fetchAPILatencyMean = new ReducedMetric(new MeanReducer());
        _fetchAPICallCount = new CountMetric();
        _fetchAPIMessageCount = new CountMetric();
        _lostMessageCount = new CountMetric();
        _messageIneligibleForRetryCount = new CountMetric();
    }

    public Map getMetricsDataMap() {
    	 Map ret = new HashMap();
         ret.put(_partition + "/fetchAPILatencyMax", _fetchAPILatencyMax.getValueAndReset());
         ret.put(_partition + "/fetchAPILatencyMean", _fetchAPILatencyMean.getValueAndReset());
         ret.put(_partition + "/fetchAPICallCount", _fetchAPICallCount.getValueAndReset());
         ret.put(_partition + "/fetchAPIMessageCount", _fetchAPIMessageCount.getValueAndReset());
         ret.put(_partition + "/lostMessageCount", _lostMessageCount.getValueAndReset());
         ret.put(_partition + "/messageIneligibleForRetryCount", _messageIneligibleForRetryCount.getValueAndReset());
         return ret;
    }

    //returns false if it's reached the end of current batch
    public EmitState next(SpoutOutputCollector collector) {
        if (_waitingToEmit.isEmpty()) {
            fill();
        }
        while (true) {
            MessageAndOffset toEmit = _waitingToEmit.pollFirst();
            if (toEmit == null) {
                return EmitState.NO_EMITTED;
            }
            Iterable<List<Object>> tuples;
            if (_spoutConfig.scheme instanceof MessageMetadataSchemeAsMultiScheme) {
            	tuples = KafkaUtils.generateTuples((MessageMetadataSchemeAsMultiScheme) _spoutConfig.scheme, toEmit.message(), _partition, toEmit.offset());
            } else {
            	tuples = KafkaUtils.generateTuples(_spoutConfig, toEmit.message(), _partition.topic);
            }
            if (tuples != null) {
                for (List<Object> tuple : tuples) {
                    // collector.emit(tuple, new KafkaMessageId(_partition, toEmit.offset));
                    // custom
            		byte[] epbytes = (byte[])tuple.get(0);
//					try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(epbytes))) {
//						KafkaCubeData msgs = (KafkaCubeData) ois.readObject();
//						// KEY is MurmurHash,Value is the records
////						for (HashMap<String, Object> msg : msgs) {
//							String cubeName = (String) msgs.getCubeName();
//							String dimension = (String) msgs.getDimension();
////							Values cubeData = (Values) msgs.getValues();
//							Long hash = MurmurHash.hash64(cubeName + "_" + dimension);
//							collector.emit(new Values(cubeName, hash, msgs), new KafkaMessageId(_partition, toEmit.offset));
////						}
//					} catch (Exception e) {
//            			LOG.error("====== 数据处理错误："+e.getMessage(),e);
//            		}
            		WiFiDataEntity wiFiDataEntity = null;
            		try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(epbytes))) {
            			Object obj = ois.readObject();
            			if (obj instanceof WiFiDataEntity) {
            				wiFiDataEntity = (WiFiDataEntity) obj;
            			} else if (obj instanceof String) {
            				ObjectMapper mapper = new ObjectMapper();
            				wiFiDataEntity = mapper.readValue((String) obj, WiFiDataEntity.class);
            			}
                        String devType = "";
                        if (null != wiFiDataEntity)
                        devType = wiFiDataEntity.getDevtype();
            			if (devType != null && !"".equals(devType) && (JsonDataDevType.SENSOR.equals(devType) || JsonDataDevType.AP.equals(devType))) { // 探针
            				List<Line> parseLogList = parseWifiAnalyticsLog(wiFiDataEntity);
            				if (parseLogList == null || parseLogList.size() == 0){
            					 ack(toEmit.offset());
            					 continue;
            				}
            				for (Line line : parseLogList){
            					Long machash = MurmurHash.hash64(line.get(LineKeyConstants.mac)+"");
            					collector.emit(new Values(machash, line), new KafkaMessageId(_partition, toEmit.offset(),machash));
            				}
            			} else {
            				LOG.error("devType is not valid" + epbytes.toString());
            			}
            		} catch (Exception e) {
            			LOG.error("====== 获取WIFI Log数据错误：", e);
            		}
                }
                break;
            } else {
                ack(toEmit.offset());
            }
        }
        if (!_waitingToEmit.isEmpty()) {
            return EmitState.EMITTED_MORE_LEFT;
        } else {
            return EmitState.EMITTED_END;
        }
    }
    
    private List<Line> parseWifiAnalyticsLog(WiFiDataEntity wifiDataEntity) throws Exception{
		TimespendLogger tl1 = new TimespendLogger(100);
		List<Line> lineList = new ArrayList<Line>();
		WifiData wifiData = wifiDataEntity.getWifidata();
		tl1.logReset(" step 1 getWifitalist ");
		// WiFiDataEntity
		String version = wifiDataEntity.getVersion();
		String devtype = wifiDataEntity.getDevtype();
		String keytype = wifiDataEntity.getKeytype();
		long tsreceive = wifiDataEntity.getTsreceive();

		// WifiData
		String apmac = paddingMac(wifiData.getApmac());
		int num = wifiData.getNum();
		long tssend = wifiData.getTssend();
		for (WifiTa wifiTa : wifiData.getWifitalist()) {
			String rssi = wifiTa.getRssi();
			String mac = paddingMac(wifiTa.getMac());
			Line line = new Line();
			line.put(LineKeyConstants.version, version);
			line.put(LineKeyConstants.devtype, devtype);
			line.put(LineKeyConstants.keytype, keytype);
			line.put(LineKeyConstants.tsreceive, tsreceive);
			line.put(LineKeyConstants.apmac, apmac);
			line.put(LineKeyConstants.num, num);
			line.put(LineKeyConstants.tssend, tssend);
			line.put(LineKeyConstants.rssi, rssi);
			line.put(LineKeyConstants.mac, mac);
			line.put(LineKeyConstants.channel, wifiTa.getChannel());
			lineList.add(line);
//			logger.error("-------------taevent is null!apmac=" + apmac);
		}
		return lineList;
    }

    private void fill() {
        long start = System.nanoTime();
        Long offset;
        
        // Are there failed tuples? If so, fetch those first.
        offset = this._failedMsgRetryManager.nextFailedMessageToRetry();
        final boolean processingNewTuples = (offset == null);
        if (processingNewTuples) {
            offset = _emittedToOffset;
        }

        ByteBufferMessageSet msgs = null;
        try {
            msgs = KafkaUtils.fetchMessages(_spoutConfig, _consumer, _partition, offset);
        } catch (TopicOffsetOutOfRangeException e) {
        	offset = KafkaUtils.getOffset(_consumer, _partition.topic, _partition.partition, kafka.api.OffsetRequest.EarliestTime());
            // fetch failed, so don't update the fetch metrics
            
            //fix bug [STORM-643] : remove outdated failed offsets
            if (!processingNewTuples) {
                // For the case of EarliestTime it would be better to discard
                // all the failed offsets, that are earlier than actual EarliestTime
                // offset, since they are anyway not there.
                // These calls to broker API will be then saved.
                Set<Long> omitted = this._failedMsgRetryManager.clearOffsetsBefore(offset);

                // Omitted messages have not been acked and may be lost
                if (null != omitted) {
                    _lostMessageCount.incrBy(omitted.size());
                }
                
                LOG.warn("Removing the failed offsets for {} that are out of range: {}", _partition, omitted);
            }
            if (offset > _emittedToOffset) {
                _lostMessageCount.incrBy(offset - _emittedToOffset);
                _emittedToOffset = offset;
                LOG.warn("{} Using new offset: {}", _partition, _emittedToOffset);
            }
            
            return;
        }
        long end = System.nanoTime();
        long millis = (end - start) / 1000000;
        _fetchAPILatencyMax.update(millis);
        _fetchAPILatencyMean.update(millis);
        _fetchAPICallCount.incr();
        if (msgs != null) {
            int numMessages = 0;

            for (MessageAndOffset msg : msgs) {
                final Long cur_offset = msg.offset();
                if (cur_offset < offset) {
                    // Skip any old offsets.
                    continue;
                }
                if (processingNewTuples || this._failedMsgRetryManager.shouldReEmitMsg(cur_offset)) {
                    numMessages += 1;
                    if (!_pending.containsKey(cur_offset)) {
                        _pending.put(cur_offset, System.currentTimeMillis());
                    }
                    _waitingToEmit.add(msg);
                    _emittedToOffset = Math.max(msg.nextOffset(), _emittedToOffset);
                    if (_failedMsgRetryManager.shouldReEmitMsg(cur_offset)) {
                        this._failedMsgRetryManager.retryStarted(cur_offset);
                    }
                }
            }
            _fetchAPIMessageCount.incrBy(numMessages);
        }
    }

    public void ack(Long offset) {
        if (!_pending.isEmpty() && _pending.firstKey() < offset - _spoutConfig.maxOffsetBehind) {
            // Too many things pending!
            _pending.headMap(offset - _spoutConfig.maxOffsetBehind).clear();
        }
        _pending.remove(offset);
        numberAcked++;
    }

    public void fail(Long offset) {
        if (offset < _emittedToOffset - _spoutConfig.maxOffsetBehind) {
            LOG.info(
                    "Skipping failed tuple at offset=" + offset +
                            " because it's more than maxOffsetBehind=" + _spoutConfig.maxOffsetBehind +
                            " behind _emittedToOffset=",
                            offset,
                            _spoutConfig.maxOffsetBehind,
                            _emittedToOffset,
                            _partition
            );
        } else {
            LOG.debug("failing at offset=" + offset + " with _pending.size()=" + _pending.size() + " pending and _emittedToOffset=" + _emittedToOffset);
            numberFailed++;
            if (numberAcked == 0 && numberFailed > _spoutConfig.maxOffsetBehind) {
                throw new RuntimeException("Too many tuple failures");
            }
            
         // Offset may not be considered for retry by failedMsgRetryManager
            if (this._failedMsgRetryManager.retryFurther(offset)) {
                this._failedMsgRetryManager.failed(offset);
            } else {
                // state for the offset should be cleaned up
                LOG.warn("Will not retry failed kafka offset {} further", offset);
                _messageIneligibleForRetryCount.incr();
                _pending.remove(offset);
                this._failedMsgRetryManager.acked(offset);
            }
        }
    }

    public void commit() {
        long lastCompletedOffset = lastCompletedOffset();
        if (_committedTo != lastCompletedOffset) {
            LOG.debug("Writing last completed offset (" + lastCompletedOffset + ") to ZK for " + _partition + " for topology: " + _topologyInstanceId);
            Map<Object, Object> data = (Map<Object, Object>) ImmutableMap.builder()
                    .put("topology", ImmutableMap.of("id", _topologyInstanceId,
                            "name", _stormConf.get(Config.TOPOLOGY_NAME)))
                    .put("offset", lastCompletedOffset)
                    .put("partition", _partition.partition)
                    .put("broker", ImmutableMap.of("host", _partition.host.host,
                            "port", _partition.host.port))
                    .put("topic", _spoutConfig.topic).build();
            _state.writeJSON(committedPath(), data);

            _committedTo = lastCompletedOffset;
            LOG.debug("Wrote last completed offset (" + lastCompletedOffset + ") to ZK for " + _partition + " for topology: " + _topologyInstanceId);
        } else {
            LOG.error("No new offset for " + _partition + " for topology: " + _topologyInstanceId + " lastCompletedOffset=" + lastCompletedOffset);
        }
    }

    private String committedPath() {
        return _spoutConfig.zkRoot + "/" + _spoutConfig.id + "/" + _partition.getId();
    }

    public long lastCompletedOffset() {
        if (_pending.isEmpty()) {
            return _emittedToOffset;
        } else {
            return _pending.firstKey();
        }
    }

    public Partition getPartition() {
        return _partition;
    }

    public void close() {
        _connections.unregister(_partition.host,_partition.topic, _partition.partition);
    }

    static class KafkaMessageId {
        public Partition partition;
        public long offset;
        public long machash;

        public KafkaMessageId(Partition partition, long offset,long machash) {
            this.partition = partition;
            this.offset = offset;
            this.machash = machash;
        }
    }
    
    /**
	 * 补全12位mac地址为带:的
	 * 
	 * @return
	 */
	public String paddingMac(String mac) {
		StringBuffer paddingMac = new StringBuffer();
		if (null != mac && mac.length() == 12) {
			for (int i = 0; i < 12; i = i + 2) {
				paddingMac.append(mac.substring(i, i + 2)).append(":");
			}
			paddingMac.delete(paddingMac.length() - 1, paddingMac.length());
			return paddingMac.toString();
		}
		return mac;
	}
	
	public String getEncodeString(String str) {
		try {
			if (null != str) {
				return URLEncoder.encode(str, "UTF-8");
			}
			return "";
		} catch (Exception e) {
			LOG.warn("URLEncoder exception:" + str, e);
			return str;
		}
	}
	
	public OffsetData getOffsetData() {
	        return new OffsetData(_emittedToOffset, lastCompletedOffset());
	}
}
