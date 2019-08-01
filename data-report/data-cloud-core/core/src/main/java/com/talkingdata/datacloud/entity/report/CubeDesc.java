package com.talkingdata.datacloud.entity.report;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>yashiro<br>
 * <b>日期：</b> 17/3/1 <br>
 * <b>版权所有：<b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CubeDesc implements Comparable{

    public String uuid;

    public Long last_modified;

    public String version;

    public String name;

    public String owner;

    public String descriptor;

    public Long cost;

    public String status;

    public List<Segment> segments;

    public Long create_time_utc;

    public Long size_kb;

    public Long input_records_count;

    public Long input_records_size;

    public CubeDesc(
            @JsonProperty("uuid")
                    String uuid,
            @JsonProperty("last_modified")
                    Long last_modified,
            @JsonProperty("version")
                    String version,
            @JsonProperty("name")
                    String name,
            @JsonProperty("owner")
                    String owner,
            @JsonProperty("descriptor")
                    String descriptor,
            @JsonProperty("cost")
                    Long cost,
            @JsonProperty("status")
                    String status,
            @JsonProperty("segments")
                    List<Segment> segments,
            @JsonProperty("create_time_utc")
                    Long create_time_utc,
            @JsonProperty("size_kb")
                    Long size_kb,
            @JsonProperty("input_records_count")
                    Long input_records_count,
            @JsonProperty("input_records_size")
                    Long input_records_size) {
        this.uuid = uuid;
        this.last_modified = last_modified;
        this.version = version;
        this.name = name;
        this.owner = owner;
        this.descriptor = descriptor;
        this.cost = cost;
        this.status = status;
        this.segments = segments;
        this.create_time_utc = create_time_utc;
        this.size_kb = size_kb;
        this.input_records_count = input_records_count;
        this.input_records_size = input_records_size;
    }

    public static class Segment {
        public final String uuid;

        public final String name;

        public final String storage_location_identifier;

        public final Long date_range_start;

        public final Long date_range_end;

        public final Long source_offset_start;

        public final Long source_offset_end;

        public final String status;

        public final Long size_kb;

        public final Long input_records;

        public final Long input_records_size;

        public final Long last_build_time;

        public final String last_build_job_id;

        public final Long create_time_utc;

        public final Map<String, Object> cuboid_shard_nums;

        public final Long total_shards;

        public final List<String> blackout_cuboids;

        public final String binary_signature;

        public final Map<String, String> dictionaries;

        public final Map<String, String> snapshots;

        public final String index_path;

        public final List<Object[]> rowkey_stats;

        public Segment(
                @JsonProperty("uuid")
                        String uuid,
                @JsonProperty("name")
                        String name,
                @JsonProperty("storage_location_identifier")
                        String storage_location_identifier,
                @JsonProperty("date_range_start")
                        Long date_range_start,
                @JsonProperty("date_range_end")
                        Long date_range_end,
                @JsonProperty("source_offset_start")
                        Long source_offset_start,
                @JsonProperty("source_offset_end")
                        Long source_offset_end,
                @JsonProperty("status")
                        String status,
                @JsonProperty("size_kb")
                        Long size_kb,
                @JsonProperty("input_records")
                        Long input_records,
                @JsonProperty("input_records_size")
                        Long input_records_size,
                @JsonProperty("last_build_time")
                        Long last_build_time,
                @JsonProperty("last_build_job_id")
                        String last_build_job_id,
                @JsonProperty("create_time_utc")
                        Long create_time_utc,
                @JsonProperty("cuboid_shard_nums")
                        Map<String, Object> cuboid_shard_nums,
                @JsonProperty("total_shards")
                        Long total_shards,
                @JsonProperty("blackout_cuboids")
                        List<String> blackout_cuboids,
                @JsonProperty("binary_signature")
                        String binary_signature,
                @JsonProperty("dictionaries")
                        Map<String, String> dictionaries,
                @JsonProperty("snapshots")
                        Map<String, String> snapshots,
                @JsonProperty("index_path")
                        String index_path,
                @JsonProperty("rowkey_stats")
                        List<Object[]> rowkey_stats) {
            this.uuid = uuid;
            this.name = name;
            this.storage_location_identifier = storage_location_identifier;
            this.date_range_start = date_range_start;
            this.date_range_end = date_range_end;
            this.source_offset_start = source_offset_start;
            this.source_offset_end = source_offset_end;
            this.status = status;
            this.size_kb = size_kb;
            this.input_records = input_records;
            this.input_records_size = input_records_size;
            this.last_build_time = last_build_time;
            this.last_build_job_id = last_build_job_id;
            this.create_time_utc = create_time_utc;
            this.cuboid_shard_nums = cuboid_shard_nums;
            this.total_shards = total_shards;
            this.blackout_cuboids = blackout_cuboids;
            this.binary_signature = binary_signature;
            this.dictionaries = dictionaries;
            this.snapshots = snapshots;
            this.index_path = index_path;
            this.rowkey_stats = rowkey_stats;
        }
    }

    @Override
    public int compareTo(Object o)
    {
        CubeDesc sdto = (CubeDesc)o;
        Long other_last_modified = sdto.last_modified;
        return other_last_modified.compareTo(this.last_modified);
    }

}
