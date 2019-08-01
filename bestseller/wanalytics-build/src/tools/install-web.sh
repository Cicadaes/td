#!/bin/sh
basedir=$(cd "$(dirname "$0")"; pwd)
timestamp=`date +%Y%m%d%H%M%S`

rm ./build -rf
mkdir ./build
tar -zxvf dmp-build.tar.gz -C ./build

dmprootdir=/home/hadoop
batchmanagerdir=$dmprootdir/batchmanager
dmpconsoledir=$dmprootdir/dmp-console
dmpwebdir=$dmprootdir/dmp-web
queryenginedir=$dmprootdir/queryengine

echo $batchmanagerdir
echo $dmpconsoledir
echo $dmpwebdir
echo $queryenginedir

echo "sh $batchmanagerdir/bin/jetty.sh stop"
sh $batchmanagerdir/bin/jetty.sh stop
echo "sh $dmpconsoledir/bin/jetty.sh stop"
sh $dmpconsoledir/bin/jetty.sh stop
echo "sh $dmpwebdir/bin/jetty.sh stop"
sh $dmpwebdir/bin/jetty.sh stop
echo "sh $queryenginedir/bin/jetty.sh stop"
sh $queryenginedir/bin/jetty.sh stop

echo "cp $batchmanagerdir/webapps/batchmanager-web.war $basedir/bak/batchmanager-web_$timestamp.war -f"
cp $batchmanagerdir/webapps/batchmanager-web.war $basedir/bak/batchmanager-web_$timestamp.war -f
echo "cp $basedir/build/batchmanager-web.war $batchmanagerdir/webapps/batchmanager-web.war -f"
cp $basedir/build/batchmanager-web.war $batchmanagerdir/webapps/batchmanager-web.war -f

echo "cp $dmpconsoledir/webapps/dmp-console.war $basedir/bak/dmp-console_$timestamp.war -f"
cp $dmpconsoledir/webapps/dmp-console.war $basedir/bak/dmp-console_$timestamp.war -f
echo "cp $basedir/build/dmp-console.war $dmpconsoledir/webapps/dmp-console.war -f"
cp $basedir/build/dmp-console.war $dmpconsoledir/webapps/dmp-console.war -f

echo "cp $dmpwebdir/webapps/dmp-web.war $basedir/bak/dmp-web_$timestamp.war -f"
cp $dmpwebdir/webapps/dmp-web.war $basedir/bak/dmp-web_$timestamp.war -f
echo "cp $basedir/build/dmp-web.war $dmpwebdir/webapps/dmp-web.war -f"
#cp $basedir/build/dmp-web.war $dmpwebdir/webapps/dmp-web.war -f

echo "cp $queryenginedir/webapps/dmp-queryengine.war $basedir/bak/dmp-queryengine_$timestamp.war -f"
cp $queryenginedir/webapps/dmp-queryengine.war $basedir/bak/dmp-queryengine_$timestamp.war -f
echo "cp $basedir/build/dmp-queryengine.war $queryenginedir/webapps/dmp-queryengine.war -f"
cp $basedir/build/dmp-queryengine.war $queryenginedir/webapps/dmp-queryengine.war -f

echo "sh $batchmanagerdir/bin/jetty.sh start"
sh $batchmanagerdir/bin/jetty.sh start
echo "sh $dmpconsoledir/bin/jetty.sh start"
sh $dmpconsoledir/bin/jetty.sh start
echo "sh $dmpwebdir/bin/jetty.sh start"
sh $dmpwebdir/bin/jetty.sh start
echo "$queryenginedir/bin/jetty.sh start"
sh $queryenginedir/bin/jetty.sh start

echo "success."
