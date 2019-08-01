package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;
import org.msgpack.annotation.Message;

import java.io.IOException;

/**
 * @author Bison
 * @since 2011-9-19
 */
@Message
public class Activity implements TDMessagePackable {

    /**
     * Activity的名字
     */
    public String name = "";

    /**
     * 启动时间
     */
    public long start;

    /**
     * 持续时间
     */
    public int duration;

    /**
     * 调用者页面
     */
    public String refer = "";

    @Override
    public void messagePack(final TDPacker pk) throws IOException {
        pk.packArray(4);
        pk.pack(name);
        pk.pack(start);
        pk.pack(duration);
        pk.pack(refer);
    }

    @Override
    public String toString() {
        return new StringBuilder("Activity").append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("name").append(Printag.STARTAG).append(name).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("start").append(Printag.STARTAG).append(start).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("duration").append(Printag.STARTAG).append(duration).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("refer").append(Printag.STARTAG).append(refer).append(Printag.ENDTAG).toString();
    }
}
