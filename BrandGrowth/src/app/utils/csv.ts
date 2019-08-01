
const newLine = '\r\n';
const appendLine = (content: any, row: any, { separator, quoted }: any) => {
  const line = row.map((data: any) => {
    if (!quoted) return data;
    // quote data
    data = typeof data === 'string' ? data.replace(/"/g, '"') : data;
    return `"${data}"`;
  });
  content.push(line.join(separator));
};

const defaults = {
  separator: ',',
  quoted: false
};

export default function csv(columns: any, datas: any, options: any, noHeader = false) {
  options = Object.assign({}, defaults, options);
  let columnOrder: any;
  const content: any = [];
  const column: any = [];

  if (columns) {
    columnOrder = columns.map((v: any) => {
      if (typeof v === 'string') return v;
      if (!noHeader) {
        column.push(typeof v.title !== 'undefined' ? v.title : v.key);
      }
      return v.key;
    });
    if (column.length > 0) appendLine(content, column, options);
  } else {
    columnOrder = [];
    datas.forEach((v: any) => {
      if (!Array.isArray(v)) {
        columnOrder = columnOrder.concat(Object.keys(v));
      }
    });
    if (columnOrder.length > 0) {
      columnOrder = columnOrder.filter((value: any, index: any, self: any) => self.indexOf(value) === index);
      if (!noHeader) appendLine(content, columnOrder, options);
    }
  }

  if (Array.isArray(datas)) {
    datas.forEach(row => {
      if (!Array.isArray(row)) {
        row = columnOrder.map((k: any) => (typeof row[k] !== 'undefined' ? row[k] : ''));
      }
      appendLine(content, row, options);
    });
  }
  return content.join(newLine);
}