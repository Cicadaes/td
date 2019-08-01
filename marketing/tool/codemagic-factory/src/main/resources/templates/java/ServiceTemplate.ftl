package ${bussPackage}.service.${entityPackage};

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import ${baseClassPackage}.service.BaseService;
import ${bussPackage}.dao.${entityPackage}.${className}Dao;
import ${bussPackage}.entity.${entityPackage}.${className};
#if($pkColumnCount > 1)
import ${bussPackage}.entity.${entityPackage}.${className}Key;
#end


/**
 *
 * <br>
 * <b>功能：</b>${codeName} ${className}Service<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> ${currentDate} <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("$!{lowerName}Service")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ${className}Service extends BaseService<${className}, #if($pkColumnCount == 0)Void#elseif($pkColumnCount == 1)${pkColumn.shortDataType}#else${className}Key#end> {

    private static final Logger logger = LoggerFactory.getLogger(${className}Service.class);

    @Autowired
    private ${className}Dao dao;

    public ${className}Dao getDao() {
        return dao;
    }

}
