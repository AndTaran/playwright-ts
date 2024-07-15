import { Locator, Page } from "@playwright/test";

export default class RegistrationPage {
	readonly page: Page;
	readonly email: Locator;
	readonly password: Locator;
	readonly repeatPassword: Locator;
	readonly registrationButton: Locator;
	readonly registrationError: Locator;
	readonly mainTitle: Locator;

	constructor(page: Page) {
		this.page = page;
		this.email = page.locator(".registration-email input");
		this.password = page.locator(".registration-password input");
		this.repeatPassword = page.locator(".registration-password-copy input");
		this.registrationButton = page.getByRole("button", { name: "Регистрация" });
		this.registrationError = page.locator("form p");
		this.mainTitle = page.locator(".title");
	}

	async registration(email: string, password: string) {
		await this.email.fill(email);
		await this.password.fill(password);
		await this.repeatPassword.fill(password);
		await this.registrationButton.click();
	}
}
