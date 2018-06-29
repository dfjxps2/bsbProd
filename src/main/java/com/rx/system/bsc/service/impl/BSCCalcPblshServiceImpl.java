package com.rx.system.bsc.service.impl;

import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.BSCCalcPblshDao;
import com.rx.system.bsc.service.IBSCCalcPblshService;
/**
 * BSC测算发布实现service
 * @Author: mabo
 * @Date: Jul 18, 2013
 */
public class BSCCalcPblshServiceImpl extends BaseService implements IBSCCalcPblshService {

	private BSCCalcPblshDao bSCCalcPblshDao = null;
	public void setBSCCalcPblshDao(BSCCalcPblshDao bSCCalcPblshDao) {
		this.bSCCalcPblshDao = bSCCalcPblshDao;
	}


	public List<Map<String, Object>> listProject(Map<String,Object> map) throws Exception {
		
		return toLowerMapList(this.bSCCalcPblshDao.listProject(map));
	}

}
