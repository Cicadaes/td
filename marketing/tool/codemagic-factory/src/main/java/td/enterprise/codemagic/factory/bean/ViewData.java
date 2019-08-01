package td.enterprise.codemagic.factory.bean;

public class ViewData {
    private String title;
    private boolean filter = false;
    private boolean searchResult = false;
    private boolean form = false;
    private String formatter;
    private String dictionary;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isFilter() {
        return filter;
    }

    public void setFilter(boolean filter) {
        this.filter = filter;
    }

    public boolean isSearchResult() {
        return searchResult;
    }

    public void setSearchResult(boolean searchResult) {
        this.searchResult = searchResult;
    }

    public boolean isForm() {
        return form;
    }

    public void setForm(boolean form) {
        this.form = form;
    }

    public String getFormatter() {
        return formatter;
    }

    public void setFormatter(String formatter) {
        this.formatter = formatter;
    }

    public String getDictionary() {
        return dictionary;
    }

    public void setDictionary(String dictionary) {
        this.dictionary = dictionary;
    }
}
