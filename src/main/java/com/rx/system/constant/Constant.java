package com.rx.system.constant;


/**
 * 系统常量类
 * @author  zzm
 *     
 */
public class Constant {
	
	public static String ROOT_ORG_ID = "8888";//机构树根节点
	
	public static String ROOT_RESOURCE_ID = "root";//菜单根节点ID
	/**
	 * Top 指标树根节点
	 */
	public static final String MEASURE_TREE_TOP="@@@@@@";
	
	/**
	 * kpi 考核方案指标来源: 01,公有指标;
	 */
	public static final String BASE_MEASURE_SOURCE_CODE="01";
	/**
	 * kpi 考核方案指标来源: 02,私有指标
	 */
	public static final String PROJ_MEASURE_SOURCE_CODE="02";
	
	/**
	 * 考核结果表
	 */
	public static final String KPI_RESULT_TABLE = "kpi_calc_result";
	
	/**
	 * 考核测算结果
	 */
	public static final String KPI_TEST_RESULT_TABLE = "kpi_t_calc_result";
	
	/**
	 * 文件上传临时目录
	 */
	public static final String FILE_UPLOAD_TEMP_DIR = "file\\upload\\temp";
	
	/**
	 * 文件上传保存目录
	 */
	public static final String FILE_UPLOAD_DIR = "file\\upload\\";
	
	/**
	 * 文件下载目录
	 */
	public static final String FILE_DOWNLOAD_DIR = "file\\download\\";
		
	/**
	 * 文件上传保存路径
	 */
    public static final String UPLOAD_DIR = "/bsc/download/";  
    
    /**
     * 文件上传保存路径temp
     */
    public static final String UPLOAD_DIR_TMP = "/bsc/download/temp/";
    
}
