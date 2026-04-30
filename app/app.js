(function () {
  initState();
  const voice = window.NOSIK_VOICE;
  const app = document.getElementById("app");
  let currentTab = "today";

  function render() {
    app.innerHTML = STATE.currentUser ? shell() : pin();
    bind();
  }

  function pin() {
    return `
      <section class="phone-pin">
        <form id="pin-form">
          <h1>${voice.labels.nosik}</h1>
          <input id="pin-input" inputmode="numeric" autocomplete="off" placeholder="${voice.labels.pin}">
          <button>${voice.labels.enterPin}</button>
          ${STATE.lastError ? `<div class="phone-error">${STATE.lastError}</div>` : ""}
        </form>
      </section>
    `;
  }

  function shell() {
    return `
      <div class="phone-shell">
        <header class="phone-top">
          <div>
            <h1>${voice.labels.nosik}</h1>
            <span>${STATE.currentUser.name}</span>
          </div>
          <button class="phone-action" data-action="logout">${voice.labels.logOut}</button>
        </header>
        <main class="phone-main">
          ${assistCard()}
          ${tabContent()}
        </main>
        ${bottomNav()}
        ${blastOverlay()}
      </div>
    `;
  }

  function bottomNav() {
    const tabs = [
      ["today", voice.labels.today],
      ["groceries", voice.labels.groceries],
      ["meals", voice.labels.meals],
      ["alerts", voice.labels.alerts],
      ["settings", voice.labels.settings]
    ];
    return `<nav class="phone-nav">${tabs.map(([key, label]) => `<button class="${currentTab === key ? "is-active" : ""}" data-tab="${key}">${label}</button>`).join("")}</nav>`;
  }

  function tabContent() {
    if (currentTab === "groceries") return groceriesCard(true);
    if (currentTab === "meals") return mealsCard();
    if (currentTab === "alerts") return alertsCard();
    if (currentTab === "settings") return settingsCard();
    return todayCard();
  }

  function todayCard() {
    const items = todayItemsForUser();
    return `
      ${card(voice.labels.dailyList, items.length ? "" : voice.dailyList.empty, itemList(items, "daily") + (STATE.currentUser.role === "parent" ? addRow("daily-phone-input", "daily-phone-add") : ""))}
      ${STATE.currentUser.role === "parent" ? nightBeforeCard() : ""}
    `;
  }

  function groceriesCard() {
    const items = STATE.groceries.filter(item => !item.done);
    return card(voice.labels.groceries, items.length ? "" : voice.groceries.listEmpty, itemList(items, "grocery") + addRow("grocery-phone-input", "grocery-phone-add"));
  }

  function mealsCard() {
    const todayMeal = tonightMeal();
    const tomorrowMeal = tomorrowMealName();
    return card(voice.labels.meals, "", `
      <div class="phone-item"><strong>Tonight</strong><span>${todayMeal || voice.meals.notPlanned}</span><span></span></div>
      <div class="phone-item"><strong>Tomorrow</strong><span>${tomorrowMeal || "-"}</span><span></span></div>
    `);
  }

  function nightBeforeCard() {
    const done = STATE.nightBefore.filter(item => item.done).length;
    const status = done === STATE.nightBefore.length ? voice.nightBefore.allDone : voice.nightBefore.someMissing(STATE.nightBefore.length - done);
    return card(voice.labels.nightBefore, status, itemList(STATE.nightBefore, "night"));
  }

  function alertsCard() {
    const send = STATE.currentUser.role === "parent" ? `
      <div class="phone-add">
        <input id="alert-phone-input" placeholder="${voice.labels.alerts}">
        <button data-action="send-blast">${voice.labels.blast}</button>
      </div>
    ` : "";
    return card(voice.labels.alerts, "", send + (STATE.alerts.length ? STATE.alerts.map(alertRow).join("") : `<p>${voice.alerts.allClear}</p>`));
  }

  function settingsCard() {
    return card(voice.labels.settings, "", `<button class="phone-action" data-action="logout">${voice.labels.logOut}</button>`);
  }

  function card(title, note, body) {
    return `<section class="phone-card"><h2>${title}</h2>${note ? `<p>${note}</p>` : ""}<div class="phone-list">${body}</div></section>`;
  }

  function itemList(items, type) {
    return items.map(item => `
      <div class="phone-item ${item.done ? "is-done" : ""}">
        <button class="tick" data-tick="${type}" data-id="${item.id}">${item.done ? "x" : "o"}</button>
        <span>${item.title || item.name}</span>
        <span>${item.assigned_to ? getPersonAvatar(item.assigned_to) : ""}</span>
      </div>
    `).join("");
  }

  function addRow(inputId, buttonId) {
    return `<div class="phone-add"><input id="${inputId}" autocomplete="off"><button id="${buttonId}">+</button></div>`;
  }

  function alertRow(alert) {
    return `<div class="phone-item"><strong>${alert.level}</strong><span>${alert.message}</span><span>${alert.accepted ? alert.accepted_at : ""}</span></div>`;
  }

  function assistCard() {
    if (!STATE.assistVisible) return "";
    const map = {
      vehicles: voice.assist.vehicles,
      vault: voice.assist.vault,
      meals: voice.assist.meals
    };
    return `<section class="phone-card assist-card"><strong>${map[STATE.assistVisible]}</strong><button class="phone-action" data-action="assist-confirm">${voice.labels.add}</button></section>`;
  }

  function blastOverlay() {
    const alert = STATE.alerts.find(item => item.level === "blast" && !item.accepted);
    if (!alert) return "";
    return `<div class="blast-overlay"><div><h1>${voice.alerts.blast(alert.message)}</h1><button class="phone-action" data-action="accept-blast" data-id="${alert.id}">Accept</button></div></div>`;
  }

  function bind() {
    document.getElementById("pin-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      loginWithPin(document.getElementById("pin-input").value.trim());
      render();
    });
    app.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => { currentTab = btn.dataset.tab; render(); }));
    app.querySelectorAll("[data-tick]").forEach(btn => btn.addEventListener("click", () => tick(btn.dataset.tick, btn.dataset.id)));
    app.querySelector("[data-action='logout']")?.addEventListener("click", () => { logout(); render(); });
    document.getElementById("daily-phone-add")?.addEventListener("click", addDaily);
    document.getElementById("daily-phone-input")?.addEventListener("keydown", enter(addDaily));
    document.getElementById("grocery-phone-add")?.addEventListener("click", addGrocery);
    document.getElementById("grocery-phone-input")?.addEventListener("keydown", enter(addGrocery));
    app.querySelector("[data-action='send-blast']")?.addEventListener("click", sendBlast);
    app.querySelector("[data-action='accept-blast']")?.addEventListener("click", (event) => acceptBlast(event.target.dataset.id));
    app.querySelector("[data-action='assist-confirm']")?.addEventListener("click", confirmAssist);
  }

  function enter(fn) {
    return (event) => { if (event.key === "Enter") fn(); };
  }

  async function tick(type, id) {
    if (type === "daily") await db_tickDaily(id);
    if (type === "grocery") await db_tickGrocery(id);
    if (type === "night") await db_tickNightBefore(id);
    render();
  }

  async function addDaily() {
    const input = document.getElementById("daily-phone-input");
    const value = input?.value.trim();
    if (!value) return;
    input.value = "";
    checkAssistTriggers(value);
    await db_addDailyItem(value, null);
    render();
  }

  async function addGrocery() {
    const input = document.getElementById("grocery-phone-input");
    const value = input?.value.trim();
    if (!value) return;
    input.value = "";
    checkAssistTriggers(value);
    await db_addGrocery(value);
    render();
  }

  async function sendBlast() {
    const input = document.getElementById("alert-phone-input");
    const message = input?.value.trim();
    if (!message) return;
    input.value = "";
    await db_sendAlert("blast", message);
    render();
  }

  async function acceptBlast(id) {
    await db_acceptAlert(id);
    render();
  }

  function checkAssistTriggers(value) {
    if (STATE.currentUser?.role !== "parent") return;
    const lower = value.toLowerCase();
    if (["rego", "insurance", "service", "tyre", "registration"].some(item => lower.includes(item))) STATE.assistVisible = "vehicles";
    if (["passport", "licence", "license", "warranty", "policy", "certificate"].some(item => lower.includes(item))) STATE.assistVisible = "vault";
    if (["dinner", "meal", "cook", "recipe"].some(item => lower.includes(item))) STATE.assistVisible = "meals";
    saveState();
  }

  function confirmAssist() {
    const map = { vehicles: "vehicles", vault: "vault", meals: "meals" };
    const key = map[STATE.assistVisible];
    if (key) STATE.features[key].enabled = true;
    STATE.assistVisible = null;
    saveState();
    render();
  }

  function todayItemsForUser() {
    const all = STATE.dailyItems.filter(item => item.date === todayISO());
    if (STATE.currentUser.role === "parent") return all;
    return all.filter(item => !item.assigned_to || item.assigned_to === STATE.currentUser.id);
  }

  function tonightMeal() {
    return getMealName(STATE.mealPlan[todayISO()]?.dinner);
  }

  function tomorrowMealName() {
    return getMealName(STATE.mealPlan[tomorrowISO()]?.dinner);
  }

  startSync(render);
  render();
})();
