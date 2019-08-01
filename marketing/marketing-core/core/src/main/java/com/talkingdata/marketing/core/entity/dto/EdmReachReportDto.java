package com.talkingdata.marketing.core.entity.dto;

import com.talkingdata.marketing.core.entity.campaign.EdmReachReport;
import java.util.List;

/**
 * Created by zmy on 10/12/2017.
 * @author xiaoming.kang
 */
public class EdmReachReportDto {
    /**成功数*/
    private Integer totalSuccCount;
    /**成功占比*/
    private String totalSuccPercent;
    /**失败数*/
    private Integer totalFailCount;
    /**失败占比*/
    private String totalFailPercent;
    /**无效的地址数*/
    private Integer totalInvalidAddressCount;
    /**无效的地址占比*/
    private String totalInvalidAddressPercent;
    /**服务器拒绝数*/
    private Integer totalServerRejectedCount;
    /**服务器拒占比*/
    private String totalServerRejectedPercent;
    /**未知数*/
    private Integer totalUnknownCount;
    /**未知占比*/
    private String totalUnknownPercent;
    /**阅读数*/
    private Integer totalReadCount;
    /**阅读人数*/
    private Integer totalPersonReadCount;
    /**点击链接数*/
    private Integer totalClickLinkCount;
    /**账户关闭次数*/
    private Integer totalAccountCloseCount;
    /**账户关闭占比*/
    private String totalAccountClosePercent;
    /**账户余额不足数*/
    private Integer totalInsufficientBalanceCount;
    /**余额不占比*/
    private String totalInsufficientBalancePercent;

    private List<EdmReachReport> edmReachReports;

    /**
     * Instantiates a new Edm reach report dto.
     */
    public EdmReachReportDto() {
    }

    /**
     * Instantiates a new Edm reach report dto.
     *
     * @param totalSuccCount           the total succ count
     * @param totalFailCount           the total fail count
     * @param totalInvalidAddressCount the total invalid address count
     * @param totalServerRejectedCount the total server rejected count
     * @param totalUnknownCount        the total unknown count
     * @param totalReadCount           the total read count
     * @param totalPersonReadCount     the total person read count
     * @param totalClickLinkCount      the total click link count
     * @param edmReachReports          the edm reach reports
     */
    public EdmReachReportDto(Integer totalSuccCount, Integer totalFailCount, Integer totalInvalidAddressCount, Integer totalServerRejectedCount, Integer totalUnknownCount, Integer totalReadCount, Integer totalPersonReadCount, Integer totalClickLinkCount, List<EdmReachReport> edmReachReports) {
        this.totalSuccCount = totalSuccCount;
        this.totalFailCount = totalFailCount;
        this.totalInvalidAddressCount = totalInvalidAddressCount;
        this.totalServerRejectedCount = totalServerRejectedCount;
        this.totalUnknownCount = totalUnknownCount;
        this.totalReadCount = totalReadCount;
        this.totalPersonReadCount = totalPersonReadCount;
        this.totalClickLinkCount = totalClickLinkCount;
        this.edmReachReports = edmReachReports;
    }

    /**
     * Instantiates a new Edm reach report dto.
     *
     * @param totalSuccCount                the total succ count
     * @param totalFailCount                the total fail count
     * @param totalInvalidAddressCount      the total invalid address count
     * @param totalServerRejectedCount      the total server rejected count
     * @param totalUnknownCount             the total unknown count
     * @param totalReadCount                the total read count
     * @param totalPersonReadCount          the total person read count
     * @param totalClickLinkCount           the total click link count
     * @param totalAccountCloseCount        the total account close count
     * @param totalInsufficientBalanceCount the total insufficient balance count
     * @param edmReachReports               the edm reach reports
     */
    public EdmReachReportDto(Integer totalSuccCount, Integer totalFailCount, Integer totalInvalidAddressCount, Integer totalServerRejectedCount, Integer totalUnknownCount, Integer totalReadCount, Integer totalPersonReadCount, Integer totalClickLinkCount, Integer totalAccountCloseCount, Integer totalInsufficientBalanceCount, List<EdmReachReport> edmReachReports) {
        this.totalSuccCount = totalSuccCount;
        this.totalFailCount = totalFailCount;
        this.totalInvalidAddressCount = totalInvalidAddressCount;
        this.totalServerRejectedCount = totalServerRejectedCount;
        this.totalUnknownCount = totalUnknownCount;
        this.totalReadCount = totalReadCount;
        this.totalPersonReadCount = totalPersonReadCount;
        this.totalClickLinkCount = totalClickLinkCount;
        this.totalAccountCloseCount = totalAccountCloseCount;
        this.totalInsufficientBalanceCount = totalInsufficientBalanceCount;
        this.edmReachReports = edmReachReports;
    }

    /**
     * Gets total succ count.
     *
     * @return the total succ count
     */
    public Integer getTotalSuccCount() {
        return totalSuccCount;
    }

    /**
     * Sets total succ count.
     *
     * @param totalSuccCount the total succ count
     */
    public void setTotalSuccCount(Integer totalSuccCount) {
        this.totalSuccCount = totalSuccCount;
    }

    /**
     * Gets total succ percent.
     *
     * @return the total succ percent
     */
    public String getTotalSuccPercent() {
        return totalSuccPercent;
    }

    /**
     * Sets total succ percent.
     *
     * @param totalSuccPercent the total succ percent
     */
    public void setTotalSuccPercent(String totalSuccPercent) {
        this.totalSuccPercent = totalSuccPercent;
    }

    /**
     * Gets total fail count.
     *
     * @return the total fail count
     */
    public Integer getTotalFailCount() {
        return totalFailCount;
    }

    /**
     * Sets total fail count.
     *
     * @param totalFailCount the total fail count
     */
    public void setTotalFailCount(Integer totalFailCount) {
        this.totalFailCount = totalFailCount;
    }

    /**
     * Gets total fail percent.
     *
     * @return the total fail percent
     */
    public String getTotalFailPercent() {
        return totalFailPercent;
    }

    /**
     * Sets total fail percent.
     *
     * @param totalFailPercent the total fail percent
     */
    public void setTotalFailPercent(String totalFailPercent) {
        this.totalFailPercent = totalFailPercent;
    }

    /**
     * Gets total invalid address count.
     *
     * @return the total invalid address count
     */
    public Integer getTotalInvalidAddressCount() {
        return totalInvalidAddressCount;
    }

    /**
     * Sets total invalid address count.
     *
     * @param totalInvalidAddressCount the total invalid address count
     */
    public void setTotalInvalidAddressCount(Integer totalInvalidAddressCount) {
        this.totalInvalidAddressCount = totalInvalidAddressCount;
    }

    /**
     * Gets total invalid address percent.
     *
     * @return the total invalid address percent
     */
    public String getTotalInvalidAddressPercent() {
        return totalInvalidAddressPercent;
    }

    /**
     * Sets total invalid address percent.
     *
     * @param totalInvalidAddressPercent the total invalid address percent
     */
    public void setTotalInvalidAddressPercent(String totalInvalidAddressPercent) {
        this.totalInvalidAddressPercent = totalInvalidAddressPercent;
    }

    /**
     * Gets total server rejected count.
     *
     * @return the total server rejected count
     */
    public Integer getTotalServerRejectedCount() {
        return totalServerRejectedCount;
    }

    /**
     * Sets total server rejected count.
     *
     * @param totalServerRejectedCount the total server rejected count
     */
    public void setTotalServerRejectedCount(Integer totalServerRejectedCount) {
        this.totalServerRejectedCount = totalServerRejectedCount;
    }

    /**
     * Gets total server rejected percent.
     *
     * @return the total server rejected percent
     */
    public String getTotalServerRejectedPercent() {
        return totalServerRejectedPercent;
    }

    /**
     * Sets total server rejected percent.
     *
     * @param totalServerRejectedPercent the total server rejected percent
     */
    public void setTotalServerRejectedPercent(String totalServerRejectedPercent) {
        this.totalServerRejectedPercent = totalServerRejectedPercent;
    }

    /**
     * Gets total unknown count.
     *
     * @return the total unknown count
     */
    public Integer getTotalUnknownCount() {
        return totalUnknownCount;
    }

    /**
     * Sets total unknown count.
     *
     * @param totalUnknownCount the total unknown count
     */
    public void setTotalUnknownCount(Integer totalUnknownCount) {
        this.totalUnknownCount = totalUnknownCount;
    }

    /**
     * Gets total unknown percent.
     *
     * @return the total unknown percent
     */
    public String getTotalUnknownPercent() {
        return totalUnknownPercent;
    }

    /**
     * Sets total unknown percent.
     *
     * @param totalUnknownPercent the total unknown percent
     */
    public void setTotalUnknownPercent(String totalUnknownPercent) {
        this.totalUnknownPercent = totalUnknownPercent;
    }

    /**
     * Gets total read count.
     *
     * @return the total read count
     */
    public Integer getTotalReadCount() {
        return totalReadCount;
    }

    /**
     * Sets total read count.
     *
     * @param totalReadCount the total read count
     */
    public void setTotalReadCount(Integer totalReadCount) {
        this.totalReadCount = totalReadCount;
    }

    /**
     * Gets total person read count.
     *
     * @return the total person read count
     */
    public Integer getTotalPersonReadCount() {
        return totalPersonReadCount;
    }

    /**
     * Sets total person read count.
     *
     * @param totalPersonReadCount the total person read count
     */
    public void setTotalPersonReadCount(Integer totalPersonReadCount) {
        this.totalPersonReadCount = totalPersonReadCount;
    }

    /**
     * Gets total click link count.
     *
     * @return the total click link count
     */
    public Integer getTotalClickLinkCount() {
        return totalClickLinkCount;
    }

    /**
     * Sets total click link count.
     *
     * @param totalClickLinkCount the total click link count
     */
    public void setTotalClickLinkCount(Integer totalClickLinkCount) {
        this.totalClickLinkCount = totalClickLinkCount;
    }

    /**
     * Gets edm reach reports.
     *
     * @return the edm reach reports
     */
    public List<EdmReachReport> getEdmReachReports() {
        return edmReachReports;
    }

    /**
     * Sets edm reach reports.
     *
     * @param edmReachReports the edm reach reports
     */
    public void setEdmReachReports(List<EdmReachReport> edmReachReports) {
        this.edmReachReports = edmReachReports;
    }

    /**
     * Gets total account close count.
     *
     * @return the total account close count
     */
    public Integer getTotalAccountCloseCount() {
        return totalAccountCloseCount;
    }

    /**
     * Sets total account close count.
     *
     * @param totalAccountCloseCount the total account close count
     */
    public void setTotalAccountCloseCount(Integer totalAccountCloseCount) {
        this.totalAccountCloseCount = totalAccountCloseCount;
    }

    /**
     * Gets total account close percent.
     *
     * @return the total account close percent
     */
    public String getTotalAccountClosePercent() {
        return totalAccountClosePercent;
    }

    /**
     * Sets total account close percent.
     *
     * @param totalAccountClosePercent the total account close percent
     */
    public void setTotalAccountClosePercent(String totalAccountClosePercent) {
        this.totalAccountClosePercent = totalAccountClosePercent;
    }

    /**
     * Gets total insufficient balance count.
     *
     * @return the total insufficient balance count
     */
    public Integer getTotalInsufficientBalanceCount() {
        return totalInsufficientBalanceCount;
    }

    /**
     * Sets total insufficient balance count.
     *
     * @param totalInsufficientBalanceCount the total insufficient balance count
     */
    public void setTotalInsufficientBalanceCount(Integer totalInsufficientBalanceCount) {
        this.totalInsufficientBalanceCount = totalInsufficientBalanceCount;
    }

    /**
     * Gets total insufficient balance percent.
     *
     * @return the total insufficient balance percent
     */
    public String getTotalInsufficientBalancePercent() {
        return totalInsufficientBalancePercent;
    }

    /**
     * Sets total insufficient balance percent.
     *
     * @param totalInsufficientBalancePercent the total insufficient balance percent
     */
    public void setTotalInsufficientBalancePercent(String totalInsufficientBalancePercent) {
        this.totalInsufficientBalancePercent = totalInsufficientBalancePercent;
    }
}
