import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modalpopup',
  templateUrl: './modalpopup.component.html',
  styleUrls: ['./modalpopup.component.css']
})
export class ModalpopupComponent implements OnInit {

  @Input() title;
  @Input() body;
  @Output() SuccessEvent: EventEmitter<any> = new EventEmitter();
  @Output() CancelEvent: EventEmitter<any> = new EventEmitter();
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal(result: boolean) {
    this.activeModal.close(result);
    if (result) {
      this.SuccessEvent.emit(true);
    } else {
      this.CancelEvent.emit(true);
    }
  }

}
