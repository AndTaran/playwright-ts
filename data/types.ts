export type BaseDataType = {
	url: string;
	email: string;
	password: string;
};

export type AuthDataType = {
	title: string;
	invalidPassword: BaseDataType["password"];
	errorFillEmailPassword: string;
	errorAccountNotFound: string;
};

export type RegistrationDataType = {
	randomEmail: BaseDataType["email"];
	invalidEmail: BaseDataType["email"];
	errorInvalidEmail: string;
	errorEmailAlreadyInUse: string;
	errorPasswordLengthAtLeastCharacters: string;
	errorFillFields: string;
};

export type WeatherDataType = {
	MoscowCity: string;
	KrasnodarCity: string;
	errorCityNotFound: string;
	title: AuthDataType["title"];
};
