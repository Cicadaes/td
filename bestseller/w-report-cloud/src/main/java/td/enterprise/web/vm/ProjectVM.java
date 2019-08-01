package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.Project;

/**
 * <br>
 * <b>功能：</b>房间 RoomEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class ProjectVM extends Project implements Comparable<ProjectVM> {

    private Integer activeUser;
    private Integer enterUser;
    private Integer stayUser;

    private Double activeUserPercent;
    private Double enterUserPercent;
    private Double stayUserPercent;

    private Double enterPercent;//进店率
    private Double chainEnterPercent;  //环比进店率
    private String chainEnterPercentStr;//环比进店率str

    private Double stayPercent;//停留率
    private Double chainStayPercent;  //环比停留率
    private String chainStayPercentStr;//环比停留率str

    private String order;   //排序方式
    private String sort;  //排序字段

    @Override
    public int compareTo(ProjectVM o) {
        if ("enterPercent".equalsIgnoreCase(this.getSort())) {
            if ("asc".equalsIgnoreCase(this.getOrder())) {
                return this.enterPercent.compareTo(o.getEnterPercent());
            } else {
                return o.getEnterPercent().compareTo(this.enterPercent);
            }
        } else if ("chainEnterPercent".equalsIgnoreCase(this.getSort())) {
            if ("asc".equalsIgnoreCase(this.getOrder())) {
                return this.chainEnterPercent.compareTo(o.getChainEnterPercent());
            } else {
                return o.getChainEnterPercent().compareTo(this.chainEnterPercent);
            }
        } else if ("stayPercent".equalsIgnoreCase(this.getSort())) {
            if ("asc".equalsIgnoreCase(this.getOrder())) {
                return this.stayPercent.compareTo(o.getStayPercent());
            } else {
                return o.getStayPercent().compareTo(this.stayPercent);
            }
        }
        return 0;
    }

    public Double getChainEnterPercent() {
        return chainEnterPercent;
    }

    public void setChainEnterPercent(Double chainEnterPercent) {
        this.chainEnterPercent = chainEnterPercent;
    }

    public String getChainEnterPercentStr() {
        return chainEnterPercentStr;
    }

    public void setChainEnterPercentStr(String chainEnterPercentStr) {
        this.chainEnterPercentStr = chainEnterPercentStr;
    }


}

