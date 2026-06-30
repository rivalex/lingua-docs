# Seguridad

Lingua 2.0 pasó por un refuerzo de seguridad integral y es **seguro por defecto**.
Esta página documenta las protecciones implementadas y las acciones que debes tomar
para mantener tu despliegue seguro.

::: tip Seguro por defecto
La interfaz de gestión se publica detrás del middleware `['web', 'auth']`, los assets
se sirven desde una jaula realpath y la entrada de traducciones se sanitiza. Solo
activas el acceso más amplio, no lo desactivas.
:::

## Paso de refuerzo v2.0 (F1–F9)

| ID | Nombre | Qué protege | Cómo | Archivo |
|---|---|---|---|---|
| F1 | Guardia de DoS en caché | Crecimiento ilimitado de caché por cadenas de locale arbitrarias | Validación regex del locale antes de `rememberForever` | `src/Database/DatabaseRepository.php` |
| F2 | Prohibición de inyección SQL | Inyección mediante funciones SQL JSON | Funciones SQL JSON eliminadas; toda la agregación se realiza en PHP | `src/Database/DatabaseRepository.php` |
| F3 | Traversal de ruta | Escapar del directorio de traducciones | `PathGuard::assertSafeSegment()` | `src/Support/PathGuard.php`, `src/Locales/BundledTranslationSource.php` |
| F4 | Contaminación de locale / inyección en nombre de archivo | Escritura a locales no instalados; nombres de archivo de descarga maliciosos | Abortar 422 si el locale destino no está instalado; `Content-Disposition` sanitizado | `src/Livewire/Import.php`, `src/Http/Controllers/TransferExportController.php` |
| F5 | Protección de vendor | Eliminar cadenas de vendor protegidas | `VendorTranslationProtectedException` lanzada en `forgetTranslation()` para filas de vendor | `src/Exceptions/VendorTranslationProtectedException.php`, ambos repositorios |
| F6 | Rechazo de claves comodín | Asignación masiva mediante claves comodín | Rechaza `*` / `\0` en la identidad de importación | `src/Transfer/RowMapper.php` |
| F7 | Límite ReDoS | Backtracking catastrófico en la detección de tipo | Regex de tipo más estricta (`\[[^\]]+\]`); omitir regex para cadenas > 10000 chars | `src/Livewire/Translation/Row.php` |
| F8 | No-divulgación de excepciones | Filtrar detalles internos a la UI | Error localizado genérico a la UI; detalle a `Log::error` | `src/Livewire/Import.php` |
| F9 | Puerta de autenticación | Acceso no autorizado a rutas de administración | Middleware `can:{gate}` añadido cuando `LINGUA_GATE` está establecido | `routes/web.php`, `config/lingua.php` |

## Protección XSS

Las traducciones HTML son sanitizadas por `HtmlSanitizer`
(`src/Support/HtmlSanitizer.php`) antes del almacenamiento y la renderización:

- Análisis basado en DOM con una **lista blanca de atributos por etiqueta**
- Validación de URI — solo se permiten los esquemas `http`, `https` y `mailto`
- Eliminación de caracteres de control (derrota trucos como `java\tscript:`)

El XSS almacenado está limitado al tipo `html`; las traducciones de tipo `text`
siempre se escapan.

## Autenticación

Las rutas de gestión tienen por defecto `['web', 'auth']`. Para el acceso basado en
roles, establece una puerta de autorización:

```env
LINGUA_GATE=manage-translations
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

Lingua añade `can:manage-translations` a sus rutas de administración. También puedes
editar el array `middleware` directamente (consulta
[Configuración](/es/guide/configuration#seguridad-y-acceso)).

## Protección contra redirecciones abiertas

Cuando un usuario cambia de locale, Lingua recarga la página **actual**. El destino
se deriva de `ManagesLocale::getRequestUri()` y se valida contra una **guardia regex
de ruta local**, de modo que un atacante no puede insertar una URL absoluta en la
redirección.

## Seguridad de assets

Los CSS/JS compilados de Lingua son servidos por la ruta `lingua.assets`, que resuelve
el archivo solicitado a través de una **jaula realpath** — las solicitudes que se
resuelven fuera del directorio de assets del paquete son rechazadas. La ruta de assets
vive **fuera** del grupo de rutas autenticadas para que los estilos carguen en las
pantallas de inicio de sesión.

## Seguridad en modo archivo

En el [driver de almacenamiento `file`](/es/guide/storage), las ediciones de la UI
son escritas por `AtomicFileWriter` (`src/Support/AtomicFileWriter.php`):

- Escribe en un archivo temporal y luego lo **renombra atómicamente** en su lugar, para
  que una solicitud concurrente nunca lea un archivo escrito a medias
- Llama a `opcache_invalidate($path, true)` después del renombrado para que el nuevo
  bytecode sea recogido en la misma solicitud

## Guardia de inyección de fórmulas

Las celdas de hojas de cálculo exportadas e importadas que comienzan con `=`, `+`, `-`,
`@`, tabulador o retorno de carro se prefijan con una comilla simple (`'`) para
neutralizar la inyección de fórmulas CSV/hoja de cálculo.

## Correcciones anteriores (v1.1.x)

La línea 1.1.x incluyó correcciones adicionales que se incorporan a 2.0:

- **3 CRÍTICAS** — traversal de ruta en la ruta de assets (jaula realpath), inyección
  SQL mediante locale-en-JSON, omisión de autenticación (middleware `auth` por defecto)
- **2 ALTAS** — redirección abierta al cambiar de locale, XSS almacenado limitado al
  tipo `html`
- **5 MEDIAS** — inyección de argumento en Artisan (cambiado a forma de array),
  TypeError de `Language` null, límite de `$perPage` (≤ 100) y validación de entrada
  relacionada
- **4 BAJAS** — correcciones variadas de refuerzo y divulgación

## Lista de verificación de seguridad

- [ ] Mantener el middleware predeterminado `['web', 'auth']` (o más estricto)
- [ ] Establecer `LINGUA_GATE` para el acceso basado en roles en aplicaciones
      multiusuario
- [ ] Usar el tipo `html` solo para contenido de confianza; preferir `text` en otros casos
- [ ] En el modo archivo, asegurar que los despliegues no expongan las rutas de escritura
      de `lang/` a usuarios no confiables
- [ ] Mantener Lingua actualizado para recibir correcciones de seguridad

## Reportar vulnerabilidades

Por favor, reporta los problemas de seguridad de forma privada a
[security@rivalex.com](mailto:security@rivalex.com). No abras incidencias públicas
en GitHub para vulnerabilidades.
