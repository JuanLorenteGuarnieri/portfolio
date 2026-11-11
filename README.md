# Interactive 3D Portfolio

An interactive personal portfolio built with React, Three.js and React Three Fiber, designed as a continuous 3D environment rather than a conventional webpage.

**Live portfolio:**
https://juanlorenteguarnieri.github.io/portfolio/

## Overview

The portfolio presents my background, technical skills, experience and projects through a scroll-driven 3D scene.

Instead of navigating between traditional HTML pages, the browser scroll position is mapped to the camera position inside a persistent Three.js environment.

```text
Browser Scroll
      ↓
Scroll Position
      ↓
Camera Controller
      ↓
3D Scene Navigation
      ↓
Portfolio Sections
```

The scene contains dedicated 3D sections for:

* About
* Education
* Experience
* Projects
* Skills
* Contact
* Interests

## Main Features

* Scroll-driven 3D navigation
* React Three Fiber + Three.js scene
* Interactive 3D portfolio sections
* Custom 3D models and typography
* 11 integrated technical projects
* Clickable GitHub, CV, report and presentation links
* Adaptive rendering quality
* Runtime GPU/performance monitoring
* BVH-accelerated raycasting
* Mobile-specific rendering adjustments
* Interactive 3D contact form
* EmailJS contact integration
* Dynamic external statistics
* GitHub Pages deployment

## 3D Architecture

The application is organized into reusable React components representing both the global scene and individual portfolio sections.

```text
App
└── Home
    └── React Three Fiber Canvas
        ├── Camera Controller
        ├── Performance Monitor
        ├── Lighting
        ├── Title
        ├── About
        ├── Education
        ├── Experience
        ├── Projects
        │   ├── RayTracer
        │   ├── Spaceship Controller
        │   ├── Robotics
        │   ├── SLAM
        │   ├── CI
        │   ├── ACI
        │   └── ...
        ├── Skills
        ├── Contact
        └── Interests
```

Each section is positioned independently in 3D space and becomes active according to its distance from the camera.

## Scroll-driven Navigation

The portfolio uses a continuous 3D scene where vertical scrolling controls the camera's position along the Z axis.

The camera controller also adapts the projection parameters to the viewport size.

Scroll is **not** kept in React state. `src/scrollStore.js` owns a single passive `scroll` listener that notifies subscribers once per animation frame; `Home` moves the camera imperatively and only re-renders the 3D tree when a section's proximity-based visibility actually flips (`src/hooks/useVisibility.js`).

This approach allows the entire portfolio to behave as a spatial walkthrough instead of a sequence of independent pages.

## Rendering and Performance

Because the portfolio renders a large number of 3D assets in real time, the application includes several performance mechanisms.

### Adaptive Device Pixel Ratio

The runtime performance monitor dynamically adjusts the rendering resolution according to measured frame-rate performance.

The device pixel ratio is reduced when performance degrades and increased again when additional rendering capacity is available.

### Scene warm-up (no hitches when something appears for the first time)

three.js uploads geometry and textures and compiles shaders lazily, the first time an object is drawn, and the shader depends on the number of visible lights. Without a warm-up, that work happens in the middle of the scroll. `src/components/SceneWarmUp.jsx` walks the whole scroll range during the intro (one stop per distinct set of visible objects, planned by `src/lib/warmup.js`) and draws a frame at each stop with frustum culling disabled. The scene is revealed when the intro video has ended **and** the warm-up is done.

* Open the site with `?nowarmup` to disable it and compare.
* In the console, `__sceneStats()` returns the number of shaders, geometries and textures; after the warm-up, scrolling through the whole page should not increase them.

### Render architecture

* The cursor light, the camera and the rotating phone in the contact section are updated imperatively (refs / `useFrame`), never through React state.
* Sections are wrapped in `React.memo` and receive stable props, so typing in the contact form or moving the mouse does not reconcile the whole scene.
* All text meshes share one material (`useSharedMat`) and `Text3D` fonts are subsetted (see `tools/`).
* Assets are fetched through `import.meta.env.BASE_URL`, so the site works on any host/base path.

### Asset pipeline (`tools/`)

```bash
# Re-scale / re-compress GLB textures (requires Pillow). Review the result visually before replacing the originals.
python3 tools/optimize_glb.py public/models /tmp/models_opt

# Subset a typeface.json font to the glyphs actually used
python3 tools/subset_fonts.py full_font.json src/assets/fonts/MyFont.json
```

Keep new textures at 1024 px or less where possible: GPU memory grows with the square of the texture size.

### BVH Raycasting

The project integrates `three-mesh-bvh` to accelerate raycasting operations for interactive 3D meshes.

```text
Three.js Mesh
     ↓
BVH acceleration structure
     ↓
Accelerated raycasting
     ↓
3D interaction
```

### Mobile Optimization

Mobile devices use reduced rendering features, including disabling expensive shadow rendering for the main scene.

## Interactive Project Showcase

Projects are represented as individual 3D components and linked directly to their corresponding GitHub repositories, reports, slides or live demos.

Current showcased projects include:

* Physically-Based Ray Tracer
* Spaceship Controller
* Robotics / Computer Vision
* Panorama Reconstruction
* Bachelor's Thesis
* Structure from Motion
* Rendering with Advanced Materials
* Computational Imaging
* Advanced Computational Imaging
* Visual SLAM
* Lemmings clone

This portfolio is intentionally designed as a presentation layer; detailed technical documentation and source code are maintained in the individual project repositories.

## Contact System

The contact section is integrated directly into the 3D scene.

Users interact with 3D form elements to enter:

* Name
* Email
* Message

The application validates the input and sends the form through EmailJS.

The contact interface is implemented as a dedicated React component rather than a conventional HTML form embedded outside the WebGL scene.

## Dynamic Data

The interests section shows the number of chess games played (fetched at runtime from the public chess.com API) and a Duolingo streak computed locally from a known date/value (`src/sections/Interests.jsx`). Update `knownStreak` / `knownDate` there to refresh it.

## Technologies

### Frontend

* React
* JavaScript / JSX
* Vite
* Tailwind CSS

### 3D / Graphics

* Three.js
* React Three Fiber
* React Three Drei
* three-mesh-bvh
* WebGL

### Integrations

* EmailJS
* GitHub Pages

## Repository Structure

```text
portfolio/
├── public/
│   └── models/            # 3D models and generated assets
├── src/
│   ├── assets/            # Fonts and visual assets
│   ├── components/        # Reusable 3D/UI components (incl. SceneWarmUp)
│   ├── hooks/             # Contact form, mouse speed, visibility, viewport
│   ├── lib/               # Pure helpers (visibility, warm-up planner)
│   ├── models/            # gltfjsx-generated model components
│   ├── projects/          # 3D representations of portfolio projects
│   ├── sections/          # Main portfolio sections
│   ├── App.jsx            # Application root
│   ├── main.jsx           # React entry point
│   ├── scrollStore.js     # Shared scroll state (outside React)
│   └── bvh-setup.tsx      # BVH raycasting integration
├── tools/                 # Asset optimisation scripts
├── index.html
├── package.json
└── vite.config.js
```

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

The application is deployed as a static site through GitHub Pages.

Deploy with `npm run deploy` (builds and publishes `dist/` to the `gh-pages` branch).

## Design Goals

The project was built around three main goals:

1. **Present technical work interactively** rather than through a conventional static portfolio.
2. **Use 3D graphics as part of the interface itself**, rather than as decorative elements.
3. **Maintain acceptable real-time performance** across desktop and mobile hardware.

## Author

**Juan Lorente Guarnieri**

Computer Vision & Graphics
University of Zaragoza
