package com.tenddata.bitmap;
import java.io.Externalizable;
import java.util.Set;


public interface Bitmap extends Externalizable{
	int cardinary();
	Bitmap and(Bitmap b);
	Bitmap or(Bitmap b);
	Bitmap andNot(Bitmap b);
	
	boolean set(int pos);
	
	boolean supportIndexZero();
	
	int[] toArray();
	
	void setTag(String tag, String value);
	String getTag(String tag);
	Set<String> getTags();
	
}
