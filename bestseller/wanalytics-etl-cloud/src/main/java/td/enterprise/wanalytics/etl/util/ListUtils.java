package td.enterprise.wanalytics.etl.util;

import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * 分割List
 */
@Slf4j
public class ListUtils {
    
    
    /**
     * @param list 待分割的list
     * @param pageSize 每段list的大小
     * @return List<<List<T>> 
     */
     public static <T> List<List<T>> splitList(List<T> list, int pageSize) {
        
        int listSize = list.size();                                         //list的大小
        int page = (listSize + (pageSize-1))/ pageSize;                     //页数
        
        List<List<T>> listArray = new ArrayList<List<T>>();                 //创建list数组 ,用来保存分割后的list
        for(int i=0;i<page;i++) {                                           //按照数组大小遍历
            List<T> subList = new ArrayList<T>();                           //数组每一位放入一个分割后的list
            for(int j=0;j<listSize;j++) {                                   //遍历待分割的list
                int pageIndex = ( (j + 1) + (pageSize-1) ) / pageSize;      //当前记录的页码(第几页)
                if(pageIndex == (i + 1)) {                                  //当前记录的页码等于要放入的页码时
                    subList.add(list.get(j));                               //放入list中的元素到分割后的list(subList)
                }
            }
            listArray.add(subList);                                        //将分割后的list放入对应的数组的位中
        }
        return listArray;
    }
     
    public static String getIds (List<Integer>  list){
 		if(null == list || list.isEmpty()){
 			return "";
 		}
 		StringBuffer buffer = new StringBuffer();
 		for(Integer r : list){
 			buffer.append(r).append(",");
 		}
 		buffer.deleteCharAt(buffer.length()-1);
 		return buffer.toString();
 	}


    public static String getConcatIds (List<String>  list){
        if(null == list || list.isEmpty()){
            return "";
        }
        StringBuffer buffer = new StringBuffer();
        for(String r : list){
            buffer.append(r).append(",");
        }
        buffer.deleteCharAt(buffer.length()-1);
        return buffer.toString();
    }

    /**
     * 根据日志文件固定文件命名格式，排序
     * @param list
     * @return
     */
    public static Map<String,List<String>> getListToMap(List<String>  list){
        Map<String,List<String>> treeMap = new TreeMap<>();
        if(null == list || list.isEmpty()){
            return treeMap;
        }
        for (String str : list){
            String key = str.substring(str.length()-15,str.length()-2);
            if (!treeMap.containsKey(key)) {
                List<String> mapList = new ArrayList<>();
                mapList.add(str);
                treeMap.put(key,mapList);
            }else {
                treeMap.get(key).add(str);
            }
        }
        return treeMap;
    }
    public static Map<String,String> getMacListToMap(List<String>  list) {
        Map<String,String> hashMap = new HashMap<>();
        if(null == list || list.isEmpty()){
            return hashMap;
        }
        String str = "";
        String key = "";
        for (int i = 0; i <list.size() ; i++) {
             str = list.get(i);
            if (null != str && str.contains("(hex)")){
                key = str.replace("(hex)",",");
                String[] macKey = key.split(",");
                hashMap.put(macKey[0].trim()+"_"+macKey[1].trim(),null);
            }

        }
        return hashMap;
    }

    public static void main(String[] s) {
        List<String> list = new ArrayList<>();
        int size = 1000;
        for(int i=0;i < size; i ++){
            list.add( (i + 1) + "");
        }

        int pageSize = 800;

        List<List<String>> smallList =  splitList(list,pageSize);

        System.out.println(smallList.size());

        for(List<String> tempList : smallList){
            System.out.println(tempList.size());
        }
    }
}