package td.enterprise.wanalytics.etl.util;

import org.apache.commons.httpclient.ConnectTimeoutException;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpRequest;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.protocol.HttpContext;

import javax.net.ssl.SSLException;
import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.UnknownHostException;

public class ETLHttpRequestRetryHandler implements HttpRequestRetryHandler{
	@Override
	public boolean retryRequest(IOException exception,
			int executionCount, HttpContext context) {
		   if (executionCount >= 3) {
                // 超过三次则不再重试请求  
                return false;
            }  
            if (exception instanceof InterruptedIOException) {
                // Timeout  
                return false;
            }  
            if (exception instanceof UnknownHostException) {
                // Unknown host
                return false;  
            }  
            if (exception instanceof ConnectTimeoutException) {
                // Connection refused
                return false;
            }  
            if (exception instanceof SSLException) {
                // SSL handshake exception  
                return false;  
            }  
            HttpClientContext clientContext = HttpClientContext.adapt(context);  
            HttpRequest request = clientContext.getRequest();  
            boolean idempotent = !(request instanceof HttpEntityEnclosingRequest);
        return idempotent;
    }
}
