package com.talkingdata.datacloud.adapter.entity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

/**
 * Created by yangruobin on 2017/11/28.
 */
public class DateConvertFunction extends ConvertInterface<Map<String,String>>{
    private SimpleDateFormat currentDateFormat;
    private SimpleDateFormat toDateDateFormat;
    @Override
    public Object convertValue(Object value){
        Date date;
        try {
            date = currentDateFormat.parse(value.toString());
            return toDateDateFormat.format(date);
        } catch (NullPointerException e) {
            e.printStackTrace();
        }catch (ParseException e) {
            e.printStackTrace();
        }
        return value;
    }

    @Override
    public boolean isConvert(Object value) {
        return true;
    }

    @Override
    public void setConvertFunction(Map<String,String> convertFunction) {
        for(String key:convertFunction.keySet()){
            String value=convertFunction.get(key);
            currentDateFormat  = new SimpleDateFormat(key);
            toDateDateFormat = new SimpleDateFormat(value);
        }
    }
}
