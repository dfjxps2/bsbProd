package com.rx.system.bsc.synchrodata;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CookieUtil {
	/**
     * 设置cookie有效期，根据需要自定义[本系统设置为30天]
     */
    private final static int COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;
    
    /**
     * 根据Cookie名称得到Cookie对象，不存在该对象则返回Null
     * @param request
     * @param name 
     */
    public static Cookie get(HttpServletRequest request, String name) {
    	Cookie cookies[] = request.getCookies();
        if (cookies == null || name == null || name.length() == 0)
            return null;
        Cookie cookie = null;
        for (int i = 0; i < cookies.length; i++) {
            if (!cookies[i].getName().equals(name))
                continue;
            cookie = cookies[i];
            if (request.getServerName().equals(cookie.getDomain()))
                break;
        }
        return cookie;
    }
    /**
     * 添加一条新的Cookie信息
     * @param response
     * @param name
     * @param value
     */
    public static void set(HttpServletResponse response, String name, String value) {
    	set(response, name, value, 0);
    }

   /**
    * 添加一条新的Cookie信息，可以设置其最长有效时间(单位：秒)
    * @param response
    * @param name
    * @param value
    * @param maxAge
    */
   public static void set(HttpServletResponse response, String name, String value, int maxAge){
	   if (value == null)
		   value = "";
	   Cookie cookie = new Cookie(name, value);
	   if(maxAge!=0){
		   cookie.setMaxAge(maxAge);
	   }
	   cookie.setPath("/");
	   response.addCookie(cookie);
   }
    
   /**
    * 删除指定Cookie
    */
   public static void remove(HttpServletResponse response, HttpServletRequest request, String name){
	   Cookie cookie = get(request, name);
       if (cookie != null) {
           cookie.setPath("/");
           cookie.setValue("");
           cookie.setMaxAge(0);
           response.addCookie(cookie);
       }
   }
  /**
   *
   * 删除指定Cookie
   * @param response
   * @param cookie
   */
  public static void remove(HttpServletResponse response, Cookie cookie){
      if (cookie != null) {
          cookie.setValue("");
          cookie.setMaxAge(0);
          response.addCookie(cookie);
      }
  }
   /**
    * 删除指定Cookie
    * @param response
    * @param domain
    */
   public static void remove(HttpServletResponse response, HttpServletRequest request, String name,String domain){
	   Cookie cookie = get(request, name);
	   if (cookie != null){
           cookie.setValue("");
           cookie.setMaxAge(0);
           cookie.setDomain(domain);
           response.addCookie(cookie);
	   }
   }
   /**
    * 删除指定Cookie
    * @param response
    * @param
    */
   public static void clear(HttpServletResponse response, HttpServletRequest request){
	   Cookie cookies[] = request.getCookies();
	   if(cookies == null)
		   return;
	   for(int i = 0; i < cookies.length; i++) {
		   cookies[i].setValue("");
		   cookies[i].setMaxAge(0);
           response.addCookie(cookies[i]);
	   }
	   
   }

   /**
    * 根据Cookie名称得到Cookie的值，没有返回Null
    * @param request
    * @param name
    * @return
    */
   public static String getValue(HttpServletRequest request, String name){
       Cookie cookie = get(request, name);
       if (cookie != null){
    	   return cookie.getValue();
       }
       else {
    	   return null;
       }
   }
   
   /**
	 * 清除所有cookie
	 * @param req
	 * @param res
	 */
	public static void clear(HttpServletRequest req,HttpServletResponse res) {
		Cookie[] cookies = req.getCookies();
		for(int i = 0,len = cookies.length; i < len; i++) {
			Cookie cookie = new Cookie(cookies[i].getName(),null);
			cookie.setMaxAge(0);
			cookie.setPath("/");
			res.addCookie(cookie);
		}
	}

}
