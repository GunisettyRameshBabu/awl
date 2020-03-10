import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpRequest } from '@angular/common/http';

@Injectable({
    providedIn : 'root'
})
export class HttpOverlaySpinnerService {
    spinnerState = new BehaviorSubject(false);
    httpRequest = new BehaviorSubject(null);

    constructor() { }

    public show() {
        // Broadcast current state of the spinner (visible)...
        this.spinnerState.next(true);

        // // Broadcast the current HTTP Request...
        // this.httpRequest.next(httpRequest);
    }

    public hide() {
        // Broadcast current state of the spinner (hidden)...
        this.spinnerState.next(false);
    }
}
