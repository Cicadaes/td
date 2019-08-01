package com.talkingdata.datacloud.exception;

/**
 * Created by yashiro on 16/6/29.
 */
public class HttpStatusException extends RuntimeException {

  private static final long serialVersionUID = -7259381434228279782L;

  private int statusCode;

  public int getStatusCode() {
    return statusCode;
  }

  public void setStatusCode(int statusCode) {
    this.statusCode = statusCode;
  }

  public HttpStatusException() {}

  public HttpStatusException(int statusCode) {
    this.statusCode = statusCode;
  }

  public HttpStatusException(Exception e) {
    super(e);
  }

  public HttpStatusException(String message) {
    super(message);
  }

  @Override
  public String getMessage() {
    String statusCode = "Status outputCode:" + getStatusCode();
    String msg = super.getMessage();
    if (msg != null) {
      msg += statusCode;
    } else
      msg = statusCode;
    return msg;
  }

}
