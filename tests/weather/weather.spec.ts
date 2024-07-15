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

	await test.step("Открытие страницы", async () => {
		await loginPageObj.goTo(url);
	});

	await test.step("Авторизация", async () => {
		await loginPageObj.login(email, password);
	});
});

test('Отображение страницы "Прогноз погоды"', async ({ page }: { page: Page }) => {
	const weatherPageObj = new WeatherPage(page);

	await test.step("Отображение заголовка в шапке", async () => {
		await expect(weatherPageObj.headerTitle).toHaveText("Прогноз погоды");
	});

	await test.step("Отображение заголовка на странице", async () => {
		await expect(weatherPageObj.title).toHaveText("Прогноз погоды");
	});
});

test("Поиск города и отображение виджета погоды", async ({ page }: { page: Page }) => {
	const weatherPageObj = new WeatherPage(page);

	await test.step("Заполнение поля поиска", async () => {
		await weatherPageObj.inputSearchCity.fill(MoscowCity);
	});

	await test.step("Нажатие на кнопку поиска", async () => {
		await weatherPageObj.buttonSearchCity.click();
	});

	await test.step("Отображение виджета погоды", async () => {
		await expect(weatherPageObj.widgetWeatherLg).toBeVisible();
	});

	await test.step("Отображение наименования города", async () => {
		await expect(weatherPageObj.weatherLocation).toContainText(MoscowCity);
	});
});

test("Смена города", async ({ page }: { page: Page }) => {
	const weatherPageObj = new WeatherPage(page);

	await test.step("Поиск города", async () => {
		await weatherPageObj.searchCity(MoscowCity);
	});

	await test.step("Отображение наименования города в виджете", async () => {
		await expect(weatherPageObj.weatherLocation).toContainText(MoscowCity);
	});

	await test.step("Поиск другого города", async () => {
		await weatherPageObj.searchCity(KrasnodarCity);
	});

	await test.step("Отображение нового наименования города в виджете", async () => {
		await expect(weatherPageObj.weatherLocation).toContainText(KrasnodarCity);
	});
});

test.describe("Геопозиция", () => {
	test.use({
		// Геолокация города Краснодар
		geolocation: { longitude: 38.9764814, latitude: 45.0352718 },
		permissions: ["geolocation"],
	});

	test("Определение геопозиции", async ({ page }: { page: Page }) => {
		const weatherPageObj = new WeatherPage(page);

		await test.step("Отображение кнопки для определения геопозиции", async () => {
			await expect(weatherPageObj.buttonGeoDetection).toBeVisible();
		});

		await test.step("Нажатие на кнопку для определения геопозиции", async () => {
			await weatherPageObj.buttonGeoDetection.click();
		});

		await test.step("Отображение виджета погоды", async () => {
			await expect(weatherPageObj.widgetWeatherLg).toBeVisible();
		});

		await test.step("Отображение наименования города", async () => {
			await expect(weatherPageObj.weatherLocation).toContainText(KrasnodarCity);
		});
	});
});

test("Поиск несуществующего города и отображение ошибки", async ({ page }: { page: Page }) => {
	const weatherPageObj = new WeatherPage(page);

	await test.step("Поиск города", async () => {
		await weatherPageObj.searchCity("Не существует города");
	});

	await test.step("Отображение виджета погоды", async () => {
		await expect(weatherPageObj.widgetWeatherLg).not.toBeVisible();
	});

	await test.step("Отображение ошибки", async () => {
		await expect(weatherPageObj.weatherError).toBeVisible();
		await expect(weatherPageObj.weatherError).toHaveText("Город не найден...");
	});
});

test("Проверка переключения между виджетами", async ({ page }: { page: Page }) => {
	const weatherPageObj = new WeatherPage(page);

	await test.step("Поиск города", async () => {
		await weatherPageObj.searchCity("Не существует города");
	});

	await test.step("Проверка активного таба LG", async () => {
		await expect(weatherPageObj.buttonTabLg).toHaveAttribute("aria-selected", "true");
		await expect(weatherPageObj.buttonTabMd).toHaveAttribute("aria-selected", "false");
		await expect(weatherPageObj.buttonTabSm).toHaveAttribute("aria-selected", "false");
		await expect(weatherPageObj.widgetWeatherLg).toBeVisible();
	});

	await test.step("Переключение на таб MD", async () => {
		await weatherPageObj.buttonTabMd.click();
		await expect(weatherPageObj.buttonTabMd).toHaveAttribute("aria-selected", "true");
		await expect(weatherPageObj.buttonTabLg).toHaveAttribute("aria-selected", "false");
		await expect(weatherPageObj.buttonTabSm).toHaveAttribute("aria-selected", "false");
		await expect(weatherPageObj.widgetWeatherMd).toBeVisible();
	});

	await test.step("Переключение на таб SM", async () => {
		await weatherPageObj.buttonTabSm.click();
		await expect(weatherPageObj.buttonTabSm).toHaveAttribute("aria-selected", "true");
		await expect(weatherPageObj.buttonTabMd).toHaveAttribute("aria-selected", "false");
		await expect(weatherPageObj.buttonTabLg).toHaveAttribute("aria-selected", "false");
		await expect(weatherPageObj.widgetWeatherSm).toBeVisible();
	});
});

test.describe("Виджеты погоды", () => {
	test("Отображение полей в большом виджете", async ({ page }: { page: Page }) => {
		const weatherPageObj = new WeatherPage(page);

		await test.step("Поиск города", async () => {
			await weatherPageObj.searchCity(MoscowCity);
		});

		await test.step("Отображение виджета погоды", async () => {
			await expect(weatherPageObj.widgetWeatherLg).toBeVisible();
		});

		await test.step("Отображение наименования города", async () => {
			await expect(weatherPageObj.weatherLocation).toContainText(MoscowCity);
		});

		await test.step("Отображение даты в виджете", async () => {
			await expect(weatherPageObj.weatherDate).toBeVisible();
		});

		await test.step("Отображение иконки погоды", async () => {
			await expect(weatherPageObj.weatherIcon).toBeVisible();
		});

		await test.step("Отображение температуры", async () => {
			await expect(weatherPageObj.weatherTemp).toBeVisible();
		});

		await test.step("Отображение описания погоды", async () => {
			await expect(weatherPageObj.weatherDescription).toBeVisible();
		});

		await test.step("Отображение ощущаемой температуры", async () => {
			await expect(weatherPageObj.weatherFeelsLike).toBeVisible();
		});

		await test.step("Отображение минимальной температуры", async () => {
			await expect(weatherPageObj.weatherMinTemp).toBeVisible();
		});

		await test.step("Отображение максимальной температуры", async () => {
			await expect(weatherPageObj.weatherMaxTemp).toBeVisible();
		});

		await test.step("Отображение скорости ветра", async () => {
			await expect(weatherPageObj.weatherWind).toBeVisible();
		});

		await test.step("Отображение влажности", async () => {
			await expect(weatherPageObj.weatherHumidity).toBeVisible();
		});
	});

	test("Отображение полей в среднем виджете", async ({ page }: { page: Page }) => {
		const weatherPageObj = new WeatherPage(page);

		await test.step("Поиск города", async () => {
			await weatherPageObj.searchCity(MoscowCity);
		});

		await test.step("Переключение на таб MD", async () => {
			await weatherPageObj.buttonTabMd.click();
		});

		await test.step("Отображение виджета погоды", async () => {
			await expect(weatherPageObj.widgetWeatherMd).toBeVisible();
		});

		await test.step("Отображение наименования города", async () => {
			await expect(weatherPageObj.weatherLocationMd).toContainText(MoscowCity);
		});

		await test.step("Отображение иконки погоды", async () => {
			await expect(weatherPageObj.weatherIconMd).toBeVisible();
		});

		await test.step("Отображение температуры", async () => {
			await expect(weatherPageObj.weatherTempMd).toBeVisible();
		});

		await test.step("Отображение описания погоды", async () => {
			await expect(weatherPageObj.weatherDescriptionMd).toBeVisible();
		});

		await test.step("Отображение даты", async () => {
			await expect(weatherPageObj.weatherDateMd).toBeVisible();
		});
	});

	test("Отображение полей в малом виджете", async ({ page }: { page: Page }) => {
		const weatherPageObj = new WeatherPage(page);

		await test.step("Поиск города", async () => {
			await weatherPageObj.searchCity(MoscowCity);
		});

		await test.step("Переключение на таб SM", async () => {
			await weatherPageObj.buttonTabSm.click();
		});

		await test.step("Отображение виджета погоды", async () => {
			await expect(weatherPageObj.widgetWeatherSm).toBeVisible();
		});

		await test.step("Отображение наименования города", async () => {
			await expect(weatherPageObj.weatherLocationSm).toContainText(MoscowCity);
		});

		await test.step("Отображение иконки погоды", async () => {
			await expect(weatherPageObj.weatherIconSm).toBeVisible();
		});

		await test.step("Отображение температуры", async () => {
			await expect(weatherPageObj.weatherTempSm).toBeVisible();
		});
	});
});
