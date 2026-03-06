import { isDesktopViewport } from "../utils/isDesktopViewport"

export class Navigation {
    constructor(page) {
        this.page = page
        this.basketCounter = page.locator('[data-qa="header-basket-count"]')
        this.checkoutLink = page.getByRole("link", { name: "Checkout" })
        this.mobileBurgerButton = page.locator('[data-qa="burger-button"]')
    }

    getBasketCount = async () => {
        await this.basketCounter.waitFor()
        // get the text from the basket counter, which is "0", "1", "2" etc
        const text = await this.basketCounter.innerText()
        // turning "0" string into number 0
        return parseInt(text, 10)
    }

    // true if desktop
    // false if mobile -> reverse false -> false === !true

    goToCheckout = async () => {
    // if mobile viewport, first open the burger menu, to be able to see the checkout link and click on it
        if(!isDesktopViewport(this.page)){
            await this.mobileBurgerButton.waitFor()
            await this.mobileBurgerButton.click()
        }
        await this.checkoutLink.waitFor()
        await this.checkoutLink.click()
        await this.page.waitForURL("/basket")
    }
}