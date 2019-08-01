package td.enterprise.web.util;

import org.springframework.http.HttpHeaders;
import org.springframework.web.util.UriComponentsBuilder;
import td.enterprise.page.BasePage;

import java.net.URISyntaxException;

/**
 * Utility class for handling pagination.
 * <p>
 * <p>
 * Pagination uses the same principles as the <a href="https://developer.github.com/v3/#pagination">Github API</a>,
 * and follow <a href="http://tools.ietf.org/html/rfc5988">RFC 5988 (Link header)</a>.
 */
public final class PaginationUtil {

    private PaginationUtil() {
    }

    public static HttpHeaders generatePaginationHttpHeaders(BasePage page, String baseUrl)
            throws URISyntaxException {

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", "" + page.getPager().getRowCount());
        String link = "";
        if ((page.getPage() + 1) < page.getPager().getRowCount()) {
            link = "<" + generateUri(baseUrl, page.getPage() + 1, page.getRows()) + ">; rel=\"next\",";
        }
        // prev link
        if ((page.getPage()) > 0) {
            link += "<" + generateUri(baseUrl, page.getPage() - 1, page.getRows()) + ">; rel=\"prev\",";
        }
        // last and first link
        int lastPage = 0;
        if (page.getPager().getRowCount() > 0) {
            lastPage = page.getPager().getRowCount() - 1;
        }
        link += "<" + generateUri(baseUrl, lastPage, page.getRows()) + ">; rel=\"last\",";
        link += "<" + generateUri(baseUrl, 0, page.getRows()) + ">; rel=\"first\"";
        headers.add(HttpHeaders.LINK, link);
        return headers;
    }

    private static String generateUri(String baseUrl, int page, int size) throws URISyntaxException {
        return UriComponentsBuilder.fromUriString(baseUrl).queryParam("page", page).queryParam("size", size).toUriString();
    }
}
