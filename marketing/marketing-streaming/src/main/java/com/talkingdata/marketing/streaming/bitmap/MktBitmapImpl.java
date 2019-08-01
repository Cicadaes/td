package com.talkingdata.marketing.streaming.bitmap;

import com.tenddata.bitmap.AbstractBitmap;
import com.tenddata.bitmap.Bitmap;
import it.uniroma3.mat.extendedset.rev157.intset.ConciseSet;
import it.uniroma3.mat.extendedset.rev157.intset.FastSet;
import it.uniroma3.mat.extendedset.rev157.intset.IntSet;

import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;
import java.util.Iterator;

/**
 * MKT BitMap
 * @create 2017-08-31-下午4:22
 * @since JDK 1.8
 * @author hongsheng
 */
public class MktBitmapImpl extends AbstractBitmap {

    FastSet impl;

    public MktBitmapImpl() {
        this.impl = new FastSet();
    }

    public MktBitmapImpl(FastSet set) {
        this.impl = set;
    }

    /**
     * Returns the index of the occurrence of the specified element
     * in this bitmap, or -1 if this bitmap does not contain the element.
     * @param offset
     * @return true if this list contains the specified element
     */
    public int indexOf(int offset) {
        return impl.indexOf(offset);
    }

    /**
     * Returns true if this bitmap contains the specified element.
     *
     * @param offset element whose presence in this bitmap is to be tested
     * @return true if this list contains the specified element
     */
    public boolean contains(int offset) {
        return impl.contains(offset);
    }

    /**
     * Returns the element at the specified position in this bitmap.
     *
     * @param index index of the element to return
     * @return the element at the specified position in this bitmap
     * @throws java.util.NoSuchElementException
     */
    public int get(int index) {
        return impl.get(index);
    }

    @Override
    public int cardinary() {
        return impl.size();
    }

    @Override
    public Bitmap and(Bitmap bitmap) {
        if (bitmap == null) {
            return null;
        }
        MktBitmapImpl other = checkCompatible(bitmap);
        MktBitmapImpl ret = new MktBitmapImpl(
                impl.intersection(other.impl));

        ret.consolidateTags(bitmap, this);
        return ret;
    }

    @Override
    public Bitmap or(Bitmap bitmap) {
        if (bitmap == null) {
            return this;
        }
        MktBitmapImpl other = checkCompatible(bitmap);
        MktBitmapImpl ret = new MktBitmapImpl(impl.union(other.impl));

        ret.consolidateTags(bitmap, this);
        return ret;
    }

    @Override
    public Bitmap andNot(Bitmap bitmap) {
        if (bitmap == null) {
            return this;
        }
        MktBitmapImpl other = checkCompatible(bitmap);
        MktBitmapImpl ret = new MktBitmapImpl(
                impl.difference(other.impl));

        ret.consolidateTags(bitmap, this);
        return ret;
    }

    @Override
    public boolean set(int i) {
        return impl.add(i);
    }

    @Override
    public boolean supportIndexZero() {
        return true;
    }

    @Override
    public int[] toArray() {
        return impl.toArray();
    }

    @Override
    public Iterator<Integer> offsetIterator() {
        final IntSet.IntIterator intIterator = impl.iterator();
        return new Iterator<Integer>() {

            @Override
            public boolean hasNext() {
                return intIterator.hasNext();
            }

            @Override
            public Integer next() {
                return intIterator.next();
            }

            @Override
            public void remove() {
                intIterator.remove();
            }
        };
    }

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(impl);
        out.writeObject(properties);
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        this.impl = (FastSet) in.readObject();
    }

    private MktBitmapImpl checkCompatible(Bitmap in) {
        if (in instanceof MktBitmapImpl) {
            return (MktBitmapImpl) in;
        } else {
            throw new RuntimeException("input bitmap not compatible, require "
                    + this.getClass() + ", but this is a " + in.getClass());
        }
    }

    private void consolidateTags(Bitmap a, Bitmap b) {
        consolidateTag(a);
        consolidateTag(b);
    }

    public static void main(String[] args) {
        ConciseSet mutableSet = new ConciseSet();
        int[] vals = {1, 2, 4, 291, 27412, 49120, 212312, 2412101};
        MktBitmapImpl mktBitmap = new MktBitmapImpl();

    }
}
