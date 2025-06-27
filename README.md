# Liquid Barbed Wire - Website

This repository contains the source code for the official website of Liquid Barbed Wire, a music project delivering low fuzz and monotonic soundscapes since 2012.

The website is built using the [Astro](https://astro.build/) web framework.

## 🚀 Project Structure

A brief overview of the project structure:

-   `src/pages/`: Contains the different pages of the website.
-   `src/components/`: Contains reusable Astro components.
-   `src/layouts/`: Defines the basic layout structure for pages.
-   `lbw-data/`: Contains JSON data files used to populate content on the website (e.g., news, about page information).
-   `public/`: Contains static assets like images and fonts.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                  | Action                                         |
| :----------------------- | :--------------------------------------------- |
| `npm install`            | Installs dependencies                          |
| `npm run dev`            | Starts local dev server at `localhost:4321`    |
| `npm run dev:docker`     | Starts dev server in Docker with hot reload    |
| `npm run dev:docker:down`| Stops the Docker development environment       |
| `npm run build`          | Build your production site to `./dist/`        |
| `npm run preview`        | Preview your build locally, before deploying   |

## 🔧 Development

### Local Development
For local development with hot module reload:
```bash
npm install
npm run dev
```

### Docker Development
For development using Docker (useful for environment consistency):
```bash
npm run dev:docker
```

This will:
- Build a development Docker container
- Start Astro with hot module reload
- Mount your source files so changes are reflected immediately
- Make the site available at `http://localhost:4321`

To stop the Docker development environment:
```bash
npm run dev:docker:down
```
