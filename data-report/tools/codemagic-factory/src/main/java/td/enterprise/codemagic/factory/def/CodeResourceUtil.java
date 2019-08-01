package td.enterprise.codemagic.factory.def;

import java.util.ResourceBundle;

public class CodeResourceUtil {

    private static final ResourceBundle bundle = ResourceBundle.getBundle("database");
    private static final ResourceBundle bundlePath = ResourceBundle.getBundle("config");
    public static String DIVER_NAME = "com.mysql.jdbc.Driver";
    public static String URL;
    public static String USERNAME = "root";
    public static String PASSWORD = "root";
    public static String DATABASE_NAME = "sys";
    public static String DATABASE_TYPE = "mysql";
    public static String DATABASE_TYPE_MYSQL;
    public static String DATABASE_TYPE_ORACLE;
    public static String JKDCCG_UI_FIELD_REQUIRED_NUM = "4";
    public static String JKDCCG_UI_FIELD_SEARCH_NUM = "3";
    public static String web_root_package;
    public static String source_root_package;
    public static String resources_root_package;
    public static String test_root_package;
    public static String bizPackage;
    public static String bizAppPackage;
    public static String bizPackageUrl;
    public static String entity_package;
    public static String page_package;    
    public static String BACKEND_ONLY;
    public static String TABLE_PREFIX;
    public static String MAPPER_XML_ONLY;
    public static String ENTITY_OPEN_TYPE;
    public static String ENTITY_SAVE_TYPE;
    public static String ENTITY_URL;
    public static String PAGE_URL;
    public static String ENTITY_URL_INX;
    public static String PAGE_URL_INX;
    public static String TEMPLATEPATH = getTEMPLATEPATH();
    public static String CODEPATH;
    public static String JSPPATH;
    public static String TABLE_ID = getTableId();
    public static String JKDCCG_GENERATE_UI_FILTER_FIELDS;
    public static String LDAP_URL;
    public static String LDAP_BASE;
    public static String LDAP_USERNAME;
    public static String LDAP_PASSWORD;
    public static String LDAP_SCHEMA_CN;
    public static String SYSTEM_ENCODING = getSYSTEM_ENCODING();
    
    public static String CORE_PROJECT;
    public static String REST_PROJECT;
    public static String CLIENT_PROJECT;
    
    public static String BASE_CLASS_PACKAGE;
    public static String PAGE_GEN_TYPE;

    public CodeResourceUtil() {
    }

    public static final String getDIVER_NAME() {
        return bundle.getString("diver_name");
    }

    public static final String getURL() {
        return bundle.getString("url");
    }

    public static final String getUSERNAME() {
        return bundle.getString("username");
    }

    public static final String getPASSWORD() {
        return bundle.getString("password");
    }

    public static final String getDATABASE_NAME() {
        return bundle.getString("database_name");
    }

    private static String getBizPackage() {
        return bundlePath.getString("biz_package");
    }

    private static String getBizAppPackage() {
        return bundlePath.getString("biz_app_package");
    }

    public static final String getEntityPackage() {
        return bundlePath.getString("entity_package");
    }

    public static final String getPagePackage() {
        return bundlePath.getString("page_package");
    }
    
    public static final String getBackendOnly() {
        return bundlePath.getString("backend_only");
    }
    
    public static final String getTablePrefix() {
        return bundlePath.getString("table_prefix");
    }
    
    public static final String getMapperXmlOnly() {
        return bundlePath.getString("mapper_xml_only");
    }
    
    public static final String getEntityOpenType() {
        return bundlePath.getString("entity_open_type");
    }
    
    public static final String getEntitySaveType() {
        return bundlePath.getString("entity_save_type");
    }

    public static final String getTEMPLATEPATH() {
        return bundlePath.getString("template_path");
    }

    public static final String getSourceRootPackage() {
        return bundlePath.getString("source_root_package");
    }
    
    public static final String getResourcesRootPackage() {
        return bundlePath.getString("resources_root_package");
    }

    public static final String getTestRootPackage() {
        return bundlePath.getString("test_root_package");
    }

    public static final String getWebRootPackage() {
        return bundlePath.getString("webroot_package");
    }

    public static final String getSYSTEM_ENCODING() {
        return bundlePath.getString("system_encoding");
    }

    public static final String getTableId() {
        return bundlePath.getString("table_id");
    }

    public static final String getFilterFields() {
        return bundlePath.getString("filter_fields");
    }

    public static final String getSearchFiledNum() {
        return bundlePath.getString("search_filed_num");
    }

    public static final String getFieldRequiredNum() {
        return bundlePath.getString("field_required_num");
    }

    public static final String getLdapUrl(){
        return bundle.getString("ldap.connection.url");
    }
    
    public static final String getLdapBase(){
        return bundle.getString("ldap.connection.base");
    }
    
    public static final String getLdapUserName(){
        return bundle.getString("ldap.connection.username");
    }
    
    public static final String getLdapPassword(){
        return bundle.getString("ldap.connection.password");
    }
    
    public static final String getLdapSchemaCn(){
        return bundle.getString("ldap.schema.cn");
    }
    
    public static final String getCoreProject(){
        return bundlePath.getString("core_project");
    }    
    
    public static final String getRestProject(){
        return bundlePath.getString("rest_project");
    }
    
    public static final String getClientProject(){
        return bundlePath.getString("client_project");
    }
    
    public static final String getBaseClassPackage(){
        return bundlePath.getString("base_class_package");
    }    
    
    public static final String getPageGenType(){
        return bundlePath.getString("page_gen_type");
    }        
    
    static {
        URL = "jdbc:mysql://localhost:3306/sys?useUnicode=true&characterEncoding=UTF-8";
        DATABASE_TYPE_MYSQL = "mysql";
        DATABASE_TYPE_ORACLE = "oracle";
        web_root_package = "WebRoot";
        source_root_package = "src";
        bizPackage = "sun";
        bizPackageUrl = "sun";
        bizAppPackage = "sun";
        entity_package = "entity";
        page_package = "page";
        DIVER_NAME = getDIVER_NAME();
        URL = getURL();
        USERNAME = getUSERNAME();
        PASSWORD = getPASSWORD();
        DATABASE_NAME = getDATABASE_NAME();
        source_root_package = getSourceRootPackage();
        resources_root_package = getResourcesRootPackage();
        test_root_package = getTestRootPackage();
        web_root_package = getWebRootPackage();
        bizPackage = getBizPackage();
        bizPackageUrl = bizPackage.replace(".", "/");
        bizAppPackage = getBizAppPackage();
        BACKEND_ONLY = getBackendOnly();
        TABLE_PREFIX = getTablePrefix();
        MAPPER_XML_ONLY = getMapperXmlOnly();
        ENTITY_OPEN_TYPE = getEntityOpenType();
        ENTITY_SAVE_TYPE = getEntitySaveType();
        JKDCCG_UI_FIELD_SEARCH_NUM = getSearchFiledNum();
        if (URL.indexOf("mysql") >= 0 || URL.indexOf("MYSQL") >= 0)
            DATABASE_TYPE = DATABASE_TYPE_MYSQL;
        else if (URL.indexOf("oracle") >= 0 || URL.indexOf("ORACLE") >= 0)
            DATABASE_TYPE = DATABASE_TYPE_ORACLE;
        source_root_package = source_root_package.replace(".", "/");
        web_root_package = web_root_package.replace(".", "/");
        ENTITY_URL = (new StringBuilder(String.valueOf(source_root_package))).append("/").append(bizPackageUrl).append("/").append(entity_package).append("/")
                .toString();
        PAGE_URL = (new StringBuilder(String.valueOf(source_root_package))).append("/").append(bizPackageUrl).append("/").append(page_package).append("/")
                .toString();
        ENTITY_URL_INX = (new StringBuilder(String.valueOf(bizPackage))).append(".").append(entity_package).append(".").toString();
        PAGE_URL_INX = (new StringBuilder(String.valueOf(bizPackage))).append(".").append(page_package).append(".").toString();
        CODEPATH = (new StringBuilder(String.valueOf(source_root_package))).append("/").append(bizPackageUrl).append("/").toString();
        JSPPATH = (new StringBuilder(String.valueOf(web_root_package))).append("/").append(bizPackageUrl).append("/").toString();
        LDAP_URL = getLdapUrl();
        LDAP_BASE = getLdapBase();
        LDAP_USERNAME = getLdapUserName();
        LDAP_PASSWORD = getLdapPassword();
        LDAP_SCHEMA_CN = getLdapSchemaCn();
        
        CORE_PROJECT = getCoreProject();
        REST_PROJECT = getRestProject();
        CLIENT_PROJECT = getClientProject();
        
        BASE_CLASS_PACKAGE = getBaseClassPackage();
        
        PAGE_GEN_TYPE = getPageGenType();
    }
}
