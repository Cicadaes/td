--liquibase formatted sql

--changeset junmin.li:1488370594480-1
update TD_COLUMN set id = 247 where fact_id = 85 and id = 430 and name ='offset' ;
update TD_METRIC set column_id = 247 where   name ='enter_new_user_day_cube' ;
update TD_COLUMN set id = 248 where fact_id = 86 and id = 434 and name ='offset' ;
update TD_METRIC set column_id = 248 where   name ='stay_old_user_day_cube' ;
update TD_COLUMN set id = 249 where fact_id = 87 and id = 438 and name ='offset' ;
update TD_METRIC set column_id = 249 where   name ='stay_new_user_day_cube' ;
update TD_COLUMN set id = 250 where fact_id = 88 and id = 442 and name ='offset' ;
update TD_METRIC set column_id = 250 where   name ='enter_old_user_day_cube' ;
