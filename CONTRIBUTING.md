# Contribuir

## Entorno

Usa Node.js **24.21.0**, indicado en `.node-version`, y npm. Las herramientas de
desarrollo requieren Node.js 22.22.2+ o 24.15.0+; el mínimo para consumir el
cliente sigue siendo Node.js 22.

```bash
npm ci
```

## Comprobaciones

```bash
npm run lint
npm run format:check
npm test -- --runInBand
npm run test:package
```

Para corregir problemas automáticamente y formatear el repositorio:

```bash
npm run lint:fix
npm run format
```

Las pruebas ejercitan las funciones exportadas y simulan únicamente la frontera
HTTP; no consultan el servicio en producción. `test:package` crea un tarball, lo
instala sin dependencias de desarrollo en un directorio temporal y comprueba que
sus funciones públicas puedan cargarse con `require()`.

## Lint y formato

- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) comprueba errores de
  JavaScript, pruebas Jest y comentarios JSDoc según `.oxlintrc.json`. Las reglas
  JSDoc verifican documentación, parámetros, tipos y contratos de retorno; algunas
  son nativas y otras vienen de `eslint-plugin-jsdoc` mediante la
  [integración de plugins JS de Oxlint](https://oxc.rs/docs/guide/usage/linter/js-plugins.html),
  que está en alpha. Por eso las versiones están fijadas.
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) formatea JavaScript,
  JSON, YAML y Markdown según `.oxfmtrc.json`.
- `npm run lint` ejecuta Oxlint y después ESLint. `eslint.config.mjs` se limita a
  `camelcase`, `no-invalid-this` y `@stylistic/spaced-comment`, las reglas heredadas
  que no tienen equivalente en Oxlint ni en Oxfmt. Es una
  [combinación admitida por Oxlint](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint.html#running-oxlint-and-eslint-together).

Ambas comprobaciones cubren los archivos `.js`, `.cjs` y `.mjs`, incluida la
configuración.

## Publicación

Los push a `main` y los pull requests ejecutan lint, formato, pruebas y
verificación del paquete con Node.js 22 y 24.

Para publicar:

1. Sube la versión en `package.json` y `package-lock.json`.
2. Actualiza [CHANGELOG.md](CHANGELOG.md).
3. Comprueba que el secreto `NPM_TOKEN` esté configurado.
4. Ejecuta manualmente el workflow `CI/CD` desde `main`.

La publicación empieza solo cuando terminan bien las verificaciones. Después de
publicar en npm, el workflow etiqueta el commit verificado y crea su release en
GitHub.
