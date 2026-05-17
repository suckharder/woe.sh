// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  articles: null,
  current:  null,
  expanded: new Set(),
  query:    '',
  tocScrollHandler: null,
  usedSlugs: new Map(),
  typewriter: { timeout: null, phrase: 0, char: 0, deleting: false },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const el = id => document.getElementById(id);

function slugify(str) {
  return str
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .trim();
}

function groupByCategory(articles) {
  const map = new Map();
  for (const a of articles) {
    if (!map.has(a.category)) map.set(a.category, { label: a.categoryLabel, articles: [] });
    map.get(a.category).articles.push(a);
  }
  return map;
}

// ─── Theme resolution ─────────────────────────────────────────────────────────
async function resolveTheme() {
  const defaults = {
    colors: null,
    header: 'partials/header.partial',
    footer: 'partials/footer.partial',
  };

  let holidays;
  try {
    const res = await fetch('holidays.json');
    if (!res.ok) return defaults;
    ({ holidays } = await res.json());
  } catch { return defaults; }

  const now   = new Date();
  const month = now.getMonth() + 1;
  const day   = now.getDate();

  for (const holiday of holidays) {
    const match = holiday.ranges.some(r => r.month === month && day >= r.from && day <= r.to);
    if (match) {
      return {
        colors: holiday.colors  ?? null,
        header: holiday.header  ? `partials/${holiday.header}` : defaults.header,
        footer: holiday.footer  ? `partials/${holiday.footer}` : defaults.footer,
      };
    }
  }

  return defaults;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Configure marked
  const renderer = new marked.Renderer();
  renderer.heading = function (text, level, raw) {
    const base = slugify(raw || text);
    const count = state.usedSlugs.get(base) || 0;
    state.usedSlugs.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    return `<h${level} id="${id}">${text}</h${level}>\n`;
  };
  marked.setOptions({ renderer, gfm: true, breaks: false });

  // Resolve holiday theme from holidays.json
  const theme = await resolveTheme();

  // Swap colors stylesheet if a holiday theme is active
  if (theme.colors) {
    document.getElementById('colors-stylesheet').setAttribute('href', theme.colors);
  }

  // Load partials + articles index in parallel
  try {
    const [headerHTML, footerHTML, articlesRes] = await Promise.all([
      fetch(theme.header).then(r => { if (!r.ok) throw new Error(`header ${r.status}`); return r.text(); }),
      fetch(theme.footer).then(r => { if (!r.ok) throw new Error(`footer ${r.status}`); return r.text(); }),
      fetch('articles.json').then(r => { if (!r.ok) throw new Error(`articles.json ${r.status}`); return r.json(); }),
    ]);
    el('site-header').outerHTML = headerHTML;
    el('site-footer').outerHTML = footerHTML;
    state.articles = articlesRes.articles;
    // Expand all categories by default
    state.articles.forEach(a => state.expanded.add(a.category));
  } catch (err) {
    showScreen('error');
    el('err-title').textContent = 'Failed to initialise';
    el('err-msg').textContent   = err.message;
    return;
  }

  // Collapse / expand all button
  el('collapse-btn').addEventListener('click', () => {
    const allCats = [...new Set(state.articles.map(a => a.category))];
    const allCollapsed = state.expanded.size === 0;
    allCollapsed
      ? allCats.forEach(c => state.expanded.add(c))
      : state.expanded.clear();
    renderSidebar();
  });

  // Search
  el('search-input').addEventListener('input', e => {
    state.query = e.target.value.toLowerCase().trim();
    renderSidebar();
  });

  // Route
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
});

// ─── Typewriter ───────────────────────────────────────────────────────────────
const TYPEWRITER_PHRASES = [
  'Curated awesome lists',
  'FOSS love',
  'Piracy. Arrgh!',
  'Not a blog',
];

function typewriterStart() {
  const tw = state.typewriter;
  clearTimeout(tw.timeout);
  tw.phrase = 0; tw.char = 0; tw.deleting = false;
  typewriterTick();
}

function typewriterStop() {
  clearTimeout(state.typewriter.timeout);
}

function typewriterTick() {
  const typed  = el('hero-typed');
  const cursor = el('hero-cursor');
  if (!typed || !cursor) return;

  const tw     = state.typewriter;
  const phrase = TYPEWRITER_PHRASES[tw.phrase];

  if (tw.deleting) {
    tw.char--;
    typed.textContent = phrase.slice(0, tw.char);
    if (tw.char === 0) {
      tw.deleting = false;
      tw.phrase   = (tw.phrase + 1) % TYPEWRITER_PHRASES.length;
      tw.timeout  = setTimeout(typewriterTick, 350);
    } else {
      tw.timeout = setTimeout(typewriterTick, 35);
    }
  } else {
    tw.char++;
    typed.textContent = phrase.slice(0, tw.char);
    if (tw.char === phrase.length) {
      tw.timeout = setTimeout(() => { tw.deleting = true; typewriterTick(); }, 2200);
    } else {
      tw.timeout = setTimeout(typewriterTick, 85);
    }
  }
}

// ─── Mobile sidebar ───────────────────────────────────────────────────────────
function toggleSidebar(open) {
  document.getElementById('left-sidebar')?.classList.toggle('open', open);
  el('sidebar-overlay')?.classList.toggle('open', open);
}

// ─── Routing ──────────────────────────────────────────────────────────────────
function handleRoute() {
  toggleSidebar(false);
  const hash = location.hash;

  // Heading anchors (#some-heading) don't start with #/ — let the browser
  // handle the scroll natively and don't treat them as navigation routes.
  if (hash && !hash.startsWith('#/')) return;

  const path = hash.replace(/^#\/?/, '');
  if (!path) { showHome(); return; }

  const [cat, id] = path.split('/');
  if (cat && id) {
    const article = state.articles?.find(a => a.category === cat && a.id === id);
    if (article) { loadArticle(article); return; }
  }

  showScreen('error');
  el('err-title').textContent = 'Page not found';
  el('err-msg').textContent   = `No article at ${hash}`;
}

// ─── Screen management ────────────────────────────────────────────────────────
function showScreen(name) {
  el('home-screen').style.display  = name === 'home'    ? 'block' : 'none';
  el('article-view').style.display = name === 'article' ? 'block' : 'none';
  el('error-screen').style.display = name === 'error'   ? 'block' : 'none';
  el('home-blob').style.display    = name === 'home'    ? 'block' : 'none';
  el('home-blob-2').style.display  = name === 'home'    ? 'block' : 'none';
  if (name !== 'article') el('toc-panel').style.display = 'none';
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function showHome() {
  state.current = null;
  renderSidebar();
  showScreen('home');
  document.title = 'woe.sh';
  window.scrollTo({ top: 0, behavior: 'instant' });
  renderHomeArticles();
  typewriterStart();
}

function renderHomeArticles() {
  if (!state.articles) return;
  const groups = new Map(
    [...groupByCategory(state.articles).entries()].sort((a, b) => a[1].label.localeCompare(b[1].label))
  );

  el('home-categories').innerHTML = [...groups.entries()].map(([catId, cat]) => `
    <section style="margin-bottom: 4rem;">
      <h2 style="
        font-size: 0.6875rem; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.14em; color: var(--text-muted); margin-bottom: 1.5rem;
        display: flex; align-items: center; gap: 0.875rem;">
        <span style="flex: 1; height: 1px; background: var(--border);"></span>
        ${cat.label}
        <span style="flex: 1; height: 1px; background: var(--border);"></span>
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem;">
        ${cat.articles.map((a, i) => `
          <a href="#/${catId}/${a.id}" class="home-card" data-extra="${i >= 4}" style="
            display: ${i >= 4 ? 'none' : 'flex'}; flex-direction: column;
            padding: 1.625rem;
            background: rgba(17,17,17,0.45); border: 1px solid var(--border);
            backdrop-filter: blur(14px) saturate(160%);
            -webkit-backdrop-filter: blur(14px) saturate(160%);
            border-radius: 1rem; text-decoration: none;
            transition: border-color 0.2s, background 0.2s;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem;">
              <span style="
                font-size: 0.625rem; font-weight: 600; text-transform: uppercase;
                letter-spacing: 0.12em; color: var(--accent);
                background: var(--accent-dim); padding: 0.2rem 0.625rem;
                border-radius: 9999px;">${cat.label}</span>
              <ion-icon name="arrow-forward-outline" style="
                font-size: 1rem; color: var(--text-muted); flex-shrink: 0;
                margin-top: 0.1rem; transition: color 0.2s;"></ion-icon>
            </div>
            <div style="font-weight: 600; font-size: 1rem; color: var(--text-primary); line-height: 1.4; margin-bottom: 0.625rem;">${a.title}</div>
            ${a.description ? `<div style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.65; flex: 1;">${a.description}</div>` : ''}
            ${a.tags?.length ? `
              <div style="margin-top: 1.125rem; display: flex; flex-wrap: wrap; gap: 0.3rem;">
                ${a.tags.map(t => `<span style="
                  font-size: 0.625rem; font-weight: 500; text-transform: uppercase;
                  letter-spacing: 0.05em; padding: 0.15rem 0.5rem; border-radius: 9999px;
                  background: var(--bg-elevated); border: 1px solid var(--border);
                  color: var(--text-muted);">${t}</span>`).join('')}
              </div>` : ''}
          </a>`).join('')}
      </div>
      ${cat.articles.length > 4 ? `
        <button class="show-more-btn" data-cat="${catId}" style="
          margin-top: 1rem; width: 100%; font-family: inherit;
          font-size: 0.8125rem; font-weight: 500; cursor: pointer;
          background: none; border: 1px solid var(--border);
          color: var(--text-secondary); border-radius: 0.75rem;
          padding: 0.625rem; transition: border-color 0.15s, color 0.15s;">
          Show ${cat.articles.length - 4} more
        </button>` : ''}
    </section>`).join('');

  el('home-categories').querySelectorAll('.home-card').forEach(card => {
    card.addEventListener('mouseover', () => {
      card.style.borderColor = 'var(--accent)';
      card.style.background  = 'rgba(26,26,26,0.55)';
    });
    card.addEventListener('mouseout', () => {
      card.style.borderColor = 'var(--border)';
      card.style.background  = 'rgba(17,17,17,0.45)';
    });
  });

  el('home-categories').querySelectorAll('.show-more-btn').forEach(btn => {
    btn.addEventListener('mouseover', () => { btn.style.borderColor = 'var(--accent)'; btn.style.color = 'var(--accent)'; });
    btn.addEventListener('mouseout',  () => { btn.style.borderColor = 'var(--border)'; btn.style.color = 'var(--text-secondary)'; });
    btn.addEventListener('click', () => {
      const grid = btn.previousElementSibling;
      grid.querySelectorAll('.home-card[data-extra="true"]').forEach(card => {
        card.style.display = 'flex';
      });
      btn.remove();
    });
  });
}

// ─── Article ──────────────────────────────────────────────────────────────────
async function loadArticle(article) {
  typewriterStop();
  state.current = article;
  renderSidebar();
  showScreen('article');
  document.title = `${article.title} — woe.sh`;
  window.scrollTo({ top: 0, behavior: 'instant' });

  el('article-body').innerHTML = '<p style="color: var(--text-muted); font-style: italic; padding: 2rem 0;">Loading…</p>';
  el('article-meta').innerHTML = '';
  el('toc-panel').style.display = 'none';

  let markdown;
  try {
    const res = await fetch(article.file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    markdown = await res.text();
  } catch (err) {
    showScreen('error');
    el('err-title').textContent = 'Failed to load article';
    el('err-msg').textContent   = `Could not fetch "${article.file}": ${err.message}`;
    return;
  }

  state.usedSlugs = new Map();
  el('article-body').innerHTML = marked.parse(markdown);
  el('article-body').querySelectorAll('table').forEach(table => {
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
  addCopyButtons();

  // Rebase relative image/media paths to the article's own folder.
  // marked renders src="flowers.jpg" but the browser resolves it from the
  // root (index.html location), not from where the .md file lives.
  const articleDir = article.file.substring(0, article.file.lastIndexOf('/') + 1);
  el('article-body').querySelectorAll('img, source, video').forEach(node => {
    ['src', 'srcset'].forEach(attr => {
      const val = node.getAttribute(attr);
      if (val && !val.match(/^(https?:|data:|\/)/)) {
        node.setAttribute(attr, articleDir + val);
      }
    });
  });

  el('article-meta').innerHTML = `
    <nav style="
      margin-bottom: 2rem; font-size: 0.75rem; font-weight: 500;
      text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted);
      display: flex; align-items: center; gap: 0.4rem;">
      <a href="#/" style="color: var(--text-muted); text-decoration: none;"
        onmouseover="this.style.color='var(--accent)'"
        onmouseout="this.style.color='var(--text-muted)'">woe.sh</a>
      <span>›</span>
      <span>${article.categoryLabel}</span>
    </nav>
    ${article.tags?.length ? `
      <div style="margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 0.375rem;">
        ${article.tags.map(t => `<span style="
          font-size: 0.65rem; font-weight: 500; text-transform: uppercase;
          letter-spacing: 0.05em; padding: 0.2rem 0.625rem; border-radius: 9999px;
          background: var(--bg-elevated); border: 1px solid var(--border);
          color: var(--text-muted);">${t}</span>`).join('')}
      </div>` : ''}`;

  buildTOC();
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function renderSidebar() {
  if (!state.articles) return;

  // Sync collapse button label
  const btn = el('collapse-btn');
  if (btn) btn.textContent = state.expanded.size === 0 ? 'Expand all' : 'Collapse all';

  const q = state.query;

  const filtered = q
    ? state.articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.categoryLabel.toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.toLowerCase().includes(q)))
    : state.articles;

  const groups = new Map(
    [...groupByCategory(filtered).entries()].sort((a, b) => a[1].label.localeCompare(b[1].label))
  );
  const nav = el('nav-categories');

  if (!groups.size) {
    nav.innerHTML = `<p style="padding: 0.875rem; font-size: 0.8125rem; color: var(--text-muted);">No results for "${q}"</p>`;
    return;
  }

  nav.innerHTML = [...groups.entries()].map(([catId, cat]) => {
    const expanded = !!q || state.expanded.has(catId) || state.current?.category === catId;

    const items = cat.articles.map(a => {
      const active = state.current?.id === a.id && state.current?.category === a.category;
      return `
        <li>
          <a href="#/${a.category}/${a.id}" class="nav-link" data-active="${active}" style="
            display: flex; align-items: flex-start; gap: 0.5rem;
            padding: 0.35rem 0.625rem; border-radius: 0.625rem;
            font-size: 0.8125rem; text-decoration: none; line-height: 1.4;
            color: ${active ? 'var(--accent)' : 'var(--text-secondary)'};
            background: ${active ? 'var(--accent-dim)' : 'transparent'};
            font-weight: ${active ? '500' : '400'};
            transition: background 0.1s, color 0.1s;">
            <ion-icon name="document-text-outline" style="
              font-size: 0.75rem; flex-shrink: 0; margin-top: 0.2rem;
              color: ${active ? 'var(--accent)' : 'var(--text-muted)'};"></ion-icon>
            <span>${a.title}</span>
          </a>
        </li>`;
    }).join('');

    return `
      <div style="margin-bottom: 0.125rem;">
        <button class="cat-toggle" data-cat="${catId}" style="
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 0.425rem 0.625rem; border-radius: 0.625rem;
          border: none; cursor: pointer; background: transparent; font-family: inherit;
          font-size: 0.6875rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-muted); text-align: left;
          transition: background 0.1s, color 0.1s;">
          <span>${cat.label}</span>
          <ion-icon name="${expanded ? 'chevron-down-outline' : 'chevron-forward-outline'}" style="font-size: 0.6875rem;"></ion-icon>
        </button>
        <ul style="list-style: none; margin: 0.125rem 0 0.25rem 0.5rem; padding: 0;
          ${expanded ? '' : 'display: none;'}" data-cat-list="${catId}">
          ${items}
        </ul>
      </div>`;
  }).join('');

  // Hover — article links
  nav.querySelectorAll('.nav-link').forEach(a => {
    if (a.dataset.active === 'true') return;
    a.addEventListener('mouseover', () => { a.style.background = 'var(--bg-elevated)'; a.style.color = 'var(--text-primary)'; });
    a.addEventListener('mouseout',  () => { a.style.background = 'transparent';        a.style.color = 'var(--text-secondary)'; });
  });

  // Hover + click — category toggles
  nav.querySelectorAll('.cat-toggle').forEach(btn => {
    btn.addEventListener('mouseover', () => { btn.style.background = 'var(--bg-elevated)'; btn.style.color = 'var(--text-secondary)'; });
    btn.addEventListener('mouseout',  () => { btn.style.background = 'transparent';        btn.style.color = 'var(--text-muted)'; });
    btn.addEventListener('click', () => {
      const catId = btn.dataset.cat;
      state.expanded.has(catId) ? state.expanded.delete(catId) : state.expanded.add(catId);
      renderSidebar();
    });
  });
}

// ─── Copy buttons ────────────────────────────────────────────────────────────
function addCopyButtons() {
  el('article-body').querySelectorAll('pre').forEach(pre => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position: relative;';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = '<ion-icon name="copy-outline"></ion-icon>';
    btn.addEventListener('click', () => {
      const text = pre.querySelector('code')?.innerText ?? pre.innerText;
      navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = '<ion-icon name="copy-outline"></ion-icon>';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
    wrapper.appendChild(btn);
  });
}

// ─── TOC ──────────────────────────────────────────────────────────────────────
function buildTOC() {
  if (state.tocScrollHandler) { window.removeEventListener('scroll', state.tocScrollHandler); state.tocScrollHandler = null; }

  const headings = [...el('article-body').querySelectorAll('h2, h3')];
  if (headings.length < 2) { el('toc-panel').style.display = 'none'; return; }

  el('toc-panel').style.display = 'block';

  el('toc-list').innerHTML = headings.map(h => {
    const isH3 = h.tagName === 'H3';
    return `
      <li style="${isH3 ? 'padding-left: 0.875rem;' : ''}">
        <a href="#${h.id}" class="toc-link" data-id="${h.id}" style="
          display: block; font-size: ${isH3 ? '0.75rem' : '0.8rem'};
          padding: 0.25rem 0.625rem; text-decoration: none;
          color: var(--text-secondary); line-height: 1.45;
          border-left: 2px solid transparent;
          transition: color 0.1s, border-color 0.1s;">
          ${h.textContent}
        </a>
      </li>`;
  }).join('');

  el('toc-list').querySelectorAll('.toc-link').forEach(a => {
    a.addEventListener('mouseover', () => { if (!a.classList.contains('toc-active')) a.style.color = 'var(--text-primary)'; });
    a.addEventListener('mouseout',  () => { if (!a.classList.contains('toc-active')) a.style.color = 'var(--text-secondary)'; });
  });

  const onScroll = () => {
    const threshold = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 24;
    let active = headings[0];
    for (const h of headings) {
      if (h.getBoundingClientRect().top <= threshold) active = h;
    }
    if (active) setActiveTOC(active.id);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  state.tocScrollHandler = onScroll;
}

function setActiveTOC(id) {
  el('toc-list').querySelectorAll('.toc-link').forEach(a => {
    const active = a.dataset.id === id;
    a.classList.toggle('toc-active', active);
    a.style.color           = active ? 'var(--accent)'      : 'var(--text-secondary)';
    a.style.borderLeftColor = active ? 'var(--accent)'      : 'transparent';
    a.style.fontWeight      = active ? '500'                : '400';
  });
}
