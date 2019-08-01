package com.talkingdata.analytics.wifi.collector.test;

import com.google.code.fqueue.FQueue;

import java.io.*;

/**
 * Created by loong on 4/15/16.
 */
public class FQueueTest {

    public static void main(String[] args) throws Exception {
        FQueue fQueue = new FQueue("/Users/loong/Downloads",1024 * 1024 * 300);
        for (int i = 0; i <100; i++) {
            write(fQueue,i);
        }
        while (fQueue.size() > 0){
            read(fQueue);
        }
    }

    private static void read(FQueue fQueue) throws IOException {
        System.out.println("fqueue size : " + fQueue.size());
        byte[] data = fQueue.poll();

        ByteArrayInputStream bi = null;
        ObjectInputStream in = null;

        try {
            if (data != null && data.length != 0) {
                bi = new ByteArrayInputStream(data);
                in = new ObjectInputStream(bi);
                System.out.println("read fqueue : " + in.readObject());
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            bi.close();
            in.close();
        }

    }

    private static void write(FQueue fQueue,int i) throws IOException {
        ByteArrayOutputStream bo = null;
        ObjectOutputStream out = null;
        try {
            bo = new ByteArrayOutputStream();
            out = new ObjectOutputStream(bo);
            out.writeObject("test" + i);
            fQueue.offer(bo.toByteArray());
            System.out.println("write fquque : " + "test" + i);
            if (i % 2 == 0){
                read(fQueue);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            bo.close();
            out.close();
        }
    }
}
