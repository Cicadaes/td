mvn clean install -DskipTests -N && mvn clean install -f %cd%/marketing-core/base -DskipTests && mvn clean install -f %cd%/marketing-core/core -DskipTests && mvn clean package -f %cd%/marketing-report/web -Dmaven.test.skip=true
