package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.annotation.AuditLogSave;
import com.talkingdata.marketing.core.annotation.EnableAssignmentTime;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.campaign.SegmentCrowdRel;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.SegmentPage;
import com.talkingdata.marketing.core.service.campaign.AttachmentService;
import com.talkingdata.marketing.core.service.campaign.SegmentService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.vo.campaign.SegmentVO;
import com.talkingdata.marketing.core.vo.push.AbstractPushData;
import com.talkingdata.marketing.core.vo.push.EDMPushData;
import com.talkingdata.marketing.web.constraint.MktValidator;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class SegmentController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(SegmentController.class);

    @Autowired
    private SegmentService segmentService;
    @Autowired
    private MktValidator mktValidator;
    @Autowired
    private ExceptionBuilder exceptionBuilder;
    @Autowired
    private AttachmentService attachmentService;

    @RequestMapping(value = "/segments", method = GET)
    @ResponseBody
    public List<SegmentVO> query(SegmentPage page) throws Exception {
        return segmentService.getExtendPage(page);
    }

    @RequestMapping(value = "/segments/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(SegmentPage page) throws Exception {
        page.setOrderBy(Segment.fieldToColumn(page.getOrderBy()));
        page.setPageSize(Integer.MAX_VALUE);
        List<Segment> rows = segmentService.queryValidSegment(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/segments/{id}", method = GET)
    @ResponseBody
    public SegmentVO find(@PathVariable Integer id) throws Exception {
        return segmentService.getExtendPageBySegmentId(id);
    }

    @RequestMapping(value = "/segments", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @EnableAssignmentTime
    public Segment create(@RequestBody Segment segment) throws Exception {
        segmentService.insert(segment);
        return segment;
    }

    @RequestMapping(value = "/segments", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @AuditLogSave(opType = AuditLogSave.OpType.update,targetType = AuditLogSave.TargetType.segment,targetId = "#segment.id")
    public void update(@RequestBody AbstractPushData segment, HttpServletRequest request) throws Exception {
        logger.info("投放更新开始.segment={}",JsonUtil.toJson(segment));
        if(StringUtils.isBlank(segment.getId())){
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_ID_NOT_EXIST);
        }
        Segment seg = segmentService.buildSegment(segment);
        seg.setId(Integer.parseInt(segment.getId()));
        AssignmentUtil.setUpdateBasicInfo(seg, request);
        if (!mktValidator.validateUnique(seg)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_NAME_DUP);
        }
        segmentService.updateByPrimaryKeySelective(seg);
        segmentService.createCalcRecordIfNotExist(seg);
    }

    @RequestMapping(value = "/segments/{id}", method = DELETE)
    @ResponseBody
    @AuditLogSave(opType = AuditLogSave.OpType.delete,targetType = AuditLogSave.TargetType.segment,targetId = "#id")
    public void logicalDelete(@PathVariable Integer id) throws Exception {
        segmentService.logicalDelete(id);
        logger.info("delete from TD_MKT_SEGMENT where id = {}", id);
    }

    @RequestMapping(value = "/segments/ext", method = POST,consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @EnableAssignmentTime
    @AuditLogSave(opType = AuditLogSave.OpType.create,targetType = AuditLogSave.TargetType.segment)
    public ResponseEntity createSegmentExt(@RequestBody AbstractPushData segment, HttpServletRequest request) throws Exception {
        logger.info("创建投放开始.segment={}",JsonUtil.toJson(segment));
        Attachment attachment = null;
        if (StringUtils.isNotBlank(segment.getUploadUUID())) {
            attachment = attachmentService.selectByPrimaryKey(Integer.parseInt(segment.getUploadUUID()));
        }
        Segment seg = segmentService.buildSegment(segment);
        seg.setCreateTime(new Date());
        seg = AssignmentUtil.setInfo(seg, request);
        if (!mktValidator.validateUnique(seg)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_NAME_DUP);
        }

        SegmentCrowdRel rel = segmentService.buildSegmentCrowdRel(seg,request);
        segmentService.createExt(segment, seg, attachment,rel);
        logger.info("创建投放成功.segment={}",JsonUtil.toJson(seg));
        return new ResponseEntity(seg, HttpStatus.OK);
    }

    @RequestMapping(value = "/segments/list", method = GET)
    @ResponseBody
    public ResponseEntity findByIdList(@RequestParam List<Integer> ids) {
        if (ids == null || ids.size() <= 0) {
            return new ResponseEntity(new ArrayList(), HttpStatus.OK);
        }
        List<Segment> segmentList = segmentService.findByIdList(ids);
        return new ResponseEntity(segmentList, HttpStatus.OK);
    }

    @RequestMapping(value = "/segments/{id}/status/{status}", method = PUT)
    @ResponseBody
    public void setStatus(@PathVariable Integer id, @PathVariable Integer status) throws Exception {
        segmentService.setStatus(id, status);
    }


}
