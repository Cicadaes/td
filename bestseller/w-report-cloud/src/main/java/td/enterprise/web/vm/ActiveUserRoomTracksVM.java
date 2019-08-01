package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.service.DTO.RoomTag;

import java.util.List;

/**
 * Created by ran.li on 2017/3/23 0023.
 */
@Getter
@Setter
@ToString
public class ActiveUserRoomTracksVM {

    private List<RoomTag> up;
    private List<RoomTag> down;
    private List<RoomTag> all;
}
