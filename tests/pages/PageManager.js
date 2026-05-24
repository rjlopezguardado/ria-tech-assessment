import {LoginPage} from "./LoginPage";
import {InventoryPage} from "./InventoryPage";

export class PageManager {
    constructor(page) {
        this.page = page;
    }
    getLoginPage() {
        return new LoginPage(this.page);
    }
    getInventoryPage() {
        return new InventoryPage(this.page);
    }
}   