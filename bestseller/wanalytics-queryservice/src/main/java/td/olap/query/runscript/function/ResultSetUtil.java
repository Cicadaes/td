package td.olap.query.runscript.function;

import java.util.ArrayList;
import java.util.List;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.runscript.config.ConstString;

/**
 * 针对结果集封装如下的方法
 * @author chenxiaolong
 *
 */
public class ResultSetUtil {
	
	/**
	 * 从结果集的每一个元素中抽取一个key进行返回
	 * @param resultSet
	 * @param index
	 * @param column
	 * @return
	 */
	public List<ResultBean> extractKey(QueryEngineResult qeResult,int index,String column){
		List<ResultBean> new_resultSet = new ArrayList<ResultBean>();
		List<List<String>> key_list = qeResult.getKey_list();
		List<String> key = key_list.get(index-1);
		int key_num = -1;
		if(column != null && !"".equals(column)){
			for(int i = 0;i<key.size();i++){
				if(column.equals(key.get(i))){
					key_num = i;
				}
			}
			if(key_num != -1){
				List<ResultBean> resultSet = qeResult.getResults();
				for(int i=0;i<resultSet.size();i++){
					ResultBean rb = resultSet.get(i);
					String new_key = formatKey(rb.getKey(),index-1,key_num);
					if(!"".equals(new_key)){
						ResultBean rb_ = new ResultBean();
						rb_.setKey(new_key);
						rb_.setValue(rb.getValue());
						new_resultSet.add(rb_);
					}else{
						new_resultSet.add(rb);
					}
				}
			}else{
				new_resultSet = qeResult.getResults();
			}
		}else{
			new_resultSet = qeResult.getResults();
		}
		
		return new_resultSet;
	}
	
	public String formatKey(String key,int index,int key_num){
		String result = "";
		try{
			if(key.indexOf(ConstString.CALCULATE_KEY_SEPARATOR) > 0){
				String[] key_str = key.split(ConstString.CALCULATE_KEY_SEPARATOR);
				if(key_str[index].indexOf(ConstString.KEY_SEPARATOR) > 0){
					String[] key_arr = key_str[index].split(ConstString.KEY_SEPARATOR);
					result = key_arr[key_num];
				}else{
					result = key_str[index];
				}
			}else{
				String[] key_arr = key.split(ConstString.KEY_SEPARATOR);
				result = key_arr[key_num];
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}

		return result;
	}
	
	public static void main(String[] args) {
		QueryEngineResult qer = new QueryEngineResult();
		ResultSetUtil rsu = new ResultSetUtil();
		List<List<String>> key_list = new ArrayList<List<String>>();
		List<String> key1 = new ArrayList<String>();
		List<String> key2 = new ArrayList<String>();
		key1.add("productid");
		key1.add("platformid");
		key2.add("time_day");
		key_list.add(key1);
		key_list.add(key2);
		qer.setKey_list(key_list);
		ResultBean rb = new ResultBean();
		rb.setKey("10169,1");
		rb.setValue("610.0");
		List<ResultBean> rb_list = new ArrayList<ResultBean>();
		rb_list.add(rb);
		qer.setResults(rb_list);
		System.out.println(rsu.extractKey(qer,1,"platformid"));
		
	}
}
