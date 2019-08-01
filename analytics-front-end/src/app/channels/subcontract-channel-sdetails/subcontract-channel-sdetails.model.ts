export class subcontractChannelSdetailsModel {
  tabsLists: any = [
    { label: '新增用户数', value: '_td_firstUse' },
    { label: '活跃用户数', value: '_td_launch' },
    { label: '人均启动次数', value: '_per_lauch' },
    { label: '人均使用时长', value: '_per_duration' },
    { label: '单次使用时长', value: '_per_launch_duration' }
  ]; //Top10渠道趋势标签页数据
  dataoverviews: any = [
    {
      label: '新增用户数',
      value:
        '在所选时间段内，首次打开从分包渠道下载安装的应用的设备数。卸载后通过其他分包渠道安装启动或通过其他分包渠道进行了包升级，不变更用户的新增渠道。即新增用户数按照同一个APP下最初的安装渠道去计算。'
    },
    {
      label: '活跃用户数',
      value: '在所选时间段内，通过分包渠道（不限定为新增渠道），至少启动过一次应用的设备数。'
    },
    {
      label: '人均启动次数',
      value: '在所选时间段内，人均启动应用的次数，即分包渠道下（不限定为新增渠道）全部用户的启动次数/总活跃用户数。'
    },
    {
      label: '人均使用时长',
      value: '在所选时间段内，每个用户使用时长的均值，即分包渠道下（不限定为新增渠道）全部用户的使用时长/总活跃用户数。'
    },
    {
      label: '单次使用时长',
      value: '在所选时间段内，单次使用时长的均值，即分包渠道下（不限定为新增渠道）全部用户的使用时长/总启动次数。'
    },
    {
      label: '累计用户数',
      value: '从集成SDK开始，应用首次安装渠道为对应分包渠道的设备总量。累计用户数按照同一个APP下最初的安装渠道去计算。'
    }
  ]; //数据概览tootip里面的内容
  tableHeaders: any = [
    { value: '日期', label: '日期' },
    { value: '新增用户数', label: '新增用户数' },
    { value: '活跃用户数', label: '活跃用户数' },
    { value: '人均启动次数', label: '人均启动次数' },
    { value: '人均使用时长', label: '人均使用时长' },
    { value: '单次使用时长', label: '单次使用时长' }
  ]; //图表headerconter
  retention = [
    {
      label: '新用户N日留存率：',
      conter: '某日新增用户在之后第N日活跃过的用户比例。某日新增后第N日活跃的用户数/该日新增用户数。'
    },
    {
      label: '活跃用户N日留存率：',
      conter: '某日新活跃用户在之后第N日活跃过的用户比例。某日活跃后第N日活跃的用户数/该日活跃用户数。'
    }
  ]; //留存率tootip
  retentionHeaders: any = [
    { value: '首次使用日', label: '首次使用日' },
    { value: '用户数', label: '用户数' },
    { value: '+1日', label: '+1日' },
    { value: '+2日', label: '+2日' },
    { value: '+3日', label: '+3日' },
    { value: '+4日', label: '+4日' },
    { value: '+5日', label: '+5日' },
    { value: '+6日', label: '+6日' },
    { value: '+7日', label: '+7日' },
    { value: '+14日', label: '+14日' },
    { value: '+30日', label: '+30日' }
  ]; //留存率headerconter
}
