<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="../../public/logoLinguaHorizontal-light.svg" class="logo-light" alt="Selector de idioma en modo barra lateral">
  <img src="../../public/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Selector de idioma en modo barra lateral">
</figure>

# ¿Qué es Lingua?

Lingua es un **paquete de Laravel** que reemplaza el sistema de traducción basado en archivos por uno completamente gestionado desde la base de datos, con una hermosa y reactiva interfaz de gestión construida sobre [Livewire 4](https://livewire.laravel.com) y [Flux 2](https://fluxui.dev).

## El problema que resuelve

Las traducciones estándar de Laravel viven en archivos PHP y JSON dentro de `lang/`. Esto funciona bien para proyectos pequeños, pero genera fricción a medida que la aplicación crece:

- **Actualizar una traducción requiere un despliegue** - incluso para corregir un simple error tipográfico.
- **Los miembros no técnicos del equipo no pueden editar traducciones** - los editores necesitan Git y una revisión de código.
- **El seguimiento de la completitud de las traducciones es manual** - hay que comparar archivos para encontrar los vacíos.
- **Dar soporte a muchos idiomas desordena el código fuente** - docenas de archivos dispersos en distintos directorios.

Lingua almacena cada traducción en la base de datos, en una única columna JSON por fila, y ofrece una interfaz Livewire donde cualquier usuario autorizado puede gestionar idiomas y cadenas en tiempo real.

## Cómo funciona de un vistazo

```
┌─────────────────────────────────────────────────────────┐
│                   Laravel Application                   │
│                                                         │
│  lang/en/messages.php  ──┐                              │
│  lang/fr/messages.php    │  lingua:sync-to-database     │
│  lang/en.json            ├─────────────────────────────►│
│  lang/vendor/…           │                              │
│                         ─┘   language_lines (DB)        │
│                              ┌──────────────────────┐   │
│  LinguaMiddleware  ◄──────── │ group │ key │ text   │   │
│  app()->setLocale()          │ auth  │ … │ {"en":…} │   │
│                              └──────────────────────┘   │
│  __('auth.failed')  ───────────────────────────────────►│
│  (DB takes precedence over files)                       │
└─────────────────────────────────────────────────────────┘
```

En tiempo de ejecución, Lingua registra un `LinguaManager` personalizado como cargador de traducciones de Laravel. Fusiona las traducciones basadas en archivos con las de la base de datos - **las entradas de la base de datos siempre tienen prioridad** - para que puedas sobreescribir cualquier cadena sin tocar los archivos fuente.

## Conceptos clave

| Concepto | Descripción |
|---|---|
| **Idioma** | Un idioma instalado con metadatos (nombre, nombre nativo, dirección, orden, indicador de predeterminado) |
| **Traducción** | Una fila en `language_lines` con un `group`, `key`, `type` y una columna JSON `text` que contiene los valores de todos los idiomas |
| **Tipo de traducción** | `text`, `html` o `markdown` - determina qué editor se muestra en la interfaz |
| **Traducción de proveedor** | Una traducción que pertenece a un paquete de terceros; protegida contra eliminación accidental |
| **Idioma predeterminado** | El idioma principal; eliminar una traducción del idioma predeterminado elimina el registro completo |
| **Sincronización** | El proceso de importar archivos locales → BD (`sync-to-database`) o exportar BD → archivos (`sync-to-local`) |

## Requisitos

| Dependencia | Versión  |
|---|----------|
| PHP | **8.2+** |
| Laravel | **11 \| 12 \| 13** |
| Livewire | **4.0+** |
| Livewire Flux | **2.0+** |

## Siguiente paso

Dirígete a la [guía de instalación](/es/guide/installation) para configurar Lingua en menos de cinco minutos.
