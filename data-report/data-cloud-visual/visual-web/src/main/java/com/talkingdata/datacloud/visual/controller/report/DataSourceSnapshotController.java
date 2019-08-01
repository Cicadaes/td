package com.talkingdata.datacloud.visual.controller.report;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.DataSourceSnapshot;
import com.talkingdata.datacloud.visual.entity.report.DataSourceSnapshotKey;
import com.talkingdata.datacloud.visual.page.report.DataSourceSnapshotPage;
import com.talkingdata.datacloud.visual.service.report.DataSourceSnapshotService;

@Controller
@RequestMapping("/report")
public class DataSourceSnapshotController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(DataSourceSnapshotController.class);

    @Autowired
    private DataSourceSnapshotService dataSourceSnapshotService;

    @RequestMapping(value = "/dataSourceSnapshots", method = GET)
    @ResponseBody
    public List<DataSourceSnapshot> query(DataSourceSnapshotPage page) throws Exception {
        page.setOrderBy(DataSourceSnapshot.fieldToColumn(page.getOrderBy()));
        return dataSourceSnapshotService.queryByList(page);
    }

    @RequestMapping(value = "/dataSourceSnapshots/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(DataSourceSnapshotPage page) throws Exception {
        page.setOrderBy(DataSourceSnapshot.fieldToColumn(page.getOrderBy()));
        List<DataSourceSnapshot> rows = dataSourceSnapshotService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/dataSourceSnapshots", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public DataSourceSnapshot create(@RequestBody DataSourceSnapshot dataSourceSnapshot) throws Exception {
        dataSourceSnapshotService.insert(dataSourceSnapshot);
        return dataSourceSnapshot;
    }

    @RequestMapping(value = "/dataSourceSnapshots", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody DataSourceSnapshot dataSourceSnapshot) throws Exception {
        dataSourceSnapshotService.updateByPrimaryKeySelective(dataSourceSnapshot);
    }

    @RequestMapping(value = "/dataSourceSnapshots", method = DELETE)
    @ResponseBody
    public void delete(DataSourceSnapshotKey key) throws Exception {
        dataSourceSnapshotService.deleteByPrimaryKey(key);
        logger.info("delete from TD_DC_VISUAL_DATA_SOURCE_SNAPSHOT where key: {}", key);
    }

}
