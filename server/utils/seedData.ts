export interface SeedCategory {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  color: string
}

export interface SeedBook {
  id: number
  title: string
  slug: string
  author: string
  isbn: string
  publisher: string
  year: number
  pages: number
  callNumber: string
  shelfLocation: string
  coverUrl: string
  synopsis: string
  stock: number
  available: number
  rating: number
  reviewsCount: number
  isFeatured: boolean
  isLiterature: boolean
  discipline: string
  categoryId: number
  category?: SeedCategory
}

export const initialCategories: SeedCategory[] = [
  {
    id: 1,
    name: 'Sains & Teknologi',
    slug: 'sains-dan-teknologi',
    description: 'Monograf komputasi, kecerdasan buatan, rekayasa software, elektro, dan fisika.',
    icon: 'terminal',
    color: '#1e3a8a'
  },
  {
    id: 2,
    name: 'Ilmu Sosial & Politik',
    slug: 'ilmu-sosial-dan-politik',
    description: 'Koleksi sosiologi, ilmu pemerintahan, komunikasi, dan studi kebijakan publik.',
    icon: 'public',
    color: '#0284c7'
  },
  {
    id: 3,
    name: 'Ekonomi & Manajemen Bisnis',
    slug: 'ekonomi-dan-manajemen-bisnis',
    description: 'Literatur makro-mikro ekonomi, akuntansi korporasi, investasi, dan strategi bisnis.',
    icon: 'trending_up',
    color: '#059669'
  },
  {
    id: 4,
    name: 'Sastra, Fiksi & Puisi',
    slug: 'sastra-fiksi-dan-puisi',
    description: 'Karya sastra kanonik Indonesia, novel fiksi filosofis, antologi puisi, dan prosa dunia.',
    icon: 'auto_stories',
    color: '#d97706'
  },
  {
    id: 5,
    name: 'Ilmu Hukum & Konstitusi',
    slug: 'ilmu-hukum-dan-konstitusi',
    description: 'Kompilasi hukum perdata, pidana, tata negara, HAM, dan hukum internasional.',
    icon: 'gavel',
    color: '#7c3aed'
  },
  {
    id: 6,
    name: 'Humaniora & Filsafat',
    slug: 'humaniora-dan-filsafat',
    description: 'Eksplorasi etika, sejarah peradaban, epistemologi, arkeologi, dan studi kebudayaan.',
    icon: 'history_edu',
    color: '#dc2626'
  },
  {
    id: 7,
    name: 'Kedokteran & Kesehatan',
    slug: 'kedokteran-dan-kesehatan',
    description: 'Buku teks biomedis, ilmu bedah, farmakologi klinis, dan epidemiologi kesehatan.',
    icon: 'medical_services',
    color: '#0d9488'
  }
]

export const initialBooks: SeedBook[] = [
  {
    id: 1,
    title: 'Artificial Intelligence: A Modern Approach (4th Edition)',
    slug: 'artificial-intelligence-a-modern-approach',
    author: 'Stuart Russell & Peter Norvig',
    isbn: '978-0134610993',
    publisher: 'Pearson Education',
    year: 2021,
    pages: 1152,
    callNumber: '006.3 RUS a',
    shelfLocation: 'Lantai 2 - Rak B-01',
    coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Buku teks standar rujukan utama dunia untuk bidang kecerdasan buatan. Mengupas secara komprehensif mulai dari agen cerdas, probabilitas, machine learning, deep learning, NLP, hingga implikasi etika AI masa depan.',
    stock: 5,
    available: 4,
    rating: 4.9,
    reviewsCount: 38,
    isFeatured: true,
    isLiterature: false,
    discipline: 'Sains & Teknologi',
    categoryId: 1,
    category: initialCategories[0]
  },
  {
    id: 2,
    title: 'Designing Data-Intensive Applications',
    slug: 'designing-data-intensive-applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    publisher: 'O’Reilly Media',
    year: 2022,
    pages: 616,
    callNumber: '005.74 KLE d',
    shelfLocation: 'Lantai 2 - Rak B-03',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Panduan mendalam tentang arsitektur data modern, konsistensi terdistribusi, replikasi database, sistem partisi, dan penanganan skalabilitas tinggi pada infrastruktur komputasi awan terkini.',
    stock: 4,
    available: 3,
    rating: 5.0,
    reviewsCount: 52,
    isFeatured: true,
    isLiterature: false,
    discipline: 'Sains & Teknologi',
    categoryId: 1,
    category: initialCategories[0]
  },
  {
    id: 3,
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    slug: 'clean-code-handbook',
    author: 'Robert C. Martin (Uncle Bob)',
    isbn: '978-0132350884',
    publisher: 'Prentice Hall',
    year: 2020,
    pages: 464,
    callNumber: '005.1 MAR c',
    shelfLocation: 'Lantai 2 - Rak B-02',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Prinsip, pola, dan praktik penulisan kode yang mudah dipelihara, modular, dan teruji dengan standar industri rekayasa perangkat lunak internasional.',
    stock: 6,
    available: 2,
    rating: 4.8,
    reviewsCount: 44,
    isFeatured: true,
    isLiterature: false,
    discipline: 'Sains & Teknologi',
    categoryId: 1,
    category: initialCategories[0]
  },
  {
    id: 4,
    title: 'Quantum Computing and Quantum Information',
    slug: 'quantum-computing-quantum-information',
    author: 'Michael A. Nielsen & Isaac L. Chuang',
    isbn: '978-1107002173',
    publisher: 'Cambridge University Press',
    year: 2019,
    pages: 702,
    callNumber: '530.12 NIE q',
    shelfLocation: 'Lantai 2 - Rak B-07',
    coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Karya fundamental yang mengintegrasikan mekanika kuantum dengan teori informasi komputasi, mencakup sirkuit kuantum, algoritma Shor dan Grover, serta koreksi kesalahan kuantum.',
    stock: 3,
    available: 3,
    rating: 4.9,
    reviewsCount: 19,
    isFeatured: false,
    isLiterature: false,
    discipline: 'Sains & Teknologi',
    categoryId: 1,
    category: initialCategories[0]
  },
  {
    id: 5,
    title: 'Bumi Manusia (Tetralogi Buru Bagian Pertama)',
    slug: 'bumi-manusia-pramoedya',
    author: 'Pramoedya Ananta Toer',
    isbn: '978-9799731234',
    publisher: 'Lentera Dipantara',
    year: 2021,
    pages: 535,
    callNumber: '899.221 TOE b',
    shelfLocation: 'Lantai 3 - Rak Sastra S-01',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Mahakarya sastra legendaris berlatar Hindia Belanda akhir abad ke-19. Mengikuti perjalanan batin Minke, pemuda pribumi terpelajar yang memperjuangkan martabat kemanusiaan, cinta terlarang bersama Annelies Mellema, dan keteguhan Nyai Ontosoroh melawan kezaliman hukum kolonial.',
    stock: 8,
    available: 6,
    rating: 5.0,
    reviewsCount: 89,
    isFeatured: true,
    isLiterature: true,
    discipline: 'Sastra & Fiksi',
    categoryId: 4,
    category: initialCategories[3]
  },
  {
    id: 6,
    title: 'Cantik Itu Luka',
    slug: 'cantik-itu-luka-eka-kurniawan',
    author: 'Eka Kurniawan',
    isbn: '978-6020312583',
    publisher: 'Gramedia Pustaka Utama',
    year: 2022,
    pages: 508,
    callNumber: '899.221 KUR c',
    shelfLocation: 'Lantai 3 - Rak Sastra S-02',
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Novel realisme magis peraih apresiasi sastra internasional. Berkisah tentang Dewi Ayu yang bangkit dari kubur di kota fiktif Halimunda, mengungkap sejarah kelam kekerasan kolonialisme dan kutukan turun-temurun.',
    stock: 5,
    available: 4,
    rating: 4.8,
    reviewsCount: 67,
    isFeatured: true,
    isLiterature: true,
    discipline: 'Sastra & Fiksi',
    categoryId: 4,
    category: initialCategories[3]
  },
  {
    id: 7,
    title: 'Tenggelamnya Kapal Van der Wijck',
    slug: 'tenggelamnya-kapal-van-der-wijck',
    author: 'Haji Abdul Malik Karim Amrullah (Hamka)',
    isbn: '978-9799399038',
    publisher: 'Bulan Bintang',
    year: 2020,
    pages: 268,
    callNumber: '899.221 HAM t',
    shelfLocation: 'Lantai 3 - Rak Sastra S-03',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Romansa tragis Zainuddin dan Hayati di tengah benturan adat Minangkabau yang kaku dan perbedaan kelas sosial. Roman sastra klasik abadi dengan kekayaan prosa bahasa Melayu tinggi.',
    stock: 6,
    available: 5,
    rating: 4.9,
    reviewsCount: 42,
    isFeatured: false,
    isLiterature: true,
    discipline: 'Sastra & Fiksi',
    categoryId: 4,
    category: initialCategories[3]
  },
  {
    id: 8,
    title: 'Hujan Bulan Juni: Sepilihan Puisi',
    slug: 'hujan-bulan-juni-sapardi',
    author: 'Sapardi Djoko Damono',
    isbn: '978-6020301143',
    publisher: 'Gramedia Pustaka Utama',
    year: 2023,
    pages: 144,
    callNumber: '899.221 DAM h',
    shelfLocation: 'Lantai 3 - Rak Sastra S-06',
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd9?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Kumpulan sajak liris paling ikonis dari maestro puisi Indonesia. Mengekspresikan ketabahan, kesunyian, dan kerinduan melalui diksi sederhana namun sarat makna eksistensial.',
    stock: 4,
    available: 2,
    rating: 4.9,
    reviewsCount: 51,
    isFeatured: false,
    isLiterature: true,
    discipline: 'Sastra & Fiksi',
    categoryId: 4,
    category: initialCategories[3]
  },
  {
    id: 9,
    title: 'Metode Penelitian Kualitatif & Kuantitatif Komprehensif',
    slug: 'metode-penelitian-kualitatif-kuantitatif',
    author: 'Prof. Dr. Sugiyono',
    isbn: '978-6022890560',
    publisher: 'Alfabeta Bandung',
    year: 2023,
    pages: 488,
    callNumber: '001.42 SUG m',
    shelfLocation: 'Lantai 1 - Rak Metodologi M-01',
    coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Buku pegangan riset wajib bagi mahasiswa dan peneliti akademis. Membahas formulasi masalah, instrumen penelitian, triangulasi data, statistik parametrik dan non-parametrik, hingga teknik penulisan skripsi dan tesis.',
    stock: 12,
    available: 7,
    rating: 4.7,
    reviewsCount: 110,
    isFeatured: true,
    isLiterature: false,
    discipline: 'Ilmu Sosial',
    categoryId: 2,
    category: initialCategories[1]
  },
  {
    id: 10,
    title: 'Macroeconomics (11th Global Edition)',
    slug: 'macroeconomics-n-gregory-mankiw',
    author: 'N. Gregory Mankiw',
    isbn: '978-1319263904',
    publisher: 'Worth Publishers',
    year: 2022,
    pages: 688,
    callNumber: '339 MAN m',
    shelfLocation: 'Lantai 2 - Rak Ekonomi E-02',
    coverUrl: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Buku teks standar internasional untuk teori ekonomi makro, fluktuasi siklus bisnis, kebijakan moneter bank sentral, inflasi, dan pertumbuhan ekonomi jangka panjang.',
    stock: 7,
    available: 5,
    rating: 4.8,
    reviewsCount: 39,
    isFeatured: true,
    isLiterature: false,
    discipline: 'Ekonomi & Bisnis',
    categoryId: 3,
    category: initialCategories[2]
  },
  {
    id: 11,
    title: 'Pokok-Pokok Hukum Perdata Indonesia',
    slug: 'pokok-pokok-hukum-perdata-subekti',
    author: 'Prof. R. Subekti, S.H.',
    isbn: '978-9794140024',
    publisher: 'Intermasa',
    year: 2022,
    pages: 310,
    callNumber: '346.598 SUB p',
    shelfLocation: 'Lantai 1 - Rak Hukum H-01',
    coverUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Rujukan standar akademisi hukum di seluruh Indonesia. Menguraikan asas-asas hukum kebendaan, hukum perikatan, perjanjian, pembuktian, dan kedaluwarsa sesuai KUHPerdata.',
    stock: 10,
    available: 8,
    rating: 4.9,
    reviewsCount: 65,
    isFeatured: true,
    isLiterature: false,
    discipline: 'Ilmu Hukum',
    categoryId: 5,
    category: initialCategories[4]
  },
  {
    id: 12,
    title: 'Sapiens: Riwayat Singkat Umat Manusia',
    slug: 'sapiens-riwayat-singkat-umat-manusia',
    author: 'Yuval Noah Harari',
    isbn: '978-6024244163',
    publisher: 'Kepustakaan Populer Gramedia',
    year: 2022,
    pages: 524,
    callNumber: '909 HAR s',
    shelfLocation: 'Lantai 3 - Rak Filsafat F-02',
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd9?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Penjelajahan sejarah evolusi Homo sapiens dari kera tak berarti di Afrika Timur hingga menjadi penguasa planet bumi melalui tiga revolusi besar: Kognitif, Pertanian, dan Saintifik.',
    stock: 6,
    available: 4,
    rating: 4.9,
    reviewsCount: 78,
    isFeatured: true,
    isLiterature: false,
    discipline: 'Humaniora',
    categoryId: 6,
    category: initialCategories[5]
  }
]
