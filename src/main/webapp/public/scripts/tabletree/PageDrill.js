function drillEpm(dateID,orgID,projectID,roleID,group,reckonType,drillID,mode)
{
	drillForm.action="orgEpmQuery.do?month_id="+dateID+"&bank_org_id="+orgID+"&projectID="+projectID+"&roleID="+roleID+"&group="+group+"&reckonType="+reckonType+"&drillID="+drillID+"&drillMode="+mode;
    drillForm.submit();
}
function drillCalcMeasure(dateID,projectID,viewAngleID,conditionKey,values,drillID,mode)
{
	drillForm.action="calcResultAction.do?method=getResult&date_id="+dateID
					+"&project_id="+projectID
					+"&view_angle_id="+viewAngleID
					+"&conditionKey="+conditionKey
					+"&values="+values
					+"&drillID="+drillID
					+"&drillMode="+mode;
    drillForm.submit();
}

function drillFee(dateID,orgID,projectID,group,drillID,mode)
{
	drillForm.action="orgFeeControlQuery.do?month_id="+dateID+"&bank_org_id="+orgID+"&projectID="+projectID+"&group="+group+"&drillID="+drillID+"&drillMode="+mode;
	drillForm.submit();
}

function drillFeeBank(dateID,orgID,projectID,group,drillID,mode)
{
	drillForm.action="orgFeeControlQueryForBank.do?month_id="+dateID+"&bank_org_id="+orgID+"&projectID="+projectID+"&group="+group+"&drillID="+drillID+"&drillMode="+mode;
	drillForm.submit();
}

function drillFunction(bank_org_id,measure_id,month_id,currency_code,unit,group,cust_mgr_id,actions,drillID,drillMode){
	   
       document.getElementById("bank_org_id").value = bank_org_id;
       document.getElementById("measure_id").value = measure_id;
       document.getElementById("month_id").value = month_id;
       document.getElementById("currency_code").value = currency_code;
       document.getElementById("unit").value = unit;
       document.getElementById("group").value = group;
       document.getElementById("cust_mgr_id").value = cust_mgr_id;
       document.form3.action = actions+"?drillID="+drillID+"&drillMode="+drillMode;
       document.form3.submit();
       
}

function drillEvaQuery(bankOrgID,monthID,unit,projectID,enterType,group,product_id,queryType,action){
	drillForm.action=action+"?month_id="+monthID+"&bank_org_id="+bankOrgID+"&unit="+unit+"&product_id="+product_id+"&projectID="+projectID+"&group="+group+"&enter_type="+enterType+"&queryType="+queryType;
	drillForm.submit();
}

function drillAccountQuery(bankOrgID,measureID,monthID,unit,custMgrID,type,scope,beginDate,endDate,action,roleType,allotTypeCode){
	if(bankOrgID == '9999')
		return;
        
    var params="&month_id="+monthID+"&bank_org_id="+bankOrgID+"&unit="+unit+"&measure_id="+measureID+"&scope="+scope+"&type="+type+"&cust_mgr_id="+custMgrID+"&begin_date="+beginDate+"&end_date="+endDate+"&roleType="+roleType+"&allotTypeCode="+allotTypeCode;
    params+="&start=0&limit=100";
    
    var path=action+"?isPage=true"+params;
    
    drillForm.action=action+"?month_id="+monthID+"&bank_org_id="+bankOrgID+"&unit="+unit+"&measure_id="+measureID+"&scope="+scope+"&type="+type+"&cust_mgr_id="+custMgrID+"&begin_date="+beginDate+"&end_date="+endDate+"&roleType="+roleType+"&allotTypeCode="+allotTypeCode;
    //drillForm.submit();
        
    window.parent.doQueryTotalCount(path,drillForm);
}
