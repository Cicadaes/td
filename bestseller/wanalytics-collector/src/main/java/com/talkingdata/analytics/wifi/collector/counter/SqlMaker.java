package com.talkingdata.analytics.wifi.collector.counter;

public class SqlMaker{
	
	private String tablename = null;
	
	private String[] selectkey = null;

	private String[] wherekey = null;
	private String[] wherevalue = null;
	
	private int count = 0;
//===========================================get and set==========================
	public String getTablename() {
		return tablename;
	}
	public void setTablename(String tablename) {
		this.tablename = tablename;
	}
	public String[] getSelectkey() {
		return selectkey;
	}
	public void setSelectkey(String[] selectkey) {
		this.selectkey = selectkey;
	}
	public String[] getWherekey() {
		return wherekey;
	}
	public void setWherekey(String ... where) {
		this.wherekey= where;
	}
	public String[] getWherevalue() {
		return wherevalue;
	}
	public void setWherevalue(String ... wherevalue) {
		this.wherevalue = wherevalue;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	
//===============================[Select]==================================================
	public String getSelectsql() {
		StringBuffer sb = new StringBuffer();
		//===============select===================
		sb.append("select ");
		//============selectkey===================
		if (selectkey==null || selectkey.length==0) {
			sb.append("metric_value");
		}else{
			for (int i = 0; i < selectkey.length; i++) {
				sb.append("\'");
				sb.append(selectkey[i]);
				sb.append("\'");
				if (i!=selectkey.length-1) {
					sb.append(",");
				}
			}
		}
		//============tablename===================
		sb.append(" from ");
		sb.append(tablename);
		//============ where xx=xx and yy=yy ...========================
		if ( wherekey!=null && wherevalue!=null && wherekey.length==wherevalue.length && wherekey.length>0) {
			sb.append(" where ");
			for (int i = 0; i < wherekey.length; i++) {
				sb.append(wherekey[i]);
				sb.append("=");
				sb.append("\'"+ wherevalue[i]+"\'");
				if (i!=wherekey.length-1) {
					sb.append(" and ");
				}
			}
		}
		return sb.toString();
	}
//===============================[insert]==================================================	
	public String getinsertsql(){
		StringBuffer sb = new StringBuffer();
		//===============insert===================
				sb.append("insert into ");
				//============tablename===================
				sb.append(tablename);
				//============col name===================
				if (wherekey!=null && wherekey.length!=0) {
					sb.append(" (");
					for (int i = 0; i < wherekey.length; i++) {
						sb.append(wherekey[i]);
						sb.append(",");
					}
					sb.append("metric_value");
					sb.append(")");
				}else{
					return null;
				}
				//=======values======
				sb.append(" values ");
				sb.append("(");
				for (int i = 0; i < wherevalue.length; i++) {
					sb.append("\'");
					sb.append(wherevalue[i]);
					sb.append("\'");
					sb.append(",");
				}
				sb.append("\'"+count+"\'");
				sb.append(")");
		return sb.toString();
	}
	
//===============================[update]==================================================		
	
	public String getupdesql(){
		StringBuffer sb = new StringBuffer();
		//===============update===================
		sb.append("update ");
		//============tablename===================
		sb.append(tablename);
		//============set ===================
		sb.append(" set metric_value=metric_value+");
		sb.append(count);
		//============ where xx=xx and yy=yy ...========================
		if ( wherekey!=null && wherevalue!=null && wherekey.length==wherevalue.length && wherekey.length>0) {
			sb.append(" where ");
			for (int i = 0; i < wherekey.length; i++) {
				sb.append(wherekey[i]);
				sb.append("=");
				sb.append("\'"+ wherevalue[i]+"\'");
				if (i!=wherekey.length-1) {
					sb.append(" and ");
				}
			}
		}
		return sb.toString();
	}
//===============================[ON DUPLICATE KEY UPDATE]==================================================	
	public String getwnsql(){
		StringBuffer sb = new StringBuffer();
		sb.append("insert into ");
		sb.append(tablename);
		sb.append(" (");
		if ( wherekey!=null && wherevalue!=null && wherekey.length==wherevalue.length && wherekey.length>0) {
			for (int i = 0; i < wherekey.length; i++) {
				sb.append(wherekey[i]);
				sb.append(",");
			}
			sb.append("metric_value)");
			sb.append(" values (");
			for (int i = 0; i < wherevalue.length; i++) {
				sb.append("\'"+wherevalue[i]+"\'");
				sb.append(",");
			}
			sb.append("\'"+count+"\')");
		}
		sb.append(" ON DUPLICATE KEY UPDATE ");
		sb.append("metric_value=metric_value+"+count);
		
		return sb.toString();
	}
	
	
	
	
//=====================================================[TEST]===========	
	public static void main(String[] args) {
		SqlMaker sqlMaker = new SqlMaker();
		
		sqlMaker.setTablename("lol");
		sqlMaker.setWherekey(new String[]{"name","id"});
		sqlMaker.setWherevalue(new String[]{"zhangsan","20"});
		sqlMaker.setCount(20);
		
		System.out.println( sqlMaker.wherekey.length == sqlMaker.wherevalue.length);
		System.out.println(sqlMaker.getinsertsql());
		System.out.println(sqlMaker.getSelectsql());
		System.out.println(sqlMaker.getupdesql());
		System.out.println(sqlMaker.getwnsql());
	}
	
//================================[getsql]=======================================================
}
