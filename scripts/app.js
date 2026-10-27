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
          `<button class="tool-chip${i === 0 ? ' active' : ''}" type="button" aria-pressed="${i === 0 ? 'true' : 'false'}" onclick="filterDriveWorks('${escapeHtml(f.key)}', this)">${escapeHtml(f.label)}</button>`
      )
      .join('');
  }

  const devFilterBar = document.getElementById('devFilterBar');
  if (devFilterBar && Array.isArray(data.devFilters)) {
    devFilterBar.innerHTML = data.devFilters
      .map(
        (f, i) =>
          `<button class="tool-chip${i === 0 ? ' active' : ''}" type="button" aria-pressed="${i === 0 ? 'true' : 'false'}" onclick="filterDevWorks('${escapeHtml(f.key)}', this)">${escapeHtml(f.label)}</button>`
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
      const safeId = encodeURIComponent(item.id);
      const thumbUrl = `https://drive.google.com/thumbnail?id=${safeId}&sz=w400`;
      const fallbackThumbUrl = `https://lh3.googleusercontent.com/d/${safeId}=w400`;
      const actionLabel = item.type === 'video' ? 'Putar Video' : 'Buka Gambar';
      const newTag = item.isNew ? '<span class="new-badge">BARU</span>' : '';
      return `
        <div class="work-row"
             tabindex="0"
             role="button"
             onmouseenter="previewDesignStageByIndex(${idx})"
             onfocus="previewDesignStageByIndex(${idx})"
             onclick="openDriveModalByIndex(${idx})"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openDriveModalByIndex(${idx});}">
          <img class="work-thumb" src="${thumbUrl}" onerror="this.onerror=null;this.src='${fallbackThumbUrl}';" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" />
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
    const safeId = encodeURIComponent(item.id);
    imgEl.onerror = function () {
      imgEl.onerror = null;
      imgEl.src = `https://lh3.googleusercontent.com/d/${safeId}=w1000`;
    };
    imgEl.src = `https://drive.google.com/thumbnail?id=${safeId}&sz=w1000`;
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
             tabindex="0"
             role="button"
             onmouseenter="previewDevStageByIndex(${idx})"
             onfocus="previewDevStageByIndex(${idx})"
             onclick="openDevModalByIndex(${idx})"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openDevModalByIndex(${idx});}">
          <img class="work-thumb" src="${escapeHtml(item.img)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" />
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
    const safeId = encodeURIComponent(driveId);
    if (driveId && type === 'video') {
      mediaWrap.className = 'modal-media-wrap video-mode';
      mediaWrap.innerHTML = `<iframe src="https://drive.google.com/file/d/${safeId}/preview" allow="autoplay; fullscreen" title="${escapeHtml(title)}"></iframe>`;
    } else if (driveId) {
      mediaWrap.className = 'modal-media-wrap';
      mediaWrap.innerHTML = `<img src="https://drive.google.com/thumbnail?id=${safeId}&sz=w1600" onerror="this.onerror=null;this.src='https://lh3.googleusercontent.com/d/${safeId}=w1600';" alt="${escapeHtml(title)}" decoding="async" />`;
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
  }
}

function closeModal() {
  currentModalIdx = -1;
  const modalEl = document.getElementById('projectModal');
  if (modalEl) modalEl.classList.remove('open');
  document.getElementById('modalMediaContainer').innerHTML = '';
}

function hydrateProfile() {
  const data = window.PORTFOLIO_DATA;
  if (!data || !data.profile) return;

  const p = data.profile;
  const kickerEl = document.querySelector('.kicker');
  const heroNameEl = document.querySelector('.hero-name');
  const navBrandSpan = document.querySelector('.nav-brand span');
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

function initPortfolio() {
  applyStoredTheme();
  hydrateProfile();
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
