package td.enterprise.wanalytics.etl.common.tags;

import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;

import java.io.*;

/**
 * 对于标准返回的标签进行转化，供计算人群画像使用
 */
public class TagsFtpConvert {

    public static Logger logger = Logger.getLogger(TagsFtpConvert.class);

    /**
     * tdid tag_key tag_value
     * 1：人口属性标签label 截取前4位，标签名称用6位
     * 2：兴趣偏好，label 用6位，标签名称用原来名称
     * 3：设备属性用price,standardBrand 两个标签
     * @param inputFile
     * @param outputFile
     * @return
     * @throws Exception
     */
    public static boolean convertTags(String inputFile,String outputFile) throws  Exception{
        boolean r = true;
        BufferedReader br = null;
        BufferedWriter bw = null;
        FileReader fileReader = null;
        FileWriter fileWriter  = null;
        try {
            fileReader = new FileReader(inputFile) ;
            fileWriter = new FileWriter(outputFile);
            br = new BufferedReader(fileReader);
            bw = new BufferedWriter(fileWriter);
            String line = null;
            while ((line = br.readLine()) != null) {
                String [] values = line.split(WifipixTaskConstant.TAB);
                if(3 == values.length){
                    String tdid = values[0];
                    String tagLabel= values[1];
                    String tagName = values[2];
                    if(tagLabel.equals("label") || tagLabel.equals("price") || tagLabel.equals("standardBrand")) {
                        //人口属性
                        if((tagName.startsWith("03") && tagName.length() == 6) || (tagName.startsWith("08") && tagName.length() == 6)){
                            bw.append(tdid).append(WifipixTaskConstant.TAB).append(tagName.substring(0,4)).append(WifipixTaskConstant.TAB).append(tagName).append(WifipixTaskConstant.LINE);
                        }else if(tagName.startsWith("02")){
                            String tempLabel = tagName;
                            if(tempLabel.length() == 8){
                                tempLabel = tempLabel.substring(0,6);
                            }
                            bw.append(tdid).append(WifipixTaskConstant.TAB).append(tempLabel).append(WifipixTaskConstant.TAB).append(tagName).append(WifipixTaskConstant.LINE);
                        }else if(tagLabel.equals("price") || tagLabel.equals("standardBrand")){
                            bw.append(line).append(WifipixTaskConstant.LINE);
                        }else {
                            //其它的进行忽略写到结果文件中
                        }
                    }
                }
            }
            bw.flush();
        } catch (Exception e) {
            logger.info("TagsFtpConvert failed!",e);
            throw e;
        } finally {
            FileUtil.close(fileReader,fileWriter,br,bw);
        }
        return r;
    }

    public  static void main(String [] args ) throws  Exception {
        long start = System.currentTimeMillis();
        String inputFile = "C:\\Users\\Administrator\\Desktop\\tags";
        String outputFile = inputFile + ".result";
        convertTags(inputFile,outputFile);
        long end = System.currentTimeMillis();
        System.out.println("=================over in the main Used Time =" + (end - start));
    }
}
