export class trafficSourcesModel {
  sourcesnalysisTable: any = [
    { label: 'H5来源分析', value: '1' },
    { label: 'Web来源分析', value: '2' },
    { label: '小程序来源分析', value: '3' }
  ]; //流量来源分析总tab
  //H5来源分析+web来源分析
  checkOptionsanalytic = [
    { label: '推广渠道', value: '_td_utm_source', checked: false, disabled: false, type: true },
    { label: '活动名称', value: '_td_utm_campaign', checked: false, disabled: false, type: true },
    { label: '推广媒介', value: '_td_utm_medium', checked: false, disabled: false, type: true },
    { label: '关键词', value: '_td_utm_term', checked: false, disabled: false, type: true },
    { label: '创意版本', value: '_td_utm_content', checked: false, disabled: false, type: true }
  ]; //分析对象数据
  tabsLists: any = [
    { label: '新访用户数', value: '_td_firstUse' },
    { label: '访问用户数', value: '_td_launch' },
    { label: '人均访问次数', value: '_per_lauch' },
    { label: '人均停留时长', value: '_per_duration' },
    { label: '单次停留时长', value: '_per_launch_duration' }
  ]; //Top10渠道趋势标签页数据
  popovers: any = [
    {
      label: '新访用户数：',
      conter: '在所选时间段内，通过所选流量来源首次访问页面的用户数。'
    },
    {
      label: '访问用户数：',
      conter: '在所选时间段内，通过所选流量来源访问页面的用户数，同一用户多次访问不重复计数。'
    },
    {
      label: '人均访问次数：',
      conter: '在所选时间段内，人均访问页面的次数，即流量来源下全部用户的访问次数/总访问用户数。'
    },
    {
      label: '人均停留时长：',
      conter: '在所选时间段内，每个用户在页面停留时长的均值，即流量来源下全部用户的停留时长/总访问用户数。'
    },
    {
      label: '单次停留时长：',
      conter: ' 在所选时间段内，单次访问页面时长的均值，即流量来源下全部用户的使用时长/总访问次数。'
    }
  ]; //渠道趋势tootip里面的内容
  details: any = [
    {
      label: '新访用户数：',
      conter: '在所选时间段内，通过所选流量来源首次访问页面的用户数。'
    },
    {
      label: '新访用户数占比：',
      conter: '（某流量来源新访用户数/所有流量来源新访用户数）*100%。'
    },
    {
      label: '访问用户数：',
      conter: '在所选时间段内，通过所选流量来源访问页面的用户数，同一用户多次访问不重复计数。'
    },
    {
      label: '访问用户数占比：',
      conter: '（某流量来源访问用户数/所有流量来源访问用户数）*100%。'
    },
    {
      label: '人均访问次数：',
      conter: '在所选时间段内，人均访问页面的次数，即流量来源下全部用户的访问次数/总访问用户数。'
    },
    {
      label: '人均停留时长：',
      conter: '在所选时间段内，每个用户在页面停留时长的均值，即流量来源下全部用户的停留时长/总访问用户数。'
    },
    {
      label: '单次停留时长：',
      conter: '在所选时间段内，单次访问页面时长的均值，即流量来源下全部用户的使用时长/总访问次数。'
    },
    {
      label: '累计访客数：',
      conter: '从集成SDK开始，页面访问流量来源为对应流量来源的用户数。'
    },
    {
      label: '累计访客数占比：',
      conter: '（某流量来源累计访客数/所有流量来源累计访客数）*100%。'
    }
  ]; //明细tootip里面的内容
  tableHeaders: any = [
    { value: '来源名称', label: '来源名称', width: '18%' },
    { value: 'newAdd', label: '新访用户数(%)', width: '12%' },
    { value: 'active', label: '访问用户数(%)', width: '12%' },
    { value: 'launchAvg', label: '人均访问次数', width: '12%' },
    { value: 'durationAvg', label: '人均停留时长', width: '12%' },
    { value: 'durationPer', label: '单次停留时长', width: '12%' },
    { value: 'total', label: '累计访客数(%)', width: '12%' },
    { value: '操作', label: '操作', width: '10%' }
  ]; //图表headerconter
}
