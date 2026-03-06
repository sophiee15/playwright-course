import { expect } from "@playwright/test"

export class Checkout {
    constructor(page) {
        this.page = page
        this.basketCards = page.locator('[data-qa="basket-card"]')
        this.basketItemPrice = page.locator('[data-qa="basket-item-price"]')
        this.basketItemRemoveButton = page.locator('[data-qa="basket-card-remove-item"]')
        this.continueToCheckoutButton = page.locator('[data-qa="continue-to-checkout"]')    
    }

    removeCheapestProduct = async () => {
        await this.basketCards.first().waitFor()
        const itemsBeforeRemoval = await this.basketCards.count()
        await this.basketItemPrice.first().waitFor()
        const allPriceTexts= await this.basketItemPrice.allInnerTexts()
        // [ '499$', '799$', '1999$' ] -> [ 499, 799, 1999 ]

        // with map we are going through all the price texts and for each of them 
        // we are removing the dollar sign and turning it into a number
        const justNumbers = allPriceTexts.map((element) => {
            const withoutDollarSign = element.replace("$", "") // '499$ -> '499'
            return parseInt(withoutDollarSign, 10)
        })
        const smallestPrice = Math.min(...justNumbers) 
        const smallestPriceIdx = justNumbers.indexOf(smallestPrice) // 0, 1, 2 -> index of the cheapest product
        // nth helps to find the specific remove button for the cheapest product, 
        // because we have multiple products 
        // in the basket and each of them has its own remove button
        const specificRemoveButton = this.basketItemRemoveButton.nth(smallestPriceIdx)
        await specificRemoveButton.waitFor()
        await specificRemoveButton.click()
        // asserting that the count of products in the basket is decreasing by 1 after removing the cheapest product
        await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1)
        //await this.page.pause()
    }

    continueToCheckout = async () => {
        await this.continueToCheckoutButton.waitFor()
        await this.continueToCheckoutButton.click()
        await this.page.waitForURL(/\login/, { timeout: 3000 }) // writing in this way, as per regex source
    }
}