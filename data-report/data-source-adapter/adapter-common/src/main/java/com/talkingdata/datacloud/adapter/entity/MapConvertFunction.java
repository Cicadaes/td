package com.talkingdata.datacloud.adapter.entity;

import java.util.Map;

/**
 * Created by yangruobin on 2017/11/28.
 */
public class MapConvertFunction extends ConvertInterface<Map>{
    @Override
    public Object convertValue(Object value) {
        return getConvertFunction().get(value.toString());
    }

    @Override
    public boolean isConvert(Object value) {
        return getConvertFunction().containsKey(value.toString());
    }
}
