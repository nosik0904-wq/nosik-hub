(function () {
  window.startSync = function startSync(onChange) {
    window.addEventListener("nosik:data", onChange);

    if (!window.NOSIK_SUPABASE) {
      return () => window.removeEventListener("nosik:data", onChange);
    }

    const householdId = window.NOSIK_CONFIG.householdId;
    const channel = window.NOSIK_SUPABASE
      .channel("nosik-household")
      .on("postgres_changes", { event: "*", schema: "public", table: "grocery_items", filter: `household_id=eq.${householdId}` }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "daily_items", filter: `household_id=eq.${householdId}` }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts", filter: `household_id=eq.${householdId}` }, onChange)
      .subscribe();

    return () => window.NOSIK_SUPABASE.removeChannel(channel);
  };
})();
