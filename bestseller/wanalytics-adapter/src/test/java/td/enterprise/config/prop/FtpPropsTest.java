package td.enterprise.config.prop;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import td.enterprise.Application;
import td.enterprise.common.ftp.FtpUtil;
import td.enterprise.common.util.FileUtils;
import td.enterprise.constants.DateConstants;
import td.enterprise.entity.FTPLine;
import td.enterprise.service.DataService;

/**
 * 测试ftp properties
 * @description 
 * @author sxk
 * @date 2017年10月12日
 */
//@RunWith(SpringRunner.class)
//@SpringBootTest(classes = Application.class)
public class FtpPropsTest {

    @Autowired
    private FtpProps       ftpProps;

    @Autowired
    private FtpUtil        ftpUtil;

    @Autowired
    private DataService<?> dataService;

    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }

    //@Test
    public void test() throws Exception {
        System.out.println(ftpProps.toString());

        long startTime = System.currentTimeMillis();
        LocalDateTime now = LocalDateTime.of(2017, 10, 13, 11, 0);
        String fileDirectory = now.format(DateConstants.FTP_PATTERN) + "/" + now.format(DateConstants.FTP_PATTERN_HOUR) + "/";
        System.out.println(fileDirectory);
        List<File> files = ftpUtil.downloads("/attachment/bestseller/" + fileDirectory, "/bestseller/" + fileDirectory, 100);
        for (File file : files) {
            if (file != null) {
                List<FTPLine> ftpLineList = FileUtils.readZipFile(file);
                dataService.processData(ftpLineList,file.getName());
            }
        }
        System.out.println(System.currentTimeMillis() - startTime);

    }

}
