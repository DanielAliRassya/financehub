/**
 * FinanceHub - Calculator, Math Solver, Savings Tracker, Unit Converter
 * Clean & modern finance tools
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initScrollReveal();
    initSmoothScroll();
    initActiveNav();
    initTheme();
    initCalculator();
    initMathSolver();
    initSavings();
    initKeuangan();
    initConverters();
    initYear();
  });

  // ===== Theme (dark/light) =====
  function initTheme() {
    const KEY = 'financehub_theme';
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');

    function apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      try { localStorage.setItem(KEY, theme); } catch (e) {}
    }

    // Restore saved theme (default: light)
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    apply(saved === 'dark' ? 'dark' : 'light');

    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        apply(current === 'dark' ? 'light' : 'dark');
      });
    }
  }

  // ===== Navbar =====
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', function () {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
    });

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
      navMenu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }
  }

  // ===== Scroll Reveal =====
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(function (el) { observer.observe(el); });
  }

  // ===== Smooth Scroll =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }

  // ===== Active Nav & View Switcher =====
  function initActiveNav() {
    const sections = document.querySelectorAll('.tool-section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    const navTriggers = document.querySelectorAll('.nav-trigger');
    
    function showSection(id) {
      sections.forEach(function (s) { s.classList.remove('active-view'); });
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      const target = document.getElementById(id.replace('#', ''));
      if (target) {
        target.classList.add('active-view');
        navLinks.forEach(function (l) { if (l.getAttribute('href') === id) l.classList.add('active'); });
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    }

    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showSection(this.getAttribute('href'));
      });
    });

    navTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        showSection(this.getAttribute('href'));
      });
    });

    // Default view
    const hash = window.location.hash || '#home';
    showSection(hash);
  }

  // ===== CALCULATOR =====
  function initCalculator() {
    const expressionEl = document.getElementById('calcExpression');
    const resultEl = document.getElementById('calcResult');
    if (!expressionEl || !resultEl) return;

    let current = '0';
    let expression = '';
    let resetNext = false;

    function updateDisplay() {
      resultEl.textContent = current;
      expressionEl.textContent = expression;
    }

    function handleInput(val) {
      if (resetNext) { current = ''; resetNext = false; }
      if (current === '0') current = val === '.' ? '0.' : val;
      else if (/[0-9.]/.test(val)) current += val;
      else current = val;
      updateDisplay();
    }

    function handleAction(action) {
      if (action === 'clear') {
        current = '0';
        expression = '';
      } else if (action === 'allclear') {
        current = '0';
        expression = '';
      } else if (action === 'equals') {
        try {
          const fullExpr = (expression + current).replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/π/g, 'Math.PI');
          const result = evaluateMath(fullExpr);
          expression = expression + current + ' =';
          current = formatNumber(result);
          resetNext = true;
        } catch (e) {
          current = 'Error';
          resetNext = true;
        }
      } else if (action === 'sqrt') {
        expression = '√(' + current + ') =';
        current = formatNumber(Math.sqrt(parseFloat(current) || 0));
        resetNext = true;
      } else if (action === 'pow') {
        expression = '(' + current + ')² =';
        current = formatNumber(Math.pow(parseFloat(current) || 0, 2));
        resetNext = true;
      } else if (['sin', 'cos', 'tan'].includes(action)) {
        const deg = parseFloat(current) || 0;
        const rad = deg * Math.PI / 180;
        let res;
        if (action === 'sin') res = Math.sin(rad);
        else if (action === 'cos') res = Math.cos(rad);
        else res = Math.tan(rad);
        expression = action + '(' + current + '°) =';
        current = formatNumber(res);
        resetNext = true;
      }
      updateDisplay();
    }

    document.querySelectorAll('.calc-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const val = this.getAttribute('data-value');
        const action = this.getAttribute('data-action');
        if (val) {
          if (['+', '-', '*', '/', '%'].includes(val)) {
            if (!resetNext) expression += current + ' ' + val + ' ';
            else expression = current + ' ' + val + ' ';
            current = '0';
            resetNext = false;
            updateDisplay();
          } else if (val === 'π') {
            if (resetNext) { current = ''; resetNext = false; }
            current = formatNumber(Math.PI);
            updateDisplay();
          } else if (val === '(' || val === ')') {
            if (resetNext) { current = val; resetNext = false; }
            else current += val;
            updateDisplay();
          } else {
            handleInput(val);
          }
        } else if (action) {
          handleAction(action);
        }
      });
    });

    // Keyboard support
    document.addEventListener('keydown', function (e) {
      if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      const key = e.key;
      if (/[0-9.]/.test(key)) { handleInput(key); e.preventDefault(); }
      else if (['+', '-', '*', '/', '%', '(', ')'].includes(key)) {
        if (['+', '-', '*', '/', '%'].includes(key)) {
          if (!resetNext) expression += current + ' ' + key + ' ';
          else expression = current + ' ' + key + ' ';
          current = '0'; resetNext = false; updateDisplay();
        } else {
          current += key; updateDisplay();
        }
        e.preventDefault();
      } else if (key === 'Enter' || key === '=') { handleAction('equals'); e.preventDefault(); }
      else if (key === 'Backspace' || key === 'Escape' || key === 'Delete') { handleAction('clear'); e.preventDefault(); }
    });

    updateDisplay();
  }

  // ===== MATH SOLVER =====
  function initMathSolver() {
    const input = document.getElementById('mathInput');
    const solveBtn = document.getElementById('solveBtn');
    const clearBtn = document.getElementById('clearMathBtn');
    const output = document.getElementById('solverOutput');
    if (!input || !solveBtn || !output) return;

    function solve() {
      const raw = input.value.trim();
      if (!raw) { output.innerHTML = placeholderHTML(); return; }
      try {
        const result = evaluateMath(raw);
        const steps = generateSteps(raw);
        output.innerHTML =
          '<div class="solution-box">' +
            '<div class="solution-label">Jawaban</div>' +
            '<div class="solution-expr">' + escapeHtml(raw) + '</div>' +
            '<div class="solution-answer">= ' + formatNumber(result) + '</div>' +
            '<div class="solution-steps"><h5>Langkah Perhitungan:</h5><ol>' + steps + '</ol></div>' +
          '</div>';
      } catch (e) {
        output.innerHTML = '<div class="solution-box"><div class="solution-label" style="color:var(--accent-danger)">Error</div><div class="solution-expr">Tidak dapat menyelesaikan ekspresi. Periksa penulisan soal.</div></div>';
      }
    }

    solveBtn.addEventListener('click', solve);
    clearBtn.addEventListener('click', function () {
      input.value = '';
      output.innerHTML = placeholderHTML();
    });

    document.querySelectorAll('.example-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        input.value = this.getAttribute('data-expr');
        solve();
      });
    });

    function placeholderHTML() {
      return '<div class="output-placeholder"><i class="fas fa-lightbulb"></i><p>Ketik soal matematika di atas lalu klik "Selesaikan"</p></div>';
    }
  }

  function generateSteps(raw) {
    // Simple step breakdown
    let steps = '';
    const normalized = raw.replace(/×/g, '*').replace(/÷/g, '/').replace(/sqrt/g, 'Math.sqrt').replace(/pi/g, 'Math.PI').replace(/log/g, 'Math.log10').replace(/ln/g, 'Math.log').replace(/sin\s*\(/g, 'sin(').replace(/cos\s*\(/g, 'cos(').replace(/tan\s*\(/g, 'tan(');
    if (normalized.includes('^')) steps += '<li>Ubah tanda <strong>^</strong> menjadi pangkat matematika</li>';
    if (raw.includes('sqrt')) steps += '<li>Tarik akar kuadrat menggunakan fungsi √</li>';
    if (raw.includes('sin') || raw.includes('cos') || raw.includes('tan')) steps += '<li>Konversi sudut derajat ke radian lalu hitung fungsi trigonometri</li>';
    if (raw.includes('(')) steps += '<li>Selesaikan operasi di dalam tanda kurung terlebih dahulu</li>';
    steps += '<li>Lakukan perhitungan sesuai urutan operasi (PEMDAS)</li>';
    return steps;
  }

  // Strict math parser to avoid Function()/eval injection while supporting
  // trig (deg), ln/log10, sqrt, abs, pi, e, %, ^, parentheses, basic arithmetic.
  function evaluateMath(rawExpr) {
    const expr = String(rawExpr)
      .replace(/[×]/g, '*')
      .replace(/[÷]/g, '/')
      .replace(/[−]/g, '-')
      .replace(/π/gi, 'PI')
      .replace(/\bpi\b/gi, 'PI')
      .replace(/\be\b/g, 'E');

    if (!/^[0-9\s\+\-\*\/\.\(\)\,%\^a-zA-Z\u03c0]+$/.test(expr)) {
      throw new Error('Karakter tidak dikenal');
    }

    // Tokenize
    const tokens = [];
    let i = 0;
    const numBuf = () => {
      let s = '';
      while (i < expr.length && /[0-9\.]/.test(expr[i])) { s += expr[i]; i++; }
      return parseFloat(s);
    };
    while (i < expr.length) {
      const c = expr[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9]/.test(c)) {
        tokens.push({ type: 'num', value: numBuf() });
        continue;
      }
      if (/[a-zA-Z]/.test(c)) {
        let s = '';
        while (i < expr.length && /[a-zA-Z0-9]/.test(expr[i])) { s += expr[i]; i++; }
        tokens.push({ type: 'ident', value: s });
        continue;
      }
      if ('+-*/%^(),'.includes(c)) {
        tokens.push({ type: 'op', value: c });
        i++;
        continue;
      }
      throw new Error('Token tidak valid: ' + c);
    }

    // Parser
    let p = 0;

    function peek() { return tokens[p]; }
    function eat(type, val) {
      const t = tokens[p];
      if (!t || t.type !== type || (val !== undefined && t.value !== val)) return null;
      p++;
      return t;
    }
    function expect(type, val) {
      const t = eat(type, val);
      if (!t) throw new Error('Sintaks salah');
      return t;
    }

    function parseExpression() { return parseAddSub(); }
    function parseAddSub() {
      let left = parseMulDiv();
      while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
        const op = peek().value;
        eat('op', op);
        const right = parseMulDiv();
        left = op === '+' ? left + right : left - right;
      }
      return left;
    }
    function parseMulDiv() {
      let left = parseUnary();
      while (peek()) {
        const t = peek();
        if (t.type === 'op' && (t.value === '*' || t.value === '/' || t.value === '%')) {
          const op = t.value;
          eat('op', op);
          const right = parseUnary();
          if (op === '*') left = left * right;
          else if (op === '/') left = left / right;
          else left = left % right;
        } else if (t.type === 'num' || t.type === 'ident' || (t.type === 'op' && t.value === '(')) {
          // Implicit multiplication e.g. 5(2), 2pi, sin(30)10
          const right = parseUnary();
          left = left * right;
        } else {
          break;
        }
      }
      return left;
    }
    function parseUnary() {
      if (peek() && peek().type === 'op' && peek().value === '-') { eat('op', '-'); return -parsePower(); }
      if (peek() && peek().type === 'op' && peek().value === '+') { eat('op', '+'); return parsePower(); }
      return parsePower();
    }
    function parsePower() {
      const left = parsePrimary();
      if (peek() && peek().type === 'op' && peek().value === '^') {
        eat('op', '^');
        const right = parseUnary();
        return Math.pow(left, right);
      }
      return left;
    }
    function parsePrimary() {
      const t = peek();
      if (!t) throw new Error('Sintaks tidak lengkap');
      if (t.type === 'num') { eat('num'); return t.value; }
      if (t.type === 'op' && t.value === '(') {
        eat('op', '(');
        const v = parseExpression();
        expect('op', ')');
        return v;
      }
      if (t.type === 'ident') {
        eat('ident');
        if (peek() && peek().type === 'op' && peek().value === '(') {
          eat('op', '(');
          const arg = parseExpression();
          expect('op', ')');
          return applyFunc(t.value, arg);
        }
        return applyFunc(t.value, null);
      }
      throw new Error('Token tak terduga: ' + t.value);
    }
    function applyFunc(name, arg) {
      const lower = name.toLowerCase();
      if (lower === 'pi') return Math.PI;
      if (lower === 'e') return Math.E;
      if (arg === null) throw new Error('Fungsi ' + name + ' butuh argumen');
      switch (lower) {
        case 'sin': return Math.sin(arg * Math.PI / 180);
        case 'cos': return Math.cos(arg * Math.PI / 180);
        case 'tan': return Math.tan(arg * Math.PI / 180);
        case 'csc': return 1 / Math.sin(arg * Math.PI / 180);
        case 'sec': return 1 / Math.cos(arg * Math.PI / 180);
        case 'cot': return 1 / Math.tan(arg * Math.PI / 180);
        case 'asin': return Math.asin(Math.max(-1, Math.min(1, arg))) * 180 / Math.PI;
        case 'acos': return Math.acos(Math.max(-1, Math.min(1, arg))) * 180 / Math.PI;
        case 'atan': return Math.atan(arg) * 180 / Math.PI;
        case 'sqrt': return Math.sqrt(arg);
        case 'abs': return Math.abs(arg);
        case 'log': return Math.log10(arg);
        case 'ln': return Math.log(arg);
        case 'exp': return Math.exp(arg);
        case 'floor': return Math.floor(arg);
        case 'ceil': return Math.ceil(arg);
        case 'round': return Math.round(arg);
        default: throw new Error('Fungsi tidak dikenal: ' + name);
      }
    }

    const result = parseExpression();
    if (typeof result !== 'number' || !isFinite(result)) throw new Error('Hasil tidak valid');
    return result;
  }

  function formatNumber(num) {
    if (typeof num !== 'number') return num;
    if (Number.isInteger(num)) return num.toString();
    return parseFloat(num.toFixed(8)).toString();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ===== KEUANGAN (INCOME/EXPENSE) =====
  function initKeuangan() {
    const KEY = 'financehub_keuangan_v1';
    let data = loadFin();

    const form = document.getElementById('financeForm');
    const listEl = document.getElementById('finList');
    const totalInEl = document.getElementById('finTotalIncome');
    const totalExEl = document.getElementById('finTotalExpense');
    const clearBtn = document.getElementById('resetFinBtn');
    const dateInput = document.getElementById('finDate');
    const photoInput = document.getElementById('finPhoto');
    const photoPreview = document.getElementById('finPhotoPreview');
    const photoImg = document.getElementById('finPhotoImg');
    const photoRemove = document.getElementById('finPhotoRemove');
    let currentPhotoBase64 = null;

    if (dateInput) dateInput.valueAsDate = new Date();

    // Photo upload handlers
    if (photoInput) {
      photoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { alert('Ukuran foto maksimal 2MB'); photoInput.value = ''; return; }
        const reader = new FileReader();
        reader.onload = function (ev) { currentPhotoBase64 = ev.target.result; photoImg.src = currentPhotoBase64; photoPreview.style.display = 'block'; };
        reader.readAsDataURL(file);
      });
    }
    if (photoRemove) {
      photoRemove.addEventListener('click', function () { currentPhotoBase64 = null; photoInput.value = ''; photoPreview.style.display = 'none'; });
    }

    function loadFin() {
      try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {}
      return { transactions: [] };
    }
    function saveFin() { localStorage.setItem(KEY, JSON.stringify(data)); }
    function formatRp(n) {
      if (typeof n !== 'number' || isNaN(n)) n = 0;
      return 'Rp ' + n.toLocaleString('id-ID');
    }

    function groupByDate() {
      var groups = {};
      data.transactions.forEach(function (t) {
        if (!groups[t.date]) groups[t.date] = { income: 0, expense: 0 };
        if (t.type === 'income') groups[t.date].income += t.amount;
        else groups[t.date].expense += t.amount;
      });
      return Object.keys(groups).sort().map(function (d) { return { date: d, income: groups[d].income, expense: groups[d].expense }; });
    }

    // === Filter state ===
    let searchQuery = '';
    let filterType = 'all';

    const searchInput = document.getElementById('finSearch');
    const filterSelect = document.getElementById('finFilterType');
    const monthInput = document.getElementById('finMonth');
    const monthTodayBtn = document.getElementById('finMonthToday');

    // Month state (YYYY-MM), default = current month
    let analyticsMonth = (function () {
      var n = new Date();
      return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0');
    })();
    if (monthInput) monthInput.value = analyticsMonth;

    function getMonthTransactions() {
      return data.transactions.filter(function (t) {
        if (!t.date) return false;
        return t.date.slice(0, 7) === analyticsMonth;
      });
    }

    if (monthInput) monthInput.addEventListener('change', function () { analyticsMonth = this.value; renderChart(); });
    if (monthTodayBtn) monthTodayBtn.addEventListener('click', function () {
      var n = new Date();
      analyticsMonth = n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0');
      if (monthInput) monthInput.value = analyticsMonth;
      renderChart();
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = this.value.toLowerCase().trim();
        render();
      });
    }
    if (filterSelect) {
      filterSelect.addEventListener('change', function () {
        filterType = this.value;
        render();
      });
    }

    function deleteTransaction(id) {
      var idx = data.transactions.findIndex(function (t) { return t.id === id; });
      if (idx === -1) return;
      var tx = data.transactions[idx];
      if (!confirm('Hapus transaksi "' + tx.note + '" (' + formatRp(tx.amount) + ')?')) return;
      data.transactions.splice(idx, 1);
      saveFin();
      render();
      showToast('✓ Dihapus', tx.note + ' — ' + formatRp(tx.amount), 'success');
    }

    function editTransaction(id) {
      var tx = data.transactions.find(function (t) { return t.id === id; });
      if (!tx) return;
      var note = prompt('Edit catatan:', tx.note);
      if (note === null) return;
      var amountStr = prompt('Edit jumlah (Rp):', tx.amount);
      if (amountStr === null) return;
      var amount = parseFloat(amountStr);
      if (!amount || amount <= 0 || isNaN(amount)) { showToast('✗ Gagal', 'Jumlah tidak valid', 'error'); return; }
      tx.note = note.trim() || tx.note;
      tx.amount = amount;
      saveFin();
      render();
      showToast('✓ Diedit', tx.note + ' — ' + formatRp(tx.amount), 'success');
    }

    function renderChart() {
      var chartEl = document.getElementById('finChart');
      if (!chartEl) return;
      var monthTx = getMonthTransactions();
      var rangeInfo = document.getElementById('finRangeInfo');

      // Build day buckets for the selected month (1st → last day)
      var parts = analyticsMonth.split('-');
      var y = parseInt(parts[0]), m = parseInt(parts[1]) - 1;
      var daysInMonth = new Date(y, m + 1, 0).getDate();
      var buckets = {};
      for (var d = 1; d <= daysInMonth; d++) {
        var key = analyticsMonth + '-' + String(d).padStart(2, '0');
        buckets[key] = { income: 0, expense: 0 };
      }
      monthTx.forEach(function (t) {
        if (!buckets[t.date]) return;
        if (t.type === 'income') buckets[t.date].income += t.amount;
        else buckets[t.date].expense += t.amount;
      });
      var grouped = Object.keys(buckets).sort().map(function (k) {
        return { date: k, income: buckets[k].income, expense: buckets[k].expense };
      });

      var monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
      var label = monthNames[m] + ' ' + y;
      var nowDate = new Date();
      var isCurrentMonth = (nowDate.getFullYear() === y && nowDate.getMonth() === m);
      var lastDay = isCurrentMonth ? nowDate.getDate() : daysInMonth;
      var rangeEnd = analyticsMonth + '-' + String(lastDay).padStart(2, '0');
      if (rangeInfo) {
        rangeInfo.innerHTML = '<i class="fas fa-calendar-alt"></i> 1 ' + monthNames[m] + ' – ' + lastDay + ' ' + monthNames[m] + ' ' + y +
          ' · <strong>' + monthTx.length + '</strong> transaksi';
      }

      if (!monthTx.length) {
        chartEl.innerHTML = '<div class="empty-state"><i class="fas fa-chart-bar"></i><p>Belum ada transaksi di ' + label + '</p></div>';
        renderCategoryBreakdown();
        renderDailyStats();
        return;
      }
      var maxVal = 0;
      grouped.forEach(function (g) { maxVal = Math.max(maxVal, g.income, g.expense); });
      if (maxVal === 0) maxVal = 1;

      // Zoom state: px width per day-group (kept on instance)
      if (typeof renderChart._zoom === 'undefined') renderChart._zoom = 44;
      var dayW = renderChart._zoom;

      var html = '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap;">' +
        '<div style="display:flex;gap:16px;font-size:0.8rem;">' +
          '<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;background:var(--accent-success);border-radius:3px;display:inline-block;"></span> Pemasukan</span>' +
          '<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;background:var(--accent-danger);border-radius:3px;display:inline-block;"></span> Pengeluaran</span>' +
        '</div>' +
        '<div style="display:flex;gap:4px;align-items:center;">' +
          '<button class="btn btn-secondary btn-sm" onclick="window.__finZoom(-1)" title="Zoom out"><i class="fas fa-minus"></i></button>' +
          '<span style="font-size:0.75rem;color:var(--text-muted);min-width:52px;text-align:center;">' + dayW + 'px</span>' +
          '<button class="btn btn-secondary btn-sm" onclick="window.__finZoom(1)" title="Zoom in"><i class="fas fa-plus"></i></button>' +
        '</div>' +
      '</div>';
      html += '<div style="overflow-x:auto;overflow-y:hidden;border:1px solid var(--border-color);border-radius:var(--radius-md);padding:10px;background:var(--bg-tertiary);">';
      html += '<div style="display:flex;align-items:flex-end;gap:6px;height:180px;padding:6px 4px 0;border-bottom:2px solid var(--border-color);width:' + (grouped.length * dayW) + 'px;min-width:100%;">';
      grouped.forEach(function (g) {
        var inH = (g.income / maxVal * 100) || 0;
        var exH = (g.expense / maxVal * 100) || 0;
        html += '<div style="flex:0 0 ' + dayW + 'px;display:flex;flex-direction:column;align-items:center;gap:4px;">' +
          '<div style="display:flex;align-items:flex-end;gap:2px;justify-content:center;height:150px;width:100%;">' +
            '<div style="flex:1;max-width:16px;background:var(--accent-success);border-radius:4px 4px 0 0;height:' + inH + '%;min-height:' + (inH > 0 ? '3px' : '0') + ';transition:height 0.4s ease;" title="' + g.date + ' Masuk: ' + formatRp(g.income) + '"></div>' +
            '<div style="flex:1;max-width:16px;background:var(--accent-danger);border-radius:4px 4px 0 0;height:' + exH + '%;min-height:' + (exH > 0 ? '3px' : '0') + ';transition:height 0.4s ease;" title="' + g.date + ' Keluar: ' + formatRp(g.expense) + '"></div>' +
          '</div>' +
          '<span style="font-size:0.65rem;color:var(--text-muted);white-space:nowrap;">' + g.date.slice(8) + '</span>' +
        '</div>';
      });
      html += '</div></div>';
      chartEl.innerHTML = html;
      renderCategoryBreakdown();
      renderDailyStats();
    }

    window.__finZoom = function (dir) {
      var cur = renderChart._zoom || 44;
      var next = Math.min(140, Math.max(20, cur + dir * 12));
      if (next === cur) return;
      renderChart._zoom = next;
      renderChart();
    };

    function renderCategoryBreakdown() {
      var el = document.getElementById('finCategoryBreakdown');
      if (!el) return;
      var monthTx = getMonthTransactions();
      var incomeTotal = 0, expenseTotal = 0;
      monthTx.forEach(function (t) {
        if (t.type === 'income') incomeTotal += t.amount;
        else expenseTotal += t.amount;
      });
      if (!incomeTotal && !expenseTotal) { el.innerHTML = ''; return; }

      var html = '<h4 style="font-size:0.95rem;font-weight:700;margin-bottom:12px;"><i class="fas fa-layer-group" style="color:var(--accent-secondary);"></i> Ringkasan Kategori</h4>';
      html += '<div class="goal-stats">';

      if (incomeTotal) {
        html += '<div class="goal-stat" style="border-left:3px solid var(--accent-success);">' +
          '<span class="goal-stat-label">Pemasukan</span>' +
          '<strong class="goal-stat-value text-success">' + formatRp(incomeTotal) + '</strong></div>';
      }
      if (expenseTotal) {
        html += '<div class="goal-stat" style="border-left:3px solid var(--accent-danger);">' +
          '<span class="goal-stat-label">Pengeluaran</span>' +
          '<strong class="goal-stat-value" style="color:var(--accent-danger)">' + formatRp(expenseTotal) + '</strong></div>';
      }
      if (incomeTotal && expenseTotal) {
        var net = incomeTotal - expenseTotal;
        html += '<div class="goal-stat" style="border-left:3px solid var(--accent-primary);">' +
          '<span class="goal-stat-label">Selisih (Net)</span>' +
          '<strong class="goal-stat-value" style="color:' + (net >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)') + '">' + (net >= 0 ? '+' : '') + formatRp(net) + '</strong></div>';
      }
      html += '</div>';
      el.innerHTML = html;
    }

    function renderDailyStats() {
      var el = document.getElementById('finDailyStats');
      if (!el) return;
      var monthTx = getMonthTransactions();
      if (!monthTx.length) { el.innerHTML = ''; return; }

      var groups = {};
      monthTx.forEach(function (t) {
        if (!groups[t.date]) groups[t.date] = { income: 0, expense: 0 };
        if (t.type === 'income') groups[t.date].income += t.amount;
        else groups[t.date].expense += t.amount;
      });
      var grouped = Object.keys(groups).sort().map(function (k) {
        return { date: k, income: groups[k].income, expense: groups[k].expense };
      });

      var incomeDays = grouped.filter(function (g) { return g.income > 0; });
      var expenseDays = grouped.filter(function (g) { return g.expense > 0; });
      var avgIn = incomeDays.length ? incomeDays.reduce(function (s, g) { return s + g.income; }, 0) / incomeDays.length : 0;
      var avgEx = expenseDays.length ? expenseDays.reduce(function (s, g) { return s + g.expense; }, 0) / expenseDays.length : 0;
      var bestDay = grouped.reduce(function (a, b) { return b.income > a.income ? b : a; }, grouped[0]);
      var worstDay = grouped.reduce(function (a, b) { return b.expense > a.expense ? b : a; }, grouped[0]);

      var html = '<h4 style="font-size:0.95rem;font-weight:700;margin-bottom:12px;"><i class="fas fa-calculator" style="color:var(--accent-warning);"></i> Statistik</h4>';
      html += '<div class="goal-stats">';
      html += '<div class="goal-stat"><span class="goal-stat-label">Rata-rata Masuk/Hari</span><strong class="goal-stat-value text-success" style="font-size:1rem;">' + formatRp(avgIn) + '</strong></div>';
      html += '<div class="goal-stat"><span class="goal-stat-label">Rata-rata Keluar/Hari</span><strong class="goal-stat-value" style="color:var(--accent-danger);font-size:1rem;">' + formatRp(avgEx) + '</strong></div>';
      html += '<div class="goal-stat"><span class="goal-stat-label">Hari Terbaik</span><strong class="goal-stat-value text-success" style="font-size:1rem;">' + bestDay.date.slice(5) + ' · ' + formatRp(bestDay.income) + '</strong></div>';
      html += '<div class="goal-stat"><span class="goal-stat-label">Hari Boros</span><strong class="goal-stat-value" style="color:var(--accent-danger);font-size:1rem;">' + worstDay.date.slice(5) + ' · ' + formatRp(worstDay.expense) + '</strong></div>';
      html += '</div>';
      el.innerHTML = html;
    }

    function render() {
      const sorted = data.transactions.slice().sort(function (a, b) {
        const da = new Date(a.date || 0), db = new Date(b.date || 0);
        return (db.getTime() || 0) - (da.getTime() || 0);
      });

      // Totals (global, unaffected by filter)
      const totalIn = sorted.filter(function (t) { return t.type === 'income'; }).reduce(function (s, t) { return s + t.amount; }, 0);
      const totalEx = sorted.filter(function (t) { return t.type === 'expense'; }).reduce(function (s, t) { return s + t.amount; }, 0);
      totalInEl.textContent = formatRp(totalIn);
      totalExEl.textContent = formatRp(totalEx);
      const balEl = document.getElementById('finTotalBalance');
      if (balEl) balEl.textContent = formatRp(totalIn - totalEx);

      // Apply search + category filter
      const filtered = sorted.filter(function (t) {
        if (filterType !== 'all' && t.type !== filterType) return false;
        if (searchQuery && t.note.toLowerCase().indexOf(searchQuery) === -1) return false;
        return true;
      });

      if (!sorted.length) {
        listEl.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Belum ada transaksi. Catat transaksi pertama Anda di atas.</p></div>';
        renderChart();
        return;
      }

      if (!filtered.length) {
        listEl.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>Tidak ada transaksi yang cocok</p>' +
          '<button class="btn btn-secondary btn-sm" style="margin-top:10px;" onclick="document.getElementById(\'finSearch\').value=\'\';document.getElementById(\'finSearch\').dispatchEvent(new Event(\'input\'));"><i class="fas fa-times"></i> Reset Pencarian</button></div>';
        renderChart();
        return;
      }

      listEl.innerHTML = filtered.map(function (t) {
        var isIncome = t.type === 'income';
        var photoHTML = t.photo ? '<div style="margin-top:8px;"><img src="' + t.photo + '" style="max-width:100%;max-height:120px;border-radius:6px;border:1px solid var(--border-color);cursor:pointer;" onclick="window.open(this.src)" title="Klik untuk perbesar"></div>' : '';
        return '<div class="history-item">' +
          '<div class="history-item-info">' +
            '<div class="history-item-icon" style="background:' + (isIncome ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)') + ';color:' + (isIncome ? 'var(--accent-success)' : 'var(--accent-danger)') + '"><i class="fas ' + (isIncome ? 'fa-arrow-up' : 'fa-arrow-down') + '"></i></div>' +
            '<div class="history-item-text">' +
              '<span class="date">' + t.date + (t.time ? ' · ' + t.time : '') + '</span>' +
              '<span class="note">' + escapeHtml(t.note) + (t.photo ? ' <i class="fas fa-camera" style="color:var(--color-accent-1);"></i>' : '') + '</span>' +
              photoHTML +
              '<div class="history-item-actions">' +
                '<button class="btn btn-secondary btn-xs" onclick="window.__finEdit(' + t.id + ')" title="Edit"><i class="fas fa-pen"></i></button>' +
                '<button class="btn btn-danger btn-xs" onclick="window.__finDelete(' + t.id + ')" title="Hapus"><i class="fas fa-trash"></i></button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="history-item-amount" style="color:' + (isIncome ? 'var(--accent-success)' : 'var(--accent-danger)') + '">' + (isIncome ? '+' : '-') + formatRp(t.amount) + '</div>' +
        '</div>';
      }).join('');
      renderChart();
    }

    // Expose delete/edit globally (inline onclick)
    window.__finDelete = deleteTransaction;
    window.__finEdit = editTransaction;

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var now = new Date();
        var pad = function (n) { return String(n).padStart(2, '0'); };
        var tx = {
          id: Date.now(),
          date: document.getElementById('finDate').value,
          time: pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()),
          timestamp: now.toISOString(),
          note: document.getElementById('finNote').value.trim(),
          amount: parseFloat(document.getElementById('finAmount').value),
          type: document.getElementById('finType').value,
          photo: currentPhotoBase64 || null,
        };
        data.transactions.push(tx);
        saveFin();
        render();
        var label = tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
        showToast('✓ ' + label + ' Tercatat', formatRp(tx.amount) + ' — ' + tx.note + (tx.photo ? ' (+ Foto)' : ''), 'success');
        form.reset();
        currentPhotoBase64 = null;
        if (photoPreview) photoPreview.style.display = 'none';
        if (dateInput) dateInput.valueAsDate = new Date();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (confirm('Hapus semua data keuangan?')) {
          data = { transactions: [] };
          saveFin();
          render();
        }
      });
    }

    render();
  }

  // ===== SAVINGS TRACKER =====
  function initSavings() {
    const STORAGE_KEY = 'financehub_savings_v2';
    let data = loadData();

    const goalForm = document.getElementById('goalForm');
    const depositForm = document.getElementById('depositForm');
    const activeGoalEl = document.getElementById('activeGoal');
    const goalsListWrap = document.getElementById('goalsListWrap');
    const goalsListEl = document.getElementById('goalsList');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Calendar state
    let calMonth = (function () {
      var n = new Date();
      return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0');
    })();
    const calMonthInput = document.getElementById('calMonth');
    const calGoalSelect = document.getElementById('calGoalSelect');
    if (calMonthInput) calMonthInput.value = calMonth;
    let calGoalId = null;

    // Tab switching
    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        tabContents.forEach(function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
        document.getElementById('tab-' + btn.getAttribute('data-tab')).classList.add('active');
      });
    });

    // Goal form → add goal to list
    if (goalForm) {
      goalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var goal = {
          id: Date.now(),
          name: document.getElementById('goalName').value.trim(),
          amount: parseFloat(document.getElementById('goalAmount').value),
          months: parseInt(document.getElementById('goalMonths').value),
          created: new Date().toISOString(),
        };
        if (!data.goals) data.goals = [];
        data.goals.push(goal);
        saveData();
        renderGoals();
        goalForm.reset();
        showToast('✓ Tujuan Berhasil', 'Target tabungan "' + goal.name + '" ditambahkan!', 'success');
        tabButtons[0].click();
      });
    }

    // Deposit form
    if (depositForm) {
      const depositDate = document.getElementById('depositDate');
      if (depositDate) depositDate.valueAsDate = new Date();

      depositForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var goal = getCurrentGoal();
        if (!goal) { alert('Buat tujuan tabungan terlebih dahulu!'); return; }
        const dep = {
          id: Date.now(),
          goalId: goal.id,
          date: document.getElementById('depositDate').value,
          amount: parseFloat(document.getElementById('depositAmount').value),
          note: document.getElementById('depositNote').value.trim() || 'Setoran',
        };
        if (!data.deposits) data.deposits = [];
        data.deposits.push(dep);
        saveData();
        renderGoals();
        renderHistory();
        renderCalendar();
        showToast('✓ Setoran Tercatat', 'Rp ' + dep.amount.toLocaleString('id-ID') + ' berhasil ditambahkan!', 'success');
        depositForm.reset();
        if (depositDate) depositDate.valueAsDate = new Date();
      });
    }

    // Quick deposit buttons
    document.querySelectorAll('.quick-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var goal = getCurrentGoal();
        if (!goal) { alert('Buat tujuan tabungan terlebih dahulu!'); return; }
        const amount = parseFloat(this.getAttribute('data-amount'));
        const dep = {
          id: Date.now(),
          goalId: goal.id,
          date: new Date().toISOString().split('T')[0],
          amount: amount,
          note: 'Quick deposit',
        };
        if (!data.deposits) data.deposits = [];
        data.deposits.push(dep);
        saveData();
        renderGoals();
        renderHistory();
        renderCalendar();
      });
    });

    function getCurrentGoal() {
      if (!data.goals || !data.goals.length) return null;
      // active = selected calendar goal, else first
      if (calGoalId) {
        var found = data.goals.find(function (g) { return g.id === calGoalId; });
        if (found) return found;
      }
      return data.goals[0];
    }

    // Calendar controls
    if (calMonthInput) calMonthInput.addEventListener('change', function () { calMonth = this.value; renderCalendar(); });
    var calTodayBtn = document.getElementById('calMonthToday');
    if (calTodayBtn) calTodayBtn.addEventListener('click', function () {
      var n = new Date();
      calMonth = n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0');
      if (calMonthInput) calMonthInput.value = calMonth;
      renderCalendar();
    });
    if (calGoalSelect) calGoalSelect.addEventListener('change', function () {
      calGoalId = this.value ? parseInt(this.value) : null;
      renderCalendar();
    });

    // Migrate old single-goal format → goals array
    function loadData() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          var d = JSON.parse(saved);
          if (d && Array.isArray(d.goals)) return d;
          // migrate v1: { goal: {...}, deposits: [...] }
          if (d && d.goal) {
            var g = Object.assign({ id: Date.now() }, d.goal);
            var deps = (d.deposits || []).map(function (dep) {
              return Object.assign({ goalId: g.id }, dep);
            });
            return { goals: [g], deposits: deps };
          }
        }
      } catch (e) {}
      return { goals: [], deposits: [] };
    }

    function saveData() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function formatRupiah(num) {
      if (typeof num !== 'number' || isNaN(num)) num = 0;
      return 'Rp ' + num.toLocaleString('id-ID');
    }

    function goalDeposits(goalId) {
      return (data.deposits || []).filter(function (d) { return d.goalId === goalId; });
    }

    // Delete one goal (+ its deposits)
    window.__delGoal = function (id) {
      var g = (data.goals || []).find(function (x) { return x.id === id; });
      if (!g) return;
      if (!confirm('Hapus tujuan "' + g.name + '" dan semua setorannya?')) return;
      data.goals = data.goals.filter(function (x) { return x.id !== id; });
      data.deposits = (data.deposits || []).filter(function (d) { return d.goalId !== id; });
      if (calGoalId === id) calGoalId = null;
      saveData();
      renderGoals();
      renderHistory();
      renderCalendar();
      showToast('✓ Dihapus', 'Tujuan "' + g.name + '" dihapus', 'success');
    };

    // Delete one deposit
    window.__delDeposit = function (id) {
      var dep = (data.deposits || []).find(function (d) { return d.id === id; });
      if (!dep) return;
      if (!confirm('Hapus setoran ' + formatRupiah(dep.amount) + ' (' + dep.date + ')?')) return;
      data.deposits = data.deposits.filter(function (d) { return d.id !== id; });
      saveData();
      renderGoals();
      renderHistory();
      renderCalendar();
      showToast('✓ Dihapus', 'Setoran ' + formatRupiah(dep.amount) + ' dihapus', 'success');
    };

    function renderGoals() {
      var goals = data.goals || [];
      if (!goals.length) {
        if (goalsListWrap) goalsListWrap.style.display = 'none';
        if (activeGoalEl) activeGoalEl.style.display = 'none';
        refreshCalGoalSelect();
        return;
      }
      if (goalsListWrap) goalsListWrap.style.display = 'block';

      var html = goals.map(function (g) {
        var deps = goalDeposits(g.id);
        var saved = deps.reduce(function (s, d) { return s + d.amount; }, 0);
        var percent = Math.min(100, (saved / g.amount) * 100);
        var remaining = Math.max(0, g.amount - saved);
        var monthly = g.months > 0 ? Math.ceil(remaining / g.months) : 0;
        var done = saved >= g.amount;
        return '<div class="goal-item" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;margin-bottom:12px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">' +
            '<h4 style="font-size:1.05rem;font-weight:700;"><i class="fas fa-bullseye" style="color:var(--accent-primary);"></i> ' + escapeHtml(g.name) + (done ? ' <span class="text-success">✓</span>' : '') + '</h4>' +
            '<button class="btn btn-danger btn-xs" onclick="window.__delGoal(' + g.id + ')" title="Hapus tujuan"><i class="fas fa-trash"></i></button>' +
          '</div>' +
          '<div class="goal-stats">' +
            '<div class="goal-stat"><span class="goal-stat-label">Target</span><strong class="goal-stat-value">' + formatRupiah(g.amount) + '</strong></div>' +
            '<div class="goal-stat"><span class="goal-stat-label">Tersimpan</span><strong class="goal-stat-value text-success">' + formatRupiah(saved) + '</strong></div>' +
            '<div class="goal-stat"><span class="goal-stat-label">Sisa Bulan</span><strong class="goal-stat-value">' + Math.max(0, g.months) + '</strong></div>' +
            '<div class="goal-stat"><span class="goal-stat-label">Setoran/Bulan</span><strong class="goal-stat-value text-accent">' + formatRupiah(monthly) + '</strong></div>' +
          '</div>' +
          '<div class="progress-bar-wrap" style="margin-top:12px;">' +
            '<div class="progress-bar"><div class="progress-fill" style="width:' + percent + '%"></div></div>' +
            '<span class="progress-percent">' + percent.toFixed(1) + '%</span>' +
          '</div>' +
          '<div style="font-size:0.82rem;color:var(--text-muted);margin-top:8px;">' +
            (done ? '<i class="fas fa-trophy" style="color:var(--accent-warning);"></i> Target tercapai! 🎉' :
              '<i class="fas fa-chart-line"></i> Sisa: <strong>' + formatRupiah(remaining) + '</strong> · ' + deps.length + ' setoran') +
          '</div>' +
        '</div>';
      }).join('');
      if (goalsListEl) goalsListEl.innerHTML = html;
      refreshCalGoalSelect();
    }

    function refreshCalGoalSelect() {
      if (!calGoalSelect) return;
      var goals = data.goals || [];
      var html = '<option value="">Semua Tujuan</option>';
      goals.forEach(function (g) {
        html += '<option value="' + g.id + '"' + (calGoalId === g.id ? ' selected' : '') + '>' + escapeHtml(g.name) + '</option>';
      });
      calGoalSelect.innerHTML = html;
    }

    function renderCalendar() {
      var el = document.getElementById('calendarView');
      var summaryEl = document.getElementById('calSummary');
      if (!el) return;

      var parts = calMonth.split('-');
      var y = parseInt(parts[0]), m = parseInt(parts[1]) - 1;
      var monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

      // deposits this month (optionally filtered by goal)
      var monthDeps = (data.deposits || []).filter(function (d) {
        if (!d.date) return false;
        if (d.date.slice(0, 7) !== calMonth) return false;
        if (calGoalId && d.goalId !== calGoalId) return false;
        return true;
      });

      var totalMonth = monthDeps.reduce(function (s, d) { return s + d.amount; }, 0);
      var daysWithDeposit = new Set(monthDeps.map(function (d) { return d.date; })).size;

      if (summaryEl) {
        summaryEl.innerHTML = '<div class="goal-stats">' +
          '<div class="goal-stat"><span class="goal-stat-label">Total ' + monthNames[m] + '</span><strong class="goal-stat-value text-success">' + formatRupiah(totalMonth) + '</strong></div>' +
          '<div class="goal-stat"><span class="goal-stat-label">Setoran</span><strong class="goal-stat-value">' + monthDeps.length + '</strong></div>' +
          '<div class="goal-stat"><span class="goal-stat-label">Hari Aktif</span><strong class="goal-stat-value">' + daysWithDeposit + '</strong></div>' +
        '</div>';
      }

      if (!monthDeps.length) {
        el.innerHTML = '<div class="empty-state"><i class="fas fa-calendar"></i><p>Belum ada setoran di ' + monthNames[m] + ' ' + y + '</p></div>';
        return;
      }

      // group deposits by date
      var byDate = {};
      monthDeps.forEach(function (d) {
        if (!byDate[d.date]) byDate[d.date] = [];
        byDate[d.date].push(d);
      });

      var firstDay = new Date(y, m, 1).getDay(); // 0=Sun
      var daysInMonth = new Date(y, m + 1, 0).getDate();
      var dayNames = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

      var html = '<div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:14px;">';
      html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:6px;">';
      dayNames.forEach(function (dn) {
        html += '<div style="text-align:center;font-size:0.72rem;font-weight:700;color:var(--text-muted);padding:4px 0;">' + dn + '</div>';
      });
      html += '</div>';
      html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';
      for (var pad = 0; pad < firstDay; pad++) html += '<div></div>';
      for (var d = 1; d <= daysInMonth; d++) {
        var key = calMonth + '-' + String(d).padStart(2, '0');
        var deps = byDate[key] || [];
        var dayTotal = deps.reduce(function (s, x) { return s + x.amount; }, 0);
        var hasMoney = dayTotal > 0;
        var today = new Date();
        var isToday = (today.getFullYear() === y && today.getMonth() === m && today.getDate() === d);
        var cellStyle = 'min-height:64px;border-radius:8px;padding:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:1px solid ';
        if (hasMoney) {
          cellStyle += 'rgba(16,185,129,0.4);background:rgba(16,185,129,0.08);';
        } else {
          cellStyle += 'var(--border-color);background:var(--bg-tertiary);';
        }
        if (isToday) cellStyle += 'outline:2px solid var(--accent-primary);outline-offset:1px;';
        html += '<div style="' + cellStyle + '" title="' + key + ': ' + formatRupiah(dayTotal) + '">' +
          '<span style="font-size:0.72rem;font-weight:700;color:' + (hasMoney ? 'var(--accent-success)' : 'var(--text-muted)') + ';">' + d + '</span>' +
          (hasMoney ? '<span style="font-size:0.6rem;color:var(--accent-success);font-weight:700;">+' + Math.round(dayTotal / 1000) + 'rb</span>' : '') +
        '</div>';
      }
      html += '</div>';
      // legend + detail list
      html += '<div style="display:flex;gap:16px;justify-content:center;font-size:0.75rem;margin-top:12px;flex-wrap:wrap;">' +
        '<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;background:rgba(16,185,129,0.3);border:1px solid rgba(16,185,129,0.4);border-radius:3px;display:inline-block;"></span> Ada setoran (+rb)</span>' +
        '<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:3px;display:inline-block;"></span> Kosong</span>' +
      '</div>';
      html += '</div>';

      // detail list below calendar
      var sorted = monthDeps.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
      html += '<div style="margin-top:16px;">' +
        '<h4 style="font-size:0.95rem;font-weight:700;margin-bottom:10px;"><i class="fas fa-list-ul" style="color:var(--accent-success);"></i> Detail Setoran ' + monthNames[m] + ' ' + y + '</h4>' +
        sorted.map(function (d) {
          var gname = '';
          var g = (data.goals || []).find(function (x) { return x.id === d.goalId; });
          if (g) gname = ' · <i class="fas fa-bullseye" style="color:var(--accent-primary);font-size:0.7rem;"></i> ' + escapeHtml(g.name);
          return '<div class="history-item">' +
            '<div class="history-item-info">' +
              '<div class="history-item-icon" style="background:rgba(16,185,129,0.1);color:var(--accent-success);"><i class="fas fa-arrow-down"></i></div>' +
              '<div class="history-item-text">' +
                '<span class="date">' + d.date + gname + '</span>' +
                '<span class="note">' + escapeHtml(d.note) + '</span>' +
                '<div class="history-item-actions">' +
                  '<button class="btn btn-danger btn-xs" onclick="window.__delDeposit(' + d.id + ')" title="Hapus"><i class="fas fa-trash"></i></button>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="history-item-amount text-success">+' + formatRupiah(d.amount) + '</div>' +
          '</div>';
        }).join('') + '</div>';

      el.innerHTML = html;
    }

    function renderHistory() {
      const list = document.getElementById('historyList');
      const actions = document.getElementById('historyActions');
      const totalTrans = document.getElementById('totalTransactions');
      const totalDep = document.getElementById('totalDeposited');

      var allDeps = data.deposits || [];
      if (calGoalId) allDeps = allDeps.filter(function (d) { return d.goalId === calGoalId; });

      const sorted = allDeps.slice().sort(function (a, b) {
        const da = new Date(a.date || 0), db = new Date(b.date || 0);
        return (db.getTime() || 0) - (da.getTime() || 0);
      });
      const total = sorted.reduce(function (sum, d) { return sum + d.amount; }, 0);

      if (totalTrans) totalTrans.textContent = sorted.length;
      if (totalDep) totalDep.textContent = formatRupiah(total);

      if (!sorted.length) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Belum ada riwayat setoran</p></div>';
        if (actions) actions.style.display = 'none';
        return;
      }

      if (actions) actions.style.display = 'flex';
      list.innerHTML = sorted.map(function (d) {
        var gname = '';
        var g = (data.goals || []).find(function (x) { return x.id === d.goalId; });
        if (g) gname = ' · <i class="fas fa-bullseye" style="color:var(--accent-primary);font-size:0.7rem;"></i> ' + escapeHtml(g.name);
        return '<div class="history-item">' +
          '<div class="history-item-info">' +
            '<div class="history-item-icon" style="background:rgba(16,185,129,0.1);color:var(--accent-success);"><i class="fas fa-arrow-down"></i></div>' +
            '<div class="history-item-text">' +
              '<span class="date">' + d.date + gname + '</span>' +
              '<span class="note">' + escapeHtml(d.note) + '</span>' +
              '<div class="history-item-actions">' +
                '<button class="btn btn-danger btn-xs" onclick="window.__delDeposit(' + d.id + ')" title="Hapus"><i class="fas fa-trash"></i></button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="history-item-amount text-success">+' + formatRupiah(d.amount) + '</div>' +
        '</div>';
      }).join('');
    }

    function exportCSV(deposits) {
      var goals = data.goals || [];
      let csv = 'Tanggal,Tujuan,Catatan,Jumlah\n';
      deposits.forEach(function (d) {
        var g = goals.find(function (x) { return x.id === d.goalId; });
        csv += d.date + ',"' + (g ? g.name : '-') + '","' + d.note + '",' + d.amount + '\n';
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'riwayat-tabungan.csv';
      a.click();
      URL.revokeObjectURL(url);
    }

    // Export current view (respect goal filter)
    var exportBtn2 = document.getElementById('exportHistoryBtn');
    if (exportBtn2) exportBtn2.addEventListener('click', function () {
      var allDeps = data.deposits || [];
      if (calGoalId) allDeps = allDeps.filter(function (d) { return d.goalId === calGoalId; });
      exportCSV(allDeps);
    });

    // Clear history (respect goal filter)
    var clearBtn2 = document.getElementById('clearHistoryBtn');
    if (clearBtn2) clearBtn2.addEventListener('click', function () {
      var msg = calGoalId ? 'Hapus semua riwayat setoran tujuan ini?' : 'Hapus semua riwayat setoran?';
      if (confirm(msg)) {
        if (calGoalId) {
          data.deposits = (data.deposits || []).filter(function (d) { return d.goalId !== calGoalId; });
        } else {
          data.deposits = [];
        }
        saveData();
        renderGoals();
        renderHistory();
        renderCalendar();
      }
    });

    renderGoals();
    renderHistory();
    renderCalendar();
  }

  // ===== UNIT CONVERTERS =====
  function initConverters() {
    // Tabs
    document.querySelectorAll('.conv-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        const type = this.getAttribute('data-converter');
        document.querySelectorAll('.conv-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.conv-content').forEach(function (c) { c.classList.remove('active'); });
        this.classList.add('active');
        document.getElementById('conv-' + type).classList.add('active');
      });
    });

    // Temperature
    setupConverter('temp', {
      C: 1, F: 1, K: 1, R: 1
    }, function (val, from, to) {
      let c;
      if (from === 'C') c = val;
      else if (from === 'F') c = (val - 32) * 5 / 9;
      else if (from === 'K') c = val - 273.15;
      else if (from === 'R') c = val * 5 / 4;

      if (to === 'C') return c;
      if (to === 'F') return c * 9 / 5 + 32;
      if (to === 'K') return c + 273.15;
      if (to === 'R') return c * 4 / 5;
      return c;
    });

    // Force
    setupConverter('force', {
      N: 1, dyn: 1e-5, kgf: 9.80665, lbf: 4.44822
    });

    // Length (in meters)
    setupConverter('length', {
      m: 1, km: 1000, cm: 0.01, mm: 0.001,
      mi: 1609.344, ft: 0.3048, in: 0.0254
    });

    // Weight (in kg)
    setupConverter('weight', {
      kg: 1, g: 0.001, mg: 0.000001,
      lb: 0.453592, oz: 0.0283495, ton: 1000
    });

    // Area (in m2)
    setupConverter('area', {
      m2: 1, km2: 1e6, cm2: 0.0001,
      ha: 10000, acre: 4046.86, ft2: 0.092903
    });

    // Trigonometry
    document.getElementById('calcSin').addEventListener('click', function () {
      const v = parseFloat(document.getElementById('sinVal').value) || 0;
      document.getElementById('sinRes').textContent = '= ' + formatNumber(Math.sin(v * Math.PI / 180));
    });
    document.getElementById('calcCos').addEventListener('click', function () {
      const v = parseFloat(document.getElementById('cosVal').value) || 0;
      document.getElementById('cosRes').textContent = '= ' + formatNumber(Math.cos(v * Math.PI / 180));
    });
    document.getElementById('calcTan').addEventListener('click', function () {
      const v = parseFloat(document.getElementById('tanVal').value) || 0;
      document.getElementById('tanRes').textContent = '= ' + formatNumber(Math.tan(v * Math.PI / 180));
    });
    document.getElementById('calcExtraTrigo').addEventListener('click', function () {
      const angle = parseFloat(document.getElementById('extraAngle').value) || 0;
      const func = document.getElementById('extraFunc').value;
      const rad = angle * Math.PI / 180;
      let res;
      if (func === 'asin') res = Math.asin(Math.min(1, Math.max(-1, angle))) * 180 / Math.PI;
      else if (func === 'acos') res = Math.acos(Math.min(1, Math.max(-1, angle))) * 180 / Math.PI;
      else if (func === 'atan') res = Math.atan(angle) * 180 / Math.PI;
      else if (func === 'csc') res = 1 / Math.sin(rad);
      else if (func === 'sec') res = 1 / Math.cos(rad);
      else if (func === 'cot') res = 1 / Math.tan(rad);
      document.getElementById('extraTrigoRes').value = formatNumber(res);
    });

    function setupConverter(prefix, factors, customConvert) {
      const valueEl = document.getElementById(prefix + 'Value');
      const fromEl = document.getElementById(prefix + 'From');
      const toEl = document.getElementById(prefix + 'To');
      const resultEl = document.getElementById(prefix + 'Result');
      const convertBtn = document.getElementById('convert' + capitalize(prefix));
      const swapBtn = document.getElementById('swap' + capitalize(prefix));

      if (!valueEl || !fromEl || !toEl || !resultEl) return;

      function convert() {
        const val = parseFloat(valueEl.value);
        const from = fromEl.value;
        const to = toEl.value;
        if (isNaN(val)) { resultEl.value = '-'; return; }

        let result;
        if (customConvert) {
          result = customConvert(val, from, to);
        } else {
          const base = val * factors[from];
          result = base / factors[to];
        }
        resultEl.value = formatNumber(result);
      }

      convertBtn?.addEventListener('click', convert);
      valueEl.addEventListener('input', convert);
      fromEl.addEventListener('change', convert);
      toEl.addEventListener('change', convert);

      swapBtn?.addEventListener('click', function () {
        const temp = fromEl.value;
        fromEl.value = toEl.value;
        toEl.value = temp;
        convert();
      });

      convert();
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }

  // ===== Year =====
  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ===== Toast Notification =====
  function showToast(title, msg, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.innerHTML =
      '<div class="toast-icon"><i class="fas ' + icons[type] + '"></i></div>' +
      '<div class="toast-text"><div class="toast-title">' + title + '</div><div class="toast-msg">' + msg + '</div></div>';
    container.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('out');
      setTimeout(function () { toast.remove(); }, 300);
    }, 2000);
  }
})();

