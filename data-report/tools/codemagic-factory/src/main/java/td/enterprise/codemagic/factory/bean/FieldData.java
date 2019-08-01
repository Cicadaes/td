package td.enterprise.codemagic.factory.bean;

import java.util.List;

public class FieldData {
    private String type;
    private String name;
    private String comment;
    
    private List<String> importJavaTypes;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<String> getImportJavaTypes() {
        return importJavaTypes;
    }

    public void setImportJavaTypes(List<String> importJavaTypes) {
        this.importJavaTypes = importJavaTypes;
    }
}
