package com.test;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import td.enterprise.wanalytics.processor.cache.CacheFactory;

import java.util.Date;

public class TestCache {
   public static void main(String []args) throws Exception {
	   Cache cache = CacheFactory.getProjectCache();
	   int count =200;
	   for(int i=0;i<count;i ++){
		      Person p = new Person();
			  p.setUid("lijunmin");
			  p.setName("t");
			  Element e = new Element("lijunmin" + (i + 1), p);
			  cache.put(e);
	   }
	   System.out.println("-------over----------" + new Date());
	   
	   MyThread thread = new MyThread();
	   Thread t1 = new Thread(thread,"一号窗口");
	   t1.start();
	   System.out.println("-----------------------over----------" + new Date());
   }
   
   
}
class MyThread implements Runnable{  
    private int ticket =10;  
    private String name;  
    public void run(){  
        for(int i =0;i<500;i++){  
            if(this.ticket>0){  
                
                try {
                	 Cache cache = CacheFactory.getProjectCache();
                	 System.out.println(Thread.currentThread().getName()+"卖票---->"+(this.ticket--) + " size=" +  cache.getSize());  
                	 int count = 200;  
                	 for(int j=0;j<count;j ++){
                		   Element e = cache.get("lijunmin" + (j +1));
                		   if(e != null){
                			   System.out.println("key =" + e.getKey() + " value=" +e.getValue());
                		   }
                	   }
					Thread.sleep(1000 * 10);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
            }  
        }  
    }  
}  
