import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})

/*** Product Service to call REST API and must registered in app.module section providers*/
export class ProductService {

  // Provide url of the backend to return product
  private baseUrl = 'http://localhost:8080/api/products';  // Spring Data Rest return first 20 product
  // private baseUrl = 'http://localhost:8080/api/products?size=100';  // increase size of return to 100

  private categoryUrl = 'http://localhost:8080/api/product-category';

  // Make sure to register HttpClient in app.module section import
  constructor(private httpClient: HttpClient) { }

  /******   Methods  *********/

  // This method return single product based on product id
  getProduct(theProductId: number): Observable<Product> {
    //  Build URL based on product id from backend
    const productUrl = `${this.baseUrl}/${theProductId}`;

    //  Pass the URL to get method
    return this.httpClient.get<Product>(productUrl);

  }

  //  Thie method return a list of products of particular category
  getProductList(theCategoryId: number): Observable<Product[]> {
    //  Build an Url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                         thePageSize: number,
                         theKeyword: string): Observable<GetResponseProducts> {
const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                  + `&page=${thePage}&size=${thePageSize}`;

return this.httpClient.get<GetResponseProducts>(searchUrl);
}


  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProducts> {
      const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                          + `&page=${thePage}&size=${thePageSize}`;

      return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
      return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }


}

interface GetResponseProducts{
  _embedded: {
    products: Product[];
  };
  // Pagination
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
