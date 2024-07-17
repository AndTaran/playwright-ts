import { test, expect } from "@playwright/test";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";
import WeatherPage from "../pages/WeatherPage";
import { BaseData, RegistrationData, AuthData } from "../data/data";

test.describe("Регистрация", { tag: "@registration" }, () => {
	let loginPageObj: LoginPage;
	let registrationPageObj: RegistrationPage;
	let weatherPageObj: WeatherPage;

	test.beforeEach(async ({ page }) => {
		loginPageObj = new LoginPage(page);
		registrationPageObj = new RegistrationPage(page);
		weatherPageObj = new WeatherPage(page);

		await test.step("Открытие страницы", async () => {
			await loginPageObj.goTo(BaseData.url);
		});
	});

	test("Проверка полей регистрации", async ({ page }) => {
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

	test.describe("Негативные сценарии регистрации", { tag: "@negative" }, () => {
		test("Регистрация с пустыми данными", async ({ page }) => {
			await test.step("Нажатие на кнопку регистрации", async () => {
				await registrationPageObj.registrationButton.click();
			});

			await test.step("Отображение ошибки", async () => {
				await expect(registrationPageObj.registrationError).toBeVisible();
				await expect(registrationPageObj.registrationError).toHaveText(RegistrationData.errorFillFields);
			});
		});

		test("Регистрация с паролем менее 6 символов", async ({ page }) => {
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

	test("Успешная регистрация", async ({ page }) => {
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
