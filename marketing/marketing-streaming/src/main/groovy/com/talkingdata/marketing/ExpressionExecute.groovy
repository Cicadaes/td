package com.talkingdata.marketing

import org.apache.commons.lang.StringUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import java.util.concurrent.ConcurrentHashMap

/**
 * Pipeline中算子的表达式执行类，接受传入的表达式与数据，返回特定结果。
 *
 * @create 2017-09-26-下午4:09
 * @since JDK 1.8
 * @author hongsheng
 */
class ExpressionExecute {

    static final Logger logger = LoggerFactory.getLogger(ExpressionExecute.class)
    /**
     * 生成groovy方法名
     */
    static final String METHOD_NAME = "executeExpre"
    static Map<String, Script> cacheScript = new ConcurrentHashMap<String, Script>()

    /**
     * 执行特定表达式，返回布尔值。
     * 表达式--包含待替换的占位字符串、分隔符(空格+冒号+空格)、操作符(暂时比较操作符和逻辑操作符)及比较值。
     * 如："RT111 : < : 123 : && : RT112 : < : 3 : && : RT113 : > : 22"，RT111为占位字符串。
     * 数据--为MAP类型，key务必于表达式中的占位字符串相等，value为key对应值。
     *
     * @param expression 表达式
     * @param data 数据 key: 参数key, value: 值类型需要与表达式中值类型一致
     * @return true表示满足 , false表示不满足
     */
    static boolean executeForBooleanResult(String expression, Map<String, Object> data) {
        Script script = cacheScript[expression]
        if (script == null) {
            script = parseScript(expression, data)
            cacheScript.put(expression, script)
        }
        Object[] values = data.values().toArray()
        logger.info("groovy execute expression: {}, values: {}", expression, StringUtils.join(values, ", "))
        try {
            script.invokeMethod(METHOD_NAME, values)
        } catch (Exception e) {
            logger.error("groovy execute expression has exception: ", e)
            false
        }
    }

    private static Script parseScript(String expression, Map<String, Object> data) {
        expression = expression.replaceAll(":", "")
        List<String> keys = new ArrayList<String>()
        for (key in data.keySet()) {
            keys.add("Object " + key)
            expression = expression.replaceAll("'" + key + "'", key)
            expression = expression.replaceAll("\"" + key + "\"", key)
        }
        String params = StringUtils.join(keys, ", ")
        String method = String.format("" +
                "  def %s(%s) { \n" +
                "        if (%s) { \n" +
                "            true \n" +
                "        } else { \n" +
                "            false \n" +
                "        } \n" +
                "  }", METHOD_NAME, params, expression)
        GroovyShell shell = new GroovyShell()
        shell.parse(method)
    }

    static main(args) {
        def expression = "RT111 : < : 123 : && : RT112 : < : 3 : && : RT113 : > : 22"
//        def data = ['RT111': 142, 'RT112': 112, 'RT113': 113]
        def data = ['RT111': new Long(142), 'RT112': new Long(112), 'RT113': new Long(113)]
//        println executeForBooleanResult(expression, data)

        def expression1 = "time : >= : '2017-10-10 11:03:00' : && : ( : 'app' : == : 'app1' : && : \"event\" : == : 'event1' : )"
        def data1 = ['time': '2017-10-10 11:03:00', 'app': 'app1', 'event': 'event1']
        println executeForBooleanResult(expression1, data1)

//        println Eval.me("'2017-10-10 11:03:00'  >=  '2017-10-10 11:03:00'  &&  (  'app1' ==  'app1'  &&  'event1'  ==  'event1'  )")

        long start = System.currentTimeMillis()
        for (int i = 0; i < 10000; i++) {
            println executeForBooleanResult(expression, data)
            println executeForBooleanResult(expression1, data1)
//            Thread.sleep(1000)
        }
        long end = System.currentTimeMillis()
        println((end - start) / 1000)
        // 80.441 秒

    }
}
