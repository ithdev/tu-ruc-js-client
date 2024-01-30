const { URL } = require("./constants");

async function getContribuyenteBySearch(search, offset = 0) {
  if (
    !search ||
    search.trim() === "" ||
    search.length < 3 ||
    search.length > 11
  ) {
    throw new Error(
      "El parámetro search es inválido. Debe tener entre 3 y 10 caracteres."
    );
  }

  if (offset < 0 || isNaN(offset)) {
    throw new Error(
      "El parámetro offset es inválido. Debe ser un número mayor o igual a cero."
    );
  }

  try {
    const response = await fetch(
      `${URL}?search=${encodeURIComponent(search)}&page=${offset}`
    );

    const contribuyentesJsonResponse = await response.json();

    if (response.status !== 200) {
        if (response.status === 404) {
            throw new Error("No se encontraron resultados.");
        }

        if(response.status >400 && response.status < 500){
            throw new Error("Por favor envie un parámetro válido.");
        }

        throw new Error("Ocurrió un error al consultar la API. Por favor, intente nuevamente o Contacta con los desarrolladores.");
    }

    const contribuyentes = contribuyentesJsonResponse.data?.contribuyentes;

    if (contribuyentes?.length === 0) {
      throw new Error("No se encontraron resultados.");
    }

    return contribuyentes;
  } catch (error) {
    console.error(error);
    throw new Error("Ocurrió un error al consultar la API. Por favor, intente nuevamente o Contacta con los desarrolladores.");
  }
}

module.exports = {
  getContribuyenteBySearch,
};
