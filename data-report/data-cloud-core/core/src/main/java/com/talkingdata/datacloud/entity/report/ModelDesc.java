package com.talkingdata.datacloud.entity.report;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Created by yashiro on 17/2/23.
 */
public class ModelDesc implements Comparable{

    public String uuid;

    public Long last_modified;

    public String version;

    public String name;

    public String owner;

    public String description;

    public String fact_table;

    public List<Lookups> lookups;

    public List<Dimension> dimensions;

    public List<String> metrics;

    public String filter_condition;

    public PartitionDesc partition_desc;

    public String capacity;

    public ModelDesc(String name) {
        this.name = name;
    }

    @JsonCreator
    public ModelDesc(
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
            @JsonProperty("description")
                    String description,
            @JsonProperty("fact_table")
                    String fact_table,
            @JsonProperty("lookups")
                    List<Lookups> lookups,
            @JsonProperty("dimensions")
                    List<Dimension> dimensions,
            @JsonProperty("metrics")
                    List<String> metrics,
            @JsonProperty("filter_condition")
                    String filter_condition,
            @JsonProperty("partition_desc")
                    PartitionDesc partition_desc,
            @JsonProperty("capacity")
                    String capacity) {
        this.uuid = uuid;
        this.last_modified = last_modified;
        this.version = version;
        this.name = name;
        this.owner = owner;
        this.description = description;
        this.fact_table = fact_table;
        this.lookups = lookups;
        this.dimensions = dimensions;
        this.metrics = metrics;
        this.filter_condition = filter_condition;
        this.partition_desc = partition_desc;
        this.capacity = capacity;
    }

    public static class Lookups {

        public final String table;
        public final Join join;

        @JsonCreator
        public Lookups(
                @JsonProperty("table")
                        String table,
                @JsonProperty("join")
                        Join join) {
            this.table = table;
            this.join = join;
        }
    }

    public static class Join {

        public final String type;

        public final List<String> primary_key;

        public final List<String> foreign_key;

        @JsonCreator
        public Join(
                @JsonProperty("type")
                        String type,
                @JsonProperty("primary_key")
                        List<String> primary_key,
                @JsonProperty("foreign_key")
                        List<String> foreign_key) {
            this.type = type;
            this.primary_key = primary_key;
            this.foreign_key = foreign_key;
        }
    }

    public static class Dimension {

        public final String table;

        public final List<String> columns;

        @JsonCreator
        public Dimension(
                @JsonProperty("table")
                        String table,
                @JsonProperty("columns")
                        List<String> columns) {
            this.table = table;
            this.columns = columns;
        }
    }

    public static class PartitionDesc {

        public final String partition_date_column;

        public final String partition_time_column;

        public final Long partition_date_start;

        public final String partition_date_format;

        public final String partition_time_format;

        public final String partition_type;

        public final String partition_condition_builder;

        @JsonCreator
        public PartitionDesc(
                @JsonProperty("partition_date_column")
                        String partition_date_column,
                @JsonProperty("partition_time_column")
                        String partition_time_column,
                @JsonProperty("partition_date_start")
                        Long partition_date_start,
                @JsonProperty("partition_date_format")
                        String partition_date_format,
                @JsonProperty("partition_time_format")
                        String partition_time_format,
                @JsonProperty("partition_type")
                        String partition_type,
                @JsonProperty("partition_condition_builder")
                        String partition_condition_builder) {
            this.partition_date_column = partition_date_column;
            this.partition_time_column = partition_time_column;
            this.partition_date_start = partition_date_start;
            this.partition_date_format = partition_date_format;
            this.partition_time_format = partition_time_format;
            this.partition_type = partition_type;
            this.partition_condition_builder = partition_condition_builder;
        }
    }

    @Override
    public int compareTo(Object o)
    {
        ModelDesc sdto = (ModelDesc)o;
        Long other_last_modified = sdto.last_modified;
        return other_last_modified.compareTo(this.last_modified);
    }

}
