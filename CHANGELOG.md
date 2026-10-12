# Registro de Cambios

Todos los cambios notables en esta biblioteca se documentarán en este archivo.

## [0.2.0] - 2026-10-11

### Cambiado

- Se establece Node.js 22 como versión mínima de consumo y Node.js 24 LTS para desarrollo y publicación.
- Oxlint 1.87.0 comprueba el código y Oxfmt 0.72.0 aplica el formato del repositorio; ESLint 10.12.0 conserva únicamente los controles heredados `camelcase`, `no-invalid-this` y espaciado de comentarios, este último mediante `@stylistic/eslint-plugin` 5.10.0. Jest se actualiza a 30.5.2.
- Se comprueban documentación, parámetros, tipos y contratos de retorno JSDoc mediante reglas nativas y `eslint-plugin-jsdoc` 65.3.1.
- Se conserva la API CommonJS y el uso de `fetch` nativo, sin dependencias de ejecución.
- La integración continua verifica lint, formato, pruebas y paquete en Node.js 22 y 24 antes de permitir una publicación manual desde `main`.
- El paquete distribuido incluye el código fuente y la documentación, sin herramientas de desarrollo ni pruebas.

### Añadido

- Pruebas de búsqueda, consulta por RUC o CI, respuestas HTTP y errores de conexión desde la API pública.
- Comprobación del tarball instalado en un proyecto consumidor temporal.
- Comandos `lint:fix`, `format` y `format:check` para corrección y formato automático.

### Corregido

- Las pruebas de validación fallan si la operación no rechaza los parámetros inválidos.
- Las etiquetas y releases se crean después de verificar y publicar el paquete.
- Se eliminan dos bloques `catch` que sólo relanzaban el error, una directiva ESLint obsoleta y la construcción innecesaria de una expresión regular constante.
- Se exige documentar los valores devueltos y se rechazan contratos JSDoc de retorno cuando la función no devuelve un valor.
- La limpieza del consumidor temporal elimina el directorio creado sin tolerar innecesariamente su ausencia.

## [0.1.2] - 2024-02-03

### Añadido

- Se agrega configuracion de ES-Lint

### Cambiado

- Se cambia el manejo de error mas especifico son los errores
- Se mejora la validacion de la funcion getContribuyenteBySearch

### Corregido

- Se coloca URL correcto para produccion
- Se arregla el regex para validar ruc o ci

## [0.1.1] - 2024-02-01

### Añadido

- Constantes MIN_LENGTH y MAX_LENGTH

### Cambios

- Se analizan las longitudes a partir de las constantes añadidas pasando del máximo limite de 10 a 50.
- Corrección en comentarios

## [0.1.0] - 2024-01-30

### Añadido

- Se agregó la función `getContribuyenteByRucOrCI`.
- Se implementaron pruebas básicas.
- Se mejoró la documentación para ambas funciones.
- Mejor manejo de errores.

### Cambiado

- Se cambió el nombre de la función de `getContribuyente` a `getContribuyenteBySearch`.

### Corregido

- Resuelto un error de importación en la versión 0.0.3.

## [0.0.3]

### Añadido

- Implementación inicial de la función `getContribuyente`.
