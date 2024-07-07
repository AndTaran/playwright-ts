import { test, expect, Page } from "@playwright/test";

const url: string = "https://andtaran.github.io/weather_react/";
const email: string = "test1@test.ru";
const password: string = "123456";

test.beforeEach(async ({ page }: { page: Page }) => {
	await page.goto(url);
});

test("Проверка отображения страницы регистрация/авторизация", async ({ page }: { page: Page }) => {
	await expect(page).toHaveTitle("React App");
	await expect(page.locator(".title")).toHaveText("Регистрация/Авторизация");
});

test("Проверка полей авторизации", async ({ page }: { page: Page }) => {
	await expect(page.locator(".auth-email input")).toBeVisible();
	await expect(page.locator(".auth-password input")).toBeVisible();
	await expect(page.getByRole("button", { name: "Авторизация" })).toBeVisible();
});

test.describe("Негативные сценарии авторизации", () => {
	test("Авторизация с пустыми данными", async ({ page }: { page: Page }) => {
		await page.getByRole("button", { name: "Авторизация" }).click();
		await expect(page.getByText("Заполните email/пароль")).toBeVisible();
	});

	test("Неуспешная авторизация", async ({ page }: { page: Page }) => {
		await page.locator(".auth-email input").fill(email);
		await page.locator(".auth-password input").fill("12345");
		await page.getByRole("button", { name: "Авторизация" }).click();

		await expect(page.getByText("Аккаунт не найден")).toBeVisible();
	});
});

test("Успешная авторизация", async ({ page }: { page: Page }) => {
	await page.locator(".auth-email input").fill(email);
	await page.locator(".auth-password input").fill(password);
	await page.getByRole("button", { name: "Авторизация" }).click();
	await expect(page.locator(".email")).toHaveText(email);
});
