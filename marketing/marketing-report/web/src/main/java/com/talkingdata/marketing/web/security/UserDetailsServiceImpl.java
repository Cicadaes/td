package com.talkingdata.marketing.web.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.cas.authentication.CasAssertionAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * @author chunyan.ji
 * Authenticate a user from the database.
 */
public class UserDetailsServiceImpl implements AuthenticationUserDetailsService<CasAssertionAuthenticationToken>, Serializable {

	private final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

	public UserDetailsServiceImpl() {
		super();
	}

	@Override
	public UserDetails loadUserDetails(CasAssertionAuthenticationToken token) throws UsernameNotFoundException {
		String login = token.getPrincipal().toString();
		String lowercaseLogin = login.toLowerCase();

		log.debug("Authenticating '{}'", login);
		List<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();

		grantedAuthorities.add(new GrantedAuthority() {
			private static final long serialVersionUID = 1L;

			@Override
			public String getAuthority() {
				return AuthoritiesConstants.USER;
			}
		});

		return new org.springframework.security.core.userdetails.User(lowercaseLogin,lowercaseLogin, grantedAuthorities);
	}
}
