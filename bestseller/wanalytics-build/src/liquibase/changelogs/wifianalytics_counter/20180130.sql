--liquibase formatted sql

--changeset junmin.li:1517323157933-1
drop table  offline_active_user_day_counter                    ;
drop table  offline_active_user_duration_day_counter           ;
drop table  offline_active_user_hour_counter                   ;
drop table  offline_active_user_times_day_counter              ;
drop table  offline_enter_user_degree_duration_counter         ;
drop table  offline_enter_user_degree_times_counter            ;
drop table  offline_front_user_day_counter                     ;
drop table  offline_month_metric_counter                       ;
drop table  offline_new_user_day_counter                       ;
drop table  offline_old_user_day_counter                       ;
drop table  offline_project_enter_duration_distribute_counter  ;
drop table  offline_stay_new_user_day_counter                  ;
drop table  offline_stay_old_user_day_counter                  ;
drop table  offline_stay_user_day_counter                      ;
drop table  offline_stay_user_duration_day_counter             ;
drop table  offline_stay_user_project_tracks_counter           ;
drop table  offline_stay_user_times_day_counter                ;
drop table  TD_APMAC_HEART_COUNTER                             ;
drop table  TD_APMAC_EFFECTIVE_COUNTER                         ;
