cd builder

npm run npmc

cd smart-reports-npm

version=`sed -n 's/.*version.*[0-9]\{1,2\}\.[0-9]\{1,2\}\.\([0-9]\{1,10\}\).*/\1/p' package.json`

version=`expr $version + 1`

sed -i "" 's/\(.*version.*[0-9]\{1,2\}\.[0-9]\{1,2\}\.\)\([0-9]\{1,10\}\)\(.*\)/\1'$version'\3/g' package.json

npm publish