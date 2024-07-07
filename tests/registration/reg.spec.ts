import { test, expect, Page } from "@playwright/test";

const url: string = "https://andtaran.github.io/weather_react/";

const randomEmail: string = Math.random().toString(36).substring(2, 11) + "@domain.com";
const email: string = "test1@test.ru";
const password: string = "123456";

test.beforeEach(async ({ page }) => {
	await page.goto(url);
});

test("Проверка полей регистрации", async ({ page }: { page: Page }) => {
	await expect(page.locator(".registration-email").filter({ has: page.locator("input") })).toBeVisible();
	await expect(page.locator(".registration-password").filter({ has: page.locator("input") })).toBeVisible();
	await expect(page.locator(".registration-password-copy").filter({ has: page.locator("input") })).toBeVisible();
	await expect(page.getByRole("button", { name: "Регистрация" })).toBeVisible();
});

test.describe("Негативные сценарии регистрации", () => {
	test("Регистрация с пустыми данными", async ({ page }: { page: Page }) => {
		await page.getByRole("button", { name: "Регистрация" }).click();
		await expect(page.getByText("Заполните все поля")).toBeVisible();
	});

	test("Регистрация с некорректным паролем", async ({ page }: { page: Page }) => {
		await page.locator(".registration-email input").fill(email);
		await page.locator(".registration-password input").fill("12345");
		await page.locator(".registration-password-copy input").fill("12345");
		await page.getByRole("button", { name: "Регистрация" }).click();

		await expect(page.getByText("Firebase: Password should be at least 6 characters (auth/weak-password).")).toBeVisible();
	});

	test("Регистрация с некорректным email", async ({ page }: { page: Page }) => {
		await page.locator(".registration-email input").fill("test1");
		await page.locator(".registration-password input").fill(password);
		await page.locator(".registration-password-copy input").fill(password);
		await page.getByRole("button", { name: "Регистрация" }).click();
		await expect(page.getByText("Firebase: Error (auth/invalid-email).")).toBeVisible();
	});

	test("Регистрация с существующим email", async ({ page }: { page: Page }) => {
		await page.locator(".registration-email input").fill(email);
		await page.locator(".registration-password input").fill(password);
		await page.locator(".registration-password-copy input").fill(password);
		await page.getByRole("button", { name: "Регистрация" }).click();
		await expect(page.getByText("Firebase: Error (auth/email-already-in-use).")).toBeVisible();
	});
});

test("Успешная регистрация", async ({ page }) => {
	await page.locator(".registration-email input").fill(randomEmail);
	await page.locator(".registration-password input").fill(password);
	await page.locator(".registration-password-copy input").fill(password);
	await page.getByRole("button", { name: "Регистрация" }).click();
	await expect(page.locator(".email")).toHaveText(randomEmail);
});
