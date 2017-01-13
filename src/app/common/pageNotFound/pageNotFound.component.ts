import { Component } from '@angular/core';

@Component({
  selector: 'PageNotFoundComponent',
  templateUrl: './pageNotFound.component.html',
  styles: [`
    .error-template {
      padding: 40px 15px;
      text-align: center;
      margin-top:15px;
      font-family: "menlo", consolas, monospace;
    	color: #ba6236;
    }
    .error-details,
    .error-actions {
      margin-bottom:15px;
    }
    .error-actions .btn {
      margin-right:10px;
      background-color: #5f5e4e;
      border: none;
    }`]
})
export class PageNotFoundComponent {

  constructor() {
  }
}
