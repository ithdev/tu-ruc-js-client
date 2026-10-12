# Tu RUC | Paraguay

Cliente JavaScript para la API de [TuRuc](https://turuc.com.py/). Busca
contribuyentes por nombre, RUC o CI, y consulta los datos de un contribuyente
por su RUC o CI.

## Requisitos

- Node.js 22 o superior.
- CommonJS (`require`). El cliente usa el `fetch` nativo de Node.js y no
  instala dependencias adicionales.

## Instalación

```bash
npm install tu-ruc-js-client
```

```javascript
const { getContribuyenteBySearch, getContribuyenteByRucOrCI } = require('tu-ruc-js-client');
```

## Uso

### `getContribuyenteBySearch(search, offset)`

Busca contribuyentes cuyo nombre, RUC o CI coincida con `search`.

- `search` (texto): de 3 a 50 caracteres, sin contar los espacios de los
  extremos.
- `offset` (número, opcional): página de resultados, desde 0. Por defecto, 0.

Devuelve un array de contribuyentes.

```javascript
try {
  const contribuyentes = await getContribuyenteBySearch('juan perez');
  console.log(contribuyentes);
} catch (error) {
  console.error(error.message);
}
```

### `getContribuyenteByRucOrCI(ruc)`

Obtiene los datos de un contribuyente.

- `ruc` (texto): CI de hasta 8 dígitos o RUC con su dígito verificador, por
  ejemplo `80024191` o `80024191-6`.

Devuelve un objeto con los datos del contribuyente.

```javascript
try {
  const contribuyente = await getContribuyenteByRucOrCI('80024191-6');
  console.log(contribuyente);
} catch (error) {
  console.error(error.message);
}
```

### Datos del contribuyente

Ambas funciones devuelven contribuyentes con, al menos, estos campos:

| Campo         | Tipo   | Descripción                             |
| ------------- | ------ | --------------------------------------- |
| `doc`         | número | Número de documento (CI)                |
| `razonSocial` | texto  | Nombre o razón social                   |
| `dv`          | número | Dígito verificador del RUC              |
| `ruc`         | texto  | RUC completo, con el dígito verificador |

## Errores

Las funciones rechazan la promesa con uno de estos errores. Distínguelos por
`error.name`:

| `name`            | Cuándo ocurre                                                | Propiedades útiles                                    |
| ----------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| `ValidationError` | Los parámetros no cumplen las reglas; no se consulta la API. | `message`, `rule`                                     |
| `ServerError`     | La API responde con un error o no encuentra resultados.      | `message`, `statusCode`, `errorCode`, `serverMessage` |

Cuando no hay resultados, `statusCode` es `404` y `errorCode` es `NOT_FOUND`.
Un fallo de red se propaga como el error original de `fetch`.

```javascript
try {
  await getContribuyenteByRucOrCI('80024191-6');
} catch (error) {
  if (error.name === 'ServerError' && error.errorCode === 'NOT_FOUND') {
    console.log('No existe un contribuyente con ese RUC.');
  } else {
    throw error;
  }
}
```

## Cambios

Consulta [CHANGELOG.md](CHANGELOG.md) para conocer los cambios de cada versión.

## Contribuciones

Si encuentras un problema o tienes una sugerencia, abre un issue o envía un pull
request en [GitHub](https://github.com/ithdev/tu-ruc-js-client). Para preparar el
entorno de desarrollo, consulta [CONTRIBUTING.md](CONTRIBUTING.md).
