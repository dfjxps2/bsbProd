package com.rx.system.bsc.synchrodata;

import java.io.*;
import java.util.Properties;

public class PropertiesUtil {


	private static final String properiesName = "spring/jdbc_oracle_local.properties";
	private static Properties prop = new Properties();
	static {
		InputStream is = null;
		try {
			is = PropertiesUtil.class.getClassLoader().getResourceAsStream(
					properiesName);
			prop.load(is);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				is.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public static String getPropery(String key) {
		return prop.getProperty(key);
	}

	public void writeProperty(String key, String value) {
		InputStream is = null;
		OutputStream os = null;
		Properties p = new Properties();
		try {
			is = new FileInputStream(properiesName);
			p.load(is);
			os = new FileOutputStream(PropertiesUtil.class.getClassLoader()
					.getResource(properiesName).getFile());
			p.setProperty(key, value);
			p.store(os, key);
			os.flush();
			os.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (null != is)
					is.close();
				if (null != os)
					os.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

	}

	public static String getLogUrl() {
		String path = PropertiesUtil.class.getClassLoader().getResource("")
				.getPath();
		return path.substring(0, path.indexOf("QCMS"));
	}

	public static void main(String[] args) {
		System.out.println(PropertiesUtil.getPropery("user.name"));
	}
}