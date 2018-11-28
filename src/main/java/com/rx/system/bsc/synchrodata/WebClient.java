package com.rx.system.bsc.synchrodata;


import org.apache.axiom.om.OMAbstractFactory;
import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.OMFactory;
import org.apache.axiom.om.OMNamespace;
import org.apache.axiom.soap.SOAP11Constants;
import org.apache.axis2.Constants;
import org.apache.axis2.client.Options;
import org.apache.axis2.client.ServiceClient;

import javax.xml.namespace.QName;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//调用WebService 适用于车源，货源的删除
public class WebClient{

	/**
	 * 设置发送请求的URL
	 *  @param: param:参数类型   paramValue:参数值  method:方法名
	 *  @return： 请求的URL
	 * @param mp
	 * @param operationName
	 * @return
	 */
	 private static OMElement buildWsdlParam(Map<String,Object> mp,String operationName){
		  OMFactory fac = OMAbstractFactory.getOMFactory();
		  OMNamespace omNs = fac.createOMNamespace(SynchronizedDataConstants.SOAP_TARGET_NAMESPACE, ""); //http://tempuri.org/是命名空间
		  String val ="";
		  OMElement data = fac.createOMElement(operationName, omNs);
		  //获得要调用的方法名
		  for (Map.Entry<String, Object> entry : mp.entrySet()) {
			 OMElement inner = fac.createOMElement(new QName(entry.getKey()));      //获得该方法名要调用的参数名
			 val = entry.getValue() ==null ||"".equals(entry.getValue())? "":entry.getValue().toString();
			 
			 inner.setText(val);             //输入参数
			 data.addChild(inner);             //将该参数加入要调用的方法节点
		  }
		  return data;
	 }
 
	private static OMElement buildNoParam(String param, String paramValue,
			String method) {
		OMFactory fac = OMAbstractFactory.getOMFactory();
		OMNamespace omNs = fac.createOMNamespace(SynchronizedDataConstants.SOAP_TARGET_NAMESPACE, ""); // http://tempuri.org/是命名空间
		OMElement data = fac.createOMElement(method, omNs);
		QName qname = new QName(param);
		OMElement inner = fac.createOMElement(qname);
		inner.setText(paramValue);
		data.addChild(inner);
		return data;
	}



	public static Options buildWsdlOptions(){
		  Options options = new Options();
		  options.setSoapVersionURI(SOAP11Constants.SOAP_ENVELOPE_NAMESPACE_URI);
		  options.setTo(SynchronizedDataConstants.targetAirline);
		  options.setTransportInProtocol(Constants.TRANSPORT_HTTP);     //设置传输协议
		  options.setTimeOutInMilliSeconds(SynchronizedDataConstants.TIMEOUT_SECONDS);
		  return options;
	}

 
	 public static String getWsdlResultByCode(Map<String,Object> mp,String operationName){
		  try{
			ServiceClient sender = new ServiceClient();
			sender.setOptions(buildWsdlOptions());
			OMElement result = sender.sendReceive(buildWsdlParam(mp,operationName));
			String str = result.getFirstElement().getText();
			System.out.println("解析之前的数据："+str.toString());
			return str;
		  } catch(Exception e){
			e.printStackTrace();
			System.out.println("调用出错！");
			return "调用出错！";
		  }
	 }

	/**
	 *   dom4j解析WebService返回的数据
	 *   @param: param:参数类型   paramValue:参数值  method:方法名
	 *   @return: string类型的数据
	 * @param mp
	 * @param operationName
	 * @return
	 */

	 public static List<Map<String,Object>> getResultByDom4j(Map<String,Object> mp,String operationName){
		List<Map<String,Object>> retList = null;
		  try {
			String retXml = getWsdlResultByCode(mp,operationName);
			retList = Dom4jUtil.readDom4jXml(retXml);
		  } catch (Exception e) {
		   // TODO Auto-generated catch block
		   e.printStackTrace();
		   System.out.println("解析出错！");
		  }
		 return retList;

	 }
 
 
	 @SuppressWarnings("static-access")
	 public static void main(String[] args) throws Exception {
		 WebClient web = new WebClient();
		 Map<String,Object> mp = new HashMap<String, Object>();
	/*	 mp.put("arg0","S0101");
		 mp.put("arg1","admin");
		 String operationName = SynchronizedDataConstants.GET_ONEUSER_WSDL_OPERATION_NAME;
		 */

		 mp.put("arg0","S0101");
		 mp.put("arg1","2018-01-01");
		 mp.put("arg2","2018-12-01");
		 String operationName = SynchronizedDataConstants.GET_BATCHUSER_WSDL_OPERATION_NAME;


	//	 mp.put(GET_ONEUSER_WSDL_OPERATION_NAME_KEY,GET_ONEUSER_WSDL_OPERATION_NAME);
		 String retXml = web.getWsdlResultByCode(mp,operationName); //传入参数名，参数值，方法名
		 List<Map<String,Object>> retList = Dom4jUtil.readDom4jXml(retXml);
		 System.out.println(retList.size());
	 }
 
 

}


