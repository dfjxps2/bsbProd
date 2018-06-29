package com.rx.system.bsc.service.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.calc.parse.IExpression;
import com.rx.system.bsc.calc.parse.StackExpression;
import com.rx.system.bsc.dao.PublicMeasureDao;
import com.rx.system.bsc.service.IPublicMeasureService;
import com.rx.system.util.CommonUtil;
import com.rx.system.util.GlobalUtil;

/**
 * 指标操作Service实现类
 * @author chenxd
 *
 */
public class PublicMeasureServiceImpl extends BaseService implements IPublicMeasureService {
	
	private PublicMeasureDao publicMeasureDao = null;
	
	/**
	 * 添加指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void addEngMeasure(Map<String, Object> paramMap) throws Exception {
		paramMap.put("obj_cate_id", paramMap.get("obj_cate_id").toString());
		
		this.publicMeasureDao.addEngMeasure(paramMap);
		this.jdbcManager.execute("call usr_bsc_eng.pbsc_measure_cascade()");
		this.jdbcManager.execute("call usr_bsc_eng.pbsc_measure_order()");
	}
	
	/**
	 * 编辑指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void editEngMeasure(Map<String, Object> paramMap) throws Exception {
		this.publicMeasureDao.editEngMeasure(paramMap);
		this.jdbcManager.execute("call usr_bsc_eng.pbsc_measure_order()");
	}
	
	/**
	 * 编辑指标公式
	 * @param paramMap
	 * @throws Exception
	 */
	public void editEngMeasureFormula(Map<String, Object> paramMap) throws Exception {
//		this.addDependMeasure(paramMap);
		String formula = new String(getStringValue(paramMap, "formula_expr"));		
		IExpression expression = new StackExpression(formula); 
		if(!expression.doParse())
			throw new Exception("指标公式解析错误,保存失败");
		
		/**
		 * edit by yangxuan
		 * 如果指标公式中存在参数则维护指标参数关系
		 * */
		String meaId = getStringValue(paramMap,"measure_id");
		
		String measureId = "";
		
		List<String> relaMeasureIdList = new ArrayList<String>();
		while(!(measureId = CommonUtil.getParam(formula, "[@", "]")).equals("")) {
			String measureName = this.publicMeasureDao.getMeasureName(measureId);
			formula = CommonUtil.replace(formula, "[@"+measureId+"]", "["+measureName+"]");
			relaMeasureIdList.add(measureId);
		}
		
		Connection conn = null;
		try {
			conn = this.jdbcManager.getConnection();
			CallableStatement callback = conn.prepareCall("call usr_bsc_eng.hasCycle(?,?,?)");
			
			for (String relaId : relaMeasureIdList) {
				callback.setString(1, meaId);
				callback.setString(2, relaId);
				callback.registerOutParameter(3, Types.NUMERIC);
				
				callback.execute();
				
				int status = callback.getInt(3);
				if(status == 1)
					throw new Exception("指标公式中引用指标 ["+relaId+"] 时存在引用环路!");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}finally{
			if(conn != null && !conn.isClosed())
				conn.close();
		}
		
		this.publicMeasureDao.removeDependMeasure(paramMap);
		for (String relaId : relaMeasureIdList) {
			paramMap.put("rely_measure_id", relaId);
			this.publicMeasureDao.addDependMeasure(paramMap);
		}
		
		Map<String,String> m2 = new HashMap<String,String>();
		m2.put("measure_id", meaId);
		
		this.publicMeasureDao.deleteMeasureParam(meaId);
		
		String paramId = "";
		while(!(paramId = CommonUtil.getParam(formula, "[$", "]")).equals("")) {
			m2.put("parameter_id",paramId);
			String paramName = this.publicMeasureDao.getParamName(paramId);
			formula = formula.replace("[$"+paramId+"]", "["+paramName+"]");
			this.publicMeasureDao.insertMeasureParam(m2);
		}
		paramMap.put("formula_desc", formula);
		this.publicMeasureDao.editEngMeasureFormula(paramMap);
	}
	
	/**
	 * 删除指标
	 * @param paramMap
	 * @throws Exception
	 */
	public Map<String,Object> deleteEngMeasure(Map<String, Object> paramMap) throws Exception {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		CallableStatement call = null;
		Connection conn = null;
		
		try {
			conn = this.jdbcManager.getConnection();
			call = conn.prepareCall("{call usr_bsc_eng.findMeasureRelationship(?,?,',',';')}");
			call.setString(1, paramMap.get("measure_id").toString());
			call.registerOutParameter(2, Types.VARCHAR);
			call.execute();
			String result = call.getString(2);
			if(result!=null){
				throw new Exception(result);
			}
		} catch (Exception e) {
//			e.printStackTrace();
//			resultMap.put("showType", "panel");
			String info = this.parsetoString(e.getMessage());
			resultMap.put("info", info);
			resultMap.put("success", Boolean.valueOf(false));
			return resultMap;
		}finally{
			if(call!=null)
				call.close();
			if(conn!=null && !conn.isClosed())
				conn.close();
		}
//		if(this.publicMeasureDao.getSubNodeCount(paramMap) > 0) {
//			String info = "该指标存在下级指标,不能删除.请先删除下级指标后再试!";
//			resultMap.put("showType", "alert");
//			resultMap.put("info", info);
//			resultMap.put("success", Boolean.valueOf(false));
//			return resultMap;
//		}
		this.publicMeasureDao.removeDependMeasure(paramMap);
		this.publicMeasureDao.deleteEngMeasure(paramMap);
		this.jdbcManager.execute("call usr_bsc_eng.pbsc_measure_cascade()");
		this.jdbcManager.execute("call usr_bsc_eng.pbsc_measure_order()");
		resultMap.put("success",Boolean.valueOf(true));
		return resultMap;
	}
	
	/**
	 * 获取基础指标列表
	 * @param measure
	 * @throws Exception
	 */
	public List<Map<String, Object>> listBaseEngMeasure(Map<String, Object> paramMap) throws Exception {
		paramMap.put("is_private", "0");
		return toLowerMapList(this.publicMeasureDao.listEngMeasure(paramMap));
	}
	
	/**
	 * 获取私有指标列表
	 * @param measure
	 * @throws Exception
	 */
	public List<Map<String, Object>> listEngMeasure(Map<String, Object> paramMap) throws Exception {
		paramMap.put("is_private", "1");
		return toLowerMapList(this.publicMeasureDao.listEngMeasure(paramMap));
	}
	
	/**
	 * 通过Id查询指标
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getEngMeasureById(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.publicMeasureDao.getEngMeasureById(paramMap));
	}
	
	/**
	 * 查询指标计算依赖的指标[运算下级指标]
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listMeasureCalcDepend(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.publicMeasureDao.listMeasureCalcDepend(paramMap));
	}
	
	/**
	 * 添加指标运算依赖的指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void addDependMeasure(Map<String, Object> paramMap) throws Exception {
		String relaMeasureId = getStringValue(paramMap, "relaMeasureId");
		this.publicMeasureDao.removeDependMeasure(paramMap);
		if(GlobalUtil.trimToNull(relaMeasureId) != null) {
			String[] relaMeasureIdArray = relaMeasureId.replaceFirst(",", "").split(",");
			for (int i = 0; i < relaMeasureIdArray.length; i++) {
				paramMap.put("rely_measure_id", relaMeasureIdArray[i]);
				this.publicMeasureDao.addDependMeasure(paramMap);
			}
		}
	}
	
	/**
	 * 删除指标运算依赖的指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void removeDependMeasure(Map<String, Object> paramMap)
			throws Exception {
		this.publicMeasureDao.removeDependMeasure(paramMap);
	}

	/**
	 * 指标校验
	 */
	public int checkMeasure(Map<String, Object> paramMap)
			throws Exception {
		
		return publicMeasureDao.checkMeasure(paramMap);
	}

	public void setPublicMeasureDao(PublicMeasureDao publicMeasureDao) {
		this.publicMeasureDao = publicMeasureDao;
	}

	public int getSubNodeCount(Map<String, Object> paramMap) throws Exception {
		return this.publicMeasureDao.getSubNodeCount(paramMap);
	}


	
}
