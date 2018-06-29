package com.rx.system.model.excel;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

@SuppressWarnings("unchecked")
public class DOM4JUtil {
	private static Document doc = null;// 文档对象

	static Element root = null;
	
	/**
	 * 装载�?个XML文档
	 * 
	 * @throws DocumentException
	 * @throws IOException 
	 */
	public static Document loadDoc(String classPath) throws DocumentException, IOException {
		// 载入XML文档
		SAXReader sr = new SAXReader(true);
		// 从类路径中获取xml文件
		// return
		// sr.read(DOM4JUtil.class.getClassLoader().getResource(classPath));
		// 从文件路径中获取xml文件
		return sr.read(new File(classPath));
	}
	
	public static Document loadDoc(String filePath,boolean validate) throws DocumentException, IOException {
		// 载入XML文档
		SAXReader sr = new SAXReader(validate);
		// 从类路径中获取xml文件
		// return
		// sr.read(DOM4JUtil.class.getClassLoader().getResource(classPath));
		// 从文件路径中获取xml文件
		return sr.read(new File(filePath));
	}
	
	public static Document loadDocFromXMLString(String xmlString) throws DocumentException{
//		String strTitle = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	    Document document = null;
	    //document = DocumentHelper.parseText(strTitle + xmlString );
	    document = DocumentHelper.parseText(xmlString);
	    return document;
	}

	/**
	 * 输出�?个文档到控制�?
	 * 
	 * @throws IOException
	 */
	public static void printDoc(Document doc) throws IOException {
		// 建立输出字符格式
		OutputFormat of = new OutputFormat();
		of.setEncoding("GB2312");
		XMLWriter writer = new XMLWriter(System.out, of);
		writer.write(doc);

	}

	/**
	 * 保存到文�?
	 * 
	 * @throws IOException
	 */
	public static void saveDoc(Document doc, String fileName)
			throws IOException {
		FileOutputStream fos = new FileOutputStream(fileName);
		// 建立输出字符格式
		OutputFormat of = new OutputFormat();
		of.setEncoding("GB2312");
		//
		XMLWriter writer = new XMLWriter(fos, of);
		writer.write(doc);
		fos.flush();
	}

	/**
	 * 执行DTD验证
	 * 
	 * @throws DocumentException
	 */
	public static Document validateDTD(String xmlfile) throws DocumentException {

		// 载入XML文档，注意此时建立的SAXReader为需要验�?.
		SAXReader sr = new SAXReader(true);

		// 从类路径中获取xml文件
		return sr.read(DOM4JUtil.class.getClassLoader().getResource(xmlfile));
	}

	/**
	 * 建立新的文档
	 */
	@SuppressWarnings("unused")
	public static Document createDoc() {
		Document doc = DocumentHelper.createDocument();
		Element root = doc.addElement("root");
		Element author2 = root.addElement("author")
				.addAttribute("name", "Toby").addAttribute("location",
						"Germany").addText("Tobias Rademacher");
		Element author1 = root.addElement("author").addAttribute("name",
				"James").addAttribute("location", "UK").addText(
				"James Strachan");
		return doc;
	}
	/**
	 * 生成通讯录分组信息的XML文档
	 * @param groupMap
	 * @return
	 */
	/*public static Document createGroupXmlDoc(Map<String,String> groupMap) {
		Document doc = DocumentHelper.createDocument();
		Element tabbar = doc.addElement("tabbar");
		Element row = tabbar.addElement("row");
		java.util.Iterator it =groupMap.keySet().iterator();
		while(it.hasNext()){
			String key=(String)it.next();
			Element tab = row.addElement("tab").addAttribute("id", key)
				.addAttribute("width", "150px").addText(groupMap.get(key));
			
		}
		try {
			printDoc(doc);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return doc;
	}*/
	
	public static Element getUserById(String id) {
		// return doc.elementByID(id);
		Element e = (Element) doc.selectSingleNode("//user[@userid='" + id
				+ "']");
		System.out.print(e.attributeValue("userid") + ","
				+ e.attributeValue("username") + ","
				+ e.attributeValue("password") + "," + e.attributeValue("sex")
				+ "," + e.attributeValue("IDcardNO") + ","
				+ e.attributeValue("address") + ","
				+ e.attributeValue("postNO") + "," + e.attributeValue("email")
				+ "," + e.attributeValue("telephone") + ","
				+ e.attributeValue("image")

		);
		java.util.Iterator it = e.elementIterator("role");
		while (it.hasNext()) {
			Element em = (Element) it.next();
			System.out.println("," + em.elementText("roleid") + ","
					+ em.elementText("rolename"));
		}
		return e;
	}
	
	/**
	 * 执行XPath
	 */
	public static Element getSingleElementByXPath(Document doc, String xpath) {
		return (Element) doc.selectSingleNode(xpath);
	}
	
	public static Iterator getElementsIteratorByXPath(Document doc, String tagName) {
		return  doc.getRootElement().elementIterator(tagName);
	}
	
	public static List getElementsListByXPath(Document doc, String xpath) {
		return  doc.selectNodes(xpath);
	}
	
	

	public static void main(String[] args) throws DocumentException, IOException {
		 
	}
}
