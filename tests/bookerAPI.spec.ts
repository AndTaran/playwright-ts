import { test, expect, request } from "@playwright/test";
import { TBooking } from "../utils/types";
import { AuthBody, BookingCreateBody, BookingPartialUpdateBody, BookingUpdateBody } from "../data/dataAPI";

let authToken: string;
let booking: TBooking;

test.describe("Restful-booker API", { tag: "@API" }, () => {
	test.describe.configure({ mode: "serial" });

	let context: any;

	test.beforeAll(async () => {
		context = await request.newContext({
			baseURL: "https://restful-booker.herokuapp.com",
			extraHTTPHeaders: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
	});

	test("[GET] Проверка работоспособности API", async () => {
		const response = await context.get("/ping");

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(201);
		expect(response.statusText()).toBe("Created");
	});

	test("[POST] Авторизация от админа", async () => {
		const response = await context.post("/auth", {
			data: {
				...AuthBody,
			},
		});

		const data = await response.json();
		authToken = data.token;

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(200);
		expect(response.statusText()).toBe("OK");
		expect(data).toMatchObject({
			token: authToken,
		});
	});

	test("[GET] Получение списка id всех бронирований", async () => {
		const response = await context.get("/booking");

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(200);
		expect(response.statusText()).toBe("OK");
	});

	test("[POST] Создание нового бронирования", async () => {
		const response = await context.post("/booking", {
			data: {
				...BookingCreateBody,
			},
		});

		const data = await response.json();
		booking = data;

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(200);
		expect(response.statusText()).toBe("OK");
		expect(data).toMatchObject({
			...booking,
		});
	});

	test("[GET] Получение бронирования по id", async () => {
		const response = await context.get(`/booking/${booking.bookingid}`);

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(200);
		expect(response.statusText()).toBe("OK");
		expect(await response.json()).toMatchObject({
			...BookingCreateBody,
		});
	});

	test("[PUT] Изменение данных по бронированию", async () => {
		const response = await context.put(`/booking/${booking.bookingid}`, {
			headers: {
				Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
			},
			data: {
				...BookingUpdateBody,
			},
		});

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(200);
		expect(response.statusText()).toBe("OK");
		expect(await response.json()).toMatchObject({
			...BookingUpdateBody,
		});
	});

	test("[PATCH] Частичное изменение данных по бронированию", async () => {
		const response = await context.patch(`/booking/${booking.bookingid}`, {
			headers: {
				Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
			},
			data: {
				...BookingPartialUpdateBody,
			},
		});

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(200);
		expect(response.statusText()).toBe("OK");
		expect(await response.json()).toMatchObject({
			...BookingPartialUpdateBody,
		});
	});

	test("[DELETE] Удаление бронирования", async () => {
		const response = await context.delete(`/booking/${booking.bookingid}`, {
			headers: {
				Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
			},
		});

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(201);
		expect(response.statusText()).toBe("Created");
	});

	test.describe("Негативные проверки", { tag: "@negative" }, () => {
		test("[GET] Получение бронирования по id, которого не существует", async () => {
			const response = await context.get("/booking/1234567890");

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(404);
			expect(response.statusText()).toBe("Not Found");
		});

		test("[PUT] Изменение данных по бронированию, которого не существует", async () => {
			const response = await context.put("/booking/1234567890", {
				headers: {
					Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
				},
				data: {
					...BookingUpdateBody,
				},
			});

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(405);
			expect(response.statusText()).toBe("Method Not Allowed");
		});

		test("[PATCH] Частичное изменение данных по бронированию, которого не существует", async () => {
			const response = await context.patch("/booking/1234567890", {
				headers: {
					Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
				},
				data: {
					...BookingPartialUpdateBody,
				},
			});

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(405);
			expect(response.statusText()).toBe("Method Not Allowed");
		});

		test("[DELETE] Удаление бронирования, которого не существует", async () => {
			const response = await context.delete("/booking/1234567890", {
				headers: {
					Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
				},
			});

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(405);
			expect(response.statusText()).toBe("Method Not Allowed");
		});
	});

	test.afterAll(async () => {
		if (booking !== undefined) {
			console.log(booking);
			await context.delete(`/booking/${booking.bookingid}`, {
				headers: {
					Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
				},
			});
		}
	});
});
