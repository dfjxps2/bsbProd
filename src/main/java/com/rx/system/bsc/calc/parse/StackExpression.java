package com.rx.system.bsc.calc.parse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;

import com.rx.system.bsc.calc.function.FunctionFactory;
import com.rx.system.bsc.calc.function.IFunction;

public class StackExpression implements IExpression {
	
	private String 				expression 			=	"";		//原始值表达式，即原始公式
	private String				parseResult			=	"";		//解析结果
	private String				parseMessage		=	"";		//解析过程中的消息
	
	private List<String>		exprElements		=	null;	//存储原始表达式中各个函数名称，括号和元素表达式
	
	private Stack<String>		funcStack			=	null;	//函数栈；存储函数名称
	private Stack<String>		exprStack			=	null;	//表达式栈；存储值表达式
	
	private Set<String>			operators			=	null;	//支持的数学表达式和逻辑运算表达式
	
	private Map<String, String> specEncoderMap		=	null;	//特殊字符编码表
	private Map<String, String> specDecoderMap		=	null;	//特殊字符解码表
	
	private Map<String, String> translateSplitMap	=	null;	//字符替换映射表；用于分隔出特殊字符
	
	
	public String getExpression() {
		return expression;
	}
	
	public void setExpression(String expression) {
		this.expression = expression;
	}	

	public String getParseMessage() {
		return parseMessage;
	}
	
	public void setParseMessage(String parseMessage) {
		this.parseMessage = parseMessage;
	}
	
	/**
 	 * @return
	 * 返回解析的结果
	 * */
	public String getParseResult() {
		return parseResult;
	}
	
	public void setParseResult(String parseResult) {
		this.parseResult = parseResult;
	}
	
	/**
	 * 把原始表达式解析成：原子表达式，运算符，逗号
	 * @throws Exception 
	 */
	private List<String> prepareExpression() throws Exception
	{	
		//0. 首先，把公式内的内部字符串转化成16进制，以进行保护
		String oriExpr	=	"(" + StringUtil.encodeInnerString(this.expression) + ")";
		
		//0.1 把两各紧挨着的表达式元素，处理成以空格相隔，防止解析程序当做一个元素处理
		oriExpr	=	oriExpr.replaceAll("\\]\\[", "] [");
		
		//1. 然后，把表达式串中的特殊字符，替换成映射码值
		//	特殊字符的转化，优于运算符、控制符的转化
		Iterator<String> itSpecEncode= this.specEncoderMap.keySet().iterator();
		
		while(itSpecEncode.hasNext()){
			String key	=	itSpecEncode.next();
			oriExpr		=	oriExpr.replaceAll(key, this.specEncoderMap.get(key));
		}
		
		//2. 其次，把运算符替换成以逗号为包围的串，方便截出运算符		
		String preExpr	=	oriExpr;
		Iterator<String> itTransSplit= this.translateSplitMap.keySet().iterator();
		
		while(itTransSplit.hasNext()){
			String key	=	itTransSplit.next();
			preExpr		=	preExpr.replaceAll(key, this.translateSplitMap.get(key));
		}
		
		//把空格替换成","，以便于分隔出各个元素
		preExpr	=	preExpr.replaceAll(" ", ",");
		
		//3. 按照逗号分隔出表达式中各个原子表达式以及各种运算符
		String [] elements	=	preExpr.split(",");
		
		String tmpElement	=	"";
		
		for (int i = 0; i < elements.length; i++){
			//把可能的，16进制字符串还原为原始字符串
			tmpElement	=	StringUtil.decodeInnerString(elements[i]).trim();
			
			//由于原始表达式的括号前面可能已经包含逗号, elements元素可能包含空格
			//如果分隔出的表达式是空格，则忽略			
			
			if (!"".equals(tmpElement) )
			{
				//如果是逗号特殊表达式，则替换回逗号
				if ( this.specDecoderMap.containsKey(tmpElement)){
					this.exprElements.add(this.specDecoderMap.get(tmpElement));
				}
				else{
					this.exprElements.add(tmpElement);
				}				
			}
		}
		
		return this.exprElements;
	}

	private boolean isOperator(String expr)
	{
		if (this.operators.contains(expr)){
			return true;
		}
		else{
			return false;
		}
	} 
	
	/**
	 * @return
	 * 返回表达式栈中，第一个左括号的位置（不含逗号）
	private int getFunctionParameterCount()
	{
		String	tmpExpr	=	"";
		int 	tmpCount = 0;
		
		for(int i = this.exprStack.size()-1; i>=0; i--){
			tmpExpr	=	this.exprStack.get(i);
			
			//如果找到左括号，则退出
			if ("(".equals(tmpExpr)){
				break;
			}
			
			//如果是逗号，则不计
			if (!",".equals(tmpExpr)){
				tmpCount++;
			}			
		}
		
		return tmpCount;
	}
	*/
	
	/**
	 * 解析数学表达式或布尔表达式
	 * 从表达式栈中找到上一个逗号或左括号，左括号或逗号与右括号之间的加减乘除运算拼接起来
	 * 数学表达式可能有(a), (-a), (a-b), (a/-b)等情况
	 * @return 数学表达式的结果
	 * @throws Exception 
	 * */
	private String calculateExpression() throws Exception
	{
		/***在理解算法时，首先要做到，每一次压栈后，要把栈顶的符合表达式理解一个简单的原子元素；***/
		
		//1. 从表达式栈中找到上一个左括号，左括号与右括号之间的加减乘除运算拼接起来，然后再压栈等待下一次运算
		// 左括号，右括号的表达式可能有(a), (-a), (a-b), (a/-b)等情况
		String 	tmpExpr		=	""; //表达式
		
		String	tmpOper		=	""; //操作符二元：+ - * / and or，一元：- not
		String	tmpOperVal1	=	"";	//操作值1
		String	tmpOperVal2	=	"";	//操作值2
		
		String 	errMsg		=	"";	//异常消息
		
		//左括号，逗号是算数表达式的左边界
		while( !"(".equals(this.exprStack.peek()) && !",".equals(this.exprStack.peek()) ){//只查看栈顶值，不弹出
			
			//b/-d
			//求操作数2
			tmpOperVal2	=	this.exprStack.pop();
			
			//任何情况下，操作数不能是操作符
			if (this.isOperator(tmpOperVal2)){
				throw new Exception("公式不支持后序操作符");
			}
			
			//如果表达栈为空，或者下一个元素为括号或逗号，则表达式计算完毕
			if ( this.exprStack.size() == 0 
					|| "(".equals(this.exprStack.peek())
					|| ",".equals(this.exprStack.peek())){
				
				tmpExpr	=	tmpOperVal2;
				
				this.exprStack.push(tmpExpr);
				
				break;
			}
			
			//下一个元素应该是操作符
			tmpOper = this.exprStack.peek();
			
			//如果下一个元素不是操作符(是操作数)，也不是括号，也不是逗号，则肯定是操作数
			if (!this.isOperator(tmpOper) && !"(".equals(tmpOper) && !",".equals(tmpOper)){
				errMsg	= "公式出现操作数之间无操作符的语法错误:" + tmpOperVal2 
							+ "左侧不应与" + tmpOper + "直接相连";
				
				this.setParseMessage(errMsg);
				
				throw new Exception(errMsg);
			}
			
			
			//(a)类型
			if ("(".equals(this.exprStack.peek()) || ",".equals(this.exprStack.peek())){
				tmpOper		=	"";
				tmpOperVal1	=	"";
			}
			else{
				tmpOper	=	this.exprStack.pop();
				
				if (tmpOper.equals("not")){ //not一元运算符不能紧贴操作数
					tmpOper	=	tmpOper + " ";
				}
				
				//(-a)类型
				if("(".equals(this.exprStack.peek()) || ",".equals(this.exprStack.peek())){					
					tmpOperVal1	=	"";
					
					//操作符必须是一元操作符
					if (!"-".equals(tmpOper.trim()) && !"not".equals(tmpOper.trim())){
						errMsg = "操作数" + tmpOperVal2 + "左侧应当是一元操作符，不应是"+tmpOper.trim();
						
						this.setParseMessage(errMsg);
						
						throw new Exception(errMsg);
					}
				}
				//(a/-b)类型
				else if(this.isOperator(this.exprStack.peek())){
					//b的操作符必须是一元操作符
					if (!"-".equals(tmpOper.trim()) && !"not".equals(tmpOper.trim())){
						errMsg = "操作数" + tmpOperVal2 + "左侧应当是一元操作符，不应是"+tmpOper.trim();
						
						this.setParseMessage(errMsg);
						
						throw new Exception(errMsg);
					}
					
					tmpOperVal2	=	tmpOper + tmpOperVal2;
					
					tmpOper		=	this.exprStack.pop();					
					
					tmpOperVal1	=	this.exprStack.pop();
					
					//a不能是操作符
					if(this.isOperator(tmpOperVal1) || "(".equals(tmpOperVal1) || ",".equals(tmpOperVal1)){
						
						errMsg	=	tmpOper+tmpOperVal2 + "的左侧不能再是操作符、(、,等";
						
						this.setParseMessage(errMsg);
						
						throw new Exception(errMsg);
					}
				
				}
				//(a-b)类型
				else{
					tmpOperVal1	=	this.exprStack.pop();
				}
			}
			
			//左右操作符同时不为空时，操作符左右才加空格
			tmpExpr	=	tmpOperVal1 + 
						(!"".equals(tmpOperVal1) && !"".equals(tmpOper) ? " " + tmpOper + " " : tmpOper) + 
						tmpOperVal2;
						
			this.exprStack.push(tmpExpr);
			
			tmpOper		=	"";
			tmpOperVal1	=	"";
			tmpOperVal2	=	"";
		}
		
		return tmpExpr;
	}
	
	/**
	 *	解析右括号至配对左括号之间的表达式
	 *	表达式的样式可能为(a+b/c-d)等数学表达式，也可能是Func(a,b,c)等样式的函数表达式，函数表达式中各参数
	 *	也有可能是数学表达式
	 * @throws Exception 
	 */
	private int calculateFunctionParameters() throws Exception
	{
		int				paraCnt		=	0;	//参数个数
		int				commaCnt	=	0;	//逗号个数
		String			tmpStr		=	"";
		String			calcStr		=	"";
		
		Stack<String>	paras		=	new Stack<String>();
		
		//如果表达式坐标仍有逗号，说明函数仍有参数（数据表达式）没有计算
		do{
			if (",".equals(this.exprStack.peek())){
				this.exprStack.pop();
				commaCnt++;
			}
			
			calcStr	=	calculateExpression();
			
			if (calcStr != null && !"".equals(calcStr)){
				tmpStr	=	this.exprStack.pop();			
				//先把函数参数暂存起来，等所有参数计算完之后，再压回栈
				paras.push(tmpStr);
			}
			
		} while( this.exprStack.size() != 0 && ",".equals(this.exprStack.peek()) );
		
		while (!paras.empty()){
			this.exprStack.push(paras.pop());
			paraCnt++;
		}
		
		//如果存在逗号，且逗号个数加一(逗号分隔的参数个数)不等于实际有效的参数个数
		if (commaCnt > 0 && (commaCnt+1) != paraCnt){
			throw new Exception("存在为空的参数！");
		}
		
		return paraCnt;
	}
	
	/**
	 * 重置除原始表达式之外的所有变量
	 **/
	private void reset()
	{
		this.initialize();
	}
	
	/**
	 * 初始化对象的各种参数
	 */
	private void initialize()
	{
		this.exprElements		=	new ArrayList<String>();//元素
		this.funcStack			=	new	Stack<String>();	//函数栈=>函数名称
		this.exprStack			=	new	Stack<String>();	//表达式栈=>原子值表达式
		
		this.operators			=	new	HashSet<String>();
		
		this.specEncoderMap		=	new	HashMap<String, String>();	//特殊字符编码表
		this.specDecoderMap		=	new	HashMap<String, String>();	//特殊字符解码表
		
		this.translateSplitMap	=	new	HashMap<String, String>();	//字符替换映射表；用于分隔出特殊字符
		
		//数学表达式
		this.operators.add("+");
		this.operators.add("-");
		this.operators.add("*");
		this.operators.add("/");
		
		//逻辑表达式
		this.operators.add("!");
		this.operators.add("=");
		this.operators.add(">");
		this.operators.add(">=");
		this.operators.add("<");
		this.operators.add("<=");
		this.operators.add("<>");
		this.operators.add("!=");
		this.operators.add("and");
		this.operators.add("or");
		this.operators.add("not");
		this.operators.add("in");
				
		//特殊字符映射表，特殊字符转化优于其他字符的转化
		this.specEncoderMap.put(",",	"#0x002C");
		this.specEncoderMap.put(">=",	"#0x3E3D");
		this.specEncoderMap.put("<=",	"#0x3C3D");
		this.specEncoderMap.put("<>",	"#0x3C3E");
		this.specEncoderMap.put("!=",	"#0x213D");
		
		this.specDecoderMap.put("#0x002C", "," );
		this.specDecoderMap.put("#0x3E3D", ">=");
		this.specDecoderMap.put("#0x3C3D", "<=");
		this.specDecoderMap.put("#0x3C3E", "<>");
		this.specDecoderMap.put("#0x213D", "!=");
		
		/*字符替换映射表: 用于分隔出特殊字符；所有运算符，以及括号都要被转化成被逗号包围
			表的key值，是String.replaceAll的第一个参数；第一个参数需要符合正则表达式规范，所以部分字符需要被反斜线转义
		 */
		/*************************************************************
		 *特殊转义区													 *
		 *************************************************************/
		this.translateSplitMap.put(this.specEncoderMap.get(","),	","+this.specEncoderMap.get(",")+",");	/*	,	*/
		this.translateSplitMap.put(this.specEncoderMap.get(">="), 	","+this.specEncoderMap.get(">=")+",");	/*	>=	*/
		this.translateSplitMap.put(this.specEncoderMap.get("<="), 	","+this.specEncoderMap.get("<=")+",");	/*	<=	*/
		this.translateSplitMap.put(this.specEncoderMap.get("<>"), 	","+this.specEncoderMap.get("<>")+",");	/*	<>	*/
		this.translateSplitMap.put(this.specEncoderMap.get("!="), 	","+this.specEncoderMap.get("!=")+",");	/*	!=	*/

		/*************************************************************
		 *算术控制区													 *
		 *************************************************************/
		this.translateSplitMap.put("\\(",	",(,");				/*	(	*/
		this.translateSplitMap.put("\\)",	",),");				/*	)	*/
		
		/*************************************************************
		 *算术运算区													 *
		 *************************************************************/
		this.translateSplitMap.put("\\+",	",+,");				/*	+	*/
		this.translateSplitMap.put("\\-",	",-,");				/*	-	*/
		this.translateSplitMap.put("\\*",	",*,");				/*	*	*/
		this.translateSplitMap.put("\\/",	",/,");				/*	/	*/
		
		/*************************************************************
		 *逻辑运算区													 *
		 *************************************************************/
		this.translateSplitMap.put("&&", 		",and,");		/*	&&	*/
		this.translateSplitMap.put("\\|\\|",	",or,");		/*	||	*/
		this.translateSplitMap.put("!",			",not,");		/*	!	*/
		this.translateSplitMap.put("in",		",in,");		/*	in	*/
		this.translateSplitMap.put("=",			",=,");			/*	=	*/
		this.translateSplitMap.put(">", 		",>,");			/*	>	*/
		this.translateSplitMap.put("<", 		",<,");			/*	<	*/
		
	}
	
	//默认构造函数
	public StackExpression() 
	{
		this("");
	}
	
	public StackExpression(String expr)
	{
		this.setExpression(expr);
		
		this.initialize();
	}
	
	/**
	 * @return
	 * 	ture：解析成功<p>
	 * 	false：解析失败
	 *  
	 * 应调用 getParseResult()获取解析的结果
	 * 应调用 getParseMessage()获取程序解析过程中的消息
	 * @throws Exception 
	 * */
	public boolean doParse() throws Exception
	{
		this.setParseResult("");
		this.setParseMessage("");
		
		this.reset();
		
		String 	currElement		=	""; //记录当前元素
		String 	leftFunction	=	""; //左括号左边的函数名
		
		//1. 预处理原始表达式
		this.prepareExpression();
		
		
/*		System.out.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		
		for (int i = 0; i < this.exprElements.size(); i++) {
			System.out.println(this.exprElements.get(i));
		}
		
		System.out.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");*/
		
		
		//2. 读取表达式中的各元素，开始解析，解析最后的结果应保留在值表达式栈中
	
		for(int i = 0; i < this.exprElements.size(); i++)
		{
			currElement	=	this.exprElements.get(i);
			
			//如果是函数，则把函数名压到函数栈中
			if (FunctionFactory.hasFunction(currElement)){
				this.funcStack.push(currElement);
				leftFunction	=	currElement;
			}
			//如果取到"("，在压栈之前，压入一个特殊处理括号的函数
			else if("(".equals(currElement) ){				
				//如果元素左边的元素是函数，则把左边的元素的置空，否则
				//左括号不是一个函数的开始，应当把左括号作为一个特殊函数，压入函数栈
				if("".equals(leftFunction) && "(".equals(currElement) ){
					this.funcStack.push(FunctionFactory.FUNC_PARENTHESIS);
				}
				else{
					leftFunction = "";
				}
				
				this.exprStack.push(currElement);
			}
			//如果取到")"，则应执行出栈操作
			else if(")".equals(currElement)){
				
				/**
				 * 1. 首先应当解析右括号至配对左括号之间的表达式
				 * 	表达式的样式可能为(a+b/c-d)等数学表达式，也可能是Func(a,b,c)等样式的函数表达式
				 */
				
				//1. 从表达式栈中找到上一个左括号，左括号与右括号之间的加减乘除运算拼接起来，然后再压栈等待下一次运算
				int actualParaCnt	=	this.calculateFunctionParameters();	//表达式栈中实际的参数个数
				
				//2. 左括号的左边应该是函数名称（包括左括号函数和一般函数），所以要弹出函数栈
				String tmpFunc	=	this.funcStack.pop(); //函数				
				
				//3.1 根据弹出的函数决定，函数需要有多少个参数，即从表达式栈中弹出多少个元素
				int neededParaCnt	=	FunctionFactory.getFunction(tmpFunc).getParameterCount();
				
				//3.2 如果函数不能确定参数的个数，则查找左括号的位置，由左括号的位置决定参数个数
				if (neededParaCnt == IFunction.PARAMETER_COUNT_DEPENDED){
					neededParaCnt = actualParaCnt;//this.getFunctionParameterCount();
				}
				
				//4. 如果栈中实际参数个数，与函数所需的参数个数不同，则公式语法发生错误，应退出
				if ( actualParaCnt != neededParaCnt){
					String errMsg = "函数" + tmpFunc + "()参数个数不匹配，需要"+neededParaCnt
										+ "个，实际"+actualParaCnt + "个";
					
					this.setParseMessage(errMsg);
					
					throw new Exception(errMsg);
				}
				
				
				String[] paras	=	new	String[neededParaCnt];
				//栈的属性决定需倒序查询
				for (int j = neededParaCnt - 1; j >= 0; j--){
					paras[j]	=	this.exprStack.pop();
				}
				
				//函数解析后，弹出左括号
				if(this.exprStack.size() != 0 && "(".equals(this.exprStack.peek())) {
					this.exprStack.pop();
				}
				
				//5. 由函数实体类解析函数表达式
				String tmpExpr	=	FunctionFactory.getFunction(tmpFunc).doParse(paras);				
				
				this.exprStack.push(tmpExpr);
								
			}
			//其他情况，即运算操作符或原子表达式，应压栈
			else{
				this.exprStack.push(currElement);
				
				//如果表达式中有in逻辑运算符，则压入一个虚拟的in函数
				if ("in".equals(currElement)){
					this.funcStack.push(FunctionFactory.FUNC_IN);
					leftFunction = FunctionFactory.FUNC_IN;
				}
			}
		}
		
		this.setParseResult(exprStack.pop());

		
		//如果解析成功，则表达式栈里应为空
		return this.exprStack.empty() && "".equals(this.parseMessage);
	}

	
	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception{
		//
		//IIF(a+1>3||!POWER(2,1/3) = 0, - abc + 1, IIF (bcd + IIF(1<2.23, 1, 2.23)>9+10, bcd + LN(-1), ABs(bcd-1) ) )
		//  {ppcs_ztf_popu_prop}
		//IIF(abc>bcd, abc+1, IIF (bcd > 0, bcd, abs(bcd) ) ) + 10
		//{est_dev_corp_ast_total_amt?corp_reg_rgst_type_cd in ('0000','1000','2000','3000')}
		//IIF([@M_010001]>= 50 && [@M_020001] < [@M_020002] , [@M_020001] + 100, [@M_020001]+power(2,5))
		
		/*String exprStr =
			"IIF(a in (1,2,3), (b- -1),     ('#$%^&*('))";*/
		String exprStr ="{raly_mlg?zone_cd in ('1101A0000000','1101B0000000') && 1=1}";
//		String exprStr ="{raly_mlg?zone_cd ='1101A0000000'}";
//		String exprStr ="zone_cd in ('1101A0000000','1101B0000000')";
//		String exprStr ="est_dev_corp_ast_total_amt?corp_reg_rgst_type_cd in ('0000','1000','2000','3000')";
//		String exprStr ="{est_dev_corp_ast_total_amt?corp_oper_situ_cd in ('1000','2000','3000') && corp_reg_rgst_type_cd in ('1010','1011') && ctr_locl_subj_cd = '0001'}";
//		String exprStr ="{est_dev_corp_ast_total_amt?corp_oper_situ_cd in ('1000','2000') && corp_reg_rgst_type_cd = '1000'}";
//		String exprStr ="{ppcs_ztf_popu_prop}";
		IExpression expr = new StackExpression(exprStr);

		System.out.println("原始表达式：" + expr.getExpression());
		
		if(expr.doParse()){
			System.out.println("解析成功！");
		}
		else{
			System.out.println("解析失败！");
		}
		System.out.println("解析消息：" + expr.getParseMessage());
		System.out.println("解析结果：" + expr.getParseResult());

	}
		
}

