package com.talkingdata.wifianalytics.etl.support.config;

import com.talkingdata.wifianalytics.etl.support.exception.NoSuchCrowdTypeException;
import com.talkingdata.wifianalytics.etl.support.factory.*;

/**
 * Created by loong on 4/28/16.
 */
public enum CrowdType {
    AU, OU, NU, CU, TU;


    public OffLineDataFactory getFactory() {
        switch (this) {
            case AU:
                return new ActiveUserDataFactory();
            case TU:
                return new ActiveUserDataFactory();
            case OU:
                return new OldUserDataFactory();
            case NU:
                return new NewUserDataFactory();
            case CU:
                return new TenantImportUserFactory();
        }
        throw new NoSuchCrowdTypeException();
    }
}
