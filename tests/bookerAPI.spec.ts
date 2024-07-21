import { test, expect, request, APIRequestContext } from "@playwright/test";
import { allure } from "allure-playwright";
import { TBooking } from "../utils/types";
import { AuthBody, BookingCreateBody, BookingPartialUpdateBody, BookingUpdateBody } from "../data/dataAPI";

let authToken: string;
let booking: TBooking;

let context: APIRequestContext;

test.beforeAll(async () => {
	context = await request.newContext({
		baseURL: "https://restful-booker.herokuapp.com",
		extraHTTPHeaders: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});

	await allure.epic("API restful-booker");
	await allure.owner("Егор Мостовой");
	await allure.description("Проверки API сервиса restful-booker");
	await allure.link("website", "https://restful-booker.herokuapp.com/apidoc/index.html", "Сайт restful-booker");
});

test.describe("Позитивные проверки", { tag: "@API" }, () => {
	test.describe.configure({ mode: "serial" });

	test("[GET] Проверка работоспособности API", async () => {
		await allure.severity("blocker");

		const response = await context.get("/ping");

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(201);
		expect(response.statusText()).toBe("Created");
	});

	test("[POST] Авторизация от админа", async () => {
		await allure.severity("blocker");

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
		await allure.severity("blocker");

		const response = await context.get("/booking");

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(200);
		expect(response.statusText()).toBe("OK");
	});

	test("[POST] Создание нового бронирования", async () => {
		await allure.severity("blocker");

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
		await allure.severity("blocker");

		const response = await context.get(`/booking/${booking.bookingid}`);

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(200);
		expect(response.statusText()).toBe("OK");
		expect(await response.json()).toMatchObject({
			...BookingCreateBody,
		});
	});

	test("[PUT] Изменение данных по бронированию", async () => {
		await allure.severity("blocker");

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
		await allure.severity("critical");

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
		await await allure.severity("blocker");

		const response = await context.delete(`/booking/${booking.bookingid}`, {
			headers: {
				Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
			},
		});

		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(201);
		expect(response.statusText()).toBe("Created");
	});

	test.afterAll(async () => {
		if (booking !== undefined) {
			await test.step("[DELETE] Удаление ранее созданного бронирования", async () => {
				await context.delete(`/booking/${booking.bookingid}`, {
					headers: {
						Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
					},
				});
			});
		}
	});
});

test.describe("Негативные проверки", { tag: ["@API", "@negative"] }, () => {
	test.describe.configure({ mode: "parallel" });

	test("[GET] Получение бронирования по id, которого не существует", async () => {
		await allure.severity("trivial");

		const response = await context.get("/booking/1234567890");

		expect(response.ok()).toBeFalsy();
		expect(response.status()).toBe(404);
		expect(response.statusText()).toBe("Not Found");
	});

	test("[PUT] Изменение данных по бронированию, которого не существует", async () => {
		await allure.severity("trivial");

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
		await allure.severity("trivial");

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
		await allure.severity("trivial");

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
