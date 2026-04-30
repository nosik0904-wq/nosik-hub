// ── NOSIK Demo Data ──
// All static demo data lives here. Replace with Supabase calls later.

export const PINS = {
  '1234': 'carl',
  '5678': 'kim',
  '1111': 'mason',
  '2222': 'jaxon',
  '3333': 'easton',
  '4444': 'hudson',
  '2468': 'nan',
  '8642': 'carer',
  '9090': 'visitor',
};

export const HOUSEHOLD = {
  name: 'The Andersons',
  location: 'Brisbane, QLD',
  weather: { temp: '24°', desc: 'Partly cloudy', icon: '⛅' },
};

export const MEMBERS = [
  { id: 'carl',  name: 'Carl',  role: 'parent',   emoji: '👔', color: '#d4845a', initial: 'C' },
  { id: 'kim',   name: 'Kim',   role: 'parent',   emoji: '👩', color: '#e05a5a', initial: 'K' },
  { id: 'mason', name: 'Mason', role: 'kid',      emoji: '🎮', color: '#5b9bd5', initial: 'M', age: 13 },
  { id: 'jaxon', name: 'Jaxon', role: 'kid',      emoji: '⚽', color: '#d4845a', initial: 'J', age: 11 },
  { id: 'easton',name: 'Easton',role: 'kid',      emoji: '🦕', color: '#9b7ec8', initial: 'E', age: 8  },
  { id: 'hudson',name: 'Hudson',role: 'kid',      emoji: '🐣', color: '#4caf87', initial: 'H', age: 5  },
];

export const CALENDAR_EVENTS = {
  '2026-4-30': [
    { time: '8:30 AM', title: 'School — normal day',       sub: 'All kids',              color: '#5b9bd5', vis: 'household' },
    { time: '12:30 PM',title: 'Easton therapy — Dr Nguyen',sub: 'Kim attending',          color: '#9b7ec8', vis: 'parents'   },
    { time: '5:30 PM', title: 'Jaxon soccer training',     sub: 'Suncorp · Dad driving', color: '#d4845a', vis: 'household' },
    { time: 'Evening', title: 'Bins night 🗑️',             sub: 'Before dark',            color: '#f0b429', vis: 'household' },
    { time: '7:00 PM', title: 'Family dinner — Pasta bake',sub: '',                       color: '#4caf87', vis: 'household' },
    { time: 'Private', title: 'Anniversary dinner — 14 days',sub: 'Plan something for Kim',color: '#e05a5a', vis: 'carl'     },
  ],
  '2026-5-1': [
    { time: 'All day', title: '🎂 Mason\'s birthday — turning 14!', sub: '', color: '#4caf87', vis: 'household' },
    { time: '8:30 AM', title: 'School sports day',   sub: 'All kids',  color: '#5b9bd5', vis: 'household' },
  ],
  '2026-5-3': [
    { time: '10:00 AM', title: 'Nan visiting 🤗', sub: 'Arrives 10 AM · staying for lunch', color: '#d4845a', vis: 'household' },
  ],
  '2026-5-7': [
    { time: 'Evening', title: 'Recycle bins 🗑️', sub: '', color: '#f0b429', vis: 'household' },
  ],
  '2026-5-10': [
    { time: '10:00 AM', title: 'Jaxon soccer — away game', sub: 'Transport needed', color: '#d4845a', vis: 'household' },
  ],
  '2026-5-15': [
    { time: '', title: 'Car rego due — CX-5',    sub: '', color: '#e05a5a', vis: 'parents' },
    { time: '', title: 'Council rates Q2 due',   sub: '$680', color: '#f0b429', vis: 'parents' },
  ],
  '2026-5-20': [
    { time: '6:30 PM', title: 'School production rehearsal', sub: 'Mason + Jaxon', color: '#5b9bd5', vis: 'household' },
  ],
  '2026-5-25': [
    { time: 'All day', title: 'School excursion — Science Museum', sub: 'Easton · permission needed', color: '#5b9bd5', vis: 'household' },
  ],
};

export const TASKS = [
  { id: 1, who: 'mason', name: 'Dishes',                done: true,  cat: 'Daily',     badge: 'Done ✓',  urgency: 'done'    },
  { id: 2, who: 'mason', name: 'Vacuum lounge room',    done: false, cat: 'Daily',     badge: 'Today',   urgency: 'normal'  },
  { id: 3, who: 'jaxon', name: 'Take bins out 🗑️',      done: false, cat: 'Weekly',    badge: 'Tonight!',urgency: 'urgent'  },
  { id: 4, who: 'jaxon', name: 'Feed the dog',          done: false, cat: 'Daily',     badge: 'Today',   urgency: 'normal'  },
  { id: 5, who: 'jaxon', name: 'Pack soccer bag',       done: false, cat: 'Today',     badge: '5:30 PM', urgency: 'normal'  },
  { id: 6, who: 'easton',name: 'Tidy dinosaur toys',    done: false, cat: 'Daily',     badge: 'Today',   urgency: 'normal'  },
  { id: 7, who: 'hudson',name: 'Put toys away',         done: false, cat: 'Daily',     badge: 'Today',   urgency: 'normal'  },
  { id: 8, who: 'carl',  name: 'Soccer pickup — Suncorp',done:false, cat: 'Today',    badge: '5:30 PM', urgency: 'normal'  },
  { id: 9, who: 'carl',  name: 'Pay electricity bill',  done: false, cat: 'Urgent',    badge: 'Overdue!',urgency: 'urgent'  },
  { id: 10,who: 'kim',   name: 'Easton therapy — attend',done:true,  cat: 'Today',    badge: 'Done ✓',  urgency: 'done'    },
  { id: 11,who: 'kim',   name: 'Book dentist — all kids',done:false, cat: 'This week', badge: 'Reminder',urgency: 'normal'  },
];

export const GROCERIES = [
  { id: 1, cat: 'produce',   name: 'Apples × 6',          done: false },
  { id: 2, cat: 'produce',   name: 'Baby spinach',         done: false },
  { id: 3, cat: 'produce',   name: 'Tomatoes × 4',         done: false },
  { id: 4, cat: 'dairy',     name: 'Milk — 2L full cream', done: false },
  { id: 5, cat: 'dairy',     name: 'Oat milk × 2 (Easton)',done: false, note: 'dairy-free' },
  { id: 6, cat: 'dairy',     name: 'Cheese — pizza blend', done: false },
  { id: 7, cat: 'pantry',    name: 'Pasta — penne',        done: false },
  { id: 8, cat: 'pantry',    name: 'Bread',                done: true  },
  { id: 9, cat: 'pantry',    name: 'Canned tomatoes × 3',  done: false },
  { id: 10,cat: 'pantry',    name: 'Mason birthday cake ingredients 🎂', done: false },
  { id: 11,cat: 'household', name: 'Dishwasher tablets',   done: false },
  { id: 12,cat: 'household', name: 'Bin liners — large',   done: false },
];

export const BILLS = [
  { id: 1, icon: '⚡', name: 'Electricity — Origin Energy', due: 'Due 28 Apr — overdue!', amount: 312.40, status: 'overdue' },
  { id: 2, icon: '🎵', name: 'Spotify Family',              due: 'Due Sunday 4 May',       amount: 22.99,  status: 'upcoming' },
  { id: 3, icon: '🌐', name: 'NBN — Aussie Broadband',      due: 'Due Tuesday 6 May',      amount: 99.00,  status: 'upcoming' },
  { id: 4, icon: '🚗', name: 'Car insurance — NRMA',        due: 'Due 8 May',              amount: 189.00, status: 'upcoming' },
  { id: 5, icon: '🏠', name: 'Council rates — Q2',          due: 'Due 15 May',             amount: 680.00, status: 'upcoming' },
  { id: 6, icon: '📱', name: 'Mobile — Telstra (Carl)',      due: 'Due 22 May',             amount: 65.00,  status: 'upcoming' },
  { id: 7, icon: '📱', name: 'Mobile — Telstra (Kim)',       due: 'Due 22 May',             amount: 55.00,  status: 'upcoming' },
  { id: 8, icon: '💧', name: 'Water — Urban Utilities',     due: 'Paid 15 Apr',            amount: 148.00, status: 'paid'     },
  { id: 9, icon: '🔥', name: 'Gas — AGL',                   due: 'Paid 8 Apr',             amount: 112.50, status: 'paid'     },
  { id: 10,icon: '🏊', name: 'Jaxon swimming lessons',      due: 'Paid 1 Apr',             amount: 120.00, status: 'paid'     },
];

export const MAINTENANCE = [
  { id: 1, icon: '🔧', name: 'Air filter replacement',    meta: 'Every 3 months · Last done Jan 2026 · 1 month overdue', status: 'overdue' },
  { id: 2, icon: '🪣', name: 'Gutters — clear leaves',   meta: 'Every 6 months · Last done Oct 2025',                    status: 'overdue' },
  { id: 3, icon: '🔩', name: 'Smoke alarm battery test', meta: 'Every 6 months · Due 15 May',                            status: 'due'     },
  { id: 4, icon: '🌿', name: 'Garden — mulch & fertilise',meta: 'Every spring/autumn · Due end of May',                  status: 'due'     },
  { id: 5, icon: '🚿', name: 'Hot water system check',   meta: 'Annual · Due June',                                      status: 'due'     },
  { id: 6, icon: '🏊', name: 'Pool chemical balance',    meta: 'Weekly · Last done Monday',                              status: 'ok'      },
  { id: 7, icon: '🌿', name: 'Lawn mowing',              meta: 'Fortnightly · Last done 20 Apr',                         status: 'ok'      },
  { id: 8, icon: '🧹', name: 'Roof inspection',          meta: 'Annual · Done Feb 2026 · Next Feb 2027',                 status: 'ok'      },
  { id: 9, icon: '❄️', name: 'AC service — all units',   meta: 'Annual · Done Mar 2026 · Next Mar 2027',                 status: 'ok'      },
  { id: 10,icon: '🔒', name: 'Door & window latch check',meta: '6 monthly · Done Jan 2026 · Next Jul 2026',              status: 'ok'      },
];

export const ALERTS_HISTORY = [
  { type: 'nudge', text: "Don't forget dog food on the way home.", meta: 'NUDGE · Kim · Yesterday 5:05 PM · Cleared' },
  { type: 'knock', text: 'Bins out tonight — everyone!',          meta: 'KNOCK · Carl · Wed · ✓ Accepted by Mason 6:02 PM' },
  { type: 'blast', text: 'DOG IS IN THE FRONT YARD — CLOSE THE GATE!', meta: 'BLAST · Carl · Mon · ✓ Accepted by Kim 4:44 PM' },
  { type: 'nudge', text: 'Jaxon — homework before dinner please.',meta: 'NUDGE · Kim · Mon · Cleared' },
];

export const VAULT = [
  { icon: '🚗', name: 'Car rego — CX-5',     due: 'Due 15 May', urgent: true  },
  { icon: '🏠', name: 'Home insurance',       due: 'Renews 22 Jan',urgent:false },
  { icon: '🛂', name: 'Carl passport',        due: 'Expires Oct 2026',urgent:false},
  { icon: '🦷', name: 'Kids dental — all 4', due: 'Due Jun',    urgent: false },
];
