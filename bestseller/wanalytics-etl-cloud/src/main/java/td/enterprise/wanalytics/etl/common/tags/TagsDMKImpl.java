package td.enterprise.wanalytics.etl.common.tags;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.zip.GZIPInputStream;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.bean.*;
import td.enterprise.wanalytics.etl.common.Response;
import td.enterprise.wanalytics.etl.common.SyncFileExchangeInterface;
import td.enterprise.wanalytics.etl.common.tdid.TDIDCallable;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;

import td.enterprise.wanalytics.etl.util.DMKUtils;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.GZipUtil;

/**
 * 调动DMK 接口，返回mac tdid文件
 * @author junmin.li
 *
 */
public class TagsDMKImpl implements SyncFileExchangeInterface {

	public static Logger logger = Logger.getLogger(TagsDMKImpl.class);

	/**
	 * 输入参数类型
	 */
	private DmkInputTypeEnum inputType ;

	public TagsDMKImpl (DmkInputTypeEnum inputType){
        this.inputType = inputType;
	}

	/**
	 * 文件是gzip文件，
	 */
	@Override
	public Response exchangeFile(File macFile, File outputFile, boolean isGzip, Map map)  {
		Response response = new Response();
		BufferedReader br = null;
		BufferedWriter bw = null;
		File tempFile =  null;
		InputStream inputStream = null;
		try {
			//生成唯一1
			String uuid = UUID.randomUUID().toString();
			inputStream = FileUtil.getBufferedStream(new FileInputStream(macFile));
			br = new BufferedReader(new InputStreamReader(inputStream));
			if(!isGzip){
				bw = new BufferedWriter(new FileWriter(outputFile));
			}else{
				//gzip 临时文件
				tempFile = new File (outputFile + "_" + uuid);
				bw = new BufferedWriter(new FileWriter(tempFile));
			}

			//读取文件
			List<String> macList = FileUtil.readAsList(br);
			logger.info("TagsDMKImpl input mac size:" + macList.size());

			int nThread = Runtime.getRuntime().availableProcessors() * 2;

			//10个线程进行读取
			ExecutorService pool = Executors.newFixedThreadPool(nThread);

			// 创建多个有返回值的任务
			List<Future<List>> list = new ArrayList<Future<List>>();

			for (String id : macList ) {
				Callable c = new TagsCallable(id,inputType);
				// 执行任务并获取Future对象
				Future f = pool.submit(c);
				list.add(f);
			}
			// 关闭线程池
			pool.shutdown();
			int count = 0;
			boolean isMac = DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode());

			for(Future<List> future : list) {
				List tempList = null;
				try {
					tempList = future.get();
				}
				catch (Exception e) {
					logger.error("TagsCallable call with exception: " + e.getMessage());
					e.printStackTrace();
					continue;
				}
				if(null != tempList){
					String id = null;
					List<DmkTag> tagList = (List<DmkTag>) tempList.get(0);
					for(DmkTag tag : tagList){
						if(isMac){
							id = tag.getMac();
						}else {
							id = tag.getTdid();
						}
						bw.append(id).append(WifipixTaskConstant.TAB).append(tag.getLabel()).append(WifipixTaskConstant.TAB).append(tag.getName()).append("\n");
					}
					List<DmkDevice> deviceList = (List<DmkDevice>) tempList.get(1);
					for(DmkDevice device : deviceList){
						if(isMac){
							id = device.getMac();
						}else {
							id = device.getTdid();
						}
						bw.append(id).append(WifipixTaskConstant.TAB).append(WifipixTaskConstant.PRICE).append(WifipixTaskConstant.TAB).append(device.getPrice()).append("\n");
						bw.append(id).append(WifipixTaskConstant.TAB).append(WifipixTaskConstant.STANDARDBRAND).append(WifipixTaskConstant.TAB).append(device.getStandardBrand()).append("\n");
					}
				}
				if(count ++ % 1000 == 0){
					bw.flush();
				}
			}
			bw.flush();
			if(isGzip){
				//gzip压缩
				GZipUtil.gzip(tempFile.getAbsolutePath(), outputFile.getParent(), outputFile.getName());
			}
			response.setCode(Response.Status.SUCCESS);
			logger.info("TagsDMKImpl output mac size:" + count);
            logger.info("TagsDMKImpl mac matching ratio:" + macList.size()*1.0 / count *1.0);

        } catch (Exception e) {
			response.setCode(Response.Status.ERROR);
			response.setMsg(e.getMessage());
			logger.error("DMK IDMapping 失败", e);
		} finally {
			FileUtil.close(br,bw,inputStream);
		}

		if(null != tempFile){
			//删除临时文件
			boolean ok = tempFile.delete();
			logger.info("删除临时文件：" + ok);
		}
		return response;
	}


	public static void main(String [] args ){
		TagsDMKImpl t = new TagsDMKImpl(DmkInputTypeEnum.MAC);
		File tdidFile = new File("E:/product_mac/tdid100.gz");
		File resultFile = new File("E:/product_mac/tdid100_tags.gz");
		Map map  = new HashMap();
		map.put("month", "201701");
		Response  response = t.exchangeFile(tdidFile, resultFile, true,map );
		if (response.getCode().getValue() == Response.Status.SUCCESS.getValue() ){
			System.out.println("Success");
		}else {
			System.out.println("Failure");
		}
	}
}
