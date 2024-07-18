import { TAuthBody, TBooking } from "../utils/types";

export const BookingCreateBody: TBooking["booking"] = {
	firstname: "Jim",
	lastname: "Brown",
	totalprice: 1500,
	depositpaid: true,
	bookingdates: {
		checkin: "2018-01-01",
		checkout: "2019-01-01",
	},
	additionalneeds: "Breakfast",
};

export const BookingUpdateBody: TBooking["booking"] = {
	firstname: "Anton",
	lastname: "Petrov",
	totalprice: 850,
	depositpaid: false,
	bookingdates: {
		checkin: "2022-01-01",
		checkout: "2022-01-02",
	},
	additionalneeds: "super bowls",
};

export const AuthBody: TAuthBody = {
	username: "admin",
	password: "password123",
};

export const BookingPartialUpdateBody: Pick<TBooking["booking"], "firstname" | "lastname"> = {
	firstname: "Anton",
	lastname: "Petrov",
};
