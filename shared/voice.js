window.NOSIK_VOICE = {
  morning: (name, items) => `Morning ${name}. ${items.join(". ")}.`,

  nightBefore: {
    allDone:     "Tomorrow is set. Nice work.",
    someMissing: (count) => `${count} thing${count > 1 ? "s" : ""} still to do for tomorrow. No stress - here they are.`,
    prompt:      "Tomorrow setup - let's get it ready tonight."
  },

  dailyList: {
    empty:      "All clear today. Nice.",
    kidPrompt:  (name, count) => `${name} - ${count} job${count > 1 ? "s" : ""} today.`,
    carlPrompt: (count) => `${count} thing${count > 1 ? "s" : ""} you can help with today.`,
    allDone:    "Everything done today. That's a good day."
  },

  groceries: {
    runningLow: (item) => `${item} flagged as running low - added to the list.`,
    listEmpty:  "Shopping list is clear.",
    added:      (item) => `${item} added to the list.`
  },

  meals: {
    notPlanned: "Dinner not planned tonight.",
    tonight:    (meal) => `Tonight: ${meal}.`,
    tomorrow:   (meal) => `Tomorrow: ${meal}.`
  },

  sundayReset: {
    intro:         "Sunday Reset - let's set up the week.",
    mealsPrompt:   "What are we having this week? Pick your dinners.",
    groceryPrompt: "Here's your list based on the week's meals and what's running low. Review and confirm.",
    weekView:      "Here's what's already locked in this week.",
    tasksPrompt:   "Any bigger jobs this week? Pick when they suit.",
    done:          "Week is set. I'll keep you posted as things come up."
  },

  alerts: {
    nudge:    (msg) => msg,
    knock:    (msg) => msg,
    blast:    (msg) => msg.toUpperCase(),
    accepted: (name, time) => `Accepted by ${name} at ${time}.`,
    allClear: "All clear."
  },

  publicHome: {
    tagline:           "Organise life. Save time. Keep improving.",
    evening:           "Settle the house without opening everything.",
    morning:           "See the day at a glance.",
    afternoon:         "Keep the afternoon moving.",
    night:             "Tomorrow can wait. The essentials are here.",
    quietLine:         "Small things, handled early.",
    weatherTitle:      "Evening reset",
    weatherCopy:       "Dinner, jobs and tomorrow stay easy to find.",
    publicNote:        "Quick household view.",
    privatePrompt:     "Enter a PIN for your view.",
    doneFromHub:       "Done from Hub",
    noPublicJobs:      "No public jobs waiting.",
    noPublicGroceries: "Nothing urgent to buy.",
    noPublicEvents:    "No shared events left today.",
    noPublicAlerts:    "No public alerts.",
    tickerPrefix:      "Shared Hub"
  },

  flow: {
    quietWeek:      "Quiet week ahead. Nice.",
    busyDay:        (day) => `${day} looks busy.`,
    lightDay:       (day) => `${day} is light - good for errands or appointments.`,
    twentyMins:     "You have 20 minutes. Here are 3 useful things:",
    tonightSummary: (items) => `Tonight: ${items.join(". ")}.`,
    carlNudge:      (count) => `${count} thing${count > 1 ? "s" : ""} still on today's list. Want to take one?`
  },

  assist: {
    vehicles: "Looks like a vehicle reminder. Want me to set up Vehicle Tracking?",
    vault:    "This looks like an important document. Want me to save it in Vault Reminders?",
    meals:    "You've added a few dinner ideas. Want me to turn on Meal Planning?",
    confirm:  "Done - turned on.",
    notNow:   "No problem. You can turn it on in Settings anytime."
  },

  grandparent: {
    greeting:     (name) => `Good to see you, ${name}.`,
    familyEvents: "Coming up for the family",
    noEvents:     "Nothing in the family calendar this week.",
    tonightDinner:"Tonight's dinner",
    noDinner:     "Dinner not planned yet.",
    goodDay:      "It looks like a good week ahead."
  },

  carer: {
    greeting:   (name, childName) => `Hi ${name}. Here's today for ${childName}.`,
    routine:    "Today's routine",
    foodNotes:  "Food notes",
    calmNotes:  "Calm and comfort",
    emergency:  "Emergency contacts",
    handover:   "Handover note",
    noHandover: "No handover note left today."
  },

  visitor: {
    greeting:   "Welcome.",
    tonight:    "Tonight's schedule",
    houseRules: "House rules",
    emergency:  "Emergency contacts",
    noSchedule: "No schedule set for tonight.",
    signOff:    "Have a great evening."
  },

  kid: {
    greeting: (name) => `Hey ${name}.`,
    jobs:     (count) => count === 0 ? "All done today. Nice." : `${count} job${count > 1 ? "s" : ""} today.`,
    allDone:  "All done. Nice work.",
    dinner:   "Tonight's dinner",
    noDinner: "Dinner TBC."
  },

  tidy: {
    heading:  "NOSIK Tidy",
    intro:    "A few things you haven't used lately.",
    tryIt:    "Try it",
    hideIt:   "Hide it",
    pauseIt:  "Pause it",
    keepIt:   "Keep it",
    allClean: "Everything looks active. Nothing to tidy."
  },

  vault: {
    heading:  "Vault Lite",
    intro:    "Names, expiry dates, and where things are stored. No document uploads yet.",
    expiry:   (date) => `Expires: ${date}`,
    reminder: (note) => `Reminder: ${note}`,
    storage:  (loc) => `Stored: ${loc}`,
    phase2:   "Full secure upload coming in Phase 2.",
    empty:    "No vault items added yet."
  },

  settings: {
    heading:     "Settings",
    animation:   "Animation",
    animOff:     "Off",
    animLow:     "Low",
    animNormal:  "Normal",
    privacyNote: "Private calendar items, Vault, and money details are never shown on the shared Hub.",
    accessNote:  "Phase 2 will record who accessed which view and when.",
    backupNote:  "Backups and export coming in Phase 2."
  },

  emergency: {
    heading:  "Emergency",
    contacts: "Emergency contacts",
    note:     "Emergency information — set up in Settings.",
    callNow:  "Call now"
  },

  general: {
    loading:   "One moment...",
    saved:     "Saved.",
    pinError:  "Incorrect PIN. Try again.",
    loggedOut: "See you later."
  },

  labels: {
    nosik:           "NOSIK",
    hub:             "Hub",
    app:             "App",
    pin:             "PIN",
    home:            "Home",
    calendar:        "Calendar",
    jobs:            "Jobs",
    reminders:       "Reminders",
    today:           "Today",
    groceries:       "Groceries",
    meals:           "Meals",
    alerts:          "Alerts",
    nightBefore:     "Night Before",
    dailyList:       "Daily List",
    settings:        "Settings",
    blast:           "Blast",
    knock:           "Knock",
    nudge:           "Nudge",
    logOut:          "Log out",
    enterPin:        "Enter PIN",
    add:             "Add",
    done:            "Done",
    gotIt:           "Got it",
    parentHome:      "Parent home",
    kidHome:         "Kid home",
    comingSoon:      "Coming soon",
    grandparentView: "Grandparent view",
    carerView:       "Carer view",
    visitorView:     "Visitor view",
    emergencyView:   "Emergency",
    tidy:            "NOSIK Tidy",
    vault:           "Vault Lite",
    editHome:        "Edit home",
    optional:        "Optional features"
  }
};
