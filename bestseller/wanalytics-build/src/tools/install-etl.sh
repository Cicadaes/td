#!/bin/sh
basedir=$(cd "$(dirname "$0")"; pwd)
timestamp=`date +%Y%m%d%H%M%S`

rm ./build -rf
mkdir ./build
tar -zxvf dmp-build.tar.gz -C ./build

dmprootdir=/home/hadoop
etldir=$dmprootdir/dmp/etl

echo "tar -zcvf $basedir/bak/etl_$timestamp.tar.gz $etldir"
tar -zcvf $basedir/bak/etl_$timestamp.tar.gz $etldir

rm $etldir -rf
mkdir $etldir

echo "tar -zxvf $basedir/build/etl-pack.tar.gz -C $dmprootdir/dmp"
tar -zxvf $basedir/build/etl-pack.tar.gz -C $dmprootdir/dmp

echo "success."
