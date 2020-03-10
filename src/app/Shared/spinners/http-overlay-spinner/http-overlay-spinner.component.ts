import { HttpRequest } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Constants } from '../../constants';
import { HttpOverlaySpinnerService } from './http-overlay-spinner.service';

@Component({
  selector: 'app-http-overlay-spinner',
  templateUrl: './http-overlay-spinner.component.html',
  styleUrls: ['./http-overlay-spinner.component.css']
})
export class HttpOverlaySpinnerComponent implements OnInit, OnDestroy {
  spinnerText: string;

  constructor(private httpOverlaySpinnerService: HttpOverlaySpinnerService, private renderer: Renderer2) { }

  ngOnInit() {
    // Monitor the current HTTP Request...
    this.httpOverlaySpinnerService.httpRequest.subscribe((httpRequest: HttpRequest<any>) => {
      // Determine the HTTP Request Method type and display appropriate spinner message...
      // switch (httpRequest.method.toUpperCase()) {
      //   case Constants.httpRequestMethods.delete.toUpperCase():
      //     this.spinnerText = 'Deleting';
      //     break;

      //   case Constants.httpRequestMethods.post.toUpperCase():
      //   case Constants.httpRequestMethods.put.toUpperCase():
      //     this.spinnerText = 'Saving';
      //     break;

      //   default:
      //     this.spinnerText = 'Loading';
      //     break;
      // }
      this.spinnerText = 'Loading';
    });

    // Add class that hides scroll bars while overlay is visible...
    this.renderer.addClass(document.body, 'overlay-no-scroll');
  }

  ngOnDestroy() {
    // Remove class that hides scroll bars while overlay is visible..
    this.renderer.removeClass(document.body, 'overlay-no-scroll');
  }
}
