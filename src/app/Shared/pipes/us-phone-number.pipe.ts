import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usPhoneNumber'
})
export class UsPhoneNumberPipe implements PipeTransform {

  transform(input: any, showCountryCode: any): any {
    if (!input) {
      return input;
    }

    let cleanedText = input.replace(/[^\d]/g, '');

    if (cleanedText.length === 10 && showCountryCode) {
      cleanedText = '1' + cleanedText;
    }

    if (cleanedText.length === 11 && !showCountryCode && showCountryCode === false) {
      cleanedText = cleanedText.substring(1, 11);
    }

    switch (cleanedText.length) {
      case 11:
        return cleanedText.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1($2) $3-$4');
      case 10:
        return cleanedText.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      default:
        return input;
    }
  }

}
