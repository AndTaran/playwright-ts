import { TAuthData, TBaseData, TRegistrationData, TWeatherData } from "../utils/types";

export const BaseData: TBaseData = {
	url: "https://andtaran.github.io/weather_react/",
	email: "test1@test.ru",
	password: "123456",
};

export const AuthData: TAuthData = {
	title: "Регистрация/Авторизация",
	invalidPassword: "12345",
	errorFillEmailPassword: "Заполните email/пароль",
	errorAccountNotFound: "Аккаунт не найден",
};

export const RegistrationData: TRegistrationData = {
	randomEmail: Math.random().toString(36).substring(2, 11) + "@domain.com",
	invalidEmail: "test1",
	errorInvalidEmail: "Firebase: Error (auth/invalid-email).",
	errorEmailAlreadyInUse: "Firebase: Error (auth/email-already-in-use).",
	errorPasswordLengthAtLeastCharacters: "Firebase: Password should be at least 6 characters (auth/weak-password).",
	errorFillFields: "Заполните все поля",
};

export const WeatherData: TWeatherData = {
	MoscowCity: "Москва",
	KrasnodarCity: "Краснодар",
	errorCityNotFound: "Город не найден...",
	title: "Прогноз погоды",
};
