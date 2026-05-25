import {expect} from "@playwright/test";
export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.itemTitle = page.locator('[data-test="item-4-title-link"]');
        this.inventoryTitleName = page.locator('[data-test="inventory-item-name"]')
        this.addToCartButton = page.locator('[data-test="add-to-cart"]');
        this.removeButton = page.locator('[data-test="remove"]')
        this.goBackButton = page.locator('[data-test="back-to-products"]')
        this.shoppingCartBadge = page.locator('[data-test="shopping-cart-link"]')
        this.cartList = page.locator('[data-test="cart-list"]')
        this.checkoutButton = page.locator('[data-test="checkout"]')
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]')
        this.continueButton = page.locator('[data-test="continue"]')
        this.finishButton = page.locator('[data-test="finish"]')
        this.checkoutCompleteHeader = page.locator('[data-test="complete-header"]')

    }

    async validateTitle(expectedText = 'Products') {
        await expect(this.title).toHaveText(expectedText);
    }

    async addItemToCart() {
        await this.itemTitle.click();
        await expect(this.inventoryTitleName).toBeVisible();
        await this.addToCartButton.click();        
        await expect(this.removeButton).toBeVisible();
        await this.goBackButton.click();
    }


    async checkoutProcess(name, lastName, postalCode) {
        await this.shoppingCartBadge.click();
        await expect(this.cartList).toBeVisible();
        await this.checkoutButton.click();
        await this.firstNameInput.fill(name);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
        await this.finishButton.click();
        await expect(this.checkoutCompleteHeader).toBeVisible();
        await expect(this.checkoutCompleteHeader).toHaveText('Thank you for your order!');
    }   

    async addItemsToCart(itemName) {
        await this.page.locator(`[data-test="add-to-cart-${itemName}"]`).click();
        await expect(this.page.locator(`[data-test="remove-${itemName}"]`)).toBeVisible();
    }
}