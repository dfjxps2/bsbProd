function RangeInsert(field,txt)
{
	//IE support
	if (document.selection) {
		field.focus();
	    var sel = document.selection.createRange();
		sel.text = txt;

		field.focus();
	}
	//MOZILLA/NETSCAPE support
	else if (field.selectionStart || field.selectionStart == '0') {
		var startPos = field.selectionStart;
		var endPos = field.selectionEnd;
		var cursorPos = endPos;
		var scrollTop = field.scrollTop;
		if (startPos != endPos) {
			field.value = field.value.substring(0, startPos)
			              + txt
			              + field.value.substring(endPos, field.value.length);
			cursorPos += txt.length;
		}
		else {
				field.value = field.value.substring(0, startPos) 
				              + txt
				              + field.value.substring(endPos, field.value.length);
				cursorPos = startPos + txt.length;
		}
		field.focus();
		field.selectionStart = cursorPos;
		field.selectionEnd = cursorPos;
		field.scrollTop = scrollTop;
	}
	else {
		//field.value += txt;
		field.setValue(field.getValue()+txt);
		field.focus();
	}
}