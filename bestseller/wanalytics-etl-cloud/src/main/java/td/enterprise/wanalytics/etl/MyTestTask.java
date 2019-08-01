package td.enterprise.wanalytics.etl;

/**
 * Created by admin on 2017/10/20.
 */
public class MyTestTask {
    public static void main(String[] args) {
        System.out.println("This is youyu.dong's TestTask.");
        if(args.length>0){
            System.out.println(args.length);
            for (String arg:args){
                System.out.println(arg);
            }
        }
    }
}
