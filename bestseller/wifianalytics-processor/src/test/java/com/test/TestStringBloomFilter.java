package com.test;


import com.google.common.hash.BloomFilter;

public class TestStringBloomFilter {

	public static void main(String[] args) {
            new TestStringBloomFilter().testBloomFilter();
            System.out.println("----------over in the main--------------");
	}
	
	public void testBloomFilter()  {
		BloomFilter<String> bloomFilter = BloomFilter.create(StringFunnel.FUNNEL, 10000,0.000001D);
		for(int i=0;i< 1000;i ++){
			bloomFilter.put("lijunmin" + i);
		}
		
		for(int i=0;i< 1000;i ++){
			boolean exist = bloomFilter.mightContain("lijunmin" + i);
			System.out.println(exist);
		}
		boolean exist = bloomFilter.mightContain("lijunmin02");
		System.out.println(exist);
	}

}
