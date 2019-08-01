package td.enterprise.security.saas;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import td.enterprise.config.Constants;
import td.enterprise.service.AccountService;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Yan on 2017/6/26.
 */
@Slf4j
@Component
@Profile(Constants.SPRING_PROFILE_SAAS)
public class TDAuthenticationProvider implements AuthenticationProvider {

    @Inject
    private AccountService accountService;

    public TDAuthenticationProvider() {
        log.info("*** TDAuthenticationProvider created");
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String name = authentication.getName();
        String credential = (String) authentication.getCredentials();

        boolean flag;
        //tdppt
        if(StringUtils.isEmpty(credential)){
            flag = accountService.authorizeByTdppt(name);
        }
        // username and password
        else{
            flag =accountService.authorizeByUserAndPwd(name, credential);
        }

        if(flag) {
            List<GrantedAuthority> grantedAuths = new ArrayList<>();
            grantedAuths.add(new SimpleGrantedAuthority("ROLE_USER"));
            return new UsernamePasswordAuthenticationToken(authentication.getName(), authentication.getCredentials(), grantedAuths);
        } else {
            return null;
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
