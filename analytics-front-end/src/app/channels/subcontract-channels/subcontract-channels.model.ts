export class subcontractChannelsModel {
  tabsLists: any = [
    { label: '新增用户数', value: '_td_firstUse' },
    { label: '活跃用户数', value: '_td_launch' },
    { label: '人均启动次数', value: '_per_lauch' },
    { label: '人均使用时长', value: '_per_duration' },
    { label: '单次使用时长', value: '_per_launch_duration' }
  ]; //Top10渠道趋势标签页数据
  popovers: any = [
    {
      label: '新增用户数：',
      conter:
        '在所选时间段内，首次打开从分包渠道下载安装的应用的设备数。卸载后通过其他分包渠道安装启动或通过其他分包渠道进行了包升级，不变更用户的新增渠道。即新增用户数按照同一个APP下最初的安装渠道去计算'
    },
    {
      label: '活跃用户数：',
      conter: '在所选时间段内，通过分包渠道（不限定为新增渠道），至少启动过一次应用的设备数。'
    },
    {
      label: '人均启动次数：',
      conter: '在所选时间段内，人均启动应用的次数，即分包渠道下（不限定为新增渠道）全部用户的启动次数/总活跃用户数。'
    },
    {
      label: '人均使用时长：',
      conter:
        '在所选时间段内，每个用户使用时长的均值，即分包渠道下（不限定为新增渠道）全部用户的使用时长/总活跃用户数。'
    },
    {
      label: '单次使用时长：',
      conter: '在所选时间段内，单次使用时长的均值，即分包渠道下（不限定为新增渠道）全部用户的使用时长/总启动次数。'
    }
  ]; //渠道趋势tootip里面的内容
  details: any = [
    {
      label: '新增用户数：',
      conter:
        '在所选时间段内，首次打开从分包渠道下载安装的应用的设备数。卸载后通过其他分包渠道安装启动或通过其他分包渠道进行了包升级，不变更用户的新增渠道。即新增用户数按照同一个APP下最初的安装渠道去计算。'
    },
    {
      label: '新增用户数占比：',
      conter: '（某分包渠道新增用户数/所有分包渠道新增用户数）*100%。'
    },
    {
      label: '活跃用户数：',
      conter: '在所选时间段内，通过分包渠道（不限定为新增渠道），至少启动过一次应用的设备数。'
    },
    {
      label: '活跃用户数占比：',
      conter: '（某分包渠道活跃用户数/所有分包渠道活跃用户数）*100%。'
    },
    {
      label: '人均启动次数：',
      conter: '在所选时间段内，人均启动应用的次数，即分包渠道下（不限定为新增渠道）全部用户的启动次数/总活跃用户数。'
    },
    {
      label: '人均使用时长：',
      conter:
        '在所选时间段内，每个用户使用时长的均值，即分包渠道下（不限定为新增渠道）全部用户的使用时长/总活跃用户数。'
    },
    {
      label: '单次使用时长：',
      conter: '在所选时间段内，单次使用时长的均值，即分包渠道下（不限定为新增渠道）全部用户的使用时长/总启动次数。'
    },
    {
      label: '累计用户数：',
      conter: '从集成SDK开始，应用首次安装渠道为对应分包渠道的设备总量。累计用户数按照同一个APP下最初的安装渠道去计算。'
    },
    {
      label: '累计用户数占比：',
      conter: '（某分包渠道累计用户数/所有分包渠道累计用户数）*100%。'
    }
  ]; //明细tootip里面的内容
  tableHeaders: any = [
    { value: '渠道名称', label: '渠道名称', width: '18%' },
    { value: 'newAdd', label: '新增用户数(%)', width: '12%' },
    { value: 'active', label: '活跃用户数(%)', width: '12%' },
    { value: 'launchAvg', label: '人均启动次数', width: '12%' },
    { value: 'durationAvg', label: '人均使用时长', width: '12%' },
    { value: 'durationPer', label: '单次使用时长', width: '12%' },
    { value: 'total', label: '累计用户数(%)', width: '12%' },
    { value: '操作', label: '操作', width: '10%' }
  ]; //图表headerconter
}