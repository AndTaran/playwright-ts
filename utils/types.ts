export type TBaseData = {
	url: string;
	email: string;
	password: string;
};

export type TAuthData = {
	title: string;
	invalidPassword: TBaseData["password"];
	errorFillEmailPassword: string;
	errorAccountNotFound: string;
};

export type TRegistrationData = {
	randomEmail: TBaseData["email"];
	invalidEmail: TBaseData["email"];
	errorInvalidEmail: string;
	errorEmailAlreadyInUse: string;
	errorPasswordLengthAtLeastCharacters: string;
	errorFillFields: string;
};

export type TWeatherData = {
	MoscowCity: string;
	KrasnodarCity: string;
	errorCityNotFound: string;
	title: TAuthData["title"];
};

export type TBooking = {
	bookingid: number;
	booking: {
		firstname: string;
		lastname: string;
		totalprice: number;
		depositpaid: boolean;
		bookingdates: {
			checkin: string;
			checkout: string;
		};
		additionalneeds: string;
	};
};

export type TAuthBody = {
	username: string;
	password: string;
};
