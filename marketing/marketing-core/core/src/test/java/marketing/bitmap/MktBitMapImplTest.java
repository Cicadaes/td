package marketing.bitmap;

import com.talkingdata.marketing.core.bitmap.MktBitmapImpl;
import it.uniroma3.mat.extendedset.rev157.intset.FastSet;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * MktBitMap Test
 * @create 2017-08-31-下午5:19
 * @since JDK 1.8
 */
public class MktBitMapImplTest {

    FastSet mutableSet = new FastSet();
    List<Integer> n = new ArrayList<>();
    MktBitmapImpl mktBitmap = new MktBitmapImpl(mutableSet);

    @Before
    public void init() {
       int[] vals = {12, 33, 111, 444, 3, 33333, 222};
        for (int val : vals) {
            mutableSet.add(val);
        }
        System.out.println(mutableSet);
    }

    @Test
    public void indexOfTest() {
        System.out.println(mktBitmap.indexOf(1));
        System.out.println(mktBitmap.indexOf(222));
    }

    @Test
    public void getTest() {
        System.out.println(mktBitmap.get(10));
        System.out.println(mktBitmap.get(2));
    }

    @Test
    public void containsTest() {
        System.out.println(mktBitmap.contains(444));
        System.out.println(mktBitmap.contains(20));
    }



//性能测试用
//    @Before
//    public void init() {
//        long s = System.currentTimeMillis();
//        for (int i = 0; i < 50000000; i++) {
//            int val = new Random().nextInt(100000000);
//            mutableSet.add(val);
//        }
//        long e = System.currentTimeMillis();
//        System.out.println("Before time is  " + (e - s));
//    }

    @Test
    public void limitTest() {
        long s = System.currentTimeMillis();
        for (int i = 0; i < 50000000; i++) {
            mktBitmap.contains(i);
        }
        long e = System.currentTimeMillis();
        System.out.println("run time is  " + (e - s));
    }
}
