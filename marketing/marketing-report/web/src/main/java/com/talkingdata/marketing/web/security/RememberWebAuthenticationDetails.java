package com.talkingdata.marketing.web.security;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

import javax.servlet.http.HttpServletRequest;

/**
 * @author chunyan.ji
 */
@Slf4j
public class RememberWebAuthenticationDetails extends WebAuthenticationDetails {
	private static final Logger logger = LoggerFactory.getLogger(RememberWebAuthenticationDetails.class);
	private final String queryString;

	public RememberWebAuthenticationDetails(HttpServletRequest request) {
		super(request);

		this.queryString = request.getQueryString();
		logger.debug("Remember request {}", this.queryString);
	}

	public String getQueryString() {
		logger.debug("Remember request get queryString {}", this.queryString);
		return this.queryString;
	}
}
