package td.enterprise.service.DTO;


/**
 * junmin.li
 *
 * @author 进店率和停留率 排序类
 */
public class RoomRateComparator implements Comparable<RoomRateComparator> {

    private String roomId;
    private double rate;

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    @Override
    public int compareTo(RoomRateComparator o) {
        if (this.getRate() > o.getRate()) {
            return -1;
        }

        if (this.getRate() < o.getRate()) {
            return 1;
        }

        return 0;
    }

}
