package com.talkingdata.marketing.core.util;

import org.apache.commons.codec.binary.Base64;
import org.springframework.http.HttpHeaders;

/**
 * The type Http util.
 * @author hongsheng
 */
public class HttpUtil {

	/**
	 * The constant AUTHORIZATION_KEY.
	 */
	public static final String AUTHORIZATION_KEY = "Authorization";

	/**
	 * Create headers http headers.
	 *
	 * @param username the username
	 * @param password the password
	 * @return the http headers
	 */
	public static HttpHeaders createHeaders(final String username, final String password) {
        HttpHeaders authHeader = new HttpHeaders() {
            {
                String authorization = getAuthorization(username, password);
                set(AUTHORIZATION_KEY, authorization);
            }
        };
        return authHeader;
    }

	/**
	 * Gets authorization.
	 *
	 * @param username the username
	 * @param password the password
	 * @return the authorization
	 */
	public static String getAuthorization(final String username, final String password) {
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.encodeBase64(auth.getBytes());
        String authorization = "Basic " + new String(encodedAuth);
        return authorization;
    }
}
