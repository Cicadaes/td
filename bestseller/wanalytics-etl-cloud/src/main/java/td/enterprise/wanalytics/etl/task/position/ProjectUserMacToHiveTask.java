package td.enterprise.wanalytics.etl.task.position;


import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.collections.CollectionUtils;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import td.enterprise.wanalytics.etl.bean.LocationEntity;
import td.enterprise.wanalytics.etl.bean.UserLocalData;
import td.enterprise.wanalytics.etl.bean.UserLocalEntity;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.DMKUtils;
import td.enterprise.wanalytics.etl.util.FileUtil;


@SuppressWarnings({"FieldCanBeLocal", "SqlDialectInspection", "SqlNoDataSourceInspection", "Duplicates", "WeakerAccess"})
@Slf4j
public class ProjectUserMacToHiveTask {

  public static void execute(String macInputFile, String outputFile) {
    log.info("Entering to ProjectUserMacToHiveTask execute. inputFile:{}, outputFile:{}", macInputFile, outputFile);
    List<UserLocalEntity> userLocalEntityList = getUserLocalEntityFromFile(macInputFile);
    if (CollectionUtils.isEmpty(userLocalEntityList)) {
      log.info("userLocalEntityList is null or size = 0");
      return;
    }
    List<HiveEntity> hiveEntityList = convertUserLocalEntityToHiveEntity(userLocalEntityList);
    if (CollectionUtils.isEmpty(hiveEntityList)) {
      log.info("hiveEntityList is null or size = 0");
      return;
    }
    writeDataToFile(hiveEntityList, outputFile);
  }

  public static List<UserLocalEntity> getUserLocalEntityFromFile(String file) {
    log.info("Entering to getUserLocalEntityFromFile. file:{}", file);
    List<String> list = FileUtil.readFileAsList(file);
    List<UserLocalEntity> userLocalEntityList = new ArrayList<>();
    for (String mac : list) {
      try {
        UserLocalEntity userLocalEntity = DMKUtils.queryUserLocResidence(mac, WifipixTaskConstant.TD_DMK_ID_TYPE_MAC);
        // TODO: 2017/10/24 for test
//        UserLocalEntity userLocalEntity = getRandomEntity();
        userLocalEntity.getData().setMac(mac);
        userLocalEntityList.add(userLocalEntity);
      } catch (Exception e) {
        log.error("getMacListFromFile error. mac:{}", mac, e);
      }
    }
    log.info("userLocalEntityList size:{}", userLocalEntityList.size());
    return userLocalEntityList;
  }

  private static UserLocalEntity getRandomEntity() {
    String strings = getRandomString();
    String[] split = strings.split("  ");
    LocationEntity locationEntity = new LocationEntity();
    locationEntity.setDistrict(split[0]);
    locationEntity.setResidence(split[1]);

    UserLocalEntity userLocalEntity = new UserLocalEntity();
    UserLocalData data = new UserLocalData();
    data.setLocation(Collections.singletonList(locationEntity));
    userLocalEntity.setData(data);
    return userLocalEntity;
  }

  public static List<HiveEntity> convertUserLocalEntityToHiveEntity(List<UserLocalEntity> userLocalEntityList) {
    List<HiveEntity> hiveEntityList = new ArrayList<>();
    for (UserLocalEntity userLocalEntity : userLocalEntityList) {
      if (userLocalEntity.getData() == null) {
        continue;
      }
      for (LocationEntity locationEntity : userLocalEntity.getData().getLocation()) {
        String mac = userLocalEntity.getData().getMac();
        HiveEntity hiveEntity = HiveEntity.builder()
            .mac(mac)
            .residence(locationEntity.getResidence())
            .district(locationEntity.getDistrict())
            .build();
        hiveEntityList.add(hiveEntity);
      }
    }
    return hiveEntityList;
  }

  public static void writeDataToFile(List<HiveEntity> hiveEntityList, String outputFile) {
    log.info("Entering to writeDataToFile. list size:{}, output file:{}", hiveEntityList.size(), outputFile);
    BufferedWriter bw = null;
    FileWriter fileWriter = null;
    try {
      fileWriter = new FileWriter(outputFile);
      bw = new BufferedWriter(fileWriter);
      for (HiveEntity entity : hiveEntityList) {
        bw.append(entity.getMac()).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR) // /t
            .append(entity.getDistrict())
            .append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR)
            .append(entity.getResidence())
            .append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK); // /n
      }
//      bw.flush();
//      fileWriter.flush();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      FileUtil.close(bw);
      FileUtil.close(fileWriter);
    }
  }

  public static void main(String[] args) throws IOException {
    log.info("Entering to ProjectUserMacToHiveTask");

    Options options = new Options();
    options.addOption("i", "inputFile", true, "输入文件路径");
    options.addOption("o", "outputFile", true, "输出文件路径");

    String inputFile;
    String outputFile;

    CommandLineParser parser = new PosixParser();
    CommandLine line;
    try {
      line = parser.parse(options, args);
      inputFile = line.getOptionValue("inputFile");
      outputFile = line.getOptionValue("outputFile");
//      inputFile = "/Users/kayc/wanalytics/datafile/tmp/position_offset_2017-10-19/6048_774_30_mac";
//      outputFile = "/Users/kayc/wanalytics/datafile/tmp/position_offset_2017-10-19/6048_774_30_area";

      log.info("inputFile:{}, outputFile:{}", inputFile, outputFile);

      execute(inputFile, outputFile);
    } catch (Exception e1) {
      e1.printStackTrace();
    }
  }

  public static String getRandomString() {
    String s = "朝阳区  秀水园小区\n" +
        "通州区  华兴园（杨庄路）\n" +
        "东城区  北京明城墙遗址公园\n" +
        "福田区  莲花山公园\n" +
        "盐田区  蓝田壹站华苑\n" +
        "罗湖区  新秀村南区\n" +
        "秀峰区  靖江王城\n" +
        "三河市  星河皓月\n" +
        "莲湖区  西桃园小区\n" +
        "渭城区  西安咸阳国际机场\n" +
        "朝阳区  北京新天地\n" +
        "朝阳区  团结湖公园\n" +
        "海淀区  北京航空航天大学\n" +
        "昌平区  蓝天嘉园\n" +
        "昌平区  新龙城\n" +
        "昌平区  龙泽苑西区\n" +
        "海淀区  北京航空航天大学\n" +
        "昌平区  新龙城2期\n" +
        "海淀区  芳清园\n" +
        "朝阳区  银谷·美泉\n" +
        "朝阳区  华纺易城西区\n" +
        "朝阳区  炫特区\n" +
        "昌平区  龙锦苑东5区\n" +
        "朝阳区  延静里中街3号院(延静里中街)\n" +
        "朝阳区  惠新里社区\n" +
        "朝阳区  蕴实园\n" +
        "昌平区  天通苑4区\n" +
        "朝阳区  利星行中心\n" +
        "朝阳区  都市心海岸雅园\n" +
        "大兴区  大雄城市花园\n" +
        "大兴区  梅园\n" +
        "朝阳区  朝阳无限·芳菁苑\n" +
        "朝阳区  方恒购物中心\n" +
        "海淀区  友谊社区\n" +
        "东城区  东湖别墅\n" +
        "朝阳区  北京紫檀万豪行政公寓\n" +
        "丰台区  北京南苑机场\n" +
        "朝阳区  兴隆公园\n" +
        "通州区  竹木厂小区\n" +
        "朝阳区  万象新天4区\n" +
        "番禺区  祈福新邨(鸿福路)\n" +
        "朝阳区  新源西里社区\n" +
        "海淀区  四季御园国际大酒店\n" +
        "丰台区  建欣苑四里（南区）\n" +
        "朝阳区  华威西里\n" +
        "朝阳区  北京工人体育场\n" +
        "海淀区  香山公园\n" +
        "朝阳区  蓝堡国际公寓\n" +
        "浦东新区        冰厂田幼儿园(黑松路）\n" +
        "建邺区  中泰国际广场\n" +
        "石景山区        融景城东区\n" +
        "东城区  国门第一广场\n" +
        "大厂回族自治县  潮白河孔雀城\n" +
        "东城区  胡家园社区（西区）\n" +
        "朝阳区  中国国际贸易中心南区\n" +
        "朝阳区  明天第一城南1区\n" +
        "朝阳区  立水桥公园东区\n" +
        "昌平区  招商嘉铭·珑原\n" +
        "朝阳区  望京明苑\n" +
        "朝阳区  北京像素南区\n" +
        "海淀区  北京林业大学\n" +
        "东城区  东湖别墅\n" +
        "朝阳区  金长安大厦\n" +
        "渝中区  81Plaza购物广场\n" +
        "昌平区  首开智慧社\n" +
        "滨湖区  雪方苑\n" +
        "朝阳区  六里屯街道十里堡北里小区\n" +
        "大兴区  春泽园小区\n" +
        "通州区  天时名苑\n" +
        "丰台区  芳古园2区\n" +
        "朝阳区  保利嘉园3号院\n" +
        "朝阳区  北辰福第\n" +
        "朝阳区  叠泉乡村俱乐部\n" +
        "泰山区  泰山风景名胜区\n" +
        "房山区  天池山风景区\n" +
        "海淀区  皂君东里\n" +
        "丰台区  芳城东里\n" +
        "丰台区  芳城园3区\n" +
        "南明区  贵阳市森林公园\n" +
        "凤凰县  凤凰齐梁洞景区\n" +
        "花都区  广州白云国际机场\n" +
        "西城区  黄瓜园\n" +
        "昌平区  龙锦苑东5区\n" +
        "昌平区  华龙苑北里\n" +
        "朝阳区  甜水园东里\n" +
        "昌平区  冠庭园\n" +
        "长宁区  武夷路227弄小区\n" +
        "东城区  北京东直门智选假日酒店\n" +
        "海淀区  清河毛纺路１６号院\n" +
        "海淀区  橡树湾3期\n" +
        "海淀区  橡树湾4期\n" +
        "朝阳区  北京信息科技大学金台路校区\n" +
        "朝阳区  季景·沁园\n" +
        "朝阳区  金台曦照\n" +
        "丰台区  天怡晴园\n" +
        "大兴区  旧宫医院(科技路)\n" +
        "东城区  天坛公园\n" +
        "西城区  天桥北里\n" +
        "徐汇区  全季酒店(上海徐家汇肇嘉浜路店)\n" +
        "顺义区  北京首都国际机场\n" +
        "徐汇区  衡园\n" +
        "思明区  厦大学生公寓\n" +
        "朝阳区  国际城\n" +
        "瓯海区  温州南站\n" +
        "海淀区  枫丹丽舍\n" +
        "东城区  国盛中心\n" +
        "朝阳区  嘉铭桐城B区\n" +
        "朝阳区  嘉铭园A区\n" +
        "海淀区  北京航空航天大学\n" +
        "河东区  金地·紫乐府\n" +
        "丰台区  丰体时代\n" +
        "丰台区  丰台体育中心\n" +
        "丰台区  北京南站\n" +
        "朝阳区  世茂国际中心\n" +
        "顺义区  北京首都国际机场\n" +
        "浦东新区        芳华苑西区\n" +
        "海淀区  育新花园（育新花园西路）\n" +
        "海淀区  东王庄小区\n" +
        "西城区  广安门住宅小区\n" +
        "朝阳区  十里河家居建材商业街\n" +
        "西城区  西黄城根南街９号院\n" +
        "海淀区  北京动物园\n" +
        "东城区  中国海洋石油办公楼\n" +
        "石景山区        北京石景山游乐园\n" +
        "朝阳区  慧谷金色家园(湖光北街门)\n" +
        "朝阳区  季景·沁园\n" +
        "朝阳区  北京市朝阳区北小河公园\n" +
        "朝阳区  光熙门北里\n" +
        "朝阳区  花家地西里3区\n" +
        "朝阳区  大西洋新城\n" +
        "涞水县  野三坡风景区\n" +
        "海淀区  西二旗铭科苑\n" +
        "海淀区  西二旗智学苑\n" +
        "海淀区  万寿路一号院\n" +
        "海淀区  紫金长安\n" +
        "通州区  大运河高尔夫俱乐部\n" +
        "宝山区  檀乡·湾\n" +
        "海淀区  知春里\n" +
        "海淀区  知春路八十二号院\n" +
        "海淀区  豪景大厦\n" +
        "朝阳区  西坝河东里社区\n" +
        "朝阳区  太阳宫公园\n" +
        "朝阳区  清友园\n" +
        "西城区  观河锦苑\n" +
        "海淀区  志强南园\n" +
        "海淀区  褐石园小区二期\n" +
        "海淀区  中关村北大街厢白旗甲２号院\n" +
        "海淀区  清华大学\n" +
        "昌平区  白各庄新村\n" +
        "顺义区  北京首都国际机场\n" +
        "昌平区  珠江壹千栋\n" +
        "昌平区  西湖新村\n" +
        "西城区  月坛南街７号院\n" +
        "西城区  三里河东路小区\n" +
        "朝阳区  华贸商业街\n" +
        "东城区  天恒大厦\n" +
        "吴兴区  湖州站\n" +
        "昌平区  云趣园1区\n" +
        "昌平区  龙禧苑1区\n" +
        "昌平区  天通苑5区\n" +
        "通州区  荔景园\n" +
        "东城区  国盛中心\n" +
        "金水区  金成时代广场\n" +
        "昌平区  武夷公寓\n" +
        "朝阳区  六里屯街道十里堡北里小区\n" +
        "朝阳区  西单商场(十里堡店)\n" +
        "东城区  东方剧院\n" +
        "昌平区  南店新村\n" +
        "东城区  国盛中心\n" +
        "昌平区  吉晟别墅\n" +
        "海淀区  展春园小区\n" +
        "西城区  什刹海\n" +
        "西城区  新街口西里2区\n" +
        "西城区  中国社会科学院当代中国研究所\n" +
        "朝阳区  静安里\n" +
        "东城区  国盛中心\n" +
        "闵行区  929园区\n" +
        "昌平区  天通西苑3区\n" +
        "丰台区  刘孟家园小区\n" +
        "丰台区  鸿业兴园2区\n" +
        "丰台区  天龙华鹤\n" +
        "昌平区  融泽嘉园\n" +
        "朝阳区  北京中医药大学\n" +
        "海淀区  橡树湾\n" +
        "昌平区  合立方\n" +
        "昌平区  塞纳维拉水景花园\n" +
        "惠安县  大雄·霞张花园\n" +
        "东城区  北京旅居华侨饭店\n" +
        "东城区  后永康胡同６号院\n" +
        "东城区  勘察院家属院\n" +
        " 东城区  东方剧院\n" +
        "昌平区  南店新村\n" +
        "东城区  国盛中心\n" +
        "昌平区  吉晟别墅\n" +
        "海淀区  展春园小区\n" +
        "西城区  什刹海\n" +
        "西城区  新街口西里2区\n" +
        "西城区  中国社会科学院当代中国研究所\n" +
        "朝阳区  静安里\n" +
        "东城区  国盛中心\n" +
        "闵行区  929园区\n" +
        "昌平区  天通西苑3区\n" +
        "丰台区  刘孟家园小区\n" +
        "丰台区  鸿业兴园2区\n" +
        "丰台区  天龙华鹤\n" +
        "昌平区  融泽嘉园\n" +
        "朝阳区  北京中医药大学\n" +
        "海淀区  橡树湾\n" +
        "昌平区  合立方\n" +
        "昌平区  塞纳维拉水景花园\n" +
        "惠安县  大雄·霞张花园\n" +
        "东城区  北京旅居华侨饭店\n" +
        "东城区  后永康胡同６号院\n" +
        "东城区  勘察院家属院\n" +
        "朝阳区  育慧南路小区（兰溪宾馆东）\n" +
        " 东城区  东方剧院\n" +
        "昌平区  南店新村\n" +
        "东城区  国盛中心\n" +
        "昌平区  吉晟别墅\n" +
        "海淀区  展春园小区\n" +
        "西城区  什刹海\n" +
        "西城区  新街口西里2区\n" +
        "西城区  中国社会科学院当代中国研究所\n" +
        "朝阳区  静安里\n" +
        "东城区  国盛中心\n" +
        "闵行区  929园区\n" +
        "昌平区  天通西苑3区\n" +
        "丰台区  刘孟家园小区\n" +
        "丰台区  鸿业兴园2区\n" +
        "丰台区  天龙华鹤\n" +
        "昌平区  融泽嘉园\n" +
        "朝阳区  北京中医药大学\n" +
        "海淀区  橡树湾\n" +
        "昌平区  合立方\n" +
        "昌平区  塞纳维拉水景花园\n" +
        "惠安县  大雄·霞张花园\n" +
        "东城区  北京旅居华侨饭店\n" +
        "东城区  后永康胡同６号院\n" +
        "东城区  勘察院家属院\n" +
        "朝阳区  育慧南路小区（兰溪宾馆东）\n" +
        "朝阳区  绿雅阁\n" +
        "昌平区  天通西苑1区\n" +
        "长宁区  华园\n" +
        "静安区  四明体育弄\n" +
        "东城区  大德日生\n" +
        "东城区  北新仓社区\n" +
        "昌平区  天通东苑3区\n" +
        "丰台区  樊家村甲１４号院\n" +
        "昌平区  蓝天嘉园\n" +
        "昌平区  龙泽苑西区\n" +
        "昌平区  龙华园2区\n" +
        "昌平区  中国政法大学昌平校区\n" +
        "丰台区  丰益城市花园西区\n" +
        "西城区  北京市第八中学分校\n" +
        "丰台区  丰益商务楼\n" +
        "朝阳区  绣菊园\n" +
        "朝阳区  甜水园东里\n" +
        "海淀区  紫竹大厦\n" +
        "海淀区  红联南村\n" +
        "海淀区  索家坟小区\n" +
        " 东城区  东方剧院\n" +
        "昌平区  南店新村\n" +
        "东城区  国盛中心\n" +
        "昌平区  吉晟别墅\n" +
        "海淀区  展春园小区\n" +
        "西城区  什刹海\n" +
        "西城区  新街口西里2区\n" +
        "西城区  中国社会科学院当代中国研究所\n" +
        "朝阳区  静安里\n" +
        "东城区  国盛中心\n" +
        "闵行区  929园区\n" +
        "昌平区  天通西苑3区\n" +
        "丰台区  刘孟家园小区\n" +
        "丰台区  鸿业兴园2区\n" +
        "丰台区  天龙华鹤\n" +
        "昌平区  融泽嘉园\n" +
        "朝阳区  北京中医药大学\n" +
        "海淀区  橡树湾\n" +
        "昌平区  合立方\n" +
        "昌平区  塞纳维拉水景花园\n" +
        "惠安县  大雄·霞张花园\n" +
        "东城区  北京旅居华侨饭店\n" +
        "东城区  后永康胡同６号院\n" +
        "东城区  勘察院家属院\n" +
        "朝阳区  育慧南路小区（兰溪宾馆东）\n" +
        "朝阳区  绿雅阁\n" +
        "昌平区  天通西苑1区\n" +
        "长宁区  华园\n" +
        "静安区  四明体育弄\n" +
        "东城区  大德日生\n" +
        "东城区  北新仓社区\n" +
        "昌平区  天通东苑3区\n" +
        "丰台区  樊家村甲１４号院\n" +
        "昌平区  蓝天嘉园\n" +
        "昌平区  龙泽苑西区\n" +
        "昌平区  龙华园2区\n" +
        "昌平区  中国政法大学昌平校区\n" +
        "丰台区  丰益城市花园西区\n" +
        "西城区  北京市第八中学分校\n" +
        "丰台区  丰益商务楼\n" +
        "朝阳区  绣菊园\n" +
        "朝阳区  甜水园东里\n" +
        "海淀区  紫竹大厦\n" +
        "海淀区  红联南村\n" +
        "海淀区  索家坟小区\n" +
        " 东城区  东方剧院\n" +
        "昌平区  南店新村\n" +
        "东城区  国盛中心\n" +
        "昌平区  吉晟别墅\n" +
        "海淀区  展春园小区\n" +
        "西城区  什刹海\n" +
        "西城区  新街口西里2区\n" +
        "西城区  中国社会科学院当代中国研究所\n" +
        "朝阳区  静安里\n" +
        "东城区  国盛中心\n" +
        "闵行区  929园区\n" +
        "昌平区  天通西苑3区\n" +
        "丰台区  刘孟家园小区\n" +
        "丰台区  鸿业兴园2区\n" +
        "丰台区  天龙华鹤\n" +
        "昌平区  融泽嘉园\n" +
        "朝阳区  北京中医药大学\n" +
        "海淀区  橡树湾\n" +
        "昌平区  合立方\n" +
        "昌平区  塞纳维拉水景花园\n" +
        "惠安县  大雄·霞张花园\n" +
        "东城区  北京旅居华侨饭店\n" +
        "东城区  后永康胡同６号院\n" +
        "东城区  勘察院家属院\n" +
        "朝阳区  育慧南路小区（兰溪宾馆东）\n" +
        "朝阳区  绿雅阁\n" +
        "昌平区  天通西苑1区\n" +
        "长宁区  华园\n" +
        "静安区  四明体育弄\n" +
        "东城区  大德日生\n" +
        "东城区  北新仓社区\n" +
        "昌平区  天通东苑3区\n" +
        "丰台区  樊家村甲１４号院\n" +
        "昌平区  蓝天嘉园\n" +
        "昌平区  龙泽苑西区\n" +
        "昌平区  龙华园2区\n" +
        "昌平区  中国政法大学昌平校区\n" +
        "丰台区  丰益城市花园西区\n" +
        "西城区  北京市第八中学分校\n" +
        "丰台区  丰益商务楼\n" +
        "朝阳区  绣菊园\n" +
        "朝阳区  甜水园东里\n" +
        "海淀区  紫竹大厦\n" +
        "海淀区  红联南村\n" +
        " 东城区  东方剧院\n" +
        "昌平区  南店新村\n" +
        "东城区  国盛中心\n" +
        "昌平区  吉晟别墅\n" +
        "海淀区  展春园小区\n" +
        "西城区  什刹海\n" +
        "西城区  新街口西里2区\n" +
        "西城区  中国社会科学院当代中国研究所\n" +
        "朝阳区  静安里\n" +
        "东城区  国盛中心\n" +
        "闵行区  929园区\n" +
        "昌平区  天通西苑3区\n" +
        "丰台区  刘孟家园小区\n" +
        "丰台区  鸿业兴园2区\n" +
        "丰台区  天龙华鹤\n" +
        "昌平区  融泽嘉园\n" +
        "朝阳区  北京中医药大学\n" +
        "海淀区  橡树湾\n" +
        "昌平区  合立方\n" +
        "昌平区  塞纳维拉水景花园\n" +
        "惠安县  大雄·霞张花园\n" +
        "东城区  北京旅居华侨饭店\n" +
        "东城区  后永康胡同６号院\n" +
        "东城区  勘察院家属院\n" +
        " 东城区  东方剧院\n" +
        "昌平区  南店新村\n" +
        "东城区  国盛中心\n" +
        "昌平区  吉晟别墅\n" +
        "海淀区  展春园小区\n" +
        "西城区  什刹海\n" +
        "西城区  新街口西里2区\n" +
        "西城区  中国社会科学院当代中国研究所\n" +
        "朝阳区  静安里\n" +
        "东城区  国盛中心\n" +
        "闵行区  929园区\n" +
        "昌平区  天通西苑3区\n" +
        "丰台区  刘孟家园小区\n" +
        "丰台区  鸿业兴园2区\n" +
        "丰台区  天龙华鹤\n" +
        "昌平区  融泽嘉园\n" +
        "朝阳区  北京中医药大学\n" +
        "海淀区  橡树湾\n" +
        "昌平区  合立方\n" +
        "昌平区  塞纳维拉水景花园\n" +
        "惠安县  大雄·霞张花园\n" +
        "东城区  北京旅居华侨饭店\n" +
        "东城区  后永康胡同６号院\n" +
        "东城区  勘察院家属院\n" +
        " 东城区  东方剧院\n" +
        "昌平区  南店新村\n" +
        "东城区  国盛中心\n" +
        "昌平区  吉晟别墅\n" +
        "海淀区  展春园小区\n" +
        "西城区  什刹海\n" +
        "西城区  新街口西里2区\n" +
        "西城区  中国社会科学院当代中国研究所\n" +
        "朝阳区  静安里\n" +
        "东城区  国盛中心\n" +
        "闵行区  929园区\n" +
        "昌平区  天通西苑3区\n" +
        "丰台区  刘孟家园小区\n" +
        "丰台区  鸿业兴园2区\n" +
        "丰台区  天龙华鹤\n" +
        "昌平区  融泽嘉园\n" +
        "朝阳区  北京中医药大学\n" +
        "海淀区  橡树湾\n" +
        "昌平区  合立方\n" +
        "昌平区  塞纳维拉水景花园\n" +
        "惠安县  大雄·霞张花园\n" +
        "东城区  北京旅居华侨饭店\n" +
        "东城区  后永康胡同６号院\n" +
        "东城区  勘察院家属院\n" +
        "朝阳区  育慧南路小区（兰溪宾馆东）\n" +
        " 东城区  东方剧院\n" +
        "昌平区  南店新村\n" +
        "东城区  国盛中心\n" +
        "昌平区  吉晟别墅\n" +
        "海淀区  展春园小区\n" +
        "西城区  什刹海\n" +
        "西城区  新街口西里2区\n" +
        "西城区  中国社会科学院当代中国研究所\n" +
        "朝阳区  静安里\n" +
        "东城区  国盛中心\n" +
        "闵行区  929园区\n" +
        "昌平区  天通西苑3区\n" +
        "丰台区  刘孟家园小区\n" +
        "丰台区  鸿业兴园2区\n" +
        "丰台区  天龙华鹤\n" +
        "昌平区  融泽嘉园\n" +
        "朝阳区  北京中医药大学\n" +
        "海淀区  橡树湾\n" +
        "昌平区  合立方\n" +
        "昌平区  塞纳维拉水景花园\n" +
        "惠安县  大雄·霞张花园\n" +
        "东城区  北京旅居华侨饭店\n" +
        "东城区  后永康胡同６号院\n" +
        "东城区  勘察院家属院\n" +
        "朝阳区  育慧南路小区（兰溪宾馆东）\n" +
        "朝阳区  绿雅阁\n" +
        "昌平区  天通西苑1区\n" +
        "长宁区  华园\n" +
        "静安区  四明体育弄\n" +
        "东城区  大德日生\n" +
        "东城区  北新仓社区\n" +
        "昌平区  天通东苑3区\n" +
        "丰台区  樊家村甲１４号院\n" +
        "昌平区  蓝天嘉园\n" +
        "昌平区  龙泽苑西区\n" +
        "昌平区  龙华园2区\n" +
        "昌平区  中国政法大学昌平校区\n" +
        "丰台区  丰益城市花园西区\n" +
        "西城区  北京市第八中学分校\n" +
        "丰台区  丰益商务楼\n" +
        "朝阳区  绣菊园\n" +
        "朝阳区  甜水园东里\n" +
        "海淀区  紫竹大厦\n" +
        "海淀区  红联南村\n" +
        "海淀区  索家坟小区\n" +
        " 东城区  东方剧院\n" +
        "昌平区  南店新村\n" +
        "东城区  国盛中心\n" +
        "昌平区  吉晟别墅\n" +
        "海淀区  展春园小区\n" +
        "西城区  什刹海\n" +
        "西城区  新街口西里2区\n" +
        "西城区  中国社会科学院当代中国研究所\n" +
        "朝阳区  静安里\n" +
        "东城区  国盛中心\n" +
        "闵行区  929园区\n" +
        "昌平区  天通西苑3区\n" +
        "丰台区  刘孟家园小区\n" +
        "丰台区  鸿业兴园2区\n" +
        "丰台区  天龙华鹤\n" +
        "昌平区  融泽嘉园\n" +
        "朝阳区  北京中医药大学\n" +
        "海淀区  橡树湾\n" +
        "昌平区  合立方\n" +
        "昌平区  塞纳维拉水景花园\n" +
        "惠安县  大雄·霞张花园\n" +
        "东城区  北京旅居华侨饭店\n" +
        "东城区  后永康胡同６号院\n" +
        "东城区  勘察院家属院\n" +
        "朝阳区  育慧南路小区（兰溪宾馆东）\n" +
        "朝阳区  绿雅阁\n" +
        "昌平区  天通西苑1区\n" +
        "长宁区  华园\n" +
        "静安区  四明体育弄\n" +
        "东城区  大德日生\n" +
        "东城区  北新仓社区\n" +
        "昌平区  天通东苑3区\n" +
        "丰台区  樊家村甲１４号院\n" +
        "昌平区  蓝天嘉园\n" +
        "昌平区  龙泽苑西区\n" +
        "昌平区  龙华园2区\n" +
        "昌平区  中国政法大学昌平校区\n" +
        "丰台区  丰益城市花园西区\n" +
        "西城区  北京市第八中学分校\n" +
        "丰台区  丰益商务楼\n" +
        "朝阳区  绣菊园\n" +
        "朝阳区  甜水园东里\n" +
        "海淀区  紫竹大厦\n" +
        "海淀区  红联南村\n" +
        "海淀区  索家坟小区";
    String[] split = s.split("\n");
    Random random = new Random();
    int i = random.nextInt(500);
    return split[i];
  }
}

@Data
@Builder
class HiveEntity {
  private String mac; // 用户mac地址
  private String cityName; // 数据来自哪个城市
  private String projectId; // 店铺id
  private String district; // 用户出现的行政区
  private String residence; //  用户出现的住宅小区
  private String city; // 用户出现的所在城市名字
  private String province; // 用户出现的所在省名字
  private String sourceType; // 数据来源， 1.城市表 2.店铺表
  private String tdid; // td id
}

