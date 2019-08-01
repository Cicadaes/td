package com.talkingdata.wifianalytics.offline.compute.job;

import org.apache.commons.lang3.StringUtils;

/**
 * Created by loong on 4/26/16.
 */
public class JobParameter {

    private String jobName;
    private String date;
    private int dateInterval;
    private String tenantId;
    private int projectId;
    private int placeId;
    private int roomId;
    private int sensorId;

    public static JobParameter build(String[] args) {
        JobParameter jobParameter = new JobParameter();
        jobParameter.jobName = args[0];
        jobParameter.date = args[1];
        jobParameter.dateInterval = Integer.parseInt(args[2]);
        if (args.length > 3 && StringUtils.isNotBlank(args[3])) {
            jobParameter.tenantId = args[3];
        }

        if (args.length > 4 && StringUtils.isNotBlank(args[4])) {
            jobParameter.projectId = Integer.parseInt(args[4]);
        }

        if (args.length > 5 && StringUtils.isNotBlank(args[5])) {
            jobParameter.placeId = Integer.parseInt(args[5]);
        }

        if (args.length > 6 && StringUtils.isNotBlank(args[6])) {
            jobParameter.sensorId = Integer.parseInt(args[6]);
        }
        
        if (args.length > 7 && StringUtils.isNotBlank(args[7])) {
            jobParameter.roomId = Integer.parseInt(args[7]);
        }

        return jobParameter;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public int getDateInterval() {
        return dateInterval;
    }

    public void setDateInterval(int dateInterval) {
        this.dateInterval = dateInterval;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public int getPlaceId() {
        return placeId;
    }

    public void setPlaceId(int placeId) {
        this.placeId = placeId;
    }

    public int getSensorId() {
        return sensorId;
    }

    public void setSensorId(int sensorId) {
        this.sensorId = sensorId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

	public int getRoomId() {
		return roomId;
	}

	public void setRoomId(int roomId) {
		this.roomId = roomId;
	}

	@Override
	public String toString() {
		return "jobName:"+jobName+", date:"+date+", dateInterval:"+dateInterval+", tenantId:"+tenantId+",projectId:"+projectId+", placeId:"+placeId+",roomId:"+roomId+", sensorId:"+sensorId;
	}

	
	
	
    
}
