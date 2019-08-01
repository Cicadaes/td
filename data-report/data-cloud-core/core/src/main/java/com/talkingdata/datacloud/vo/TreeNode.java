package com.talkingdata.datacloud.vo;

import java.util.*;

/**
 * 这是前端的树框架定义的类，要实现最简单的功能只需要`label`和`children`即可。
 * 
 * @author yizhu.sun 2017年1月4日
 */
public class TreeNode implements Comparable<TreeNode> {

    /** Label of the node. `label`是实际显示在前端树上的名字 */
    private String label;
    /** Data represented by the node. `data`是一些附加信息，前端可能需要 */
    private TreeNodeData data = new TreeNodeData();
    /** Icon of the node to display next to content. */
    private String icon;
    /** Icon to use in expanded state. */
    private String expandedIcon;
    /** Icon to use in collapsed state. */
    private String collapsedIcon;
    /** An array of treenodes as children. */
    private List<TreeNode> children;
    /** Specifies if the node has children. Used in lazy loading. */
    private Boolean leaf;
    /** Inline style of the node. */
    private String style;
    /** Style class of the node. */
    private String styleClass;
    /** Whether the node is in an expanded or collapsed state. */
    private Boolean expanded;
    /** Type of the node to match template type. */
    private String type;
    /** Parent of the node. */
    private TreeNode parent;

    public void addChild(TreeNode node) {
        if (children == null) {
            children = new ArrayList<>();
        }
        children.add(node);
//        node.getData().permissions.addAll(getData().permissions); // 权限继承
    }

    public TreeNode addUpdatePermission() {
        if (!getData().permissions.contains(Permission.UPDATE)) {
            getData().permissions.add(Permission.UPDATE);
        }
        return this;
    }

    public TreeNode addDeletePermission() {
        if (!getData().permissions.contains(Permission.DELETE)) {
            getData().permissions.add(Permission.DELETE);
        }
        return this;
    }

    public TreeNode addCreateSubCatalogPermission() {
        if (!getData().permissions.contains(Permission.CREATE_SUB_CATALOG)) {
            getData().permissions.add(Permission.CREATE_SUB_CATALOG);
        }
        return this;
    }

    public TreeNode addCreateDatasetPermission() {
        if (!getData().permissions.contains(Permission.CREATE_DATASET)) {
            getData().permissions.add(Permission.CREATE_DATASET);
        }
        return this;
    }

    public TreeNode addGrantPermission() {
        if (!getData().permissions.contains(Permission.GRANT)) {
            getData().permissions.add(Permission.GRANT);
        }
        return this;
    }

    public TreeNode addReadPermission() {
        if (!getData().permissions.contains(Permission.READ)) {
            getData().permissions.add(Permission.READ);
        }
        return this;
    }

    public TreeNode addRefreshPermission() {
        if (!getData().permissions.contains(Permission.REFRESH)) {
            getData().permissions.add(Permission.REFRESH);
        }
        return this;
    }

    public TreeNode removeUpdatePermission() {
        getData().permissions.remove(Permission.UPDATE);
        return this;
    }

    public TreeNode removeDeletePermission() {
        getData().permissions.remove(Permission.DELETE);
        return this;
    }

    public TreeNode removeCreateSubCatalogPermission() {
        getData().permissions.remove(Permission.CREATE_SUB_CATALOG);
        return this;
    }

    public TreeNode removeCreateDatasetPermission() {
        getData().permissions.remove(Permission.CREATE_DATASET);
        return this;
    }

    public TreeNode removeGrantPermission() {
        getData().permissions.remove(Permission.GRANT);
        return this;
    }

    public TreeNode removeReadPermission() {
        getData().permissions.remove(Permission.READ);
        return this;
    }

    public TreeNode removeRefreshPermission() {
        getData().permissions.remove(Permission.REFRESH);
        return this;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public TreeNodeData getData() {
        return data;
    }

    public void setData(TreeNodeData data) {
        this.data = data;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getExpandedIcon() {
        return expandedIcon;
    }

    public void setExpandedIcon(String expandedIcon) {
        this.expandedIcon = expandedIcon;
    }

    public String getCollapsedIcon() {
        return collapsedIcon;
    }

    public void setCollapsedIcon(String collapsedIcon) {
        this.collapsedIcon = collapsedIcon;
    }

    public List<TreeNode> getChildren() {
        return children;
    }

    public void setChildren(List<TreeNode> children) {
        this.children = children;
    }

    public Boolean getLeaf() {
        return leaf;
    }

    public void setLeaf(Boolean leaf) {
        this.leaf = leaf;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getStyleClass() {
        return styleClass;
    }

    public void setStyleClass(String styleClass) {
        this.styleClass = styleClass;
    }

    public Boolean getExpanded() {
        return expanded;
    }

    public void setExpanded(Boolean expanded) {
        this.expanded = expanded;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public TreeNode getParent() {
        return parent;
    }

    public void setParent(TreeNode parent) {
        this.parent = parent;
    }

    public class TreeNodeData {
        private Integer id = 0;
        private String path;
        private String fullPath;
        private String suffix;
        private Integer datasetId = 0;
        private List<Permission> permissions = new ArrayList<>();

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public String getSuffix() {
            return suffix;
        }

        public void setSuffix(String suffix) {
            this.suffix = suffix;
        }

        public Integer getDatasetId() {
            return datasetId;
        }

        public void setDatasetId(Integer datasetId) {
            this.datasetId = datasetId;
        }

        public String getFullPath() {
            return fullPath;
        }

        public void setFullPath(String fullPath) {
            this.fullPath = fullPath;
        }

        public List<String> getPermissions() {
            List<String> permissionStrs = new ArrayList<>();
            for (Permission p : permissions) {
                permissionStrs.add(p.name().toLowerCase());
            }
            return permissionStrs;
        }

    }

    public enum Permission {
        UPDATE,
        DELETE,
        CREATE_SUB_CATALOG,
        REFRESH,
        CREATE_DATASET,
        GRANT,
        READ
    }

    @Override
    public int compareTo(TreeNode o) {
        int folderCompare = isFolder().compareTo(o.isFolder());
        if (folderCompare == 0) {
            return label.compareTo(o.label);
        } else {
            return -folderCompare;
        }
    }
    
    private Boolean isFolder() {
        if (leaf == null) {
            return data.datasetId == null || data.datasetId == 0;
        } else {
            return !leaf;
        }
    }

}
