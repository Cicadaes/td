package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;
import org.msgpack.annotation.Message;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author hongsheng
 * @create 2017-09-21-下午4:04
 * @since JDK 1.8
 */
@Message
public class UserProfile implements TDMessagePackable {

    /**账户ID*/
    public String accountId = "";
    /**租户*/
    public String tenantId = "";
    /**手机号*/
    public String mobileId = "";

    /**营其他自定义字段*/
    public Map<String, Object> profileMap = new HashMap<>(16);

    @Override
    public void messagePack(final TDPacker pk) throws IOException {
        pk.packArray(4);
        pk.pack(accountId);
        pk.pack(tenantId);
        pk.pack(mobileId);
        pk.pack(profileMap);
    }

    @Override
    public String toString() {
        return new StringBuilder("UserProfile").append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
            .append(Printag.SPACE).append(Printag.SPACE).append("accountId").append(Printag.STARTAG).append(accountId).append(Printag.ENDTAG)
            .append(Printag.SPACE).append(Printag.SPACE).append("tenantId").append(Printag.STARTAG).append(tenantId).append(Printag.ENDTAG)
            .append(Printag.SPACE).append(Printag.SPACE).append("mobileId").append(Printag.STARTAG).append(mobileId).append(Printag.ENDTAG)
            .append(Printag.SPACE).append(Printag.SPACE).append("profileMap").append(Printag.STARTAG).append(profileMap).append(Printag.ENDTAG)
            .toString();
    }
}
