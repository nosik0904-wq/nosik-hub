(function () {
  initState();
  STATE.currentUser = null;
  STATE.lastError = null;
  ensureParentHudDemo();

  const voice = window.NOSIK_VOICE;
  const app = document.getElementById("app");
  let pinBuffer = "";
  let pinOpen = false;
  let publicPanel = "home";
  let navPinned = false;
  let stopSync = null;
  const PARENT_HUD_WIDTH = 1376;

  const icons = {
    home: '<path d="m3 10 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/>',
    check: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 3 3 5-6"/>',
    shopping: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 3h3l3 13h10l3-9H6"/>',
    utensils: '<path d="M4 3v8"/><path d="M8 3v8"/><path d="M4 7h4"/><path d="M6 11v10"/><path d="M17 3v18"/><path d="M14 3h6"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 21h4"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-2 .2 1.7 1.7 0 0 0-.8 1.5V22H9.2v-.3a1.7 1.7 0 0 0-.8-1.5 1.7 1.7 0 0 0-2-.2l-.2.1-2-3.4.1-.1A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 13.8H3v-3.6h.2A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 2-.2A1.7 1.7 0 0 0 9.2 2h5.6v.3a1.7 1.7 0 0 0 .8 1.5 1.7 1.7 0 0 0 2 .2l.2-.1 2 3.4-.1.1A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.4 1.2h.2v3.6h-.2A1.7 1.7 0 0 0 19.4 15Z"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    key: '<circle cx="7.5" cy="14.5" r="4.5"/><path d="M11 11 21 1"/><path d="m17 5 2 2"/><path d="m14 8 2 2"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>'
  };

  function render() {
    const isParentHud = !STATE.currentUser || STATE.currentUser?.role === "parent";
    syncParentHudScale();
    const mainContent = isParentHud ? `<div class="parent-canvas">${parentHome()}</div>` : roleHome();
    app.innerHTML = `
      <div class="hub-shell${isParentHud ? " is-parent-shell" : ""}">
        ${isParentHud ? "" : topbar()}
        <main class="hub-main">
          ${mainContent}
        </main>
        ${blastOverlay()}
      </div>
    `;
    bindHub();
    markParentHudLayout();
  }

  function syncParentHudScale() {
    const scale = Math.min(1, Math.max(0.42, (window.innerWidth || PARENT_HUD_WIDTH) / PARENT_HUD_WIDTH));
    document.documentElement.style.setProperty("--parent-hud-scale", scale.toFixed(4));
  }

  function markParentHudLayout() {
    window.requestAnimationFrame(() => {
      const home = document.querySelector(".parent-home");
      const layout = document.querySelector(".parent-grid, .setup-board");
      if (!home || !layout) {
        document.body.removeAttribute("data-hud-layout");
        return;
      }
      const rect = home.getBoundingClientRect();
      const gridStyle = window.getComputedStyle(layout);
      document.body.setAttribute("data-hud-layout", JSON.stringify({
        width: Math.round(rect.width),
        columns: gridStyle.gridTemplateColumns.split(" ").length,
        view: layout.classList.contains("setup-board") ? "setup" : "home",
        scale: window.getComputedStyle(document.documentElement).getPropertyValue("--parent-hud-scale").trim()
      }));
    });
  }

  function ensureParentHudDemo() {
    const version = "parent-hud-v5";
    if (STATE.parentHudVersion === version) return;
    const seed = cloneData(window.NOSIK_DATA);
    ["dailyItems", "groceries", "bills", "appointments", "meals", "calendarItems", "vaultItems", "tidySuggestions", "accessLog"].forEach((key) => {
      STATE[key] = seed[key] || [];
    });
    STATE.mealPlan       = { ...seed.mealPlan, ...(STATE.customMealPlan || {}) };
    STATE.eastonCare     = seed.eastonCare;
    STATE.visitorInfo    = seed.visitorInfo;
    STATE.settings       = seed.settings || { animation: "low" };
    STATE.assistVisible  = null;
    STATE.features       = { ...seed.features, ...(STATE.features || {}) };
    STATE.parentHudVersion = version;
    saveState();
  }

  function topbar() {
    const user = STATE.currentUser;
    return `
      <header class="hub-top">
        <div class="brand">
          <div class="brand-mark">N</div>
          <div>
            <h1>${voice.labels.nosik} ${voice.labels.hub}</h1>
            <p>${STATE.household.name}</p>
          </div>
        </div>
        <div class="top-actions">
          <div class="hub-clock">
            <strong>${formatTime(new Date())}</strong>
            <span>${todayLong()}</span>
          </div>
          ${user
            ? `<button class="ghost-btn" data-action="logout">${voice.labels.home}</button>`
            : `<button class="ghost-btn" data-action="open-pin">${voice.labels.enterPin}</button>`}
        </div>
      </header>
    `;
  }

  function publicHome() {
    const activeAlerts = unacceptedAlerts().filter(alert => alert.level !== "blast");
    return `
      <section class="public-home ${timeClass()}">
        ${publicDrawer()}
        <div class="public-stage">
          <section class="home-console" aria-label="${voice.labels.today}">
            <div class="public-hero">
              <div class="public-message">
                <span class="pill">${voice.labels.hub}</span>
                <h2>${publicHeroLine()}</h2>
                <p>${voice.publicHome.quietLine}</p>
              </div>
              <div class="ambient-card">
                ${icon("home")}
                <strong>${voice.publicHome.weatherTitle}</strong>
                <span>${voice.publicHome.weatherCopy}</span>
              </div>
            </div>
            ${activeAlerts.length ? publicAlertStrip(activeAlerts) : publicNudgeStrip()}
            <section class="home-grid" aria-label="Shared household home">
              ${publicPanelContent()}
            </section>
          </section>
        </div>
        ${publicDock()}
        ${ticker()}
        ${pinOpen ? pinSheet() : ""}
      </section>
    `;
  }

  function publicDrawer() {
    const items = [
      navButton("home", voice.labels.home, "home"),
      navButton("calendar", voice.labels.calendar, "calendar", publicCalendarItems().length),
      navButton("tasks", voice.labels.jobs, "check", publicDailyItems().filter(item => !item.done).length),
      navButton("groceries", voice.labels.groceries, "shopping", STATE.groceries.filter(item => !item.done).length),
      navButton("alerts", voice.labels.alerts, "bell", unacceptedAlerts().length),
      navButton("pin", voice.labels.pin, "lock", null, true)
    ].join("");

    return `
      <aside class="public-drawer${navPinned ? " is-pinned" : ""}" aria-label="Hub navigation">
        <button class="drawer-tab" data-action="toggle-nav" aria-label="Open Hub navigation" title="Open Hub navigation">
          ${icon("chevron")}
        </button>
        <div class="drawer-items">${items}</div>
      </aside>
    `;
  }

  function navButton(id, label, iconName, count, requiresPin) {
    const active = publicPanel === id && !requiresPin ? " is-active" : "";
    const attrs = requiresPin ? 'data-action="open-pin"' : `data-panel="${id}"`;
    return `
      <button class="drawer-btn${active}" ${attrs} aria-label="${label}" title="${label}">
        ${icon(iconName)}
        <span>${label}</span>
        ${typeof count === "number" && count > 0 ? `<em>${count}</em>` : ""}
      </button>
    `;
  }

  function publicDock() {
    const items = [
      ["calendar", voice.labels.calendar, "calendar"],
      ["tasks", voice.labels.jobs, "check"],
      ["groceries", voice.labels.groceries, "shopping"],
      ["meals", voice.labels.meals, "utensils"],
      ["alerts", voice.labels.alerts, "bell"],
      ["pin", voice.labels.pin, "lock"]
    ];

    return `
      <nav class="home-dock" aria-label="Home screen apps">
        ${items.map(([panel, label, iconName]) => {
          const active = publicPanel === panel ? " is-active" : "";
          const attrs = panel === "pin" ? 'data-action="open-pin"' : `data-panel="${panel}"`;
          return `
            <button class="dock-btn${active}" ${attrs} aria-label="${label}" title="${label}">
              ${icon(iconName)}
            </button>
          `;
        }).join("")}
      </nav>
    `;
  }

  function publicPanelContent() {
    if (publicPanel === "calendar") {
      return largePublicCard(voice.labels.calendar, "calendar", publicCalendarList());
    }
    if (publicPanel === "tasks") {
      return largePublicCard(voice.labels.jobs, "check", publicTaskList("large"), voice.publicHome.doneFromHub);
    }
    if (publicPanel === "groceries") {
      return largePublicCard(voice.labels.groceries, "shopping", publicGroceryList("large"), `${voice.labels.add} ${voice.labels.groceries.toLowerCase()}`);
    }
    if (publicPanel === "meals") {
      return largePublicCard(voice.labels.meals, "utensils", publicMealList(), voice.publicHome.weatherCopy);
    }
    if (publicPanel === "alerts") {
      return largePublicCard(voice.labels.alerts, "bell", publicAlertsList(), `${voice.labels.nudge}, ${voice.labels.knock}, ${voice.labels.blast}`);
    }

    return `
      ${homeTile(voice.labels.calendar, publicCalendarItems().length, "calendar", "calendar", "shared")}
      ${homeTile(voice.labels.jobs, publicDailyItems().filter(item => !item.done).length, "check", "tasks", "to do")}
      ${homeTile(voice.labels.groceries, STATE.groceries.filter(item => !item.done).length, "shopping", "groceries", "needed")}
      ${homeTile(voice.labels.reminders, reminderCount(), "bell", "meals", "key items")}
    `;
  }

  function homeTile(title, meta, iconName, panel, detail) {
    return `
      <button class="public-card app-tile" data-panel="${panel}" aria-label="${title}" title="${title}">
        ${icon(iconName)}
        <span>${title}</span>
        <strong>${safe(meta)}</strong>
        <small>${safe(detail || "")}</small>
      </button>
    `;
  }

  function largePublicCard(title, iconName, body, note) {
    return `
      <article class="public-card public-card-large">
        <div class="card-title">
            ${icon(iconName)}
            <div>
              <h3>${title}</h3>
              <p>${note || voice.publicHome.publicNote}</p>
            </div>
        </div>
        ${body}
      </article>
      ${homeTile(voice.labels.home, voice.publicHome.privatePrompt, "home", "home", "Shared Hub")}
    `;
  }

  function publicTaskList(size) {
    const items = publicDailyItems().filter(item => !item.done);
    const limit = size === "large" ? 8 : 3;
    if (!items.length) return `<p class="public-empty">${voice.publicHome.noPublicJobs}</p>`;
    return `
      <div class="public-list">
        ${items.slice(0, limit).map(item => `
          <div class="public-row">
            <span>${safe(item.title)}</span>
            <button class="row-action" data-tick="daily" data-id="${item.id}">${voice.labels.done}</button>
          </div>
        `).join("")}
      </div>
    `;
  }

  function publicGroceryList(size) {
    const items = STATE.groceries.filter(item => !item.done);
    const limit = size === "large" ? 8 : 3;
    return `
      ${items.length ? `
        <div class="public-list">
          ${items.slice(0, limit).map(item => `
            <div class="public-row">
              <span>${safe(item.name)}</span>
              <button class="row-action" data-tick="grocery" data-id="${item.id}">${voice.labels.gotIt}</button>
            </div>
          `).join("")}
        </div>
      ` : `<p class="public-empty">${voice.publicHome.noPublicGroceries}</p>`}
      <div class="public-add">
        <input id="public-grocery-input" autocomplete="off" aria-label="${voice.labels.add} ${voice.labels.groceries}">
        <button class="row-action" data-action="public-add-grocery" aria-label="${voice.labels.add}">${icon("plus")}</button>
      </div>
    `;
  }

  function publicCalendarList() {
    const items = publicCalendarItems();
    if (!items.length) return `<p class="public-empty">${voice.publicHome.noPublicEvents}</p>`;
    return `
      <div class="public-list">
        ${items.map(item => `
          <div class="public-row public-row-static">
            <span>${safe(item.title)}</span>
            <strong>${eventTime(item.starts_at)}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  function publicMealList() {
    return `
      <div class="public-list">
        <div class="public-row public-row-static">
          <span>Tonight</span>
          <strong>${safe(tonightMeal() || voice.meals.notPlanned)}</strong>
        </div>
        <div class="public-row public-row-static">
          <span>Tomorrow</span>
          <strong>${safe(tomorrowMealName() || "-")}</strong>
        </div>
      </div>
    `;
  }

  function publicAlertsList() {
    const alerts = unacceptedAlerts().filter(alert => alert.level !== "blast");
    if (!alerts.length) return `<p class="public-empty">${voice.publicHome.noPublicAlerts}</p>`;
    return `
      <div class="public-list">
        ${alerts.map(alert => `
          <div class="public-row alert-row alert-row--${alert.level}">
            <span><b>${safe(alert.level)}</b> ${safe(alert.message)}</span>
            <button class="row-action" data-action="accept-alert" data-id="${alert.id}">${voice.labels.done}</button>
          </div>
        `).join("")}
      </div>
    `;
  }

  function publicAlertStrip(alerts) {
    const alert = alerts[0];
    return `
      <div class="public-alert-strip public-alert-strip--${alert.level}">
        ${icon(alert.level === "knock" ? "alert" : "bell")}
        <div>
          <strong>${alerts.length} ${alerts.length === 1 ? alert.level : voice.labels.alerts.toLowerCase()}</strong>
          <span>${safe(alert.message)}</span>
        </div>
        <button class="row-action" data-action="accept-alert" data-id="${alert.id}">${voice.labels.done}</button>
      </div>
    `;
  }

  function publicNudgeStrip() {
    const next = firstTaskTitle() || firstCalendarTitle() || voice.alerts.allClear;
    return `
      <button class="public-alert-strip is-quiet" data-panel="tasks">
        ${icon("bell")}
        <div>
          <strong>${voice.labels.today}</strong>
          <span>${safe(next)}</span>
        </div>
      </button>
    `;
  }

  function ticker() {
    const alertBits = unacceptedAlerts()
      .filter(alert => alert.level !== "blast")
      .map(alert => `${alert.level.toUpperCase()}: ${alert.message}`);
    const taskBits = publicDailyItems()
      .filter(item => !item.done)
      .map(item => `${voice.labels.jobs}: ${item.title}`);
    const bits = [...alertBits, ...taskBits].slice(0, 5);
    if (!bits.length) bits.push(`${voice.labels.today}: ${voice.alerts.allClear}`);
    const text = bits.join(" | ");
    return `
      <div class="ticker" aria-label="Shared Hub ticker">
        <div class="ticker-track">${safe(text)} &nbsp; | &nbsp; ${safe(text)}</div>
      </div>
    `;
  }

  function pinSheet() {
    return `
      <div class="pin-backdrop" role="dialog" aria-modal="true" aria-label="${voice.labels.enterPin}">
        <div class="pin-card">
          <div class="pin-head">
            <div>
              <h1>${voice.labels.enterPin}</h1>
              <p>${voice.publicHome.privatePrompt}</p>
            </div>
            <button class="icon-btn" data-action="close-pin" aria-label="Close" title="Close">x</button>
          </div>
          <div class="pin-display">${pinBuffer ? "*".repeat(pinBuffer.length) : "----"}</div>
          <div class="pin-pad">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, "clear", 0, "back"].map(value => `
              <button data-pin="${value}">${value === "clear" ? "Clear" : value === "back" ? "Back" : value}</button>
            `).join("")}
          </div>
          <button class="primary-btn" data-action="login">${voice.labels.enterPin}</button>
          ${STATE.lastError ? `<div class="error">${STATE.lastError}</div>` : ""}
        </div>
      </div>
    `;
  }

  function roleHome() {
    const role = STATE.currentUser.role;
    if (role === "parent")      return parentHome();
    if (role === "grandparent") return grandparentHome();
    if (role === "carer")       return carerHome();
    if (role === "visitor")     return visitorHome();
    return kidHome();
  }

  // ─── KID HOME ─────────────────────────────────────────────────────────────
  function kidHome() {
    const user   = STATE.currentUser;
    const items  = todayItemsForUser();
    const undone = items.filter(item => !item.done);
    const dinner = tonightMeal();
    const alerts = unacceptedAlerts().filter(a => a.level !== "blast");

    return `
      <section class="kid-home">
        <header class="kid-topbar">
          <div class="kid-avatar av-${user.id}">${user.avatar}</div>
          <div>
            <h2>${voice.kid.greeting(user.name)}</h2>
            <p>${voice.kid.jobs(undone.length)}</p>
          </div>
          <button class="ghost-btn kid-logout" data-action="logout">Home</button>
        </header>

        <div class="kid-grid">
          <section class="kid-card kid-card-jobs">
            <div class="kid-card-head">
              ${icon("check")}<h3>My jobs today</h3>
            </div>
            ${items.length === 0
              ? `<p class="kid-empty">${voice.dailyList.empty}</p>`
              : `<div class="kid-job-list">${items.map(kidJobRow).join("")}</div>`}
          </section>

          <section class="kid-card kid-card-dinner">
            <div class="kid-card-head">
              ${icon("utensils")}<h3>${voice.kid.dinner}</h3>
            </div>
            <div class="kid-dinner-val">${safe(dinner || voice.kid.noDinner)}</div>
          </section>

          ${alerts.length ? `
            <section class="kid-card kid-card-alerts">
              <div class="kid-card-head">${icon("bell")}<h3>Alerts</h3></div>
              <div class="kid-alert-list">
                ${alerts.map(a => `
                  <div class="kid-alert kid-alert--${a.level}">
                    <span>${safe(a.message)}</span>
                    <button class="row-action" data-action="accept-alert" data-id="${a.id}">Done</button>
                  </div>`).join("")}
              </div>
            </section>` : ""}
        </div>
      </section>
    `;
  }

  function kidJobRow(item) {
    return `
      <div class="kid-job${item.done ? " is-done" : ""}" data-id="${item.id}">
        <button class="kid-tick" data-tick="daily" data-id="${item.id}" aria-label="Done">
          ${item.done ? icon("check") : ""}
        </button>
        <span class="kid-job-title">${safe(item.title)}</span>
      </div>
    `;
  }

  // ─── GRANDPARENT HOME ─────────────────────────────────────────────────────
  function grandparentHome() {
    const user   = STATE.currentUser;
    const events = grandparentCalendarItems();
    const dinner = tonightMeal();

    return `
      <section class="role-view grandparent-home">
        <header class="role-topbar">
          <div class="role-brand">
            <div class="brand-mark">N</div>
            <div><strong>NOSIK Hub</strong><span>${safe(STATE.household.name)}</span></div>
          </div>
          <div class="role-user">
            <div class="role-avatar av-${user.id}">${user.avatar}</div>
            <div><strong>${safe(user.name)}</strong><small>${voice.labels.grandparentView}</small></div>
          </div>
          <button class="ghost-btn" data-action="logout">Home</button>
        </header>

        <div class="role-greeting">
          <p>${voice.grandparent.greeting(user.name)}</p>
        </div>

        <div class="role-grid">
          <section class="role-card role-card-wide">
            <div class="role-card-head">${icon("calendar")}<h3>${voice.grandparent.familyEvents}</h3></div>
            ${events.length === 0
              ? `<p class="role-empty">${voice.grandparent.noEvents}</p>`
              : `<div class="role-event-list">${events.map(grandparentEventRow).join("")}</div>`}
          </section>

          <section class="role-card">
            <div class="role-card-head">${icon("utensils")}<h3>${voice.grandparent.tonightDinner}</h3></div>
            <div class="role-dinner">${safe(dinner || voice.grandparent.noDinner)}</div>
          </section>

          <section class="role-card">
            <div class="role-card-head">${icon("check")}<h3>Jobs today</h3></div>
            ${grandparentTasks().length === 0
              ? `<p class="role-empty">Nothing to help with today.</p>`
              : `<div class="role-task-list">
                  ${grandparentTasks().map(t => `
                    <div class="role-task${t.done ? " is-done" : ""}">
                      <button class="task-tick" data-tick="daily" data-id="${t.id}">${t.done ? icon("check") : ""}</button>
                      <span>${safe(t.title)}</span>
                    </div>`).join("")}
                </div>`}
          </section>
        </div>
        ${ticker()}
      </section>
    `;
  }

  function grandparentEventRow(item) {
    const d    = new Date(item.starts_at);
    const day  = d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
    const time = d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true });
    return `
      <div class="role-event">
        <div class="role-event-dot"></div>
        <span class="role-event-title">${safe(item.title)}</span>
        <span class="role-event-time">${day} ${time}</span>
      </div>
    `;
  }

  function grandparentCalendarItems() {
    return (STATE.calendarItems || [])
      .filter(item => {
        const vis = item.visibility || [];
        return (vis.includes("grandparents_visible") || vis.includes("hub_public") || vis.includes("household"))
          && !vis.includes("hub_hidden");
      })
      .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
      .slice(0, 8);
  }

  function grandparentTasks() {
    return (STATE.dailyItems || []).filter(item => {
      if (item.date !== todayISO()) return false;
      const vis = item.visibility || [];
      return vis.includes("hub_public") || vis.includes("household");
    });
  }

  // ─── CARER HOME ───────────────────────────────────────────────────────────
  function carerHome() {
    const user  = STATE.currentUser;
    const care  = STATE.eastonCare || window.NOSIK_DATA.eastonCare;
    const child = getPerson(care.person_id);
    const appts = (STATE.appointments || []).filter(a =>
      a.person_id === care.person_id && (a.visibility || []).includes("carer_visible")
    );

    return `
      <section class="role-view carer-home">
        <header class="role-topbar">
          <div class="role-brand">
            <div class="brand-mark">N</div>
            <div><strong>NOSIK Hub</strong><span>${safe(STATE.household.name)}</span></div>
          </div>
          <div class="role-user">
            <div class="role-avatar av-${user.id}">${user.avatar}</div>
            <div><strong>${safe(user.name)}</strong><small>${voice.labels.carerView}</small></div>
          </div>
          <button class="ghost-btn" data-action="logout">Home</button>
        </header>

        <div class="role-greeting carer-greeting">
          <div class="carer-child-badge">
            <div class="role-avatar av-${child?.id || "easton"}">${child?.avatar || "E"}</div>
            <div><strong>${safe(care.name)}</strong><small>Care view</small></div>
          </div>
          <p>${voice.carer.greeting(user.name, care.name)}</p>
        </div>

        <div class="role-grid carer-grid">
          <section class="role-card">
            <div class="role-card-head">${icon("list")}<h3>${voice.carer.routine}</h3></div>
            <div class="carer-routine">
              ${care.routine.map(r => `
                <div class="carer-routine-row">
                  <span class="carer-time">${safe(r.time)}</span>
                  <div><strong>${safe(r.label)}</strong><small>${safe(r.note)}</small></div>
                </div>`).join("")}
            </div>
          </section>

          <section class="role-card">
            <div class="role-card-head">${icon("utensils")}<h3>${voice.carer.foodNotes}</h3></div>
            <ul class="carer-notes-list">${care.food_notes.map(n => `<li>${safe(n)}</li>`).join("")}</ul>
            <div class="role-card-head carer-subhead">${icon("home")}<h3>${voice.carer.calmNotes}</h3></div>
            <ul class="carer-notes-list">${care.calm_notes.map(n => `<li>${safe(n)}</li>`).join("")}</ul>
          </section>

          <section class="role-card">
            <div class="role-card-head">${icon("alert")}<h3>${voice.carer.emergency}</h3></div>
            <div class="carer-contacts">
              ${care.emergency_contacts.map(c => `
                <div class="carer-contact">
                  <div><strong>${safe(c.name)}</strong><small>${safe(c.role)}</small></div>
                  <a class="carer-phone" href="tel:${safe(c.phone)}">${safe(c.phone)}</a>
                </div>`).join("")}
            </div>
            ${appts.length ? `
              <div class="role-card-head carer-subhead">${icon("calendar")}<h3>Today's appointments</h3></div>
              ${appts.map(a => `
                <div class="carer-appt">
                  <span>${safe(a.sensitive ? `${child?.name || care.name} - appointment` : a.title)}</span>
                  <strong>${safe(a.time)}</strong>
                </div>`).join("")}
            ` : ""}
            <div class="role-card-head carer-subhead">${icon("home")}<h3>${voice.carer.handover}</h3></div>
            <p class="carer-handover">${safe(care.handover_note || voice.carer.noHandover)}</p>
          </section>
        </div>
        ${ticker()}
      </section>
    `;
  }

  // ─── VISITOR HOME ─────────────────────────────────────────────────────────
  function visitorHome() {
    const info   = STATE.visitorInfo || window.NOSIK_DATA.visitorInfo;
    const dinner = tonightMeal();

    return `
      <section class="role-view visitor-home">
        <header class="role-topbar">
          <div class="role-brand">
            <div class="brand-mark">N</div>
            <div><strong>NOSIK Hub</strong><span>${safe(STATE.household.name)}</span></div>
          </div>
          <div class="role-clock">${formatTime(new Date())}</div>
          <button class="ghost-btn" data-action="logout">Home</button>
        </header>

        <div class="role-greeting">
          <p>${voice.visitor.greeting} ${safe(info.welcome)}</p>
        </div>

        <div class="role-grid visitor-grid">
          <section class="role-card">
            <div class="role-card-head">${icon("calendar")}<h3>${voice.visitor.tonight}</h3></div>
            ${info.tonightSchedule.map(s => `
              <div class="visitor-sched-row">
                <span class="visitor-time">${safe(s.time)}</span>
                <div><strong>${safe(s.label)}</strong>${s.note ? `<small>${safe(s.note)}</small>` : ""}</div>
              </div>`).join("")}
            ${dinner ? `
              <div class="visitor-dinner">
                ${icon("utensils")}<span>Dinner tonight: <strong>${safe(dinner)}</strong></span>
              </div>` : ""}
          </section>

          <section class="role-card">
            <div class="role-card-head">${icon("home")}<h3>${voice.visitor.houseRules}</h3></div>
            <ul class="visitor-rules">
              ${info.houseRules.map(r => `<li>${safe(r)}</li>`).join("")}
            </ul>
          </section>

          <section class="role-card">
            <div class="role-card-head">${icon("alert")}<h3>${voice.visitor.emergency}</h3></div>
            <div class="carer-contacts">
              ${info.emergency_contacts.map(c => `
                <div class="carer-contact">
                  <strong>${safe(c.name)}</strong>
                  <a class="carer-phone" href="tel:${safe(c.phone)}">${safe(c.phone)}</a>
                </div>`).join("")}
            </div>
            <p class="visitor-address">${icon("home")} ${safe(info.address)}</p>
          </section>
        </div>
        ${ticker()}
      </section>
    `;
  }

  function parentHome() {
    const isSetup = publicPanel === "menu";
    return `
      <section class="parent-home${isSetup ? " is-setup-view" : ""}">
        ${parentTopBar()}
        ${parentLegend()}
        ${parentCentral()}
        ${isSetup ? parentSetupView() : `
          <div class="parent-grid">
            <div class="parent-col" id="parent-col-today">${colToday()}</div>
            <div class="parent-col" id="parent-col-week">${colWeek()}</div>
            <div class="parent-col" id="parent-col-now">${colNow()}</div>
          </div>
        `}
        ${parentDock()}
      </section>
    `;
  }

  function parentTopBar() {
    return `
      <header class="parent-topbar">
        <div class="parent-brand">
          <div class="brand-mark">N</div>
          <div>
            <strong>NOSIK Hub</strong>
            <span>${safe(STATE.household.name)}</span>
          </div>
        </div>
        <div class="parent-clock-zone">
          <div class="parent-clock">${parentClockTime()}</div>
          <div class="parent-date">${todayLong()}</div>
        </div>
      </header>
    `;
  }

  function parentLegend() {
    return `
      <div class="parent-legend">
        <div class="legend-item">
          <div class="swatch swatch--help"></div>
          <span>Someone can help with this - tap to assign</span>
        </div>
        <div class="legend-item">
          <div class="swatch swatch--urgent"></div>
          <span>Urgent - needs doing now</span>
        </div>
      </div>
    `;
  }

  function parentCentral() {
    return `
      <div class="parent-central">
        <div class="central-label">Today's focus</div>
        <div class="central-msg">"${safe(buildParentFocus())}"</div>
      </div>
    `;
  }

  function colToday() {
    const todayAll = STATE.dailyItems.filter(item => item.date === todayISO());
    const nonNeg = todayAll.filter(item => item.is_non_negotiable);
    const tasks = todayAll.filter(item => !item.is_non_negotiable && (item.category === "task" || !item.category));
    const cleaning = todayAll.filter(item => item.category === "cleaning");
    const reminders = todayAll.filter(item => item.category === "reminder");

    return `
      ${parentColHeading("list", "Today's list")}
      ${nonNeg.length ? `
        ${parentSubLabel("Non-negotiable")}
        ${nonNeg.map(item => parentTaskRow(item, "daily")).join("")}
      ` : ""}
      ${tasks.length ? `
        ${parentDivider()}
        ${parentSubLabel("Household tasks")}
        ${tasks.map(item => parentTaskRow(item, "daily")).join("")}
      ` : ""}
      ${cleaning.length ? `
        ${parentDivider()}
        ${parentSubLabel("Cleaning today")}
        ${cleaning.map(item => parentTaskRow(item, "daily")).join("")}
      ` : ""}
      ${reminders.length ? `
        ${parentDivider()}
        ${parentSubLabel("In your head - reminders")}
        ${reminders.map(reminderRow).join("")}
      ` : ""}
    `;
  }

  function parentTaskRow(item, type) {
    const active = activeParentUser();
    const assignee = item.assigned_to ? getPerson(item.assigned_to) : null;
    const isHelp = assignee && item.assigned_to !== active.id;
    const isUrgent = Boolean(item.urgent || item.is_urgent || item.priority === "urgent") && !item.done;
    const isDone = item.done;
    let cls = "parent-task";
    if (isDone) cls += " is-done";
    else if (isHelp) cls += " can-help";
    if (isUrgent) cls += " urgent-task";

    const badge = isHelp && assignee ? `
      <div class="helper-badge${isUrgent ? " helper-badge--urgent" : ""}">
        <span class="person-avatar av-${assignee.id}">${assignee.avatar}</span>
        <span>${safe(assignee.name)}</span>
      </div>
    ` : assignee ? `
      <span class="person-avatar av-${assignee.id}" style="margin-left:auto">${assignee.avatar}</span>
    ` : "";

    return `
      <div class="${cls}" data-id="${item.id}">
        <button class="task-tick" data-tick="${type}" data-id="${item.id}" aria-label="${voice.labels.done}">
          ${isDone ? icon("check") : ""}
        </button>
        <span class="task-text">${safe(item.title)}</span>
        ${badge}
      </div>
    `;
  }

  function reminderRow(item) {
    const badge = item.badge ? `<span class="reminder-badge">${safe(item.badge)}</span>` : "";
    return `
      <div class="parent-reminder${item.done ? " is-done-r" : ""}" data-id="${item.id}">
        <span class="reminder-arrow">&gt;</span>
        <span class="reminder-text">${safe(item.title)}</span>
        ${badge}
      </div>
    `;
  }

  function colWeek() {
    return `
      ${parentColHeading("calendar", "This week")}
      ${parentSubLabel("Bills due")}
      ${billsSection()}
      ${parentDivider()}
      ${parentSubLabel("Appointments")}
      ${appointmentsSection()}
      ${parentDivider()}
      ${parentSubLabel("Meals this week")}
      ${mealsSection()}
    `;
  }

  function billsSection() {
    const bills = (STATE.bills || []).filter(bill => !bill.paid);
    if (!bills.length) return `<p class="col-empty">No bills due this week.</p>`;
    return bills.map((bill) => {
      const days = daysUntil(bill.due_date);
      const urgency = days <= 0 ? "today" : days <= 2 ? "soon" : "week";
      const label = days <= 0 ? "Today" : days === 1 ? "Tomorrow" : shortDay(bill.due_date);
      return `
        <div class="bill-row" data-bill-id="${bill.id}">
          <span class="bill-name">${safe(bill.name)}</span>
          <span class="bill-due bill-${urgency}">${label}</span>
        </div>
      `;
    }).join("") + `<p class="bills-note">Tap to mark paid</p>`;
  }

  function appointmentsSection() {
    const appts = STATE.appointments || [];
    if (!appts.length) return `<p class="col-empty">No appointments this week.</p>`;
    return appts.map((appt) => {
      const person = appt.person_id ? getPerson(appt.person_id) : null;
      const color = person ? `var(${person.color})` : "var(--text-muted)";
      const title = appt.sensitive ? `${person?.name || "Family member"} - appointment` : appt.title;
      const timeStr = appt.time
        ? new Date(`1970-01-01T${appt.time}`).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true })
        : "";
      const dayStr = appt.date === todayISO() ? "Today" : appt.date === tomorrowISO() ? shortDay(appt.date) : shortDay(appt.date);
      return `
        <div class="appt-row">
          <div class="appt-dot" style="background:${color}"></div>
          <span class="appt-text">${safe(title)}</span>
          <span class="appt-time">${dayStr}${timeStr ? ` ${timeStr}` : ""}</span>
        </div>
      `;
    }).join("");
  }

  function mealsSection() {
    const todayMeal = getMealName(STATE.mealPlan[todayISO()]?.dinner);
    const tomorrowMeal = getMealName(STATE.mealPlan[tomorrowISO()]?.dinner);
    let unplanned = 0;
    for (let i = 0; i < 7; i += 1) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      if (!STATE.mealPlan[key]?.dinner) unplanned += 1;
    }

    return `
      <div class="appt-row">
        <div class="appt-dot" style="background:${todayMeal ? "var(--accent-green)" : "var(--text-muted)"}"></div>
        <span class="appt-text">Tonight</span>
        <span class="appt-time" style="color:${todayMeal ? "var(--text-primary)" : "var(--accent-gold)"}">
          ${safe(todayMeal || voice.meals.notPlanned.split(".")[0])}
        </span>
      </div>
      <div class="appt-row">
        <div class="appt-dot" style="background:${tomorrowMeal ? "var(--accent-green)" : "var(--text-muted)"}"></div>
        <span class="appt-text">Tomorrow</span>
        <span class="appt-time" style="color:${tomorrowMeal ? "var(--text-primary)" : "var(--text-muted)"}">
          ${safe(tomorrowMeal || "-")}
        </span>
      </div>
      ${unplanned > 0 ? `
        <div class="appt-row">
          <div class="appt-dot" style="background:var(--text-muted)"></div>
          <span class="appt-text muted">${unplanned} day${unplanned > 1 ? "s" : ""} not planned</span>
          <span class="appt-time plan-link" data-action="sunday-reset">Plan &gt;</span>
        </div>
      ` : ""}
    `;
  }

  function colNow() {
    return `
      ${parentColHeading("alert", "Need now")}
      ${urgentGroceries()}
      ${parentDivider()}
      ${parentColHeading("settings", "NOSIK suggests")}
      ${suggestCards()}
      ${parentDivider()}
      ${parentColHeading("user", "Who's helping today")}
      ${helperProgress()}
    `;
  }

  function urgentGroceries() {
    const urgent = STATE.groceries.filter(item => item.urgent);
    if (!urgent.length) return `<p class="col-empty">Nothing urgent needed.</p>`;
    return urgent.map(item => `
      <div class="groc-urgent${item.done ? " is-got" : ""}" data-id="${item.id}">
        <div class="groc-dot"></div>
        <span class="groc-name">${safe(item.name)}</span>
        <span class="groc-level">${safe(item.stock_level || "urgent")}</span>
      </div>
    `).join("") + `<p class="bills-note">Tap when in trolley</p>`;
  }

  function suggestCards() {
    const suggestions = buildParentSuggestions();
    return suggestions.map(suggestion => `
      <div class="suggest-card">
        <p class="suggest-text"><strong>${safe(suggestion.headline)}</strong> ${safe(suggestion.body)}</p>
      </div>
    `).join("");
  }

  function helperProgress() {
    const active = activeParentUser();
    const byPerson = {};
    STATE.dailyItems
      .filter(item => item.date === todayISO())
      .forEach((item) => {
        if (!item.assigned_to || item.assigned_to === active.id) return;
        if (!byPerson[item.assigned_to]) byPerson[item.assigned_to] = [];
        byPerson[item.assigned_to].push(item);
      });

    const entries = Object.entries(byPerson);
    if (!entries.length) return `<p class="col-empty">No tasks assigned to others today.</p>`;
    return entries.map(([userId, tasks]) => {
      const user = getPerson(userId);
      if (!user) return "";
      const doneCount = tasks.filter(task => task.done).length;
      const allDone = doneCount === tasks.length;
      const statusColor = allDone ? "var(--accent-green)" : doneCount > 0 ? "var(--alert-knock)" : "var(--alert-blast)";
      return `
        <div class="helper-row">
          <span class="person-avatar av-${user.id} helper-avatar">${user.avatar}</span>
          <div class="helper-info">
            <div class="helper-name">${safe(user.name)}</div>
            <div class="helper-tasks">${safe(tasks.map(task => task.title).join(" | "))}</div>
          </div>
          <div class="helper-count" style="color:${statusColor}">${doneCount}/${tasks.length}</div>
        </div>
      `;
    }).join("");
  }

  function parentDock() {
    const dockItems = [
      ["calendar", voice.labels.calendar, "calendar"],
      ["tasks", "Tasks", "check"],
      ["groceries", "Shop", "shopping"],
      ["alerts", voice.labels.alerts, "bell"],
      ["menu", "Menu", "menu"]
    ];
    return `
      <nav class="parent-dock" aria-label="Parent shortcuts">
        ${dockItems.map(([panel, label, iconName], index) => `
          ${index === dockItems.length - 1 ? '<span class="dock-spacer"></span>' : ""}
          <button class="dock-btn${publicPanel === panel ? " is-active" : ""}" data-panel="${panel}" aria-label="${label}" title="${label}">
            ${icon(iconName)}
            <span>${label}</span>
          </button>
        `).join("")}
      </nav>
    `;
  }

  function parentSetupView() {
    const anim = STATE.settings?.animation || "low";
    return `
      <div class="setup-board" aria-label="Hub settings">
        <section class="setup-panel setup-panel-wide">
          ${parentColHeading("settings", "Settings")}
          <h2>Build this Hub around your household.</h2>
          <p class="setup-copy">Keep the home screen calm. Turn on the bits your family actually uses, then tuck the rest away for later.</p>
          <div class="setup-actions">
            <button class="setup-action is-primary" data-action="setup-home">Back to home screen</button>
          </div>
          <div class="setup-checklist">
            ${setupCheck("Household name", STATE.household.name)}
            ${setupCheck("People added", `${STATE.users.length} people configured`)}
            ${setupCheck("Default home", "Today, bills, groceries and suggestions")}
            ${setupCheck("Privacy rule", "Private items stay off the shared Hub")}
          </div>
        </section>

        <section class="setup-panel">
          ${parentColHeading("home", "Display")}
          <div class="anim-label">Animation</div>
          <div class="anim-toggle">
            <button class="anim-btn${anim === "off" ? " is-active" : ""}" data-anim="off">Off</button>
            <button class="anim-btn${anim === "low" ? " is-active" : ""}" data-anim="low">Low</button>
            <button class="anim-btn${anim === "normal" ? " is-active" : ""}" data-anim="normal">Normal</button>
          </div>
          ${setupChoice("Today list", "On the main HUD", true)}
          ${setupChoice("This week", "Bills, appointments and meals", true)}
          ${setupChoice("Need now", "Urgent groceries and prompts", true)}
        </section>

        <section class="setup-panel">
          ${parentColHeading("lock", "Privacy defaults")}
          ${setupChoice("Gift reminders", "Hidden from shared Hub", true)}
          ${setupChoice("Money details", "Amounts hidden on shared view", true)}
          ${setupChoice("Vault items", "Never shown on shared Hub", true)}
          ${setupChoice("Medical notes", "Parents and carer only", true)}
          <p class="setup-note">${voice.settings.privacyNote}</p>
        </section>

        <section class="setup-panel">
          ${parentColHeading("key", "Access")}
          ${setupChoice("Public Hub", "Tasks and groceries without PIN", true)}
          ${setupChoice("Parent PIN", "Full access to settings and private sections", true)}
          ${setupChoice("Kid view", "Filtered to their own jobs", true)}
          ${setupChoice("Grandparent view", "Family events only", true)}
          ${setupChoice("Carer view", "Easton care profile", true)}
          ${setupChoice("Visitor view", "Tonight's schedule and house rules", true)}
          <p class="setup-note access-log-note">
            <strong>Access log (demo):</strong><br>
            ${(STATE.accessLog || []).map(e => `${safe(e.user)}: ${safe(e.action)} · ${safe(e.time)}`).join("<br>")}
            <br><small>${voice.settings.accessNote}</small>
          </p>
        </section>

        <section class="setup-panel setup-panel-wide">
          ${parentColHeading("list", "Optional features")}
          <div class="module-grid">
            ${setupModule("vehicles",        "Vehicles",         "rego, service, tyres"          )}
            ${setupModule("vault",           "Vault Lite",       "names, dates, storage notes"    )}
            ${setupModule("meals",           "Meals",            "weekly planning"                )}
            ${setupModule("nosikPulse",      "NOSIK Pulse",      "weekly reflection",  "suggested")}
            ${setupModule("screenBalance",   "Screen Balance",   "screen time overview","suggested")}
            ${setupModule("giftIdeas",       "Gift Ideas",       "hidden until enabled","hidden"  )}
            ${setupModule("partnerHelp",     "Partner Help",     "private prompts",    "hidden"   )}
            ${setupModule("secretWingman",   "Secret Wingman",   "private reminders",  "hidden"   )}
            ${setupModule("grandparentMode", "Grandparent mode", "approved family view"           )}
            ${setupModule("carerMode",       "Carer mode",       "care-relevant view"             )}
            ${setupModule("visitorMode",     "Visitor mode",     "babysitter-safe info"           )}
          </div>
        </section>

        <section class="setup-panel">
          ${parentColHeading("list", voice.labels.tidy)}
          ${tidySection()}
        </section>

        <section class="setup-panel">
          ${parentColHeading("lock", voice.labels.vault)}
          ${vaultSection()}
        </section>

        <section class="setup-panel">
          ${parentColHeading("settings", "Backups & export")}
          <p class="setup-note">${voice.settings.backupNote}</p>
          ${setupChoice("Daily backup", "Coming in Phase 2", false)}
          ${setupChoice("Export household data", "Coming in Phase 2", false)}
          ${setupChoice("Restore deleted items", "Coming in Phase 2", false)}
        </section>
      </div>
    `;
  }

  function tidySection() {
    const suggestions = STATE.tidySuggestions || window.NOSIK_DATA.tidySuggestions || [];
    const active = suggestions.filter(s => {
      const f = STATE.features?.[s.featureKey];
      return f && (f.state === "suggested" || f.state === "on");
    });
    if (!active.length) {
      return `<p class="setup-note">${voice.tidy.allClean}</p>`;
    }
    return active.map(s => `
      <div class="tidy-card">
        <p class="tidy-msg">${safe(s.message)}</p>
        <div class="tidy-actions">
          ${s.action === "try_or_hide"
            ? `<button class="tidy-btn tidy-btn--try"  data-tidy-try="${s.featureKey}">${voice.tidy.tryIt}</button>
               <button class="tidy-btn tidy-btn--hide" data-tidy-hide="${s.featureKey}">${voice.tidy.hideIt}</button>`
            : `<button class="tidy-btn tidy-btn--pause" data-tidy-pause="${s.featureKey}">${voice.tidy.pauseIt}</button>
               <button class="tidy-btn tidy-btn--keep"  data-tidy-keep="${s.featureKey}">${voice.tidy.keepIt}</button>`}
        </div>
      </div>
    `).join("");
  }

  function vaultSection() {
    const items = STATE.vaultItems || window.NOSIK_DATA.vaultItems || [];
    if (!items.length) return `<p class="setup-note">${voice.vault.empty}</p>`;
    return `
      <p class="setup-note">${voice.vault.intro}</p>
      ${items.map(v => `
        <div class="vault-item">
          <strong class="vault-name">${safe(v.name)}</strong>
          <div class="vault-meta">
            <span>${voice.vault.expiry(v.expiry)}</span>
            <span>${voice.vault.reminder(v.reminder)}</span>
          </div>
          <small class="vault-storage">${voice.vault.storage(v.storage)}</small>
          ${v.notes ? `<small class="vault-note">${safe(v.notes)}</small>` : ""}
        </div>
      `).join("")}
      <p class="setup-note vault-phase2">${voice.vault.phase2}</p>
    `;
  }

  function setupCheck(label, value) {
    return `
      <div class="setup-check">
        <span>${icon("check")}</span>
        <div>
          <strong>${safe(label)}</strong>
          <small>${safe(value)}</small>
        </div>
      </div>
    `;
  }

  function setupChoice(label, note, enabled) {
    return `
      <div class="setup-choice${enabled ? " is-on" : ""}">
        <div>
          <strong>${safe(label)}</strong>
          <small>${safe(note)}</small>
        </div>
        <span>${enabled ? "On" : "Later"}</span>
      </div>
    `;
  }

  function setupModule(key, label, note, fallbackState) {
    const state = STATE.features?.[key]?.state || (STATE.features?.[key]?.enabled ? "on" : fallbackState || "off");
    return `
      <button class="module-chip module-${state}" data-setup-feature="${safe(key)}" aria-label="${safe(label)}">
        <strong>${safe(label)}</strong>
        <span>${safe(note)}</span>
        <em>${safe(state)}</em>
      </button>
    `;
  }

  function buildParentMessages() {
    const msgs = [];
    const active = activeParentUser();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    msgs.push({ label: greeting, text: `${active.name}. Here is what is on today.` });

    const critical = STATE.dailyItems.filter(item => item.date === todayISO() && item.is_non_negotiable && !item.done);
    if (critical.length) msgs.push({ label: "Still to do", text: `${critical.map(item => item.title).join(", ")}.` });

    const helpCount = STATE.dailyItems.filter(item => item.date === todayISO() && item.assigned_to && item.assigned_to !== active.id && !item.done).length;
    if (helpCount > 0) msgs.push({ label: "Others are on it", text: `${helpCount} task${helpCount > 1 ? "s" : ""} assigned to others - they are on their lists.` });

    const dueSoon = (STATE.bills || []).filter(bill => !bill.paid && daysUntil(bill.due_date) <= 3);
    if (dueSoon.length) msgs.push({ label: "Bills", text: `${dueSoon.length} bill${dueSoon.length > 1 ? "s" : ""} due in the next 3 days.` });

    const urgentGrocs = STATE.groceries.filter(item => item.urgent && !item.done);
    if (urgentGrocs.length) msgs.push({ label: "Need now", text: `${urgentGrocs.map(item => item.name).join(", ")} - add to trolley.` });

    msgs.push({ label: "NOSIK", text: voice.alerts.allClear });
    return msgs;
  }

  function buildParentSuggestions() {
    return [
      {
        headline: "Thursday is light.",
        body: "Good day for the plumber callback and rego renewal - both quick, both overdue."
      },
      {
        headline: "Tuesday has 3 things before noon.",
        body: 'Want me to move "pack soccer gear" to Monday night instead?'
      },
      {
        headline: "Thu-Sun meals not planned.",
        body: "Sunday Reset could sort the whole week in 10 minutes."
      },
      {
        headline: "Carl is home tonight.",
        body: "Bins, mop, and bathroom are all assigned to others - they are on their lists."
      }
    ];
  }

  function setAnimation(level) {
    if (!STATE.settings) STATE.settings = {};
    STATE.settings.animation = level;
    document.body.classList.remove("anim-off", "anim-low", "anim-normal");
    if (level === "off")    document.body.classList.add("anim-off");
    if (level === "low")    document.body.classList.add("anim-low");
    if (level === "normal") document.body.classList.add("anim-normal");
    saveState();
    render();
  }

  function applyAnimation() {
    const level = STATE.settings?.animation || "low";
    document.body.classList.remove("anim-off", "anim-low", "anim-normal");
    document.body.classList.add(`anim-${level}`);
  }

  function applyTidy(featureKey, newState) {
    if (!featureKey) return;
    STATE.features[featureKey] = STATE.features[featureKey] || {};
    STATE.features[featureKey].state   = newState;
    STATE.features[featureKey].enabled = newState === "on";
    saveState();
    render();
  }

  function buildParentFocus() {
    return "Carl is home tonight. Bins, mop, and bathroom are on their lists.";
  }

  function activeParentUser() {
    if (STATE.currentUser?.role === "parent") return STATE.currentUser;
    return getPerson("kim") || STATE.users.find(user => user.role === "parent") || { id: "kim", name: "Kim", avatar: "K" };
  }

  function daysUntil(dateStr) {
    if (!dateStr) return 99;
    const d = new Date(dateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  }

  function shortDay(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-AU", { weekday: "short" });
  }

  function parentColHeading(iconName, label) {
    return `
      <div class="col-heading">
        <span class="col-icon">${icon(iconName)}</span>
        <span>${safe(label)}</span>
      </div>
    `;
  }

  function parentSubLabel(text) {
    return `<div class="sub-label">${safe(text)}</div>`;
  }

  function parentDivider() {
    return `<div class="col-divider"></div>`;
  }

  function morningLine() {
    const count = todayItems().filter(item => !item.done).length;
    const meal = tonightMeal();
    const parts = [
      `${count} thing${count === 1 ? "" : "s"} on today's list`,
      meal ? voice.meals.tonight(meal) : voice.meals.notPlanned
    ];
    return voice.morning(STATE.currentUser.name, parts);
  }

  function createNosletShell(key, title, iconName, body) {
    return `
      <article class="noslet noslet-${key}">
        <div class="noslet-head">
          <div>
            <div class="noslet-icon">${icon(iconName)}</div>
            <h2>${title}</h2>
          </div>
        </div>
        ${body}
      </article>
    `;
  }

  function dailyListNoslet() {
    const items = todayItemsForUser();
    const prompt = STATE.currentUser.role === "kid"
      ? voice.dailyList.kidPrompt(STATE.currentUser.name, items.filter(item => !item.done).length)
      : voice.dailyList.carlPrompt(items.filter(item => !item.done).length);
    const body = `
      <p class="noslet-note">${items.length ? prompt : voice.dailyList.empty}</p>
      <div class="noslet-list">
        ${items.map(itemRow("daily")).join("")}
      </div>
      ${STATE.currentUser.role === "parent" ? addRow("daily-add-input", "daily-add-btn") : ""}
    `;
    return createNosletShell("daily", voice.labels.dailyList, "check", body);
  }

  function groceriesNoslet() {
    const items = STATE.groceries.filter(item => !item.done);
    const doneCount = STATE.groceries.filter(item => item.done).length;
    const body = `
      <div class="noslet-list">
        ${items.length ? items.map(itemRow("grocery")).join("") : `<p class="noslet-empty">${voice.groceries.listEmpty}</p>`}
        ${doneCount ? `<div class="item-meta">${doneCount} got</div>` : ""}
      </div>
      ${addRow("grocery-add-input", "grocery-add-btn")}
    `;
    return createNosletShell("groceries", voice.labels.groceries, "shopping", body);
  }

  function nightBeforeNoslet() {
    if (STATE.currentUser.role !== "parent") return "";
    const items = STATE.nightBefore;
    const doneCount = items.filter(item => item.done).length;
    const status = doneCount === items.length ? voice.nightBefore.allDone : voice.nightBefore.someMissing(items.length - doneCount);
    const body = `
      <p class="noslet-note">${status}</p>
      <div class="noslet-list">${items.map(itemRow("night")).join("")}</div>
    `;
    return createNosletShell("night", voice.labels.nightBefore, "list", body);
  }

  function mealsNoslet() {
    const todayMeal = tonightMeal();
    const tomorrowMeal = tomorrowMealName();
    const body = `
      <div class="meal-row"><span class="meal-label">Tonight</span><strong>${safe(todayMeal || voice.meals.notPlanned)}</strong></div>
      <div class="meal-row"><span class="meal-label">Tomorrow</span><strong>${safe(tomorrowMeal || "-")}</strong></div>
      ${STATE.currentUser.role === "parent" ? `<button class="noslet-action-btn" data-action="sunday-reset">${voice.sundayReset.intro}</button>` : ""}
    `;
    return createNosletShell("meals", voice.labels.meals, "utensils", body);
  }

  function alertsNoslet() {
    const parentButtons = STATE.currentUser.role === "parent" ? `
      <div class="alert-send-row">
        <button class="alert-send-btn alert-send-blast" data-alert="blast">${voice.labels.blast}</button>
        <button class="alert-send-btn alert-send-knock" data-alert="knock">${voice.labels.knock}</button>
        <button class="alert-send-btn alert-send-nudge" data-alert="nudge">${voice.labels.nudge}</button>
      </div>
      <div class="noslet-add">
        <input class="alert-input" id="alert-input" placeholder="${voice.labels.alerts}">
        <button class="noslet-action-btn" data-action="submit-alert">${voice.labels.add}</button>
      </div>
    ` : "";
    const recent = STATE.alerts.slice(0, 5);
    const body = `
      ${parentButtons}
      <div class="noslet-list">
        ${recent.length ? recent.map(alertRow).join("") : `<p class="noslet-empty">${voice.alerts.allClear}</p>`}
      </div>
    `;
    return createNosletShell("alerts", voice.labels.alerts, "bell", body);
  }

  function placeholderNoslet(name) {
    return createNosletShell("placeholder", name, "settings", `<div class="placeholder">${name} ${voice.labels.comingSoon}</div>`);
  }

  function itemRow(type) {
    return function (item) {
      const assignee = item.assigned_to ? getPersonAvatar(item.assigned_to) : "";
      const doneClass = item.done ? " is-done" : "";
      return `
        <div class="noslet-item${doneClass}" data-id="${item.id}" data-type="${type}">
          <button class="item-tick" data-tick="${type}" data-id="${item.id}" aria-label="${voice.labels.done}">${item.done ? "x" : "o"}</button>
          <span class="item-title">${safe(item.title || item.name)}</span>
          ${assignee || `<span class="item-category">${safe(item.category || "")}</span>`}
        </div>
      `;
    };
  }

  function alertRow(alert) {
    return `
      <div class="alert-item alert-item--${alert.level}">
        <span class="alert-level">${safe(alert.level)}</span>
        <strong>${safe(alert.message)}</strong>
        ${alert.accepted ? `<span class="item-meta">${voice.alerts.accepted(alert.accepted_by, alert.accepted_at)}</span>` : `<button class="row-action" data-action="accept-alert" data-id="${alert.id}">${voice.labels.done}</button>`}
      </div>
    `;
  }

  function addRow(inputId, buttonId) {
    return `
      <div class="noslet-add">
        <input class="noslet-input" id="${inputId}" autocomplete="off">
        <button class="noslet-action-btn" id="${buttonId}" aria-label="${voice.labels.add}">${icon("plus")}</button>
      </div>
    `;
  }

  function assistCard() {
    if (!STATE.assistVisible) return "";
    const trigger = assistTrigger(STATE.assistVisible);
    if (!trigger) return "";
    return `
      <div class="assist-card">
        <strong>${trigger.cardText}</strong>
        <div class="hero-actions">
          <button class="primary-btn" data-action="assist-confirm">${voice.labels.add}</button>
          <button class="ghost-btn" data-action="assist-dismiss">${voice.assist.notNow}</button>
        </div>
      </div>
    `;
  }

  function blastOverlay() {
    const alert = STATE.alerts.find(item => item.level === "blast" && !item.accepted);
    if (!alert) return "";
    return `
      <div class="blast-overlay">
        <div class="blast-box">
          <h1>${voice.alerts.blast(alert.message)}</h1>
          <button data-action="accept-blast" data-id="${alert.id}">Accept</button>
        </div>
      </div>
    `;
  }

  function bindHub() {
    stopParentRotation();
    app.querySelectorAll("[data-pin]").forEach(btn => btn.addEventListener("click", () => pinPress(btn.dataset.pin)));
    app.querySelector("[data-action='login']")?.addEventListener("click", submitPin);
    app.querySelectorAll("[data-action='open-pin']").forEach(btn => btn.addEventListener("click", openPin));
    app.querySelector("[data-action='close-pin']")?.addEventListener("click", closePin);
    app.querySelector("[data-action='toggle-nav']")?.addEventListener("click", () => { navPinned = !navPinned; render(); });
    app.querySelector("[data-action='logout']")?.addEventListener("click", () => { logout(); pinBuffer = ""; pinOpen = false; render(); });
    app.querySelectorAll("[data-panel]").forEach(btn => btn.addEventListener("click", () => { publicPanel = btn.dataset.panel; render(); }));
    app.querySelector("[data-action='quick-daily']")?.addEventListener("click", () => focusInput("daily-add-input"));
    app.querySelector("[data-action='quick-grocery']")?.addEventListener("click", () => focusInput("grocery-add-input"));
    app.querySelector("#daily-add-btn")?.addEventListener("click", addDailyFromInput);
    app.querySelector("#daily-add-input")?.addEventListener("keydown", enter(addDailyFromInput));
    app.querySelector("#grocery-add-btn")?.addEventListener("click", addGroceryFromInput);
    app.querySelector("#grocery-add-input")?.addEventListener("keydown", enter(addGroceryFromInput));
    app.querySelector("[data-action='public-add-grocery']")?.addEventListener("click", addPublicGroceryFromInput);
    app.querySelector("#public-grocery-input")?.addEventListener("keydown", enter(addPublicGroceryFromInput));
    app.querySelectorAll("[data-tick]").forEach(btn => btn.addEventListener("click", () => tickItem(btn.dataset.tick, btn.dataset.id)));
    app.querySelectorAll("[data-alert]").forEach(btn => btn.addEventListener("click", () => presetAlert(btn.dataset.alert)));
    app.querySelector("[data-action='submit-alert']")?.addEventListener("click", submitAlert);
    app.querySelectorAll("[data-action='accept-alert']").forEach(btn => btn.addEventListener("click", () => acceptAlert(btn.dataset.id)));
    app.querySelector("[data-action='accept-blast']")?.addEventListener("click", (event) => acceptBlast(event.target.dataset.id));
    app.querySelector("[data-action='assist-confirm']")?.addEventListener("click", confirmAssist);
    app.querySelector("[data-action='assist-dismiss']")?.addEventListener("click", dismissAssist);
    app.querySelectorAll("[data-setup-feature]").forEach(btn => {
      btn.addEventListener("click", () => cycleSetupFeature(btn.dataset.setupFeature));
    });
    app.querySelectorAll("[data-action='setup-home'], [data-action='setup-reset-panel']").forEach(btn => {
      btn.addEventListener("click", () => { publicPanel = "home"; render(); });
    });
    app.querySelectorAll("[data-anim]").forEach(btn => {
      btn.addEventListener("click", () => setAnimation(btn.dataset.anim));
    });
    app.querySelectorAll("[data-tidy-try]").forEach(btn => {
      btn.addEventListener("click", () => { applyTidy(btn.dataset.tidyTry, "on"); });
    });
    app.querySelectorAll("[data-tidy-hide]").forEach(btn => {
      btn.addEventListener("click", () => { applyTidy(btn.dataset.tidyHide, "hidden"); });
    });
    app.querySelectorAll("[data-tidy-pause]").forEach(btn => {
      btn.addEventListener("click", () => { applyTidy(btn.dataset.tidyPause, "paused"); });
    });
    app.querySelectorAll("[data-tidy-keep]").forEach(btn => {
      btn.addEventListener("click", () => { applyTidy(btn.dataset.tidyKeep, "on"); });
    });
    app.querySelector("#parent-daily-btn")?.addEventListener("click", addDailyFromParentInput);
    app.querySelector("#parent-daily-input")?.addEventListener("keydown", enter(addDailyFromParentInput));
    if (STATE.currentUser?.role === "parent") startParentRotation();
    app.querySelectorAll(".bill-row").forEach(row => {
      row.addEventListener("click", () => {
        const bill = STATE.bills?.find(item => item.id === row.dataset.billId);
        if (!bill) return;
        bill.paid = true;
        row.style.opacity = "0.4";
        row.style.pointerEvents = "none";
        saveState();
        window.dispatchEvent(new CustomEvent("nosik:data"));
      });
    });
    app.querySelectorAll(".groc-urgent").forEach(el => {
      el.addEventListener("click", async () => {
        await tickItem("grocery", el.dataset.id);
      });
    });
    app.querySelectorAll(".parent-reminder").forEach(el => {
      el.addEventListener("click", async () => {
        await tickItem("daily", el.dataset.id);
      });
    });
  }

  function cycleSetupFeature(key) {
    if (!key) return;
    STATE.features[key] = STATE.features[key] || { enabled: false, state: "off" };
    const current = STATE.features[key].state || (STATE.features[key].enabled ? "on" : "off");
    const flow = current === "hidden"
      ? ["hidden", "suggested", "on", "paused"]
      : ["off", "on", "paused", "hidden"];
    const next = flow[(flow.indexOf(current) + 1) % flow.length] || "on";
    STATE.features[key] = { ...STATE.features[key], enabled: next === "on", state: next };
    saveState();
    render();
  }

  function openPin() {
    pinOpen = true;
    STATE.lastError = null;
    render();
    setTimeout(() => document.querySelector("[data-pin='1']")?.focus(), 0);
  }

  function closePin() {
    pinOpen = false;
    pinBuffer = "";
    STATE.lastError = null;
    render();
  }

  function pinPress(value) {
    if (value === "clear") pinBuffer = "";
    else if (value === "back") pinBuffer = pinBuffer.slice(0, -1);
    else if (pinBuffer.length < 6) pinBuffer += value;
    render();
  }

  function submitPin() {
    const user = loginWithPin(pinBuffer);
    pinBuffer = "";
    pinOpen = false;
    if (!user) pinOpen = true;
    render();
  }

  function focusInput(id) {
    document.getElementById(id)?.focus();
  }

  function enter(fn) {
    return (event) => { if (event.key === "Enter") fn(); };
  }

  async function addDailyFromInput() {
    const input = document.getElementById("daily-add-input");
    const value = input?.value.trim();
    if (!value) return;
    input.value = "";
    checkAssistTriggers(value);
    const { data } = await db_addDailyItem(value, null);
    if (data && !STATE.dailyItems.find(item => item.id === data.id)) STATE.dailyItems.push(data);
    render();
  }

  async function addGroceryFromInput() {
    const input = document.getElementById("grocery-add-input");
    const value = input?.value.trim();
    if (!value) return;
    input.value = "";
    checkAssistTriggers(value);
    const { data } = await db_addGrocery(value);
    if (data && !STATE.groceries.find(item => item.id === data.id)) STATE.groceries.push(data);
    render();
  }

  async function addPublicGroceryFromInput() {
    const input = document.getElementById("public-grocery-input");
    const value = input?.value.trim();
    if (!value) return;
    input.value = "";
    const { data } = await db_addGrocery(value);
    if (data && !STATE.groceries.find(item => item.id === data.id)) STATE.groceries.push(data);
    publicPanel = "groceries";
    render();
  }

  async function addDailyFromParentInput() {
    const input = document.getElementById("parent-daily-input");
    const value = input?.value.trim();
    if (!value) return;
    input.value = "";
    checkAssistTriggers(value);
    const { data } = await db_addDailyItem(value, null);
    if (data && !STATE.dailyItems.find(item => item.id === data.id)) STATE.dailyItems.push(data);
    render();
  }

  async function tickItem(type, id) {
    if (type === "grocery") await db_tickGrocery(id);
    if (type === "daily") await db_tickDaily(id);
    if (type === "night") await db_tickNightBefore(id);
    render();
  }

  function presetAlert(level) {
    const input = document.getElementById("alert-input");
    if (!input) return;
    input.dataset.level = level;
    input.value = level === "blast" ? STATE.blastPresets[0] : "";
    input.focus();
  }

  async function submitAlert() {
    const input = document.getElementById("alert-input");
    const message = input?.value.trim();
    const level = input?.dataset.level || "nudge";
    if (!message) return;
    input.value = "";
    const { data } = await db_sendAlert(level, message);
    if (data && !STATE.alerts.find(alert => alert.id === data.id)) STATE.alerts.unshift(data);
    render();
  }

  async function acceptAlert(id) {
    await db_acceptAlert(id);
    render();
  }

  async function acceptBlast(id) {
    await db_acceptAlert(id);
    render();
  }

  function checkAssistTriggers(inputText) {
    if (STATE.currentUser && STATE.currentUser.role !== "parent") return;
    const lower = inputText.toLowerCase();
    const triggers = {
      vehicles: { keywords: ["rego", "insurance", "service", "tyres", "tyre", "registration"], cardText: voice.assist.vehicles, featureKey: "vehicles" },
      vault: { keywords: ["passport", "licence", "license", "warranty", "policy", "certificate"], cardText: voice.assist.vault, featureKey: "vault" },
      meals: { keywords: ["dinner", "meal", "cook", "recipe", "lunch", "breakfast"], cardText: voice.assist.meals, featureKey: "meals" }
    };
    Object.entries(triggers).some(([key, trigger]) => {
      if (STATE.assistDismissed.includes(key) || STATE.features[trigger.featureKey]?.enabled) return false;
      if (trigger.keywords.some(keyword => lower.includes(keyword))) {
        STATE.assistVisible = key;
        saveState();
        return true;
      }
      return false;
    });
  }

  function assistTrigger(key) {
    const map = {
      vehicles: { cardText: voice.assist.vehicles, featureKey: "vehicles" },
      vault: { cardText: voice.assist.vault, featureKey: "vault" },
      meals: { cardText: voice.assist.meals, featureKey: "meals" }
    };
    return map[key];
  }

  function confirmAssist() {
    const trigger = assistTrigger(STATE.assistVisible);
    if (trigger) STATE.features[trigger.featureKey].enabled = true;
    STATE.assistVisible = null;
    saveState();
    render();
  }

  function dismissAssist() {
    if (STATE.assistVisible) STATE.assistDismissed.push(STATE.assistVisible);
    STATE.assistVisible = null;
    saveState();
    render();
  }

  function publicDailyItems() {
    return todayItems().filter(item => {
      const visibility = item.visibility || ["hub_public"];
      return visibility.includes("hub_public") || visibility.includes("household");
    });
  }

  function publicCalendarItems() {
    return (STATE.calendarItems || [])
      .filter(item => {
        const visibility = item.visibility || [];
        return !visibility.includes("hub_hidden") && (visibility.includes("hub_public") || visibility.includes("household"));
      })
      .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
  }

  function unacceptedAlerts() {
    return STATE.alerts.filter(alert => !alert.accepted);
  }

  function todayItems() {
    return STATE.dailyItems.filter(item => item.date === todayISO());
  }

  function todayItemsForUser() {
    if (STATE.currentUser.role === "parent") return todayItems();
    return todayItems().filter(item => !item.assigned_to || item.assigned_to === STATE.currentUser.id);
  }

  function tonightMeal() {
    return getMealName(STATE.mealPlan[todayISO()]?.dinner);
  }

  function tomorrowMealName() {
    return getMealName(STATE.mealPlan[tomorrowISO()]?.dinner);
  }

  function firstTaskTitle() {
    return publicDailyItems().find(item => !item.done)?.title || null;
  }

  function firstGroceryTitle() {
    return STATE.groceries.find(item => !item.done)?.name || null;
  }

  function firstCalendarTitle() {
    const item = publicCalendarItems()[0];
    return item ? `${eventTime(item.starts_at)} ${item.title}` : null;
  }

  function reminderCount() {
    return [tonightMeal(), tomorrowMealName(), ...publicDailyItems().filter(item => !item.done)].filter(Boolean).length;
  }

  function eventTime(value) {
    return new Date(value).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  function todayLong() {
    return new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
  }

  function parentClockTime() {
    const [time, meridiem] = formatTime(new Date()).replace(/^0/, "").split(" ");
    return `${time} <span>${safe(meridiem || "")}</span>`;
  }

  function publicHeroLine() {
    const hour = new Date().getHours();
    if (hour < 12) return voice.publicHome.morning;
    if (hour < 17) return voice.publicHome.afternoon;
    if (hour < 22) return voice.publicHome.evening;
    return voice.publicHome.night;
  }

  function timeClass() {
    const hour = new Date().getHours();
    if (hour < 12) return "is-morning";
    if (hour < 17) return "is-afternoon";
    if (hour < 22) return "is-evening";
    return "is-night";
  }

  function icon(name) {
    return `
      <svg class="icon icon-${name}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${icons[name] || icons.home}
      </svg>
    `;
  }

  function safe(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  document.addEventListener("keydown", (event) => {
    if (pinOpen && /^[0-9]$/.test(event.key)) pinPress(event.key);
    if (pinOpen && event.key === "Backspace") pinPress("back");
    if (pinOpen && event.key === "Enter") submitPin();
    if (pinOpen && event.key === "Escape") closePin();
  });

  let parentMsgIdx = 0;
  let parentMsgRotate = null;

  function startParentRotation() {
    stopParentRotation();
    const msgs = buildParentMessages();
    if (msgs.length <= 1) return;
    parentMsgRotate = setInterval(() => {
      parentMsgIdx = (parentMsgIdx + 1) % msgs.length;
      const label = document.querySelector(".central-label");
      const msg = document.querySelector(".central-msg");
      if (label && msg) {
        label.textContent = msgs[parentMsgIdx].label;
        msg.textContent = msgs[parentMsgIdx].text;
      }
    }, 8000);
  }

  function stopParentRotation() {
    clearInterval(parentMsgRotate);
    parentMsgRotate = null;
  }

  stopSync = startSync(render);
  window.addEventListener("resize", syncParentHudScale);
  window.addEventListener("beforeunload", () => stopSync?.());
  window.setInterval(render, 60000);
  applyAnimation();
  render();
})();
