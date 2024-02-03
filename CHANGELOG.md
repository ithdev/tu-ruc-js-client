# Registro de Cambios

Todos los cambios notables en esta biblioteca se documentarán en este archivo.

## [0.1.2] - 2024-02-03

### Añadido

- Se agrega configuracion de ES-Lint

### Cambiado

- Se cambia el manejo de error mas especifico son los errores

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
