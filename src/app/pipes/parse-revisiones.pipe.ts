import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'parseRevisiones' })
export class ParseRevisionesPipe implements PipeTransform {
  transform(value: any): any[] {
    try {
      const obj = typeof value === 'string' ? JSON.parse(value) : value;
      return obj.revisiones || [];
    } catch {
      return [];
    }
  }
}