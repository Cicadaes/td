package com.talkingdata.datacloud.entity.report;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Created by yashiro on 17/2/27.
 */
public class ProjectDesc {

    public String uuid;

    public String version;

    public Long last_modified;

    public String name;

    public List<TableDesc> tables;

    public String owner;

    public String status;

    public Long create_time_utc;

    public Long last_update_time;

    public String description;

    public List<Realization> realizations;

    public List<ModelDesc> models;

    public List<Object> ext_filters;

    public List<CubeDesc> cubes;

    public List<CubeDesc> getCubes() {
        return cubes;
    }

    public void setCubes(List<CubeDesc> cubes) {
        this.cubes = cubes;
    }

    public List<TableDesc> getTables() {
        return tables;
    }

    public void setTables(List<TableDesc> tables) {
        this.tables = tables;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ModelDesc> getModels() {
        return models;
    }

    public void setModels(List<ModelDesc> models) {
        this.models = models;
    }

    @JsonCreator
    public ProjectDesc(
            @JsonProperty("uuid")
                    String uuid,
            @JsonProperty("version")
                    String version,
            @JsonProperty("last_modified")
                    Long last_modified,
            @JsonProperty("name")
                    String name,
            @JsonProperty("tables")
                    List<TableDesc> tables,
            @JsonProperty("owner")
                    String owner,
            @JsonProperty("status")
                    String status,
            @JsonProperty("create_time_utc")
                    Long create_time_utc,
            @JsonProperty("last_update_time")
                    Long last_update_time,
            @JsonProperty("description")
                    String description,
            @JsonProperty("realizations")
                    List<Realization> realizations,
            @JsonProperty("models")
                    List<ModelDesc> models,
            @JsonProperty("ext_filters")
                    List<Object> ext_filters) {
        this.uuid = uuid;
        this.version = version;
        this.last_modified = last_modified;
        this.name = name;
        this.tables = tables;
        this.owner = owner;
        this.status = status;
        this.create_time_utc = create_time_utc;
        this.last_update_time = last_update_time;
        this.description = description;
        this.realizations = realizations;
        this.models = models;
        this.ext_filters = ext_filters;
    }

    public static class Realization {

        public final String type;

        public final String realization;

        @JsonCreator
        public Realization(
                @JsonProperty("type")
                        String type,
                @JsonProperty("realization")
                        String realization) {
            this.type = type;
            this.realization = realization;
        }

    }


}

