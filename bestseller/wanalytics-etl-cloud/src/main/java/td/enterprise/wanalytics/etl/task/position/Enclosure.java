package td.enterprise.wanalytics.etl.task.position;


/**
 * Created by tendcloud on 2016/2/24.
 */
public class Enclosure {
    private String name;
    private EnclosureType type;
    private Float[] lats;
    private Float[] lngs;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EnclosureType getType() {
        return type;
    }

    public void setType(EnclosureType type) {
        this.type = type;
    }


    public Float[] getLats() {
        return lats;
    }

    public void setLats(Float[] lats) {
        this.lats = lats;
    }

    public Float[] getLngs() {
        return lngs;
    }

    public void setLngs(Float[] lngs) {
        this.lngs = lngs;
    }

    public enum EnclosureType {
        UNKNOW(0), DISTRICT(1), BUSSINESS(2);

        private int type;

        EnclosureType(int type) {
            this.type = type;
        }

        public static EnclosureType of(final int type) {
        	if(type == 0) return EnclosureType.UNKNOW;
        	if(type == 1) return EnclosureType.DISTRICT;
        	if(type == 2) return EnclosureType.BUSSINESS;
        	
        	return EnclosureType.UNKNOW;
        }

        public int getType() {
            return type;
        }
    }
}
