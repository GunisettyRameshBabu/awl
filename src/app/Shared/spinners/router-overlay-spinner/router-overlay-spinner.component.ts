import { Component, OnDestroy, OnInit, Renderer2 } from "@angular/core";

@Component({
  selector: "app-router-overlay-spinner",
  templateUrl: "./router-overlay-spinner.component.html",
  styleUrls: ["./router-overlay-spinner.component.css"]
})
export class RouterOverlaySpinnerComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // Add class that hides scroll bars while overlay is visible...
    this.renderer.addClass(document.body, "overlay-no-scroll");
  }

  ngOnDestroy() {
    // Remove class that hides scroll bars while overlay is visible..
    this.renderer.removeClass(document.body, "overlay-no-scroll");
  }
}
