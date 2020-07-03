import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    // tslint:disable-next-line: prefer-const
    let data: number[] = [];

    //  Build an array for Month dropdown list
    //  Start at desired atartMonth and loop until 12

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    // tslint:disable-next-line: prefer-const
    let data: number[] = [];
    //  Build an array for year dropdown list
    //  Start at current year and loop for next 10

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}
