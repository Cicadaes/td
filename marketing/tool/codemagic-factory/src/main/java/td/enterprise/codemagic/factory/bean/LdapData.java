package td.enterprise.codemagic.factory.bean;

public class LdapData {

    private boolean isDnAttribute = false;
    
    private String value;
    
    private boolean isTransient = false;
    
    private String index;

    private boolean isMemberOf = false;
    
    public boolean isDnAttribute() {
        return isDnAttribute;
    }

    public void setDnAttribute(boolean isDnAttribute) {
        this.isDnAttribute = isDnAttribute;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean isTransient() {
        return isTransient;
    }

    public void setTransient(boolean isTransient) {
        this.isTransient = isTransient;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public boolean isMemberOf() {
        return isMemberOf;
    }

    public void setMemberOf(boolean isMemberOf) {
        this.isMemberOf = isMemberOf;
    }

}
