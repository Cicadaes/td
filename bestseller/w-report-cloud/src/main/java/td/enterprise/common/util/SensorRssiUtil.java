package td.enterprise.common.util;

import java.text.DecimalFormat;


public class SensorRssiUtil {
    private static final String decimalFormatStr = "#.#";

    public static String distance2Rssi(Double distance) {
        Double value = Math.log10(distance) * 26 + 43;
        return String.valueOf("-" + value.intValue());
    }

    public static Double rssi2Distance(String rssi) {
        DecimalFormat decimalFormat = new DecimalFormat(decimalFormatStr);
        Double value = Math.pow(10, (Math.abs(Integer.valueOf(rssi)) - 43.0) / 26);
        String valueStr = decimalFormat.format(value);
        return Double.valueOf(valueStr);

    }
}
