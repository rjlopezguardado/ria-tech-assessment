# Playwright Tests — GitHub Actions Workflow

## ¿Qué hace este archivo?

Es un pipeline de CI/CD definido en GitHub Actions que **ejecuta automáticamente las pruebas de Playwright** cada vez que se hace push o se abre un Pull Request hacia las ramas `main` o `master`.

---

## Cuándo se ejecuta

```yaml
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
```

Se dispara en dos eventos:
- **push** directo a `main`/`master`
- **pull_request** que apunte a `main`/`master`

---

## Estructura del Job

### Matriz de ejecución (matrix strategy)

```yaml
strategy:
  fail-fast: false
  matrix:
    suite: [api, ui]
```

El pipeline corre **dos jobs en paralelo**, uno por cada suite:

| Job | Comando que ejecuta |
|-----|---------------------|
| `api` | `npx playwright test tests/api --workers=5` |
| `ui`  | `npx playwright test tests/ui --workers=5`  |

`fail-fast: false` significa que si una suite falla, la otra **sigue corriendo** igualmente (no aborta todo).

---

## Variables de entorno (Secrets)

Todas las credenciales se inyectan desde los **Secrets del repositorio en GitHub** (`Settings > Secrets and variables > Actions`):

| Variable | Descripción |
|----------|-------------|
| `UI_URL` | URL base de la aplicación web (frontend) |
| `API_URL` | URL base de la API |
| `API_TOKEN` | Token de autenticación para la API |
| `VALID_API_USERNAME` | Usuario válido para pruebas de API |
| `VALID_API_PASSWORD` | Contraseña válida para pruebas de API |
| `INVALID_API_USERNAME` | Usuario inválido para pruebas negativas de API |
| `INVALID_API_PASSWORD` | Contraseña inválida para pruebas negativas de API |
| `VALID_UI_USERNAME` | Usuario válido para pruebas de UI |
| `VALID_UI_PASSWORD` | Contraseña válida para pruebas de UI |
| `INVALID_UI_USERNAME` | Usuario inválido para pruebas negativas de UI |
| `INVALID_UI_PASSWORD` | Contraseña inválida para pruebas negativas de UI |

> **Importante:** Estos valores **nunca se hardcodean** en el código. Deben configurarse en GitHub antes de que el workflow funcione correctamente.

---

## Pasos del pipeline (Steps)

### 1. Checkout
```yaml
- uses: actions/checkout@v4
```
Descarga el código del repositorio en el runner de GitHub.

### 2. Setup Node.js
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: lts/*
    cache: 'npm'
```
Instala la versión LTS más reciente de Node.js y activa caché de `npm` para acelerar instalaciones futuras.

### 3. Instalar dependencias
```yaml
- run: npm ci
```
Instala las dependencias del proyecto usando `npm ci` (instalación limpia y reproducible, ideal para CI).

### 4. Cache de browsers de Playwright *(solo suite `ui`)*
```yaml
- if: matrix.suite == 'ui'
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('package-lock.json') }}
```
Guarda en caché los browsers de Playwright. Solo aplica al job `ui`. La clave de caché cambia si `package-lock.json` cambia, forzando una re-descarga cuando las dependencias se actualizan.

### 5. Instalar browsers de Playwright *(solo suite `ui` y si no hay caché)*
```yaml
- if: matrix.suite == 'ui' && steps.playwright-cache.outputs.cache-hit != 'true'
  run: npx playwright install --with-deps chromium firefox
```
Descarga **Chromium y Firefox** (con sus dependencias del sistema) solo si no se encontró caché. La suite `api` no necesita browsers reales.

### 6. Ejecutar las pruebas
```yaml
- run: npx playwright test tests/${{ matrix.suite }} --workers=5
```
Ejecuta las pruebas de la carpeta correspondiente (`tests/api` o `tests/ui`) con **5 workers en paralelo**.

### 7. Subir reporte HTML
```yaml
- if: ${{ !cancelled() }}
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report-${{ matrix.suite }}
    path: playwright-report/
    retention-days: 30
```
Sube el reporte HTML de Playwright como artefacto descargable desde GitHub. Se ejecuta **siempre**, incluso si las pruebas fallan (excepto si el job fue cancelado manualmente). Se conserva por 30 días.

### 8. Subir artefactos de fallo *(solo si hay fallas)*
```yaml
- if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: test-results-${{ matrix.suite }}
    path: test-results/
    retention-days: 30
```
Si alguna prueba falla, sube trazas, screenshots y videos de los tests fallidos. Útil para depurar qué salió mal en CI.

---

## Flujo completo (diagrama simplificado)

```
Push / PR a main
        │
        ▼
┌───────────────────┐   ┌───────────────────┐
│   Job: api tests  │   │   Job: ui tests   │
│                   │   │                   │
│  npm ci           │   │  npm ci           │
│  playwright test  │   │  cache browsers   │
│  tests/api        │   │  install browsers │
│                   │   │  playwright test  │
│                   │   │  tests/ui         │
└────────┬──────────┘   └────────┬──────────┘
         │                       │
         ▼                       ▼
   Upload report           Upload report
   (+ artefactos si falla)  (+ artefactos si falla)
```

---

## ¿Dónde ver los resultados?

1. En GitHub, ir a la pestaña **Actions** del repositorio.
2. Seleccionar el workflow **"Playwright Tests"**.
3. Cada run muestra los dos jobs (`api tests` y `ui tests`) con su estado.
4. En la sección **Artifacts** del run se pueden descargar:
   - `playwright-report-api` / `playwright-report-ui` — reportes HTML navegables
   - `test-results-api` / `test-results-ui` — trazas y screenshots de fallas (solo si hubo fallas)
