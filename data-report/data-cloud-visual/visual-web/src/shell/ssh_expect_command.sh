#!/usr/bin/expect -f

#ssh -o StrictHostKeyChecking=no 对首次登录的机器不进行检查, 避免了用户手动输入yes/no
# echo -e $ssh_warpper, -e参数对后续字符串, 打开转义支持开关
# 对于密码中有特殊字符的，需要增加三个反斜杠，如下密码为root#\$123：
# ./ssh_expect.sh  root@192.168.0.1 root#\\\$123 "pwd"
set username_server [lindex $argv 0]
set password [lindex $argv 1]
set command [lindex $argv 2]

spawn ssh $username_server `$command`
    expect {
        "(yes/no)" {send "yes\n";exp_continue}
        "*assword:" {send "$password\n"}
    }
interact