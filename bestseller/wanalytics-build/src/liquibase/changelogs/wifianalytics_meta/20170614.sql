--liquibase formatted sql

--changeset junmin.li:1497407028227-1
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='active_user_room_day_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='active_user_room_day_cube' );
delete from TD_METRIC where name ='active_user_room_day_cube';
delete from TD_CUBE where name = 'active_user_room_day_cube';
delete from TD_FACT_TABLE where `name` = 'active_user_room_day_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='enter_new_user_day_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='enter_new_user_day_cube' );
delete from TD_METRIC where name ='enter_new_user_day_cube';
delete from TD_CUBE where name = 'enter_new_user_day_cube';
delete from TD_FACT_TABLE where `name` = 'enter_new_user_day_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='enter_old_user_day_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='enter_old_user_day_cube' );
delete from TD_METRIC where name ='enter_old_user_day_cube';
delete from TD_CUBE where name = 'enter_old_user_day_cube';
delete from TD_FACT_TABLE where `name` = 'enter_old_user_day_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='enter_user_day_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='enter_user_day_cube' );
delete from TD_METRIC where name ='enter_user_day_cube';
delete from TD_CUBE where name = 'enter_user_day_cube';
delete from TD_FACT_TABLE where `name` = 'enter_user_day_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='enter_user_room_day_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='enter_user_room_day_cube' );
delete from TD_METRIC where name ='enter_user_room_day_cube';
delete from TD_CUBE where name = 'enter_user_room_day_cube';
delete from TD_FACT_TABLE where `name` = 'enter_user_room_day_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_active_user_hour_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_active_user_hour_cube' );
delete from TD_METRIC where name ='offline_active_user_hour_cube';
delete from TD_CUBE where name = 'offline_active_user_hour_cube';
delete from TD_FACT_TABLE where `name` = 'offline_active_user_hour_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_active_user_room_day_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_active_user_room_day_cube' );
delete from TD_METRIC where name ='offline_active_user_room_day_cube';
delete from TD_CUBE where name = 'offline_active_user_room_day_cube';
delete from TD_FACT_TABLE where `name` = 'offline_active_user_room_day_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_enter_user_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_enter_user_cube' );
delete from TD_METRIC where name ='offline_enter_user_cube';
delete from TD_CUBE where name = 'offline_enter_user_cube';
delete from TD_FACT_TABLE where `name` = 'offline_enter_user_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_enter_user_room_day_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_enter_user_room_day_cube' );
delete from TD_METRIC where name ='offline_enter_user_room_day_cube';
delete from TD_CUBE where name = 'offline_enter_user_room_day_cube';
delete from TD_FACT_TABLE where `name` = 'offline_enter_user_room_day_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_old_user_sensor_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_old_user_sensor_cube' );
delete from TD_METRIC where name ='offline_old_user_sensor_cube';
delete from TD_CUBE where name = 'offline_old_user_sensor_cube';
delete from TD_FACT_TABLE where `name` = 'offline_old_user_sensor_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_room_tracks_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_room_tracks_cube' );
delete from TD_METRIC where name ='offline_room_tracks_cube';
delete from TD_CUBE where name = 'offline_room_tracks_cube';
delete from TD_FACT_TABLE where `name` = 'offline_room_tracks_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_stay_user_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_stay_user_cube' );
delete from TD_METRIC where name ='offline_stay_user_cube';
delete from TD_CUBE where name = 'offline_stay_user_cube';
delete from TD_FACT_TABLE where `name` = 'offline_stay_user_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_stay_user_room_day_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_stay_user_room_day_cube' );
delete from TD_METRIC where name ='offline_stay_user_room_day_cube';
delete from TD_CUBE where name = 'offline_stay_user_room_day_cube';
delete from TD_FACT_TABLE where `name` = 'offline_stay_user_room_day_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_new_user_sensor_cube' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_new_user_sensor_cube' );
delete from TD_METRIC where name ='offline_new_user_sensor_cube';
delete from TD_CUBE where name = 'offline_new_user_sensor_cube';
delete from TD_FACT_TABLE where `name` = 'offline_new_user_sensor_cube';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_active_frequency_distribution_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_active_frequency_distribution_counter' );
delete from TD_METRIC where name ='offline_active_frequency_distribution_counter';
delete from TD_CUBE where name = 'offline_active_frequency_distribution_counter';
delete from TD_FACT_TABLE where `name` = 'offline_active_frequency_distribution_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_active_user_room_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_active_user_room_day_counter' );
delete from TD_METRIC where name ='offline_active_user_room_day_counter';
delete from TD_CUBE where name = 'offline_active_user_room_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_active_user_room_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_active_user_room_times_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_active_user_room_times_day_counter' );
delete from TD_METRIC where name ='offline_active_user_room_times_day_counter';
delete from TD_CUBE where name = 'offline_active_user_room_times_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_active_user_room_times_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_enter_new_user_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_enter_new_user_day_counter' );
delete from TD_METRIC where name ='offline_enter_new_user_day_counter';
delete from TD_CUBE where name = 'offline_enter_new_user_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_enter_new_user_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_enter_old_user_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_enter_old_user_day_counter' );
delete from TD_METRIC where name ='offline_enter_old_user_day_counter';
delete from TD_CUBE where name = 'offline_enter_old_user_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_enter_old_user_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_enter_times_distribution_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_enter_times_distribution_counter' );
delete from TD_METRIC where name ='offline_enter_times_distribution_counter';
delete from TD_CUBE where name = 'offline_enter_times_distribution_counter';
delete from TD_FACT_TABLE where `name` = 'offline_enter_times_distribution_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_enter_user_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_enter_user_day_counter' );
delete from TD_METRIC where name ='offline_enter_user_day_counter';
delete from TD_CUBE where name = 'offline_enter_user_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_enter_user_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_enter_user_room_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_enter_user_room_day_counter' );
delete from TD_METRIC where name ='offline_enter_user_room_day_counter';
delete from TD_CUBE where name = 'offline_enter_user_room_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_enter_user_room_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_enter_user_room_times_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_enter_user_room_times_day_counter' );
delete from TD_METRIC where name ='offline_enter_user_room_times_day_counter';
delete from TD_CUBE where name = 'offline_enter_user_room_times_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_enter_user_room_times_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_enter_user_times_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_enter_user_times_day_counter' );
delete from TD_METRIC where name ='offline_enter_user_times_day_counter';
delete from TD_CUBE where name = 'offline_enter_user_times_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_enter_user_times_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_project_user_times_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_project_user_times_counter' );
delete from TD_METRIC where name ='offline_project_user_times_counter';
delete from TD_CUBE where name = 'offline_project_user_times_counter';
delete from TD_FACT_TABLE where `name` = 'offline_project_user_times_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_stay_user_room_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_stay_user_room_day_counter' );
delete from TD_METRIC where name ='offline_stay_user_room_day_counter';
delete from TD_CUBE where name = 'offline_stay_user_room_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_stay_user_room_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_stay_user_room_duration_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_stay_user_room_duration_day_counter' );
delete from TD_METRIC where name ='offline_stay_user_room_duration_day_counter';
delete from TD_CUBE where name = 'offline_stay_user_room_duration_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_stay_user_room_duration_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_stay_user_room_times_day_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_stay_user_room_times_day_counter' );
delete from TD_METRIC where name ='offline_stay_user_room_times_day_counter';
delete from TD_CUBE where name = 'offline_stay_user_room_times_day_counter';
delete from TD_FACT_TABLE where `name` = 'offline_stay_user_room_times_day_counter';
delete from TD_COLUMN where fact_id in (select id from  TD_FACT_TABLE where name='offline_stay_user_room_tracks_counter' );
delete from TD_DIMENSION where cube_id in (select id from  TD_CUBE where name='offline_stay_user_room_tracks_counter' );
delete from TD_METRIC where name ='offline_stay_user_room_tracks_counter';
delete from TD_CUBE where name = 'offline_stay_user_room_tracks_counter';
delete from TD_FACT_TABLE where `name` = 'offline_stay_user_room_tracks_counter';


