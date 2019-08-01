package com.tenddata.bitmap;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public abstract class AbstractBitmap implements Bitmap {
	private static final long serialVersionUID = 1301081629683638667L;
			
	protected Map<String, String> properties = new HashMap<String, String>();
	
	@Override
	public void setTag(String tag, String value) {
		properties.put(tag, value);
	}

	@Override
	public String getTag(String tag) {
		return properties.get(tag);
	}

	@Override
	public Set<String> getTags() {
		return properties.keySet();
	}

	
	protected void consolidateTag(Bitmap a){
		for(String t : a.getTags()){
			setTag(t, a.getTag(t));
		}
	}
}
