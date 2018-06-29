package com.rx.log;

import java.util.Properties;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;

@Intercepts(value = {@Signature(
			args={MappedStatement.class,Object.class}, 
			method="update", 
			type=Executor.class)
})
public class MyBatisInterceptor implements Interceptor{

	public Object intercept(Invocation invocation) throws Throwable {
		MappedStatement ms = (MappedStatement) invocation.getArgs()[0];
		Object parameter = invocation.getArgs()[1];
		Object returnVal = invocation.proceed();
		System.out.println("mybatis 拦截器输出SQL：" + ms.getBoundSql(parameter).getSql().replaceAll("\\n", ""));
		return returnVal;
	}

	public Object plugin(Object obj) {
		return Plugin.wrap(obj, this);
	}

	public void setProperties(Properties properties) {
	}
	
}
