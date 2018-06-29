package com.rx.system.bsc.calc.parse;

public class StringUtil {
	private static final char[] toHexChar = new char[]{	'0','1','2','3',
														'4','5','6','7',
														'8','9','A','B',
														'C','D','E','F'};
	
	/**
	 * @param str 原始字符串
	 * @return 把原始字符串转化成16进制字符串
	 * */
	public static String stringToHex(String str)
	{
		//1. 字符串打散成字节流
		byte[] 	data 		=	str.getBytes();
		
		//2. 十六进制的字符数组，一个字节由两个十六进制字符代替
		char[]	hexChars	=	new	char[data.length*2];
		
		int		byteValue	=	0;
		
		for (int i = 0; i < data.length; i++) {
			byteValue		=	data[i];
			
			hexChars[i*2]	=	StringUtil.toHexChar[(int)((byteValue & 0xF0) >> 4)];		//字节高位字符
			hexChars[i*2+1]	=	StringUtil.toHexChar[(int)(byteValue & 0x0F)];	//字节低位字符
		}
		
		return new String(hexChars);
	}
	
	/**
	 * @param hex原始字符串的16进制表达串
	 * @return 把16进制字符串转化成原始字符串
	 * */
	public static String hexToString(String hex)
	{
		char[]	hexChars	=	hex.toCharArray();
		
		byte[]	data		=	new	byte[hexChars.length / 2];
		
		int		highValue	=	0;
		int		lowValue	=	0;
		
		for (int i = 0; i < data.length; i++) {
			highValue	=	Character.digit(hexChars[i*2],	16);
			lowValue	=	Character.digit(hexChars[i*2+1],16);
			
			data[i]		=	(byte) ((highValue << 4) | lowValue);
		}		
		
		return new String(data);
	}
	
	/**
	 * @param data 原始字符串
	 * @return
	 * <p>把字符串中，以单引号'包裹的内部字符串转化成十六进制</p>
	 * <p>例如，IIF(a='a,b',a,b)会转化为IIF(a='612C62',a,b)</p>
	 * */
	public static String encodeInnerString(String data) throws Exception
	{
		String	enStr	=	"";		//编码后的字符串
		String	buffer	=	data;	//编码用的缓冲区
		String	tmpPre	=	"";		//准备编码的字符串		
		
		int		i		=	0;		//下一个单引号的位置
		
		
		do{
			i	=	buffer.indexOf("'");
			
			//如果缓冲区内没有单引号，则把缓冲区的值追加给编码后的值
			if(i < 0 ){
				enStr += buffer;
			}
			else{
				enStr 	+=	buffer.substring(0, i+1);	//把单引号之前的值(包括单引号)截给编码值
				buffer	=	buffer.substring(i+1);		//缓冲区赋值为单引号(不含单引号)之后的值
				
				i		=	buffer.indexOf("'");		//查找与第一个单引号配对的单引号
				
				if(i < 0){
					throw new Exception("字符串内的单引号没有完整配对");
				}
				
				tmpPre	=	buffer.substring(0, i);
				
				if (tmpPre.length() > 0){
					enStr	+=	StringUtil.stringToHex(tmpPre);					
				}
				enStr	+=	"'";
				
				buffer	=	buffer.substring(i+1);		//缓冲区重新赋值为单引号(不含单引号)之后的值
			}
			
		}while(i>=0);
		
		return enStr;
	}
	
	/**
	 * @param data 原始字符串
	 * @return
	 * <p>把字符串中，以单引号'包裹的内部16进制字符串转化成原始字符串</p>
	 * <p>例如，IIF(a='612C62',a,b)会转化为IIF(a='a,b',a,b)</p>
	 * */
	public static String decodeInnerString(String data) throws Exception
	{
		String	deStr	=	"";		//解码后的字符串
		String	buffer	=	data;	//解码用的缓冲区
		String	tmpPre	=	"";		//准备解码的字符串		
		
		int		i		=	0;		//下一个单引号的位置
		
		
		do{
			i	=	buffer.indexOf("'");
			
			//如果缓冲区内没有单引号，则把缓冲区的值追加给解码后的值
			if(i < 0 ){
				deStr += buffer;
			}
			else{
				deStr 	+=	buffer.substring(0, i+1);	//把单引号之前的值(包括单引号)截给解码值
				buffer	=	buffer.substring(i+1);		//缓冲区赋值为单引号(不含单引号)之后的值
				
				i		=	buffer.indexOf("'");		//查找与第一个单引号配对的单引号
				
				if(i < 0){
					throw new Exception("字符串内的单引号没有完整配对");
				}
				
				tmpPre	=	buffer.substring(0, i);
				
				if (tmpPre.length() > 0){
					deStr	+=	StringUtil.hexToString(tmpPre);					
				}
				deStr	+=	"'";
				
				buffer	=	buffer.substring(i+1);		//缓冲区重新赋值为单引号(不含单引号)之后的值
			}
			
		}while(i>=0);
		
		return deStr;
	}
	
	/**
	 * @param data 原始字符串
	 * @param closureLeft 左侧包裹符
	 * @param closureRight 右侧包裹符
	 * @return 如果data或包裹符为null或空串，或者data已经被包裹符包裹，则返回data<br>否则，在data前后追加包裹符
	 * */
	public static String enClosure(String data, String closureLeft, String closureRight)
	{
		//如果data或closure为null或空串，则返回data
		if (data == null	|| "".equals(data) || 
				closureLeft == null || "".equals(closureLeft) ||
				closureRight == null || "".equals(closureRight))
			return data;
		
		//如果data已经被包裹符包裹，则返回data
		int firstPosi		=	data.indexOf(closureLeft);
		int lastPosi		=	data.lastIndexOf(closureRight);
		int closureRightLen	=	closureRight.length();
		if(0 == firstPosi && (data.length() - closureRightLen) == lastPosi && firstPosi != lastPosi)
			return data;
		
		return closureLeft + data + closureRight;
	}
	
	/**
	 * @param data 原始字符串
	 * @param closure 包裹符
	 * @return 如果data或包裹符为null或空串，或者data已经被包裹符包裹，则返回data<br>否则，在data前后追加包裹符
	 * */
	public static String enClosure(String data, String closure)
	{
		return StringUtil.enClosure(data, closure, closure);
	}
	
	/**
	 * @param data 原始字符串
	 * @param closureLeft 左侧包裹符
	 * @param closureRight 右侧包裹符
	 * @return 如果data或包裹符为null或空串，或者data没有被包裹符包裹，则返回data<br>
	 * 			否则，在data前后清除包裹符
	 * */
	public static String deClosure(String data, String closureLeft, String closureRight)
	{
		//如果data或closure为null或空串，则返回data
		if (data == null || "".equals(data) || 
				closureLeft == null || "".equals(closureLeft) ||
				closureRight == null || "".equals(closureRight))
			return data;
		
		//如果data已经被包裹符包裹，则清除包裹符
		int firstPosi		=	data.indexOf(closureLeft);
		int lastPosi		=	data.lastIndexOf(closureRight);
		int dataLen			=	data.length();
		int closureLeftLen	=	closureLeft.length();
		int closureRightLen	=	closureRight.length();
		
		if(0 ==  firstPosi && (dataLen-closureRightLen) == lastPosi && firstPosi != lastPosi)
		{			
			return data.substring(firstPosi+closureLeftLen, lastPosi);
		}
		
		//其他情况，原始串没有被包裹符包裹，直接返回
		return data;
	}
	
	/**
	 * @param data 原始字符串
	 * @param closure 包裹符
	 * @return 如果data或包裹符为null或空串，或者data没有被包裹符包裹，则返回data<br>
	 * 			否则，在data前后清除包裹符
	 * */
	public static String deClosure(String data, String closure)
	{
		return StringUtil.deClosure(data, closure, closure);
	}

	public static void main(String[] args) throws Exception
	{
		String raw = "IIF(a='a,34 中文b',a,b)";
		System.out.println(raw);
		String hex = StringUtil.encodeInnerString(raw);
		System.out.println(hex);
		System.out.println(StringUtil.decodeInnerString(hex));
	}
}
