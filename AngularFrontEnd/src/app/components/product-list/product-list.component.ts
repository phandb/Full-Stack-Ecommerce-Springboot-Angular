import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

//  Must be registered in app.module section declaration
export class ProductListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
