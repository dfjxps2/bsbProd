package com.rx.system.bsc.action;

import java.util.HashMap;
import java.util.Map;

import com.rx.framework.jdbc.JdbcManager;
import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.calc.CalculateProcedure;
import com.rx.system.bsc.calc.Context;
import com.rx.system.bsc.calc.ThreadStatus;
import com.rx.system.bsc.calc.service.IDataSourceService;
import com.rx.system.bsc.calc.service.IMeasureService;
import com.rx.system.bsc.service.IBscProjectService;
/**
 * 平衡计分卡方案执行Action
 * @author chenxd
 *
 */
@SuppressWarnings("serial")
public class BscProcedureExecuteAction extends BaseDispatchAction {
	
	private IMeasureService measureService = null;
	private IDataSourceService dataSourceService = null;
	private IBscProjectService bscProjectService = null;
	private JdbcManager jdbcManager = null;
	
	/**
	 * 执行方案
	 */
	@FunDesc(code="BSC_0017")
	@UseLog
	public String execute() throws Exception {
		
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			CalculateProcedure procedure = new CalculateProcedure();
			procedure.setBscProjectService(bscProjectService);
			procedure.setDataSourceService(dataSourceService);
			procedure.setMeasureService(measureService);
			
			procedure.setJdbcManager(this.jdbcManager);
			Context context = new Context();
			context.put("monthID", getStringValue(paramMap, "monthID"));
			context.put("projectID", getStringValue(paramMap, "projectID"));
			context.put("cycleTypeID", getStringValue(paramMap, "cycleTypeID"));
			context.put("is_published", "N");
			procedure.initContext(context);
			
			session.removeAttribute("status");
			procedure.setSession(session);
						
			procedure.start();
			doSuccessInfoResponse("");
		} catch (Exception e) {
			e.printStackTrace();
			session.removeAttribute("status");
			doFailureInfoResponse("执行失败:" + e.getMessage());
		}
		return null;
	}
	
	/**
	 * 查询方案执行状态
	 * @return
	 * @throws Exception
	 */
	public String queryStatus() throws Exception {
		ThreadStatus status = (ThreadStatus) session.getAttribute("status");
		
		Map<String, Object> results = new HashMap<String, Object>();
		
		results.put("count", status.getItemCount());
		results.put("index", status.getIndex());
		results.put("time", status.getCalculateTime());
		results.put("state", status.getStatus());
		results.put("exception", status.getException());
		results.put("success", true);
		results.put("log", status.getLogList());
		
		doJSONResponse(results);
		
		return null;
		
	}
	
	/**
	 * 停止执行方案
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0018")
	@UseLog
	public String stop() throws Exception {
		ThreadStatus status = (ThreadStatus) session.getAttribute("status");
		try {
			if(status != null) {
				status.setStatus(ThreadStatus.STATUS_STOP);
				session.removeAttribute("status");
			}
			doSuccessInfoResponse("");
		} catch (Exception e) {
			session.removeAttribute("status");
			e.printStackTrace();
			doFailureInfoResponse(e.getMessage());
		}
		return null;
	}

	public void setMeasureService(IMeasureService measureService) {
		this.measureService = measureService;
	}

	public void setDataSourceService(IDataSourceService dataSourceService) {
		this.dataSourceService = dataSourceService;
	}
	
	public void setBscProjectService(IBscProjectService bscProjectService){
		this.bscProjectService = bscProjectService;
	}

	public void setJdbcManager(JdbcManager jdbcManager) {
		this.jdbcManager = jdbcManager;
	}
}
