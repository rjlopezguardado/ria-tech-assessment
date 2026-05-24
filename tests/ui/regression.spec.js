import {test, expect, page} from '@playwright/test';
import {PageManager} from '../pages/PageManager';
import testingData from '../data/testingData.json';


test.describe('Login Functionality', () => {
    
    test('should login successfully with valid credentials', async ({ page }) => {
        const pageManager = new PageManager(page);
        const loginPage = pageManager.getLoginPage();
        await page.goto(process.env.UI_URL);
        await loginPage.login(process.env.VALID_UI_USERNAME, process.env.VALID_UI_PASSWORD);
        await expect(page).toHaveURL(/inventory.html/);
    });

    test('should show error message with invalid credentials', async ({ page }) => {
        const pageManager = new PageManager(page);
        const loginPage = pageManager.getLoginPage();
        await page.goto(process.env.UI_URL);
        await loginPage.login(process.env.INVALID_UI_USERNAME, process.env.INVALID_UI_PASSWORD);
        await loginPage.validateErrorMessage();
    });
})

test.describe('Inventory Functionality', () => {
    test.beforeEach(async ({ page }) => {
        const pageManager = new PageManager(page);
        const loginPage = pageManager.getLoginPage();
        await page.goto(process.env.UI_URL);
        await loginPage.login(process.env.VALID_UI_USERNAME, process.env.VALID_UI_PASSWORD);
    });
    test('should add item to cart successfully', async ({ page }) => {
        const pageManager = new PageManager(page);
        const inventoryPage = pageManager.getInventoryPage();
        await inventoryPage.addItemToCart();
        await inventoryPage.validateTitle();
    });

    test('should add multiple items to cart successfully', async ({ page }) => {
        const pageManager = new PageManager(page);
        const inventoryPage = pageManager.getInventoryPage();
        await inventoryPage.addItemsToCart(testingData.items['item-one']);
        await inventoryPage.addItemsToCart(testingData.items['item-two']);
        await inventoryPage.addItemsToCart(testingData.items['item-three']);
    });

    test(' login → add an item to cart → checkout → verify completion', async ({ page }) => {
        const pageManager = new PageManager(page);
        const inventoryPage = pageManager.getInventoryPage();
        await inventoryPage.addItemToCart();
        await inventoryPage.checkoutProcess('Ricardo', 'Lopez', '33166');
        
    })
});