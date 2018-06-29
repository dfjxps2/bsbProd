package com.rx.system.util;

import javax.servlet.http.HttpServletRequest;

public class RequestUtils {
    /**
     * <p>Return the string representing the scheme, server, and port number of
     * the current request. Server-relative URLs can be created by simply
     * appending the server-relative path (starting with '/') to this.</p>
     *
     * @param request The servlet request we are processing

     * @return URL representing the scheme, server, and port number of
     *     the current request
     * @since Struts 1.2.0
     */
    public static StringBuffer requestToServerUriStringBuffer(HttpServletRequest request) {

        StringBuffer serverUri = createServerUriStringBuffer(request.getScheme(),request.getServerName(),
        request.getServerPort(),request.getRequestURI());
        return serverUri;

    }

    /**
     * <p>Return <code>StringBuffer</code> representing the scheme, server, and port number of
     * the current request. Server-relative URLs can be created by simply
     * appending the server-relative path (starting with '/') to this.</p>
     *
     * @param request The servlet request we are processing
     *
     * @return URL representing the scheme, server, and port number of
     *     the current request
     * @since Struts 1.2.0
     */
    public static StringBuffer requestToServerStringBuffer(HttpServletRequest request) {

        return createServerStringBuffer(request.getScheme(),request.getServerName(),request.getServerPort());

    }

    /**
     * <p>Return <code>StringBuffer</code> representing the scheme, server, and port number of
     * the current request.</p>
     *
     * @param scheme The scheme name to use
     * @param server The server name to use
     * @param port The port value to use
     *
     * @return StringBuffer in the form scheme: server: port
     * @since Struts 1.2.0
     */
    public static StringBuffer createServerStringBuffer(String scheme,String server,int port) {

        StringBuffer url = new StringBuffer();
        if (port < 0) {
            port = 80; // Work around java.net.URL bug
        }
        url.append(scheme);
        url.append("://");
        url.append(server);
        if ((scheme.equals("http") && (port != 80)) || (scheme.equals("https") && (port != 443))) {
            url.append(':');
            url.append(port);
        }
        return url;

    }

    /**
     * <p>Return <code>StringBuffer</code> representing the scheme, server, and port number of
     * the current request.</p>
     *
     * @param scheme The scheme name to use
     * @param server The server name to use
     * @param port The port value to use
     * @param uri The uri value to use
     *
     * @return StringBuffer in the form scheme: server: port
     * @since Struts 1.2.0
     */
    public static StringBuffer createServerUriStringBuffer(String scheme,String server,int port,String uri) {

        StringBuffer serverUri = createServerStringBuffer(scheme,server,port);
        serverUri.append(uri);
        return serverUri;

    }
}