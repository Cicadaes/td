package td.enterprise.wanalytics.etl.util;

import java.util.ArrayList;
import java.util.List;

public class HttpErrorCode {
    public static final int SQL_EXCEPTION = 420;
    public static final int CONSTRANT_EXCEPTION = 421;
    public static final int NULL_EXCEPTION = 422;
    public static final int CUSTOME_EXCEPTION = 423;
    public static List <Integer> codes = new ArrayList();

    static {
        Class var0 = HttpErrorCode.class;
        synchronized (HttpErrorCode.class) {
            codes.add(Integer.valueOf(420));
            codes.add(Integer.valueOf(421));
            codes.add(Integer.valueOf(422));
            codes.add(Integer.valueOf(423));
        }
    }

    public HttpErrorCode() {
    }
}
