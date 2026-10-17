/**
 * Logika Interaktif Portofolio — Muhammad Al Khairan Asaad
 * Membaca data dari `window.PORTFOLIO_DATA` (`data/portfolio-data.js`).
 */

let currentFilteredDrive = [];
let currentFilteredDev = [];
let currentModalIdx = -1;

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderFilterBars() {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const driveFilterBar = document.getElementById('driveFilterBar');
  if (driveFilterBar && Array.isArray(data.driveFilters)) {
    driveFilterBar.innerHTML = data.driveFilters
      .map(
        (f, i) =>
          `<button class="tool-chip${i === 0 ? ' active' : ''}" type="button" onclick="filterDriveWorks('${escapeHtml(f.key)}', this)">${escapeHtml(f.label)}</button>`
      )
      .join('');
  }

  const devFilterBar = document.getElementById('devFilterBar');
  if (devFilterBar && Array.isArray(data.devFilters)) {
    devFilterBar.innerHTML = data.devFilters
      .map(
        (f, i) =>
          `<button class="tool-chip${i === 0 ? ' active' : ''}" type="button" onclick="filterDevWorks('${escapeHtml(f.key)}', this)">${escapeHtml(f.label)}</button>`
      )
      .join('');
  }
}

function renderDriveList(filterKey) {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const items = data.driveItems || [];
  if (filterKey === 'all') {
    currentFilteredDrive = [...items];
  } else if (filterKey.startsWith('ps-')) {
    currentFilteredDrive = items.filter((i) => i.subcat === filterKey);
  } else {
    currentFilteredDrive = items.filter((i) => i.cat === filterKey);
  }

  const countLabel = document.getElementById('workCountLabel');
  if (countLabel) {
    countLabel.textContent = `MENAMPILKAN ${currentFilteredDrive.length} KARYA PADA KATEGORI INI (GULIR UNTUK LIHAT SEMUA)`;
  }

  const container = document.getElementById('driveWorkList');
  if (!container) return;

  container.innerHTML = currentFilteredDrive
    .map((item, idx) => {
      const thumbUrl = `https://drive.google.com/thumbnail?id=${encodeURIComponent(item.id)}&sz=w400`;
      const actionLabel = item.type === 'video' ? 'Putar Video' : 'Buka Gambar';
      const newTag = item.isNew ? '<span class="new-badge">BARU</span>' : '';
      return `
        <div class="work-row"
             onmouseenter="previewDesignStageByIndex(${idx})"
             onclick="openDriveModalByIndex(${idx})">
          <img class="work-thumb" src="${thumbUrl}" alt="${escapeHtml(item.title)}" loading="lazy" />
          <div>
            <div class="work-row-name">${escapeHtml(item.title)}${newTag}</div>
            <div class="work-row-sub">${escapeHtml(item.tool)} &middot; ${escapeHtml(item.file)}</div>
          </div>
          <span class="work-row-cta">${actionLabel}</span>
        </div>
      `;
    })
    .join('');

  if (currentFilteredDrive.length > 0) {
    previewDesignStageByIndex(0);
  }
}

function previewDesignStageByIndex(idx) {
  const item = currentFilteredDrive[idx];
  if (!item) return;

  const badgeEl = document.getElementById('designStageBadge');
  const titleEl = document.getElementById('designStageTitle');
  const descEl = document.getElementById('designStageDesc');
  const imgEl = document.getElementById('designStageImg');

  if (badgeEl) badgeEl.textContent = item.tool.toUpperCase();
  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;
  if (imgEl) {
    imgEl.src = `https://drive.google.com/thumbnail?id=${encodeURIComponent(item.id)}&sz=w1000`;
    imgEl.alt = item.title;
  }
}

function openDriveModalByIndex(idx) {
  currentModalIdx = idx;
  const item = currentFilteredDrive[idx];
  if (!item) return;

  const prevBtn = document.getElementById('prevModalBtn');
  const nextBtn = document.getElementById('nextModalBtn');
  const repoWrap = document.getElementById('modalRepoWrap');
  if (prevBtn) prevBtn.style.display = 'inline-block';
  if (nextBtn) nextBtn.style.display = 'inline-block';
  if (repoWrap) repoWrap.style.display = 'none';

  const highResUrl = `https://drive.google.com/thumbnail?id=${encodeURIComponent(item.id)}&sz=w1600`;
  openModal(
    item.id,
    item.type,
    item.title,
    `${item.tool} (${idx + 1} / ${currentFilteredDrive.length})`,
    item.desc,
    highResUrl,
    [item.tool, item.file, 'Google Drive Portfolio']
  );
}

function stepModal(delta) {
  if (currentModalIdx < 0 || currentFilteredDrive.length === 0) return;
  const nextIdx = (currentModalIdx + delta + currentFilteredDrive.length) % currentFilteredDrive.length;
  openDriveModalByIndex(nextIdx);
}

function renderDevList(filterKey) {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const items = data.devItems || [];
  currentFilteredDev = filterKey === 'all' ? [...items] : items.filter((i) => i.cat === filterKey);

  const container = document.getElementById('devWorkList');
  if (!container) return;

  container.innerHTML = currentFilteredDev
    .map((item, idx) => {
      return `
        <div class="work-row"
             onmouseenter="previewDevStageByIndex(${idx})"
             onclick="openDevModalByIndex(${idx})">
          <img class="work-thumb" src="${escapeHtml(item.img)}" alt="${escapeHtml(item.title)}" loading="lazy" />
          <div>
            <div class="work-row-name">${escapeHtml(item.title)}</div>
            <div class="work-row-sub">${escapeHtml(item.sub)}</div>
          </div>
          <div class="work-row-actions">
            <a href="${escapeHtml(item.repoUrl)}" target="_blank" rel="noopener noreferrer" class="work-row-github" onclick="event.stopPropagation()">
              GitHub &nearr;
            </a>
            <span class="work-row-cta">Detail</span>
          </div>
        </div>
      `;
    })
    .join('');

  if (currentFilteredDev.length > 0) {
    previewDevStageByIndex(0);
  }
}

function previewDevStageByIndex(idx) {
  const item = currentFilteredDev[idx];
  if (!item) return;

  const badgeEl = document.getElementById('devStageBadge');
  const titleEl = document.getElementById('devStageTitle');
  const descEl = document.getElementById('devStageDesc');
  const imgEl = document.getElementById('devStageImg');
  const repoBtn = document.getElementById('devStageRepoLink');

  if (badgeEl) badgeEl.textContent = item.badge;
  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;
  if (imgEl) {
    imgEl.src = item.img;
    imgEl.alt = item.title;
  }
  if (repoBtn && item.repoUrl) {
    repoBtn.href = item.repoUrl;
    repoBtn.innerHTML = `Buka Proyek di GitHub (${escapeHtml(item.repoLabel)}) &nearr;`;
  }
}

function openDevModalByIndex(idx) {
  currentModalIdx = -1;
  const item = currentFilteredDev[idx];
  if (!item) return;

  const prevBtn = document.getElementById('prevModalBtn');
  const nextBtn = document.getElementById('nextModalBtn');
  const repoWrap = document.getElementById('modalRepoWrap');
  if (prevBtn) prevBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';

  if (repoWrap) {
    if (item.repoUrl) {
      repoWrap.style.display = 'flex';
      repoWrap.innerHTML = `<a href="${escapeHtml(item.repoUrl)}" target="_blank" rel="noopener noreferrer" class="repo-link-btn">Buka Kode Sumber di GitHub (${escapeHtml(item.repoLabel)}) &nearr;</a>`;
    } else {
      repoWrap.style.display = 'none';
    }
  }

  openModal('', item.type || 'image', item.title, 'SOFTWARE DEVELOPMENT · GITHUB.COM/ALKHAIRAN18', item.desc, item.img, item.tags);
}

function filterDriveWorks(cat, btnEl) {
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.tool-chip').forEach((b) => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  renderDriveList(cat);
}

function filterDevWorks(cat, btnEl) {
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.tool-chip').forEach((b) => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  renderDevList(cat);
}

function openModal(driveId, type, title, category, desc, fallbackImg, tags) {
  const catEl = document.getElementById('modalCategory');
  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');
  const mediaWrap = document.getElementById('modalMediaContainer');
  const tagsWrap = document.getElementById('modalTags');
  const modalEl = document.getElementById('projectModal');

  if (catEl) catEl.textContent = String(category || '').toUpperCase();
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;

  if (mediaWrap) {
    if (driveId && type === 'video') {
      mediaWrap.className = 'modal-media-wrap video-mode';
      mediaWrap.innerHTML = `<iframe src="https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview" allow="autoplay; fullscreen"></iframe>`;
    } else if (driveId) {
      mediaWrap.className = 'modal-media-wrap';
      mediaWrap.innerHTML = `<img src="https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1600" alt="${escapeHtml(title)}" />`;
    } else {
      mediaWrap.className = 'modal-media-wrap';
      mediaWrap.innerHTML = `<img src="${escapeHtml(fallbackImg)}" alt="${escapeHtml(title)}" />`;
    }
  }

  if (tagsWrap) {
    tagsWrap.innerHTML = (tags || []).map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
  }

  if (modalEl) {
    modalEl.classList.add('open');
  }
}

function closeModal() {
  const modalEl = document.getElementById('projectModal');
  if (modalEl) modalEl.classList.remove('open');
  document.getElementById('modalMediaContainer').innerHTML = '';
}

function applyStoredTheme() {
  try {
    const saved = localStorage.getItem('khairan_portfolio_theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  } catch (_) {
    // Abaikan jika localStorage diblokir browser
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const nextIsDark = root.getAttribute('data-theme') !== 'dark';
  if (nextIsDark) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  try {
    localStorage.setItem('khairan_portfolio_theme', nextIsDark ? 'dark' : 'light');
  } catch (_) {
    // Abaikan jika localStorage diblokir browser
  }
}

function setPersona(key, btnEl) {
  const data = window.PORTFOLIO_DATA;
  if (!data || !data.personas) return;
  document.querySelectorAll('.persona-btn').forEach((b) => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  const bioEl = document.getElementById('personaBio');
  if (bioEl && data.personas[key]) {
    bioEl.innerHTML = data.personas[key];
  }
}

function initTiltCard() {
  const tiltCard = document.getElementById('tiltCard');
  if (!tiltCard) return;
  tiltCard.addEventListener('mousemove', (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

function initPortfolio() {
  applyStoredTheme();
  renderFilterBars();
  renderDriveList('all');
  renderDevList('all');
  initTiltCard();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') stepModal(1);
    if (e.key === 'ArrowLeft') stepModal(-1);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }
}
