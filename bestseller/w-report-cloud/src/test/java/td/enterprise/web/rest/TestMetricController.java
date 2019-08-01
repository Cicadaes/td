package td.enterprise.web.rest;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.jasig.cas.client.authentication.AttributePrincipal;
import org.jasig.cas.client.authentication.AttributePrincipalImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.Assert;
import org.springframework.web.context.WebApplicationContext;
import td.enterprise.Application;
import td.enterprise.common.util.JSONUtil;
import td.enterprise.entity.Crowd;
import td.enterprise.entity.Project;
import td.enterprise.page.CrowdPage;
import td.enterprise.page.ProjectPage;
import td.enterprise.service.CrowdService;
import td.enterprise.service.DTO.Tag;
import td.enterprise.service.ProjectService;
import td.enterprise.web.vm.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 指标Controller 服务接口测试
 *
 * @author junmin.li
 *         2017-03-06
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class TestMetricController {

    // 模拟request,response
    private MockHttpServletRequest request;

    @Autowired
    private WebApplicationContext wac;

    protected MockMvc mock;
    protected MockHttpSession mockSession;

    private String startDate = "2017-03-03";
    private String endDate = "2017-03-03";

    private String tenantId;
    private int projectId;

    private int activeCrowdId; //到访人群id

    @Autowired
    private ProjectService projectService;

    @Autowired
    private CrowdService crowdService;


    // 执行测试方法之前初始化模拟request,response  
    @Before
    public void setUp() throws Exception {
        request = new MockHttpServletRequest();
        request.setCharacterEncoding("UTF-8");
        mock = MockMvcBuilders.webAppContextSetup(wac).build();
        String sessionId = UUID.randomUUID().toString();
        mockSession = new MockHttpSession(wac.getServletContext(), sessionId);
        Map<String, Object> attributes = new HashMap<String, Object>(1);
        attributes.put("umid", "uniqlo@163.com");
        AttributePrincipal userPrincipal = new AttributePrincipalImpl("lijunmin", attributes);
        request.setUserPrincipal(userPrincipal);
        User user = new User();
        user.setTenantId(2000262);
        user.setUmid("uniqlo@163.com");
        mockSession.setAttribute("user", user);

        ProjectPage page = new ProjectPage();
        page.setProjectName("测试项目010");
        Project project = projectService.queryBySingle(page);
        if (null == project) {
            throw new Exception("项目没找到");
        }
        tenantId = project.getTenantId();
        projectId = project.getId();
        //查询到访人群id
        CrowdPage crowdPage = new CrowdPage();
        crowdPage.setAttr1(projectId + "");
        crowdPage.setType("AU");
        Crowd crowd = crowdService.queryBySingle(crowdPage);
        activeCrowdId = crowd.getId();

    }

    /**
     * @throws Exception
     * @Title：今日客流测试
     * @Description: 测试客群概览
     */
    @Test
    public void testPassengerCount() throws Exception {
        MvcResult response = mock.perform(get("/api/passenger/passengerOverview/passengerCount/" + projectId + "/2017-03-03")
                .session(mockSession)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())//判断执行状态
                .andReturn();
        String content = response.getResponse().getContentAsString();
        ProjectCountVM vm = (ProjectCountVM) JSONUtil.jsonToBean(content, ProjectCountVM.class);

        Assert.isTrue(Integer.parseInt(vm.getTodayUsers()) == 7);//进行判断
    }

    /**
     * 测试进店人数
     *
     * @throws Exception
     */
    @Test
    public void testEnterCount() throws Exception {
        MvcResult response = mock.perform(get("/api/passengerTrend/passengerEnterTrendCount?startDate=" + startDate + "&endDate=" + endDate + "&projectId=" + projectId)
                .session(mockSession)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())//判断执行状态
                .andReturn();
        String content = response.getResponse().getContentAsString();
        PassengerTrendCountListVM vm = (PassengerTrendCountListVM) JSONUtil.jsonToBean(content, PassengerTrendCountListVM.class);

        Assert.isTrue(Integer.parseInt(vm.getTotal()) == 7);  //进店人数
    }

    /**
     * 测试停留人数
     *
     * @throws Exception
     */
    @Test
    public void testStayCount() throws Exception {
        MvcResult response = mock.perform(get("/api/passengerTrend/passengerStayTrendCount?startDate=" + startDate + "&endDate=" + endDate + "&projectId=" + projectId)
                .session(mockSession)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())//判断执行状态
                .andReturn();
        String content = response.getResponse().getContentAsString();
        PassengerTrendCountListVM vm = (PassengerTrendCountListVM) JSONUtil.jsonToBean(content, PassengerTrendCountListVM.class);
        Assert.isTrue(Integer.parseInt(vm.getTotal()) == 4);  //停留人数
    }

    /**
     * 驻留时长分布
     *
     * @throws Exception
     */
    @Test
    public void testVisitTimeDistribution() throws Exception {
        MvcResult response = mock.perform(get("/api/visitDepth/visitTimesDuration?startDate=" + startDate + "&endDate=" + endDate + "&projectId=" + projectId)
                .session(mockSession)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())//判断执行状态
                .andReturn();
        String content = response.getResponse().getContentAsString();
        VisitTimesDurationVM vm = (VisitTimesDurationVM) JSONUtil.jsonToBean(content, VisitTimesDurationVM.class);
        Assert.isTrue(vm.getMinute15() == 3);//和期望值进行比较 和<5分钟的值做比较
        Assert.isTrue(vm.getMinute30() == 4); //和5到15分钟的值做比较
    }

    /**
     * 测试人均停留时长
     *
     * @throws Exception
     */
    @Test
    public void testStayDurationCount() throws Exception {
        MvcResult response = mock.perform(get("/api/visitDepth/avarageStayDuration?startDate=" + startDate + "&endDate=" + endDate + "&projectId=" + projectId)
                .session(mockSession)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())//判断执行状态
                .andReturn();
        String content = response.getResponse().getContentAsString();
        PassengerDurationListVM vm = (PassengerDurationListVM) JSONUtil.jsonToBean(content, PassengerDurationListVM.class);
        Assert.isTrue(Double.parseDouble(vm.getTotal()) == 5.0);  //停留时间
    }

    /**
     * 测试消费能力
     *
     * @throws Exception
     */
    @Test
    public void testConsumingAbility() throws Exception {
        String param = "startDate=2017-03-01&endDate=2017-03-30&projectId=" + projectId + "&crowdId=" + activeCrowdId + "&phonebrandlimit=5&shopcenterlimit=20&restaurantbrandlimit=20&shopbrandlimit=20";
        MvcResult response = mock.perform(get("/api/passenger/consumingAbility?" + param)
                .session(mockSession)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        String content = response.getResponse().getContentAsString();
        ConsumingAbilityVM vm = (ConsumingAbilityVM) JSONUtil.jsonToBean(content, ConsumingAbilityVM.class);

        Double phone2 = null;//手机2
        Double phone3 = null;//手机3
        Double phone4 = null;//手机4
        Double phone5 = null;//手机5
        Double phone6 = null;//手机6
        Double other = null;//其它手机

        Double price1_499 = null;//加个1到499元
        Double price500_999 = null;
        Double price1000_1999 = null;
        Double price2000_3999 = null;
        Double price4000 = null;


        //手机品牌
        List<Tag> phonebrandList = vm.getPhoneBrandList();
        for (Tag tag : phonebrandList) {
            String key = tag.getTag_name();
            switch (key) {
                case "测试手机2":
                    phone2 = Double.parseDouble(tag.getSta_value());
                    break;
                case "测试手机3":
                    phone3 = Double.parseDouble(tag.getSta_value());
                    break;
                case "测试手机4":
                    phone4 = Double.parseDouble(tag.getSta_value());
                    break;
                case "测试手机5":
                    phone5 = Double.parseDouble(tag.getSta_value());
                    break;
                case "测试手机6":
                    phone6 = Double.parseDouble(tag.getSta_value());
                    break;
                case "其它":
                    other = Double.parseDouble(tag.getSta_value());
                    break;
            }
        }


        //手机价格
        List<Tag> phonepriceList = vm.getPhonePriceList();
        for (Tag tag : phonepriceList) {
            String key = tag.getTag_name();
            switch (key) {
                case "1-499":
                    price1_499 = Double.parseDouble(tag.getSta_value());
                    break;
                case "500-999":
                    price500_999 = Double.parseDouble(tag.getSta_value());
                    break;
                case "1000-1999":
                    price1000_1999 = Double.parseDouble(tag.getSta_value());
                    break;
                case "2000-3999":
                    price2000_3999 = Double.parseDouble(tag.getSta_value());
                    break;
                case "4000及以上":
                    price4000 = Double.parseDouble(tag.getSta_value());
                    break;
            }
        }


        //手机品牌
        Assert.isTrue(phone2 == 15);
        Assert.isTrue(phone3 == 15);
        Assert.isTrue(phone4 == 15);
        Assert.isTrue(phone5 == 20);
        Assert.isTrue(phone6 == 25);
        Assert.isTrue(other == 10);

        //手机价格
        Assert.isTrue(price1_499 == 10);
        Assert.isTrue(price500_999 == 10);
        Assert.isTrue(price1000_1999 == 20);
        Assert.isTrue(price2000_3999 == 20);
        Assert.isTrue(price4000 == 40);

    }

    /**
     * 测试人群画像
     *
     * @throws Exception
     */
    @Test
    public void testPeopleList() throws Exception {
        String param = "startDate=2017-03-01&endDate=2017-03-30&projectId=" + projectId + "&crowdId=" + activeCrowdId + "&sexscalelimit=2&agedistributelimit=6";

        MvcResult response = mock.perform(get("/api/passenger/peopleAttributes?" + param)
                .session(mockSession)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        String content = response.getResponse().getContentAsString();
        PeopleAttributesVM attributesVM = (PeopleAttributesVM) JSONUtil.jsonToBean(content, PeopleAttributesVM.class);

        Double femaleRate = Double.parseDouble(attributesVM.getFemalePercent());//女性比例
        Double maleRete = Double.parseDouble(attributesVM.getMalePercent());  //男性比例

        Double age19 = Double.parseDouble(attributesVM.getAge19Percent());
        Double age25 = Double.parseDouble(attributesVM.getAge25Percent());
        Double age35 = Double.parseDouble(attributesVM.getAge35Percent());
        Double age45 = Double.parseDouble(attributesVM.getAge45Percent());
        Double age55 = Double.parseDouble(attributesVM.getAge55Percent());
        Double age65 = Double.parseDouble(attributesVM.getAgeAbove55Percent());

        Double married = Double.parseDouble(attributesVM.getMarriedPercent());
        Double haveChild = Double.parseDouble(attributesVM.getHaveChildrenPercent());
        Double haveCar = Double.parseDouble(attributesVM.getHaveCarPercent());

        //男女比例
        Assert.isTrue(maleRete == 44);
        Assert.isTrue(femaleRate == 56);

        //年龄分布
        Assert.isTrue(age19 == 25);
        Assert.isTrue(age25 == 15);
        Assert.isTrue(age35 == 15);
        Assert.isTrue(age45 == 15);
        Assert.isTrue(age55 == 15);
        Assert.isTrue(age65 == 15);

        //婚否，育儿，有车
        Assert.isTrue(married == 80);
        Assert.isTrue(haveChild == 80);
        Assert.isTrue(haveCar == 51);


    }

}
