package com.talkingdata.datacloud.constant;

public final class CatalogConstants {

    //Regex for acceptable logins
    public static final String LOGIN_REGEX = "^[_'.@A-Za-z0-9-]*$";
    // Spring profiles for development, test and production, see http://jhipster.github.io/profiles/
    public static final String SPRING_PROFILE_DEVELOPMENT = "dev";
    public static final String SPRING_PROFILE_TEST = "test";
    public static final String SPRING_PROFILE_PRODUCTION = "prod";
    // Spring profile used when deploying with Spring Cloud (used when deploying to CloudFoundry)
    public static final String SPRING_PROFILE_CLOUD = "cloud";
    // Spring profile used when deploying to Heroku
    public static final String SPRING_PROFILE_HEROKU = "heroku";
    // Spring profile used to disable swagger
    public static final String SPRING_PROFILE_SWAGGER = "swagger";
    // Spring profile used to disable running liquibase
    public static final String SPRING_PROFILE_NO_LIQUIBASE = "no-liquibase";

    public static final String SYSTEM_ACCOUNT = "system";

    public static final long TOMB = 1024 * 1024;
    public static final long TOGB = 1024 * TOMB;
    public static final long MAX_FILE_LENGTH = 1 * TOGB;

    public static final int MAX_FILENAME_LENGTH = 30;
    // 从HDFS上创建的数据目录很可能本来名字就超过30，产品设定为255
    public static final int MAX_FILENAME_LENGTH_HDFS = 255;

    private CatalogConstants() {
    }
}
