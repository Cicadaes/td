#!/usr/bin/expect -f

#服务器ip,用户名,密码
# set login_ip [lindex $argv 1]
if { [lindex $argv 0]==1 } {
    set login_ip [lindex $argv 1]
    set ip [lindex $argv 2]
    set user [lindex $argv 3]
    #堡垒机ip,用户名,密码
    set login_user "ruobin.yang"

    #登陆堡垒机
    spawn ssh $login_user@$login_ip
    expect "]$ "

    #登录服务器
    send "ssh $user@$ip \n"
    expect {
        "(yes/no)" {send "yes\n";exp_continue}
        "*assword:" {send "$password\n"}
     	"*$ip*" { send "cd ~\r"; interact }
    }
} 
if { [lindex $argv 0]==2 } {
    set login_ip [lindex $argv 1]
    set ip [lindex $argv 2]
    set user [lindex $argv 3]
    set ip2 [lindex $argv 4]
    set user2 [lindex $argv 5]
    #堡垒机ip,用户名,密码
    set login_user "ruobin.yang"

    #登陆堡垒机
    spawn ssh $login_user@$login_ip
    expect "]$ "

    #登录服务器
    send "ssh $user@$ip \n"
    expect {
        "(yes/no)" {send "yes\n";exp_continue}
        "*assword:" {send "$password\n"}
        "*$ip*" { send "cd ~\r"}
    }
    send "ssh $user2@$ip2 \n"
    expect {
        "(yes/no)" {send "yes\n";exp_continue}
        "*assword:" {send "$password\n"}
        "*$ip*" { send "cd ~\r"; interact }
    }
} 
if { [lindex $argv 0]==0 } {
    set ip [lindex $argv 1]
    set user [lindex $argv 2]
    set password [lindex $argv 3]
    #直接登录服务器
    spawn ssh $user@$ip
    expect {
        "(yes/no)" {send "yes\n";exp_continue}
        "*assword:" {send "$password\n"}
    "*$ip*" { send "cd ~\r"; interact }
    }
}

interact
