/*
 * 键盘按键控制js 
 * author chenhongjian
 */
function keydown(e) {		
		var e = e||event,currKey=0;
		 currKey=e.keyCode||e.which||e.charCode;
		 //alert(currKey);
		
		if ((currKey == 8) && (e.srcElement.tagName == "TEXTAREA" || e.srcElement.tagName == "INPUT"))
		{
			return;
		}
		if ((!(e.altKey)) && (currKey == 37 || currKey == 39) && (e.srcElement.tagName == "TEXTAREA" || e.srcElement.tagName == "INPUT"))
		{
			return;
		}
		if ((currKey == 38 || currKey == 40) && (e.srcElement.tagName == "TEXTAREA"))
		{
			return;
		}

		if((e.altKey) && (currKey == 37 || currKey == 39)){
			alert("'ALT'+'<-' and 'ALT'+'->' is disabled.");
			currKey = 0;
	        e.cancelBubble = true;
	        return false;
		}
	    if ((currKey==116) || (currKey==13 && e.srcElement.type != "textarea")
			|| ((e.ctrlKey)&&(currKey==78)) //disable Ctrl+n
			|| ((e.shiftKey)&&(currKey==121)) //disable shift+F10
			|| ((e.ctrlKey)&&(currKey==115)) //disable Ctrl+F4
			|| (currKey == 8) //disable Back Space
			|| (currKey==166)||(currKey==167)||(currKey==255)
			
	    ){		
	    	currKey = 0;
	    	e.cancelBubble = true;
	    	return false;
	    }
	}
document.onkeydown=keydown;