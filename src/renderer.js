const state = {
  tabs: [],
  activeTab: null,
  workspaces: [
    { id: 'personal', name: 'Personal', icon: '◈', gradient: 'linear-gradient(135deg,#3ba5ff,#6b6cff)' },
    { id: 'work', name: 'Trabajo', icon: '◉', gradient: 'linear-gradient(135deg,#53d6c4,#4f7aff)' },
    { id: 'temp', name: 'Temporal', icon: '◇', gradient: 'linear-gradient(135deg,#a18aff,#6aa3ff)' }
  ],
  workspace: 'personal',
  searchEngine: localStorage.getItem('nexaSearchEngine') || 'https://www.google.com/search?q=',
  glass: Number(localStorage.getItem('nexaGlass') || 70),
  focusMode: false
};

const $ = (id) => document.getElementById(id);
const content = $('content');
const tabsEl = $('tabs');

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1900);
}

function setGlass(value) {
  state.glass = Number(value);
  document.documentElement.style.setProperty('--glass', String(state.glass / 100));
  $('glassValue').textContent = `${state.glass}%`;
  localStorage.setItem('nexaGlass', String(state.glass));
}

function renderWorkspaces() {
  $('workspaceList').innerHTML = state.workspaces.map(w => `
    <button class="sidebar-item ${w.id === state.workspace ? 'active' : ''}" data-workspace="${w.id}">
      <span class="workspace-dot" style="background:${w.gradient}"></span>${w.icon} ${w.name}
    </button>
  `).join('');
  document.querySelectorAll('[data-workspace]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.workspace = btn.dataset.workspace;
      renderWorkspaces();
      showToast(`Espacio: ${state.workspaces.find(w => w.id === state.workspace).name}`);
    });
  });
}

function createHome(tabId) {
  return `
    <section class="home">
      <div class="hero">
        <span class="eyebrow">NEXA BROWSER</span>
        <h1>Tu web. Más privada. Más tuya.</h1>
        <p>Navegación inteligente, espacios de trabajo, sincronización cifrada y una interfaz glassmorphism diseñada para sentirse rápida y suave.</p>
        <form class="search-big" data-search-form="${tabId}">
          <span>⌕</span>
          <input data-search-input="${tabId}" placeholder="Buscar en la web…" />
          <button type="submit">Buscar</button>
        </form>
        <div class="grid">
          <article class="card"><span class="badge">Privacidad</span><h3>Protección Nexa</h3><p>Bloqueo básico de anuncios y rastreadores integrado en este MVP.</p></article>
          <article class="card"><span class="badge">Espacios</span><h3>Workspaces</h3><p>Separa trabajo, personal y sesiones temporales con identidad visual propia.</p></article>
          <article class="card"><span class="badge">IA</span><h3>IA opcional</h3><p>El diseño reserva la IA para funciones activables y procesamiento local cuando sea posible.</p></article>
          <article class="card"><span class="badge">Experimental</span><h3>Comparar páginas</h3><p>Preparado como función experimental del lanzamiento Nexa 1.0.</p></article>
        </div>
      </div>
    </section>`;
}

function createPanel(type) {
  const map = {
    favorites: ['Favoritos', 'Tus páginas guardadas aparecerán aquí.', ['MDN Web Docs', 'OpenAI', 'Wikipedia']],
    history: ['Historial', 'Actividad reciente de navegación.', ['Nexa: Inicio', 'Documentación Electron', 'Panel de trabajo']],
    downloads: ['Descargas', 'Limpieza automática y estado de descargas.', ['Carpeta de descargas', 'Historial de archivos']],
    extensions: ['Extensiones', 'Compatibilidad prevista con extensiones de Firefox y extensiones aisladas.', ['Gestor de extensiones', 'Herramientas de desarrollador', 'API Nexa']],
    quick: ['Acciones rápidas', 'Accesos configurables para tu flujo.', ['Nueva ventana privada', 'Nuevo espacio temporal', 'Limpiar datos de sesión']],
    dashboard: ['Panel personalizable', 'Todos los widgets definidos para Nexa están disponibles como módulos.', ['Clima', 'Noticias', 'Calendario', 'Notas rápidas', 'Favoritos', 'Historial reciente', 'Descargas', 'Acciones rápidas', 'Estadísticas', 'Multimedia', 'Webs personalizadas', 'Widgets de extensiones', 'Widget de IA']]
  };
  const item = map[type];
  if (!item) return null;
  return `<section class="panel"><span class="eyebrow">NEXA</span><h2>${item[0]}</h2><p class="panel-sub">${item[1]}</p><div class="panel-list grid">${item[2].map(x => `<article class="card"><h3>${x}</h3><p>Preparado para la implementación de Nexa 1.0.</p></article>`).join('')}</div></section>`;
}

function createNotesPanel() {
  const saved = localStorage.getItem('nexaNotes') || '';
  return `<section class="panel"><span class="eyebrow">NOTAS</span><h2>Notas</h2><p class="panel-sub">Notas locales rápidas para cada sesión.</p><div class="note-box"><textarea id="notesArea" class="note-area" placeholder="Escribe una nota…">${saved.replace(/</g, '&lt;')}</textarea></div></section>`;
}

function createAIPanel() {
  return `<section class="panel"><span class="eyebrow">IA OPCIONAL</span><h2>IA privada</h2><p class="panel-sub">MVP: interfaz preparada para traducción, escritura y automatización. El motor local se integrará en la siguiente capa.</p><div class="grid"><article class="card"><h3>Traductor inteligente</h3><p>Acción de traducción preparada para conectarse a un modelo local.</p></article><article class="card"><h3>Asistente de escritura</h3><p>Corrección y redacción en contexto.</p></article><article class="card"><h3>Automatización</h3><p>Flujos de trabajo controlados por el usuario.</p></article></div></section>`;
}

function renderPanel(type = 'home') {
  if (state.activeTab === null) return;
  if (type === 'home') content.innerHTML = createHome(state.activeTab);
  else if (type === 'notes') content.innerHTML = createNotesPanel();
  else if (type === 'ai') content.innerHTML = createAIPanel();
  else content.innerHTML = createPanel(type) || createHome(state.activeTab);
  bindContentActions(type);
}

function bindContentActions(type) {
  const form = content.querySelector('.search-big');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    navigate(input.value);
  });
  const notes = $('notesArea');
  if (notes) notes.addEventListener('input', () => localStorage.setItem('nexaNotes', notes.value));
}

function normalizeUrl(value) {
  const raw = value.trim();
  if (!raw) return 'https://www.google.com';
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(raw)) return raw;
  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) return `https://${raw}`;
  return `${state.searchEngine}${encodeURIComponent(raw)}`;
}

function renderTabs() {
  tabsEl.innerHTML = state.tabs.map(tab => `
    <div class="tab ${tab.id === state.activeTab ? 'active' : ''}" data-tab="${tab.id}">
      <span>${tab.private ? '◐' : '◌'}</span>
      <span class="tab-title">${tab.title || 'Nueva pestaña'}</span>
      <button class="tab-close" data-close="${tab.id}" title="Cerrar">×</button>
    </div>
  `).join('');
  document.querySelectorAll('[data-tab]').forEach(el => el.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) return;
    state.activeTab = el.dataset.tab;
    mountTabView();
  }));
  document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(btn.dataset.close);
  }));
}

function mountTabView() {
  renderTabs();
  const tab = state.tabs.find(t => t.id === state.activeTab);
  if (!tab) return;
  content.innerHTML = '';
  if (!tab.webview) {
    const view = document.createElement('webview');
    view.className = 'browser-view';
    view.setAttribute('allowpopups', 'false');
    view.src = tab.url || 'about:blank';
    view.addEventListener('did-navigate', () => syncTabFromView(tab, view));
    view.addEventListener('did-navigate-in-page', () => syncTabFromView(tab, view));
    view.addEventListener('page-title-updated', (e) => { tab.title = e.title || tab.title; renderTabs(); });
    view.addEventListener('did-fail-load', () => showToast('No se pudo cargar la página'));
    view.addEventListener('new-window', (e) => { if (window.nexa) window.nexa.openExternal(e.url); });
    tab.webview = view;
  }
  content.appendChild(tab.webview);
  if (tab.url && tab.url !== 'about:home') $('address').value = tab.url;
}

function addTab(url = 'about:home') {
  const id = `tab-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const tab = { id, title: 'Nueva pestaña', url, workspace: state.workspace, webview: null };
  state.tabs.push(tab);
  state.activeTab = id;
  renderTabs();
  if (url === 'about:home') renderPanel('home');
  else mountTabView();
}

function closeTab(id) {
  const index = state.tabs.findIndex(t => t.id === id);
  if (index < 0) return;
  const [tab] = state.tabs.splice(index, 1);
  try { tab.webview?.remove(); } catch {}
  if (state.tabs.length === 0) addTab();
  else {
    state.activeTab = state.tabs[Math.max(0, index - 1)].id;
    mountTabView();
  }
}

function navigate(value) {
  const tab = state.tabs.find(t => t.id === state.activeTab);
  if (!tab) return;
  const url = normalizeUrl(value);
  tab.url = url;
  if (tab.webview) tab.webview.loadURL(url);
  else mountTabView();
}

function syncTabFromView(tab, view) {
  tab.url = view.getURL();
  $('address').value = tab.url;
  tab.title = view.getTitle() || tab.title;
  renderTabs();
}

$('newTab').addEventListener('click', () => addTab());
$('backBtn').addEventListener('click', () => state.tabs.find(t => t.id === state.activeTab)?.webview?.goBack());
$('forwardBtn').addEventListener('click', () => state.tabs.find(t => t.id === state.activeTab)?.webview?.goForward());
$('reloadBtn').addEventListener('click', () => state.tabs.find(t => t.id === state.activeTab)?.webview?.reload());
$('addressForm').addEventListener('submit', (e) => { e.preventDefault(); navigate($('address').value); });
$('focusBtn').addEventListener('click', () => {
  state.focusMode = !state.focusMode;
  document.body.classList.toggle('focus-mode', state.focusMode);
  showToast(state.focusMode ? 'Modo concentración activado' : 'Modo concentración desactivado');
});
$('compareBtn').addEventListener('click', () => showToast('Comparar páginas está marcado como experimental en Nexa 1.0'));
$('sidebarBtn').addEventListener('click', () => $('sidebar').classList.toggle('collapsed'));
$('addWorkspace').addEventListener('click', () => {
  const name = `Espacio ${state.workspaces.length + 1}`;
  state.workspaces.push({ id: `ws-${Date.now()}`, name, icon: '◇', gradient: 'linear-gradient(135deg,#77c7ff,#8f7dff)' });
  renderWorkspaces();
  showToast(`${name} creado`);
});

$('settingsBtn').addEventListener('click', () => {
  $('searchEngine').value = state.searchEngine;
  $('glass').value = state.glass;
  $('glassValue').textContent = `${state.glass}%`;
  $('settingsDialog').showModal();
});
$('closeSettings').addEventListener('click', () => $('settingsDialog').close());
$('glass').addEventListener('input', e => setGlass(e.target.value));
$('saveSettings').addEventListener('click', () => {
  state.searchEngine = $('searchEngine').value;
  localStorage.setItem('nexaSearchEngine', state.searchEngine);
  $('settingsDialog').close();
  showToast('Configuración guardada');
});
$('recommendSettings').addEventListener('click', () => {
  setGlass(72);
  $('theme').value = 'auto';
  $('privacyToggle').checked = true;
  $('aiToggle').checked = true;
  showToast('Ajustes recomendados aplicados');
});
$('importSettings').addEventListener('click', () => showToast('Importación de configuración: próxima fase'));

document.querySelectorAll('[data-panel]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('[data-panel]').forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  if (btn.dataset.panel === 'home') renderPanel('home');
  else if (btn.dataset.panel === 'notes') renderPanel('notes');
  else if (btn.dataset.panel === 'ai') renderPanel('ai');
  else renderPanel(btn.dataset.panel);
}));

setGlass(state.glass);
renderWorkspaces();
addTab();
