import { Bvh, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useState } from 'react';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Chess } from '../models/Chess';
import { Piano } from '../models/Piano';
import { Book } from '../models/Book';
import { RubikCube } from '../models/Rubiks_cube';
import { Duolingo } from '../models/Duolingo';

const INTERESTS_COLORS = {
  secondary: new THREE.Color(0x223060),
  titleSecondary: new THREE.Color(0x333333),
};
const PIANO_START_YEAR = 2015;
const CHESS_STATS_URL = 'https://api.chess.com/pub/player/qassiel/stats';

function parseChessGameCount(data) {
  if (!data) return 0;
  const modes = ['chess_bullet', 'chess_blitz', 'chess_rapid', 'chess_daily'];
  return modes.reduce((sum, mode) => {
    const record = data[mode]?.record;
    if (!record) return sum;
    return sum + (record.win || 0) + (record.loss || 0) + (record.draw || 0);
  }, 0);
}

function InterestModels() {
  return (
    <Bvh firstHitOnly>
      <Piano position={[4.8, -0.19, 1.6]} rotation={[0, -Math.PI / 3, 0]} />
      <Chess scale={2.4} position={[-4.5, 0, 4.5]} rotation={[0, 0, 0]} />
      <Float speed={4} rotationIntensity={0.3} floatIntensity={0.4} floatingRange={[0, 1]}>
        <RubikCube scale={0.15} position={[-4.8, 0, 1.8]} rotation={[0, Math.PI / 6, 0]} />
      </Float>
      <Book scale={0.065} position={[4.7, 0, 4.5]} rotation={[0, -1.7, 0]} />
      <Duolingo position={[-4.2, 0, 6.5]} rotation={[0, 0, 0]} />
    </Bvh>
  );
}

function InterestTitle() {
  return (
    <TextAdvance
      position={[0, 0, 0]}
      text="INTERESTS"
      font={fontTitle}
      size={0.3}
      height={0.1}
      colorPri="white"
      colorSec={INTERESTS_COLORS.titleSecondary}
    />
  );
}

function StaticTexts() {
  return (
    <>
      <TextAdvance
        position={[2.5, 0, 2.0]}
        text="PIANO"
        font={fontText}
        size={0.17}
        height={0.08}
        colorPri="white"
        colorSec={INTERESTS_COLORS.secondary}
      />
      <TextAdvance
        position={[-2.5, 0, 2.16]}
        text="RUBIK's solver"
        font={fontText}
        size={0.16}
        height={0.08}
        colorPri="white"
        colorSec={INTERESTS_COLORS.secondary}
      />
      <TextAdvance
        position={[2.5, 0, 4.5]}
        text="PSYCHOLOGY reader"
        font={fontText}
        size={0.16}
        height={0.08}
        colorPri="white"
        colorSec={INTERESTS_COLORS.secondary}
      />
      <TextAdvance
        position={[-2.4, 0, 6.45]}
        text="DUOLINGO"
        align="center"
        font={fontText}
        size={0.16}
        height={0.08}
        colorPri="white"
        colorSec={INTERESTS_COLORS.secondary}
      />
    </>
  );
}

function DynamicTexts({ pianoExp, chessCount, duoStreak }) {
  return (
    <>
      <TextAdvance
        position={[2.5, 0, 2.3]}
        text={`${pianoExp} years EXP`}
        font={fontText}
        size={0.16}
        height={0.08}
        colorPri="white"
        colorSec={INTERESTS_COLORS.secondary}
      />
      <TextAdvance
        position={[-2.5, 0, 4.5]}
        text={`CHESS +${chessCount} games`}
        font={fontText}
        size={0.16}
        height={0.08}
        colorPri="white"
        colorSec={INTERESTS_COLORS.secondary}
      />
      <TextAdvance
        position={[-2.4, 0, 6.75]}
        text={`${duoStreak} days streak`}
        align="center"
        font={fontText}
        size={0.16}
        height={0.08}
        colorPri="white"
        colorSec={INTERESTS_COLORS.secondary}
      />
    </>
  );
}

function InterestLights() {
  return (
    <mesh className="LIGHTS">
      <rectAreaLight
        intensity={15}
        position={[0, 2, 4.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={8}
        height={7}
        color={INTERESTS_COLORS.secondary}
      />
    </mesh>
  );
}

function Interests({ isVisibleLight, pos }) {
  const [chessCount, setChessCount] = useState('');
  const [duoStreak, setDuoStreak] = useState('');
  const pianoExp = new Date().getFullYear() - PIANO_START_YEAR;
  const visible = isVisibleLight(new THREE.Vector3(0, 5, pos[2]), 10);

  useEffect(() => {
    let active = true;

    async function fetchChessCount() {
      try {
        const response = await fetch(CHESS_STATS_URL);
        if (!response.ok) {
          throw new Error(`Error al obtener los datos: ${response.status}`);
        }
        const data = await response.json();
        const totalGames = parseChessGameCount(data);
        const roundedCount = Math.floor(totalGames / 10) * 10;
        if (active) {
          setChessCount(String(roundedCount));
        }
      } catch (err) {
        console.error('Error al actualizar el conteo de partidas:', err);
        if (active) {
          setChessCount('N/A');
        }
      }
    }

    fetchChessCount();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    const knownStreak = 666;
    const knownDate = new Date('2025-06-06');
    const streakStart = new Date(knownDate);
    streakStart.setDate(streakStart.getDate() - (knownStreak - 1));
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.ceil((today - streakStart) / msPerDay);
    setDuoStreak(diffDays);
  }, []);

  return (
    <mesh className="INTERESTS" position={pos} visible={visible}>
      <InterestTitle />
      {/* <InterestLights /> */}
      <mesh className="MODELS">
        <InterestModels />
      </mesh>
      <mesh className="TEXT">
        <StaticTexts />
        <DynamicTexts pianoExp={pianoExp} chessCount={chessCount} duoStreak={duoStreak} />
      </mesh>
    </mesh>
  );
}

export default Interests;
