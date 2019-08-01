package com.talkingdata.marketing.core.entity.dto;

import com.talkingdata.marketing.core.entity.campaign.SmsReachReport;
import java.util.List;

/**
 * Created by zmy on 10/12/2017.
 * @author xiaoming.kang
 */
public class SmsReachReportDto {
    /**成功数*/
    private Integer totalSuccCount;
    /**成功占比*/
    private String totalSuccPercent;
    /**失败数*/
    private Integer totalFailCount;
    /**失败占比*/
    private String totalFailPercent;
    /**未知数*/
    private Integer totalUnknownCount;
    /**未知占比*/
    private String totalUnknownPercent;
    /**点击数*/
    private Integer totalClickCount;
    /**独立点击数*/
    private Integer totalIndependentClickCount;
    /**点击IP数*/
    private Integer totalClickIpCount;
    /**点击链接数*/
    private Integer totalClickLinkCount;
    /**余额不足数*/
    private Integer totalInsufficientBalanceCount;
    /**余额不占比*/
    private String totalInsufficientBalancePercent;
    /**手机号无效数*/
    private Integer totalInvalidPhoneNumberCount;
    /**手机号无效占比*/
    private String totalInvalidPhoneNumberPercent;
    /**退订数*/
    private Integer totalUnsubscribeCount;
    /**退订占比*/
    private String totalUnsubscribePercent;
    /**其他数*/
    private Integer totalOtherCount;
    /**其他占比*/
    private String totalOtherPercent;
    /**黑名单数*/
    private Integer totalBlacklistCount;
    /**黑名单占比*/
    private String totalBlacklistPercent;
    /**无法接通数*/
    private Integer totalUnconnectCount;
    /**无法接通占比*/
    private String totalUnconnectPercent;
    /**超限失败数*/
    private Integer totalOverrunFailCount;
    /**超限失败占比*/
    private String totalOverrunFailPercent;

    private List<SmsReachReport> smsReachReports;

    /**
     * Instantiates a new Sms reach report dto.
     */
    public SmsReachReportDto() {}

    /**
     * Instantiates a new Sms reach report dto.
     *
     * @param totalSuccCount             the total succ count
     * @param totalFailCount             the total fail count
     * @param totalUnknownCount          the total unknown count
     * @param totalClickCount            the total click count
     * @param totalIndependentClickCount the total independent click count
     * @param totalClickIpCount          the total click ip count
     * @param smsReachReports            the sms reach reports
     */
    public SmsReachReportDto(Integer totalSuccCount, Integer totalFailCount, Integer totalUnknownCount, Integer totalClickCount, Integer totalIndependentClickCount, Integer totalClickIpCount, List<SmsReachReport> smsReachReports) {
        this.totalSuccCount = totalSuccCount;
        this.totalFailCount = totalFailCount;
        this.totalUnknownCount = totalUnknownCount;
        this.totalClickCount = totalClickCount;
        this.totalIndependentClickCount = totalIndependentClickCount;
        this.totalClickIpCount = totalClickIpCount;
        this.smsReachReports = smsReachReports;
    }

    /**
     * Instantiates a new Sms reach report dto.
     *
     * @param totalSuccCount                the total succ count
     * @param totalFailCount                the total fail count
     * @param totalUnknownCount             the total unknown count
     * @param totalClickCount               the total click count
     * @param totalIndependentClickCount    the total independent click count
     * @param totalClickIpCount             the total click ip count
     * @param totalClickLinkCount           the total click link count
     * @param totalInsufficientBalanceCount the total insufficient balance count
     * @param totalInvalidPhoneNumberCount  the total invalid phone number count
     * @param totalUnsubscribeCount         the total unsubscribe count
     * @param totalOtherCount               the total other count
     * @param smsReachReports               the sms reach reports
     */
    public SmsReachReportDto(Integer totalSuccCount, Integer totalFailCount, Integer totalUnknownCount, Integer totalClickCount, Integer totalIndependentClickCount,
                             Integer totalClickIpCount, Integer totalClickLinkCount, Integer totalInsufficientBalanceCount, Integer totalInvalidPhoneNumberCount, Integer totalUnsubscribeCount,
                             Integer totalOtherCount, List<SmsReachReport> smsReachReports) {
        this.totalSuccCount = totalSuccCount;
        this.totalFailCount = totalFailCount;
        this.totalUnknownCount = totalUnknownCount;
        this.totalClickCount = totalClickCount;
        this.totalIndependentClickCount = totalIndependentClickCount;
        this.totalClickIpCount = totalClickIpCount;
        this.totalClickLinkCount = totalClickLinkCount;
        this.totalInsufficientBalanceCount = totalInsufficientBalanceCount;
        this.totalInvalidPhoneNumberCount = totalInvalidPhoneNumberCount;
        this.totalUnsubscribeCount = totalUnsubscribeCount;
        this.totalOtherCount = totalOtherCount;
        this.smsReachReports = smsReachReports;
    }

    /**
     * Instantiates a new Sms reach report dto.
     *
     * @param totalSuccCount                the total succ count
     * @param totalFailCount                the total fail count
     * @param totalUnknownCount             the total unknown count
     * @param totalClickCount               the total click count
     * @param totalIndependentClickCount    the total independent click count
     * @param totalClickIpCount             the total click ip count
     * @param totalClickLinkCount           the total click link count
     * @param totalInsufficientBalanceCount the total insufficient balance count
     * @param totalInvalidPhoneNumberCount  the total invalid phone number count
     * @param totalUnsubscribeCount         the total unsubscribe count
     * @param totalOtherCount               the total other count
     * @param totalBlacklistCount           the total blacklist count
     * @param totalUnconnectCount           the total unconnect count
     * @param totalOverrunFailCount         the total overrun fail count
     * @param smsReachReports               the sms reach reports
     */
    public SmsReachReportDto(Integer totalSuccCount, Integer totalFailCount, Integer totalUnknownCount, Integer totalClickCount, Integer totalIndependentClickCount,
                             Integer totalClickIpCount, Integer totalClickLinkCount, Integer totalInsufficientBalanceCount, Integer totalInvalidPhoneNumberCount, Integer totalUnsubscribeCount,
                             Integer totalOtherCount, Integer totalBlacklistCount, Integer totalUnconnectCount, Integer totalOverrunFailCount, List<SmsReachReport> smsReachReports) {
        this.totalSuccCount = totalSuccCount;
        this.totalFailCount = totalFailCount;
        this.totalUnknownCount = totalUnknownCount;
        this.totalClickCount = totalClickCount;
        this.totalIndependentClickCount = totalIndependentClickCount;
        this.totalClickIpCount = totalClickIpCount;
        this.totalClickLinkCount = totalClickLinkCount;
        this.totalInsufficientBalanceCount = totalInsufficientBalanceCount;
        this.totalInvalidPhoneNumberCount = totalInvalidPhoneNumberCount;
        this.totalUnsubscribeCount = totalUnsubscribeCount;
        this.totalOtherCount = totalOtherCount;
        this.totalBlacklistCount = totalBlacklistCount;
        this.totalUnconnectCount = totalUnconnectCount;
        this.totalOverrunFailCount = totalOverrunFailCount;
        this.smsReachReports = smsReachReports;
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
     * Gets total click count.
     *
     * @return the total click count
     */
    public Integer getTotalClickCount() {
        return totalClickCount;
    }

    /**
     * Sets total click count.
     *
     * @param totalClickCount the total click count
     */
    public void setTotalClickCount(Integer totalClickCount) {
        this.totalClickCount = totalClickCount;
    }

    /**
     * Gets total independent click count.
     *
     * @return the total independent click count
     */
    public Integer getTotalIndependentClickCount() {
        return totalIndependentClickCount;
    }

    /**
     * Sets total independent click count.
     *
     * @param totalIndependentClickCount the total independent click count
     */
    public void setTotalIndependentClickCount(Integer totalIndependentClickCount) {
        this.totalIndependentClickCount = totalIndependentClickCount;
    }

    /**
     * Gets total click ip count.
     *
     * @return the total click ip count
     */
    public Integer getTotalClickIpCount() {
        return totalClickIpCount;
    }

    /**
     * Sets total click ip count.
     *
     * @param totalClickIpCount the total click ip count
     */
    public void setTotalClickIpCount(Integer totalClickIpCount) {
        this.totalClickIpCount = totalClickIpCount;
    }

    /**
     * Gets sms reach reports.
     *
     * @return the sms reach reports
     */
    public List<SmsReachReport> getSmsReachReports() {
        return smsReachReports;
    }

    /**
     * Sets sms reach reports.
     *
     * @param smsReachReports the sms reach reports
     */
    public void setSmsReachReports(List<SmsReachReport> smsReachReports) {
        this.smsReachReports = smsReachReports;
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

    /**
     * Gets total invalid phone number count.
     *
     * @return the total invalid phone number count
     */
    public Integer getTotalInvalidPhoneNumberCount() {
        return totalInvalidPhoneNumberCount;
    }

    /**
     * Sets total invalid phone number count.
     *
     * @param totalInvalidPhoneNumberCount the total invalid phone number count
     */
    public void setTotalInvalidPhoneNumberCount(Integer totalInvalidPhoneNumberCount) {
        this.totalInvalidPhoneNumberCount = totalInvalidPhoneNumberCount;
    }

    /**
     * Gets total invalid phone number percent.
     *
     * @return the total invalid phone number percent
     */
    public String getTotalInvalidPhoneNumberPercent() {
        return totalInvalidPhoneNumberPercent;
    }

    /**
     * Sets total invalid phone number percent.
     *
     * @param totalInvalidPhoneNumberPercent the total invalid phone number percent
     */
    public void setTotalInvalidPhoneNumberPercent(String totalInvalidPhoneNumberPercent) {
        this.totalInvalidPhoneNumberPercent = totalInvalidPhoneNumberPercent;
    }

    /**
     * Gets total unsubscribe count.
     *
     * @return the total unsubscribe count
     */
    public Integer getTotalUnsubscribeCount() {
        return totalUnsubscribeCount;
    }

    /**
     * Sets total unsubscribe count.
     *
     * @param totalUnsubscribeCount the total unsubscribe count
     */
    public void setTotalUnsubscribeCount(Integer totalUnsubscribeCount) {
        this.totalUnsubscribeCount = totalUnsubscribeCount;
    }

    /**
     * Gets total unsubscribe percent.
     *
     * @return the total unsubscribe percent
     */
    public String getTotalUnsubscribePercent() {
        return totalUnsubscribePercent;
    }

    /**
     * Sets total unsubscribe percent.
     *
     * @param totalUnsubscribePercent the total unsubscribe percent
     */
    public void setTotalUnsubscribePercent(String totalUnsubscribePercent) {
        this.totalUnsubscribePercent = totalUnsubscribePercent;
    }

    /**
     * Gets total other count.
     *
     * @return the total other count
     */
    public Integer getTotalOtherCount() {
        return totalOtherCount;
    }

    /**
     * Sets total other count.
     *
     * @param totalOtherCount the total other count
     */
    public void setTotalOtherCount(Integer totalOtherCount) {
        this.totalOtherCount = totalOtherCount;
    }

    /**
     * Gets total other percent.
     *
     * @return the total other percent
     */
    public String getTotalOtherPercent() {
        return totalOtherPercent;
    }

    /**
     * Sets total other percent.
     *
     * @param totalOtherPercent the total other percent
     */
    public void setTotalOtherPercent(String totalOtherPercent) {
        this.totalOtherPercent = totalOtherPercent;
    }

    /**
     * Gets total blacklist count.
     *
     * @return the total blacklist count
     */
    public Integer getTotalBlacklistCount() {
        return totalBlacklistCount;
    }

    /**
     * Sets total blacklist count.
     *
     * @param totalBlacklistCount the total blacklist count
     */
    public void setTotalBlacklistCount(Integer totalBlacklistCount) {
        this.totalBlacklistCount = totalBlacklistCount;
    }

    /**
     * Gets total blacklist percent.
     *
     * @return the total blacklist percent
     */
    public String getTotalBlacklistPercent() {
        return totalBlacklistPercent;
    }

    /**
     * Sets total blacklist percent.
     *
     * @param totalBlacklistPercent the total blacklist percent
     */
    public void setTotalBlacklistPercent(String totalBlacklistPercent) {
        this.totalBlacklistPercent = totalBlacklistPercent;
    }

    /**
     * Gets total unconnect count.
     *
     * @return the total unconnect count
     */
    public Integer getTotalUnconnectCount() {
        return totalUnconnectCount;
    }

    /**
     * Sets total unconnect count.
     *
     * @param totalUnconnectCount the total unconnect count
     */
    public void setTotalUnconnectCount(Integer totalUnconnectCount) {
        this.totalUnconnectCount = totalUnconnectCount;
    }

    /**
     * Gets total unconnect percent.
     *
     * @return the total unconnect percent
     */
    public String getTotalUnconnectPercent() {
        return totalUnconnectPercent;
    }

    /**
     * Sets total unconnect percent.
     *
     * @param totalUnconnectPercent the total unconnect percent
     */
    public void setTotalUnconnectPercent(String totalUnconnectPercent) {
        this.totalUnconnectPercent = totalUnconnectPercent;
    }

    /**
     * Gets total overrun fail count.
     *
     * @return the total overrun fail count
     */
    public Integer getTotalOverrunFailCount() {
        return totalOverrunFailCount;
    }

    /**
     * Sets total overrun fail count.
     *
     * @param totalOverrunFailCount the total overrun fail count
     */
    public void setTotalOverrunFailCount(Integer totalOverrunFailCount) {
        this.totalOverrunFailCount = totalOverrunFailCount;
    }

    /**
     * Gets total overrun fail percent.
     *
     * @return the total overrun fail percent
     */
    public String getTotalOverrunFailPercent() {
        return totalOverrunFailPercent;
    }

    /**
     * Sets total overrun fail percent.
     *
     * @param totalOverrunFailPercent the total overrun fail percent
     */
    public void setTotalOverrunFailPercent(String totalOverrunFailPercent) {
        this.totalOverrunFailPercent = totalOverrunFailPercent;
    }
}
