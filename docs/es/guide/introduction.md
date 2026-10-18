<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="../../public/logoLinguaHorizontal-light.svg" class="logo-light" alt="Lingua">
  <img src="../../public/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Lingua">
</figure>



# ¿Qué es Lingua?

Lingua es un **paquete de Laravel** para la gestión multilingüe. Puede almacenar
cada traducción en tu base de datos e incluye una hermosa y reactiva
interfaz de gestión construida sobre [Livewire 4](https://livewire.laravel.com) y
[Flux 2](https://fluxui.dev) — o, si lo prefieres, seguir trabajando con archivos
`lang/` normales usando la misma interfaz.

::: tip Nuevo en 2.0
La versión 2.0 elimina las dependencias externas `spatie/laravel-translation-loader` y
`laravel-lang/common` por completo, añade un sistema de
[driver de almacenamiento](/es/guide/storage) pluggable (base de datos **o** archivos), un
flujo de trabajo de [importación/exportación (Transfer)](/es/guide/quick-start), y un
completo [refuerzo de seguridad](/es/guide/security). Es seguro desde el primer momento.
:::

## El problema que resuelve

Las traducciones estándar de Laravel viven en archivos PHP y JSON dentro de `lang/`.
Esto funciona bien para proyectos pequeños, pero genera fricción a medida que la
aplicación crece:

- **Actualizar una traducción requiere un despliegue** — incluso para corregir un
  simple error tipográfico.
- **Los miembros no técnicos del equipo no pueden editar traducciones** — los editores
  necesitan Git y una revisión de código.
- **El seguimiento de la completitud de las traducciones es manual** — hay que comparar
  archivos para encontrar los vacíos.
- **Dar soporte a muchos idiomas desordena el código fuente** — docenas de archivos
  dispersos en distintos directorios.

Con el **driver de base de datos** predeterminado, Lingua almacena cada traducción en una
única columna JSON por fila y proporciona una interfaz Livewire donde cualquier usuario
autorizado puede gestionar idiomas y cadenas en tiempo real.

## Cómo funciona de un vistazo

```
┌─────────────────────────────────────────────────────────┐
│                   Laravel Application                     │
│                                                           │
│  lang/en/messages.php  ──┐                                │
│  lang/fr/messages.php    │  lingua:sync-to-database       │
│  lang/en.json            ├──────────────────────────────►│
│  lang/vendor/…           │                                │
│                         ─┘   language_lines (DB)          │
│                              ┌──────────────────────┐     │
│  LinguaManager (DB driver) ◄ │ group │ key │ text   │     │
│  app()->setLocale()          │ auth  │ … │ {"en":…} │     │
│                              └──────────────────────┘     │
│  __('auth.failed')  ─────────────────────────────────────►│
│  (DB takes precedence over files)                         │
└─────────────────────────────────────────────────────────┘
```

En tiempo de ejecución, el `LinguaManager` de Lingua extiende el propio
`Illuminate\Translation\FileLoader` de Laravel y se registra como cargador de traducciones.
En **modo base de datos** fusiona las traducciones basadas en archivos con las de la base
de datos mediante `array_replace_recursive` — **las entradas de la base de datos siempre
tienen precedencia** — para que puedas sobreescribir cualquier cadena sin tocar los
archivos fuente. En **modo archivo** se comporta como el cargador estándar de Laravel,
respaldado por la misma interfaz.

## Conceptos clave

| Concepto | Descripción |
|---|---|
| **Driver de almacenamiento** | `database` (predeterminado) o `file` — ver [Drivers de Almacenamiento](/es/guide/storage) |
| **Idioma** | Un locale instalado con metadatos (nombre, nombre nativo, dirección, orden, indicador de predeterminado) |
| **Traducción** | Una fila en `language_lines` con un `group`, `key`, `type` y una columna JSON `text` que contiene los valores de todos los locales |
| **Tipo de traducción** | `text`, `html` o `markdown` — determina qué editor se muestra en la interfaz (solo en el driver de base de datos) |
| **Traducción de vendor** | Una traducción que pertenece a un paquete de terceros; protegida contra eliminación accidental |
| **Locale predeterminado** | El idioma principal; eliminar una traducción del locale predeterminado elimina el registro completo |
| **Sincronización** | Importar archivos locales → BD (`sync-to-database`) o exportar BD → archivos (`sync-to-local`) |

## Requisitos

| Dependencia | Versión |
|---|---|
| PHP | **8.3+** |
| Laravel | **12 \| 13** |
| Livewire | **4.1+** |
| Livewire Flux | **2.12+** |

::: tip Sin cargadores de traducción externos
Lingua 2.0 **no** tiene dependencia en tiempo de ejecución de Spatie ni de laravel-lang.
Los metadatos de locale (más de 129 locales) y el conjunto de datos de traducción integrado
(26 locales × 7 grupos, 5902 cadenas, alineados con Laravel v13.14.0) se incluyen dentro
del paquete — sin descargas de GitHub en el momento de la instalación.
:::

## Siguiente paso

Dirígete a la [guía de instalación](/es/guide/installation) para configurar Lingua
en menos de cinco minutos, o lee la [guía de actualización](/es/guide/upgrade) si
vienes de la versión 1.x.
