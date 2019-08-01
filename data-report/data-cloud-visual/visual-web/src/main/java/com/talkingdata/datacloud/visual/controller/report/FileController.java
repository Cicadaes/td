package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.visual.util.Msg;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.Map;

/**
 * Created by yangruobin on 2017/4/17.
 */
@Controller
@RequestMapping("/report")
public class FileController {
    private static final Logger logger = LoggerFactory.getLogger(FileController.class);
    @Value("${img_file_path}")
    public String path;

    @RequestMapping(value = "images11",method = RequestMethod.POST)
    public Map<String, Object> upload(String id, @RequestParam("file") MultipartFile file) throws IOException {
        try {
            String imgPath=path+id+".jpg";
            File imageFile=new File(imgPath);
            logger.info(imageFile.getAbsolutePath());
            imageFile.createNewFile();
            OutputStream out = new FileOutputStream(imgPath);
            InputStream in = file.getInputStream();
            byte[] bytes = new byte[1024];
            int len = -1;
            while ((len = in.read(bytes)) != -1) {
                out.write(bytes, 0, len);
            }
            in.close();
            out.close();
            return Msg.getSuccessData("上传数据成功");
        } catch (Exception e) {
            logger.error("上传图片失败", e);
            return Msg.getFailureMessage("上传图片失败");
        }
//    }
//    @RequestMapping(value = "images",method = RequestMethod.POST)
//    public Map<String, Object> upload(String id, @RequestParam("file") MultipartFile file) throws IOException {
//        try {
//            String imgPath=path+id+".img";
//            File imageFile=new File(imgPath);
//            logger.info(imageFile.getAbsolutePath());
//            imageFile.createNewFile();
//            OutputStream out = new FileOutputStream(imgPath);
//            InputStream in = file.getInputStream();
//            byte[] bytes = new byte[1024];
//            int len = -1;
//            while ((len = in.read(bytes)) != -1) {
//                out.write(bytes, 0, len);
//            }
//            in.close();
//            out.close();
//            return Msg.getSuccessData("上传数据成功");
//        } catch (Exception e) {
//            logger.error("上传图片失败", e);
//            return Msg.getFailureMessage("上传图片失败");
//        }
    }
}
