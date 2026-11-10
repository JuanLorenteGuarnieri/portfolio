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
* GitHub Actions for automated data updates
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

This approach allows the entire portfolio to behave as a spatial walkthrough instead of a sequence of independent pages.

## Rendering and Performance

Because the portfolio renders a large number of 3D assets in real time, the application includes several performance mechanisms.

### Adaptive Device Pixel Ratio

The runtime performance monitor dynamically adjusts the rendering resolution according to measured frame-rate performance.

The device pixel ratio is reduced when performance degrades and increased again when additional rendering capacity is available.

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

The interests section includes dynamically updated information from external services.

The repository also contains Node.js scripts and GitHub Actions workflows used to update generated static data periodically.

```text
External service
      ↓
Update script
      ↓
Generated JSON
      ↓
GitHub Actions
      ↓
Static portfolio
```

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
* GitHub Actions

## Repository Structure

```text
portfolio/
├── .github/
│   └── workflows/        # Automated data update workflows
├── public/
│   └── models/            # 3D models and generated assets
├── src/
│   ├── assets/            # Fonts and visual assets
│   ├── components/        # Reusable 3D/UI components
│   ├── projects/          # 3D representations of portfolio projects
│   ├── sections/          # Main portfolio sections
│   ├── App.jsx            # Application root
│   ├── main.jsx           # React entry point
│   └── bvh-setup.tsx      # BVH raycasting integration
├── index.html
├── package.json
├── vite.config.js
└── update-streak.mjs
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

The repository also contains GitHub Actions workflows used for automated background data updates.

## Design Goals

The project was built around three main goals:

1. **Present technical work interactively** rather than through a conventional static portfolio.
2. **Use 3D graphics as part of the interface itself**, rather than as decorative elements.
3. **Maintain acceptable real-time performance** across desktop and mobile hardware.

## Author

**Juan Lorente Guarnieri**

Computer Vision & Graphics
University of Zaragoza
