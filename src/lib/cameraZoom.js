// Zoom base de la cámara según el tamaño de la ventana (lo fija CameraController en cada resize).
// Está aquí para que los modos foco puedan hacer "un poco de zoom" encima de este valor sin perderlo.
export const baseZoom = (width, height) =>
  width > height ? Math.max(1, width / height) / 1.6 : Math.max(1, height / width) / 1.6;
