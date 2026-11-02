/**
 * Logika Interaktif Portofolio - Muhammad Al Khairan Asaad
 * Membaca data dari `window.PORTFOLIO_DATA` (`data/portfolio-data.js`).
 */

let currentFilteredDrive = [];
let currentFilteredDev = [];
let currentModalIdx = -1;
let currentStageDriveIdx = 0;
let currentDriveViewMode = 'grid';
let currentDriveFilterKey = 'all';
let currentDriveSearchQuery = '';
let lastFocusedTrigger = null;

const RUBOOTH_MODULES = [
  {
    name: 'Dual-Camera USB PTP & UVC',
    spec: '<strong>Alur Teknis:</strong> Android USB Host API mendeteksi antarmuka UVC untuk <em>stream</em> 30fps bebas jeda di layar sentuh, lalu mengirimkan perintah <code>PTP_OC_InitiateCapture</code> ke Canon EOS saat hitung mundur selesai.'
  },
  {
    name: 'Google Gemini Generative AI',
    spec: '<strong>Alur Teknis:</strong> Foto mentah dari kamera DSLR dikirim secara asinkron ke <em>endpoint</em> multimodal Google Gemini API bersama <em>prompt</em> komposisi pencahayaan studio untuk menghasilkan foto bersama figur idola.'
  },
  {
    name: 'Midtrans Snap QRIS',
    spec: '<strong>Alur Teknis:</strong> Sesi kios terkunci hingga <em>backend</em> memvalidasi status transaksi <code>settlement</code> dari <em>webhook</em> Midtrans Snap QRIS, lalu otomatis membuka antarmuka pemotretan.'
  },
  {
    name: 'Firebase IoT & Epson L8050',
    spec: '<strong>Alur Teknis:</strong> Perubahan <em>state</em> sesi pada Firebase Realtime Database memicu mikrokontroler lampu studio, sementara hasil akhir disusun ke dalam kanvas cetak 3R (300 DPI) untuk dikirim ke Epson L8050.'
  }
];

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
          `<button class="tool-chip${i === 0 ? ' active' : ''}" type="button" aria-pressed="${i === 0 ? 'true' : 'false'}" data-action="filter-drive" data-key="${escapeHtml(f.key)}">${escapeHtml(f.label)}</button>`
      )
      .join('');
  }

  const devFilterBar = document.getElementById('devFilterBar');
  if (devFilterBar && Array.isArray(data.devFilters)) {
    devFilterBar.innerHTML = data.devFilters
      .map(
        (f, i) =>
          `<button class="tool-chip${i === 0 ? ' active' : ''}" type="button" aria-pressed="${i === 0 ? 'true' : 'false'}" data-action="filter-dev" data-key="${escapeHtml(f.key)}">${escapeHtml(f.label)}</button>`
      )
      .join('');
  }
}

function renderDriveList(filterKey) {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  if (typeof filterKey === 'string') {
    currentDriveFilterKey = filterKey;
  }

  const items = data.driveItems || [];
  let byCat = [];
  if (currentDriveFilterKey === 'all') {
    byCat = [...items];
  } else if (currentDriveFilterKey.startsWith('ps-')) {
    byCat = items.filter((i) => i.subcat === currentDriveFilterKey);
  } else {
    byCat = items.filter((i) => i.cat === currentDriveFilterKey);
  }

  const q = currentDriveSearchQuery.trim().toLowerCase();
  if (q) {
    currentFilteredDrive = byCat.filter(
      (i) =>
        String(i.title || '').toLowerCase().includes(q) ||
        String(i.tool || '').toLowerCase().includes(q) ||
        String(i.desc || '').toLowerCase().includes(q)
    );
  } else {
    currentFilteredDrive = byCat;
  }

  const countLabel = document.getElementById('workCountLabel');
  if (countLabel) {
    countLabel.textContent = `${currentFilteredDrive.length} karya ditampilkan`;
  }

  const container = document.getElementById('driveWorkList');
  if (!container) return;

  container.classList.toggle('grid-mode', currentDriveViewMode === 'grid');
  container.classList.toggle('list-mode', currentDriveViewMode === 'list');

  if (currentFilteredDrive.length === 0) {
    container.innerHTML = `
      <div class="empty-search-state">
        <p>Tidak ada karya yang cocok dengan kata kunci <strong>"${escapeHtml(currentDriveSearchQuery)}"</strong>.</p>
        <button type="button" class="stage-expand-btn" data-action="reset-search">Reset Pencarian</button>
      </div>
    `;
    return;
  }

  container.innerHTML = currentFilteredDrive
    .map((item, idx) => {
      const safeId = encodeURIComponent(item.id);
      const thumbUrl = `/assets/works/${safeId}-600.webp`;
      const fallbackThumbUrl = `https://drive.google.com/thumbnail?id=${safeId}&sz=w600`;
      const lh3FallbackUrl = `https://lh3.googleusercontent.com/d/${safeId}=w600`;
      const actionLabel = item.type === 'video' ? 'Putar Video' : 'Perbesar Karya';
      const subText = `${escapeHtml(item.tool)}${item.type === 'video' ? ' &middot; Video' : ''}`;
      const numStr = String(idx + 1).padStart(2, '0');
      const typeLabel = item.type === 'video' ? 'MOTION MP4' : escapeHtml(item.tool);
      return `
        <div class="work-row spotlight-card${idx === 0 ? ' is-selected' : ''}"
             data-drive-idx="${idx}"
             style="--stagger-idx: ${idx % 9};">
          <div class="work-card-top">
            <span class="work-card-idx">NO. ${numStr}</span>
            <span class="work-card-type">${typeLabel}</span>
          </div>
          <div class="work-thumb-wrap">
            <img class="work-thumb" src="${thumbUrl}" onerror="this.onerror=function(){this.onerror=null;this.src='${lh3FallbackUrl}';};this.src='${fallbackThumbUrl}';" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" />
            <div class="thumb-hover-drawer">
              <span>${actionLabel} &nearr;</span>
            </div>
          </div>
          <div class="work-row-info">
            <div class="work-row-text">
              <div class="work-row-name">
                <button type="button" class="work-open" data-action="open-work" data-idx="${idx}">
                  ${escapeHtml(item.title)}
                </button>
              </div>
              <div class="work-row-sub">${subText}</div>
            </div>
            <span class="work-arrow-icon" aria-hidden="true">&nearr;</span>
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

function handleDriveSearch(query) {
  currentDriveSearchQuery = String(query || '');
  renderDriveList(currentDriveFilterKey);
}

function resetDriveSearch() {
  currentDriveSearchQuery = '';
  const input = document.getElementById('driveSearchInput');
  if (input) input.value = '';
  renderDriveList('all');
}

function selectRuboothModule(idx, tileEl) {
  const mod = RUBOOTH_MODULES[idx];
  if (!mod) return;
  document.querySelectorAll('.bento-subgrid .arch-tile').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
    el.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });
  const statusEl = document.getElementById('pipelineActiveStatus');
  const detailEl = document.getElementById('pipelineDetailBox');
  if (statusEl) statusEl.textContent = `Modul Aktif: ${mod.name}`;
  if (detailEl) {
    detailEl.innerHTML = `<div class="pipeline-detail-spec">${mod.spec}</div>`;
  }
}

function setDriveViewMode(mode, btnEl) {
  currentDriveViewMode = mode === 'list' ? 'list' : 'grid';
  const container = document.getElementById('driveWorkList');
  if (container) {
    container.classList.toggle('grid-mode', currentDriveViewMode === 'grid');
    container.classList.toggle('list-mode', currentDriveViewMode === 'list');
  }
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.view-mode-btn').forEach((b) => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
}

let currentCuratedStageIdx = 0;

function getCuratedItems() {
  const data = typeof window !== 'undefined' ? window.PORTFOLIO_DATA : null;
  if (!data || !data.driveItems) return [];
  const ids = data.curatedHighlightIds || [];
  if (ids.length > 0) {
    const list = ids.map((id) => data.driveItems.find((it) => it.id === id)).filter(Boolean);
    if (list.length > 0) return list;
  }
  return data.driveItems.filter((it) => it.isCurated).slice(0, 5);
}

function openCurrentDesignStageModal() {
  const curated = getCuratedItems();
  const currentItem = curated[currentCuratedStageIdx] || currentFilteredDrive[0];
  if (!currentItem) return;

  const driveIdx = currentFilteredDrive.findIndex((it) => it.id === currentItem.id);
  if (driveIdx !== -1) {
    openDriveModalByIndex(driveIdx);
  } else {
    const all = window.PORTFOLIO_DATA?.driveItems || [];
    const allIdx = all.findIndex((it) => it.id === currentItem.id);
    if (allIdx !== -1) {
      currentFilteredDrive = all;
      openDriveModalByIndex(allIdx);
    }
  }
}

function stepDesignStage(delta) {
  const curated = getCuratedItems();
  if (curated.length === 0) return;
  currentCuratedStageIdx = (currentCuratedStageIdx + delta + curated.length) % curated.length;
  previewCuratedStageByIndex(currentCuratedStageIdx);
}

function previewCuratedStageByIndex(idx) {
  const curated = getCuratedItems();
  const item = curated[idx];
  if (!item) return;
  currentCuratedStageIdx = idx;

  const counterEl = document.getElementById('designStageCounter');
  if (counterEl) {
    const numStr = String(idx + 1).padStart(2, '0');
    const totalStr = String(curated.length).padStart(2, '0');
    counterEl.textContent = `NO. ${numStr} / ${totalStr}`;
  }

  const badgeEl = document.getElementById('designStageBadge');
  const titleEl = document.getElementById('designStageTitle');
  const descEl = document.getElementById('designStageDesc');
  const imgEl = document.getElementById('designStageImg');

  if (badgeEl) badgeEl.textContent = item.tool;
  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;
  if (imgEl) {
    const safeId = encodeURIComponent(item.id);
    imgEl.onerror = function () {
      imgEl.onerror = function () {
        imgEl.onerror = null;
        imgEl.src = `https://lh3.googleusercontent.com/d/${safeId}=w1000`;
      };
      imgEl.src = `https://drive.google.com/thumbnail?id=${safeId}&sz=w1200`;
    };
    imgEl.src = `/assets/works/${safeId}-1200.webp`;
    imgEl.alt = item.title;
  }
}

function previewDesignStageByIndex(idx) {
  const item = currentFilteredDrive[idx];
  if (!item) return;
  currentStageDriveIdx = idx;

  const listEl = document.getElementById('driveWorkList');
  if (listEl) {
    listEl.querySelectorAll('.work-row').forEach((row, rIdx) => {
      row.classList.toggle('is-selected', rIdx === idx);
    });
  }

  const counterEl = document.getElementById('designStageCounter');
  if (counterEl) {
    const numStr = String(idx + 1).padStart(2, '0');
    const totalStr = String(currentFilteredDrive.length).padStart(2, '0');
    counterEl.textContent = `NO. ${numStr} / ${totalStr}`;
  }

  const badgeEl = document.getElementById('designStageBadge');
  const titleEl = document.getElementById('designStageTitle');
  const descEl = document.getElementById('designStageDesc');
  const imgEl = document.getElementById('designStageImg');

  if (badgeEl) badgeEl.textContent = item.tool;
  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;
  if (imgEl) {
    const safeId = encodeURIComponent(item.id);
    imgEl.onerror = function () {
      imgEl.onerror = function () {
        imgEl.onerror = null;
        imgEl.src = `https://lh3.googleusercontent.com/d/${safeId}=w1000`;
      };
      imgEl.src = `https://drive.google.com/thumbnail?id=${safeId}&sz=w1200`;
    };
    imgEl.src = `/assets/works/${safeId}-1200.webp`;
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
  if (repoWrap) {
    const driveViewUrl = `https://drive.google.com/file/d/${encodeURIComponent(item.id)}/view`;
    repoWrap.style.display = 'flex';
    repoWrap.innerHTML = `<a href="${driveViewUrl}" target="_blank" rel="noopener noreferrer" class="repo-link-btn">Buka File Asli di Google Drive (${escapeHtml(item.file)}) &nearr;</a>`;
  }

  const highResUrl = `/assets/works/${encodeURIComponent(item.id)}-1200.webp`;
  openModal(
    item.id,
    item.type,
    item.title,
    `${item.tool} (${idx + 1} / ${currentFilteredDrive.length})`,
    item.desc,
    highResUrl,
    [item.tool, item.file, 'Google Drive Portfolio'],
    item.caseStudy
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
        <div class="work-row" data-dev-idx="${idx}">
          <img class="work-thumb" src="${escapeHtml(item.img)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" />
          <div>
            <div class="work-row-name">
              <button type="button" class="work-open" data-action="open-dev" data-idx="${idx}">
                ${escapeHtml(item.title)}
              </button>
            </div>
            <div class="work-row-sub">${escapeHtml(item.sub)}</div>
          </div>
          <div class="work-row-actions">
            <a href="${escapeHtml(item.repoUrl)}" target="_blank" rel="noopener noreferrer" class="work-row-github">
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
    btnEl.parentElement.querySelectorAll('.tool-chip').forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btnEl.classList.add('active');
    btnEl.setAttribute('aria-pressed', 'true');
  }
  renderDriveList(cat);
}

function filterDevWorks(cat, btnEl) {
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.tool-chip').forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btnEl.classList.add('active');
    btnEl.setAttribute('aria-pressed', 'true');
  }
  renderDevList(cat);
}

function renderCaseStudy(caseStudy) {
  const wrap = document.getElementById('modalCaseStudyWrap');
  if (!wrap) return;
  if (!caseStudy || caseStudy.confirmed !== true) {
    wrap.style.display = 'none';
    wrap.innerHTML = '';
    return;
  }
  wrap.style.display = 'block';
  wrap.innerHTML = `
    <div class="case-study-card">
      <div class="case-study-head">
        <span class="case-study-tag">STUDI KASUS // PROJECT HIGHLIGHT</span>
        <span class="case-study-client">${escapeHtml(caseStudy.client || '')}</span>
      </div>
      <div class="case-study-grid">
        <div class="case-study-col">
          <strong>Peran:</strong>
          <p>${escapeHtml(caseStudy.role || '')}</p>
        </div>
        <div class="case-study-col">
          <strong>Tantangan:</strong>
          <p>${escapeHtml(caseStudy.problem || '')}</p>
        </div>
        <div class="case-study-col">
          <strong>Solusi Visual:</strong>
          <p>${escapeHtml(caseStudy.solution || '')}</p>
        </div>
        <div class="case-study-col">
          <strong>Dampak:</strong>
          <p>${escapeHtml(caseStudy.impact || '')}</p>
        </div>
      </div>
    </div>
  `;
}

function openModal(driveId, type, title, category, desc, fallbackImg, tags, caseStudy) {
  if (typeof document !== 'undefined' && document.activeElement) {
    lastFocusedTrigger = document.activeElement;
  }
  const catEl = document.getElementById('modalCategory');
  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');
  const mediaWrap = document.getElementById('modalMediaContainer');
  const tagsWrap = document.getElementById('modalTags');
  const modalEl = document.getElementById('projectModal');

  if (catEl) catEl.textContent = String(category || '').toUpperCase();
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;

  renderCaseStudy(caseStudy);

  if (mediaWrap) {
    const safeId = encodeURIComponent(driveId);
    if (driveId && type === 'video') {
      mediaWrap.className = 'modal-media-wrap video-mode';
      mediaWrap.innerHTML = `<iframe src="https://drive.google.com/file/d/${safeId}/preview" allow="autoplay; fullscreen" title="${escapeHtml(title)}"></iframe>`;
    } else if (driveId) {
      mediaWrap.className = 'modal-media-wrap';
      mediaWrap.innerHTML = `<img src="/assets/works/${safeId}-1200.webp" onerror="this.onerror=function(){this.onerror=null;this.src='https://lh3.googleusercontent.com/d/${safeId}=w1600';};this.src='https://drive.google.com/thumbnail?id=${safeId}&sz=w1600';" alt="${escapeHtml(title)}" decoding="async" />`;
    } else {
      mediaWrap.className = 'modal-media-wrap';
      mediaWrap.innerHTML = `<img src="${escapeHtml(fallbackImg)}" alt="${escapeHtml(title)}" decoding="async" />`;
    }
  }

  if (tagsWrap) {
    tagsWrap.innerHTML = (tags || []).map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
  }

  if (modalEl) {
    modalEl.classList.add('open');
    const closeBtn = modalEl.querySelector('.modal-close');
    if (closeBtn && typeof closeBtn.focus === 'function') {
      closeBtn.focus();
    } else if (typeof modalEl.focus === 'function') {
      modalEl.focus();
    }
  }
}

function closeModal() {
  currentModalIdx = -1;
  const modalEl = document.getElementById('projectModal');
  if (modalEl) modalEl.classList.remove('open');
  if (document.getElementById('modalMediaContainer')) {
    document.getElementById('modalMediaContainer').innerHTML = '';
  }
  renderCaseStudy(null);
  if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
    lastFocusedTrigger.focus();
    lastFocusedTrigger = null;
  }
}

function hydrateProfile() {
  const data = window.PORTFOLIO_DATA;
  if (!data || !data.profile) return;

  const p = data.profile;
  const kickerEl = document.querySelector('.kicker');
  const heroNameEl = document.querySelector('.hero-name');
  const navBrandSpan = document.querySelector('.nav-brand-name') || document.querySelector('.nav-brand span');
  const navAvatarEl = document.querySelector('.nav-avatar');
  const heroAvatarEl = document.querySelector('#tiltCard img');
  const bioEl = document.getElementById('personaBio');
  const metricValues = document.querySelectorAll('.metric-value');

  if (kickerEl && p.kicker) kickerEl.textContent = p.kicker;
  if (heroNameEl && p.name) heroNameEl.textContent = p.name;
  if (navBrandSpan && p.name) navBrandSpan.textContent = p.name;
  if (navAvatarEl && p.avatarUrl) navAvatarEl.src = p.avatarUrl;
  if (heroAvatarEl && p.avatarUrl) heroAvatarEl.src = p.avatarUrl;
  if (bioEl && data.personas && data.personas.hybrid) {
    bioEl.innerHTML = data.personas.hybrid;
  }
  if (metricValues.length >= 3) {
    if (p.institution) metricValues[0].textContent = p.institution;
    if (p.gpa) metricValues[1].textContent = p.gpa;
    if (p.roleSummary) metricValues[2].textContent = p.roleSummary;
  }

  const emailBtn = document.getElementById('contactEmailBtn');
  if (emailBtn && p.email) {
    emailBtn.href = `mailto:${p.email}`;
    emailBtn.innerHTML = `Email: ${escapeHtml(p.email)} &nearr;`;
  }
  const githubBtn = document.getElementById('contactGithubBtn');
  if (githubBtn && p.githubProfileUrl) {
    githubBtn.href = p.githubProfileUrl;
  }
  const driveBtn = document.getElementById('contactDriveBtn');
  if (driveBtn && p.driveFolderUrl) {
    driveBtn.href = p.driveFolderUrl;
  }
  const linkedinBtn = document.getElementById('contactLinkedinBtn');
  if (linkedinBtn) {
    if (p.linkedinUrl) {
      linkedinBtn.href = p.linkedinUrl;
      linkedinBtn.style.display = 'inline-flex';
    } else {
      linkedinBtn.style.display = 'none';
    }
  }
  const whatsappBtn = document.getElementById('contactWhatsappBtn');
  if (whatsappBtn) {
    if (p.whatsappUrl) {
      whatsappBtn.href = p.whatsappUrl;
      whatsappBtn.style.display = 'inline-flex';
    } else {
      whatsappBtn.style.display = 'none';
    }
  }
  const cvBtn = document.getElementById('contactCvBtn');
  const heroCvBtn = document.getElementById('heroCvBtn');
  if (cvBtn) {
    if (p.cvUrl) {
      cvBtn.href = p.cvUrl;
      cvBtn.style.display = 'inline-flex';
    } else {
      cvBtn.style.display = 'none';
    }
  }
  if (heroCvBtn) {
    if (p.cvUrl) {
      heroCvBtn.href = p.cvUrl;
      heroCvBtn.style.display = 'inline-flex';
    } else {
      heroCvBtn.style.display = 'none';
    }
  }
}

function copyEmailToClipboard(btnEl) {
  const email = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.profile && window.PORTFOLIO_DATA.profile.email) || 'alkhairan18@gmail.com';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(() => {
      showCopyFeedback(btnEl);
    }).catch(() => {
      fallbackCopyText(email, btnEl);
    });
  } else {
    fallbackCopyText(email, btnEl);
  }
}

function fallbackCopyText(text, btnEl) {
  const input = document.createElement('textarea');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
    showCopyFeedback(btnEl);
  } catch (_) {
    prompt('Salin email Anda:', text);
  }
  document.body.removeChild(input);
}

function showCopyFeedback(btnEl) {
  if (!btnEl) return;
  const label = btnEl.querySelector('.copy-label') || btnEl;
  const original = label.textContent;
  label.textContent = 'Email Tersalin! ✓';
  btnEl.classList.add('copied');
  setTimeout(() => {
    label.textContent = original;
    btnEl.classList.remove('copied');
  }, 2200);
}

function syncThemeButtonLabel() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.setAttribute('aria-label', isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap');
  const labelEl = btn.querySelector('.theme-btn-label');
  const iconEl = btn.querySelector('.theme-btn-icon');
  if (labelEl) {
    labelEl.textContent = isDark ? 'Mode Terang' : 'Mode Gelap';
  } else {
    btn.textContent = isDark ? 'Mode Terang' : 'Mode Gelap';
  }
  if (iconEl) iconEl.textContent = isDark ? '☼' : '☾';
}

function applyStoredTheme() {
  try {
    const saved = localStorage.getItem('khairan_portfolio_theme');
    if (saved === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (_) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  syncThemeButtonLabel();
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
  syncThemeButtonLabel();
}

function setPersona(key, btnEl) {
  const data = window.PORTFOLIO_DATA;
  if (!data || !data.personas) return;
  document.querySelectorAll('.persona-btn').forEach((b) => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  if (btnEl) {
    btnEl.classList.add('active');
    btnEl.setAttribute('aria-selected', 'true');
  }
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

function initSpotlightAndMagnetic() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  document.addEventListener('pointermove', (e) => {
    const card = e.target && e.target.closest ? e.target.closest('.spotlight-card') : null;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  });

  document.querySelectorAll('.magnetic-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.14;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
      btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

function handleGlobalClick(e) {
  if (e.target && e.target.closest && e.target.closest('a[target="_blank"]')) {
    e.stopPropagation();
  }
  const actionEl = e.target && e.target.closest ? e.target.closest('[data-action]') : null;
  if (!actionEl) return;
  const action = actionEl.getAttribute('data-action');

  switch (action) {
    case 'toggle-theme':
      toggleTheme();
      break;
    case 'persona': {
      const key = actionEl.getAttribute('data-key');
      setPersona(key, actionEl);
      break;
    }
    case 'filter-drive': {
      const key = actionEl.getAttribute('data-key');
      filterDriveWorks(key, actionEl);
      break;
    }
    case 'filter-dev': {
      const key = actionEl.getAttribute('data-key');
      filterDevWorks(key, actionEl);
      break;
    }
    case 'view-mode': {
      const mode = actionEl.getAttribute('data-mode');
      setDriveViewMode(mode, actionEl);
      break;
    }
    case 'step-stage': {
      const delta = parseInt(actionEl.getAttribute('data-delta') || '1', 10);
      stepDesignStage(delta);
      break;
    }
    case 'open-stage': {
      openCurrentDesignStageModal();
      break;
    }
    case 'open-work': {
      const idx = parseInt(actionEl.getAttribute('data-idx') || '0', 10);
      openDriveModalByIndex(idx);
      break;
    }
    case 'reset-search': {
      resetDriveSearch();
      break;
    }
    case 'open-dev': {
      const idx = parseInt(actionEl.getAttribute('data-idx') || '0', 10);
      openDevModalByIndex(idx);
      break;
    }
    case 'select-module': {
      const idx = parseInt(actionEl.getAttribute('data-idx') || '0', 10);
      selectRuboothModule(idx, actionEl);
      break;
    }
    case 'close-modal': {
      if (actionEl.id === 'projectModal' && e.target !== actionEl) {
        return;
      }
      closeModal();
      break;
    }
    case 'step-modal': {
      const delta = parseInt(actionEl.getAttribute('data-delta') || '1', 10);
      stepModal(delta);
      break;
    }
    case 'copy-email': {
      copyEmailToClipboard(actionEl);
      break;
    }
    case 'dock-link': {
      const targetId = actionEl.getAttribute('data-target');
      const targetEl = targetId ? document.getElementById(targetId) : null;
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      break;
    }
  }
}

function initMobileDockTracking() {
  const dock = document.querySelector('.mobile-dock');
  if (!dock) return;
  const sections = ['perkenalan', 'bagian-desain', 'bagian-development', 'kontak'];
  const items = Array.from(dock.querySelectorAll('.mobile-dock-item'));

  function updateActiveDock() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = sections[0];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) {
        currentId = id;
      }
    }
    items.forEach((item) => {
      const target = item.getAttribute('data-target');
      item.classList.toggle('active', target === currentId);
    });
  }

  window.addEventListener('scroll', updateActiveDock, { passive: true });
  updateActiveDock();
}

function initPortfolio() {
  applyStoredTheme();
  hydrateProfile();
  renderFilterBars();
  renderDriveList('all');
  renderDevList('all');
  previewCuratedStageByIndex(0);
  initMobileDockTracking();
  initTiltCard();
  initSpotlightAndMagnetic();

  document.addEventListener('click', handleGlobalClick);

  const searchInput = document.getElementById('driveSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleDriveSearch(e.target.value);
    });
  }

  window.addEventListener('keydown', (e) => {
    const modalEl = document.getElementById('projectModal');
    const isModalOpen = modalEl && modalEl.classList.contains('open');

    if (isModalOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepModal(1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepModal(-1);
        return;
      }
      if (e.key === 'Tab') {
        const focusables = Array.from(
          modalEl.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);

        if (focusables.length > 0) {
          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstEl || !modalEl.contains(document.activeElement)) {
              e.preventDefault();
              lastEl.focus();
            }
          } else {
            if (document.activeElement === lastEl || !modalEl.contains(document.activeElement)) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
      }
    }
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }
}

if (typeof window !== 'undefined') {
  window.toggleTheme = toggleTheme;
  window.setPersona = setPersona;
  window.filterDriveWorks = filterDriveWorks;
  window.filterDevWorks = filterDevWorks;
  window.handleDriveSearch = handleDriveSearch;
  window.resetDriveSearch = resetDriveSearch;
  window.setDriveViewMode = setDriveViewMode;
  window.openCurrentDesignStageModal = openCurrentDesignStageModal;
  window.stepDesignStage = stepDesignStage;
  window.previewCuratedStageByIndex = previewCuratedStageByIndex;
  window.getCuratedItems = getCuratedItems;
  window.previewDesignStageByIndex = previewDesignStageByIndex;
  window.openDriveModalByIndex = openDriveModalByIndex;
  window.stepModal = stepModal;
  window.closeModal = closeModal;
  window.openDevModalByIndex = openDevModalByIndex;
  window.previewDevStageByIndex = previewDevStageByIndex;
  window.selectRuboothModule = selectRuboothModule;
  window.copyEmailToClipboard = copyEmailToClipboard;
  window.renderCaseStudy = renderCaseStudy;
}

