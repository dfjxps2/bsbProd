package com.rx.system.model.excel;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtil {

	public StringUtil() {
	}

	public static boolean isNullString(String str) {

		return (null == str || "".equals(str.trim())) ? true : false;
	}

	public static boolean isNullStr(String str) {
		if (str == null || str.equals("") || str.equalsIgnoreCase("null"))
			return true;
		return false;
	}

	public static boolean isNumAndCharStr(String str) {
		if (str.matches("[0-9A-Za-z]+"))
			return true;
		return false;
	}

	public static boolean isNumStr(String str) {
		if (str.matches("[0-9]+"))
			return true;
		return false;
	}

	public static String ToHexString(String str) {
		String hexString = "";
		for (int i = 0; i < str.length(); i++) {
			char c = str.charAt(i);
			hexString += "\\u" + Integer.toHexString((int) c);
		}
		return hexString;
	}

	public static String getExceptionMessages(String prestr, Throwable e) {
		if (e == null)
			return "";
		String str = e.toString() + "\r\n";
		if (prestr != null)
			str = prestr + str;
		StackTraceElement[] stes = e.getStackTrace();
		for (int i = 0, len = stes.length; i < len; i++) {
			str = str + "\t" + stes[i].toString() + "\r\n";
		}

		prestr = "Caused by: ";
		str = str + getExceptionMessages(prestr, e.getCause());
		return str;
	}

	public static boolean isTrue(String bstr) {
		if (isNullStr(bstr))
			return false;
		if (bstr.toLowerCase().equals("true")
				|| bstr.toLowerCase().equals("yes")
				|| bstr.toLowerCase().equals("t")
				|| bstr.toLowerCase().equals("y"))
			return true;
		return false;
	}

	public static String getNotNullString(String str) {

		return str == null ? "" : str;

	}

	

	@SuppressWarnings("unused")
	private static String[][] QuickSort(String a[][], int lo0, int hi0) {
		int lo = lo0;
		int hi = hi0;
		if (hi0 > lo0) {
			int mid = Integer.parseInt(a[(lo0 + hi0) / 2][0]);
			do {
				if (lo > hi)
					break;
				for (; lo < hi0 && Integer.parseInt(a[lo][0]) < mid; lo++)
					;
				for (; hi > lo0 && Integer.parseInt(a[hi][0]) > mid; hi--)
					;
				if (lo <= hi) {
					String[] str = null;
					str = a[lo];
					a[lo] = a[hi];
					a[hi] = str;
					lo++;
					hi--;
				}
			} while (true);
			if (lo0 < hi)
				QuickSort(a, lo0, hi);
			if (lo < hi0)
				QuickSort(a, lo, hi0);
		}
		return a;
	}

	/*public static String unescape(String src) {
		StringBuffer tmp = new StringBuffer();
		tmp.ensureCapacity(src.length());
		int lastPos = 0, pos = 0;
		char ch;
		while (lastPos < src.length()) {
			pos = src.indexOf("%", lastPos);
			if (pos == lastPos) {
				if (src.charAt(pos + 1) == 'u') {
					ch = (char) Integer.parseInt(src
							.substring(pos + 2, pos + 6), 16);
					tmp.append(ch);
					lastPos = pos;
				}
			}
		}
		return tmp.toString();
	}*/

	/** * 转换unicode字符串为其对应的实际字符�?, 
	 * UnicodeToString("测试\\u4E2D\\u6587") 输出�?: "测试中文" *  
	 * * @param str 
	 * * @return */
	public static String UnicodeToString(String str) {
		Pattern pattern = Pattern.compile("(\\\\u(\\p{XDigit}{4}))");
		Matcher matcher = pattern.matcher(str);
		char ch;
		while (matcher.find()) {
			ch = (char) Integer.parseInt(matcher.group(2), 16);
			//str = str.replace(matcher.group(1), ch + "");
			str = str.replaceAll(matcher.group(1), ch + "");
		}
		return str;
	}

	public static String escape(String src) {
		int i;
		char j;
		StringBuffer tmp = new StringBuffer();
		tmp.ensureCapacity(src.length() * 6);
		for (i = 0; i < src.length(); i++) {
			j = src.charAt(i);
			if (Character.isDigit(j) || Character.isLowerCase(j)
					|| Character.isUpperCase(j))
				tmp.append(j);
			else if (j < 256) {
				tmp.append("%");
				if (j < 16)
					tmp.append("0");
				tmp.append(Integer.toString(j, 16));
			} else {
				tmp.append("%u");
				tmp.append(Integer.toString(j, 16));
			}
		}
		return tmp.toString();
	}

	public static String unescape2(String src) {
		StringBuffer tmp = new StringBuffer();
		tmp.ensureCapacity(src.length());
		int lastPos = 0, pos = 0;
		char ch;
		while (lastPos < src.length()) {
			pos = src.indexOf("%", lastPos);
			if (pos == lastPos) {
				if (src.charAt(pos + 1) == 'u') {
					ch = (char) Integer.parseInt(src
							.substring(pos + 2, pos + 6), 16);
					tmp.append(ch);
					lastPos = pos + 6;
				} else {
					ch = (char) Integer.parseInt(src
							.substring(pos + 1, pos + 3), 16);
					tmp.append(ch);
					lastPos = pos + 3;
				}
			} else {
				if (pos == -1) {
					tmp.append(src.substring(lastPos));
					lastPos = src.length();
				} else {
					tmp.append(src.substring(lastPos, pos));
					lastPos = pos;
				}
			}
		}
		return tmp.toString();
	}


	public static void main(String[] args) {

		/*String tmp = "中文";
		System.out.println("testing escape : " + tmp);
		tmp = escape(tmp);
		System.out.println(tmp);
		System.out.println("testing unescape :" + tmp);
		System.out.println(unescape2("%u6211%u4eec"));
		System.out.println(Long.parseLong("3298918863"));*/
		System.out.println("\u5c0f\u8717");
		System.out.println(Integer.parseInt("200901".substring(4)));
		System.out.println(Integer.parseInt("60".substring(0,1)));
	}
}
