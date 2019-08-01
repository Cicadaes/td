package com.talkingdata.datacloud.adapter.entity;

/**
 * Created by yangruobin on 2017/11/28.
 */
public abstract class ConvertInterface <T>{
    public T convertFunction;
    public abstract <K,V> V convertValue(K value);
    public abstract <K> boolean isConvert(K value);

    public T getConvertFunction() {
        return convertFunction;
    }

    public void setConvertFunction(T convertFunction) {
        this.convertFunction = convertFunction;
    }
}
