package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FilterMacConfig {

    private Integer totalDays;
    private Integer occurenceNumber;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        if (occurenceNumber != null && totalDays != null) {
            result = prime * result + occurenceNumber;
            result = prime * result + totalDays;
        }
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        FilterMacConfig other = (FilterMacConfig) obj;
        if (occurenceNumber != null && totalDays != null) {
            if (occurenceNumber != other.occurenceNumber)
                return false;
            if (totalDays != other.totalDays)
                return false;
        }
        return true;
    }

}
