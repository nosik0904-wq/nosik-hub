(function () {
  const today = todayISO();
  const tomorrow = tomorrowISO();
  const plusDays = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  window.NOSIK_DATA = {
    household: {
      id: "demo-household",
      name: "The Johnson Family",
      suburb: "Brisbane"
    },

    settings: {
      animation: "low",
      background: "static",
      nightMode: false,
      firstLaunch: false
    },

    users: [
      { id: "kim",     name: "Kim",     pin: "5678", role: "parent",      avatar: "K", color: "--person-kim"    },
      { id: "carl",    name: "Carl",    pin: "1234", role: "parent",      avatar: "C", color: "--person-carl"   },
      { id: "mason",   name: "Mason",   pin: "1111", role: "kid",         avatar: "M", color: "--person-mason"  },
      { id: "jaxon",   name: "Jaxon",   pin: "2222", role: "kid",         avatar: "J", color: "--person-jaxon"  },
      { id: "easton",  name: "Easton",  pin: "3333", role: "kid",         avatar: "E", color: "--person-easton" },
      { id: "hudson",  name: "Hudson",  pin: "4444", role: "kid",         avatar: "H", color: "--person-hudson" },
      { id: "nan",     name: "Nan",     pin: "2468", role: "grandparent", avatar: "N", color: "--person-nan"    },
      { id: "sarah",   name: "Sarah",   pin: "8642", role: "carer",       avatar: "S", color: "--person-sarah", care_for: "easton" },
      { id: "visitor", name: "Visitor", pin: "9090", role: "visitor",     avatar: "V", color: "--person-visitor" }
    ],

    features: {
      vehicles:        { enabled: false, state: "off",       label: "Vehicles",          note: "rego, service, tyres"        },
      vault:           { enabled: false, state: "off",       label: "Vault Lite",        note: "names, dates, storage notes" },
      meals:           { enabled: true,  state: "on",        label: "Meals",             note: "weekly planning"             },
      groceries:       { enabled: true,  state: "on",        label: "Groceries",         note: "shopping list"               },
      dailyList:       { enabled: true,  state: "on",        label: "Daily List",        note: "today's jobs"                },
      nightBefore:     { enabled: true,  state: "on",        label: "Night Before",      note: "set up tomorrow tonight"     },
      alerts:          { enabled: true,  state: "on",        label: "Alerts",            note: "nudge, knock, blast"         },
      sundayReset:     { enabled: true,  state: "on",        label: "Sunday Reset",      note: "plan the week"               },
      giftIdeas:       { enabled: false, state: "hidden",    label: "Gift Ideas",        note: "wishlists and Santa list"    },
      partnerHelp:     { enabled: false, state: "hidden",    label: "Partner Help",      note: "private optional prompts"    },
      secretWingman:   { enabled: false, state: "hidden",    label: "Secret Wingman",    note: "private reminders"           },
      carerMode:       { enabled: true,  state: "on",        label: "Carer Mode",        note: "care-relevant view"          },
      grandparentMode: { enabled: true,  state: "on",        label: "Grandparent Mode",  note: "approved family view"        },
      visitorMode:     { enabled: true,  state: "on",        label: "Visitor Mode",      note: "babysitter-safe info"        },
      nosikPulse:      { enabled: false, state: "suggested", label: "NOSIK Pulse",       note: "weekly reflection"           },
      screenBalance:   { enabled: false, state: "suggested", label: "Screen Balance",    note: "screen time overview"        },
      nosikTidy:       { enabled: true,  state: "on",        label: "NOSIK Tidy",        note: "keep the hub clean"          }
    },

    assistDismissed: [],
    assistVisible: null,

    groceries: [
      { id: "g1", household_id: "demo-household", name: "Milk",          category: "dairy",  done: false, is_basic: true,  urgent: true,  stock_level: "out",         added_by: "kim"  },
      { id: "g2", household_id: "demo-household", name: "Bread",         category: "pantry", done: false, is_basic: true,  urgent: true,  stock_level: "last loaf",   added_by: "carl" },
      { id: "g3", household_id: "demo-household", name: "Chicken wraps", category: "fresh",  done: false, is_basic: false, urgent: false, stock_level: null,          added_by: "kim"  },
      { id: "g4", household_id: "demo-household", name: "Nappies",       category: "general",done: false, is_basic: false, urgent: true,  stock_level: "almost gone", added_by: "kim"  }
    ],

    dailyItems: [
      { id: "d1",  household_id: "demo-household", date: today, title: "Take bins out",              assigned_to: "carl",  done: false, is_non_negotiable: true,  category: "task",     source: "manual", visibility: ["hub_public","household","kids_visible"] },
      { id: "d2",  household_id: "demo-household", date: today, title: "Mason's bag - not packed",   assigned_to: "mason", done: false, is_non_negotiable: true,  urgent: true, category: "task", source: "manual", visibility: ["hub_public","household","kids_visible"] },
      { id: "d3",  household_id: "demo-household", date: today, title: "Lunch boxes packed",         assigned_to: "kim",   done: true,  is_non_negotiable: true,  category: "task",     source: "manual", visibility: ["parents_only"] },
      { id: "d4",  household_id: "demo-household", date: today, title: "Vacuum downstairs",          assigned_to: "mason", done: false, is_non_negotiable: false, category: "cleaning", source: "manual", visibility: ["household","hub_public","kids_visible"] },
      { id: "d5",  household_id: "demo-household", date: today, title: "Mop kitchen",               assigned_to: "carl",  done: false, is_non_negotiable: false, category: "cleaning", source: "manual", visibility: ["household","hub_public"] },
      { id: "d6",  household_id: "demo-household", date: today, title: "Wipe bench and stove",      assigned_to: "kim",   done: false, is_non_negotiable: false, category: "cleaning", source: "manual", visibility: ["household","hub_public"] },
      { id: "d7",  household_id: "demo-household", date: today, title: "Bathroom clean",            assigned_to: "jaxon", done: false, is_non_negotiable: false, category: "cleaning", source: "manual", visibility: ["household","hub_public","kids_visible"] },
      { id: "d8",  household_id: "demo-household", date: today, title: "Reply school re: excursion",assigned_to: "kim",   done: false, is_non_negotiable: false, category: "reminder", badge: "email",   source: "manual", visibility: ["parents_only"] },
      { id: "d9",  household_id: "demo-household", date: today, title: "Chase plumber invoice",     assigned_to: "kim",   done: false, is_non_negotiable: false, category: "reminder", badge: "email",   source: "manual", visibility: ["parents_only"] },
      { id: "d10", household_id: "demo-household", date: today, title: "Renew car rego online",     assigned_to: "kim",   done: false, is_non_negotiable: false, category: "reminder", badge: "due Fri", source: "manual", visibility: ["parents_only"] },
      { id: "d11", household_id: "demo-household", date: today, title: "Book Mason's school photos",assigned_to: "kim",   done: false, is_non_negotiable: false, category: "reminder", source: "manual", visibility: ["parents_only"] }
    ],

    calendarItems: [
      { id: "c1",  household_id: "demo-household", title: "School assembly",       starts_at: `${today}T09:00:00`,       visibility: ["household","kids_visible","hub_public","grandparents_visible"], source: "school"   },
      { id: "c2",  household_id: "demo-household", title: "Bins out before dark",  starts_at: `${today}T18:00:00`,       visibility: ["household","hub_public"], source: "reminder" },
      { id: "c3",  household_id: "demo-household", title: "Dinner: Chicken thighs",starts_at: `${today}T18:30:00`,       visibility: ["household","hub_public","kids_visible","grandparents_visible","carer_visible"], source: "meal" },
      { id: "c4",  household_id: "demo-household", title: "Private appointment",   starts_at: `${today}T15:00:00`,       visibility: ["private_to_user","hub_hidden"], user_id: "kim", source: "private" },
      { id: "c5",  household_id: "demo-household", title: "Mason - Soccer pickup", starts_at: `${plusDays(2)}T16:30:00`, visibility: ["household","hub_public","kids_visible","grandparents_visible"], person_id: "mason", source: "sport" },
      { id: "c6",  household_id: "demo-household", title: "Jaxon - School pickup", starts_at: `${plusDays(3)}T15:30:00`, visibility: ["household","grandparents_visible"], person_id: "jaxon", source: "school" },
      { id: "c7",  household_id: "demo-household", title: "Hudson - Birthday party",starts_at: `${plusDays(5)}T14:00:00`,visibility: ["household","hub_public","kids_visible","grandparents_visible"], person_id: "hudson", source: "birthday" },
      { id: "c8",  household_id: "demo-household", title: "Easton - Therapy",      starts_at: `${tomorrow}T14:00:00`,    visibility: ["parents_only","carer_visible"], person_id: "easton", source: "medical", sensitive: true },
      { id: "c9",  household_id: "demo-household", title: "Electricity bill due",  starts_at: `${tomorrow}T09:00:00`,    visibility: ["parents_only"], source: "bill" },
      { id: "c10", household_id: "demo-household", title: "Car service",           starts_at: `${plusDays(4)}T09:00:00`, visibility: ["parents_only"], source: "vehicle" }
    ],

    nightBefore: [
      { id: "n1", household_id: "demo-household", title: "Lunch boxes ready",   assigned_to: "kim",   done: false },
      { id: "n2", household_id: "demo-household", title: "Uniforms near bags",  assigned_to: "carl",  done: false },
      { id: "n3", household_id: "demo-household", title: "Soccer boots packed", assigned_to: "jaxon", done: false }
    ],

    meals: [
      { id: "m1", household_id: "demo-household", name: "Chicken wraps",       is_favourite: true,  prep_time_mins: 20, notes: "" },
      { id: "m2", household_id: "demo-household", name: "Pasta bake",          is_favourite: true,  prep_time_mins: 35, notes: "" },
      { id: "m3", household_id: "demo-household", name: "Leftovers",           is_favourite: false, prep_time_mins: 10, notes: "" },
      { id: "m4", household_id: "demo-household", name: "Chicken thighs",      is_favourite: true,  prep_time_mins: 25, notes: "" },
      { id: "m5", household_id: "demo-household", name: "Spaghetti bolognese", is_favourite: true,  prep_time_mins: 30, notes: "" }
    ],

    mealPlan: {
      [today]:       { dinner: { meal_id: "m4", custom_name: null } },
      [tomorrow]:    { dinner: { meal_id: "m2", custom_name: null } },
      [plusDays(2)]: { dinner: { meal_id: "m1", custom_name: null } }
    },

    alerts: [],

    bills: [
      { id: "b1", name: "Electricity",   due_date: tomorrow,    paid: false, visibility: ["parents_only"] },
      { id: "b2", name: "Afterpay",      due_date: plusDays(2), paid: false, visibility: ["parents_only"] },
      { id: "b3", name: "Car insurance", due_date: plusDays(3), paid: false, visibility: ["parents_only"] },
      { id: "b4", name: "Spotify",       due_date: plusDays(4), paid: false, visibility: ["parents_only"] }
    ],

    appointments: [
      { id: "a1", title: "Mason - dentist",  person_id: "mason",  date: today,       time: "15:30", sensitive: false, visibility: ["parents_only"] },
      { id: "a2", title: "Kim - haircut",    person_id: "kim",    date: tomorrow,    time: "11:00", sensitive: false, visibility: ["parents_only"] },
      { id: "a3", title: "Easton - therapy", person_id: "easton", date: tomorrow,    time: "14:00", sensitive: true,  visibility: ["parents_only","carer_visible"] },
      { id: "a4", title: "Car service",      person_id: null,     date: plusDays(2), time: "09:00", sensitive: false, visibility: ["parents_only"] }
    ],

    // Easton care profile — visible to Sarah (carer) only
    eastonCare: {
      name: "Easton",
      person_id: "easton",
      routine: [
        { time: "7:30am",  label: "Breakfast",          note: "Dairy-free milk, cereal or eggs" },
        { time: "8:30am",  label: "School drop-off",    note: "Bag check: fidget cube, water bottle" },
        { time: "3:30pm",  label: "After-school snack", note: "Fruit or rice crackers — no nuts" },
        { time: "5:00pm",  label: "Quiet time",         note: "15 mins before any screens" },
        { time: "6:00pm",  label: "Dinner",             note: "See meal plan. Cut food small." },
        { time: "8:00pm",  label: "Bed routine",        note: "Shower, story, lights out 8:30pm" }
      ],
      food_notes: [
        "Dairy-free milk only (oat or almond)",
        "No nuts — causes hives",
        "Loves pasta, rice, most vegetables",
        "Sandwich cut in triangles, crusts off"
      ],
      calm_notes: [
        "Quiet corner in bedroom helps when overwhelmed",
        "Counting to 10 together works well",
        "Fidget cube is in school bag at all times",
        "Avoid raised voices — use a calm, slow tone",
        "Give 5-minute warnings before transitions"
      ],
      emergency_contacts: [
        { name: "Kim (Mum)",    phone: "0400 000 001", role: "Parent"    },
        { name: "Carl (Dad)",   phone: "0400 000 002", role: "Parent"    },
        { name: "Dr Patel — GP",phone: "07 3000 0001", role: "GP"        },
        { name: "Emergency",    phone: "000",           role: "Emergency" }
      ],
      handover_note: "Easton had a good day. Lunch was eaten. Soccer gear needs packing for tomorrow."
    },

    // Visitor / babysitter info
    visitorInfo: {
      welcome: "Welcome to the Johnson household.",
      address: "12 Example Street, Brisbane QLD 4000",
      houseRules: [
        "Shoes off at the front door",
        "No screens after 8pm",
        "Bedtime: Mason 8:30pm, Jaxon 8:00pm, Hudson 7:30pm",
        "Dog is not allowed on the couch",
        "Emergency contacts are on the fridge"
      ],
      tonightSchedule: [
        { time: "6:00pm", label: "Dinner",     note: "Chicken thighs in the oven — should be ready." },
        { time: "7:00pm", label: "Tidy up",    note: "All kids help clear the table." },
        { time: "7:30pm", label: "Hudson bed", note: "Bath, story, lights out." },
        { time: "8:00pm", label: "Jaxon bed",  note: "Reading, then lights out." },
        { time: "8:30pm", label: "Mason bed",  note: "Can read for 20 mins." }
      ],
      emergency_contacts: [
        { name: "Kim (Mum)",      phone: "0400 000 001" },
        { name: "Carl (Dad)",     phone: "0400 000 002" },
        { name: "Neighbour Sue",  phone: "0400 000 003" },
        { name: "Emergency",      phone: "000"          }
      ]
    },

    // Vault Lite items
    vaultItems: [
      { id: "v1", name: "Home Insurance",   expiry: "22 Jan 2026", reminder: "30 days before", storage: "Filing cabinet, red folder",   notes: "Renew with same provider" },
      { id: "v2", name: "Car Registration", expiry: "15 Mar 2026", reminder: "30 days before", storage: "Glove box + filing cabinet",   notes: "Both cars due same month" },
      { id: "v3", name: "Kim Passport",     expiry: "04 Jun 2027", reminder: "6 months before",storage: "Safe in wardrobe",             notes: "" },
      { id: "v4", name: "Carl Passport",    expiry: "11 Nov 2025", reminder: "6 months before",storage: "Safe in wardrobe",             notes: "Needs renewal soon" },
      { id: "v5", name: "Home Warranty",    expiry: "30 Sep 2026", reminder: "60 days before", storage: "Filing cabinet, green folder", notes: "Appliances covered" }
    ],

    // NOSIK Tidy suggestions
    tidySuggestions: [
      { id: "t1", featureKey: "nosikPulse",   message: "NOSIK Pulse has been suggested but never opened. Try it, or hide it for now?", action: "try_or_hide"  },
      { id: "t2", featureKey: "screenBalance",message: "Screen Balance is on but hasn't been used this week. Want to pause it?",       action: "pause_or_keep" }
    ],

    // Access log (demo — Phase 2 writes these from DB)
    accessLog: [
      { user: "Nan",   action: "Opened Grandparent View", time: "3:12pm" },
      { user: "Sarah", action: "Opened Easton Care View", time: "3:28pm" },
      { user: "Mason", action: "Accepted Bins Alert",      time: "4:41pm" }
    ],

    blastPresets: [
      "DOG IS OUTSIDE - CHECK GATE NOW",
      "COME TO THE HUB NOW",
      "BINS NEED TO GO OUT NOW",
      "CALL KIM URGENTLY",
      "COME HOME NOW"
    ]
  };
})();
