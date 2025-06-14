import { useProgress } from "@react-three/drei";
import React, { useEffect, useState } from "react";

const Navigation = React.memo(({ action, action2, cond, scrollValue, secPos }) => {
  const { progress } = useProgress();
  const [isLoaded, setIsLoaded] = useState(false);

  const pos2scroll = React.useCallback((pos) => (pos - 24.5) / 0.00461, []);

  const sections = React.useMemo(
    () =>
      secPos.map(({ key, value, label }) => ({
        key,
        value: pos2scroll(value),
        label,
      })),
    [secPos, pos2scroll]
  );

  useEffect(() => {
    if (progress >= 90 && !isLoaded) {
      setIsLoaded(true);
      action2();
    }
    // eslint-disable-next-line
  }, [progress, isLoaded, action2]);

  return isLoaded && cond ? (
    <Navigations action={action} scrollValue={scrollValue} sections={sections} />
  ) : null;
});

const menuIcons = [
  // SVGs como componentes o funciones
  (fill) => (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900.000000 900.000000"
      preserveAspectRatio="xMidYMid meet" fill={fill} className="w-4 h-4 md:w-5 md:h-5">
      <g transform="translate(-100,900) scale(0.12,-0.12)" stroke="none">
        <path d="M3514 7251 c-28 -16 -64 -46 -80 -66 -16 -20 -34 -42 -39 -48 -15
                          -17 -75 -116 -75 -123 0 -3 -6 -20 -14 -37 -8 -18 -31 -81 -51 -142 -20 -60
                          -40 -119 -45 -130 -5 -11 -21 -49 -36 -85 -28 -69 -77 -172 -97 -205 -69 -113
                          -221 -276 -309 -331 -51 -32 -190 -104 -233 -120 -101 -37 -237 -80 -285 -89
                          -19 -4 -55 -13 -80 -20 -25 -7 -72 -21 -105 -30 -135 -37 -172 -48 -215 -63
                          -25 -8 -49 -19 -55 -22 -5 -4 -21 -11 -34 -15 -34 -10 -161 -89 -194 -120 -35
                          -34 -68 -87 -91 -148 -21 -55 -18 -124 9 -242 15 -68 22 -108 45 -265 30 -194
                          23 -519 -15 -805 -33 -241 -37 -295 -32 -410 5 -114 19 -184 53 -262 8 -17 14
                          -34 14 -38 0 -39 259 -322 385 -421 28 -21 52 -42 55 -45 29 -34 179 -122 350
                          -205 63 -30 123 -60 132 -65 10 -5 23 -9 30 -9 7 0 26 -7 42 -15 42 -22 60
                          -13 52 28 -18 86 -18 111 0 145 30 56 78 72 215 72 65 0 120 -4 123 -9 4 -5
                          25 -12 49 -16 23 -4 47 -10 52 -14 6 -4 37 -18 70 -31 33 -13 78 -35 100 -49
                          22 -14 55 -34 74 -44 19 -10 41 -25 48 -33 8 -8 18 -14 23 -14 4 0 41 -33 82
                          -72 73 -73 148 -174 148 -200 0 -8 7 -23 15 -34 9 -12 14 -43 15 -86 l0 -67
                          -57 -12 c-32 -6 -92 -12 -133 -13 -68 -1 -75 -3 -78 -22 -6 -43 113 -126 283
                          -199 17 -7 41 -18 55 -24 14 -6 54 -20 90 -31 36 -11 79 -25 96 -30 63 -20
                          247 -56 359 -71 44 -5 122 -17 173 -25 81 -13 103 -13 185 0 50 8 128 20 172
                          25 202 26 408 77 555 138 19 8 44 18 55 23 153 63 279 153 273 194 -3 19 -10
                          21 -78 22 -41 1 -101 7 -132 13 l-58 12 0 67 c1 43 6 74 15 86 8 11 15 26 15
                          34 0 22 70 121 130 182 50 52 179 150 196 150 4 0 15 6 23 14 24 21 132 76
                          148 76 8 0 27 6 41 14 67 33 132 46 239 46 128 0 178 -17 207 -72 18 -34 18
                          -59 0 -145 -8 -41 10 -50 52 -28 16 8 35 15 42 15 7 0 20 4 30 9 9 5 69 35
                          132 65 257 125 354 193 564 396 222 215 283 335 293 575 5 117 1 166 -31 405
                          -28 207 -35 303 -35 460 0 239 25 460 75 662 8 32 14 79 14 105 0 77 -47 181
                          -107 238 -33 31 -160 110 -194 120 -13 4 -28 11 -34 15 -20 14 -106 42 -235
                          76 -30 8 -80 22 -110 30 -58 16 -134 35 -210 54 -25 5 -54 14 -65 19 -11 5
                          -47 19 -80 31 -88 33 -227 103 -282 142 -121 84 -264 248 -327 375 -48 96 -86
                          179 -86 187 0 5 -6 22 -14 39 -8 18 -31 82 -51 142 -20 61 -43 124 -51 142 -8
                          17 -14 34 -14 37 0 7 -60 106 -75 123 -5 6 -23 28 -39 48 -39 49 -121 95 -168
                          95 -108 0 -276 -121 -375 -268 -44 -67 -163 -298 -163 -318 0 -8 -4 -22 -9
                          -32 -15 -27 -51 -153 -51 -178 0 -12 -5 -35 -10 -50 -6 -15 -15 -63 -20 -108
                          -5 -45 -14 -103 -19 -131 -16 -84 -13 -422 4 -488 8 -32 15 -75 15 -95 1 -20
                          7 -48 15 -62 8 -14 15 -38 15 -55 0 -16 7 -41 15 -55 8 -14 14 -37 15 -51 0
                          -15 7 -32 15 -39 8 -7 15 -21 15 -32 0 -11 6 -32 13 -46 8 -15 21 -42 30 -60
                          9 -19 17 -39 17 -47 0 -7 7 -18 15 -25 8 -7 15 -23 15 -35 0 -12 7 -28 15 -35
                          8 -7 15 -21 15 -31 0 -11 4 -19 9 -19 5 0 14 -12 20 -27 6 -16 15 -35 20 -43
                          5 -8 12 -22 15 -30 4 -8 15 -28 26 -45 11 -16 24 -39 30 -50 6 -11 19 -33 30
                          -50 11 -16 23 -37 27 -45 12 -26 177 -242 229 -300 107 -118 223 -227 327
                          -304 l77 -58 0 -73 c0 -52 -4 -76 -15 -85 -8 -7 -15 -19 -15 -27 0 -8 -13 -34
                          -28 -57 -15 -22 -31 -48 -35 -56 -4 -8 -16 -28 -27 -45 -11 -16 -23 -38 -26
                          -47 -4 -10 -10 -18 -15 -18 -5 0 -14 -10 -19 -22 -11 -25 -30 -56 -45 -74 -5
                          -6 -17 -22 -25 -34 -8 -13 -23 -32 -32 -42 -10 -10 -18 -20 -18 -23 0 -18
                          -327 -345 -346 -345 -2 0 -10 -5 -17 -10 -29 -24 -143 -107 -157 -113 -8 -4
                          -28 -16 -45 -27 -16 -11 -37 -22 -45 -26 -8 -3 -22 -9 -30 -14 -44 -26 -158
                          -80 -170 -80 -7 0 -22 -7 -32 -16 -25 -24 -237 -23 -273 0 -13 9 -30 16 -37
                          16 -10 0 -127 55 -168 80 -8 5 -22 11 -30 14 -8 4 -28 15 -45 26 -16 11 -37
                          23 -45 27 -14 6 -128 89 -157 113 -7 5 -15 10 -17 10 -23 0 -346 328 -346 350
                          0 6 -4 10 -9 10 -5 0 -21 20 -35 45 -15 25 -31 45 -35 45 -5 0 -12 8 -15 18
                          -12 32 -37 72 -45 72 -5 0 -12 8 -15 18 -7 18 -12 27 -59 99 -15 24 -27 47
                          -27 52 0 5 -7 14 -15 21 -8 7 -15 19 -15 28 0 8 -6 23 -14 31 -12 13 -21 92
                          -17 147 1 6 43 43 94 81 132 100 308 280 429 440 58 76 108 145 111 153 4 8
                          16 29 27 45 11 17 24 39 30 50 6 11 19 34 29 50 31 49 121 229 121 241 0 6 7
                          17 15 24 8 7 15 20 15 30 0 10 7 23 15 30 8 7 15 22 15 34 0 11 7 30 15 40 8
                          11 15 28 15 37 0 10 6 30 14 46 20 41 37 93 45 138 4 22 13 50 19 62 7 12 12
                          38 12 57 0 19 7 61 15 93 17 66 20 404 4 488 -5 28 -14 87 -19 133 -5 46 -14
                          91 -19 100 -4 9 -11 41 -14 71 -4 29 -10 58 -16 65 -5 6 -12 30 -16 53 -4 24
                          -11 45 -16 49 -5 3 -9 12 -9 20 0 14 -29 87 -49 124 -4 8 -25 47 -46 85 -104
                          195 -221 313 -363 368 -62 25 -109 21 -168 -12z"/>
        <path d="M4452 4628 c-14 -28 -35 -61 -42 -68 -3 -3 -30 -36 -60 -75 -30 -38
                          -61 -76 -68 -84 -7 -7 -41 -50 -74 -95 -34 -44 -68 -87 -75 -94 -18 -18 -16
                          -57 2 -72 8 -7 15 -18 15 -25 0 -7 7 -18 15 -25 8 -7 15 -21 15 -32 0 -10 7
                          -21 15 -24 8 -4 15 -14 15 -24 0 -11 5 -22 11 -25 5 -4 14 -17 20 -28 9 -22
                          14 -30 59 -102 14 -22 29 -47 33 -55 4 -8 16 -28 27 -45 11 -16 25 -42 31 -57
                          6 -16 15 -28 20 -28 5 0 9 -6 9 -13 0 -23 51 -87 69 -87 20 0 71 60 71 83 0 8
                          7 17 15 21 8 3 15 12 15 20 0 8 12 32 26 53 14 21 30 47 35 58 17 34 37 67 46
                          74 4 3 18 26 31 51 13 25 32 59 42 75 11 17 22 37 26 45 3 8 10 22 15 30 5 8
                          13 25 18 37 6 11 15 24 20 28 20 12 11 60 -17 90 -15 17 -50 59 -77 95 -27 36
                          -56 72 -65 81 -9 9 -39 47 -65 83 -27 36 -52 66 -57 66 -4 0 -8 4 -8 9 0 5
                          -10 25 -22 45 -28 43 -68 49 -86 14z"/>
      </g>
    </svg>
  ),
  (fill) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className="w-4 h-4 md:w-5 md:h-5">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  ),
  (fill) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className="w-4 h-4 md:w-5 md:h-5">
      <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
      <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
      <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
    </svg>
  ),
  (fill) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className="w-4 h-4 md:w-5 md:h-5">
      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
      <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
    </svg>
  ),
  (fill) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className="w-4 h-4 md:w-5 md:h-5">
      <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 0 0-3-3h-3.879a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H6a3 3 0 0 0-3 3v3.162A3.756 3.756 0 0 1 4.094 9h15.812ZM4.094 10.5a2.25 2.25 0 0 0-2.227 2.568l.857 6A2.25 2.25 0 0 0 4.951 21H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-2.227-2.568H4.094Z" />
    </svg>
  ),
  (fill) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className="w-4 h-4 md:w-5 md:h-5">
      <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
      <path d="m10.076 8.64-2.201-2.2V4.874a.75.75 0 0 0-.364-.643l-3.75-2.25a.75.75 0 0 0-.916.113l-.75.75a.75.75 0 0 0-.113.916l2.25 3.75a.75.75 0 0 0 .643.364h1.564l2.062 2.062 1.575-1.297Z" />
      <path fillRule="evenodd" d="m12.556 17.329 4.183 4.182a3.375 3.375 0 0 0 4.773-4.773l-3.306-3.305a6.803 6.803 0 0 1-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 0 0-.167.063l-3.086 3.748Zm3.414-1.36a.75.75 0 0 1 1.06 0l1.875 1.876a.75.75 0 1 1-1.06 1.06L15.97 17.03a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  ),
  (fill) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className="w-4 h-4 md:w-5 md:h-5">
      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
    </svg>
  ),
  (fill) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className="w-4 h-4 md:w-5 md:h-5">
      <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z" clipRule="evenodd" />
    </svg>
  )
];

const menuLabels = [
  "Title",
  "About",
  "Education",
  "Experience",
  "Projects",
  "Skills",
  "Contact",
  "Interests",
];

const Navigations = ({ action, scrollValue, sections }) => {
  // Memoiza los items del menú
  const menuItems = React.useMemo(() => {
    return sections.map((section, idx) => ({
      ...section,
      icon: menuIcons[idx],
      label: menuLabels[idx],
      idx,
    }));
  }, [sections]);

  function changeScroll(scrollPosition, e) {
    e.preventDefault();
    e.stopPropagation();
    action(scrollPosition);
  }

  return (
    <nav id="menuBar" className="fadeIn fixed top-0 left-0 z-10 h-55 md:h-45 lg:h-35 xl:h-25">
      <ul className="list-none justify-between items-center">
        {menuItems.map((item, idx) => (
          <li key={item.key} onClick={(e) => changeScroll(item.value + (idx === 0 ? 0 : idx === 5 ? 600 : 700), e)}>
            <a>
              {item.icon(
                scrollValue >= item.value &&
                  (idx === menuItems.length - 1
                    ? true
                    : scrollValue < menuItems[idx + 1].value)
                  ? "#ffffff"
                  : "currentColor"
              )}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
export { Navigations };
