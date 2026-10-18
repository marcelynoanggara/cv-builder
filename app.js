'use strict';
/* ================= CV Builder — app logic ================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const uid = () => Math.random().toString(36).slice(2, 10);
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const STORE_KEY = 'cv-builder-v1';

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal', mini: 'mini-minimal' },
  { id: 'modern', name: 'Modern', mini: 'mini-modern' },
  { id: 'elegant', name: 'Elegant', mini: 'mini-elegant' },
  { id: 'executive', name: 'Executive', mini: 'mini-executive' },
  { id: 'bold', name: 'Bold', mini: 'mini-bold' },
];

const ACCENTS = [
  { id: 'indigo', hex: '#4f46e5' },
  { id: 'teal', hex: '#0d9488' },
  { id: 'rose', hex: '#e11d48' },
  { id: 'violet', hex: '#7c3aed' },
  { id: 'slate', hex: '#334155' },
];

const FONTS = [
  { id: 'sans', name: 'Sans' },
  { id: 'serif', name: 'Serif' },
  { id: 'mono', name: 'Mono' },
];

const SECTION_DEFS = [
  { id: 'profile', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'languages', label: 'Languages' },
];
const DEFAULT_ORDER = SECTION_DEFS.map((s) => s.id);

/* ---------- random persona generator ---------- */
const RND_FIRST = ['Ayu','Bima','Citra','Dimas','Eka','Fajar','Gita','Hendra','Intan','Joko','Kirana','Lukman','Maya','Nadia','Putri','Rizky','Sinta','Taufik','Wulan','Yoga','Dewi','Agus','Rina','Bagus','Sari','Andi','Nita','Reza','Lina'];
const RND_LAST = ['Pratama','Saputra','Wijaya','Kusuma','Santoso','Nugroho','Ramadhan','Anggraini','Setiawan','Hidayat','Puspita','Gunawan','Maharani','Firmansyah','Lestari','Utama','Permata','Siregar','Halim','Wibowo'];
const RND_TITLES = ['Frontend Developer','Backend Developer','Full-Stack Developer','UI/UX Designer','Mobile Developer','Data Analyst','DevOps Engineer','QA Engineer','Product Manager','Software Engineer'];
const RND_COMPANIES = ['TechNova Studio','PixelForge Agency','NusaTech Solutions','Kirana Digital','Aruna Labs','Bumi Software','Cakra Interactive','Langit Digital','Tunas Kode','Samudra Tech'];
const RND_CITIES = ['Jakarta, Indonesia','Bandung, Indonesia','Surabaya, Indonesia','Yogyakarta, Indonesia','Denpasar, Indonesia','Semarang, Indonesia','Medan, Indonesia'];
const RND_SKILLS = ['JavaScript','TypeScript','React','Vue.js','Node.js','Python','Go','PHP','Laravel','Tailwind CSS','PostgreSQL','MongoDB','Docker','Git','Figma','REST APIs','GraphQL','Flutter','Kotlin','AWS','Firebase','Redis','Jest','CI/CD'];
const RND_DEGREES = ['B.Sc. Computer Science','B.Sc. Information Technology','B.Eng. Software Engineering','M.Sc. Data Science'];
const RND_SCHOOLS = ['Telkom University Surabaya','Universitas Indonesia','Institut Teknologi Bandung','Universitas Gadjah Mada','Binus University'];
const RND_BULLETS = [
  'Shipped 12+ production features used by thousands of users',
  'Cut page load time by 40% through code splitting and caching',
  'Led migration of a legacy codebase to a modern stack',
  'Mentored 3 junior developers through code reviews',
  'Built a CI/CD pipeline that cut deploy time in half',
  'Worked in agile sprints with designers and product managers',
  'Improved test coverage from 35% to 80%',
  'Designed REST APIs serving 1M+ requests per day',
  'Redesigned onboarding flow, lifting activation by 25%',
  'Automated reporting tasks, saving the team 10 hours weekly',
];
const RND_PROJECTS = [
  ['ArusKas', 'A personal finance tracker with budgeting insights and clean charts.'],
  ['KosFinder', 'A boarding-house finder app with map search and chat with owners.'],
  ['TaniTrack', 'Crop monitoring dashboard for smallholder farmers with weather alerts.'],
  ['MoodJournal', 'A minimal daily journal with mood analytics and streaks.'],
  ['BelajarBareng', 'A study-group platform with shared notes and quizzes.'],
  ['WarungPOS', 'A point-of-sale web app for small shops, works offline.'],
];

const pick = (arr) => arr[(Math.random() * arr.length) | 0];
function pickN(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) out.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]);
  return out;
}

/* Randomize content only — the user's design settings are kept */
function randomState() {
  const first = pick(RND_FIRST);
  const last = pick(RND_LAST);
  const name = first + ' ' + last;
  const title = pick(RND_TITLES);
  const handle = (first + last).toLowerCase();
  const years = 1 + ((Math.random() * 5) | 0);
  const nowY = new Date().getFullYear();
  const co1 = pick(RND_COMPANIES);
  let co2 = pick(RND_COMPANIES);
  if (co2 === co1) co2 = pick(RND_COMPANIES);
  const projs = pickN(RND_PROJECTS, 2);
  const langs = [
    { id: uid(), name: 'Indonesian', level: 'Native' },
    { id: uid(), name: 'English', level: pick(['Intermediate', 'Fluent', 'Advanced']) },
  ];
  if (Math.random() < 0.35) langs.push({ id: uid(), name: 'Japanese', level: pick(['Beginner', 'N5', 'N4']) });

  return {
    template: state.template,
    design: JSON.parse(JSON.stringify(state.design)),
    sectionOrder: [...state.sectionOrder],
    hidden: [...state.hidden],
    personal: {
      name,
      title,
      email: handle + '@email.com',
      phone: '+62 8' + String(Math.floor(1000000000 + Math.random() * 9000000000)),
      location: pick(RND_CITIES),
      website: handle + '.dev',
      summary: `${title} with ${years} year${years > 1 ? 's' : ''} of experience turning ideas into fast, clean, user-friendly products. Known for sharp UI instincts, reliable delivery, and code the whole team enjoys reading.`,
    },
    experience: [
      {
        id: uid(), role: title, company: co1,
        start: 'Jan ' + (nowY - years), end: '', current: true,
        description: pickN(RND_BULLETS, 3).join('\n'),
      },
      {
        id: uid(), role: pick(RND_TITLES), company: co2,
        start: 'Jun ' + (nowY - years - 1), end: 'Dec ' + (nowY - years), current: false,
        description: pickN(RND_BULLETS, 2).join('\n'),
      },
    ],
    education: [
      {
        id: uid(), degree: pick(RND_DEGREES), school: pick(RND_SCHOOLS),
        year: String(nowY - years - 1),
        details: pick(['Graduated with honors.', 'Relevant coursework: algorithms, databases, web engineering.', 'Active in the campus developer community.', 'Teaching assistant for programming courses.']),
      },
    ],
    skills: pickN(RND_SKILLS, 6),
    projects: projs.map(([pname, pdesc]) => ({
      id: uid(), name: pname,
      link: 'github.com/' + handle + '/' + pname.toLowerCase(),
      description: pdesc,
    })),
    languages: langs,
  };
}

function blankExperience() {
  return { id: uid(), role: '', company: '', start: '', end: '', current: false, description: '' };
}
function blankEducation() {
  return { id: uid(), degree: '', school: '', year: '', details: '' };
}
function blankProject() {
  return { id: uid(), name: '', link: '', description: '' };
}
function blankLanguage() {
  return { id: uid(), name: '', level: '' };
}

function sampleState() {
  return {
    template: 'modern',
    design: { accent: '#4f46e5', font: 'sans', sidebar: 'left', headerAlign: 'left', customCss: '' },
    sectionOrder: [...DEFAULT_ORDER],
    hidden: [],
    personal: {
      name: 'Raka Pratama',
      title: 'Frontend Developer',
      email: 'raka.pratama@email.com',
      phone: '+62 812 3456 7890',
      location: 'Jakarta, Indonesia',
      website: 'rakapratama.dev',
      summary:
        'Frontend developer with 3 years of experience building responsive web apps with React and TypeScript. Passionate about clean UI, performance, and turning ideas into products people love to use.',
    },
    experience: [
      {
        id: uid(),
        role: 'Frontend Developer',
        company: 'TechNova Studio',
        start: 'Jan 2023',
        end: '',
        current: true,
        description:
          'Built and shipped 6 client-facing web apps with React and TypeScript\nImproved page load performance by 40% through code splitting and image optimization\nCollaborated with designers to implement a shared component library',
      },
      {
        id: uid(),
        role: 'Web Developer Intern',
        company: 'PixelForge Agency',
        start: 'Jun 2022',
        end: 'Dec 2022',
        current: false,
        description:
          'Converted Figma designs into responsive landing pages\nFixed UI bugs and improved mobile layouts across 10+ pages',
      },
    ],
    education: [
      {
        id: uid(),
        degree: 'B.Sc. Information Technology',
        school: 'Telkom University Surabaya',
        year: '2022',
        details: 'Focused on software development, data structures, and web technologies.',
      },
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Git', 'REST APIs'],
    projects: [
      {
        id: uid(),
        name: 'NihonGo Master',
        link: 'github.com/raka/nihongo-master',
        description: 'Interactive Japanese learning web app with kana flashcards, kanji explorer, and quizzes.',
      },
    ],
    languages: [
      { id: uid(), name: 'Indonesian', level: 'Native' },
      { id: uid(), name: 'English', level: 'Fluent' },
    ],
  };
}

function blankState() {
  const s = sampleState();
  s.template = 'minimal';
  s.design = { accent: '#4f46e5', font: 'sans', sidebar: 'left', headerAlign: 'left', customCss: '' };
  s.sectionOrder = [...DEFAULT_ORDER];
  s.hidden = [];
  s.personal = { name: '', title: '', email: '', phone: '', location: '', website: '', summary: '' };
  s.experience = [blankExperience()];
  s.education = [blankEducation()];
  s.skills = [];
  s.projects = [blankProject()];
  s.languages = [blankLanguage()];
  return s;
}

/* ---------- state ---------- */
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.personal) return migrateState(parsed);
    }
  } catch (_) {}
  return sampleState();
}

/* Fill in design/layout fields for states saved before this feature existed */
function migrateState(s) {
  const d = s.design && typeof s.design === 'object' ? s.design : {};
  if (s.accent && !d.accent) d.accent = s.accent;
  s.design = Object.assign(
    { accent: '#4f46e5', font: 'sans', sidebar: 'left', headerAlign: 'left', customCss: '' },
    d
  );
  delete s.accent;
  if (!Array.isArray(s.sectionOrder)) s.sectionOrder = [...DEFAULT_ORDER];
  for (const id of DEFAULT_ORDER) if (!s.sectionOrder.includes(id)) s.sectionOrder.push(id);
  s.sectionOrder = s.sectionOrder.filter((id) => DEFAULT_ORDER.includes(id));
  if (!Array.isArray(s.hidden)) s.hidden = [];
  s.hidden = s.hidden.filter((id) => DEFAULT_ORDER.includes(id));
  return s;
}
function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (_) {}
}

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- custom uploaded font ---------- */
const CUSTOM_FONT_FAMILY = 'CVCustomFont';
function registerCustomFont() {
  const fd = state.design.customFontData;
  if (!fd || typeof FontFace === 'undefined' || !document.fonts) return;
  try {
    const face = new FontFace(CUSTOM_FONT_FAMILY, `url(${fd})`);
    face.load().then((f) => document.fonts.add(f)).catch(() => {});
  } catch (_) {}
}
function fontStyleAttr(d) {
  if (d.design.font === 'custom' && d.design.customFontData) {
    return `font-family:'${CUSTOM_FONT_FAMILY}',sans-serif;`;
  }
  return '';
}

/* ---------- editor rendering ---------- */
function field(label, name, value, opts = {}) {
  const type = opts.type || 'text';
  const input =
    opts.multiline
      ? `<textarea data-f="${name}" placeholder="${esc(opts.ph || '')}">${esc(value)}</textarea>`
      : `<input type="${type}" data-f="${name}" value="${esc(value)}" placeholder="${esc(opts.ph || '')}" />`;
  return `<div class="field"><label>${esc(label)}</label>${input}</div>`;
}

/* ---------- design presets (one-tap styles) ---------- */
const PRESETS = [
  { id: 'p-modern', name: 'Modern', emoji: '✨', template: 'modern', accent: '#4f46e5', font: 'sans' },
  { id: 'p-elegan', name: 'Elegan', emoji: '🤍', template: 'elegant', accent: '#57534e', font: 'serif' },
  { id: 'p-eksekutif', name: 'Eksekutif', emoji: '💼', template: 'executive', accent: '#1e3a8a', font: 'serif' },
  { id: 'p-berani', name: 'Berani', emoji: '🔥', template: 'bold', accent: '#e11d48', font: 'sans' },
];
function activePreset() {
  return (
    PRESETS.find(
      (pr) => pr.template === state.template && pr.accent === state.design.accent && pr.font === state.design.font
    ) || null
  );
}

/* ---------- accordion editor ---------- */
const openAcc = new Set(['personal']);
function secSummary(id) {
  const d = state;
  const tplName = (TEMPLATES.find((t) => t.id === d.template) || {}).name || '';
  const fontName =
    d.design.font === 'custom'
      ? d.design.customFontName || 'Custom'
      : (FONTS.find((f) => f.id === d.design.font) || {}).name || '';
  switch (id) {
    case 'design':
      return `${tplName} • ${fontName}`;
    case 'personal':
      return [d.personal.name, d.personal.title].filter(Boolean).join(' • ') || 'Belum diisi';
    case 'summary':
      return d.personal.summary
        ? d.personal.summary.length > 60
          ? d.personal.summary.slice(0, 60) + '…'
          : d.personal.summary
        : 'Belum diisi';
    case 'experience':
      return d.experience.length
        ? `${d.experience.length} pengalaman` + (d.experience[0].role ? ` • ${d.experience[0].role}` : '')
        : 'Belum diisi';
    case 'education':
      return d.education.length ? d.education[0].degree || d.education[0].school || '1 pendidikan' : 'Belum diisi';
    case 'skills':
      return d.skills.length
        ? `${d.skills.length} keahlian: ${d.skills.slice(0, 3).join(', ')}${d.skills.length > 3 ? '…' : ''}`
        : 'Belum diisi';
    case 'projects':
      return d.projects.length ? `${d.projects.length} proyek` : 'Belum diisi';
    case 'languages':
      return d.languages.length
        ? d.languages.map((l) => l.name).filter(Boolean).join(', ') || `${d.languages.length} bahasa`
        : 'Belum diisi';
    default:
      return '';
  }
}
function acc(id, num, title, bodyHtml) {
  return `<details class="card acc"${openAcc.has(id) ? ' open' : ''} data-acc="${id}">
    <summary class="acc-head">
      <span class="acc-num">${num}</span>
      <span class="acc-titles"><span class="acc-title">${title}</span><span class="acc-sub">${esc(secSummary(id))}</span></span>
      <span class="acc-chev" aria-hidden="true">›</span>
    </summary>
    <div class="acc-body">${bodyHtml}</div>
  </details>`;
}

function renderEditor() {
  // Sinkronkan status accordion dari DOM yang masih hidup SEBELUM rebuild,
  // agar menu yang sedang dibuka tidak pernah ketutup sendiri
  document.querySelectorAll('#editor details[data-acc]').forEach((d) => {
    if (d.open) openAcc.add(d.dataset.acc);
    else openAcc.delete(d.dataset.acc);
  });
  // simpan posisi scroll agar tidak lompat setelah innerHTML diganti
  const scroller = document.querySelector('.editor');
  const sst = scroller ? scroller.scrollTop : 0;
  const wsy = window.scrollY;
  const p = state.personal;
  const expHtml = state.experience
    .map(
      (e, i) => `
    <div class="entry" data-kind="experience" data-id="${e.id}">
      <div class="entry-head">
        <strong>Experience ${i + 1}</strong>
        <button class="btn btn-sm btn-danger" data-del>Remove</button>
      </div>
      <div class="grid-2">
        ${field('Job title', 'role', e.role, { ph: 'Frontend Developer' })}
        ${field('Company', 'company', e.company, { ph: 'Acme Inc.' })}
      </div>
      <div class="grid-2">
        ${field('Start', 'start', e.start, { ph: 'Jan 2023' })}
        ${field('End', 'end', e.current ? '' : e.end, { ph: 'Dec 2024' })}
      </div>
      <label class="check-row"><input type="checkbox" data-f="current" ${e.current ? 'checked' : ''} /> I currently work here</label>
      <div style="height:10px"></div>
      ${field('Highlights (one per line)', 'description', e.description, { multiline: true, ph: 'What did you achieve?' })}
    </div>`
    )
    .join('');

  const eduHtml = state.education
    .map(
      (e, i) => `
    <div class="entry" data-kind="education" data-id="${e.id}">
      <div class="entry-head">
        <strong>Education ${i + 1}</strong>
        <button class="btn btn-sm btn-danger" data-del>Remove</button>
      </div>
      <div class="grid-2">
        ${field('Degree', 'degree', e.degree, { ph: 'B.Sc. Computer Science' })}
        ${field('School', 'school', e.school, { ph: 'University name' })}
      </div>
      ${field('Year', 'year', e.year, { ph: '2024' })}
      ${field('Details', 'details', e.details, { multiline: true, ph: 'Honors, relevant coursework…' })}
    </div>`
    )
    .join('');

  const projHtml = state.projects
    .map(
      (e, i) => `
    <div class="entry" data-kind="projects" data-id="${e.id}">
      <div class="entry-head">
        <strong>Project ${i + 1}</strong>
        <button class="btn btn-sm btn-danger" data-del>Remove</button>
      </div>
      <div class="grid-2">
        ${field('Project name', 'name', e.name, { ph: 'My cool app' })}
        ${field('Link', 'link', e.link, { ph: 'github.com/you/app' })}
      </div>
      ${field('Description', 'description', e.description, { multiline: true, ph: 'What does it do?' })}
    </div>`
    )
    .join('');

  const langHtml = state.languages
    .map(
      (e, i) => `
    <div class="entry" data-kind="languages" data-id="${e.id}">
      <div class="entry-head">
        <strong>Language ${i + 1}</strong>
        <button class="btn btn-sm btn-danger" data-del>Remove</button>
      </div>
      <div class="grid-2">
        ${field('Language', 'name', e.name, { ph: 'English' })}
        ${field('Level', 'level', e.level, { ph: 'Fluent' })}
      </div>
    </div>`
    )
    .join('');

  const skillChips = state.skills
    .map((s, i) => `<span class="chip">${esc(s)}<button data-skill-del="${i}" aria-label="Remove ${esc(s)}">×</button></span>`)
    .join('');

  const tplBtns = TEMPLATES.map(
    (t) => `
    <button class="tpl ${state.template === t.id ? 'active' : ''}" data-tpl="${t.id}">
      <div class="mini ${t.mini}"></div><small>${t.name}</small>
    </button>`
  ).join('');

  const swatches = ACCENTS.map(
    (a) => `<button class="swatch ${state.design.accent === a.hex ? 'active' : ''}" data-accent="${a.hex}" style="background:${a.hex}" aria-label="${a.id}" title="${a.id}"></button>`
  ).join('');
  const customActive = !ACCENTS.some((a) => a.hex === state.design.accent);
  const swatchHtml = `${swatches}<button class="swatch swatch-custom ${customActive ? 'active' : ''}" data-custom-color aria-label="Warna bebas" title="Warna bebas">+</button><input type="color" class="colorwell-hidden" data-design="accent" value="${esc(state.design.accent)}" aria-hidden="true" tabindex="-1" />`;

  const fontBtns = FONTS.map(
    (f) => `<button class="${state.design.font === f.id ? 'active' : ''}" data-font="${f.id}">${f.name}</button>`
  ).join('') + `<button class="${state.design.font === 'custom' ? 'active' : ''}" data-font="custom" title="${esc(state.design.customFontName || 'Upload your own font')}">${state.design.customFontData ? esc(state.design.customFontName || 'Custom') : '+ Font'}</button>`;

  const secRows = secRowsHtml();

  const presetHtml = PRESETS.map((pr) => {
    const isActive = activePreset() && activePreset().id === pr.id;
    return `<button class="preset-chip${isActive ? ' active' : ''}" data-preset="${pr.id}"><span class="pe" aria-hidden="true">${pr.emoji}</span><span>${pr.name}</span></button>`;
  }).join('');

  const designBody = `
      <div class="field"><label>Gaya cepat — satu ketuk jadi</label><div class="preset-row">${presetHtml}</div></div>
      <details class="adv" data-acc="design-adv"${openAcc.has('design-adv') ? ' open' : ''}>
        <summary><span>Kustomisasi lanjutan</span><span class="adv-chev" aria-hidden="true">›</span></summary>
        <div class="adv-body">
      <div class="field"><label>Template</label><div class="tpl-row">${tplBtns}</div></div>
      <div class="field"><label>Accent color</label>
        <div class="accent-row">${swatchHtml}</div>
      </div>
      <div class="field"><label>Font</label><div class="seg-row">${fontBtns}</div></div>
      <div class="field"><label>Sidebar position (Modern template)</label>
        <div class="seg-row">
          <button class="${state.design.sidebar === 'left' ? 'active' : ''}" data-sidebar="left">Left</button>
          <button class="${state.design.sidebar === 'right' ? 'active' : ''}" data-sidebar="right">Right</button>
        </div>
      </div>
      <div class="field"><label>Header alignment</label>
        <div class="seg-row">
          <button class="${state.design.headerAlign === 'left' ? 'active' : ''}" data-align="left">Left</button>
          <button class="${state.design.headerAlign === 'center' ? 'active' : ''}" data-align="center">Center</button>
        </div>
      </div>
      <div class="field"><label>Sections — reorder &amp; visibility</label><div class="sec-list">${secRows}</div></div>
      <div class="field"><label>Custom CSS — 100% freedom</label>
        <textarea data-design="customCss" class="mono" placeholder="e.g.&#10;.cv h1 { letter-spacing: 3px; }&#10;.cv { --cv-accent: #111; }">${esc(state.design.customCss)}</textarea>
        <p class="hint">Any CSS you write here applies to the preview and the exported PDF. The CV root element is <span class="mono">.cv</span>.</p>
      </div>
        </div>
      </details>
  `;
  const personalBody = `
      <div data-kind="personal">
        <div class="field"><label>Profile photo (optional)</label>
          <div class="photo-row">
            ${p.photo ? `<img class="photo-thumb" src="${p.photo}" alt="Profile photo" />` : `<span class="photo-thumb" aria-hidden="true"></span>`}
            <div class="photo-actions">
              <button class="file-btn" data-photo-upload>Upload photo</button>
              ${p.photo ? `<button class="btn btn-sm btn-danger" data-photo-remove>Remove</button>` : `<span class="file-hint">JPG/PNG, auto-resized</span>`}
            </div>
          </div>
        </div>
        ${field('Full name', 'name', p.name, { ph: 'Your name' })}
        ${field('Job title', 'title', p.title, { ph: 'Frontend Developer' })}
        <div class="grid-2">
          ${field('Email', 'email', p.email, { type: 'email', ph: 'you@email.com' })}
          ${field('Phone', 'phone', p.phone, { type: 'tel', ph: '+62 …' })}
        </div>
        <div class="grid-2">
          ${field('Location', 'location', p.location, { ph: 'Jakarta, Indonesia' })}
          ${field('Website / LinkedIn', 'website', p.website, { ph: 'your-site.com' })}
        </div>
      </div>
  `;
  const summaryBody = `
      <div data-kind="personal">
        ${field('Professional summary', 'summary', p.summary, { multiline: true, ph: '2–3 sentences about you…' })}
      </div>
  `;
  const expBody = `
      ${expHtml}
      <button class="btn btn-add" data-add="experience">+ Add experience</button>
  `;
  const eduBody = `
      ${eduHtml}
      <button class="btn btn-add" data-add="education">+ Add education</button>
  `;
  const skillsBody = `
      <div class="chips">${skillChips || '<span style="color:var(--muted);font-size:14px">No skills yet — add your first below.</span>'}</div>
      <div class="skill-add">
        <input id="skillInput" type="text" placeholder="e.g. React" />
        <button class="btn btn-sm" id="skillAddBtn">Add</button>
      </div>
  `;
  const projBody = `
      ${projHtml}
      <button class="btn btn-add" data-add="projects">+ Add project</button>
  `;
  const langBody = `
      ${langHtml}
      <button class="btn btn-add" data-add="languages">+ Add language</button>
  `;

  $('#editor').innerHTML = [
    acc('design', 1, 'Design & Layout', designBody),
    acc('personal', 2, 'Personal Info', personalBody),
    acc('summary', 3, 'Summary', summaryBody),
    acc('experience', 4, 'Experience', expBody),
    acc('education', 5, 'Education', eduBody),
    acc('skills', 6, 'Skills', skillsBody),
    acc('projects', 7, 'Projects', projBody),
    acc('languages', 8, 'Languages', langBody),
  ].join('');
  if (scroller) scroller.scrollTop = sst;
  if (wsy) window.scrollTo(0, wsy);
}

/* ---------- preview templates ---------- */
function dateRange(e) {
  const end = e.current ? 'Present' : e.end;
  if (!e.start && !end) return '';
  return `${e.start || ''}${e.start && end ? ' — ' : ''}${end || ''}`;
}
function bullets(text) {
  const lines = String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return '';
  return `<ul class="dots">${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`;
}
function contactLine(p) {
  return [p.email, p.phone, p.location, p.website].filter(Boolean).map(esc).join(' &nbsp;•&nbsp; ');
}

function section(title, inner) {
  if (!inner) return '';
  return `<section><h3 class="sec-title">${esc(title)}</h3>${inner}</section>`;
}

/* Build each section's HTML once, then assemble in the user's order */
function sectionMap(d) {
  const p = d.personal;
  const exp = d.experience
    .filter((e) => e.role || e.company)
    .map(
      (e) => `<div class="item">
        <div class="item-head"><span class="item-title">${esc(e.role)}</span><span class="item-date">${esc(dateRange(e))}</span></div>
        <div class="item-sub">${esc(e.company)}</div>${bullets(e.description)}</div>`
    )
    .join('');
  const edu = d.education
    .filter((e) => e.degree || e.school)
    .map(
      (e) => `<div class="item">
        <div class="item-head"><span class="item-title">${esc(e.degree)}</span><span class="item-date">${esc(e.year)}</span></div>
        <div class="item-sub">${esc(e.school)}</div>
        ${e.details ? `<div class="item-sub">${esc(e.details)}</div>` : ''}</div>`
    )
    .join('');
  const proj = d.projects
    .filter((e) => e.name)
    .map(
      (e) => `<div class="item">
        <div class="item-head"><span class="item-title">${esc(e.name)}</span><span class="item-date">${esc(e.link)}</span></div>
        ${e.description ? `<div class="item-sub">${esc(e.description)}</div>` : ''}</div>`
    )
    .join('');
  const lang = d.languages
    .filter((e) => e.name)
    .map((e) => `<div class="item-sub">${esc(e.name)}${e.level ? ` — ${esc(e.level)}` : ''}</div>`)
    .join('');
  return {
    profile: p.summary ? section('Summary', `<p class="summary">${esc(p.summary)}</p>`) : '',
    experience: section('Experience', exp),
    education: section('Education', edu),
    skills: d.skills.length ? section('Skills', `<div class="skill-list">${esc(d.skills.join('  \u2022  '))}</div>`) : '',
    projects: section('Projects', proj),
    languages: section('Languages', lang),
  };
}

/* Join sections in the user's custom order, skipping hidden ones */
function orderedSections(d, map, ids) {
  return (ids || d.sectionOrder)
    .filter((id) => !d.hidden.includes(id))
    .map((id) => map[id] || '')
    .join('');
}

function cvClasses(d, extra) {
  const c = ['cv'];
  if (d.design.font === 'serif') c.push('cv-ff-serif');
  if (d.design.font === 'mono') c.push('cv-ff-mono');
  if (d.design.headerAlign === 'center') c.push('cv-hcenter');
  if (extra) c.push(extra);
  return c.join(' ');
}

function headerHtml(d) {
  const p = d.personal;
  const photo = p.photo ? `<img class="cv-photo" src="${p.photo}" alt="" />` : '';
  return `<div class="cv-head">${photo}<div class="head-text">
    <h1>${esc(p.name) || 'Your Name'}</h1>
    ${p.title ? `<div class="role" style="color:${esc(d.design.accent)}">${esc(p.title)}</div>` : ''}
    <div class="contact">${contactLine(p)}</div>
  </div></div>`;
}

function tplMinimal(d) {
  const map = sectionMap(d);
  return `<div class="${cvClasses(d)}" style="--cv-accent:${esc(d.design.accent)};${fontStyleAttr(d)}">
    ${headerHtml(d)}${orderedSections(d, map)}</div>`;
}

function tplModern(d) {
  const p = d.personal;
  const map = sectionMap(d);
  const sideIds = d.sectionOrder.filter((id) => ['skills', 'languages'].includes(id));
  const mainIds = d.sectionOrder.filter((id) => !['skills', 'languages'].includes(id));
  const sideCls = d.design.sidebar === 'right' ? 'cv-modern side-right' : 'cv-modern';
  return `<div class="${cvClasses(d, sideCls)}" style="--cv-accent:${esc(d.design.accent)};${fontStyleAttr(d)}">
    <aside class="side">
      ${p.photo ? `<img class="cv-photo" src="${p.photo}" alt="" style="margin-bottom:14px" />` : ''}
      <h1>${esc(p.name) || 'Your Name'}</h1>
      ${p.title ? `<div class="role">${esc(p.title)}</div>` : ''}
      <div class="contact">
        ${[p.email, p.phone, p.location, p.website].filter(Boolean).map((c) => `<div>${esc(c)}</div>`).join('')}
      </div>
      ${orderedSections(d, map, sideIds)}
    </aside>
    <div class="main">${orderedSections(d, map, mainIds)}</div>
  </div>`;
}

function tplElegant(d) {
  // Elegant reuses the minimal structure with serif styling
  return tplMinimal(d).replace('class="cv', 'class="cv cv-elegant');
}

function tplExecutive(d) {
  const map = sectionMap(d);
  return `<div class="${cvClasses(d, 'cv-executive')}" style="--cv-accent:${esc(d.design.accent)};${fontStyleAttr(d)}">
    ${headerHtml(d)}${orderedSections(d, map)}</div>`;
}

function tplBold(d) {
  const p = d.personal;
  const map = sectionMap(d);
  const photo = p.photo ? `<img class="cv-photo" src="${p.photo}" alt="" />` : '';
  return `<div class="${cvClasses(d, 'cv-bold')}" style="--cv-accent:${esc(d.design.accent)};${fontStyleAttr(d)}">
    <div class="band"><div class="cv-head">${photo}<div class="head-text">
      <h1>${esc(p.name) || 'Your Name'}</h1>
      ${p.title ? `<div class="role">${esc(p.title)}</div>` : ''}
      <div class="contact">${contactLine(p)}</div>
    </div></div></div>
    <div class="band-body">${orderedSections(d, map)}</div>
  </div>`;
}

/* Custom CSS: user's 100% freedom — sanitized so it can't break out of the style tag */
function setCustomCss(css) {
  let el = document.getElementById('cvCustomCss');
  if (!el) {
    el = document.createElement('style');
    el.id = 'cvCustomCss';
    document.head.appendChild(el);
  }
  el.textContent = String(css || '').replace(/<\/style/gi, '<\\/style');
}

function buildCvHtml() {
  const t = state.template;
  return t === 'modern' ? tplModern(state)
    : t === 'elegant' ? tplElegant(state)
    : t === 'executive' ? tplExecutive(state)
    : t === 'bold' ? tplBold(state)
    : tplMinimal(state);
}

function renderPreview() {
  const html = buildCvHtml();
  $('#preview').innerHTML = html;
  setCustomCss(state.design.customCss);
  const sheet = document.getElementById('previewSheet');
  if (sheet && !sheet.hidden) {
    document.getElementById('sheetPaper').innerHTML = html;
  }
  fitPaper();
}

/* ---------- samakan preview mobile = desktop ----------
   Kecilkan kertas A4 secara proporsional bila wadahnya lebih sempit,
   sehingga preview di HP = layout desktop = hasil print. */
function fitPaperIn(wrap, paper) {
  if (!wrap || !paper) return;
  paper.style.transform = '';
  wrap.classList.remove('fit');
  wrap.style.height = '';
  const avail = wrap.clientWidth;
  const full = paper.offsetWidth; // 210mm
  if (full > avail && avail > 0) {
    const s = avail / full;
    wrap.classList.add('fit');
    paper.style.transform = 'scale(' + s + ')';
    wrap.style.height = (paper.offsetHeight * s) + 'px';
  }
}
function fitPaper() {
  fitPaperIn(
    document.querySelector('#previewPane .paper-wrap'),
    document.getElementById('preview')
  );
  const sheet = document.getElementById('previewSheet');
  if (sheet && !sheet.hidden) {
    fitPaperIn(sheet.querySelector('.paper-wrap'), document.getElementById('sheetPaper'));
  }
}
window.addEventListener('resize', fitPaper);
window.addEventListener('orientationchange', () => setTimeout(fitPaper, 300));

/* ---------- sinkron highlight swatch tanpa rebuild editor ---------- */
function syncSwatchUI() {
  const cur = state.design.accent;
  const isCustom = !ACCENTS.some((a) => a.hex === cur);
  document.querySelectorAll('#editor [data-accent]').forEach((b) =>
    b.classList.toggle('active', b.dataset.accent === cur));
  const cb = document.querySelector('#editor [data-custom-color]');
  if (cb) cb.classList.toggle('active', isCustom);
  const cw = document.querySelector('#editor [data-design="accent"]');
  if (cw) cw.value = cur;
}

/* ---------- bangun ulang daftar section + refresh seluruh UI Design ----------
   tanpa me-rebuild editor (menu tidak ketutup, scroll tidak lompat) */
function secRowsHtml() {
  return state.sectionOrder
    .map((id, i) => {
      const def = SECTION_DEFS.find((s) => s.id === id);
      const off = state.hidden.includes(id);
      return `<div class="sec-row">
        <span class="lbl ${off ? 'off' : ''}">${def.label}</span>
        <button class="mini-btn" data-sec-up="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move ${def.label} up">↑</button>
        <button class="mini-btn" data-sec-down="${i}" ${i === state.sectionOrder.length - 1 ? 'disabled' : ''} aria-label="Move ${def.label} down">↓</button>
        <button class="mini-btn wide" data-sec-toggle="${id}">${off ? 'Show' : 'Hide'}</button>
      </div>`;
    })
    .join('');
}

function refreshDesignUI() {
  const ed = document.getElementById('editor');
  if (!ed) return;
  const ap = typeof activePreset === 'function' ? activePreset() : null;
  ed.querySelectorAll('[data-preset]').forEach((b) =>
    b.classList.toggle('active', !!ap && b.dataset.preset === ap.id));
  ed.querySelectorAll('[data-tpl]').forEach((b) =>
    b.classList.toggle('active', b.dataset.tpl === state.template));
  ed.querySelectorAll('[data-font]').forEach((b) =>
    b.classList.toggle('active', b.dataset.font === state.design.font));
  ed.querySelectorAll('[data-sidebar]').forEach((b) =>
    b.classList.toggle('active', b.dataset.sidebar === state.design.sidebar));
  ed.querySelectorAll('[data-align]').forEach((b) =>
    b.classList.toggle('active', b.dataset.align === state.design.headerAlign));
  syncSwatchUI();
  const sub = ed.querySelector('[data-acc="design"] .acc-sub');
  if (sub) sub.textContent = secSummary('design');
  const secList = ed.querySelector('.sec-list');
  if (secList) secList.innerHTML = secRowsHtml();
}

/* ---------- view toggle (mobile) ---------- */
$('#tabEdit').addEventListener('click', () => setView(false));
$('#tabPreview').addEventListener('click', () => setView(true));
function setView(showPreview) {
  document.body.classList.toggle('show-preview', showPreview);
  $('#tabEdit').classList.toggle('active', !showPreview);
  $('#tabPreview').classList.toggle('active', showPreview);
  $('#tabEdit').setAttribute('aria-selected', String(!showPreview));
  $('#tabPreview').setAttribute('aria-selected', String(showPreview));
  if (showPreview) requestAnimationFrame(fitPaper);
}

/* ---------- bubble preview: intip CV tanpa pindah tab ---------- */
$('#bubblePreview').addEventListener('click', () => {
  document.getElementById('sheetPaper').innerHTML = buildCvHtml();
  const sheet = document.getElementById('previewSheet');
  sheet.hidden = false;
  sheet.querySelector('.sheet-card').scrollTop = 0;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(fitPaper);
});
function closeSheet() {
  document.getElementById('previewSheet').hidden = true;
  document.body.style.overflow = '';
}
$('#sheetClose').addEventListener('click', closeSheet);
$('#previewSheet').addEventListener('click', (e) => {
  if (e.target === document.getElementById('previewSheet')) closeSheet();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.getElementById('previewSheet').hidden) closeSheet();
});

function renderAll() {
  renderEditor();
  renderPreview();
}

/* ---------- editor events (delegation) ---------- */
function findEntry(el) {
  const node = el.closest('.entry');
  if (!node) return null;
  return { kind: node.dataset.kind, id: node.dataset.id };
}

$('#editor').addEventListener('input', (ev) => {
  const t = ev.target;
  if (t.dataset.design) {
    const k = t.dataset.design;
    state.design[k] = t.value;
    if (k === 'accent') document.documentElement.style.setProperty('--accent', t.value);
    saveState();
    renderPreview();
    return;
  }
  const f = t.dataset.f;
  if (!f) return;
  const entry = findEntry(t);
  const val = t.type === 'checkbox' ? t.checked : t.value;
  if (!entry) {
    state.personal[f] = val; // personal card
  } else {
    const item = state[entry.kind].find((x) => x.id === entry.id);
    if (item) item[f] = val;
  }
  saveState();
  renderPreview();
});

$('#editor').addEventListener('change', (ev) => {
  const t = ev.target;
  if (t.dataset.f === 'current' && t.type === 'checkbox') {
    const entry = findEntry(t);
    const item = state[entry.kind].find((x) => x.id === entry.id);
    if (item) {
      item.current = t.checked;
      saveState();
      renderEditor();
      renderPreview();
    }
  }
  if (t.dataset.design === 'accent') {
    // input handler sudah update state + preview; di sini cukup sync highlight swatch
    syncSwatchUI();
  }
});

$('#editor').addEventListener('click', (ev) => {
  const t = ev.target;

  const presetBtn = t.closest('[data-preset]');
  if (presetBtn) {
    const pr = PRESETS.find((x) => x.id === presetBtn.dataset.preset);
    if (pr) {
      state.template = pr.template;
      state.design.accent = pr.accent;
      state.design.font = pr.font;
      document.documentElement.style.setProperty('--accent', pr.accent);
      saveState();
      refreshDesignUI();
      renderPreview();
      toast(`Gaya "${pr.name}" diterapkan ✨`);
    }
    return;
  }

  const delBtn = t.closest('[data-del]');
  if (delBtn) {
    const entry = findEntry(delBtn);
    state[entry.kind] = state[entry.kind].filter((x) => x.id !== entry.id);
    if (!state[entry.kind].length) {
      const makers = { experience: blankExperience, education: blankEducation, projects: blankProject, languages: blankLanguage };
      state[entry.kind] = [makers[entry.kind]()];
    }
    saveState();
    renderAll();
    return;
  }

  const addBtn = t.closest('[data-add]');
  if (addBtn) {
    const kind = addBtn.dataset.add;
    const makers = { experience: blankExperience, education: blankEducation, projects: blankProject, languages: blankLanguage };
    state[kind].push(makers[kind]());
    saveState();
    renderAll();
    return;
  }

  const tplBtn = t.closest('[data-tpl]');
  if (tplBtn) {
    state.template = tplBtn.dataset.tpl;
    saveState();
    refreshDesignUI();
    renderPreview();
    return;
  }

  const sw = t.closest('[data-accent]');
  if (sw) {
    state.design.accent = sw.dataset.accent;
    document.documentElement.style.setProperty('--accent', state.design.accent);
    saveState();
    // Update highlight tanpa rebuild editor agar scroll tidak lompat
    syncSwatchUI();
    renderPreview();
    return;
  }

  const customBtn = t.closest('[data-custom-color]');
  if (customBtn) {
    const picker = customBtn.parentElement.querySelector('[data-design="accent"]');
    if (picker) picker.click();
    return;
  }

  const fontBtn = t.closest('[data-font]');
  if (fontBtn) {
    if (fontBtn.dataset.font === 'custom' && !state.design.customFontData) {
      $('#fontInput').click();
      return;
    }
    state.design.font = fontBtn.dataset.font;
    saveState();
    refreshDesignUI();
    renderPreview();
    return;
  }

  if (t.closest('[data-photo-upload]')) {
    $('#photoInput').click();
    return;
  }
  if (t.closest('[data-photo-remove]')) {
    state.personal.photo = '';
    saveState();
    renderAll();
    toast('Photo removed');
    return;
  }

  const sbBtn = t.closest('[data-sidebar]');
  if (sbBtn) {
    state.design.sidebar = sbBtn.dataset.sidebar;
    saveState();
    refreshDesignUI();
    renderPreview();
    return;
  }

  const alBtn = t.closest('[data-align]');
  if (alBtn) {
    state.design.headerAlign = alBtn.dataset.align;
    saveState();
    refreshDesignUI();
    renderPreview();
    return;
  }

  const secUp = t.closest('[data-sec-up]');
  if (secUp) {
    const i = Number(secUp.dataset.secUp);
    if (i > 0) {
      [state.sectionOrder[i - 1], state.sectionOrder[i]] = [state.sectionOrder[i], state.sectionOrder[i - 1]];
      saveState();
      refreshDesignUI();
      renderPreview();
    }
    return;
  }

  const secDown = t.closest('[data-sec-down]');
  if (secDown) {
    const i = Number(secDown.dataset.secDown);
    if (i < state.sectionOrder.length - 1) {
      [state.sectionOrder[i + 1], state.sectionOrder[i]] = [state.sectionOrder[i], state.sectionOrder[i + 1]];
      saveState();
      refreshDesignUI();
      renderPreview();
    }
    return;
  }

  const secTog = t.closest('[data-sec-toggle]');
  if (secTog) {
    const id = secTog.dataset.secToggle;
    const ix = state.hidden.indexOf(id);
    if (ix >= 0) state.hidden.splice(ix, 1);
    else state.hidden.push(id);
    saveState();
    refreshDesignUI();
    renderPreview();
    return;
  }

  const skillDel = t.closest('[data-skill-del]');
  if (skillDel) {
    state.skills.splice(Number(skillDel.dataset.skillDel), 1);
    saveState();
    renderAll();
    return;
  }

  if (t.closest('#skillAddBtn')) {
    addSkill();
  }
});

$('#editor').addEventListener('keydown', (ev) => {
  if (ev.target.id === 'skillInput' && ev.key === 'Enter') {
    ev.preventDefault();
    addSkill();
  }
});

function addSkill() {
  const input = $('#skillInput');
  const v = input.value.trim();
  if (v && !state.skills.includes(v)) {
    state.skills.push(v);
    saveState();
    renderAll();
    toast('Skill added');
  } else if (v) {
    toast('Skill already listed');
  }
}

/* ---------- accordion open-state tracking (toggle doesn't bubble) ---------- */
$('#editor').addEventListener(
  'toggle',
  (ev) => {
    const d = ev.target.closest && ev.target.closest('details[data-acc]');
    // Abaikan event dari elemen yang sedang dihapus (saat rebuild editor):
    // itu event liar, bukan aksi user
    if (!d || !d.isConnected) return;
    if (d.open) openAcc.add(d.dataset.acc);
    else openAcc.delete(d.dataset.acc);
  },
  true
);

/* ---------- header actions ---------- */
$('#btnPdf').addEventListener('click', () => window.print());

const menu = $('#menu');
$('#btnMenu').addEventListener('click', (ev) => {
  ev.stopPropagation();
  menu.hidden = !menu.hidden;
});
document.addEventListener('click', (ev) => {
  if (!ev.target.closest('.menu-wrap')) menu.hidden = true;
});

menu.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-act]');
  if (!btn) return;
  menu.hidden = true;
  const act = btn.dataset.act;
  if (act === 'export-json') exportJSON();
  if (act === 'import-json') $('#fileImport').click();
  if (act === 'randomize') {
    showConfirm('Replace your CV with a randomly generated one? Your design settings are kept.', 'Yes, randomize').then((ok) => {
      if (!ok) return;
      state = randomState();
      saveState();
      renderAll();
      toast('Random CV generated 🎲');
    });
  }
  if (act === 'load-sample') {
    showConfirm('Replace your CV with sample data?').then((ok) => {
      if (!ok) return;
      state = sampleState();
      saveState();
      renderAll();
      toast('Sample data loaded');
    });
  }
  if (act === 'clear') {
    showConfirm('Clear everything and start blank?', 'Yes, clear all').then((ok) => {
      if (!ok) return;
      state = blankState();
      saveState();
      renderAll();
      toast('Cleared');
    });
  }
});

function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'my-cv.json';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('CV downloaded as JSON');
}

$('#fileImport').addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed || !parsed.personal) throw new Error('bad file');
      state = Object.assign(blankState(), parsed);
      saveState();
      renderAll();
      toast('CV imported');
    } catch (_) {
      toast('Could not read that file');
    }
  };
  reader.readAsText(file);
  ev.target.value = '';
});

/* ---------- photo upload (downscaled to keep storage small) ---------- */
$('#photoInput').addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    toast('Please choose an image file');
    ev.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    downscaleImage(reader.result, 256, (dataUrl) => {
      state.personal.photo = dataUrl;
      saveState();
      renderAll();
      toast('Photo added');
    });
  };
  reader.readAsDataURL(file);
  ev.target.value = '';
});

function downscaleImage(dataUrl, maxSize, cb) {
  const img = new Image();
  img.onload = () => {
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    cb(canvas.toDataURL('image/jpeg', 0.85));
  };
  img.onerror = () => toast('Could not read that image');
  img.src = dataUrl;
}

/* ---------- custom font upload ---------- */
$('#fontInput').addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    toast('Font too large (max 2MB)');
    ev.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    state.design.customFontData = reader.result;
    state.design.customFontName = file.name.replace(/\.[^.]+$/, '').slice(0, 24) || 'Custom';
    state.design.font = 'custom';
    registerCustomFont();
    try {
      saveState();
    } catch (_) {
      toast('Font applied for this session (storage full)');
    }
    renderAll();
    toast('Font uploaded');
  };
  reader.readAsDataURL(file);
  ev.target.value = '';
});

/* ---------- custom confirm dialog (styled, mobile-friendly) ---------- */
let confirmResolve = null;
function showConfirm(message, okLabel) {
  return new Promise((resolve) => {
    confirmResolve = resolve;
    $('#confirmMsg').textContent = message;
    $('#confirmOk').textContent = okLabel || 'Yes, continue';
    $('#confirmModal').hidden = false;
  });
}
function closeConfirm(result) {
  $('#confirmModal').hidden = true;
  if (confirmResolve) {
    confirmResolve(result);
    confirmResolve = null;
  }
}
$('#confirmOk').addEventListener('click', () => closeConfirm(true));
$('#confirmCancel').addEventListener('click', () => closeConfirm(false));
$('#confirmModal').addEventListener('click', (e) => {
  if (e.target === $('#confirmModal')) closeConfirm(false);
});

/* ---------- about modal ---------- */
const aboutModal = $('#aboutModal');
$('#btnAbout').addEventListener('click', () => {
  aboutModal.hidden = false;
});
$('#aboutClose').addEventListener('click', () => {
  aboutModal.hidden = true;
});
aboutModal.addEventListener('click', (e) => {
  if (e.target === aboutModal) aboutModal.hidden = true;
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    aboutModal.hidden = true;
    closeConfirm(false);
  }
});

/* ---------- PWA install ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  $('#btnInstall').hidden = false;
});
$('#btnInstall').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  $('#btnInstall').hidden = true;
});
window.addEventListener('appinstalled', () => {
  $('#btnInstall').hidden = true;
  toast('App installed');
});

/* ---------- init ---------- */
document.documentElement.style.setProperty('--accent', state.design.accent || '#4f46e5');
registerCustomFont();
renderAll();
