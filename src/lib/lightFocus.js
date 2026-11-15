// -----------------------------------------------------------------------------------------
// Luz de foco: en modo piano / modo cubo la luz que sigue al cursor deja de seguirlo y se
// coloca (quieta) sobre el objeto para iluminarlo. Cada modo escribe aquí, en cada frame, cómo
// quiere la luz (posición, color, intensidad...) y cuánto (`amount`, 0..1, igual que el progreso
// del vuelo de cámara); FocusLight (componente) lo aplica a la luz real mezclando con la del cursor.
// -----------------------------------------------------------------------------------------

const slots = new Map();

/** Ranura mutable de un modo (se reutiliza cada frame: sin basura). */
export function lightFocusSlot(id) {
  let s = slots.get(id);
  if (!s) {
    s = { amount: 0, position: [0, 0, 0], color: [1, 1, 1], intensity: 10, distance: 8 };
    slots.set(id, s);
  }
  return s;
}

export function releaseLightFocus(id) {
  const s = slots.get(id);
  if (s) s.amount = 0;
}

/** La ranura con más peso (>0), o null si la luz debe seguir al cursor. */
export function getLightFocus() {
  let best = null;
  slots.forEach((s) => { if (s.amount > 0 && (!best || s.amount > best.amount)) best = s; });
  return best;
}

export const isLightFocused = () => getLightFocus() !== null;

// Última posición del cursor en pantalla (la escribe Home), para saber dónde estaría la luz si lo siguiera
const cursor = { x: 0, y: 0, known: false };
export function setCursorScreen(x, y) {
  cursor.x = x;
  cursor.y = y;
  cursor.known = true;
}
export const getCursorScreen = () => cursor;
