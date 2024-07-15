import { Locator, Page } from "@playwright/test";

export default class WeatherPage {
	readonly page: Page;
	readonly headerTitle: Locator;
	readonly title: Locator;
	readonly email: Locator;
	readonly inputSearchCity: Locator;
	readonly buttonSearchCity: Locator;
	readonly buttonGeoDetection: Locator;

	readonly buttonTabLg: Locator;
	readonly buttonTabMd: Locator;
	readonly buttonTabSm: Locator;
	readonly widgetWeatherLg: Locator;
	readonly widgetWeatherMd: Locator;
	readonly widgetWeatherSm: Locator;

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

	readonly weatherIconMd: Locator;
	readonly weatherTempMd: Locator;
	readonly weatherDescriptionMd: Locator;
	readonly weatherLocationMd: Locator;
	readonly weatherDateMd: Locator;

	readonly weatherIconSm: Locator;
	readonly weatherTempSm: Locator;
	readonly weatherLocationSm: Locator;

	constructor(page: Page) {
		this.page = page;
		this.headerTitle = page.locator(".title");
		this.title = page.getByTestId("main-title");
		this.email = page.locator(".email");
		this.inputSearchCity = page.locator(".search-city input");
		this.buttonSearchCity = page.locator(".search-city-button");
		this.buttonGeoDetection = page.getByTestId("geo-detection");

		this.buttonTabLg = page.locator("button", { hasText: "LG" });
		this.buttonTabMd = page.locator("button", { hasText: "MD" });
		this.buttonTabSm = page.locator("button", { hasText: "SM" });
		this.widgetWeatherLg = page.locator("#full-width-tabpanel-lg");
		this.widgetWeatherMd = page.locator("#full-width-tabpanel-md");
		this.widgetWeatherSm = page.locator("#full-width-tabpanel-sm");

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

		this.weatherIconMd = page.locator(".weatherIcon img");
		this.weatherTempMd = page.locator(".temperature");
		this.weatherDescriptionMd = page.locator(".description .weatherCondition");
		this.weatherLocationMd = page.locator(".description .place");
		this.weatherDateMd = page.locator(".date");

		this.weatherIconSm = page.locator(".weather_icon_small");
		this.weatherTempSm = page.locator(".temp_small");
		this.weatherLocationSm = page.locator(".city_name");
	}

	async searchCity(city: string) {
		await this.inputSearchCity.fill(city);
		await this.inputSearchCity.press("Enter");
	}
}
