package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube;

/**
 * The type Cube select model measure.
 * @author xiaoming.kang
 */
public class CubeSelectModelMeasure {
    private String tableId;
    private String tableCode;
    private String columnId;
    private String columnCode;
    private String columnName;
    private String type;
    private String constantVal;
    private String expression;

    /**
     * Gets table id.
     *
     * @return the table id
     */
    public String getTableId() {
        return tableId;
    }

    /**
     * Sets table id.
     *
     * @param tableId the table id
     */
    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    /**
     * Gets table code.
     *
     * @return the table code
     */
    public String getTableCode() {
        return tableCode;
    }

    /**
     * Sets table code.
     *
     * @param tableCode the table code
     */
    public void setTableCode(String tableCode) {
        this.tableCode = tableCode;
    }

    /**
     * Gets column id.
     *
     * @return the column id
     */
    public String getColumnId() {
        return columnId;
    }

    /**
     * Sets column id.
     *
     * @param columnId the column id
     */
    public void setColumnId(String columnId) {
        this.columnId = columnId;
    }

    /**
     * Gets column code.
     *
     * @return the column code
     */
    public String getColumnCode() {
        return columnCode;
    }

    /**
     * Sets column code.
     *
     * @param columnCode the column code
     */
    public void setColumnCode(String columnCode) {
        this.columnCode = columnCode;
    }

    /**
     * Gets column name.
     *
     * @return the column name
     */
    public String getColumnName() {
        return columnName;
    }

    /**
     * Sets column name.
     *
     * @param columnName the column name
     */
    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    /**
     * Gets type.
     *
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * Sets type.
     *
     * @param type the type
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * Gets constant val.
     *
     * @return the constant val
     */
    public String getConstantVal() {
        return constantVal;
    }

    /**
     * Sets constant val.
     *
     * @param constantVal the constant val
     */
    public void setConstantVal(String constantVal) {
        this.constantVal = constantVal;
    }

    /**
     * Gets expression.
     *
     * @return the expression
     */
    public String getExpression() {
        return expression;
    }

    /**
     * Sets expression.
     *
     * @param expression the expression
     */
    public void setExpression(String expression) {
        this.expression = expression;
    }
}