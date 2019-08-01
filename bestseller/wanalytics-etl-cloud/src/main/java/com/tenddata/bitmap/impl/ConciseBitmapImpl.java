package com.tenddata.bitmap.impl;

import it.uniroma3.mat.extendedset.rev157.intset.ConciseSet;

import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;

import com.tenddata.bitmap.AbstractBitmap;
import com.tenddata.bitmap.Bitmap;



public class ConciseBitmapImpl extends AbstractBitmap {
	private static final long serialVersionUID = 1776706179230956906L;

	ConciseSet impl;

	public ConciseBitmapImpl() {
		impl = new ConciseSet();
	}

	public ConciseBitmapImpl(ConciseSet set) {
		impl = set;
	}

	@Override
	public void writeExternal(ObjectOutput out) throws IOException {
		out.writeObject(impl);
		out.writeObject(properties);
	}

	@Override
	public void readExternal(ObjectInput in) throws IOException,
			ClassNotFoundException {
		this.impl = (ConciseSet) in.readObject();
//		this.properties = (Map<String, String>) in.readObject(); //库里不是这个样子滴,暂时注释
	}

	@Override
	public int cardinary() {
		return impl.size();
	}

	@Override
	public Bitmap and(Bitmap b) {
		if (b == null) {
			return null;
		}
		ConciseBitmapImpl other = checkCompatible(b);
		ConciseBitmapImpl ret = new ConciseBitmapImpl(
				impl.intersection(other.impl));

		ret.consolidateTags(b, this);
		return ret;
	}

	@Override
	public Bitmap or(Bitmap b) {
		if (b == null) {
			return this;
		}
		ConciseBitmapImpl other = checkCompatible(b);
		ConciseBitmapImpl ret = new ConciseBitmapImpl(impl.union(other.impl));

		ret.consolidateTags(b, this);
		return ret;
	}

	@Override
	public Bitmap andNot(Bitmap b) {
		if (b == null) {
			return this;
		}
		ConciseBitmapImpl other = checkCompatible(b);
		ConciseBitmapImpl ret = new ConciseBitmapImpl(
				impl.difference(other.impl));

		ret.consolidateTags(b, this);
		return ret;
	}

	@Override
	public boolean set(int pos) {
		return impl.add(pos);
	}

	@Override
	public boolean supportIndexZero() {
		return true;
	}

	@Override
	public int[] toArray() {
		return impl.toArray();
	}

	private ConciseBitmapImpl checkCompatible(Bitmap in) {
		if (in instanceof ConciseBitmapImpl) {
			return (ConciseBitmapImpl) in;
		} else {
			throw new RuntimeException("input bitmap not compatible, require "
					+ this.getClass() + ", but this is a " + in.getClass());
		}
	}

	private void consolidateTags(Bitmap a, Bitmap b) {
		consolidateTag(a);
		consolidateTag(b);
	}
}
