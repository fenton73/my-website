import type { IconName } from "./icons";

/* ---------------------------------------------------------------- quotes -- */
export const QUOTES: { text: string; author: string }[] = [
  { text: "Healing is not linear, but it is always happening.", author: "Recover+" },
  { text: "Rest is not idleness. Right now, rest is training.", author: "Recover+" },
  { text: "The body achieves what the mind believes — give it time.", author: "Unknown" },
  { text: "Small steps every day add up to big comebacks.", author: "Recover+" },
  { text: "You are not behind. You are exactly where recovery needs you.", author: "Recover+" },
  { text: "A setback is a setup for a stronger return.", author: "Unknown" },
  { text: "Patience today is performance tomorrow.", author: "Recover+" },
  { text: "Champions are made in the recovery, not just the game.", author: "Unknown" },
  { text: "Your bones are quietly rebuilding stronger than before.", author: "Recover+" },
  { text: "Comeback stories start with a single calm day.", author: "Recover+" },
  { text: "Protect the process and the process will reward you.", author: "Recover+" },
  { text: "Strong is what you become after you thought you couldn't.", author: "Unknown" },
  { text: "Every glass of water, every good sleep — that's you healing.", author: "Recover+" },
  { text: "Slow is smooth, and smooth is fast.", author: "Unknown" },
  { text: "You've got a whole team behind you. Trust them, trust yourself.", author: "Recover+" },
];

/* --------------------------------------------------------- recovery facts -- */
export const FACTS: string[] = [
  "Bone is living tissue — it constantly rebuilds itself, and a healing break lays down fresh, strong bone.",
  "Most of your bone healing happens while you sleep, which is why rest genuinely speeds recovery.",
  "Protein isn't just for muscle — about half of bone volume is protein that forms the scaffold for new bone.",
  "Calcium and vitamin D work as a team: vitamin D helps your gut actually absorb the calcium you eat.",
  "Swelling is your body delivering healing cells — elevation helps it drain so you feel more comfortable.",
  "Elevating above heart level uses gravity to reduce throbbing and swelling in the foot.",
  "Gently wiggling your toes (if your doctor allows) keeps blood moving and joints happy.",
  "Vitamin C helps build collagen, part of the framework new bone forms around.",
  "Staying hydrated helps nutrients travel to the healing site and keeps you feeling better.",
  "Mood and healing are linked — lower stress can support a smoother recovery.",
];

/* ---------------------------------------------------------- default tasks -- */
export interface TaskDef { id: string; label: string; icon: IconName; group: TaskGroup; }
export type TaskGroup = "nutrition" | "care" | "wellbeing" | "tracking";

export const TASK_GROUPS: { id: TaskGroup; label: string; tone: string }[] = [
  { id: "nutrition", label: "Fuel your healing", tone: "mint" },
  { id: "care", label: "Cast & ankle care", tone: "brand" },
  { id: "wellbeing", label: "Mind & wellbeing", tone: "violet" },
  { id: "tracking", label: "Track today", tone: "amber" },
];

export const DEFAULT_TASKS: TaskDef[] = [
  { id: "water", label: "Drink enough water", icon: "droplet", group: "nutrition" },
  { id: "protein", label: "Eat enough protein", icon: "nutrition", group: "nutrition" },
  { id: "calcium", label: "Eat calcium-rich foods", icon: "nutrition", group: "nutrition" },
  { id: "supplements", label: "Take supplements if prescribed", icon: "pill", group: "nutrition" },
  { id: "vitd", label: "Get vitamin D / safe sunlight", icon: "sun", group: "nutrition" },
  { id: "elevate", label: "Elevate ankle above heart", icon: "activity", group: "care" },
  { id: "castdry", label: "Keep cast clean & dry", icon: "cast", group: "care" },
  { id: "toes", label: "Inspect toes for colour & swelling", icon: "eye", group: "care" },
  { id: "wiggle", label: "Wiggle toes (if doctor allows)", icon: "footprints", group: "care" },
  { id: "hospital", label: "Follow hospital instructions", icon: "hospital", group: "care" },
  { id: "ice", label: "Ice only if medically appropriate", icon: "droplet", group: "care" },
  { id: "sleep", label: "Get enough sleep", icon: "bed", group: "wellbeing" },
  { id: "outside", label: "Spend some time outside", icon: "leaf", group: "wellbeing" },
  { id: "read", label: "Read something", icon: "book", group: "wellbeing" },
  { id: "watch", label: "Watch something enjoyable", icon: "tv", group: "wellbeing" },
  { id: "friend", label: "Message a friend", icon: "message", group: "wellbeing" },
  { id: "breathe", label: "Complete a breathing exercise", icon: "wind", group: "wellbeing" },
  { id: "journal", label: "Journal today's progress", icon: "pencil", group: "tracking" },
  { id: "logpain", label: "Log pain level", icon: "activity", group: "tracking" },
  { id: "logswell", label: "Log swelling", icon: "gauge", group: "tracking" },
  { id: "logmood", label: "Log mood", icon: "smile", group: "tracking" },
];

/* ------------------------------------------------------------- phases info -- */
export const PHASE_LABELS: Record<string, string> = {
  injury: "Injury", cast: "In a plaster cast", boot: "Walking boot",
  pwb: "Partial weight bearing", walk: "Walking unaided", physio: "Physiotherapy",
  jog: "Jogging", run: "Running", sport: "Sport drills", football: "Back to football",
};

/* ------------------------------------------------------------ moods scale -- */
export const MOODS = [
  { v: 1, emoji: "😣", label: "Rough" },
  { v: 2, emoji: "😕", label: "Low" },
  { v: 3, emoji: "😐", label: "Okay" },
  { v: 4, emoji: "🙂", label: "Good" },
  { v: 5, emoji: "😄", label: "Great" },
];

/* ------------------------------------------------------------ nutrition ---- */
export interface Nutrient { name: string; icon: IconName; why: string; foods: string[]; tone: string; }
export const NUTRIENTS: Nutrient[] = [
  { name: "Protein", icon: "nutrition", tone: "mint",
    why: "Builds the collagen scaffold that new bone forms around and helps rebuild any muscle lost while resting.",
    foods: ["Chicken, turkey, beef", "Eggs", "Greek yoghurt", "Milk & cheese", "Beans, lentils, tofu", "Fish", "Protein shakes"] },
  { name: "Calcium", icon: "shield", tone: "brand",
    why: "The main mineral that hardens and strengthens bone. Your body needs a steady supply while a break heals.",
    foods: ["Milk & yoghurt", "Cheese", "Fortified plant milks", "Leafy greens (kale, pak choi)", "Tinned fish with bones", "Almonds", "Tofu set with calcium"] },
  { name: "Vitamin D", icon: "sun", tone: "amber",
    why: "Helps your gut absorb calcium. Made in skin from sunlight, but often low — many people are advised to supplement.",
    foods: ["Safe sunlight", "Oily fish (salmon, mackerel)", "Egg yolks", "Fortified cereals", "Fortified milk", "A supplement if prescribed"] },
  { name: "Vitamin C", icon: "leaf", tone: "mint",
    why: "Needed to make collagen — part of the framework new bone and healthy skin are built on.",
    foods: ["Oranges & citrus", "Strawberries", "Kiwi", "Peppers", "Broccoli", "Tomatoes"] },
  { name: "Healthy fats", icon: "droplet", tone: "violet",
    why: "Support overall healing and help absorb vitamins like D. Aim for unsaturated sources.",
    foods: ["Olive oil", "Avocado", "Nuts & seeds", "Oily fish", "Nut butters"] },
  { name: "Hydration", icon: "droplet", tone: "brand",
    why: "Carries nutrients to the healing site and helps you feel better day to day. Aim for pale-yellow urine.",
    foods: ["Water", "Milk", "Herbal teas", "Fruit with high water content", "Diluted squash"] },
  { name: "Sleep", icon: "bed", tone: "violet",
    why: "Not a food, but this is when most healing hormones do their work. Protect a steady sleep routine.",
    foods: ["Aim 8–10 hrs (teens)", "Consistent bedtime", "Dark, cool room", "Screens down before bed"] },
];

export const MEAL_IDEAS: { title: string; items: string }[] = [
  { title: "Bone-friendly breakfast", items: "Greek yoghurt + berries + almonds, or eggs on wholemeal toast with a glass of milk." },
  { title: "Power lunch", items: "Chicken or tuna wrap, cheese, a piece of fruit, and a fortified drink." },
  { title: "Healing dinner", items: "Salmon or lean beef, leafy greens, sweet potato, and a glass of milk." },
  { title: "Smart snacks", items: "Cheese & crackers, a protein shake, hummus with peppers, or a handful of nuts." },
];

/* ------------------------------------------------------------- education --- */
export interface Article { id: string; title: string; icon: IconName; minutes: number; summary: string; body: string[]; tone: string; }
export const ARTICLES: Article[] = [
  { id: "bones", title: "Why bones heal", icon: "shield", minutes: 3, tone: "brand",
    summary: "The stages your ankle goes through as it knits back together.",
    body: [
      "Bone is living tissue with its own blood supply, so a break can genuinely repair itself — often stronger at the healed site.",
      "First, a blood clot (haematoma) forms and cells rush in. Within days a soft callus of collagen bridges the gap, then it slowly hardens with minerals into a hard callus.",
      "Over weeks and months your body remodels this into normal, strong bone. Immobilising the ankle in a cast holds the pieces in the right position so this can happen.",
      "This is why patience matters: the timeline is set by biology, not effort. Good nutrition, sleep and following your team's plan give your body the best conditions to heal.",
    ] },
  { id: "protein", title: "Why protein matters", icon: "nutrition", minutes: 2, tone: "mint",
    summary: "Protein is the scaffolding your new bone is built on.",
    body: [
      "About half of bone by volume is protein — mostly collagen, which forms the flexible framework that minerals attach to.",
      "While you're resting you also want to protect the muscle you built through football and training. Enough protein helps limit muscle loss.",
      "Spread protein across the day rather than one big hit: some at each meal and snack. Think eggs, dairy, meat, fish, beans, tofu or a shake.",
    ] },
  { id: "sleep", title: "The power of sleep", icon: "bed", minutes: 2, tone: "violet",
    summary: "Your biggest recovery tool is completely free.",
    body: [
      "Deep sleep releases growth hormone, which supports tissue and bone repair. In a real sense, you heal while you sleep.",
      "Teenagers generally need 8–10 hours. An injury can disrupt sleep through discomfort, so a steady routine helps.",
      "Keep a consistent bedtime, a cool dark room, and wind down off screens beforehand. Elevate the ankle comfortably as your team advises.",
    ] },
  { id: "hydration", title: "Why hydration helps", icon: "droplet", minutes: 2, tone: "brand",
    summary: "Water keeps the healing supply lines open.",
    body: [
      "Blood is mostly water, and it's your delivery system for the oxygen and nutrients your healing ankle needs.",
      "Even mild dehydration can leave you tired and low. A simple check: pale-yellow urine usually means you're well hydrated.",
      "Sip through the day rather than gulping all at once. Milk and diluted squash count too.",
    ] },
  { id: "swelling", title: "What swelling means", icon: "gauge", minutes: 2, tone: "amber",
    summary: "Swelling is normal healing — until it isn't.",
    body: [
      "Swelling is your body sending fluid and repair cells to the injury. Some is completely expected, especially early on.",
      "Elevating the ankle above heart level and resting helps fluid drain, easing throbbing and pressure.",
      "Tell your team if swelling suddenly increases, the cast feels tight, toes look blue or pale, or you lose feeling — see the Warning Signs page.",
    ] },
  { id: "cast", title: "Caring for your cast", icon: "cast", minutes: 2, tone: "brand",
    summary: "Keep it dry, clean and doing its job.",
    body: [
      "Keep the cast completely dry — cover it for showers with a proper cast cover or sealed bag as advised.",
      "Never poke things down the cast to scratch, and don't put powder or lotion inside — it can damage skin you can't see.",
      "Keep checking your toes for warmth, normal colour and movement. A bad smell, new wetness, cracks, or rubbing sore spots are all worth reporting.",
    ] },
  { id: "clots", title: "Blood clot warning signs", icon: "warning", minutes: 2, tone: "rose",
    summary: "Rare, but important to recognise fast.",
    body: [
      "Being immobile can slightly raise the risk of a clot in the leg (DVT). It's uncommon in teens, but worth knowing.",
      "Warning signs include new calf pain or tenderness, swelling, warmth or redness — especially in one leg.",
      "A clot that travels to the lungs is an emergency: sudden breathlessness, chest pain, or coughing. Seek urgent medical help immediately if these occur — call emergency services.",
      "This is general education only. If you're ever worried, contact your medical team or emergency services straight away.",
    ] },
  { id: "contact", title: "When to contact your doctor", icon: "phone", minutes: 2, tone: "brand",
    summary: "Trust your gut — it's always okay to ask.",
    body: [
      "Contact your team for increasing or uncontrolled pain, a cast that feels too tight, numbness, tingling or toes that change colour.",
      "Also for a high temperature, a bad smell or discharge from the cast, or if the cast cracks, softens or gets wet inside.",
      "You never need to justify a genuine worry. Keep your hospital and ward numbers saved on the Hospital page.",
    ] },
  { id: "exercise", title: "Returning to exercise safely", icon: "run", minutes: 2, tone: "mint",
    summary: "The comeback is a staged process led by your team.",
    body: [
      "Return happens in stages: out of the cast, into a boot, partial then full weight bearing, physio, then gradually jogging, running and sport.",
      "Each stage is cleared by your doctor or physiotherapist. Rushing risks re-injury and a longer road overall.",
      "Only do exercises your physio has specifically approved. When you're cleared, you can save your prescribed exercises on the Exercise page.",
      "Rebuilding is about consistency, not intensity. Your training mindset is a huge advantage — aim it at doing the basics brilliantly.",
    ] },
  { id: "mind", title: "Mental health during injury", icon: "heart", minutes: 3, tone: "violet",
    summary: "Missing sport is hard. These feelings are valid.",
    body: [
      "It's completely normal to feel frustrated, bored, low or anxious after an injury — especially when sport is a big part of who you are.",
      "Keep some structure: a daily checklist, small goals, and staying connected with friends and team-mates all genuinely help.",
      "Notice small wins and things you're grateful for — the mood tools here are built for exactly this.",
      "If low mood lasts more than a couple of weeks, feels heavy, or you're struggling to cope, please talk to a parent, carer, GP or a trusted adult. Asking for help is a strength.",
    ] },
];

/* ------------------------------------------------------------- warnings ---- */
export const WARNINGS: { title: string; detail: string }[] = [
  { title: "Increasing or severe pain", detail: "Pain that keeps getting worse or isn't controlled by your usual pain relief." },
  { title: "Blue, grey or very pale toes", detail: "A colour change in the toes can mean blood flow is restricted." },
  { title: "Numbness or loss of feeling", detail: "Pins and needles that won't go, or losing feeling in the foot or toes." },
  { title: "Cast feels too tight", detail: "New tightness, intense pressure or a squeezing feeling inside the cast." },
  { title: "Shortness of breath", detail: "Sudden or unexplained breathlessness — a possible sign of a clot on the lungs." },
  { title: "Chest pain", detail: "New chest pain, especially with breathlessness — treat as an emergency." },
  { title: "Calf swelling, pain or warmth", detail: "A swollen, tender, warm or red calf can be a sign of a blood clot (DVT)." },
  { title: "High temperature / fever", detail: "Feeling hot and shivery or a high temperature may signal an infection." },
  { title: "Bad smell or discharge from cast", detail: "A foul smell, fluid, or new wet patches can signal a skin problem or infection." },
];

/* ---------------------------------------------------------- achievements --- */
export interface AchievementDef { id: string; title: string; desc: string; icon: IconName; tone: string; }
export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "firstday", title: "Day One", desc: "Complete your first task", icon: "sparkles", tone: "brand" },
  { id: "firstweek", title: "First Week", desc: "7 days since injury logged", icon: "calendar", tone: "brand" },
  { id: "hydrated", title: "Stayed Hydrated", desc: "Hit your water goal 5 days", icon: "droplet", tone: "brand" },
  { id: "perfectday", title: "Perfect Day", desc: "Finish every task in a day", icon: "checkCircle", tone: "mint" },
  { id: "perfectweek", title: "Perfect Week", desc: "Complete your checklist 7 days in a row", icon: "medal", tone: "amber" },
  { id: "warrior", title: "Recovery Warrior", desc: "Log any activity 14 days", icon: "shield", tone: "violet" },
  { id: "positive", title: "Stayed Positive", desc: "Log a good mood 5 days", icon: "smile", tone: "amber" },
  { id: "journalist", title: "Journal Master", desc: "Write 7 journal entries", icon: "book", tone: "mint" },
  { id: "restful", title: "Well Rested", desc: "Log good sleep 5 nights", icon: "bed", tone: "violet" },
  { id: "prepared", title: "Well Prepared", desc: "Add 3 questions for your doctor", icon: "hospital", tone: "brand" },
];

/* -------------------------------------------------------- goal templates --- */
export const GOAL_TEMPLATES: { title: string; period: "week" | "month"; target: number }[] = [
  { title: "Stay hydrated 7 days", period: "week", target: 7 },
  { title: "Complete the checklist every day", period: "week", target: 7 },
  { title: "Journal 5 times this week", period: "week", target: 5 },
  { title: "Log mood every day", period: "week", target: 7 },
  { title: "Prepare 3 questions for the doctor", period: "week", target: 3 },
  { title: "Good sleep 20 nights", period: "month", target: 20 },
  { title: "Improve average mood this month", period: "month", target: 30 },
  { title: "Time outside 20 days", period: "month", target: 20 },
];

/* -------------------------------------------------------- breathing steps -- */
export const BREATH_PATTERN = { inhale: 4, hold: 7, exhale: 8 }; // 4-7-8 relaxation
