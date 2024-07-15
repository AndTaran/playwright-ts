import { Locator, Page } from "@playwright/test";

export default class WeatherPage {
	readonly page: Page;
	readonly headerTitle: Locator;
	readonly title: Locator;
	readonly email: Locator;
	readonly inputSearchCity: Locator;
	readonly buttonSearchCity: Locator;
	readonly buttonGeoDetection: Locator;
	readonly widgetWeather: Locator;
	readonly weatherLocation: Locator;
	readonly weatherDate: Locator;
	readonly weatherIcon: Locator;
	readonly weatherTemp: Locator;
	readonly weatherDescription: Locator;
	readonly weatherFeelsLike: Locator;
	readonly weatherMinTemp: Locator;
	readonly weatherMaxTemp: Locator;
	readonly weatherHumidity: Locator;
	readonly weatherWind: Locator;
	readonly weatherVisibility: Locator;
	readonly weatherError: Locator;

	constructor(page: Page) {
		this.page = page;
		this.headerTitle = page.locator(".title");
		this.title = page.getByTestId("main-title");
		this.email = page.locator(".email");
		this.inputSearchCity = page.locator(".search-city input");
		this.buttonSearchCity = page.locator(".search-city-button");
		this.buttonGeoDetection = page.getByTestId("geo-detection");
		this.widgetWeather = page.locator(".main");
		this.weatherLocation = page.locator(".location");
		this.weatherDate = page.locator(".date");
		this.weatherIcon = page.locator(".weather-icon");
		this.weatherTemp = page.locator(".weather-temp");
		this.weatherDescription = page.locator(".temp_description");
		this.weatherFeelsLike = page.locator(".feels_like");
		this.weatherMinTemp = page.locator(".min_temp");
		this.weatherMaxTemp = page.locator(".max_temp");
		this.weatherHumidity = page.locator(".humidity");
		this.weatherWind = page.locator(".wind");
		this.weatherVisibility = page.locator(".visibility");
		this.weatherError = page.locator(".search-city-error");
	}

	async searchCity(city: string) {
		await this.inputSearchCity.fill(city);
		await this.inputSearchCity.press("Enter");
	}
}
