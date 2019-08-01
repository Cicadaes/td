
const LEGEND = {
  right: 8,
  top: 0,
  itemWidth: 16,
  itemHeight: 4,
  padding: 0,
  itemGap: 20,
  borderRadius: 2,
  icon: 'roundRect',
  textStyle: {
    fontSize: 12,
    color: '#495060',
    fontFamily: 'PingFangSC-Regular',
  },
  formatter(name: string) {
    let value = name;
    if (name.length > 5) {
      value = name.slice(0, 5) + '...';
    }
    return value;
  },
};

export default LEGEND;
