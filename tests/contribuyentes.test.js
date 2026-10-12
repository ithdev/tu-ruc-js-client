const { afterEach, beforeEach, describe, expect, test } = require('@jest/globals');
const { getContribuyenteBySearch, getContribuyenteByRucOrCI } = require('..');

const contribuyente = {
  doc: 1234567,
  razonSocial: 'JUAN PÉREZ',
  dv: 8,
  ruc: '1234567-8',
};

beforeEach(() => {
  jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Solicitud HTTP inesperada'));
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getContribuyenteBySearch', () => {
  test.each(['', '1', 'a'.repeat(51)])('rechaza el término inválido %j', async (search) => {
    await expect(getContribuyenteBySearch(search)).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'El parámetro search es inválido. Debe tener entre 3 y 50 caracteres.',
    });
  });

  test.each([-1, 'a'])('rechaza el offset inválido %j', async (offset) => {
    await expect(getContribuyenteBySearch('Juan', offset)).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'El parámetro offset es inválido. Debe ser un número mayor o igual a 0.',
    });
  });

  test('devuelve contribuyentes y codifica el término y la página enviados a la API', async () => {
    fetch.mockResolvedValue(Response.json({ data: { contribuyentes: [contribuyente] } }));

    await expect(getContribuyenteBySearch(' Juan Pérez & Cía ', 2)).resolves.toEqual([
      contribuyente,
    ]);
    expect(fetch).toHaveBeenCalledWith(
      'https://turuc.com.py/api/contribuyente/search?search=Juan%20P%C3%A9rez%20%26%20C%C3%ADa&page=2',
    );
  });

  test('consulta la primera página cuando no se indica un offset', async () => {
    fetch.mockResolvedValue(Response.json({ data: { contribuyentes: [contribuyente] } }));

    await expect(getContribuyenteBySearch('Juan')).resolves.toEqual([contribuyente]);
    expect(fetch).toHaveBeenCalledWith(
      'https://turuc.com.py/api/contribuyente/search?search=Juan&page=0',
    );
  });

  test('rechaza una búsqueda sin resultados', async () => {
    fetch.mockResolvedValue(Response.json({ data: { contribuyentes: [] } }));

    await expect(getContribuyenteBySearch('Juan')).rejects.toMatchObject({
      name: 'ServerError',
      statusCode: 404,
      errorCode: 'NOT_FOUND',
    });
  });
});

describe('getContribuyenteByRucOrCI', () => {
  test.each(['', 'abc', '123456789'])('rechaza el documento inválido %j', async (documento) => {
    await expect(getContribuyenteByRucOrCI(documento)).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'El parámetro ruc es inválido. Debe tener formato 12345 o 123456-1',
    });
  });

  test.each([
    ['1234567', 'https://turuc.com.py/api/contribuyente/1234567'],
    ['1234567-8', 'https://turuc.com.py/api/contribuyente/1234567-8'],
  ])('devuelve el contribuyente consultado por %s', async (documento, url) => {
    fetch.mockResolvedValue(Response.json({ data: contribuyente }));

    await expect(getContribuyenteByRucOrCI(documento)).resolves.toEqual(contribuyente);
    expect(fetch).toHaveBeenCalledWith(url);
  });

  test('rechaza una respuesta sin contribuyente', async () => {
    fetch.mockResolvedValue(Response.json({ data: null }));

    await expect(getContribuyenteByRucOrCI('1234567')).rejects.toMatchObject({
      name: 'ServerError',
      statusCode: 404,
      errorCode: 'NOT_FOUND',
    });
  });
});

describe.each([
  ['búsqueda', () => getContribuyenteBySearch('Juan')],
  ['consulta por RUC', () => getContribuyenteByRucOrCI('1234567-8')],
])('Errores de %s', (nombre, consultar) => {
  test.each([
    [400, 'BAD_REQUEST'],
    [404, 'NOT_FOUND'],
    [503, 'INTERNAL_SERVER_ERROR'],
  ])('expone el error HTTP %i recibido de la API', async (status, errorCode) => {
    fetch.mockResolvedValue(Response.json({ message: 'Detalle del servicio' }, { status }));

    await expect(consultar()).rejects.toMatchObject({
      name: 'ServerError',
      statusCode: status,
      errorCode,
      serverMessage: 'Detalle del servicio',
    });
  });

  test('propaga errores de conexión', async () => {
    const error = new TypeError('fetch failed');
    fetch.mockRejectedValue(error);

    await expect(consultar()).rejects.toBe(error);
  });

  test('rechaza una respuesta que no contiene JSON válido', async () => {
    fetch.mockResolvedValue(new Response('{'));

    await expect(consultar()).rejects.toMatchObject({ name: 'SyntaxError' });
  });
});
