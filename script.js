const gameListEl = document.getElementById('gameList');
const bonusLabel = document.getElementById('bonusLabel');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const resetBtn = document.getElementById('resetBtn');
const countEl = document.getElementById('count');

const GAME_COUNT = 5;
let tries = 0;
let lastGames = [];

function colorClass(n) {
  if (n <= 10) return 'c-yellow';
  if (n <= 20) return 'c-blue';
  if (n <= 30) return 'c-red';
  if (n <= 40) return 'c-gray';
  return 'c-green';
}

function drawNumbers() {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const main = pool.slice(0, 6).sort((a, b) => a - b);
  const bonus = pool[6];
  return { main, bonus };
}

function renderGames(games) {
  gameListEl.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D', 'E'];

  games.forEach(({ main, bonus }, gi) => {
    const row = document.createElement('div');
    row.className = 'game-row';

    const label = document.createElement('span');
    label.className = 'game-label';
    label.textContent = labels[gi];
    row.appendChild(label);

    const balls = document.createElement('div');
    balls.className = 'balls';

    main.forEach((n, idx) => {
      const ball = document.createElement('div');
      ball.className = `ball ${colorClass(n)}`;
      ball.textContent = n;
      ball.style.animationDelay = `${(gi * 7 + idx) * 0.05}s`;
      balls.appendChild(ball);
    });

    const plus = document.createElement('div');
    plus.className = 'ball bonus-plus';
    plus.textContent = '+';
    balls.appendChild(plus);

    const bonusBall = document.createElement('div');
    bonusBall.className = `ball ${colorClass(bonus)}`;
    bonusBall.textContent = bonus;
    bonusBall.style.animationDelay = `${(gi * 7 + 6) * 0.05}s`;
    balls.appendChild(bonusBall);

    row.appendChild(balls);
    gameListEl.appendChild(row);
  });

  bonusLabel.innerHTML = `각 행 6개가 추천 번호, <b>+ 뒤</b>는 보너스 번호예요!`;
  lastGames = games;
}

function renderPlaceholders() {
  gameListEl.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D', 'E'];

  labels.forEach((lbl) => {
    const row = document.createElement('div');
    row.className = 'game-row';

    const label = document.createElement('span');
    label.className = 'game-label';
    label.textContent = lbl;
    row.appendChild(label);

    const balls = document.createElement('div');
    balls.className = 'balls';
    for (let i = 0; i < 6; i++) {
      const ph = document.createElement('div');
      ph.className = 'ball placeholder';
      ph.textContent = '?';
      balls.appendChild(ph);
    }
    row.appendChild(balls);
    gameListEl.appendChild(row);
  });
}

renderPlaceholders();

generateBtn.addEventListener('click', () => {
  generateBtn.disabled = true;
  generateBtn.textContent = '🎰 추첨 중...';
  setTimeout(() => {
    const games = Array.from({ length: GAME_COUNT }, drawNumbers);
    renderGames(games);
    tries++;
    countEl.textContent = `지금까지 ${tries}번 추천했어요`;
    generateBtn.disabled = false;
    generateBtn.textContent = '🎲 다시 추천받기';
  }, 350);
});

copyBtn.addEventListener('click', async () => {
  if (!lastGames.length) {
    bonusLabel.textContent = '먼저 번호를 추천받아 주세요! 🙂';
    return;
  }
  const labels = ['A', 'B', 'C', 'D', 'E'];
  const text = lastGames.map(({ main, bonus }, i) =>
    `${labels[i]}게임: ${main.join(', ')} + 보너스 ${bonus}`
  ).join('\n');
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = '✅ 복사됨!';
    setTimeout(() => (copyBtn.textContent = '📋 전체 복사'), 1500);
  } catch {
    copyBtn.textContent = '복사 실패';
    setTimeout(() => (copyBtn.textContent = '📋 전체 복사'), 1500);
  }
});

resetBtn.addEventListener('click', () => {
  renderPlaceholders();
  bonusLabel.textContent = '아래 버튼을 눌러 시작하세요 ✨';
  generateBtn.textContent = '🎲 번호 추천받기';
  lastGames = [];
});

// ===== 다크 / 라이트 모드 =====
const themeToggle = document.getElementById('themeToggle');

function applyThemeIcon() {
  const current = document.documentElement.getAttribute('data-theme');
  // 현재 다크면 '라이트로 전환'(☀️), 현재 라이트면 '다크로 전환'(🌙) 아이콘 표시
  themeToggle.textContent = current === 'dark' ? '☀️' : '🌙';
}

applyThemeIcon();

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  applyThemeIcon();
  setGiscusTheme(next); // 댓글(giscus) 테마도 함께 전환
});

// ===== 댓글 (giscus) =====
function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

// 현재 페이지 테마에 맞춰 giscus 위젯을 동적으로 삽입
(function loadGiscus() {
  const container = document.getElementById('comments');
  if (!container) return;
  const s = document.createElement('script');
  s.src = 'https://giscus.app/client.js';
  s.setAttribute('data-repo', 'minsookye/jocoding-kms');
  s.setAttribute('data-repo-id', 'R_kgDOS1Dung');
  s.setAttribute('data-category', 'Announcements');
  s.setAttribute('data-category-id', 'DIC_kwDOS1Duns4C-zhQ');
  s.setAttribute('data-mapping', 'pathname');
  s.setAttribute('data-strict', '0');
  s.setAttribute('data-reactions-enabled', '1');
  s.setAttribute('data-emit-metadata', '0');
  s.setAttribute('data-input-position', 'top');
  s.setAttribute('data-theme', currentTheme());
  s.setAttribute('data-lang', 'ko');
  s.crossOrigin = 'anonymous';
  s.async = true;
  container.appendChild(s);
})();

// 테마 토글 시 giscus iframe에 메시지를 보내 테마 동기화
function setGiscusTheme(theme) {
  const iframe = document.querySelector('iframe.giscus-frame');
  if (!iframe || !iframe.contentWindow) return;
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme } } },
    'https://giscus.app'
  );
}
