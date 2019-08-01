--liquibase formatted sql

--changeset junmin.li:1497407008268-1
drop table active_user_room_day_cube ;
drop table enter_new_user_day_cube;
drop table enter_old_user_day_cube;
drop table enter_user_day_cube;
drop table enter_user_room_day_cube;
drop table offline_active_user_hour_cube;
drop table offline_active_user_room_day_cube;
drop table offline_enter_user_cube;
drop table offline_enter_user_room_day_cube;
drop table offline_old_user_sensor_cube;
drop table offline_room_tracks_cube;
drop table offline_stay_user_cube;
drop table offline_stay_user_room_day_cube;
drop table offline_new_user_sensor_cube;

