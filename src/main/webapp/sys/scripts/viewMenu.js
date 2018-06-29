//导航js开始====
		$(function(){
			var time = null;
			var list = $("#navlist");
			var box = $("#navbox");
			var lista = list.find("a");
	
			var box_show = function(hi){
				box.stop().animate({
					heigth:hi,
					opacity:1
				},400);
			};
			
			list.bind({
				mouseover : function(){
					clearTimeout(time);
					box.find(".cont").show();
					var _height = box.find(".cont").height();
					box_show(_height);
				},
				mouseout : function(){
					time = setTimeout(function(){	
						box.find(".cont").fadeOut('fast');
					},200);
				}
			});
			
//			lista.hover(function(){
//				clearTimeout(time);
//				box.find(".cont").show();
//				var _height = box.find(".cont").height();
//				box_show(_height);
//			},function(){
//				time = setTimeout(function(){	
//					box.find(".cont").fadeOut('fast');
//				},200);
//				
//			});
	
			box.find(".cont").hover(function(){
				clearTimeout(time);
				$(this).show();
				var _height = $(this).height()+10;
				box_show(_height);
			},function(){
				time = setTimeout(function(){		
					box.find(".cont").fadeOut('fast');
				},200);
			});
		});
		//导航js结束====
		
		//“快速菜单”链接
		function topage(id,title,url){
			//悬浮框消失
			$(".cont").fadeOut('fast');
			
			//展开对应菜单
			var mids = (id == null || id == '') ? null : id.split("_");
			if(mids == null ){
				return;	
			}
			if(mids.length == 2){					//二级功能菜单
				var obj = document.getElementById(mids[0]);
				if(obj.className.toLowerCase() != "expanded"){
					DoMenu(mids[0]);				//展开其父级菜单
				}
			}else if(mids.length == 3){				//三级功能菜单
				var obj = document.getElementById(mids[0]);
				if(obj.className.toLowerCase() != "expanded"){
					DoMenu(mids[0]);					//展开其父级的父级菜单（最外层菜单）
					DoSecMenu(mids[0] + '_' + mids[1]);	//展开其父节点
				}
				var obj2 = document.getElementById(mids[0] + '_' + mids[1]);
				if(obj2.className.toLowerCase() != "expanded"){
					DoSecMenu(mids[0] + '_' + mids[1]);	//展开其父节点
				}
			}else{
				return;
			}
			
			//查找对应的功能菜单，触发click事件
			$("#m_"+id).click();		
		}