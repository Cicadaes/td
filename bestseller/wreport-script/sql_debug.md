###客源概览，top10店铺，有效客流
http://172.23.5.108/wifianalytics-queryengine/
r30223=select * from enterprise.offline_active_user_day_counter where  project_id in (8001,1,13,7,11,8,9,10)   group by date,project_id order by date desc;

###用于早上重试
http://localhost/wreport_new/api/projectDist/queryTop?chartCatagory=avarage&chartType=active&endDate=2017-06-30&projectId=8000&startDate=2017-06-01