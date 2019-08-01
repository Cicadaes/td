package com.talkingdata.datacloud.entity;

//import com.google.common.base.Objects;

import java.io.Externalizable;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;
import java.util.List;
import java.util.Map;

/**
 * Created by henry on 14-12-12.
 */
public class Criteria implements Externalizable {

    private String domain;
    private String table;
    private List<String> cols;
    private Map<String, Object> vals;
    private StringBuffer where;

    public Criteria(String domain, String table) {
        this.domain = domain;
        this.table = table;
    }

    /**
     * 获取Criteria实例
     *
     * @param table
     * @return
     */
    public static Criteria instance(String domain, String table) {
        return new Criteria(domain, table);
    }

    /**
     * 查询列表中字段
     *
     * @param cols
     * @return
     */
    public Criteria select(List<String> cols) {
        this.setCols(cols);
        return this;
    }

    /**
     * 启用where条件查询
     *
     * @param col
     *            初始过滤字段
     * @return
     */
    public Criteria where(String params) {
        this.where = new StringBuffer(" where " + params + "");
        return this;
    }

    // getter and setter
    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public List<String> getCols() {
        return cols;
    }

    public void setCols(List<String> cols) {
        this.cols = cols;
    }

    public Map<String, Object> getVals() {
        return vals;
    }

    public void setVals(Map<String, Object> vals) {
        this.vals = vals;
    }

    public StringBuffer getWhere() {
        return where;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

//    public String toString() {
//        return Objects.toStringHelper(this).add("domain", domain)
//                .add("table", table).add("cols", cols).add("vals", vals)
//                .add("where", where).toString();
//    }

    @Override
   	public String toString() {
   		return "Criteria{domain=" + domain + ", table=" + table + ", cols=" + cols + ", vals=" + vals + ", where="
   				+ where + "}";
   	}
    
    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeUTF(domain);
        out.writeUTF(table);
        out.writeObject(cols);
        out.writeObject(vals);
        out.writeUTF(where.toString());
    }

   

	@Override
    public void readExternal(ObjectInput in) throws IOException,
            ClassNotFoundException {
        this.domain = in.readUTF();
        this.table = in.readUTF();
        this.cols = (List<String>) in.readObject();
        this.vals = (Map<String, Object>) in.readObject();
        this.where = new StringBuffer(in.readUTF());
    }
}
