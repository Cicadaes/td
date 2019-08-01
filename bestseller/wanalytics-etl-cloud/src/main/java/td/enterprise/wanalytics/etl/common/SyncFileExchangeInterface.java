package td.enterprise.wanalytics.etl.common;

import java.io.File;
import java.util.Map;

/**
 * MAC TDID接口
 * @author junmin
 *
 */
public interface SyncFileExchangeInterface {
	/**
	 * 输入文件，只有一列mac地址文件，全部小写，带有分号
	 * 返回结果
	 * mac 和 tdid 对应关系文件，mac tab tdid
	 * 
	 * 输入文件和输出文件是正常文件，没有压缩
	 * 
	 * @param macFile
	 * @return
	 * @throws Exception
	 * 
	 * custom 用户自定义对象
	 */
    Response  exchangeFile(File macFile, File outputFile, boolean isGzip, Map map);
	
}
