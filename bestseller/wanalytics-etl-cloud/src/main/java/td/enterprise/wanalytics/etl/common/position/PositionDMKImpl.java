package td.enterprise.wanalytics.etl.common.position;

import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.bean.*;
import td.enterprise.wanalytics.etl.common.Response;
import td.enterprise.wanalytics.etl.common.SyncFileExchangeInterface;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.GZipUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import java.io.*;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * 调动DMK 接口，地理位置接口文件，保持和FE返回格式一致
 * @author junmin.li
 *
 */
public class PositionDMKImpl implements SyncFileExchangeInterface {
	
	public static Logger logger = Logger.getLogger(PositionDMKImpl.class);
	
    private DmkInputTypeEnum inputType;

    public PositionDMKImpl(DmkInputTypeEnum inputType){
         this.inputType = inputType;
	}

	/**
	 * 文件是gzip文件，
	 */
	@Override
	public Response exchangeFile(File tdidFile,File outputFile,boolean isGzip,Map map)  {
		Response response = new Response();
		BufferedReader br = null;
		BufferedWriter bw = null;
		File tempFile =  null;
		InputStream inputStream = null;
		String month = (String)map.get("month");
		try {
			//生成唯一1
			String uuid = UUID.randomUUID().toString();
			inputStream = FileUtil.getBufferedStream(new FileInputStream(tdidFile));
			br = new BufferedReader(new InputStreamReader(inputStream));
			String line = null;
			if(!isGzip){
				bw = new BufferedWriter(new FileWriter(outputFile));
			}else{
				//gzip 临时文件
				tempFile = new File (outputFile + "_" + uuid); 
				bw = new BufferedWriter(new FileWriter(tempFile));
			}

			int pageSize = SysConfigUtil.getValue(WifipixTaskConstant.DMK_BATCH_PAGESIZE) == null ? 2000 : Integer.parseInt(SysConfigUtil.getValue(WifipixTaskConstant.DMK_BATCH_PAGESIZE));
			//读取文件
			List<List<String>> idList = FileUtil.readAsBatchList(br,pageSize);

			int nThread = Runtime.getRuntime().availableProcessors() * 2;

			//10个线程进行读取
			ExecutorService pool = Executors.newFixedThreadPool(nThread);

			// 创建多个有返回值的任务
			List<Future<List<DmkPosition>>> list = new ArrayList<Future<List<DmkPosition>>>();

			//id 为mac或者tdid
			for (List<String> tempList: idList ) {
				Callable c = new PositionCallable(tempList,month,inputType);
				// 执行任务并获取Future对象
				Future f = pool.submit(c);
				list.add(f);
			}

			// 关闭线程池
			pool.shutdown();
			int count = 0;

			boolean isMac = DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode());

			for(Future<List<DmkPosition>> future : list) {
				List<DmkPosition> positionList = future.get();
				if(null != positionList){
					for(DmkPosition position : positionList){
						String id = null;
						if(isMac){
							id = position.getMac();
						}else {
							id = position.getTdid();
						}
						bw.append(id).append(WifipixTaskConstant.TAB).append(position.getLatlngGps84()).append(WifipixTaskConstant.TAB).append(position.getTdid()).append("\n");
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
		} catch (Exception e) {
			response.setCode(Response.Status.ERROR);
			response.setMsg(e.getMessage());
			e.printStackTrace();
			logger.error("DMK IDMapping 失败", e);
		} finally {
			FileUtil.close(br, bw, inputStream);
		}
		
		if(null != tempFile){
			//删除临时文件
			boolean ok = tempFile.delete();
			logger.info("删除临时文件：" + ok);
		}
		return response;
	}


	public static void main(String [] args ){
		PositionDMKImpl t = new PositionDMKImpl(DmkInputTypeEnum.MAC);
		File tdidFile = new File("E:/product_mac/tdid100.gz");
		File resultFile = new File("E:/product_mac/tdid100_position_2.gz");
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
