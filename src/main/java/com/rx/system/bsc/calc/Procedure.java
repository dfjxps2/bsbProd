package com.rx.system.bsc.calc;
/**
 * 任务接口,实现此接口获取线程的执行状态对象
 *
 */
public interface Procedure {
	
	//获取线程执行状态
	public ThreadStatus query();
	
	//停止线程
	public void stop();
	
	//停止线程
	public void setThreadStop();
	
}
