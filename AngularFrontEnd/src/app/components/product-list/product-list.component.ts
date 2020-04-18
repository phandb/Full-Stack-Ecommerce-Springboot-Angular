import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})

//  Must be registered in app.module section declaration
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currrentCategoryId = 1;
  previousCategoryId = 1;
  currentCategoryName: string;
  // tslint:disable-next-line: no-inferrable-types
  searchMode: boolean = false;

  // Properties for pagination
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  /*  This method will access getProductList in the service and subscribe data
  to the product array

  */
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    // optain the keyword
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // search for product using keyword
    this.productService.searchProducts(theKeyword).subscribe(
        data => {
          this.products = data;
        }
    );
  }

  handleListProducts() {
    // Check if id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the id and convert to a number
      this.currrentCategoryId = +this.route.snapshot.paramMap.get('id');
      // get the name of category param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      // default category to 1
      this.currrentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }
    // Check if we have a different category than previous
    // Note: Angular will re-use a component if it is currently being viewed
    // If we have a different category id than previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId !== this.currrentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currrentCategoryId;
    console.log(`currentCategoryId=${this.currrentCategoryId}, thePageNumber=${this.thePageNumber}`);
    // Get the products for given product id
    //  Pagination component page is 1-based while Spring Data Rest page is 0-based
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                                this.thePageSize,
                                                this.currrentCategoryId)
                                                .subscribe(this.processResult() );
  }
  //  The right hand side of assignment is data from Spring Data REST JSON
  // Left-hand side of assignment are properties defined in products class
  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;  //  Spring Data REST is 0-based
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.TotalElements;
    };
  }


}
