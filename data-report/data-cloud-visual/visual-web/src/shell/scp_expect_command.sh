#!/bin/bash

#ssh -o StrictHostKeyChecking=no 对首次登录的机器不进行检查, 避免了用户手动输入yes/no
# echo -e $ssh_warpper, -e参数对后续字符串, 打开转义支持开关
# 对于密码中有特殊字符的，需要增加三个反斜杠，如下密码为root#\$123：
# ./ssh_expect.sh  root@192.168.0.1 root#\\\$123 "pwd"
file_path="$1"
username_server_file_path="$2"
password="$3"

scp_warpper="
  set timeout 1000                                                        \n
  spawn scp $file_path $username_server_file_path   \n
  expect {                                                              \n
    -nocase \"password:\" {send \"$password\r\"}                        \n
  }                                                                     \n
expect eof                                                              \n
"
echo -e $scp_warpper  | /usr/bin/expect