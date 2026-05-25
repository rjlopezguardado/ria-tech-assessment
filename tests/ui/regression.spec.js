import { test, expect } from '@playwright/test';
import {PageManager} from '../pages/PageManager';
import testingData from '../data/testingData.json';


test.describe('Login Functionality', () => {
    
    test('should login successfully with valid credentials', async ({ page }) => {
        const pageManager = new PageManager(page);
        const loginPage = pageManager.getLoginPage();
        await page.goto('/');
        await loginPage.login(process.env.VALID_UI_USERNAME, process.env.VALID_UI_PASSWORD);
        await expect(page).toHaveURL(/inventory.html/);
    });

    test('should show error message for locked account', async ({ page }) => {
        const pageManager = new PageManager(page);
        const loginPage = pageManager.getLoginPage();
        await page.goto('/');
        await loginPage.login(process.env.INVALID_UI_USERNAME, process.env.INVALID_UI_PASSWORD);
        await loginPage.validateErrorMessage('Sorry, this user has been locked out.');
    });
})

test.describe('Inventory Functionality', () => {
    test.beforeEach(async ({ page }) => {
        const pageManager = new PageManager(page);
        const loginPage = pageManager.getLoginPage();
        await page.goto('/');
        await loginPage.login(process.env.VALID_UI_USERNAME, process.env.VALID_UI_PASSWORD);
    });
    test('should add item to cart successfully', async ({ page }) => {
        const pageManager = new PageManager(page);
        const inventoryPage = pageManager.getInventoryPage();
        await inventoryPage.addItemToCart();
        await inventoryPage.validateTitle("Products");
    });

    test('should add multiple items to cart successfully', async ({ page }) => {
        const pageManager = new PageManager(page);
        const inventoryPage = pageManager.getInventoryPage();
        await inventoryPage.addItemsToCart(testingData.items['item-one']);
        await inventoryPage.addItemsToCart(testingData.items['item-two']);
        await inventoryPage.addItemsToCart(testingData.items['item-three']);
    });

    test('should complete checkout flow successfully', async ({ page }) => {
        const pageManager = new PageManager(page);
        const inventoryPage = pageManager.getInventoryPage();
        await inventoryPage.addItemToCart();
        await inventoryPage.checkoutProcess(
            testingData.checkout.firstName,
            testingData.checkout.lastName,
            testingData.checkout.postalCode
        );
    })
});