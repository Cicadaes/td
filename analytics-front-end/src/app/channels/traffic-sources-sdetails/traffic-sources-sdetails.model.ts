export class trafficSourcesSdetailsModel {
  tabsLists: any = [
    { label: '新访用户数', value: '_td_firstUse' },
    { label: '访问用户数', value: '_td_launch' },
    { label: '人均访问次数', value: '_per_lauch' },
    { label: '人均停留时长', value: '_per_duration' },
    { label: '单次停留时长', value: '_per_launch_duration' }
  ]; //Top10来源趋势标签页数据
  appletTabsLists: any = [
    { label: '新访用户数', value: '_td_firstUse' },
    { label: '访问用户数', value: '_td_launch' },
    { label: '人均打开次数', value: '_per_lauch' },
    { label: '人均停留时长', value: '_per_duration' },
    { label: '次均停留时长', value: '_per_launch_duration' }
  ]; //小程序Top10来源趋势标签页数据
  dataoverviews: any = [
    {
      label: '新访用户数',
      value: '新访用户数：在所选时间段内，通过所选流量来源首次访问页面的用户数。'
    },
    {
      label: '访问用户数',
      value: '在所选时间段内，通过所选流量来源访问页面的用户数，同一用户多次访问不重复计数。'
    },
    {
      label: '人均访问次数',
      value: '在所选时间段内，人均访问页面的次数，即流量来源下全部用户的访问次数/总访问用户数。'
    },
    {
      label: '人均停留时长',
      value: '在所选时间段内，每个用户在页面停留时长的均值，即流量来源下全部用户的停留时长/总访问用户数。'
    },
    {
      label: '单次停留时长',
      value: '在所选时间段内，单次访问页面时长的均值，即流量来源下全部用户的使用时长/总访问次数。'
    },
    {
      label: '累计访客数',
      value: '从集成SDK开始，页面访问流量来源为对应流量来源的用户数。'
    }
  ]; //数据概览tootip里面的内容
  appletDataoverviews: any = [
    {
      label: '新访用户数',
      value: '在所选时间段内，通过所选流量来源首次访问小程序页面的用户数。'
    },
    {
      label: '访问用户数',
      value: '在所选时间段内，通过所选流量来源访问小程序页面的用户数，同一用户多次访问不重复计数。'
    },
    {
      label: '人均打开次数',
      value:
        '在所选时间段内，用户人均打开小程序的次数，即流量来源下全部用户的打开次数/总访问用户数，用户从打开小程序到主动关闭小程序或超时退出计为一次。'
    },
    {
      label: '人均停留时长',
      value: '在所选时间段内，平均每个用户停留在小程序页面的总时长，即流量来源下全部用户小程序停留总时长/总访问用户数。'
    },
    {
      label: '次均停留时长',
      value: '在所选时间段内，平均每次打开小程序停留在小程序页面的总时长，即流量来源下小程序停留总时长/打开次数。'
    },
    {
      label: '累计访客数',
      value: '从集成SDK开始，历史累计访问小程序的来源为对应流量来源的用户数，同一用户多次访问不重复计。'
    }
  ]; //小程序数据概览tootip里面的内容
  tableHeaders: any = [
    { value: '日期', label: '日期' },
    { value: '新访用户数', label: '新访用户数' },
    { value: '访问用户数', label: '访问用户数' },
    { value: '人均访问次数', label: '人均访问次数' },
    { value: '人均停留时长', label: '人均停留时长' },
    { value: '单次停留时长', label: '单次停留时长' }
  ]; //图表headerconter
  appletTableHeaders: any = [
    { value: '日期', label: '日期' },
    { value: '新访用户数', label: '新访用户数' },
    { value: '访问用户数', label: '访问用户数' },
    { value: '人均打开次数', label: '人均打开次数' },
    { value: '次均停留时长', label: '次均停留时长' },
    { value: '单次停留时长', label: '单次停留时长' }
  ]; //小程序图表headerconter
}
