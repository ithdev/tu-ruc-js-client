const { URL, MAX_LENGTH, MIN_LENGTH } = require("./constants");
const { CustomError } = require("./errors");

/**
 * Realiza una búsqueda de contribuyentes por un término específico y opcionalmente con un offset de paginación.
 *
 * @param {string} search - Término de búsqueda (entre 3 y 50 caracteres).
 * @param {number} [offset=0] - Offset de paginación, por defecto es 0.
 * @returns {Promise<Array>} - Una promesa que se resuelve con un array de contribuyentes si la búsqueda es exitosa.
 *
 *  Cada contribuyente tiene el siguiente formato:
 *   {
 *     doc: number,           // Número de documento del contribuyente - CI
 *     razonSocial: string,   // Razón social del contribuyente - Nombre o razón social
 *     dv: number,            // Dígito verificador del RUC - Numero final del RUC despues del "-"
 *     ruc: string,           // Número de RUC completo - RUC con el DV
 *   }
 *
 * @throws {CustomError} - Se lanza una instancia de CustomError si ocurre algún error durante la consulta.
 *   - Si el término de búsqueda es inválido o tiene una longitud incorrecta.
 *   - Si el offset es inválido (menor que 0 o no es un número).
 *   - Si la respuesta de la API no es exitosa (status no es 200).
 *   - Si no se encuentran resultados.
 *   - Si ocurre un error al consultar la API.
 *   - Si hay un error durante la ejecución de la función.
 *
 * @example
 * try {
 *   const contribuyentes = await getContribuyenteBySearch('término-de-búsqueda', 1);
 *   console.log(contribuyentes);
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
async function getContribuyenteBySearch(search, offset = 0) {
  if (
    !search ||
    search.trim() === "" ||
    search.length < MIN_LENGTH ||
    search.length > MAX_LENGTH
  ) {
    throw new CustomError(
      `El parámetro search es inválido. Debe tener entre ${MIN_LENGTH} y ${MAX_LENGTH} caracteres.`
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
          `El parámetro search es inválido. Debe tener entre ${MIN_LENGTH} y ${MAX_LENGTH} caracteres.`,
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

/**
 * Obtiene información detallada sobre un contribuyente específico a través de su número de RUC o CI.
 *
 * @param {string} ruc - Número de RUC o CI del contribuyente (^\d{1,8}(?:-\d)?$).
 * @returns {Promise<Object>} - Una promesa que se resuelve con un objeto representando la información del contribuyente.
 *
 *   El objeto tiene el siguiente formato:
 *   {
 *     doc: number,           // Número de documento del contribuyente - CI
 *     razonSocial: string,   // Razón social del contribuyente - Nombre o razón social
 *     dv: number,            // Dígito verificador del RUC - Numero final del RUC despues del "-"
 *     ruc: string,           // Número de RUC completo - RUC con el DV
 *   }
 * @throws {CustomError} - Se lanza una instancia de CustomError si ocurre algún error durante la consulta.
 *   - Si el número de RUC o CI es inválido o tiene una longitud incorrecta.
 *   - Si la respuesta de la API no es exitosa (status no es 200).
 *   - Si no se encuentran resultados.
 *   - Si ocurre un error al consultar la API.
 *   - Si hay un error durante la ejecución de la función.
 *
 * @example
 * try {
 *   const contribuyente = await getContribuyenteByRucOrCI('1234567890');
 *   console.log(contribuyente);
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
async function getContribuyenteByRucOrCI(ruc) {
  const regex = new RegExp("^\\d{1,8}(?:-\\d+)?$");
  if (!ruc || ruc.trim() === "" || !regex.test(ruc)) {
    throw new CustomError(
      "El parámetro ruc es inválido. Debe tener formato 123456-1 (^\d{1,8}(?:-\d)?$)."
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
          "El parámetro ruc es inválido. Debe tener formato 123456 (^\d{1,8}(?:-\d)?$).",
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
