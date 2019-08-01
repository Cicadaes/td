package td.enterprise.wanalytics.etl.util.azkaban.entity;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.InputStreamBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.codehaus.jackson.map.ObjectMapper;
import td.enterprise.wanalytics.etl.common.error.BusinessException;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpErrorCode;

import java.io.*;
import java.nio.charset.Charset;

/**
 * 执行流程
 * @author tao.yang
 * @date 2015年7月7日
 */

/**
 * @author tao.yang
 * @date 2015年7月7日
 * 
 */
public class AzkabanUploadProjectZipRequest {

	private static String encode = "utf-8";

	/**
	 * The fixed parameter to the upload action.
	 */
	private String ajax = "upload";

	/**
	 * The user session id. Example Values: 30d538e2-4794-4e7e-8a35-25a9e2fd5300
	 */
	private String sessionId;

	/**
	 * The project name to be uploaded.
	 */
	private String project;

	/**
	 * The project zip file. The type should be set as application/zip or
	 * application/x-zip-compressed.
	 */
	private File file;

	@SuppressWarnings("unchecked")
	public <T> T post(String url, Class<T> returnClazz) throws Exception{
		url = url + "/manager?ajax=upload";
		InputStream in = null;
		HttpClient httpclient = null;
		try {
		    httpclient = new DefaultHttpClient();
		    HttpPost httppost = new HttpPost(url);
			String name = file.getName();
			in = new FileInputStream(file);
			MultipartEntity reqEntity = new MultipartEntity();
			InputStreamBody inputStreamBody = new InputStreamBody(in,name);
			reqEntity.addPart("ajax", new StringBody(ajax));
			reqEntity.addPart("session.id", new StringBody(sessionId));
			reqEntity.addPart("project", new StringBody(project,  Charset.forName("utf8")));
			reqEntity.addPart("file", inputStreamBody);
			
			httppost.setEntity(reqEntity);
			HttpResponse rp = httpclient.execute(httppost);
			HttpEntity entity = rp.getEntity();
			BufferedReader br = new BufferedReader(new InputStreamReader(entity.getContent(), encode));
			StringBuffer last = new StringBuffer();
			String line = null;
			while ((line = br.readLine()) != null) {
				last.append(line);
			}
			
			int code = rp.getStatusLine().getStatusCode();

			if (HttpErrorCode.codes.contains(code)) {
				throw new BusinessException(last.toString());
			} else if (code == HttpStatus.SC_OK) {
				if (returnClazz == String.class) {
					return (T) last.toString();
				}
				ObjectMapper mapper = new ObjectMapper();
				mapper.configure(org.codehaus.jackson.map.DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
				return mapper.readValue(last.toString(), returnClazz);
			} else {
				throw new BusinessException("unknown exception. code: {0} {1}", String.valueOf(code), last.toString());
			}
		}catch(Exception e){
			throw new Exception("post failed !!!");
		}finally {
			FileUtil.close(in);
			try {
				if (null != httpclient)
				httpclient.getConnectionManager().shutdown();
			} catch (Exception ignore) {

			}
		}
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getProject() {
		return project;
	}

	public void setProject(String project) {
		this.project = project;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

}
