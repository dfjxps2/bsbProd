package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;


/**
 * 
 * @author zzm
 *
 */
@SuppressWarnings("unchecked")
public interface IMeasureAnalysisService {

	List listHeader(Map paramsMap) throws Exception;

	List listData(Map<String, String> paramsMap) throws Exception;

	List listSubData(Map<String, String> paramsMap) throws Exception;

	List listView(Map<String, String> paramsMap) throws Exception;
	
}
