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
    initCalculator();
    initMathSolver();
    initSavings();
    initConverters();
    initYear();
  });

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

  // ===== Active Nav =====
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) link.classList.add('active');
          });
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(function (section) { observer.observe(section); });
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

  function evaluateMath(expr) {
    // Replace math functions
    let normalized = expr
      .replace(/[×]/g, '*')
      .replace(/[÷]/g, '/')
      .replace(/[−]/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/sqrt\s*\(/g, 'Math.sqrt(')
      .replace(/log\s*\(/g, 'Math.log10(')
      .replace(/ln\s*\(/g, 'Math.log(')
      .replace(/abs\s*\(/g, 'Math.abs(')
      .replace(/\^/g, '**');

    // Handle sin/cos/tan with degree input
    normalized = normalized.replace(/sin\s*\(/g, 'Math.sin(Math.PI/180*(').replace(/cos\s*\(/g, 'Math.cos(Math.PI/180*(').replace(/tan\s*\(/g, 'Math.tan(Math.PI/180*(');

    // Close opened parentheses from sin/cos/tan replacement
    // This is a simple counter approach
    normalized = normalized.replace(/Math\.(sin|cos|tan)\(Math\.PI\/180\*\(/g, function (match) { return match; });

    // Safer manual handling
    normalized = handleTrigParentheses(normalized);

    // Validate characters
    if (!/^[\d\s\+\-\*\/\%\.\(\)\,\MathPIsqrtlog10absncosintang**]*$/.test(normalized)) {
      throw new Error('Invalid expression');
    }

    const result = new Function('return ' + normalized)();
    if (typeof result !== 'number' || !isFinite(result)) throw new Error('Invalid result');
    return result;
  }

  function handleTrigParentheses(expr) {
    // Replace sin(x), cos(x), tan(x) with degree-to-radian conversions properly
    return expr.replace(/Math\.(sin|cos|tan)\(\s*(-?\d+\.?\d*)\s*\)/g, function (match, func, val) {
      const rad = parseFloat(val) * Math.PI / 180;
      if (func === 'sin') return Math.sin(rad);
      if (func === 'cos') return Math.cos(rad);
      return Math.tan(rad);
    });
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

  // ===== SAVINGS TRACKER =====
  function initSavings() {
    const STORAGE_KEY = 'financehub_savings_v1';
    let data = loadData();

    const goalForm = document.getElementById('goalForm');
    const depositForm = document.getElementById('depositForm');
    const activeGoalEl = document.getElementById('activeGoal');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab switching
    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        tabContents.forEach(function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
        document.getElementById('tab-' + btn.getAttribute('data-tab')).classList.add('active');
      });
    });

    // Goal form
    if (goalForm) {
      goalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        data.goal = {
          name: document.getElementById('goalName').value.trim(),
          amount: parseFloat(document.getElementById('goalAmount').value),
          months: parseInt(document.getElementById('goalMonths').value),
          created: new Date().toISOString(),
        };
        saveData();
        renderGoal();
        goalForm.reset();
        // Switch to deposit tab
        tabButtons[1].click();
      });
    }

    // Deposit form
    if (depositForm) {
      const depositDate = document.getElementById('depositDate');
      if (depositDate) depositDate.valueAsDate = new Date();

      depositForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!data.goal) { alert('Buat tujuan tabungan terlebih dahulu!'); return; }
        const dep = {
          id: Date.now(),
          date: document.getElementById('depositDate').value,
          amount: parseFloat(document.getElementById('depositAmount').value),
          note: document.getElementById('depositNote').value.trim() || 'Setoran',
        };
        data.deposits.push(dep);
        saveData();
        renderGoal();
        renderHistory();
        depositForm.reset();
        if (depositDate) depositDate.valueAsDate = new Date();
      });
    }

    // Quick deposit buttons
    document.querySelectorAll('.quick-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!data.goal) { alert('Buat tujuan tabungan terlebih dahulu!'); return; }
        const amount = parseFloat(this.getAttribute('data-amount'));
        const dep = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          amount: amount,
          note: 'Quick deposit',
        };
        data.deposits.push(dep);
        saveData();
        renderGoal();
        renderHistory();
      });
    });

    // Delete goal
    document.getElementById('deleteGoalBtn')?.addEventListener('click', function () {
      if (confirm('Hapus tujuan dan riwayat tabungan?')) {
        data = { goal: null, deposits: [] };
        saveData();
        renderGoal();
        renderHistory();
      }
    });

    // Clear history
    document.getElementById('clearHistoryBtn')?.addEventListener('click', function () {
      if (confirm('Hapus semua riwayat setoran?')) {
        data.deposits = [];
        saveData();
        renderGoal();
        renderHistory();
      }
    });

    // Export CSV
    document.getElementById('exportHistoryBtn')?.addEventListener('click', function () {
      exportCSV(data.deposits);
    });

    function loadData() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return { goal: null, deposits: [] };
    }

    function saveData() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function formatRupiah(num) {
      return 'Rp ' + num.toLocaleString('id-ID');
    }

    function renderGoal() {
      if (!data.goal) {
        activeGoalEl.style.display = 'none';
        return;
      }
      activeGoalEl.style.display = 'block';
      document.getElementById('activeGoalName').textContent = data.goal.name;
      document.getElementById('displayTarget').textContent = formatRupiah(data.goal.amount);

      const saved = data.deposits.reduce(function (sum, d) { return sum + d.amount; }, 0);
      document.getElementById('displaySaved').textContent = formatRupiah(saved);

      const monthsLeft = Math.max(0, data.goal.months);
      document.getElementById('displayMonthsLeft').textContent = monthsLeft + ' bulan';

      const remaining = Math.max(0, data.goal.amount - saved);
      const monthly = monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : 0;
      document.getElementById('displayMonthly').textContent = formatRupiah(monthly);

      const percent = Math.min(100, (saved / data.goal.amount) * 100);
      document.getElementById('goalProgressFill').style.width = percent + '%';
      document.getElementById('goalProgressPercent').textContent = percent.toFixed(1) + '%';

      const insightEl = document.getElementById('goalInsight');
      if (saved >= data.goal.amount) {
        insightEl.innerHTML = '<i class="fas fa-trophy"></i> Selamat! Target tabungan tercapai! 🎉';
      } else {
        const remainingAmount = data.goal.amount - saved;
        insightEl.innerHTML = '<i class="fas fa-chart-line"></i> Sisa yang perlu ditabung: <strong>' + formatRupiah(remainingAmount) + '</strong>. Tetap konsisten!';
      }
    }

    function renderHistory() {
      const list = document.getElementById('historyList');
      const actions = document.getElementById('historyActions');
      const totalTrans = document.getElementById('totalTransactions');
      const totalDep = document.getElementById('totalDeposited');

      const sorted = data.deposits.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
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
        return '<div class="history-item">' +
          '<div class="history-item-info">' +
            '<div class="history-item-icon"><i class="fas fa-arrow-down"></i></div>' +
            '<div class="history-item-text">' +
              '<span class="date">' + d.date + '</span>' +
              '<span class="note">' + escapeHtml(d.note) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="history-item-amount">' + formatRupiah(d.amount) + '</div>' +
        '</div>';
      }).join('');
    }

    function exportCSV(deposits) {
      let csv = 'Tanggal,Catatan,Jumlah\n';
      deposits.forEach(function (d) {
        csv += d.date + ',"' + d.note + '",' + d.amount + '\n';
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'riwayat-tabungan.csv';
      a.click();
      URL.revokeObjectURL(url);
    }

    renderGoal();
    renderHistory();
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
})();
