import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'consolidadoTable' })
export class ConsolidadoTablePipe implements PipeTransform {
  transform(informeData: any): any[] {
    const result: any[] = [];

    // Helper para extraer criterios de cada dimensión
    function extractDimension(dimName: string, evaluacionArr: any[]): void {
      if (!evaluacionArr || !evaluacionArr.length) return;
      const argsStr = evaluacionArr[0]?.required_action?.submit_tool_outputs?.tool_calls[0]?.function?.arguments;
      if (!argsStr) return;
      let args: any;
      try {
        args = typeof argsStr === 'string' ? JSON.parse(argsStr) : argsStr;
      } catch {
        return;
      }
      if (!args?.puntajes_criterios) return;
      args.puntajes_criterios.forEach((crit: any) => {
        result.push({
          dimension: dimName,
          peso_dimension: args.peso_dimension,
          puntaje_dimension: args.puntaje_dimension,
          criterio: crit.criterio,
          peso_criterio: crit.peso_criterio,
          puntaje_criterio: crit.puntaje_criterio
        });
      });
    }

    extractDimension('Ambiental', informeData.EvaluacionAmbiental);
    extractDimension('Social', informeData.EvaluacionSocial);
    extractDimension('Económica', informeData.EvaluacionEconomica);

    return result;
  }
}