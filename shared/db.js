(function () {
  function hasSupabase() {
    return Boolean(
      window.supabase &&
      window.NOSIK_CONFIG &&
      !String(window.NOSIK_CONFIG.supabaseUrl).startsWith("YOUR_") &&
      !String(window.NOSIK_CONFIG.supabaseKey).startsWith("YOUR_")
    );
  }

  function client() {
    if (!hasSupabase()) return null;
    if (!window.NOSIK_SUPABASE) {
      window.NOSIK_SUPABASE = window.supabase.createClient(
        window.NOSIK_CONFIG.supabaseUrl,
        window.NOSIK_CONFIG.supabaseKey
      );
    }
    return window.NOSIK_SUPABASE;
  }

  async function localResult(data) {
    saveState();
    window.dispatchEvent(new CustomEvent("nosik:data"));
    return { data, error: null };
  }

  window.db_addGrocery = async function db_addGrocery(name) {
    const row = {
      id: uid("grocery"),
      household_id: window.STATE.household.id,
      name,
      category: "general",
      done: false,
      is_basic: false,
      added_by: window.STATE.currentUser?.id || null
    };
    const supa = client();
    if (supa) return supa.from("grocery_items").insert(row).select().single();
    window.STATE.groceries.push(row);
    return localResult(row);
  };

  window.db_tickGrocery = async function db_tickGrocery(id) {
    const item = window.STATE.groceries.find(row => row.id === id);
    if (!item) return localResult(null);
    item.done = !item.done;
    item.done_by = window.STATE.currentUser?.id || null;
    item.done_at = item.done ? new Date().toISOString() : null;
    const supa = client();
    if (supa) return supa.from("grocery_items").update({ done: item.done, done_by: item.done_by, done_at: item.done_at }).eq("id", id).select().single();
    return localResult(item);
  };

  window.db_addDailyItem = async function db_addDailyItem(title, assignedTo) {
    const row = {
      id: uid("daily"),
      household_id: window.STATE.household.id,
      date: todayISO(),
      title,
      assigned_to: assignedTo || null,
      done: false,
      is_non_negotiable: false,
      source: "manual",
      visibility: ["household", "hub_public"]
    };
    const supa = client();
    if (supa) return supa.from("daily_items").insert(row).select().single();
    window.STATE.dailyItems.push(row);
    return localResult(row);
  };

  window.db_tickDaily = async function db_tickDaily(id) {
    const item = window.STATE.dailyItems.find(row => row.id === id);
    if (!item) return localResult(null);
    item.done = !item.done;
    item.done_by = window.STATE.currentUser?.id || null;
    item.done_at = item.done ? new Date().toISOString() : null;
    const supa = client();
    if (supa) return supa.from("daily_items").update({ done: item.done, done_by: item.done_by, done_at: item.done_at }).eq("id", id).select().single();
    return localResult(item);
  };

  window.db_tickNightBefore = async function db_tickNightBefore(id) {
    const item = window.STATE.nightBefore.find(row => row.id === id);
    if (!item) return localResult(null);
    item.done = !item.done;
    item.done_by = window.STATE.currentUser?.id || null;
    item.done_at = item.done ? new Date().toISOString() : null;
    const supa = client();
    if (supa) return supa.from("night_before_items").update({ done: item.done, done_by: item.done_by, done_at: item.done_at }).eq("id", id).select().single();
    return localResult(item);
  };

  window.db_sendAlert = async function db_sendAlert(level, message) {
    const row = {
      id: uid("alert"),
      household_id: window.STATE.household.id,
      level,
      message,
      sent_by: window.STATE.currentUser?.id || null,
      sent_at: new Date().toISOString(),
      accepted: false,
      accepted_by: null,
      accepted_at: null
    };
    const supa = client();
    if (supa) return supa.from("alerts").insert(row).select().single();
    window.STATE.alerts.unshift(row);
    return localResult(row);
  };

  window.db_acceptAlert = async function db_acceptAlert(id) {
    const alert = window.STATE.alerts.find(row => row.id === id);
    if (!alert) return localResult(null);
    alert.accepted = true;
    alert.accepted_by = window.STATE.currentUser?.name || "Hub";
    alert.accepted_at = formatTime(new Date());
    const supa = client();
    if (supa) return supa.from("alerts").update({ accepted: true, accepted_by: alert.accepted_by, accepted_at: alert.accepted_at }).eq("id", id).select().single();
    return localResult(alert);
  };
})();
