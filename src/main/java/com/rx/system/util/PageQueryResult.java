package com.rx.system.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PageQueryResult {
	
	private int totalCount = 0;
	private int start = 0;
	private int limit = 0;
	
	private List<Map<String,Object>> data = new ArrayList<Map<String,Object>>();
	
	public int getTotalCount() {
		return totalCount;
	}
	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	public int getLimit() {
		return limit;
	}
	public void setLimit(int limit) {
		this.limit = limit;
	}
	public List<Map<String, Object>> getData() {
		return data;
	}
	public void setData(List<Map<String, Object>> data) {
		this.data = data;
	}
}
