import { test, expect, Page } from "@playwright/test";

const url: string = "https://andtaran.github.io/weather_react/";
const email: string = "test1@test.ru";
const password: string = "123456";
const MoscowCity: string = "Москва";
const KrasnodarCity: string = "Краснодар";

test.beforeEach(async ({ page }: { page: Page }) => {
	await page.goto(url);
	await page.locator(".auth-email input").fill(email);
	await page.locator(".auth-password input").fill(password);
	await page.getByRole("button", { name: "Авторизация" }).click();
});

test('Отображение страницы "Прогноз погоды"', async ({ page }: { page: Page }) => {
	await expect(page).toHaveTitle("React App");
	await expect(page.locator(".title")).toHaveText("Прогноз погоды");
	await expect(page.locator(".email")).toHaveText(email);
});

test("Поиск города и отображение погоды", async ({ page }: { page: Page }) => {
	await page.locator(".search-city input").fill(MoscowCity);
	await page.locator(".search-city input").press("Enter");
	await expect(page.locator(".main")).toBeVisible();
	await expect(page.locator("h5.location")).toContainText(MoscowCity);
});

test("Смена города", async ({ page }: { page: Page }) => {
	await page.locator(".search-city input").fill(MoscowCity);
	await page.locator(".search-city input").press("Enter");
	await expect(page.locator("h5.location")).toContainText(MoscowCity);

	await page.locator(".search-city input").fill(KrasnodarCity);
	await page.locator(".search-city input").press("Enter");
	await expect(page.locator(".main")).toBeVisible();
	await expect(page.locator("h5.location")).toContainText(KrasnodarCity);
});

test.describe("Геопозиция", () => {
	test.use({
		geolocation: { longitude: 38.9764814, latitude: 45.0352718 },
		permissions: ["geolocation"],
	});

	test("Определение геопозиции", async ({ page }: { page: Page }) => {
		await page
			.getByTestId("geo-detection")
			.filter({ has: page.locator("button") })
			.click();

		await expect(page.locator(".main")).toBeVisible();
		await expect(page.locator("h5.location")).toContainText(KrasnodarCity);
	});
});

test("Поиск несуществующего города и отображение ошибки", async ({ page }: { page: Page }) => {
	await page.locator(".search-city input").fill("Не существует города");
	await page.locator(".search-city input").press("Enter");
	await expect(page.locator("#root")).toContainText("Город не найден...");
	await expect(page.locator(".main")).not.toBeVisible();
});

test("Отображение полей в большом виджете", async ({ page }: { page: Page }) => {
	await page.locator(".search-city input").fill(MoscowCity);
	await page.locator(".search-city input").press("Enter");
	await expect(page.locator(".main")).toBeVisible();

	await expect(page.locator(".location")).toContainText(MoscowCity);
	await expect(page.locator(".date")).toBeVisible();
	await expect(page.locator(".weather-icon")).toBeVisible();
	await expect(page.locator(".weather-temp")).toBeVisible();
	await expect(page.locator(".temp_description")).toBeVisible();
	await expect(page.locator(".feels_like")).toBeVisible();
	await expect(page.locator(".min_temp")).toBeVisible();
	await expect(page.locator(".max_temp")).toBeVisible();
	await expect(page.locator(".wind")).toBeVisible();
	await expect(page.locator(".humidity")).toBeVisible();
});

test.afterEach(async ({ page }: { page: Page }) => {
	await page.close();
});
