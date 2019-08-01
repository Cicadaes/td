import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'sexLabel' })
export class sexLabelPipe implements PipeTransform {
  transform(value: any): string {
    let str: string = ''
    if (value == -1 || value === null) {
      str = ''
    } else if(value == 0){
      // str = (value == 0) ? '女' : '男'
      str = '女'
    }else if(value == 1){
      str = '男'
    }else{
      str = ''
    }
    return str
  }
}
