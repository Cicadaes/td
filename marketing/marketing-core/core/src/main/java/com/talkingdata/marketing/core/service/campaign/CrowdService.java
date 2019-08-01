package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.annotation.AuditLogSave;
import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.constant.CrowdConstants;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdStatus;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType;
import com.talkingdata.marketing.core.constant.DataDownloadConstants;
import com.talkingdata.marketing.core.constant.IdTypeConstants;
import com.talkingdata.marketing.core.constant.ParamConstants;
import com.talkingdata.marketing.core.dao.campaign.AttachmentDao;
import com.talkingdata.marketing.core.dao.campaign.CrowdDao;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.CrowdTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.campaign.DataDownload;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.campaign.SegmentCrowdRel;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdResp;
import com.talkingdata.marketing.core.enums.PushMetric;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import com.talkingdata.marketing.core.middleware.CrowdApi;
import com.talkingdata.marketing.core.page.campaign.CrowdPage;
import com.talkingdata.marketing.core.page.dto.CsvPreviewDto;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.FileUtil;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CROWD CrowdService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("crowdService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CrowdService extends BaseService<Crowd, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(CrowdService.class);
    private final String[] dvTps =
        new String[] {IdTypeConstants.ANDROIDID, IdTypeConstants.IDFA, IdTypeConstants.IMEI, IdTypeConstants.MAC, IdTypeConstants.MOBILEID,
            IdTypeConstants.TDID, IdTypeConstants.EMAIL_ID};
    @Autowired
    private CrowdDao dao;

    @Autowired
    private CrowdApi crowdApi;

    @Autowired
    private AttachmentDao attachmentDao;
    @Autowired
    private DataDownloadService dataDownloadService;
    @Autowired
    private CrowdTaskCalcObjectRecordService crowdTaskCalcObjectRecordService;
    @Autowired
    private ExceptionBuilder exceptionBuilder;
    @Autowired
    private ConfigApi configApi;
    @Autowired
    private SegmentCrowdRelService segmentCrowdRelService;

    @Override
    public CrowdDao getDao() {
        return dao;
    }

    @Override
    @AuditLogSave(opType = AuditLogSave.OpType.create, targetType = AuditLogSave.TargetType.crowd)
    public int insert(Crowd t) throws Exception {
        return getDao().insert(t);
    }

    /**
     * Stat dv map.
     *
     * @param file the file
     * @return the map
     * @throws Exception the exception
     */
    public Map<String, Integer> statDv(File file) throws Exception {
        byte[] data = FileUtil.removeUTF8BOM(FileUtils.readFileToByteArray(file));
        return stat(new String(data));

    }

    /**
     * Preview csv csv preview dto.
     *
     * @param file the file
     * @return the csv preview dto
     * @throws Exception the exception
     */
    public CsvPreviewDto previewCsv(File file) throws Exception {
        byte[] data = FileUtil.removeUTF8BOM(FileUtils.readFileToByteArray(file));
        return getPreviewResp(new String(data));
    }

    /**
     * Fet csv file header list.
     *
     * @param file the file
     * @return the list
     * @throws IOException the io exception
     */
    public List<String> fetCsvFileHeader(File file) throws IOException {
        byte[] data = FileUtil.removeUTF8BOM(FileUtils.readFileToByteArray(file));
        CSVParser parser = CSVParser.parse(new String(data), CSVFormat.EXCEL.withHeader());
        List<CSVRecord> recordList = parser.getRecords();
        if (CollectionUtils.isEmpty(recordList)) {
            exceptionBuilder.buildMktException(ExceptionMessage.FILE_EMPTY);
        }
        return new ArrayList<>(recordList.get(0).toMap().values());
    }

    /**
     * Gets json quote.
     *
     * @param crowdId the crowd id
     * @return the json quote
     * @throws Exception the exception
     */
    public List<String> getJsonQuote(Integer crowdId) throws Exception {
        Crowd crowd = getDao().selectByPrimaryKey(crowdId);
        if (crowd == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_NOT_EXIST, crowdId);
        }
        if (!crowd.getCrowdType().equals(CrowdType.CROWD_TYPE_ACCURATE_FILE)) {
            return new ArrayList();
        }
        Attachment attachment = attachmentDao.selectByCrowdId(crowdId);
        if (attachment == null || StringUtils.isBlank(attachment.getPath())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_ATTACH_NOT_EXIST, crowdId);
        }

        try (InputStream in = new FileInputStream(attachment.getPath())) {
            String data = new String(FileUtil.removeUTF8BOM(IOUtils.toByteArray(in)), StandardCharsets.UTF_8);
            return getPreviewResp(data).getQuotes();
        }
    }

    /**
     * Download template.
     *
     * @param res the res
     * @throws Exception the exception
     */
    public void downloadTemplate(HttpServletResponse res) throws Exception {
        res.setHeader("content-type", "application/octet-stream");
        res.setContentType("application/octet-stream;charset=utf-8");
        res.setHeader("Content-Disposition", "attachment;filename=" + new String(("上传模板.zip").getBytes(), "iso-8859-1"));

        Charset charset = Charset.forName("UTF-8");
        ZipOutputStream out = new ZipOutputStream(res.getOutputStream());
        out.setEncoding("utf-8");
        String template = "tdId,phoneNum,IMEI,IDFA,AndroidId,MAC,email,自定义参数1,自定义参数2,自定义参数3";
        template = new String(FileUtil.mergeBytes(FileUtil.UTF8_BOM_BYTES, template.getBytes()));
        String manual = "上传的CSV文件中需至少包含以下七种用户识别ID中的一种：tdId、phoneNum、IMEI、IDFA、AndroidId、MAC、email（请务必保证拼写一致）。非用户识别ID将被系统视为“消息体可引用变量”。";
        Map<String, String> m = new HashMap(16);
        m.put("template.csv", template);
        m.put("模板使用说明.txt", manual);
        for (Map.Entry<String, String> entry : m.entrySet()) {
            ZipEntry archiveEntry = new ZipEntry(entry.getKey());
            archiveEntry.setUnixMode(644);
            out.putNextEntry(archiveEntry);
            out.write(entry.getValue().getBytes(charset));
            out.closeEntry();
        }
        out.close();
    }

    /**
     * Batch create child.
     *
     * @param segment     the segment
     * @param pushMetrics the push metrics
     * @throws Exception the exception
     */
    public void batchCreateChild(Segment segment, PushMetric... pushMetrics) throws Exception {
        Crowd crowd = dao.selectByPrimaryKey(segment.getCrowdId());
        List<CrowdInfoResp> crowdInfoRespList = crowdApi.createAllSubCrowd(segment.getName(), crowd.getRefId(), pushMetrics);
        if (crowdInfoRespList == null || crowdInfoRespList.size() <= 0) {
            logger.error("batchCreateChild crowdInfoRespList is null or size=0");
        }
        for (CrowdInfoResp resp : crowdInfoRespList) {
            Crowd childCrowd = getCrowdFromResp(crowd, resp);
            //mark belong to the segment
            insert(childCrowd);

            SegmentCrowdRel rel = buildSegmentCrowdRel(segment, childCrowd);
            segmentCrowdRelService.insert(rel);

            crowdTaskCalcObjectRecordService.insertByCrowd(childCrowd, CrowdCalcStatus.STATUS_IN_PROGRESS);
        }
    }

    private SegmentCrowdRel buildSegmentCrowdRel(Segment segment, Crowd childCrowd) {
        SegmentCrowdRel rel = new SegmentCrowdRel();
        rel.setCampaignId(segment.getCampaignId());
        rel.setSegmentId(segment.getId());
        rel.setCampaignLaunchUnitId(segment.getCampaignLaunchUnitId());
        rel.setCrowdId(childCrowd.getId());
        rel.setCrowdName(childCrowd.getRefName());
        rel.setCrowdType(childCrowd.getCrowdType());
        rel.setCrowdVersion(childCrowd.getLastVersion());
        rel.setCreateTime(new Date());
        return rel;
    }

    /**
     * Config master account type crowd.
     * 设置主账号和设置主账号预估规模
     *
     * @param crowd the crowd
     * @return the crowd
     */
    public Crowd configMasterAccountType(Crowd crowd) {
        String defaultAccountType = IdTypeConstants.MOBILEID;
        //先默认设置，后面匹配到会覆盖
        crowd.setIdType(defaultAccountType);
        String resp = configApi.getParam(ParamConstants.MARKETING_CROWD_ACCOUNT_TYPE, ParamConstants.SYSTEM_CODE);
        if (resp == null) {
            logger.info("id优先级参数未配置，采用默认的ID类型：{}", defaultAccountType);
            if (!(CrowdType.CROWD_TYPE_ACCURATE_FILE == crowd.getCrowdType())) {
                crowd.setSmsEstimatedSize(crowd.getEstimatedSize());
            } else {
                crowd.setEstimatedSize(crowd.getSmsEstimatedSize());
            }
        } else {
            String[] arr = resp.split(",");
            if (arr == null || arr.length == 0) {
                logger.info("id优先级参数配置为空，采用默认的ID类型：{}", defaultAccountType);
                if (!(CrowdType.CROWD_TYPE_ACCURATE_FILE == crowd.getCrowdType())) {
                    crowd.setSmsEstimatedSize(crowd.getEstimatedSize());
                } else {
                    crowd.setEstimatedSize(crowd.getSmsEstimatedSize());
                }
            } else {
                if (!(CrowdType.CROWD_TYPE_ACCURATE_FILE == crowd.getCrowdType())) {
                    //如果为非一方id上传的人群，则设置第一个为主账号
                    if (arr[0].equalsIgnoreCase(IdTypeConstants.TDID)) {
                        crowd.setIdType(IdTypeConstants.TDID);
                        crowd.setPushEstimatedSize(crowd.getEstimatedSize());
                    } else if (arr[0].equalsIgnoreCase(IdTypeConstants.EMAIL_ID)) {
                        crowd.setIdType(IdTypeConstants.EMAIL_ID);
                        crowd.setEdmEstimatedSize(crowd.getEstimatedSize());
                    } else if (arr[0].equalsIgnoreCase(IdTypeConstants.MOBILEID)) {
                        crowd.setIdType(IdTypeConstants.MOBILEID);
                        crowd.setSmsEstimatedSize(crowd.getEstimatedSize());
                    }
                } else {
                    //如果为一方id上传的人群，则按优先级判断，第一个如果预估规模为NULL，则判断下一个，以此类推,直到找到不为空的预估规模位置
                    configAccountType(crowd, arr);
                }
            }
        }
        return crowd;
    }

    private Crowd configAccountType(Crowd crowd, String[] arr) {
        int i = 0;
        for (String accountType : arr) {
            if (accountType.equalsIgnoreCase(IdTypeConstants.TDID)) {
                if (crowd.getPushEstimatedSize() != null) {
                    crowd.setIdType(IdTypeConstants.TDID);
                    crowd.setEstimatedSize(crowd.getPushEstimatedSize());
                    break;
                }
            } else if (accountType.equalsIgnoreCase(IdTypeConstants.EMAIL_ID)) {
                if (crowd.getEdmEstimatedSize() != null) {
                    crowd.setIdType(IdTypeConstants.EMAIL_ID);
                    crowd.setEstimatedSize(crowd.getEdmEstimatedSize());
                    break;
                }
            } else if (accountType.equalsIgnoreCase(IdTypeConstants.MOBILEID)) {
                if (crowd.getSmsEstimatedSize() != null) {
                    crowd.setIdType(IdTypeConstants.MOBILEID);
                    crowd.setEstimatedSize(crowd.getSmsEstimatedSize());
                    break;
                }
            } else {
                if (i == arr.length - 1) {
                    crowd.setIdType(IdTypeConstants.MOBILEID);
                    crowd.setEstimatedSize(crowd.getSmsEstimatedSize());
                }
            }
            i++;
        }
        return crowd;
    }

    /**
     * Gets crowd from resp.
     *
     * @param crowd the crowd
     * @param resp  the resp
     * @return the crowd from resp
     */
    public Crowd getCrowdFromResp(Crowd crowd, CrowdInfoResp resp) {
        Crowd childCrowd = new Crowd();
        childCrowd.setRefId(resp.getId());
        childCrowd.setSource(resp.getSource());
        childCrowd.setRefCode(resp.getCode());
        childCrowd.setParentId((crowd.getId()));
        childCrowd.setRefName(resp.getName());
        childCrowd.setCrowdType(CrowdType.CROWD_TYPE_SUB_CROWD);
        childCrowd.setStatus(CrowdStatus.STATUS_INEFFECTIVE);
        childCrowd.setTenantId(crowd.getTenantId() + "");
        childCrowd.setCreator(crowd.getCreator());
        childCrowd.setCreateBy(crowd.getCreateBy());
        childCrowd.setCreateTime(new Date());
        return childCrowd;
    }

    /**
     * Query sub map.
     *
     * @param crowdPage the crowd page
     * @return the map
     */
    public Map<String, Object> querySub(CrowdPage crowdPage) {
        Integer parentId = Integer.valueOf(crowdPage.getParentId());
        String name = crowdPage.getRefName();
        int offset = (crowdPage.getPage() - 1) * crowdPage.getPageSize();
        int limit = crowdPage.getPageSize();
        return findByParentsAndName(parentId, name, offset, limit);
    }

    /**
     * Find by parents and name map.
     *
     * @param parentId   the parent id
     * @param name       the name
     * @param offset     the offset
     * @param limit      the limit
     * @return the map
     */
    public Map<String, Object> findByParentsAndName(Integer parentId, String name, int offset, int limit) {
        List<Crowd> list = findByCampaignAndName(name);
        Map<Integer, Boolean> parents = new HashMap(16);
        parents.put(parentId, true);
        List<Crowd> sub = recurseFindByParentsAndName(parents, list);

        Map<String, Object> mapResp = new HashMap(16);
        int total = sub.size();
        if (sub.size() <= offset) {
            mapResp.put("data", new ArrayList());
            mapResp.put("total", total);
            return mapResp;
        }
        int toSize = (offset + limit) > sub.size() ? sub.size() : (offset + limit);
        List<Crowd> subList = sub.subList(offset, toSize);
        mapResp.put("data", subList);
        mapResp.put("total", total);
        return mapResp;
    }

    private Map<Integer, Boolean> buildIdMap(List<Crowd> list) {
        Map<Integer, Boolean> parents = new HashMap(16);
        for (Crowd c : list) {
            parents.put(c.getId(), true);
        }
        return parents;
    }

    private List<Crowd> recurseFindByParentsAndName(Map<Integer, Boolean> parents, List<Crowd> l) {
        List<Crowd> children = findByParents(parents, l);
        if (children.size() > 0) {
            Map<Integer, Boolean> m = buildIdMap(children);
            List<Crowd> sub = recurseFindByParentsAndName(m, l);
            children.addAll(sub);
            return children;
        }
        return new ArrayList();
    }

    private List<Crowd> findByParents(Map<Integer, Boolean> parents, List<Crowd> l) {
        List<Crowd> children = new ArrayList();
        for (Crowd c : l) {
            if (parents.get(c.getParentId()) != null) {
                if (CrowdType.CROWD_TYPE_SUB_CROWD == c.getCrowdType()) {
                    // todo Temporary,if crowd is not accurate,set estimated to td id estimated
                    //c.setEstimatedSize(c.getPushEstimatedSize());
                    children.add(c);
                }
            }
        }
        return children;
    }

    /**
     * Stat map.
     *
     * @param content the content
     * @return the map
     * @throws Exception the exception
     */
    public Map<String, Integer> stat(String content) throws Exception {
        Map<String, Set<String>> statDvMap = new HashMap(16);
        CSVParser parser = CSVParser.parse(content, CSVFormat.EXCEL.withHeader());
        int total = 0;
        for (CSVRecord csvRecord : parser) {
            statByCsv(statDvMap, csvRecord, IdTypeConstants.TDID);
            statByCsv(statDvMap, csvRecord, IdTypeConstants.MOBILEID);
            statByCsv(statDvMap, csvRecord, IdTypeConstants.IMEI);
            statByCsv(statDvMap, csvRecord, IdTypeConstants.IDFA);
            statByCsv(statDvMap, csvRecord, IdTypeConstants.ANDROIDID);
            statByCsv(statDvMap, csvRecord, IdTypeConstants.MAC);
            statByCsv(statDvMap, csvRecord, IdTypeConstants.EMAIL_ID);
            total++;
        }

        Map<String, Integer> statCountMap = new HashMap(16);
        for (Map.Entry<String, Set<String>> entry : statDvMap.entrySet()) {
            statCountMap.put(entry.getKey(), entry.getValue().size());
        }
        statCountMap.put(CommonConstants.TOTAL, total);
        return statCountMap;
    }

    private boolean validMac(String mac) {
        String patternMac = "[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}";
        Pattern pattern = Pattern.compile(patternMac);

        Matcher matcher = pattern.matcher(mac);
        if (!matcher.matches()) {
            return false;
        }
        return true;
    }

    private boolean validPhoneNumber(String phoneNumber) {
        String regExp = "^((13[0-9])|(15[^4])|(18[0,2,3,5-9])|(17[0-8])|(147))\\d{8}$";
        Pattern pattern = Pattern.compile(regExp);
        Matcher matcher = pattern.matcher(phoneNumber);
        if (!matcher.matches()) {
            return false;
        }
        return true;
    }

    private void statByCsv(Map<String, Set<String>> m, CSVRecord csvRecord, String name) throws Exception {
        String cell;
        try {
            cell = csvRecord.get(name);
        } catch (Exception e) {
            //logger.info(String.format("上传的csv文件缺少 %s 列", name));
            return;
        }

        if (StringUtils.isBlank(cell)) {
            return;
        }
        String badRecordType = "";
        if (IdTypeConstants.MAC.equals(name)) {
            if (!validMac(cell)) {
                badRecordType = "MAC";
            }
        } else if (IdTypeConstants.MOBILEID.equals(name)) {
            if (!validPhoneNumber(cell)) {
                badRecordType = "phoneNumber";
            }
        }

        if (!"".equals(badRecordType)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_FILE_RECORD_INVALID, csvRecord.getRecordNumber(), badRecordType);
        }

        if (!m.containsKey(name)) {
            m.put(name, new HashSet());
        }
        Set<String> set = m.get(name);
        set.add(cell);
        m.put(name, set);
    }

    private CsvPreviewDto getPreviewResp(String content) throws IOException {
        CSVParser parser = CSVParser.parse(content, CSVFormat.EXCEL.withHeader());
        List<CSVRecord> recordList = parser.getRecords();
        List<String> quotes = new ArrayList();
        List<Map> previewList = new ArrayList();

        int maxPreviewNum = 10;
        for (int i = 0; i < maxPreviewNum && i < recordList.size(); i++) {
            Map<String, String> m = recordList.get(i).toMap();
            if (i == 0) {
                for (String key : m.keySet()) {
                    if (!ArrayUtils.contains(dvTps, key)) {
                        quotes.add(key);
                    }
                }
            }
            previewList.add(m);
        }
        CsvPreviewDto csvPreviewDto = new CsvPreviewDto();
        csvPreviewDto.setContent(previewList);
        csvPreviewDto.setQuotes(quotes);
        return csvPreviewDto;
    }

    private boolean contains(String expect, String[] arr) {
        for (String str : arr) {
            if (expect.equals(str)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Find by campaign and name list.
     *
     * @param name       the name
     * @return the list
     */
    public List<Crowd> findByCampaignAndName( String name) {
        return dao.queryByCampaignAndName(name);
    }

    /**
     * Find parent by campaign id list.
     *
     * @param campaignId the campaign id
     * @return the list
     */
    @Deprecated
    public List<Crowd> findParentByCampaignId(Integer campaignId) {
        return dao.findParentByCampaignId(campaignId);
    }

    /**
     * Select by ids list.
     *
     * @param param the param
     * @return the list
     * @throws Exception the exception
     */
    public List<Crowd> selectByIds(List<Integer> param) throws Exception {
        List<Crowd> result = getDao().selectByIds(param);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    /**
     * Gets map with ids.
     *
     * @param crowdIdList the crowd id list
     * @return the map with ids
     * @throws Exception the exception
     */
    public Map<Integer, Crowd> getMapWithIds(List<Integer> crowdIdList) throws Exception {
        List<Crowd> crowdList = selectByIds(crowdIdList);
        Map<Integer, Crowd> crowdMap = new HashMap(16);
        for (Crowd crowd : crowdList) {
            crowdMap.put(crowd.getId(), crowd);
        }
        return crowdMap;
    }

    /**
     * Query by status list.
     *
     * @param status the status
     * @return the list
     */
    public List<Crowd> queryByStatus(Integer status) {
        return getDao().queryByStatus(status);
    }

    /**
     * Query by ref id crowd.
     *
     * @param refId the ref id
     * @return the crowd
     */
    public Crowd queryByRefId(Integer refId) {
        return getDao().queryByRefId(refId);
    }

    /**
     * Query by type list.
     *
     * @param statusList the status list
     * @param type       the type
     * @param now        the now
     * @return the list
     */
    public List<Crowd> queryByType(List<Integer> statusList, Integer type, Date now) {
        return getDao().queryByType(statusList, type, now);
    }

    /**
     * Gets sub crowd name.
     *
     * @param crowd the crowd
     * @param date  the date
     * @return the sub crowd name
     */
    public String getSubCrowdName(Crowd crowd, Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dateStr = sdf.format(date);
        return dateStr + "_" + crowd.getRefName();
    }

    /**
     * Gets copy sub crowd.
     *
     * @param parentCrowd the parent crowd
     * @return the copy sub crowd
     */
    public List<Crowd> getCopySubCrowd(Crowd parentCrowd) {
        List<Crowd> crowds = new ArrayList<>();
        if (!parentCrowd.getCrowdType().equals(CrowdType.CROWD_TYPE_SCENE)) {
            return crowds;
        }
        List<Crowd> allSubCrowd = getDao().queryByParentId(parentCrowd.getId());
        Date startTime = parentCrowd.getStartTime();
        Date endTime = parentCrowd.getEndTime();
        Long time = startTime.getTime();
        while (time <= endTime.getTime()) {
            Date date = new Date(time);
            String subCrowdName = getSubCrowdName(parentCrowd, date);
            for (Crowd crowd : allSubCrowd) {
                if (subCrowdName.equals(crowd.getRefName())) {
                    crowds.add(crowd);
                }
            }
            time += 1000 * 60 * 60 * 24L;
        }
        //按照创建时间倒序
        Collections.sort(crowds, Comparator.comparing(Crowd::getCreateTime).reversed());
        return crowds;
    }

    /**
     * Download crowd list.
     *
     * @param crowdId the crowd id
     * @return the list
     * @throws Exception the exception
     */
    public List<String> downloadCrowd(Integer crowdId) throws Exception {
        Crowd crowd = selectByPrimaryKey(crowdId);
        if (crowd == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_NOT_EXIST);
        }
        if (CrowdCalcStatus.STATUS_FINISH != crowd.getStatus()) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_CALC);
        }
        CrowdTaskCalcObjectRecord calcObjectRecord  = crowdTaskCalcObjectRecordService.querylatestByCrowdId(crowd.getId());
        Integer calcId = calcObjectRecord.getId();
        if (calcObjectRecord == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_CALC_ID_NOT_EXIST);
        }
        Integer calcStatus = crowdApi.crowdDownloadCheck(calcId);
        if (calcStatus == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_CALC_STATUS_NULL);
        }
        logger.info("check crowd, calcId:" + calcId + " calc status:" + calcStatus);
        if (!(CrowdCalcStatus.STATUS_FINISH == calcStatus)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_CALC_STATUS_NOT_FINISH);
        }
        return crowdApi.downloadByCalcId(calcId);
    }

    /**
     * Gets crowd by tp.
     *
     * @param crowdPage the crowd page
     * @return the crowd by tp
     * @throws Exception the exception
     */
    public List<Crowd> getCrowdByTp(CrowdPage crowdPage) throws Exception {
        if (StringUtils.isNotBlank(crowdPage.getRefName())) {
            crowdPage.setRefNameOperator("like");
            crowdPage.setRefName(String.format("%%%s%%", crowdPage.getRefName()));
        } else {
            crowdPage.setRefName(null);
        }

        List<Integer> statusList = new ArrayList<>();
        if (StringUtils.isNotBlank(crowdPage.getCrowdType()) && String.valueOf(CrowdType.CROWD_TYPE_SCENE).equals(crowdPage.getCrowdType())) {
            statusList.add(CrowdStatus.STATUS_NOT_START);
        }

        if (StringUtils.isNotBlank(crowdPage.getStatus())) {
            for (String sts : crowdPage.getStatus().split(CrowdConstants.CrowdCalcOutputOperator.SEPARATER)) {
                statusList.add(Integer.parseInt(sts));
            }
        } else {
            statusList.add(CrowdStatus.STATUS_INEFFECTIVE);
            statusList.add(CrowdStatus.STATUS_EFFECTIVE);
        }

        Integer rowCount = getDao().queryCountByStatusIn(crowdPage, statusList);
        crowdPage.getPager().setRowCount(rowCount.intValue());
        return getDao().queryByStatusIn(crowdPage, statusList);
    }

    /**
     * Download crowd notice.
     *
     * @param crowd the crowd
     * @throws Exception the exception
     */
    public void downloadCrowdNotice(Crowd crowd) throws Exception {
        Integer calcId = crowdApi.noticeCrowdDownloadWithVersion(crowd.getRefId(), crowd.getLastVersion(), IdTypeConstants.TDID);
        if (calcId == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_DOWNLOAD_NOTICE_FAIL);
        }
        DataDownload dataDownload = dataDownloadService.buildDataDownload(calcId, crowd);
        dataDownload.setType(DataDownloadConstants.DataDownloadTypeConstants.DATA_DOWNLOAD_TYPE_ALL);
        dataDownload.setCreator(crowd.getCreator());
        dataDownload.setCreateBy(crowd.getCreateBy());
        dataDownloadService.insert(dataDownload);

    }

    /**
     * Crowd recount and update.
     *
     * @param crowd the crowd
     * @throws Exception the exception
     */
    public void crowdRecountAndUpdate(Crowd crowd) throws Exception {
        Integer status = crowdApi.recount(crowd.getRefId());
        if (status == null || status != CrowdCalcStatus.STATUS_IN_PROGRESS) {
            logger.error("recount fail,crowdId:" + crowd.getRefId() + ",status:" + status);
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_RECOUNT_FAIL);
        }
        crowd.setCalcStatus(CrowdCalcStatus.STATUS_IN_PROGRESS);
        crowd.setLastVersion(null);
        updateByPrimaryKeySelective(crowd);
        crowdTaskCalcObjectRecordService.insertByCrowd(crowd, CrowdCalcStatus.STATUS_IN_PROGRESS);
    }

    /**
     * Create with calc record.
     *
     * @param crowd   the crowd
     * @param request the request
     * @throws Exception the exception
     */
    public void createWithCalcRecord(Crowd crowd, HttpServletRequest request) throws Exception {
        crowd = AssignmentUtil.setInfo(crowd, request);
        crowd.setStatus(CrowdStatus.STATUS_INEFFECTIVE);
        crowd.setCalcStatus(CrowdCalcStatus.STATUS_IN_PROGRESS);
        insert(crowd);
        crowdTaskCalcObjectRecordService.insertByCrowd(crowd, CrowdCalcStatus.STATUS_IN_PROGRESS);
    }

    /**
     * Update by ref id.
     *
     * @param crowd the crowd
     * @throws Exception the exception
     */
    public void updateByRefId(Crowd crowd) throws Exception {
        getDao().updateByRefId(crowd);
    }

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     * @throws Exception the exception
     */
    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

    /**
     * Gets history crowd.
     *
     * @param page the page
     * @return the history crowd
     * @throws Exception the exception
     */
    public CrowdResp getHistoryCrowd(CrowdPage page) throws Exception {
        return crowdApi.getHistoryCrowd(page);
    }

    /**
     * Reset crowd version.
     *
     * @param crowdIdList the crowd id list
     * @param calcStatus  the calc status
     */
    public void resetCrowdVersion(List<Integer> crowdIdList, Integer calcStatus) {
        if (crowdIdList == null) {
            return;
        }
        if (crowdIdList.size() <= 0) {
            return;
        }
        getDao().resetCrowdVersion(crowdIdList, calcStatus);
    }

    /**
     * 查询所有数据库中人群
     *
     * @param name the name
     * @return List<Crowd> list
     * @throws Exception the exception
     */
    public List<Crowd> queryCrowds(String name) throws Exception {
        CrowdPage page = new CrowdPage();
        page.setPageSize(Integer.MAX_VALUE);
        if (StringUtils.isNotEmpty(name)) {
            page.setRefNameOperator("like");
            page.setRefName(String.format("%%%s%%", name));
        }
        return queryByList(page);
    }

    /**
     * 创建DMP人群
     *
     * @param crowdInfoResp CrowdInfoResp
     * @param request       HttpServletRequest
     * @throws Exception the exception
     */
    public void createDmpCrowds(CrowdInfoResp crowdInfoResp, HttpServletRequest request) throws Exception {
        Crowd crowdByQuery = queryByRefId(crowdInfoResp.getId());
        if (crowdByQuery == null) {
            Crowd crowd = new Crowd();
            crowd.setCrowdType(CrowdType.CROWD_TYPE_ACCURATE_HISTORY);
            crowd.setSource(crowdInfoResp.getSource());
            crowd.setRefId(crowdInfoResp.getId());
            crowd.setLastUpdateTime(new Date(crowdInfoResp.getUpdateTime()));
            crowd.setStatus(crowdInfoResp.getStatus());
            crowd.setCalcStatus(crowdInfoResp.getCalcStatus());
            crowd.setRefCode(crowdInfoResp.getCode());
            crowd.setRefName(crowdInfoResp.getName());
            crowd.setDescription(crowdInfoResp.getDescription());
            AssignmentUtil.setInfo(crowd, request);
            insert(crowd);
        }
    }

}
