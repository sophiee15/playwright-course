import { expect } from '@playwright/test'
import { Navigation } from './Navigation.js'
import { isDesktopViewport } from '../utils/isDesktopViewport.js'

export class ProductPage {

    constructor(page) { 
        this.page = page
        this.addButtons = page.locator('[data-qa="product-button"]')
        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]')
        this.productTitle = page.locator('[data-qa="product-title"]')
    }

    visit = async () => {
        await this.page.goto("/")
    }

    addProductToBasket = async (index) => {
        // here we are asserting, that the basket count changing after clicking 'Add to basket' (from 0 to 1, for example) 
        // and the count is greater than before
        const specificAddButton = this.addButtons.nth(index)
        await specificAddButton.waitFor()
        await expect(specificAddButton).toHaveText("Add to Basket")
        //getBasketCount is a method from Navigation class, that is why we are creating an instance 
        // of Navigation class here, to be able to use that method and 
        // get the count before and after adding the product to the basket
        const navigation = new Navigation(this.page)

        // only run for desktop viewport, because in mobile the count is not visible
        let basketCountBeforeAdding
        if(isDesktopViewport(this.page)){
            basketCountBeforeAdding = await navigation.getBasketCount()
        }
        await specificAddButton.click()
        await expect(specificAddButton).toHaveText("Remove from Basket")
        // only run for desktop viewport, because in mobile the count is not visible
        if(isDesktopViewport(this.page)){
            const basketCountAfterAdding = await navigation.getBasketCount()
            expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding)
        }  
    }

    sortByCheapest = async () => {
        await this.sortDropdown.waitFor()
        // get order of products
        await this.productTitle.first().waitFor()
        const productTitlesBeforeSorting = await this.productTitle.allInnerTexts()
        await this.sortDropdown.selectOption("price-asc")
        const productTitlesAfterSorting = await this.productTitle.allInnerTexts()
        // get order of products
        // expect that these lists are different
        expect(productTitlesBeforeSorting).not.toEqual(productTitlesAfterSorting)
    }
}