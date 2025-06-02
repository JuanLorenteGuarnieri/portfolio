import { Bvh, Float } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from './TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Chess } from '../../public/models/Chess';
import { Piano } from '../../public/models/Piano';
import { Book } from '../../public/models/Book';
import { RubikCube } from '../../public/models/Rubiks_cube';
import { Duolingo } from '../../public/models/Duolingo';
import { useEffect, useState } from 'react';

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

  async function updateDuolingoStreak() {
    try {
      // 1) Montamos la URL del proxy + la URL objetivo
      const targetUrl = encodeURIComponent('https://duome.eu/Qassiel');
      const proxyUrl = `https://api.allorigins.win/raw?url=${targetUrl}`;

      // 2) Hacemos el fetch a través del proxy (el proxy añade el header CORS)
      const response = await fetch(proxyUrl);
      const html = await response.text();

      // 3) Parseamos el HTML y extraemos el <span class="cc-header-count">
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Busca un <span> cuyo aria-label contenga 'days streak'
      const span = Array.from(doc.querySelectorAll('span')).find(
        el => el.getAttribute('aria-label') && el.getAttribute('aria-label').includes('days streak')
      );
      if (!span) throw new Error('No se encontró un span con aria-label que contenga "days streak"');

      // 4) Extraemos el texto del span y lo asignamos a la variable correspondiente
      let text = span.textContent.trim();
      setDuoStreak(text);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    updateCountFromChess();
    updateDuolingoStreak();
  }, []);

  return (
    <mesh className="INTERESTS" position={pos}>
      <TextAdvance position={[0, 0, 0]}
        text={"INTERESTS"}
        font={fontTitle} size={0.3} height={0.1}
        colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
      />
      <mesh className="LIGHTS">
        <rectAreaLight intensity={15} position={[0, 2, 4.6]} rotation={[-Math.PI / 2, 0, 0]}
          visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 2.1), 10)}
          width={8} height={7} color={new THREE.Color(0x223060)} />
      </mesh>
      <mesh className="MODELS">
        <Bvh firstHitOnly >
          <Piano position={[4.8, -0.19, 2.1]} rotation={[0, -Math.PI / 3, 0]} />
          <Chess scale={2.4} position={[-4.5, 0, 5]} rotation={[0, 0, 0]} />
          <Float
            speed={4} // Animation speed, defaults to 1
            rotationIntensity={0.3} // XYZ rotation intensity, defaults to 1
            floatIntensity={0.4} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
            floatingRange={[0, 1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
          >
            <RubikCube scale={0.15} position={[-4.8, 0, 2.3]} rotation={[0, Math.PI / 6, 0]} />
          </Float>
          <Book scale={0.065} position={[4.7, 0, 5]} rotation={[0, -1.7, 0]} />

          <Duolingo position={[-4.2, 0, 7]} rotation={[0, 0, 0]} />
        </Bvh>
      </mesh>

      <mesh className="TEXT">
        <TextAdvance position={[2.5, 0, 2.5]}
          text={"PIANO"}
          font={fontText} size={0.17} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[2.5, 0, 2.8]}
          text={pianoExp + " years EXP"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[-2.5, 0, 2.66]}
          text={"RUBIK's solver"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[-2.5, 0, 5]}
          text={"CHESS +" + chessCount + " games"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[2.5, 0, 5]}
          text={"PSYCHOLOGY reader"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[-2.4, 0, 6.95]}
          text={"DUOLINGO"} align='center'
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[-2.4, 0, 7.25]}
          text={duoStreak + " days streak"} align='center'
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
      </mesh>
    </mesh>
  );
}

export default Interests;
