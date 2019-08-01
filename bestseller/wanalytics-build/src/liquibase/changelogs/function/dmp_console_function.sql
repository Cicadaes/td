-- MySQL dump 10.13  Distrib 5.7.13, for Linux (x86_64)
--
-- Host: localhost    Database: dmp_console
-- ------------------------------------------------------
-- Server version	5.7.13-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping routines for database 'dmp_console'
--
/*!50003 DROP FUNCTION IF EXISTS `fun_getChildTagCategoryIds` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dmp`@`%` FUNCTION `fun_getChildTagCategoryIds`(rootId INT) RETURNS varchar(1000) CHARSET utf8
BEGIN
	DECLARE sTemp VARCHAR (1000);
  DECLARE sTempChd VARCHAR (1000);
	SET sTemp = '$';
	SET sTempChd = cast(rootId AS CHAR);
	WHILE sTempChd IS NOT NULL DO
		SET sTemp = concat(sTemp, ',', sTempChd);
		SELECT
			group_concat(id) INTO sTempChd
		FROM
			TD_TAG_CATEGORY
		WHERE
			FIND_IN_SET(parent_id, sTempChd) > 0;
	END WHILE;
	RETURN sTemp;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fun_seq_currval` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dmp`@`%` FUNCTION `fun_seq_currval`(seqName VARCHAR(50)) RETURNS varchar(50) CHARSET utf8
    COMMENT '当前序列号'
BEGIN  
  DECLARE number VARCHAR(50);
	DECLARE curDay VARCHAR(10); 
	DECLARE curValue VARCHAR(10);
	DECLARE currentDay VARCHAR(10);

  SET number = '';
	set curDay = '';
	select date_format(curdate(), '%Y%m%d') INTO curDay;
  SELECT LPAD(concat(current_value,''), 3, '0'), 
		CASE WHEN current_day  IS NULL THEN '' 
		ELSE current_day
		END 
	INTO curValue, currentDay
  FROM TD_SEQUENCE
  WHERE seq_name = seqName;
	
	SELECT concat(seqName, currentDay, curValue) into number;
  RETURN number;  
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fun_seq_nextval` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dmp`@`%` FUNCTION `fun_seq_nextval`(seqName VARCHAR(50)) RETURNS varchar(50) CHARSET utf8
    COMMENT '获得下一个序列号'
BEGIN  
DECLARE curDay VARCHAR(10);
DECLARE currentDay VARCHAR(10);
DECLARE dayDiff VARCHAR(10);

select date_format(curdate(), '%Y%m%d') INTO curDay;
SELECT current_day INTO currentDay FROM TD_SEQUENCE WHERE seq_name = seqName;
SELECT datediff(curDay, currentDay) INTO dayDiff;

IF dayDiff > 0 THEN 
 UPDATE TD_SEQUENCE  
       SET current_value = 1 , current_day = curDay
       WHERE seq_name = seqName;

ELSE
	UPDATE TD_SEQUENCE  
       SET current_value = current_value + increment 
       WHERE seq_name = seqName; 

END IF;

RETURN fun_seq_currval(seqName);  
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fun_seq_setval` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dmp`@`%` FUNCTION `fun_seq_setval`(seqName VARCHAR(50), value INTEGER, currentDay VARCHAR(10)) RETURNS varchar(50) CHARSET utf8
    COMMENT '设置序列号，从此序列号开始'
BEGIN  
       UPDATE TD_SEQUENCE  
       SET current_value = value, current_day = currentDay
       WHERE seq_name = seqName;  
       RETURN fun_seq_currval(seqName);  
    END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fun_seq_sub_currnum` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dmp`@`%` FUNCTION `fun_seq_sub_currnum`(seqSubName VARCHAR(50)) RETURNS int(11)
    COMMENT '当前序列号'
BEGIN
	DECLARE curValue INT(11);
	    
	SELECT current_value INTO curValue
    FROM TD_SEQUENCE_SUB
    WHERE seq_sub_name = seqSubName;
    
	RETURN curValue;  
    END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fun_seq_sub_currval` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dmp`@`%` FUNCTION `fun_seq_sub_currval`(seqSubName VARCHAR(50), connectSign VARCHAR(10)) RETURNS varchar(50) CHARSET utf8
    COMMENT '当前序列号'
BEGIN
	DECLARE number VARCHAR(50);
	DECLARE connect_sign VARCHAR(10);
	DECLARE curValue INT(11);
	
	SET number = '';
	    SET connect_sign = connectSign;
	    IF ISNULL(connectSign) || LENGTH(TRIM(connectSign))<1 THEN
		SET connect_sign = '';
	    END IF;
    
	SELECT current_value INTO curValue
    FROM TD_SEQUENCE_SUB
    WHERE seq_sub_name = seqSubName;
    SELECT CONCAT(seqSubName, connect_sign, curValue) INTO number;
    
	RETURN number;  
    END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fun_seq_sub_nextnum` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dmp`@`%` FUNCTION `fun_seq_sub_nextnum`(seqSubName VARCHAR(50)) RETURNS int(11)
BEGIN
    DECLARE countRecord int(10);
    DECLARE number INT(11);

    SELECT COUNT(*) INTO countRecord FROM TD_SEQUENCE_SUB WHERE seq_sub_name = seqSubName;

    IF(countRecord = 0) THEN
       INSERT INTO `TD_SEQUENCE_SUB` (`seq_sub_name`, `current_value`, `remark`)
        VALUES (seqSubName, 1, remark);
    ELSE
       UPDATE TD_SEQUENCE_SUB
        SET current_value = current_value + increment
        WHERE seq_sub_name = seqSubName;
    END IF;

    SET number = fun_seq_sub_currnum(seqSubName);
    RETURN number;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fun_seq_sub_nextval` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dmp`@`%` FUNCTION `fun_seq_sub_nextval`(seqSubName VARCHAR(50), connectSign VARCHAR(10)) RETURNS varchar(50) CHARSET utf8
BEGIN
    DECLARE countRecord int(10);
    DECLARE number VARCHAR(50);

    SELECT COUNT(*) INTO countRecord FROM TD_SEQUENCE_SUB WHERE seq_sub_name = seqSubName;

    IF(countRecord = 0) THEN
       INSERT INTO `TD_SEQUENCE_SUB` (`seq_sub_name`, `current_value`, `remark`)
        VALUES (seqSubName, 1, remark);
    ELSE
       UPDATE TD_SEQUENCE_SUB
        SET current_value = current_value + increment
        WHERE seq_sub_name = seqSubName;
    END IF;

    SET number = fun_seq_sub_currval(seqSubName, connectSign);
    RETURN number;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fun_seq_sub_setval` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dmp`@`%` FUNCTION `fun_seq_sub_setval`(seqSubName VARCHAR(50), curValue INTEGER, remark varchar(100), connectSign VARCHAR(10)) RETURNS varchar(50) CHARSET utf8
BEGIN
    DECLARE number VARCHAR(50);
    DECLARE countRecord int(10);
    SELECT COUNT(*) INTO countRecord FROM TD_SEQUENCE_SUB WHERE seq_sub_name = seqSubName;
    IF(countRecord = 0) THEN
       INSERT INTO `TD_SEQUENCE_SUB` (`seq_sub_name`, `current_value`, `remark`)
        VALUES (seqSubName, curValue, remark);
    ELSE
       UPDATE TD_SEQUENCE_SUB
         SET current_value = curValue
       WHERE seq_sub_name = seqSubName;
    END IF;
    SET number = fun_seq_sub_currval(seqSubName, connectSign);
    RETURN number;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-12-27 10:53:05
