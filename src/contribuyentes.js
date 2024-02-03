const { URL, MAX_LENGTH, MIN_LENGTH } = require('./constants');
const { ValidationError, ServerError } = require('./errors');

/**
 * Realiza una búsqueda de contribuyentes por un término específico y opcionalmente con un offset de paginación.
 *
 * @param {string} search - Término de búsqueda (entre 3 y 50 caracteres).
 * @param {number} [offset=0] - Offset de paginación, por defecto es 0.
 * @return {Promise<Array>} - Una promesa que se resuelve con un array de contribuyentes si la búsqueda es exitosa.
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
 // eslint-disable-next-line max-len
 *   const contribuyentes = await getContribuyenteBySearch('término-de-búsqueda', 1);
 *   console.log(contribuyentes);
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
async function getContribuyenteBySearch(search, offset = 0) {
  const trimmedSearch = search?.trim();

  if (!trimmedSearch) {
    throw new ValidationError(
        'El parámetro search es inválido. Debe tener entre 3 y 50 caracteres.',
        'No se puede realizar una busqueda con un parametro vacio.',
    );
  }

  if (trimmedSearch.length < MIN_LENGTH || trimmedSearch.length > MAX_LENGTH) {
    let rule = '';

    if (trimmedSearch.length < MIN_LENGTH) {
      rule = 'No se puede realizar una busqueda con un parametro menor a 3 caracteres.';
    }

    if (trimmedSearch.length > MAX_LENGTH) {
      rule = 'No se puede realizar una busqueda con un parametro mayor a 50 caracteres.';
    }

    throw new ValidationError(
        'El parámetro search es inválido. Debe tener entre 3 y 50 caracteres.',
        rule,
    );
  }

  if (offset < 0 || isNaN(offset)) {
    throw new ValidationError(
        'El parámetro offset es inválido. Debe ser un número mayor o igual a 0.',
        'El cliente envio un offset invalido. Debe ser un numero mayor o igual a 0.',
    );
  }

  try {
    const response = await fetch(
        `${URL}/search?search=${encodeURIComponent(trimmedSearch)}&page=${offset}`,
    );

    const contribuyentesJsonResponse = await response.json();

    if (response.status !== 200) {
      if (response.status >= 400 && response.status < 500) {
        if (response.status === 404) {
          throw new ServerError(
              'No se encontraron resultados.',
              contribuyentesJsonResponse?.message || '',
              404,
              'NOT_FOUND',
              'El servicio no encontro resultados para la busqueda realizada.',
          );
        }

        throw new ServerError(
            'El parámetro search es inválido. Debe tener entre 3 y 50 caracteres.',
            contribuyentesJsonResponse?.message || '',
            response.status,
            'BAD_REQUEST',
            'El cliente envio un parametro invalido.',
        );
      }

      throw new ServerError(
          'Ocurrió un error al consultar la API. Por favor, intente nuevamente o Contacta con los desarrolladores.',
          contribuyentesJsonResponse?.message || '',
          response.status,
          'INTERNAL_SERVER_ERROR',
          'El servicio no pudo procesar la solicitud.',
      );
    }

    const contribuyentes = contribuyentesJsonResponse.data?.contribuyentes;

    if (contribuyentes?.length === 0) {
      throw new ServerError(
          'No se encontraron resultados.',
          contribuyentesJsonResponse?.message || '',
          404,
          'NOT_FOUND',
          'El servicio no encontro resultados para la busqueda realizada.',
      );
    }

    return contribuyentes;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene información detallada sobre un contribuyente específico a través de su número de RUC o CI.
 *
 * @param {string} ruc - Número de RUC o CI del contribuyente (^\d{1,8}(?:-\d)?$).
 * @return {Promise<Object>} - Una promesa que se resuelve con un objeto representando la información del contribuyente.
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
  const regex = new RegExp('^\\d{1,8}(?:-\\d+)?$');
  if (!ruc || ruc.trim() === '' || !regex.test(ruc)) {
    throw new ValidationError(
        'El parámetro ruc es inválido. Debe tener formato 12345 o 123456-1',
        'El cliente envio un parametro invalido.',
    );
  }

  try {
    const response = await fetch(`${URL}/${ruc}`);

    const contribuyenteJsonResponse = await response.json();

    const serverErrorMessages = contribuyenteJsonResponse?.message;

    if (response.status !== 200) {
      if (response.status >= 400 && response.status < 500) {
        if (response.status === 404) {
          throw new ServerError(
              serverErrorMessages || 'No se encontraron resultados.',
              contribuyenteJsonResponse?.message || '',
              404,
              'NOT_FOUND',
              'El servicio no encontro resultados para la busqueda realizada.',
          );
        }

        throw new ServerError(
            serverErrorMessages ||
            'El parámetro ruc es inválido. Debe tener formato 12345 o 123456-1',
            serverErrorMessages || '',
            response.status,
            'BAD_REQUEST',
            'El cliente envio un parametro invalido.',
        );
      }

      throw new ServerError(
          serverErrorMessages ||
          'Ocurrió un error al consultar la API. Por favor, intente nuevamente o Contacta con los desarrolladores.',
          serverErrorMessages || '',
          response.status,
          'INTERNAL_SERVER_ERROR',
          'El servicio no pudo procesar la solicitud.',
      );
    }

    const contribuyente = contribuyenteJsonResponse.data;

    if (!contribuyente) {
      throw new ServerError(
          serverErrorMessages || 'No se encontraron resultados.',
          contribuyenteJsonResponse?.message || '',
          404,
          'NOT_FOUND',
          'El servicio no encontro resultados para la busqueda realizada.',
      );
    }

    return contribuyente;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getContribuyenteBySearch,
  getContribuyenteByRucOrCI,
};
