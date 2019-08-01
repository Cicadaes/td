package td.enterprise.wanalytics.etl.task.download;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import td.enterprise.wanalytics.etl.bean.DownLoadExcelBean;
import td.enterprise.wanalytics.etl.util.HttpUtil;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;


/**
 * @author Yan
 */

@Slf4j
public class DownLoadWriteXlsx {

    public static final String pathname = HttpUtil.getParamFromConfigServer("download.template.file");
//    public static final String pathname = "/Users/Yan/Downloads/template.xlsx";

    private XSSFWorkbook workbook = null;
    private XSSFSheet xssfSheet = null;

    public DownLoadWriteXlsx() throws IOException, InvalidFormatException {
        workbook = new XSSFWorkbook(new File(pathname));
        xssfSheet = workbook.getSheetAt(0);
        xssfSheet.setZoom(1,1);//不缩放
    }

    public void addLine(DownLoadExcelBean bean, int lineNumb) throws IOException, InvalidFormatException {


        XSSFRow createRow = xssfSheet.createRow(lineNumb++);
        createRow.createCell(0).setCellValue(bean.getCisCode());
        createRow.createCell(1).setCellValue(bean.getShopIntroduction());
        createRow.createCell(2).setCellValue(bean.getMarketLevel());
        createRow.createCell(3).setCellValue(bean.getOwnedBusinesses());
        createRow.createCell(4).setCellValue(bean.getProvince());
        createRow.createCell(5).setCellValue(bean.getCity());
        createRow.createCell(6).setCellValue(bean.getArea());
        createRow.createCell(7).setCellValue(bean.getTownship());
        createRow.createCell(8).setCellValue(bean.getMarketingCenter());
        createRow.createCell(9).setCellValue(bean.getRefrigeratorBranch());
        createRow.createCell(10).setCellValue(bean.getAirConditioningBranch());
        createRow.createCell(11).setCellValue(bean.getTelevisionBranch());
        createRow.createCell(12).setCellValue(bean.getMobileBranch());
        createRow.createCell(13).setCellValue(bean.getTotalPassengerFlow());
        createRow.createCell(14).setCellValue(bean.getDailyPassengerFlow());
        createRow.createCell(15).setCellValue(bean.getNewPassengerFlow());
        createRow.createCell(16).setCellValue(bean.getDailyNewCustomer());
        createRow.createCell(17).setCellValue(bean.getOldPassengerFlow());
        createRow.createCell(18).setCellValue(bean.getDailyOldCustomer());
        createRow.createCell(19).setCellValue(bean.getNewPassengerRate());
        createRow.createCell(20).setCellValue(bean.getPeakPeriod());
        createRow.createCell(21).setCellValue(bean.getPassengerFlow9());
        createRow.createCell(22).setCellValue(bean.getPassengerFlow10());
        createRow.createCell(23).setCellValue(bean.getPassengerFlow11());
        createRow.createCell(24).setCellValue(bean.getPassengerFlow12());
        createRow.createCell(25).setCellValue(bean.getPassengerFlow13());
        createRow.createCell(26).setCellValue(bean.getPassengerFlow14());
        createRow.createCell(27).setCellValue(bean.getPassengerFlow15());
        createRow.createCell(28).setCellValue(bean.getPassengerFlow16());
        createRow.createCell(29).setCellValue(bean.getPassengerFlow17());
        createRow.createCell(30).setCellValue(bean.getPassengerFlow18());
        createRow.createCell(31).setCellValue(bean.getPassengerFlow19());
        createRow.createCell(32).setCellValue(bean.getPassengerFlow20());
        createRow.createCell(33).setCellValue(bean.getPassengerFlow21());
        createRow.createCell(34).setCellValue(bean.getPassengerFlow22());
        createRow.createCell(35).setCellValue(bean.getPassengerFlow23());
        createRow.createCell(36).setCellValue(bean.getMeanResidenceTime());
        createRow.createCell(37).setCellValue(bean.getGenderMale());
        createRow.createCell(38).setCellValue(bean.getGenderFemale());
        createRow.createCell(39).setCellValue(bean.getYears19());
        createRow.createCell(40).setCellValue(bean.getYears25());
        createRow.createCell(41).setCellValue(bean.getYears35());
        createRow.createCell(42).setCellValue(bean.getYears45());
        createRow.createCell(43).setCellValue(bean.getYears55());
        createRow.createCell(44).setCellValue(bean.getYears100());
        createRow.createCell(45).setCellValue(bean.getMarried());
        createRow.createCell(46).setCellValue(bean.getChild());
        createRow.createCell(47).setCellValue(bean.getHaveCar());
        createRow.createCell(48).setCellValue(bean.getPhoneBrand());
        createRow.createCell(49).setCellValue(bean.getPrice499());
        createRow.createCell(50).setCellValue(bean.getPrice999());
        createRow.createCell(51).setCellValue(bean.getPrice1999());
        createRow.createCell(52).setCellValue(bean.getPrice3999());
        createRow.createCell(53).setCellValue(bean.getPrice4000());
        createRow.createCell(54).setCellValue(bean.getWork());
        createRow.createCell(55).setCellValue(bean.getVideo());
        createRow.createCell(56).setCellValue(bean.getFood());
        createRow.createCell(57).setCellValue(bean.getBusinessTravel());
        createRow.createCell(58).setCellValue(bean.getFinance());
        createRow.createCell(59).setCellValue(bean.getCosmetology());
        createRow.createCell(60).setCellValue(bean.getSocialContact());
        createRow.createCell(61).setCellValue(bean.getRead());
        createRow.createCell(62).setCellValue(bean.getHealthy());
        createRow.createCell(63).setCellValue(bean.getLife());
        createRow.createCell(64).setCellValue(bean.getEntertainment());
        createRow.createCell(65).setCellValue(bean.getHomeFurnishing());
        createRow.createCell(66).setCellValue(bean.getCar());
        createRow.createCell(67).setCellValue(bean.getHouseProperty());
        createRow.createCell(68).setCellValue(bean.getBaby());
        createRow.createCell(69).setCellValue(bean.getOnlineShopping());
        createRow.createCell(70).setCellValue(bean.getInformation());
        createRow.createCell(71).setCellValue(bean.getCommunityRanking());
    }

    /**
     * 写出文件
     */
    public void writeDown(String outputfile) {
        FileOutputStream fileOutputStream = null;
        try {
            fileOutputStream = new FileOutputStream(outputfile);
            workbook.write(fileOutputStream);
        } catch (FileNotFoundException e) {
            log.error("文件未找到？  " + outputfile + "  ===", e);
        } catch (IOException e) {
            log.error("Io异常？  " + outputfile + "  ===", e);
        } finally {
            if (fileOutputStream != null) {
                try {
                    fileOutputStream.close();
                } catch (IOException e) {
                    log.error("file流没有正常关闭");
                }
            }
        }
    }

}
