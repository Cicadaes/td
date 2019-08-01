package td.enterprise.web.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.exception.BusinessException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Yan on 2017/3/29.
 */

@Controller
@RequestMapping("/api")
public class AttachmentController {


    @Value("${upload.path}")
    private String path;

    /**
     * 附件上传保存至文件系统
     *
     * @param file
     * @param type
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "附件上传保存至文件系统",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "附件上传保存至文件系统")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @PostMapping("/attachment")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam("type") String type) throws BusinessException {
        File prefixpPath = new File(path + File.separator + type);
        if (!prefixpPath.exists()) {
            prefixpPath.mkdirs();
        }
        Path rootLocation = Paths.get(path + File.separator + type);

        long timestamp = System.currentTimeMillis();
        try {
            if (file.isEmpty()) {
                throw new BusinessException("Failed to store empty file " + file.getOriginalFilename());
            }
            Files.copy(file.getInputStream(), rootLocation.resolve(timestamp + file.getOriginalFilename()));
        } catch (IOException e) {
            throw new BusinessException("Failed to store file " + file.getOriginalFilename(), e);
        } catch (BusinessException e) {
            e.printStackTrace();
        }

        String filePath = type + File.separator + timestamp + file.getOriginalFilename();

        Map<String, Object> appConfig = new HashMap<String, Object>();
        appConfig.put("filePath", filePath);
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonObject = "";
        try {
            jsonObject = objectMapper.writeValueAsString(appConfig);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(jsonObject, HttpStatus.OK);

    }

}
