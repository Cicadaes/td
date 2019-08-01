package td.enterprise.wanalytics.etl.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.tools.tar.TarEntry;
import org.apache.tools.tar.TarInputStream;
import td.enterprise.entity.DmkEntity;
import td.enterprise.service.DmkService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.UUID;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

/**
 * Created by Yan on 2017/4/13.
 */

@Slf4j
public class FileUtil {
    public static String getGenerateFilePath(String startDate, String endDate, String cstGroupID, String runDate, String type, String fileName) {
        return WifipixTaskConstant.CFG_DATA_FILE_PATH_ROOT + File.separator + runDate+ File.separator + type  + File.separator + startDate.replace("-", "") + "-" + endDate.replace("-", "") + File.separator + fileName;
    }
    public static String getGenerateFilePath(String tenantId, String projectId, String crowdId, String runDate, String cycle_statistics, String type, String fileName) {
        return mkdir(tenantId,projectId,crowdId, runDate, cycle_statistics, type) + fileName;
    }

    public static String getGenerateFilePath(String tenantId, String projectId, String runDate, String type, String fileName) {
        return mkdir(tenantId,projectId, runDate, type) + fileName;
    }
    public static String getGenerateFolderPath(String tenantId, String projectId, String crowdId, String runDate, String interval, String type) {
        return mkdir(tenantId,projectId,crowdId, runDate, interval, type) ;
    }

    public static String getGenerateFolderPath(String tenantId, String projectId, String runDate, String type) {
        return mkdir(tenantId,projectId, runDate, type) ;
    }

    public static String getGenerateLookalikePath(String tenantId, String projectId, String crowdId, String runDate,  String taskId ) {
        return mkdir(tenantId,projectId,crowdId, runDate, "lookalike",taskId) ;
    }

    public static String mkdir(String tenantId, String projectId,String crowdId, String runDate, String cycle_statistics, String type) {
        String path = WifipixTaskConstant.CFG_DATA_FILE_PATH_ROOT + tenantId+ File.separator + projectId + File.separator + runDate+ File.separator + cycle_statistics+ File.separator +  type  +  File.separator ;
        File fd = null;
        try {
            fd = new File(path);
            if (!fd.exists()) {
                fd.mkdirs();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return path;
    }

    public static String mkdir(String tenantId, String projectId,String crowdId, String runDate, String taskId) {
        String path = WifipixTaskConstant.CFG_DATA_FILE_PATH_ROOT + tenantId+ File.separator + projectId + File.separator + runDate+ File.separator + taskId  +  File.separator ;
        File fd = null;
        try {
            fd = new File(path);
            if (!fd.exists()) {
                fd.mkdirs();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return path;
    }

    public static String mkdir(String tenantId, String projectId,String runDate, String type) {
        String path = WifipixTaskConstant.CFG_DATA_FILE_PATH_ROOT + tenantId+ File.separator + projectId + File.separator + runDate+ File.separator + type+ File.separator ;
        File fd = null;
        try {
            fd = new File(path);
            if (!fd.exists()) {
                fd.mkdirs();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return path;
    }

    public static String getGenerateFolderPath(String folderName) {
        return mkdir(folderName) ;
    }

    public static String mkdir(String folderName) {
        String path = WifipixTaskConstant.CFG_DATA_FILE_PATH_ROOT + folderName+ File.separator ;
        File fd = null;
        try {
            fd = new File(path);
            if (!fd.exists()) {
                fd.mkdirs();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return path;
    }
    public static void unzipGz(File inputGzFile, File outputUnGzFile) throws IOException {
        unzipGz(inputGzFile, outputUnGzFile, Integer.MAX_VALUE);
    }

    public static void unzipGz(File inputGzFile, File outputUnGzFile, int sizeLimit) throws IOException {
        FileOutputStream fos = null;
        GZIPInputStream inStream = null;
        FileInputStream fileInputStream = null;
        BufferedInputStream bufferedInputStream = null;
        try{
            fos = new FileOutputStream(outputUnGzFile);
            fileInputStream = new FileInputStream(inputGzFile);
            bufferedInputStream =  new BufferedInputStream(fileInputStream);
            inStream = new GZIPInputStream(bufferedInputStream);
            byte[] buf = new byte[1024];
            int written = 0;
            while (true) {
                int size = inStream.read(buf);
                if (size <= 0) break;
                if ((written + size) > sizeLimit) {
                    fos.write(buf, 0, sizeLimit - written);
                    break;
                }
                fos.write(buf, 0, size);
                written += size;
            }
        } catch (IOException e) {
            throw new IOException("unzip failed!", e);
        } finally {
            FileUtil.close(fos,inStream,fileInputStream,bufferedInputStream);
        }
    }


    public static void unTarGz(File file, String outputDir) throws IOException {
        unTarGz(file,outputDir,null);
    }

    public static void unTarGz(File file, String outputDir, String crowdId) throws IOException {

        TarInputStream tarIn = null;

        try {

            tarIn = new TarInputStream(new GZIPInputStream(
                    new BufferedInputStream(new FileInputStream(file))),
                    1024 * 2);

            createDirectory(outputDir, null);//创建输出目录

            TarEntry entry = null;

            while ((entry = tarIn.getNextEntry()) != null) {

                if (entry.isDirectory()) {//是目录

                    createDirectory(outputDir, entry.getName());//创建空目录

                } else {//是文件

                    String tmpFileName = entry.getName();
                    if (StringUtils.isNotEmpty(crowdId)) tmpFileName = crowdId + "/" +entry.getName().substring(entry.getName().indexOf("/"));

                    File tmpFile = new File(outputDir + "/" + tmpFileName);

                    createDirectory(tmpFile.getParent() + "/", null);//创建输出目录

                    OutputStream out = null;

                    try {

                        out = new FileOutputStream(tmpFile);

                        int length = 0;

                        byte[] b = new byte[2048];

                        while ((length = tarIn.read(b)) != -1) {
                            out.write(b, 0, length);
                        }

                    } catch (IOException e) {
                        throw new IOException("unTar.gz failed!", e);
                    } finally {

                        if (out != null)
                            out.close();
                    }

                }
            }

        } catch (IOException ex) {
            throw new IOException("解压归档文件出现异常", ex);
        } finally {
            try {
                if (tarIn != null) {
                    tarIn.close();
                }
            } catch (IOException ex) {
                throw new IOException("关闭tarFile出现异常", ex);
            }
        }


    }

    public static void createDirectory(String outputDir, String subDir) {

        File file = new File(outputDir);

        if (!(subDir == null || subDir.trim().equals(""))) {//子目录不为空

            file = new File(outputDir + File.separator + subDir);
        }

        if (!file.exists()) {

            file.mkdirs();
        }

    }

    public static String unZipGzFilePath(String gzFilePath) {
        if (null != gzFilePath) {
            return gzFilePath.substring(0, gzFilePath.length() - 3);
        } else {
            return "";
        }
    }

    public static String zipGzFilePath(String filePath) {
        if (null != filePath) {
            return filePath + ".gz";
        } else {
            return "";
        }

    }

    /**
     * 兼容gzip 和 文本文件
     * @param input
     * @return
     */
    public static BufferedInputStream getBufferedStream(InputStream input) {
        byte[] header = new byte[2];
        BufferedInputStream ips = null;
        try {
            BufferedInputStream bufferedInputStream = new BufferedInputStream(input);
            bufferedInputStream.mark(2);
            int read = bufferedInputStream.read(header);
            bufferedInputStream.reset();
            int ss = (header[0] & 0xff) | ((header[1] & 0xff) << 8);
            if(read!=-1 && ss == GZIPInputStream.GZIP_MAGIC) {
                BufferedInputStream gzipInputStream = new BufferedInputStream(new GZIPInputStream(bufferedInputStream));
                return gzipInputStream;
            }else{
                ips= bufferedInputStream;
            }
            return ips;

        } catch (IOException e) {
            e.printStackTrace();
        }
        return ips;
    }

    /**
     * 判断文件是否是gzip 文件
     * @param file
     * @return
     */
    public  static boolean isGzip(File file){
        boolean result = false;
        byte[] header = new byte[2];
        BufferedInputStream bufferedInputStream = null;
        FileInputStream fileInputStream = null;
        try {
            fileInputStream = new FileInputStream(file);
            bufferedInputStream = new BufferedInputStream(fileInputStream);
            bufferedInputStream.mark(2);
            int read = bufferedInputStream.read(header);
            bufferedInputStream.reset();
            int ss = (header[0] & 0xff) | ((header[1] & 0xff) << 8);
            if(read!=-1 && ss == GZIPInputStream.GZIP_MAGIC) {
                result  = true;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            close(fileInputStream,bufferedInputStream);
        }

        return result;
    }




    public static String zipFile2Gz(String  inputFilePath) throws IOException {
        File file = new File(inputFilePath);
        String outputGzFilePath = zipGzFilePath(inputFilePath);
        File outGzfile = new File(outputGzFilePath);
        zipFile2Gz(file, outGzfile, Integer.MAX_VALUE);
        return outputGzFilePath;
    }

    public static void zipFile2Gz(File file, File outputGzFile, int sizeLimit) throws IOException {
        GZIPOutputStream fos = null;
        FileInputStream inStream = null;
        FileOutputStream  fileOutputStream = null;
        try {
            fileOutputStream = new FileOutputStream(outputGzFile);
            fos = new GZIPOutputStream(fileOutputStream);
            inStream = new FileInputStream(file);
            byte[] buf = new byte[1024];
            int written = 0;
            while (true) {
                int size = inStream.read(buf);
                if (size <= 0) break;
                if ((written + size) > sizeLimit) {
                    fos.write(buf, 0, sizeLimit - written);
                    break;
                }
                fos.write(buf, 0, size);
                written += size;
            }
        } catch (IOException e) {
            throw new IOException("zip file failed!", e);
        } finally {
           FileUtil.close(fileOutputStream,fos,inStream);
        }
    }

    public static void renameFolder(String oldFolderName,String newFolderName) {
        File dir = new File(oldFolderName);
        File newName = new File(newFolderName);
        if ( dir.isDirectory() ) {
            dir.renameTo(newName);
        } else {
            dir.mkdir();
            dir.renameTo(newName);
        }
    }

    public static String readFileAsString (String fileName) throws IOException{
        StringBuffer result = new StringBuffer();
        InputStream inputStream = null;
        InputStreamReader inputStreamReader  = null;
        try{
            inputStream = new FileInputStream(fileName);
            inputStreamReader = new InputStreamReader(inputStream);
            char buffer [] = new char [ 1000];
            int t = 0;
            while(( t= inputStreamReader.read(buffer, 0, 1000))  > 0){
                result.append(buffer, 0, t);
            }
        }catch(Exception e){
            throw e;
        }finally{
            try{
                if(null != inputStream){
                    inputStream.close();
                }
            }catch(Exception e){}

            try{
                if(null != inputStreamReader){
                    inputStreamReader.close();
                }
            }catch(Exception e){}
        }

        return result.toString();
    }
    public static void combineFiles(List<File> files, String saveFileName) throws IOException{
        File mFile=new File(saveFileName);

        if(!mFile.exists()){
            mFile.createNewFile();
        }
        FileChannel mFileChannel = null;
        FileOutputStream outputStream = null;
        try{
            outputStream = new FileOutputStream(mFile);
            mFileChannel = outputStream.getChannel();
            FileChannel inFileChannel = null;
            for(File file:files){
                FileInputStream inputStream = new FileInputStream(file);
                try{
                    inFileChannel= inputStream.getChannel();
                    inFileChannel.transferTo(0, inFileChannel.size(), mFileChannel);
                }finally {
                    FileUtil.close(inFileChannel,inputStream);
                }
            }
        }finally {
            FileUtil.close(mFileChannel,outputStream);
        }


    }
    /**
     * 删除文件，可以是单个文件或文件夹   
     * @param   fileName    待删除的文件名   
     * @return 文件删除成功返回true,否则返回false
     */
    public static boolean delete(String fileName){
        File file = new File(fileName);
        if(!file.exists()){
            log.info("删除文件失败："+fileName+"文件不存在");
            return false;
        }else{
            if(file.isFile()){

                return deleteFile(fileName);
            }else{
                return deleteDirectory(fileName);
            }
        }
    }

    /**
     * 删除单个文件   
     * @param   fileName    被删除文件的文件名   
     * @return 单个文件删除成功返回true,否则返回false
     */
    public static boolean deleteFile(String fileName){
        File file = new File(fileName);
        if(file.isFile() && file.exists()){
            file.delete();
            log.info("删除单个文件"+fileName+"成功！");
            return true;
        }else{
            log.info("删除单个文件"+fileName+"失败！");
            return false;
        }
    }

    /**
     * 删除目录（文件夹）以及目录下的文件   
     * @param   dir 被删除目录的文件路径   
     * @return  目录删除成功返回true,否则返回false
     */
    public static boolean deleteDirectory(String dir){
        //如果dir不以文件分隔符结尾，自动添加文件分隔符     
        if(!dir.endsWith(File.separator)){
            dir = dir+File.separator;
        }
        File dirFile = new File(dir);
        //如果dir对应的文件不存在，或者不是一个目录，则退出     
        if(!dirFile.exists() || !dirFile.isDirectory()){
            log.info("删除目录失败"+dir+"目录不存在！");
            return false;
        }
        boolean flag = true;
        //删除文件夹下的所有文件(包括子目录)     
        File[] files = dirFile.listFiles();
        for(int i=0;i<files.length;i++){
            //删除子文件     
            if(files[i].isFile()){
                flag = deleteFile(files[i].getAbsolutePath());
                if(!flag){
                    break;
                }
            }
            //删除子目录     
            else{
                flag = deleteDirectory(files[i].getAbsolutePath());
                if(!flag){
                    break;
                }
            }
        }

        if(!flag){
            log.info("删除目录失败");
            return false;
        }

        //删除当前目录     
        if(dirFile.delete()){
            log.info("删除目录"+dir+"成功！");
            return true;
        }else{
            log.info("删除目录"+dir+"失败！");
            return false;
        }
    }

    /**
     * 适合读取小文件
     * @param file
     * @return
     */
    public static String readFileAsString(File file) {

        String str = "";
        FileInputStream in = null;

        try {

            in = new FileInputStream(file);

            // size 为字串的长度 ，这里一次性读完,一次读完不安全改造成连续读取

            int size = in.available();
            StringBuffer strbuffer = new StringBuffer();
            byte[] buffer = new byte[1024];
            int tmpSize = 0;
            while ( (tmpSize=in.read(buffer)) > 0){
                strbuffer.append(new String(buffer,0,tmpSize));
            }

            str = new String(strbuffer);

        } catch (IOException e) {

            e.printStackTrace();

            return null;

        }finally {
            close(in);
        }

        return str;
    }

    public static String getFileNameNoEx(String filename) {
        if ((filename != null) && (filename.length() > 0)) {
            int dot = filename.lastIndexOf('.');
            if ((dot >-1) && (dot < (filename.length()))) {
                return filename.substring(0, dot);
            }
        }
        return filename;
    }

    public static int getFileRowCount(String file){
        int count  = 0 ;
        BufferedReader br = null;
        FileReader reader = null;
        try {
            String line = null;
            reader = new FileReader(file);
            br = new BufferedReader(reader);
            while ( ( line = br.readLine() ) != null) {
                count ++;
            }
        } catch (Exception e) {
            log.info("readFile failed!",e);
        } finally {
           close(br,reader);
        }
        return count;
    }

    /**
     * 文件内容每行进行替换
     */
    public static void replaceFileContent(File file ,String replaceMent,String source){
        BufferedReader br = null;
        BufferedWriter bw = null;
        FileReader reader = null;
        FileWriter writer = null;
        String tempFile = null;
        try {
            tempFile = file.getAbsolutePath()+ UUID.randomUUID().toString().replaceAll("-","");
            reader = new FileReader(file);
            br = new BufferedReader(reader);
            writer = new FileWriter(tempFile);
            bw = new BufferedWriter(writer);
            String line = br.readLine();
            while (null != line) {
                line = line.replaceAll(replaceMent,source);
                bw.append(line).append("\n");
                line = br.readLine();
            }
            bw.flush();
        } catch (Exception e) {
            log.error("文件替换失败!",e);
        } finally {
            close(br,bw,reader,writer);
        }

        //文件删除和重命名
        file.renameTo(new File(file.getAbsolutePath() + "_bak"));
        File filterFile = new File(tempFile);
        boolean b = filterFile.renameTo(file);
        if (b ){
            boolean r =  new File(file.getAbsolutePath() + "_bak").delete();
            log.info("文件替换成功,删除临时文件：" + (r ? "成功" :"失败" ));
        }else{
            log.error("文件替换失败，");
        }
    }

    public static List<String> readFileAsList(String file){
        BufferedReader br = null;
        List<String> list = new ArrayList<String>();
        FileReader fr = null;
        try {
            String line = null;
            fr = new FileReader(file);
            br = new BufferedReader(fr);
            while ((line = br.readLine()) != null) {
                list.add(line);
            }
        } catch (Exception e) {
            log.info("readFile failed!",e);
        } finally {
            close(fr,br);
        }
        return list;
    }

    public static List<String> readAsList(BufferedReader br){
        List<String> list = new ArrayList<String>();
        try {
            String line = null;
            while ( StringUtils.isNotBlank( line = br.readLine() ) ) {
                list.add(line);
            }
        } catch (Exception e) {
            log.info("readFile failed!",e);
        } finally {
            close(br);
        }
        return list;
    }

    public static List<List<String>> readAsBatchList(BufferedReader br, int pageSize){
        List<String> list = new ArrayList<String>();
        try {
            String line = null;
            while ( StringUtils.isNotBlank( line = br.readLine() ) ) {
                list.add(line);
            }
            return ListUtils.splitList(list,pageSize);
        } catch (Exception e) {
            log.info("readFile failed!",e);
        } finally {
            close(br);
        }
        return null;
    }

    public static void writeToFile(String outputFile,String content) throws Exception{
        BufferedWriter bw = null;
        FileWriter writer = null;
        try {
            writer = new FileWriter(outputFile);
            bw = new BufferedWriter(writer);
            bw.append(content);
            bw.flush();
        } catch (Exception e) {
            throw e;
        } finally {
            FileUtil.close(writer,bw);
        }
    }
    public static void close(Closeable c){
        if(c != null){
            try{
                c.close();
            }catch(Exception e){}
        }
    }

    public static void close(Closeable ... list){
        for(Closeable c : list){
            if(c != null){
                try{
                    c.close();
                }catch(Exception e){}
            }
        }
    }

    public static String getFileName(String filePath){
        File file = new File(filePath);
        return file.getName();
    }

    /**
     *获取文件夹下的所有日志文件名(包括子文件夹)
     * @param filePath
     * @return
     */
    public static List<String> getFileLog(String filePath,List<String> list){
        File file = new File(filePath);
        if (!file.exists()){
            return null;
        }
        File[] f = file.listFiles();
        for (File file1: f) {
            if (file1.isFile()&&file1.getName().contains("data.log.")){
                list.add(file1.getPath());
            } else if(file1.isDirectory()){
                getFileLog(file1.getPath(),list);
            }
        }
        return list;
    }

    /**
     * 解压zip 文件
     * @param zipFilePath
     * @param saveFileDir
     */
    public static void unzip(String zipFilePath, String saveFileDir) {
        if(!saveFileDir.endsWith("\\") && !saveFileDir.endsWith("/") ){
            saveFileDir += File.separator;
        }
        File dir = new File(saveFileDir);
        if(!dir.exists()){
            dir.mkdirs();
        }
        File file = new File(zipFilePath);
        if (file.exists()) {
            InputStream is = null;
            ZipArchiveInputStream zais = null;
            try {
                is = new FileInputStream(file);
                zais = new ZipArchiveInputStream(is);
                ArchiveEntry archiveEntry = null;
                while ((archiveEntry = zais.getNextEntry()) != null) {
                    // 获取文件名
                    String entryFileName = archiveEntry.getName();
                    // 构造解压出来的文件存放路径
                    String entryFilePath = saveFileDir + entryFileName;
                    OutputStream os = null;
                    FileOutputStream  fos = null;
                    try {
                        // 把解压出来的文件写到指定路径
                        File entryFile = new File(entryFilePath);
                        if(entryFileName.endsWith("/")){
                            entryFile.mkdirs();
                        }else{
                            entryFile.getParentFile().mkdirs();
                            fos = new FileOutputStream(entryFile);
                            os  = new BufferedOutputStream(fos);
                            byte[] buffer = new byte[1024 ];
                            int len = -1;
                            while((len = zais.read(buffer)) != -1) {
                                os.write(buffer, 0, len);
                            }
                            os.flush();
                        }
                    } catch (Exception e) {
                        throw new Exception(e);
                    } finally {
                       close(fos,os);
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            } finally {
                close(zais,is);
            }
        }
    }

    /**
     * 删除文件夹
     */
    public static void deleteFolder(String folder){
        File folderFile = new File(folder);
        // 如果dir对应的文件不存在，或者不是一个目录，则退出
        if ((!folderFile.exists()) || (!folderFile.isDirectory())) {
           return;
        }
        // 删除文件夹中的所有文件包括子目录
        File[] files = folderFile.listFiles();
        for (int i = 0; i < files.length; i++) {
            // 删除子文件
            if (files[i].isFile()) {
                 new File(files[i].getAbsolutePath()).delete();
            } // 删除子目录
            else if (files[i].isDirectory()) {
              deleteFolder(files[i].getAbsolutePath());
            }
        }
        folderFile.delete();
    }

    public static List<String> getFileList(String folder){
        File [] files = new File(folder).listFiles();
        List<String> fileList= new ArrayList<String>();
        for(File file : files){
            if(file.isFile()){
                fileList.add(file.getAbsolutePath());
            }else if(file.isDirectory()){
                fileList.addAll(getFileList(file.getAbsolutePath()));
            }
        }
        return fileList;
    }

    public static void main(String[] args) throws  Exception{
        long start = System.currentTimeMillis();
        String file = "C:\\Users\\Administrator\\Desktop\\jingpin.zip";
        FileType fileType = FileTypeJudge.getType(file);
        String saveFileDir = "C:\\Users\\Administrator\\Desktop\\test";
        FileUtil.unzip(file,saveFileDir);
        log.info("==================fileType=" + fileType);
        long end = System.currentTimeMillis();
        log.info("===========成功结束,用时：" + (end - start)/1000 + "秒");
    }

    private static boolean  stringIsMac(String val) {
        String trueMacAddress = "([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}";
        // 这是真正的MAV地址；正则表达式；
        return val.matches(trueMacAddress);
    }

    /**
     * 读取网址的内容
     * @param url
     * @return
     */
    public static List<String> getFileByUrl(String url) {
        List<String> list = new ArrayList<String>();
        InputStream in = null;
        InputStreamReader isr =null;
        BufferedReader br = null;
        try {
            URL url1 = new URL(url);
            String line = "";
            in = url1.openStream();
            isr = new InputStreamReader(in);
            br = new BufferedReader(isr);

            while((line = br.readLine()) != null) {
                //读取文本，并输出
                list.add(line);
            }
        }catch (Exception e){
            log.error(""+e);
        }finally {

            close(in,isr,br);
        }
        return  list;
    }
}
