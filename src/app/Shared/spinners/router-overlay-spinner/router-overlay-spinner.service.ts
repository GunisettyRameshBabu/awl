import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn : 'root'
})
export class RouterOverlaySpinnerService {
    spinnerState = new BehaviorSubject(false);

    constructor() { }

    public show() {
        // Broadcast current state of the spinner (visible)...
        this.spinnerState.next(true);
    }

    public hide() {
        // Broadcast current state of the spinner (hidden)...
        this.spinnerState.next(false);
    }
}
