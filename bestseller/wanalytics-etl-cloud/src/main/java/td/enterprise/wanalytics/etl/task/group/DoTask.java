package td.enterprise.wanalytics.etl.task.group;

import javax.transaction.NotSupportedException;

public interface DoTask {

  void doTask() throws NotSupportedException;
}
