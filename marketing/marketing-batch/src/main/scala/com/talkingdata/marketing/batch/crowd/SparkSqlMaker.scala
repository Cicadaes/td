package com.talkingdata.marketing.batch.crowd

import com.talkingdata.marketing.batch.dao.PipelineCrowdDao
import org.apache.spark.sql.{DataFrame, SparkSession}

class SparkSqlMaker(sparkSession: SparkSession) extends Serializable {

  import sparkSession.sql

  /**
    * 获取去重查询结果，并转换为DataFrame
    *
    * @return
    */
  def createOrReplaceTempView(hql: String, tableName: String): DataFrame = {
    val crowdGroupDf = sql(hql).distinct()
    crowdGroupDf.createOrReplaceTempView(tableName)
    crowdGroupDf.show(10) //test
    crowdGroupDf
  }

}

object SparkSqlMaker { //静态类

  def apply(sparkSession: SparkSession): SparkSqlMaker = {
    new SparkSqlMaker(sparkSession)
  }

  def commonQueryHql(tableName: String): String = {
    val hql = "select * from " + tableName
    hql
  }

  def crowdUserHql(crowdTable: String, mapTableCode: String, mapTableColumn: String): String = {
    val crowdProfileHql =
      " select c.pipeline_id, c.crowd_id, max(m." + mapTableColumn + ") as user_id " + //确保每个user的profile唯一
        " from " + crowdTable + " c " +
        " left join " + mapTableCode + " m " +
        " on c.offset = m.offset " +
        " group by c.pipeline_id, c.crowd_id "

    crowdProfileHql
  }

  def crowdProfileHql(): String = {
    val crowdProfileHql =
      " select cu.pipeline_id, cu.crowd_id, cu.user_id, max(pr.attributes) as profile_attributes " + //max确保每个user的profile唯一
        " from " + SqlConstants.CROWD_USER_DF + " cu " +
        " left join " + SqlConstants.USER_PROFILE_DF + " pr " +
        " on cu.user_id = pr.user_id " +
        " group by cu.pipeline_id, cu.crowd_id, cu.user_id "

    crowdProfileHql
  }

  def crowdProfileLogHql(): String = {
    val crowdProfileLogHql =
      " select p.pipeline_id, p.crowd_id, p.user_id, p.profile_attributes, l.attributes as log_attributes" +
        " from " + SqlConstants.CROWD_PROFILE_DF + " p " +
        " left join " + SqlConstants.USER_LOG_ALL_DF + " l " +
        " on p.user_id = l.user_id "
    crowdProfileLogHql
  }

  def crowdGroupHql(): String = {
    val crowdGroupHql =
      " select pl.pipeline_id, pl.crowd_id, pl.user_id, pl.profile_attributes, collect_list(pl.log_attributes) as log_attributes_list" +
        " from " + SqlConstants.CROWD_PROFILE_LOG_DF + " pl " +
        " group by pl.pipeline_id, pl.crowd_id, pl.user_id, pl.profile_attributes "
    crowdGroupHql
  }

  /**
    * 获取带有条件的sql语句
    *
    * @param table
    * @param where
    * @return
    */
  def getQuerySqlWithWhere(table: String, where: String): String = {
    var whereValue = " where 1 = 1 "
    if (where != null) {
      whereValue += (" and " + where)
    }
    val querySql = "(select * from " + table + whereValue + " ) t"
    querySql
  }

  /**
    * 获取活动和pipeline映射关系sql语句
    *
    * @return
    */
  def getCampaignPipelineMapSql(): String = {
    val querySql = " (SELECT DISTINCT campaign_id, pipeline_id " +
      " FROM TD_MKT_PIPELINE_CROWD_REL " +
      " WHERE (calc_status = " + PipelineCrowdDao.FAIL_CALC_STATUS + " OR calc_status = " + PipelineCrowdDao.WAIT_CALC_STATUS + ") " +
      " AND (calc_type = " + PipelineCrowdDao.CALC_TYPE_PERIOD + " OR calc_type = " + PipelineCrowdDao.CALC_TYPE_NEVER + ")) m"
    querySql
  }
}