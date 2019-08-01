package td.enterprise.web.vm;

/**
 * 排序枚举类
 */
public enum OrderEnum {
    ASC(1),DESC(2);
    OrderEnum(int value) {
        this.value = value;
    }

    private int value;

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
