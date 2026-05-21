import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  version: string = '1.0.0';
  buildDate: string = new Date().toISOString().split('T')[0];

  constructor() { }

  ngOnInit(): void {
  }

}
