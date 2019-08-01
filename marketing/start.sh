#!/usr/bin/env bash

dir=`pwd`
# open jmx port
# -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.authenticate=false
# -Dcom.sun.management.jmxremote.port=1234 -Dcom.sun.management.jmxremote.ssl=false
java -jar $dir/marketing-report/web/target/marketing-web.jar