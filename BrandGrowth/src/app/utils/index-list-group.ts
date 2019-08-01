/**
 * 生成媒体列表的索引 数据结构
 */
export const indexGroupTab = (hasAll: any) => {
  const mediaIndex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const indexGroup: any = [];

  if (hasAll) {
    indexGroup.unshift({
      isSelected: false,
      name: '全部',
      children: (() => {
        const set = {};
        mediaIndex.split('').forEach((item) => {
          set[item] = [];
        });
        return set;
      })(),
      list: mediaIndex.split(''),
      itemList: [],
    });
  }

  const splitPoints = [0, 7, 14, 20, 26];
  splitPoints.forEach((point, index) => {
    const groupItem: any = {
      isSelected: false,
      name: '',
      children: {},
      list: [],
      itemList: [],
    };
    const start = point;
    const end = splitPoints[index + 1] || undefined;
    groupItem.list = mediaIndex.substring(start, end).split('');

    groupItem.list.forEach((indexItem: any) => {
      groupItem.children[indexItem] = [];
    });

    groupItem.name = groupItem.list.join('');

    if (point === 26) {
      groupItem.name = '0-9';
    }

    indexGroup.push(groupItem);
  });

  return indexGroup;
};
