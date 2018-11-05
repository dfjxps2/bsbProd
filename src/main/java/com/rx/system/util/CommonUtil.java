package com.rx.system.util;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Random;

public class CommonUtil
{

	public CommonUtil()
	{
	}

	public static String getParam(String string, String leftFlag, String rightFlag)
	{
		String param = "";
		for (; string.indexOf(rightFlag) < string.indexOf(leftFlag) && string.indexOf(rightFlag) >= 0; string = string.substring(string.indexOf(rightFlag) + rightFlag.length()));
		if (string.indexOf(leftFlag) >= 0 && string.indexOf(rightFlag) >= 0)
		{
			int pos1 = string.indexOf(leftFlag);
			int pos2 = string.indexOf(rightFlag);
			param = string.substring(pos1 + leftFlag.length(), pos2);
		}
		return param;
	}

	public static String getParam(String str, String left, String right, int index)
	{
		int pos = 0;
		int i;
		for (i = str.indexOf(left); pos < index && i > -1; pos++)
			i = str.indexOf(left, i + 1);

		if (i == -1)
			return "";
		int j = str.indexOf(right, i);
		if (j == -1)
			return "";
		else
			return str.substring(i + 1, j);
	}

	public static String getParam(String string, char leftFlag, char rightFlag)
	{
		String param = "";
		for (; string.indexOf(rightFlag) < string.indexOf(leftFlag) && string.indexOf(rightFlag) >= 0; string = string.substring(string.indexOf(rightFlag) + 1));
		if (string.indexOf(leftFlag) >= 0 && string.indexOf(rightFlag) >= 0)
		{
			int pos1 = string.indexOf(leftFlag);
			int pos2 = string.indexOf(rightFlag);
			param = string.substring(pos1 + 1, pos2);
		}
		return param;
	}

	public static String replace(String str, String str1, String str2)
	{
		for (int pos = str.indexOf(str1); pos >= 0; pos = str.indexOf(str1))
			str = String.valueOf((new StringBuffer(str.substring(0, pos))).append(str2).append(str.substring(str1.length() + pos)));

		return str;
	}

	public static String format(String value, String format)
	{
		try
		{
			DecimalFormat df = new DecimalFormat(format);
			double d = Double.parseDouble(value);
			value = df.format(d);
		}
		catch (Exception exception) { }
		return value;
	}

	public static String format(double d, String format)
	{
		try
		{
			DecimalFormat df = new DecimalFormat(format);
			return df.format(d);
		}
		catch (Exception exception)
		{
			return "";
		}
	}

	public static String format(Date date, String format)
	{
		String value = date.toString();
		try
		{
			SimpleDateFormat df = new SimpleDateFormat(format);
			value = df.format(date);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return value;
	}

	public static Date getDate(String string)
		throws Exception
	{
		SimpleDateFormat formatter = null;
		String split = null;
		if (string.indexOf("/") > 0)
			split = "/";
		else
		if (string.indexOf("-") > 0)
			split = "-";
		if (split == null)
			throw new Exception("��������ڷָ��");
		if (string.indexOf(":") > 0)
			formatter = new SimpleDateFormat("yy" + split + "MM" + split + "dd hh:mm:ss", Locale.CHINA);
		else
			formatter = new SimpleDateFormat("yy" + split + "MM" + split + "dd", Locale.CHINA);
		return formatter.parse(string);
	}

	public static String getStringValue(Object object)
	{
		if (object == null)
			return "";
		else
			return object.toString().trim();
	}

	public static double getDoubleValue(Object object)
	{
		if (object == null)
			return 0.0D;
		double d = 0.0D;
		String className = object.getClass().getName();
		if (className.indexOf("BigDecimal") > 0)
			d = ((BigDecimal)object).doubleValue();
		else
		if (className.indexOf("Double") > 0)
			d = ((Double)object).doubleValue();
		else
		if (className.indexOf("Integer") > 0)
			d = ((Integer)object).intValue();
		else
		if (className.indexOf("String") > 0)
		{
			String s = (String)object;
			try
			{
				d = Double.parseDouble(s);
			}
			catch (Exception exception) { }
		}
		if (Double.isNaN(d) || Double.isInfinite(d))
			d = 0.0D;
		return d;
	}

	public static String getRandomID(int length)
	{
		Random random = new Random();
		StringBuffer sb = new StringBuffer();
		sb.append(System.currentTimeMillis());
		int size = length - sb.length();
		for (int i = 0; i < size; i++)
			sb.append(random.nextInt(10));

		String s = sb.toString();
		if (s.length() > length)
			s = s.substring(s.length() - length);
		return s;
	}
	public static String getCurrentDateString(){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		return sdf.format(date).toString();
	}
	public static int getRandomInteger(int upper)
	{
		Random random = new Random();
		return random.nextInt(upper);
	}

	public static double Max(double d1, double d2)
	{
		return Double.compare(d1, d2) < 0 ? d2 : d1;
	}

	public static double Min(double d1, double d2)
	{
		return Double.compare(d1, d2) < 0 ? d1 : d2;
	}

	public static int Int(double d)
	{
		return (int)d;
	}

	public static double Abs(double d)
	{
		return Math.abs(d);
	}

	public static double If(boolean condition, double d1, double d2)
	{
		try
		{
			if (condition)
				return d1;
			else
				return d2;
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return 0.0D;
	}

}
