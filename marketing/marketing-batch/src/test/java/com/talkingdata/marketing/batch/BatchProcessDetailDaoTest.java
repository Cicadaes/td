package com.talkingdata.marketing.batch;

import com.talkingdata.marketing.batch.bean.BatchProcessDetail;
import com.talkingdata.marketing.batch.dao.BatchProcessDetailDao;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;

/**
 * @author  Created by tend on 2017/11/9.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:config/marketing-batch-spring-config.xml"})
public class BatchProcessDetailDaoTest {

    @Autowired
    private BatchProcessDetailDao batchProcessDetailDao;

    @Test
    public void recentlyBatchProcessTest() {
        BatchProcessDetail batchProcessDetail = batchProcessDetailDao.recentlyBatchProcess();
        System.out.println(batchProcessDetail.toString());
    }

    @Test
    public void saveBatchProcessTest() {
        BatchProcessDetail batchProcessDetail = new BatchProcessDetail();
        batchProcessDetail.setStatus(1);
        batchProcessDetail.setStartTime(new Date(1000L));
        batchProcessDetail.setEndTime(new Date(2000L));
        batchProcessDetail.setErrorFilePath("");
        batchProcessDetailDao.saveBatchProcess(batchProcessDetail);
    }

    @Test
    public void updateBeforeStatusByIdTest() {
        batchProcessDetailDao.updateBeforeStatusById(3L);
    }

}
