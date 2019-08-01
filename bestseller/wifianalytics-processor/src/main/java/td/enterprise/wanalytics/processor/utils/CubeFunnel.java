package td.enterprise.wanalytics.processor.utils;

import com.google.common.hash.Funnel;
import com.google.common.hash.PrimitiveSink;
import org.apache.storm.tuple.Values;


public enum CubeFunnel implements Funnel<Values>{
	FUNNEL;
	@Override
	public void funnel(Values from, PrimitiveSink into) {
		String key = "";
		for(Object t : from){
			key += "_" + t;
		}
		into.putString(key);
	}
}
