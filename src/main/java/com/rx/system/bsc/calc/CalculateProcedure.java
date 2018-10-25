package com.rx.system.bsc.calc;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import com.rx.framework.jdbc.JdbcManager;
import com.rx.system.bsc.calc.Context;
import com.rx.system.bsc.calc.parameter.ParameterHandler;
import com.rx.system.bsc.calc.parse.IExpression;
import com.rx.system.bsc.calc.parse.StackExpression;
import com.rx.system.bsc.calc.service.IDataSource;
import com.rx.system.bsc.calc.service.IDataSourceService;
import com.rx.system.bsc.calc.service.IMeasure;
import com.rx.system.bsc.calc.service.IMeasureService;
import com.rx.system.bsc.service.IBscProjectService;

/**
 * 平衡计分卡计算程序
 * 将前端指标录入的公式解析成可执行的SQL语法段,存储并执行
 * @author chenxd
 *
 */
public class CalculateProcedure extends Thread implements Procedure{
	
	protected Context context = null;//运行环境变量
	protected int 	  runStep = 0; //运行步骤
	
	protected IDataSourceService dataSourceService = null;//数据源操作接口
	protected IMeasureService measureService = null;//指标操作接口
	protected IBscProjectService bscProjectService = null; //方案操作接口
	
	//数据源缓存
	protected Map<String, IDataSource> dataScourceCache = new HashMap<String, IDataSource>();
	//指标缓存
	protected Map<String, IMeasure> measureCache = new HashMap<String, IMeasure>();
	
	
	protected ParameterHandler paramHandler = null;//参数解析类
	
	protected JdbcManager jdbcManager = null;
	
	protected String projectID = "";
	protected String monthID = "";
	
	protected String resultTable = "bsc_result";//结果表表名
	protected String commandTable = "bsc_proj_mea_cmd";//命令表表名
	
	protected boolean run = true;//线程是都继续运行
	
	private 	HttpSession 	session = null;
	protected 	ThreadStatus 	status 	= new ThreadStatus();
	
	public CalculateProcedure() {
	}
	
	public void setDataSourceService(IDataSourceService dataSourceService) {
		this.dataSourceService = dataSourceService;
	}

	public void setBscProjectService(IBscProjectService bscProjectService) {
		this.bscProjectService = bscProjectService;
	}

	public void setMeasureService(IMeasureService measureService) {
		this.measureService = measureService;
	}
	
	//初始化运行环境
	public void initContext(Context context) {
		status.addLogExecutInfo("正在初始化执行参数......");
		this.context = context;
		paramHandler = new ParameterHandler(context);
		this.projectID = this.context.getEnv("projectID");
		this.monthID = this.context.getEnv("monthID");
		status.addLogExecutInfo("初始化执行参数完成......");
	}
	
	/**
	 * 执行方法
	 */
	public void run() {
		try {
			//清除目标数据
			clearTargetData();
			
			//查询出所有需要计算的指标
			List<IMeasure> measureList = this.measureService.getMeasureByProjectId(this.projectID);
			
			//查询出方案指标
			List<Map<String, Object>> projMeasures = this.measureService.getProjectMeasure(this.projectID);
			
			status.addLogExecutInfo("正在解析底层指标计算公式......");
			status.setStatus(ThreadStatus.STATUS_RUNNING);//设置线程运行状态
			this.status.setItemCount(measureList.size()*2 + projMeasures.size()*2);
			parseLowLevelMeasure(measureList);
			
			//解析方案指标
			status.addLogExecutInfo("正在解析方案指标......");
			parseProjectMeasure(projMeasures);
			
			//刷新对象
			status.addLogExecutInfo("刷新对象列表......");
			bscProjectService.refreshProjectObjects(this.projectID);
			
			//执行解析出的公式SQL
			status.addLogExecutInfo("正在计算指标值......");
			executeLowLevelMeasure();
			
			executeProjectMeasure();
			
			this.status.addLogExecutInfo("正在完成方案计算......");
			this.session.setAttribute("status", this.status);
			
			if(this.status.getStatus() != ThreadStatus.STATUS_RUNNING){
				return;
			}
			//插入方案执行情况
			String info_sql = "insert into bsc_proj_exe_mth(project_id,month_id,is_cycle_end_mth,is_published) "
						+"values('"+this.projectID+"','"+this.monthID+"','"+isCycleEnd(this.monthID)+"','N')";
			this.jdbcManager.execute(info_sql);
			
			//归档历史数据
			archiveToHist();
			
			this.status.addLogExecutInfo("方案计算已完成......");
			this.status.setStatus(ThreadStatus.STATUS_STOP);//线程执行结束
			this.session.setAttribute("status", this.status);
		} catch (Exception e) {
			e.printStackTrace();
			this.status.setStatus(ThreadStatus.STATUS_EXCEPTION);//设置线程为异常状态
			this.status.addLogExecutInfo(e.getMessage());
			this.status.setException(e.getMessage());
			this.session.setAttribute("status", this.status);
		}
	}
	
	
	protected void clearTargetData() throws Exception{
		//执行方案前的准备操作(为以后数据库表建分区做准备)
		this.jdbcManager.execute("call usr_bsc_eng.prepareExecuteProject('"+this.projectID+"', '"+this.monthID+"')");
		
		//清空结果表
		this.jdbcManager.execute("delete from "+this.resultTable+" where project_id = '"+this.projectID+"' and month_id='"+this.monthID+"'");
		this.jdbcManager.execute("delete from bsc_proj_mea_obj_val where project_id='"+this.projectID+"' and month_id='"+this.monthID+"'");
		this.jdbcManager.execute("delete from bsc_proj_exe_mth where project_id = '"+this.projectID+"' and month_id='"+this.monthID+"'");
		
	}
	
	protected void parseLowLevelMeasure(List<IMeasure> measureList) throws Exception{
		runStep = 0;
		this.status.setIndex(runStep);
		this.session.setAttribute("status", this.status);
		
		//解析每个指标的执行命令并存入表中
		for (int i = 0; i < measureList.size() && this.run; i++) {
			IMeasure measure = measureList.get(i);
			String command = this.parseMeasure(measure);
			updateExeCommand(measure.getMeasureId(), command);
			measureCache.put(measure.getMeasureId(), measure);
			
			if(this.status.getStatus() != ThreadStatus.STATUS_RUNNING){
				return;
			}
			this.status.setIndex(++runStep);
			this.status.updateLogExecutInfo("正在解析底层指标计算公式......("+ (i+1) +"/"+measureList.size()+")");
			this.session.setAttribute("status", this.status);
		}
	}

	protected void parseProjectMeasure(List<Map<String, Object>> projMeasures) throws Exception{
		this.jdbcManager.execute("delete from bsc_proj_val_cmd where project_id='"+this.projectID+"'");
		for (int i = 0; i < projMeasures.size() && this.run; i++) {
			Map<String, Object> map = projMeasures.get(i);
			String meausre_id = map.get("measure_id").toString();
			
			String command = this.parseProjectMeasureFormula(meausre_id);
			this.insertProjectMeasureCommand(meausre_id, command);
			
			if(this.status.getStatus() != ThreadStatus.STATUS_RUNNING){
				return;
			}
			this.status.setIndex(++runStep);
			this.status.updateLogExecutInfo("正在解析方案指标......("+ (i+1) +"/"+projMeasures.size()+")");
			this.session.setAttribute("status", this.status);
		}	
	}

	@SuppressWarnings("unchecked")
	protected void executeLowLevelMeasure() throws Exception{
		String sql = "select * from " + this.commandTable + " where project_id='"+this.projectID+"' order by exe_order_id";
		List<Map<String, Object>> lowMeaCommandList = this.jdbcManager.queryForList(sql);
		
		if(this.status.getStatus() != ThreadStatus.STATUS_RUNNING){
			return;
		}
		
		for (int i = 0; i < lowMeaCommandList.size() && this.run; i++) {
			Map<String, Object> map = lowMeaCommandList.get(i);
			String command = String.valueOf(map.get("exe_command".toUpperCase()));
			command = this.replaceContextVar(command);
			this.jdbcManager.execute(command);
			
			if(this.status.getStatus() != ThreadStatus.STATUS_RUNNING){
				return;
			}
			this.status.setIndex(++runStep);
			this.status.updateLogExecutInfo("正在计算底层指标值......("+ (i+1) +"/"+lowMeaCommandList.size()+")");
			this.session.setAttribute("status", this.status);
		}
	}
	
	
	@SuppressWarnings("unchecked")
	protected void executeProjectMeasure() throws Exception{
		String bsc_sql = "select * from bsc_proj_val_cmd where project_id='"+this.projectID+"' order by exe_order_id";
		List<Map<String, Object>> projMeaCommandList = this.jdbcManager.queryForList(bsc_sql);
		
		//执行积分公式SQL
		for (int i = 0; i < projMeaCommandList.size() && this.run; i++) {
			Map<String, Object> map = projMeaCommandList.get(i);
			String command = String.valueOf(map.get("exe_command".toUpperCase()));
			command = this.replaceContextVar(command);
			this.jdbcManager.execute(command);
			
			if(this.status.getStatus() != ThreadStatus.STATUS_RUNNING){
				return;
			}
			this.status.setIndex(++runStep);
			this.status.updateLogExecutInfo("正在计算方案指标值......("+ (i+1) +"/"+projMeaCommandList.size()+")");
			this.session.setAttribute("status", this.status);
		}
	}
	
	protected void archiveToHist() throws Exception{
		this.status.addLogExecutInfo("正在归档历史数据......");
		this.session.setAttribute("status", this.status);
		
		if(this.status.getStatus() != ThreadStatus.STATUS_RUNNING){
			return;
		}
		this.jdbcManager.execute("call usr_bsc_eng.makeHistForProject('"+(this.monthID.length()==4?this.monthID+"01":this.monthID)+"','"+this.projectID+"')");
	}
	

	/**
	 * 根据指标解析出指标的公式SQL
	 * @param measure
	 * @param params
	 * @return
	 * @throws Exception
	 */
	protected String parseMeasure(IMeasure measure) throws Exception {
		String sql = "";
		if(measure.getSourceTypeId().equals(IMeasure.SOURCE_TYPE_DATASOURCE)) {
			//数据源指标
			sql = this.parseDataSourceMeasure(measure);
		}else if(measure.getSourceTypeId().equals(IMeasure.SOURCE_TYPE_COMPOUND)) {
			//复合指标
			sql = this.parseCompoundMeasure(measure);
		}else if(measure.getSourceTypeId().equals(IMeasure.SOURCE_TYPE_EXTERNAL)) {
			//导入指标
			sql = this.parseExternalMeasure(measure);
		}else if(measure.getSourceTypeId().equals(IMeasure.SOURCE_TYPE_FOLDER)) {
			throw new Exception("指标:"+measure.getMeasureName()+"["+measure.getMeasureId()+"]类型为分类目录,不能参与计算");
		}else
			throw new Exception("指标:"+measure.getMeasureName()+"["+measure.getMeasureId()+"]类型错误,不存在类型为["+measure.getSourceTypeId()+"]的指标");
		return sql;
		
	}
	
	/**
	 * 解析数据源指标
	 * @param measure
	 * @param params
	 * @return
	 * @throws Exception
	 */
	protected String parseDataSourceMeasure(IMeasure measure) throws Exception {
		String v_sourceID		=	measure.getSourceId();		//数据源ID
		String v_resultTypeID	=	measure.getResultTypeId();	//结果类型；00：集合；01：标量值		
		String v_formulaExpr	=	measure.getFormula();	//公式值
		
		//1. 预处理判断
		if (null == v_sourceID || null == v_resultTypeID || null == v_formulaExpr){
				throw new Exception("指标:["+measure.getMeasureName()+"] 配置不完整");
		}
		
		//2. 把公式中的大括号替换掉
		v_formulaExpr	=	v_formulaExpr.replaceAll("\\{", "").replaceAll("\\}", "");
		
		//3. 开始解析
		//3.1 查找数据源属性
		IDataSource dataSource = this.getDataSource(measure.getSourceId());
		String v_objectColumn	=	dataSource.getObjColumnName();
		String v_sourceExpr		=	dataSource.getExpression();
		
		//查找指标公式引用的参数
		List<String> paraIDs	=	measure.getParams();
		
		String exprProjectID	=	this.projectID;
		String exprMeasureID	=	measure.getMeasureId();
		String exprObjectID		=	"";
		String exprValue		=	"";		
		String exprFilter		=	"";
		
		//3.2 如果数据源是数据集, 则使用数据源定义的对象维度；否则使用固定值PARAMETER
		if ("00".equals(v_resultTypeID)){
			if (null != v_objectColumn){
				exprObjectID	=	v_objectColumn;
			}			
		}else {
			exprObjectID	=	"'"+ IMeasure.OBJ_NAME_SCALE_MEASURE +"'";
		}
		
		String[] formularExprs = v_formulaExpr.split("\\?");
		
		//3.3 设置值表达式
		if (formularExprs.length > 0){
			IExpression expr = new StackExpression(formularExprs[0]);
			
			expr.doParse();
			
			exprValue	=	expr.getParseResult();			
		}
		
		//3.4 设置过滤表达式
		if (formularExprs.length > 1){
			IExpression expr = new StackExpression(formularExprs[1]);
			
			expr.doParse();
			
			exprFilter	=	expr.getParseResult();
		}
		
		//3.5 替换参数名称
		for (int i = 0; i < paraIDs.size(); i++) {
			String paraID 	=	paraIDs.get(i);
			String paraExpr	=	"coalesce(p2."+paraID+",p1."+paraID+")";
			
			//[,$,]在正则表达式替换式需要转义
			exprValue	=	exprValue.replaceAll( "\\[\\$" + paraID + "\\]", paraExpr);
			exprFilter	=	exprFilter.replaceAll("\\[\\$" + paraID + "\\]", paraExpr);
		}
		
		//3.6 参数替换完毕后，需要把字段名两边的中括号替换掉
		//3.6.1 将表达式中的环境变量参数替换成具体的值
//		Iterator<String> iter = this.context.keySet().iterator();
//		while(iter.hasNext()) {
//			String key = iter.next();
//			String value = this.context.getEnv(key);
//			exprValue = exprValue.replaceAll("\\[\\%"+key+"\\]",value);
//			v_sourceExpr = v_sourceExpr.replaceAll("\\[\\%"+key+"\\]",value);
//			exprFilter = exprFilter.replaceAll("\\[\\%"+key+"\\]",value);
//		}
		
		//3.6.2 开始替换
		exprValue	=	exprValue.replaceAll("\\[", "").replaceAll("\\]", "");
		exprFilter	=	exprFilter.replaceAll("\\[", "").replaceAll("\\]", "");
		
		
		
		//4. 拼接SQL语句
		String sqlStat = "insert into "+this.resultTable+" (month_id,project_id,measure_id,object_id,value)" +
					"select " +
					"'[%monthID]' as month_id," +
					"a.project_id 			 as project_id," +
					"'" + exprMeasureID + "' as measure_id," +
					"a.object_id			 as object_id," +
//					"'"+this.isPublished+"'			 as is_published," +
					"nvl(sum(" + exprValue + "),0) as value " +
					"from bsc_proj_obj a left join (" + v_sourceExpr
					;
		
		//4.1 如果存在过滤条件，则添加过滤条件
		if (null != exprFilter && !"".equals(exprFilter)) {
			sqlStat	= sqlStat + " and (" + exprFilter+") ";
		}
		
		sqlStat = sqlStat + ") m ";
		
		//4.2 如果数据源是数据集, 则使用数据源定义的对象维度；否则使用笛卡尔积
		if ("00".equals(v_resultTypeID)){
			sqlStat	= sqlStat + " on a.object_id = m." + exprObjectID;
		}
		else{
			sqlStat	= sqlStat + " on 1=1";
		}
		
		//4.1 如果存在参数，则需要连接参数表
		if (paraIDs.size() > 0){
			
			sqlStat	= sqlStat 
				+ " left join (" + this.paramHandler.getParameterSource(paraIDs)  + ") p1 on 1 = 1"
				+ " left join (" + this.paramHandler.getObjParaSource(paraIDs)    + ") p2 on a.object_id=p2.object_id"
				;
		}
		
		sqlStat = sqlStat + " where a.project_id = '" + exprProjectID + "' group by a.project_id,a.object_id ";	
		
		return sqlStat;
	}
	
	/**
	 * 解析复合指标
	 * @param measure
	 * @param params
	 * @return
	 * @throws Exception
	 */
	protected String parseCompoundMeasure(IMeasure measure) throws Exception {
		String v_resultTypeID = measure.getResultTypeId(); // 结果类型；00：集合；01：标量值
		String v_formulaExpr = measure.getFormula(); // 公式值

		// 1. 预处理判断
		if (null == v_resultTypeID || null == v_formulaExpr) {
			throw new Exception("指标:["+measure.getMeasureName()+"] 配置不完整");
		}

		// 2. 把公式中的大括号替换掉
		v_formulaExpr = v_formulaExpr.replaceAll("\\{", "").replaceAll("\\}","");

		// 3. 开始解析
		// 3.1 查找数据源属性，查找可能引用的参数
		List<String> paraIDs = measure.getParams();

		String exprProjectID = "";
		String exprMeasureID = "";
		String exprValue = "";
		String exprJoinClause = "";

		exprProjectID = this.context.getEnv("projectID");
		exprMeasureID = measure.getMeasureId();

		String[] formularExprs = v_formulaExpr.split("\\?");

		// 3.2 设置值表达式
		if (formularExprs.length > 0) {
			IExpression expr = new StackExpression(formularExprs[0]);

			expr.doParse();

			exprValue = expr.getParseResult();
		}
		
		List<IMeasure> relaMeasures = this.measureService.getRelaMeasure(measure.getMeasureId());
		// 3.4 连接各上游指标
		if (relaMeasures == null || relaMeasures.size() == 0) {
			throw new Exception("复合指标:["+measure.getMeasureName()+"]公式配置错误,没有依赖的指标");
		}

		for (int i = 0; i < relaMeasures.size(); i++) {
			IMeasure relaMeasure = relaMeasures.get(i);
			String relyMeasureID = relaMeasure.getMeasureId();
			String relyResultTypeID = relaMeasure.getResultTypeId();

			// 替换表达式中的指标名称，为数据库字段名称
			exprValue = exprValue.replaceAll("\\[@" + relyMeasureID+ "\\]", "m" + i + ".value");

			String meaSource = this.getMeasureResultSQL(relaMeasure);

			exprJoinClause = exprJoinClause + " left join (" + meaSource+ ") m" + i + " on ";

			// 如果指标是标量指标，则使用笛卡尔积联合
			String joinStr = "";
			if ("01".equals(relyResultTypeID)) {
				joinStr = "1=1";
			} else {
				joinStr = "a.object_id = m" + i + ".object_id";
			}

			exprJoinClause = exprJoinClause + joinStr + " \n";
		}

		// 3.5 替换参数名称
		for (int i = 0; i < paraIDs.size(); i++) {
			String paraID = paraIDs.get(i);
			String paraExpr = "coalesce(p2." + paraID + ",p1." + paraID + ")";

			// [,$,]在正则表达式替换式需要转义
			exprValue = exprValue.replaceAll("\\[\\$" + paraID + "\\]",paraExpr);
		}

		// 4. 拼接SQL语句
		String sqlStat = "insert into "+this.resultTable+" (month_id,project_id,measure_id,object_id,value)\n"
				+ "select "
				+ "'[%monthID]' as month_id,"
				+ "a.project_id			   as project_id,"
				+ "'"+ exprMeasureID+ "' as measure_id,"
				+ "a.object_id  as object_id,\n"
				+ "nvl("+ exprValue+ ",0) as value \n"
				+ "from bsc_proj_obj a " + exprJoinClause;

		// 4.1 如果存在参数，则需要连接参数表
		if (paraIDs.size() > 0) {
			
			sqlStat	= sqlStat 
				+ " left join (" + this.paramHandler.getParameterSource(paraIDs)  + ") p1 on 1 = 1"
				+ " left join (" + this.paramHandler.getObjParaSource(paraIDs)    + ") p2 on a.object_id=p2.object_id";
		}

		sqlStat = sqlStat + " where a.project_id='" + exprProjectID + "'";

		return sqlStat;
	}
	
	/**
	 * 解析导入指标
	 * @param measure
	 * @param params
	 * @return
	 * @throws Exception
	 */
	protected String parseExternalMeasure(IMeasure measure) throws Exception {
		String sql  = "insert into " + this.resultTable + "(month_id,project_id,measure_id,object_id,value)"
				+ "select "
				+ "'[%monthID]' as month_id,"
				+ "a.project_id as project_id, "
				+ "a.measure_id as measure_id,"
				+ "a.object_id  as object_id,"
				+ "nvl(a.value,0) as value "
				+ "from bsc_proj_mea_imp a "
				+ "where a.project_id = '"+this.projectID+"' and a.measure_id = '"+measure.getMeasureId()+"' "
				+ "and a.cycle_id = '"+this.getCycleIdByMonth(this.context.getEnv("cycleTypeID"), this.monthID)+"' "
				+ "and a.year_id = '"+this.monthID.substring(0, 4)+"' ";
		return sql;
	}
	
	/**
	 * 解析BSC积分公式
	 * @param formula
	 * @param referMeasures
	 * @return
	 * @throws Exception
	 */
	protected String parseProjectMeasureFormula(String measureID) throws Exception {
		String projectID = this.context.getEnv("projectID");

		StringBuilder sb = new StringBuilder();
		sb.append("insert into bsc_proj_mea_obj_val (month_id,project_id,measure_id,object_id,value)\n");
		sb.append("select ");
		sb.append("'[%monthID]' as month_id,");
		sb.append("a.project_id	as project_id,");
		sb.append("'"+ measureID + "' as measure_id,");
		sb.append("a.object_id  as object_id,\n");
		sb.append("c.value as value \n");
		sb.append("from bsc_proj_obj a ");
		sb.append(" left join ");
		sb.append(this.resultTable + " c ");
		sb.append("on month_id='[%monthID]' and c.project_id = a.project_id ");
		sb.append("and c.measure_id = '"+measureID+"'");
		sb.append(" and c.object_id = a.object_id ");
		sb.append(" where a.project_id='" + projectID + "'");
		
		return sb.toString();
	}
	
	/**
	 * 获取数据源对象
	 * @return
	 */
	protected IDataSource getDataSource(String sourceId) throws Exception{
		IDataSource dataSource = this.dataScourceCache.get(sourceId);
		if(dataSource == null) {
			dataSource = this.dataSourceService.getDataSourceById(sourceId);
			this.dataScourceCache.put(sourceId, dataSource);
		}
		return dataSource;
	}
	
	/**
	 * 返回指标结果集SQL
	 * @param measure
	 * @return
	 */
	protected String getMeasureResultSQL(IMeasure measure) {
		String v_sql = "select object_id,value from bsc_result where month_id='[%monthID]' and project_id='"
				+ this.projectID
				+ "' and measure_id = '" + measure.getMeasureId() + "'";

		// 如果指标是标量指标，则数据源再加上对象ID
		if ("01".equals(measure.getResultTypeId())) {
			v_sql = v_sql + " and object_id='"+ IMeasure.OBJ_NAME_SCALE_MEASURE + "'";
		}
		return v_sql;
	}
	
	/**
	 * 更新指标计算执行命令
	 * @param sql
	 * @throws Exception
	 */
	protected void updateExeCommand(String measure_id,String command) throws Exception {
		String sql = "update "+this.commandTable+" set exe_command='"+command.replaceAll("'", "''")+"' where project_id='"+this.projectID+"' and measure_id='"+measure_id+"'";
		this.jdbcManager.execute(sql);
	}
	
	/**
	 * 插入方案指标计算命令
	 * @param measure_id
	 * @param command
	 * @throws Exception
	 */
	protected void insertProjectMeasureCommand(String measure_id, String command) throws Exception {
		String sql = "insert into bsc_proj_val_cmd(project_id,measure_id,exe_order_id,exe_command) "
					+"values('"+this.projectID+"','"+measure_id+"','1','"+command.replaceAll("'", "''")+"')";
		this.jdbcManager.execute(sql);
	}
	
	/**
	 * 根据周期类型和月份 获取周期ID
	 * @param cycleTypeId
	 * @param monthId
	 * @return
	 */
	protected String getCycleIdByMonth(String cycleTypeId, String monthId) {
		int month = 0;
		String cycleId = "";
		if("00".equals(cycleTypeId)) {
			month = Integer.parseInt(monthId.substring(4));
			//月份
			cycleId = String.valueOf(month);
		}else if("01".equals(cycleTypeId)) {
			month = Integer.parseInt(monthId.substring(4));
			//季度
			cycleId = String.valueOf(month/3 + (month%3 > 0 ? 1 : 0));
		}else {
			//年份
			cycleId = "1";
		}
		return cycleId;
	}
	
	/**
	 * 替换执行命令中的环境变量,将传入字符串转换为可执行SQL
	 * @param command
	 * @return
	 */
	protected String replaceContextVar(String command) {
		Iterator<String> keyIter = this.context.keySet().iterator();
		while(keyIter.hasNext()) {
			String key = keyIter.next();
			String value = this.context.getEnv(key);
			command = command.replaceAll("\\[\\%"+key+"\\]", value);
		}
		return command;
	}
	
	public String isCycleEnd(String monthId) {
		String cycleTypeId = this.context.getEnv("cycleTypeID");
		int t = 1;
		int m = 0;
		if("00".equals(cycleTypeId)) {
			//月份
			t = 1;
			m = Integer.parseInt(monthId.substring(4));
		}else if("01".equals(cycleTypeId)) {
			//季度
			t = 3;
		}else {
			//年份
			t = 12;
		}
		
		if(m%t == 0)
			return "Y";
		
		return "N";
	}
	
	public void setJdbcManager(JdbcManager jdbcManager) {
		this.jdbcManager = jdbcManager;
	}

	
	public ThreadStatus query() {
		return this.status;
	}
	

	public void setThreadStop() {
		this.run = false;
	}
	
	public void setSession(HttpSession session)
	{
		this.session = session;
	}
	
	public HttpSession getSession()
	{
		return this.session;
	}
}
