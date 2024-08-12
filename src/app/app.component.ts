import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VerreChile';
  version = "1.26.1";
  currentYear!:number;

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }
}
