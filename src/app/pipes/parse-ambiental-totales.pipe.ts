import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'parseAmbientalTotales' })
export class ParseAmbientalTotalesPipe implements PipeTransform {
  transform(value: string): any {
    try {
      const obj = JSON.parse(value);
      return {
        peso_dimension: obj.peso_dimension,
        puntaje_dimension: obj.puntaje_dimension,
        puntajes_criterios: obj.puntajes_criterios
      };
    } catch {
      return {};
    }
  }
}