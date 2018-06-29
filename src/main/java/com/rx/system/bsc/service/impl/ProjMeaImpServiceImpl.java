package com.rx.system.bsc.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.ProjMeaImpDao;
import com.rx.system.bsc.service.IProjMeaImpService;
import com.rx.system.util.ReadExcelData;

/**
 * 考核结果直接由外部导入的指标实现类
 * 
 * @author zzm
 * 
 */
public class ProjMeaImpServiceImpl extends BaseService implements
		IProjMeaImpService {

	private ProjMeaImpDao projMeaImpDao;

	public void setProjMeaImpDao(ProjMeaImpDao projMeaImpDao) {
		this.projMeaImpDao = projMeaImpDao;
	}

	/**
	 * 外部导入指标显示列表
	 * @param paramsMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> list(Map<String, Object> paramsMap)
			throws Exception {
		return toLowerMapList(projMeaImpDao.list(paramsMap));
	}

	/**
	 * 保存修改记录
	 */
	public void save(Map<String, Object> paramsMap) throws Exception {
		String values = (String)paramsMap.get("objectValues");
		String objectValues[] = values.split(";");
		for (int i = 0; i < objectValues.length; i++) {
			String objectId = objectValues[i].split("@")[0];
			String value = objectValues[i].split("@")[1];
			paramsMap.put("object_id", objectId);
			paramsMap.put("object_ids", objectId.split("@"));
			paramsMap.put("value", value.replaceAll(",", ""));
			
			projMeaImpDao.delete(paramsMap);
			projMeaImpDao.save(paramsMap);
		}
		
	}
	
	/**
	 * 删除选中对象值
	 */
	public void delete(Map<String, Object> paramsMap) throws Exception {
		String object_ids = (String)paramsMap.get("object_ids");

		paramsMap.put("object_ids", object_ids.split("@"));
		projMeaImpDao.delete(paramsMap);
	}

	/**
	 * 检验导入数据
	 */
    public List<Map<String, Object>> checkImportData(Map<String, Object> map) throws Exception {

        List<Map<String, Object>> resList = new ArrayList<Map<String, Object>>();//返回结果 
        String fileName = (String) map.get("fullFileName");

        ReadExcelData red = null;
        String[][] dataArray = null;
        try {
            red = new ReadExcelData(fileName);//读取导入文件的数据
            dataArray = red.getAppointSheetData();
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new Exception("[[0,'文件读取失败,请按照上传模板进行导入...']]");
        }

        //前4行：和导入的模板要求一样
        String years = dataArray[1][0] == null ? "" : dataArray[1][0].trim();
        String projects = dataArray[3][0] == null ? "" : dataArray[3][0].trim();
        String cycles = dataArray[5][0] == null ? "" : dataArray[5][0].trim();
        String measures = dataArray[7][0] == null ? "" : dataArray[7][0].trim();
        if (years.indexOf("：") != -1 || projects.indexOf("：") != -1 || measures.indexOf("：") != -1
                || cycles.indexOf("：") != -1) {
            throw new Exception("请查看文件的表头中是否存在中文分隔符,请改用半角分隔符.");
        }
        
        String year_id = (years.substring(years.indexOf(":") + 1) == null || ""
				.equals(years.substring(years.indexOf(":") + 1))) ? "" : years
				.split(":")[1]; //年度
        String project_id = (projects.substring(projects.indexOf(":") + 1) == null || ""
				.equals(projects.substring(projects.indexOf(":") + 1))) ? ""
				: projects.split(":")[1]; // 方案id
        String measure_id = (measures.substring(measures.indexOf(":") + 1) == null || ""
				.equals(measures.substring(measures.indexOf(":") + 1))) ? ""
				: measures.split(":")[1]; // 指标id
        String cycle_id = (cycles.substring(cycles.indexOf(":") + 1) == null || ""
				.equals(cycles.substring(cycles.indexOf(":") + 1))) ? ""
				: cycles.split(":")[1]; // 周期id
        String object_id = "";//考核对象ID
        String value = "";//目标任务量

        map.put("year_id", year_id);
        map.put("project_id", project_id);
        map.put("cycle_id", cycle_id);
        int line_No = 1;
        try {
            //判断年度是否有效
            if (year_id.equals("")) {
                line_No += 1;
                throw new Exception("年度代码为空!");
            } else {
            }
            
            //判断方案是否有效
            if (project_id.equals("")) {
                line_No += 3;
                throw new Exception("方案代码为空!");
            } else {
                if (this.projMeaImpDao.projectIsValid(map) == 0) {
                    line_No += 3;
                    throw new Exception("方案ID【" + project_id + "】无效,请重新检查!");
                }
            }

            //判断周期是否有效： 选的方案决定周期的值
            if ("".equals(cycle_id)) {
                line_No += 5;
                throw new Exception("周期代码为空!");
            } else {
                if (this.projMeaImpDao.cycleIsValid(map) == 0) {
                    line_No += 5;
                    throw new Exception("周期ID【" + cycle_id + "】无效,请重新检查!");
                }
            }

            //判断指标是否有效： 选的方案决定指标的值
            if ("".equals(measure_id)) {
                line_No += 7;
                throw new Exception("指标代码为空!");
            } else {
                map.put("measure_id", measure_id);
                if (this.projMeaImpDao.measureIsValid(map) == 0) {
                    line_No += 7;
                    throw new Exception("指标ID【" + measure_id + "】无效,请重新检查!");
                }
            }
            map.put("project_id", project_id);
            List<Map<String,Object>> objectList = toLowerMapList(projMeaImpDao.objectIsValid(map)); 
            HashSet<String> objectSet = getHashSet(objectList);
            for (int i = 11; i < dataArray.length; i++) {//从第1行开始读
                Map<String, Object> param = map;
                line_No = i + 1;//记录行号
                try {
                    object_id = dataArray[i][0] == null ? "" : dataArray[i][0].trim();
                    value = dataArray[i][2] == null ? "" : dataArray[i][2].trim();
                } catch (Exception e) {
                	
                }
                //判断考核对象是否有效：所选的方案、指标决定了指标的值
                if ("".equals(object_id)) {
                    throw new Exception("考核对象为空!");
                } else {
                    param.put("object_id", object_id);
                    if (!objectSet.contains(object_id)) {
                        throw new Exception("考核对象ID【" + object_id + "】无效,请重新检查!");
                    }
                }

                //判断目标任务量target_amount是不是数值弄
                try {
                    Double.parseDouble(value);
                } catch (NumberFormatException e) {
                    throw new Exception("对象结果值【" + value + "】是非法数字,请重新检查!");
                }
            }
            
        } catch (Exception e) {
        	e.printStackTrace();
			Map<String, Object> resMap = new HashMap<String, Object>();
			resMap.put("failed_reason", e.getMessage());
			resMap.put("line_no", line_No);
			resList.add(resMap);
		}

        return resList;
    }

    /**
     * 保存导入数据
     */
	public void saveImportData(Map<String, Object> paramMap) throws Exception {
        String fileName = (String) paramMap.get("fileName");
        ReadExcelData red = null;
        String[][] dataArray = null;
        try {
            red = new ReadExcelData(fileName);//读取导入文件的数据
            dataArray = red.getAppointSheetData();
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        //前4行：和导入的模板要求一样
        String years = dataArray[1][0] == null ? "" : dataArray[1][0].trim();
        String projects = dataArray[3][0] == null ? "" : dataArray[3][0].trim();
        String cycles = dataArray[5][0] == null ? "" : dataArray[5][0].trim();
        String measures = dataArray[7][0] == null ? "" : dataArray[7][0].trim();

        String year_id = years.split(":")[1]; //年度
        String project_id = projects.split(":")[1]; //方案id
        String measure_id = measures.split(":")[1]; //指标id
        String cycle_id = cycles.split(":")[1]; //周期id
        String object_id = "";//考核对象ID
        String value = "";//目标任务量

        Map<String, Object> m = new HashMap<String, Object>();
        m.put("year_id", year_id);
        m.put("project_id", project_id);
        m.put("measure_id", measure_id);
        m.put("cycle_id", cycle_id);

        try {
            for (int i = 11; i < dataArray.length; i++) {//从第1行开始读
                Map<String, Object> param = m;
                try {
					object_id = dataArray[i][0] == null ? "" : dataArray[i][0].trim();
					value = dataArray[i][2] == null ? "" : dataArray[i][2].trim();
				} catch (Exception e) {
					// 不处理
				}
				param.put("object_id", object_id);
                param.put("object_ids", object_id.split("@"));
                param.put("value", value);

                projMeaImpDao.delete(param);
    			projMeaImpDao.save(param);
            }
        }
        catch (Exception e) {
            System.out.println("执行导入认领的异常:");
            e.printStackTrace();
        }
	}

	public List<Map<String, Object>> queryMeasure(Map<String, Object> map) throws Exception {
		return toLowerMapList(this.projMeaImpDao.queryMeasure(map));
	}
	
	 private HashSet<String> getHashSet(List<Map<String,Object>> list){
	    	HashSet<String> set = new HashSet<String>();
	    	for (Map<String, Object> map : list) {
	    		set.add(map.get("object_id").toString());
			}
	    	return set;
	    }
}
