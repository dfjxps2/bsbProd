package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
public interface MeasureAnalysisDao {

	List listHeader(Map paramsMap) throws Exception;

	List listData(Map<String, String> paramsMap) throws Exception;

	List listSubData(Map<String, String> paramsMap) throws Exception;

	List listView(Map<String, String> paramsMap) throws Exception;

}
