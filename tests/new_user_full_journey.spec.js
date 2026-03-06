import { v4 as uuidv4 } from "uuid"; // for generating unique email addresses
import { test } from '@playwright/test';
import { ProductPage } from '../page-objects/ProductPage.js';
import { Navigation } from './../page-objects/Navigation.js';
import { Checkout } from './../page-objects/Checkout.js';
import { LoginPage } from './../page-objects/LoginPage.js';
import { RegisterPage } from './../page-objects/RegisterPage.js';
import { DeliveryDetails } from './../page-objects/DeliveryDetails.js';
import { deliveryDetails as userAddress } from "../data/deliveryDetails.js";
import { PaymentPage } from '../page-objects/PaymentPage.js';
import { paymentDetails } from '../data/paymentDetails.js';

test("New User Full end-to-end Journey", async ({ page }) => {

    const productPage = new ProductPage(page)
    // visiting the page
    await productPage.visit()

    await productPage.sortByCheapest() // sorting products by cheapest, to make sure that the first product is the cheapest one and we are removing it later in the test

    // adding 3 products to the basket, by using the method from ProductPage class
    await productPage.addProductToBasket(0)
    await productPage.addProductToBasket(1)
    await productPage.addProductToBasket(2)

    // going to the checkout page, by using the method from Navigation class
    const navigation = new Navigation(page)
    await navigation.goToCheckout()

    // removing the cheapest product from the basket, by using the method from Checkout class
    const checkout = new Checkout(page)
    await checkout.removeCheapestProduct()

    // continuing to the checkout, by using the method from Checkout class
    await checkout.continueToCheckout()

    // moving to the sign up page, by using the method from LoginPage class
    const login = new LoginPage(page)
    await login.moveToSignUp()

    // signing up as a new user, by using the method from RegisterPage class
    const registerPage = new RegisterPage(page)
    const email = uuidv4() + "@gmail.com" // generates a unique id, for example: "9b1deb4d-5b14-4880-9cde-7cba9f2c1906"
    const password = uuidv4() 
    await registerPage.signUpAsNewUser(email, password)

    // filling in delivery details and saving them, by using the methods from DeliveryDetails class
    const deliveryDetails = new DeliveryDetails(page)
    await deliveryDetails.fillDetails(userAddress)
    await deliveryDetails.saveDetails()
    await deliveryDetails.continueToPayment()

    // filling in payment details and confirming the order, by using the methods from PaymentPage class
    const paymentPage = new PaymentPage(page)
    await paymentPage.activateDiscount()
    await paymentPage.fillPaymentDetails(paymentDetails)
    await paymentPage.completePayment()

})