echo "liquibase start"
scp -r ./wanalytics-build/src/liquibase/changelogs hadoop@172.23.5.146:/home/hadoop/liquibase/
ssh hadoop@172.23.5.146 "/home/hadoop/liquibase/bin/database_init.sh"
echo "liquibase end"

echo "wreport script start"
cd wreport-script
npm install
grunt compress
cd ..

ssh  hadoop@172.23.5.148 " rm -rf /data/wifianalytics/static/wreport-script/*"
ssh  hadoop@172.23.5.148 " mkdir -p /data/wifianalytics/static/wreport-script/test"
scp -r ./wreport-script/dist/* hadoop@172.23.5.148:/data/wifianalytics/static/wreport-script/
scp -r ./wreport-script/app/* hadoop@172.23.5.148:/data/wifianalytics/static/wreport-script/test/
echo "wreport script end"

echo "wreport cloud start"
scp ./w-report-cloud/target/w-report-cloud-2.0.war hadoop@172.23.5.146:/home/hadoop/springboot
scp ./w-report-cloud/target/w-report-cloud-2.0.war hadoop@172.23.5.146:/home/hadoop/springboot2
#ssh -n hadoop@172.23.5.146 "/home/hadoop/springboot/wreport_stop.sh"
ssh -n hadoop@172.23.5.146 "/home/hadoop/springboot/wreport_start.sh"
ssh -n hadoop@172.23.5.146 "/home/hadoop/springboot2/wreport_start.sh"
echo "wreport cloud end"

echo "wanalytics-etl-cloud start"
cd wanalytics-etl-cloud
/opt/apache-maven-3.2.5/bin/mvn dependency:copy-dependencies
ssh hadoop@172.23.5.147 "mkdir -p /home/hadoop/wanalytics-package/libs"
ssh hadoop@172.23.5.147 "mkdir -p /home/hadoop/wanalytics-package/bin"
ssh hadoop@172.23.5.147 "mkdir -p /home/hadoop/wanalytics-package/install"
ssh hadoop@172.23.5.147 "mkdir -p /home/hadoop/wanalytics-package/job"
cd ..

scp     ./wanalytics-etl-cloud/target/dependency/* hadoop@172.23.5.147:/home/hadoop/wanalytics-package/libs/
scp     ./wanalytics-etl-cloud/target/w-etl-cloud-2.0.jar hadoop@172.23.5.147:/home/hadoop/wanalytics-package/libs/
scp     ./w-offline-compute-cloud/target/w-offline-compute-cloud-2.0.jar hadoop@172.23.5.147:/home/hadoop/wanalytics-package/libs/
scp  -r ./wanalytics-etl-cloud/src/bin/batch/* hadoop@172.23.5.147:/home/hadoop/wanalytics-package/bin/
scp     ./wanalytics-etl-cloud/src/main/resources/hive_create_table.sql hadoop@172.23.5.147:/home/hadoop/wanalytics-package/
scp  -r ./wanalytics-etl-cloud/src/bin/install/* hadoop@172.23.5.147:/home/hadoop/wanalytics-package/install/

ssh hadoop@172.23.5.147 "dos2unix /home/hadoop/wanalytics-package/install/*.sh > /dev/null 2>&1"
ssh hadoop@172.23.5.147 "chmod +x /home/hadoop/wanalytics-package/install/*.sh > /dev/null 2>&1"
ssh hadoop@172.23.5.147 "bash -x /home/hadoop/wanalytics-package/install/install.sh --template test2.0"
echo "wanalytics-etl-cloud end"

echo "azkaban-job start"
ssh hadoop@172.23.5.147 "mkdir -p /home/hadoop/wanalytics-package/job"
scp  -r ./wanalytics-etl-cloud/src/main/resources/azkaban/*.job hadoop@172.23.5.147:/home/hadoop/wanalytics-package/job/
ssh hadoop@172.23.5.147 "bash -x /home/hadoop/wanalytics-package/install/azkabanSchedule.sh --template dev"
echo "azkaban-job end"