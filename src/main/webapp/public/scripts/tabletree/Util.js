
function popWindow(url)
{
	var features="";
	if(arguments.length==3)
		features ="dialogWidth:"+arguments[1]+"px;dialogHeight:"+arguments[2]+"px;center:1;help:no;status:no;dialogHide:1";
	else
		features ="dialogHeight:480px;dialogWidth:600px;center:1;help:no;status:no;dialogHide:1";
	var returnValue = window.showModalDialog(url,window,features);

	return returnValue;
}

function getParam(str,leftFlag,rightFlag)
{
    var param="";

    while(str.indexOf(rightFlag)<str.indexOf(leftFlag))
    {
    	if(str.indexOf(rightFlag)<0)
    		break;
        str=str.substring(str.indexOf(rightFlag)+1);
    }

    if(str.indexOf(leftFlag)>=0 && str.indexOf(rightFlag)>=0)
    {
        var pos1=str.indexOf(leftFlag);
        var pos2=str.indexOf(rightFlag);
        param=str.substring(pos1+1,pos2);
    }

    return param;
}

function getObjectLeft(obj)
{
  var left=obj.offsetLeft;
  var scrollamount=document.body.scrollLeft;
  while(obj=obj.offsetParent) 
	  left+= obj.offsetLeft?obj.offsetLeft:0;
  left=left-scrollamount;
  return left;
}

function getObjectTop(obj)
{
  var top=obj.offsetTop;
  var scrollamount = document.body.scrollTop;
  while(obj=obj.offsetParent)
	  top += obj.offsetTop?obj.offsetTop:0;
  top=top-scrollamount;
  return top;
}

function saveCaretPos(object)
{
	if(object.createTextRange()) 
		object.caretPos = document.selection.createRange().duplicate();
}

function inputAtCaret(object,text) 
{ 
	if (object.createTextRange() && object.caretPos) {
		var caretPos = object.caretPos; 
		caretPos.text = text; 
	} 
	else 
		object.value = text; 
	object.focus();
}