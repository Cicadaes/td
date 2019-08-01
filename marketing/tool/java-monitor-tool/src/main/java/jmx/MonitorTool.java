package jmx;

import com.sun.management.OperatingSystemMXBean;

import javax.management.MBeanServerConnection;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.management.*;
import java.lang.management.GarbageCollectorMXBean;
import java.lang.management.ThreadMXBean;

public class MonitorTool {
    static final String HEAP_MEMORY_USAGE = "heap_memory_usage";
    static final String THREAD_USAGE = "thread_usage";
    static final String CLASS_LOAD_USAGE = "class_load_usage";
    static final String CPU_USAGE = "cpu_usage";
    static final String SUMMER_INFO = "summer_info";

    public static void main(String[] args) throws Exception{
        JMXServiceURL serviceURL = new JMXServiceURL(buildJmxUrl(args));
        JMXConnector conn = JMXConnectorFactory.connect(serviceURL);
        MBeanServerConnection mbs=conn.getMBeanServerConnection();

        // class loader
        printClassLoader(mbs);

        //compilation
        printCompilation(mbs);

        //garbage collector
        printGarbageCollector(mbs);

        //memory
        printMemoryUsage(mbs);

        // memory manager
        printMemoryManager(mbs);

        //memory pool
        printMemoryPoolUsage(mbs);

        //operate system
        printOperatingSystemUsage(mbs);

        //runtime
        printRuntimeUsage(mbs);

        //thread
        printThreadUsage(mbs);
    }

    private static void printClassLoader(MBeanServerConnection mbs) throws Exception{
        ClassLoadingMXBean classLoadingMXBean = ManagementFactory.newPlatformMXBeanProxy
                (mbs,ManagementFactory.CLASS_LOADING_MXBEAN_NAME, ClassLoadingMXBean.class);
        writeMessage(CLASS_LOAD_USAGE, String.format("%d,\n",classLoadingMXBean.getLoadedClassCount()));
        writeMessage(SUMMER_INFO, "load class count:"+classLoadingMXBean.getLoadedClassCount());

        //todo print what
    }

    private static void printCompilation(MBeanServerConnection mbs) throws Exception{
        CompilationMXBean compilationMXBean = ManagementFactory.newPlatformMXBeanProxy
                (mbs,ManagementFactory.COMPILATION_MXBEAN_NAME, CompilationMXBean.class);
        //todo print what
    }

    private static void printGarbageCollector(MBeanServerConnection mbs) throws Exception{
        String[] mxBeanNames = new String[] {
                "java.lang:type=GarbageCollector,name=PS MarkSweep",
                "java.lang:type=GarbageCollector,name=PS Scavenge"
        };
        for (String beanName:mxBeanNames) {
            StringBuffer stringBuffer = new StringBuffer();
            GarbageCollectorMXBean collectorMXBean = ManagementFactory.newPlatformMXBeanProxy
                    (mbs,beanName, GarbageCollectorMXBean.class);
            stringBuffer.append(String.format("%s:\n",beanName));
            stringBuffer.append(String.format("     collection count:%d,time:%d", collectorMXBean.getCollectionCount(), collectorMXBean.getCollectionTime()));
            writeMessage(SUMMER_INFO, stringBuffer.toString());
        }
    }

    private static void printMemoryPoolUsage(MBeanServerConnection mbs) throws Exception{
        String[] mxBeanNames = new String[] {
                "java.lang:type=MemoryPool,name=Code Cache",
                "java.lang:type=MemoryPool,name=Compressed Class Space",
                "java.lang:type=MemoryPool,name=Metaspace",
                "java.lang:type=MemoryPool,name=PS Eden Space",
                "java.lang:type=MemoryPool,name=PS Old Gen",
                "java.lang:type=MemoryPool,name=PS Survivor Space"
        };
        for (String beanName:mxBeanNames) {
            StringBuffer stringBuffer = new StringBuffer();
            MemoryPoolMXBean memoryPoolMXBean = ManagementFactory.newPlatformMXBeanProxy
                    (mbs,beanName, MemoryPoolMXBean.class);
            stringBuffer.append(String.format("%s:\n", beanName));
            if (memoryPoolMXBean.getUsage() != null) {
                stringBuffer.append(String.format("     usage:%s\n", memoryPoolMXBean.getUsage().toString()));
            }
            if (memoryPoolMXBean.getPeakUsage() != null) {
                stringBuffer.append(String.format("     peak usage:%s\n", memoryPoolMXBean.getPeakUsage().toString()));
            }
            if (memoryPoolMXBean.getCollectionUsage() != null) {
                stringBuffer.append(String.format("     collection usage:%s", memoryPoolMXBean.getCollectionUsage().toString()));
            }
            writeMessage(SUMMER_INFO, stringBuffer.toString());
        }
    }

    private static void printMemoryUsage(MBeanServerConnection mbs) throws Exception{
        MemoryMXBean memBean= ManagementFactory.newPlatformMXBeanProxy
                (mbs,ManagementFactory.MEMORY_MXBEAN_NAME, MemoryMXBean.class);
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append(String.format("heap memory usage:%s\n", memBean.getHeapMemoryUsage().toString()));
        stringBuffer.append(String.format("non heap memory usage:%s", memBean.getNonHeapMemoryUsage().toString()));
        MemoryUsage heap = memBean.getHeapMemoryUsage();
        String body = String.format("%d,%d,%d,%d,\n", heap.getInit(), heap.getUsed(), heap.getCommitted(), heap.getMax());
        writeMessage(HEAP_MEMORY_USAGE, body);
        writeMessage(SUMMER_INFO, stringBuffer.toString());
    }

    private static void printMemoryManager(MBeanServerConnection mbs) throws Exception{
        //todo print what?
    }

    private static void printRuntimeUsage(MBeanServerConnection mbs)  throws Exception{
        RuntimeMXBean runtimeMXBean= ManagementFactory.newPlatformMXBeanProxy
                (mbs,ManagementFactory.RUNTIME_MXBEAN_NAME, RuntimeMXBean.class);

        //todo print what?
    }

    private static void printOperatingSystemUsage(MBeanServerConnection mbs)  throws Exception{
        OperatingSystemMXBean opMXbean =
                ManagementFactory.newPlatformMXBeanProxy(mbs,
                        ManagementFactory.OPERATING_SYSTEM_MXBEAN_NAME, OperatingSystemMXBean.class);
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append("operatingSystemUsage:\n");
        stringBuffer.append("committedVirtualMemory:"+opMXbean.getCommittedVirtualMemorySize());
        stringBuffer.append(",");
        stringBuffer.append("freePhysicalMemorySize:"+opMXbean.getFreePhysicalMemorySize());
        stringBuffer.append(",");
        stringBuffer.append("freeSwapSpace:"+opMXbean.getFreeSwapSpaceSize());
        stringBuffer.append("\n");
        stringBuffer.append("totalSwapSpace:"+opMXbean.getTotalSwapSpaceSize());
        stringBuffer.append(",");
        stringBuffer.append("processCpuTime:"+opMXbean.getProcessCpuTime());
        stringBuffer.append(",");
        stringBuffer.append("systemCpuLoad:"+opMXbean.getSystemCpuLoad());
        stringBuffer.append(",");
        stringBuffer.append("freeSwapSpaceSize:"+opMXbean.getFreeSwapSpaceSize());
        writeMessage(CPU_USAGE, String.format("%f,\n",opMXbean.getSystemCpuLoad()));
        writeMessage(SUMMER_INFO, stringBuffer.toString());
    }

    private static void printThreadUsage(MBeanServerConnection mbs) throws Exception{
        ThreadMXBean threadMXBean = ManagementFactory.newPlatformMXBeanProxy(mbs,
                ManagementFactory.THREAD_MXBEAN_NAME, ThreadMXBean.class);
        int count = threadMXBean.getThreadCount();
        long userTime = threadMXBean.getCurrentThreadUserTime();
        long cpuTime = threadMXBean.getCurrentThreadCpuTime();
        int daemonCount = threadMXBean.getDaemonThreadCount();
        writeMessage(THREAD_USAGE, String.format("%d,\n", count));
        String message = String.format("thread count:%d,thread user time:%d,thread cpu time:%d,daemon thread count:%d",
                count, userTime, cpuTime, daemonCount);
        writeMessage(SUMMER_INFO, message);
    }

    private static void writeMessage(String tp, String message) {
        String fullPath = String.format("%s/%s",getDir(), getFileName(tp));
        File file = new File(fullPath);
        FileWriter fileWriter = null;
        boolean fileExists = file.exists();
        try {
            fileWriter = new FileWriter(fullPath, true);
        } catch (IOException e) {
            e.printStackTrace();
            closeWriter(fileWriter);
            return;
        }

        try {
            if (!fileExists) {
                file.createNewFile();
                fileWriter.write(buildHeaderByTp(tp));
            }
            fileWriter.write(message);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            closeWriter(fileWriter);
        }
    }

    private static String getDir() {
        return System.getProperty("user.dir");
    }

    private static String getFileName(String tp) {
        if (!SUMMER_INFO.equals(tp)) {
            return String.format("%s.csv",tp);
        }
        return String.format("%s.txt",tp);
    }

    private static String buildHeaderByTp(String tp) {
        if (HEAP_MEMORY_USAGE.equals(tp)) {
            return String.format("init,used,committed,max,\n");
        } else if (THREAD_USAGE.equals(tp)) {
            return String.format("count,\n");
        } else if (CLASS_LOAD_USAGE.equals(tp)) {
            return String.format("count,\n");
        } else if (CPU_USAGE.equals(tp)) {
            return String.format("cpu load,\n");
        }
        return "";
    }


    private static void closeWriter(FileWriter fileWriter) {
        if (fileWriter != null) {
            try {
                fileWriter.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private static String buildJmxUrl(String []args) {
        String addr = "localhost";
        String port = "1234";
        if (args.length == 2) {
            addr = args[0];
            port = args[1];
        }
        return String.format("service:jmx:rmi:///jndi/rmi://%s:%s/jmxrmi", addr, port);
    }
}
