package com.talkingdata.marketing.core.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.talkingdata.marketing.core.constant.IdTypeConstants;
import com.talkingdata.marketing.core.page.dto.CrowdMsgDto;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.lang.StringUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * The type Crowd csv util.
 * @author hongsheng
 */
public class CrowdCsvUtil {
	/**
	 * Parse text crowd msg dto.
	 *
	 * @param content the content
	 * @return the crowd msg dto
	 * @throws IOException the io exception
	 */
	public static CrowdMsgDto parseText(String content) throws IOException {
        CSVParser parser = CSVParser.parse(content, CSVFormat.EXCEL.withHeader());
        Set<String> headers = parser.getHeaderMap().keySet();
        Set<String> extras = new HashSet();
        for (String h : headers) {
            if (h.equalsIgnoreCase(IdTypeConstants.TDID)) {
                continue;
            }
            if (h.equalsIgnoreCase(IdTypeConstants.MOBILEID)) {
                continue;
            }
            if (h.equalsIgnoreCase(IdTypeConstants.IMEI)) {
                continue;
            }
            if (h.equalsIgnoreCase(IdTypeConstants.IDFA)) {
                continue;
            }
            if (h.equalsIgnoreCase(IdTypeConstants.ANDROIDID)) {
                continue;
            }
            if (h.equalsIgnoreCase(IdTypeConstants.MAC)) {
                continue;
            }
            if (h.equalsIgnoreCase(IdTypeConstants.EMAIL_ID)) {
                continue;
            }
            extras.add(h);
        }
        CrowdMsgDto c = new CrowdMsgDto();
        if (extras.isEmpty()) {
            c.setContent(buildDvContent(parser));
            c.setJson(false);
        } else {
            c.setContent(buildJson(extras, parser));
            c.setJson(true);
        }
        return c;
    }

	/**
	 * Build dv content string.
	 *
	 * @param parser the parser
	 * @return the string
	 */
	public static String buildDvContent(CSVParser parser) {
        List<String> l = new ArrayList();
        for (CSVRecord csvRecord : parser) {
            l.add(csvRecord.get(IdTypeConstants.TDID));
        }
        return StringUtils.join(l.toArray(), ",");
    }

	/**
	 * Build json string.
	 *
	 * @param extras the extras
	 * @param parser the parser
	 * @return the string
	 */
	public static String buildJson(Set<String> extras, CSVParser parser) throws JsonProcessingException {
        List<Map<String, Object>> l = new ArrayList();
        for (CSVRecord csvRecord : parser) {
            Map<String, Object> m = new HashMap(16);
            m.put("deviceId", csvRecord.get(IdTypeConstants.TDID));
            for (String k : extras) {
                m.put(k, csvRecord.get(k));
            }
            l.add(m);
        }
        return JsonUtil.toJson(l);
    }
}
