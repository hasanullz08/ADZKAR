/**
 * Data navigasi Al-Qur'an (Mushaf Madinah, riwayat Hafs 'an 'Ashim, 604 halaman).
 * Halaman mushaf berupa gambar WebP di /public/quran/pages/001.webp ... 604.webp
 */

export const QURAN_TOTAL_PAGES = 604;

export const quranPageSrc = (page: number): string =>
  `${import.meta.env.BASE_URL}quran/pages/${String(page).padStart(3, '0')}.webp`;

export interface SurahInfo {
  number: number;
  latin: string;
  arabic: string;
  meaning: string;
  ayahs: number;
  page: number; // halaman awal surah di mushaf
}

// [no, latin, arab, arti, jumlah ayat, halaman awal]
const RAW: Array<[number, string, string, string, number, number]> = [
  [1, 'Al-Fatihah', 'الفاتحة', 'Pembukaan', 7, 1],
  [2, 'Al-Baqarah', 'البقرة', 'Sapi Betina', 286, 2],
  [3, "Ali 'Imran", 'آل عمران', "Keluarga 'Imran", 200, 50],
  [4, 'An-Nisa', 'النساء', 'Wanita', 176, 77],
  [5, "Al-Ma'idah", 'المائدة', 'Hidangan', 120, 106],
  [6, "Al-An'am", 'الأنعام', 'Binatang Ternak', 165, 128],
  [7, "Al-A'raf", 'الأعراف', 'Tempat yang Tinggi', 206, 151],
  [8, 'Al-Anfal', 'الأنفال', 'Harta Rampasan Perang', 75, 177],
  [9, 'At-Taubah', 'التوبة', 'Pengampunan', 129, 187],
  [10, 'Yunus', 'يونس', 'Nabi Yunus', 109, 208],
  [11, 'Hud', 'هود', 'Nabi Hud', 123, 221],
  [12, 'Yusuf', 'يوسف', 'Nabi Yusuf', 111, 235],
  [13, "Ar-Ra'd", 'الرعد', 'Guruh', 43, 249],
  [14, 'Ibrahim', 'إبراهيم', 'Nabi Ibrahim', 52, 255],
  [15, 'Al-Hijr', 'الحجر', 'Hijr', 99, 262],
  [16, 'An-Nahl', 'النحل', 'Lebah', 128, 267],
  [17, 'Al-Isra', 'الإسراء', "Perjalanan Malam", 111, 282],
  [18, 'Al-Kahfi', 'الكهف', 'Gua', 110, 293],
  [19, 'Maryam', 'مريم', 'Maryam', 98, 305],
  [20, 'Thaha', 'طه', 'Thaha', 135, 312],
  [21, 'Al-Anbiya', 'الأنبياء', 'Para Nabi', 112, 322],
  [22, 'Al-Hajj', 'الحج', 'Haji', 78, 332],
  [23, "Al-Mu'minun", 'المؤمنون', 'Orang-orang Mukmin', 118, 342],
  [24, 'An-Nur', 'النور', 'Cahaya', 64, 350],
  [25, 'Al-Furqan', 'الفرقان', 'Pembeda', 77, 359],
  [26, "Asy-Syu'ara", 'الشعراء', 'Para Penyair', 227, 367],
  [27, 'An-Naml', 'النمل', 'Semut', 93, 377],
  [28, 'Al-Qashash', 'القصص', 'Kisah-kisah', 88, 385],
  [29, "Al-'Ankabut", 'العنكبوت', 'Laba-laba', 69, 396],
  [30, 'Ar-Rum', 'الروم', 'Bangsa Romawi', 60, 404],
  [31, 'Luqman', 'لقمان', 'Luqman', 34, 411],
  [32, 'As-Sajdah', 'السجدة', 'Sujud', 30, 415],
  [33, 'Al-Ahzab', 'الأحزاب', 'Golongan yang Bersekutu', 73, 418],
  [34, "Saba'", 'سبأ', 'Kaum Saba', 54, 428],
  [35, 'Fathir', 'فاطر', 'Pencipta', 45, 434],
  [36, 'Yasin', 'يس', 'Yasin', 83, 440],
  [37, 'Ash-Shaffat', 'الصافات', 'Barisan-barisan', 182, 446],
  [38, 'Shad', 'ص', 'Shad', 88, 453],
  [39, 'Az-Zumar', 'الزمر', 'Rombongan', 75, 458],
  [40, 'Ghafir', 'غافر', 'Maha Pengampun', 85, 467],
  [41, 'Fushshilat', 'فصلت', 'Dijelaskan dengan Terperinci', 54, 477],
  [42, 'Asy-Syura', 'الشورى', 'Musyawarah', 53, 483],
  [43, 'Az-Zukhruf', 'الزخرف', 'Perhiasan', 89, 489],
  [44, 'Ad-Dukhan', 'الدخان', 'Kabut', 59, 496],
  [45, 'Al-Jatsiyah', 'الجاثية', 'Yang Berlutut', 37, 499],
  [46, 'Al-Ahqaf', 'الأحقاف', 'Bukit-bukit Pasir', 35, 502],
  [47, 'Muhammad', 'محمد', 'Nabi Muhammad', 38, 507],
  [48, 'Al-Fath', 'الفتح', 'Kemenangan', 29, 511],
  [49, 'Al-Hujurat', 'الحجرات', 'Kamar-kamar', 18, 515],
  [50, 'Qaf', 'ق', 'Qaf', 45, 518],
  [51, 'Adz-Dzariyat', 'الذاريات', 'Angin yang Menerbangkan', 60, 520],
  [52, 'Ath-Thur', 'الطور', 'Bukit Thursina', 49, 523],
  [53, 'An-Najm', 'النجم', 'Bintang', 62, 526],
  [54, 'Al-Qamar', 'القمر', 'Bulan', 55, 528],
  [55, 'Ar-Rahman', 'الرحمن', 'Yang Maha Pengasih', 78, 531],
  [56, "Al-Waqi'ah", 'الواقعة', 'Hari Kiamat', 96, 534],
  [57, 'Al-Hadid', 'الحديد', 'Besi', 29, 537],
  [58, 'Al-Mujadilah', 'المجادلة', 'Wanita yang Mengajukan Gugatan', 22, 542],
  [59, 'Al-Hasyr', 'الحشر', 'Pengusiran', 24, 545],
  [60, 'Al-Mumtahanah', 'الممتحنة', 'Wanita yang Diuji', 13, 549],
  [61, 'Ash-Shaff', 'الصف', 'Barisan', 14, 551],
  [62, "Al-Jumu'ah", 'الجمعة', "Hari Jum'at", 11, 553],
  [63, 'Al-Munafiqun', 'المنافقون', 'Orang-orang Munafik', 11, 554],
  [64, 'At-Taghabun', 'التغابن', 'Hari Dinampakkan Kesalahan', 18, 556],
  [65, 'Ath-Thalaq', 'الطلاق', 'Talak', 12, 558],
  [66, 'At-Tahrim', 'التحريم', 'Mengharamkan', 12, 560],
  [67, 'Al-Mulk', 'الملك', 'Kerajaan', 30, 562],
  [68, 'Al-Qalam', 'القلم', 'Pena', 52, 564],
  [69, 'Al-Haqqah', 'الحاقة', 'Hari Kiamat', 52, 566],
  [70, "Al-Ma'arij", 'المعارج', 'Tempat Naik', 44, 568],
  [71, 'Nuh', 'نوح', 'Nabi Nuh', 28, 570],
  [72, 'Al-Jinn', 'الجن', 'Jin', 28, 572],
  [73, 'Al-Muzzammil', 'المزمل', 'Orang yang Berselimut', 20, 574],
  [74, 'Al-Muddatstsir', 'المدثر', 'Orang yang Berkemul', 56, 575],
  [75, 'Al-Qiyamah', 'القيامة', 'Hari Kiamat', 40, 577],
  [76, 'Al-Insan', 'الإنسان', 'Manusia', 31, 578],
  [77, 'Al-Mursalat', 'المرسلات', 'Malaikat yang Diutus', 50, 580],
  [78, "An-Naba'", 'النبأ', 'Berita Besar', 40, 582],
  [79, "An-Nazi'at", 'النازعات', 'Malaikat yang Mencabut', 46, 583],
  [80, "'Abasa", 'عبس', 'Bermuka Masam', 42, 585],
  [81, 'At-Takwir', 'التكوير', 'Menggulung', 29, 586],
  [82, 'Al-Infithar', 'الانفطار', 'Terbelah', 19, 587],
  [83, 'Al-Muthaffifin', 'المطففين', 'Orang-orang yang Curang', 36, 587],
  [84, 'Al-Insyiqaq', 'الانشقاق', 'Terbelah', 25, 589],
  [85, 'Al-Buruj', 'البروج', 'Gugusan Bintang', 22, 590],
  [86, 'Ath-Thariq', 'الطارق', 'Yang Datang di Malam Hari', 17, 591],
  [87, "Al-A'la", 'الأعلى', 'Yang Paling Tinggi', 19, 591],
  [88, 'Al-Ghasyiyah', 'الغاشية', 'Hari Pembalasan', 26, 592],
  [89, 'Al-Fajr', 'الفجر', 'Fajar', 30, 593],
  [90, 'Al-Balad', 'البلد', 'Negeri', 20, 594],
  [91, 'Asy-Syams', 'الشمس', 'Matahari', 15, 595],
  [92, 'Al-Lail', 'الليل', 'Malam', 21, 595],
  [93, 'Adh-Dhuha', 'الضحى', 'Waktu Dhuha', 11, 596],
  [94, 'Al-Insyirah', 'الشرح', 'Kelapangan', 8, 596],
  [95, 'At-Tin', 'التين', 'Buah Tin', 8, 597],
  [96, "Al-'Alaq", 'العلق', 'Segumpal Darah', 19, 597],
  [97, 'Al-Qadr', 'القدر', 'Kemuliaan', 5, 598],
  [98, 'Al-Bayyinah', 'البينة', 'Bukti Nyata', 8, 598],
  [99, 'Az-Zalzalah', 'الزلزلة', 'Kegoncangan', 8, 599],
  [100, "Al-'Adiyat", 'العاديات', 'Kuda Perang yang Berlari Kencang', 11, 599],
  [101, "Al-Qari'ah", 'القارعة', 'Hari Kiamat', 11, 600],
  [102, 'At-Takatsur', 'التكاثر', 'Bermegah-megahan', 8, 600],
  [103, "Al-'Ashr", 'العصر', 'Masa', 3, 601],
  [104, 'Al-Humazah', 'الهمزة', 'Pengumpat', 9, 601],
  [105, 'Al-Fil', 'الفيل', 'Gajah', 5, 601],
  [106, 'Quraisy', 'قريش', 'Suku Quraisy', 4, 602],
  [107, "Al-Ma'un", 'الماعون', 'Barang-barang yang Berguna', 7, 602],
  [108, 'Al-Kautsar', 'الكوثر', 'Nikmat yang Banyak', 3, 602],
  [109, 'Al-Kafirun', 'الكافرون', 'Orang-orang Kafir', 6, 603],
  [110, 'An-Nashr', 'النصر', 'Pertolongan', 3, 603],
  [111, 'Al-Lahab', 'المسد', 'Gejolak Api', 5, 603],
  [112, 'Al-Ikhlas', 'الإخلاص', 'Ikhlas', 4, 604],
  [113, 'Al-Falaq', 'الفلق', 'Waktu Subuh', 5, 604],
  [114, 'An-Nas', 'الناس', 'Manusia', 6, 604],
];

export const SURAHS: SurahInfo[] = RAW.map(([number, latin, arabic, meaning, ayahs, page]) => ({
  number, latin, arabic, meaning, ayahs, page,
}));

/** Halaman awal tiap juz (index 0 = juz 1) */
export const JUZ_START_PAGES: number[] = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
  201, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

export const getJuzByPage = (page: number): number => {
  let juz = 1;
  for (let i = 0; i < JUZ_START_PAGES.length; i++) {
    if (page >= JUZ_START_PAGES[i]) juz = i + 1;
  }
  return juz;
};

/** Surah yang dimulai/berlangsung di halaman tersebut (surah terakhir yang awalnya <= page). */
export const getSurahByPage = (page: number): SurahInfo => {
  let found = SURAHS[0];
  for (const s of SURAHS) {
    if (s.page <= page) found = s;
    else break;
  }
  return found;
};
