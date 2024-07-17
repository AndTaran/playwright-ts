import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import WeatherPage from "../pages/WeatherPage";
import { BaseData, WeatherData } from "../data/data";

test.describe("Прогноз погоды", { tag: "@weather" }, () => {
	test.describe.configure({ retries: 1 });

	test.use({
		// Геолокация города Краснодар
		geolocation: { longitude: 38.9764814, latitude: 45.0352718 },
		permissions: ["geolocation"],
	});

	let loginPageObj: LoginPage;
	let weatherPageObj: WeatherPage;

	test.beforeEach(async ({ page }) => {
		loginPageObj = new LoginPage(page);
		weatherPageObj = new WeatherPage(page);

		await test.step("Открытие страницы", async () => {
			await loginPageObj.goTo(BaseData.url);
		});

		await test.step("Авторизация", async () => {
			await loginPageObj.login(BaseData.email, BaseData.password);
		});
	});

	test('Отображение страницы "Прогноз погоды"', async ({ page }) => {
		await test.step("Отображение заголовка в шапке", async () => {
			await expect(weatherPageObj.headerTitle).toHaveText(WeatherData.title);
		});

		await test.step("Отображение заголовка на странице", async () => {
			await expect(weatherPageObj.title).toHaveText(WeatherData.title);
		});
	});

	test("Поиск города и отображение виджета погоды", async ({ page }) => {
		await test.step("Заполнение поля поиска", async () => {
			await weatherPageObj.inputSearchCity.fill(WeatherData.MoscowCity);
		});

		await test.step("Нажатие на кнопку поиска", async () => {
			await weatherPageObj.buttonSearchCity.click();
		});

		await test.step("Отображение виджета погоды", async () => {
			await expect(weatherPageObj.widgetWeatherLg).toBeVisible();
		});

		await test.step("Отображение наименования города", async () => {
			await expect(weatherPageObj.weatherLocation).toContainText(WeatherData.MoscowCity);
		});
	});

	test("Смена города", async ({ page }) => {
		await test.step("Поиск города", async () => {
			await weatherPageObj.searchCity(WeatherData.MoscowCity);
		});

		await test.step("Отображение наименования города в виджете", async () => {
			await expect(weatherPageObj.weatherLocation).toContainText(WeatherData.MoscowCity);
		});

		await test.step("Поиск другого города", async () => {
			await weatherPageObj.searchCity(WeatherData.KrasnodarCity);
		});

		await test.step("Отображение нового наименования города в виджете", async () => {
			await expect(weatherPageObj.weatherLocation).toContainText(WeatherData.KrasnodarCity);
		});
	});

	test("Определение геопозиции", async ({ page }) => {
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
			await expect(weatherPageObj.weatherLocation).toContainText(WeatherData.KrasnodarCity);
		});
	});

	test("Поиск несуществующего города и отображение ошибки", { tag: "@negative" }, async ({ page }) => {
		await test.step("Поиск города", async () => {
			await weatherPageObj.searchCity("Не существует города");
		});

		await test.step("Отображение виджета погоды", async () => {
			await expect(weatherPageObj.widgetWeatherLg).not.toBeVisible();
		});

		await test.step("Отображение ошибки", async () => {
			await expect(weatherPageObj.weatherError).toBeVisible();
			await expect(weatherPageObj.weatherError).toHaveText(WeatherData.errorCityNotFound);
		});
	});

	test("Проверка переключения между виджетами", async ({ page }) => {
		await test.step("Поиск города", async () => {
			await weatherPageObj.searchCity(WeatherData.MoscowCity);
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
		test("Отображение полей в большом виджете", async ({ page }) => {
			await test.step("Поиск города", async () => {
				await weatherPageObj.searchCity(WeatherData.MoscowCity);
			});

			await test.step("Отображение виджета погоды", async () => {
				await expect(weatherPageObj.widgetWeatherLg).toBeVisible();
			});

			await test.step("Отображение наименования города", async () => {
				await expect(weatherPageObj.weatherLocation).toContainText(WeatherData.MoscowCity);
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

		test("Отображение полей в среднем виджете", async ({ page }) => {
			await test.step("Поиск города", async () => {
				await weatherPageObj.searchCity(WeatherData.MoscowCity);
			});

			await test.step("Переключение на таб MD", async () => {
				await weatherPageObj.buttonTabMd.click();
			});

			await test.step("Отображение виджета погоды", async () => {
				await expect(weatherPageObj.widgetWeatherMd).toBeVisible();
			});

			await test.step("Отображение наименования города", async () => {
				await expect(weatherPageObj.weatherLocationMd).toContainText(WeatherData.MoscowCity);
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

		test("Отображение полей в малом виджете", async ({ page }) => {
			await test.step("Поиск города", async () => {
				await weatherPageObj.searchCity(WeatherData.MoscowCity);
			});

			await test.step("Переключение на таб SM", async () => {
				await weatherPageObj.buttonTabSm.click();
			});

			await test.step("Отображение виджета погоды", async () => {
				await expect(weatherPageObj.widgetWeatherSm).toBeVisible();
			});

			await test.step("Отображение наименования города", async () => {
				await expect(weatherPageObj.weatherLocationSm).toContainText(WeatherData.MoscowCity);
			});

			await test.step("Отображение иконки погоды", async () => {
				await expect(weatherPageObj.weatherIconSm).toBeVisible();
			});

			await test.step("Отображение температуры", async () => {
				await expect(weatherPageObj.weatherTempSm).toBeVisible();
			});
		});
	});
});
