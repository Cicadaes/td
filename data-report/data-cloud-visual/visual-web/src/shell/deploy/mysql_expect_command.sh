#!/bin/bash

#ssh -o StrictHostKeyChecking=no 对首次登录的机器不进行检查, 避免了用户手动输入yes/no
# echo -e $ssh_warpper, -e参数对后续字符串, 打开转义支持开关
# 对于密码中有特殊字符的，需要增加三个反斜杠，如下密码为root#\$123：
# ./ssh_expect.sh  root@192.168.0.1 root#\\\$123 "pwd"
host="$1"
port="$2"
userName="$3"
password="$4"
importSql="$5"

spawn /Users/yangruobin/myapp/mysql-5.7.13-osx10.11-x86_64/bin/mysql -h $host -P $port -u$userName -p
expect {
    "(yes/no)" {send "yes\n";exp_continue}
    "*assword:" {send "$password\n"}
    "mysql*" {send "show databases;\n";interact}
}
echo -e $scp_warpper  | /usr/bin/expect