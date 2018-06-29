package com.rx.system.bsc.calc;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * 线程运行进度信息类@SuppressWarnings("serial")

 * @author chenxd
 *
 */
public class ThreadStatus implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -4636557171047247188L;

	public static int STATUS_RUNNING = 0;//运行状态
	
	public static int STATUS_STOP = 1;//停止状态
	
	public static int STATUS_EXCEPTION = 2;//异常状态
	
	private String exception = null;//异常信息
	
	private int status = 1;//当前线程状态
	
	private Calendar cstart = null;//计算开始日历对象
	private Calendar cpoint = null;//计算当前日历对象
	
	private int index;//正在计算的对象序号
	private int itemCount;//计算对象个数
	
	private List<String> logList = new ArrayList<String>();//执行日志记录
	
	//记录日志方法
	public void addLogExecutInfo(String info) {
		logList.add(info);
	}
	public void updateLogExecutInfo(String info) {
		if(logList.size() != 0) {
			logList.remove(logList.size()-1);
			logList.add(info);
		}
	}
	public List<String> getLogList() {
		return this.logList;
	}
	
	
	/**
	 * 获取线程计算时间提示
	 * @return
	 */
	public String getCalculateTime() {
		if(cstart == null)
			return "";
		
		if(index == 0)
			return "正在计算剩余时间";
		
		double spend = (cpoint.getTimeInMillis() - cstart.getTimeInMillis()) / 1000;//从开始计算到计算当前对象花费时间(秒)
		double seconds = (((double)(itemCount - index)) / index) * spend;//剩余时间(秒)
		
		String msg = "预计剩余时间";
		//转换时间显示格式
		int hours = 0 , minutes = 0;
		if(seconds / 3600 > 0){
			hours = (int) (seconds / 3600);
			seconds = seconds %  3600;
			msg += hours + "小时";
		}
		
		if(seconds / 60 > 0){
			minutes = (int) (seconds / 60);
			seconds = (int)(seconds %  60);
			msg += minutes + "分钟";
		}
		
		msg += (int)seconds + "秒";
		
		return msg;
	}
	
	public String getException() {
		return exception;
	}

	public void setException(String exception) {
		this.exception = exception;
	}

	public int getItemCount() {
		return itemCount;
	}

	public void setItemCount(int itemCount) {
		this.itemCount = itemCount;
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
		cpoint = Calendar.getInstance();
	}

	public Calendar getCstart() {
		return cstart;
	}

	public void setCstart(Calendar cstart) {
		this.cstart = cstart;
	}

	public Calendar getCpoint() {
		return cpoint;
	}

	public void setCpoint(Calendar cpoint) {
		this.cpoint = cpoint;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		if(status == ThreadStatus.STATUS_RUNNING)
			cstart = Calendar.getInstance();
		this.status = status;
	}
	
}
