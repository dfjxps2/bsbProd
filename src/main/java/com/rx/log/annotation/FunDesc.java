package com.rx.log.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 方法描述注解,放同时配置了@useLog注解时候将会记录方法访问日志
 * @author chenxd
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Inherited
public @interface FunDesc {
	public String code();
	//public String name();
	//public String descript() default "";
}
