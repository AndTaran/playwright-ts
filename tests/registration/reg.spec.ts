import { test, expect, Page } from "@playwright/test";
import RegistrationPage from "../../pages/RegistrationPage";
import LoginPage from "../../pages/LoginPage";

const url: string = "https://andtaran.github.io/weather_react/";
const randomEmail: string = Math.random().toString(36).substring(2, 11) + "@domain.com";
const email: string = "test1@test.ru";
const password: string = "123456";

test.describe("Регистрация", { tag: "@registration" }, () => {
	test.describe.configure({ retries: 2 });

	let loginPageObj: LoginPage;
	let registrationPageObj: RegistrationPage;

	test.beforeEach(async ({ page }) => {
		loginPageObj = new LoginPage(page);
		registrationPageObj = new RegistrationPage(page);

		await test.step("Открытие страницы", async () => {
			await loginPageObj.goTo(url);
		});
	});

	test("Проверка полей регистрации", async ({ page }: { page: Page }) => {
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
		test("Регистрация с пустыми данными", async ({ page }: { page: Page }) => {
			await test.step("Нажатие на кнопку регистрации", async () => {
				await registrationPageObj.registrationButton.click();
			});

			await test.step("Отображение ошибки", async () => {
				await expect(registrationPageObj.registrationError).toBeVisible();
				await expect(registrationPageObj.registrationError).toHaveText("Заполните все поля");
			});
		});

		test("Регистрация с некорректным паролем", async ({ page }: { page: Page }) => {
			await test.step("Заполнение поля email", async () => {
				await registrationPageObj.email.fill(email);
			});

			await test.step("Заполнение поля пароля", async () => {
				await registrationPageObj.password.fill("12345");
			});

			await test.step("Заполнение поля повторения пароля", async () => {
				await registrationPageObj.repeatPassword.fill("12345");
			});

			await test.step("Нажатие на кнопку регистрации", async () => {
				await registrationPageObj.registrationButton.click();
			});

			await test.step("Отображение ошибки", async () => {
				await expect(registrationPageObj.registrationError).toBeVisible();
				await expect(registrationPageObj.registrationError).toHaveText("Firebase: Password should be at least 6 characters (auth/weak-password).");
			});
		});

		test("Регистрация с некорректным email", async ({ page }: { page: Page }) => {
			await test.step("Заполнение поля email", async () => {
				await registrationPageObj.email.fill("test1");
			});

			await test.step("Заполнение поля пароля", async () => {
				await registrationPageObj.password.fill(password);
			});

			await test.step("Заполнение поля повторения пароля", async () => {
				await registrationPageObj.repeatPassword.fill(password);
			});

			await test.step("Нажатие на кнопку регистрации", async () => {
				await registrationPageObj.registrationButton.click();
			});

			await test.step("Отображение ошибки", async () => {
				await expect(registrationPageObj.registrationError).toBeVisible();
				await expect(registrationPageObj.registrationError).toHaveText("Firebase: Error (auth/invalid-email).");
			});
		});

		test("Регистрация с существующим email", async ({ page }: { page: Page }) => {
			await test.step("Заполнение поля email", async () => {
				await registrationPageObj.email.fill(email);
			});

			await test.step("Заполнение поля пароля", async () => {
				await registrationPageObj.password.fill(password);
			});

			await test.step("Заполнение поля повторения пароля", async () => {
				await registrationPageObj.repeatPassword.fill(password);
			});

			await test.step("Нажатие на кнопку регистрации", async () => {
				await registrationPageObj.registrationButton.click();
			});

			await test.step("Отображение ошибки", async () => {
				await expect(registrationPageObj.registrationError).toBeVisible();
				await expect(registrationPageObj.registrationError).toHaveText("Firebase: Error (auth/email-already-in-use).");
			});
		});
	});

	test("Успешная регистрация", async ({ page }) => {
		await test.step("Заполнение поля email", async () => {
			await registrationPageObj.email.fill(randomEmail);
		});

		await test.step("Заполнение поля пароля", async () => {
			await registrationPageObj.password.fill(password);
		});

		await test.step("Заполнение поля повторения пароля", async () => {
			await registrationPageObj.repeatPassword.fill(password);
		});
		await test.step("Нажатие на кнопку регистрации", async () => {
			await registrationPageObj.registrationButton.click();
		});

		await test.step("Отображение почты зарегистрированного пользователя", async () => {
			await expect(page.locator(".email")).toHaveText(randomEmail);
		});
	});
});
