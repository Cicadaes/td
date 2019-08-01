package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by Yan on 2017/3/6.
 */
@Setter
@Getter
@ToString
public class BasePage {

    private Integer page = 1;

    private Integer rows = 10;

    private String sort;

    private String order;

    private String q;

    private Boolean pageEnabled;


    public Boolean getPageEnabled() {
        return pageEnabled;
    }

    public void setPageEnabled(Boolean pageEnabled) {
        this.pageEnabled = pageEnabled;
    }

    /**
     * 分页导航
     */
    private Pager pager = new Pager();

    public Pager getPager() {
        pager.setPageId(getPage());
        pager.setPageSize(getRows());
        String orderField = "";
        if (sort != null && sort.trim().length() > 0) {
            orderField = sort;
        }
        if (orderField.trim().length() > 0 && (order != null && order.trim().length() > 0)) {
            orderField += " " + order;
        }
        pager.setOrderField(orderField);

        if (null != pageEnabled) {
            pager.setPageEnabled(pageEnabled);
        }
        return pager;
    }

    public void setPager(Pager pager) {
        this.pager = pager;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getRows() {
        return rows;
    }

    public void setRows(Integer rows) {
        this.rows = rows;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
    }

}

