import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appLiveAddress]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: LiveAddressDirective,
    multi: true
}]
})
export class LiveAddressDirective implements Validator {

  validate(c: AbstractControl): { [key: string]: any; } {
    throw new Error('Method not implemented.');
}
registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
}
}
