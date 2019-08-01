package com.talkingdata.analytics.wifi.collector.util;

import javax.servlet.http.HttpServletRequest;
import java.net.*;
import java.util.*;

/**
 * Datetime   ：2012-8-24 上午11:59:43<br>
 * Title      : GetIPv4.java<br>
 * Description: IP工具类<br>
 * Company    : Tend<br>
 * @author  <a href="mailto:jinhu.fan@tendcloud.com">fjh</a>
 */
public class IPUtil {

	/**
	 * 获取本机可用的除回环地址之外的可用IPv4地址
	 * @return 返回java获取的可用的除回环网卡中的第一个，至于到底是哪个，得看运气了···
	 * @throws SocketException
	 */
	public static String getIPv4ExcludeLo() throws SocketException {
		String ip = "";
		
		Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces();
		for (NetworkInterface ni : Collections.list(en)) {
			
			if (!ni.isUp() || ni.isLoopback()) {
            	continue;
            }
            
            List<InterfaceAddress> list = ni.getInterfaceAddresses();
    		for (InterfaceAddress ia : list) {
    			InetAddress addr = ia.getAddress();
    			if (addr instanceof Inet4Address) {
    				ip = addr.getHostAddress();
    				return ip;
    			}
    		}
		}
		
        return ip;
	}

	public static String getClientIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        return ip;
	}
	
	public static void main(String[] args) throws Exception {
		System.out.println(getIPv4ExcludeLo());
		System.out.println(getRandomIp());

		/*
		Enumeration<NetworkInterface> en = NetworkInterface
				.getNetworkInterfaces();
		while (en.hasMoreElements()) {
			NetworkInterface ni = en.nextElement();
			printParameter(ni);
		}*/
	}

	@SuppressWarnings("unused")
	private static void printParameter(NetworkInterface ni)
			throws SocketException {
		System.out.println(" Name = " + ni.getName());
		System.out.println(" Display Name = " + ni.getDisplayName());
		System.out.println(" Is up = " + ni.isUp());
		System.out.println(" Support multicast = " + ni.supportsMulticast());
		System.out.println(" Is loopback = " + ni.isLoopback());
		System.out.println(" Is virtual = " + ni.isVirtual());
		System.out.println(" Is point to point = " + ni.isPointToPoint());
		System.out.println(" Hardware address = " + Arrays.toString(ni.getHardwareAddress()));
		System.out.println(" MTU = " + ni.getMTU());

		System.out.println("\nList of Interface Addresses:");
		List<InterfaceAddress> list = ni.getInterfaceAddresses();

		for (InterfaceAddress ia : list) {
			System.out.println(" Address = " + ia.getAddress());
			System.out.println(" Broadcast = " + ia.getBroadcast());
			System.out.println(" Network prefix length = "
					+ ia.getNetworkPrefixLength());
			System.out.println("");
		}
		System.out.println("====");
	}
	
	
	
	/*
     * 随机生成国内IP地址
     */
    public static String getRandomIp(){
        //ip范围
        int[][] range = {{607649792,608174079},//36.56.0.0-36.63.255.255
                         {1038614528,1039007743},//61.232.0.0-61.237.255.255
                         {1783627776,1784676351},//106.80.0.0-106.95.255.255
                         {2035023872,2035154943},//121.76.0.0-121.77.255.255
                         {2078801920,2079064063},//123.232.0.0-123.235.255.255
                         {-1950089216,-1948778497},//139.196.0.0-139.215.255.255
                         {-1425539072,-1425014785},//171.8.0.0-171.15.255.255
                         {-1236271104,-1235419137},//182.80.0.0-182.92.255.255
                         {-770113536,-768606209},//210.25.0.0-210.47.255.255
                         {-569376768,-564133889}, //222.16.0.0-222.95.255.255
        };
        Random rdint = new Random();
        int index = rdint.nextInt(10);
        String ip = num2ip(range[index][0]+new Random().nextInt(range[index][1]-range[index][0]));
        return ip;
    }
 
    /*
     * 将十进制转换成ip地址
     */
    public static String num2ip(int ip) {
        int [] b=new int[4] ;
        String x = "";
        b[0] = (int)((ip >> 24) & 0xff);
        b[1] = (int)((ip >> 16) & 0xff);
        b[2] = (int)((ip >> 8) & 0xff);
        b[3] = (int)(ip & 0xff);
        x=Integer.toString(b[0])+"."+Integer.toString(b[1])+"."+Integer.toString(b[2])+"."+Integer.toString(b[3]); 
        return x; 
    }
    
}
