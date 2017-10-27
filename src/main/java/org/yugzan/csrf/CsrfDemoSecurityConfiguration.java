package org.yugzan.csrf;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.yugzan.csrf.core.CookieCsrfFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true , securedEnabled= true)
public class CsrfDemoSecurityConfiguration{
    private static final String ADMIN_ROLE = "ADMIN";
    private static final String ADMIN_RESOURCE="/auth";
	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
	    auth.inMemoryAuthentication().withUser("admin").password("admin").roles(ADMIN_ROLE);
	}
  
    @Configuration
    public static  class FromSecurityConfiguration extends WebSecurityConfigurerAdapter{

    	@Override
    	protected void configure(HttpSecurity http) throws Exception {
    	    login(http);
    	    logout(http);
    	    csrf(http);
    	    authorizeRequests(http);

    	}
    	
        protected void login(HttpSecurity http) throws Exception {
            http
                .formLogin()
                .loginPage("/auth/login.html").permitAll()
                .defaultSuccessUrl("/auth/index.html")
                .failureUrl("/auth/login.html?error");
        }
        protected void logout(HttpSecurity http) throws Exception {
            http
                .logout()
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID");
        }
        protected void exceptionHandling(HttpSecurity http) throws Exception {
            http
                .exceptionHandling()
                .authenticationEntryPoint(new Http403ForbiddenEntryPoint());
        }
        protected void csrf(HttpSecurity http) throws Exception {
            http
                .csrf().csrfTokenRepository(csrfTokenRepository()).and()
                .addFilterAfter(new CookieCsrfFilter(), CsrfFilter.class);
        }
        protected void authorizeRequests(HttpSecurity http) throws Exception {
            http
            .authorizeRequests()
            .antMatchers(ADMIN_RESOURCE+"/js/**", ADMIN_RESOURCE+"/css/**", ADMIN_RESOURCE+"/font/**", ADMIN_RESOURCE+"/fonts/**" ).permitAll()
            .antMatchers(ADMIN_RESOURCE+"/**").hasRole(ADMIN_ROLE)
            .anyRequest().authenticated();
        }
        private CsrfTokenRepository csrfTokenRepository() {
            //If want to custom method  (like redis or custom key  ) using CustomCsrfTokenRepisutory
            HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
            repository.setHeaderName(CookieCsrfFilter.XSRF_TOKEN_HEADER_NAME);
              return repository;
          }

    } 


}
