import { Locator, Page } from "@playwright/test";

export default class LoginPage {
	readonly page: Page;
	readonly email: Locator;
	readonly password: Locator;
	readonly authButton: Locator;
	readonly authError: Locator;
	readonly mainTitle: Locator;

	constructor(page: Page) {
		this.page = page;
		this.email = page.locator(".auth-email input");
		this.password = page.locator(".auth-password input");
		this.authButton = page.getByRole("button", { name: "Авторизация" });
		this.authError = page.locator("form p");
		this.mainTitle = page.locator(".title");
	}

	async login(email: string, password: string) {
		await this.email.fill(email);
		await this.password.fill(password);
		await this.authButton.click();
	}
}
