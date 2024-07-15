import { test, expect, Page } from "@playwright/test";
import LoginPage from "../../pages/LoginPage";
import WeatherPage from "../../pages/WeatherPage";

const url: string = "https://andtaran.github.io/weather_react/";
const email: string = "test1@test.ru";
const password: string = "123456";
const MoscowCity: string = "Москва";
const KrasnodarCity: string = "Краснодар";

test.beforeEach(async ({ page }: { page: Page }) => {
	const loginPageObj = new LoginPage(page);

	await loginPageObj.goTo(url);
	await loginPageObj.login(email, password);
});

test('Отображение страницы "Прогноз погоды"', async ({ page }: { page: Page }) => {
	const weatherPageObj = new WeatherPage(page);

	await expect(weatherPageObj.headerTitle).toHaveText("Прогноз погоды");
	await expect(weatherPageObj.title).toHaveText("Прогноз погоды");
});

test("Поиск города и отображение виджета погоды", async ({ page }: { page: Page }) => {
	const weatherPageObj = new WeatherPage(page);

	await weatherPageObj.inputSearchCity.fill(MoscowCity);
	await weatherPageObj.buttonSearchCity.click();
	await expect(weatherPageObj.widgetWeather).toBeVisible();
	await expect(weatherPageObj.weatherLocation).toContainText(MoscowCity);
});

test("Смена города", async ({ page }: { page: Page }) => {
	const weatherPageObj = new WeatherPage(page);

	await weatherPageObj.searchCity(MoscowCity);
	await expect(weatherPageObj.weatherLocation).toContainText(MoscowCity);

	await weatherPageObj.searchCity(KrasnodarCity);
	await expect(weatherPageObj.weatherLocation).toContainText(KrasnodarCity);
});

test.describe("Геопозиция", () => {
	test.use({
		// Геолокация города Краснодар
		geolocation: { longitude: 38.9764814, latitude: 45.0352718 },
		permissions: ["geolocation"],
	});

	test("Определение геопозиции", async ({ page }: { page: Page }) => {
		const weatherPageObj = new WeatherPage(page);

		await weatherPageObj.buttonGeoDetection.click();

		await expect(weatherPageObj.widgetWeather).toBeVisible();
		await expect(weatherPageObj.weatherLocation).toContainText(KrasnodarCity);
	});
});

test("Поиск несуществующего города и отображение ошибки", async ({ page }: { page: Page }) => {
	const weatherPageObj = new WeatherPage(page);

	await weatherPageObj.searchCity("Не существует города");
	await expect(weatherPageObj.widgetWeather).not.toBeVisible();
	await expect(weatherPageObj.weatherError).toBeVisible();
	await expect(weatherPageObj.weatherError).toHaveText("Город не найден...");
});

test("Отображение полей в большом виджете", async ({ page }: { page: Page }) => {
	const weatherPageObj = new WeatherPage(page);

	await weatherPageObj.searchCity(MoscowCity);
	await expect(weatherPageObj.widgetWeather).toBeVisible();

	await expect(weatherPageObj.weatherLocation).toContainText(MoscowCity);
	await expect(weatherPageObj.weatherDate).toBeVisible();
	await expect(weatherPageObj.weatherIcon).toBeVisible();
	await expect(weatherPageObj.weatherTemp).toBeVisible();
	await expect(weatherPageObj.weatherDescription).toBeVisible();
	await expect(weatherPageObj.weatherFeelsLike).toBeVisible();
	await expect(weatherPageObj.weatherMinTemp).toBeVisible();
	await expect(weatherPageObj.weatherMaxTemp).toBeVisible();
	await expect(weatherPageObj.weatherWind).toBeVisible();
	await expect(weatherPageObj.weatherHumidity).toBeVisible();
});
