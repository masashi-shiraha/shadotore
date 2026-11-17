/* シャドトレ - 英語シャドーイング（PWA版） */
'use strict';

const APP_VERSION = '2.1.1';

/* =========================================================
 * 1. 声・地域（訛り）プロファイル
 * ========================================================= */
const ACCENT_GUIDE = {
  us: 'Accent: standard General American English, clear and neutral.',
  gb: 'Accent: refined southern British English (Received Pronunciation), crisp consonants, non-rhotic.',
  au: 'Accent: natural, friendly General Australian English with typical Australian vowels and relaxed rising intonation.',
  th: 'Accent: speak English with a clear, authentic Thai accent, like a Thai professional in a business meeting: even, syllable-timed rhythm; final consonants softened or unreleased; consonant clusters simplified; some r sounding closer to l; slight rise-fall pitch on stressed words. Keep it natural, respectful and easy to understand, never a caricature.',
  vi: 'Accent: speak English with a clear, authentic Vietnamese accent, like a Vietnamese professional in a business meeting: clipped word endings with final consonants unreleased or dropped; syllable-by-syllable rhythm; noticeable pitch movement on words; less linking between words. Keep it natural, respectful and easy to understand, never a caricature.',
  id: 'Accent: speak English with a clear, authentic Indonesian accent, like an Indonesian professional in a business meeting: clear, full vowels with little vowel reduction; even, syllable-timed rhythm; lightly rolled or tapped r; th sounds closer to t or d. Keep it natural, respectful and easy to understand, never a caricature.',
};

const VOICE_PROFILES = [
  {
    id: 'us_f', label: '🇺🇸 アメリカ英語（標準・クリアな女性声）', gender: 'f', accent: 'us',
    persona: { f: 'A clear, friendly American woman in her 30s.', m: 'A calm, confident American businessman in his 40s.' },
    openai: { f: 'coral', m: 'ash' },
    eleven: { f: 'EXAVITQu4vr4xnSDxMaL', m: 'nPczCjzI2devNBz1zQrb' },
    browser: { langs: ['en-US'], rate: 1, pitch: 1.0 },
  },
  {
    id: 'us_m', label: '🇺🇸 アメリカ英語（落ち着いたビジネス男性声）', gender: 'm', accent: 'us',
    persona: { f: 'A clear, friendly American woman in her 30s.', m: 'A calm, confident American businessman in his 40s with a warm, low voice.' },
    openai: { f: 'coral', m: 'onyx' },
    eleven: { f: 'EXAVITQu4vr4xnSDxMaL', m: 'nPczCjzI2devNBz1zQrb' },
    browser: { langs: ['en-US'], rate: 1, pitch: 1.0 },
  },
  {
    id: 'gb_f', label: '🇬🇧 イギリス英語（洗練された英国発音・女性声）', gender: 'f', accent: 'gb',
    persona: { f: 'A polished, articulate British woman.', m: 'An intelligent, well-spoken English gentleman.' },
    openai: { f: 'shimmer', m: 'fable' },
    eleven: { f: 'Xb7hH8MSUJpSbSDYk0k2', m: 'JBFqnCBsd6RMkjVDRZzb' },
    browser: { langs: ['en-GB'], rate: 1, pitch: 1.0 },
  },
  {
    id: 'gb_m', label: '🇬🇧 イギリス英語（知的な英国紳士風・男性声）', gender: 'm', accent: 'gb',
    persona: { f: 'A polished, articulate British woman.', m: 'An intelligent, well-spoken English gentleman with a measured, composed delivery.' },
    openai: { f: 'shimmer', m: 'fable' },
    eleven: { f: 'Xb7hH8MSUJpSbSDYk0k2', m: 'JBFqnCBsd6RMkjVDRZzb' },
    browser: { langs: ['en-GB'], rate: 1, pitch: 0.98 },
  },
  {
    id: 'au', label: '🇦🇺 オーストラリア英語（親しみやすいオージー発音）', gender: 'm', accent: 'au',
    persona: { f: 'A cheerful, approachable Australian woman.', m: 'A laid-back, friendly Australian man.' },
    openai: { f: 'nova', m: 'echo' },
    eleven: { f: '', m: 'IKne3meq5aSn9XLyUdCD' },
    browser: { langs: ['en-AU', 'en-NZ'], rate: 1, pitch: 1.0 },
  },
  {
    id: 'th', label: '🇹🇭 タイ訛りの英語（タイ人話者特有のイントネーション）', gender: 'f', accent: 'th', regional: true,
    persona: { f: 'A friendly Thai woman who works in sales in Bangkok.', m: 'A polite Thai businessman from Bangkok.' },
    openai: { f: 'sage', m: 'ash' },
    eleven: { f: '', m: '' },
    browser: { langs: ['th-TH', 'en-IN', 'en-SG', 'en-US'], rate: 0.94, pitch: 1.04 },
  },
  {
    id: 'vi', label: '🇻🇳 ベトナム訛りの英語（ベトナム人話者特有の語尾・リズム）', gender: 'f', accent: 'vi', regional: true,
    persona: { f: 'A friendly Vietnamese woman who works at a manufacturer in Ho Chi Minh City.', m: 'A polite Vietnamese engineer from Hanoi.' },
    openai: { f: 'nova', m: 'echo' },
    eleven: { f: '', m: '' },
    browser: { langs: ['vi-VN', 'en-IN', 'en-SG', 'en-US'], rate: 0.92, pitch: 1.0 },
  },
  {
    id: 'id', label: '🇮🇩 インドネシア訛りの英語（インドネシア人話者特有の明瞭な母音・巻き舌）', gender: 'f', accent: 'id', regional: true,
    persona: { f: 'A friendly Indonesian woman who works in procurement in Jakarta.', m: 'A polite Indonesian businessman from Jakarta.' },
    openai: { f: 'coral', m: 'ash' },
    eleven: { f: '', m: '' },
    browser: { langs: ['id-ID', 'ms-MY', 'en-IN', 'en-SG', 'en-US'], rate: 0.95, pitch: 1.02 },
  },
];

const DEFAULT_SETTINGS = {
  ttsEngine: 'auto',
  ocrEngine: 'auto',
  openaiKey: '',
  openaiTtsModel: 'gpt-4o-mini-tts',
  openaiVisionModel: 'gpt-4o-mini',
  geminiKey: '',
  geminiModel: 'gemini-2.5-flash',
  elevenKey: '',
  elevenModel: 'eleven_multilingual_v2',
  elevenOverrides: {}, // { profileId: { f: 'voiceId', m: 'voiceId' } }
};

const DEFAULT_PREFS = {
  lastPartId: 'part1',
  rate: 1.0,
  profileId: 'us_f',
  dualVoice: true,
  highlight: true,
  isLooping: false,
  manualVoiceF: '',
  manualVoiceM: '',
  panelOpen: false,
};

const KEYS = {
  settings: 'shadotore.settings',
  prefs: 'shadotore.prefs',
  materials: 'shadotore.materials',
  history: 'shadotore.wpmHistory',
  legacyHistory: 'shadoten_wpm_history',
};

/* =========================================================
 * 2. 保存（localStorage / IndexedDB）
 * ========================================================= */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    showToast('端末の保存領域がいっぱいで保存できませんでした。');
    return false;
  }
}

const ttsDB = (() => {
  let dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('no idb'));
      const req = indexedDB.open('shadotore', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('tts');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }
  async function tx(mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction('tts', mode);
      const store = t.objectStore('tts');
      const req = fn(store);
      t.oncomplete = () => resolve(req && req.result);
      t.onerror = () => reject(t.error);
    });
  }
  return {
    get: (k) => tx('readonly', (s) => s.get(k)).catch(() => null),
    set: (k, v) => tx('readwrite', (s) => s.put(v, k)).catch(() => null),
    clear: () => tx('readwrite', (s) => s.clear()).catch(() => null),
  };
})();

/* =========================================================
 * 3. 状態
 * ========================================================= */
let settings = { ...DEFAULT_SETTINGS, ...loadJSON(KEYS.settings, {}) };
let prefs = { ...DEFAULT_PREFS, ...loadJSON(KEYS.prefs, {}) };
let userMaterials = loadJSON(KEYS.materials, []);

const state = {
  selectedPartId: 'part1',
  mode: 'listening',
  rate: 1.0,
  isLooping: false,
  isPlaying: false,
  isPaused: false,
  currentSentenceIndex: -1,
  sentences: [],
  speakerGender: {},
  voices: [],
  playToken: 0,
  activeEngine: 'browser',
  aiDisabledForSession: false,
  wpmRunning: false,
  wpmStartTime: 0,
  wpmElapsedMs: 0,
  wpmIntervalId: null,
  wpmHistory: [],
  editingMaterialId: null,
  addTab: 'text',
  pendingImages: [],
  wakeLock: null,
};

const ttsAudio = new Audio();
ttsAudio.preload = 'auto';
ttsAudio.setAttribute('playsinline', '');
let currentAudioUrl = null;
const ttsMemCache = new Map();
const ttsInflight = new Map();

function savePrefs() {
  saveJSON(KEYS.prefs, prefs);
}

/* =========================================================
 * 4. 初期化
 * ========================================================= */
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('appVersion').textContent = APP_VERSION;
  loadWpmHistory();

  // 設定の復元
  state.rate = prefs.rate;
  state.isLooping = prefs.isLooping;
  document.getElementById('dualVoiceToggle').checked = prefs.dualVoice;
  document.getElementById('highlightToggle').checked = prefs.highlight;
  const panel = document.getElementById('listeningControlPanel');
  panel.open = !!prefs.panelOpen;
  panel.addEventListener('toggle', () => {
    prefs.panelOpen = panel.open;
    savePrefs();
  });
  setPlaybackRate(state.rate);
  renderLoopButton();

  renderVoiceProfileSelect();
  initSpeechVoices();
  updateEngineBadge();

  const startId = isValidPartId(prefs.lastPartId) ? prefs.lastPartId : 'part1';
  selectPart(startId);

  document.getElementById('speedSlider').addEventListener('input', (e) => {
    setPlaybackRate(parseFloat(e.target.value), false);
  });
  document.getElementById('dualVoiceToggle').addEventListener('change', (e) => {
    prefs.dualVoice = e.target.checked;
    savePrefs();
    restartIfPlaying();
  });
  document.getElementById('highlightToggle').addEventListener('change', (e) => {
    prefs.highlight = e.target.checked;
    savePrefs();
    renderScript();
  });
  document.getElementById('scriptContainer').addEventListener('click', onScriptClick);
  document.getElementById('imageInput').addEventListener('change', onImagesSelected);
  document.getElementById('materialTextInput').addEventListener('input', updateMaterialWordPreview);
  document.getElementById('importInput').addEventListener('change', importBackup);

  ttsAudio.addEventListener('error', () => {});
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.isPlaying && !state.isPaused) requestWakeLock();
  });

  registerServiceWorker();
});

function isValidPartId(id) {
  if (id === 'all') return true;
  if (MATERIAL_PARTS.some((p) => p.id === id)) return true;
  return userMaterials.some((m) => m.id === id);
}

/* =========================================================
 * 5. 教材タブ・選択
 * ========================================================= */
function renderPartTabs() {
  const container = document.getElementById('partTabs');
  const tabs = [
    ...MATERIAL_PARTS.map((p) => ({ id: p.id, label: p.tabLabel })),
    { id: 'all', label: '全文 (All)' },
    ...userMaterials.map((m) => ({ id: m.id, label: '📄 ' + truncate(m.title, 16) })),
  ];
  container.innerHTML =
    tabs
      .map((t) => {
        const active = state.selectedPartId === t.id;
        return `<button type="button" data-part="${escapeHtml(t.id)}" class="tab-chip ${active ? 'tab-chip-on' : 'tab-chip-off'}">${escapeHtml(t.label)}</button>`;
      })
      .join('') +
    `<button type="button" data-add="1" class="tab-chip tab-chip-add">＋ 教材を追加</button>`;

  container.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.add) openAddSheet();
      else selectPart(btn.dataset.part);
    });
  });
  const activeBtn = container.querySelector('.tab-chip-on');
  if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function selectPart(partId) {
  stopSpeech(true);
  resetWpmTimer();
  state.selectedPartId = partId;
  prefs.lastPartId = partId;
  savePrefs();
  renderPartTabs();

  const badgeEl = document.getElementById('currentPartBadge');
  const userActions = document.getElementById('userMaterialActions');
  userActions.classList.add('hidden');

  if (partId === 'all') {
    badgeEl.textContent = '全4パート通し (Online Meeting)';
    const combined = [];
    MATERIAL_PARTS.forEach((p) => p.lines.forEach((line) => combined.push({ ...line, partTitle: p.title })));
    state.sentences = splitLinesIntoPlayableSentences(combined);
  } else {
    const part = MATERIAL_PARTS.find((p) => p.id === partId);
    if (part) {
      badgeEl.textContent = part.title;
      state.sentences = splitLinesIntoPlayableSentences(part.lines);
    } else {
      const mat = userMaterials.find((m) => m.id === partId);
      if (!mat) return selectPart('part1');
      badgeEl.textContent = mat.title;
      state.sentences = splitLinesIntoPlayableSentences(parseRawText(mat.raw));
      userActions.classList.remove('hidden');
    }
  }
  computeSpeakerGenders();
  updateWordStats();
  renderScript();
  updatePlaybackProgress();
}

/* =========================================================
 * 6. テキスト解析（話者・文分割・音の繋がり）
 * ========================================================= */
const SPEAKER_RE = /^([A-Z][A-Za-z.'\-]{0,15}(?: [A-Z][A-Za-z.'\-]{0,15})?|[A-Za-z]{1,12})\s*[:：]\s*(.*)$/;

function parseRawText(rawText) {
  const rawLines = String(rawText || '')
    .replace(/\r/g, '')
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  return rawLines.map((line) => {
    const m = line.match(SPEAKER_RE);
    let speaker = '';
    let content = line;
    if (m && m[2]) {
      speaker = m[1];
      content = m[2];
    }
    return { speaker, text: content, highlights: autoDetectConnectedSpeech(content) };
  });
}

function autoDetectConnectedSpeech(text) {
  const detected = [];
  const rules = [
    {
      regex: /\b(going to|want to|got to|have to|has to|used to|kind of|sort of|a lot of|out of|gonna|wanna)\b/gi,
      type: 'reduce',
      tip: '短縮・弱形化：会話では2語が融合して短く発音されます',
    },
    {
      regex: /\b(could you|would you|did you|can you|don't you|won't you|got it|get it|keep it|look at|up and|in our|for us|works for)\b/gi,
      type: 'link',
      tip: '音の連結・同化：前の語末の子音と次の語頭の母音/yが滑らかに繋がります',
    },
    {
      regex: /\b([a-z]*[td])\s+(you|your)\b/gi,
      type: 'link',
      tip: '同化：t/d と you が混ざり「チュ／ジュ」のような音になります',
    },
    {
      regex: /\b([a-z]*(?:st|ct|pt|ft|nd|ld|nt))\s+([bcdfgjklmnpqrstvwxz][a-z]*)\b/gi,
      type: 'reduce',
      tip: '脱落：子音に挟まれた t / d はほとんど聞こえなくなります',
    },
    {
      regex: /\b([a-z]{2,}[tdkpbgvsznm])\s+(a|an|the|it|is|in|on|at|up|out|of|our|us|and|or|all|about|any|each|every|only|over|after|again)\b/gi,
      type: 'link',
      tip: '子音＋母音の連結（リンキング）：単語同士が切れることなく1語のように繋がります',
    },
    {
      regex: /\b[a-z]*[aeiou]r?tt?(?:er|ers|y|ies|ing|ed|le|ow|al)\b/gi,
      type: 'link',
      tip: 'フラッピング（米）：母音に挟まれた t が軽い「ラ行／ダ」のような音になります',
    },
  ];

  rules.forEach((rule) => {
    let match;
    while ((match = rule.regex.exec(text)) !== null) {
      const phrase = match[0];
      if (phrase.length < 3) continue;
      if (!detected.some((d) => d.phrase.toLowerCase() === phrase.toLowerCase())) {
        detected.push({ phrase, type: rule.type, tip: `${phrase}：${rule.tip}` });
      }
    }
  });
  return detected;
}

function splitLinesIntoPlayableSentences(lines) {
  const result = [];
  lines.forEach((line, lineIdx) => {
    const parts = line.text.match(/[^.!?]+[.!?]+["'”’]?|[^.!?]+$/g) || [line.text];
    parts.forEach((sentenceText, sIdx) => {
      const trimmed = sentenceText.trim();
      if (!trimmed) return;
      result.push({
        id: `${lineIdx}-${sIdx}`,
        lineIdx,
        speaker: line.speaker || '',
        text: trimmed,
        highlights: line.highlights || [],
        partTitle: line.partTitle || '',
      });
    });
  });
  return result;
}

function countWords(text) {
  return String(text)
    .replace(/[—–]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => /[a-zA-Z0-9]/.test(w)).length;
}

function getTotalWordCount() {
  return state.sentences.reduce((sum, s) => sum + countWords(s.text), 0);
}

function updateWordStats() {
  const wordCount = getTotalWordCount();
  document.getElementById('scriptWordCount').textContent = wordCount;
  document.getElementById('wpmPanelWordCount').textContent = wordCount;
  const minSec = Math.round((wordCount / 200) * 60);
  const maxSec = Math.round((wordCount / 150) * 60);
  document.getElementById('targetTimeHint').textContent =
    wordCount > 0 ? `ネイティブ目標: ${minSec}〜${maxSec}秒` : 'テキストを設定してください';
  updateEstimatedRateWpm();
}

/* =========================================================
 * 7. 本文の描画
 * ========================================================= */
function renderScript() {
  const container = document.getElementById('scriptContainer');
  const showHighlights = document.getElementById('highlightToggle').checked;
  document.getElementById('phoneticLegendBar').classList.toggle('hidden', !showHighlights);

  if (state.sentences.length === 0) {
    container.innerHTML = `<p class="text-sm text-slate-400 text-center py-8">表示する英文がありません。</p>`;
    return;
  }

  const groupedLines = [];
  state.sentences.forEach((s, globalIdx) => {
    let group = groupedLines.find((g) => g.lineIdx === s.lineIdx && g.partTitle === s.partTitle);
    if (!group) {
      group = { lineIdx: s.lineIdx, speaker: s.speaker, partTitle: s.partTitle, items: [] };
      groupedLines.push(group);
    }
    group.items.push({ ...s, globalIdx });
  });

  let lastPartTitle = '';
  container.innerHTML = groupedLines
    .map((group) => {
      let partHeaderHtml = '';
      if (state.selectedPartId === 'all' && group.partTitle && group.partTitle !== lastPartTitle) {
        lastPartTitle = group.partTitle;
        partHeaderHtml = `<div class="pt-3 pb-1 border-b border-slate-200 text-xs font-extrabold text-shadoten-700 tracking-wider">${escapeHtml(group.partTitle)}</div>`;
      }
      const g = group.speaker ? state.speakerGender[group.speaker] : '';
      const speakerColor = g === 'm' ? 'text-sky-700' : g === 'f' ? 'text-rose-700' : 'text-slate-900';
      const speakerBadge = group.speaker
        ? `<span class="inline-block font-bold ${speakerColor} mr-1.5 select-none">${escapeHtml(group.speaker)}:</span>`
        : '';
      const sentencesHtml = group.items
        .map((item) => {
          const isActive = item.globalIdx === state.currentSentenceIndex;
          const formatted = showHighlights ? applyHighlightsToText(item.text, item.highlights) : escapeHtml(item.text);
          return `<span id="sentence-${item.globalIdx}" data-idx="${item.globalIdx}" class="sentence-block cursor-pointer rounded px-0.5 ${isActive ? 'sentence-active' : ''}">${formatted}</span>`;
        })
        .join(' ');
      return `${partHeaderHtml}<p class="leading-[1.9] text-slate-800">${speakerBadge}${sentencesHtml}</p>`;
    })
    .join('');
}

function applyHighlightsToText(text, highlights) {
  if (!highlights || highlights.length === 0) return escapeHtml(text);
  const sorted = [...highlights].sort((a, b) => b.phrase.length - a.phrase.length);
  let tokens = [{ text, highlighted: false }];

  sorted.forEach((h) => {
    const nextTokens = [];
    const escaped = h.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pre = /^\w/.test(h.phrase) ? '\\b' : '';
    const post = /\w$/.test(h.phrase) ? '\\b' : '';
    const regex = new RegExp(`(${pre}${escaped}${post})`, 'i');
    tokens.forEach((tok) => {
      if (tok.highlighted) return nextTokens.push(tok);
      tok.text.split(regex).forEach((part) => {
        if (!part) return;
        if (part.toLowerCase() === h.phrase.toLowerCase()) {
          nextTokens.push({ text: part, highlighted: true, type: h.type, tip: h.tip });
        } else {
          nextTokens.push({ text: part, highlighted: false });
        }
      });
    });
    tokens = nextTokens;
  });

  return tokens
    .map((tok) => {
      if (!tok.highlighted) return escapeHtml(tok.text);
      const cls = tok.type === 'reduce' ? 'cs-reduce' : 'cs-link';
      return `<span class="${cls}" data-tip="${escapeHtml(tok.tip)}">${escapeHtml(tok.text)}</span>`;
    })
    .join('');
}

function onScriptClick(event) {
  const chip = event.target.closest('.cs-link, .cs-reduce');
  if (chip) {
    document.querySelectorAll('.active-chip').forEach((el) => el.classList.remove('active-chip'));
    chip.classList.add('active-chip');
    document.getElementById('phoneticTipBox').classList.remove('hidden');
    document.getElementById('phoneticTipBox').innerHTML =
      `<span class="font-bold text-shadoten-700">🔊 音声変化:</span> ${escapeHtml(chip.dataset.tip || '')}`;
    return;
  }
  const sentence = event.target.closest('.sentence-block');
  if (sentence) {
    unlockAudio();
    playFromSentence(parseInt(sentence.dataset.idx, 10));
  }
}

/* =========================================================
 * 8. モード切替
 * ========================================================= */
function switchMode(mode) {
  state.mode = mode;
  const isL = mode === 'listening';
  if (!isL) stopSpeech(false);
  document.getElementById('listeningControlPanel').classList.toggle('hidden', !isL);
  document.getElementById('wpmControlPanel').classList.toggle('hidden', isL);
  document.getElementById('playerControls').classList.toggle('hidden', !isL);
  document.getElementById('wpmControls').classList.toggle('hidden', isL);
  document.getElementById('wpmControls').classList.toggle('flex', !isL);
  document.getElementById('tabBtnListening').classList.toggle('mode-btn-active', isL);
  document.getElementById('tabBtnWpm').classList.toggle('mode-btn-active', !isL);
}

/* =========================================================
 * 9. 声の選択（プロファイル・端末音声）
 * ========================================================= */
function getProfile() {
  return VOICE_PROFILES.find((p) => p.id === prefs.profileId) || VOICE_PROFILES[0];
}

function renderVoiceProfileSelect() {
  const sel = document.getElementById('voiceProfileSelect');
  sel.innerHTML = VOICE_PROFILES.map(
    (p) => `<option value="${p.id}" ${p.id === prefs.profileId ? 'selected' : ''}>${escapeHtml(p.label)}</option>`
  ).join('');
  sel.onchange = (e) => {
    prefs.profileId = e.target.value;
    savePrefs();
    computeSpeakerGenders();
    renderScript();
    updateEngineBadge();
    restartIfPlaying();
  };
}

function initSpeechVoices() {
  if (!('speechSynthesis' in window)) return;
  const populate = () => {
    state.voices = window.speechSynthesis.getVoices() || [];
    renderManualVoiceSelect();
    updateEngineBadge();
  };
  populate();
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = populate;
  }
}

function renderManualVoiceSelect() {
  let wrap = document.getElementById('manualVoiceWrap');
  if (!wrap) {
    wrap = document.createElement('details');
    wrap.id = 'manualVoiceWrap';
    wrap.className = 'text-[11px] text-slate-600';
    wrap.innerHTML = `<summary class="cursor-pointer py-1 font-semibold">標準音声：端末の声を自分で選ぶ（男性・女性）</summary>
      <label class="block mt-1">女性の声<select id="manualVoiceF" class="field mt-0.5 text-sm"></select></label>
      <label class="block mt-2">男性の声<select id="manualVoiceM" class="field mt-0.5 text-sm"></select></label>
      <p class="mt-1.5 text-slate-500 leading-relaxed">★＝高音質（拡張・Premium）。※iPhone/iPadは、設定でダウンロードした拡張・Premiumの声をWebアプリに渡さない仕様のため、ここには出ません。より自然な声は設定画面のAI音声を使ってください。</p>`;
    document.getElementById('voiceProfileNote').after(wrap);
    ['F', 'M'].forEach((g) => {
      wrap.querySelector('#manualVoice' + g).addEventListener('change', (e) => {
        prefs['manualVoice' + g] = e.target.value;
        savePrefs();
        updateEngineBadge();
        restartIfPlaying();
      });
    });
  }
  const relevant = state.voices
    .filter((v) => /^(en|th|vi|id|ms)/i.test(v.lang || '') && !isNovelty(v))
    .sort((a, b) => voiceQuality(b) - voiceQuality(a) || (a.lang || '').localeCompare(b.lang || ''));
  ['F', 'M'].forEach((g) => {
    const want = g.toLowerCase();
    const list = relevant.filter((v) => voiceGender(v) === want).concat(relevant.filter((v) => !voiceGender(v)));
    const cur = prefs['manualVoice' + g] || '';
    document.getElementById('manualVoice' + g).innerHTML =
      `<option value="">自動（おすすめ）</option>` +
      list
        .map((v) => `<option value="${escapeHtml(v.voiceURI)}" ${v.voiceURI === cur ? 'selected' : ''}>${escapeHtml(voiceLabel(v))}</option>`)
        .join('');
  });
}

const FEMALE_VOICE_RE = /female|woman|samantha|\bava\b|allison|susan|zira|aria|jenny|michelle|emma|libby|sonia|serena|\bkate\b|karen|moira|tessa|fiona|victoria|catherine|natasha|kanya|linh|damayanti|google us english|nicky|joanna|salli|kendra|kimberly|\bivy\b|\bamy\b|olivia|zoe|hazel|heera|neerja|clara|ana\b|sara|veena|lekha|luna|nova|siri.*(female)/i;
const MALE_VOICE_RE = /\bmale\b|\bman\b|evan|nathan|noah|daniel|\balex\b|\btom\b|aaron|\bfred\b|\bguy\b|ryan|david|\bmark\b|\blee\b|arthur|oliver|gordon|rishi|thomas|brian|christopher|\beric\b|roger|william|james|matthew|justin|joey|russell|george|prabhat|ravi|william|liam|andrew|nam\b|ardi|siri.*(male)/i;

/* iPhoneは声の名前が日本語になる（ベル・道化など）ので、voiceURI（英語の内部名）も見て判定する */
function voiceUriKey(v) {
  const u = String(v.voiceURI || '');
  return u.split(/[.\/]/).pop() || '';
}
function voiceTier(v) {
  const u = String(v.voiceURI || '');
  if (/premium/i.test(u) || /premium|プレミアム/i.test(v.name || '')) return 'premium';
  if (/enhanced/i.test(u) || /enhanced|拡張|高品質|natural|neural/i.test(v.name || '')) return 'enhanced';
  if (/siri/i.test(u)) return 'siri';
  if (/compact/i.test(u)) return 'compact';
  return '';
}
const JP_NOVELTY_RE = /ベル|震え|道化|オルガン|スーパースター|トリノイド|ささやき|バブル|ボイン|知らせ|チェロ|ザーボックス|ゼルボックス|ジュニア|ラルフ|キャシー|アルバート|ロッコ|おじいさん|おばあさん|グランマ|グランパ|シェリー|フロー|エディ|リード|サンディ|フレッド|bahh/i;
function isNovelty(v) {
  const u = String(v.voiceURI || '');
  return NOVELTY_RE.test(v.name || '') || NOVELTY_RE.test(voiceUriKey(v)) || JP_NOVELTY_RE.test(v.name || '') || /eloquence/i.test(u) || (isIOS() && /speech\.synthesis\.voice\./i.test(u));
}
function voiceLabel(v) {
  const tier = voiceTier(v);
  const tag = { premium: '高音質Premium', enhanced: '高音質', siri: '標準', compact: '標準' }[tier];
  return `${isHighQuality(v) ? '★ ' : ''}${v.name}${tag ? `［${tag}］` : ''} (${v.lang})`;
}

function voiceGender(v) {
  const n = (v.name || '') + ' ' + voiceUriKey(v);
  if (FEMALE_VOICE_RE.test(n)) return 'f';
  if (MALE_VOICE_RE.test(n)) return 'm';
  return '';
}

/* 声の優先度。中国からはGoogle等のネット経由の声は無音になりやすいので、端末内の声を優先する。
 * 高音質（拡張・Premium）の声は優先するが、端末に入っておらず鳴らなかった場合は自動で次の声に切り替わる */
const NOVELTY_RE = /eloquence|novelty|bells|bubbles|boing|zarvox|whisper|trinoids|organ|cellos|jester|superstar|wobble|bad ?news|good ?news|albert|junior|ralph|kathy|grandma|grandpa|rocko|shelley|\bflo\b|eddy|reed|sandy|\bfred\b|\bbahh\b|hysterical|deranged|pipe ?organ/i;
function isHighQuality(v) {
  const t = voiceTier(v);
  return t === 'premium' || t === 'enhanced';
}
function voiceQuality(v) {
  const n = v.name || '';
  let s = 0;
  if (badVoices.has(v.voiceURI)) s -= 100; // 実際に鳴らなかった声
  if (v.localService !== false) s += 4; else s -= 4;
  if (isHighQuality(v)) s += 5;
  const k = voiceUriKey(v);
  if (/^(samantha|daniel|karen|moira|tessa|rishi|nicky|kate|serena|lee|martha|arthur|catherine|gordon|evan|nathan|tom|noah|kanya|linh|damayanti)\b/i.test(n) || /^(evan|nathan|tom|noah|daniel|arthur)$/i.test(k)) s += 2;
  if ((/^aaron\b/i.test(n) || /^aaron$/i.test(k)) && !isHighQuality(v)) s -= 1;
  if (v.default) s += 1;
  if (isNovelty(v)) s -= 20; // Fredなどの機械的・おもしろ系の声
  return s;
}

function normLang(l) {
  return String(l || '').replace('_', '-').toLowerCase();
}

function pickBrowserVoice(profile, gender) {
  const manual = prefs[gender === 'm' ? 'manualVoiceM' : 'manualVoiceF'];
  if (manual && !badVoices.has(manual)) {
    const v = state.voices.find((x) => x.voiceURI === manual);
    if (v) return { voice: v, genderMatched: true, manual: true };
  }
  const score = (v) => voiceQuality(v) + (voiceGender(v) === gender ? 6 : voiceGender(v) ? -4 : 0);
  let best = null;
  for (const lang of profile.browser.langs) {
    const want = lang.toLowerCase();
    const cands = state.voices.filter((v) => normLang(v.lang) === want && !badVoices.has(v.voiceURI) && !isNovelty(v));
    if (cands.length === 0) continue;
    best = cands.sort((a, b) => score(b) - score(a))[0];
    break;
  }
  // 同じ国の自然な声がない（男性がいない等）ときは、他の英語圏の自然な同性の声で代用
  const poor = (v) => (/^aaron\b/i.test(v.name || '') || /^aaron$/i.test(voiceUriKey(v))) && !isHighQuality(v); // iPhone標準の男性声は機械的
  const good = (v) => v && voiceGender(v) === gender && v.localService !== false && !poor(v);
  if (!good(best) && !profile.regional) {
    const alt = state.voices
      .filter((v) => normLang(v.lang).startsWith('en') && !badVoices.has(v.voiceURI) && !isNovelty(v) && voiceGender(v) === gender && !poor(v))
      .sort((a, b) => score(b) - score(a))[0];
    if (alt && voiceQuality(alt) >= 4) return { voice: alt, genderMatched: true, substituted: true };
  }
  if (best) return { voice: best, genderMatched: voiceGender(best) === gender };
  const anyEn = state.voices.filter((v) => normLang(v.lang).startsWith('en') && !badVoices.has(v.voiceURI) && !isNovelty(v)).sort((a, b) => score(b) - score(a));
  return { voice: anyEn[0] || null, genderMatched: anyEn[0] ? voiceGender(anyEn[0]) === gender : false };
}

/* 話者 → 男女の割り当て（Maya / Steve の声質切替） */
const FEMALE_SPEAKERS = new Set(['maya', 'm', 'sarah', 'emma', 'anna', 'lisa', 'mary', 'jane', 'kate', 'amy', 'emily', 'olivia', 'sophia', 'jessica', 'rachel', 'linda', 'susan', 'karen', 'nancy', 'yuki', 'mei', 'woman', 'female', 'lady', 'ms', 'mrs', 'she', 'w', 'grace', 'lily', 'hana', 'ling', 'lin', 'wang']);
const MALE_SPEAKERS = new Set(['steve', 's', 'john', 'mike', 'tom', 'david', 'james', 'bob', 'paul', 'mark', 'ken', 'ryan', 'peter', 'jack', 'man', 'male', 'mr', 'he', 'kevin', 'brian', 'chris', 'daniel', 'alex', 'sam', 'masashi', 'taro', 'li', 'zhang']);

function computeSpeakerGenders() {
  const profile = getProfile();
  const primary = profile.gender;
  const other = primary === 'f' ? 'm' : 'f';
  const map = {};
  let unknownCount = 0;
  state.sentences.forEach((s) => {
    if (!s.speaker || map[s.speaker]) return;
    const key = s.speaker.toLowerCase().replace(/[^a-z]/g, '');
    if (FEMALE_SPEAKERS.has(key)) map[s.speaker] = 'f';
    else if (MALE_SPEAKERS.has(key)) map[s.speaker] = 'm';
    else map[s.speaker] = unknownCount++ % 2 === 0 ? primary : other;
  });
  state.speakerGender = map;
}

function genderForSentence(item) {
  const profile = getProfile();
  const dual = document.getElementById('dualVoiceToggle').checked;
  if (!dual || !item.speaker) return profile.gender;
  return state.speakerGender[item.speaker] || profile.gender;
}

/* 使う音声エンジンの判定 */
function resolveEngine() {
  if (state.aiDisabledForSession) return 'browser';
  const e = settings.ttsEngine;
  if (e === 'browser') return 'browser';
  if (e === 'openai') return settings.openaiKey ? 'openai' : 'browser';
  if (e === 'elevenlabs') return settings.elevenKey ? 'elevenlabs' : 'browser';
  if (settings.openaiKey) return 'openai';
  if (settings.elevenKey) return 'elevenlabs';
  return 'browser';
}

function elevenVoiceFor(profile, gender) {
  const ov = (settings.elevenOverrides || {})[profile.id] || {};
  const other = gender === 'f' ? 'm' : 'f';
  return ov[gender] || profile.eleven[gender] || ov[other] || profile.eleven[other] || '';
}

function updateEngineBadge() {
  const badge = document.getElementById('voiceEngineBadge');
  const note = document.getElementById('voiceProfileNote');
  const profile = getProfile();
  const engine = resolveEngine();
  let effective = engine;
  if (engine === 'elevenlabs' && !elevenVoiceFor(profile, profile.gender)) {
    effective = settings.openaiKey ? 'openai' : 'elevenlabs-fallback';
  }
  state.activeEngine = engine;

  const map = {
    openai: ['🎙 AI音声 (OpenAI)', 'bg-violet-100 text-violet-700'],
    elevenlabs: ['🎙 AI音声 (ElevenLabs)', 'bg-violet-100 text-violet-700'],
    'elevenlabs-fallback': ['🎙 AI音声 (ElevenLabs)', 'bg-violet-100 text-violet-700'],
    browser: ['標準ブラウザ音声', 'bg-slate-100 text-slate-500'],
  };
  const [text, cls] = map[effective];
  badge.textContent = text;
  document.getElementById('summaryVoice').textContent = `${profile.label.replace(/（.*$/, '')} ・ ${effective === 'browser' ? '標準音声' : 'AI音声'}`;
  badge.className = `text-[11px] font-semibold px-2 py-0.5 rounded-md ${cls}`;

  let msg = '';
  if (effective === 'browser') {
    const fv = pickBrowserVoice(profile, 'f');
    const mv = pickBrowserVoice(profile, 'm');
    const nm = (p) => (p.voice ? voiceLabel(p.voice) : '端末の標準');
    msg = `端末の声 ─ 女性: ${nm(fv)} ／ 男性: ${nm(mv)}${mv.substituted ? '※同じ国の自然な男性の声がないため代用' : ''}。`;
    if (mv.voice && !isHighQuality(mv.voice) && isIOS()) msg += ' iPhoneはWebアプリで使える声が限られるため、より自然な声はAI音声（設定でキー登録）がおすすめ。';
    if (profile.regional) {
      msg += ' 標準音声では訛りは「雰囲気」程度です。本格的な訛りは設定でAI音声のキーを登録してください。';
    } else if (!state.aiDisabledForSession && !settings.openaiKey && !settings.elevenKey) {
      msg += ' 設定でAPIキーを登録すると、人に近い自然なAI音声になります。';
    }
    if (state.aiDisabledForSession) msg += ' （AI音声に接続できなかったため、一時的に標準音声で再生中）';
  } else if (effective === 'elevenlabs-fallback') {
    msg = 'ElevenLabsにはこの訛りの既定ボイスがないため、アメリカ英語の声で読みます。設定でボイスIDを指定できます。';
  } else {
    msg = profile.regional
      ? 'AIに訛りを指示して読ませます。かなり近づきますが、本物の話者と完全に同じにはなりません。'
      : 'AI音声で読み上げます。作った音声は端末に保存され、2回目からは無料・オフラインで再生できます。';
  }
  note.textContent = msg;
}

/* =========================================================
 * 10. 再生（AI音声 / 標準音声 共通）
 * ========================================================= */
function setPlaybackRate(newRate, syncSlider = true) {
  const clamped = Math.min(2.0, Math.max(0.5, Number(Number(newRate).toFixed(2))));
  state.rate = clamped;
  prefs.rate = clamped;
  savePrefs();
  if (syncSlider) document.getElementById('speedSlider').value = clamped;
  document.getElementById('speedValueDisplay').textContent = `${clamped.toFixed(2)}x`;
  document.getElementById('summarySpeed').textContent = `${clamped.toFixed(2)}x`;
  updateEstimatedRateWpm();
  document.querySelectorAll('.rate-preset').forEach((btn) => {
    btn.classList.toggle('rate-preset-active', Math.abs(parseFloat(btn.textContent) - clamped) < 0.01);
  });

  // AI音声は再生中の音声にそのまま反映（音程は保ったまま）
  applyAiRate();

  if (state.isPlaying && !state.isPaused) {
    setStatus(playingStatusText());
    if (state.lastEngineUsed === 'browser') {
      clearTimeout(state.rateDebounce);
      state.rateDebounce = setTimeout(() => restartIfPlaying(), 250);
    }
  }
}

function updateEstimatedRateWpm() {
  document.getElementById('estimatedWpmBadge').textContent = `目安: 約${Math.round(160 * state.rate)} WPM`;
}

function setStatus(text) {
  document.getElementById('playbackStatusText').textContent = text;
}

function togglePlayPause() {
  unlockAudio();
  if (state.isPlaying && !state.isPaused) {
    state.isPaused = true;
    meterPause();
    if (state.lastEngineUsed === 'browser') window.speechSynthesis && window.speechSynthesis.pause();
    else ttsAudio.pause();
    updatePlayButtonUI('paused');
    setStatus('一時停止中');
    releaseWakeLock();
  } else if (state.isPlaying && state.isPaused) {
    state.isPaused = false;
    meterResume();
    updatePlayButtonUI('playing');
    setStatus(playingStatusText());
    requestWakeLock();
    if (state.lastEngineUsed === 'browser') {
      const ss = window.speechSynthesis;
      if (ss && ss.paused && ss.speaking) ss.resume();
      else speakSentenceAtIndex(Math.max(0, state.currentSentenceIndex));
    } else if (ttsAudio.src && !ttsAudio.ended) {
      applyAiRate();
      ttsAudio.play().catch(() => speakSentenceAtIndex(Math.max(0, state.currentSentenceIndex)));
    } else {
      speakSentenceAtIndex(Math.max(0, state.currentSentenceIndex));
    }
  } else {
    playFromSentence(state.currentSentenceIndex >= 0 ? state.currentSentenceIndex : 0);
  }
}

function playFromSentence(index) {
  if (state.sentences.length === 0) return;
  const safeIdx = Math.max(0, Math.min(index, state.sentences.length - 1));
  haltAudio();
  state.isPlaying = true;
  state.isPaused = false;
  state.silentRetries = 0;
  meterReset();
  maybeShowMuteHint();
  updatePlayButtonUI('playing');
  requestWakeLock();
  speakSentenceAtIndex(safeIdx);
}

function restartIfPlaying() {
  if (state.isPlaying && !state.isPaused) playFromSentence(Math.max(0, state.currentSentenceIndex));
}

function haltAudio() {
  state.playToken++;
  clearTimeout(state.speechWatchdog);
  if ('speechSynthesis' in window) {
    const ss = window.speechSynthesis;
    if (ss.speaking || ss.pending || ss.paused) {
      ss.cancel();
      state.justCanceled = Date.now();
    }
  }
  ttsAudio.onended = null;
  ttsAudio.pause();
}

function speakSentenceAtIndex(idx) {
  if (!state.isPlaying) return;
  if (idx >= state.sentences.length) {
    if (state.isLooping) return speakSentenceAtIndex(0);
    return stopSpeech(true);
  }
  haltAudio();
  const token = state.playToken;
  state.currentSentenceIndex = idx;
  highlightActiveSentence(idx);
  updatePlaybackProgress();
  setStatus(playingStatusText());

  const engine = resolveEngine();
  if (engine === 'browser') speakBrowser(idx, token);
  else speakAI(idx, token, engine);
}

function goNextAfter(idx, token) {
  if (token !== state.playToken || !state.isPlaying || state.isPaused) return;
  const item = state.sentences[idx];
  if (item) state.meter.words += countWords(item.text);
  speakSentenceAtIndex(idx + 1);
}

/* 実測WPM：再生開始からの「読んだ単語数 ÷ 経過時間（文の間の待ち時間も含む）」 */
state.meter = { t0: 0, words: 0, pausedAt: 0, pausedMs: 0 };
function meterReset() {
  state.meter = { t0: performance.now(), words: 0, pausedAt: 0, pausedMs: 0 };
}
function meterPause() {
  if (!state.meter.pausedAt) state.meter.pausedAt = performance.now();
}
function meterResume() {
  if (state.meter.pausedAt) state.meter.pausedMs += performance.now() - state.meter.pausedAt;
  state.meter.pausedAt = 0;
}
function measuredWpm() {
  const m = state.meter;
  const ms = performance.now() - m.t0 - m.pausedMs;
  if (m.words < 12 || ms < 4000) return 0;
  return Math.round(m.words / (ms / 60000));
}
function playingStatusText() {
  const w = measuredWpm();
  return `再生中 (${state.rate.toFixed(2)}x)` + (w ? ` ・実測 約${w} WPM` : '');
}

/* --- 標準ブラウザ音声 --- */
function speakBrowser(idx, token) {
  state.lastEngineUsed = 'browser';
  if (!('speechSynthesis' in window)) {
    showToast('このブラウザは音声読み上げに対応していません。');
    return stopSpeech(false);
  }
  const item = state.sentences[idx];
  const profile = getProfile();
  const gender = genderForSentence(item);
  const { voice, genderMatched } = pickBrowserVoice(profile, gender);

  const u = new SpeechSynthesisUtterance(item.text);
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = profile.browser.langs[0];
  }
  u.rate = Math.min(2, Math.max(0.5, state.rate * (profile.browser.rate || 1)));
  let pitch = profile.browser.pitch || 1;
  if (!genderMatched) pitch *= gender === 'm' ? 0.84 : 1.12;
  u.pitch = Math.min(2, Math.max(0.5, pitch));

  // 無音検知：声が端末に無い・ネット経由で届かない等で「鳴らずに一瞬で終わる」場合は別の声で再挑戦
  const expectedMs = (countWords(item.text) / (2.6 * u.rate)) * 1000;
  let startedAt = 0;
  let gotStart = false;
  const usedVoice = voice ? voice.voiceURI : '';
  const retrySilent = (reason) => {
    if (token !== state.playToken) return;
    clearTimeout(state.speechWatchdog);
    if (usedVoice) {
      badVoices.add(usedVoice);
      updateEngineBadge();
      renderManualVoiceSelect();
    }
    state.silentRetries = (state.silentRetries || 0) + 1;
    if (state.silentRetries <= 4) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      speakBrowser(idx, token);
    } else {
      stopSpeech(false);
      reportNoSound(reason);
    }
  };
  u.onstart = () => {
    gotStart = true;
    startedAt = performance.now();
  };
  u.onend = () => {
    if (token !== state.playToken) return;
    clearTimeout(state.speechWatchdog);
    const elapsed = startedAt ? performance.now() - startedAt : 0;
    if (expectedMs > 900 && (!gotStart || elapsed < Math.max(200, expectedMs * 0.15))) return retrySilent('fast-end');
    state.silentRetries = 0;
    goNextAfter(idx, token);
  };
  u.onerror = (e) => {
    if (token !== state.playToken) return;
    if (e.error === 'interrupted' || e.error === 'canceled') return;
    if (e.error === 'not-allowed') {
      stopSpeech(false);
      return showToast('▶ ボタンをもう一度タップしてください（端末が自動再生を止めました）', 4000);
    }
    retrySilent(e.error || 'error');
  };
  state.currentUtterance = u; // Chromeで再生途中に消える不具合の対策
  state.speechWatchdog = setTimeout(() => {
    if (token !== state.playToken || state.isPaused) return;
    if (!gotStart) retrySilent('no-start');
  }, 4000);

  const ss = window.speechSynthesis;
  if (ss.paused) ss.resume();
  // iOS/Chromeは cancel() 直後の speak() を無視することがあるので少し待つ
  if (state.justCanceled && Date.now() - state.justCanceled < 150 && audioUnlocked) {
    setTimeout(() => token === state.playToken && ss.speak(u), 120);
  } else {
    ss.speak(u);
  }
  audioUnlocked = true;
}

function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function maybeShowMuteHint() {
  if (!isIOS() || resolveEngine() !== 'browser') return;
  if (localStorage.getItem('shadotore.muteHintShown')) return;
  localStorage.setItem('shadotore.muteHintShown', '1');
  showToast('音が出ないときは、マナーモード（消音）をオフにして音量を上げてください。', 6000);
}

/* 設定画面の「音声テスト」：今の設定で1文鳴らし、端末の音声の状態を表示 */
function runVoiceTest() {
  unlockAudio();
  const el = document.getElementById('voiceDiag');
  const profile = getProfile();
  const engine = resolveEngine();
  const en = state.voices.filter((v) => normLang(v.lang).startsWith('en'));
  const pick = pickBrowserVoice(profile, profile.gender);
  const lines = [
    `音声エンジン: ${engine === 'browser' ? '標準ブラウザ音声' : engine}`,
    `端末の声: 全${state.voices.length}件／英語${en.length}件（端末内 ${en.filter((v) => v.localService !== false).length}件）`,
    `使う声: 女性 ${pickBrowserVoice(profile, 'f').voice ? voiceLabel(pickBrowserVoice(profile, 'f').voice) : '端末の既定'} ／ 男性 ${pickBrowserVoice(profile, 'm').voice ? voiceLabel(pickBrowserVoice(profile, 'm').voice) : '端末の既定'}`,
    `高音質(★)の英語の声: ${en.filter(isHighQuality).map((v) => v.name).join(', ') || 'なし'}`,
    `鳴らなかった声: ${badVoices.size}件`,
    `AI音声の速さ補正: ×${(state.aiSpeedFactor || 1).toFixed(2)}（無音カット: ${state.aiTrimOk === null ? '未使用' : state.aiTrimOk ? '有効' : '失敗'}）`,
    `iOS消音対策: ${navigator.audioSession ? '有効' : '非対応のOS'}`,
  ];
  el.textContent = lines.join('\n');
  el.classList.remove('hidden');
  const backup = state.sentences;
  state.sentences = [{ id: 't', lineIdx: 0, speaker: '', text: 'This is a sound test. Can you hear me clearly?', highlights: [], partTitle: '' }];
  state.isPlaying = true;
  state.isPaused = false;
  state.silentRetries = 0;
  haltAudio();
  const token = state.playToken;
  const restore = () => {
    state.testRestore = null;
    state.sentences = backup;
    state.isPlaying = false;
    state.currentSentenceIndex = -1;
    updatePlayButtonUI('stopped');
  };
  state.testRestore = restore;
  if (engine === 'browser') speakBrowser(0, token);
  else speakAI(0, token, engine);
  setTimeout(() => {
    if (state.testRestore === restore) stopSpeech(true);
  }, 8000);
}

function reportNoSound() {
  const ios = isIOS();
  const enCount = state.voices.filter((v) => normLang(v.lang).startsWith('en')).length;
  let msg;
  if (ios) msg = '音が出ません。マナーモード（消音）をオフにして音量を上げてから、もう一度▶を押してください。';
  else if (enCount === 0) msg = 'この端末に英語の読み上げ音声がありません。端末の設定「テキスト読み上げ」で英語の音声を追加してください。';
  else msg = '端末の読み上げ音声が鳴りませんでした。音量と、端末の設定「テキスト読み上げ」のエンジンを確認してください。';
  showToast(msg, 7000);
}

/* --- AI音声（OpenAI / ElevenLabs） --- */
function buildTtsRequest(item, engine) {
  const profile = getProfile();
  const gender = genderForSentence(item);
  if (engine === 'elevenlabs') {
    const voiceId = elevenVoiceFor(profile, gender);
    if (!voiceId && settings.openaiKey) return buildTtsRequest(item, 'openai');
    const vid = voiceId || elevenVoiceFor(VOICE_PROFILES[0], gender);
    const model = settings.elevenModel || DEFAULT_SETTINGS.elevenModel;
    return { engine, voice: vid, model, text: item.text, key: `el|${model}|${vid}|${item.text}` };
  }
  const voice = profile.openai[gender] || profile.openai.f;
  const model = settings.openaiTtsModel || DEFAULT_SETTINGS.openaiTtsModel;
  const instructions = [
    `Voice: ${profile.persona[gender]}`,
    ACCENT_GUIDE[profile.accent],
    'Delivery: natural, human, conversational, like a real online business meeting. Natural intonation and connected speech (linking, reductions) as a real speaker would use.',
    'Pace: a fluent native speaker at normal conversational speed, about 170 words per minute. Keep it moving; no slow or careful reading, no long pauses, and no silence before or after the sentence.',
    'Read the text exactly as written. Do not add, skip or change any words.',
  ].join('\n');
  return { engine: 'openai', voice, model, instructions, text: item.text, key: `oa|${model}|${voice}|${profile.accent}|${gender}|${item.text}` };
}

async function fetchTtsBlob(req) {
  if (ttsMemCache.has(req.key)) return ttsMemCache.get(req.key);
  if (ttsInflight.has(req.key)) return ttsInflight.get(req.key);
  const p = (async () => {
    const cached = await ttsDB.get(req.key);
    if (cached && cached.blob) {
      ttsMemCache.set(req.key, cached.blob);
      return cached.blob;
    }
    let res;
    if (req.engine === 'elevenlabs') {
      res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(req.voice)}?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: { 'xi-api-key': settings.elevenKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text: req.text, model_id: req.model }),
      });
    } else {
      const body = { model: req.model, voice: req.voice, input: req.text, response_format: 'mp3' };
      if (/gpt-4o/.test(req.model)) body.instructions = req.instructions;
      res = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: { Authorization: `Bearer ${settings.openaiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }
    if (!res.ok) {
      let detail = '';
      try {
        const j = await res.json();
        detail = (j.error && (j.error.message || j.error)) || (j.detail && (j.detail.message || j.detail)) || '';
      } catch (e) {}
      throw new Error(`${res.status} ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`.trim());
    }
    const blob = await res.blob();
    ttsMemCache.set(req.key, blob);
    ttsDB.set(req.key, { blob, t: Date.now() });
    return blob;
  })();
  ttsInflight.set(req.key, p);
  try {
    return await p;
  } finally {
    ttsInflight.delete(req.key);
  }
}

async function speakAI(idx, token, engine) {
  state.lastEngineUsed = 'ai';
  const item = state.sentences[idx];
  const req = buildTtsRequest(item, engine);
  const needsFetch = !ttsMemCache.has(req.key);
  if (needsFetch) updatePlayButtonUI('loading');
  let blob;
  try {
    blob = await fetchTtsBlob(req);
  } catch (err) {
    if (token !== state.playToken) return;
    const name = req.engine === 'elevenlabs' ? 'ElevenLabs' : 'OpenAI';
    const offline = !navigator.onLine;
    showToast(offline ? 'オフラインのためAI音声を作れません。標準音声で再生します。' : `${name}に接続できませんでした（${shortErr(err)}）。標準音声で再生します。`, 4500);
    state.aiDisabledForSession = true;
    updateEngineBadge();
    updatePlayButtonUI('playing');
    return speakBrowser(idx, token);
  }
  if (token !== state.playToken) return;
  updatePlayButtonUI(state.isPaused ? 'paused' : 'playing');

  const proc = await processTtsAudio(req.key, blob, item.text);
  if (token !== state.playToken) return;
  ttsAudio.src = proc.url;
  applyAiRate();
  ttsAudio.preservesPitch = true;
  ttsAudio.webkitPreservesPitch = true;
  ttsAudio.onended = () => goNextAfter(idx, token);
  if (state.isPaused) return;
  try {
    await ttsAudio.play();
    applyAiRate();
  } catch (e) {
    if (token !== state.playToken) return;
    state.isPaused = true;
    updatePlayButtonUI('paused');
    setStatus('▶ をタップして再生');
    return;
  }
  // 次の3文を先に作って加工しておく（文の間の待ち時間をなくす）
  prefetchAhead(idx, engine, 3);
}

function prefetchAhead(idx, engine, n) {
  let chain = Promise.resolve();
  for (let k = 1; k <= n; k++) {
    const next = state.sentences[idx + k];
    if (!next) break;
    const r = buildTtsRequest(next, engine);
    if (processedCache.has(r.key)) continue;
    chain = chain.then(() => fetchTtsBlob(r).then((b) => processTtsAudio(r.key, b, next.text))).catch(() => {});
  }
}

/* ---- AI音声の後処理 ----
 * 1) 音声の前後に入っている無音を削る（文と文の間が間延びする一番の原因）
 * 2) 実際の話す速さを測り、×1.0 でネイティブの普通の速さ（約165 WPM）になるよう基準速度を補正 */
const AI_TARGET_WPM = 200; // 実機で「×1.25がネイティブ並み」との評価を受けて165→200に変更
const processedCache = new Map();
let audioCtx = null;
state.aiSpeedFactor = prefs.aiSpeedFactor2 || 1.4;
state.aiTrimOk = null;

function aiPlaybackRate() {
  return Math.min(3, Math.max(0.5, state.rate * (state.aiSpeedFactor || 1)));
}
function applyAiRate() {
  const r = aiPlaybackRate();
  ttsAudio.defaultPlaybackRate = r;
  ttsAudio.playbackRate = r;
}

async function processTtsAudio(key, blob, text) {
  if (processedCache.has(key)) return processedCache.get(key);
  let result;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = await new Promise((resolve, reject) => {
      blob.arrayBuffer().then((ab) => {
        const p = audioCtx.decodeAudioData(ab, resolve, reject);
        if (p && p.then) p.then(resolve, reject);
      }, reject);
    });
    const { start, end } = findSpeechBounds(buf);
    const dur = (end - start) / buf.sampleRate;
    const words = countWords(text);
    if (words >= 5 && dur > 0.5) {
      const clipWpm = words / (dur / 60);
      const f = Math.min(1.9, Math.max(1.0, AI_TARGET_WPM / clipWpm));
      state.aiSpeedFactor = state.aiSpeedFactor * 0.7 + f * 0.3; // 文ごとの速さのブレを平均化
      prefs.aiSpeedFactor2 = Math.round(state.aiSpeedFactor * 1000) / 1000;
      savePrefs();
    }
    result = { url: URL.createObjectURL(encodeWav(buf, start, end)), trimmed: true };
    state.aiTrimOk = true;
  } catch (e) {
    result = { url: URL.createObjectURL(blob), trimmed: false };
    state.aiTrimOk = false;
  }
  processedCache.set(key, result);
  return result;
}

function findSpeechBounds(buf) {
  const ch = buf.getChannelData(0);
  const sr = buf.sampleRate;
  const win = Math.round(sr * 0.01);
  let peak = 0;
  for (let i = 0; i < ch.length; i += 4) peak = Math.max(peak, Math.abs(ch[i]));
  const th = Math.max(0.006, peak * 0.04);
  const loud = (i) => {
    let m = 0;
    for (let j = i; j < Math.min(ch.length, i + win); j++) m = Math.max(m, Math.abs(ch[j]));
    return m > th;
  };
  let start = 0;
  while (start < ch.length && !loud(start)) start += win;
  let end = ch.length - win;
  while (end > start && !loud(end)) end -= win;
  const pad = Math.round(sr * 0.04); // 語頭・語尾が切れないよう少し残す
  start = Math.max(0, start - pad);
  end = Math.min(ch.length, end + win + Math.round(sr * 0.06));
  if (end - start < sr * 0.2) return { start: 0, end: ch.length };
  return { start, end };
}

function encodeWav(buf, start, end) {
  const sr = buf.sampleRate;
  const n = end - start;
  const ch = buf.getChannelData(0);
  const out = new ArrayBuffer(44 + n * 2);
  const v = new DataView(out);
  const w = (o, str) => [...str].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const x = Math.max(-1, Math.min(1, ch[start + i]));
    v.setInt16(44 + i * 2, x < 0 ? x * 0x8000 : x * 0x7fff, true);
  }
  return new Blob([out], { type: 'audio/wav' });
}

function shortErr(err) {
  const m = String((err && err.message) || err || '');
  if (/401|invalid.*key|Incorrect API key/i.test(m)) return 'APIキーが正しくありません';
  if (/429|quota|rate/i.test(m)) return '利用上限・残高不足';
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return '通信できません。中国本土ではVPNが必要です';
  return m.slice(0, 80);
}

/* iOS: 最初のタップで音声再生を許可させる */
let audioUnlocked = false;
let htmlAudioUnlocked = false;
const badVoices = new Set();
function unlockAudio() {
  // iOS 17以降：消音スイッチがオンでもアプリの音を鳴らす設定
  try {
    if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback';
  } catch (e) {}
  // 標準音声で再生するときはHTML音声を鳴らさない（iOSで読み上げが無音になる原因になる）
  if (htmlAudioUnlocked || resolveEngine() === 'browser') return;
  htmlAudioUnlocked = true;
  try {
    ttsAudio.src = silentWavUrl();
    const p = ttsAudio.play();
    if (p && p.then) p.then(() => ttsAudio.pause()).catch(() => {});
  } catch (e) {}
}
function silentWavUrl() {
  const buf = new ArrayBuffer(46);
  const v = new DataView(buf);
  const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 38, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, 2, true); v.setInt16(44, 0, true);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}

function stopSpeech(resetIndex = true) {
  haltAudio();
  if (state.testRestore) state.testRestore();
  state.isPlaying = false;
  state.isPaused = false;
  if (resetIndex) state.currentSentenceIndex = -1;
  updatePlayButtonUI('stopped');
  highlightActiveSentence(state.currentSentenceIndex);
  updatePlaybackProgress();
  setStatus('待機中（文をタップして個別再生もできます）');
  releaseWakeLock();
}

function prevSentence() {
  if (state.sentences.length === 0) return;
  const target = Math.max(0, state.currentSentenceIndex <= 0 ? 0 : state.currentSentenceIndex - 1);
  if (state.isPlaying) playFromSentence(target);
  else moveCursor(target);
}

function nextSentence() {
  if (state.sentences.length === 0) return;
  const target = Math.min(state.sentences.length - 1, state.currentSentenceIndex + 1);
  if (state.isPlaying) playFromSentence(target);
  else moveCursor(target);
}

function moveCursor(target) {
  state.currentSentenceIndex = target;
  highlightActiveSentence(target);
  updatePlaybackProgress();
}

function toggleLoop() {
  state.isLooping = !state.isLooping;
  prefs.isLooping = state.isLooping;
  savePrefs();
  renderLoopButton();
  showToast(state.isLooping ? 'リピート再生: ON' : 'リピート再生: OFF');
}
function renderLoopButton() {
  document.getElementById('loopToggleBtn').classList.toggle('ctrl-btn-on', state.isLooping);
}

function updatePlayButtonUI(mode) {
  const play = document.getElementById('playIcon');
  const pause = document.getElementById('pauseIcon');
  const loading = document.getElementById('loadingIcon');
  play.classList.toggle('hidden', mode === 'playing' || mode === 'loading');
  pause.classList.toggle('hidden', mode !== 'playing');
  loading.classList.toggle('hidden', mode !== 'loading');
  if (mode === 'loading') setStatus('AI音声を作成中…');
}

function highlightActiveSentence(idx) {
  document.querySelectorAll('.sentence-active').forEach((el) => el.classList.remove('sentence-active'));
  if (idx >= 0) {
    const el = document.getElementById(`sentence-${idx}`);
    if (el) {
      el.classList.add('sentence-active');
      const r = el.getBoundingClientRect();
      const area = document.getElementById('scrollArea').getBoundingClientRect();
      if (r.top < area.top + 8 || r.bottom > area.bottom - 8) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}

function updatePlaybackProgress() {
  const total = state.sentences.length;
  const current = state.currentSentenceIndex >= 0 ? state.currentSentenceIndex + 1 : 0;
  document.getElementById('sentenceCounterText').textContent = `${current} / ${total} 文`;
  document.getElementById('playbackProgressBar').style.width = `${total > 0 ? Math.round((current / total) * 100) : 0}%`;
}

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator && !state.wakeLock) {
      state.wakeLock = await navigator.wakeLock.request('screen');
      state.wakeLock.addEventListener('release', () => (state.wakeLock = null));
    }
  } catch (e) {}
}
function releaseWakeLock() {
  try {
    if (state.wakeLock) state.wakeLock.release();
  } catch (e) {}
  state.wakeLock = null;
}

/* =========================================================
 * 11. WPM測定（150〜200 WPM ネイティブ基準）
 * ========================================================= */
function toggleWpmTimer() {
  if (state.wpmRunning) stopAndCalculateWpm();
  else startWpmTimer();
}

function setWpmButton(running, text) {
  const btn = document.getElementById('wpmStartStopBtn');
  btn.classList.toggle('bg-rose-500', running);
  btn.classList.toggle('shadow-rose-500/20', running);
  btn.classList.toggle('bg-shadoten-500', !running);
  btn.classList.toggle('hover:bg-shadoten-600', !running);
  btn.classList.toggle('shadow-shadoten-500/20', !running);
  document.getElementById('wpmBtnIcon').textContent = running ? '■' : '▶';
  document.getElementById('wpmBtnText').textContent = text;
}

function startWpmTimer() {
  const words = getTotalWordCount();
  if (words === 0) return showToast('測定する英文がありません。');
  state.wpmRunning = true;
  state.wpmStartTime = performance.now();
  state.wpmElapsedMs = 0;
  setWpmButton(true, '読み終わり・ストップ');
  document.getElementById('wpmLevelLabel').textContent = '計測中… 声に出して読んでください';
  requestWakeLock();
  state.wpmIntervalId = setInterval(() => {
    state.wpmElapsedMs = performance.now() - state.wpmStartTime;
    document.getElementById('wpmTimerDisplay').textContent = formatDuration(state.wpmElapsedMs);
    if (state.wpmElapsedMs >= 1000) {
      document.getElementById('wpmScoreDisplay').textContent = Math.round((words / (state.wpmElapsedMs / 1000)) * 60);
    }
  }, 50);
}

function stopAndCalculateWpm() {
  if (!state.wpmRunning) return;
  clearInterval(state.wpmIntervalId);
  state.wpmRunning = false;
  releaseWakeLock();
  state.wpmElapsedMs = performance.now() - state.wpmStartTime;
  setWpmButton(false, 'もう一度計測する');

  const seconds = Math.max(0.5, state.wpmElapsedMs / 1000);
  const words = getTotalWordCount();
  const finalWpm = Math.round((words / seconds) * 60);
  document.getElementById('wpmTimerDisplay').textContent = formatDuration(state.wpmElapsedMs);
  document.getElementById('wpmScoreDisplay').textContent = finalWpm;

  const resultBox = document.getElementById('wpmResultBox');
  const levelLabel = document.getElementById('wpmLevelLabel');
  let verdict;
  if (finalWpm >= 150 && finalWpm <= 200) {
    resultBox.className = 'bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3.5 text-center transition-colors';
    levelLabel.className = 'text-xs font-extrabold text-emerald-700 mt-1';
    verdict = '🎉 ネイティブ標準スピード達成！';
  } else if (finalWpm > 200) {
    resultBox.className = 'bg-indigo-50 border-2 border-indigo-400 rounded-2xl p-3.5 text-center transition-colors';
    levelLabel.className = 'text-xs font-extrabold text-indigo-700 mt-1';
    verdict = '⚡ ネイティブ早口レベル！(200超)';
  } else if (finalWpm >= 120) {
    resultBox.className = 'bg-amber-50 border border-amber-300 rounded-2xl p-3.5 text-center transition-colors';
    levelLabel.className = 'text-xs font-bold text-amber-700 mt-1';
    verdict = '🔥 あと少し！(目標150〜)';
  } else {
    resultBox.className = 'bg-slate-100 border border-slate-300 rounded-2xl p-3.5 text-center transition-colors';
    levelLabel.className = 'text-xs font-semibold text-slate-600 mt-1';
    verdict = '🐢 じっくりペース (目標150〜200)';
  }
  levelLabel.textContent = verdict;

  const marker = document.getElementById('wpmGaugeMarker');
  marker.style.left = `${Math.min(98, Math.max(2, ((finalWpm - 50) / 200) * 100))}%`;
  marker.classList.remove('hidden');

  addWpmHistory({
    partLabel: document.getElementById('currentPartBadge').textContent,
    wpm: finalWpm,
    seconds: seconds.toFixed(1),
    words,
    isNative: finalWpm >= 150 && finalWpm <= 200,
    at: Date.now(),
  });
}

function resetWpmTimer() {
  if (state.wpmIntervalId) clearInterval(state.wpmIntervalId);
  state.wpmRunning = false;
  state.wpmElapsedMs = 0;
  setWpmButton(false, '計測スタート');
  document.getElementById('wpmTimerDisplay').textContent = '00:00.0';
  document.getElementById('wpmScoreDisplay').textContent = '---';
  document.getElementById('wpmResultBox').className = 'bg-shadoten-50/70 border border-shadoten-200 rounded-2xl p-3.5 text-center transition-colors';
  const lvl = document.getElementById('wpmLevelLabel');
  lvl.className = 'text-[11px] font-semibold text-slate-500 mt-1';
  lvl.textContent = 'ネイティブ基準: 150〜200';
  document.getElementById('wpmGaugeMarker').classList.add('hidden');
}

function formatDuration(ms) {
  const totalTenths = Math.floor(ms / 100);
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}.${tenths}`;
}

function addWpmHistory(entry) {
  state.wpmHistory.unshift(entry);
  if (state.wpmHistory.length > 100) state.wpmHistory.length = 100;
  saveJSON(KEYS.history, state.wpmHistory);
  renderWpmHistory();
}

function loadWpmHistory() {
  let h = loadJSON(KEYS.history, null);
  if (!h) {
    h = loadJSON(KEYS.legacyHistory, []);
    if (h.length) saveJSON(KEYS.history, h);
  }
  state.wpmHistory = Array.isArray(h) ? h : [];
  renderWpmHistory();
}

let clearHistoryArmed = false;
function clearWpmHistory() {
  const btn = document.getElementById('clearHistoryBtn');
  if (!clearHistoryArmed) {
    clearHistoryArmed = true;
    btn.textContent = 'もう一度タップで消去';
    btn.classList.add('text-rose-600', 'font-bold');
    setTimeout(() => {
      clearHistoryArmed = false;
      btn.textContent = '履歴を消去';
      btn.classList.remove('text-rose-600', 'font-bold');
    }, 3000);
    return;
  }
  clearHistoryArmed = false;
  state.wpmHistory = [];
  saveJSON(KEYS.history, []);
  renderWpmHistory();
}

function renderWpmHistory() {
  const container = document.getElementById('wpmHistoryContainer');
  const list = document.getElementById('wpmHistoryList');
  if (state.wpmHistory.length === 0) return container.classList.add('hidden');
  container.classList.remove('hidden');
  list.innerHTML = state.wpmHistory
    .map((h) => {
      const date = h.at ? new Date(h.at) : null;
      const d = date ? `${date.getMonth() + 1}/${date.getDate()}` : '';
      return `<div class="flex items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
        <span class="text-slate-400 w-9 shrink-0">${d}</span>
        <span class="text-slate-600 truncate flex-1">${escapeHtml(h.partLabel)}</span>
        <span class="text-slate-400 shrink-0">${h.words}w/${h.seconds}s</span>
        <span class="font-bold shrink-0 ${h.isNative ? 'text-emerald-600' : 'text-shadoten-700'}">${h.wpm}${h.isNative ? '★' : ''}</span>
      </div>`;
    })
    .join('');
}

/* =========================================================
 * 12. 教材の追加・編集・削除
 * ========================================================= */
function openAddSheet(material) {
  state.editingMaterialId = material ? material.id : null;
  document.getElementById('addSheetTitle').textContent = material ? '✏️ 教材を編集' : '＋ 教材を追加';
  document.getElementById('materialTitleInput').value = material ? material.title : '';
  document.getElementById('materialTextInput').value = material ? material.raw : '';
  document.getElementById('saveMaterialBtn').textContent = material ? '更新して学習する' : '保存して学習する';
  state.pendingImages = [];
  renderImagePreviews();
  document.getElementById('ocrProgressBox').classList.add('hidden');
  switchAddTab('text');
  updateMaterialWordPreview();
  updateOcrEngineNote();
  openSheet('addSheet');
}
function closeAddSheet() {
  closeSheet('addSheet');
}

function switchAddTab(tab) {
  state.addTab = tab;
  document.getElementById('addTabText').classList.toggle('sub-tab-active', tab === 'text');
  document.getElementById('addTabImage').classList.toggle('sub-tab-active', tab === 'image');
  document.getElementById('addImagePane').classList.toggle('hidden', tab !== 'image');
}

function updateMaterialWordPreview() {
  const raw = document.getElementById('materialTextInput').value;
  const lines = parseRawText(raw);
  const words = lines.reduce((s, l) => s + countWords(l.text), 0);
  const speakers = [...new Set(lines.map((l) => l.speaker).filter(Boolean))];
  document.getElementById('materialWordPreview').textContent =
    `${words} words` + (speakers.length ? ` ／ 話者: ${speakers.slice(0, 4).join(', ')}` : '');
}

function saveMaterial() {
  const titleEl = document.getElementById('materialTitleInput');
  const raw = document.getElementById('materialTextInput').value.trim();
  if (!raw || countWords(raw) === 0) return showToast('英文を入力するか、画像から読み取ってください。');
  let title = titleEl.value.trim();
  if (!title) {
    const d = new Date();
    title = `マイ教材 ${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  let id = state.editingMaterialId;
  if (id) {
    const m = userMaterials.find((x) => x.id === id);
    if (m) Object.assign(m, { title, raw, updatedAt: Date.now() });
  } else {
    id = 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    userMaterials.push({ id, title, raw, createdAt: Date.now(), updatedAt: Date.now() });
  }
  if (!saveJSON(KEYS.materials, userMaterials)) return;
  requestPersistentStorage();
  closeAddSheet();
  selectPart(id);
  showToast(state.editingMaterialId ? '教材を更新しました' : '教材を保存しました');
  document.getElementById('scrollArea').scrollTo({ top: 0, behavior: 'smooth' });
}

function editCurrentMaterial() {
  const m = userMaterials.find((x) => x.id === state.selectedPartId);
  if (m) openAddSheet(m);
}

let deleteArmed = false;
function deleteCurrentMaterial() {
  const btn = document.getElementById('deleteMaterialBtn');
  if (!deleteArmed) {
    deleteArmed = true;
    btn.textContent = 'もう一度タップで削除';
    btn.classList.add('bg-rose-50', 'font-bold');
    setTimeout(() => {
      deleteArmed = false;
      btn.textContent = '🗑 削除';
      btn.classList.remove('bg-rose-50', 'font-bold');
    }, 3000);
    return;
  }
  deleteArmed = false;
  btn.textContent = '🗑 削除';
  btn.classList.remove('bg-rose-50', 'font-bold');
  userMaterials = userMaterials.filter((x) => x.id !== state.selectedPartId);
  saveJSON(KEYS.materials, userMaterials);
  selectPart('part1');
  showToast('教材を削除しました');
}

/* =========================================================
 * 13. 画像から英文を読み取る（OCR）
 * ========================================================= */
function resolveOcrEngine() {
  const e = settings.ocrEngine;
  if (e === 'tesseract') return 'tesseract';
  if (e === 'openai') return settings.openaiKey ? 'openai' : 'tesseract';
  if (e === 'gemini') return settings.geminiKey ? 'gemini' : 'tesseract';
  if (settings.geminiKey) return 'gemini';
  if (settings.openaiKey) return 'openai';
  return 'tesseract';
}

function updateOcrEngineNote() {
  const e = resolveOcrEngine();
  const el = document.getElementById('ocrEngineNote');
  el.textContent =
    e === 'tesseract'
      ? '読み取り方式: 端末内OCR（無料・オフライン可）。時刻やボタン等の余分な文字は自動で除きますが、残ったら手で消してください。設定でOpenAI / Geminiのキーを入れると、本文だけをより正確に抜き出せます。'
      : `読み取り方式: ${e === 'gemini' ? 'Gemini' : 'OpenAI'} のAIビジョン（本文だけを抽出）。画像はAPI提供元に送信されます。`;
}

function onImagesSelected(e) {
  const files = [...(e.target.files || [])].filter((f) => /image\/(png|jpe?g|webp)/i.test(f.type) || /\.(png|jpe?g|webp)$/i.test(f.name));
  e.target.value = '';
  if (files.length === 0) return showToast('PNG / JPG / WebP の画像を選んでください。');
  state.pendingImages = files;
  renderImagePreviews();
  runOcr(files);
}

function renderImagePreviews() {
  const list = document.getElementById('imagePreviewList');
  list.innerHTML = '';
  state.pendingImages.forEach((f, i) => {
    const url = URL.createObjectURL(f);
    const div = document.createElement('div');
    div.className = 'relative shrink-0';
    div.innerHTML = `<img src="${url}" class="w-16 h-24 object-cover rounded-lg border border-slate-200" alt="" /><span class="absolute top-1 left-1 bg-slate-900/70 text-white text-[10px] rounded px-1">${i + 1}</span>`;
    list.appendChild(div);
  });
}

function setOcrProgress(text, pct) {
  document.getElementById('ocrProgressBox').classList.remove('hidden');
  document.getElementById('ocrProgressText').textContent = text;
  document.getElementById('ocrProgressPct').textContent = `${Math.round(pct)}%`;
  document.getElementById('ocrProgressBar').style.width = `${pct}%`;
}

let ocrBusy = false;
async function runOcr(files) {
  if (ocrBusy) return;
  ocrBusy = true;
  const saveBtn = document.getElementById('saveMaterialBtn');
  saveBtn.disabled = true;
  saveBtn.classList.add('opacity-50');
  let engine = resolveOcrEngine();
  const results = [];
  try {
    for (let i = 0; i < files.length; i++) {
      const label = files.length > 1 ? `画像 ${i + 1}/${files.length}` : '画像';
      const base = (i / files.length) * 100;
      const span = 100 / files.length;
      setOcrProgress(`${label}を準備中…`, base);
      let text = '';
      if (engine !== 'tesseract') {
        try {
          setOcrProgress(`${label}をAIで読み取り中…`, base + span * 0.3);
          const img = await prepareImage(files[i], 2048, false);
          text = engine === 'gemini' ? await ocrGemini(img) : await ocrOpenAI(img);
          text = normalizeText(text);
        } catch (err) {
          showToast(`AI読み取りに失敗（${shortErr(err)}）。端末内OCRに切り替えます。`, 4500);
          engine = 'tesseract';
        }
      }
      if (engine === 'tesseract') {
        const img = await prepareImage(files[i], 2400, true);
        const raw = await ocrTesseract(img.canvas, (p, msg) => setOcrProgress(`${label}: ${msg}`, base + span * p));
        text = cleanOcrText(raw);
      }
      if (text) results.push(text);
    }
    setOcrProgress('読み取り完了', 100);
    const joined = results.join('\n');
    if (!joined.trim()) {
      showToast('英文が見つかりませんでした。明るく、文字が大きく写った画像で試してください。', 4000);
    } else {
      const ta = document.getElementById('materialTextInput');
      ta.value = ta.value.trim() ? ta.value.trim() + '\n' + joined : joined;
      updateMaterialWordPreview();
      const titleEl = document.getElementById('materialTitleInput');
      if (!titleEl.value.trim()) titleEl.value = guessTitle(joined);
      showToast('読み取りました。内容を確認して保存してください。');
    }
  } catch (err) {
    console.error(err);
    showToast(`読み取りに失敗しました（${shortErr(err)}）`, 4000);
  } finally {
    ocrBusy = false;
    saveBtn.disabled = false;
    saveBtn.classList.remove('opacity-50');
  }
}

function guessTitle(text) {
  const first = parseRawText(text)[0];
  if (!first) return '';
  return truncate(first.text.replace(/[^\w\s',.?!-]/g, ''), 28);
}

async function prepareImage(file, maxDim, forTesseract) {
  const bitmap = await loadImage(file);
  let w = bitmap.width;
  let h = bitmap.height;
  let scale = Math.min(1, maxDim / Math.max(w, h));
  if (forTesseract && Math.max(w, h) < 1200) scale = Math.min(2, 1600 / Math.max(w, h));
  w = Math.round(w * scale);
  h = Math.round(h * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  if (forTesseract) {
    // 白黒化して文字をくっきりさせる（色付きハイライトの上の文字も拾いやすくする）
    const data = ctx.getImageData(0, 0, w, h);
    const d = data.data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      d[i] = d[i + 1] = d[i + 2] = g;
      sum += g;
    }
    const avg = sum / (d.length / 4);
    if (avg < 110) for (let i = 0; i < d.length; i += 4) d[i] = d[i + 1] = d[i + 2] = 255 - d[i]; // ダークモード画面を反転
    ctx.putImageData(data, 0, 0);
  }
  const dataUrl = forTesseract ? '' : canvas.toDataURL('image/jpeg', 0.9);
  return { canvas, dataUrl, base64: dataUrl.split(',')[1] || '', mime: 'image/jpeg' };
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('画像を開けませんでした'));
    img.src = url;
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.dataset.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('OCRエンジンを読み込めませんでした'));
    document.head.appendChild(s);
  });
}

let tesseractWorkerPromise = null;
let tesseractProgressCb = null;
async function getTesseractWorker() {
  if (tesseractWorkerPromise) return tesseractWorkerPromise;
  tesseractWorkerPromise = (async () => {
    await loadScript('vendor/tesseract/tesseract.min.js');
    const abs = (p) => new URL(p, location.href).href;
    const worker = await Tesseract.createWorker('eng', 1, {
      workerPath: abs('vendor/tesseract/worker.min.js'),
      corePath: abs('vendor/tesseract/core'),
      langPath: abs('vendor/tesseract/lang'),
      logger: (m) => tesseractProgressCb && tesseractProgressCb(m),
    });
    return worker;
  })();
  tesseractWorkerPromise.catch(() => (tesseractWorkerPromise = null));
  return tesseractWorkerPromise;
}

async function ocrTesseract(canvas, onProgress) {
  const labels = {
    'loading tesseract core': 'OCRエンジン準備中（初回のみ数秒）',
    'initializing tesseract': 'OCRエンジン準備中',
    'loading language traineddata': '英語データ読込中（初回のみ）',
    'initializing api': 'OCRエンジン準備中',
    'recognizing text': '文字を認識中',
  };
  tesseractProgressCb = (m) => {
    const isRec = m.status === 'recognizing text';
    const p = isRec ? 0.2 + 0.8 * (m.progress || 0) : 0.2 * (m.progress || 0);
    onProgress(p, labels[m.status] || '処理中');
  };
  const worker = await getTesseractWorker();
  const { data } = await worker.recognize(canvas);
  tesseractProgressCb = null;
  // 自信度の低い行（日本語訳を英字として誤認識した行など）を除く
  if (Array.isArray(data.lines) && data.lines.length) {
    return data.lines
      .filter((l) => (l.confidence || 0) >= 50)
      .map((l) => l.text.trim())
      .join('\n');
  }
  return data.text || '';
}

const AI_OCR_PROMPT = `You are an OCR engine for English listening/shadowing study material.
Extract ONLY the English body text (dialogue or passage) from this image.
Exclude: phone status bar (time, battery, signal, carrier), app UI (buttons, tabs, menus, icons, page numbers, progress bars, headers like "Script"), Japanese/Chinese or other non-English translations and notes, phonetic annotations, and anything that is not part of the English script.
Keep speaker labels at the start of a line exactly as "Name: text" (e.g. "Maya:", "S:").
Put each speaker turn on its own line. Join lines that were broken only by layout into full sentences.
Fix obvious OCR mistakes only; never paraphrase or summarize.
Output plain text only, with no commentary or markdown. If there is no English body text, output nothing.`;

async function ocrOpenAI(img) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${settings.openaiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: settings.openaiVisionModel || DEFAULT_SETTINGS.openaiVisionModel,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: AI_OCR_PROMPT },
            { type: 'image_url', image_url: { url: img.dataUrl, detail: 'high' } },
          ],
        },
      ],
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${(j.error && j.error.message) || ''}`);
  return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
}

async function ocrGemini(img) {
  const model = settings.geminiModel || DEFAULT_SETTINGS.geminiModel;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': settings.geminiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: AI_OCR_PROMPT }, { inline_data: { mime_type: img.mime, data: img.base64 } }] }],
      generationConfig: { temperature: 0 },
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${(j.error && j.error.message) || ''}`);
  const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
  return parts.map((p) => p.text || '').join('');
}

function normalizeText(t) {
  return String(t || '')
    .replace(/```[a-z]*\n?|```/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/ /g, ' ')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

/* 端末内OCRの結果から、時刻・電池・ボタン等の不要な行を取り除いて文章をつなげる */
const UI_WORDS = /^(back|next|share|edit|done|cancel|ok|close|menu|search|home|settings|play|pause|stop|repeat|script|translation|transcript|lesson|step|level|save|more|less|show|hide|skip|start|finish|record|retry|speed|[0-9.]+x)$/i;

function cleanOcrText(raw) {
  const lines = normalizeText(raw).split('\n');
  const kept = [];
  for (let line of lines) {
    line = line.replace(/^[|>»•·*\-–—_=~]+\s*/, '').replace(/\s*[|<«]+$/, '').trim();
    if (!line) continue;
    const letters = (line.match(/[A-Za-z]/g) || []).length;
    const cjk = (line.match(/[぀-ヿ㐀-鿿가-힯]/g) || []).length;
    if (cjk > 0 && cjk >= letters * 0.3) continue; // 日本語訳などを除外
    if (letters < 3) continue;
    if (letters / line.replace(/\s/g, '').length < 0.55) continue; // 記号・数字ばかりの行
    if (/^\d{1,2}[:.]\d{2}\b/.test(line) && line.length < 25) continue; // 時刻
    if (/\b\d{1,3}\s?%/.test(line) && line.length < 20) continue; // 電池
    if (/\b(LTE|5G|4G|Wi-?Fi)\b/i.test(line) && line.length < 25) continue;
    const words = line.split(/\s+/);
    if (words.length === 1 && !/[.!?]$/.test(line)) continue; // ボタン等の単語1つだけの行
    if (words.length <= 2 && words.every((w) => UI_WORDS.test(w.replace(/[^\w.]/g, '')))) continue;
    kept.push(line);
  }

  const hasSpeakers = kept.some((l) => SPEAKER_RE.test(l) && l.split(':')[0].length <= 16);
  const out = [];
  kept.forEach((line) => {
    const isSpeaker = hasSpeakers && SPEAKER_RE.test(line);
    const prev = out[out.length - 1];
    if (!prev || isSpeaker) return out.push(line);
    if (/-$/.test(prev) && /^[a-z]/.test(line)) {
      out[out.length - 1] = prev.slice(0, -1) + line;
    } else if (hasSpeakers || !/[.!?]["']?$/.test(prev)) {
      out[out.length - 1] = prev + ' ' + line;
    } else {
      out.push(line);
    }
  });
  return out.join('\n');
}

/* =========================================================
 * 14. 設定
 * ========================================================= */
function openSettings() {
  document.getElementById('ttsEngineSelect').value = settings.ttsEngine;
  document.getElementById('ocrEngineSelect').value = settings.ocrEngine;
  document.getElementById('openaiKeyInput').value = settings.openaiKey;
  document.getElementById('openaiTtsModelInput').value = settings.openaiTtsModel;
  document.getElementById('openaiVisionModelInput').value = settings.openaiVisionModel;
  document.getElementById('geminiKeyInput').value = settings.geminiKey;
  document.getElementById('geminiModelInput').value = settings.geminiModel;
  document.getElementById('elevenKeyInput').value = settings.elevenKey;
  document.getElementById('elevenModelInput').value = settings.elevenModel;

  const ov = settings.elevenOverrides || {};
  document.getElementById('elevenVoiceOverrides').innerHTML = VOICE_PROFILES.map((p) => {
    const o = ov[p.id] || {};
    const short = p.label.replace(/（.*$/, '');
    return `<div><div class="font-semibold text-slate-700 mb-0.5">${escapeHtml(short)}</div>
      <div class="grid grid-cols-2 gap-1.5">
        <input data-ov="${p.id}" data-g="f" value="${escapeHtml(o.f || '')}" placeholder="女性 ${escapeHtml(p.eleven.f ? '(既定あり)' : '')}" class="field text-xs py-2" />
        <input data-ov="${p.id}" data-g="m" value="${escapeHtml(o.m || '')}" placeholder="男性 ${escapeHtml(p.eleven.m ? '(既定あり)' : '')}" class="field text-xs py-2" />
      </div></div>`;
  }).join('');
  showStorageInfo();
  openSheet('settingsSheet');
}

function closeSettings() {
  closeSheet('settingsSheet');
}

function saveSettings() {
  const v = (id) => document.getElementById(id).value.trim();
  const overrides = {};
  document.querySelectorAll('[data-ov]').forEach((el) => {
    const val = el.value.trim();
    if (!val) return;
    overrides[el.dataset.ov] = overrides[el.dataset.ov] || {};
    overrides[el.dataset.ov][el.dataset.g] = val;
  });
  settings = {
    ...settings,
    ttsEngine: v('ttsEngineSelect'),
    ocrEngine: v('ocrEngineSelect'),
    openaiKey: v('openaiKeyInput'),
    openaiTtsModel: v('openaiTtsModelInput') || DEFAULT_SETTINGS.openaiTtsModel,
    openaiVisionModel: v('openaiVisionModelInput') || DEFAULT_SETTINGS.openaiVisionModel,
    geminiKey: v('geminiKeyInput'),
    geminiModel: v('geminiModelInput') || DEFAULT_SETTINGS.geminiModel,
    elevenKey: v('elevenKeyInput'),
    elevenModel: v('elevenModelInput') || DEFAULT_SETTINGS.elevenModel,
    elevenOverrides: overrides,
  };
  saveJSON(KEYS.settings, settings);
  state.aiDisabledForSession = false;
  updateEngineBadge();
  closeSettings();
  showToast('設定を保存しました');
}

let clearKeysArmed = false;
function clearAllKeys() {
  const btn = document.getElementById('clearKeysBtn');
  if (!clearKeysArmed) {
    clearKeysArmed = true;
    btn.textContent = 'もう一度タップ';
    setTimeout(() => {
      clearKeysArmed = false;
      btn.textContent = 'キーを全部消す';
    }, 3000);
    return;
  }
  clearKeysArmed = false;
  btn.textContent = 'キーを全部消す';
  settings = { ...settings, openaiKey: '', geminiKey: '', elevenKey: '' };
  saveJSON(KEYS.settings, settings);
  ['openaiKeyInput', 'geminiKeyInput', 'elevenKeyInput'].forEach((id) => (document.getElementById(id).value = ''));
  updateEngineBadge();
  showToast('APIキーを端末から削除しました');
}

async function clearTtsCache() {
  await ttsDB.clear();
  ttsMemCache.clear();
  showToast('保存していたAI音声を削除しました');
  showStorageInfo();
}

async function showStorageInfo() {
  const el = document.getElementById('storageInfo');
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const { usage } = await navigator.storage.estimate();
      const persisted = navigator.storage.persisted ? await navigator.storage.persisted() : false;
      el.textContent = `この端末での使用量: 約${(usage / 1024 / 1024).toFixed(1)}MB ／ 教材 ${userMaterials.length}件 ／ 履歴 ${state.wpmHistory.length}件${persisted ? ' ／ 自動削除されない設定' : ''}`;
    }
  } catch (e) {}
}

function requestPersistentStorage() {
  try {
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
  } catch (e) {}
}

async function exportBackup() {
  const data = {
    app: 'shadotore',
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    materials: userMaterials,
    wpmHistory: state.wpmHistory,
    prefs,
  };
  const name = `shadotore-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  try {
    const file = new File([blob], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'シャドトレ バックアップ' });
      return;
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast('バックアップを保存しました（APIキーは含みません）');
}

async function importBackup(e) {
  const file = e.target.files && e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.app !== 'shadotore') throw new Error('format');
    let added = 0;
    (data.materials || []).forEach((m) => {
      if (!m || !m.id || !m.raw) return;
      const i = userMaterials.findIndex((x) => x.id === m.id);
      if (i >= 0) userMaterials[i] = m;
      else {
        userMaterials.push(m);
        added++;
      }
    });
    const seen = new Set(state.wpmHistory.map((h) => `${h.at}|${h.wpm}|${h.partLabel}`));
    (data.wpmHistory || []).forEach((h) => {
      if (!seen.has(`${h.at}|${h.wpm}|${h.partLabel}`)) state.wpmHistory.push(h);
    });
    state.wpmHistory.sort((a, b) => (b.at || 0) - (a.at || 0));
    saveJSON(KEYS.materials, userMaterials);
    saveJSON(KEYS.history, state.wpmHistory);
    renderPartTabs();
    renderWpmHistory();
    showStorageInfo();
    showToast(`読み込みました（新しい教材 ${added}件）`);
  } catch (err) {
    showToast('バックアップファイルを読み込めませんでした');
  }
}

/* =========================================================
 * 15. シート（モーダル）・共通
 * ========================================================= */
function openSheet(id) {
  document.getElementById(id).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeSheet(id) {
  document.getElementById(id).classList.add('hidden');
  if (document.querySelectorAll('.sheet:not(.hidden)').length === 0) document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSheet('addSheet');
    closeSheet('settingsSheet');
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncate(s, n) {
  s = String(s || '');
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

let toastTimeout = null;
function showToast(msg, ms = 2400) {
  const container = document.getElementById('toastContainer');
  document.getElementById('toastMessage').textContent = msg;
  container.classList.remove('opacity-0', '-translate-y-2');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => container.classList.add('opacity-0', '-translate-y-2'), ms);
}

/* =========================================================
 * 16. Service Worker（オフライン対応）
 * ========================================================= */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return;
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker
    .register('sw.js')
    .then((reg) => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'activated' && hadController) {
            showToast('アプリを更新しました。次回起動から新しい版になります。', 3500);
          }
        });
      });
    })
    .catch(() => {});
}
