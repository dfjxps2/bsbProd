function createXMLDocument()
{
	var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	if(arguments.length==1)
	{
		xmlDoc.async="false";
		xmlDoc.loadXML(arguments[0]);
	}

	return xmlDoc;
}

function createXMLHTTP()
{
	var xmlhttp = null;
	try
	{
		xmlhttp= new ActiveXObject("Microsoft.XMLHTTP");
	}catch(e)
	{
	}
	return xmlhttp;
}

function selectSingleNode(pnode,xPath)
{
	return pnode.selectSingleNode(xPath);
}

function selectNodes(pnode,xPath)
{
	return pnode.selectNodes(xPath);
}

function getNodeName(node)
{
	return node.nodeName;
}

function createNodeAttribute(xmlDoc,attrName,attrValue)
{
	var attribute = xmlDoc.createAttribute(attrName);
	attribute.value = attrValue;
	return attribute;
}

function getNodeAttrValue(node,attrName)
{
	var attribute="";
	var attributes=node.attributes;
	for(var i=0;i<attributes.length;i++)
	{
		if(attributes.item(i).name==attrName)
		{
			attribute=attributes.item(i).value;
			break;
		}
	}

	return attribute;
}
