# LumenLib System  -- Frontend

Rrontend del Sistema bibliotecario desarrollado con **Vue 3**, **Vite**



## Clonar el repositorio

``` bash
   git clone <URL_DEL_REPO>
   cd LumenLib-System-frontend
```

------------------------------------------------------------------------

## Instalar dependencias

``` bash
   pnpm install
```

------------------------------------------------------------------------

## Levantar el proyecto en modo desarrollo

``` bash
   pnpm dev
```

El proyecto se abrirá normalmente en:

    http://localhost:5173/

Si el puerto está ocupado, Vite elegirá otro automáticamente.

------------------------------------------------------------------------

## Construir para producción

``` bash
   pnpm build
```

------------------------------------------------------------------------

## Flujo de trabajo con Git

### Ramas principales:

-   **main** → rama estable (producción)
-   **dev** → Aquí se fusionan las ramas ```feature/*``` antes de pasar a main.
-   **feature/nombre-dev** → Cada desarrollador trabaja aquí sus funciones específicas.

### Crear una nueva rama
``` bash
   git checkout dev
   git pull
   git checkout -b feature/nombre-dev
```

### Subir los cambios

``` bash
   git add .
   git commit -m "Descripción de cambios"
   git push origin feature/nombre-dev
```

------------------------------------------------------------------------
