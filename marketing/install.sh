#!/usr/bin/env bash

dir=`pwd`

cd $dir/marketing-core/base && mvn clean install -DskipTests
cd $dir/marketing-core/core && mvn clean install -DskipTests
cd $dir/marketing-report/web && mvn package -Dmaven.test.skip=true