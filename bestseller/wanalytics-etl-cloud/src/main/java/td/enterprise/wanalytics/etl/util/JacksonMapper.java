package td.enterprise.wanalytics.etl.util;


import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;

/**
 * Created by tendcloud on 2016/1/21.
 */
public class JacksonMapper {
    private static final ObjectMapper mapper = new ObjectMapper();
    static {
        mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES,false);
    }

    private JacksonMapper() {
    }

    public static ObjectMapper getObjectMapper() {
        return mapper;
    }
}