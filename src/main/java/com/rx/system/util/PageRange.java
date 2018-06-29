package com.rx.system.util;

public class PageRange {
	
	private int start;
	private int limit;
	
	public PageRange() {
		
	}

	public PageRange(int start, int limit) {
		super();
		this.start = start;
		this.limit = limit;
	}
	
	public PageRange(String start,String limit){
		super();
		if(start == null){
			start = "0";
			limit = "30";
		}
		this.start = Integer.parseInt(start);
		this.limit = Integer.parseInt(limit);
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
	
}
