import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule} from '@angular/common/http';
import { ProductService } from './services/product.service';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { SearchComponent } from './components/search/search.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

//  Define Routes
const routes: Routes = [
  { path: 'product/:id', component: ProductDetailsComponent},
  { path: 'search/:keyword', component: ProductListComponent},
  { path: 'category/:id/:name', component: ProductListComponent},
  { path: 'category', component: ProductListComponent},
  { path: 'products', component: ProductListComponent},
  { path: '', redirectTo: '/products', pathMatch: 'full'},
  { path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    ProductDetailsComponent,
    SearchComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
