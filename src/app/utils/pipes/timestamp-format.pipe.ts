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
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);  // +1 porque los meses empiezan en 0
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    // Formato "YYYY-MM-DD HH:mm"
    return `${year}-${month}-${day} , ${hours}:${minutes}`;
  }

}
