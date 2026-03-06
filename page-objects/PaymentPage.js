import { expect } from "@playwright/test";

export class PaymentPage {
    constructor(page) {
        this.page = page
        
        // because of the Iframe, where the discount is located, we need to use frameLocator to access the discount code element
        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                                .locator('[data-qa="discount-code"]')
        this.discountInput = page.getByPlaceholder('Discount code')
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.discountActiveMessage = page.locator('[data-qa="discount-active-message"]')
        this.discountedValue = page.locator('[data-qa="total-with-discount-value"]')
        this.totalValue = page.locator('[data-qa="total-value"]')

        this.creditCardOwnerInput = page.getByPlaceholder("Credit card owner")
        this.creditCardNumberInput = page.getByPlaceholder("Credit card number")
        this.creditCardValidUntilInput = page.getByPlaceholder("Valid until")
        this.creditCardCVCInput = page.getByPlaceholder("Credit card CVC")
        this.payButton = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountInput.waitFor()

        // Option one for laggy inputs: using .fill() with await expect()
        await this.discountInput.fill(code)
        // Comment: discount input is buggy and it's hard to enter a value, 
        // Comment: so we use expect inputValue to verify that there is a value inputted
        await expect(this.discountInput).toHaveValue(code)

        // Option two for laggy inputs: slow typing
        //await this.discountInput.focus()
        //await this.page.keyboard.type(code, { delay: 1000 })
        //expect(await this.discountInput.inputValue()).toBe(code)

        // before activating the discount, the discounted value and the active message should not be visible
        expect(await this.discountedValue.isVisible()).toBe(false)
        expect(await this.discountActiveMessage.isVisible()).toBe(false)
        // activating the discount
        await this.activateDiscountButton.waitFor()
        await this.activateDiscountButton.click()
        await this.discountActiveMessage.waitFor()
        await this.discountedValue.waitFor()
        // we should replace string into a number
        const discountValueText = await this.discountedValue.innerText() //"345$"
        const discountValueOnlyStringNumber = discountValueText.replace("$", "") 
        const discountValueNumber = parseInt(discountValueOnlyStringNumber, 10) // 345

        await this.totalValue.waitFor()
        const totalValueText = await this.totalValue.innerText() 
        const totalValueOnlyStringNumber = totalValueText.replace("$", "") 
        const totalValueNumber = parseInt(totalValueOnlyStringNumber, 10)

        expect(discountValueNumber).toBeLessThan(totalValueNumber)

    }

    fillPaymentDetails = async (paymentDetails) => {
        await this.creditCardOwnerInput.waitFor()
        await this.creditCardOwnerInput.fill(paymentDetails.cardHolderName)

        await this.creditCardNumberInput.waitFor()
        await this.creditCardNumberInput.fill(paymentDetails.cardNumber)
        
        await this.creditCardValidUntilInput.waitFor()
        await this.creditCardValidUntilInput.fill(paymentDetails.expiryDate)

        await this.creditCardCVCInput.waitFor()
        await this.creditCardCVCInput.fill(paymentDetails.cvv)
    }

    completePayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 })
    }
}