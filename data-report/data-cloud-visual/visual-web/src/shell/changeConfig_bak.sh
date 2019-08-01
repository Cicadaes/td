#!/bin/bash

jar uf WEB-INF/lib/visual-core-0.0.1-SNAPSHOT.jar jdbc.properties
echo "替换数据库连接"
jar uf ./visual-web.war WEB-INF/lib/visual-core-0.0.1-SNAPSHOT.jar
echo "替换core包"
jar uf ./visual-web.war WEB-INF/classes/um-rmi-client.properties
echo "替换UM"
cd ..
cp changeConfig/visual-web.war webapps/
echo "jetty重启"
./bin/jetty.sh restart
echo "启动完成"
