package com.talkingdata.datacloud.visual.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

import javax.servlet.http.HttpServletRequest;

@Slf4j
public class RememberWebAuthenticationDetails extends WebAuthenticationDetails {
	private final String queryString;

	public RememberWebAuthenticationDetails(HttpServletRequest request) {
		super(request);

		this.queryString = request.getQueryString();
		log.debug("Remember request {}", this.queryString);
	}

	public String getQueryString() {
		log.debug("Remember request get queryString {}", this.queryString);
		return this.queryString;
	}
}
