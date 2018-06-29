package com.rx.system.bsc.calc.parse;

public interface IExpression {

	public String getExpression();
	
	public void setExpression(String expression);
	
	public void setParseResult(String parseResult);
		
	/**
	 * @return
	 * 	ture：解析成功<p>
	 * 	false：解析失败<p>
	 *  
	 * 应调用 getParseResult()获取解析的结果
	 * 应调用 getParseMessage()获取程序解析过程中的消息
	 * */
	public boolean doParse() throws Exception;
	
	/**
 	 * @return
	 * 返回解析的结果
	 * */
	public String getParseResult();
	
	/**
	 * @return
	 * 	返回解析过程中的消息
	 * */
	public String getParseMessage();
}
