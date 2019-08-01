package com.test;


import com.google.common.base.Charsets;
import com.google.common.hash.Funnel;
import com.google.common.hash.PrimitiveSink;

public enum PersonFunnel implements Funnel<Person> {
    FUNNEL;
    public void funnel(Person from, PrimitiveSink into) {
        into.putBytes(from.getUid().getBytes(Charsets.UTF_8)).putString(from.getUid());
    }

}
