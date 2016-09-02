package org.yugzan.csrf;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @author yongzan
 * @date 2015/8/26
 * 
 */
@Configuration
@EnableWebMvc
public class CsrfDemoWebConfiguration extends WebMvcConfigurerAdapter{

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/auth/**").addResourceLocations("classpath:/auth/");
  }
  
  @Override
  public void addViewControllers(ViewControllerRegistry registry) {

  }

}
