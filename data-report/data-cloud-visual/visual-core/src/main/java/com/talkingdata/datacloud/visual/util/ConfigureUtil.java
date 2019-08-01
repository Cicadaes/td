package com.talkingdata.datacloud.visual.util;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.tendcloud.enterprise.um.umic.rmi.Client;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class ConfigureUtil {
	
	public static String server;
	
	public final static ObjectMapper mapper = new ObjectMapper();
	

	@SuppressWarnings("unchecked")
	public static void iterationParams(List<Map<String, Object>> configureList)
			throws IOException, JsonParseException, JsonMappingException,
			Exception {
		for (Map<String, Object> configure : configureList) {
			String url = String.valueOf(configure.get("url"));
			if (configure.get("url") != null
					&& !"".equals(configure.get("url"))) {
				Map<String, Object> configureParams = new HashMap<String, Object>();
				String paramsJson = String.valueOf(configure.get("params"));
				if (configure.get("params") != null
						&& !"".equals(configure.get("params"))) {
					Map<String, Object> paramsConfigureMap = mapper.readValue(
							paramsJson, Map.class);
					configureParams.putAll(paramsConfigureMap);
				}
				String resultJson = getClientDataList(configureParams, url);
				Map<String, Object> resultMap = mapper.readValue(resultJson,
						Map.class);
				List<Map<String, Object>> resultValueList = (List<Map<String, Object>>) resultMap
						.get("result");
				// 递归出查出下面的所有子级

				recursionParams(configure, resultValueList, configureParams);
				configure.put("value", resultValueList);
			}
		}
	}

	@SuppressWarnings("unchecked")
	private static void recursionParams(Map<String, Object> configure,
			List<Map<String, Object>> resultValueList,
			Map<String, Object> configureParams) throws Exception {
		String cascadeJson = String.valueOf(configure.get("cascade"));
		if (configure.get("cascade") != null && resultValueList != null) {
			// List<String> cascadeList = mapper.readValue(cascadeJson,
			// List.class);
			String[] cascadeList = cascadeJson.split(",");
			if (cascadeList != null) {
				for (String cascade : cascadeList) {
					// 取出级联的子级集合
					Map<String, Object> cascadeMap = (Map<String, Object>) configure
							.get(cascade);
					if (configure.get(cascade) != null) {
						for (Map<String, Object> resultValue : resultValueList) {
							Map<String, Object> cascadeKeyMap = (Map<String, Object>) cascadeMap
									.get(String.valueOf(resultValue.get("key")));
							if (cascadeKeyMap != null
									&& cascadeKeyMap.get("url") != null) {
								String url = String.valueOf(cascadeKeyMap
										.get("url"));
								String paramsJson = String
										.valueOf(cascadeKeyMap.get("params"));
								if (cascadeKeyMap.get("params") != null) {
									Map<String, Object> paramsConfigureMap = mapper
											.readValue(paramsJson, Map.class);
									configureParams.putAll(paramsConfigureMap);
								}
								configureParams.put(configure.get("key") + "",
										resultValue.get("key"));
								String resultJson = getClientDataList(
										configureParams, url);
								configureParams.put(configure.get("key") + "",
										configure.get("value"));
								Map<String, Object> resultMap = mapper
										.readValue(resultJson, Map.class);
								List<Map<String, Object>> _resultValueList = (List<Map<String, Object>>) resultMap
										.get("result");
								if(_resultValueList != null && _resultValueList.size()>0 ){
									cascadeKeyMap.put("value", _resultValueList);
									recursionParams(cascadeKeyMap,
											_resultValueList, configureParams);
								}
								
							}
						}
					}
				}
			}
		}

	}

	private static String getClientDataList(Map<String, Object> params, String service)
			throws Exception, JsonMappingException, IOException {
		checkServer();
//		String paramsJson = mapper.writeValueAsString(params);
//		String resultJson = Client.getRemoteInterfaceDateByJson(server,
//				service, paramsJson);
		 Unirest.get(service);

		HttpResponse<JsonNode> jsonResponse = Unirest.get(service)
				.asJson();
		return jsonResponse.getBody().toString();
	}

	private static void checkServer() {
		if (StringUtils.isBlank(server)) {
			server="http://localhost/sso";
//			Properties properties = ProcessorConfigs.getProperties();
//			server = properties.getProperty("sso.client.casServer");
		}
	}
}
