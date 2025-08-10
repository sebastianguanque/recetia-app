# 🍜 RecetIA — Generador de Recetas con IA

## 📝 Descripción

RecetIA es una aplicación web que te ayuda a generar recetas personalizadas al instante. Simplemente ingresa los ingredientes que tienes a mano y el tipo de comida que deseas, y la aplicación, potenciada por la API de Google Gemini, creará una receta única para ti. Además, puedes guardar tus recetas favoritas, gestionar una lista de compras y mucho más.

### Link

Demo: https://sebastianguanque.dev.ar/recetia-app/

## 📚 Tabla de Contenidos

- [🍜 RecetIA — Generador de Recetas con IA](#-recetia--generador-de-recetas-con-ia)
  - [📝 Descripción](#-descripción)
    - [Link](#link)
  - [📚 Tabla de Contenidos](#-tabla-de-contenidos)
  - [💡 Acerca del Proyecto](#-acerca-del-proyecto)
  - [✨ Características](#-características)
  - [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
  - [💻 Flujo automatizado probado con Playwright](#-flujo-automatizado-probado-con-playwright)
  - [🚀 Primeros Pasos](#-primeros-pasos)
  - [📄 Licencia](#-licencia)
  - [📧 Contacto](#-contacto)

---

## 💡 Acerca del Proyecto

RecetIA nació con el objetivo de simplificar el proceso de cocinar. Con la ayuda de la inteligencia artificial, la aplicación transforma una simple lista de ingredientes en una deliciosa receta, eliminando la incertidumbre de qué preparar. Cada receta generada es completamente nueva, lo que te permite explorar un sinfín de posibilidades.

---

## ✨ Características

- Generación de recetas con IA: Crea recetas únicas y personalizadas en segundos utilizando la API de Google Gemini.
- Gestión de ingredientes: Añade y elimina ingredientes fácilmente para ajustar las recetas a tus necesidades.
- Guardado de recetas: Guarda tus recetas favoritas en el navegador para acceder a ellas en cualquier momento.
- Manejo de errores: La aplicación valida la entrada de datos y las credenciales, ofreciendo una experiencia de usuario robusta y sin fallos.
- Lista de compras: Gestiona y elimina productos de una lista de compras automática.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto fue construido utilizando tecnologías modernas del ecosistema web para asegurar una experiencia rápida y reactiva:

- Framework: Vue + Vite
- Lenguaje: JavaScript
- Estilos: CSS
- Testing: Vitest + Playwright
- API: Google Gemini API

---

## 💻 Flujo automatizado probado con Playwright

Este flujo automatizado valida la funcionalidad principal de la app RecetIA:

- Inicio en la app
  - El test navega a http://localhost:3000/recetia-app/#/, mostrando la pantalla de configuración de API Key si no está guardada.
- Ingreso de API Key
  - El test detecta el campo de texto con aria-label="Ingresa tu API Key de Gemini", ingresa la API Key proporcionada y hace clic en el botón "Guardar".
- Redirección a la vista principal
  - Al guardar la API Key, la app redirige automáticamente a la vista principal (HomeView), donde se muestra el campo de ingredientes.
- Creación de receta
  - El test ingresa "pollo" en el campo de ingredientes.
  - Hace clic en "Agregar ingrediente".
  - Selecciona el tipo de comida: Desayuno, Almuerzo, Merienda o Cena.
  - Hace clic en "Generar Receta".
- Verificación de la receta generada
  - El test espera a que aparezca la tarjeta de receta generada en el DOM.
- Guardado de receta
  - El test verifica que el botón "Guardar Receta" esté visible.
  - Limpia el localStorage de recetas guardadas.
  - Hace clic en "Guardar Receta".
- Verificación en localStorage
  - El test comprueba que la receta se guardó correctamente en localStorage, validando que:
    - El array recetasGuardadas existe y tiene al menos un elemento.
    - La receta guardada tiene un nombre o título.

Este flujo simula el uso real de la app desde la configuración inicial hasta la generación y guardado de una receta, asegurando que la funcionalidad principal está operativa y persiste correctamente en el navegador.

---

## 🚀 Primeros Pasos

Para ejecutar el proyecto en tu máquina local, sigue estos sencillos pasos:

- Prerequisitos

Asegúrate de tener Node.js y npm instalados.
Instalación

- Clona el repositorio:

```
  git clone https://github.com/sebastianguanque/recetia-app.git
  cd recetia-app
  Instala las dependencias:
  npm install
```

Uso

Para iniciar el servidor de desarrollo local:

```
npm run dev
```

Para crear una versión optimizada de producción:

```
npm run build
```

Para desplegar la aplicación en GitHub Pages:

```
npm run deploy
```

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta el archivo LICENSE en el repositorio para más detalles.

---

## 📧 Contacto

Sebastián Guanque  
🔗 Gmail: [guanquesebastian@gmail.com](guanquesebastian@gmail.com)
🔗 GitHub: [@sebastianguanque](https://github.com/sebastianguanque)  
🔗 Proyecto: [RecetIA](https://sebastianguanque.dev.ar/recetia-app/)
