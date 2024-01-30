const { URL } = require("./constants");
const { CustomError } = require("./errors");

async function getContribuyenteBySearch(search, offset = 0) {
  if (
    !search ||
    search.trim() === "" ||
    search.length < 3 ||
    search.length > 11
  ) {
    throw new CustomError(
      "El parámetro search es inválido. Debe tener entre 3 y 11 caracteres."
    );
  }

  if (offset < 0 || isNaN(offset)) {
    throw new CustomError(
      "El parámetro offset es inválido. Debe ser un número mayor o igual a 0."
    );
  }

  try {
    const response = await fetch(
      `${URL}/search?search=${encodeURIComponent(search)}&page=${offset}`
    );

    const contribuyentesJsonResponse = await response.json();

    if (response.status !== 200) {
      if (response.status === 404) {
        throw new CustomError(
          "No se encontraron resultados.",
          contribuyentesJsonResponse?.message || ""
        );
      }

      if (response.status > 400 && response.status < 500) {
        throw new CustomError(
          "El parámetro search es inválido. Debe tener entre 3 y 11 caracteres.",
          contribuyentesJsonResponse?.message || ""
        );
      }

      throw new CustomError(
        "Ocurrió un error al consultar la API. Por favor, intente nuevamente o Contacta con los desarrolladores.",
        contribuyentesJsonResponse?.message || ""
      );
    }

    const contribuyentes = contribuyentesJsonResponse.data?.contribuyentes;

    if (contribuyentes?.length === 0) {
      throw new CustomError(
        "No se encontraron resultados.",
        contribuyentesJsonResponse?.message || ""
      );
    }

    return contribuyentes;
  } catch (error) {
    throw new CustomError(
      "Ocurrió un error al consultar la API. Por favor, intente nuevamente o Contacta con los desarrolladores.",
      error?.message || error?.toString() || ""
    );
  }
}

async function getContribuyenteByRucOrCI(ruc) {
  if (!ruc || ruc.trim() === "" || ruc.length < 3 || ruc.length > 11) {
    throw new CustomError(
      "El parámetro ruc es inválido. Debe tener entre 3 y 11 caracteres."
    );
  }

  try {
    const response = await fetch(`${URL}/${ruc}`);

    const contribuyenteJsonResponse = await response.json();

    if (response.status !== 200) {
      if (response.status === 404) {
        throw new CustomError(
          "No se encontraron resultados.",
          contribuyenteJsonResponse?.message || ""
        );
      }

      if (response.status > 400 && response.status < 500) {
        throw new CustomError(
          "El parámetro ruc es inválido. Debe tener entre 3 y 11 caracteres.",
          contribuyenteJsonResponse?.message || ""
        );
      }

      throw new CustomError(
        "Ocurrió un error al consultar la API. Por favor, intente nuevamente o Contacta con los desarrolladores.",
        contribuyenteJsonResponse?.message || ""
      );
    }

    const contribuyente = contribuyenteJsonResponse.data;

    if (!contribuyente) {
      throw new CustomError(
        "No se encontraron resultados.",
        contribuyenteJsonResponse?.message || ""
      );
    }

    return contribuyente;
  } catch (error) {
    throw new CustomError(
      "Ocurrió un error al consultar la API. Por favor, intente nuevamente o Contacta con los desarrolladores.",
      error?.message || error?.toString() || ""
    );
  }
}

module.exports = {
  getContribuyenteBySearch,
  getContribuyenteByRucOrCI,
};
