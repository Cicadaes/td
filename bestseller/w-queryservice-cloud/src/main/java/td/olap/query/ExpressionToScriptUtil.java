package td.olap.query;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class ExpressionToScriptUtil {
	private static final Logger log = LoggerFactory.getLogger(ExpressionToScriptUtil.class);

	private static String domain = null; //Configuration.getInstance().getConfig("bitmap.domain.default");
	
	private static String cubePrefix = null ;//Configuration.getInstance().getConfig("bitmap.cube.prefix");
	/**
	 * ruleid 正则表达式匹配 ([0-9]+)
	 */
	private static final Pattern RULEEXPRESSION_PATTERN = Pattern.compile("(^[A-Z]{2}[0-9]{11}$)");
	private static final String Tag_PREFIX = "t";
	private static final String RULE_TQL = "%s%s=select * from " + domain + "." + cubePrefix + "%s where id=%s;\n";
	private static final Map<String, String> OPERA_MAP = new HashMap<String, String>();

	static {
		OPERA_MAP.put("+", "union");
		OPERA_MAP.put("-", "unite");
		OPERA_MAP.put("#", "rejectUnite");
	}

//	/**
//	 * 解析 Crowd对象及其包含的标签，将所有规则和表达式转换成一个groovy查询脚本
//	 * 
//	 * @param crowd
//	 * @return
//	 * @throws Exception
//	 */
//	public static Map<String, String> getScriptForCrowd(Crowd crowd, boolean isOffset) throws Exception {
//		log.info("getScript: crowd=" + crowd.getId() + ";crowdName=" + crowd.getName());
//		TagService tagService = (TagService) ApplicationContextManager.getBean("tagService");
//		Tag tag = tagService.selectByPrimaryKey(crowd.getTagId());
//		return getScript(tag,isOffset);
//	}
//	
//	public static Map<String, String> getScriptForTag(Tag tag, boolean isOffset) throws Exception {
//		log.info("getScript: tag=" + tag.getId() + ";tagName=" + tag.getName());
//		return getScript(tag,isOffset);
//	}
//
//	/**
//	 * 解析 Tag对象，将所有规则和表达式转换成一个groovy查询脚本
//	 * 
//	 * @param tag
//	 * @return
//	 * @throws Exception
//	 */
//	public static Map<String, String> getScript(Tag tag, boolean isOffset) throws Exception {
//		Map<String, String> results = new HashMap<String, String>();
//		try {
//			log.info("getScript: tag=" + tag.getId() + ";tagName=" + tag.getName());
//			StringBuffer sb = new StringBuffer();
//			sb.append(String.format(RULE_TQL, Tag_PREFIX, tag.getId(), "custom_tag", tag.getId()));
//			if (isOffset) {
//				sb.append(Tag_PREFIX + tag.getId()).append(".results[0].value.toArray();");
//			}
//			results.put("lastParamName", Tag_PREFIX + tag.getId());
//			results.put("script", sb.toString());
//			
//			DicItemService dicItemService = (DicItemService) ApplicationContextManager.getBean("dicItemService");
//			String touchPointType = tag.getTouchPointType();
//			DicItem dicItem = dicItemService.getCorpRootDicItem("TOUCH_POINT_TYPE", touchPointType);
//			Integer dicItemId = dicItem.getId();
//			results.put("touchPointType", dicItemId.toString());
//			log.info("lastParamName:{} script:{}", Tag_PREFIX + tag.getId(), sb.toString());
//		} catch (Exception e) {
//			e.printStackTrace();
//			log.error("getScript error.", e);
//			throw new Exception("getScript error. tag=" + tag.getId() + ";tagName=" + tag.getName(), e);
//		}
//		return results;
//	}
	
	public static String getStriptWithBitmapTable(String bitmapTable, int id, boolean isOffset) throws Exception{
		log.info("================getScript: id=" + id + ";");
		StringBuffer sb = new StringBuffer();
		sb.append(String.format(RULE_TQL, Tag_PREFIX, id, bitmapTable, id));
		if (isOffset) {
			sb.append(Tag_PREFIX + id).append(".results[0].value.toArray();");
		}
		log.info("lastParamName:{} script:{}", Tag_PREFIX + id, sb.toString());
		return sb.toString();
	}
	
	public static String getStriptWithLaunchCrowd(String bitmapTable, int id, boolean isOffset) throws Exception{
		log.info("================getScript: id=" + id + ";");
		StringBuffer sb = new StringBuffer();
		sb.append(String.format(RULE_TQL, Tag_PREFIX, id, bitmapTable, id));
		if (isOffset) {
			sb.append(Tag_PREFIX + id).append(".results[0].value.toArray();");
		}else{
			sb.append(Tag_PREFIX + id).append(".results[0].value;");
		}
		log.info("lastParamName:{} script:{}", Tag_PREFIX + id, sb.toString());
		return sb.toString();
	}

	/**
	 * 解析表达式，提取用到的规则或标签，以避免规则和标签的重复计算
	 * 
	 * @param exp
	 * @return
	 */
	private static void extractRulesOrTags(String exp, List<String> list) {
		Matcher ruleM = RULEEXPRESSION_PATTERN.matcher(exp);
		String expression = null;
		while (ruleM.find()) {
			expression = ruleM.group(1);
			if (!list.contains(expression)) {
				list.add(expression);
			}
		}
	}

//	/**
//	 * 
//	 * 根据标签表达式 查询客群
//	 * 
//	 * @param expression
//	 * @param isOffset
//	 * @param idType
//	 * @return
//	 * @throws Exception
//	 */
//	public static Map<String, String> getScriptByExpression(String expression, boolean isOffset)
//			throws Exception {
//		log.info("getScriptByExpression: expression=" + expression);
//		Crowd crowd = new Crowd();
//		crowd.setId(-1);
//		crowd.setCode(expression);
//		return getScriptForCrowd(crowd, isOffset);
//	}
	
	public static void main(String[] args) {
		List<String> rules = new ArrayList<String>();
		extractRulesOrTags("TB20150831007", rules);
	}
}
