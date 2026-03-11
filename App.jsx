import { useState, useRef, createContext, useContext } from "react";

// Utility
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickRandom(arr, n = 1) { return shuffle(arr).slice(0, n); }
function pickOne(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Language Context
const LangContext = createContext("bm");
function useLang() { return useContext(LangContext); }

// UI Strings
const UI = {
  appName: { en: "🎨 KidsPlan", bm: "🎨 KidsPlan" },
  appSub: { en: "Preschool Activity Planner", bm: "Perancang Aktiviti Prasekolah" },
  startOver: { en: "← Start Over", bm: "← Mula Semula" },
  generated: { en: "generated", bm: "dijana" },
  step1: { en: "What do you want to generate?", bm: "Apa yang anda mahu generate?" },
  step2: { en: "Choose a learning theme", bm: "Pilih tema pembelajaran" },
  step3: { en: "Children's age", bm: "Umur kanak-kanak" },
  step4: { en: "Class duration (minutes)", bm: "Durasi kelas (minit)" },
  generateBtn: { en: "✨ Generate Now!", bm: "✨ Generate Sekarang!" },
  generating: { en: "Generating...", bm: "Sedang generate..." },
  history: { en: "📜 Generation History", bm: "📜 Sejarah Generate" },
  generateAgain: { en: "← Generate Again", bm: "← Generate Lagi" },
  regenerate: { en: "🔄 Regenerate", bm: "🔄 Regenerate" },
  objective: { en: "🎯 LEARNING OBJECTIVE", bm: "🎯 OBJEKTIF PEMBELAJARAN" },
  materials: { en: "MATERIALS", bm: "BAHAN" },
  steps: { en: "STEPS", bm: "LANGKAH" },
  tip: { en: "Tip", bm: "Tip" },
  weekSchedule: { en: "📅 Week Schedule", bm: "📅 Jadual Minggu" },
  lessonPlan: { en: "📋 Lesson Plan", bm: "📋 Lesson Plan" },
  activities: { en: "🎮 Activities", bm: "🎮 Aktiviti" },
  worksheetTab: { en: "📝 Worksheet", bm: "📝 Worksheet" },
  craftTab: { en: "✂️ Craft", bm: "✂️ Kraf" },
  min: { en: "min", bm: "min" },
};
function t(key, lang) { return UI[key]?.[lang] || UI[key]?.en || key; }

// Data Constants
const THEMES = [
  { id:"animals",label:{en:"🐾 Animals",bm:"🐾 Haiwan"},emoji:"🦁",color:"#FF6B35" },
  { id:"nature",label:{en:"🌿 Nature",bm:"🌿 Alam Semula Jadi"},emoji:"🌳",color:"#2D936C" },
  { id:"space",label:{en:"🚀 Outer Space",bm:"🚀 Angkasa Lepas"},emoji:"🪐",color:"#5B4FCF" },
  { id:"ocean",label:{en:"🐠 Ocean",bm:"🐠 Lautan"},emoji:"🐙",color:"#0891B2" },
  { id:"food",label:{en:"🍎 Food",bm:"🍎 Makanan"},emoji:"🧁",color:"#E63946" },
  { id:"transport",label:{en:"🚗 Transport",bm:"🚗 Pengangkutan"},emoji:"✈️",color:"#457B9D" },
  { id:"body",label:{en:"🧍 Human Body",bm:"🧍 Tubuh Badan"},emoji:"🫀",color:"#E76F51" },
  { id:"weather",label:{en:"🌤️ Weather",bm:"🌤️ Cuaca"},emoji:"🌈",color:"#F4A261" },
  { id:"colors",label:{en:"🎨 Colors & Shapes",bm:"🎨 Warna & Bentuk"},emoji:"🔴",color:"#9B5DE5" },
  { id:"family",label:{en:"👨‍👩‍👧 Family",bm:"👨‍👩‍👧 Keluarga"},emoji:"🏠",color:"#F15BB5" },
  { id:"numbers",label:{en:"🔢 Numbers",bm:"🔢 Nombor"},emoji:"🧮",color:"#00BBF9" },
  { id:"alphabet",label:{en:"🔤 Alphabet",bm:"🔤 Huruf ABC"},emoji:"📖",color:"#FEE440" },
];

const AGE_GROUPS = [
  { id:"3-4",label:{en:"3-4 years",bm:"3-4 tahun"},desc:{en:"Pre-kindergarten",bm:"Pra-tadika"} },
  { id:"4-5",label:{en:"4-5 years",bm:"4-5 tahun"},desc:{en:"Early Kindergarten",bm:"Tadika Awal"} },
  { id:"5-6",label:{en:"5-6 years",bm:"5-6 tahun"},desc:{en:"School-Ready",bm:"Tadika Sedia Sekolah"} },
];

const GENERATE_TYPES = [
  { id:"lesson",label:{en:"📋 Lesson Plan",bm:"📋 Lesson Plan"},desc:{en:"Complete daily teaching plan",bm:"Rancangan pengajaran harian lengkap"} },
  { id:"activity",label:{en:"🎮 Learning Activity",bm:"🎮 Learning Activity"},desc:{en:"Interactive learning activities",bm:"Aktiviti pembelajaran interaktif"} },
  { id:"worksheet",label:{en:"📝 Worksheet Ideas",bm:"📝 Worksheet Ideas"},desc:{en:"Engaging worksheet ideas",bm:"Idea lembaran kerja menarik"} },
  { id:"craft",label:{en:"✂️ Craft Ideas",bm:"✂️ Craft Ideas"},desc:{en:"Creative craft projects",bm:"Projek kraf tangan kreatif"} },
  { id:"pack",label:{en:"📦 Theme Pack",bm:"📦 Theme Pack"},desc:{en:"Complete theme learning package",bm:"Pakej pembelajaran lengkap satu tema"} },
];

const DAYS = { en:["Monday","Tuesday","Wednesday","Thursday","Friday"], bm:["Isnin","Selasa","Rabu","Khamis","Jumaat"] };

// Content Banks (bilingual)
const OPENING = {
  animals:{en:["Song: \"Old MacDonald\" with hand movements","Show animal flashcards — mimic animal sounds","Question: \"What animal do you like? Why?\"","Sort animals by habitat (land/water/air)","Guessing game: Teacher makes sounds, students guess","Short video: Animals at the zoo","Bring picture of teacher's pet — tell the story","Game: \"I spy an animal starting with...\"","Simple puppet show: Animals in the forest","Show plastic animal models — touch and identify"],bm:["Nyanyian: \"Old MacDonald\" dengan gerakan tangan","Tunjukkan flashcard haiwan — tiru bunyi haiwan","Soalan pencetus: \"Haiwan apa yang kamu suka? Kenapa?\"","Sorting haiwan mengikut habitat (darat/air/udara)","Teka-teki: Guru buat bunyi haiwan, murid teka","Video pendek: Haiwan di zoo — bincang","Bawa gambar haiwan peliharaan guru — ceritakan","Permainan: \"Saya nampak haiwan bermula huruf...\"","Puppet show ringkas: Haiwan bertemu di hutan","Tunjukkan model haiwan plastik — sentuh dan kenal pasti"]},
  nature:{en:["Take students outside for nature walk","Collect leaves, flowers, stones in exploration basket","Question: \"What did you see outside?\"","Song: \"Green tree, tall tree\" with movements","Show pictures of 4 seasons — discuss","Experiment: Put flowers in colored water","Bring live plant — touch leaves and smell flowers","Video: Seed growing into tree (time lapse)","Sorting game: Living vs non-living things","Picture story about the water cycle"],bm:["Bawa murid ke luar untuk nature walk","Kumpul daun, bunga, batu dalam bakul penerokaan","Soalan: \"Apa yang kamu nampak di luar?\"","Nyanyian: \"Pokok hijau, pokok tinggi\" dengan gerakan","Tunjukkan gambar 4 musim — bincang","Eksperimen: Letak bunga dalam air berwarna","Bawa tumbuhan hidup — sentuh daun dan bau bunga","Video: Biji benih tumbuh jadi pokok (time lapse)","Sorting: Benda hidup vs bukan hidup","Cerita bergambar tentang kitaran air"]},
  space:{en:["Song: \"Twinkle Twinkle Little Star\" with movements","Show planet pictures — guess names","Count down 10 to 1 — \"Rocket launch!\"","Question: \"What's in the sky at night?\"","Video: Astronauts at the space station","Show solar system model — hold planets","Darken room — torch stars on ceiling","Story: \"Journey to the Moon\"","Walk slowly like on the moon","Show rock — \"this is a moon rock!\""],bm:["Nyanyian: \"Twinkle Twinkle Little Star\" dengan gerakan","Tunjukkan gambar planet — teka nama","Kira mundur 10 ke 1 — \"Pelancaran roket!\"","Soalan: \"Apa di langit waktu malam?\"","Video: Angkasawan di stesen angkasa","Tunjukkan model sistem suria — pegang planet","Gelap bilik — torch buat bintang di siling","Cerita: \"Perjalanan ke bulan\"","Jalan perlahan macam di bulan","Tunjukkan batu — \"ini batu bulan!\""]},
  ocean:{en:["Song: \"Baby Shark\" with movements","Show real seashells — touch and listen","Video: Underwater world — fish and coral","Question: \"Who's been to the beach?\"","Play ocean wave sounds — close eyes, imagine","Blue water container + plastic fish — mini ocean","Story: \"Nemo Finds Friends\"","Riddle: \"I live in water, I have fins...\"","Move like fish, crabs, jellyfish","Show world map — point out oceans"],bm:["Nyanyian: \"Baby Shark\" dengan gerakan","Tunjukkan cengkerang sebenar — sentuh dan dengar","Video: Dunia bawah laut — ikan dan terumbu karang","Soalan: \"Siapa pernah pergi pantai?\"","Bunyi ombak — pejam mata dan bayangkan","Air biru dalam bekas + ikan plastik — mini ocean","Cerita: \"Nemo Mencari Kawan\"","Teka-teki: \"Saya hidup dalam air, ada sirip...\"","Bergerak macam ikan, ketam, obor-obor","Tunjukkan peta dunia — tunjuk lautan"]},
  food:{en:["Bring real fruits — touch, smell, identify","Song: \"Apples and Bananas\"","Question: \"What's your favorite food?\"","Sort: Healthy vs less healthy food","Show food pyramid — explain simply","Smell game: Close eyes, guess food","Video: How bread is made","Bring real vegetables — identify them","Story: \"The Very Hungry Caterpillar\"","Game: \"I like to eat...\" — continue"],bm:["Bawa buah sebenar — sentuh, bau, kenal pasti","Nyanyian: \"Apples and Bananas\"","Soalan: \"Makanan kegemaran kamu apa?\"","Sorting: Makanan sihat vs kurang sihat","Tunjukkan piramid makanan — terangkan mudah","Permainan bau: Tutup mata, teka makanan","Video: Bagaimana roti dibuat","Bawa sayur sebenar — kenal pasti","Cerita: \"Ulat Yang Sangat Lapar\"","Permainan: \"Saya suka makan...\" — sambung"]},
  transport:{en:["Song: \"Wheels On The Bus\" with movements","Show vehicle models — identify and make sounds","Question: \"How did you get to school?\"","Video: Different vehicles around the world","Sort: Land, water, air vehicles","Sound game: Play vehicle sounds, guess","Show traffic picture — discuss lights","Story: \"The Little School Bus\"","Make a train line — walk around class","Riddle: \"I have wings but not a bird...\""],bm:["Nyanyian: \"Wheels On The Bus\" dengan gerakan","Tunjukkan model kenderaan — kenal pasti dan buat bunyi","Soalan: \"Macam mana kamu datang sekolah?\"","Video: Pelbagai kenderaan di dunia","Sorting: Kenderaan darat, air, udara","Permainan bunyi: Mainkan bunyi kenderaan, teka","Tunjukkan gambar trafik — bincang lampu isyarat","Cerita: \"Bas Sekolah Kecil\"","Buat barisan keretapi — jalan keliling kelas","Teka-teki: \"Ada sayap tapi bukan burung...\""]},
  body:{en:["Song: \"Head Shoulders Knees and Toes\"","Point to body parts teacher names","Question: \"How many fingers? Let's count!\"","Draw body on big paper — label together","Simon Says — touch ears, nose, etc.","Mirror game: One moves, one copies","Video: How the heart works (animation)","Toy stethoscope — listen to heartbeat","Senses game: Close eyes, guess by touch","Story: \"My Amazing Body\""],bm:["Nyanyian: \"Head Shoulders Knees and Toes\"","Tunjuk bahagian badan yang guru sebut","Soalan: \"Berapa jari? Cuba kira!\"","Lukis badan di kertas besar — labelkan","Simon Says — sentuh telinga, hidung","Cermin: Seorang gerak, seorang tiru","Video: Bagaimana jantung berfungsi","Stetoskop mainan — dengar degupan jantung","Permainan deria: Tutup mata, teka sentuhan","Cerita: \"Tubuh Badan Saya Hebat\""]},
  weather:{en:["Look outside — \"What's the weather today?\"","Song: \"Rain Rain Go Away\"","Show weather pictures — mimic actions","Video: How rain happens (animation)","Make weekly weather chart","Question: \"What do you wear when it rains?\"","Weather sounds — guess rain, thunder, wind","Story: \"Rainbow After The Rain\"","Experiment: Spray water — mini rainbow","Freeze when \"Thunder!\", dance when \"Sunshine!\""],bm:["Tengok luar — \"Cuaca apa hari ini?\"","Nyanyian: \"Rain Rain Go Away\"","Tunjukkan gambar cuaca — tiru aksi","Video: Bagaimana hujan terjadi","Buat carta cuaca mingguan","Soalan: \"Apa kamu pakai kalau hujan?\"","Bunyi cuaca — teka hujan, guruh, angin","Cerita: \"Pelangi Selepas Hujan\"","Eksperimen: Spray air — pelangi mini","Freeze bila \"Guruh!\", menari bila \"Matahari!\""]},
  colors:{en:["Song: \"I Can Sing A Rainbow\"","Show color cards — find same-color objects","Sort classroom objects by color","Question: \"What's your favorite color?\"","\"I spy something that is...red!\"","Show shapes — circle, triangle, square, star","Color mixing: Red + yellow = orange!","Story: \"A World Without Color\"","Bring prism — show rainbow from light","Draw shapes in air — guess the shape"],bm:["Nyanyian: \"I Can Sing A Rainbow\"","Tunjukkan kad warna — cari benda sama warna","Sorting benda di kelas mengikut warna","Soalan: \"Warna kegemaran kamu apa?\"","\"Saya nampak sesuatu berwarna...merah!\"","Tunjukkan bentuk — bulat, segi tiga, segi empat","Campur warna: Merah + kuning = oren!","Cerita: \"Dunia Tanpa Warna\"","Bawa prisma — tunjukkan pelangi","Lukis bentuk di udara — teka bentuk apa"]},
  family:{en:["Song: \"My Family\" with finger movements","Question: \"Who is in your family?\"","Show different family types — discuss","Each student shows family photo","Story: \"The Bear Family\"","Role play: Play house","Draw simple family tree","Video: Animal families caring for babies","\"What does your family do together?\"","Song: \"I Love Mommy, I Love Daddy\""],bm:["Nyanyian: \"Keluarga Saya\" dengan gerakan jari","Soalan: \"Siapa dalam keluarga kamu?\"","Tunjukkan pelbagai jenis keluarga — bincang","Setiap murid tunjuk gambar keluarga","Cerita: \"Keluarga Beruang\"","Main masak-masak sebagai keluarga","Lukis pokok keluarga mudah","Video: Keluarga haiwan jaga anak","\"Apa keluarga kamu suka buat bersama?\"","Nyanyian: \"Sayang Ibu Sayang Ayah\""]},
  numbers:{en:["Song: \"One Two Three Four Five\"","Count 1-10 with clapping","\"How old are you? Show with fingers!\"","Teacher shows number — jump that many times","Show big number cards — trace in air","Count things in class — chairs? windows?","Video: Numbers in everyday life","Countdown: \"10, 9, 8... rocket launch!\"","Dice game: Roll, count dots, jump","Story: \"10 Little Fish\""],bm:["Nyanyian: \"One Two Three Four Five\"","Kira 1-10 dengan tepukan tangan","\"Berapa umur kamu? Tunjuk jari!\"","Guru tunjuk nombor — lompat sekian kali","Tunjukkan kad nombor besar — trace di udara","Kira benda di kelas — kerusi? tingkap?","Video: Nombor dalam kehidupan seharian","Kira mundur: \"10, 9, 8... pelancaran roket!\"","Permainan dadu: Baling, kira, lompat","Cerita: \"10 Ekor Ikan Kecil\""]},
  alphabet:{en:["Song: \"ABC Song\" with letter cards","Show today's letter — find matching objects","\"What letter does your name start with?\"","Trace letters in the air — students follow","Teacher says letter sound — guess the letter","Video: Letter A to Z story","Mystery bag: Objects starting with a letter","Story: \"Alif and the Magic Book\"","Match uppercase with lowercase","Phonics: Letter sounds — \"A a a, Apple!\""],bm:["Nyanyian: \"ABC Song\" dengan kad huruf","Tunjukkan huruf hari ini — cari benda sepadan","\"Nama kamu mula huruf apa?\"","Trace huruf di udara — murid ikut","Guru sebut bunyi huruf — teka huruf","Video: Cerita huruf A sampai Z","Beg misteri: Objek bermula huruf tertentu","Cerita: \"Alif dan Buku Ajaib\"","Padankan huruf besar dengan huruf kecil","Fonik: Bunyi huruf — \"A a a, Apple!\""]},
};

const MAIN_ACT = {
  animals:{en:["Station 1: Animal puzzles — match parents and babies","Station 2: Plasticine — shape favorite animal","Station 3: Fingerprint painting — animal patterns","Station 4: Storybook — \"Who Lives Here?\"","Sensory bin — find animals hidden in rice","Animal Doctor — treat soft toys","Build animal habitat from shoeboxes","Animal footprint stamps with sponges","Sock puppet animals — create stories","Memory card — match animal pairs"],bm:["Stesen 1: Puzzle haiwan — padankan ibu dan anak","Stesen 2: Plastisin — bentuk haiwan kegemaran","Stesen 3: Lukisan cap jari — corak kulit haiwan","Stesen 4: Cerita interaktif — \"Siapa Tinggal Di Sini?\"","Sensory bin — cari haiwan dalam beras","Doctor Haiwan — rawat soft toy","Bina habitat haiwan dari kotak kasut","Cap kaki haiwan dari span","Puppet haiwan dari stokin — buat cerita","Memory card — padankan pasangan haiwan"]},
  nature:{en:["Station 1: Plant seeds in cups","Station 2: Leaf rubbing art with crayons","Station 3: Sort living vs non-living","Station 4: Tree life cycle puzzle","Flower pressing in a book","Mini garden in egg carton","Sensory bin — soil, rocks, leaves","Toy microscope — observe leaves","Paint with natural materials","Make terrarium in a jar"],bm:["Stesen 1: Tanam biji benih dalam cawan","Stesen 2: Leaf rubbing art dengan krayon","Stesen 3: Sort hidup vs bukan hidup","Stesen 4: Puzzle kitaran hidup pokok","Flower pressing dalam buku","Taman mini dalam bekas telur","Sensory bin — tanah, batu, daun","Mikroskop mainan — perhatikan daun","Cat guna bahan alam","Buat terrarium dalam balang"]},
  space:{en:["Build rocket from toilet roll","Paint planets with marble painting","Constellation — poke holes in black paper","Alien from plasticine","Astronaut helmet from box","Sensory bin — black rice + glitter + planets","Galaxy painting — watercolor + salt","Arrange planets puzzle","Solar system from styrofoam balls","Toy telescope from toilet rolls"],bm:["Bina roket dari toilet roll","Lukis planet guna marble painting","Konstelasi — cucuk lubang kertas hitam","Alien dari plastisin","Helmet angkasawan dari kotak","Sensory bin — beras hitam + glitter + planet","Galaxy painting — cat air + garam","Puzzle susun planet","Sistem suria dari bola styrofoam","Teleskop mainan dari toilet roll"]},
  ocean:{en:["Blue water sensory bin — find sea creatures","Handprint fish painting","Build aquarium in shoebox","Frog life cycle puzzle","Jellyfish from paper plate + ribbon","Plasticine sea creatures","Magnetic fishing game","Sort sea vs land animals","Coral reef from painted toilet rolls","Sink or float experiment"],bm:["Sensory bin air biru — cari hidupan laut","Lukis ikan dari cetakan tangan","Bina akuarium dalam kotak kasut","Puzzle kitaran hidup katak","Obor-obor dari paper plate + ribbon","Plastisin hidupan laut","Pancing ikan magnetik","Sort laut vs darat","Terumbu karang dari toilet roll","Eksperimen terapung vs tenggelam"]},
  food:{en:["Sort fruits vs vegetables","Plasticine favorite foods","Imaginary sandwich from paper","Food pyramid puzzle","Sensory bin — rice, pasta, beans","Fruit/veggie stamping with paint","Toy shop role-play","Make real fruit salad","Draw my healthy plate","Memory — match fruit with color"],bm:["Sorting buah vs sayur","Plastisin makanan kegemaran","Sandwich imaginasi dari kertas","Puzzle piramid makanan","Sensory bin — beras, pasta, kekacang","Cap buah/sayur sebenar","Kedai mainan — jual beli","Buat fruit salad sebenar","Lukis pinggan makanan sihat","Memory — padankan buah dengan warna"]},
  transport:{en:["Build road from tape — play with cars","Sponge painting vehicles","Vehicle part puzzles","Paper boat — test in water","Paper airplane competition","Plasticine vehicles","Sort land, water, air vehicles","Traffic light from colored paper","Wheel printing with toy cars","Dramatic play — pilot, captain, driver"],bm:["Bina jalan dari tape — main kereta","Lukis kenderaan guna sponge","Puzzle bahagian kenderaan","Bot kertas — uji di air","Pertandingan kapal terbang kertas","Plastisin kenderaan","Sorting kenderaan darat, air, udara","Traffic light dari kertas warna","Cetakan roda kereta mainan","Dramatic play — pilot, kapten, pemandu"]},
  body:{en:["Life-size body drawing on big paper","Body puzzle — place organs correctly","Mystery box — guess by touch","Hand X-ray — trace and draw bones","Stethoscope — listen to heartbeat","Sensory bottles (visual, sound)","Kid yoga poses","Match sense with organ","Face mask — different expressions","Plasticine organs (heart, brain)"],bm:["Lukis badan saiz sebenar","Puzzle tubuh — letak organ betul","Kotak misteri — teka sentuhan","X-ray tangan — trace dan lukis tulang","Stetoskop — dengar degupan jantung","Botol deria (visual, bunyi)","Yoga poses kanak-kanak","Padankan deria dengan organ","Mask muka — ekspresi berbeza","Plastisin organ (jantung, otak)"]},
  weather:{en:["Rain cloud in jar experiment","Paint favorite weather","Make weather wheel","Sensory bin — clouds, water drops, sun","Rainbow from colored paper strips","Tornado in a bottle","Dress up for weather","Windsock from toilet roll + ribbon","Rain dots with cotton buds","Paper thermometer"],bm:["Eksperimen rain cloud dalam balang","Lukis cuaca kegemaran","Buat weather wheel","Sensory bin — awan, titisan air, matahari","Pelangi dari jalur kertas warna","Tornado dalam botol","Pakai pakaian ikut cuaca","Windsock dari toilet roll + ribbon","Lukis hujan dengan cotton bud","Termometer kertas"]},
  colors:{en:["Color mixing experiment","Sort objects by color","Paint with sponge, brush, fingers","Build 3D shapes from straws","Colour hunt in classroom","Tissue paper rainbow on window","Sensory bottles — water + oil + color","Shape stamping with paint","Marble painting in a box","Pattern beads — follow color pattern"],bm:["Eksperimen campur warna","Sorting benda ikut warna","Lukis guna span, berus, jari","Bina bentuk 3D dari straw","Colour hunt di kelas","Pelangi tissue paper di tingkap","Botol sensori — air + minyak + warna","Cap bentuk dengan cat","Marble painting dalam kotak","Manik pattern — ikut corak warna"]},
  family:{en:["Draw my family","Build house from boxes","Play house","Family puzzle","Make family tree","Plasticine family members","Greeting card for family","Sort household chores","Build house from blocks","Finger puppets — paper family"],bm:["Lukis keluarga saya","Buat rumah dari kotak","Main rumah-rumah","Puzzle keluarga","Buat pokok keluarga","Plastisin ahli keluarga","Kad ucapan untuk keluarga","Sorting kerja rumah","Bina rumah dari blok","Puppet jari keluarga dari kertas"]},
  numbers:{en:["Count and clip cards","Plasticine numbers 1-10","Counting bears by color","Dice game — roll, count, collect","Number hunt in class","Numbers from dot stickers","Number puzzle 1-20","Sensory bag — write numbers","Domino — match dots with numbers","Simple abacus from beads"],bm:["Kira dan clip kad","Plastisin nombor 1-10","Counting bears ikut warna","Permainan dadu — baling, kira, ambil","Cari nombor di kelas","Nombor dari sticker dot","Puzzle nombor 1-20","Sensory bag — tulis nombor","Domino — padankan titik dengan nombor","Abacus ringkas dari manik"]},
  alphabet:{en:["Trace letters in sand/salt tray","Plasticine — shape today's letter","Match uppercase and lowercase","Letter collage with pictures","Stamp letters in paint","Find letters in sensory bin","Build letters from pipe cleaners","Letter fishing — magnetic","Dot marker along letter shapes","Letter puzzle — arrange A-Z"],bm:["Trace huruf di atas pasir/garam","Plastisin — bentuk huruf hari ini","Padankan huruf besar dan kecil","Kolaj huruf dengan gambar","Stamp huruf dalam cat","Cari huruf dalam sensory bin","Bina huruf dari pipe cleaner","Pancing huruf magnetik","Dot marker ikut bentuk huruf","Puzzle huruf — susun A-Z"]},
};

const WORKSHEET = {
  animals:{en:["Color animals in real colors","Match animals to their food","Copy animal names","Count farm animals","Match mother and baby animals","Circle water animals","Spot the difference — animals","Arrange by size","First letter of animal names","Color by number — animal","Trace lines to habitats","Cut & paste — chicken life cycle"],bm:["Warnakan haiwan warna sebenar","Padankan haiwan dengan makanan","Salin nama haiwan","Kira haiwan di ladang","Padankan ibu dan anak haiwan","Bulatkan haiwan air","Cari perbezaan — haiwan","Susun mengikut saiz","Huruf pertama nama haiwan","Warnakan mengikut nombor — haiwan","Trace garisan ke habitat","Potong & tampal — kitaran hidup ayam"]},
  nature:{en:["Label tree parts","Color nature scene by season","Arrange: seed → tree → fruit","Match leaves to trees","Count flowers — write number","Spot difference — garden","Trace wavy river lines","Color rainbow correctly","Circle living things","Cut & paste — water cycle","Draw what's outside window","Match seeds with fruits"],bm:["Labelkan bahagian pokok","Warnakan alam ikut musim","Susun: biji → pokok → buah","Padankan daun dengan pokok","Kira bunga — tulis nombor","Cari perbezaan — taman","Trace garisan sungai","Warnakan pelangi betul","Bulatkan benda hidup","Potong & tampal — kitaran air","Lukis apa di luar tingkap","Padankan biji dengan buah"]},
  space:{en:["Color planets in real colors","Count stars — write number","Trace — rocket to moon","Connect dots — stars and planets","Match planet names","Spot difference — space","Arrange planets from sun","Draw your own alien","Color by number — rocket","Trace: M-O-O-N, S-T-A-R","Countdown 10-1 — write numbers","Maze — astronaut to rocket"],bm:["Warnakan planet warna sebenar","Kira bintang — tulis nombor","Trace — roket ke bulan","Sambung titik — bintang dan planet","Padankan nama planet","Cari perbezaan — angkasa","Susun planet dari matahari","Lukis alien sendiri","Warnakan mengikut nombor — roket","Trace: B-U-L-A-N","Kira mundur 10-1 — tulis nombor","Maze — angkasawan ke roket"]},
  ocean:{en:["Color sea creatures","Count fish — write number","Match creatures with shadows","Trace wavy ocean waves","Spot difference — underwater","Sort sea vs land animals","Connect dots — fish shapes","Maze — fish finds coral home","Color by number — octopus","Draw ocean bottom","First letter — Fish→F","Arrange fish by size"],bm:["Warnakan hidupan laut","Kira ikan — tulis nombor","Padankan hidupan dengan bayangan","Trace ombak laut","Cari perbezaan — bawah laut","Sort laut vs darat","Sambung titik — bentuk ikan","Maze — ikan ke terumbu karang","Warnakan mengikut nombor — sotong","Lukis dasar laut","Huruf pertama — Ikan→I","Susun ikan mengikut saiz"]},
  food:{en:["Color fruits in real colors","Sort fruits vs vegetables","Count food on plate","Match food with color","Trace — food to mouth","Draw favorite food","Spot difference — kitchen","Circle healthy food","Maze — chef finds ingredients","Color by number — cupcake","First letter — Apple→A","Arrange sandwich steps"],bm:["Warnakan buah warna sebenar","Sorting buah vs sayur","Kira makanan dalam pinggan","Padankan makanan dengan warna","Trace — makanan ke mulut","Lukis makanan kegemaran","Cari perbezaan — dapur","Bulatkan makanan sihat","Maze — chef cari bahan","Warnakan mengikut nombor — cupcake","Huruf pertama — Epal→E","Susun langkah buat sandwich"]},
  transport:{en:["Color vehicles","Sort land/water/air vehicles","Count wheels","Trace — vehicle on road","Match vehicle with sound","Spot difference — road","Color traffic light","Connect dots — airplane","Maze — car to destination","Draw dream vehicle","Count vehicles in picture","Match driver with vehicle"],bm:["Warnakan kenderaan","Sorting kenderaan darat/air/udara","Kira roda","Trace — kenderaan ikut jalan","Padankan kenderaan dengan bunyi","Cari perbezaan — jalan raya","Warnakan lampu isyarat","Sambung titik — kapal terbang","Maze — kereta ke destinasi","Lukis kenderaan impian","Kira kenderaan dalam gambar","Padankan pemandu dengan kenderaan"]},
  body:{en:["Label face parts","Match senses with organs","Trace organ to function","Count fingers — write number","Draw expressions — happy, sad","Spot difference — body","Color body by label","Arrange by height","Connect dots — body shape","Cut & paste organs","Maze — food mouth to stomach","Draw yourself"],bm:["Labelkan bahagian muka","Padankan deria dengan organ","Trace organ ke fungsi","Kira jari — tulis nombor","Lukis ekspresi — gembira, sedih","Cari perbezaan — badan","Warnakan badan ikut label","Susun mengikut tinggi","Sambung titik — bentuk badan","Potong & tampal organ","Maze — makanan mulut ke perut","Lukis diri sendiri"]},
  weather:{en:["Match weather with clothing","Color scene by weather","Trace raindrops falling","Count clouds — write number","Sort hot vs cold clothes","Draw today's weather","Spot difference — weather","Connect dots — umbrella, sun","Color rainbow correctly","Maze — find umbrella","Cut & paste — water cycle","Match weather symbols"],bm:["Padankan cuaca dengan pakaian","Warnakan ikut cuaca","Trace titisan hujan","Kira awan — tulis nombor","Sorting pakaian panas vs sejuk","Lukis cuaca hari ini","Cari perbezaan — cuaca","Sambung titik — payung, matahari","Warnakan pelangi betul","Maze — cari payung","Potong & tampal — kitaran air","Padankan simbol cuaca"]},
  colors:{en:["Color objects by instruction","Sort by color groups","Trace shapes","Match colors with names","Find hidden shapes","Color by number","Draw favorite shape","Connect dots — shapes","Count shapes in picture","Cut & paste — picture from shapes","Color pattern — red, blue, ___","Color mixing — red+yellow=?"],bm:["Warnakan ikut arahan","Sorting ikut warna","Trace bentuk","Padankan warna dengan nama","Cari bentuk tersembunyi","Warnakan mengikut nombor","Lukis bentuk kegemaran","Sambung titik — bentuk","Kira bentuk dalam gambar","Potong & tampal — gambar dari bentuk","Corak warna — merah, biru, ___","Campur warna — merah+kuning=?"]},
  family:{en:["Draw your family","Count family members","Match family roles","Trace — family goes home","Color happy family","Spot difference — family","Sort household chores","Draw dream house","Connect dots — house","Write family names","Arrange family by age","Maze — find mother"],bm:["Lukis keluarga","Kira ahli keluarga","Padankan peranan keluarga","Trace — keluarga pulang","Warnakan keluarga bahagia","Cari perbezaan — keluarga","Sorting kerja rumah","Lukis rumah impian","Sambung titik — rumah","Tulis nama keluarga","Susun keluarga ikut umur","Maze — cari ibu"]},
  numbers:{en:["Trace numbers 1-10","Count objects — write number","Match numbers with quantities","Connect dots 1-20","Color by number","More vs less — circle bigger","Fill missing: 1,2,__,4,5","Count and clip cards","Write number words","Arrange small to big","Number maze 1-10","Simple addition with pictures"],bm:["Trace nombor 1-10","Kira objek — tulis nombor","Padankan nombor dengan kuantiti","Sambung titik 1-20","Warnakan mengikut nombor","Lebih vs kurang — bulatkan","Isi nombor hilang: 1,2,__,4,5","Kira dan clip kad","Tulis nombor perkataan","Susun kecil ke besar","Maze nombor 1-10","Tambah mudah dengan gambar"]},
  alphabet:{en:["Trace letters (dotted)","Match upper and lowercase","Color pictures starting with letter","Find hidden letters","Write first letter of objects","Connect A to Z","Circle correct letter","Cut & paste letters in order","Letter maze — follow ABC","Trace your name","Match letters with sounds","Color by letter"],bm:["Trace huruf (garis putus-putus)","Padankan huruf besar dan kecil","Warnakan gambar bermula huruf","Cari huruf tersembunyi","Tulis huruf pertama benda","Sambung A ke Z","Bulatkan huruf betul","Potong & tampal huruf","Maze huruf — ikut ABC","Trace nama sendiri","Padankan huruf dengan bunyi","Warnakan mengikut huruf"]},
};

const CLOSING = {
  en:["Show & Tell: Share your work","Summary: \"What did we learn today?\"","Closing song together","Gallery walk — see everyone's work","Each student names one new thing learned","Appreciation claps — \"We're all amazing!\"","Tidy up together with a song","Closing storybook","Give stars to classmates' work","Thank you and goodbye"],
  bm:["Show & Tell: Tunjuk dan ceritakan hasil kerja","Rumusan: \"Apa yang kita belajar?\"","Lagu penutup bersama","Gallery walk — lihat hasil kerja kawan","Setiap murid sebut satu benda baru","Tepukan penghargaan — \"Kita semua hebat!\"","Kemas bersama — lagu kemas","Buku cerita penutup","Beri bintang pada kerja kawan","Ucapan terima kasih dan selamat tinggal"],
};

const ACT_DETAILS = {
  animals:{
    en:[
      {name:"Classroom Safari",type:"Physical",desc:"Hide animal pictures around class. Students hunt with toy binoculars. Mimic each animal found.",materials:"Animal pictures, toy binoculars, basket",duration:"20 min"},
      {name:"Animal Doctor",type:"Dramatic Play",desc:"Set up vet station. Students take turns treating sick soft toys with doctor kit.",materials:"Soft toys, doctor kit, bandage",duration:"25 min"},
      {name:"Animal Sound Quiz",type:"Auditory",desc:"Play animal sounds. Students guess and find matching picture. Add movement mimicry.",materials:"Speaker, animal audio, flashcards",duration:"15 min"},
      {name:"Animal Freeze Dance",type:"Music",desc:"Dance to music. When it stops, freeze in the named animal's pose!",materials:"Speaker, open space",duration:"15 min"},
      {name:"Memory Match",type:"Cognitive",desc:"Animal cards face down. Flip two — matching pair? Keep them! Most pairs wins.",materials:"Animal card pairs",duration:"20 min"},
      {name:"Habitat Relay",type:"Physical",desc:"3 baskets: land/water/air. Race to sort animal pictures into correct habitat.",materials:"Baskets, animal pictures",duration:"15 min"},
      {name:"Animal Yoga",type:"Mindfulness",desc:"Animal yoga poses — cat, dog, cobra, butterfly. Deep breathing with each pose.",materials:"Mats, pose cards",duration:"15 min"},
      {name:"Chain Story",type:"Language",desc:"Teacher starts: \"One day, a rabbit...\" Each student adds a sentence. Draw favorite scene.",materials:"Paper, crayons",duration:"20 min"},
    ],
    bm:[
      {name:"Safari Dalam Kelas",type:"Fizikal",desc:"Sembunyikan gambar haiwan. Murid berburu guna teropong mainan. Tiru gerakan setiap haiwan.",materials:"Gambar haiwan, teropong mainan, bakul",duration:"20 min"},
      {name:"Doctor Haiwan",type:"Dramatic Play",desc:"Set up stesen vet. Murid bergilir rawat soft toy sakit guna kit doktor.",materials:"Soft toys, kit doktor, bandage",duration:"25 min"},
      {name:"Bunyi Haiwan Teka-Teki",type:"Auditori",desc:"Mainkan bunyi haiwan. Murid teka dan cari gambar sepadan. Tambah gerakan tiru.",materials:"Speaker, audio haiwan, flashcard",duration:"15 min"},
      {name:"Haiwan Freeze Dance",type:"Muzik",desc:"Menari ikut muzik. Bila berhenti, freeze dalam pose haiwan yang disebut!",materials:"Speaker, ruang luas",duration:"15 min"},
      {name:"Memory Match",type:"Kognitif",desc:"Kad haiwan terbalik. Buka dua — kalau sama, simpan! Paling banyak pasangan menang.",materials:"Kad haiwan berpasangan",duration:"20 min"},
      {name:"Habitat Relay",type:"Fizikal",desc:"3 bakul: darat/air/udara. Berlari sort gambar haiwan ke habitat betul.",materials:"Bakul, gambar haiwan",duration:"15 min"},
      {name:"Haiwan Yoga",type:"Mindfulness",desc:"Pose yoga haiwan — kucing, anjing, cobra, rama-rama. Pernafasan dalam setiap pose.",materials:"Tikar, kad pose",duration:"15 min"},
      {name:"Cerita Berantai",type:"Bahasa",desc:"Guru mula: \"Pada suatu hari, seekor arnab...\" Setiap murid sambung satu ayat. Lukis adegan kegemaran.",materials:"Kertas, krayon",duration:"20 min"},
    ],
  },
};

function getActDetails(id,lang){
  if(ACT_DETAILS[id]?.[lang])return ACT_DETAILS[id][lang];
  const items=(MAIN_ACT[id]?.[lang]||[]).slice(0,8);
  const types=lang==="en"?["Physical","Sensory","Language","Cognitive","Music","Science","Art","Drama"]:["Fizikal","Sensori","Bahasa","Kognitif","Muzik","Sains","Seni","Drama"];
  return items.map((x,i)=>({name:x.replace(/Station \d+:|Stesen \d+:/,"").trim().substring(0,35),type:types[i%types.length],desc:x,materials:lang==="en"?"Theme materials, paper, crayons":"Bahan bertema, kertas, krayon",duration:pickOne(["15 min","20 min","25 min"])}));
}

// Generation
function generateContent(type,themeId,ageId,duration,lang){
  const theme=THEMES.find(x=>x.id===themeId);
  const name=theme?.label?.[lang]?.replace(/^[^\s]+\s/,"")||themeId;
  const age=AGE_GROUPS.find(x=>x.id===ageId)?.label?.[lang]||ageId;
  const g={
    lesson:()=>genLesson(themeId,name,age,duration,lang),
    activity:()=>genAct(themeId,name,age,lang),
    worksheet:()=>genWS(themeId,name,age,lang),
    craft:()=>genCraft(themeId,name,age,lang),
    pack:()=>genPack(themeId,name,age,duration,lang),
  };
  return g[type]?.()||{title:"Error",sections:[]};
}

function genLesson(id,theme,age,dur,lang){
  const open=pickRandom(OPENING[id]?.[lang]||[],4);
  const main=pickRandom(MAIN_ACT[id]?.[lang]||[],4);
  const ws=pickRandom(WORKSHEET[id]?.[lang]||[],3);
  const close=pickRandom(CLOSING[lang]||[],3);
  const objs=lang==="en"?[
    `Students can identify at least 5 concepts about ${theme} through hands-on activities.`,
    `Students can name, recognize, and categorize ${theme}-related items correctly.`,
    `Students can develop motor skills through ${theme}-themed activities.`,
    `Students can communicate about ${theme} using simple sentences and new vocabulary.`,
  ]:[
    `Murid dapat mengenal pasti sekurang-kurangnya 5 konsep berkaitan ${theme} melalui aktiviti hands-on.`,
    `Murid dapat menyebut, mengecam, dan mengkategori perkara berkaitan ${theme} dengan betul.`,
    `Murid dapat mengembangkan kemahiran motor melalui aktiviti bertema ${theme}.`,
    `Murid dapat berkomunikasi tentang ${theme} menggunakan ayat mudah dan perbendaharaan kata baru.`,
  ];
  const hd=lang==="en"?["🌅 Opening (Circle Time) — 15 min","📚 Main Activities — 30 min","✏️ Worksheets — 15 min","🔄 Closing & Reflection — 10 min"]:["🌅 Pembukaan (Circle Time) — 15 minit","📚 Aktiviti Utama — 30 minit","✏️ Lembaran Kerja — 15 minit","🔄 Penutup & Refleksi — 10 minit"];
  return {
    title:lang==="en"?`Teaching Plan: ${theme}`:`Rancangan Pengajaran: ${theme}`,
    objective:pickOne(objs),
    meta:lang==="en"?{age,duration:dur+" min",theme}:{umur:age,durasi:dur+" minit",tema:theme},
    sections:[{heading:hd[0],items:open},{heading:hd[1],items:main},{heading:hd[2],items:ws},{heading:hd[3],items:close}],
  };
}

function genAct(id,theme,age,lang){
  const bank=getActDetails(id,lang);
  return {
    title:lang==="en"?`Learning Activities: ${theme}`:`Aktiviti Pembelajaran: ${theme}`,
    subtitle:lang==="en"?`Hands-on activities for children ${age}`:`Aktiviti hands-on untuk kanak-kanak ${age}`,
    activities:pickRandom(bank,Math.min(4,bank.length)),
  };
}

function genWS(id,theme,age,lang){
  const bank=WORKSHEET[id]?.[lang]||[];
  const sel=pickRandom(bank,Math.min(5,bank.length));
  const d=lang==="en"?["Easy","Easy","Medium","Medium","Challenging"]:["Mudah","Mudah","Sederhana","Sederhana","Mencabar"];
  const c=lang==="en"?["Art","Cognitive","Math","Literacy","Science"]:["Seni","Kognitif","Matematik","Literasi","Sains"];
  return {
    title:lang==="en"?`Worksheet Ideas: ${theme}`:`Idea Lembaran Kerja: ${theme}`,
    subtitle:lang==="en"?`For children ${age}`:`Untuk kanak-kanak ${age}`,
    worksheets:sel.map((w,i)=>({name:w,desc:w,difficulty:d[i%d.length],category:c[i%c.length]})),
  };
}

function genCraft(id,theme,age,lang){
  const bank=MAIN_ACT[id]?.[lang]||[];
  const sel=pickRandom(bank,3);
  const mats=lang==="en"?[["Colored paper","Glue","Scissors","Markers","Googly eyes"],["Paper plate","Paint","Brush","Glitter","Elastic"],["Toilet roll","Paper","Glue","Stickers","Pipe cleaner"]]:[["Kertas warna","Gam","Gunting selamat","Marker","Mata pelekat"],["Paper plate","Cat","Berus","Glitter","Elastic"],["Toilet roll","Kertas","Gam","Sticker","Pipe cleaner"]];
  const tips=lang==="en"?["Prepare an example for inspiration","Let students choose colors freely","Use recycled materials","Take photos for portfolios","Display work as decoration","Encourage storytelling about crafts"]:["Sediakan contoh untuk inspirasi","Biar murid pilih warna sendiri","Guna bahan kitar semula","Ambil gambar untuk portfolio","Gantung sebagai hiasan","Galakkan cerita tentang kraf"];
  const s1=lang==="en"?"Prepare all materials":"Sediakan semua bahan";
  const s3=lang==="en"?"Decorate creatively":"Hias secara kreatif";
  const s4=lang==="en"?"Let dry if needed":"Biar kering jika perlu";
  const s5=lang==="en"?"Show & Tell":"Show & Tell";
  return {
    title:lang==="en"?`Craft Ideas: ${theme}`:`Idea Kraf: ${theme}`,
    subtitle:lang==="en"?`Creative projects for children ${age}`:`Projek kreatif untuk kanak-kanak ${age}`,
    crafts:sel.map((c,i)=>({name:c.substring(0,40),time:pickOne(["15 min","20 min","25 min","30 min"]),materials:shuffle(mats[i%mats.length]),steps:[s1,c,s3,s4,s5],tip:pickOne(tips)})),
  };
}

function genPack(id,theme,age,dur,lang){
  const lesson=genLesson(id,theme,age,dur,lang);
  const activities=genAct(id,theme,age,lang);
  const worksheets=genWS(id,theme,age,lang);
  const crafts=genCraft(id,theme,age,lang);
  const days=DAYS[lang];
  const foc=lang==="en"?shuffle(["Introduction","Exploration","Creativity","Reinforcement","Celebration"]):shuffle(["Pengenalan","Penerokaan","Kreativiti","Pengukuhan","Perayaan"]);
  const st=lang==="en"?"Show & Tell + Party":"Show & Tell + Parti";
  return {title:lang==="en"?`Complete Theme Pack: ${theme}`:`Pakej Tema Lengkap: ${theme}`,subtitle:lang==="en"?`5-day pack for ${age}`:`Pakej 5-hari untuk ${age}`,isPack:true,lesson,activities,worksheets,crafts,
    weekPlan:days.map((d,i)=>({day:d,focus:foc[i],activity:i<4?(activities.activities?.[i]?.name||"-"):st,worksheet:worksheets.worksheets?.[i]?.name||"-"})),
  };
}

// UI Components
function Confetti({active}){if(!active)return null;const p=Array.from({length:50},(_,i)=>({id:i,left:Math.random()*100,delay:Math.random()*0.5,color:["#FF6B35","#2D936C","#5B4FCF","#0891B2","#E63946","#F4A261","#9B5DE5","#F15BB5"][i%8],size:6+Math.random()*8}));return <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:9999}}>{p.map(x=><div key={x.id} style={{position:"absolute",top:-20,left:`${x.left}%`,width:x.size,height:x.size,backgroundColor:x.color,borderRadius:Math.random()>0.5?"50%":"2px",animation:`confettiFall 2s ${x.delay}s ease-in forwards`}}/>)}</div>;}

function LangToggle({lang,setLang}){return <div style={{display:"flex",background:"rgba(255,255,255,0.15)",borderRadius:20,padding:2,border:"1px solid rgba(255,255,255,0.25)"}}>{["bm","en"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 12px",borderRadius:18,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:lang===l?"white":"transparent",color:lang===l?"#5B4FCF":"rgba(255,255,255,0.8)",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>{l==="bm"?"BM":"EN"}</button>)}</div>;}

function LessonPlanResult({data}){const lang=useLang();return <div>{data.meta&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>{Object.entries(data.meta).map(([k,v])=><span key={k} style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:20,padding:"4px 14px",fontSize:13,color:"#C2410C",fontFamily:"'DM Sans',sans-serif"}}>{k}: <strong>{v}</strong></span>)}</div>}{data.objective&&<div style={{background:"linear-gradient(135deg,#ECFDF5,#D1FAE5)",borderRadius:12,padding:16,marginBottom:20,borderLeft:"4px solid #10B981"}}><div style={{fontSize:12,fontWeight:700,color:"#065F46",marginBottom:4,fontFamily:"'DM Sans',sans-serif"}}>{t("objective",lang)}</div><div style={{fontSize:14,color:"#064E3B",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>{data.objective}</div></div>}{data.sections?.map((s,i)=><div key={i} style={{marginBottom:20}}><h3 style={{fontSize:16,fontWeight:700,color:"#1E293B",marginBottom:10,fontFamily:"'Nunito',sans-serif"}}>{s.heading}</h3><div style={{display:"flex",flexDirection:"column",gap:6}}>{s.items?.map((item,j)=><div key={j} style={{display:"flex",gap:10,alignItems:"flex-start",background:"#F8FAFC",borderRadius:8,padding:"10px 14px"}}><span style={{minWidth:24,height:24,borderRadius:"50%",background:"#E0F2FE",color:"#0369A1",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>{j+1}</span><span style={{fontSize:14,color:"#334155",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>{item}</span></div>)}</div></div>)}</div>;}

function ActivitiesResult({data}){return <div style={{display:"grid",gap:16}}>{data.activities?.map((a,i)=><div key={i} style={{border:"1px solid #E2E8F0",borderRadius:16,padding:20,background:"white"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><h4 style={{fontSize:16,fontWeight:700,color:"#1E293B",fontFamily:"'Nunito',sans-serif",margin:0}}>{a.name}</h4><span style={{background:"#EDE9FE",color:"#7C3AED",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:12,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{a.type}</span></div><p style={{fontSize:14,color:"#64748B",lineHeight:1.6,margin:"0 0 12px",fontFamily:"'DM Sans',sans-serif"}}>{a.desc}</p><div style={{display:"flex",gap:16,fontSize:13,color:"#94A3B8",fontFamily:"'DM Sans',sans-serif",flexWrap:"wrap"}}><span>🕐 {a.duration}</span><span>📦 {a.materials}</span></div></div>)}</div>;}

function WorksheetsResult({data}){const lang=useLang();const dc=lang==="en"?{Easy:"#10B981",Medium:"#F59E0B",Challenging:"#EF4444"}:{Mudah:"#10B981",Sederhana:"#F59E0B",Mencabar:"#EF4444"};return <div style={{display:"grid",gap:12}}>{data.worksheets?.map((w,i)=><div key={i} style={{display:"flex",gap:16,border:"1px solid #E2E8F0",borderRadius:14,padding:16,background:"white",alignItems:"flex-start"}}><div style={{minWidth:44,height:44,borderRadius:12,background:"#F1F5F9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#64748B",fontFamily:"'DM Sans',sans-serif"}}>{i+1}</div><div style={{flex:1}}><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}><h4 style={{fontSize:15,fontWeight:700,color:"#1E293B",margin:0,fontFamily:"'Nunito',sans-serif"}}>{w.name}</h4><span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:(dc[w.difficulty]||"#ccc")+"15",color:dc[w.difficulty]||"#666",fontFamily:"'DM Sans',sans-serif"}}>{w.difficulty}</span></div><span style={{display:"inline-block",fontSize:11,color:"#8B5CF6",background:"#F5F3FF",padding:"2px 8px",borderRadius:6,marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>{w.category}</span><p style={{fontSize:13,color:"#64748B",lineHeight:1.5,margin:0,fontFamily:"'DM Sans',sans-serif"}}>{w.desc}</p></div></div>)}</div>;}

function CraftsResult({data}){const lang=useLang();return <div style={{display:"grid",gap:20}}>{data.crafts?.map((c,i)=><div key={i} style={{border:"1px solid #E2E8F0",borderRadius:16,overflow:"hidden",background:"white"}}><div style={{background:"linear-gradient(135deg,#FFF7ED,#FFEDD5)",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><h4 style={{fontSize:16,fontWeight:700,color:"#C2410C",margin:0,fontFamily:"'Nunito',sans-serif"}}>✂️ {c.name}</h4><span style={{fontSize:13,color:"#EA580C",fontFamily:"'DM Sans',sans-serif"}}>⏱ {c.time}</span></div><div style={{padding:20}}><div style={{marginBottom:14}}><div style={{fontSize:12,fontWeight:700,color:"#92400E",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>📦 {t("materials",lang)}:</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{c.materials?.map((m,j)=><span key={j} style={{background:"#FEF3C7",color:"#92400E",fontSize:12,padding:"3px 10px",borderRadius:8,fontFamily:"'DM Sans',sans-serif"}}>{m}</span>)}</div></div><div style={{marginBottom:14}}><div style={{fontSize:12,fontWeight:700,color:"#92400E",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>📋 {t("steps",lang)}:</div>{c.steps?.map((s,j)=><div key={j} style={{display:"flex",gap:8,marginBottom:4,alignItems:"flex-start"}}><span style={{minWidth:20,height:20,borderRadius:"50%",background:"#FED7AA",color:"#C2410C",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>{j+1}</span><span style={{fontSize:13,color:"#44403C",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>{s}</span></div>)}</div>{c.tip&&<div style={{background:"#F0FDF4",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#166534",fontFamily:"'DM Sans',sans-serif"}}>💡 <strong>{t("tip",lang)}:</strong> {c.tip}</div>}</div></div>)}</div>;}

function ThemePackResult({data}){const lang=useLang();const[tab,setTab]=useState("week");const tabs=[{id:"week",label:t("weekSchedule",lang)},{id:"lesson",label:t("lessonPlan",lang)},{id:"activity",label:t("activities",lang)},{id:"worksheet",label:t("worksheetTab",lang)},{id:"craft",label:t("craftTab",lang)}];return <div><div style={{display:"flex",gap:4,marginBottom:20,overflowX:"auto",padding:4,background:"#F1F5F9",borderRadius:12}}>{tabs.map(x=><button key={x.id} onClick={()=>setTab(x.id)} style={{padding:"8px 14px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif",background:tab===x.id?"white":"transparent",color:tab===x.id?"#1E293B":"#64748B",boxShadow:tab===x.id?"0 1px 3px rgba(0,0,0,0.1)":"none",transition:"all 0.2s"}}>{x.label}</button>)}</div>{tab==="week"&&<div style={{display:"grid",gap:10}}>{data.weekPlan?.map((d,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:12,border:"1px solid #E2E8F0",borderRadius:12,padding:14,background:"white"}}><div style={{textAlign:"center"}}><div style={{background:"#EDE9FE",color:"#7C3AED",borderRadius:10,padding:"8px 4px",fontSize:13,fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>{d.day}</div></div><div><div style={{fontSize:14,fontWeight:700,color:"#1E293B",marginBottom:2,fontFamily:"'Nunito',sans-serif"}}>{d.focus}</div><div style={{fontSize:13,color:"#64748B",fontFamily:"'DM Sans',sans-serif"}}>🎮 {d.activity}</div><div style={{fontSize:13,color:"#64748B",fontFamily:"'DM Sans',sans-serif"}}>📝 {d.worksheet}</div></div></div>)}</div>}{tab==="lesson"&&<LessonPlanResult data={data.lesson}/>}{tab==="activity"&&<ActivitiesResult data={data.activities}/>}{tab==="worksheet"&&<WorksheetsResult data={data.worksheets}/>}{tab==="craft"&&<CraftsResult data={data.crafts}/>}</div>;}

// Main App
export default function PreschoolPlanner(){
  const[lang,setLang]=useState("bm");
  const[screen,setScreen]=useState("home");
  const[selType,setSelType]=useState(null);
  const[selTheme,setSelTheme]=useState(null);
  const[selAge,setSelAge]=useState(null);
  const[duration,setDuration]=useState(90);
  const[result,setResult]=useState(null);
  const[generating,setGenerating]=useState(false);
  const[showConfetti,setShowConfetti]=useState(false);
  const[history,setHistory]=useState([]);
  const[genCount,setGenCount]=useState(0);
  const ref=useRef(null);
  const canGen=selType&&selTheme&&selAge;

  const handleGen=()=>{if(!canGen)return;setGenerating(true);setTimeout(()=>{const c=generateContent(selType,selTheme,selAge,duration,lang);setResult(c);setGenerating(false);setScreen("result");setShowConfetti(true);setGenCount(n=>n+1);setTimeout(()=>setShowConfetti(false),2500);setHistory(p=>[{type:selType,theme:selTheme,age:selAge,title:c.title,lang,timestamp:new Date().toLocaleString(lang==="bm"?"ms-MY":"en-US")},...p].slice(0,20));},1000);};
  const handleReset=()=>{setScreen("home");setSelType(null);setSelTheme(null);setSelAge(null);setResult(null);setDuration(90);};

  const renderResult=()=>{if(!result)return null;if(result.isPack)return <ThemePackResult data={result}/>;if(result.sections)return <LessonPlanResult data={result}/>;if(result.activities)return <ActivitiesResult data={result}/>;if(result.worksheets)return <WorksheetsResult data={result}/>;if(result.crafts)return <CraftsResult data={result}/>;return null;};

  return (
    <LangContext.Provider value={lang}>
    <div style={{minHeight:"100vh",background:"#FAFAF9",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');@keyframes confettiFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}button{font-family:'DM Sans',sans-serif}`}</style>

      <Confetti active={showConfetti}/>

      <header style={{background:"linear-gradient(135deg,#FF6B35 0%,#F15BB5 50%,#5B4FCF 100%)",padding:"24px 20px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
        <div style={{maxWidth:700,margin:"0 auto",position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:28,fontWeight:900,color:"white",fontFamily:"'Nunito',sans-serif",lineHeight:1.1}}>{t("appName",lang)}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.85)",marginTop:4,fontWeight:500}}>{t("appSub",lang)}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <LangToggle lang={lang} setLang={setLang}/>
              {genCount>0&&<span style={{background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"4px 12px",fontSize:12,color:"white",fontWeight:600}}>🎯 {genCount} {t("generated",lang)}</span>}
              {screen!=="home"&&<button onClick={handleReset} style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:10,padding:"8px 16px",color:"white",fontSize:13,fontWeight:600,cursor:"pointer"}}>{t("startOver",lang)}</button>}
            </div>
          </div>
        </div>
      </header>

      <div style={{maxWidth:700,margin:"0 auto",padding:"20px 16px 40px"}}>
        {screen==="home"&&<div style={{animation:"slideUp 0.4s ease-out"}}>
          <div style={{marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><span style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#F15BB5)",color:"white",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif"}}>1</span><span style={{fontSize:16,fontWeight:700,color:"#1E293B",fontFamily:"'Nunito',sans-serif"}}>{t("step1",lang)}</span></div>
            <div style={{display:"grid",gap:8}}>{GENERATE_TYPES.map(x=><button key={x.id} onClick={()=>setSelType(x.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:14,border:selType===x.id?"2px solid #FF6B35":"2px solid #E2E8F0",background:selType===x.id?"#FFF7ED":"white",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}><span style={{fontSize:24}}>{x.label[lang].split(" ")[0]}</span><div><div style={{fontSize:14,fontWeight:700,color:"#1E293B",fontFamily:"'Nunito',sans-serif"}}>{x.label[lang].split(" ").slice(1).join(" ")}</div><div style={{fontSize:12,color:"#94A3B8"}}>{x.desc[lang]}</div></div></button>)}</div>
          </div>

          <div style={{marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><span style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#F15BB5)",color:"white",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif"}}>2</span><span style={{fontSize:16,fontWeight:700,color:"#1E293B",fontFamily:"'Nunito',sans-serif"}}>{t("step2",lang)}</span></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>{THEMES.map(x=><button key={x.id} onClick={()=>setSelTheme(x.id)} style={{padding:"12px 10px",borderRadius:12,border:selTheme===x.id?`2px solid ${x.color}`:"2px solid #E2E8F0",background:selTheme===x.id?`${x.color}10`:"white",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}><div style={{fontSize:26,marginBottom:2,animation:selTheme===x.id?"float 2s ease-in-out infinite":"none"}}>{x.emoji}</div><div style={{fontSize:12,fontWeight:600,color:selTheme===x.id?x.color:"#64748B",fontFamily:"'DM Sans',sans-serif"}}>{x.label[lang].replace(/^[^\s]+\s/,"")}</div></button>)}</div>
          </div>

          <div style={{marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><span style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#F15BB5)",color:"white",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif"}}>3</span><span style={{fontSize:16,fontWeight:700,color:"#1E293B",fontFamily:"'Nunito',sans-serif"}}>{t("step3",lang)}</span></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{AGE_GROUPS.map(x=><button key={x.id} onClick={()=>setSelAge(x.id)} style={{padding:"14px 10px",borderRadius:12,border:selAge===x.id?"2px solid #5B4FCF":"2px solid #E2E8F0",background:selAge===x.id?"#EDE9FE":"white",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}><div style={{fontSize:18,fontWeight:800,color:selAge===x.id?"#5B4FCF":"#1E293B",fontFamily:"'Nunito',sans-serif"}}>{x.label[lang]}</div><div style={{fontSize:11,color:"#94A3B8"}}>{x.desc[lang]}</div></button>)}</div>
          </div>

          <div style={{marginBottom:32}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><span style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#F15BB5)",color:"white",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif"}}>4</span><span style={{fontSize:16,fontWeight:700,color:"#1E293B",fontFamily:"'Nunito',sans-serif"}}>{t("step4",lang)}</span></div>
            <div style={{display:"flex",gap:8}}>{[60,90,120].map(d=><button key={d} onClick={()=>setDuration(d)} style={{flex:1,padding:"12px",borderRadius:12,border:duration===d?"2px solid #0891B2":"2px solid #E2E8F0",background:duration===d?"#ECFEFF":"white",cursor:"pointer",fontSize:16,fontWeight:700,color:duration===d?"#0891B2":"#64748B",fontFamily:"'Nunito',sans-serif",transition:"all 0.2s"}}>{d} {t("min",lang)}</button>)}</div>
          </div>

          <button onClick={handleGen} disabled={!canGen||generating} style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:canGen?"linear-gradient(135deg,#FF6B35 0%,#F15BB5 50%,#5B4FCF 100%)":"#E2E8F0",color:canGen?"white":"#94A3B8",fontSize:17,fontWeight:800,cursor:canGen?"pointer":"not-allowed",fontFamily:"'Nunito',sans-serif",boxShadow:canGen?"0 4px 20px rgba(255,107,53,0.3)":"none",transition:"all 0.3s",animation:canGen&&!generating?"pulse 2s ease-in-out infinite":"none"}}>{generating?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⚡</span>{t("generating",lang)}</span>:t("generateBtn",lang)}</button>

          {history.length>0&&<div style={{marginTop:32}}><div style={{fontSize:14,fontWeight:700,color:"#94A3B8",marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>{t("history",lang)}</div><div style={{display:"flex",flexDirection:"column",gap:6}}>{history.map((h,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"white",borderRadius:10,border:"1px solid #F1F5F9",fontSize:13}}><span style={{color:"#334155",fontWeight:500}}>{THEMES.find(x=>x.id===h.theme)?.emoji} {h.title} <span style={{fontSize:10,color:"#CBD5E1",marginLeft:4}}>{h.lang.toUpperCase()}</span></span><span style={{color:"#CBD5E1",fontSize:11}}>{h.timestamp}</span></div>)}</div></div>}
        </div>}

        {screen==="result"&&result&&<div ref={ref} style={{animation:"slideUp 0.5s ease-out"}}>
          <div style={{background:"white",borderRadius:20,padding:24,border:"1px solid #E2E8F0",boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
            <div style={{marginBottom:20}}><h2 style={{fontSize:22,fontWeight:900,color:"#1E293B",fontFamily:"'Nunito',sans-serif",lineHeight:1.3}}>{THEMES.find(x=>x.id===selTheme)?.emoji} {result.title}</h2>{result.subtitle&&<p style={{fontSize:14,color:"#94A3B8",marginTop:4}}>{result.subtitle}</p>}</div>
            {renderResult()}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20}}>
            <button onClick={handleReset} style={{padding:"14px",borderRadius:14,border:"2px solid #E2E8F0",background:"white",color:"#64748B",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{t("generateAgain",lang)}</button>
            <button onClick={handleGen} style={{padding:"14px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#FF6B35,#F15BB5)",color:"white",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{t("regenerate",lang)}</button>
          </div>
        </div>}
      </div>
    </div>
    </LangContext.Provider>
  );
}
