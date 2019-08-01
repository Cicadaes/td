package td.enterprise.codemagic.factory.bean;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;

import org.apache.commons.lang.StringUtils;

import td.enterprise.codemagic.factory.def.CodeResourceUtil;
import td.enterprise.codemagic.factory.def.TableConvert;

public class LdapCreateBean {

    private String url;
    private String username;
    private String password;
    private String schemaName;
    private String method;
    private String argv;

    static DirContext dirContext;

    List<String> excludeList = new ArrayList<String>();
    {
        excludeList.add("cn");
    }

    public LdapCreateBean() {

    }

    public void setLdapInfo(String url, String username, String password, String schemaName) {
        this.url = url;
        this.username = username;
        this.password = password;
        this.schemaName = schemaName;
    }

    public DirContext getConnection() throws NamingException {
        if (dirContext == null) {
            Hashtable<String, String> propertyHashtable = new Hashtable<String, String>();
            propertyHashtable.put("java.naming.factory.initial", "com.sun.jndi.ldap.LdapCtxFactory");
            propertyHashtable.put("java.naming.provider.url", url);
            propertyHashtable.put("java.naming.security.authentication", "simple");
            propertyHashtable.put("java.naming.security.principal", username);
            propertyHashtable.put("java.naming.security.credentials", password);
            dirContext = new InitialDirContext(propertyHashtable);
        }
        return dirContext;
    }

    public List<ColumnData> getColumnDatas(String tableName) throws Exception, NamingException {
        SearchControls sc = new SearchControls();
        sc.setSearchScope(SearchControls.SUBTREE_SCOPE);
        String dn = "ou=objectclasses,cn=" + schemaName + ",ou=schema";
        String filter = "m-name=" + tableName;
        NamingEnumeration<SearchResult> result = getConnection().search(dn, filter, sc);

        List<ColumnData> columnList = new ArrayList<ColumnData>();
        // ResultSet rs = null;// ps.executeQuery();
        StringBuffer str = new StringBuffer();
        StringBuffer getset = new StringBuffer();

        ColumnData cd;
        while (result.hasMore()) {
            SearchResult entry = result.next();
            Attributes attrs = entry.getAttributes();

            Attribute mMayAttr = attrs.get("m-may");
            int mMaySize = mMayAttr.size();

            for (int i = 0; i < mMaySize; i++) {
                String mMayName = (String) mMayAttr.get(i);
                cd = createColumnData(mMayName, true);
                columnList.add(cd);
            }

            Attribute mMustAttr = attrs.get("m-must");
            int mMustSize = mMustAttr.size();
            for (int i = 0; i < mMustSize; i++) {
                String mMustName = (String) mMustAttr.get(i);
                if (!excludeList.contains(mMustName)) {
                    cd = createColumnData(mMustName, false);
                    columnList.add(cd);
                }
            }
        }
        argv = str.toString();
        method = getset.toString();
        return columnList;
    }

    /**
     * 属性名
     * 
     * @param attributeName
     * @return
     * @throws Exception
     * @throws NamingException
     */
    private ColumnData createColumnData(String attributeName, boolean isNullAble)
            throws NamingException {
        Map<String, String> attributeMap = getLdapAttr(attributeName);
        if (attributeMap == null) {
            attributeMap = getAttribuateMap(attributeName);
        }

        String name = attributeMap.get("name");
        String type = attributeMap.get("syntax");
        String comment = attributeMap.get("description");
        String precision = "0";
        String scale = "0";
        String charmaxLength = "";
        String nullable = TableConvert.getNullAble(isNullAble ? "Y" : "N");
        type = getType(type, precision, scale);

        String[] strs = type.split("\\.");
        String shortType = strs[strs.length - 1];

        // 判断首字母是否大写 ，如果首先字母大写，则全部变小写
        String fc = name.substring(0, 1);
        if (fc.equals(fc.toUpperCase())) {
            name = name.toLowerCase();
        }
        String upperDataName = formateName(name);

        String dataName = upperDataName.substring(0, 1).toLowerCase() + upperDataName.substring(1, upperDataName.length());
        ColumnData cd = new ColumnData();
        cd.setColumnName(name);
        cd.setDataName(dataName);
        cd.setUpperDataName(upperDataName);
        cd.setDataType(type);
        cd.setShortDataType(shortType);
        cd.setJsDataType(convertToJsDataType(type));
        cd.setColumnType(type);
        cd.setColumnComment(comment);
        cd.setPrecision(precision);
        cd.setScale(scale);
        cd.setCharmaxLength(charmaxLength);
        cd.setNullable(nullable);
        formatAnnotation(cd);
        formatFieldClassType(cd);
        return cd;
    }

    private static String convertToJsDataType(String type) {
        switch (type) {
            case "java.lang.String":
                return "string";
            case "java.lang.Integer":
            case "java.lang.Long":
            case "java.lang.Float":
            case "java.lang.Double":
            case "java.math.BigDecimal":
                return "number";
            case "java.util.Date":
                return "Date";
            default:
                return "any";
        }
    }

    public Map<String, String> getAttribuateMap(String attrName) throws NamingException {
        Map<String, String> returnMap = new HashMap<String, String>();
        // 查询属性
        SearchControls sc = new SearchControls();
        sc.setSearchScope(SearchControls.SUBTREE_SCOPE);
        String dn = "ou=attributetypes,cn=" + schemaName + ",ou=schema";
        String filter = "m-name=" + attrName;
        NamingEnumeration<SearchResult> result = getConnection().search(dn, filter, sc);
        while (result.hasMore()) {
            SearchResult entry = result.next();
            Attributes attrs = entry.getAttributes();
            returnMap.put("description", String.valueOf(attrs.get("m-description") == null ? "" : attrs.get("m-description").get()));
            returnMap.put("syntax", String.valueOf(attrs.get("m-syntax") == null ? "" : attrs.get("m-syntax").get()));
            returnMap.put("name", String.valueOf(attrs.get("m-name").get()));
            returnMap.put("equality", String.valueOf(attrs.get("m-equality") == null ? "" : attrs.get("m-equality").get()));
            returnMap.put("singleValue", String.valueOf(attrs.get("m-singleValue") == null ? "" : attrs.get("m-singleValue").get()));
        }
        return returnMap;
    }

    public String getBeanFeilds(String tableName) throws Exception {
        List<ColumnData> dataList = getColumnDatas(tableName);
        StringBuffer str = new StringBuffer();
        StringBuffer getset = new StringBuffer();
        String name;
        for (Iterator<ColumnData> iterator = dataList.iterator(); iterator.hasNext(); getset.append((new StringBuilder("    this.")).append(name).append("=").toString()).append(name).append(";\r\t}")) {
            ColumnData cd = iterator.next();
            name = cd.getColumnName();
            String type = cd.getDataType();
            String comment = cd.getColumnComment();
            if (cd.getViewData() != null) {
                comment = cd.getViewData().getTitle();
            }
            String maxChar = name.substring(0, 1).toUpperCase();
            str.append("\r\t").append("private ").append((new StringBuilder(String.valueOf(type))).append(" ").toString()).append(name).append(";//   ").append(comment);
            String method = (new StringBuilder(String.valueOf(maxChar))).append(name.substring(1, name.length())).toString();
            getset.append("\r\t").append("public ").append((new StringBuilder(String.valueOf(type))).append(" ").toString()).append((new StringBuilder("get")).append(method).append("() {\r\t").toString());
            getset.append("    return this.").append(name).append(";\r\t}");
            getset.append("\r\t").append("public void ").append((new StringBuilder("set")).append(method).append("(").append(type).append(" ").append(name).append(") {\r\t").toString());
        }

        argv = str.toString();
        this.method = getset.toString();
        return (new StringBuilder(String.valueOf(argv))).append(this.method).toString();
    }

    public List<String> getEntityImportClasses(List<ColumnData> columnDatas) {
        List<String> list = new ArrayList<String>();
        Iterator<ColumnData> iterator = columnDatas.iterator();
        while (iterator.hasNext()) {
            ColumnData cd = iterator.next();
            if (!list.contains(cd.getDataType())) {
                list.add(cd.getDataType());
            }
        }
        return list;
    }

    private static void formatFieldClassType(ColumnData columnt) {
        String fieldType = columnt.getColumnType();
        String scale = columnt.getScale();
        if ("N".equals(columnt.getNullable())) {
            columnt.setOptionType("required:true");
        }
        if ("datetime".equals(fieldType) || "time".equals(fieldType) || "timestamp".equals(fieldType)) {
            columnt.setClassType("easyui-datetimebox");
        } else if ("date".equals(fieldType)) {
            columnt.setClassType("easyui-datebox");
        } else if ("int".equals(fieldType)) {
            columnt.setClassType("easyui-numberbox");
        } else if ("number".equals(fieldType)) {
            if (StringUtils.isNotBlank(scale) && Integer.parseInt(scale) > 0) {
                columnt.setClassType("easyui-numberbox");
                if (StringUtils.isNotBlank(columnt.getOptionType())) {
                    columnt.setOptionType((new StringBuilder(String.valueOf(columnt.getOptionType()))).append(",").append("precision:2,groupSeparator:','").toString());
                } else {
                    columnt.setOptionType("precision:2,groupSeparator:','");
                }
            } else {
                columnt.setClassType("easyui-numberbox");
            }
        } else if ("float".equals(fieldType) || "double".equals(fieldType) || "decimal".equals(fieldType)) {
            columnt.setClassType("easyui-numberbox");
            if (StringUtils.isNotBlank(columnt.getOptionType())) {
                columnt.setOptionType((new StringBuilder(String.valueOf(columnt.getOptionType()))).append(",").append("precision:2,groupSeparator:','").toString());
            } else {
                columnt.setOptionType("precision:2,groupSeparator:','");
            }
        } else {
            columnt.setClassType("easyui-validatebox");
        }

        // 处理字典
        if (columnt.getViewData() != null && columnt.getViewData().getDictionary() != null) {
            columnt.setClassType("easyui-combobox");
        }
    }


    private static Pattern pattern = Pattern.compile("@(.*?)\\[(.*?)\\]");
    private static void formatAnnotation(ColumnData columnt) {
        String comment = columnt.getColumnComment();
        if (StringUtils.isNotEmpty(comment)) {
            Matcher m = pattern.matcher(comment);
            String annotation, annotationValue;
            while (m.find()) {
                annotation = m.group(1);
                annotationValue = m.group(2);
                if ("view".equals(annotation)) {
                    columnt.setViewData(getViewData(annotationValue));
                }
                if ("ldap".equals(annotation)) {
                    columnt.setLdapData(getLdapData(annotationValue));
                }
            }
        }
    }

    private static LdapData getLdapData(String annotationValue) {
        LdapData ld = new LdapData();
        String[] strs1 = annotationValue.split(",");
        for (int i = 0; i < strs1.length; i++) {
            String[] strs2 = strs1[i].split(":");
            if ("isDnAttribute".equals(strs2[0])) {
                ld.setDnAttribute("true".equals(strs2[1]));
            } else if ("value".equals(strs2[0])) {
                ld.setValue(strs2[1]);
            } else if ("isTransient".equals(strs2[0])) {
                ld.setTransient("true".equals(strs2[1]));
            } else if ("index".equals(strs2[0])) {
                ld.setIndex(strs2[1]);
            } else if ("isMemberOf".equals(strs2[0])) {
                ld.setMemberOf("true".equals(strs2[1]));
            }
        }
        return ld;
    }

    private static ViewData getViewData(String annotationValue) {
        ViewData vd = new ViewData();

        String[] strs1 = annotationValue.split(",");
        for (int i = 0; i < strs1.length; i++) {
            String[] strs2 = strs1[i].split(":");
            if ("title".equals(strs2[0])) {
                vd.setTitle(strs2[1]);
            } else if ("filter".equals(strs2[0])) {
                vd.setFilter("true".equals(strs2[1]));
            } else if ("searchResult".equals(strs2[0])) {
                vd.setSearchResult("true".equals(strs2[1]));
            } else if ("form".equals(strs2[0])) {
                vd.setForm("true".equals(strs2[1]));
            } else if ("formatter".equals(strs2[0])) {
                vd.setFormatter(strs2[1]);
            } else if ("dictionary".equals(strs2[0])) {
                vd.setDictionary(strs2[1]);
            }
        }

        return vd;
    }

    public String getType(String dataType, String precision, String scale) {
        dataType = dataType.toLowerCase();
        if (dataType.contains("char") || dataType.contains("1.3.6.1.4.1.1466.115.121.1.15") || dataType.contains("1.3.6.1.4.1.1466.115.121.1.32")) {
            dataType = "java.lang.String";
        } else if (dataType.contains("int")) {
            dataType = "java.lang.Integer";
        } else if (dataType.contains("float")) {
            dataType = "java.lang.Float";
        } else if (dataType.contains("double")) {
            dataType = "java.lang.Double";
        } else if (dataType.contains("number")) {
            if (StringUtils.isNotBlank(scale) && Integer.parseInt(scale) > 0) {
                dataType = "java.math.BigDecimal";
            } else if (StringUtils.isNotBlank(precision) && Integer.parseInt(precision) > 6) {
                dataType = "java.lang.Long";
            } else {
                dataType = "java.lang.Integer";
            }
        } else if (dataType.contains("decimal")) {
            dataType = "BigDecimal";
        } else if (dataType.contains("date")) {
            dataType = "java.util.Date";
        } else if (dataType.contains("time")) {
            dataType = "java.util.Date";
        } else if (dataType.contains("clob")) {
            dataType = "java.sql.Clob";
        } else {
            dataType = "java.lang.Object";
        }
        return dataType;
    }

    public void getPackage(int type, String createPath, String content, String packageName,
            String className, String extendsClassName,
                           String[] importName) throws Exception {
        if (packageName == null) {
            packageName = "";
        }
        StringBuffer sb = new StringBuffer();
        sb.append("package ").append(packageName).append(";\r");
        sb.append("\r");
        for (int i = 0; i < importName.length; i++) {
            sb.append("import ").append(importName[i]).append(";\r");
        }

        sb.append("\r");
        sb.append((new StringBuilder("/**\r *  entity. @author wolf Date:")).append((new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date())).append("\r */").toString());
        sb.append("\r");
        sb.append("\rpublic class ").append(className);
        if (extendsClassName != null) {
            sb.append(" extends ").append(extendsClassName);
        }
        if (type == 1) {
            sb.append(" ").append("implements java.io.Serializable {\r");
        } else {
            sb.append(" {\r");
        }
        sb.append("\r\t");
        sb.append("private static final long serialVersionUID = 1L;\r\t");
        String temp = className.substring(0, 1).toLowerCase();
        temp = (new StringBuilder(String.valueOf(temp))).append(className.substring(1, className.length())).toString();
        if (type == 1) {
            sb.append((new StringBuilder("private ")).append(className).append(" ").append(temp).append("; // entity ").toString());
        }
        sb.append(content);
        sb.append("\r}");
        System.out.println(sb.toString());
        createFile(createPath, "", sb.toString());
    }

    public String formateClassName(String name) {
        String[] split = name.split("_");
        String nameStr = name;
        if (CodeResourceUtil.TABLE_PREFIX.contains(split[0])) {
            StringBuffer nameSb = new StringBuffer(split[1]);
            for (int i = 2; i < split.length; i++) {
                nameSb.append('_').append(split[i]);
            }
            nameStr = nameSb.toString();
        }
        return formateName(nameStr.toLowerCase());
    }

    public String formateName(String name) {
        if (name.contains("_")) {
            name = name.toLowerCase();
        }
        String[] split = name.split("_");
        if (split.length > 1) {
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < split.length; i++) {
                String tempTableName = (new StringBuilder(String.valueOf(split[i].substring(0, 1).toUpperCase()))).append(split[i].substring(1, split[i].length())).toString();
                sb.append(tempTableName);
            }

            return sb.toString();
        } else {
            String tempTables = (new StringBuilder(String.valueOf(split[0].substring(0, 1).toUpperCase()))).append(split[0].substring(1, split[0].length())).toString();
            return tempTables;
        }
    }

    public void createFile(String path, String fileName, String str) throws IOException {
        try (FileWriter writer = new FileWriter(new File((new StringBuilder(String.valueOf(path))).append(fileName).toString()))) {
            writer.write(new String(str.getBytes("UTF-8"), "UTF-8"));
        }
    }

    public String getColumnFields(String columns) throws Exception {
        String fields = columns;
        if (fields != null && !"".equals(fields)) {
            fields = fields.replaceAll("[|]", ",");
        }
        return fields;
    }

    public String[] getColumnList(String columns) throws Exception {
        String[] columnList = columns.split("[|]");
        return columnList;
    }

    public String getUpdateSql(String tableName, String[] columnsList, String[] datasList)
            throws Exception {
        StringBuffer sb = new StringBuffer();
        for (int i = 1; i < columnsList.length; i++) {
            String column = columnsList[i];
            String data = datasList[i];
            if (!"CREATETIME".equals(column.toUpperCase())) {
                if ("UPDATETIME".equals(column.toUpperCase())) {
                    sb.append((new StringBuilder(String.valueOf(column))).append("=now()").toString());
                } else {
                    sb.append((new StringBuilder(String.valueOf(column))).append("=#{").append(data).append("}").toString());
                }
                if (i + 1 < columnsList.length) {
                    sb.append(",");
                }
            }
        }

        String update = (new StringBuilder("update ")).append(tableName).append(" set ").append(sb.toString()).append(" where ").append(columnsList[0]).append("=#{").append(datasList[0]).append("}").toString();
        return update;
    }

    public String getColumnSplit(List<ColumnData> columnList) throws Exception {
        StringBuffer commonColumns = new StringBuffer();
        ColumnData data;
        Iterator<ColumnData> iterator = columnList.iterator();

        for (; iterator.hasNext(); commonColumns.append((new StringBuilder(String.valueOf(data.getColumnName()))).append("|").toString())) {
            data = iterator.next();
        }

        return commonColumns.delete(commonColumns.length() - 1, commonColumns.length()).toString();
    }

    public String getDataSplit(List<ColumnData> columnList) throws Exception {
        StringBuffer commonColumns = new StringBuffer();
        ColumnData data;
        Iterator<ColumnData> iterator = columnList.iterator();

        for (; iterator.hasNext(); commonColumns.append((new StringBuilder(String.valueOf(data.getDataName()))).append("|").toString())) {
            data = iterator.next();
        }

        return commonColumns.delete(commonColumns.length() - 1, commonColumns.length()).toString();
    }

    public Map<String, String> getLdapAttr(String attrName) {
        Map<String, String> returnMap = new HashMap<String, String>();
        if ("description".equals(attrName)) {
            returnMap.put("description", "RFC2256: descriptive information");
            returnMap.put("syntax", "1.3.6.1.4.1.1466.115.121.1.15");
            returnMap.put("name", "description");
            returnMap.put("equality", "caseIgnoreMatch");
            return returnMap;
        }
        // if ("cn".equals(attrName)) {
        // return null;
        // returnMap.put("name", "cn");
        // returnMap.put("description", "RFC2256: common name(s) for which the entity is known by");
        // returnMap.put("syntax", "1.3.6.1.4.1.1466.115.121.1.15");
        // returnMap.put("equality", "caseIgnoreMatch");
        // return returnMap;
        // }
        return null;
    }

}
