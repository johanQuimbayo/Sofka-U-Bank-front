import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampFormat'
})
export class TimestampFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // Crear una nueva fecha a partir del timestamp
    const date = new Date(value);

    // Obtener el año, mes, día, hora y minutos
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);  // +1 porque los meses empiezan en 0
    const day = ('0' + date.getUTCDate()).slice(-2);
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);

    // Formato "YYYY-MM-DD HH:mm"
    return `${year}-${month}-${day} , ${hours}:${minutes}`;
  }

}
