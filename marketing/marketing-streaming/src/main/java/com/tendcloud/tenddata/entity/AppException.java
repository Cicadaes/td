package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;
import org.msgpack.annotation.Message;
import org.msgpack.annotation.Optional;

import java.io.IOException;

/**
 * @author sheng.hong
 */
@Message
public class AppException implements TDMessagePackable {
    /**
     * 异常发生事件
     */
    public long mErrorTime;

    /**
     * 异常发生次数
     */
    public int mRepeat;

    /**
     * 应用版本号
     */
    public String mAppVersionCode = "";

    /**
     * 异常栈信息
     */
    public byte[] data = new byte[] {};

    @Optional
    public String mShortHashCode = "";

    @Override
    public void messagePack(final TDPacker pk) throws IOException {
        pk.packArray(5);
        pk.pack(mErrorTime);
        pk.pack(mRepeat);
        pk.pack(mAppVersionCode);
        pk.pack(data);
        pk.pack(mShortHashCode);
    }

    @Override
    public String toString() {
        try {
            return new StringBuilder("AppException").append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
                    .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mErrorTime").append(Printag.STARTAG).append(mErrorTime)
                    .append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mRepeat")
                    .append(Printag.STARTAG).append(mRepeat).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE)
                    .append("mAppVersionCode").append(Printag.STARTAG).append(mAppVersionCode).append(Printag.ENDTAG).append(Printag.SPACE)
                    .append(Printag.SPACE).append(Printag.SPACE).append("data").append(Printag.STARTAG).append(new String(data, "utf-8"))
                    .append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("shortHashcode")
                    .append(Printag.STARTAG).append(mShortHashCode).append(Printag.ENDTAG).toString();
        } catch (Exception e) {
            // TODO: handle exception
        }
        return "";
    }
}
