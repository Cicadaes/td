package td.enterprise.common.azkaban.entity;


/**
 * azkaban 登录响应
 *
 * @author tao.yang
 * @date 2015年7月6日
 */
public class AzkabanUploadProjectZipResponse extends AzkabanResponse {

    /**
     * The error message if the upload attempt fails.
     */
    private String error;
    /**
     * The numerical id of the project
     */
    private String projectId;
    /**
     * The version number of the upload
     */
    private String version;


    /* (non-Javadoc)
     * @see td.enterprise.batchmanager.azkaban.entity.AzkabanResponse#failure()
     */
    public boolean failure() {
        return this.getError() != null && !"".equals(this.getError());
    }

    /* (non-Javadoc)
     * @see td.enterprise.batchmanager.azkaban.entity.AzkabanResponse#error()
     */
    public boolean error() {
        return failure();
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }


}
