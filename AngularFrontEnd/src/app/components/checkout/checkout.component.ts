import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ShoppingFormService } from 'src/app/services/shopping-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  reviewTotalPrice = 0;
  reviewTotalQuantity = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shoppingFormService: ShoppingFormService,
              private cartService: CartService) { }

  ngOnInit(): void {

    this.reviewCartDetail();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']

      }),

      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),

      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),

      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })

    });

    //  Populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log('start Month: ' + startMonth);

    this.shoppingFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //  Populate credit card years
    // const startYear: number = new Date().getFullYear();
    // console.log('start year: ' + startYear);
    this.shoppingFormService.getCreditCardYears().subscribe(
      data => {
        console.log('Retrieved credit card years: ' + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // Populate countries

    this.shoppingFormService.getCountries().subscribe(
      data => {
        console.log('Retrieved countries: ' + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  // Review cart detail
  reviewCartDetail() {
    this.cartService.totalPrice.subscribe(
      data => this.reviewTotalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.reviewTotalQuantity = data
    );

    console.log(' Review Cart Detail from Checkout:');
    console.log('Total Quantity: ' + this.reviewTotalQuantity);
    console.log('Total Price: ' + this.reviewTotalPrice);
  }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
          .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

          // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
  }

  onSubmit() {

    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log('The email address is ' + this.checkoutFormGroup.get('customer').value.email);

    console.log('Shipping address country is ' + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log('Shipping address state is ' + this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }




  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // If the current year equals the selected year, then start with current month

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }
    this.shoppingFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrieved credt card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shoppingFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item as default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
}
