package td.enterprise.wanalytics.etl.common.tdid;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.common.Response;
import td.enterprise.wanalytics.etl.common.SyncFileExchangeInterface;
import td.enterprise.wanalytics.etl.util.DMKUtils;
import td.enterprise.wanalytics.etl.bean.IDMapping;
import td.enterprise.wanalytics.etl.bean.IDMappingBean;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;

import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.GZipUtil;

import java.io.*;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * 调动DMK 接口，返回mac tdid文件
 * @author junmin.li
 *
 */
public class IDMappingDMKImpl implements SyncFileExchangeInterface {

	public static Logger logger = Logger.getLogger(IDMappingDMKImpl.class);


	@Override
	public Response exchangeFile(File macFile, File outputFile, boolean isGzip, Map map)  {
		Response response = new Response();
		BufferedReader br = null;
		BufferedWriter bw = null;
		File tempFile =  null;
		try {
			//生成唯一1
			String uuid = UUID.randomUUID().toString();

			InputStream inputStream = FileUtil.getBufferedStream(new FileInputStream(macFile));
			br = new BufferedReader(new InputStreamReader(inputStream));

			String line = null;
			if(!isGzip){
				bw = new BufferedWriter(new FileWriter(outputFile));
			}else{
				//gzip 临时文件
				tempFile = new File (outputFile + "_" + uuid);
				bw = new BufferedWriter(new FileWriter(tempFile));
			}
			int count = 0;

			//读取文件
			List<String> macList = FileUtil.readAsList(br);

			int nThread = Runtime.getRuntime().availableProcessors() * 2;

			//10个线程进行读取
			ExecutorService pool = Executors.newFixedThreadPool(nThread);

			// 创建多个有返回值的任务
			List<Future<IDMappingBean>> list = new ArrayList<Future<IDMappingBean>>();
			for (String mac : macList ) {
				Callable c = new TDIDCallable(mac);
				// 执行任务并获取Future对象
				Future f = pool.submit(c);
				list.add(f);
			}
			// 关闭线程池
			pool.shutdown();

			for(Future<IDMappingBean> future : list) {
				IDMappingBean bean = future.get();
				if(bean != null ){
					IDMapping data = bean.getData();
					if(StringUtils.isNotBlank(data.getTdid())){
						bw.append(data.getMac()).append(WifipixTaskConstant.TAB).append(data.getTdid()).append("\n");
					}
					if(count ++ % 1000 == 0){
						bw.flush();
					}
				}
			}
			bw.flush();
			if(isGzip){
				//gzip压缩
				GZipUtil.gzip(tempFile.getAbsolutePath(), outputFile.getParent(), outputFile.getName());
			}
			response.setCode(Response.Status.SUCCESS);
		} catch (Exception e) {
			response.setCode(Response.Status.ERROR);
			response.setMsg(e.getMessage());
			logger.error("DMK IDMapping 失败", e);
		} finally {
			FileUtil.close(br,bw);
		}

		if(null != tempFile){
			//删除临时文件
			boolean ok = tempFile.delete();
			logger.info("删除临时文件：" + ok);
		}
		return response;
	}

	public static void main(String [] args ){
		int nThread = Runtime.getRuntime().availableProcessors();
		System.out.println(nThread);
//		IDMappingDMKImpl t = new IDMappingDMKImpl();
//		File tdidFile = new File("E:/product_mac/mac82");
//		File resultFile = new File("E:/product_mac/mac82_tdid");
//		Response  response = t.exchangeFile(tdidFile, resultFile, true,new HashMap() );
//		if (response.getCode().getValue() == Response.Status.SUCCESS.getValue() ){
//			System.out.println("Success");
//		}else {
//			System.out.println("Failure");
//		}
	}

}
