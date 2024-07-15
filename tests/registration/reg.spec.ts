import { test, expect, Page } from "@playwright/test";
import RegistrationPage from "../../pages/RegistrationPage";
import LoginPage from "../../pages/LoginPage";

const url: string = "https://andtaran.github.io/weather_react/";
const randomEmail: string = Math.random().toString(36).substring(2, 11) + "@domain.com";
const email: string = "test1@test.ru";
const password: string = "123456";

test.beforeEach(async ({ page }) => {
	const loginPageObj = new LoginPage(page);

	await loginPageObj.goTo(url);
});

test("Проверка полей регистрации", async ({ page }: { page: Page }) => {
	const registrationPageObj = new RegistrationPage(page);

	await expect(registrationPageObj.email).toBeVisible();
	await expect(registrationPageObj.password).toBeVisible();
	await expect(registrationPageObj.repeatPassword).toBeVisible();
	await expect(registrationPageObj.registrationButton).toBeVisible();
});

test.describe("Негативные сценарии регистрации", () => {
	test("Регистрация с пустыми данными", async ({ page }: { page: Page }) => {
		const registrationPageObj = new RegistrationPage(page);

		await registrationPageObj.registrationButton.click();
		await expect(registrationPageObj.registrationError).toBeVisible();
		await expect(registrationPageObj.registrationError).toHaveText("Заполните все поля");
	});

	test("Регистрация с некорректным паролем", async ({ page }: { page: Page }) => {
		const registrationPageObj = new RegistrationPage(page);

		await registrationPageObj.email.fill(email);
		await registrationPageObj.password.fill("12345");
		await registrationPageObj.repeatPassword.fill("12345");
		await registrationPageObj.registrationButton.click();

		await expect(registrationPageObj.registrationError).toBeVisible();
		await expect(registrationPageObj.registrationError).toHaveText("Firebase: Password should be at least 6 characters (auth/weak-password).");
	});

	test("Регистрация с некорректным email", async ({ page }: { page: Page }) => {
		const registrationPageObj = new RegistrationPage(page);

		await registrationPageObj.email.fill("test1");
		await registrationPageObj.password.fill(password);
		await registrationPageObj.repeatPassword.fill(password);
		await registrationPageObj.registrationButton.click();

		await expect(registrationPageObj.registrationError).toBeVisible();
		await expect(registrationPageObj.registrationError).toHaveText("Firebase: Error (auth/invalid-email).");
	});

	test("Регистрация с существующим email", async ({ page }: { page: Page }) => {
		const registrationPageObj = new RegistrationPage(page);

		await registrationPageObj.email.fill(email);
		await registrationPageObj.password.fill(password);
		await registrationPageObj.repeatPassword.fill(password);
		await registrationPageObj.registrationButton.click();

		await expect(registrationPageObj.registrationError).toBeVisible();
		await expect(registrationPageObj.registrationError).toHaveText("Firebase: Error (auth/email-already-in-use).");
	});
});

test("Успешная регистрация", async ({ page }) => {
	const registrationPageObj = new RegistrationPage(page);

	await registrationPageObj.email.fill(randomEmail);
	await registrationPageObj.password.fill(password);
	await registrationPageObj.repeatPassword.fill(password);
	await registrationPageObj.registrationButton.click();

	await expect(page.locator(".email")).toHaveText(randomEmail);
});
