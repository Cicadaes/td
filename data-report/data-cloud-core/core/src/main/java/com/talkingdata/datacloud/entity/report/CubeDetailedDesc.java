package com.talkingdata.datacloud.entity.report;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能:</b><br>
 * <b>作者:</b> yashiro <br>
 * <b>日期:</b> 17/3/2 <br>
 */
public class CubeDetailedDesc {

    public String uuid;

    public Long last_modified;

    public String version;

    public String name;

    public String model_name;

    public String description;

    public String null_string;

    public List<Dimension> dimensions;

    public List<Measure> measures;

    public List<Dictionary> dictionaries;

    public Rowkey rowkey;

    public HbaseMapping hbase_mapping;

    public List<AggregationGroups> aggregation_groups;

    public String signature;

    public List<String> notify_list;

    public List<String> status_need_notify;

    public Long partition_date_start;

    public Long partition_date_end;

    public List<Long> auto_merge_time_ranges;

    public Long retention_range;

    public Long engine_type;

    public Long storage_type;

    public Map<String, String> override_kylin_properties;

    @JsonCreator
    public CubeDetailedDesc(
            @JsonProperty("uuid")
                    String uuid,
            @JsonProperty("last_modified")
                    Long last_modified,
            @JsonProperty("version")
                    String version,
            @JsonProperty("name")
                    String name,
            @JsonProperty("model_name")
                    String model_name,
            @JsonProperty("description")
                    String description,
            @JsonProperty("null_string")
                    String null_string,
            @JsonProperty("dimensions")
                    List<Dimension> dimensions,
            @JsonProperty("measures")
                    List<Measure> measures,
            @JsonProperty("dictionaries")
                    List<Dictionary> dictionaries,
            @JsonProperty("rowkey")
                    Rowkey rowkey,
            @JsonProperty("hbase_mapping")
                    HbaseMapping hbase_mapping,
            @JsonProperty("aggregation_groups")
                    List<AggregationGroups> aggregation_groups,
            @JsonProperty("signature")
                    String signature,
            @JsonProperty("notify_list")
                    List<String> notify_list,
            @JsonProperty("status_need_notify")
                    List<String> status_need_notify,
            @JsonProperty("partition_date_start")
                    Long partition_date_start,
            @JsonProperty("partition_date_end")
                    Long partition_date_end,
            @JsonProperty("auto_merge_time_ranges")
                    List<Long> auto_merge_time_ranges,
            @JsonProperty("retention_range")
                    Long retention_range,
            @JsonProperty("engine_type")
                    Long engine_type,
            @JsonProperty("storage_type")
                    Long storage_type,
            @JsonProperty("override_kylin_properties")
                    Map<String, String> override_kylin_properties) {
        this.uuid = uuid;
        this.last_modified = last_modified;
        this.version = version;
        this.name = name;
        this.model_name = model_name;
        this.description = description;
        this.null_string = null_string;
        this.dimensions = dimensions;
        this.measures = measures;
        this.dictionaries = dictionaries;
        this.rowkey = rowkey;
        this.hbase_mapping = hbase_mapping;
        this.aggregation_groups = aggregation_groups;
        this.signature = signature;
        this.notify_list = notify_list;
        this.status_need_notify = status_need_notify;
        this.partition_date_start = partition_date_start;
        this.partition_date_end = partition_date_end;
        this.auto_merge_time_ranges = auto_merge_time_ranges;
        this.retention_range = retention_range;
        this.engine_type = engine_type;
        this.storage_type = storage_type;
        this.override_kylin_properties = override_kylin_properties;
    }

    public static class Dimension {
        public final String name;

        public final String table;

        public final String column;

        public final String[] derived;

        @JsonCreator
        public Dimension(
                @JsonProperty("name")
                        String name,
                @JsonProperty("table")
                        String table,
                @JsonProperty("column")
                        String column,
                @JsonProperty("derived")
                        String[] derived) {
            this.name = name;
            this.table = table;
            this.column = column;
            this.derived = derived;
        }
    }

    public static class Measure {

        public final String name;

        public final Function function;

        public final String dependent_measure_ref;

        @JsonCreator
        public Measure(
                @JsonProperty("name")
                        String name,
                @JsonProperty("function")
                        Function function,
                @JsonProperty("dependent_measure_ref")
                        String dependent_measure_ref) {
            this.name = name;
            this.function = function;
            this.dependent_measure_ref = dependent_measure_ref;
        }
    }

    public static class Function {
        public final String expression;

        public final Parameter parameter;

        public final String returntype;

        @JsonCreator
        public Function(
                @JsonProperty("expression")
                        String expression,
                @JsonProperty("parameter")
                        Parameter parameter,
                @JsonProperty("returntype")
                        String returntype) {
            this.expression = expression;
            this.parameter = parameter;
            this.returntype = returntype;
        }
    }

    public static class Parameter {
        public final String type;

        public final String value;

        public final Parameter next_parameter;

        @JsonCreator
        public Parameter(
                @JsonProperty("type")
                        String type,
                @JsonProperty("value")
                        String value,
                @JsonProperty("next_parameter")
                        Parameter next_parameter) {
            this.type = type;
            this.value = value;
            this.next_parameter = next_parameter;
        }
    }

    public static class Dictionary {
        public final String column;

        public final String reuse;

        public final String builder;

        @JsonCreator
        public Dictionary(
                @JsonProperty("column")
                        String column,
                @JsonProperty("reuse")
                        String reuse,
                @JsonProperty("builder")
                        String builder) {
            this.column = column;
            this.reuse = reuse;
            this.builder = builder;
        }
    }

    public static class Rowkey {
        public final List<RowkeyColumn> rowkey_columns;

        @JsonCreator
        public Rowkey(
                @JsonProperty("rowkey_columns")
                        List<RowkeyColumn> rowkey_columns) {
            this.rowkey_columns = rowkey_columns;
        }
    }

    public static class RowkeyColumn {
        public final String column;

        public final String encoding;

        public final boolean isShardBy;

        @JsonCreator
        public RowkeyColumn(
                @JsonProperty("column")
                        String column,
                @JsonProperty("encoding")
                        String encoding,
                @JsonProperty("isShardBy")
                        boolean isShardBy) {
            this.column = column;
            this.encoding = encoding;
            this.isShardBy = isShardBy;
        }
    }

    public static class HbaseMapping {
        public final List<ColumnFamily> column_family;

        @JsonCreator
        public HbaseMapping(
                @JsonProperty("column_family")
                        List<ColumnFamily> column_family) {
            this.column_family = column_family;
        }
    }

    public static class ColumnFamily {
        public final String name;

        public final List<Column> columns;

        @JsonCreator
        public ColumnFamily(
                @JsonProperty("name")
                        String name,
                @JsonProperty("columns")
                        List<Column> columns) {
            this.name = name;
            this.columns = columns;
        }
    }

    public static class Column {
        public final String qualifier;

        public final List<String> measure_refs;

        @JsonCreator
        public Column(
                @JsonProperty("qualifier")
                        String qualifier,
                @JsonProperty("measure_refs")
                        List<String> measure_refs) {
            this.qualifier = qualifier;
            this.measure_refs = measure_refs;
        }
    }

    public static class AggregationGroups {
        public final String[] includes;

        public final SelectRule select_rule;

        @JsonCreator
        public AggregationGroups(
                @JsonProperty("includes")
                        String[] includes,
                @JsonProperty("select_rule")
                        SelectRule select_rule) {
            this.includes = includes;
            this.select_rule = select_rule;
        }
    }

    public static class SelectRule {
        public final String[][] hierarchy_dims;

        public final String[] mandatory_dims;

        public final String[][] joint_dims;

        @JsonCreator
        public SelectRule(
                @JsonProperty("hierarchy_dims")
                        String[][] hierarchy_dims,
                @JsonProperty("mandatory_dims")
                        String[] mandatory_dims,
                @JsonProperty("joint_dims")
                        String[][] joint_dims) {
            this.hierarchy_dims = hierarchy_dims;
            this.mandatory_dims = mandatory_dims;
            this.joint_dims = joint_dims;
        }
    }

}
