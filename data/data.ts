import { AuthDataType, BaseDataType, RegistrationDataType, WeatherDataType } from "./types";

export const BaseData: BaseDataType = {
	url: "https://andtaran.github.io/weather_react/",
	email: "test1@test.ru",
	password: "123456",
};

export const AuthData: AuthDataType = {
	title: "Регистрация/Авторизация",
	invalidPassword: "12345",
	errorFillEmailPassword: "Заполните email/пароль",
	errorAccountNotFound: "Аккаунт не найден",
};

export const RegistrationData: RegistrationDataType = {
	randomEmail: Math.random().toString(36).substring(2, 11) + "@domain.com",
	invalidEmail: "test1",
	errorInvalidEmail: "Firebase: Error (auth/invalid-email).",
	errorEmailAlreadyInUse: "Firebase: Error (auth/email-already-in-use).",
	errorPasswordLengthAtLeastCharacters: "Firebase: Password should be at least 6 characters (auth/weak-password).",
	errorFillFields: "Заполните все поля",
};

export const WeatherData: WeatherDataType = {
	MoscowCity: "Москва",
	KrasnodarCity: "Краснодар",
	errorCityNotFound: "Город не найден...",
	title: "Прогноз погоды",
};
