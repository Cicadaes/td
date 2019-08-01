package com.tendcloud.tenddata.entity;

import java.io.IOException;

import org.msgpack.MessagePack;
import org.msgpack.MessagePackable;
import org.msgpack.MessageTypeException;
import org.msgpack.annotation.Message;
import org.msgpack.packer.Packer;
import org.msgpack.unpacker.Unpacker;

import com.tendcloud.tenddata.msgpack.TDPacker;

/**
 * @author Bison
 * @since 2011-9-19
 */
@Message
public class TMessage extends MessagePack implements TDMessagePackable, MessagePackable {

    /**
     * 事件类型
     * <p/>
     * 1.init事件：在App第一次启动（也就是我们的api被某个app第一次调用）的时候触发，devId也是在此时产生；
     * 事件数据应该包含设备的基本信息device profile和应用的基本信息app profile。
     * <p/>
     * 2.session事件，包含AppEvent和Activity相关的信息
     * 3.app_exception事件：用于上传应用的异常退出信息，异常信息可以通过data字段传输。
     * <p/>
     * 4.feedback事件：用于收集用户反馈，反馈信息可以通过data字段传输。
     * <p/>
     * 5.other事件：通用的事件，其事件的详细信息通过data字段来传输。
     */
    public int mMsgType = -1;
    /**
     * Session
     */
    public Session session;

    public InitProfile mInitProfile;

    public AppException mAppException;

    @Override
    public void messagePack(final TDPacker pk) throws IOException {
        pk.packArray(2);
        pk.pack(mMsgType);
        switch (mMsgType) {
            case 1:
                pk.pack(mInitProfile);
                break;
            case 2:
                pk.pack(session);
                break;
            case 3:
                pk.pack(mAppException);
                break;
            default:
                throw new IOException("unknown TMessageType");
        }
    }

    @Override
    public void writeTo(Packer pk) throws IOException {
    }

    @Override
    public void readFrom(Unpacker pac) throws IOException {
        int length = pac.readArrayBegin();
        if (length != 2) {
            throw new MessageTypeException();
        }
        mMsgType = pac.readInt();
        switch (mMsgType) {
            case 1:
                if (pac.trySkipNil()) {
                    mInitProfile = null;
                } else {
                    mInitProfile = pac.read(InitProfile.class);
                }
                break;
            case 2:
                if (pac.trySkipNil()) {
                    session = null;
                } else {
                    session = pac.read(Session.class);
                }
                break;
            case 3:
                if (pac.trySkipNil()) {
                    mAppException = null;
                } else {
                    mAppException = pac.read(AppException.class);
                }
                break;
            default:
                throw new MessageTypeException("unknown TMessageType");
        }
        pac.readArrayEnd();
    }

    @Override
    public String toString() {
        StringBuilder build = new StringBuilder("TMessage").append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append("mMsgType").append(Printag.STARTAG).append(mMsgType).append(Printag.ENDTAG);

        switch (mMsgType) {
            case 1:
                build.append(Printag.SPACE).append(Printag.SPACE).append(mInitProfile);
                break;
            case 2:
                build.append(Printag.SPACE).append(Printag.SPACE).append(session);
                break;
            case 3:
                build.append(Printag.SPACE).append(Printag.SPACE).append(mAppException);
                break;
            default:
                break;
        }
        return build.toString();
    }
}
