import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import WeatherPage from "../pages/WeatherPage";
import { BaseData, AuthData } from "../data/data";

test.describe("Авторизация", { tag: "@auth" }, () => {
	test.describe.configure({ retries: 1 });

	let loginPageObj: LoginPage;
	let weatherPageObj: WeatherPage;

	test.beforeEach(async ({ page }) => {
		loginPageObj = new LoginPage(page);
		weatherPageObj = new WeatherPage(page);

		await test.step("Открытие страницы", async () => {
			await loginPageObj.goTo(BaseData.url);
		});
	});

	test("Проверка отображения страницы регистрация/авторизация", async ({ page }) => {
		await test.step("Отображение заголовка", async () => {
			await expect(loginPageObj.mainTitle).toHaveText(AuthData.title);
		});
	});

	test("Проверка отображения полей авторизации", async ({ page }) => {
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

	test.describe("Негативные сценарии авторизации", { tag: "@negative" }, () => {
		test("Авторизация с незаполненными полями", async ({ page }) => {
			await test.step("Нажатие на кнопку авторизации", async () => {
				await loginPageObj.authButton.click();
			});

			await test.step("Отображение ошибки", async () => {
				await expect(loginPageObj.authError).toBeVisible();
				await expect(loginPageObj.authError).toHaveText(AuthData.errorFillEmailPassword);
			});
		});

		test("Авторизация от незарегистрированного пользователя", async ({ page }) => {
			await test.step("Авторизация", async () => {
				await loginPageObj.login(BaseData.email, AuthData.invalidPassword);
			});

			await test.step("Отображение ошибки", async () => {
				await expect(loginPageObj.authError).toBeVisible();
				await expect(loginPageObj.authError).toHaveText(AuthData.errorAccountNotFound);
			});
		});
	});

	test("Успешная авторизация", async ({ page }) => {
		await test.step("Авторизация", async () => {
			await loginPageObj.login(BaseData.email, BaseData.password);
		});

		await test.step("Отображение email авторизованного пользователя", async () => {
			await expect(weatherPageObj.email).toHaveText(BaseData.email);
		});
	});
});
