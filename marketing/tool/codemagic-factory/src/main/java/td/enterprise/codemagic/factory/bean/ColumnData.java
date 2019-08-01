package td.enterprise.codemagic.factory.bean;

public class ColumnData {

    public static final String OPTION_REQUIRED = "required:true";
    public static final String OPTION_NUMBER_INSEX = "precision:2,groupSeparator:','";
    private String columnName;
    private String dataName;
    private String upperDataName;
    
    private String dataType;
    private String shortDataType;
    private String jsDataType;
    private String columnComment;
    private String columnType;
    private String charmaxLength;
    private String nullable;
    private String scale;
    private String precision;
    private String classType;
    private String optionType;
    private String columnKey;

    private ViewData viewData;

    private LdapData ldapData;
    
    public ColumnData() {
        charmaxLength = "";
        classType = "";
        optionType = "";
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getDataName() {
        return dataName;
    }

    public void setDataName(String dataName) {
        this.dataName = dataName;
    }

    public String getUpperDataName() {
        return upperDataName;
    }

    public void setUpperDataName(String upperDataName) {
        this.upperDataName = upperDataName;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getShortDataType() {
        return shortDataType;
    }

    public void setShortDataType(String shortDataType) {
        this.shortDataType = shortDataType;
    }
    
    public String getJsDataType() {
        return jsDataType;
    }

    public void setJsDataType(String jsDataType) {
        this.jsDataType = jsDataType;
    }

    public String getColumnComment() {
        return columnComment;
    }

    public void setColumnComment(String columnComment) {
        this.columnComment = columnComment;
    }

    public String getScale() {
        return scale;
    }

    public String getPrecision() {
        return precision;
    }

    public void setScale(String scale) {
        this.scale = scale;
    }

    public void setPrecision(String precision) {
        this.precision = precision;
    }

    public String getClassType() {
        return classType;
    }

    public String getOptionType() {
        return optionType;
    }

    public String getCharmaxLength() {
        return charmaxLength;
    }

    public String getNullable() {
        return nullable;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    public void setOptionType(String optionType) {
        this.optionType = optionType;
    }

    public void setCharmaxLength(String charmaxLength) {
        this.charmaxLength = charmaxLength;
    }

    public void setNullable(String nullable) {
        this.nullable = nullable;
    }

    public String getColumnType() {
        return columnType;
    }

    public void setColumnType(String columnType) {
        this.columnType = columnType;
    }

    public ViewData getViewData() {
        return viewData;
    }

    public void setViewData(ViewData viewData) {
        this.viewData = viewData;
    }

    public LdapData getLdapData() {
        return ldapData;
    }

    public void setLdapData(LdapData ldapData) {
        this.ldapData = ldapData;
    }

    public String getColumnKey() {
        return columnKey;
    }

    public void setColumnKey(String columnKey) {
        this.columnKey = columnKey;
    }

}
