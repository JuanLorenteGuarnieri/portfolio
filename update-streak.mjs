import fs from 'fs/promises';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const DUOME_URL = 'https://duome.eu/Qassiel';

async function scrapeStreak() {
  try {
    const res = await fetch(DUOME_URL);
    const html = await res.text();
    const dom = new JSDOM(html);
    const { document } = dom.window;

    let span = [...document.querySelectorAll('span')].find(
      el => el.getAttribute('aria-label')?.includes('days streak')
    );

    if (!span) {
      span = document.querySelector('span.cc-header-count');
    }

    if (!span) throw new Error('No se encontró el streak.');

    const streak = span.textContent.trim();
    const json = { streak, updatedAt: new Date().toISOString() };

    await fs.writeFile('streak.json', JSON.stringify(json, null, 2));
    console.log('Streak actualizado:', json);
  } catch (err) {
    console.error('Error al extraer el streak:', err);
    process.exit(1);
  }
}

scrapeStreak();
