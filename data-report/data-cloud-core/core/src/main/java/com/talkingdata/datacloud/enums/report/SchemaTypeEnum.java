package com.talkingdata.datacloud.enums.report;

import org.apache.commons.collections.map.CaseInsensitiveMap;

/**
 * Created by yashiro on 17/2/14.
 */
public enum SchemaTypeEnum {

    Table,
    View,
    Avro,
    ORC,
    RC,
    Sequence,
    Flat_File, // Flat File
    JSON,
    XML,
    Thrift,
    Parquet,
    Protobuff,
    CSV;

    private static final CaseInsensitiveMap lookup = new CaseInsensitiveMap();

    static {
        for (SchemaTypeEnum e : values()) {
            lookup.put(e.name(), e);
        }
    }

    public static SchemaTypeEnum forName(String status) {
        return (SchemaTypeEnum) lookup.get(status);
    }

    public static boolean contain(String status) {
        return forName(status) != null;
    }

}
