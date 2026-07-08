const assetFallbacks = {
  reference: ['assets/reference.png', '橱窗管理/assets/reference.png', 'reference.png'],
  sampleProduct1: ['assets/sample/product-1.png', 'product-1.png', '橱窗管理/assets/sample/product-1.png'],
  sampleProduct2: ['assets/sample/product-2.png', 'product-2.png', '橱窗管理/assets/sample/product-2.png'],
};
const reference = assetFallbacks.reference[0];

function imageMarkup(srcList, alt = '') {
  const [primary, ...fallbacks] = srcList;
  const fallbackAttr = fallbacks.length ? ` data-fallback-srcs="${fallbacks.join('|')}"` : '';
  return `<img src="${primary}"${fallbackAttr} alt="${alt}" />`;
}

function useFallbackImage(img) {
  const fallbacks = (img.dataset.fallbackSrcs || '').split('|').filter(Boolean);
  if (!fallbacks.length) return false;
  const [next, ...rest] = fallbacks;
  img.dataset.fallbackSrcs = rest.join('|');
  img.src = next;
  return true;
}

document.addEventListener('error', (event) => {
  if (event.target instanceof HTMLImageElement) {
    useFallbackImage(event.target);
  }
}, true);

function hydrateImageFallbacks() {
  document.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (!src || img.dataset.fallbackSrcs) return;
    if (src === 'assets/reference.png') {
      img.dataset.fallbackSrcs = assetFallbacks.reference.slice(1).join('|');
    }
    if (src === 'assets/sample/product-1.png') {
      img.dataset.fallbackSrcs = assetFallbacks.sampleProduct1.slice(1).join('|');
    }
    if (src === 'assets/sample/product-2.png') {
      img.dataset.fallbackSrcs = assetFallbacks.sampleProduct2.slice(1).join('|');
    }
    if (img.complete && img.naturalWidth === 0) {
      useFallbackImage(img);
    }
  });
}

const products = [
  { id: 1, image: 1, title: '方形吸管杯牛奶果汁杯创意高值耐热水杯', price: '88', sales: 13, commission: 30, invest: 5, target: null, targetInvest: null, link: 'other', directed: false, commissionType: 'single', quickTags: [], status: ['all'], benefit: '', currentDropped: false, currentExpire: false, targetDropped: false, targetExpire: false, scene: '卡片1 · 单佣普通' },
  { id: 2, image: 1, title: '方形吸管杯牛奶果汁杯创意高值耐热水杯', price: '88', sales: 13, commission: 30, invest: 5, target: null, targetInvest: null, link: 'other', directed: false, commissionType: 'single', quickTags: ['down'], status: ['all'], benefit: '', currentDropped: true, currentExpire: false, targetDropped: false, targetExpire: false, scene: '卡片2 · 单佣降佣' },
  { id: 3, image: 1, title: '方形吸管杯牛奶果汁杯创意高值耐热水杯', price: '88', sales: 13, commission: 30, invest: null, target: null, targetInvest: null, link: 'boss', directed: false, commissionType: 'single', quickTags: [], status: ['all'], benefit: '立即领取20金币', currentDropped: false, currentExpire: false, targetDropped: false, targetExpire: false, scene: '卡片3 · 单佣金币' },
  { id: 4, image: 1, title: '方形吸管杯牛奶果汁杯创意高值耐热水杯', price: '88', sales: 13, commission: 30, invest: null, target: null, targetInvest: null, link: 'boss', directed: false, commissionType: 'single', quickTags: ['down', 'expire'], status: ['all'], benefit: '', currentDropped: true, currentExpire: true, targetDropped: false, targetExpire: false, scene: '卡片4 · 单佣降佣到期' },
  { id: 5, image: 1, title: '方形吸管杯牛奶果汁杯创意高值耐热水杯', price: '88', sales: 13, commission: 30, invest: 5, target: 35, targetInvest: 5, link: 'other', directed: false, commissionType: 'double', quickTags: [], status: ['all', 'upgrade'], benefit: '预计多赚 ¥2.00', currentDropped: false, currentExpire: false, targetDropped: false, targetExpire: false, scene: '卡片5 · 可换高佣（预估多赚）' },
  { id: 6, image: 1, title: '方形吸管杯牛奶果汁杯创意高值耐热水杯', price: '88', sales: 13, commission: 30, invest: 5, target: 30, targetInvest: 5, link: 'other', directed: false, commissionType: 'double', quickTags: ['down', 'expire'], status: ['all', 'upgrade'], benefit: '可领金币', currentDropped: true, currentExpire: false, targetDropped: false, targetExpire: true, scene: '卡片6 · 可换高佣（领金币）' },
  { id: 7, image: 1, title: '方形吸管杯牛奶果汁杯创意高值耐热水杯', price: '88', sales: 13, commission: 30, invest: 5, target: 35, targetInvest: 5, link: 'other', directed: false, commissionType: 'double', quickTags: [], status: ['all', 'upgrade'], benefit: '预计多赚 ¥2.00', currentDropped: false, currentExpire: false, targetDropped: false, targetExpire: false, scene: '卡片7 · 可换高佣（预估多赚）' },
  { id: 8, image: 1, title: '方形吸管杯牛奶果汁杯创意高值耐热水杯', price: '88', sales: 13, commission: 30, invest: 5, target: 30, targetInvest: 5, link: 'other', directed: false, commissionType: 'double', quickTags: ['down', 'expire'], status: ['all', 'upgrade'], benefit: '可领金币', currentDropped: true, currentExpire: true, targetDropped: false, targetExpire: true, scene: '卡片8 · 可换高佣（领金币+风险）' },
];

const state = { tab: 'all', quickFilter: null, search: '', selected: new Set(), sales: 'all', link: 'all', directed: 'all', commissionType: 'all', upgraded: new Set(), whitelist: new Set() };
const $ = (selector) => document.querySelector(selector);
const list = $('#productList');
const toast = $('#toast');
const automationState = { detect: false, release: false, reminder: true };
const automationCopy = {
  detect: {
    title: '确定关闭自动升佣？',
    description: '关闭后，机构下所有账号橱窗商品将不再自动替换为更高佣金链接。',
    enabledToast: '自动升佣已开启',
    disabledToast: '自动升佣已关闭',
  },
  release: {
    title: '确定关闭自动清理？',
    description: '关闭后，系统将不再自动检测并释放僵尸品坑位。',
    enabledToast: '自动清理已开启',
    disabledToast: '自动清理已关闭',
  },
  reminder: {
    title: '确定关闭首页提醒？',
    description: '关闭后将不再收到订单首页橱窗商品升佣的弹窗提醒。',
    enabledToast: '首页提醒已开启',
    disabledToast: '首页提醒已关闭',
  },
};
let pendingAutomationClose = null;

function showPage(name) {
  $('#homePage').hidden = name !== 'home';
  $('#showcasePage').hidden = name !== 'showcase';
  $('#samplePage').hidden = name !== 'sample';
  closeLayers();
  if (name !== 'showcase') {
    $('#recordPage').hidden = true;
    $('#recordPage').setAttribute('aria-hidden', 'true');
  }
}

function visibleProducts() {
  return products.filter((p) => {
    const tabMatch = state.tab === 'all' || (state.tab === 'whitelist' ? state.whitelist.has(p.id) : p.status.includes(state.tab));
    const keyword = state.search.trim().toLowerCase();
    const searchMatch = !keyword || p.title.toLowerCase().includes(keyword) || String(p.id).includes(keyword);
    const salesMatch = state.sales === 'all' || (state.sales === 'yes' ? p.sales > 0 : p.sales === 0);
    const linkMatch = state.link === 'all' || p.link === state.link;
    const directedMatch = state.directed === 'all' || (state.directed === 'merchant' ? p.directed : !p.directed);
    const commissionTypeMatch = state.commissionType === 'all' || p.commissionType === state.commissionType;
    const quickMatch = !state.quickFilter || p.quickTags.includes(state.quickFilter);
    return tabMatch && searchMatch && salesMatch && linkMatch && directedMatch && commissionTypeMatch && quickMatch;
  });
}

function productTemplate(p) {
  const checked = state.selected.has(p.id) ? 'checked' : '';
  const done = state.upgraded.has(p.id);
  const whitelisted = state.whitelist.has(p.id);
  const whitelistButton = state.tab === 'all'
    ? `<button class="whitelist-btn ${whitelisted ? 'is-added' : ''}" data-whitelist-action="${whitelisted ? 'added' : 'add'}" ${whitelisted ? 'disabled' : ''}>${whitelisted ? '已在白名单' : '加入白名单'}</button>`
    : state.tab === 'whitelist'
      ? '<button class="whitelist-btn remove" data-whitelist-action="remove">移出白名单</button>'
      : '';
  const upgradeButton = whitelisted
    ? '<button class="upgrade-btn protected" disabled>白名单保护</button>'
    : p.commissionType === 'double'
      ? `<button class="upgrade-btn ${done ? 'done' : ''}" ${done ? 'disabled' : ''}>${done ? '升级成功' : '升级商品'}</button>`
      : '<button class="upgrade-btn unavailable" disabled>无需升级</button>';
  const hasUpgrade = p.commissionType === 'double';
  const hasRateGain = hasUpgrade && p.target > p.commission;
  const linkText = p.link === 'boss' ? '抖老板链接' : '非抖老板链接';
  const riskFlags = `${p.currentDropped || p.targetDropped ? '<small class="status danger">商品降佣<i class="status-help" title="该商品佣金已降低">?</i></small>' : ''}${p.currentExpire || p.targetExpire ? '<small class="status warning">7日内计划到期<i class="status-help" title="计划将在7日内到期">?</i></small>' : ''}`;
  const investText = p.invest == null ? '' : `<em>投放 ${p.invest}%</em>`;
  const targetInvestText = p.targetInvest == null ? '' : `<em>投放 ${p.targetInvest}%</em>`;
  const opportunityText = hasUpgrade
    ? hasRateGain
      ? `<small class="opportunity gain">${p.benefit}</small>`
      : '<small class="opportunity coin">升级可领金币</small>'
    : '';
  const targetDetails = `${targetInvestText}${opportunityText}`;
  return `<article class="product-card" data-id="${p.id}">
    <span class="scene-label">${p.scene}</span>
    <label class="pick"><input type="checkbox" ${checked} aria-label="选择${p.title}"/><i></i></label>
    <div class="product-main">
      <span class="crop product-image img-${p.image}">${imageMarkup(assetFallbacks.reference, p.title)}</span>
      <div class="product-info">
        <h2 class="product-title">${p.title}</h2>
        <div class="metrics"><span class="price">¥<b>${p.price}</b></span><span class="sales">我的近30日出单：${p.sales}</span></div>
        <div class="product-statuses">${riskFlags}</div>
      </div>
    </div>
    <div class="commission-strip ${hasUpgrade ? 'has-upgrade' : 'single-commission'} ${hasRateGain ? 'has-rate-gain' : 'same-rate'}">
      <div class="commission current"><span>橱窗佣金</span><strong><b>${p.commission}%</b>${investText}</strong></div>
      ${hasUpgrade ? `<span class="commission-arrow" aria-hidden="true">→</span><div class="commission target"><span>抖老板高佣</span><strong><b>${p.target}%</b>${targetDetails}</strong></div>${upgradeButton}` : ''}
    </div>
    <div class="card-actions">
      <span class="creator"><span class="crop avatar">${imageMarkup(assetFallbacks.reference)}</span><span>热心宇宙人</span><i>·</i><em>${linkText}</em></span>
      <span class="card-buttons">${whitelistButton}</span>
    </div>
  </article>`;
}

function render() {
  const showQuickFilters = state.tab === 'all' || state.tab === 'upgrade';
  if (!showQuickFilters && state.quickFilter) {
    state.quickFilter = null;
    document.querySelectorAll('[data-quick-filter]').forEach((item) => item.classList.remove('active'));
  }
  const visible = visibleProducts();
  list.innerHTML = visible.map(productTemplate).join('');
  $('#emptyState').hidden = visible.length > 0;
  $('#emptyTitle').textContent = state.tab === 'whitelist' ? '白名单暂无商品' : '暂时没有符合条件的商品';
  $('#emptyDescription').hidden = state.tab !== 'whitelist';
  $('#whitelistCount').textContent = state.whitelist.size;
  $('#selectedCount').textContent = `(${state.selected.size}/${products.length})`;
  const allVisibleSelected = visible.length > 0 && visible.every((p) => state.selected.has(p.id));
  $('#selectAll').checked = allVisibleSelected;
  $('#upgradeAllBtn').disabled = state.tab === 'whitelist';
  const showBatchWhitelist = state.tab === 'all' || state.tab === 'upgrade';
  $('#addWhitelistBtn').hidden = !showBatchWhitelist;
  $('#bottomBar').classList.toggle('no-whitelist-action', !showBatchWhitelist);
  document.querySelectorAll('[data-quick-filter]').forEach((item) => { item.hidden = !showQuickFilters; });
  $('#quickFilters').classList.toggle('no-quick-actions', !showQuickFilters);
  hydrateImageFallbacks();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function openLayer(target) {
  $('#mask').hidden = false;
  target.classList.add('open');
  target.setAttribute('aria-hidden', 'false');
}

function closeLayers() {
  $('#mask').hidden = true;
  document.querySelectorAll('.drawer.open,.modal.open').forEach((el) => {
    el.classList.remove('open'); el.setAttribute('aria-hidden', 'true');
  });
  pendingAutomationClose = null;
}

function updateAutomationSwitch(name) {
  const button = document.querySelector(`[data-automation="${name}"]`);
  const enabled = automationState[name];
  button.classList.toggle('is-on', enabled);
  button.setAttribute('aria-checked', String(enabled));
}

$('#tabs').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-tab]');
  if (!button) return;
  state.tab = button.dataset.tab;
  document.querySelectorAll('#tabs button').forEach((item) => item.classList.toggle('active', item === button));
  button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  render();
});

$('#searchInput').addEventListener('input', (event) => { state.search = event.target.value; render(); });

$('#quickFilters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-quick-filter]');
  if (!button) return;
  const value = button.dataset.quickFilter;
  state.quickFilter = state.quickFilter === value ? null : value;
  document.querySelectorAll('[data-quick-filter]').forEach((item) => item.classList.toggle('active', item.dataset.quickFilter === state.quickFilter));
  render();
});

list.addEventListener('change', (event) => {
  if (!event.target.matches('.pick input')) return;
  const id = Number(event.target.closest('.product-card').dataset.id);
  event.target.checked ? state.selected.add(id) : state.selected.delete(id);
  render();
});

list.addEventListener('click', (event) => {
  const whitelistButton = event.target.closest('[data-whitelist-action]');
  if (whitelistButton) {
    const id = Number(whitelistButton.closest('.product-card').dataset.id);
    const action = whitelistButton.dataset.whitelistAction;
    if (action === 'add') {
      state.whitelist.add(id);
      state.upgraded.delete(id);
      showToast('已加入白名单，该商品将受到保护');
    }
    if (action === 'remove') {
      state.whitelist.delete(id);
      state.selected.delete(id);
      showToast('已移出白名单');
    }
    render();
    return;
  }
  const button = event.target.closest('.upgrade-btn');
  if (!button) return;
  const id = Number(button.closest('.product-card').dataset.id);
  state.upgraded.add(id);
  showToast('商品升级成功');
  render();
});

$('#selectAll').addEventListener('change', (event) => {
  visibleProducts().forEach((p) => event.target.checked ? state.selected.add(p.id) : state.selected.delete(p.id));
  render();
});

$('#deleteBtn').addEventListener('click', () => showToast(state.selected.size ? `已选择 ${state.selected.size} 件，删除为 Demo 操作` : '请先选择商品'));
$('#addWhitelistBtn').addEventListener('click', () => {
  if (!state.selected.size) {
    showToast('请先选择商品');
    return;
  }
  const ids = [...state.selected].filter((id) => !state.whitelist.has(id));
  if (!ids.length) {
    showToast('所选商品已在白名单中');
    return;
  }
  ids.forEach((id) => {
    state.whitelist.add(id);
    state.upgraded.delete(id);
  });
  showToast(`已将 ${ids.length} 件商品加入白名单`);
  render();
});
$('#addCartBtn').addEventListener('click', () => showToast(state.selected.size ? `已将 ${state.selected.size} 件加入抖音选品车` : '请先选择商品'));
$('#upgradeAllBtn').addEventListener('click', () => {
  const candidates = state.selected.size ? [...state.selected] : visibleProducts().map((p) => p.id);
  const ids = candidates.filter((id) => !state.whitelist.has(id));
  if (!ids.length) {
    showToast('白名单商品不参与升级');
    return;
  }
  ids.forEach((id) => state.upgraded.add(id));
  showToast(`已完成 ${ids.length} 件商品升级`);
  render();
});

$('#filterBtn').addEventListener('click', () => openLayer($('#filterDrawer')));
$('#recordBtn').addEventListener('click', () => {
  $('#recordPage').hidden = false;
  $('#recordPage').setAttribute('aria-hidden', 'false');
});
$('#recordBack').addEventListener('click', () => {
  $('#recordPage').hidden = true;
  $('#recordPage').setAttribute('aria-hidden', 'true');
});
$('#copyRecordLink').addEventListener('click', () => showToast('商品链接已复制'));
document.querySelectorAll('[data-automation]').forEach((button) => button.addEventListener('click', () => {
  const name = button.dataset.automation;
  if (!automationState[name]) {
    automationState[name] = true;
    updateAutomationSwitch(name);
    showToast(automationCopy[name].enabledToast);
    return;
  }
  pendingAutomationClose = name;
  $('#automationCloseTitle').textContent = automationCopy[name].title;
  $('#automationCloseDescription').textContent = automationCopy[name].description;
  openLayer($('#automationCloseModal'));
}));
$('#cancelAutomationClose').addEventListener('click', closeLayers);
$('#confirmAutomationClose').addEventListener('click', () => {
  if (!pendingAutomationClose) return;
  const name = pendingAutomationClose;
  automationState[name] = false;
  updateAutomationSwitch(name);
  closeLayers();
  showToast(automationCopy[name].disabledToast);
});
$('#mask').addEventListener('click', closeLayers);
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', closeLayers));

document.querySelectorAll('.chip-group').forEach((group) => group.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-value]');
  if (!button) return;
  group.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
}));

$('#resetFilter').addEventListener('click', () => {
  document.querySelectorAll('.chip-group').forEach((group) => group.querySelectorAll('button').forEach((button, index) => button.classList.toggle('active', index === 0)));
});

$('#confirmFilter').addEventListener('click', () => {
  state.sales = document.querySelector('[data-filter="sales"] .active').dataset.value;
  state.link = document.querySelector('[data-filter="link"] .active').dataset.value;
  state.directed = document.querySelector('[data-filter="directed"] .active').dataset.value;
  state.commissionType = document.querySelector('[data-filter="commission-type"] .active').dataset.value;
  closeLayers(); render(); showToast('筛选条件已生效');
});

document.querySelectorAll('[data-open-page]').forEach((button) => button.addEventListener('click', () => {
  showPage(button.dataset.openPage);
}));
$('#showcaseBack').addEventListener('click', () => showPage('home'));
$('#sampleBack').addEventListener('click', () => showPage('home'));

Object.keys(automationState).forEach(updateAutomationSwitch);
render();
showPage('home');
hydrateImageFallbacks();
