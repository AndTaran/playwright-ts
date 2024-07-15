import { test, expect, Page } from "@playwright/test";
import LoginPage from "../../pages/LoginPage";

const url: string = "https://andtaran.github.io/weather_react/";
const email: string = "test1@test.ru";
const password: string = "123456";
const errorFillEmailPassword: string = "Заполните email/пароль";
const errorAccountNotFound: string = "Аккаунт не найден";

test.beforeEach(async ({ page }: { page: Page }) => {
	const loginPageObj = new LoginPage(page);

	await test.step("Открытие страницы", async () => {
		await loginPageObj.goTo(url);
	});
});

test("Проверка отображения страницы регистрация/авторизация", async ({ page }: { page: Page }) => {
	const loginPageObj = new LoginPage(page);

	await test.step("Отображение заголовка", async () => {
		await expect(loginPageObj.mainTitle).toHaveText("Регистрация/Авторизация");
	});
});

test("Проверка отображения полей авторизации", async ({ page }: { page: Page }) => {
	const loginPageObj = new LoginPage(page);

	await test.step("Отображение поля email", async () => {
		await expect(loginPageObj.email).toBeVisible();
	});

	await test.step("Отображение поля пароля", async () => {
		await expect(loginPageObj.password).toBeVisible();
	});

	await test.step("Отображение кнопки авторизации", async () => {
		await expect(loginPageObj.authButton).toBeVisible();
	});
});

test.describe("Негативные сценарии авторизации", () => {
	test("Авторизация с незаполненными полями", async ({ page }: { page: Page }) => {
		const loginPageObj = new LoginPage(page);

		await test.step("Нажатие на кнопку авторизации", async () => {
			await loginPageObj.authButton.click();
		});

		await test.step("Отображение ошибки", async () => {
			await expect(loginPageObj.authError).toBeVisible();
			await expect(loginPageObj.authError).toHaveText(errorFillEmailPassword);
		});
	});

	test("Неуспешная авторизация", async ({ page }: { page: Page }) => {
		const loginPageObj = new LoginPage(page);

		await test.step("Авторизация от незарегистрированного пользователя", async () => {
			await loginPageObj.login(email, "12345");
		});

		await test.step("Отображение ошибки", async () => {
			await expect(loginPageObj.authError).toBeVisible();
			await expect(loginPageObj.authError).toHaveText(errorAccountNotFound);
		});
	});
});

test("Успешная авторизация", async ({ page }: { page: Page }) => {
	const loginPageObj = new LoginPage(page);

	await test.step("Авторизация", async () => {
		await loginPageObj.login(email, password);
	});

	await test.step("Отображение email авторизованного пользователя", async () => {
		await expect(page.locator(".email")).toHaveText(email);
	});
});
