package td.enterprise.wanalytics.etl.task.custom;

import com.tenddata.bitmap.Bitmap;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 保存bitmap 和 运算符合符
 */
@Setter
@Getter
@ToString
public class TempBitmap {
    private Bitmap bitmap ;
    private String operator;//AND OR

}
