#!/bin/bash
scp /Users/yangruobin/ideagit/data-report/data-cloud-visual/visual-web/target/visual-web.war ruobin.yang@172.20.0.6:~
ssh ruobin.yang@172.20.0.6 "sh changeWar.sh"

#/Users/yangruobin/ideagit/data-report/data-cloud-visual/visual-web/src/shell/scp_expect_command.sh /Users/yangruobin/ideagit/data-report/data-cloud-visual/visual-web/target/visual-web.war  hadoop@10.150.33.122:/home/hadoop/jetty-9.2.10-datareport-9097/changeConfig hadoop@BS_123
#/Users/yangruobin/ideagit/data-report/data-cloud-visual/visual-web/src/shell/ssh_expect_command.sh hadoop@10.150.33.122 hadoop@BS_123 "cd /home/hadoop/jetty-9.2.10-datareport-9097/changeConfig;sh ./changeConfig.sh"

#/Users/yangruobin/ideagit/data-report/data-cloud-visual/visual-web/src/shell/scp_expect_command.sh /Users/yangruobin/ideagit/data-report/data-cloud-visual/visual-web/target/visual-web.war  hadoop@10.150.33.122:/home/hadoop/jetty-9.2.10-datareport-9500/changeConfig hadoop@BS_123
#/Users/yangruobin/ideagit/data-report/data-cloud-visual/visual-web/src/shell/ssh_expect_command.sh hadoop@10.150.33.122 hadoop@BS_123 "cd /home/hadoop/jetty-9.2.10-datareport-9500/changeConfig;sh ./changeConfig.sh"



/Users/yangruobin/ideagit/data-report/data-cloud-visual/visual-web/src/shell/scp_expect_command.sh /Users/yangruobin/ideagit/data-report/data-cloud-visual/visual-web/target/visual-web-boot.war  hadoop@10.150.33.122:/home/hadoop/datareport-9097 hadoop@BS_123