package td.enterprise.web.vm;

public enum MetaDataType {
    BRAND(1, "BRAND");

    private int code;
    private String value;

    MetaDataType(int code, String value) {
        this.code = code;
        this.value = value;
    }

    public String toString() {
        return value;
    }

    public static MetaDataType getEnum(String value) {
        for (MetaDataType v : values())
            if (v.toString().equalsIgnoreCase(value)) return v;
        throw new IllegalArgumentException();
    }

}
