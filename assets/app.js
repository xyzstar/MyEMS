/* ===========================================================
   元创碳控 · 原型交互与图表
   =========================================================== */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const fmt = (n, d = 2) => Number(n).toLocaleString('zh-CN', {
    minimumFractionDigits: d, maximumFractionDigits: d
  });

  /* ---------------- 视图切换 ---------------- */
  const VIEWS = {
    overview:    { root: '碳排核算', name: '碳排总览',   title: '碳排总览 · 元创碳控' },
    report:      { root: '碳排核算', name: '碳排报告',   title: '碳排报告 · 元创碳控' },
    'pcf-list':  { root: '产品碳足迹', name: '产品清单',   title: '产品碳足迹 · 元创碳控' },
    model:       { root: '产品碳足迹', name: '生命周期建模', title: '生命周期建模 · 元创碳控' },
    reduce:      { root: '基础管理', name: '减碳管理',   title: '减碳管理 · 元创碳控' },
    calc:        { root: '产品碳足迹', name: '碳足迹计算', title: '碳足迹计算 · 元创碳控' },
    'pcf-report':{ root: '产品碳足迹', name: '碳足迹报告', title: '碳足迹报告 · 元创碳控' }
  };

  function switchView(key) {
    const meta = VIEWS[key];
    if (!meta) return;
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === key));
    $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + key));
    $('#crumbRoot').textContent = meta.root;
    $('#crumbActive').textContent = meta.name;
    document.title = meta.title;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $$('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.view) switchView(btn.dataset.view);
      else if (btn.dataset.soon) toast('「' + btn.dataset.soon + '」不在本次原型范围内（演示）');
    });
  });

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-toast]');
    if (t) {
      e.preventDefault();
      toast(t.dataset.toast);
      return;
    }
    const nav = e.target.closest('[data-nav]');
    if (nav) {
      e.preventDefault();
      switchView(nav.dataset.nav);
    }
  });

  $$('.switch').forEach(sw => {
    sw.addEventListener('click', () => {
      const on = sw.classList.toggle('on');
      sw.setAttribute('aria-checked', String(on));
      toast(on ? '报告将包含范围三排放（演示）' : '报告已排除范围三排放（演示）');
    });
  });

  /* ---------------- 范围详情 ---------------- */
  const RANGES = {
    1: {
      title: '范围一 · 直接排放',
      tag: '自己烧 · 自己开 · 自己漏',
      total: '3,214.28',
      pct: '25.0',
      count: '12',
      accent: '#E9A23B',
      items: [
        ['固定燃烧（天然气锅炉）', 1842.36],
        ['移动燃烧（厂内车辆）', 684.42],
        ['逸散排放（制冷剂）', 512.18],
        ['过程排放（焊接保护气）', 175.32]
      ]
    },
    2: {
      title: '范围二 · 能源间接排放',
      tag: '买来的电 · 热 · 蒸汽',
      total: '6,893.42',
      pct: '53.7',
      count: '8',
      accent: '#2F6BD8',
      items: [
        ['外购电力', 5842.16],
        ['外购蒸汽', 886.42],
        ['外购热力', 164.84]
      ]
    },
    3: {
      title: '范围三 · 价值链间接排放',
      tag: '上下游 · 供应链 · 全生命周期',
      total: '2,739.95',
      pct: '21.3',
      count: '18',
      accent: '#4FBFA8',
      items: [
        ['采购商品与服务', 1024.36],
        ['上游运输与分销', 886.42],
        ['员工通勤', 428.18],
        ['废弃物处置', 216.44],
        ['商务差旅', 108.32],
        ['下游运输', 76.23]
      ]
    }
  };

  const RANGE_ILLUS = {
    1: `<svg viewBox="0 0 120 92" fill="none" aria-hidden="true">
          <path d="M10 78h100" stroke="#DCE8F8" stroke-width="1.2"/>
          <path d="M20 78V54h18v24M44 78V60h22v18M72 78V48h14v30" stroke="#7FA9E8" stroke-width="1.4" stroke-linejoin="round"/>
          <path d="M18 54l11-9 11 9M70 48l8-8 8 8" stroke="#7FA9E8" stroke-width="1.4" stroke-linejoin="round"/>
          <path d="M28 45V33h5v12" stroke="#7FA9E8" stroke-width="1.4"/>
          <g fill="#DCE9FB"><rect x="24" y="59" width="4" height="4"/><rect x="31" y="59" width="4" height="4"/><rect x="24" y="66" width="4" height="4"/><rect x="31" y="66" width="4" height="4"/></g>
          <g stroke="#D9E7FA" stroke-width="1.2"><circle cx="31" cy="27" r="3.2"/><circle cx="36" cy="21" r="4.4"/></g>
          <path d="M94 78V62h16v16M94 70h16" stroke="#A9C6F0" stroke-width="1.3"/>
          <path d="M98 62l4-6 4 6" stroke="#A9C6F0" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>`,
    2: `<svg viewBox="0 0 120 92" fill="none" aria-hidden="true">
          <path d="M10 80h100" stroke="#DCE8F8" stroke-width="1.2"/>
          <path d="M60 80V16M60 16 47 66M60 16l13 50M50 38h20M54 52h12" stroke="#7FA9E8" stroke-width="1.4" stroke-linejoin="round"/>
          <path d="M60 16c-14 4-24 8-34 10M60 16c14 4 24 8 34 10" stroke="#B9D3F5" stroke-width="1.2" stroke-dasharray="2 3"/>
          <path d="M30 70l-8 10M90 70l8 10" stroke="#A9C6F0" stroke-width="1.2"/>
          <path d="M24 24l-9 15h7l-3 12 12-16h-7z" fill="#F2C14E" opacity=".95"/>
          <path d="M88 40h14v24H88zM88 52h14" stroke="#A9C6F0" stroke-width="1.3"/>
        </svg>`,
    3: `<svg viewBox="0 0 120 92" fill="none" aria-hidden="true">
          <path d="M10 78h100" stroke="#DCE8F8" stroke-width="1.2"/>
          <path d="M18 62h34v14H18zM52 68h12l8 8H52z" stroke="#7FA9E8" stroke-width="1.4" stroke-linejoin="round"/>
          <circle cx="28" cy="78" r="3.4" stroke="#7FA9E8" stroke-width="1.3"/>
          <circle cx="57" cy="78" r="3.4" stroke="#7FA9E8" stroke-width="1.3"/>
          <path d="M26 68h18M18 56h34" stroke="#A9C6F0" stroke-width="1.2"/>
          <g stroke="#A9C6F0" stroke-width="1.3"><path d="M80 76V64h12v12zM92 70h10v6H92zM84 64V54h8v10z"/></g>
          <path d="M104 34c-16-10-42-10-58 2" stroke="#8FC9BA" stroke-width="1.2" stroke-dasharray="3 3"/>
          <path d="M46 36l-6-1 3-5" stroke="#8FC9BA" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>`
  };

  function renderRange(key) {
    const d = RANGES[key];
    if (!d) return;
    $$('.range-tab').forEach(t => t.classList.toggle('active', t.dataset.range === String(key)));
    $('#rangeTitle').textContent = d.title;
    $('#rangeTag').textContent = d.tag;
    $('#rangeMetrics').innerHTML = `
      <div class="range-metric">
        <div class="rm-value">${d.total}<em>tCO₂e</em></div>
        <div class="rm-label">核算排放量</div>
      </div>
      <div class="range-metric">
        <div class="rm-value">${d.pct}<em>%</em></div>
        <div class="rm-label">占排放总量</div>
      </div>
      <div class="range-metric">
        <div class="rm-value">${d.count}<em>项</em></div>
        <div class="rm-label">纳入排放源</div>
      </div>`;
    const max = Math.max.apply(null, d.items.map(i => i[1]));
    $('#rangeBreakdown').innerHTML = d.items.map(item => `
      <div class="rb-item">
        <div class="rb-line"><span>${item[0]}</span><em>${fmt(item[1])}</em></div>
        <div class="rb-track"><i style="width:${(item[1] / max * 100).toFixed(1)}%;background:${d.accent}"></i></div>
      </div>`).join('');
    $('#rangeIllus').innerHTML = RANGE_ILLUS[key];
  }

  $$('.range-tab').forEach(tab => {
    tab.addEventListener('click', () => renderRange(tab.dataset.range));
  });

  /* ---------------- 图表工具 ---------------- */
  function polar(cx, cy, r, deg) {
    const a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  function arcPath(cx, cy, r, a0, a1) {
    const p0 = polar(cx, cy, r, a0);
    const p1 = polar(cx, cy, r, a1);
    const large = (a1 - a0) > 180 ? 1 : 0;
    return `M ${p0[0].toFixed(2)} ${p0[1].toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
  }

  function smoothPath(pts) {
    if (!pts.length) return '';
    if (pts.length === 1) return `M ${pts[0][0]} ${pts[0][1]}`;
    let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return d;
  }

  /* ---------------- 月度柱状图 ---------------- */
  function renderMonthly() {
    const host = $('#monthlyChart');
    if (!host) return;
    const data = [
      { m: '1月', v: 1182.36 }, { m: '2月', v: 1096.42 }, { m: '3月', v: 1214.58 },
      { m: '4月', v: 1168.24 }, { m: '5月', v: 1286.42 }, { m: '6月', v: 1342.16 },
      { m: '7月', v: 1428.36 }, { m: '8月', v: 1364.28 }, { m: '9月', v: 1246.18 },
      { m: '10月', v: 1518.65 }, { m: '11月', v: 1390.00, f: 1 }, { m: '12月', v: 1320.00, f: 1 }
    ];
    const W = 640, H = 250, P = { l: 42, r: 10, t: 14, b: 27 };
    const max = 1800, ticks = [0, 450, 900, 1350, 1800];
    const iw = W - P.l - P.r, ih = H - P.t - P.b;
    const step = iw / data.length;
    const bw = Math.min(24, step * 0.44);

    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="月度排放量柱状图">`;
    s += `<defs>
      <linearGradient id="barBlue" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#BBD3F6"/><stop offset="1" stop-color="#2F6BD8"/>
      </linearGradient>
      <linearGradient id="barBlueF" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#E6EEFB"/><stop offset="1" stop-color="#9CBCEE"/>
      </linearGradient>
    </defs>`;
    ticks.forEach(t => {
      const y = P.t + ih - (t / max) * ih;
      s += `<line x1="${P.l}" y1="${y}" x2="${W - P.r}" y2="${y}" stroke="#EEF2F8"/>`;
      s += `<text x="${P.l - 8}" y="${y + 3.5}" text-anchor="end" class="ax">${t}</text>`;
    });
    data.forEach((d, i) => {
      const h = Math.max(2, (d.v / max) * ih);
      const x = P.l + i * step + (step - bw) / 2;
      const y = P.t + ih - h;
      s += `<rect class="bar" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="url(#${d.f ? 'barBlueF' : 'barBlue'})"><title>${d.m}：${fmt(d.v)} tCO₂e${d.f ? '（预测）' : ''}</title></rect>`;
      s += `<text x="${(x + bw / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" class="ax">${d.m.replace('月', '')}</text>`;
    });
    s += '</svg>';
    host.innerHTML = s;
  }

  /* ---------------- 趋势图 ---------------- */
  function renderTrend() {
    const host = $('#trendChart');
    if (!host) return;
    const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const prev = [1290, 1208, 1332, 1268, 1374, 1436, 1524, 1466, 1352, 1580, 1472, 1404];
    const actual = [1182, 1096, 1215, 1168, 1286, 1342, 1428, 1364, 1246, 1519];
    const forecast = [1519, 1390, 1320];

    const W = 720, H = 250, P = { l: 44, r: 18, t: 16, b: 27 };
    const max = 1600, ticks = [0, 400, 800, 1200, 1600];
    const iw = W - P.l - P.r, ih = H - P.t - P.b;
    const bx = i => P.l + (i / (labels.length - 1)) * iw;
    const by = v => P.t + ih - (v / max) * ih;

    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="排放趋势与预测折线图">`;
    s += `<defs>
      <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2F6BD8" stop-opacity=".22"/>
        <stop offset="1" stop-color="#2F6BD8" stop-opacity=".02"/>
      </linearGradient>
      <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3DBE8B" stop-opacity=".2"/>
        <stop offset="1" stop-color="#3DBE8B" stop-opacity=".02"/>
      </linearGradient>
    </defs>`;
    ticks.forEach(t => {
      const y = by(t);
      s += `<line x1="${P.l}" y1="${y}" x2="${W - P.r}" y2="${y}" stroke="#EEF2F8"/>`;
      s += `<text x="${P.l - 8}" y="${y + 3.5}" text-anchor="end" class="ax">${t}</text>`;
    });
    labels.forEach((l, i) => {
      if (i % 2 === 0) {
        s += `<text x="${bx(i).toFixed(1)}" y="${H - 8}" text-anchor="middle" class="ax">${l}</text>`;
      }
    });

    const prevPts = prev.map((v, i) => [bx(i), by(v)]);
    const actPts = actual.map((v, i) => [bx(i), by(v)]);
    const fcPts = forecast.map((v, i) => [bx(i + 9), by(v)]);

    s += `<path d="${smoothPath(prevPts)} L ${bx(11)} ${P.t + ih} L ${bx(0)} ${P.t + ih} Z" fill="url(#areaGreen)"/>`;
    s += `<path d="${smoothPath(prevPts)}" fill="none" stroke="#3DBE8B" stroke-width="1.6" opacity=".85"/>`;

    s += `<path d="${smoothPath(actPts)} L ${bx(9)} ${P.t + ih} L ${bx(0)} ${P.t + ih} Z" fill="url(#areaBlue)"/>`;
    s += `<path d="${smoothPath(actPts)}" fill="none" stroke="#2F6BD8" stroke-width="2"/>`;

    s += `<path d="${smoothPath(fcPts)}" fill="none" stroke="#5B8DEF" stroke-width="1.8" stroke-dasharray="5 4"/>`;

    actPts.forEach((p, i) => {
      s += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.6" fill="#fff" stroke="#2F6BD8" stroke-width="1.4"><title>${labels[i]}：${fmt(actual[i])} tCO₂e</title></circle>`;
    });
    s += `<circle cx="${fcPts[2][0].toFixed(1)}" cy="${fcPts[2][1].toFixed(1)}" r="3.4" fill="#5B8DEF" stroke="#fff" stroke-width="1.6"><title>12月预测：1,320.00 tCO₂e</title></circle>`;
    s += '</svg>';
    host.innerHTML = s;
  }

  /* ---------------- 类别环形图 ---------------- */
  const CATEGORIES = [
    { name: '外购电力', value: 5842.16, color: '#2F6BD8' },
    { name: '燃料燃烧', value: 2526.78, color: '#6C9BE8' },
    { name: '采购商品与服务', value: 1024.36, color: '#4FBFA8' },
    { name: '外购蒸汽', value: 886.42, color: '#F2A93B' },
    { name: '上游运输', value: 886.42, color: '#8E7BE0' },
    { name: '其他', value: 1681.51, color: '#C3D3EA' }
  ];

  function renderDonut() {
    const host = $('#catDonut');
    const legend = $('#catLegend');
    if (!host) return;
    const total = CATEGORIES.reduce((s, d) => s + d.value, 0);
    const size = 200, cx = 100, cy = 100, r = 72, sw = 19, gap = 1.4;
    let angle = 0;
    let segs = '';
    CATEGORIES.forEach(d => {
      const sweep = d.value / total * 360;
      const a0 = angle + gap / 2;
      const a1 = angle + sweep - gap / 2;
      segs += `<path d="${arcPath(cx, cy, r, a0, a1)}" fill="none" stroke="${d.color}" stroke-width="${sw}" stroke-linecap="butt"><title>${d.name}：${fmt(d.value)} tCO₂e（${(d.value / total * 100).toFixed(1)}%）</title></path>`;
      angle += sweep;
    });
    host.innerHTML = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="排放类别占比环形图">
      ${segs}
      <text x="${cx}" y="${cy - 8}" text-anchor="middle" class="donut-center-label">排放总量</text>
      <text x="${cx}" y="${cy + 15}" text-anchor="middle" class="donut-center-value">12,847.65</text>
      <text x="${cx}" y="${cy + 32}" text-anchor="middle" class="donut-center-unit">tCO₂e</text>
    </svg>`;
    if (legend) {
      legend.innerHTML = CATEGORIES.map(d => `
        <div class="dl-row">
          <span class="dot" style="background:${d.color}"></span>
          <span class="name">${d.name}</span>
          <span class="val">${fmt(d.value)}</span>
          <span class="pct">${(d.value / total * 100).toFixed(1)}%</span>
        </div>`).join('');
    }
  }

  /* ---------------- 减碳堆叠柱状图 ---------------- */
  function renderReduce() {
    const host = $('#reduceChart');
    if (!host) return;
    const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'];
    const green = [78.2, 74.6, 86.4, 88.1, 92.6, 95.2, 98.4, 96.8, 70.5, 81.6];
    const process = [28.4, 30.2, 34.6, 36.8, 38.2, 39.6, 40.8, 38.4, 27.5, 41.6];
    const other = [5.2, 5.8, 6.4, 6.9, 7.1, 7.4, 7.8, 7.6, 4.8, 7.1];

    const W = 720, H = 250, P = { l: 42, r: 12, t: 14, b: 27 };
    const max = 160, ticks = [0, 40, 80, 120, 160];
    const iw = W - P.l - P.r, ih = H - P.t - P.b;
    const step = iw / labels.length;
    const bw = Math.min(26, step * 0.46);

    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="月度减碳量堆叠柱状图">`;
    ticks.forEach(t => {
      const y = P.t + ih - (t / max) * ih;
      s += `<line x1="${P.l}" y1="${y}" x2="${W - P.r}" y2="${y}" stroke="#EEF2F8"/>`;
      s += `<text x="${P.l - 8}" y="${y + 3.5}" text-anchor="end" class="ax">${t}</text>`;
    });
    labels.forEach((l, i) => {
      const x = P.l + i * step + (step - bw) / 2;
      let base = P.t + ih;
      const parts = [
        { v: green[i], c: '#3DBE8B', n: '绿色能源' },
        { v: process[i], c: '#7FD6BE', n: '工艺节能' },
        { v: other[i], c: '#CBEBDD', n: '其他' }
      ];
      parts.forEach(p => {
        const h = (p.v / max) * ih;
        base -= h;
        s += `<rect x="${x.toFixed(1)}" y="${base.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" fill="${p.c}"><title>${l} · ${p.n}：${fmt(p.v)} tCO₂e</title></rect>`;
      });
      s += `<text x="${(x + bw / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" class="ax">${l.replace('月', '')}</text>`;
    });
    s += '</svg>';
    host.innerHTML = s;
  }

  /* ---------------- 清单筛选 ---------------- */
  $$('.tabs[data-filter-target]').forEach(group => {
    const table = $(group.dataset.filterTarget);
    if (!table) return;
    group.addEventListener('click', e => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      $$('.tab', group).forEach(t => t.classList.toggle('active', t === tab));
      const f = tab.dataset.filter;
      $$('tbody tr', table).forEach(row => {
        row.classList.toggle('hidden', f !== 'all' && row.dataset.scope !== f);
      });
    });
  });

  /* ---------------- 产品清单 ---------------- */
  const PCF_PRODUCTS = [
    { name: '2022年卡塔尔世界杯吉祥物摆件', model: 'SCM', qty: '1/Item(s)', cf: '0.109', boundary: '从摇篮到大门', period: '2022/08/01 - 2022/09/30', updated: '2026-03-16 10:44:23', status: '核算生成', locked: false, owner: '杜*婷' },
    { name: '牛仔裤', model: '混纺 49.6g 面料', qty: '100/Piece(s)', cf: '49.1', boundary: '从摇篮到大门', period: '2022/10/05 - 2022/11/01', updated: '2024-10-18 17:31:58', status: '核算生成', locked: true, owner: '杜*婷' },
    { name: '动力电池（磷酸铁锂）', model: '28kWh', qty: '1/Item(s)', cf: '230', boundary: '从摇篮到大门', period: '2021/01/01 - 2021/12/31', updated: '2024-05-28 10:50:23', status: '核算生成', locked: true, owner: '杜*婷' },
    { name: '洗洁精', model: '1kg', qty: '700000/Item(s)', cf: '1', boundary: '从摇篮到大门', period: '2023/04/01 - 2023/04/09', updated: '2024-05-21 17:07:58', status: '核算生成', locked: true, owner: '杜*婷' },
    { name: '智能光伏逆变器 XG-5000', model: 'XG-5000（5 kW）', qty: '1/台', cf: '42.59', boundary: '从摇篮到大门', period: '2026/01/01 - 2026/10/31', updated: '2026-11-06 14:20:11', status: '核算生成', locked: false, owner: '陈思远' },
    { name: '铝合金结构件', model: 'AL-220', qty: '1000/Piece(s)', cf: '8.42', boundary: '从摇篮到大门', period: '2026/03/01 - 2026/09/30', updated: '2026-10-30 09:12:36', status: '核算中', locked: false, owner: '林书禾' },
    { name: '瓦楞包装纸箱', model: 'CB-30', qty: '500/Item(s)', cf: '0.86', boundary: '从摇篮到大门', period: '2026/02/01 - 2026/08/31', updated: '2026-10-12 16:05:04', status: '待核算', locked: false, owner: '林书禾' }
  ];

  const PCF_STATUS_CLASS = { '核算生成': 'chart', '核算中': 'doing', '待核算': 'todo2' };

  function renderPcf() {
    const body = $('#pcfBody');
    if (!body) return;
    const kw = ($('#pcfSearch').value || '').trim().toLowerCase();
    const st = $('#pcfStatus').value;
    const ow = $('#pcfOwner').value;
    const rows = PCF_PRODUCTS.filter(p =>
      (!kw || (p.name + ' ' + p.model).toLowerCase().includes(kw)) &&
      (st === 'all' || p.status === st) &&
      (ow === 'all' || p.owner === ow)
    );
    body.innerHTML = rows.length ? rows.map(p => `
      <tr>
        <td><span class="prod-name" data-pcf-detail="${p.name}">${p.name}</span></td>
        <td>${p.model}</td>
        <td>${p.qty}</td>
        <td class="ta-r cf">${p.cf}</td>
        <td>${p.boundary}</td>
        <td>${p.period}</td>
        <td class="mono">${p.updated}</td>
        <td><span class="status ${PCF_STATUS_CLASS[p.status]}"><i></i>${p.status}</span></td>
        <td><span class="lock-tag${p.locked ? ' on' : ''}">${p.locked ? '是' : '否'}</span></td>
        <td class="owner">${p.owner}</td>
        <td class="ta-r"><span class="op-link" data-pcf-detail="${p.name}">详情</span></td>
      </tr>`).join('')
      : '<tr><td colspan="11" style="text-align:center;color:#98A4B5;padding:36px 0">没有符合条件的产品</td></tr>';
    $('#pcfCount').textContent = '共 ' + rows.length + ' 条';
  }

  if ($('#pcfBody')) {
    $('#pcfSearch').addEventListener('input', renderPcf);
    $('#pcfStatus').addEventListener('change', renderPcf);
    $('#pcfOwner').addEventListener('change', renderPcf);
    $('#pcfReset').addEventListener('click', () => {
      $('#pcfSearch').value = '';
      $('#pcfStatus').value = 'all';
      $('#pcfOwner').value = 'all';
      renderPcf();
      toast('筛选条件已重置（演示）');
    });
    $('#pcfBody').addEventListener('click', e => {
      const el = e.target.closest('[data-pcf-detail]');
      if (!el) return;
      const name = el.dataset.pcfDetail;
      $('#modelProductName').textContent = name;
      const calcName = $('#calcProductName');
      if (calcName) calcName.textContent = name;
      switchView('model');
      toast('已进入「' + name + '」生命周期建模（演示）');
    });
  }

  /* ---------------- 初始化 ---------------- */
  renderPcf();
  renderRange(1);
  renderMonthly();
  renderTrend();
  renderDonut();
  renderReduce();
})();
