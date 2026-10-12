# Tu Ruc | Paraguay

Cliente Javascript para la API de TuRuc Paraguay

Esta biblioteca proporciona funciones para realizar consultas a una API de contribuyentes. Permite buscar contribuyentes por un término de búsqueda y paginación, así como obtener información detallada sobre un contribuyente específico a través de su número de RUC o CI.

## Instalación

La versión 0.2.0 requiere **Node.js 22 o superior**. Se verifica en CI con las
versiones mantenidas de Node.js 22 y 24 LTS. El cliente usa `fetch` nativo y
CommonJS, sin dependencias de ejecución adicionales.

Para utilizar esta biblioteca en tu proyecto, sigue estos pasos:

```bash
npm install tu-ruc-js-client
```

Importa las funciones necesarias en tu código:

```javascript
const { getContribuyenteBySearch, getContribuyenteByRucOrCI } = require('tu-ruc-js-client');
```

## Uso

### `getContribuyenteBySearch(search, offset)`

Esta función realiza una búsqueda de contribuyentes por un término específico y opcionalmente con un offset de paginación.

**Parámetros:**

- `search` (cadena): Término de búsqueda (entre 3 y 50 caracteres).
- `offset` (número opcional): Offset de paginación, por defecto es 0.

**Ejemplo de Uso:**

```javascript
try {
  const contribuyentes = await getContribuyenteBySearch('término-de-búsqueda', 1);
  console.log(contribuyentes);
} catch (error) {
  console.error(error.message);
}
```

### `getContribuyenteByRucOrCI(ruc)`

Esta función obtiene información detallada sobre un contribuyente específico a través de su número de RUC o CI.

**Parámetros:**

- `ruc` (cadena): Número de RUC o CI del contribuyente (entre 3 y 10 caracteres).

**Ejemplo de Uso:**

```javascript
try {
  const contribuyente = await getContribuyenteByRucOrCI('1234567890');
  console.log(contribuyente);
} catch (error) {
  console.error(error.message);
}
```

## Desarrollo

Usa Node.js **24.21.0**, indicado en `.node-version`, y npm:

```bash
npm ci
npm run lint
npm run format:check
npm test -- --runInBand
npm run test:package
```

Las pruebas ejercitan las funciones exportadas y simulan únicamente la frontera
HTTP; no consultan el servicio en producción. `test:package` crea un tarball,
lo instala sin dependencias de desarrollo en un directorio temporal y comprueba
que sus funciones públicas puedan cargarse con `require()`.

[Oxlint](https://oxc.rs/docs/guide/usage/linter.html) 1.87.0 comprueba errores de
JavaScript, pruebas Jest y comentarios JSDoc en `.oxlintrc.json`.
[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) 0.72.0 aplica el formato de
JavaScript, JSON, YAML y Markdown mediante `.oxfmtrc.json`. Para corregir problemas
automáticamente y formatear el repositorio:

```bash
npm run lint:fix
npm run format
```

Las diez comprobaciones JSDoc explícitas verifican documentación, parámetros,
tipos y contratos de retorno: cinco son nativas y
`eslint-plugin-jsdoc` 65.3.1 aporta `require-jsdoc`, `check-syntax`, `valid-types`
y `check-param-names`, además de `require-returns-check`. La [integración de plugins JS de Oxlint](https://oxc.rs/docs/guide/usage/linter/js-plugins.html)
está en alpha; las versiones se fijan y se verifican con Node.js 22 y 24.

`lint` ejecuta Oxlint y después ESLint 10.12.0, limitado en `eslint.config.mjs` a
`camelcase`, `no-invalid-this` y `@stylistic/spaced-comment`. Esta última utiliza
`@stylistic/eslint-plugin` 5.10.0, la [sustitución mantenida](https://eslint.style/rules/spaced-comment)
de la regla deprecada de ESLint. Esta [combinación admitida por Oxlint](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint.html#running-oxlint-and-eslint-together)
conserva las tres reglas heredadas que no tienen equivalente nativo ni son
resueltas por Oxfmt. Ambas comprobaciones cubren los archivos `.js`, `.cjs` y
`.mjs`, incluida la configuración. El conjunto de herramientas requiere Node.js
22.22.2+ o 24.15.0+; el mínimo de consumo del cliente sigue siendo Node.js 22.

Oxfmt sustituye las reglas heredadas de espaciado, comillas e indentación.

## Publicación

Los push a `main` y las pull requests ejecutan lint, formato, pruebas y verificación del
paquete con Node.js 22 y 24. Para publicar, ejecuta manualmente el workflow
`CI/CD` desde `main`, con una versión nueva en `package.json` y
`package-lock.json`, el registro de cambios actualizado y el secreto
`NPM_TOKEN` configurado. La publicación sólo comienza cuando ambas verificaciones
terminan correctamente. Después de publicar en npm, el workflow etiqueta el
commit verificado y crea su release en GitHub.

## Contribuciones

Si encuentras algún problema o tienes sugerencias de mejora, no dudes en contribuir al desarrollo de esta biblioteca. Abre un problema o envía una solicitud de extracción en [GitHub](https://github.com/ithdev/tu-ruc-js-client).

¡Gracias por utilizar esta biblioteca!
