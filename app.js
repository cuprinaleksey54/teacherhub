const SUBJECTS = [
  "Русский язык",
  "Литература",
  "Математика",
  "Информатика",
  "История",
  "Обществознание",
  "Английский язык",
  "Биология",
  "Химия",
  "Физика",
  "География",
  "Начальные классы",
  "ОБЖ",
  "Физкультура",
  "Музыка",
  "ИЗО",
];

const VK_GROUP_URL = "https://vk.com/molodays_one";

const els = {
  app: document.getElementById("app"),
  year: document.getElementById("year"),
  hero: document.getElementById("hero"),
  authModal: document.getElementById("authModal"),
  authTitle: document.getElementById("authTitle"),
  authSubtitle: document.getElementById("authSubtitle"),
  authForm: document.getElementById("authForm"),
  authNotice: document.getElementById("authNotice"),
  loginPane: document.getElementById("loginPane"),
  signupPane: document.getElementById("signupPane"),
  tabLogin: document.getElementById("tabLogin"),
  tabSignup: document.getElementById("tabSignup"),
  toSignup: document.getElementById("toSignup"),
  toLogin: document.getElementById("toLogin"),
  closeAuth: document.getElementById("closeAuth"),
  loginBtn: document.getElementById("loginBtn"),
  signupBtn: document.getElementById("signupBtn"),
  heroSignup: document.getElementById("heroSignup"),
  cardSignup: document.getElementById("cardSignup"),
  subjects: document.getElementById("subjects"),
  userBadge: document.getElementById("userBadge"),
  userName: document.getElementById("userName"),
};

const storage = {
  getUser() {
    try {
      const raw = localStorage.getItem("teacherhub:user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser(user) {
    localStorage.setItem("teacherhub:user", JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem("teacherhub:user");
  },
};

function $(selector, root = document) {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`Не найден элемент: ${selector}`);
  return el;
}

function setActiveNav(path) {
  const links = document.querySelectorAll(".nav__link");
  for (const a of links) {
    const href = a.getAttribute("href") || "";
    const isActive = href === `#/${path}`;
    a.classList.toggle("is-active", isActive);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showNotice(message, tone = "info") {
  els.authNotice.hidden = false;
  els.authNotice.textContent = message;
  els.authNotice.style.borderColor =
    tone === "good"
      ? "rgba(52,211,153,.35)"
      : tone === "bad"
        ? "rgba(251,113,133,.35)"
        : "rgba(255,255,255,.14)";
}

function clearNotice() {
  els.authNotice.hidden = true;
  els.authNotice.textContent = "";
  els.authNotice.removeAttribute("style");
}

function openAuth(mode) {
  clearNotice();
  setAuthMode(mode);
  if (typeof els.authModal.showModal === "function") {
    els.authModal.showModal();
  } else {
    // Fallback for older browsers
    els.authModal.setAttribute("open", "open");
  }
}

function closeAuth() {
  clearNotice();
  if (typeof els.authModal.close === "function") {
    els.authModal.close();
  } else {
    els.authModal.removeAttribute("open");
  }
}

function setAuthMode(mode) {
  const isLogin = mode === "login";
  els.tabLogin.classList.toggle("is-active", isLogin);
  els.tabSignup.classList.toggle("is-active", !isLogin);
  els.loginPane.hidden = !isLogin;
  els.signupPane.hidden = isLogin;
  els.authTitle.textContent = isLogin ? "Вход" : "Регистрация";
  els.authSubtitle.textContent = isLogin
    ? "Пока без сервера: формы и подготовка под интеграцию."
    : "Создаём профиль и сохраняем выбор (пока локально).";
}

function getRoute() {
  const raw = (location.hash || "#/home").replace(/^#\//, "");
  const clean = raw.split("?")[0].trim();
  return clean || "home";
}

function setHeroVisible(visible) {
  els.hero.style.display = visible ? "" : "none";
}

function render(route) {
  setActiveNav(route);
  setHeroVisible(route === "home");

  const user = storage.getUser();
  if (user?.name) {
    els.userBadge.hidden = false;
    els.userName.textContent = user.name;
    els.loginBtn.textContent = "Выйти";
  } else {
    els.userBadge.hidden = true;
    els.userName.textContent = "";
    els.loginBtn.textContent = "Войти";
  }

  const pages = {
    home: renderHome,
    ai: renderAI,
    lessons: renderLessons,
    journal: renderJournal,
    steps: renderSteps,
    faq: renderFaq,
    community: renderCommunity,
    support: renderSupport,
  };

  const fn = pages[route] || renderNotFound;
  els.app.innerHTML = fn();
  wirePage(route);
}

function renderHome() {
  const user = storage.getUser();
  const greet = user?.name ? `Привет, ${escapeHtml(user.name)}!` : "Привет!";
  return `
    <div class="panel">
      <h2 class="panel__title">${greet}</h2>
      <p class="panel__desc">
        Выбери раздел сверху или начни с быстрого выбора. Здесь будет “умная” лента материалов под твои предметы.
      </p>
      <div class="panel__grid">
        ${tile("AI помощник", "Планы уроков, объяснения тем, идеи заданий и проверочные вопросы.", [
          { label: "Открыть AI", href: "#/ai", variant: "primary" },
        ])}
        ${tile("Материалы к урокам", "Шаблоны презентаций, конспекты, задания, подборки по предметам.", [
          { label: "Открыть Уроки", href: "#/lessons", variant: "ghost" },
        ])}
        ${tile("Журнал", "Подсказки по заполнению, шаблоны и чек-листы.", [
          { label: "Открыть Журнал", href: "#/journal", variant: "ghost" },
        ])}
        ${tile("Сообщество", "Вопросы коллегам, обмен материалами, поддержка.", [
          { label: "Открыть Сообщество", href: "#/community", variant: "ghost" },
        ])}
      </div>
    </div>
  `;
}

function renderAI() {
  return `
    <div class="panel">
      <h2 class="panel__title">AI помощник</h2>
      <p class="panel__desc">
        Здесь будет чат с AI (позже подключим реальный API). Пока — заготовка и примеры промптов.
      </p>
      <div class="panel__grid">
        ${tile("План урока за 5 минут", "Сгенерировать план по теме и классу, с целями, этапами, домашним заданием.", [
          { label: "Скопировать промпт", action: "copy", value: "Составь план урока по теме: ____ для ____ класса. Дай цели, этапы, задания и домашнее задание." },
        ])}
        ${tile("Объясни тему простыми словами", "Для учеников с разным уровнем подготовки.", [
          { label: "Скопировать промпт", action: "copy", value: "Объясни тему: ____ простыми словами. Приведи 2 примера и 3 типичные ошибки." },
        ])}
      </div>
    </div>
  `;
}

function renderLessons() {
  return `
    <div class="panel">
      <h2 class="panel__title">Уроки / предметы</h2>
      <p class="panel__desc">
        Тут будет каталог предметов и материалы (презентации, конспекты, задания). Сейчас — прототип с фильтрами.
      </p>
      <div class="tile">
        <h3 class="tile__title">Предметы</h3>
        <p class="tile__text">Выбери предмет — и мы покажем подборки материалов.</p>
        <div class="tile__actions" id="subjectsQuick"></div>
      </div>
      <div class="tile" style="margin-top:12px">
        <h3 class="tile__title">Пакеты материалов (пример)</h3>
        <p class="tile__text">Здесь будут карточки: “Презентация + конспект + задания”.</p>
        <div class="tile__actions">
          <a class="btn btn--ghost" href="#/support">Предложить материал</a>
          <a class="btn btn--primary" href="#/community">Попросить у коллег</a>
        </div>
      </div>
    </div>
  `;
}

function renderJournal() {
  return `
    <div class="panel">
      <h2 class="panel__title">Заполнение журнала</h2>
      <p class="panel__desc">
        Раздел с инструкциями и шаблонами: темы уроков, формулировки целей, виды работ, оценивание.
      </p>
      <div class="panel__grid">
        ${tile("Шаблоны формулировок", "Готовые фразы для тем, целей и видов деятельности.", [
          { label: "Открыть шаблоны", action: "toast", value: "Скоро добавим базу шаблонов." },
        ])}
        ${tile("Чек-лист на неделю", "Что проверить: календарно-тематическое, ДЗ, контрольные, замечания.", [
          { label: "Открыть чек-лист", action: "toast", value: "Скоро добавим чек-лист." },
        ])}
      </div>
    </div>
  `;
}

function renderSteps() {
  return `
    <div class="panel">
      <h2 class="panel__title">Шаги (путь молодого учителя)</h2>
      <p class="panel__desc">
        Короткие “кроки/шаги” — что сделать в первые недели и как не утонуть в бумагах.
      </p>
      <div class="panel__grid">
        ${tile("Неделя 1", "Знакомство с программой, журналом, требованиями, классом.", [
          { label: "Открыть", action: "toast", value: "Скоро добавим детальные шаги." },
        ])}
        ${tile("Неделя 2", "Первые контрольные точки: планирование, домашние задания, обратная связь.", [
          { label: "Открыть", action: "toast", value: "Скоро добавим детальные шаги." },
        ])}
      </div>
    </div>
  `;
}

function renderFaq() {
  return `
    <div class="panel">
      <h2 class="panel__title">Частые вопросы (FAQ)</h2>
      <p class="panel__desc">
        Соберём вопросы: журнал, проверки, документы, конфликтные ситуации, методические советы.
      </p>
      <div class="panel__grid">
        ${tile("Как быстро подготовить урок?", "Мини-набор: цель → структура → задания → проверка.", [
          { label: "Открыть AI помощник", href: "#/ai", variant: "primary" },
        ])}
        ${tile("Что писать в журнал?", "Подсказки и шаблоны формулировок для разных предметов.", [
          { label: "Открыть Журнал", href: "#/journal", variant: "ghost" },
        ])}
      </div>
    </div>
  `;
}

function renderCommunity() {
  return `
    <div class="panel">
      <h2 class="panel__title">Сообщество</h2>
      <p class="panel__desc">
        Ссылка на VK-группу/чат для общения и обмена материалами.
      </p>
      <div class="tile">
        <h3 class="tile__title">VK группа</h3>
        <p class="tile__text">
          Укажи здесь ссылку на свою группу VK. Сейчас стоит заглушка.
        </p>
        <div class="tile__actions">
          <a class="btn btn--primary" href="${escapeHtml(VK_GROUP_URL)}" target="_blank" rel="noreferrer">
            Открыть VK
          </a>
          <button class="btn btn--ghost" type="button" data-action="copy" data-value="${escapeHtml(VK_GROUP_URL)}">
            Скопировать ссылку
          </button>
        </div>
        <p class="muted small" style="margin-top:10px">
          Если дашь точную ссылку на VK-группу — я вставлю её сюда.
        </p>
      </div>
    </div>
  `;
}

function renderSupport() {
  return `
    <div class="panel">
      <h2 class="panel__title">Техподдержка</h2>
      <p class="panel__desc">
        Здесь будет форма обращения, правила, контакты и сбор баг-репортов.
      </p>
      <div class="panel__grid">
        ${tile("Сообщить об ошибке", "Опиши, что случилось, и как повторить. Можно приложить скрин.", [
          { label: "Открыть форму", action: "toast", value: "Скоро добавим форму (и подключим бэкенд)." },
        ])}
        ${tile("Предложить идею", "Какой раздел/функция нужна? Что добавить в “Уроки” и “Журнал”?", [
          { label: "Оставить идею", action: "toast", value: "Скоро добавим форму идей." },
        ])}
      </div>
    </div>
  `;
}

function renderNotFound() {
  return `
    <div class="panel">
      <h2 class="panel__title">Страница не найдена</h2>
      <p class="panel__desc">Похоже, такой вкладки нет. Вернись на главную.</p>
      <div class="tile__actions">
        <a class="btn btn--primary" href="#/home">На главную</a>
      </div>
    </div>
  `;
}

function tile(title, text, actions = []) {
  const btns = actions
    .map((a) => {
      if (a.href) {
        const cls = a.variant === "primary" ? "btn btn--primary" : "btn btn--ghost";
        return `<a class="${cls}" href="${escapeHtml(a.href)}">${escapeHtml(a.label)}</a>`;
      }
      if (a.action === "copy") {
        return `<button class="btn btn--ghost" type="button" data-action="copy" data-value="${escapeHtml(a.value)}">${escapeHtml(a.label)}</button>`;
      }
      return `<button class="btn btn--ghost" type="button" data-action="${escapeHtml(a.action)}" data-value="${escapeHtml(a.value)}">${escapeHtml(a.label)}</button>`;
    })
    .join("");

  return `
    <div class="tile">
      <h3 class="tile__title">${escapeHtml(title)}</h3>
      <p class="tile__text">${escapeHtml(text)}</p>
      <div class="tile__actions">${btns}</div>
    </div>
  `;
}

function wirePage(route) {
  if (route === "lessons") {
    const wrap = document.getElementById("subjectsQuick");
    if (wrap) {
      wrap.innerHTML = SUBJECTS.slice(0, 8)
        .map((s) => `<button class="btn btn--ghost" type="button" data-action="toast" data-value="Скоро материалы по предмету: ${escapeHtml(s)}">${escapeHtml(s)}</button>`)
        .join("");
    }
  }

  els.app.addEventListener(
    "click",
    (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest("[data-action]");
      if (!(btn instanceof HTMLElement)) return;
      const action = btn.dataset.action;
      const value = btn.dataset.value || "";
      if (action === "copy") {
        navigator.clipboard
          ?.writeText(value)
          .then(() => toast("Скопировано"))
          .catch(() => toast("Не получилось скопировать"));
      } else if (action === "toast") {
        toast(value || "Скоро будет");
      }
    },
    { once: true },
  );
}

function toast(message) {
  const div = document.createElement("div");
  div.className = "notice";
  div.textContent = message;
  div.style.position = "fixed";
  div.style.left = "20px";
  div.style.right = "20px";
  div.style.bottom = "18px";
  div.style.maxWidth = "720px";
  div.style.margin = "0 auto";
  div.style.zIndex = "50";
  div.style.background = "rgba(10,14,25,.92)";
  div.style.backdropFilter = "blur(10px)";
  document.body.appendChild(div);
  setTimeout(() => {
    div.style.opacity = "0";
    div.style.transition = "opacity .25s ease";
  }, 1700);
  setTimeout(() => div.remove(), 2100);
}

function fillSubjects() {
  els.subjects.innerHTML = SUBJECTS.map((s, i) => {
    const id = `sub_${i}`;
    return `
      <label class="pill" for="${id}">
        <input id="${id}" type="checkbox" name="subject" value="${escapeHtml(s)}" />
        <span>${escapeHtml(s)}</span>
      </label>
    `;
  }).join("");
}

function setupAuth() {
  els.loginBtn.addEventListener("click", () => {
    const user = storage.getUser();
    if (user?.name) {
      storage.clearUser();
      render(getRoute());
      toast("Вы вышли");
      return;
    }
    openAuth("login");
  });
  els.signupBtn.addEventListener("click", () => openAuth("signup"));
  els.heroSignup.addEventListener("click", () => openAuth("signup"));
  els.cardSignup.addEventListener("click", () => openAuth("signup"));

  els.closeAuth.addEventListener("click", () => closeAuth());
  els.tabLogin.addEventListener("click", () => setAuthMode("login"));
  els.tabSignup.addEventListener("click", () => setAuthMode("signup"));
  els.toSignup.addEventListener("click", () => setAuthMode("signup"));
  els.toLogin.addEventListener("click", () => setAuthMode("login"));

  els.authModal.addEventListener("click", (e) => {
    if (e.target === els.authModal) closeAuth();
  });

  els.authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearNotice();
    const submitter = e.submitter;
    const action = submitter?.dataset?.action || "login";

    if (action === "login") {
      showNotice(
        "Вход пока без сервера. Я могу подключить бэкенд позже; сейчас сохраним демо-профиль.",
        "info",
      );
      const email = String(new FormData(els.authForm).get("email") || "").trim();
      const name = email ? email.split("@")[0] : "Учитель";
      storage.setUser({ name, email, createdAt: new Date().toISOString() });
      render(getRoute());
      closeAuth();
      toast("Добро пожаловать!");
      return;
    }

    if (action === "signup") {
      const fd = new FormData(els.authForm);
      const name = String(fd.get("name") || "").trim() || "Учитель";
      const city = String(fd.get("city") || "").trim();
      const email = String(fd.get("emailSignup") || "").trim();
      const needs = fd.getAll("need").map(String);
      const subjects = fd.getAll("subject").map(String);

      storage.setUser({
        name,
        city,
        email,
        needs,
        subjects,
        createdAt: new Date().toISOString(),
      });
      render(getRoute());
      closeAuth();
      toast("Аккаунт создан (пока локально)");

      const next = (needs[0] || "steps").toString();
      if (next && next !== "home") location.hash = `#/${next}`;
      return;
    }
  });
}

function init() {
  els.year.textContent = String(new Date().getFullYear());
  fillSubjects();
  setupAuth();
  window.addEventListener("hashchange", () => render(getRoute()));
  render(getRoute());
}

init();

