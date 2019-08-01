CREATE DATABASE `visual` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER 'datacloud'@'%' IDENTIFIED BY 'datacloud@talkingdata';
GRANT ALL ON visual.* TO 'datacloud'@'%' WITH GRANT OPTION;