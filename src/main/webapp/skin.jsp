<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
  <head>
    <title></title>
    <style>
		.hover {
			background-color: #e8e8e8;
		}
	 
 		.x-form{   
			background:transparent url(/public/skin/images/slate/huang.bmp) repeat;
		}  
.x-tree-node-expanded .x-tree-node-icon{
background-image:url(${pageContext.request.contextPath}/public/images/icons/book_open.png);
}

.x-tree-node-leaf .x-tree-node-icon{
	background-image:url(${pageContext.request.contextPath}/public/images/icons/details.gif);
}

.x-tree-node-collapsed .x-tree-node-icon{
	background-image:url(${pageContext.request.contextPath}/public/images/icons/book.png);
}

.x-tree-node-external .x-tree-node-icon{
	background-image:url(${pageContext.request.contextPath}/public/images/icons/mea_external.png);
}
.x-tree-node-datasource .x-tree-node-icon{
	background-image:url(${pageContext.request.contextPath}/public/images/icons/mea_datasource.png);
}
.x-tree-node-compound .x-tree-node-icon{
	background-image:url(${pageContext.request.contextPath}/public/images/icons/mea_compound.png);
}
	</style> 
  </head> 
  <script type="text/javascript"> 
      document.onkeydown = function(e){
          var event = window.event || e;
          if(event.keyCode==8 && event.srcElement.readOnly){
              event.keyCode=0;
              event.returnValue=false;
          } 
      };
      
      var sid = "<%=session.getId()%>";
      function on_load(){
          return;
      	if(null == sid || "" == sid || sid != window.top.sessionId){
      		window.top.location.href='${pageContext.request.contextPath}';
      	}
      }
      on_load();
  </script>
</html>
