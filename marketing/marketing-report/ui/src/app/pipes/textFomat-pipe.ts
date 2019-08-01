import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'textFomat'})
export class TextFomatPipe implements PipeTransform {
    transform(data: string): string {
       return data.replace('-1%', '118%');
    }
}