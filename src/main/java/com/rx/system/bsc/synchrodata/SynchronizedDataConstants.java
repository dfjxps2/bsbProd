package com.rx.system.bsc.synchrodata;


import org.apache.axis2.addressing.EndpointReference;

/**
 * 
 * 修改备注：    
 * @version     
 *
 */
public class SynchronizedDataConstants {
	 
	 //成功
	 public static final String SUCCESS_STATUS = "1";
	 //失败
	 public static final String FAIL_STATUS = "0";
	 
	 public static final String ZERO_TOTAL = "0";
	 
	 public static final String PARAM_ISNULL_FAIL_MSG = "用户帐号或者用户名称参数为空，请核对输入条件";
	 
	 public static final String DATA_ISNULL_FAIL_MSG = "查询无数据，请核对输入条件";
	 
	 public static final String USERID_PARAM_ISNULL_FAIL_MSG = "用户帐号参数为空，请核对输入条件";


	public final static String SOAP_WSDL_ADDRESS = "http://127.0.0.1:18001/portal/intlDataSynchronizedService?wsdl";

	public final static String SOAP_TARGET_NAMESPACE = "http://internal.synchrodata.security.portal.quick.com/";

	public final static String WSDL_SERVICE_NAME = "intlDataSynchronizedService";

	public final static String GET_ONEUSER_WSDL_OPERATION_NAME = "getUsersDataByUserID";

	public final static String GET_BATCHUSER_WSDL_OPERATION_NAME = "getUserApplicationPrivilegeByAppID";


	public final static String GET_ONEUSER_START_PARAM_KEY = "arg0";
	public final static String GET_ONEUSER_END_PARAM_KEY = "arg1";

	public final static String GET_BATCHUSER_START_PARAM_KEY = "arg0";
	public final static String GET_BATCHUSER_MIDDLE_PARAM_KEY = "arg1";
	public final static String GET_BATCHUSER_END_PARAM_KEY = "arg2";

	public final static String SYS_APP_ID = "S0101";

	public final static  String SYNC_USER_PROPERTY = "one";

	//30秒
	public final static long TIMEOUT_SECONDS =30000;

	public final static String CAS_LOGIN_USER = "sbd.user_name";

	public static EndpointReference targetAirline = new EndpointReference(
			SOAP_WSDL_ADDRESS);

}
