package com.talkingdata.marketing.core.util.mail;

import org.apache.log4j.Logger;

import javax.mail.Flags;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * The type Analyse mime message.
 *
 * @description: 解析接收邮件信息
 * @author: anjie.li 2015-09-17
 * @version: 1.0
 * @modify:
 * @Copyright: 公司版权所有
 */
public class AnalyseMimeMessage {
    /**
     * 日志
     */
    private static final Logger logger = Logger.getLogger(AnalyseMimeMessage.class);

    /**
     * 邮件信息对象
     */
    private MimeMessage mimeMessage = null;

    /**
     * 邮件正文
     */
    private StringBuffer bodytext = new StringBuffer();

    /**
     * 构造函数
     */
    public AnalyseMimeMessage() {

    }

    /**
     * 构造函数,初始化一个MimeMessage对象
     *
     * @param mimeMessage the mime message
     */
    public AnalyseMimeMessage(MimeMessage mimeMessage) {
        this.mimeMessage = mimeMessage;
    }

    /**
     * 初始化一个MimeMessage对象
     *
     * @param mimeMessage the mime message
     */
    public void setMimeMessage(MimeMessage mimeMessage) {
        this.mimeMessage = mimeMessage;
    }

    /**
     * 获得发件人的地址和姓名
     *
     * @return the from
     * @throws Exception the exception
     */
    public String getFrom() throws Exception {
        InternetAddress[] address = (InternetAddress[]) mimeMessage.getFrom();
        String from = address[0].getAddress();
        if (from == null) {
            from = "";
        }
        return from;
    }

    /**
     * 获得邮件主题
     *
     * @return the subject
     * @throws MessagingException the messaging exception
     */
    public String getSubject() throws MessagingException {
        String subject = "";
        try {
            subject = MimeUtility.decodeText(mimeMessage.getSubject());
            if (subject == null) {
                subject = "";
            }
        } catch (Exception exce) {
        }
        return subject;
    }

    /**
     * 获得邮件发送日期
     *
     * @return the sent date
     * @throws Exception the exception
     */
    public String getSentDate() throws Exception {
        Date sentdate = mimeMessage.getSentDate();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(sentdate);
    }

    /**
     * 获得邮件正文内容
     *
     * @return the body text
     * @throws Exception the exception
     */
    public String getBodyText() throws Exception {
        getMailContent(mimeMessage);
        return bodytext.toString();
    }

    /**
     * 解析邮件，把得到的邮件内容保存到一个StringBuffer对象中，解析邮件 主要是根据MimeType类型的不同执行不同的操作，一步一步的解析
     *
     * @param part the part
     * @throws Exception the exception
     */
    public void getMailContent(Part part) throws Exception {
        final String mimeTypeTextPlain = "text/plain";
        final String mimeTypeTextHTML = "text/html";
        final String mimeTypeTextMultipart = "multipart/*";
        final String mimeTypeTextMessageRFC822 = "message/rfc822";
        String contenttype = part.getContentType();
        int nameindex = contenttype.indexOf("name");
        boolean conname = false;
        if (nameindex != -1) {
            conname = true;
        }
        if (part.isMimeType(mimeTypeTextPlain) && !conname) {
            // 获得回复正文内容
            bodytext.append((String) part.getContent());
        }
        //		else if (part.isMimeType(mimeTypeTextHTML) && !conname) {
        //			// 获得html内容
        //			// bodytext.append((String)part.getContent());
        //		}
        else if (part.isMimeType(mimeTypeTextMultipart)) {
            Multipart multipart = (Multipart) part.getContent();
            int counts = multipart.getCount();
            for (int i = 0; i < counts; i++) {
                getMailContent(multipart.getBodyPart(i));
            }
        } else if (part.isMimeType(mimeTypeTextMessageRFC822)) {
            getMailContent((Part) part.getContent());
        }
    }

    /**
     * 获得此邮件的Message-ID
     *
     * @return the message id
     * @throws MessagingException the messaging exception
     */
    public String getMessageId() throws MessagingException {
        return mimeMessage.getMessageID();
    }

    /**
     * 【判断此邮件是否已读，如果未读返回返回false,反之返回true】
     *
     * @return the boolean
     * @throws MessagingException the messaging exception
     */
    public boolean isNew() throws MessagingException {
        boolean isnew = false;
        Flags flags = ((Message) mimeMessage).getFlags();
        Flags.Flag[] flag = flags.getSystemFlags();
        logger.debug(flag.length);
        for (int i = 0; i < flag.length; i++) {
            if (flag[i] == Flags.Flag.SEEN) {
                isnew = true;
                break;
            }
        }
        return isnew;
    }

    //	/**
    //	 * PraseMimeMessage类测试
    //	 *
    //	 * @param args the input arguments
    //	 * @throws Exception the exception
    //	 */
    //	public static void main(String[] args) throws Exception {
    //		// 构造mail session
    //		Properties props = new Properties();
    //		// 服务器地址
    //		props.put("mail.pop3.host", "pop.qq.com");
    //		// 设置邮件服务器端口 默认端口25
    //		props.put("mail.pop3.port", 110);
    //		// 是否需要验证
    //		props.put("mail.pop3.auth", "true");
    //		// 邮件服务器交互的调试信息
    //		// props.put("mail.debug", "true");
    //		// 创建session设置验证用户名密码
    //		String username = "272676981@qq.com"; // 【wwp_1124】
    //		String password = "jixiangyu071989"; // 【........】
    //		Session session = Session.getDefaultInstance(props,
    //				new MyAuthenticator(username, password));
    //		Store store = session.getStore("pop3");
    //		store.connect();
    //		Folder folder = store.getFolder("INBOX");
    //		folder.open(Folder.READ_ONLY);
    //		Message[] message = folder.getMessages();
    //		System.out.println("Messages's length: " + message.length);
    //		AnalyseMimeMessage pmm = null;
    //		for (int i = 0; i < message.length; i++) {
    //			pmm = new AnalyseMimeMessage((MimeMessage) message[i]);
    //			System.out
    //					.println("Message " + i + " subject: " + pmm.getSubject());
    //			System.out.println("Message " + i + " sentdate: "
    //					+ pmm.getSentDate());
    //			System.out.println("Message " + i + " hasRead: " + pmm.isNew());
    //			System.out.println("Message " + i + " form: " + pmm.getFrom());
    //
    //			System.out.println("Message " + i + " sentdate: "
    //					+ pmm.getSentDate());
    //			System.out.println("Message " + i + " Message-ID: "
    //					+ pmm.getMessageId());
    //			System.out.println("Message " + i + " bodycontent: \r\n"
    //					+ pmm.getBodyText());
    //		}
    //	}
}