/* Ashborn: story data. Scenes, random events, foes and endings. */
(function () {
const has = (s, i) => s.items.includes(i);
const f = (s, k) => !!s.flags[k];
const star = s => s.items.some(i => i.startsWith('Star-Iron'));
const lily = s => has(s, 'Dawn Lily') || f(s, 'lily_sub');
const km = s => f(s, 'kael_met');

const CH = { Prologue: 'The Night of Ash', I: 'The Mirewood Years', II: 'The Burning of Thornwick', III: 'Four Roads', IV: 'Blood Remembers', V: 'The Rising', VI: 'The Ashen Reckoning' };
const CHN = { Prologue: 'Prologue', I: 'Chapter I', II: 'Chapter II', III: 'Chapter III', IV: 'Chapter IV', V: 'Chapter V', VI: 'Chapter VI' };

/* ---------------- FOES ---------------- */
const FOES = {
  wolf: { name: 'Starving Wolf', hp: 28, atk: [3, 7], art: 'wolf', fx: 'snow', desc: `It's all ribs and teeth, and it is very hungry.`,
    hits: [`The wolf's teeth snap shut on your sleeve.`, `It lunges low for your legs.`, `It circles, then darts in and bites.`] },
  bandit: { name: 'Bandit Chief', hp: 38, atk: [4, 9], art: 'forest', fx: 'fog', desc: `A big man with a notched sword and a worse smile.`,
    hits: [`His sword rings off yours and bites your shoulder.`, `He kicks you in the knee.`, `A wild swing grazes your ribs.`] },
  hound: { name: 'Hound of the Abyss', hp: 45, atk: [5, 10], art: 'fire', fx: 'embers', desc: `Its ribs are an iron cage with a fire burning inside.`,
    hits: [`Its burning jaws close on your arm.`, `It slams you into the mud.`, `Claws like hot knives rake your side.`] },
  oswin: { name: 'Big Oswin', hp: 40, atk: [4, 8], art: 'battle', fx: 'embers', desc: `Six and a half feet of farmboy with a wooden sword like a tree trunk.`,
    hits: [`Oswin's wooden sword cracks against your ribs.`, `He shoulder-charges you into the dirt.`, `A clumsy swing that still hurts.`] },
  vorga: { name: 'Sir Vorga the Flayed', hp: 70, atk: [7, 13], heavy: 20, art: 'battle', fx: 'embers', warn: `Vorga lifts his greatsword high over his head. Guard!`,
    desc: `A demon knight who wears his own skin as a cloak. The river around him runs red.`,
    hits: [`Vorga's greatsword hammers your guard aside.`, `His gauntlet catches your jaw.`, `A slash opens your arm.`], heavyHit: `The greatsword comes down like a falling tree.` },
  moth: { name: 'The Grey Moth', hp: 55, atk: [6, 12], art: 'city', fx: 'fog', desc: `Moth-grey silk, two curved knives, and no sound at all.`,
    hits: [`A curved knife flicks across your forearm.`, `He's behind you before you can turn.`, `Two quick cuts, one deep.`] },
  warden: { name: 'Bone Warden', hp: 60, atk: [6, 12], art: 'dungeon', fx: 'ash', desc: `A guardian stitched together from a hundred monks' bones, holding a rusted halberd.`,
    hits: [`The halberd crashes into your shoulder.`, `Bony fingers rake your face.`, `It sweeps your legs from under you.`] },
  inquisitor: { name: 'Hollow Inquisitor', hp: 65, atk: [7, 12], art: 'fire', fx: 'embers', desc: `A red porcelain mask, and nothing behind its eyeholes but smoke.`,
    hits: [`A whip of black fire wraps your arm.`, `The Inquisitor's mace finds your ribs.`, `It whispers your sins and your head swims.`] },
  ruuk: { name: 'Ruuk the Pit King', hp: 70, atk: [7, 13], heavy: 20, art: 'battle', fx: 'ash', warn: `Ruuk drops low and roars. He's about to charge.`,
    desc: `Half demon, half bull, champion of forty fights. The crowd chants his name.`, hits: [`Ruuk's fist knocks the wind out of you.`, `A horn grazes your thigh.`, `He hurls you against the pit wall.`], heavyHit: `Ruuk's charge hits you like a cart.` },
  ghoul: { name: 'Grave Ghoul', hp: 40, atk: [5, 10], art: 'death', fx: 'fog', desc: `Long arms, too many teeth, and a smell like a flooded crypt.`,
    hits: [`Its claws rake your back.`, `It bites and won't let go.`, `It leaps from the gravestones.`] },
  osric: { name: 'King Osric of Tallowmere', hp: 55, atk: [5, 11], art: 'council', fx: 'motes', desc: `Old, fat and laughing, and a better swordsman than he looks.`,
    hits: [`Osric's blade slips past your guard.`, `He laughs and cuts your cheek.`, `A practiced riposte stings your wrist.`] },
  kael: { name: 'Prince Kaelith', hp: 80, atk: [8, 14], heavy: 22, art: 'night', fx: 'magic', warn: `Kael's shadow rises behind him like a second man. Guard!`,
    desc: `The boy from the river, grown into a prince of shadows. His sword is shaking a little.`, hits: [`Kael's blade nicks your collarbone.`, `His shadow trips you.`, `He's faster than you remember.`], heavyHit: `His shadow and his sword strike as one.` },
  tombguard: { name: 'Guardian of the Fallen Star', hp: 75, atk: [7, 14], heavy: 20, art: 'dungeon', fx: 'magic', warn: `The guardian's star-eye begins to glow white. Guard!`,
    desc: `A statue of black stone with a meteor for an eye. It has waited a thousand years for a thief.`, hits: [`A stone fist cracks your guard.`, `It stamps and the floor throws you.`, `Its stone blade scrapes along your ribs.`], heavyHit: `A beam of starlight burns across your chest.` },
  champion: { name: 'Azhar, the Empress\'s Champion', hp: 80, atk: [8, 14], heavy: 22, art: 'throne', fx: 'magic', warn: `Azhar spins his twin blades into a blur. Guard!`,
    desc: `Her champion for ninety years. Nobody has seen him lose.`, hits: [`Twin blades cross your guard.`, `He slips aside and cuts your hip.`, `An elbow to the temple.`], heavyHit: `The whirlwind of steel catches you.` },
  ghast: { name: 'Ghast, the Three-Eyed Steward', hp: 70, atk: [8, 14], heavy: 22, lethal: true, art: 'throne', fx: 'magic', warn: `All three of Ghast's eyes fix on you. Guard!`,
    desc: `The palace steward who misses nothing, with a carving knife in each hand.`, hits: [`A carving knife slides along your ribs.`, `He hisses and his breath burns.`, `Long fingers find your throat.`], heavyHit: `Ghast's third eye flares and your mind goes white with pain.` },
  morvanna: { name: 'Morvanna, the Undying', hp: 150, atk: [10, 18], heavy: 28, undying: true, lethal: true, art: 'empress', fx: 'magic',
    warn: `Morvanna draws the dark into her open hand. Something terrible is coming. Guard!`,
    desc: `Three hundred years of war in a woman's shape. Her sword is black glass.`,
    hits: [`Her glass sword opens a line of fire across your arm.`, `She moves like smoke and strikes your back.`, `A word from her lips and your bones ache.`, `She catches your blade bare-handed and twists.`],
    heavyHit: `The dark in her hand becomes a spear and goes through you.` }
};

/* ---------------- SCENES ---------------- */
const S = {};

S.p1 = { ch: 'Prologue', age: 0, art: 'fire', fx: 'embers', title: 'Valerith Burns',
  text: `Year 312 of the Ashen Reign.

Of the Thirty Crowns of Eldmark, nine already kneel to Dravenmoor, the Demonic Kingdom. Twelve more pay it tribute. Valerith is one of the last that refuse, and tonight Valerith burns for it.

Queen Seraphine gives birth in the chapel crypt while the Hollow Legion breaks the gates above. King Aldric holds the crypt stair with forty men. Forty become twelve. Twelve become one.

Then she comes down the stair.`,
  choices: [{ t: `Keep watching`, go: 'p2' }] };

S.p2 = { ch: 'Prologue', age: 0, art: 'empress', fx: 'ash', title: 'The Undying Empress',
  text: `Empress Morvanna of Dravenmoor walks through the fire as if it were warm rain. Her crown is a ring of black iron horns. She has ruled for three hundred years and she does not hurry.

"Where is the child?" she asks.

Your mother answers by driving a silver hairpin into the Empress's throat. Morvanna draws it out, studies it with something close to sadness, and kills her with a single word.

Your father's last act is to throw his crown into the brazier, so that it will never hang in her hall.`,
  choices: [{ t: `Look to the dark corner of the crypt`, go: 'p3' }] };

S.p3 = { ch: 'Prologue', age: 0, art: 'forest', fx: 'rain', title: 'The Captain',
  text: `Nobody notices the Legion captain standing in the dark corner of the crypt. He looks at the newborn in the straw for a long time.

Then he wraps you in his black cloak, pinches out the lantern, and walks out through the sewers into the storm.

He carries you nine days through the Mirewood. On the tenth he reaches Thornwick, a village of charcoal-burners so deep in the trees that no banner has flown there in a hundred years. He names you {name}. He names himself Bren.

"You were born in fire," he tells you. "One day you'll decide what that means."`,
  choices: [{ t: `Seven winters pass`, go: 'c1_1' }] };

/* ---- CHAPTER I ---- */
S.c1_1 = { ch: 'I', age: 7, art: 'village', fx: 'motes', title: 'Thornwick',
  text: `Thornwick smells of pine smoke and wet earth. Bren cuts wood, never talks about before, and sleeps with an axe beside the bed.

You are seven. You don't know you're the {heir} of a dead kingdom. You know the woods are big, the winters are hungry, and there are four good ways to spend a long summer day.`,
  choices: [
    { t: `Follow Bren into the woods with a stick for a sword`, e: { might: 2, rel: { bren: 15 } },
      out: `Bren pretends he isn't teaching you. He just happens to show you how to stand, how to fall, and how to keep your thumb outside your fist. By autumn you can split kindling like a grown man.` },
    { t: `Sit at the hut of Old Ysolde, the herb-witch who reads the stars`, e: { lore: 2, rel: { ysolde: 20 } },
      out: `Ysolde smells of smoke and rosemary. She teaches you letters with charcoal on slate, then the names of the stars, then the names of things that are not stars. "Don't tell Bren," she says. You don't.` },
    { t: `Run wild with Sella, the tanner's orphan who can steal an egg from under a sleeping hen`, e: { cunning: 2, rel: { sella: 20 } },
      out: `Sella is a year older, all elbows and grin. She teaches you to move without a sound, to lie without blinking, and that a locked door is only a polite suggestion.` },
    { t: `Hang around the Crooked Antler inn, charming travelers out of coins and stories`, e: { charm: 2, gold: 8 },
      out: `Merchants, pilgrims, deserters. You learn that people will tell you anything if you laugh in the right places. You also learn the names of the Thirty Crowns, and which of them are already dead.` }
  ], go: 'c1_2' };
S.c1_1.choices.forEach(c => c.go = 'c1_2');

S.c1_2 = { ch: 'I', age: 8, art: 'wolf', fx: 'snow', title: 'The Wolf Winter',
  text: `The winter you turn eight, the wolves come down from the hills.

You're on the frozen millpond when you hear Sella scream. She chased a fox onto the ice and now she's stuck where it starts to crack. Three wolves are coming out of the treeline, thin as hunger, their eyes catching the low sun.

The village is a long shout away.`,
  choices: [
    { t: `Grab a burning branch from the charcoal pit and charge the wolves`, fight: 'wolf',
      win: { might: 1, rel: { sella: 25, bren: 10 }, flag: 'wolfslayer' },
      out: `The last wolf runs bleeding into the trees. Sella stares at you like she's never seen you before. The whole village has heard about it by supper. Bren says nothing, but that night he gives you a real knife.`,
      lose: { rel: { sella: 10 }, flag: 'wolf_scar' },
      failOut: `The wolf's teeth close on your shoulder. Then Bren is there, and the wolf isn't. He carries you home without a word. You'll have that scar for the rest of your life.`, go: 'c1_3' },
    { t: `Crawl flat across the ice and drag Sella back`, check: { stat: 'cunning', dc: 3 },
      win: { cunning: 1, rel: { sella: 20 } },
      out: `You spread your weight the way Sella once taught you, inch by inch. She grabs your wrist. You slide her back across the groaning ice and you both run, the wolves snapping at empty air behind you.`,
      lose: { hp: -25, rel: { sella: 10 } },
      failOut: `The ice breaks under your knee. Black water closes over your head, so cold it feels like burning. Bren's hand finds your collar and hauls you both out. You lie in a fever for nine days.`, go: 'c1_3' },
    { t: `Scream for the village as loud as you can`, e: { charm: 1, rel: { sella: -5 }, flag: 'sella_scar' },
      out: `The men come running with spears and the wolves scatter, but not before one catches Sella's arm. She'll carry the scar forever. She never says it's your fault. She never says it isn't.`, go: 'c1_3' },
    { t: `Run home. You're eight.`, e: { rel: { sella: -30, bren: -10 }, flag: 'coward' },
      out: `You run. You tell yourself you're getting help. By the time Bren reaches the pond, Sella has fought them off with a broken oar and lost two fingers doing it. She doesn't speak to you until spring.`, go: 'c1_3' }
  ] };

S.c1_3 = { ch: 'I', age: 9, art: 'forest', fx: 'motes', title: 'The Boy in the River',
  text: `Spring floods. You find a boy tangled in the roots at the riverbend, half drowned. Black hair, skin pale as candle wax, clothes finer than anything in Thornwick, torn to rags. On his finger is a silver ring shaped like a pair of curling horns.

He opens his eyes. They're grey, with a thin ring of red at the edge.

"Don't tell them," he whispers. "Please. I ran away from a cruel house."`,
  choices: [
    { t: `Carry him home to Bren`, e: { rel: { kael: 15 }, flag: 'kael_met' },
      out: `Bren takes one look at the ring and goes very still. Then he puts the kettle on and says the boy can stay until he's well. The boy says his name is Kael.` },
    { t: `Hide him in Ysolde's hut, where nobody asks questions`, e: { lore: 1, rel: { kael: 20, ysolde: 5 }, flag: 'kael_met' },
      out: `Ysolde studies his eyes by candlelight and mutters something about old blood. She lets him stay. The boy says his name is Kael, and within a week he grinds herbs faster than you do.` },
    { t: `Slip the silver ring off his finger while he's unconscious`, e: { cunning: 1, rel: { kael: -15 }, item: 'Horned Signet', flag: 'kael_met' },
      out: `It comes off easily and you hide it in your boot. The boy wakes, touches his bare finger, and looks at you for a long time without saying anything. He says his name is Kael. Years later you'll learn that ring is the signet of the royal house of Dravenmoor.` },
    { t: `Leave him. Rich boys from cruel houses bring trouble.`, e: { flag: 'kael_left' },
      out: `You walk away. When you come back at dusk, the riverbend is empty except for a line of small footprints, and beside them the prints of very large dogs.` }
  ] };
S.c1_3.choices.forEach(c => c.go = s => f(s, 'kael_left') ? 'EVENT>c1_5' : 'c1_4');

S.c1_4 = { ch: 'I', age: 10, art: 'night', fx: 'magic', title: 'Shadows That Move',
  text: `Kael stays through the summer. He's clever, prickly, useless at chores, and the only person who can beat you at anything.

One night by the fire you see it. Kael lifts his hand, and his shadow keeps moving after his hand has stopped. It stretches across the floor and pinches out a candle.

He sees you watching. "You weren't supposed to see that."`,
  choices: [
    { t: `Ask him to teach you`, e: { lore: 1, corruption: 8, rel: { kael: 20 }, flag: 'shadowtouched' },
      out: `It isn't easy, and it's cold, like reaching into a well. But by summer's end you can make a candle flame lean toward you. Kael grins for the first time. "Now we both have a secret."` },
    { t: `Keep his secret and never mention it`, e: { cunning: 1, rel: { kael: 15 } },
      out: `You say nothing. Kael watches you for days, waiting for you to tell someone. You don't. Something in the way he looks at you changes after that.` },
    { t: `Tell Bren everything`, e: { rel: { bren: 10, kael: -20 } },
      out: `Bren listens and goes grey. He doesn't sleep that night. In the morning he sits by the door with his axe across his knees and doesn't let Kael out of his sight.` }
  ] };
S.c1_4.choices.forEach(c => c.go = 'c1_4b');

S.c1_4b = { ch: 'I', age: 10, art: 'forest', fx: 'ash', title: 'Riders in Black',
  text: s => s.rel.kael >= 20
    ? `At the first frost, riders in black armor come through the trees with hounds whose eyes burn like coals. They are looking for a boy.

Kael finds you in the woodshed. "They'll burn the village looking for me. I'm going with them." He presses a black feather into your hand. It's warm, like something alive. "If you ever need me, burn it. I'll know."

Then he walks out to meet the riders. Their leader gets down from his horse and kneels to him.`
    : `At the first frost, riders in black armor come through the trees with hounds whose eyes burn like coals.

Kael walks out to meet them before they reach the houses. He doesn't look back at you. The leader of the riders gets down from his horse and kneels to him, which makes no sense at all.`,
  choices: [{ t: `Watch him go`, e: s => s.rel.kael >= 20 ? { item: 'Black Feather' } : null, go: 'EVENT>c1_5' }] };

S.c1_5 = { ch: 'I', age: 12, art: 'night', fx: 'motes', title: 'What the Stars Said', enter: { flag: 'prophecy' },
  text: `You are twelve when Ysolde takes your face in her knotted hands and stares into your eyes for a full minute.

"Born in fire," she says. "Under the Crown, on the night a kingdom died. I've waited a long time for you, little ember."

Then she tells you a riddle she says is older than Dravenmoor:

*Three roads lead to the death of an Undying: iron that fell from the sky, the heart she hid, and the oaths that hold her up. And one road leads to her throne.*

You don't understand it yet, but you remember it. And this is the year you decide what you'll be good at.`,
  choices: [
    { t: `Bren's way: the axe, the sword and the shield wall`, e: { might: 2, maxhp: 10, rel: { bren: 10 } },
      out: `Bren stops pretending. Every dawn, an hour of drills until your hands bleed and then harden. "Again," he says. "Again." Once, when you finally disarm him, he smiles like a man remembering something painful.` },
    { t: `Ysolde's way: books, stars and herbs`, e: { lore: 2, rel: { ysolde: 10 }, item: 'Healing Draught' },
      out: `You learn which mushrooms heal and which kill, how to read the old script, and how to find north by stars that the priests say don't exist. Ysolde gives you a stoppered bottle. "For the day you'll need it. You'll know."` },
    { t: `Sella's way: the merchant road, where purses are heavy`, e: { cunning: 2, gold: 25, rel: { sella: 10 } },
      out: `You and Sella work the road between villages. A cut purse here, a rigged game there, a fat merchant who never notices his ring is gone. You learn to read people before they open their mouths.` },
    { t: `Your own way: songs and stories at the inn`, e: { charm: 2, influence: 3 },
      out: `By twelve you can hold the whole Crooked Antler silent with a story and get it laughing with the next. Travelers carry your songs to other villages. Some of them are about a lost {heir}. You find that funny.` }
  ] };
S.c1_5.choices.forEach(c => c.go = 'c2_1');

/* ---- CHAPTER II ---- */
S.c2_1 = { ch: 'II', age: 14, art: 'fire', fx: 'embers', title: 'They Came at Night',
  text: `You are fourteen when somebody sells a rumor for thirty silver: a child of Valerith is alive in the Mirewood.

The Hollow Legion arrives at midnight. First come the hounds of the Abyss, ribs like iron cages, eyes like coals. Then the soldiers with torches. The first roof catches. Then the second.

Bren kicks open your door, axe in hand, and for the first time in your life you see real fear on his face.

"Take Sella and go north to the old mill. Don't come back. Whatever you hear, {name}, don't come back."`,
  choices: [
    { t: `Stay. Fight beside Bren.`, fight: 'hound',
      win: { might: 1, influence: 2, rel: { bren: 20 }, flag: ['bren_alive', 'fought_burning'] },
      out: `The hound goes down with your knife in its eye. Bren cuts down the two soldiers behind it, then a third, and you finally see what he must have been once. He takes a spear through the side for you. He lives. Barely.`,
      lose: { flag: 'bren_dead' },
      failOut: `The hound pins you. Its breath smells like a forge. Then Bren is on it with the axe, and on the soldiers behind it, and on the ones behind them, until there are too many. "In the crypt," he gasps as you drag him into the dark. "I was there. Forgive me." He dies before you can ask what he means.`, go: 'c2_3' },
    { t: `Obey him. Find Sella and run.`, check: { stat: 'cunning', dc: 4 },
      win: { rel: { sella: 15 }, flag: 'bren_dead' },
      out: `You and Sella slip between burning houses, past the hounds, through the gap in the palisade. At the ridge you look back once. Bren stands alone in the burning square, surrounded, still fighting. You never see him again.`,
      lose: { hp: -30, rel: { sella: 5 }, flag: ['bren_dead', 'sella_wounded'] },
      failOut: `A hound catches your scent. You get away, but Sella takes a soldier's arrow in the leg and you carry her the last mile. When you reach the mill, the glow over Thornwick has gone dark. Bren doesn't come.`, go: 'c2_3' },
    { t: `Run to Ysolde's hut to save her and her books`, check: { stat: 'might', dc: 4 },
      win: { lore: 2, item: "Ysolde's Star Chart", rel: { ysolde: 30 }, flag: ['bren_dead', 'ysolde_alive'] },
      out: `You break down the burning door and drag Ysolde out with an armful of books. She clutches a rolled star chart to her chest. "Not for me," she says, pushing it into your hands. "For you." Behind you, Bren's war cry stops.`,
      lose: { hp: -25, lore: 1, item: "Ysolde's Star Chart", flag: ['bren_dead', 'ysolde_dead'] },
      failOut: `The roof comes down before you reach her. Ysolde shoves a rolled chart out through the window. "Go!" Then the fire takes the hut and her with it. Behind you, Bren's war cry stops.`, go: 'c2_3' },
    { t: `Walk out to the Legion captain and surrender, if they'll spare the village`, check: { stat: 'charm', dc: 5 },
      win: { corruption: 3, rel: { bren: -10, sella: 20 }, flag: ['captured', 'bren_alive', 'village_spared'] },
      out: `The captain is a tired woman with burn scars on her hands. She looks at you, then at the burning roofs, and something in her softens. "Put out the fires," she orders. You're chained in a cage wagon headed south. Through the slats you see Bren held back by six villagers, screaming your name.`,
      lose: { hp: -15, flag: ['captured', 'bren_dead'] },
      failOut: `The captain laughs, chains you, and burns the village anyway. Through the slats of the cage wagon you see Bren charge a line of spears alone. The wagon rolls south, toward Dravenmoor.`,
      go: 'c2_cap' }
  ] };

S.c2_cap = { ch: 'II', age: 14, art: 'dungeon', fx: 'ash', title: 'The Road South', enter: { path: 'court' },
  text: `Eleven days in a cage wagon. Rain, then dust, then a black road paved with something that isn't stone.

On the twelfth morning you see Nyxhallow, the capital of Dravenmoor, and despite everything your breath catches. Black marble towers. Silver canals. Gardens of flowers that bloom only in the dark.

The slavers sell you to the Obsidian Palace for nine silver. The Empress's kitchens always need more hands.`,
  choices: [{ t: `Walk through the gate`, go: 'c3c_1' }] };

S.c2_3 = { ch: 'II', age: 14, art: 'forest', fx: 'rain', title: 'The Crossroads',
  text: s => {
    const who = [];
    if (f(s, 'bren_alive')) who.push(`Bren, grey-faced and bleeding through his bandages`);
    who.push(f(s, 'sella_wounded') ? `Sella, limping on an arrow wound` : `Sella, silent, her face streaked with soot`);
    if (f(s, 'ysolde_alive')) who.push(`old Ysolde and an armful of singed books`);
    return `By dawn Thornwick is ash, the way Valerith was ash fourteen years ago. You don't know about Valerith yet.

You have nothing left except ${who.join(', ')}, and a crossroads where the Mirewood ends.

Four roads lead away from here. Each one is a different life.`;
  },
  choices: [
    { t: `West to Hale. Lord Corvin's Free Company takes anyone who can hold a spear.`, hint: `Soldier's road · Might, Charm`, e: { path: 'sword' }, go: 'c3s_1' },
    { t: `East to Ossory. The Whisper Guild buys orphans and turns them into knives.`, hint: `Assassin's road · Cunning`, e: { path: 'shadow' }, go: 'c3k_1' },
    { t: `North to the Dawn Monastery, where monks keep forbidden lore about the Undying.`, hint: `Scholar's road · Lore`, e: { path: 'lore' }, go: 'c3l_1' },
    { t: `South to Dravenmoor itself. To learn your enemy, live in her house.`, hint: `Serpent's road · Charm, Cunning, Corruption`, e: { path: 'court', corruption: 3 }, go: 'c3c_1' },
    { t: `Take Sella to the coast and forget all of this`, hint: `Leave the story behind`, if: s => s.rel.sella >= 30, go: 'end_quiet' }
  ] };

/* ---- CHAPTER III: SWORD ---- */
S.c3s_1 = { ch: 'III', age: 15, art: 'battle', fx: 'embers', title: 'The Free Company',
  text: `The Free Company of Hale camps in a mud field outside Marrowind: six hundred sellswords, deserters, farm boys and widows with spears. Their captain is Lord Corvin Hale himself, the young king of Marrowind and one of the last free crowns. He's handsome, ambitious, and pays on time, which in this war makes him nearly a saint.

Sergeant Mag Harrow tosses you a wooden sword. "Every recruit fights Oswin. Nobody beats Oswin. Show me how you lose."`,
  choices: [
    { t: `Fight Big Oswin`, fight: 'oswin', win: { might: 1, influence: 5, rel: { corvin: 10 }, flag: 'beat_oswin' },
      out: `Nobody beats Oswin. You beat Oswin. The camp goes silent, then roars. Up on the hill a young man in a blue cloak stops talking mid-sentence to look at you. That's Lord Corvin.`,
      lose: { might: 1 }, failOut: `Oswin flattens you three times. You get up four. Mag Harrow nods. "That'll do."` },
    { t: `Trip him into the latrine trench`, check: { stat: 'cunning', dc: 4 }, win: { cunning: 1, influence: 3, rel: { corvin: 5 } },
      out: `Oswin goes into the trench headfirst. Half the camp loves you and half wants you dead. Mag Harrow laughs until she cries.`,
      lose: { hp: -20 }, failOut: `Oswin sees it coming and breaks two of your ribs for trying.` },
    { t: `Buy Oswin a drink and make him your friend`, check: { stat: 'charm', dc: 4 }, win: { charm: 1, army: 20, flag: 'oswin_friend' },
      out: `By midnight Oswin is calling you his little {heir} and threatening anyone who looks at you wrong. Twenty of his mates come with him.`,
      lose: { gold: -5 }, failOut: `Oswin drinks your ale, then beats you anyway, but gently.` }
  ] };
S.c3s_1.choices.forEach(c => c.go = 'c3s_2');

S.c3s_2 = { ch: 'III', age: 16, art: 'battle', fx: 'embers', title: 'The Siege of Greyford',
  text: `Your first real battle. The town of Greyford stands between the Legion and Marrowind, and the Free Company has to hold it for three days.

On the second night the Legion brings up a siege beast, a stitched-together thing of bone and iron, and the east wall comes down.`,
  choices: [
    { t: `Hold the breach with a spear`, check: { stat: 'might', dc: 5 }, win: { might: 1, influence: 8, rel: { corvin: 10 }, flag: 'greyford_hero' },
      out: `You hold. Somehow you hold until dawn, standing on a pile of the dead. By noon the Company is calling you the Ember of Greyford.`,
      lose: { hp: -35, might: 1 }, failOut: `A Legion axe opens your arm to the bone. Men die in the breach because you fell. You live, and you remember every one of their faces.` },
    { t: `Lead a raid to burn their supply wagons`, check: { stat: 'cunning', dc: 5 }, win: { cunning: 1, influence: 6, gold: 40 },
      out: `You go out through a drain with six volunteers and a jar of lamp oil. Without food, the Legion withdraws on the fourth morning. Corvin pays you double.`,
      lose: { hp: -25 }, failOut: `The wagons are guarded. Four of your six come back. You're one of them, barely.` },
    { t: `Rally the town's broken militia`, check: { stat: 'charm', dc: 5 }, win: { charm: 1, army: 150, influence: 5 },
      out: `You stand on a cart and shout until your voice cracks. Bakers, tanners, old men with boar spears: they fill the breach behind you. A hundred and fifty of them swear they'll follow you anywhere after that night.`,
      lose: { influence: -3 }, failOut: `They don't listen. They run, and the Company holds the wall without them.` },
    { t: `Loot the dead Legion commander's tent while everyone's busy`, e: { gold: 90, corruption: 5, influence: -3, flag: 'heart_rumor' },
      out: `Gold, a jeweled dagger, and a letter sealed with black wax and a horned crest. You keep all of it. The letter mentions "the Reliquary beneath the Throne, where Her Majesty's heart is kept safe."` }
  ] };
S.c3s_2.choices.forEach(c => c.go = 'EVENT>c3s_3');

S.c3s_3 = { ch: 'III', age: 17, art: 'council', fx: 'motes', title: 'The Lord of Marrowind', enter: { meet: 'corvin' },
  text: `Lord Corvin invites you to his table. Wine from the south, and a map of the Thirty Crowns with half of it painted black.

"Nine crowns kneel to Morvanna, twelve pay her tribute, and the rest of us are waiting our turn," he says. "I mean to unite the free crowns before it's too late. I need people who win. Kneel, and I'll knight you."

His smile is warm. His eyes are calculating. Both are honest.`,
  choices: [
    { t: `Kneel and swear your sword to Hale`, e: { rel: { corvin: 25 }, influence: 10, flag: 'knighted' },
      out: `His blade touches each shoulder. "Rise, Ser {name}." The Company cheers, and for the first time since Thornwick you feel like you belong somewhere.` },
    { t: `Refuse politely. Your sword is your own.`, e: { rel: { corvin: 5 }, influence: 4, charm: 1 },
      out: `Corvin laughs. "Good. People who kneel too easily get up too easily as well." He refills your cup.` },
    { t: `Ask for his help instead. You have your own score to settle with Dravenmoor.`, e: { rel: { corvin: 10 }, influence: 6 },
      out: `"Everyone in this camp has a score to settle with Dravenmoor," Corvin says. "Win me some battles and we'll talk about yours."` }
  ] };
S.c3s_3.choices.forEach(c => c.go = 'c3s_4');

S.c3s_4 = { ch: 'III', age: 18, art: 'battle', fx: 'rain', title: 'The Flayed Knight',
  text: `Ambush at Coldwater Ford. Sir Vorga the Flayed, a demon knight who wears his own skin as a cloak, cuts through Corvin's guards and knocks Corvin onto his back in the river.

You're the closest. Maybe the only one close enough.`,
  choices: [
    { t: `Fight Sir Vorga`, fight: 'vorga', win: { might: 1, influence: 12, army: 200, rel: { corvin: 25 }, item: 'Star-Iron Shard', flag: 'slew_vorga' },
      out: `Vorga falls. In the ruin of his armor you find a sliver of metal that hums against your skin, blue-black and cold as a winter night. A soldier makes a holy sign. "Star-iron. Saint Iven's metal." Two hundred men who watched the fight swear to follow you.`,
      lose: { rel: { corvin: 10 } },
      failOut: `Vorga's blade finds your side. As the dark takes you, you see Corvin rise out of the river and finish what you started. You wake in his tent and he's sitting beside you. "You bought me the second I needed. I won't forget it."` },
    { t: `Drag Corvin out of the river and run`, check: { stat: 'might', dc: 5 }, win: { rel: { corvin: 15 }, influence: 4 },
      out: `You get him out, both of you half drowned, and the Company closes ranks behind you. Corvin coughs up river water and laughs. "That's twice I owe you, and I hate owing people."`,
      lose: { hp: -30, rel: { corvin: 10 } }, failOut: `Vorga's sword catches your back as you run. You get Corvin out anyway.` }
  ] };
S.c3s_4.choices.forEach(c => c.go = 'EVENT>c4_1');

/* ---- CHAPTER III: SHADOW ---- */
S.c3k_1 = { ch: 'III', age: 15, art: 'city', fx: 'fog', title: 'The Whisper Guild',
  text: s => `Ossory is a city of canals, fog and debts. The Whisper Guild runs it from a theater that never stages a play.

The Guildmistress is an old woman called the Widow Ashe, with pearl earrings and a voice like a purring cat. "Orphans are cheap," she says. "Useful orphans are rare. Bring me the magistrate's seal ring before dawn. Use any method you like."
${f(s, 'captured') ? '' : `
Sella grins beside you. She's already in.`}`,
  choices: [
    { t: `Climb in through the bell tower and take it from his bedside`, check: { stat: 'cunning', dc: 5 }, win: { cunning: 1, rel: { sella: 5 } },
      out: `In through the bell tower, down a chimney, past a snoring guard. The ring is on the nightstand beside the magistrate's false teeth. The Widow turns it over in her fingers and smiles.`,
      lose: { hp: -20 }, failOut: `A guard dog finds you. You get the ring, and then you get the whip, because the Widow says failing slowly is still failing.` },
    { t: `Bribe his manservant`, req: s => s.gold >= 20, rq: `Needs 20 gold`, e: { gold: -20, charm: 1 },
      out: `Twenty silver buys the ring and a list of everyone the magistrate owes money to. The Widow is more interested in the list.` },
    { t: `Charm your way into his party as a musician's apprentice`, check: { stat: 'charm', dc: 5 }, win: { charm: 1, influence: 3 },
      out: `You play the lute badly and laugh well. By midnight the magistrate is showing you his ring himself. He doesn't notice it's gone until noon.`,
      lose: { hp: -15 }, failOut: `The real musician arrives. You leave through a window, with the ring, and a bruise the size of a plum.` },
    { t: `Bring the Widow a better prize: the magistrate's secrets`, check: { stat: 'lore', dc: 5 }, win: { lore: 1, influence: 5, flag: 'widow_impressed' },
      out: `You don't steal the ring. You read his letters, decode his accounts, and bring the Widow proof that he's been skimming from Dravenmoor's tribute. She keeps the proof and gives you her own ring.`,
      lose: { hp: -10 }, failOut: `The letters are in a cipher you can't crack. You bring the ring anyway, late, and the Widow docks your supper.` }
  ] };
S.c3k_1.choices.forEach(c => c.go = 'c3k_2');

S.c3k_2 = { ch: 'III', age: 16, art: 'poison', fx: 'magic', title: 'Seven Poisons',
  text: `Master Quill teaches poison in a cellar that smells of almonds and wet stone. He has no nose. "Lesson one," he says. "Everyone eats."

The guild trains everyone in everything, but in the end each knife chooses its own craft.`,
  choices: [
    { t: `Poisons. Quill whispers about the Dawn Lily, the only poison that works on the Undying.`, e: { lore: 2, flag: 'poison_lore' },
      out: `"Harmless to you or me," Quill says, tapping a drawing of a white flower. "Death to anything that made a pact with the Abyss. It blooms one hour a year on Saint Iven's Peak. Nobody's brought one down in forty years."` },
    { t: `Blades. The Gaunt brothers teach you to kill between two heartbeats.`, e: { might: 1, cunning: 1, maxhp: 10 },
      out: `Months of bruises and shallow cuts. Then one day you move and the elder Gaunt brother finds your knife resting against his throat. He nods once. It's the only compliment he gives anyone.` },
    { t: `Faces. Learn to become anyone: a maid, a priest, a lord's cousin.`, e: { charm: 1, cunning: 1, flag: 'disguise' },
      out: `Walnut stain, a borrowed accent, a limp you never forget to keep. By the end of the year, your own guildmates walk past you in the street.` }
  ] };
S.c3k_2.choices.forEach(c => c.go = 'EVENT>c3k_3');

S.c3k_3 = { ch: 'III', age: 17, art: 'city', fx: 'rain', title: 'The First Contract',
  text: `Your first contract: Lord Varrick Tull, a tax-lord who sells children to Dravenmoor by the cartload. The Widow's terms are simple. He dies tonight, and nobody sees you.

You find him in his counting house. In the cellar below, behind a locked grate, there are eleven children.`,
  choices: [
    { t: `Kill him quietly and leave`, check: { stat: 'cunning', dc: 5 }, win: { cunning: 1, gold: 80, corruption: 5, flag: 'first_kill' },
      out: `It's quick. He doesn't wake. It's very easy, and that's the part you think about afterward. On your way out you hear the children breathing in the dark.`,
      lose: { hp: -25, gold: 40, corruption: 5, flag: 'first_kill' }, failOut: `He wakes and fights. It's ugly and loud, and you leave bleeding, with half your pay.` },
    { t: `Kill him, then free the children`, check: { stat: 'might', dc: 4 }, win: { charm: 1, influence: 8, corruption: 2, rel: { sella: 15 }, flag: ['freed_children', 'first_kill'] },
      out: `The guild is furious about the noise. Within a week, Ossory is singing songs about the Ember who freed the Tull children.`,
      lose: { hp: -30, influence: 5, flag: ['freed_children', 'first_kill'] }, failOut: `Tull's guards hear the grate. You get the children out, and you carry a guard's arrow in your back for a month.` },
    { t: `Spare him and blackmail him for the rest of his life`, e: { gold: 50, influence: 10, cunning: 1, flag: 'tull_puppet' },
      out: `Tull will now tell you everything he hears from Dravenmoor's buyers, including where the Empress's tribute gold is kept, and the children go home. The Widow calls it "unusually profitable mercy."` },
    { t: `Refuse the contract`, e: { influence: -5, rel: { sella: -5 } },
      out: `The Widow docks your pay and sends someone else. Tull dies anyway. The children are sold anyway.` }
  ] };
S.c3k_3.choices.forEach(c => c.go = 'c3k_4');

S.c3k_4 = { ch: 'III', age: 18, art: 'city', fx: 'fog', title: 'The Grey Moth',
  text: `Dravenmoor's spymaster has noticed you. One night in the fog, a figure in moth-grey silk drops from a rooftop with two curved knives drawn.

The Grey Moth: the best killer in the south, and he's here for you.`,
  choices: [
    { t: `Fight the Grey Moth`, fight: 'moth', win: { cunning: 1, item: "Moth's Ledger", flag: 'ledger' },
      out: `Inside his coat you find a ledger written in cipher: the names of Morvanna's agents in nine cities, and a sketch of the servants' passages in the Obsidian Palace.`,
      lose: s => s.rel.sella >= 30 ? { item: "Moth's Ledger", flag: 'ledger', rel: { sella: 10 } } : { maxhp: -10 },
      failOut: s => s.rel.sella >= 30 ? `His knife is at your throat when Sella's blade takes him in the back. She pulls a ciphered ledger out of his coat. "You owe me," she says, shaking.` : `He leaves you bleeding in the gutter, sure you're dead. You aren't, quite. The wound never fully heals.` },
    { t: `Run across the rooftops and lose him in the fog`, check: { stat: 'cunning', dc: 6 }, win: { cunning: 1, flag: 'escaped_moth' },
      out: `You know these roofs. He doesn't. You leave him on a chimney stack with nowhere to jump, and when the fog lifts he's gone.`,
      lose: { hp: -35 }, failOut: `He's faster. He leaves you a message cut into your arm: SHE KNOWS.` }
  ] };
S.c3k_4.choices.forEach(c => c.go = 'EVENT>c4_1');

/* ---- CHAPTER III: LORE ---- */
S.c3l_1 = { ch: 'III', age: 15, art: 'temple', fx: 'snow', title: "Saint Iven's Peak",
  text: `The Dawn Monastery clings to the mountain like a swallow's nest. The monks are mostly old, the library is enormous, and the Abbot, Brother Hesper, takes you in without a single question, which makes you suspicious.

"There are three hundred years of lies written about the Empress," he says. "Somewhere in this library is one truth."`,
  choices: [
    { t: `Study the chronicles of the Undying`, e: { lore: 2, flag: 'knows_three_ways' },
      out: `You find Ysolde's riddle in a monk's handwriting from two hundred years ago, with notes in the margin: star-iron, the Heart, the Oaths. Someone underlined "the Oaths" three times.` },
    { t: `Climb the forbidden tower at night`, check: { stat: 'cunning', dc: 5 }, win: { lore: 1, cunning: 1, flag: 'heart_rumor' },
      out: `The tower holds a map of the Obsidian Palace, drawn by a monk who was once a prisoner there. Under the throne room is a small chamber marked: Reliquary. Her heart?`,
      lose: { hp: -20 }, failOut: `The stair gives way. You lie on the cold stones until the morning bell, and Brother Hesper finds you and says nothing at all.` },
    { t: `Work in the infirmary with the healers`, e: { charm: 1, maxhp: 15, item: 'Healing Draught' },
      out: `Pilgrims, frostbitten shepherds, a Legion deserter with no hands. You learn how bodies break and how to mend them. The healers send you off each night with something for your own bruises.` }
  ] };
S.c3l_1.choices.forEach(c => c.go = 'c3l_2');

S.c3l_2 = { ch: 'III', age: 16, art: 'dungeon', fx: 'motes', title: 'The Catacombs',
  text: `They say that when Saint Iven's star-iron sword shattered against Morvanna two hundred years ago, the monks carried one shard home and buried it with him. Brother Hesper won't talk about it. The catacombs are sealed.

Tonight you find the seal broken, from the inside.`,
  choices: [
    { t: `Go down with a torch and a sword`, fight: 'warden', win: { might: 1, item: 'Star-Iron Shard' },
      out: `Behind the Bone Warden lies the Saint's tomb, and in his skeletal hand is a sliver of blue-black metal that hums like a held breath.`,
      lose: {}, failOut: `You crawl out bleeding. Hesper is waiting at the top of the stair, looking at you with something like fear.` },
    { t: `Solve the riddle carved on the seal`, check: { stat: 'lore', dc: 5 }, win: { lore: 1, item: 'Star-Iron Shard' },
      out: `"What comes every day and is never caught?" The answer is dawn. The bones in the dark fold quietly away, and the Saint lets you take the shard from his hand.`,
      lose: { hp: -20 }, failOut: `Wrong answer. The bones come for you and you run, and the seal slams shut behind you.` },
    { t: `Leave the dead alone`, e: { charm: 1 }, out: `Some doors should stay closed. Probably.` }
  ] };
S.c3l_2.choices.forEach(c => c.go = 'EVENT>c3l_3');

S.c3l_3 = { ch: 'III', age: 17, art: 'temple', fx: 'snow', title: 'The Dawn Lily', enter: { flag: 'poison_lore' },
  text: `Once a year, at the first dawn after the spring equinox, a white flower opens on the very summit of Saint Iven's Peak. It stays open for one hour.

Its nectar is harmless to the living. To the Undying, the books say, it is death.

This is the morning.`,
  choices: [
    { t: `Climb the north face in the dark`, check: { stat: 'might', dc: 5 }, win: { might: 1, item: 'Dawn Lily' },
      out: `Ice, wind and a two-hundred-foot drop. You reach the summit as the sun comes up, and the flower opens in front of you like an eye. You seal it in wax with shaking hands.`,
      lose: { hp: -30 }, failOut: `You slip on the ice and slide forty feet before a ledge catches you. By the time you reach the summit, the flower has closed.` },
    { t: `Use Ysolde's star chart to find the old goat path`, req: s => has(s, "Ysolde's Star Chart"), rq: `Needs Ysolde's Star Chart`, e: { lore: 1, item: 'Dawn Lily' },
      out: `The chart marks a path by the stars that rise over the peak in spring. It's steep but safe. You arrive with time to spare and watch the lily open.` },
    { t: `Pay the hermit who guards the summit`, req: s => s.gold >= 40, rq: `Needs 40 gold`, e: { gold: -40, item: 'Dawn Lily' },
      out: `The hermit counts the silver twice, then hands you a lily he picked last year and kept in honey. "Still good," he says. You hope so.` },
    { t: `Stay below and pray instead`, e: { charm: 1, corruption: -5 }, out: `You pray for your parents, though you still don't know who they were. It helps more than you expected.` }
  ] };
S.c3l_3.choices.forEach(c => c.go = 'c3l_4');

S.c3l_4 = { ch: 'III', age: 18, art: 'fire', fx: 'embers', title: 'The Inquisitors',
  text: `Someone told Dravenmoor what's in the monastery library. Hollow Inquisitors come up the mountain road at night in red porcelain masks.

Brother Hesper stands in the gate. "It was me," he says quietly. "They have my sister. I'm sorry. Take the books and go."`,
  choices: [
    { t: `Stand in the gate and fight`, fight: 'inquisitor', win: { lore: 1, influence: 6, flag: 'saved_library' },
      out: `The mask cracks and smoke pours out of it, screaming. The rest of the Inquisitors pull back down the mountain. The library is saved, for now. The monks will talk about you for a hundred years.`,
      lose: { lore: 1 }, failOut: `You're thrown down the stair. The monks drag you away through the bell tunnel while the library burns behind you.` },
    { t: `Escape with the most important books through the bell tunnel`, check: { stat: 'cunning', dc: 5 }, win: { lore: 2 },
      out: `You save forty books, including the only complete copy of the Chronicle of the Undying. The rest burns. You read by firelight for a month.`,
      lose: { hp: -25, lore: 1 }, failOut: `The tunnel half collapses. You get out with nine books and a broken hand.` },
    { t: `Forgive Hesper and take him with you`, e: { charm: 1, flag: 'hesper_ally' },
      out: `He weeps all the way down the mountain. Later he tells you everything the Inquisitors asked him, which turns out to be very useful.` }
  ] };
S.c3l_4.choices.forEach(c => c.go = 'EVENT>c4_1');

/* ---- CHAPTER III: COURT ---- */
S.c3c_1 = { ch: 'III', age: 15, art: 'throne', fx: 'ash', title: 'Nyxhallow',
  text: s => `${f(s, 'captured') ? `You arrive in chains.` : `You walk in through the gate with a forged reference and a borrowed name.`} Nyxhallow, capital of Dravenmoor, is beautiful. That's the first horror. Black marble, silver canals, gardens of flowers that bloom in the dark. The people look well fed. They also never look up.

In the kitchens of the Obsidian Palace you scrub pots beside demons and humans alike. The steward is a gaunt demon called Ghast, with three eyes, and he misses nothing.`,
  choices: [
    { t: `Keep your head down and learn every corridor`, e: { cunning: 2, flag: 'knows_palace' },
      out: `Kitchens, cellars, servants' stairs, the laundry chute that drops two floors, the guard rotation on the west gallery. In a year you could walk the palace blindfolded.` },
    { t: `Make Ghast like you`, check: { stat: 'charm', dc: 4 }, win: { charm: 1, influence: 5, flag: 'ghast_friend' },
      out: `Ghast likes riddles and hates fools. You give him the first and are not the second. He starts calling you "the clever one" and giving you the easy shifts.`,
      lose: { hp: -15 }, failOut: `Ghast decides you're a fool. Fools get the night shift at the bone ovens.` },
    { t: `Steal food for the other slaves`, e: { charm: 1, influence: 3, flag: 'slave_friends' },
      out: `Bread, a bit of cheese, the end of a ham. Small things. But the slaves of the Obsidian Palace start to look at you the way the Free Crowns used to look at a banner.` }
  ] };
S.c3c_1.choices.forEach(c => c.go = 'c3c_2');

S.c3c_2 = { ch: 'III', age: 16, art: 'empress', fx: 'magic', title: 'Her Eyes', enter: { meet: 'morvanna' },
  text: `The Empress passes through the kitchens once a year to taste the wine for the Feast of Ash. This year she stops in front of you.

She's taller than you expected and younger-looking, and her eyes are the oldest thing you have ever seen.

"Your eyes," Morvanna says softly. "I've seen them before. Where?"

The whole kitchen has stopped breathing.`,
  choices: [
    { t: `Lie smoothly: you're a charcoal-burner's {child} from nowhere`, check: { stat: 'cunning', dc: 5 }, win: { cunning: 1, rel: { morvanna: 5 } },
      out: `She studies you a moment longer, then loses interest and moves on. The kitchen breathes again.`,
      lose: { rel: { morvanna: 10 }, flag: 'suspected' }, failOut: `"Liar," she says, almost fondly, and walks on. After that, you're watched.` },
    { t: `Kneel and say your eyes are hers to command`, e: { charm: 1, corruption: 3, rel: { morvanna: 15 } },
      out: `"Pretty manners," she says. "Ghast, give this one to the high table." Your knees shake for an hour.` },
    { t: `Hold her gaze and say nothing`, e: { might: 1, rel: { morvanna: 20 }, flag: 'noticed' },
      out: `Nobody has held her gaze in a century. She smiles. "Interesting." The next day Ghast moves you to serving at the high table.` },
    { t: `Spit at her feet`, e: { hp: -40, rel: { morvanna: 25 }, flag: 'noticed' },
      out: `The guards beat you nearly to death. As you lie bleeding on the stones, the Empress laughs, a real, surprised laugh. "Don't kill it. I haven't been spat at in a hundred years."` }
  ] };
S.c3c_2.choices.forEach(c => c.go = 'EVENT>c3c_3');

S.c3c_3 = { ch: 'III', age: 17, art: 'battle', fx: 'ash', title: 'The Pit', enter: s => { if (km(s)) s.flags.kael_revealed = 1; },
  text: s => `In Dravenmoor a slave can buy freedom only one way: in the Pit, in front of the court. You put your name down.

In the royal box sits a young man with black hair and red-rimmed grey eyes: Crown Prince Kaelith, the Empress's son.${km(s) ? `

Your heart stops. It's Kael, the boy from the river. He recognizes you too. His knuckles go white on the rail.` : ''}`,
  choices: [
    { t: `Fight Ruuk the Pit King`, fight: 'ruuk', win: { might: 1, influence: 8, rel: { morvanna: 10 }, flag: 'free' },
      out: `Ruuk falls. The crowd screams your name, the wrong one, the one you gave them. You're free, and the Empress herself names you a squire of the Obsidian Guard.`,
      lose: s => (km(s) && s.rel.kael >= 20) ? { rel: { kael: 15 }, flag: 'free' } : { rel: { morvanna: 5 }, flag: 'free' },
      failOut: s => (km(s) && s.rel.kael >= 20) ? `Ruuk lifts his fist for the killing blow, and Kael stands up. "Enough. I'll buy this one." You're free, as a prince's property, which is almost the same thing.` : `Ruuk lifts his fist for the killing blow, and the Empress raises one finger. "Keep it alive. I like its face." You're made a squire of the Guard on her whim.` },
    { t: `Bribe the pit master to drug Ruuk's water`, req: s => s.gold >= 50, rq: `Needs 50 gold`, e: { gold: -50, cunning: 1, corruption: 5, influence: 4, flag: 'free' },
      out: `Ruuk staggers into the Pit with eyes like soup. You win in three blows. The crowd boos. The Empress, who saw everything, smiles at you anyway.` }
  ] };
S.c3c_3.choices.forEach(c => c.go = 'c3c_4');

S.c3c_4 = { ch: 'III', age: 18, art: 'poison', fx: 'magic', title: 'The Ember Kiss',
  text: s => `Morvanna's favorites are offered a gift: a cup of her own black blood. It makes you stronger, faster, and very hard to kill. It also makes you hers, a little.

Tonight the cup is offered to you.${f(s, 'kael_revealed') ? ` Across the room, Kael gives the smallest shake of his head.` : ''}`,
  choices: [
    { t: `Drink it`, e: { might: 2, maxhp: 20, corruption: 25, rel: { morvanna: 20 }, flag: 'ember_kiss' },
      out: `It tastes like iron and honey and the bottom of a grave. Your body burns for a week. When it stops, you can see in the dark. Sometimes, when you sleep, you hear her voice.` },
    { t: `Pretend to drink and spill it into your sleeve`, check: { stat: 'cunning', dc: 6 }, win: { cunning: 1, rel: { morvanna: 10 } },
      out: `Your sleeve soaks it up. You smile, wipe your mouth, and bow. Nobody notices. Probably.`,
      lose: { hp: -20, corruption: 10, rel: { morvanna: -10 } }, failOut: `A drop runs down your wrist and hisses on the marble. Morvanna watches it and says nothing. The guards hold you down and pour in what's left.` },
    { t: `Refuse openly`, e: { charm: 1, rel: { morvanna: -15 } },
      out: `The room goes cold. Morvanna studies you, then shrugs. "Pride. I remember that." You aren't punished, and that frightens you more than punishment would.` }
  ] };
S.c3c_4.choices.forEach(c => c.go = 'EVENT>c4_1');

/* ---- CHAPTER IV ---- */
S.c4_1 = { ch: 'IV', age: 19, art: 'crown', fx: 'embers', title: 'The Truth', enter: { item: 'Valerith Signet', flag: 'bren_truth' },
  text: s => {
    const conf = `"Your name is {name} of House Valerith. Your father was King Aldric. Your mother was Queen Seraphine. Morvanna killed them both in the chapel crypt the night you were born.

"And I was there. I was Brennoch, captain of the Hollow Legion's Ninth Company. I held the torch while they died. Then I picked you up and walked away. I've spent all these years trying to decide whether that makes up for anything."`;
    return f(s, 'bren_alive')
      ? `Bren finds you in the spring of your nineteenth year. He's grey now and walks with a stick. He sits across from you and for a while he can't speak at all. Then he puts a gold ring on the table between you. Its crest is a burning sun.

${conf}`
      : `A courier finds you in the spring of your nineteenth year: a girl from Thornwick who survived the fire. She carries a packet wrapped in oilcloth, found under the hearthstone of Bren's burned house. Inside are a gold ring with a burning-sun crest, and a letter in Bren's careful, ugly handwriting.

${conf}`;
  },
  choices: [
    { t: `Forgive him`, if: s => f(s, 'bren_alive'), e: { charm: 1, rel: { bren: 30 }, flag: 'bren_companion' },
      out: `He weeps like a child. You've never seen him cry. "I'll follow you to her gate," he says. "Further, if you let me."` },
    { t: `You can't forgive him. Send him away.`, if: s => f(s, 'bren_alive'), e: { might: 1, rel: { bren: -50 } },
      out: `He nods as if he expected nothing else, leaves the ring on the table, and walks out into the rain.` },
    { t: `Make him swear his life to your cause as penance`, if: s => f(s, 'bren_alive'), e: { influence: 5, army: 50, rel: { bren: 10 }, flag: 'bren_companion' },
      out: `He kneels and swears on your father's ring. Fifty old Legion deserters who owe him their lives come with him.` },
    { t: `Weep for him, then burn the letter`, if: s => !f(s, 'bren_alive'), e: { charm: 1 },
      out: `The letter curls up in the fire. You keep the ring. He saved you and he helped kill them, and you decide he can be both.` },
    { t: `Keep the letter. One day you'll show it to her.`, if: s => !f(s, 'bren_alive'), e: { cunning: 1, flag: 'letter' },
      out: `You fold it into your coat, over your heart, where it will stay for the rest of the story.` }
  ] };
S.c4_1.choices.forEach(c => c.go = 'c4_2');

S.c4_2 = { ch: 'IV', age: 19, art: 'empress', fx: 'ash', title: 'The First Queen', enter: { flag: 'knows_three_ways' },
  text: s => `${f(s, 'ysolde_alive') ? `Ysolde tells you the rest, sitting by the fire with her eyes closed.` : s.path === 'lore' ? `The rest you find in the Chronicle of the Undying.` : s.path === 'court' ? `The rest you hear from an old slave in the palace laundry who has worked there for ninety years.` : `The rest you piece together from old books, drunk soldiers and one terrified priest.`}

Three hundred years ago, Morvanna was a human queen, the young ruler of Dravenmoor when it was one of thirty equal crowns. The other kings feared her. At the Council of Swords they murdered her husband and her three children in front of her.

She walked into the Abyss that night and came back with a crown of horns and a promise: the Thirty Crowns would never again kneel to anyone except her.

Everyone who has studied how to kill her agrees on the same old riddle:

• Star-iron, metal that fell from the sky, can cut what the Abyss has made.
• Her heart is not in her chest. It's hidden, and it can be broken.
• Nine Demon Lords swore oaths that hold up her throne. If enough of them renounce her on the same night, she becomes mortal.
• And whoever kills her while her Pact still burns can take it for themselves, and become the next Undying.`,
  choices: [{ t: `Decide how she falls`, go: 'c4_3' }] };

S.c4_3 = { ch: 'IV', age: 19, art: 'crown', fx: 'embers', title: 'Your Design',
  text: `You are nineteen. You have {gold} gold, {influence} influence, {army} soldiers who would follow you, and a name that could raise a kingdom or get you hanged.

The free crowns are running out of time. You have five years.

How will the Empress fall?`,
  choices: [
    { t: `War. Reclaim Valerith, unite the free crowns, and meet her on the battlefield.`, hint: `Best with Might, Charm, Influence, soldiers and a star-iron blade`, e: { design: 'war' } },
    { t: `Shadow. Become the knife she never sees coming.`, hint: `Best with Cunning, palace secrets, star-iron or her heart`, e: { design: 'shadow' } },
    { t: `The Serpent. Kneel to her, become her favorite, then put a blade in her back.`, hint: `Best with Charm, Cunning and her trust. Corruption helps.`, e: { design: 'serpent', corruption: 5 } },
    { t: `The Cup. Poison her at her own feast with the Dawn Lily.`, hint: `Best with Lore, Cunning and a way into her kitchens`, e: { design: 'cup' } },
    { t: `Break the Oaths. Turn her Demon Lords against her and drag her off the throne.`, hint: `Best with Charm, gold, Influence and allies`, e: { design: 'oath' } }
  ] };
S.c4_3.choices.forEach(c => c.go = 'c5_1');

/* ---- CHAPTER V ---- */
S.c5_1 = { ch: 'V', age: 20, art: 'council', fx: 'motes', title: 'The Council of Crowns', enter: { meet: 'corvin' },
  text: s => `Lord Corvin of Marrowind calls a Council of the free crowns, the first in a century. Twenty-one kings and queens come: proud, frightened, and half of them secretly paying Dravenmoor.${s.design === 'war' ? '' : ` Your road leads elsewhere, but allies are allies, and you go.`}

When you stand and name yourself {heir} of Valerith, the hall goes silent. Then old King Osric of Tallowmere laughs.

"Every beggar in the south claims to be a lost {heir}," he says. "Prove it."`,
  choices: [
    { t: `Show your father's signet and tell them about the crypt`, req: s => has(s, 'Valerith Signet'), rq: `Needs the Valerith Signet`, check: { stat: 'charm', dc: 5 },
      win: { influence: 20, army: 400, rel: { corvin: 15 }, flag: 'recognized' },
      out: `You tell it plainly: the stair, the hairpin, the crown in the brazier. When you finish, an old queen from the coast is crying. She knew your mother. One by one, the crowns rise. Four hundred swords are pledged before supper.`,
      lose: { influence: 8, army: 100, flag: 'recognized' }, failOut: `Some of them believe you. Many don't. A hundred swords is better than nothing.` },
    { t: `Challenge Osric to trial by combat`, fight: 'osric', win: { might: 1, influence: 15, army: 300, flag: 'recognized' },
      out: `Osric yields, laughing even with your blade at his throat. "Fine! Fine. Nobody fights like that for a lie." Tallowmere's banners go to you.`,
      lose: { influence: -5 }, failOut: `Osric disarms you in front of everyone. "A lost {heir} who can't fight," he says. "Very convincing."` },
    { t: `Quietly pay the doubters' debts`, req: s => s.gold >= 80, rq: `Needs 80 gold`, e: { gold: -80, influence: 15, army: 200, flag: 'recognized' },
      out: `By morning, three kings who laughed at you remember that they always believed in you. Gold has a wonderful effect on memory.` },
    { t: `Say nothing. Let them doubt. You don't need their crowns.`, e: { cunning: 1, influence: 2 },
      out: `You sit down. Corvin stares at you. Later, alone, he says, "I don't know if that was very stupid or very clever." Neither do you.` }
  ] };
S.c5_1.choices.forEach(c => c.go = 'c5_2');

S.c5_2 = { ch: 'V', age: 21, art: 'ruins', fx: 'ash', title: 'The Ashes of Valerith',
  text: `You go back to Valerith for the first time. Grass grows through the throne room. In the chapel crypt the stones are still black.

Refugees are camped in the ruins, thousands of them, running from the Legion. They watch you the way starving people watch smoke from a kitchen.`,
  choices: [
    { t: `Rebuild the walls and feed the refugees with everything you have`, e: s => ({ gold: -Math.min(s.gold, 60), influence: 12, army: 300, charm: 1 }),
      out: `Your gold buys grain, timber and stone. By winter there are walls again, and three hundred of the refugees have taken up spears. They call you the {Ruler} of Ashes, and they mean it kindly.` },
    { t: `Tax the refugees to fund your war`, e: { gold: 120, influence: -5, corruption: 6 },
      out: `It works. You have gold. You also have three thousand people who look at you the way they look at the Legion's tax collectors.` },
    { t: `Turn the ruins into a hidden fortress for your spies`, e: { cunning: 1, influence: 5, flag: 'spy_network' },
      out: `Tunnels under the chapel, a rookery of messenger crows, a dozen refugees who used to be thieves. Valerith becomes a place where information goes in and never comes out.` },
    { t: `Visit the crypt alone at night`, e: { lore: 1, maxhp: 10, flag: ['crypt_vision', 'heart_rumor'] },
      out: `You sit where your mother died. In the dark you swear you hear her voice, very close: "Her heart is under her throne, my love. She keeps it close because she's afraid." You leave before dawn, shaking.` }
  ] };
S.c5_2.choices.forEach(c => c.go = 'EVENT>c5_3');

S.c5_3 = { ch: 'V', age: 22, art: 'city', fx: 'rain', title: 'Sella', enter: { meet: 'sella' },
  text: s => s.rel.sella >= 30
    ? `${s.path === 'court' ? `Sella spent years searching for you after Thornwick. Now she never leaves your side. ` : ''}Tonight she comes in soaked with rain and drops a heavy pouch of Dravenmoor gold on your table.

"Their spymaster offered me this to sell you out," she says. "I took the money. I thought you could use it."`
    : `${s.path === 'court' ? `Sella spent years searching for you after Thornwick, and you were glad when she found you. ` : ''}But she's been strange for months now. Distant. Suddenly rich.

One night you see her leaving a tavern in the part of town where Dravenmoor's agents drink.`,
  choices: [
    { t: `Make her a double agent`, if: s => s.rel.sella >= 30, e: { gold: 60, rel: { sella: 15 }, flag: 'double_agent' },
      out: `Sella grins the same grin she had at seven. From now on, Dravenmoor's spymaster pays good money for very convincing lies.` },
    { t: `Tell her to cut ties. It's too dangerous.`, if: s => s.rel.sella >= 30, e: { gold: 60, rel: { sella: 5 } },
      out: `She sighs and agrees. She also keeps one contact, just in case, because she's Sella.` },
    { t: `Confront her`, if: s => s.rel.sella < 30, check: { stat: 'charm', dc: 5 }, win: { rel: { sella: 25 }, flag: 'double_agent' },
      out: `She breaks down. They have her brother, the only family she has left, in a Dravenmoor prison. You promise to get him out. She promises to feed them lies. Both of you mean it.`,
      lose: { rel: { sella: -20 }, flag: 'sella_traitor' }, failOut: `She denies everything, kisses your cheek, and leaves. You decide to believe her. You shouldn't.` },
    { t: `Follow her and find out who she's meeting`, if: s => s.rel.sella < 30, check: { stat: 'cunning', dc: 6 }, win: { rel: { sella: 10 }, flag: 'double_agent' },
      out: `You catch her with the spymaster's man and wait until he leaves. Then you sit down across from her. She goes white. By dawn she's working for you, and the spymaster doesn't know.`,
      lose: { flag: 'sella_traitor' }, failOut: `You lose her in the crowd. Whatever she's doing, she keeps doing it.` },
    { t: `Let it go. She's your oldest friend.`, if: s => s.rel.sella < 30, e: { flag: 'sella_traitor' },
      out: `You tell yourself you're imagining things. Friendship is supposed to be trust. Sometimes it's just blindness.` },
    { t: `Have her arrested`, if: s => s.rel.sella < 30, e: { influence: 3, rel: { sella: -60 }, flag: 'sella_gone' },
      out: `She doesn't fight the guards. She just looks at you as they take her away, the way she did on the ice when you were eight.` }
  ] };
S.c5_3.choices.forEach(c => c.go = 'c5_4');

S.c5_4 = { ch: 'V', age: 23, art: 'night', fx: 'magic', title: 'The Prince of Dravenmoor', enter: s => { s.flags.kael_revealed = 1; s.met.kael = 1; },
  text: s => {
    if (!km(s)) return `A stranger is waiting in your room when you come home: black hair, grey eyes ringed with red, a traveling cloak over silk.

"Crown Prince Kaelith of Dravenmoor," he says. "My mother wants you dead. I'd rather she were dead. Shall we talk?"`;
    if (s.rel.kael >= 30) return `A black feather lands on your windowsill at midnight, though no bird brought it. Then Kael climbs in after it, older, thinner, with a crown-prince's signet on his hand.

"My mother is going to burn the last free crowns next year," he says. "I've watched her kill everyone I ever loved. Help me end it, {name}. You're the only person I trust."`;
    return `Crown Prince Kaelith comes for you at night, with a sword already drawn. It's Kael, the boy from the river, and he looks like he hasn't slept in a month.

"She's finally learned who you are," he says. "She sent me. I'm sorry, {name}."`;
  },
  choices: [
    { t: `Take his hand`, if: s => km(s) && s.rel.kael >= 30, e: { rel: { kael: 20 }, flag: 'kael_ally' },
      out: `His grip is cold and very strong. "Together, then," he says. "Like the river."` },
    { t: `Use him, and plan to get rid of him afterwards`, if: s => km(s) && s.rel.kael >= 30, e: { cunning: 1, corruption: 5, rel: { kael: -5 }, flag: 'kael_ally' },
      out: `You smile and shake his hand. Somewhere in your head, a list gets one name longer.` },
    { t: `Burn the black feather in front of him`, if: s => km(s) && s.rel.kael < 30 && has(s, 'Black Feather'), e: { rel: { kael: 40 }, noitem: 'Black Feather', flag: 'kael_ally' },
      out: `He stares at the ashes. His sword drops to the floor. "You kept it," he whispers. "All these years." He sits down on your bed and doesn't say anything for a long time. When he does, it's "What do you need?"` },
    { t: `Fight him`, if: s => km(s) && s.rel.kael < 30, fight: 'kael', win: {}, out: `Kael ends up on his knees with your blade at his throat.`, go: 'c5_4b',
      lose: { rel: { kael: 10 } }, failOut: `His sword stops at your throat and trembles there. "I can't," he says. "I can't." He leaves through the window. You don't know if you'll see him again.` },
    { t: `Hear him out`, if: s => !km(s), check: { stat: 'charm', dc: 4 }, win: { rel: { kael: 30 }, flag: 'kael_ally' },
      out: `You talk until dawn. He hates his mother with a cold, tired hatred you recognize. By morning you have an ally inside the Obsidian Palace.`,
      lose: { rel: { kael: 5 } }, failOut: `He isn't convinced you can win. "Come find me when you have an army," he says, and disappears.` },
    { t: `Throw him out. Never trust a demon prince.`, if: s => !km(s), e: { rel: { kael: -20 } }, out: `He bows mockingly and goes. You wonder, for years, if that was a mistake.` }
  ] };
S.c5_4.choices.forEach(c => { if (!c.go) c.go = s => 'EVENT>c5_' + s.design; });

S.c5_4b = { ch: 'V', age: 23, art: 'night', fx: 'magic', title: 'Mercy or Not',
  text: `Kael kneels in your room with blood on his lip and your blade against his neck. He doesn't beg. He just looks up at you with those red-ringed eyes, the same way he did in the river.

"Go on," he says. "She'll only send someone worse."`,
  choices: [
    { t: `Spare him`, e: { rel: { kael: 40 }, flag: 'kael_ally' },
      out: `You lower the blade. Kael stares at you, then starts laughing, then can't stop. "She'd never have spared me," he says. "Never." By dawn he's telling you everything about the Obsidian Palace.` },
    { t: `Kill him`, e: { corruption: 10, influence: 10, rel: { kael: -100 }, flag: 'kael_dead' },
      out: `It's quick. You send his signet ring to his mother in a silver box. You don't know why that felt necessary. You don't sleep well for a while.` }
  ] };
S.c5_4b.choices.forEach(c => c.go = s => 'EVENT>c5_' + s.design);

/* ---- CHAPTER V: preparations ---- */
S.c5_war = { ch: 'V', age: 24, art: 'dungeon', fx: 'embers', title: 'The Star-Iron Blade',
  text: s => `An army is nothing without a sword that can kill her. ${star(s) ? `You have a sliver of star-iron, humming in its wrapping.` : `You don't have any star-iron.`}

The last smith who can work it is Dorra Ninefingers, in the halls under Greymount.`,
  choices: [
    { t: `Bring Dorra your shard`, req: s => has(s, 'Star-Iron Shard'), rq: `Needs a Star-Iron Shard`, e: { noitem: 'Star-Iron Shard', item: 'Star-Iron Blade' },
      out: `Dorra works for nine days without sleeping. On the tenth she hands you a sword that looks black until it moves, and then it's every color of a night sky. "Don't miss," she says.` },
    { t: `Buy a shard from Dorra's own hoard`, req: s => s.gold >= 150 && !star(s), rq: `Needs 150 gold`, e: { gold: -150, item: 'Star-Iron Blade' },
      out: `Everything you've saved. Dorra pockets it and forges you a blade from a meteor her grandmother found. "Cheap at the price," she says, and she isn't joking.` },
    { t: `Raid the tomb of the Fallen Star for one`, if: s => !star(s), fight: 'tombguard', win: { item: 'Star-Iron Blade', influence: 5 },
      out: `The guardian's star-eye cracks out of its socket and rolls to your feet, still glowing. Dorra makes it into a blade in a week.`,
      lose: {}, failOut: `The guardian throws you out of its tomb like a dog. You'll have to fight her without star-iron.` },
    { t: `Forget the blade and spend the year drilling your army`, e: { might: 1, army: 500 },
      out: `Five hundred more spears, and every one of them knows how to hold a line. You hope it's enough.` }
  ] };
S.c5_war.choices.forEach(c => c.go = 'c5_war2');

S.c5_war2 = { ch: 'V', age: 24, art: 'council', fx: 'embers', title: 'Banners',
  text: `You have {army} soldiers. The Hollow Legion has more than you can count. You have one more season to gather your banners.`,
  choices: [
    { t: `Ride to every free crown in person`, check: { stat: 'charm', dc: 6 }, win: { army: 900, influence: 10 },
      out: `Forty days in the saddle, forty speeches, forty halls. Nine hundred more soldiers march to Valerith.`,
      lose: { army: 300 }, failOut: `Most crowns slam their doors. Three hundred soldiers come anyway.` },
    { t: `Hire the Free Company and every sellsword in the south`, req: s => s.gold >= 100, rq: `Needs 100 gold`, e: { gold: -100, army: 700 },
      out: `Mag Harrow herself leads them in, grinning. "Heard you were paying," she says.` },
    { t: `Arm the peasants and refugees of Valerith`, e: { army: 500, influence: 5 },
      out: `They're farmers and bakers with spears. They have nothing to lose. That counts for a lot.` },
    { t: `Ask Corvin to march with all of Marrowind`, check: { stat: 'charm', dc: 6, bonus: s => Math.floor(s.rel.corvin / 15) }, win: { army: 1200, rel: { corvin: 10 } },
      out: `Corvin is quiet for a long time. Then he says, "I always meant to die doing something stupid." Marrowind's blue banners join yours.`,
      lose: { army: 200 }, failOut: `Corvin sends two hundred men and a letter full of excuses. You keep the men and burn the letter.` }
  ] };
S.c5_war2.choices.forEach(c => c.go = 'c6_war1');

S.c5_shadow = { ch: 'V', age: 24, art: 'city', fx: 'fog', title: 'A Way In',
  text: `To kill her in her bed you need three things: a way in, a weapon that works, and to know where she'll be on the one night of the year she sleeps.

First, the way in.`,
  choices: [
    { t: `Use the Moth's Ledger to find the servants' passages`, req: s => has(s, "Moth's Ledger"), rq: `Needs the Moth's Ledger`, e: { edge: 2 },
      out: `Half the ledger is names. The other half is a map. Three passages lead from the canal docks into the palace walls.` },
    { t: `You worked in that palace for years. You know every corridor.`, if: s => s.path === 'court' || f(s, 'knows_palace'), e: { edge: 2 },
      out: `You draw the map from memory, down to the loose stone by the laundry chute.` },
    { t: `Have Sella, your double agent, leave a door unlocked`, req: s => f(s, 'double_agent'), rq: `Needs Sella as a double agent`, e: { edge: 2, rel: { sella: 5 } },
      out: `"The north postern," Sella says. "Third bell. I'll be on the other side."` },
    { t: `Kael draws you a map of his mother's wing`, req: s => f(s, 'kael_ally'), rq: `Needs Kael as an ally`, e: { edge: 2, rel: { kael: 5 } },
      out: `He draws it in ten minutes, without looking up. "She changes the guards at midnight. There's a gap of forty heartbeats."` },
    { t: `Scout the palace yourself for a month, in disguise`, check: { stat: 'cunning', dc: 6, bonus: s => f(s, 'disguise') ? 2 : 0 }, win: { edge: 2 },
      out: `A month of carrying firewood and keeping your eyes down. You know the way in now.`,
      lose: { hp: -20, flag: 'suspected' }, failOut: `A guard remembers your face. You get out, but the palace doubles its watch.` },
    { t: `Pay a palace guard`, req: s => s.gold >= 100, rq: `Needs 100 gold`, e: { gold: -100, edge: 1 },
      out: `He takes the money. Whether he stays bought is another question.` }
  ] };
S.c5_shadow.choices.forEach(c => c.go = 'c5_shadow2');

S.c5_shadow2 = { ch: 'V', age: 24, art: 'poison', fx: 'magic', title: 'The Weapon',
  text: s => `Now the weapon. Steel won't kill the Undying. ${star(s) ? `You have star-iron.` : ''}${lily(s) ? ` You have a Dawn Lily.` : ''}${f(s, 'heart_rumor') ? ` And you've heard where her heart is kept.` : ''}`,
  choices: [
    { t: `Have your star-iron set into a dagger`, req: s => has(s, 'Star-Iron Shard'), rq: `Needs a Star-Iron Shard`, e: { noitem: 'Star-Iron Shard', item: 'Star-Iron Dagger' },
      out: `A blade the length of your hand, black until it moves. It's enough.` },
    { t: `Learn exactly where her heart is kept`, check: { stat: 'lore', dc: 6, bonus: s => f(s, 'heart_rumor') ? 3 : 0 }, win: { flag: 'heart_known' },
      out: `Under the throne room, behind a door of bone, in a cage of thorns. You memorize every step from her bedchamber to it.`,
      lose: { hp: -10 }, failOut: `The trail goes cold. You'll have to make do without it.` },
    { t: `Coat a blade in Dawn Lily nectar`, req: s => lily(s), rq: `Needs a Dawn Lily`, e: { flag: 'lily_blade' },
      out: `A few drops, and the steel smells faintly of spring.` },
    { t: `Buy a star-iron dagger from the black market`, req: s => s.gold >= 150 && !star(s), rq: `Needs 150 gold`, e: { gold: -150, item: 'Star-Iron Dagger' },
      out: `It costs everything you have. It hums when you hold it. That's the only proof you get.` },
    { t: `A plain dagger, and faith`, e: { charm: 1 }, out: `Maybe the stories are wrong. Maybe steel is enough. You're about to find out.` }
  ] };
S.c5_shadow2.choices.forEach(c => c.go = 'c6_shadow1');

S.c5_serpent = { ch: 'V', age: 24, art: 'throne', fx: 'magic', title: 'On Your Knees',
  text: s => `You go to Nyxhallow, kneel before the Obsidian Throne, and offer the Empress your sword.

${s.path === 'court' ? `"My little squire comes home," Morvanna says, amused. "Wearing a crown on the inside of your head, I think." She doesn't say no.` : `"The {heir} of Valerith," Morvanna says, "kneeling to me. How delightful. And how unlikely." She doesn't trust you. Yet.`}`,
  choices: [
    { t: `Hand her the free crowns' war plans as proof of loyalty`, e: { influence: -15, corruption: 10, rel: { morvanna: 25, corvin: -30 } },
      out: `Three free crowns fall that summer because of what you gave her. People you knew are among the dead. Morvanna starts calling you "my clever one."` },
    { t: `Fight her champion to earn your place`, fight: 'champion', win: { might: 1, rel: { morvanna: 20 } },
      out: `Azhar yields on his knees for the first time in ninety years. Morvanna stands and applauds, slowly. "Mine," she says.`,
      lose: { rel: { morvanna: 5 } }, failOut: `Azhar beats you, but you get up four times. Morvanna seems to find that charming.` },
    { t: `Drink the Ember Kiss`, if: s => !f(s, 'ember_kiss'), e: { might: 2, maxhp: 20, corruption: 25, rel: { morvanna: 20 }, flag: 'ember_kiss' },
      out: `Her blood burns into you. You see in the dark now. Sometimes you hear her thinking.` },
    { t: `Flatter, serve and wait, for years`, check: { stat: 'charm', dc: 6 }, win: { rel: { morvanna: 25 } },
      out: `Small kindnesses. Clever jokes. A cup of wine poured before she asks for it. Over three years the Empress begins, against all sense, to like you.`,
      lose: { rel: { morvanna: 8 } }, failOut: `She sees through most of it. Not all of it.` }
  ] };
S.c5_serpent.choices.forEach(c => c.go = 'c5_serpent2');

S.c5_serpent2 = { ch: 'V', age: 24, art: 'empress', fx: 'magic', title: "The Champion's Years",
  text: `Years at her side. You wear her colors, fight her wars, sleep in a room next to hers. Some nights you forget which side you're on. Then you touch your father's ring and remember.

You'll only get one chance. Prepare it.`,
  choices: [
    { t: `Have your star-iron shard set into a hidden dagger`, req: s => has(s, 'Star-Iron Shard'), rq: `Needs a Star-Iron Shard`, e: { noitem: 'Star-Iron Shard', item: 'Star-Iron Dagger' },
      out: `It fits inside your sleeve. You can feel it humming against your wrist at every feast.` },
    { t: `Find the Reliquary where she keeps her heart`, check: { stat: 'cunning', dc: 6, bonus: s => (f(s, 'heart_rumor') ? 2 : 0) + (f(s, 'knows_palace') ? 1 : 0) }, win: { flag: 'heart_known' },
      out: `Beneath the throne room, behind a door of bone. You've seen the door now. You know the way.`,
      lose: { rel: { morvanna: -10 }, flag: 'suspected' }, failOut: `You get too close. Ghast catches you in the wrong corridor, and the Empress asks, very gently, what you were looking for.` },
    { t: `Keep a Dawn Lily ready for her cup`, req: s => lily(s), rq: `Needs a Dawn Lily`, e: { cunning: 1 },
      out: `It sits in a hollow ring on your finger. You touch it every time you pour her wine.` },
    { t: `Let the Ember in your blood grow stronger`, e: { might: 1, corruption: 15, rel: { morvanna: 10 } },
      out: `You stop fighting the dark in your blood. It answers when you call it now, and it's strong.` }
  ] };
S.c5_serpent2.choices.forEach(c => c.go = 'c6_serpent1');

S.c5_cup = { ch: 'V', age: 24, art: 'poison', fx: 'magic', title: "The Poisoner's Craft",
  text: s => lily(s)
    ? `${f(s, 'lily_sub') ? `Your nightshade draught` : `The Dawn Lily`} sits in a sealed vial in your coat. The Feast of Ash is in one month, and the Empress drinks a single cup of Valerith red at midnight. She says it reminds her of a war she enjoyed.`
    : `The Feast of Ash is in one month, and the Empress drinks a single cup of Valerith red at midnight. You have a plan. What you don't have is the poison.`,
  choices: [
    { t: `Distill an antidote too, in case`, if: s => lily(s), check: { stat: 'lore', dc: 5 }, win: { lore: 1, flag: 'antidote' },
      out: `Bitter as bark, and it'll keep you alive if things go wrong. You hope you won't need it.`,
      lose: { hp: -15 }, failOut: `The fumes knock you out for two days. No antidote.` },
    { t: `Test it on a captured hound of the Abyss`, if: s => lily(s), e: { corruption: 4, flag: 'lily_tested' },
      out: `The hound lies down, sighs, and dies in a minute, smelling of spring flowers. It works.` },
    { t: `Buy a Dawn Lily from the black market in Ossory`, if: s => !lily(s), req: s => s.gold >= 120, rq: `Needs 120 gold`, e: { gold: -120, item: 'Dawn Lily' },
      out: `A smuggler hands it over in a lead box. "Forty years since anyone brought one down," she says. "Don't waste it."` },
    { t: `Send a climber to Saint Iven's Peak for one`, if: s => !lily(s), check: { stat: 'charm', dc: 5, bonus: s => s.path === 'lore' ? 2 : 0 }, win: { item: 'Dawn Lily' },
      out: `A monk you once knew climbs the north face for you. He comes back with frostbite and a white flower in wax.`,
      lose: { item: 'Nightshade Draught', flag: 'lily_sub' }, failOut: `Your climber never comes back. You brew a substitute from nightshade and grave-salt. It will kill her. It will also kill anyone else who drinks it.` },
    { t: `Brew a substitute from nightshade and grave-salt`, if: s => !lily(s), e: { lore: 1, item: 'Nightshade Draught', flag: 'lily_sub' },
      out: `It isn't the Dawn Lily. It will kill her. It will also kill anyone else who drinks it.` }
  ] };
S.c5_cup.choices.forEach(c => c.go = 'c5_cup2');

S.c5_cup2 = { ch: 'V', age: 24, art: 'throne', fx: 'ash', title: 'Into the Kitchens',
  text: `The poison is ready. Now you need to be in the Obsidian Palace kitchens on the night of the Feast, close enough to touch her cup.`,
  choices: [
    { t: `You scrubbed those kitchens for years. Walk back in.`, if: s => s.path === 'court', e: { edge: 2 },
      out: `Nobody looks twice at a face they've seen a thousand times.` },
    { t: `Ghast still owes you a favor`, req: s => f(s, 'ghast_friend'), rq: `Needs Ghast as a friend`, e: { edge: 2 },
      out: `"For the clever one," Ghast says, "a place by the wine." He doesn't ask why.` },
    { t: `Sella gets you a place among the wine stewards`, req: s => f(s, 'double_agent'), rq: `Needs Sella as a double agent`, e: { edge: 2, rel: { sella: 5 } },
      out: `"You owe me a pony," Sella says. "From when we were nine. Don't think I forgot."` },
    { t: `Go in disguise as a wine merchant's {child}`, req: s => f(s, 'disguise'), rq: `Needs the guild's disguise training`, e: { edge: 2 },
      out: `A new face, a new accent, a cart of Valerith red. You're expected.` },
    { t: `Bribe the cellar master`, req: s => s.gold >= 80, rq: `Needs 80 gold`, e: { gold: -80, edge: 1 },
      out: `He takes it. He'll look the other way, at least at first.` },
    { t: `Talk your way in`, check: { stat: 'charm', dc: 6 }, win: { edge: 2 },
      out: `A story about a sick cousin, a smile, a borrowed apron. You're in.`,
      lose: { flag: 'suspected' }, failOut: `You get in, but the head cook doesn't like your face.` }
  ] };
S.c5_cup2.choices.forEach(c => c.go = 'c6_cup1');

S.c5_oath = { ch: 'V', age: 24, art: 'throne', fx: 'magic', title: 'The Nine Lords',
  text: s => `Nine Demon Lords hold Morvanna's throne up with their oaths. If at least five renounce her on the Night of Ash, the books say, she becomes mortal.

You can work on three of them before the Night comes. ${s.oathTries >= 3 ? `You're out of time.` : `You have ${3 - s.oathTries} ${3 - s.oathTries === 1 ? 'try' : 'tries'} left.`}

Lords who will turn: {lords} of 9.`,
  choices: [
    { t: `Lord Azgeroth, the Grand Marshal, who wants a war worth fighting`, if: s => s.oathTries < 3 && !f(s, 'o_az'), check: { stat: 'might', dc: 6, bonus: s => s.army >= 1000 ? 2 : 0 },
      e: { oathTries: 1, flag: 'o_az' }, win: { lords: 2 }, out: `You beat him at arms in his own yard, then show him your army. "Finally," he says, "an enemy." He swears to stand aside.`,
      lose: { hp: -20 }, failOut: `He throws you out of his tower. Azgeroth will stay loyal.` },
    { t: `The twin Ladies Vex and Vesper, who love gold`, if: s => s.oathTries < 3 && !f(s, 'o_vx'), req: s => s.gold >= 120, rq: `Needs 120 gold`,
      e: { oathTries: 1, flag: 'o_vx', gold: -120, lords: 2 }, out: `They count it together and laugh together. "She's so boring these days," says Vex. Vesper nods. Two lords.` },
    { t: `Old Lord Ommoth, who remembers Morvanna as a human queen`, if: s => s.oathTries < 3 && !f(s, 'o_om'), check: { stat: 'lore', dc: 5 },
      e: { oathTries: 1, flag: 'o_om' }, win: { lords: 2 }, out: `You talk about her children. He was their tutor, three hundred years ago. He cries. "She was kind once," he says. "End it. She'd want it ended." He brings his apprentice lord with him.`,
      lose: {}, failOut: `He only wants to talk about the old days, and you don't know enough about them.` },
    { t: `Bring Prince Kaelith before the lords`, if: s => s.oathTries < 3 && !f(s, 'o_ka'), req: s => f(s, 'kael_ally'), rq: `Needs Kael as an ally`,
      e: { oathTries: 1, flag: 'o_ka', lords: 2, rel: { kael: 10 } }, out: `The heir of Dravenmoor stands beside you. Two of the younger lords kneel to him on the spot.` },
    { t: `Blackmail Lord Fenrik with what you've learned`, if: s => s.oathTries < 3 && !f(s, 'o_fe'), req: s => f(s, 'ledger') || f(s, 'tull_puppet') || f(s, 'spy_network'), rq: `Needs a spy network or a ledger of secrets`,
      e: { oathTries: 1, flag: 'o_fe', lords: 1, corruption: 3 }, out: `Fenrik has been stealing from the Empress for eighty years, and now you can prove it. He'll stand aside.` },
    { t: `Charm the young Lord Ilvane`, if: s => s.oathTries < 3 && !f(s, 'o_il'), check: { stat: 'charm', dc: 6 },
      e: { oathTries: 1, flag: 'o_il' }, win: { lords: 1 }, out: `He's three hundred years younger than the others and bored to death. You make rebellion sound like fun.`,
      lose: {}, failOut: `He laughs at you and tells his mother, who is also a Demon Lord.` },
    { t: `Promise them Valerith's lands`, if: s => s.oathTries < 3 && !f(s, 'o_la'), e: { oathTries: 1, flag: 'o_la', lords: 1, influence: -10, corruption: 5 },
      out: `Lord Sarkhan takes the deal. Your people will hate you for it. One more lord.` },
    { t: `The Night of Ash has come`, if: s => s.oathTries >= 3, go: 'c6_oath1' }
  ] };
S.c5_oath.choices.forEach(c => { if (!c.go) c.go = 'c5_oath'; });

/* ---- CHAPTER VI ---- */
S.c6_war1 = { ch: 'VI', age: 25, art: 'battle', fx: 'embers', title: 'The Field of Greywater',
  enter: s => { if (f(s, 'sella_traitor')) s.army = Math.floor(s.army * 0.6); },
  text: s => `Twenty-five years after Valerith burned, you stand on the Greywater plain with {army} soldiers behind you. Across the river the Hollow Legion is spread out like a storm front, and in its center, on a horse made of shadow, sits the Empress herself.${f(s, 'sella_traitor') ? `

At dawn your scouts don't come back. Someone told the Legion exactly where your camp was. Sella's tent is empty. A third of your army was cut down in the night.` : ''}${f(s, 'bren_companion') ? `

Bren is beside you, grey and limping, in your colors. "I've seen her fight," he says. "Make her come to you."` : ''}`,
  choices: [
    { t: `Lead the charge yourself`, check: { stat: 'might', dc: 7, bonus: s => Math.floor(s.army / 800) + (f(s, 'legion_tactics') ? 1 : 0) }, win: { flag: 'battle_won', influence: 10 },
      out: `You hit the Legion's center like a hammer. It bends, then breaks. The demons fall back toward the river, and she rides out to meet you herself.`,
      lose: s => ({ hp: -30, army: -Math.floor(s.army / 2) }), failOut: `The charge stalls in the mud. Half your army dies in the river. But you cut your way through to her anyway.` },
    { t: `Fake a retreat and draw them into the marsh`, check: { stat: 'cunning', dc: 7, bonus: s => Math.floor(s.army / 800) + (f(s, 'legion_tactics') ? 1 : 0) }, win: { flag: 'battle_won' },
      out: `The Legion chases you into the reeds and sinks. By noon its heavy companies are drowning in their armor. She comes to finish it herself.`,
      lose: s => ({ hp: -25, army: -Math.floor(s.army / 2) }), failOut: `She doesn't fall for it. Your rearguard is massacred. Then she comes for you.` },
    { t: `Ride the lines and give them a speech they'll tell their grandchildren about`, check: { stat: 'charm', dc: 7, bonus: s => Math.floor(s.army / 800) }, win: { flag: 'battle_won', influence: 5 },
      out: `You don't remember what you said. Your soldiers will remember it for the rest of their lives. They fight like twice their number, and the Legion breaks.`,
      lose: s => ({ hp: -20, army: -Math.floor(s.army / 2) }), failOut: `The wind takes your words. The Legion's first charge takes half your lines. You're still standing.` },
    { t: `Time the battle to the eclipse, when her power is weakest`, req: s => has(s, "Ysolde's Star Chart") || s.stats.lore >= 6, rq: `Needs Ysolde's Star Chart or Lore 6`, check: { stat: 'lore', dc: 5 },
      win: { flag: ['battle_won', 'weakened'] }, out: `At noon the moon eats the sun. Every demon on the field screams at once. Morvanna rides out pale and furious, and she's bleeding light.`,
      lose: { hp: -20 }, failOut: `You got the hour wrong. The eclipse comes as the battle ends. It helps a little.` },
    { t: `Signal Kael to turn the Legion's left wing`, if: s => f(s, 'kael_ally'), e: { flag: 'battle_won', rel: { kael: 10 } },
      out: `A horn sounds in the Legion's ranks, and a third of the demons turn and fall on the rest. Kael rides through the chaos to your side. "Mother is coming," he says.` }
  ] };
S.c6_war1.choices.forEach(c => c.go = s => (!f(s, 'battle_won') && s.army < 300) ? 'end_ash' : 'c6_war2');

S.c6_war2 = { ch: 'VI', age: 25, art: 'empress', fx: 'embers', title: 'Her and You',
  text: s => `The battle breaks around you until there's only a circle of mud and fire, and in the middle of it, her.

"{name} of Valerith," Morvanna says. "I let you live, you know. I always knew where you were. I wanted to see what you'd become." She draws a sword of black glass. "Show me."${star(s) ? `

The star-iron in your hand begins to sing.` : `

You have no star-iron. You know what that means.`}`,
  choices: [{ t: `Fight the Empress`, fight: 'morvanna', win: { final: 'end_crown' }, go: 'c6_last', failGo: 'end_ash' }] };

S.c6_shadow1 = { ch: 'VI', age: 25, art: 'city', fx: 'fog', title: 'The Night of Knives',
  enter: s => { if (f(s, 'sella_traitor')) s.edge = Math.max(0, s.edge - 2); },
  text: s => `The Feast of Ash. Every noble in Dravenmoor is drunk in the great hall, and the Empress, for once, has gone to bed early.

You go over the canal wall at the third bell.${f(s, 'sella_traitor') ? `

Halfway in, you find the door Sella promised to leave open. It's locked, and there are fresh boot prints in the dust. The guards were warned.` : ''}`,
  choices: [
    { t: `Through the servants' passages`, check: { stat: 'cunning', dc: 7, bonus: s => s.edge }, out: `Through walls, under floors, behind tapestries. Forty heartbeats between guards. You use thirty-eight. You're at her door.`,
      lose: { hp: -30, flag: 'alarm' }, failOut: `A guard turns at the wrong moment. You kill him, but not quietly. Bells start ringing as you reach her door.` },
    { t: `Walk in disguised as a wine steward`, req: s => f(s, 'disguise') || s.path === 'court', rq: `Needs disguise training or palace experience`, check: { stat: 'charm', dc: 6, bonus: s => s.edge },
      out: `A tray, a bow, a bored look. Nobody stops a servant carrying wine to the Empress.`,
      lose: { hp: -25, flag: 'alarm' }, failOut: `The real steward appears behind you. You run the last corridor with guards on your heels.` },
    { t: `Over the rooftops, the hard way`, check: { stat: 'might', dc: 6, bonus: s => s.edge }, out: `Gutters, gargoyles, a hundred-foot drop. You come in through her window.`,
      lose: { hp: -35, flag: 'alarm' }, failOut: `A tile breaks. You fall a floor, break something, and climb the rest in agony while the bells ring.` }
  ] };
S.c6_shadow1.choices.forEach(c => c.go = 'c6_shadow2');

S.c6_shadow2 = { ch: 'VI', age: 25, art: 'empress', fx: 'magic', title: 'The Bedchamber',
  text: s => `Her bedchamber is cold and full of moonlight. Morvanna isn't asleep. She's sitting by the window with a cup of wine, and she doesn't turn around.

"I wondered when you'd come," she says.${f(s, 'alarm') ? ` "And you were loud about it."` : ''}`,
  choices: [
    { t: `Star-iron, straight through the heart`, req: s => star(s), rq: `Needs star-iron`, check: { stat: 'cunning', dc: 6, bonus: s => f(s, 'alarm') ? -2 : 1 }, go: 'end_shadow', failGo: 'c6_shadow_fight' },
    { t: `Her heart isn't here. Run for the Reliquary beneath the throne.`, req: s => f(s, 'heart_known') || f(s, 'heart_rumor'), rq: `Needs to know where her heart is`, check: { stat: 'cunning', dc: 6, bonus: s => f(s, 'heart_known') ? 2 : 0 }, go: 'c6_heart', failGo: 'c6_shadow_fight' },
    { t: `A blade wet with Dawn Lily`, req: s => f(s, 'lily_blade'), rq: `Needs a Dawn Lily blade`, check: { stat: 'cunning', dc: 6 }, go: 'end_shadow', failGo: 'c6_shadow_fight' },
    { t: `Show her Bren's letter`, if: s => f(s, 'letter'), e: { rel: { morvanna: 10 }, flag: 'weakened' },
      out: `She reads it in silence. Her hand shakes. "Brennoch," she says. "My best captain. I always wondered why he left." For one moment the Undying Empress looks old and tired. Then she stands and draws her sword. But something has gone out of her.`, go: 'c6_shadow_fight' },
    { t: `Draw steel and fight her`, go: 'c6_shadow_fight' }
  ] };

S.c6_shadow_fight = { ch: 'VI', age: 25, art: 'empress', fx: 'magic', title: 'Faster Than Anything Alive',
  text: `She moves faster than anything alive. The cup hits the floor before you've finished your first step, and her sword of black glass is already in her hand.

"Let's see what Bren taught you," she says.`,
  choices: [{ t: `Fight the Empress`, fight: 'morvanna', win: { final: 'end_shadow' }, go: 'c6_last', failGo: 'end_hanged' }] };

S.c6_heart = { ch: 'VI', age: 25, art: 'heart', fx: 'embers', title: 'The Reliquary',
  text: `Beneath the throne room, behind a door of bone, in a cage of black thorns, a heart is beating.

It's enormous in the silence. Black, slow, patient. Every beat shakes dust from the ceiling.

Above you, you hear her running.`,
  choices: [
    { t: `Cut it with star-iron`, req: s => star(s), rq: `Needs star-iron`, go: 'end_heart' },
    { t: `Tear the cage open and crush it with your bare hands`, e: { hp: -40 }, go: s => s.hp > 0 ? 'end_heart' : 'end_hanged' },
    { t: `Take the heart. Whoever holds it, holds her.`, if: s => s.corruption >= 40, go: 'end_dark' }
  ] };

S.c6_serpent1 = { ch: 'VI', age: 25, art: 'throne', fx: 'magic', title: 'The Feast of Ash',
  text: s => `Tonight, at the Feast of Ash, before the whole court, the Empress is going to name you her heir.

She calls you up the steps to the Obsidian Throne. She kisses your forehead. "My child of ash," she says, and you realize, with horror, that she means it.${f(s, 'sella_traitor') ? `

Sella is in the crowd, wearing Dravenmoor colors. She won't meet your eyes. Morvanna's smile is a little too knowing.` : ''}`,
  choices: [
    { t: `Star-iron in her back, during the embrace`, req: s => star(s), rq: `Needs star-iron`, check: { stat: 'cunning', dc: 6, bonus: s => Math.floor(s.rel.morvanna / 25) - (f(s, 'sella_traitor') ? 3 : 0) }, go: 'end_serpent', failGo: 'c6_serpent_fight' },
    { t: `Dawn Lily in the cup she raises to you`, req: s => lily(s), rq: `Needs a Dawn Lily`, check: { stat: 'cunning', dc: 6, bonus: s => Math.floor(s.rel.morvanna / 25) - (f(s, 'sella_traitor') ? 3 : 0) }, go: 'end_cup', failGo: 'c6_serpent_fight' },
    { t: `Slip away to the Reliquary while the court feasts`, req: s => f(s, 'heart_known'), rq: `Needs to know where her heart is`, go: 'c6_heart' },
    { t: `Embrace her and mean it. Become her heir.`, if: s => s.corruption >= 30 || s.rel.morvanna >= 40, go: 'end_heir' },
    { t: `Draw your sword and fight her in front of everyone`, go: 'c6_serpent_fight' }
  ] };

S.c6_serpent_fight = { ch: 'VI', age: 25, art: 'empress', fx: 'magic', title: 'Before the Whole Court',
  text: `She sees it coming. Of course she does. She steps back, almost sad.

"I would have given you everything," Morvanna says, and draws her sword of black glass. The court backs away to the walls.`,
  choices: [{ t: `Fight the Empress`, fight: 'morvanna', win: { final: 'end_serpent' }, go: 'c6_last', failGo: 'end_pet' }] };

S.c6_cup1 = { ch: 'VI', age: 25, art: 'throne', fx: 'ash', title: 'The Feast Kitchens',
  enter: s => { if (f(s, 'sella_traitor')) s.edge = Math.max(0, s.edge - 2); },
  text: s => `The Feast of Ash. Five hundred candles, nine Demon Lords, and one cup of Valerith red waiting on a silver tray for the Empress at midnight.

You need to get the poison into that cup.${f(s, 'sella_traitor') ? `

The cellar master looks at you a little too long. Someone has warned him.` : ''}${f(s, 'suspected') ? `

The head cook is watching you.` : ''}`,
  choices: [
    { t: `Pour it in while the cup passes through the cellar`, check: { stat: 'cunning', dc: 6, bonus: s => s.edge - (f(s, 'suspected') ? 1 : 0) }, go: 'c6_cup2', failGo: 'c6_cup_caught' },
    { t: `Distract the taster and slip it in yourself`, check: { stat: 'charm', dc: 6, bonus: s => s.edge - (f(s, 'suspected') ? 1 : 0) }, go: 'c6_cup2', failGo: 'c6_cup_caught' }
  ] };

S.c6_cup_caught = { ch: 'VI', age: 25, art: 'throne', fx: 'magic', title: 'Three Eyes',
  text: `A hand closes on your wrist. Long fingers, cold as a cellar floor.

Ghast's three eyes look at the vial, then at you. "Oh," he says softly. "Oh, the clever one." He draws two carving knives.`,
  choices: [{ t: `Fight Ghast`, fight: 'ghast', win: { flag: 'killed_ghast' }, out: `Ghast falls among the wine barrels. Nobody heard. The cup goes up the stairs with your poison in it.`, go: 'c6_cup2', failGo: 'end_hanged' }] };

S.c6_cup2 = { ch: 'VI', age: 25, art: 'poison', fx: 'magic', title: 'The Toast',
  text: `The great hall. Five hundred candles. The Empress lifts the cup you poisoned.

Then she stops. She looks straight at you, standing among the servants.

"You," she says, smiling. "Come here. Drink first. I always have a stranger drink first."`,
  choices: [
    { t: s => f(s, 'lily_sub') ? `Drink it. You have an antidote, or you don't.` : `Drink it. The Dawn Lily is harmless to the living.`,
      go: s => (f(s, 'lily_sub') && !f(s, 'antidote')) ? 'end_shared' : 'end_cup' },
    { t: `Swap the cups with a sleight of hand`, check: { stat: 'cunning', dc: 7 }, go: 'end_cup', failGo: 'c6_cup_fight' },
    { t: `Throw the wine in her face and draw your knife`, e: { flag: 'weakened' }, go: 'c6_cup_fight' },
    { t: `Refuse and run`, go: 'end_hanged' }
  ] };

S.c6_cup_fight = { ch: 'VI', age: 25, art: 'empress', fx: 'magic', title: 'Wine and Blood',
  text: `Poisoned wine drips from her chin and smokes where it lands. She's hurt. She's also very, very angry.

The court scatters. The Empress comes down from her throne.`,
  choices: [{ t: `Fight the Empress`, fight: 'morvanna', win: { final: 'end_cup' }, go: 'c6_last', failGo: 'end_hanged' }] };

S.c6_oath1 = { ch: 'VI', age: 25, art: 'throne', fx: 'magic', title: 'The Renouncing',
  enter: s => { const n = s.lords - (f(s, 'sella_traitor') ? 1 : 0); s.lords = Math.max(0, n); if (s.lords >= 5) s.flags.mortal = 1; else if (s.lords >= 3) s.flags.weakened = 1; },
  text: s => `The Night of Ash. The nine Demon Lords stand around the Obsidian Throne, as they do every year, to renew their oaths. One by one, they are supposed to kneel.

${s.lords} of them don't.${f(s, 'sella_traitor') ? ` (One lord you'd won over kneels anyway. Somebody warned him what would happen to his family.)` : ''}

${f(s, 'mortal') ? `The throne cracks down the middle with a sound like a bell breaking. The fire goes out of Morvanna's eyes and comes back a plain human brown. For the first time in three hundred years the Empress is mortal, and she knows it.` : f(s, 'weakened') ? `The throne groans but holds. Morvanna staggers, bleeding light from her mouth and eyes, weakened and furious.` : `The throne holds. The lords you bribed kneel fastest. Morvanna turns to you, smiling.`}`,
  choices: [
    { t: `Seize her and put her on trial before the Thirty Crowns`, if: s => f(s, 'mortal'), go: 'end_oath' },
    { t: `Give the crown of Dravenmoor to Kael`, if: s => f(s, 'mortal') && f(s, 'kael_ally'), go: 'end_kael' },
    { t: `Open the palace gates and let the people she enslaved decide`, if: s => f(s, 'mortal') && (f(s, 'slave_friends') || f(s, 'freed_children') || s.stats.charm >= 7), go: 'end_people' },
    { t: `Take the Pact for yourself, while it still burns`, if: s => f(s, 'mortal') && s.corruption >= 40, go: 'end_dark' },
    { t: `Fight the weakened Empress`, if: s => !f(s, 'mortal'), fight: 'morvanna', win: { final: 'end_oath' }, go: 'c6_last', failGo: 'end_pet' }
  ] };

S.c6_last = { ch: 'VI', age: 25, art: 'empress', fx: 'embers', title: 'The Last Breath',
  text: `Morvanna is on her knees in the ash. Three hundred years of fire are going out of her eyes. She looks up at you, and for a moment she looks like a woman who lost her children a long time ago.

"Well?" she says. "Finish it. Or take it. The Pact is right here, child. It's warm. It's only lonely at first."`,
  choices: [
    { t: `Finish it`, go: s => s.final || 'end_crown' },
    { t: `Step aside and let Kael end his mother's reign`, if: s => f(s, 'kael_ally'), go: 'end_kael' },
    { t: `Hand her over to the people she enslaved`, if: s => f(s, 'slave_friends') || f(s, 'freed_children'), go: 'end_people' },
    { t: `Let her live, mortal and powerless, in a cell`, go: 'end_mercy' },
    { t: `Take the Pact. Become the Undying.`, if: s => s.corruption >= 40, go: 'end_dark' }
  ] };

/* ---------------- ENDINGS ---------------- */
const END = (id, kind, title, art, fx, text) => { S[id] = { ending: { kind, title }, art, fx, title, text }; };

END('end_crown', 'victory', 'The Ashborn {Ruler}', 'dawn', 'motes', s => `Morvanna dies on the Greywater plain, and the world goes very quiet.

The Hollow Legion doesn't run. It simply stops, like a puppet with its strings cut, and lays down its arms. Across Eldmark, nine conquered crowns wake up free.

A year later, in the rebuilt chapel of Valerith, twenty-nine kings and queens kneel and crown you {Ruler} of the Thirty Crowns. It's the first time in three hundred years they've knelt to anyone but her.${f(s, 'bren_companion') ? ` Bren stands at the back of the chapel, crying openly, and doesn't care who sees.` : ''}

You rule for forty years. History calls you the Ashborn. You never once sit on a throne made of anyone's bones.`);

END('end_shadow', 'victory', 'A Knife in the Dark', 'night', 'motes', s => `The Empress of Dravenmoor dies in her own bedroom, by the window, with a cup of wine going cold beside her. A small blade does what three hundred years of armies never could.

By morning you're forty miles away. Nobody saw your face. The court blames the Demon Lords, the Lords blame each other, and Dravenmoor tears itself apart in a civil war that frees nine crowns.

Songs are written about the Ember, a ghost who killed a god. None of them get your name right.${f(s, 'double_agent') ? ` Sella sings the worst version loudly in every tavern you visit, just to annoy you.` : ''}

You never take a crown. You never need one. Somewhere in Eldmark there's always a tyrant who sleeps badly, because the Ember is still out there, listening.`);

END('end_heart', 'victory', 'The Heart Beneath the Throne', 'heart', 'ash', `The heart breaks like old glass. Above you, through the whole Obsidian Palace, you hear one long scream. Then every black flame in Nyxhallow goes out at once.

When you climb back to the throne room, Morvanna is lying at the foot of her throne. She looks very young, almost peaceful. In her hand is a little wooden horse, the kind a child plays with. She kept it for three hundred years.

You close her fingers around it properly before you leave.

Dravenmoor falls in a single season. You go home to Valerith and rebuild it stone by stone. You never tell anyone about the horse.`);

END('end_serpent', 'victory', "The Serpent's Kiss", 'throne', 'ash', `She trusted you. That's what makes the blade go in so easily.

Morvanna dies in your arms in front of her whole court, and what you see in her face isn't anger. It's recognition. "Well done," she whispers. "I'd have done the same."

The court is silent. Then Lord Azgeroth kneels. Then the others. You are her named heir, after all.

You give Dravenmoor back to its people and the conquered crowns back to their heirs. It takes ten years. Some people still call you the Traitor of the Feast. You've decided you can live with that.`);

END('end_cup', 'victory', 'The Cup of Dawn', 'poison', 'motes', `Morvanna drinks. She sets the cup down, frowns, and touches her lips, as if she's tasting sunlight for the first time in three centuries.

"Dawn Lily," she says, almost admiring. "Clever child."

She doesn't scream. She sits on her throne and watches the candles while it happens. It takes about as long as a song. Nobody in the hall moves to stop it, and nobody moves to help her.

By midnight the Empress is dead and you're walking out of the gate in a servant's apron while the bells of Nyxhallow ring and ring. The war is over within a month. Historians will argue for a century about who poured the wine.`);

END('end_shared', 'bitter', 'The Shared Cup', 'poison', 'ash', `The nightshade burns all the way down. You knew it might.

Morvanna watches you drink, nods, and drains her own cup. She understands a heartbeat later. You both sit down on the throne steps at the same moment, like two old friends tired after a long day.

"Your mother did something like this," she says. "Brave and stupid. You have her eyes."

"I know," you say, though you don't.

The Empress of Dravenmoor and the last heir of Valerith die together on the steps of the Obsidian Throne. The Thirty Crowns go free. They build you a statue in Valerith. It doesn't look much like you, but they got the eyes right.`);

END('end_oath', 'victory', 'The Breaking of Oaths', 'council', 'motes', `Without her lords' oaths, the Undying Empress is just a woman, and a woman can be judged.

You put her on trial before all Thirty Crowns, in the same hall where three hundred years ago they murdered her children. She doesn't deny anything. At the end she asks one question: "And who will judge you, when it's your turn?"

The crowns sentence her to death. She meets it at dawn without a word.

Then they turn to look at you. Nine lords who broke their oaths once could break them again, and twenty-nine crowns are watching what you'll do with the power you took. You spend the rest of your life proving their fear was wasted.`);

END('end_kael', 'victory', 'Two Crowns from the Ashes', 'dawn', 'motes', `Kael takes the sword from your hand. "She's my mother," he says. "It should be me."

It's quick. Afterward he closes her eyes and sits beside her for a long time. You let him.

Crown Prince Kaelith becomes Emperor Kaelith the Last. His first decree frees every slave in Dravenmoor. His second gives the nine conquered crowns back. His third is a treaty with Valerith, signed by the two of you in the ruins of the chapel crypt where all of this began.

People say the {heir} of Valerith and the last Demon Emperor are friends. People say more than that, too. You let them talk.`);

END('end_people', 'victory', "The People's Fire", 'dawn', 'embers', `You don't kill her. You open the palace gates.

The slaves of Nyxhallow come in: kitchen hands, pit fighters, children who were sold by the cartload. Thousands of them. Morvanna, mortal now, stands in front of her throne and looks at the people she ruled for three hundred years, and for the first time she has nothing to say.

What happens next belongs to them. You don't watch.

Dravenmoor becomes a free city ruled by a council of former slaves. They give you the title Friend of the Gate, which you value more than any crown, though you take Valerith's too.`);

END('end_mercy', 'bitter', 'The Mercy of Ash', 'ruins', 'motes', `You lower your blade. "No. You'll live. Mortal. In a cell with a window, for as long as a mortal lives."

She laughs, then stops laughing when she realizes you mean it.

Morvanna lives eleven more years in a tower in Valerith. You visit her every winter. You argue about history, about crowns, about her children and your parents. On the last visit she gives you a wooden horse, a child's toy, and asks you to bury it with her.

Some call your mercy weakness. But the Thirty Crowns are free, and the vengeance that made her ends with you.`);

END('end_dark', 'dark', 'The New Undying', 'empress', 'magic', `You reach into the fire and take the Pact. It burns worse than anything has ever burned. Then it stops burning, and you feel nothing at all.

Morvanna dies smiling. "Lonely at first," she reminds you.

You sit on the Obsidian Throne. The Demon Lords kneel. The Hollow Legion turns its empty eyes toward you and waits. Somewhere out in the Mirewood, a child will be born on the night of a war you'll start next year.

{name} the Undying rules the Thirty Crowns for six hundred years. You meant to be kinder than she was. For a while, you were.`);

END('end_heir', 'dark', 'The Ashen Heir', 'throne', 'magic', `You kneel, take her hand, and don't let go.

Morvanna names you heir before the whole court. She teaches you everything: how to rule, how to make people afraid, and how to make it look like mercy. You tell yourself you're waiting for the right moment.

The moment never comes. Thirty years later you lead the Hollow Legion against Marrowind yourself, and Lord Corvin's grandson spits at your feet the way you once wanted to spit at hers.

The child of ash became the Empress's favorite weapon. In a burned crypt in Valerith, two ghosts are still waiting for you.`);

END('end_ash', 'death', 'Ash to Ash', 'death', 'ash', `The last thing you see is the sky over the Greywater, full of smoke and crows.

The free crowns break that day. Within ten years every one of the Thirty kneels to Dravenmoor. Your name becomes a warning mothers whisper to children who dream too big.

But in the Mirewood, in a charcoal-burners' village, a little girl hears the story of the {heir} who stood against the Empress and lost. She picks up a stick and swings it like a sword.

The fire you started hasn't gone out. It's just very small now.`);

END('end_hanged', 'death', 'The Hanged Shadow', 'death', 'fog', `They hang you from the walls of the Obsidian Palace at dawn, with a sign around your neck that says ASSASSIN.

Morvanna comes to watch. She stands under the gallows for a long time, and just before the trapdoor opens she says, quietly, "You were close. Closer than anyone in a hundred years." You think she means it kindly.

The Empress rules on. In the guild halls of Ossory, apprentices still study your route through the palace and argue about where you went wrong.`);

END('end_pet', 'death', 'Her Favorite', 'dungeon', 'ash', `You lose. She doesn't kill you. That's worse.

Morvanna keeps you chained beside her throne in a silver collar, and every year at the Feast of Ash she tells the story of the {heir} of Valerith who almost got her. The court laughs. After a while you stop hearing it.

You live a very long time. Her blood sees to that.

Every few decades a new young rebel is dragged in front of the throne. You always look for your own face in theirs, and sometimes you find it.`);

END('end_young', 'death', 'A Short Song', 'death', 'ash', s => `Your story ends early, in mud and cold and blood, far from any throne.

Nobody sings about you. The Empress never learns your name.${f(s, 'bren_alive') ? ` Bren buries you under a pine tree and sits beside the grave until the snow covers it.` : ''}

The Thirty Crowns fall one by one in the years that follow, and whatever you might have become goes into the dark with you.

Some stories are short. That doesn't mean they didn't matter. It means they didn't win.`);

END('end_quiet', 'bitter', 'A Quiet Life by the Sea', 'dawn', 'motes', `You and Sella walk until the trees end, the land runs out, and there's nothing in front of you but grey sea.

You fish. You mend nets. You grow old in a village where nobody has heard of Valerith. Sometimes ships bring news of burning crowns in the south, and you go quiet for a day or two.

When you're sixty, a ship brings word that the last free crown has fallen and Morvanna rules all Thirty.

Sella takes your hand. "You couldn't have stopped it," she says. Neither of you will ever know if that's true.`);

/* ---------------- RANDOM EVENTS ---------------- */
const EV = [
  { id: 'peddler', when: s => s.age >= 12, art: 'forest', fx: 'motes', title: 'The One-Eyed Peddler',
    text: `A one-eyed peddler with a mule blocks the road, grinning. "Everything a hero needs," he says, "and a few things a hero shouldn't."`,
    choices: [
      { t: `Buy a Healing Draught`, req: s => s.gold >= 20, rq: `Needs 20 gold`, e: { gold: -20, item: 'Healing Draught' }, out: `It smells like pine and honey. He swears it works. Ysolde would approve.` },
      { t: `Buy the "real star-iron" he keeps under a cloth`, if: s => s.age >= 15 && !star(s), req: s => s.gold >= 120, rq: `Needs 120 gold`, e: { gold: -120, item: 'Star-Iron Shard' },
        out: `He swears it's real. It hums when you hold it. To your amazement, it is.` },
      { t: `Rob him`, check: { stat: 'cunning', dc: 5 }, win: { gold: 40, corruption: 4 }, out: `His purse is heavier than his mule. He never sees you.`,
        lose: { hp: -20, corruption: 2 }, failOut: `The mule kicks you in the chest. The peddler laughs all the way down the road.` },
      { t: `Move on` }
    ] },
  { id: 'bandits', art: 'forest', fx: 'fog', title: 'Ambush on the Road',
    text: `Arrows thud into the road ahead of you. A big man with a notched sword steps out of the trees. "Toll road," he says. "The toll is everything."`,
    choices: [
      { t: `Fight the bandit chief`, fight: 'bandit', win: { gold: 30, might: 1 }, out: `The bandits scatter when he falls. His purse is surprisingly full.`, lose: s => ({ gold: -Math.floor(s.gold / 2) }), failOut: `They leave you in the ditch with half your purse.` },
      { t: `Pay the toll`, req: s => s.gold >= 25, rq: `Needs 25 gold`, e: { gold: -25 }, out: `Not everything. Just enough. He tips his hat.` },
      { t: `Talk them into joining your cause`, check: { stat: 'charm', dc: 5 }, win: { army: 30, influence: 3 }, out: `Turns out most of them are deserters from the Legion's wars. Thirty of them follow you out of the forest.`,
        lose: { hp: -15, gold: -10 }, failOut: `They laugh, take some of your silver, and give you a black eye for the trouble.` }
    ] },
  { id: 'plague', when: s => s.age >= 14, art: 'death', fx: 'fog', title: 'The Fever Village',
    text: `A village with chalk crosses on every door. Fever. A mother in a doorway holds out a child to you without saying a word.`,
    choices: [
      { t: `Stay and treat the sick`, check: { stat: 'lore', dc: 4 }, win: { charm: 1, influence: 5, corruption: -5 }, out: `Willow bark, clean water, boiled linen. Nine days later the fever breaks. They name a well after you.`,
        lose: { hp: -25, charm: 1 }, failOut: `You catch the fever yourself and nearly die in a stranger's bed. Some of them live. Not enough.` },
      { t: `Burn the village to stop the spread`, e: { corruption: 10, influence: 2 }, out: `It stops the spread. You'll smell that smoke for the rest of your life.` },
      { t: `Pass by`, out: `You keep walking. The child's face follows you for days.` }
    ] },
  { id: 'tavern', when: s => s.age >= 14, art: 'tavern', fx: 'motes', title: 'The Gambling Den',
    text: `A smoky tavern, a table of dice, and a blacksmith with arms like hams challenging anyone to arm-wrestle.`,
    choices: [
      { t: `Roll the bones for 20 silver`, req: s => s.gold >= 20, rq: `Needs 20 gold`, check: { stat: 'cunning', dc: 5 }, win: { gold: 30 }, out: `Loaded dice are only cheating if you get caught. You win thirty.`, lose: { gold: -20 }, failOut: `The house wins. The house always wins.` },
      { t: `Arm-wrestle the blacksmith`, check: { stat: 'might', dc: 5 }, win: { gold: 25, influence: 2 }, out: `The table cracks. So does his pride. The room cheers you all night.`, lose: { hp: -10 }, failOut: `He slams your hand through the tabletop.` },
      { t: `Buy a round and listen`, req: s => s.gold >= 5, rq: `Needs 5 gold`, e: { gold: -5, flag: 'heart_rumor' }, out: `An old Legion veteran, very drunk, tells you the Empress's heart isn't in her chest. "Under the throne," he whispers. "In a cage of thorns. Saw it once."` }
    ] },
  { id: 'shrine', art: 'heart', fx: 'magic', title: 'The Whispering Shrine',
    text: `In a hollow among the roots you find a shrine of black stone. It's warm to the touch. It whispers your name, your real name, the one you don't know yet.`,
    choices: [
      { t: `Offer it your blood`, e: { hp: -15, corruption: 12, might: 1, lore: 1, maxhp: 10 }, out: `The stone drinks. Strength floods into you, and something else comes with it, something that likes you a little too much.` },
      { t: `Smash it`, check: { stat: 'might', dc: 4 }, win: { influence: 3, corruption: -5 }, out: `It shatters with a sound like a scream. The forest seems to breathe easier.`, lose: { hp: -20 }, failOut: `The stone bites back. Your hands blister for a week.` },
      { t: `Listen to what it says`, e: { lore: 1, corruption: 5 }, out: `It tells you about a queen who lost three children, and about how warm the Abyss is when you're cold. You leave shivering.` }
    ] },
  { id: 'dream', when: s => s.age >= 15, art: 'empress', fx: 'magic', title: 'A Visitor in Dreams',
    text: `You dream of a woman with a crown of horns sitting at the end of your bed. "Come home, child," Morvanna says. "You've been away so long."`,
    choices: [
      { t: `Force yourself awake`, check: { stat: 'lore', dc: 5 }, win: { lore: 1, corruption: -5 }, out: `You tear yourself out of the dream. Your sheets are frozen stiff.`, lose: { corruption: 8 }, failOut: `You can't wake. She talks all night, gently, and some of it sounds true.` },
      { t: `Ask her why`, e: { lore: 1, rel: { morvanna: 10 }, meet: 'morvanna' }, out: `"Because they took mine," she says, and the dream fills with the smell of burning nurseries. When you wake, your cheeks are wet.` },
      { t: `Tell her: "I'm coming for you"`, e: { might: 1, rel: { morvanna: 5 }, meet: 'morvanna' }, out: `She smiles in the dream. "I know," she says. "I'm looking forward to it."` }
    ] },
  { id: 'hunter', when: s => s.age >= 14, art: 'death', fx: 'fog', title: 'Ser Aldous the Demon Hunter',
    text: `An old knight in silver-chased armor sits by a graveyard fire. Ser Aldous has hunted demons for forty years. "Thirty silver and I'll teach you a trick or two," he says. "Or come help me with the thing in that crypt."`,
    choices: [
      { t: `Pay for his training`, req: s => s.gold >= 30, rq: `Needs 30 gold`, e: { gold: -30, might: 1, cunning: 1 }, out: `A week of brutal lessons. You learn where demons are soft, and where they only pretend to be.` },
      { t: `Join his hunt`, fight: 'ghoul', win: { influence: 5, item: 'Healing Draught' }, out: `Aldous claps you on the back and gives you a draught from his own pack. "Not bad, for a beginner."`, lose: {}, failOut: `Aldous finishes the ghoul and drags you out. "Lesson one," he says. "Don't do that."` },
      { t: `Decline politely` }
    ] },
  { id: 'deserter', when: s => s.age >= 15, art: 'forest', fx: 'rain', title: 'The Deserter',
    text: `A Hollow Legion soldier, maybe sixteen years old, kneels in the mud with his hands up. "Please," he says. "I don't want to go back. They'll feed me to the hounds."`,
    choices: [
      { t: `Shelter him`, e: { charm: 1, flag: 'legion_tactics' }, out: `He tells you everything: how the Legion marches, how it signals, how it panics. You'll remember all of it.` },
      { t: `Turn him in for the bounty`, e: { gold: 30, corruption: 5 }, out: `Thirty silver. He doesn't look at you as they take him away.` },
      { t: `Let him go his own way`, out: `He runs into the trees. You hope he makes it.` }
    ] },
  { id: 'festival', art: 'village', fx: 'embers', title: 'Midsummer Fires',
    text: `Midsummer. Bonfires on every hill, music, cider, and a wrestling ring in the square.`,
    choices: [
      { t: `Dance until dawn`, e: { charm: 1, rel: { sella: 10 } }, out: `Sella drags you into the circle and won't let go. For one night you forget about everything else.` },
      { t: `Work the crowd for purses`, check: { stat: 'cunning', dc: 4 }, win: { gold: 35 }, out: `Drunk people are generous, even when they don't know it.`, lose: { gold: -10, hp: -10 }, failOut: `Caught. You pay a fine and take a beating.` },
      { t: `Fight in the ring`, check: { stat: 'might', dc: 4 }, win: { gold: 20, influence: 2 }, out: `Three bouts, three wins, and a ribbon you pretend not to care about.`, lose: { hp: -15 }, failOut: `You lose to a shepherd. Everyone saw.` }
    ] },
  { id: 'child', when: s => s.age >= 14, art: 'ruins', fx: 'ash', title: 'The Half-Demon Girl',
    text: `Villagers with pitchforks are chasing a little girl with small horns and frightened eyes. "Demon spawn!" they shout. She runs straight to you and hides behind your legs.`,
    choices: [
      { t: `Protect her`, check: { stat: 'charm', dc: 5 }, win: { influence: 3, corruption: -3 }, out: `You talk them down. The girl's name is Nim. You find her a home with people who don't care about horns.`,
        lose: { hp: -20, corruption: -3 }, failOut: `They don't listen. You get her out, and get a pitchfork wound for your trouble.` },
      { t: `Hand her over`, e: { corruption: 6, influence: 2 }, out: `The villagers cheer. You don't stay to see what happens next.` },
      { t: `Sell her to a passing slaver`, e: { gold: 40, corruption: 10 }, out: `Forty silver. You tell yourself she'd have died anyway.` }
    ] },
  { id: 'letter', when: s => km(s) && s.age >= 15, art: 'night', fx: 'magic', title: 'A Raven at Night',
    text: `A raven lands on your sill with a letter tied to its leg. No signature, but you know the handwriting from a summer long ago. "Are you still alive? I think about the river. — K."`,
    choices: [
      { t: `Write back kindly`, e: { rel: { kael: 15 } }, out: `You write for an hour. The raven comes back every season after that.` },
      { t: `Ignore it`, out: `The raven waits all night, then leaves.` },
      { t: `Burn it`, e: { rel: { kael: -10 } }, out: `Somewhere, someone feels it burn.` }
    ] },
  { id: 'hermit', when: s => s.age >= 16, art: 'temple', fx: 'snow', title: 'The Hermit in the Storm',
    text: `A blizzard drives you into a cave where an old hermit sits by a fire. He looks at you with milky eyes. "Ah," he says. "The ember. Sit. I can tell you how you'll die, if you like."`,
    choices: [
      { t: `Ask how you'll die`, e: { lore: 1 }, out: s => {
          const st = s.stats; const top = Object.keys(st).sort((a, b) => st[b] - st[a])[0];
          const tip = { might: `"With a sword in your hand, if you're lucky. Find star-iron, or she'll get up again."`, cunning: `"In the dark, in her own house. Learn where she hides her heart."`, charm: `"Surrounded by people who love you. Win her lords. Win her people. Win her, if you can stomach it."`, lore: `"From a cup. The white flower on the peak. Remember: it only harms the Undying."` }[top];
          return `He closes his eyes. ${tip} Then he goes back to sleep.`; } },
      { t: `Share your food with him`, e: { charm: 1, maxhp: 5 }, out: `He eats like a wolf and tells you stories all night. You leave in the morning feeling oddly lighter.` },
      { t: `Steal his supplies while he sleeps`, e: { gold: 15, corruption: 3, item: 'Healing Draught' }, out: `He wasn't asleep. "Take it," he says without opening his eyes. "You'll need it more."` }
    ] }
];

/* ---------------- HELPERS ---------------- */
function titleOf(s) {
  const m = s.sex === 'f';
  if (s.age === 0) return 'Newborn of Valerith';
  if (f(s, 'recognized')) return `${m ? 'Princess' : 'Prince'} of Valerith`;
  if (s.path === 'court') return f(s, 'free') ? 'Squire of the Obsidian Guard' : 'Kitchen slave, Nyxhallow';
  if (s.path === 'sword') return f(s, 'knighted') ? 'Knight of Hale' : 'Sellsword of the Free Company';
  if (s.path === 'shadow') return 'Knife of the Whisper Guild';
  if (s.path === 'lore') return 'Scholar of the Dawn Monastery';
  return s.age < 14 ? 'Child of Thornwick' : 'Orphan of Thornwick';
}
function bondName(s, k) {
  return { bren: 'Bren', sella: 'Sella', ysolde: 'Ysolde', kael: f(s, 'kael_revealed') ? 'Prince Kaelith' : 'Kael', corvin: 'Lord Corvin', morvanna: 'Empress Morvanna' }[k] || k;
}
const BOND_NOTE = { bren: 'Your guardian', sella: 'Childhood friend', ysolde: 'Herb-witch of Thornwick', kael: 'The boy from the river', corvin: 'King of Marrowind', morvanna: 'The Demon Empress' };
const SECRETS = [
  ['prophecy', `Ysolde's riddle: three roads to kill an Undying, one road to her throne.`],
  ['knows_three_ways', `Star-iron, the hidden heart, the nine oaths, or take the Pact yourself.`],
  ['heart_rumor', `Her heart is kept beneath the Obsidian Throne.`],
  ['heart_known', `You know the exact way to the Reliquary.`],
  ['poison_lore', `The Dawn Lily kills the Undying and spares the living.`],
  ['bren_truth', `Bren was the Legion captain who held the torch the night your parents died.`],
  ['kael_revealed', `Kael is Crown Prince Kaelith, Morvanna's only son.`],
  ['double_agent', `Sella feeds Dravenmoor's spymaster your lies.`],
  ['legion_tactics', `You know how the Hollow Legion signals and panics.`],
  ['shadowtouched', `You can bend shadows, a little.`],
  ['ember_kiss', `Her blood runs in your veins.`],
  ['noticed', `The Empress has noticed you.`],
  ['recognized', `The free crowns recognize your claim to Valerith.`]
];
const DESIGN_NAME = { war: 'War', shadow: 'Shadow', serpent: 'The Serpent', cup: 'The Cup', oath: 'Break the Oaths' };
const PATH_NAME = { sword: 'The Free Company', shadow: 'The Whisper Guild', lore: 'The Dawn Monastery', court: 'The Obsidian Palace' };

function newState(name, sex) {
  return {
    name, sex, scene: 'p1', ch: null, age: 0,
    stats: { might: 1, cunning: 1, charm: 1, lore: 1 },
    hp: 100, maxhp: 100, gold: 5, influence: 0, army: 0, corruption: 0,
    rel: { bren: 40, sella: 10, ysolde: 10, kael: 0, corvin: 0, morvanna: 0 },
    met: { bren: 1, sella: 1, ysolde: 1 },
    flags: {}, items: [], path: null, design: null, final: null,
    seen: [], ret: null, edge: 0, lords: 0, oathTries: 0, log: [], outcome: null, turns: 0
  };
}

window.ASHBORN = { scenes: S, events: EV, foes: FOES, CH, CHN, titleOf, bondName, BOND_NOTE, SECRETS, DESIGN_NAME, PATH_NAME, newState, star, lily };
})();
