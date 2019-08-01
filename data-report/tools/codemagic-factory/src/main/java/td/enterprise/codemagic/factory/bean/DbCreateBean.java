package td.enterprise.codemagic.factory.bean;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

import org.apache.commons.lang.StringUtils;

import td.enterprise.codemagic.factory.def.CodeResourceUtil;
import td.enterprise.codemagic.factory.def.TableConvert;

public class DbCreateBean {

    private String url;
    private String username;
    private String password;
    private String SQLTables;
    private String method;
    private String argv;

    public DbCreateBean() {
        SQLTables = "show tables";
    }

    public void setMysqlInfo(String url, String username, String password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }

    public List<String> getTables() throws SQLException {
        try (Connection con = getConnection();
                PreparedStatement ps = con.prepareStatement(SQLTables);
                ResultSet rs = ps.executeQuery();) {
            List<String> list = new ArrayList<>();
            while (rs.next()) {
                list.add(rs.getString(1));
            }
            return list;
        }
    }

    public List<ColumnData> getColumnDatas(String tableName) throws SQLException {
        String SQLColumns = (new StringBuilder("select column_name ,data_type,column_comment,0,0,character_maximum_length,is_nullable nullable, column_key from information_schema.columns where table_name =  '")).append(tableName).append("' ").append("and table_schema =  '").append(CodeResourceUtil.DATABASE_NAME).append("'").toString();
        try (Connection con = getConnection();
                PreparedStatement ps = con.prepareStatement(SQLColumns);
                ResultSet rs = ps.executeQuery();) {
            List<ColumnData> columnList = new ArrayList<>();
            StringBuffer str = new StringBuffer();
            StringBuffer getset = new StringBuffer();
            ColumnData cd;
            for (; rs.next(); columnList.add(cd)) {
                String name = rs.getString(1);
                String type = rs.getString(2);
                String comment = rs.getString(3);
                String precision = rs.getString(4);
                String scale = rs.getString(5);
                String charmaxLength = rs.getString(6) != null ? rs.getString(6) : "";
                String nullable = TableConvert.getNullAble(rs.getString(7));
                String columnKey = rs.getString(8);
                
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
                cd = new ColumnData();
                cd.setColumnName(name);
                cd.setDataName(dataName);
                cd.setUpperDataName(upperDataName);
                cd.setDataType(type);
                cd.setShortDataType(shortType);
                cd.setJsDataType(convertToJsDataType(type));
                cd.setColumnType(rs.getString(2));
                cd.setColumnComment(comment);
                cd.setPrecision(precision);
                cd.setScale(scale);
                cd.setCharmaxLength(charmaxLength);
                cd.setNullable(nullable);
                cd.setColumnKey(columnKey);
                formatAnnotation(cd);
                formatFieldClassType(cd);
            }
            argv = str.toString();
            method = getset.toString();
            return columnList;
        }
    }

    public String getBeanFeilds(String tableName) throws SQLException {
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

    public Set<String> getEntityImportClasses(List<ColumnData> columnDatas) {
        Set<String> set = new TreeSet<>();
        Iterator<ColumnData> iterator = columnDatas.iterator();
        while (iterator.hasNext()) {
            String tp = iterator.next().getDataType();
            if (!tp.matches("java\\.lang\\.[^.]+")) {
                set.add(tp);
            }
        }
        return set;
    }

    private static void formatFieldClassType(ColumnData columnt) {
        String fieldType = columnt.getColumnType();
        String scale = columnt.getScale();
        if ("N".equals(columnt.getNullable()))
            columnt.setOptionType("required:true");
        if ("datetime".equals(fieldType) || "time".equals(fieldType) || "timestamp".equals(fieldType))
            columnt.setClassType("easyui-datetimebox");
        else if ("date".equals(fieldType))
            columnt.setClassType("easyui-datebox");
        else if ("int".equals(fieldType))
            columnt.setClassType("easyui-numberbox");
        else if ("number".equals(fieldType)) {
            if (StringUtils.isNotBlank(scale) && Integer.parseInt(scale) > 0) {
                columnt.setClassType("easyui-numberbox");
                if (StringUtils.isNotBlank(columnt.getOptionType()))
                    columnt.setOptionType((new StringBuilder(String.valueOf(columnt.getOptionType()))).append(",").append("precision:2,groupSeparator:','").toString());
                else
                    columnt.setOptionType("precision:2,groupSeparator:','");
            } else {
                columnt.setClassType("easyui-numberbox");
            }
        } else if ("float".equals(fieldType) || "double".equals(fieldType) || "decimal".equals(fieldType)) {
            columnt.setClassType("easyui-numberbox");
            if (StringUtils.isNotBlank(columnt.getOptionType()))
                columnt.setOptionType((new StringBuilder(String.valueOf(columnt.getOptionType()))).append(",").append("precision:2,groupSeparator:','").toString());
            else
                columnt.setOptionType("precision:2,groupSeparator:','");
        } else {
            columnt.setClassType("easyui-validatebox");
        }

        // 处理字典
        if (columnt.getViewData() != null && columnt.getViewData().getDictionary() != null) {
            columnt.setClassType("easyui-combobox");
        }
    }

    private static void formatAnnotation(ColumnData columnt) {
        String comment = columnt.getColumnComment();
        ViewData vd = new ViewData();
        if (StringUtils.isNotEmpty(comment)) {
            comment = comment.replaceAll("，", ",");
            if (comment.indexOf(",") != -1) {
                vd.setTitle(comment.split(",")[0]);
            } else if (comment.indexOf("，") != -1) {
                vd.setTitle(comment.split("，")[0]);
            } else {
                vd.setTitle(comment);
            }
        }
        columnt.setViewData(vd);
        // vd.setTitle(comment);
        // if (StringUtils.isNotEmpty(comment)) {
        // Pattern p = Pattern.compile("@(.*?)\\[(.*?)\\]");
        // Matcher m = p.matcher(comment);
        // String annotation, annotationValue;
        // while (m.find()) {
        // annotation = m.group(1);
        // annotationValue = m.group(2);
        // if (annotation.equals("view")) {
        // columnt.setViewData(getViewData(annotationValue));
        // }
        // }
        // }
    }

    // private void formatAnnotation(ColumnData columnt) {
    // String comment = columnt.getColumnComment();
    // if (StringUtils.isNotEmpty(comment)) {
    // Pattern p = Pattern.compile("@(.*?)\\[(.*?)\\]");
    // Matcher m = p.matcher(comment);
    // String annotation, annotationValue;
    // while (m.find()) {
    // annotation = m.group(1);
    // annotationValue = m.group(2);
    // if (annotation.equals("view")) {
    // columnt.setViewData(getViewData(annotationValue));
    // }
    // }
    // }
    // }

    public String getType(String dataType, String precision, String scale) {
        dataType = dataType.toLowerCase();
        if (dataType.contains("char") || dataType.contains("text"))
            dataType = "java.lang.String";
        else if (dataType.contains("bit"))
            dataType = "java.lang.Boolean";
        else if (dataType.contains("int"))
            dataType = "java.lang.Integer";
        else if (dataType.contains("float"))
            dataType = "java.lang.Float";
        else if (dataType.contains("double"))
            dataType = "java.lang.Double";
        else if (dataType.contains("number")) {
            if (StringUtils.isNotBlank(scale) && Integer.parseInt(scale) > 0)
                dataType = "java.math.BigDecimal";
            else if (StringUtils.isNotBlank(precision) && Integer.parseInt(precision) > 6)
                dataType = "java.lang.Long";
            else
                dataType = "java.lang.Integer";
        } else if (dataType.contains("decimal"))
            dataType = "java.math.BigDecimal";
        else if (dataType.contains("date"))
            dataType = "java.util.Date";
        else if (dataType.contains("time"))
            dataType = "java.util.Date";
        else if (dataType.contains("clob"))
            dataType = "java.sql.Clob";
        else
            dataType = "java.lang.Object";
        return dataType;
    }

    private static String convertToJsDataType(String type) {
        switch (type) {
            case "java.lang.String":
                return "string";
            case "java.lang.Boolean":
                return "boolean";
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

    public void getPackage(int type, String createPath, String content, String packageName,
            String className, String extendsClassName, String importName[])
            throws Exception {
        if (packageName == null)
            packageName = "";
        StringBuffer sb = new StringBuffer();
        sb.append("package ").append(packageName).append(";\r");
        sb.append("\r");
        for (int i = 0; i < importName.length; i++)
            sb.append("import ").append(importName[i]).append(";\r");

        sb.append("\r");
        sb.append((new StringBuilder("/**\r *  entity. @author wolf Date:")).append((new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date())).append("\r */").toString());
        sb.append("\r");
        sb.append("\rpublic class ").append(className);
        if (extendsClassName != null)
            sb.append(" extends ").append(extendsClassName);
        if (type == 1)
            sb.append(" ").append("implements java.io.Serializable {\r");
        else
            sb.append(" {\r");
        sb.append("\r\t");
        sb.append("private static final long serialVersionUID = 1L;\r\t");
        String temp = className.substring(0, 1).toLowerCase();
        temp = (new StringBuilder(String.valueOf(temp))).append(className.substring(1, className.length())).toString();
        if (type == 1)
            sb.append((new StringBuilder("private ")).append(className).append(" ").append(temp).append("; // entity ").toString());
        sb.append(content);
        sb.append("\r}");
        System.out.println(sb.toString());
        createFile(createPath, "", sb.toString());
    }

    public String formateClassName(String name) {
        return formateName(formateTableName(name));
    }
    
    public String formateTableName(String name) {
        for (String prefix : CodeResourceUtil.TABLE_PREFIX.split(",")) {
            if (name.startsWith(prefix)) {
                return name.substring(prefix.length()).toLowerCase();
            }
        }
        return name.toLowerCase();
    }

    public String formateName(String name) {
        if (name.contains("_")) {
            name = name.toLowerCase();
        }
        String split[] = name.split("_");
        if (split.length > 1) {
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < split.length; i++) {
                if (split[i].length() > 0) {
                    String tempTableName = (new StringBuilder(String.valueOf(split[i].substring(0, 1).toUpperCase()))).append(split[i].substring(1, split[i].length())).toString();
                    sb.append(tempTableName);
                }
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

    public Map<String, Object> getAutoCreateSql(String tableName) throws Exception {
        Map<String, Object> sqlMap = new HashMap<String, Object>();
        List<ColumnData> columnDatas = getColumnDatas(tableName);
        String columns = getColumnSplit(columnDatas);
        String columnList[] = getColumnList(columns);
        String columnFields = getColumnFields(columns);

        String datas = getDataSplit(columnDatas);
        String datasList[] = getColumnList(datas);

        String insert = (new StringBuilder("insert into ")).append(tableName).append("(").append("<include refid=\"Base_Column_List\" />").append(")\n values(#{").append(datas.replaceAll("\\|", "},#{")).append("})").toString();
        String update = getUpdateSql(tableName, columnList, datasList);
        String updateSelective = getUpdateSelectiveSql(tableName, columnDatas);
        String selectById = getSelectByIdSql(tableName, columnList, datasList);
        String delete = getDeleteSql(tableName, columnList, datasList);
        sqlMap.put("columnList", columnList);
        sqlMap.put("columnFields", columnFields);
        sqlMap.put("insert", insert.replace("#{createTime}", "now()").replace("#{updateTime}", "now()"));
        sqlMap.put("update", update.replace("#{createTime}", "now()").replace("#{updateTime}", "now()"));
        sqlMap.put("delete", delete);
        sqlMap.put("updateSelective", updateSelective);
        sqlMap.put("selectById", selectById);
        return sqlMap;
    }

    public String getDeleteSql(String tableName, String columnsList[], String datasList[])
            throws SQLException {
        StringBuffer sb = new StringBuffer();
        sb.append("delete ");
        sb.append("\t from ").append(tableName).append(" where ");
        sb.append('`').append(columnsList[0]).append('`').append(" = #{").append(datasList[0]).append("}");
        return sb.toString();
    }

    public String getSelectByIdSql(String tableName, String columnsList[], String datasList[])
            throws SQLException {
        StringBuffer sb = new StringBuffer();
        sb.append("select <include refid=\"Base_Column_List\" /> \n");
        sb.append("\t from ").append(tableName).append(" where ");
        sb.append(columnsList[0]).append(" = #{").append(datasList[0]).append("}");
        return sb.toString();
    }

    public String getColumnFields(String columns) throws SQLException {
        String fields = columns;
        if (fields != null && !"".equals(fields))
            fields = "`" + fields.replaceAll("\\|", "`, `") + "`";
        return fields;
    }

    public String[] getColumnList(String columns) throws SQLException {
        String columnList[] = columns.split("[|]");
        return columnList;
    }

    public String getUpdateSql(String tableName, String columnsList[], String datasList[])
            throws SQLException {
        StringBuffer sb = new StringBuffer();
        for (int i = 1; i < columnsList.length; i++) {
            String column = columnsList[i];
            String data = datasList[i];
            if (!"CREATETIME".equals(column.toUpperCase())) {
                if ("UPDATETIME".equals(column.toUpperCase()))
                    sb.append('`').append(column).append('`').append(" = now()");
                else
                    sb.append('`').append(column).append('`').append(" = #{").append(data).append("}");
                if (i + 1 < columnsList.length)
                    sb.append(",");
            }
        }

        String update = (new StringBuilder("update ")).append(tableName).append(" set ").append(sb.toString()).append(" where ").append(columnsList[0]).append("=#{").append(datasList[0]).append("}").toString();
        return update;
    }

    public String getUpdateSelectiveSql(String tableName, List<ColumnData> columnList)
            throws SQLException {
        StringBuffer sb = new StringBuffer();
        ColumnData cd = columnList.get(0);
        sb.append("\t<trim  suffixOverrides=\",\" >\n");
        for (int i = 1; i < columnList.size(); i++) {
            ColumnData data = columnList.get(i);
            String columnName = data.getColumnName();
            sb.append("\t<if test=\"").append(data.getDataName()).append(" != null ");
            if ("String" == data.getDataType())
                sb.append(" and ").append(data.getDataName()).append(" != ''");
            sb.append(" \">\n\t\t");
            sb.append('`').append((new StringBuilder(String.valueOf(columnName))).append('`').append(" = #{").append(data.getDataName()).append("},\n").toString());
            sb.append("\t</if>\n");
        }

        sb.append("\t</trim>");
        String update = (new StringBuilder("update ")).append(tableName).append(" set \n").append(sb.toString()).append(" where ").append(cd.getColumnName()).append("=#{").append(cd.getDataName()).append("}").toString();
        return update;
    }

    public String getColumnSplit(List<ColumnData> columnList) throws SQLException {
        StringBuffer commonColumns = new StringBuffer();
        ColumnData data;
        Iterator<ColumnData> iterator = columnList.iterator();
        for (; iterator.hasNext(); commonColumns.append((new StringBuilder(String.valueOf(data.getColumnName()))).append("|").toString()))
            data = iterator.next();

        return commonColumns.delete(commonColumns.length() - 1, commonColumns.length()).toString();
    }

    public String getDataSplit(List<ColumnData> columnList) throws SQLException {
        StringBuffer commonColumns = new StringBuffer();
        ColumnData data;
        Iterator<ColumnData> iterator = columnList.iterator();

        for (; iterator.hasNext(); commonColumns.append((new StringBuilder(String.valueOf(data.getDataName()))).append("|").toString()))
            data = iterator.next();

        return commonColumns.delete(commonColumns.length() - 1, commonColumns.length()).toString();
    }
}
