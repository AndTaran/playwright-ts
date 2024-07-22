import { test, expect } from "@playwright/test";
import { allure } from "allure-playwright";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";
import WeatherPage from "../pages/WeatherPage";
import { BaseData, RegistrationData, AuthData } from "../data/data";

let loginPageObj: LoginPage;
let registrationPageObj: RegistrationPage;
let weatherPageObj: WeatherPage;

test.beforeEach(async ({ page }) => {
	loginPageObj = new LoginPage(page);
	registrationPageObj = new RegistrationPage(page);
	weatherPageObj = new WeatherPage(page);

	await allure.epic("Регистрация");
	await allure.owner("Валерий Грибов");
	await allure.description("Позитивные и негативные проверки на странице регистрации");
	await allure.link("Website", "https://andtaran.github.io/weather_react/", "Сайт weather_react");

	await test.step("Открытие страницы", async () => {
		await loginPageObj.goTo(BaseData.url);
	});
});

test.describe("Позитивные сценарии регистрации", { tag: "@registration" }, () => {
	test("Проверка полей регистрации", async ({ page }) => {
		await allure.severity("blocker");

		await test.step("Отображение поля email", async () => {
			await expect(registrationPageObj.email).toBeVisible();
		});

		await test.step("Отображение поля пароля", async () => {
			await expect(registrationPageObj.password).toBeVisible();
		});

		await test.step("Отображение поля повторения пароля", async () => {
			await expect(registrationPageObj.repeatPassword).toBeVisible();
		});

		await test.step("Отображение кнопки регистрации", async () => {
			await expect(registrationPageObj.registrationButton).toBeVisible();
		});
	});

	test("Успешная регистрация", async ({ page }) => {
		await allure.severity("blocker");

		await test.step("Заполнение поля email", async () => {
			await registrationPageObj.email.fill(RegistrationData.randomEmail);
		});

		await test.step("Заполнение поля пароля", async () => {
			await registrationPageObj.password.fill(BaseData.password);
		});

		await test.step("Заполнение поля повторения пароля", async () => {
			await registrationPageObj.repeatPassword.fill(BaseData.password);
		});
		await test.step("Нажатие на кнопку регистрации", async () => {
			await registrationPageObj.registrationButton.click();
		});

		await test.step("Отображение почты зарегистрированного пользователя", async () => {
			await expect(weatherPageObj.email).toHaveText(RegistrationData.randomEmail);
		});
	});
});

test.describe("Негативные сценарии регистрации", { tag: ["@registration", "@negative"] }, () => {
	test("Регистрация с пустыми данными", async ({ page }) => {
		await allure.severity("trivial");

		await test.step("Нажатие на кнопку регистрации", async () => {
			await registrationPageObj.registrationButton.click();
		});

		await test.step("Отображение ошибки", async () => {
			await expect(registrationPageObj.registrationError).toBeVisible();
			await expect(registrationPageObj.registrationError).toHaveText(RegistrationData.errorFillFields);
		});
	});

	test("Регистрация с паролем менее 6 символов", async ({ page }) => {
		await allure.severity("critical");

		await test.step("Заполнение поля email", async () => {
			await registrationPageObj.email.fill(BaseData.email);
		});

		await test.step("Заполнение поля пароля", async () => {
			await registrationPageObj.password.fill(AuthData.invalidPassword);
		});

		await test.step("Заполнение поля повторения пароля", async () => {
			await registrationPageObj.repeatPassword.fill(AuthData.invalidPassword);
		});

		await test.step("Нажатие на кнопку регистрации", async () => {
			await registrationPageObj.registrationButton.click();
		});

		await test.step("Отображение ошибки", async () => {
			await expect(registrationPageObj.registrationError).toBeVisible();
			await expect(registrationPageObj.registrationError).toHaveText(RegistrationData.errorPasswordLengthAtLeastCharacters);
		});
	});

	test("Регистрация с некорректным email", async ({ page }) => {
		await allure.severity("critical");

		await test.step("Заполнение поля email", async () => {
			await registrationPageObj.email.fill(RegistrationData.invalidEmail);
		});

		await test.step("Заполнение поля пароля", async () => {
			await registrationPageObj.password.fill(BaseData.password);
		});

		await test.step("Заполнение поля повторения пароля", async () => {
			await registrationPageObj.repeatPassword.fill(BaseData.password);
		});

		await test.step("Нажатие на кнопку регистрации", async () => {
			await registrationPageObj.registrationButton.click();
		});

		await test.step("Отображение ошибки", async () => {
			await expect(registrationPageObj.registrationError).toBeVisible();
			await expect(registrationPageObj.registrationError).toHaveText(RegistrationData.errorInvalidEmail);
		});
	});

	test("Регистрация с существующим email", async ({ page }) => {
		await allure.severity("normal");

		await test.step("Заполнение поля email", async () => {
			await registrationPageObj.email.fill(BaseData.email);
		});

		await test.step("Заполнение поля пароля", async () => {
			await registrationPageObj.password.fill(BaseData.password);
		});

		await test.step("Заполнение поля повторения пароля", async () => {
			await registrationPageObj.repeatPassword.fill(BaseData.password);
		});

		await test.step("Нажатие на кнопку регистрации", async () => {
			await registrationPageObj.registrationButton.click();
		});

		await test.step("Отображение ошибки", async () => {
			await expect(registrationPageObj.registrationError).toBeVisible();
			await expect(registrationPageObj.registrationError).toHaveText(RegistrationData.errorEmailAlreadyInUse);
		});
	});
});
