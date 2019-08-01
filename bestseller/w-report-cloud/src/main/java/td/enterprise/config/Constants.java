package td.enterprise.config;

/**
 * Created by Yan on 2017/2/28.
 */
public final class Constants {

  //Regex for acceptable logins
  public static final String LOGIN_REGEX = "^[_'.@A-Za-z0-9-]*$";
  // Spring profiles for development, test and production, see http://jhipster.github.io/profiles/
  public static final String SPRING_PROFILE_DEVELOPMENT = "dev";
  public static final String SPRING_PROFILE_TEST = "test";
  public static final String SPRING_PROFILE_PRODUCTION = "prod";
  public static final String SPRING_PROFILE_SAAS = "saas";

  // Spring profile used when deploying with Spring Cloud (used when deploying to CloudFoundry)
  public static final String SPRING_PROFILE_CLOUD = "cloud";
  // Spring profile used when deploying to Heroku
  public static final String SPRING_PROFILE_HEROKU = "heroku";
  // Spring profile used to disable swagger
  public static final String SPRING_PROFILE_SWAGGER = "swagger";
  // Spring profile used to disable druid
  public static final String SPRING_PROFILE_DRUID = "druid";
  public static final String SPRING_PROFILE_SSO = "sso";

  // Spring profile used to disable running liquibase
  public static final String SPRING_PROFILE_NO_LIQUIBASE = "no-liquibase";

  public static final String SYSTEM_ACCOUNT = "system";

  public static final String CURRENT_TENANT_ID = "currentTenantId";

  private Constants() {
  }
}
