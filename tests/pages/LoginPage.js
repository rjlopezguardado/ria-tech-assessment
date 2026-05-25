import { expect } from "@playwright/test";
export class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]')
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]')
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
    async validateErrorMessage(expectedText) {
        await expect(this.errorMessage).toBeVisible();
        if (expectedText) {
            await expect(this.errorMessage).toContainText(expectedText);
        }
    }
}