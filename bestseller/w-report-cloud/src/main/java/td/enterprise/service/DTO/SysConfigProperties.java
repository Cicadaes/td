package td.enterprise.service.DTO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SysConfigProperties {
    @Value("${appcode}")
    private String appcode;
    @Value("${apptaken}")
    private String apptaken;

    @Value("${manifest-build-version}")
    private String manifest_build_version;

    public String getAppcode() {
        return appcode;
    }

    public void setAppcode(String appcode) {
        this.appcode = appcode;
    }

    public String getApptaken() {
        return apptaken;
    }

    public void setApptaken(String apptaken) {
        this.apptaken = apptaken;
    }

    public String getManifest_build_version() {
        return manifest_build_version;
    }

    public void setManifest_build_version(String manifest_build_version) {
        this.manifest_build_version = manifest_build_version;
    }
}
