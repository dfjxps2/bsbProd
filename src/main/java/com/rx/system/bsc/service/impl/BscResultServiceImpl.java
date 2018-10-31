package com.rx.system.bsc.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.BscResultDao;
import com.rx.system.bsc.service.IBscResultService;
/**
 * 平衡计分卡考核结果Service实现类
 * @author chenxd
 *
 */
public class BscResultServiceImpl extends BaseService implements IBscResultService {
	
	private BscResultDao bscResultDao = null;
	
	public void setBscResultDao(BscResultDao bscResultDao) {
		this.bscResultDao = bscResultDao;
	}
	
	/**
	 * 发布平衡计分卡结果
	 * @param paramMap
	 * @throws Exception
	 */
	public void publishBscResult(Map<String, Object> paramMap) throws Exception {
		this.bscResultDao.publishBscResult(paramMap);
	}
	
	
	/**
	 * 行列转换
	 * @param dataList
	 * @param primaryKeys
	 * @param columnName
	 * @return 
	 * @throws Exception
	 */
	protected List<Map<String, Object>> columnToRow(List<Map<String, Object>> dataList, String[] primaryKeys,String[] columnName) throws Exception {
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
		List<Map<String, Object>> groupList = null;
		while((groupList = this.getGroupList(dataList, primaryKeys)).size() > 0) {
			Map<String, Object> entry = new HashMap<String, Object>(groupList.get(0));
			for (Map<String, Object> map : groupList) {
				entry.put(getStringValue(map, columnName[0]), getStringValue(map, columnName[1]));
			}
			resultList.add(entry);
		}
		return resultList;
	}
	
	/**
	 * 获取分组列表
	 * @param dataList
	 * @param groupKeys
	 * @return
	 * @throws Exception
	 */
	private List<Map<String, Object>> getGroupList(List<Map<String, Object>> dataList, String[] groupKeys) throws Exception {
		List<Map<String, Object>> groupList = new ArrayList<Map<String, Object>>();
		if (dataList.size() > 0) {
			
			Map<String, Object> baseMap = dataList.get(0);
			
			for (Map<String, Object> map : dataList) {
				boolean equals = true;
				for (String key : groupKeys) {
					if (!getStringValue(baseMap, key).equals(getStringValue(map, key))) {
						equals = false;
						break;
					}
				}
				if (equals)
					groupList.add(map);
			}
			
		}
		
		for (Map<String, Object> map : groupList) {
			dataList.remove(map);
		}
		return groupList;
	}
	
	
	/**
	 * 获取方案积分前十图形展示数据列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getTopPoint(Map<String, Object> paramMap) throws Exception {
		paramMap.put("top", "true");
		return toLowerMapList(this.bscResultDao.listResult(paramMap));
	}
	
	/**
	 * 图表等级分布查询
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getLevelList(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscResultDao.getLevelList(paramMap));
	}
	
	
	/**
	 * 获取考核对象明细结果
	 * @param paramMap
	 * @throws Exception
	 */
	public List<Map<String, Object>> getBscResultDetail(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscResultDao.getBscResultDetail(paramMap));
	}
	
	/**
	 * 查询考核积分维度占比
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> dimRsult(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscResultDao.dimRsult(paramMap));
	}
	
	/**
	 * 查询各考核对象的方案得分
	 */
	public List<Map<String, Object>> listScoreResult(
			Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String case_sql = "";
		for (int i = 0; i < measureList.size(); i++) {
			Map<String, Object> map = measureList.get(i);
			String measure_id = getStringValue(map,"measure_id");
			
			case_sql += "sum(case when b.measure_id ='"+measure_id+"' then b.value else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				case_sql += ",";
		}
		paramMap.put("case_sql", case_sql);
		return toLowerMapList(this.bscResultDao.listScoreResult(paramMap));
	}

	/**
	 * 查询各考核对象的方案得分总数
	 */
	public String listScoreResultCount(Map<String, Object> paramMap)
			throws Exception {
		return this.bscResultDao.listScoreResultCount(paramMap);
	}	
	

	public List<Map<String, Object>> listScoreTotalResult(
			Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String case_sql = "";
		for (int i = 0; i < measureList.size(); i++) {
			Map<String, Object> map = measureList.get(i);
			String measure_id = getStringValue(map,"measure_id");
			
			case_sql += "sum(case when b.measure_id ='"+measure_id+"' then b.value else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				case_sql += ",";
		}
		paramMap.put("case_sql", case_sql);
		return toLowerMapList(this.bscResultDao.listScoreTotalResult(paramMap));
	}

	/**
	 * 图表排名
	 */
	public List<Map<String, Object>> getScoreTopPoint(
			Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscResultDao.getScoreTopPoint(paramMap));
	}

	/**
	 * 是否可以公布计分卡方案（公布的月份是否是周期期末月份）
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public String canPublish(Map<String, Object> paramMap) throws Exception {
		return this.bscResultDao.canPublish(paramMap);
	}

	
	public List<Map<String, Object>> getCompareDetailProjectScore(Map<String, Object> paramMap)
			throws Exception {
		return this.toLowerMapList(this.bscResultDao.getCompareDetailProjectScore(paramMap));
	}

	public List<Map<String, Object>> listScoreSubResult(
			Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String case_sql = "";
		for (int i = 0; i < measureList.size(); i++) {
			Map<String, Object> map = measureList.get(i);
			String measure_id = getStringValue(map,"measure_id");
			
			case_sql += "sum(case when b.measure_id ='"+measure_id+"' then b.value else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				case_sql += ",";
		}
		paramMap.put("case_sql", case_sql);
		return this.toLowerMapList(bscResultDao.listScoreSubResult(paramMap));
	}

	public List<Map<String, Object>> listProjectMeasure(
			Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> retList = bscResultDao.listProjectMeasure(paramMap);
		return this.toLowerMapList(retList);
	}

	@Override
	public List<Map<String, Object>> getProjectResultMeasure(Map<String, Object> paramMap) throws Exception {
		return this.toLowerMapList(bscResultDao.getProjectResultMeasure(paramMap));
	}

	public List<Map<String, Object>> listSubMeasure(Map<String, Object> paramMap)
			throws Exception {
		return this.toLowerMapList(bscResultDao.listSubMeasure(paramMap));
	}
	
	//通过指标编号查询指标信息 
	public List<Map<String, Object>> listProjectMeasureByIndexId(
			Map<String, Object> paramMap) throws Exception {
		return this.toLowerMapList(bscResultDao.listProjectMeasureByIndexId(paramMap));
	}

	@Override
	public List<Map<String, Object>> getProjectResultMeasureByIndexId(Map<String, Object> paramMap) throws Exception {
		return this.toLowerMapList(bscResultDao.getProjectResultMeasureByIndexId(paramMap));
	}

	private void add_measure_case_sql(Map<String, Object> paramMap){
		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String case_sql = "";
		for (int i = 0; i < measureList.size(); i++) {
			Map<String, Object> map = measureList.get(i);
			String measure_id = getStringValue(map,"measure_id");

			case_sql += "sum(case when b.measure_id ='"+measure_id+"' then b.value else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				case_sql += ",";
		}
/*		String project_id = paramMap.get("project_id").toString();
		String tId = paramMap.get("tId").toString();
		String oId = paramMap.get("oId").toString();
		StringBuffer sb = new StringBuffer();
		sb.append(" select c.cycle_id as month_id,c.cycle_id||'年' as month_name,");
		sb.append(" max(t.object_name) object_name,");
		sb.append(" "+case_sql+"");
		sb.append(" from bsc_proj_obj_h t inner join  bsc_proj_stat_cyc c ");
		sb.append(" on t.project_id =c.project_id and t.year_id =c.cycle_id");
		sb.append(" left join bsc_proj_mea_obj_val b  on  t.project_id =  b.project_id");
		sb.append("and t.object_id = b.object_id and t.year_id=b.month_id");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and b.month_id in ("+tId+")");
		}

		sb.append("where t.project_id ='"+project_id+"'");

		if(oId !=oId && !"".equals(oId)){
			sb.append(" and t.object_id in  ("+oId+")");
		}
		if(oId !=tId && !"".equals(tId)){
			sb.append(" and t.year_id in   ("+tId+")");
		}

		sb.append(" group by c.cycle_id order by c.cycle_id  desc");
		String sql = sb.toString();
		System.out.println("sql="+sql);*/

		paramMap.put("case_sql", case_sql);
//		paramMap.put("sql", sql);
	}
	/**
	 * 查询各考核对象的方案得分
	 */
	@Override
	public List<Map<String, Object>> listScoreResultByYear(
			Map<String, Object> paramMap) throws Exception {
		add_measure_case_sql(paramMap);
		return toLowerMapList(this.bscResultDao.listScoreResultByYear(paramMap));
	}
	@Override
	public List<Map<String, Object>> listScoreTotalResultByObj(
			Map<String, Object> paramMap) throws Exception {
		add_measure_case_sql(paramMap);
		return toLowerMapList(this.bscResultDao.listScoreTotalResultByObj(paramMap));
	}
	@Override
	public List<Map<String, Object>> listScoreTotalResultByYear(
			Map<String, Object> paramMap) throws Exception {
		add_measure_case_sql(paramMap);
		return toLowerMapList(this.bscResultDao.listScoreTotalResultByYear(paramMap));
	}
	/**
	 * 查询各考核对象的方案得分总数
	 */
	@Override
	public String listScoreResultCountExt(Map<String, Object> paramMap)
			throws Exception {
		String show_id = getStringValue(paramMap, "show_id");
		if(show_id.equals("1"))
			return this.bscResultDao.listScoreResultCountByYear(paramMap);
		else
			return this.bscResultDao.listScoreResultCount(paramMap);
	}
	@Override
	public List<Map<String, Object>> listScoreSubResultExt(
			Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String case_sql = "";
		for (int i = 0; i < measureList.size(); i++) {
			Map<String, Object> map = measureList.get(i);
			String measure_id = getStringValue(map,"measure_id");

			case_sql += "sum(case when b.measure_id ='"+measure_id+"' then b.value else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				case_sql += ",";
		}
		paramMap.put("case_sql", case_sql);
		String show_id = getStringValue(paramMap, "show_id");
		if(show_id.equals("2"))
			return this.toLowerMapList(bscResultDao.listScoreSubResultByYear(paramMap));
		else
			return this.toLowerMapList(bscResultDao.listScoreSubResult(paramMap));
	}


	/**
	 * 根据年份查询全部积分结果
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */

	@Override
	public List<Map<String, Object>> getResultDhtmlYearByParam(Map<String, Object> paramMap) throws Exception {
		String sql = getResultDhtmlYearSql(paramMap);
		paramMap.put("sql", sql);
		return this.toLowerMapList(bscResultDao.getResultDhtmlYearByParam(paramMap));
	}

	/**
	 * 根据维度查询全部积分结果
	 * 增加地区代码： 2统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */

	@Override
	public List<Map<String, Object>> getResultDhtmlOjbectByParam(Map<String, Object> paramMap) throws Exception {
		String sql = getResultDhtmlOjbectBySql(paramMap);
		paramMap.put("sql",sql);
		List<Map<String, Object>> retList = this.toLowerMapList(bscResultDao.getResultDhtmlOjbectByParam(paramMap));
		return retList;
	}

	/**
	 *
	 *
	 1统计维度-》统计维度（单）-》 统计年份（多）-》指标（多）
	 2统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
	 showID
	 年份单选monthSelector1   多monthSelector2（monthBox2）
	 统计维度单选 objSelector2 （objBox2）      多objSelector1
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */

	@Override
	public String getResultDhtmlCountByCondExt(Map<String, Object> paramMap) throws Exception {
		String sql = null;
		String show_id = getStringValue(paramMap, "show_id");
		StringBuffer sb = new StringBuffer();
		if(show_id.equals("1")) {
			 sql = getResultDhtmlYearSqlCnt(paramMap);
			 paramMap.put("case_sql",sql);
			return this.bscResultDao.getResultDhtmlYearCountByCondExt(paramMap);
		}else{
			 sql = getResultDhtmlOjbectBySqlCnt(paramMap);
			paramMap.put("case_sql",sql);
			return this.bscResultDao.getResultDhtmlObjCountByCondExt(paramMap);
		}
	}

	@Override
	public List<Map<String, Object>> getZoneNameByZoneID(Map<String, Object> paramMap) throws Exception {
		return this.toLowerMapList(bscResultDao.getZoneNameByZoneID(paramMap));
	}

	@Override
	public List<Map<String, Object>> getResultDhtmlYearByParamInfo(Map<String, Object> paramMap) throws Exception {
		String sql = getResultDhtmlYearSql(paramMap);
		paramMap.put("sql", sql);
		return this.toLowerMapList(bscResultDao.getResultDhtmlYearByParamInfo(paramMap));
	}

	@Override
	public List<Map<String, Object>> getResultDhtmlOjbectByParamInfo(Map<String, Object> paramMap) throws Exception {
		String sql = getResultDhtmlOjbectBySql(paramMap);
		paramMap.put("sql",sql);
		List<Map<String, Object>> retList = this.toLowerMapList(bscResultDao.getResultDhtmlOjbectByParamInfo(paramMap));
		return retList;
	}

	/**
	 *  1统计维度-》统计维度（单）-》 统计年份（多）-》指标（多）
	 * 	2统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
	 * 	 showID
	 * 	 年份单选monthSelector1   多monthSelector2（monthBox2）
	 * 	 统计维度单选 objSelector2 （objBox2）      多objSelector1
	 *
	 * @param paramMap
	 * @return
	 */
	private String  getResultDhtmlYearSqlCnt(Map<String, Object> paramMap){
		String project_id = paramMap.get("project_id").toString();
		String tId = paramMap.get("tId").toString();
		String oId = paramMap.get("oId").toString();
		String zId = paramMap.get("zId").toString();
		StringBuffer sb = new StringBuffer();
/*		sb.append(" select z.zone_cd,z.zone_cd_desc, tab.*");
		sb.append(" from B99_Zone_Cd z");
		sb.append(" inner join (");
		sb.append(" select t.year_id as month_id,");
//		sb.append(" select t.year_id as month_id,t.year_id||'年' as month_name,");
//		sb.append(" select c.cycle_id as month_id,c.cycle_id||'年' as month_name,");
		sb.append(" b.Region_Cd as zone_id,");
		sb.append(" max(t.object_name) object_name");
		sb.append(" from bsc_proj_obj_h t ");
*//*		sb.append(" from bsc_proj_obj_h t inner join  bsc_proj_stat_cyc c ");
		sb.append(" on t.project_id =c.project_id and t.year_id =c.cycle_id");*//*
		sb.append(" left join B04_BASE_DATA_TBL b  on t.project_id = b.data_col_id");
		sb.append(" and t.object_id = b.dim_cd and t.year_id=trim(b.data_cycle)");
		sb.append(" and b.Data_Col_Id ='"+project_id+"'");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(b.Data_Cycle) in ("+tId+")");
		}
		if(zId !=null && !"".equals(zId)){
			sb.append(" and b.Region_Cd in   ("+zId+")");
		}
		if(oId !=null && !"".equals(oId)){
			sb.append(" and b.Dim_Cd in   ("+oId+")");
		}

		sb.append("where t.project_id ='"+project_id+"'");

		if(null !=tId && !"".equals(tId)){
			sb.append(" and t.year_id in ("+tId+")");
		}
		if(oId !=null && !"".equals(oId)){
			sb.append(" and t.object_id in  ("+oId+")");
		}
		sb.append(" group by t.year_id, b.Region_Cd  ");
		sb.append(" ) tab  ");
		sb.append(" on z.zone_cd = tab.zone_id  ");*/


/*		sb.append("select decode(sign(count(distinct Region_Cd)-count(distinct data_cycle)),-1,count(distinct data_cycle),count(distinct Region_Cd)) as cnt  from b04_base_data_tbl  where data_col_id ='"+project_id+"'");
//		sb.append("select data_col_id from b04_base_data_tbl  where data_col_id ='"+project_id+"'");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(data_cycle) in ("+tId+")");
		}


		if(oId !=null && !"".equals(oId)){
			sb.append(" and trim(dim_cd) in  ("+oId+")");
		}

		if(zId !=null && !"".equals(zId)){
			sb.append(" and Region_Cd in  ("+zId+")");
		}*/



		sb.append("select b.Region_Cd ||'_'|| e2.DIM_CD_DESC as zone_cd_desc,						    ");
		sb.append("      p.sts_cycle_scope_desc as month_name,                                      ");
		sb.append("      max(e.Dim_Cd)||'_' ||e.dim_cd_desc as object_name  ");
		sb.append(" from b04_base_data_tbl b                                                        ");
		sb.append("inner join b04_data_col l on b.data_col_id = l.data_col_id                       ");
		sb.append("                         and l.data_col_id ='"+project_id+"'               	    ");
		sb.append("inner join B04_DATA_COL_ADIM_SCOPE e on b.data_col_id = e.data_col_id            ");
		sb.append("                                    and trim(b.dim_cd) = trim(e.dim_cd)          ");
		sb.append("                                    and l.dim_type_cd = e.dim_type_id            ");
		sb.append("                                    and e.data_col_id ='"+project_id+"'          ");

//		if(oId !=null && !"".equals(oId)){
		sb.append(" and e.Dim_Cd in  ("+oId+")");
//		}
		sb.append("inner join B04_DATA_COL_TM_SCOPE p on b.data_col_id = p.data_col_id              ");
		sb.append("        and trim(b.data_cycle) =trim(p.STS_CYCLE_SCOPE_CD)                       ");
		sb.append("                                  and p.data_col_id ='"+project_id+"'       	    ");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(p.sts_cycle_scope_cd) in ("+tId+")");
		}
		sb.append("inner join B04_DATA_COL_ADIM_SCOPE e2 on b.data_col_id = e2.data_col_id          ");
		sb.append("                     and trim(b.Region_Cd) =  trim(e2.dim_cd)                    ");
		sb.append("                                     and l.region_cd = e2.dim_type_id            ");
		sb.append("                                     and e2.data_col_id ='"+project_id+"'        ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and trim(e2.dim_cd) in   ("+zId+")");
		}
		sb.append("where b.data_col_id ='"+project_id+"'                                           ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and b.region_cd in   ("+zId+")");
		}
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(b.data_cycle) in ("+tId+")");
		}


//		if(oId !=null && !"".equals(oId)){
		sb.append(" and b.Dim_Cd in  ("+oId+")");
//		}


		sb.append("group by b.Region_Cd,                                                            ");
		sb.append("         E2.dim_cd_desc,                                                         ");
		sb.append("         e.Dim_Cd,                                                               ");
		sb.append("         e.Dim_Cd_Desc,                                                          ");
		sb.append("         p.sts_cycle_scope_desc                                                  ");
		String sql = sb.toString();
		System.out.println("sql="+sql);
		return  sql;
	}


	public String getMeasureStringBymeasureList(Map<String, Object> paramMap){
		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String sql = "";
		String measure_id = "";
		Map<String, Object> map = new HashMap<String, Object>();
		for (int i = 0; i < measureList.size(); i++) {
			map = measureList.get(i);
			measure_id = getStringValue(map,"measure_id");
			sql += "sum(case when b.ind_id ='"+measure_id+"' then b.ind_val else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				sql += ",";
		}
		return sql;
	}
	/**
	 	1统计维度-》统计维度（单）-》 统计年份（多）-》指标（多）
	 * 	showID
	 * 		年份单选monthSelector1   多monthSelector2（monthBox2）
	 * 		统计维度单选 objSelector2 （objBox2）      多objSelector1
	 * @param paramMap
	 * @return
	 */
	private String  getResultDhtmlYearSql(Map<String, Object> paramMap){
/*		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String case_sql = "";
		for (int i = 0; i < measureList.size(); i++) {
			Map<String, Object> map = measureList.get(i);
			String measure_id = getStringValue(map,"measure_id");
			case_sql += "sum(case when b.ind_id ='"+measure_id+"' then b.ind_val else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				case_sql += ",";
		}*/
		String case_sql = getMeasureStringBymeasureList(paramMap);
		String iId = paramMap.get("ids").toString();
		String project_id = paramMap.get("project_id").toString();
		String tId = paramMap.get("tId").toString();
		String oId = paramMap.get("oId").toString();
		String zId = paramMap.get("zId").toString();
		StringBuffer sb = new StringBuffer();
/*		sb.append(" select z.zone_cd,z.zone_cd_desc, tab.*");
		sb.append(" from B99_Zone_Cd z");
		sb.append(" inner join (");
		sb.append(" select  t.year_id as month_id, t.year_id||'年' as month_name,");
		sb.append(" b.Region_Cd as zone_id,");
		sb.append(" max(t.object_name) object_name,");
		sb.append(" "+case_sql+"");
		sb.append(" from bsc_proj_obj_h t  ");

*//*		sb.append(" from bsc_proj_obj_h t inner join  bsc_proj_stat_cyc c ");
		sb.append(" on t.project_id =c.project_id and t.year_id =c.cycle_id");*//*
		sb.append(" left join b04_base_data_tbl b  on  t.project_id = b.data_col_id");
		sb.append(" and t.object_id = b.dim_cd and t.year_id=trim(b.data_cycle)");
		sb.append(" and b.data_col_id ='"+project_id+"'");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(b.data_cycle) in ("+tId+")");
		}
		if(zId !=null && !"".equals(zId)){
			sb.append(" and b.region_cd in   ("+zId+")");
		}
		if(oId !=null && !"".equals(oId)){
			sb.append(" and b.dim_cd in   ("+oId+")");
		}
		if(iId !=null && !"".equals(iId)){
			sb.append(" and b.Ind_Id in   ("+iId+")");
		}
		sb.append("where t.project_id ='"+project_id+"'");

		if(null !=tId && !"".equals(tId)){
			sb.append(" and t.year_id in ("+tId+")");
		}
		if(oId !=null && !"".equals(oId)){
			sb.append(" and t.object_id in  ("+oId+")");
		}
		sb.append(" group by t.year_id, b.Region_Cd  ");
		sb.append(" ) tab  ");
		sb.append(" on z.zone_cd = tab.zone_id  ");
		sb.append("  order by z.zone_cd ");*/


/*		sb.append("  select ");
		sb.append("  \t\tb.Region_Cd || e2.DIM_CD_DESC as zone_cd_desc,\n ");
		sb.append(" p.sts_cycle_scope_desc as month_name, ");
		sb.append("  max(case when e.Dim_Cd ='110100000000' then 'ALL' ELSE 'A' END as object_id ||  e.Dim_Cd_Desc) as object_name, ");

		sb.append(" "+case_sql+"");
		sb.append(" from b04_base_data_tbl b inner join ");
		sb.append(" B04_DATA_COL_ADIM_SCOPE e ");
		sb.append(" on   b.data_col_id = e.data_col_id and trim(b.Dim_Cd) = trim(e.dim_cd) ");
		sb.append(" and e.data_col_id = '"+project_id+"' ");
//		if(oId !=null && !"".equals(oId)){
			sb.append(" and e.Dim_Cd in  ("+oId+")");
//		}

		sb.append(" inner join B04_DATA_COL_TM_SCOPE p ");
		sb.append(" on   b.data_col_id = p.data_col_id ");
		sb.append(" and trim(b.data_cycle)  = trim(p.sts_cycle_scope_cd)");
		sb.append(" and p.data_col_id = '"+project_id+"' ");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(p.sts_cycle_scope_cd) in ("+tId+")");
		}
		sb.append(" inner join B04_DATA_COL_ADIM_SCOPE e2");
		sb.append(" on   b.data_col_id = e2.data_col_id ");
		sb.append(" and trim(b.Region_Cd) = trim(e2.dim_cd) ");
		sb.append(" and e2.data_col_id = '"+project_id+"' ");

		if(zId !=null && !"".equals(zId)){
			sb.append(" and trim(e2.dim_cd) in   ("+zId+")");
		}

		sb.append(" where b.data_col_id = '"+project_id+"' ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and b.region_cd in   ("+zId+")");
		}
		if(null !=tId && !"".equals(tId)){
			sb.append(" trim(b.data_cycle) in ("+tId+")");
		}
		if(iId !=null && !"".equals(iId)){
			sb.append(" and b.Ind_Id in   ("+iId+")");
		}

//		if(oId !=null && !"".equals(oId)){
		sb.append(" and b.Dim_Cd in  ("+oId+")");
//		}
	'['||t.object_id||']'||' '||max(t.object_name) as object_name, max(t.year_id)||'年' as month_name,
		sb.append(" group by  b.Region_Cd, E2.DIM_CD_DESC,p.sts_cycle_scope_desc");*/
//		sb.append(" group by  b.Region_Cd, E2.DIM_CD_DESC,e.Dim_Cd,e.Dim_Cd_Desc,p.sts_cycle_scope_desc");



		sb.append("select b.Region_Cd ||'_'|| e2.DIM_CD_DESC as zone_cd_desc,						    ");
		sb.append("      p.sts_cycle_scope_desc as month_name, b.data_cycle,                              ");
		sb.append("      max(e.Dim_Cd)||'_' ||e.DIM_CD_DESC as object_name   ");

//		sb.append("       max(case  when e.Dim_Cd = '110100000000' then 'ALL'  ELSE  'Z'  END || e.Dim_Cd_Desc) as object_name,     ");
		if(null !=case_sql && !"".equals(case_sql)){
			sb.append("        ,"+case_sql+"                                                      		");
		}

		sb.append(" from b04_base_data_tbl b                                                        ");
		sb.append("inner join b04_data_col l on b.data_col_id = l.data_col_id                       ");
		sb.append("                         and l.data_col_id ='"+project_id+"'               	    ");
		sb.append("inner join B04_DATA_COL_ADIM_SCOPE e on b.data_col_id = e.data_col_id            ");
		sb.append("                                    and trim(b.dim_cd) = trim(e.dim_cd)          ");
		sb.append("                                    and l.dim_type_cd = e.dim_type_id            ");
		sb.append("                                    and e.data_col_id ='"+project_id+"'          ");

//		if(oId !=null && !"".equals(oId)){
		sb.append(" and e.Dim_Cd in  ("+oId+")");
//		}
		sb.append("inner join B04_DATA_COL_TM_SCOPE p on b.data_col_id = p.data_col_id              ");
		sb.append("        and trim(b.data_cycle) =trim(p.STS_CYCLE_SCOPE_CD)                       ");
		sb.append("                                  and p.data_col_id ='"+project_id+"'       	    ");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(p.sts_cycle_scope_cd) in ("+tId+")");
		}
		sb.append("inner join B04_DATA_COL_ADIM_SCOPE e2 on b.data_col_id = e2.data_col_id          ");
		sb.append("                     and trim(b.Region_Cd) =  trim(e2.dim_cd)                    ");
		sb.append("                                     and l.region_cd = e2.dim_type_id            ");
		sb.append("                                     and e2.data_col_id ='"+project_id+"'        ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and trim(e2.dim_cd) in   ("+zId+")");
		}
		sb.append("where b.data_col_id ='"+project_id+"'                                           ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and b.region_cd in   ("+zId+")");
		}
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(b.data_cycle) in ("+tId+")");
		}
		if(iId !=null && !"".equals(iId)){
			sb.append(" and b.Ind_Id in   ("+iId+")");
		}

//		if(oId !=null && !"".equals(oId)){
		sb.append(" and b.Dim_Cd in  ("+oId+")");
//		}


		sb.append("group by b.Region_Cd,                                                            ");
		sb.append("         E2.DIM_CD_DESC,                                                         ");
		sb.append("         e.Dim_Cd,                                                               ");
		sb.append("         e.Dim_Cd_Desc,                                                          ");
		sb.append("         p.sts_cycle_scope_desc, b.data_cycle                                     ");
		sb.append("   order by  b.Region_Cd ,b.data_cycle desc, e.Dim_Cd                                              ");
		String sql = sb.toString();
		System.out.println("sql="+sql);
		return  sql;
	}


	/**
	 *
	 * 	 2统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
	 * 	 showID
	 * 	 年份单选monthSelector1   多monthSelector2（monthBox2）
	 * 	 统计维度单选 objSelector2 （objBox2）      多objSelector1
	 * @param paramMap
	 * @return
	 */
	private String  getResultDhtmlOjbectBySqlCnt(Map<String, Object> paramMap){
		String project_id = paramMap.get("project_id").toString();
		String tId = paramMap.get("tId").toString();
		String oId = paramMap.get("oId").toString();
		String zId = paramMap.get("zId").toString();
		StringBuffer sb = new StringBuffer();
/*
		sb.append(" select z.zone_cd,z.zone_cd_desc, tab.*");
		sb.append(" from B99_Zone_Cd z");
		sb.append(" inner join (");
		sb.append(" select  t.object_id,");
//		sb.append(" select  t.object_id,'['||t.object_id||']'||' '||(t.object_name) as object_name,");
//		sb.append(" select  j.obj_id,'['||j.obj_id||']'||' '||(j.obj_name) as object_name,");
		sb.append(" b.Region_Cd as zone_id,");
		sb.append(" max(t.year_id)||'年' as month_name");
*/
/*		sb.append(" from bsc_proj_obj_h t inner join  bsc_proj_stat_obj j  ");
		sb.append(" on t.project_id =j.project_id and  t.object_id =j.obj_id ");*//*


		sb.append(" from bsc_proj_obj_h t  ");
		sb.append(" left join B04_BASE_DATA_TBL b  on  t.project_id = b.Data_Col_Id");
		sb.append(" and t.object_id = b.Dim_Cd and t.year_id=trim(b.Data_Cycle)");
		sb.append(" and b.Data_Col_Id ='"+project_id+"'");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(b.Data_Cycle)in ("+tId+")");
		}
		if(zId !=null && !"".equals(zId)){
			sb.append(" and b.Region_Cd in   ("+zId+")");
		}
		if(oId !=null && !"".equals(oId)){
			sb.append(" and b.Dim_Cd in   ("+oId+")");
		}

		sb.append("where t.project_id ='"+project_id+"'");

		if(null !=tId && !"".equals(tId)){
			sb.append(" and t.year_id in ("+tId+")");
		}
		if(oId !=null && !"".equals(oId)){
			sb.append(" and t.object_id in  ("+oId+")");
		}
		sb.append(" group by t.object_id,b.Region_Cd  ");
		sb.append(" ) tab  ");
		sb.append(" on z.zone_cd = tab.zone_id  ");

		select  count(distinct b.Region_Cd),count(distinct b.dim_cd) ,

		from b04_base_data_tbl b  where b.data_col_id = '153976538459321637'
*/

/*		sb.append("select decode(sign(count(distinct Region_Cd)-count(distinct dim_cd)),-1,count(distinct dim_cd),count(distinct Region_Cd)) as cnt from b04_base_data_tbl  where data_col_id ='"+project_id+"'");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(data_cycle) in ("+tId+")");
		}

		if(oId !=null && !"".equals(oId)){
			sb.append(" and trim(dim_cd) in  ("+oId+")");
		}
		if(zId !=null && !"".equals(zId)){
			sb.append(" and Region_Cd in  ("+zId+")");
		}*/



		sb.append("select b.Region_Cd ||'_' || e2.dim_cd_desc as zone_cd_desc,						    ");
		sb.append("      e.Dim_Cd||'_' ||e.DIM_CD_DESC as object_name,   ");
		sb.append("      max(p.sts_cycle_scope_desc) as month_name                                     ");
		sb.append(" from b04_base_data_tbl b                                                        ");
		sb.append("inner join b04_data_col l on b.data_col_id = l.data_col_id                       ");
		sb.append("                         and l.data_col_id ='"+project_id+"'               	    ");
		sb.append("inner join B04_DATA_COL_ADIM_SCOPE e on b.data_col_id = e.data_col_id            ");
		sb.append("                                    and trim(b.dim_cd) = trim(e.dim_cd)          ");
		sb.append("                                    and l.dim_type_cd = e.dim_type_id            ");
		sb.append("                                    and e.data_col_id ='"+project_id+"'          ");

		if(oId !=null && !"".equals(oId)){
			sb.append(" and e.Dim_Cd in  ("+oId+")");
		}
		sb.append("inner join B04_DATA_COL_TM_SCOPE p on b.data_col_id = p.data_col_id              ");
		sb.append("        and trim(b.data_cycle) =trim(p.STS_CYCLE_SCOPE_CD)                       ");
		sb.append("                                  and p.data_col_id ='"+project_id+"'       	    ");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(p.sts_cycle_scope_cd) in ("+tId+")");
		}
		sb.append("inner join B04_DATA_COL_ADIM_SCOPE e2 on b.data_col_id = e2.data_col_id          ");
		sb.append("                     and trim(b.Region_Cd) =  trim(e2.dim_cd)                    ");
		sb.append("                                     and l.region_cd = e2.dim_type_id            ");
		sb.append("                                     and e2.data_col_id ='"+project_id+"'        ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and trim(e2.dim_cd) in   ("+zId+")");
		}
		sb.append("where b.data_col_id ='"+project_id+"'                                           ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and b.region_cd in   ("+zId+")");
		}
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(b.data_cycle) in ("+tId+")");
		}

		if(oId !=null && !"".equals(oId)){
			sb.append(" and b.Dim_Cd in  ("+oId+")");
		}


		sb.append("group by b.Region_Cd,                                                            ");
		sb.append("         E2.dim_cd_desc,                                                         ");
		sb.append("         e.Dim_Cd,                                                               ");
		sb.append("         e.Dim_Cd_Desc                                                          ");

		String sql = sb.toString();
		System.out.println("sql="+sql);
		return  sql;
	}

	/**
	 * 增加地区代码： 2统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
	 * @param paramMap
	 * @return
	 */

	private String  getResultDhtmlOjbectBySql(Map<String, Object> paramMap){
/*		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String case_sql = "";
		for (int i = 0; i < measureList.size(); i++) {
			Map<String, Object> map = measureList.get(i);
			String measure_id = getStringValue(map,"measure_id");

			case_sql += "sum(case when b.ind_id ='"+measure_id+"' then b.ind_val else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				case_sql += ",";
		}*/

		String case_sql = getMeasureStringBymeasureList(paramMap);
		String iId = paramMap.get("ids").toString();
		String project_id = paramMap.get("project_id").toString();
		String tId = paramMap.get("tId").toString();
		String oId = paramMap.get("oId").toString();
		String zId = paramMap.get("zId").toString();
		StringBuffer sb = new StringBuffer();
/*
		sb.append(" select z.zone_cd,z.zone_cd_desc, tab.*");
		sb.append(" from B99_Zone_Cd z");
		sb.append(" inner join (");
		sb.append(" select  t.object_id,'['||t.object_id||']'||' '||(t.object_name) as object_name,");
		sb.append(" b.Region_Cd as zone_id,");
		sb.append(" max(t.year_id)||'年' as month_name,");
		sb.append(" "+case_sql+"");
		sb.append(" from bsc_proj_obj_h t   ");
		*/
/*sb.append(" from bsc_proj_obj_h t inner join  bsc_proj_stat_obj j  ");
		sb.append(" on t.project_id =j.project_id  and t.object_id =j.obj_id ");*//*

		sb.append(" left join b04_base_data_tbl b  on  t.project_id = b.data_col_id");
		sb.append(" and t.object_id = b.dim_cd and t.year_id=trim(b.data_cycle)");
		sb.append(" and b.data_col_id ='"+project_id+"'");
*/
/*
		sb.append(" select z.zone_cd,z.zone_cd_desc, tab.*");
		sb.append(" from B99_Zone_Cd z");
		sb.append(" inner join (");
		sb.append(" select e.Dim_Cd as object_id , e.Dim_Cd_Desc as object_name, ");
		sb.append(" b.Region_Cd as zone_id, ");
		sb.append(" p.sts_cycle_scope_desc as month_name");
		sb.append(" "+case_sql+"");
		sb.append(" from B04_DATA_COL_ADIM_SCOPE e inner join B04_DATA_COL l");
		sb.append(" on e.data_col_id =l.data_col_id  and e.dim_type_id =l.dim_type_cd");
		sb.append(" and l.data_col_id='\"+project_id+\"' ");
		sb.append(" inner join B04_DATA_COL_TM_SCOPE p");
		sb.append(" on e.data_col_id =p.data_col_id");
		sb.append(" and p.data_col_id='\"+project_id+\"'");
		sb.append(" left join b04_base_data_tbl b  on   e.data_col_id = b.data_col_id");
		sb.append(" and e.Dim_Cd = b.dim_cd and p.STS_CYCLE_SCOPE_CD=trim(b.data_cycle)");
		sb.append(" and b.data_col_id ='"+project_id+"'");*/

/*		sb.append("  select ");
		sb.append("  \t\tb.Region_Cd || e2.DIM_CD_DESC as zone_cd_desc,\n ");
		sb.append("  case when e.Dim_Cd ='110100000000' then 'ALL' ELSE 'A' END as object_id ||  e.Dim_Cd_Desc as object_name, ");
		sb.append(" max(p.sts_cycle_scope_desc) as month_name, ");
		sb.append(" "+case_sql+"");
		sb.append(" from b04_base_data_tbl b inner join ");
		sb.append(" B04_DATA_COL_ADIM_SCOPE e ");
		sb.append(" on   b.data_col_id = e.data_col_id and trim(b.Dim_Cd) = trim(e.dim_cd) ");
		sb.append(" and e.data_col_id = '"+project_id+"' ");
		if(oId !=null && !"".equals(oId)){
		sb.append(" and e.Dim_Cd in  ("+oId+")");
		}

		sb.append(" inner join B04_DATA_COL_TM_SCOPE p ");
		sb.append(" on   b.data_col_id = p.data_col_id ");
		sb.append(" and trim(b.data_cycle)  = trim(p.sts_cycle_scope_cd)");
		sb.append(" and p.data_col_id = '"+project_id+"' ");
//		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(p.sts_cycle_scope_cd) in ("+tId+")");
//		}
		sb.append(" inner join B04_DATA_COL_ADIM_SCOPE e2");
		sb.append(" on   b.data_col_id = e2.data_col_id ");
		sb.append(" and trim(b.Region_Cd) = trim(e2.dim_cd) ");
		sb.append(" and e2.data_col_id = '"+project_id+"' ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and trim(e2.dim_cd) in   ("+zId+")");
		}

		sb.append(" where b.data_col_id = '"+project_id+"' ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and b.region_cd in   ("+zId+")");
		}
//		if(null !=tId && !"".equals(tId)){
			sb.append(" trim(b.data_cycle) in ("+tId+")");
//		}
		if(iId !=null && !"".equals(iId)){
			sb.append(" and b.Ind_Id in   ("+iId+")");
		}

		if(oId !=null && !"".equals(oId)){
		sb.append(" and b.Dim_Cd in  ("+oId+")");
		}

		sb.append(" group by  b.Region_Cd, E2.DIM_CD_DESC,e.Dim_Cd,e.Dim_Cd_Desc");





		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(b.Data_Cycle) in ("+tId+")");
		}
		if(zId !=null && !"".equals(zId)){
			sb.append(" and b.Region_Cd in   ("+zId+")");
		}
		if(oId !=null && !"".equals(oId)){
			sb.append(" and b.Dim_Cd in   ("+oId+")");
		}
		if(iId !=null && !"".equals(iId)){
			sb.append(" and b.Ind_Id in   ("+iId+")");
		}
		sb.append("where  e.data_col_id ='"+project_id+"'");

		if(null !=tId && !"".equals(tId)){
			sb.append(" and p.STS_CYCLE_SCOPE_CD in ("+tId+")");
		}
		if(oId !=null && !"".equals(oId)){
			sb.append(" and e.Dim_Cd in  ("+oId+")");
		}

		sb.append(" group by e.Dim_Cd, e.Dim_Cd_Desc,b.Region_Cd,p.sts_cycle_scope_desc  ");
		sb.append(" ) tab  ");
		sb.append(" on z.zone_cd = tab.zone_id  ");
		sb.append("  order by z.zone_cd ");*/

/*
		sb.append("select b.Region_Cd || e2.DIM_CD_DESC as zone_cd_desc,						    ");
		sb.append("  case when e.Dim_Cd ='110100000000' then 'ALL' ELSE 'A' END as object_id ||  e.Dim_Cd_Desc as object_name, ");
		sb.append(" max(p.sts_cycle_scope_desc) as month_name, ");*/

		sb.append("select b.Region_Cd ||'_' || e2.DIM_CD_DESC as zone_cd_desc,						    ");
//		sb.append("   case  when e.Dim_Cd = '110100000000' then 'ALL'  ELSE  e.Dim_Cd  END || '_'|| e.Dim_Cd_Desc as object_name,     ");

		sb.append("     e.Dim_Cd||'_' ||e.DIM_CD_DESC as object_name,   ");
		sb.append("      max(p.sts_cycle_scope_desc) as month_name                                     ");
		if(null !=case_sql && !"".equals(case_sql)){
			sb.append("          ,"+case_sql+"                                                      		");
		}

		sb.append(" from b04_base_data_tbl b                                                        ");
		sb.append("inner join b04_data_col l on b.data_col_id = l.data_col_id                       ");
		sb.append("                         and l.data_col_id ='"+project_id+"'               	    ");
		sb.append("inner join B04_DATA_COL_ADIM_SCOPE e on b.data_col_id = e.data_col_id            ");
		sb.append("                                    and trim(b.dim_cd) = trim(e.dim_cd)          ");
		sb.append("                                    and l.dim_type_cd = e.dim_type_id            ");
		sb.append("                                    and e.data_col_id ='"+project_id+"'          ");

		if(oId !=null && !"".equals(oId)){
		sb.append(" and e.Dim_Cd in  ("+oId+")");
		}
		sb.append("inner join B04_DATA_COL_TM_SCOPE p on b.data_col_id = p.data_col_id              ");
		sb.append("        and trim(b.data_cycle) =trim(p.STS_CYCLE_SCOPE_CD)                       ");
		sb.append("                                  and p.data_col_id ='"+project_id+"'       	    ");
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(p.sts_cycle_scope_cd) in ("+tId+")");
		}
		sb.append("inner join B04_DATA_COL_ADIM_SCOPE e2 on b.data_col_id = e2.data_col_id          ");
		sb.append("                     and trim(b.Region_Cd) =  trim(e2.dim_cd)                    ");
		sb.append("                                     and l.region_cd = e2.dim_type_id            ");
		sb.append("                                     and e2.data_col_id ='"+project_id+"'        ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and trim(e2.dim_cd) in   ("+zId+")");
		}
		sb.append("where b.data_col_id ='"+project_id+"'                                           ");
		if(zId !=null && !"".equals(zId)){
			sb.append(" and b.region_cd in   ("+zId+")");
		}
		if(null !=tId && !"".equals(tId)){
			sb.append(" and trim(b.data_cycle) in ("+tId+")");
		}
		if(iId !=null && !"".equals(iId)){
			sb.append(" and b.Ind_Id in   ("+iId+")");
		}

		if(oId !=null && !"".equals(oId)){
		sb.append(" and b.Dim_Cd in  ("+oId+")");
		}

		sb.append(" group by b.Region_Cd,                                                            ");
		sb.append("         E2.DIM_CD_DESC,                                                         ");
		sb.append("         e.Dim_Cd,                                                               ");
		sb.append("         e.Dim_Cd_Desc                                                          ");
		sb.append("         order by  b.Region_Cd,  e.Dim_Cd                                                         ");

		String sql = sb.toString();
		System.out.println("sql="+sql);
		return  sql;
	}

/*	public  String getStringByList(List<Map<String, Object>> measureList){
		String ids = "";
		for(Map<String, Object> mp :measureList){
			ids += getStringValue(mp, "measure_id").concat(",");
		}
		ids = ids.lastIndexOf(".")>-1?ids.substring(0,ids.length() - 1):ids;

		return ids;
	}*/




}
