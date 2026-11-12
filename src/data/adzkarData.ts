export interface AdzkarItem {
  id: string;
  category: 'morning' | 'evening' | 'after_prayer' | 'sleep';
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  repeatTarget: number;
  source: string;
  virtue: string;
}

export interface AdzkarCategoryMeta {
  id: 'morning' | 'evening' | 'after_prayer' | 'sleep';
  codeName: string;
  title: string;
  subtitle: string;
  timeWindow: string;
  badge: string;
  accent: string;
  totalItems: number;
}

export const ADZKAR_CATEGORIES: AdzkarCategoryMeta[] = [
  {
    id: 'morning',
    codeName: 'OP-01 // MORNING',
    title: 'Dzikir Pagi',
    subtitle: 'Benteng spiritual awal hari & pembuka pintu rezeki',
    timeWindow: 'Subuh — Terbit Matahari / Dhuha',
    badge: 'HARIAN',
    accent: '#D7FF3F',
    totalItems: 8,
  },
  {
    id: 'evening',
    codeName: 'OP-02 // EVENING',
    title: 'Dzikir Petang',
    subtitle: 'Perisai malam dari bahaya, sihir, dan gangguan',
    timeWindow: 'Ashar — Terbenam Matahari / Isya',
    badge: 'HARIAN',
    accent: '#38BDF8',
    totalItems: 7,
  },
  {
    id: 'after_prayer',
    codeName: 'OP-03 // PRAYER',
    title: "Dzikir Ba'da Shalat",
    subtitle: 'Penyempurna shalat fardhu 5 waktu',
    timeWindow: 'Setiap Selesai Shalat Fardhu',
    badge: '5x SEHARI',
    accent: '#A78BFA',
    totalItems: 6,
  },
  {
    id: 'sleep',
    codeName: 'OP-04 // NIGHT',
    title: 'Dzikir Sebelum Tidur',
    subtitle: 'Penjagaan malaikat hingga fajar menjelang',
    timeWindow: 'Menjelang Istirahat Malam',
    badge: 'MALAM',
    accent: '#F43F5E',
    totalItems: 5,
  },
];

export const DAILY_ADZKAR: AdzkarItem[] = [
  // ==================== DZIKIR PAGI ====================
  {
    id: 'pagi-1',
    category: 'morning',
    title: 'Ayat Kursi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Allahu laa ilaaha illa huwal hayyul qayyum, laa ta'khudzuhu sinatuw-wa laa nawm, lahu maa fis-samaawaati wa maa fil-ardh, man dzalladzii yasyfa'u 'indahuu illaa bi-idznih, ya'lamu maa bayna aydiihim wa maa khalfahum, wa laa yuhiithuuna bisyay-im min 'ilmihii illaa bimaa syaa-a, wasi'a kursiyyuhus-samaawaati wal-ardh, wa laa ya-uuduhuu hifzhuhumaa, wa huwal 'aliyyul 'azhiim.",
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus makhluk-Nya, tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Mahatinggi, Mahabesar.',
    repeatTarget: 1,
    source: 'HR. An-Nasa’i & Al-Hakim (Shahih)',
    virtue: 'Siapa yang membacanya di pagi hari akan dilindungi dari gangguan jin hingga petang hari.',
  },
  {
    id: 'pagi-2',
    category: 'morning',
    title: 'Sayyidul Istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma anta Rabbii laa ilaaha illaa anta, khalaqtanii wa anaa 'abduka, wa anaa 'alaa 'ahdika wa wa'dika mastatha'tu, a'uudzu bika min syarri maa shana'tu, abuu-u laka bini'matika 'alayya, wa abuu-u bidzanbii faghfir lii fa-innahuu laa yaghfirudz-dzunuuba illaa anta.",
    translation: 'Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan selain Engkau. Engkau yang menciptakan aku dan aku adalah hamba-Mu. Aku memegang janji-Mu dan ikrar-Mu semampuku. Aku berlindung kepada-Mu dari keburukan apa yang telah kuperbuat. Aku mengakui kenikmatan-Mu kepadaku dan aku mengakui dosaku, maka ampunilah aku, sesungguhnya tidak ada yang dapat mengampuni dosa selain Engkau.',
    repeatTarget: 1,
    source: 'HR. Bukhari no. 6306',
    virtue: 'Siapa membacanya dengan yakin di pagi hari lalu wafat sebelum petang, ia termasuk penghuni surga.',
  },
  {
    id: 'pagi-3',
    category: 'morning',
    title: 'Asbahna wa Asbahal Mulku Lillah',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَٰذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ',
    transliteration: "Ashbahnaa wa ashbahal mulku lillaahi wal-hamdu lillaah, laa ilaaha illallaahu wahdahuu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syay-in qadiir. Rabbi as-aluka khayra maa fii haadzal yawmi wa khayra maa ba'dahu, wa a'uudzu bika min syarri maa fii haadzal yawmi wa syarri maa ba'dah.",
    translation: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Milik-Nya segala kerajaan dan bagi-Nya segala puji, dan Dia Mahakuasa atas segala sesuatu. Wahai Tuhanku, aku memohon kebaikan hari ini dan kebaikan setelahnya, dan aku berlindung dari keburukan hari ini dan keburukan setelahnya.',
    repeatTarget: 1,
    source: 'HR. Muslim no. 2723',
    virtue: 'Menyerahkan kepemilikan hari kepada Allah dan memohon perlindungan dari malas serta azab.',
  },
  {
    id: 'pagi-4',
    category: 'morning',
    title: 'Al-Mu’awwidzatain & Al-Ikhlas (3x)',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    transliteration: 'Qul huwallahu ahad. Allahush-shamad. Lam yalid wa lam yuulad. Wa lam yakun lahu kufuwan ahad. (Dilanjutkan Al-Falaq & An-Nas)',
    translation: 'Katakanlah (Muhammad): "Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. (Allah) tidak beranak dan tidak pula diperanakkan. Dan tidak ada sesuatu yang setara dengan Dia." (Dibaca bersama Surat Al-Falaq & An-Nas 3x)',
    repeatTarget: 3,
    source: 'HR. Abu Dawud no. 5082 & Tirmidzi no. 3575',
    virtue: 'Membacanya 3 kali di waktu pagi dan petang mencukupimu dari segala keburukan dan marabahaya.',
  },
  {
    id: 'pagi-5',
    category: 'morning',
    title: 'Bismillahilladzi La Yadhurru (3x)',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillaahil-ladzii laa yadhurru ma'as-mihii syay-un fil-ardhi wa laa fis-samaa-i wa huwas-samii'ul 'aliim.",
    translation: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat membahayakan, dan Dia Maha Mendengar, Maha Mengetahui.',
    repeatTarget: 3,
    source: 'HR. Abu Dawud no. 5088 & Tirmidzi no. 3388',
    virtue: 'Tidak ada marabahaya atau racun/sengatan yang dapat mencelakai siapa pun yang membacanya 3 kali.',
  },
  {
    id: 'pagi-6',
    category: 'morning',
    title: 'Radhitu Billahi Rabba (3x)',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration: "Radhiitu billaahi rabbaa, wa bil-islaami diinaa, wa bi-muhammadin shallallaahu 'alayhi wa sallama nabiyyaa.",
    translation: 'Aku ridha Allah sebagai Tuhanku, Islam sebagai agamaku, dan Muhammad shallallahu ‘alaihi wa sallam sebagai nabiku.',
    repeatTarget: 3,
    source: 'HR. Abu Dawud no. 5072 & Ahmad (Shahih)',
    virtue: 'Allah pasti akan meridhai hamba-Nya yang mengucapkannya pada hari kiamat kelak.',
  },
  {
    id: 'pagi-7',
    category: 'morning',
    title: 'Ya Hayyu Ya Qayyum',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ',
    transliteration: "Yaa Hayyu yaa Qayyuumu bi-rahmatika astaghiits, ashlih lii sya'nii kullahu, wa laa takilnii ilaa nafsii tharfata 'ayn.",
    translation: 'Wahai Yang Mahahidup, wahai Yang Maha Mengurus terus-menerus! Dengan rahmat-Mu aku memohon pertolongan, perbaikilah urusanku seluruhnya, dan janganlah Engkau serahkan aku kepada diriku sendiri walau sekejap mata.',
    repeatTarget: 1,
    source: 'HR. An-Nasa’i & Al-Hakim (Hasan)',
    virtue: 'Doa memohon perbaikan seluruh urusan hidup dan ketergantungan mutlak hanya kepada Allah.',
  },
  {
    id: 'pagi-8',
    category: 'morning',
    title: 'Subhanallah wa Bihamdihi (100x)',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhaanallaahi wa bihamdih.',
    translation: 'Mahasuci Allah dan dengan memuji-Nya.',
    repeatTarget: 100,
    source: 'HR. Muslim no. 2692',
    virtue: 'Dosa-dosanya akan diampuni meskipun sebanyak buih di lautan.',
  },

  // ==================== DZIKIR PETANG ====================
  {
    id: 'petang-1',
    category: 'evening',
    title: 'Ayat Kursi (Petang)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Allahu laa ilaaha illa huwal hayyul qayyum...",
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus makhluk-Nya, tidak mengantuk dan tidak tidur...',
    repeatTarget: 1,
    source: 'HR. An-Nasa’i & Al-Hakim (Shahih)',
    virtue: 'Siapa yang membacanya di petang hari akan dijaga dari marabahaya jin dan setan sampai pagi.',
  },
  {
    id: 'petang-2',
    category: 'evening',
    title: 'Amsayna wa Amsal Mulku Lillah',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَٰذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا',
    transliteration: "Amsaynaa wa amsal-mulku lillaahi wal-hamdu lillaah, laa ilaaha illallaahu wahdahuu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syay-in qadiir. Rabbi as-aluka khayra maa fii haadzihil laylati wa khayra maa ba'dahaa, wa a'uudzu bika min syarri maa fii haadzihil laylati wa syarri maa ba'dahaa.",
    translation: 'Kami telah memasuki waktu sore dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada tuhan selain Allah semata, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan puji-pujian, dan Dia Mahakuasa atas segala sesuatu. Wahai Tuhanku, aku memohon kepada-Mu kebaikan malam ini dan kebaikan setelahnya...',
    repeatTarget: 1,
    source: 'HR. Muslim no. 2723',
    virtue: 'Membentengi diri saat transisi siang menuju malam yang sunyi.',
  },
  {
    id: 'petang-3',
    category: 'evening',
    title: 'Sayyidul Istighfar (Petang)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma anta Rabbii laa ilaaha illaa anta, khalaqtanii wa anaa 'abduka...",
    translation: 'Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan selain Engkau. Engkau yang menciptakan aku dan aku adalah hamba-Mu...',
    repeatTarget: 1,
    source: 'HR. Bukhari no. 6306',
    virtue: 'Siapa membacanya di petang hari lalu meninggal di malam hari, ia dijamin masuk surga.',
  },
  {
    id: 'petang-4',
    category: 'evening',
    title: 'A’udzu Bikalimatillahit Tammati (3x)',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'uudzu bikalimaatillaahit-taammaati min syarri maa khalaq.",
    translation: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan apa yang telah Dia ciptakan.',
    repeatTarget: 3,
    source: 'HR. Muslim no. 2709',
    virtue: 'Siapa membacanya pada sore hari, sengatan binatang berbisa dan marabahaya malam tidak akan membahayakannya.',
  },
  {
    id: 'petang-5',
    category: 'evening',
    title: 'Bismillahilladzi La Yadhurru (3x)',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillaahil-ladzii laa yadhurru ma'as-mihii syay-un fil-ardhi wa laa fis-samaa-i wa huwas-samii'ul 'aliim.",
    translation: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat membahayakan...',
    repeatTarget: 3,
    source: 'HR. Abu Dawud & Tirmidzi',
    virtue: 'Perlindungan total dari segala racun, bencana malam, dan marabahaya.',
  },
  {
    id: 'petang-6',
    category: 'evening',
    title: 'Allahumma Bika Amsayna',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration: "Allahumma bika amsaynaa, wa bika ashbahnaa, wa bika nahyaa, wa bika namuutu, wa ilaykal mashiir.",
    translation: 'Ya Allah, dengan pertolongan-Mu kami memasuki waktu petang, dan dengan pertolongan-Mu kami memasuki waktu pagi, dengan-Mu kami hidup dan dengan-Mu kami mati, serta kepada-Mu tempat kembali.',
    repeatTarget: 1,
    source: 'HR. Tirmidzi no. 3391 (Shahih)',
    virtue: 'Menyadari hakikat kehidupan dan kepasrahan kepada Sang Pencipta.',
  },
  {
    id: 'petang-7',
    category: 'evening',
    title: 'Tahlil 10x',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Laa ilaaha illallaahu wahdahuu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syay-in qadiir.",
    translation: 'Tidak ada tuhan selain Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala puji, dan Dia Mahakuasa atas segala sesuatu.',
    repeatTarget: 10,
    source: 'HR. An-Nasa’i & Ahmad (Shahih)',
    virtue: 'Pahala memerdekakan empat budak dari keturunan Nabi Ismail ‘alaihissalam.',
  },

  // ==================== DZIKIR BA'DA SHALAT ====================
  {
    id: 'shlt-1',
    category: 'after_prayer',
    title: 'Istighfar (3x) & Salam',
    arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ\nاللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    transliteration: "Astaghfirullaah, Astaghfirullaah, Astaghfirullaah. Allahumma antas-salaamu wa minkas-salaamu, tabaarakta yaa dzal-jalaali wal-ikraam.",
    translation: 'Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau Mahasejahtera dan dari-Mu kesejahteraan, Mahasuci Engkau wahai Rabb Pemilik Keagungan dan Kemuliaan.',
    repeatTarget: 1,
    source: 'HR. Muslim no. 591',
    virtue: 'Dibaca Rasulullah shallallahu ‘alaihi wa sallam tepat setelah selesai salam setiap shalat fardhu.',
  },
  {
    id: 'shlt-2',
    category: 'after_prayer',
    title: 'Tasbih Ba’da Shalat (33x)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhaanallaah.',
    translation: 'Mahasuci Allah.',
    repeatTarget: 33,
    source: 'HR. Muslim no. 597',
    virtue: 'Menyucikan Allah dari segala kekurangan dan cela.',
  },
  {
    id: 'shlt-3',
    category: 'after_prayer',
    title: 'Tahmid Ba’da Shalat (33x)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillaah.',
    translation: 'Segala puji bagi Allah.',
    repeatTarget: 33,
    source: 'HR. Muslim no. 597',
    virtue: 'Memenuhi timbangan amal kebaikan hamba di hari kiamat.',
  },
  {
    id: 'shlt-4',
    category: 'after_prayer',
    title: 'Takbir Ba’da Shalat (33x)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allaahu Akbar.',
    translation: 'Allah Mahabesar.',
    repeatTarget: 33,
    source: 'HR. Muslim no. 597',
    virtue: 'Mengakui kebesaran Allah di atas seluruh urusan dan makhluk dunia.',
  },
  {
    id: 'shlt-5',
    category: 'after_prayer',
    title: 'Penyempurna Seratus (1x)',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Laa ilaaha illallaahu wahdahuu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syay-in qadiir.",
    translation: 'Tidak ada tuhan selain Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan puji-pujian, dan Dia Mahakuasa atas segala sesuatu.',
    repeatTarget: 1,
    source: 'HR. Muslim no. 597',
    virtue: 'Siapa yang menggenapkan hitungan 100 dengan kalimat ini, diampuni dosanya walaupun sebanyak buih di laut.',
  },
  {
    id: 'shlt-6',
    category: 'after_prayer',
    title: 'Ayat Kursi Ba’da Shalat',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...',
    transliteration: "Allahu laa ilaaha illa huwal hayyul qayyum...",
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus makhluk-Nya...',
    repeatTarget: 1,
    source: 'HR. An-Nasa’i (Al-Kubra) no. 9928 (Shahih)',
    virtue: 'Siapa membacanya setiap selesai shalat fardhu, tidak ada yang menghalanginya masuk surga melainkan kematian.',
  },

  // ==================== DZIKIR SEBELUM TIDUR ====================
  {
    id: 'tdr-1',
    category: 'sleep',
    title: 'Tiga Surat Perlindungan (3 Qul)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ ...\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ...\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ...',
    transliteration: 'Membaca Al-Ikhlas, Al-Falaq, An-Nas dengan merapatkan kedua telapak tangan lalu meniupnya dan mengusap ke seluruh anggota tubuh yang terjangkau.',
    translation: 'Katakanlah: Dialah Allah Yang Maha Esa... Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai subuh... Katakanlah: Aku berlindung kepada Tuhannya manusia...',
    repeatTarget: 3,
    source: 'HR. Bukhari no. 5017',
    virtue: 'Sunnah Nabi shallallahu ‘alaihi wa sallam untuk membentengi jiwa dan raga dari gangguan jahat di malam hari.',
  },
  {
    id: 'tdr-2',
    category: 'sleep',
    title: 'Ayat Kursi Sebelum Tidur',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ...',
    transliteration: "Allahu laa ilaaha illa huwal hayyul qayyum...",
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus makhluk-Nya...',
    repeatTarget: 1,
    source: 'HR. Bukhari no. 2311',
    virtue: 'Malaikat penjaga akan mendampingimu dan setan tidak akan sanggup mendekatimu sampai subuh.',
  },
  {
    id: 'tdr-3',
    category: 'sleep',
    title: 'Dua Ayat Terakhir Al-Baqarah (285-286)',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ',
    transliteration: "Aamanar-rasuulu bimaa unzila ilayhi mir-rabbihii wal-mu'minuun, kullun aamana billaahi wa malaa-ikatihii wa kutubihii wa rusulih...",
    translation: 'Rasul (Muhammad) beriman kepada apa yang diturunkan kepadanya dari Tuhannya, demikian pula orang-orang yang beriman. Semua beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, dan rasul-rasul-Nya...',
    repeatTarget: 1,
    source: 'HR. Bukhari no. 5009 & Muslim no. 808',
    virtue: 'Siapa membacanya pada suatu malam, maka kedua ayat tersebut mencukupinya (dari keburukan dan gangguan).',
  },
  {
    id: 'tdr-4',
    category: 'sleep',
    title: 'Bismika Rabbi Wadha’tu Janbi',
    arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    transliteration: "Bismika Rabbii wadha'tu janbii, wa bika arfa'uh, fa-in amsakta nafsii farhamhaa, wa in arsaltahaa fahfazh-haa bimaa tahfazhu bihii 'ibaadakas-shaalihiin.",
    translation: 'Dengan nama-Mu wahai Rabbku, aku meletakkan lambungku (tidur), dan dengan nama-Mu pula aku mengangkatnya. Jika Engkau menahan nyawaku maka sayangilah ia, dan jika Engkau melepaskannya maka peliharalah ia sebagaimana Engkau memelihara hamba-hamba-Mu yang shalih.',
    repeatTarget: 1,
    source: 'HR. Bukhari no. 6320 & Muslim no. 2714',
    virtue: 'Memohon perlindungan jiwa ketika tidur di bawah pengawasan dan kasih sayang Allah.',
  },
  {
    id: 'tdr-5',
    category: 'sleep',
    title: 'Bismika Allahumma Amuutu wa Ahyaa',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amuutu wa ahyaa.',
    translation: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
    repeatTarget: 1,
    source: 'HR. Bukhari no. 6312 & Muslim no. 2711',
    virtue: 'Kalimat penutup sebelum terlelap, mengingat hakikat tidur sebagai kematian kecil.',
  },
];

export interface TasbihPreset {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  defaultTarget: number;
}

export const TASBIH_PRESETS: TasbihPreset[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    translation: 'Mahasuci Allah',
    defaultTarget: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Segala puji bagi Allah',
    defaultTarget: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah Mahabesar',
    defaultTarget: 33,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
    transliteration: 'Astaghfirullahal ‘Azhim',
    translation: 'Aku memohon ampun kepada Allah Yang Mahaagung',
    defaultTarget: 100,
  },
  {
    id: 'tahlil',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'Laa ilaaha illallaah',
    translation: 'Tiada tuhan selain Allah',
    defaultTarget: 100,
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ',
    transliteration: 'Allahumma shalli ‘ala Muhammad wa ‘ala aali Muhammad',
    translation: 'Ya Allah berikanlah shalawat kepada Muhammad dan keluarga Muhammad',
    defaultTarget: 100,
  },
  {
    id: 'hauqalah',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: 'Laa hawla wa laa quwwata illaa billaahil ‘aliyyil ‘azhiim',
    translation: 'Tiada daya dan upaya kecuali dengan pertolongan Allah',
    defaultTarget: 33,
  },
  {
    id: 'subhanallah_bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'Subhaanallaahi wa bihamdihii subhaanallaahil ‘azhiim',
    translation: 'Mahasuci Allah dengan memuji-Nya, Mahasuci Allah Yang Mahaagung',
    defaultTarget: 100,
  },
];

export interface DailyReminder {
  arabic: string;
  translation: string;
  source: string;
  theme: string;
}

export const DAILY_REMINDERS: DailyReminder[] = [
  {
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.',
    source: 'QS. Ar-Ra’d: 28',
    theme: 'KETENANGAN JIWA',
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'Maka ingatlah kepada-Ku, niscaya Aku ingat kepadamu. Bersyukurlah kepada-Ku, dan janganlah kamu ingkar.',
    source: 'QS. Al-Baqarah: 152',
    theme: 'PERINTAH DZIKIR',
  },
  {
    arabic: 'مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لَا يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ',
    translation: 'Perumpamaan orang yang berdzikir mengingat Rabbnya dan yang tidak, seperti orang yang hidup dengan orang yang mati.',
    source: 'HR. Bukhari no. 6407',
    theme: 'KEHIDUPAN HATI',
  },
  {
    arabic: 'أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    translation: 'Amalan yang paling dicintai Allah adalah yang terus-menerus (konsisten) dilakukan meskipun sedikit.',
    source: 'HR. Bukhari & Muslim',
    theme: 'ISTIQAMAH',
  },
  {
    arabic: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَٰنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    translation: 'Dua kalimat yang ringan di lisan, berat di timbangan, dicintai Ar-Rahman: Subhanallahi wa bihamdihi, Subhanallahil Azhim.',
    source: 'HR. Bukhari no. 6682',
    theme: 'TIMBANGAN AMAL',
  },
];
