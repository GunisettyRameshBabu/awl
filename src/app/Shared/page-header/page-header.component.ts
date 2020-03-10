import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  @Input() project;
  @Input() title;
  @Input() description;
  @Input() icon = 'fa fa-list';
  @Input() showUpdateContact = true;
  @Input() applicationNumber;
  constructor() { }

  ngOnInit() {
  }

}
