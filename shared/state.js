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
    window.STATE.currentUser = window.STATE.currentUser || null;
    window.STATE.blastActive = window.STATE.blastActive || false;
    window.STATE.bills = window.STATE.bills || seed.bills || [];
    window.STATE.appointments = window.STATE.appointments || seed.appointments || [];
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
})();
