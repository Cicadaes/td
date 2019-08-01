package com.test;

import com.google.common.hash.Funnel;
import com.google.common.hash.PrimitiveSink;

public enum StringFunnel implements Funnel<String> {
    FUNNEL;
    public void funnel(String from, PrimitiveSink into) {
        into.putString(from);
    }

}
