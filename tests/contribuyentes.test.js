const { getContribuyenteBySearch } = require("../src/contribuyentes");

const { describe, test, expect } = require("@jest/globals");

describe("Contribuyentes", () => {
	describe("getContribuyenteBySearch", () => {
		test("deberia tirar un error si pasamos un string vacio como parametro", async () => {
			try {
				await getContribuyenteBySearch("");
			} catch (error) {
				expect(error.message).toBe(
					"El parámetro search es inválido. Debe tener entre 3 y 50 caracteres."
				);
			}
		});

		test("deberia tirar un error si pasamos un string con menos de 3 caracteres como parametro", async () => {
			try {
				await getContribuyenteBySearch("1");
			} catch (error) {
				expect(error.message).toBe(
					"El parámetro search es inválido. Debe tener entre 3 y 50 caracteres."
				);
			}
		});

		test("deberia tirar un error si pasamos un string con mas de 50 caracteres como parametro", async () => {
			try {
				await getContribuyenteBySearch(
					"Juan Perez Juan Perez Juan Perez Juan Perez Juan Perez Juan Perez Juan Perez Juan Perez Juan Perez Juan Perez Juan Perez Juan Perez Juan Perez Juan Perez"
				);
			} catch (error) {
				expect(error.message).toBe(
					"El parámetro search es inválido. Debe tener entre 3 y 50 caracteres."
				);
			}
		});

		test("deberia tirar un error si pasamos un offset negativo como parametro", async () => {
			try {
				await getContribuyenteBySearch("123", -1);
			} catch (error) {
				expect(error.message).toBe(
					"El parámetro offset es inválido. Debe ser un número mayor o igual a 0."
				);
			}
		});

		test("deberia tirar un error si pasamos un offset que no es un numero como parametro", async () => {
			try {
				await getContribuyenteBySearch("123", "a");
			} catch (error) {
				expect(error.message).toBe(
					"El parámetro offset es inválido. Debe ser un número mayor o igual a 0."
				);
			}
		});
	});
});
