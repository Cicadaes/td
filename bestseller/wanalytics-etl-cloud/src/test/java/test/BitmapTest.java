package test;

import it.uniroma3.mat.extendedset.rev157.intset.ConciseSet;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.impl.ConciseBitmapImpl;

/**
 * 测试bitmap 逐个设置和整体设置性能对比
 * @author junmin.li
 *
 */
public class BitmapTest {

	public static void main(String[] args) {
		test2();
	}
	
	/**
	 * 测试两个bitmap 生成方式
	 */
	public static void test1(){
	    int c = 10000000;
        Set<Integer> set = new HashSet<Integer>();
        int len = 10000;
        for(int i=0;i<len;i ++){
        	int t0 = (int) ( Math.random() * c) + 1 ;
        	set.add(t0);
        }
        System.out.println("========size=" + set.size());
        Bitmap b1 = new ConciseBitmapImpl();
        Bitmap b2 = new ConciseBitmapImpl();
        long t0 = System.currentTimeMillis();
        Iterator<Integer> iter=  set.iterator();
        while(iter.hasNext()){
        	b1.set(iter.next());
        }
        long t1 = System.currentTimeMillis();
        b2 = new ConciseBitmapImpl(new ConciseSet ().convert(set));
        long t2 = System.currentTimeMillis();
        
        System.out.println("==========a0===" +  (t1-t0) + "===========length===" + b1.cardinary());
        System.out.println("==========a1===" +  (t2-t1) + "===========length===" + + b2.cardinary());
	}
	
	/**
	 * 测试两个通过运算生成bitmap 方式
	 */
	public static void test2(){
		//生成随机bitmap
		Bitmap dest = get(10000);
		
	    int c = 10000000;
        Set<Integer> set = new HashSet<Integer>();
        int len = 1000;
        for(int i=0;i<len;i ++){
        	int t0 = (int) ( Math.random() * c) + 1 ;
        	set.add(t0);
        }
        Bitmap b1 = new ConciseBitmapImpl();
        Bitmap b2 = new ConciseBitmapImpl();
        System.out.println("========size=" + set.size());
        //两个结果bitmap ，大小应该一致
        b1 = b1.or(dest);
        long t0 = System.currentTimeMillis();
        Iterator<Integer> iter=  set.iterator();
        while(iter.hasNext()){
        	b1.set(iter.next());
        }
        long t1 = System.currentTimeMillis();
        b2 = new ConciseBitmapImpl(new ConciseSet ().convert(set));
        b2 = b2.or(dest);
        long t2 = System.currentTimeMillis();
        
        System.out.println("==========a0===" +  (t1-t0) + "===========length===" + b1.cardinary());
        System.out.println("==========a1===" +  (t2-t1) + "===========length===" + + b2.cardinary());
	}
	
	/**
	 * 生成bitmap
	 * @param c
	 * @return
	 */
	public static Bitmap get(int c){
		 Bitmap b1 = null;
		 Set<Integer> set = new HashSet<Integer>();
         for(int i=0;i<c;i ++){
        	int t0 = (int) ( Math.random() * c) + 1 ;
        	set.add(t0);
         }
         b1 = new ConciseBitmapImpl(new ConciseSet ().convert(set));
         return b1;
	}

}
