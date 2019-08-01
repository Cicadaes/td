package com.test;


import com.google.common.hash.BloomFilter;

public class TestBloomFilter {

	public  static  void main(String [] args ) {
		String prefix = "dmp";
		String dateHour = "2017-06-06-18";
		String workerPort= "6701";
		String logPath = "/home/hadoop/wifianalytics-processor/logs";
		String fileName = String.format(logPath + "/" + prefix + ".%s-%s.log" , dateHour,workerPort);
		System.out.println("fileName=" + fileName);
	}
	
	public void testBloomFilter()  {
		BloomFilter<Person> bloomFilter = BloomFilter.create(PersonFunnel.FUNNEL, 10000,0.000001D);
		for(int i=0;i< 1000;i ++){
			Person p1  = new Person();
			p1.setUid("lijunmin" + i );
			bloomFilter.put(p1);
		}
		
		for(int i=0;i< 1000;i ++){
			Person p1  = new Person();
			p1.setUid("lijunmin" + i );
			boolean exist = bloomFilter.mightContain(p1);
			System.out.println(exist);
		}
		
		Person p  = new Person();
		p.setUid("lijunmin02" );
		boolean exist = bloomFilter.mightContain(p);
		System.out.println(exist);
	}

}
