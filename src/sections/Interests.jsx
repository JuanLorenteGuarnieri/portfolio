import { Bvh, Float } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Chess } from '../../public/models/Chess';
import { Piano } from '../../public/models/Piano';
import { Book } from '../../public/models/Book';
import { RubikCube } from '../../public/models/Rubiks_cube';
import { Duolingo } from '../../public/models/Duolingo';
import { useEffect, useState, useMemo } from 'react';

function Interests({ isVisibleLight, pos }) {
  const pianoExp = new Date().getFullYear() - 2015;
  const [chessCount, setChessCount] = useState('');
  const [duoStreak, setDuoStreak] = useState('');

  async function updateCountFromChess() {
    try {
      // 1) Construimos la URL del endpoint de estadísticas
      const url = `https://api.chess.com/pub/player/qassiel/stats`;

      // 2) Realizamos la solicitud fetch
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }

      // 3) Parseamos la respuesta JSON
      const data = await response.json();

      // 4) Inicializamos el contador total de partidas
      let totalGames = 0;

      // 5) Definimos las modalidades de juego que queremos considerar
      const gameModes = ['chess_bullet', 'chess_blitz', 'chess_rapid', 'chess_daily'];

      // 6) Iteramos sobre cada modalidad y sumamos las partidas jugadas
      for (const mode of gameModes) {
        if (data[mode] && data[mode].record) {
          const { win = 0, loss = 0, draw = 0 } = data[mode].record;
          totalGames += win + loss + draw;
        }
      }

      // 7) Redondeamos hacia abajo a la centena más cercana
      const roundedCount = Math.floor(totalGames / 10) * 10;

      // 8) Convertimos el número a string y lo asignamos a la variable correspondiente
      const resultString = roundedCount.toString();
      setChessCount(resultString);
    } catch (err) {
      console.error('Error al actualizar el conteo de partidas:', err);
    }
  }

  async function updateDuolingoStreak2() {
    try {
      const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://duome.eu/Qassiel'));
      const data = await response.json();

      // Busca algo como: <span class="streak">123</span>
      const match = html.match(/Streak:\s*<\/strong>\s*(\d+)/i);
      if (match && match[1]) {
        setDuoStreak(match[1]);
      } else {
        throw new Error('No se pudo extraer el streak.');
      }
    } catch (err) {
      console.error('Error al obtener el streak:', err);
      setDuoStreak('N/A');
    }
  }

  async function updateDuolingoStreak3() {
    try {
      // 1) Montamos la URL del proxy + el endpoint de actualización de Duome
      const targetUrl = encodeURIComponent('https://duome.eu/aggiorna.php');
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent("https://duome.eu/aggiorna.php")}`;

      // 2) Hacemos la petición POST a través del proxy para forzar la actualización de stats
      const updateResponse = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          // Duome espera un formulario urlencoded
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: new URLSearchParams({
          who: '258222001', // ID interno de Duome para el usuario "Qassiel"
        }),
      });
      if (!updateResponse.ok) {
        throw new Error(`Fallo al actualizar stats: ${updateResponse.status}`);
      }

      // 3) Parseamos la respuesta JSON y extraemos la propiedad "streak"
      const updateText = await updateResponse.text();
      console.log(updateText); // Mira qué devuelve realmente

      // const updateData = await updateResponse.json();
      // if (typeof updateData.streak === 'undefined') {
      //   throw new Error('La respuesta JSON no contiene "streak".');
      // }
      // const text = `${updateData.streak}`; // Convertimos a string para setDuoStreak

      // // 4) Asignamos la racha al estado correspondiente
      // setDuoStreak(text);
    } catch (err) {
      setDuoStreak('N/A');
      console.error('Error al obtener el streak de Duolingo:', err);
    }
  }

  async function updateDuolingoStreak() {
    try {
      // 1) Montamos la URL del proxy + la URL objetivo
      const targetUrl = encodeURIComponent('https://duome.eu/Qassiel');
      const proxyUrl = `https://thingproxy.freeboard.io/fetch/https://duome.eu/Qassiel`;

      // 2) Hacemos el fetch a través del proxy
      let response, data, html;
      response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('No se pudo obtener la página de Duolingo');
      html = await response.text();
      // 3) Parseamos el HTML y extraemos el <span> adecuado
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Busca primero por aria-label, luego por clase fallback
      let span = Array.from(doc.querySelectorAll('span')).find(
        el => el.getAttribute('aria-label') && el.getAttribute('aria-label').includes('days streak')
      );
      if (!span) {
        // Fallback: buscar por clase cc-header-count
        span = doc.querySelector('span.cc-header-count');
      }
      else {
        // 4) Extraemos el texto del span y lo asignamos a la variable correspondiente
        let text = span.textContent.trim();
        setDuoStreak(text);
      }
      if (!span) throw new Error('No se encontró el span del streak de Duolingo.');

    } catch (err) {
      setDuoStreak('N/A');
      console.error('Error al obtener el streak de Duolingo:', err);
    }
  }

  // useEffect(() => {
  //   async function fetchStreak() {
  //     try {
  //       const res = await fetch('/portfolio/streak.json');
  //       if (!res.ok) throw new Error('No se pudo cargar streak.json');
  //       const data = await res.json();
  //       setDuoStreak(data.streak);
  //     } catch (err) {
  //       console.error('Error al cargar el streak:', err);
  //       setDuoStreak('N/A');
  //     }
  //   }
  //   fetchStreak();
  // }, []);

  useEffect(() => {
    // Fecha de hoy
    const today = new Date();

    // Racha conocida para una fecha conocida
    const knownStreak = 667;
    const knownDate = new Date('2025-06-06');

    // Fecha en que empezó la racha
    const streakStart = new Date(knownDate);
    streakStart.setDate(streakStart.getDate() - (knownStreak - 1));

    // Diferencia de días entre hoy y la fecha de inicio
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.ceil((today - streakStart) / msPerDay);

    setDuoStreak(diffDays);
  }, []);

  useEffect(() => {
    updateCountFromChess();
    // updateDuolingoStreak();
  }, []);

  // Memoiza los modelos 3D
  const models = useMemo(() => (
    <Bvh firstHitOnly>
      <Piano position={[4.8, -0.19, 1.6]} rotation={[0, -Math.PI / 3, 0]} />
      <Chess scale={2.4} position={[-4.5, 0, 4.5]} rotation={[0, 0, 0]} />
      <Float speed={4} rotationIntensity={0.3} floatIntensity={0.4} floatingRange={[0, 1]}>
        <RubikCube scale={0.15} position={[-4.8, 0, 1.8]} rotation={[0, Math.PI / 6, 0]} />
      </Float>
      <Book scale={0.065} position={[4.7, 0, 4.5]} rotation={[0, -1.7, 0]} />
      <Duolingo position={[-4.2, 0, 6.5]} rotation={[0, 0, 0]} />
    </Bvh>
  ), []);

  // Memoiza los textos que no dependen de estado
  const staticTexts = useMemo(() => (
    <>
      <TextAdvance position={[2.5, 0, 2.0]}
        text={"PIANO"}
        font={fontText} size={0.17} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[-2.5, 0, 2.16]}
        text={"RUBIK's solver"}
        font={fontText} size={0.16} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[2.5, 0, 4.5]}
        text={"PSYCHOLOGY reader"}
        font={fontText} size={0.16} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[-2.4, 0, 6.45]}
        text={"DUOLINGO"} align='center'
        font={fontText} size={0.16} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
    </>
  ), []);

  // Memoiza los textos que dependen de estado
  const dynamicTexts = useMemo(() => (
    <>
      <TextAdvance position={[2.5, 0, 2.3]}
        text={pianoExp + " years EXP"}
        font={fontText} size={0.16} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[-2.5, 0, 4.5]}
        text={"CHESS +" + chessCount + " games"}
        font={fontText} size={0.16} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[-2.4, 0, 6.75]}
        text={duoStreak + " days streak"} align='center'
        font={fontText} size={0.16} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
    </>
  ), [pianoExp, chessCount, duoStreak]);

  // Memoiza el título
  const title = useMemo(() => (
    <TextAdvance position={[0, 0, 0]}
      text={"INTERESTS"}
      font={fontTitle} size={0.3} height={0.1}
      colorPri={"white"} colorSec={new THREE.Color(0x333333)}
    />
  ), []);

  // Memoiza la luz
  const lights = useMemo(() => (
    <mesh className="LIGHTS">
      <rectAreaLight intensity={15} position={[0, 2, 4.6]} rotation={[-Math.PI / 2, 0, 0]}
        width={8} height={7} color={new THREE.Color(0x223060)} />
    </mesh>
  ), []);

  // Memoiza el mesh de textos
  const textMesh = useMemo(() => (
    <mesh className="TEXT">
      {staticTexts}
      {dynamicTexts}
    </mesh>
  ), [staticTexts, dynamicTexts]);

  // Memoiza el mesh de modelos
  const modelsMesh = useMemo(() => (
    <mesh className="MODELS">
      {models}
    </mesh>
  ), [models]);

  return (
    <mesh className="INTERESTS" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2]), 10)}>
      {title}
      {/* {lights} */}
      {modelsMesh}
      {textMesh}
    </mesh>
  );
}

export default Interests;
