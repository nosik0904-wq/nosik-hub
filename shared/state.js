(function () {
  const STORE_KEY = "nosik-v3-state";

  window.todayISO = function todayISO() {
    return new Date().toISOString().split("T")[0];
  };

  window.tomorrowISO = function tomorrowISO() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  window.uid = function uid(prefix) {
    return `${prefix || "id"}-${Math.random().toString(36).slice(2, 9)}`;
  };

  window.formatTime = function formatTime(ts) {
    const d = ts ? new Date(ts) : new Date();
    return d.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  window.cloneData = function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
  };

  window.initState = function initState() {
    const seed = cloneData(window.NOSIK_DATA);
    const saved = localStorage.getItem(STORE_KEY);
    window.STATE = saved ? mergeSavedState(seed, JSON.parse(saved)) : seed;
    window.STATE.currentUser    = window.STATE.currentUser    || null;
    window.STATE.blastActive    = window.STATE.blastActive    || false;
    window.STATE.bills          = window.STATE.bills          || seed.bills          || [];
    window.STATE.appointments   = window.STATE.appointments   || seed.appointments   || [];
    window.STATE.capturedItems  = window.STATE.capturedItems  || seed.capturedItems  || [];
    window.STATE.actionLog      = window.STATE.actionLog      || seed.actionLog      || [];
    window.STATE.appSettings    = window.STATE.appSettings    || seed.appSettings    || { firstLaunch: true, viewMode: "auto", dataMode: "empty" };
    window.STATE.lastError = null;
    if (!window.__NOSIK_STORAGE_BOUND) {
      window.__NOSIK_STORAGE_BOUND = true;
      window.addEventListener("storage", (event) => {
        if (event.key !== STORE_KEY || !event.newValue) return;
        const currentUser = window.STATE?.currentUser || null;
        window.STATE = mergeSavedState(cloneData(window.NOSIK_DATA), JSON.parse(event.newValue));
        window.STATE.currentUser = currentUser;
        window.dispatchEvent(new CustomEvent("nosik:data"));
      });
    }
    return window.STATE;
  };

  function mergeSavedState(seed, saved) {
    const merged = { ...seed, ...saved };
    ["dailyItems", "calendarItems", "nightBefore", "groceries", "bills", "appointments"].forEach((key) => {
      if (!Array.isArray(saved[key])) return;
      const seedById = new Map((seed[key] || []).map(item => [item.id, item]));
      const savedById = new Map(saved[key].map(item => [item.id, item]));
      merged[key] = [
        ...(seed[key] || []).map(item => ({ ...item, ...(savedById.get(item.id) || {}) })),
        ...saved[key].filter(item => !seedById.has(item.id))
      ];
    });
    return merged;
  }

  window.saveState = function saveState() {
    const persisted = { ...window.STATE, currentUser: null, lastError: null };
    localStorage.setItem(STORE_KEY, JSON.stringify(persisted));
  };

  window.findUserByPin = function findUserByPin(pin) {
    return window.STATE.users.find(user => user.pin === pin) || null;
  };

  window.loginWithPin = function loginWithPin(pin) {
    const user = findUserByPin(pin);
    if (!user) {
      window.STATE.lastError = window.NOSIK_VOICE.general.pinError;
      saveState();
      return null;
    }
    window.STATE.currentUser = user;
    window.STATE.lastError = null;
    saveState();
    return user;
  };

  window.logout = function logout() {
    window.STATE.currentUser = null;
    window.STATE.lastError = null;
    window.STATE.blastActive = false;
    saveState();
  };

  window.getPerson = function getPerson(userId) {
    return window.STATE.users.find(user => user.id === userId) || null;
  };

  window.getPersonAvatar = function getPersonAvatar(userId) {
    const user = getPerson(userId);
    if (!user) return "";
    return `<span class="avatar" style="background:var(${user.color})">${user.avatar}</span>`;
  };

  window.getMealName = function getMealName(planEntry) {
    if (!planEntry) return null;
    if (planEntry.custom_name) return planEntry.custom_name;
    const meal = window.STATE.meals.find(item => item.id === planEntry.meal_id);
    return meal ? meal.name : null;
  };

  window.isVisibleToRole = function isVisibleToRole(visibilityArray) {
    const role = window.STATE.currentUser?.role || "visitor";
    if (role === "parent") return true;
    const map = {
      kid: ["household", "hub_public", "kids_visible"],
      grandparent: ["household", "hub_public", "grandparents_visible"],
      carer: ["household", "hub_public", "carer_visible"],
      visitor: ["household", "hub_public"]
    };
    return (visibilityArray || ["household"]).some(value => (map[role] || []).includes(value));
  };

  // ── MOBILE / VIEW MODE ──────────────────────────────────────
  window.isMobileView = function isMobileView() {
    const mode = window.STATE?.appSettings?.viewMode || "auto";
    if (mode === "mobile") return true;
    if (mode === "hub")    return false;
    return window.innerWidth < 768;
  };

  window.setViewMode = function setViewMode(mode) {
    if (!window.STATE.appSettings) window.STATE.appSettings = {};
    window.STATE.appSettings.viewMode = mode;
    window.logAction("changed-view-mode", mode);
    saveState();
  };

  // ── ACTION LOG ───────────────────────────────────────────────
  window.logAction = function logAction(type, detail) {
    if (!window.STATE.actionLog) window.STATE.actionLog = [];
    const now = new Date();
    window.STATE.actionLog.unshift({
      type,
      detail: detail || "",
      time:  now.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", hour12: true }),
      date:  now.toLocaleDateString("en-AU", { day: "numeric", month: "short" })
    });
    if (window.STATE.actionLog.length > 100) {
      window.STATE.actionLog = window.STATE.actionLog.slice(0, 100);
    }
    saveState();
  };

  // ── DATA OPERATIONS ─────────────────────────────────────────
  window.startFresh = function startFresh() {
    if (!window.STATE.appSettings) window.STATE.appSettings = {};
    window.STATE.appSettings.firstLaunch = false;
    window.STATE.appSettings.dataMode    = "real";
    window.STATE.groceries     = [];
    window.STATE.dailyItems    = [];
    window.STATE.calendarItems = [];
    window.STATE.alerts        = [];
    window.STATE.nightBefore   = [];
    window.STATE.capturedItems = [];
    window.STATE.currentUser   = null;
    window.logAction("start-fresh", "Started with empty real household");
    saveState();
  };

  window.loadSampleData = function loadSampleData() {
    const seed = cloneData(window.NOSIK_DATA);
    window.STATE.groceries     = seed.groceries;
    window.STATE.dailyItems    = seed.dailyItems;
    window.STATE.calendarItems = seed.calendarItems;
    window.STATE.alerts        = seed.alerts;
    window.STATE.nightBefore   = seed.nightBefore;
    window.STATE.bills         = seed.bills;
    window.STATE.appointments  = seed.appointments;
    window.STATE.mealPlan      = seed.mealPlan;
    window.STATE.meals         = seed.meals;
    window.STATE.eastonCare    = seed.eastonCare;
    window.STATE.visitorInfo   = seed.visitorInfo;
    window.STATE.capturedItems = [];
    if (!window.STATE.appSettings) window.STATE.appSettings = {};
    window.STATE.appSettings.firstLaunch = false;
    window.STATE.appSettings.dataMode    = "sample";
    window.STATE.currentUser = null;
    window.logAction("load-sample", "Sample household data loaded");
    saveState();
  };

  window.exportBackup = function exportBackup() {
    const payload = {
      exportedAt:    new Date().toISOString(),
      version:       "nosik-phase1-2",
      household:     window.STATE.household,
      members:       window.STATE.users,
      groceries:     window.STATE.groceries,
      dailyItems:    window.STATE.dailyItems,
      calendarItems: window.STATE.calendarItems,
      alerts:        window.STATE.alerts,
      capturedItems: window.STATE.capturedItems,
      appSettings:   window.STATE.appSettings,
      actionLog:     window.STATE.actionLog
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `nosik-backup-${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.logAction("exported-backup", "JSON backup downloaded");
  };

  window.resetApp = function resetApp() {
    localStorage.removeItem("nosik-v3-state");
    const seed = cloneData(window.NOSIK_DATA);
    Object.assign(window.STATE, seed);
    window.STATE.currentUser    = null;
    window.STATE.lastError      = null;
    window.STATE.blastActive    = false;
    window.STATE.capturedItems  = [];
    window.STATE.actionLog      = [];
    window.STATE.appSettings    = { firstLaunch: true, viewMode: "auto", dataMode: "empty", animation: "low" };
    saveState();
  };
})();
