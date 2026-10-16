<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
    <!-- KHUSUS ADMIN: STANDALONE ADMIN TOPBAR -->
    <header class="bg-primary text-white border-b border-primary-container sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- Logo & Title -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-white/10 text-secondary-container flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-xl">admin_panel_settings</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-serif font-bold text-base tracking-tight text-white">Panel Pengelola Perpustakaan</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary uppercase tracking-wider">
                Khusus Admin
              </span>
            </div>
            <p class="text-[11px] text-white/70 hidden sm:block">Sistem Pengelolaan Konten Website, Katalog Buku, & Genre</p>
          </div>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-2.5">
          <NuxtLink
            to="/"
            target="_blank"
            class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/10"
            title="Buka Website Utama di Tab Baru"
          >
            <span class="material-symbols-outlined text-sm">open_in_new</span>
            <span class="hidden sm:inline">Buka Website Publik</span>
          </NuxtLink>

          <button
            v-if="isAuthenticated"
            @click="handleLogout"
            class="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-white text-xs font-semibold transition-all flex items-center gap-1 border border-rose-400/30"
          >
            <span class="material-symbols-outlined text-sm">logout</span>
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>

    <!-- CONTENT WRAPPER -->
    <main class="flex-1 py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- 1. FORM LOGIN JIKA BELUM TEROTENTIKASI -->
        <div v-if="!isAuthenticated" class="max-w-md mx-auto pt-10 sm:pt-16">
          <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center">
            <div class="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span class="material-symbols-outlined text-3xl">lock</span>
            </div>

            <h1 class="font-serif font-bold text-2xl text-primary mb-2">Autentikasi Pengelola</h1>
            <p class="text-xs text-slate-500 mb-6 leading-relaxed">
              Halaman ini khusus untuk administrator perpustakaan. Silakan masukkan kata sandi pengelola untuk mengelola website, buku, dan genre.
            </p>

            <form @submit.prevent="handleLogin" class="space-y-4 text-left">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi Admin</label>
                <div class="relative">
                  <input
                    v-model="passwordInput"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Masukkan kata sandi..."
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autofocus
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    <span class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
                <p class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs">info</span>
                  <span>Kata sandi bawaan: <strong class="text-primary font-mono">admin123</strong></span>
                </p>
              </div>

              <div v-if="loginError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <span class="material-symbols-outlined text-sm shrink-0">error</span>
                <span>{{ loginError }}</span>
              </div>

              <button
                type="submit"
                class="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-container transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">lock_open</span>
                <span>Masuk ke Panel Pengelola</span>
              </button>
            </form>

            <div class="mt-6 pt-5 border-t border-slate-100">
              <NuxtLink to="/" class="text-xs text-secondary font-semibold hover:underline inline-flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">arrow_back</span>
                <span>Kembali ke Website Publik</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- 2. DASHBOARD KHUSUS ADMIN (JIKA SUDAH LOGIN) -->
        <div v-else class="space-y-6">
          <!-- Notification Alert Toast -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="successMessage" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                <span>{{ successMessage }}</span>
              </div>
              <button @click="successMessage = ''" class="text-emerald-700 hover:text-emerald-950">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </transition>

          <!-- MENU UTAMA ADMIN: 3 PILIHAN BESAR -->
          <div class="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
            <button
              type="button"
              @click="mainSection = 'website'"
              class="flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              :class="mainSection === 'website' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <span class="material-symbols-outlined text-lg">dashboard_customize</span>
              <span>1. Pengaturan Website (Navbar, Hero, Footer)</span>
            </button>

            <button
              type="button"
              @click="mainSection = 'books'"
              class="flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              :class="mainSection === 'books' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <span class="material-symbols-outlined text-lg">auto_stories</span>
              <span>2. Kelola Koleksi Buku ({{ booksList.length }})</span>
            </button>

            <button
              type="button"
              @click="mainSection = 'genres'"
              class="flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              :class="mainSection === 'genres' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <span class="material-symbols-outlined text-lg">category</span>
              <span>3. Kelola Rumpun & Genre ({{ categoriesList.length }})</span>
            </button>

            <button
              type="button"
              @click="mainSection = 'loans'"
              class="flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              :class="mainSection === 'loans' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <span class="material-symbols-outlined text-lg">local_library</span>
              <span>4. Sirkulasi Peminjaman ({{ activeLoansCount }})</span>
            </button>
          </div>

          <!-- SECTION 1: PENGATURAN WEBSITE (NAVBAR, HERO, FOOTER) -->
          <div v-show="mainSection === 'website'" class="space-y-6">
            <!-- Sub-tab Bar -->
            <div class="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl border border-slate-300 overflow-x-auto">
              <button
                type="button"
                @click="websiteTab = 'navbar'"
                class="flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                :class="websiteTab === 'navbar' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'"
              >
                Navbar & Jam Layanan
              </button>
              <button
                type="button"
                @click="websiteTab = 'hero'"
                class="flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                :class="websiteTab === 'hero' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'"
              >
                Hero Section (Beranda)
              </button>
              <button
                type="button"
                @click="websiteTab = 'footer'"
                class="flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                :class="websiteTab === 'footer' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'"
              >
                Footer & Informasi Kontak
              </button>
            </div>

            <form @submit.prevent="saveWebsiteSettings" class="space-y-6">
              <!-- Sub-tab Navbar -->
              <div v-show="websiteTab === 'navbar'" class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div class="border-b border-slate-100 pb-4">
                  <h2 class="font-serif font-bold text-lg text-primary flex items-center gap-2">
                    <span class="material-symbols-outlined text-xl text-primary">schedule</span>
                    <span>Jam Layanan & Pengumuman Atas</span>
                  </h2>
                  <p class="text-xs text-slate-500 mt-1">Atur jadwal layanan operasional dan teks pengumuman di baris paling atas website.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Jam Layanan Hari Kerja (Senin - Jumat)</label>
                    <input
                      v-model="siteForm.operationalHoursWeekdays"
                      type="text"
                      placeholder="Contoh: Senin - Jumat: 08.00 - 20.00"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Jam Layanan Akhir Pekan (Sabtu / Minggu)</label>
                    <input
                      v-model="siteForm.operationalHoursWeekends"
                      type="text"
                      placeholder="Contoh: Sabtu: 08.00 - 16.00 WIB"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-xs font-bold text-slate-800">Tampilkan Bar Pengumuman Teratas</h3>
                      <p class="text-[11px] text-slate-500">Matikan jika Anda ingin menyembunyikan baris biru paling atas.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="siteForm.showAnnouncement" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div v-if="siteForm.showAnnouncement" class="pt-2 border-t border-slate-200">
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Teks Pengumuman / Highlight Link</label>
                    <input
                      v-model="siteForm.announcementText"
                      type="text"
                      placeholder="Contoh: Digital Repository • E-Journal Terindeks • Akses Database Riset Kampus"
                      class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-5 space-y-4">
                  <h3 class="font-serif font-bold text-base text-primary">Identitas Brand & Logo</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1.5">Nama Institusi Perpustakaan</label>
                      <input
                        v-model="siteForm.brandName"
                        type="text"
                        placeholder="Contoh: Perpustakaan Universitas"
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1.5">Tagline / Sub-Judul Header</label>
                      <input
                        v-model="siteForm.brandSubtitle"
                        type="text"
                        placeholder="Contoh: Knowledge & Research Hub"
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <label class="block text-xs font-bold text-slate-700">Logo Gambar Perpustakaan (Opsional)</label>
                      <span class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                        Otomatis Dikonversi ke WebP
                      </span>
                    </div>

                    <input
                      ref="logoFileInput"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      class="hidden"
                      @change="handleLogoFileChange"
                    />

                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        v-model="siteForm.brandLogoUrl"
                        type="url"
                        placeholder="https://... atau klik Upload Logo di samping"
                        class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />

                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          @click="triggerLogoFilePicker"
                          :disabled="isUploadingLogo"
                          class="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <span v-if="!isUploadingLogo" class="material-symbols-outlined text-sm text-primary">upload_file</span>
                          <span v-else class="material-symbols-outlined text-sm animate-spin text-primary">progress_activity</span>
                          <span>{{ isUploadingLogo ? 'Mengonversi...' : 'Upload Logo' }}</span>
                        </button>

                        <button
                          v-if="siteForm.brandLogoUrl"
                          type="button"
                          @click="siteForm.brandLogoUrl = ''"
                          class="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Hapus Logo"
                        >
                          <span class="material-symbols-outlined text-sm">delete</span>
                        </button>

                        <div class="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center overflow-hidden border border-slate-200 shrink-0 shadow-2xs">
                          <img v-if="siteForm.brandLogoUrl" :src="siteForm.brandLogoUrl" alt="Logo" class="w-full h-full object-cover" />
                          <span v-else class="material-symbols-outlined text-xl text-secondary-container">local_library</span>
                        </div>
                      </div>
                    </div>

                    <p v-if="uploadLogoError" class="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">error</span>
                      <span>{{ uploadLogoError }}</span>
                    </p>
                  </div>
                </div>

                <!-- Tombol Presensi Kunjungan (Google Form) -->
                <div class="border-t border-slate-100 pt-5 space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-serif font-bold text-base text-primary flex items-center gap-2">
                        <span class="material-symbols-outlined text-xl text-primary">how_to_reg</span>
                        <span>Tombol Presensi Kunjungan (Google Form)</span>
                      </h3>
                      <p class="text-xs text-slate-500 mt-0.5">
                        Atur tautan Google Form presensi kehadiran yang terbuka saat tombol di navbar diklik oleh pengunjung.
                      </p>
                    </div>
                    <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 hidden sm:inline-block">
                      Tampil di Navbar
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2">
                      <label class="block text-xs font-bold text-slate-700 mb-1.5">Link / Tautan Google Form Presensi *</label>
                      <div class="flex items-center gap-2">
                        <input
                          v-model="siteForm.attendanceFormUrl"
                          type="url"
                          placeholder="https://forms.gle/... atau https://docs.google.com/forms/..."
                          class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                        />
                        <a
                          v-if="siteForm.attendanceFormUrl"
                          :href="siteForm.attendanceFormUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs whitespace-nowrap transition-all"
                          title="Uji coba buka formulir Google Form di tab baru"
                        >
                          <span class="material-symbols-outlined text-sm text-primary">open_in_new</span>
                          <span>Uji Link</span>
                        </a>
                      </div>
                      <p class="text-[11px] text-slate-400 mt-1">
                        Masukkan URL Google Form yang sudah disiapkan. Pengunjung akan diarahkan ke tab baru saat tombol diklik.
                      </p>
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1.5">Label Teks Tombol</label>
                      <input
                        v-model="siteForm.attendanceButtonText"
                        type="text"
                        placeholder="Presensi Kunjungan"
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <p class="text-[11px] text-slate-400 mt-1">
                        Teks tombol pada navbar (Bawaan: Presensi Kunjungan).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sub-tab Hero -->
              <div v-show="websiteTab === 'hero'" class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div class="border-b border-slate-100 pb-4">
                  <h2 class="font-serif font-bold text-lg text-primary flex items-center gap-2">
                    <span class="material-symbols-outlined text-xl text-primary">web</span>
                    <span>Pengaturan Hero Section (Beranda)</span>
                  </h2>
                  <p class="text-xs text-slate-500 mt-1">Atur teks sambutan, judul besar, dan kata kunci pencarian yang tampil di beranda.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div class="md:col-span-2">
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Teks Badge Sambutan Atas</label>
                    <input
                      v-model="siteForm.heroBadgeText"
                      type="text"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Ikon Badge (Material Symbol)</label>
                    <input
                      v-model="siteForm.heroBadgeIcon"
                      type="text"
                      placeholder="verified, stars, hub..."
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama Hero (Headline)</label>
                  <textarea
                    v-model="siteForm.heroHeadline"
                    rows="2"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-serif focus:outline-none focus:ring-2 focus:ring-primary/20"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Sub-Headline / Paragraf Deskripsi</label>
                  <textarea
                    v-model="siteForm.heroSubheadline"
                    rows="3"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Kata Kunci Pencarian Populer (Pisahkan dengan koma)</label>
                  <input
                    v-model="siteForm.heroPopularKeywords"
                    type="text"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <!-- Sub-tab Footer -->
              <div v-show="websiteTab === 'footer'" class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div class="border-b border-slate-100 pb-4">
                  <h2 class="font-serif font-bold text-lg text-primary flex items-center gap-2">
                    <span class="material-symbols-outlined text-xl text-primary">vertical_align_bottom</span>
                    <span>Pengaturan Footer & Informasi Kontak</span>
                  </h2>
                  <p class="text-xs text-slate-500 mt-1">Atur profil singkat perpustakaan, akreditasi, alamat, dan kontak resmi di kaki halaman.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Nama Gedung / Sub-identitas Footer</label>
                    <input
                      v-model="siteForm.footerBuilding"
                      type="text"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Teks Akreditasi Perpustakaan</label>
                    <input
                      v-model="siteForm.footerAccreditation"
                      type="text"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Singkat Perpustakaan</label>
                  <textarea
                    v-model="siteForm.footerDescription"
                    rows="3"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Nomor Telepon / WhatsApp</label>
                    <input
                      v-model="siteForm.footerPhone"
                      type="text"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Email Resmi</label>
                    <input
                      v-model="siteForm.footerEmail"
                      type="email"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Teks Hak Cipta / Copyright</label>
                    <input
                      v-model="siteForm.footerCopyright"
                      type="text"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Alamat Fisik Kampus & Gedung</label>
                  <input
                    v-model="siteForm.footerAddress"
                    type="text"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <!-- Action Bar Khusus Website Settings -->
              <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <span class="text-xs text-slate-500">Perubahan pengaturan website langsung tampil reaktif pada pengunjung.</span>
                <div class="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    @click="confirmResetWebsite"
                    :disabled="isSaving"
                    class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all"
                  >
                    Kembalikan ke Default
                  </button>
                  <button
                    type="submit"
                    :disabled="isSaving"
                    class="px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span v-if="isSaving" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span v-else class="material-symbols-outlined text-sm">check</span>
                    <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Website' }}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- SECTION 2: KELOLA KOLEKSI BUKU (CRUD LENGKAP) -->
          <div v-show="mainSection === 'books'" class="space-y-5">
            <!-- Toolbar: Pencarian, Filter, & Tombol Tambah Buku -->
            <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <!-- Search Input -->
                <div class="relative flex-1">
                  <span class="material-symbols-outlined text-slate-400 absolute left-3 top-2.5 text-base">search</span>
                  <input
                    v-model="bookSearchQuery"
                    type="text"
                    placeholder="Cari judul, pengarang, ISBN, atau nomor panggil..."
                    class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <!-- Filter Genre -->
                <select
                  v-model="bookFilterCategory"
                  class="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="">Semua Genre / Kategori</option>
                  <option v-for="cat in categoriesList" :key="cat.id" :value="cat.slug">{{ cat.name }}</option>
                </select>
              </div>

              <!-- Tombol Tambah Buku -->
              <button
                type="button"
                @click="openAddBookModal"
                class="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
              >
                <span class="material-symbols-outlined text-base">add_circle</span>
                <span>Tambah Buku Baru</span>
              </button>
            </div>

            <!-- Tabel Daftar Buku -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th class="py-3 px-4">Buku</th>
                      <th class="py-3 px-4">Pengarang & Tahun</th>
                      <th class="py-3 px-4">Rumpun & Genre</th>
                      <th class="py-3 px-4">Lokasi & No. Panggil</th>
                      <th class="py-3 px-4 text-center">Stok</th>
                      <th class="py-3 px-4 text-center">Status</th>
                      <th class="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="b in paginatedAdminBooks" :key="b.id" class="hover:bg-slate-50/80 transition-colors">
                      <!-- Cover & Judul -->
                      <td class="py-3 px-4 max-w-xs">
                        <div class="flex items-start gap-3">
                          <img :src="b.coverUrl" class="w-10 h-14 object-cover rounded-lg shadow-sm border border-slate-200 shrink-0" />
                          <div class="min-w-0">
                            <div class="font-serif font-bold text-slate-900 line-clamp-2 leading-tight">{{ b.title }}</div>
                            <div class="text-[10px] text-slate-400 mt-0.5">ISBN: {{ b.isbn }}</div>
                          </div>
                        </div>
                      </td>

                      <!-- Pengarang & Tahun -->
                      <td class="py-3 px-4 whitespace-nowrap">
                        <div class="font-semibold text-slate-800">{{ b.author }}</div>
                        <div class="text-[11px] text-slate-500">{{ b.publisher }} ({{ b.year }})</div>
                      </td>

                      <!-- Genre -->
                      <td class="py-3 px-4 whitespace-nowrap">
                        <span class="inline-block px-2 py-0.5 rounded-md bg-primary-fixed text-primary font-bold text-[10px]">
                          {{ b.category?.name || b.discipline }}
                        </span>
                      </td>

                      <!-- Lokasi Rak -->
                      <td class="py-3 px-4 whitespace-nowrap">
                        <div class="text-slate-800 font-medium">{{ b.shelfLocation }}</div>
                        <div class="text-[10px] text-slate-400 font-mono">{{ b.callNumber }}</div>
                      </td>

                      <!-- Stok & Tersedia -->
                      <td class="py-3 px-4 text-center whitespace-nowrap">
                        <span class="font-bold text-slate-800">{{ b.available }}</span>
                        <span class="text-slate-400 text-[10px]"> / {{ b.stock }}</span>
                      </td>

                      <!-- Badge Flags -->
                      <td class="py-3 px-4 text-center whitespace-nowrap">
                        <div class="flex flex-col gap-1 items-center">
                          <span v-if="b.isFeatured" class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[9px]">
                            Unggulan
                          </span>
                          <span v-if="b.isLiterature" class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[9px]">
                            Sastra
                          </span>
                          <span v-if="!b.isFeatured && !b.isLiterature" class="text-slate-400 text-[10px]">-</span>
                        </div>
                      </td>

                      <!-- Aksi: Edit & Hapus -->
                      <td class="py-3 px-4 text-right whitespace-nowrap">
                        <div class="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            @click="openEditBookModal(b)"
                            class="p-1.5 rounded-lg border border-slate-300 hover:bg-primary hover:text-white text-slate-600 transition-colors"
                            title="Edit Data Buku"
                          >
                            <span class="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            type="button"
                            @click="confirmDeleteBook(b)"
                            class="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                            title="Hapus Buku"
                          >
                            <span class="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="filteredAdminBooks.length === 0">
                      <td colspan="7" class="py-12 text-center text-slate-400">
                        Tidak ada buku yang cocok dengan pencarian / filter ini.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination Controls Bar -->
              <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div class="text-slate-600">
                  Menampilkan <span class="font-bold text-slate-800">{{ filteredAdminBooks.length > 0 ? (bookCurrentPage - 1) * bookPageSize + 1 : 0 }}</span> – <span class="font-bold text-slate-800">{{ Math.min(bookCurrentPage * bookPageSize, filteredAdminBooks.length) }}</span> dari <span class="font-bold text-slate-800">{{ filteredAdminBooks.length }}</span> buku
                </div>

                <div v-if="bookTotalPages > 1" class="flex items-center gap-1.5">
                  <!-- Previous Button -->
                  <button
                    type="button"
                    @click="goToBookPage(bookCurrentPage - 1)"
                    :disabled="bookCurrentPage === 1"
                    class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                    :class="bookCurrentPage === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700 shadow-sm'"
                  >
                    <span class="material-symbols-outlined text-sm">chevron_left</span>
                    <span>Sebelumnya</span>
                  </button>

                  <!-- Page Numbers -->
                  <div class="flex items-center gap-1">
                    <button
                      v-for="p in bookTotalPages"
                      :key="p"
                      type="button"
                      @click="goToBookPage(p)"
                      class="w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center"
                      :class="bookCurrentPage === p ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'"
                    >
                      {{ p }}
                    </button>
                  </div>

                  <!-- Next Button -->
                  <button
                    type="button"
                    @click="goToBookPage(bookCurrentPage + 1)"
                    :disabled="bookCurrentPage === bookTotalPages"
                    class="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    :class="bookCurrentPage === bookTotalPages ? 'opacity-40 cursor-not-allowed border border-slate-300 bg-slate-100 text-slate-400' : 'bg-primary text-white hover:bg-primary-container shadow-sm'"
                  >
                    <span>Berikutnya</span>
                    <span class="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 3: KELOLA RUMPUN & GENRE (CRUD LENGKAP) -->
          <div v-show="mainSection === 'genres'" class="space-y-5">
            <!-- Toolbar Header Genre -->
            <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 class="font-serif font-bold text-lg text-primary">Daftar Rumpun Keilmuan & Genre</h2>
                <p class="text-xs text-slate-500">Kelola kategori genre buku yang tampil pada dropdown dan menu navigasi website.</p>
              </div>

              <button
                type="button"
                @click="openAddCategoryModal"
                class="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
              >
                <span class="material-symbols-outlined text-base">add_circle</span>
                <span>Tambah Genre Baru</span>
              </button>
            </div>

            <!-- Cards Grid Genre -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div
                v-for="cat in categoriesList"
                :key="cat.id"
                class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all space-y-4"
              >
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div
                      class="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-sm shrink-0"
                      :style="{ backgroundColor: cat.color || '#00236f' }"
                    >
                      <span class="material-symbols-outlined text-2xl">{{ cat.icon || 'menu_book' }}</span>
                    </div>

                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        @click="openEditCategoryModal(cat)"
                        class="p-1.5 rounded-lg border border-slate-200 hover:bg-primary hover:text-white text-slate-600 transition-colors"
                        title="Edit Genre"
                      >
                        <span class="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        type="button"
                        @click="confirmDeleteCategory(cat)"
                        class="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                        title="Hapus Genre"
                      >
                        <span class="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  <h3 class="font-serif font-bold text-base text-slate-900">{{ cat.name }}</h3>
                  <div class="text-[10px] font-mono text-slate-400 mb-2">slug: {{ cat.slug }}</div>
                  <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">{{ cat.description }}</p>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1.5 text-slate-500">
                    <span class="material-symbols-outlined text-sm">meeting_room</span>
                    <span class="font-medium text-[11px]">{{ cat.location || 'Lantai 1' }}</span>
                  </div>

                  <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                    {{ getBooksCountForCategory(cat.slug) }} buku
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 4: SIRKULASI & PEMINJAMAN BUKU -->
          <div v-show="mainSection === 'loans'" class="space-y-6">
            <!-- Header & Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Card 1: Aktif Dipinjam -->
              <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sedang Dipinjam</p>
                  <h3 class="text-2xl font-bold font-serif text-primary mt-0.5">{{ activeLoansCount }}</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">Eksemplar di tangan pemustaka</p>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl">book</span>
                </div>
              </div>

              <!-- Card 2: Terlambat / Overdue -->
              <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p class="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Terlambat (Overdue)</p>
                  <h3 class="text-2xl font-bold font-serif text-rose-600 mt-0.5">{{ overdueLoansCount }}</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">Melewati batas tenggat waktu</p>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl">warning</span>
                </div>
              </div>

              <!-- Card 3: Sudah Dikembalikan -->
              <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p class="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Riwayat Selesai</p>
                  <h3 class="text-2xl font-bold font-serif text-emerald-700 mt-0.5">{{ returnedLoansCount }}</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">Buku telah dikembalikan</p>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl">check_circle</span>
                </div>
              </div>
            </div>

            <!-- Toolbar: Search, Filter Tabs, & Button Tambah -->
            <div class="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <!-- Filter Tabs & Search -->
              <div class="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <!-- Search Input -->
                <div class="relative flex-1">
                  <span class="material-symbols-outlined text-slate-400 absolute left-3 top-2.5 text-base">search</span>
                  <input
                    v-model="loanSearchQuery"
                    type="text"
                    placeholder="Cari nama peminjam, NIM, judul buku, atau ISBN..."
                    class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <!-- Status Tabs -->
                <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto shrink-0">
                  <button
                    type="button"
                    @click="loanFilterStatus = 'BORROWED'"
                    class="px-3 py-1.5 text-xs rounded-lg transition-all font-semibold whitespace-nowrap"
                    :class="loanFilterStatus === 'BORROWED' ? 'bg-white text-primary shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                  >
                    Sedang Dipinjam ({{ activeLoansCount }})
                  </button>
                  <button
                    type="button"
                    @click="loanFilterStatus = 'OVERDUE'"
                    class="px-3 py-1.5 text-xs rounded-lg transition-all font-semibold whitespace-nowrap flex items-center gap-1"
                    :class="loanFilterStatus === 'OVERDUE' ? 'bg-white text-rose-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                  >
                    <span>Terlambat</span>
                    <span v-if="overdueLoansCount > 0" class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  </button>
                  <button
                    type="button"
                    @click="loanFilterStatus = 'RETURNED'"
                    class="px-3 py-1.5 text-xs rounded-lg transition-all font-semibold whitespace-nowrap"
                    :class="loanFilterStatus === 'RETURNED' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                  >
                    Riwayat Kembali
                  </button>
                  <button
                    type="button"
                    @click="loanFilterStatus = 'ALL'"
                    class="px-3 py-1.5 text-xs rounded-lg transition-all font-semibold whitespace-nowrap"
                    :class="loanFilterStatus === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                  >
                    Semua ({{ loansList.length }})
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <!-- Button Ekspor Laporan -->
                <button
                  type="button"
                  @click="openExportModal"
                  class="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  title="Generate & download laporan peminjaman dalam format Excel atau PDF"
                >
                  <span class="material-symbols-outlined text-base">download</span>
                  <span>Ekspor Laporan</span>
                </button>

                <!-- Button Catat Peminjaman Baru -->
                <button
                  type="button"
                  @click="openAddLoanModal"
                  class="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-base">add_circle</span>
                  <span>+ Catat Peminjaman Baru</span>
                </button>
              </div>
            </div>

            <!-- Tabel Daftar Peminjaman -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th class="py-3 px-4">Pemustaka / Mahasiswa</th>
                      <th class="py-3 px-4">Buku Yang Dipinjam</th>
                      <th class="py-3 px-4">Tgl Pinjam</th>
                      <th class="py-3 px-4">Batas Tenggat</th>
                      <th class="py-3 px-4 text-center">Status</th>
                      <th class="py-3 px-4 text-center">Aksi Sirkulasi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-if="filteredLoans.length === 0">
                      <td colspan="6" class="py-12 text-center text-slate-400">
                        <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                          <span class="material-symbols-outlined text-2xl">search_off</span>
                        </div>
                        <p class="font-semibold text-xs text-slate-500">Tidak ada data peminjaman yang sesuai dengan filter.</p>
                      </td>
                    </tr>
                    <tr
                      v-for="loan in paginatedLoans"
                      :key="loan.id"
                      class="hover:bg-slate-50/80 transition-colors"
                      :class="isOverdue(loan) ? 'bg-rose-50/30' : ''"
                    >
                      <!-- Kolom Pemustaka -->
                      <td class="py-3.5 px-4">
                        <div class="font-bold text-slate-900 text-xs sm:text-sm">{{ loan.borrowerName }}</div>
                        <div class="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                          <span class="material-symbols-outlined text-[13px]">badge</span>
                          <span>NIM: {{ loan.borrowerNim }}</span>
                        </div>
                        <div v-if="loan.borrowerEmail" class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span class="material-symbols-outlined text-[12px]">contact_mail</span>
                          <span>{{ loan.borrowerEmail }}</span>
                        </div>
                        <div v-if="loan.notes" class="text-[11px] text-slate-500 italic mt-1 bg-slate-100 px-2 py-0.5 rounded-md inline-block max-w-xs truncate">
                          "{{ loan.notes }}"
                        </div>
                      </td>

                      <!-- Kolom Buku -->
                      <td class="py-3.5 px-4">
                        <div class="flex items-center gap-3">
                          <img
                            :src="loan.book?.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'"
                            :alt="loan.book?.title"
                            class="w-10 h-14 object-cover rounded-lg shadow-xs border border-slate-200 shrink-0"
                          />
                          <div>
                            <div class="font-bold text-slate-900 line-clamp-1 max-w-[220px]" :title="loan.book?.title">
                              {{ loan.book?.title || 'Buku Tidak Diketahui' }}
                            </div>
                            <div class="text-[11px] text-slate-500">{{ loan.book?.author }}</div>
                            <div class="text-[10px] text-slate-400 font-mono mt-0.5">
                              No. Panggil: {{ loan.book?.callNumber || '-' }}
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- Kolom Tgl Pinjam -->
                      <td class="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {{ formatIndoDate(loan.borrowDate) }}
                      </td>

                      <!-- Kolom Batas Tenggat & Overdue Badge -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <div class="font-mono text-[11px] font-semibold text-slate-800">
                          {{ formatIndoDate(loan.dueDate) }}
                        </div>

                        <!-- Status badge jika belum dikembalikan -->
                        <div v-if="loan.status !== 'RETURNED'" class="mt-1">
                          <span
                            v-if="isOverdue(loan)"
                            class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 flex items-center gap-1 w-fit animate-pulse"
                          >
                            <span class="material-symbols-outlined text-xs">error</span>
                            <span>Terlambat {{ getOverdueDays(loan) }} Hari</span>
                          </span>
                          <span
                            v-else
                            class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit"
                          >
                            <span class="material-symbols-outlined text-xs">schedule</span>
                            <span>Sisa {{ getRemainingDays(loan) }} Hari</span>
                          </span>
                        </div>
                        <div v-else class="mt-1">
                          <span class="text-[10px] text-slate-400 italic">Sudah kembali</span>
                        </div>
                      </td>

                      <!-- Kolom Status -->
                      <td class="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          v-if="loan.status === 'RETURNED'"
                          class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"
                        >
                          DIKEMBALIKAN
                        </span>
                        <span
                          v-else-if="isOverdue(loan)"
                          class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300"
                        >
                          TERLAMBAT
                        </span>
                        <span
                          v-else
                          class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          DIPINJAM
                        </span>
                      </td>

                      <!-- Kolom Aksi -->
                      <td class="py-3.5 px-4 text-center whitespace-nowrap">
                        <div class="flex items-center justify-center gap-1.5">
                          <!-- Tombol Kembalikan (Hanya tampil jika belum returned) -->
                          <button
                            v-if="loan.status !== 'RETURNED'"
                            type="button"
                            @click="handleReturnLoan(loan)"
                            class="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1"
                            title="Tandai buku ini sudah dikembalikan (mengembalikan stok buku)"
                          >
                            <span class="material-symbols-outlined text-sm">assignment_turned_in</span>
                            <span>Kembalikan</span>
                          </button>

                          <!-- Tombol Perpanjang +7 Hari -->
                          <button
                            v-if="loan.status !== 'RETURNED'"
                            type="button"
                            @click="handleExtendLoan(loan)"
                            class="p-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition-all border border-slate-200"
                            title="Perpanjang batas waktu kembali (+7 hari)"
                          >
                            <span class="material-symbols-outlined text-sm">update</span>
                          </button>

                          <!-- Tombol Hapus / Batalkan -->
                          <button
                            type="button"
                            @click="handleDeleteLoan(loan)"
                            class="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-all border border-slate-200"
                            title="Hapus / Batalkan catatan transaksi ini"
                          >
                            <span class="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination Controls Bar Sirkulasi Peminjaman -->
              <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div class="text-slate-600">
                  Menampilkan <span class="font-bold text-slate-800">{{ filteredLoans.length > 0 ? (loanCurrentPage - 1) * loanPageSize + 1 : 0 }}</span> – <span class="font-bold text-slate-800">{{ Math.min(loanCurrentPage * loanPageSize, filteredLoans.length) }}</span> dari <span class="font-bold text-slate-800">{{ filteredLoans.length }}</span> catatan peminjaman
                </div>

                <div v-if="loanTotalPages > 1" class="flex items-center gap-1.5">
                  <!-- Previous Button -->
                  <button
                    type="button"
                    @click="goToLoanPage(loanCurrentPage - 1)"
                    :disabled="loanCurrentPage === 1"
                    class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                    :class="loanCurrentPage === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700 shadow-sm cursor-pointer'"
                  >
                    <span class="material-symbols-outlined text-sm">chevron_left</span>
                    <span>Sebelumnya</span>
                  </button>

                  <!-- Page Numbers -->
                  <div class="flex items-center gap-1">
                    <button
                      v-for="p in loanTotalPages"
                      :key="p"
                      type="button"
                      @click="goToLoanPage(p)"
                      class="w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                      :class="loanCurrentPage === p ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'"
                    >
                      {{ p }}
                    </button>
                  </div>

                  <!-- Next Button -->
                  <button
                    type="button"
                    @click="goToLoanPage(loanCurrentPage + 1)"
                    :disabled="loanCurrentPage === loanTotalPages"
                    class="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    :class="loanCurrentPage === loanTotalPages ? 'opacity-40 cursor-not-allowed border border-slate-300 bg-slate-100 text-slate-400' : 'bg-primary text-white hover:bg-primary-container shadow-sm cursor-pointer'"
                  >
                    <span>Berikutnya</span>
                    <span class="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL 1: FORM TAMBAH / EDIT BUKU -->
    <div
      v-if="isBookModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      @click.self="isBookModalOpen = false"
    >
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-8">
        <!-- Modal Header -->
        <div class="bg-primary text-white p-5 px-6 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-2xl text-secondary-container">
              {{ editingBookId ? 'edit_note' : 'add_circle' }}
            </span>
            <h3 class="font-serif font-bold text-lg">
              {{ editingBookId ? 'Edit Informasi Buku' : 'Tambah Buku Baru ke Katalog' }}
            </h3>
          </div>
          <button @click="isBookModalOpen = false" class="text-white/80 hover:text-white">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Modal Body Form -->
        <form ref="bookModalFormRef" @submit.prevent="saveBookForm" novalidate class="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          <!-- Pesan Error Validasi / Simpan (Jika Ada) -->
          <div
            v-if="bookModalError"
            class="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-start gap-3 shadow-xs animate-shake"
          >
            <span class="material-symbols-outlined text-rose-600 text-xl shrink-0 mt-0.5">error</span>
            <div class="flex-1">
              <h4 class="font-bold text-xs">Perhatian: Form Belum Lengkap</h4>
              <p class="text-xs text-rose-600 mt-0.5">{{ bookModalError }}</p>
            </div>
          </div>

          <!-- Judul & Pengarang -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Judul Buku <span class="text-rose-500">*</span></span>
                <span v-if="!bookForm.title.trim()" class="text-[10px] text-rose-500 font-normal">Wajib diisi</span>
              </label>
              <input
                ref="bookTitleInputRef"
                v-model="bookForm.title"
                type="text"
                placeholder="Judul lengkap buku..."
                :class="bookModalError && !bookForm.title.trim() ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30' : 'border-slate-300 bg-slate-50'"
                class="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm transition-all"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Pengarang / Penulis <span class="text-rose-500">*</span></span>
                <span v-if="!bookForm.author.trim()" class="text-[10px] text-rose-500 font-normal">Wajib diisi</span>
              </label>
              <input
                ref="bookAuthorInputRef"
                v-model="bookForm.author"
                type="text"
                placeholder="Nama penulis..."
                :class="bookModalError && !bookForm.author.trim() ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30' : 'border-slate-300 bg-slate-50'"
                class="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm transition-all"
              />
            </div>
          </div>

          <!-- ISBN, Penerbit, Tahun, Halaman -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1">ISBN</label>
              <input
                v-model="bookForm.isbn"
                type="text"
                placeholder="978-..."
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Penerbit</label>
              <input
                v-model="bookForm.publisher"
                type="text"
                placeholder="Penerbit..."
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Tahun Terbit</label>
              <input
                v-model.number="bookForm.year"
                type="number"
                placeholder="2024"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Jml Halaman</label>
              <input
                v-model.number="bookForm.pages"
                type="number"
                placeholder="300"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>

          <!-- Kategori Genre & Disiplin -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Genre / Kategori *</label>
              <select
                v-model="bookForm.categoryId"
                @change="onBookCategoryChange"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              >
                <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Rumpun Disiplin</label>
              <input
                v-model="bookForm.discipline"
                type="text"
                placeholder="Contoh: Sains & Teknologi, Humaniora, dll."
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>

          <!-- Lokasi Rak, Nomor Panggil, Stok, Tersedia -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Lokasi Rak</label>
              <input
                v-model="bookForm.shelfLocation"
                type="text"
                placeholder="Lantai 2 - Rak B-01"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Nomor Panggil</label>
              <input
                v-model="bookForm.callNumber"
                type="text"
                placeholder="005.133 JAV"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Total Stok</label>
              <input
                v-model.number="bookForm.stock"
                type="number"
                min="0"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Stok Tersedia</label>
              <input
                v-model.number="bookForm.available"
                type="number"
                min="0"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <!-- Cover Gambar: Upload File atau URL -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block font-bold text-slate-700">Cover Gambar Buku</label>
              <!-- Switcher Tabs: Upload vs URL -->
              <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  @click="coverInputMode = 'upload'"
                  class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
                  :class="coverInputMode === 'upload' ? 'bg-white text-primary shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                >
                  <span class="material-symbols-outlined text-sm">upload_file</span>
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  @click="coverInputMode = 'url'"
                  class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
                  :class="coverInputMode === 'url' ? 'bg-white text-primary shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                >
                  <span class="material-symbols-outlined text-sm">link</span>
                  <span>Input URL</span>
                </button>
              </div>
            </div>

            <!-- MODE 1: UPLOAD FILE GAMBAR -->
            <div v-show="coverInputMode === 'upload'" class="space-y-3">
              <input
                ref="coverFileInput"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                class="hidden"
                @change="handleCoverFileChange"
              />

              <!-- Preview & Upload Box -->
              <div
                class="border-2 border-dashed rounded-2xl p-4 sm:p-5 transition-all text-center relative"
                :class="isDraggingCover ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary/50 bg-slate-50/70'"
                @dragover.prevent="isDraggingCover = true"
                @dragleave.prevent="isDraggingCover = false"
                @drop.prevent="handleCoverDrop"
              >
                <!-- Jika Ada Gambar Terpasang -->
                <div v-if="bookForm.coverUrl" class="flex flex-col sm:flex-row items-center gap-4 text-left">
                  <div class="relative group shrink-0">
                    <img
                      :src="bookForm.coverUrl"
                      alt="Cover Preview"
                      class="w-20 h-28 object-cover rounded-xl shadow-md border border-slate-200"
                    />
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <button
                        type="button"
                        @click="triggerCoverFilePicker"
                        class="p-1.5 bg-white text-slate-800 rounded-lg shadow-sm hover:scale-105 transition-transform"
                        title="Ganti Gambar"
                      >
                        <span class="material-symbols-outlined text-sm">cached</span>
                      </button>
                    </div>
                  </div>

                  <div class="flex-1 space-y-1.5 w-full">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Gambar Terpasang
                      </span>
                      <span v-if="isUploadingCover" class="text-xs text-primary font-semibold flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        Sedang mengunggah...
                      </span>
                    </div>
                    <p class="text-xs font-mono text-slate-500 truncate max-w-md">{{ bookForm.coverUrl }}</p>
                    <div class="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        @click="triggerCoverFilePicker"
                        :disabled="isUploadingCover"
                        class="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        <span class="material-symbols-outlined text-sm">photo_library</span>
                        <span>Pilih Gambar Lain</span>
                      </button>
                      <button
                        type="button"
                        @click="bookForm.coverUrl = ''"
                        class="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1"
                      >
                        <span class="material-symbols-outlined text-sm">delete</span>
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Jika Belum Ada Gambar -->
                <div v-else class="py-4 cursor-pointer" @click="triggerCoverFilePicker">
                  <div class="w-12 h-12 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <span v-if="!isUploadingCover" class="material-symbols-outlined text-2xl">add_photo_alternate</span>
                    <span v-else class="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
                  </div>
                  <p class="text-xs font-bold text-slate-700">
                    {{ isUploadingCover ? 'Sedang mengunggah file gambar...' : 'Klik atau seret file gambar cover ke sini' }}
                  </p>
                  <p class="text-[11px] text-slate-400 mt-1">Mendukung file JPG, PNG, WEBP (Maksimal 10MB)</p>
                  <button
                    type="button"
                    class="mt-3 px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary-container transition-all"
                  >
                    Pilih File Gambar dari Komputer
                  </button>
                </div>
              </div>

              <p v-if="uploadCoverError" class="text-xs text-rose-600 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">error</span>
                <span>{{ uploadCoverError }}</span>
              </p>
            </div>

            <!-- MODE 2: INPUT URL GAMBAR -->
            <div v-show="coverInputMode === 'url'" class="space-y-2">
              <div class="flex items-center gap-3">
                <input
                  v-model="bookForm.coverUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/... atau URL gambar web"
                  class="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-primary/20"
                />
                <img
                  v-if="bookForm.coverUrl"
                  :src="bookForm.coverUrl"
                  class="w-10 h-14 object-cover rounded-lg border border-slate-200 shadow-sm shrink-0"
                />
              </div>
              <p class="text-[11px] text-slate-400">Masukkan tautan langsung gambar cover dari web / penyimpanan online.</p>
            </div>
          </div>

          <!-- Sinopsis -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Sinopsis / Ringkasan Buku</label>
            <textarea
              v-model="bookForm.synopsis"
              rows="3"
              placeholder="Deskripsi ringkas isi buku..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
            ></textarea>
          </div>

          <!-- Toggles Unggulan & Sastra -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-6">
            <label class="inline-flex items-center gap-2 cursor-pointer select-none">
              <input v-model="bookForm.isFeatured" type="checkbox" class="rounded w-4 h-4 text-primary" />
              <span class="font-bold text-slate-800">Tampilkan di Buku Unggulan</span>
            </label>

            <label class="inline-flex items-center gap-2 cursor-pointer select-none">
              <input v-model="bookForm.isLiterature" type="checkbox" class="rounded w-4 h-4 text-primary" />
              <span class="font-bold text-slate-800">Koleksi Rak Sastra & Novel</span>
            </label>
          </div>

          <!-- Modal Action Buttons -->
          <div class="space-y-3 pt-4 border-t border-slate-200">
            <div
              v-if="bookModalError"
              class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2 text-xs"
            >
              <span class="material-symbols-outlined text-rose-600 text-base shrink-0">warning</span>
              <span class="font-medium">{{ bookModalError }}</span>
            </div>

            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="isBookModalOpen = false"
                class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmittingBook"
                class="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary-container font-bold shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span v-if="isSubmittingBook" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>{{ isSubmittingBook ? 'Menyimpan...' : 'Simpan Data Buku' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 2: FORM TAMBAH / EDIT GENRE -->
    <div
      v-if="isCategoryModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      @click.self="isCategoryModalOpen = false"
    >
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-8">
        <div class="bg-primary text-white p-5 px-6 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-2xl text-secondary-container">category</span>
            <h3 class="font-serif font-bold text-lg">
              {{ editingCategoryId ? 'Edit Rumpun & Genre' : 'Tambah Genre Baru' }}
            </h3>
          </div>
          <button @click="isCategoryModalOpen = false" class="text-white/80 hover:text-white">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form @submit.prevent="saveCategoryForm" class="p-6 space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Genre / Rumpun Keilmuan *</label>
            <input
              v-model="categoryForm.name"
              required
              type="text"
              placeholder="Contoh: Kecerdasan Buatan & Robotika"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Slug URL</label>
              <input
                v-model="categoryForm.slug"
                type="text"
                placeholder="otomatis dari nama..."
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Ikon Genre</label>
              <button
                type="button"
                @click="isIconPickerOpen = !isIconPickerOpen"
                class="w-full flex items-center justify-between px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs transition-colors h-[38px] group"
              >
                <div class="flex items-center gap-2 truncate">
                  <div
                    class="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                    :style="{ backgroundColor: categoryForm.color || '#00236f' }"
                  >
                    <span class="material-symbols-outlined text-base">{{ categoryForm.icon || 'menu_book' }}</span>
                  </div>
                  <span class="font-bold text-slate-800 text-xs truncate">{{ getSelectedIconLabel }}</span>
                </div>
                <div class="flex items-center gap-1 text-slate-400 group-hover:text-primary shrink-0">
                  <span class="text-[10px] font-semibold hidden sm:inline">{{ isIconPickerOpen ? 'Tutup' : 'Pilih' }}</span>
                  <span class="material-symbols-outlined text-base">
                    {{ isIconPickerOpen ? 'expand_less' : 'grid_view' }}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- Panel Pemilihan Ikon Interaktif (Tinggal Memilih) -->
          <div v-if="isIconPickerOpen" class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 transition-all">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base text-primary">category</span>
                Koleksi Ikon Genre (Tinggal Klik):
              </span>
              <button
                type="button"
                @click="isIconPickerOpen = false"
                class="text-slate-400 hover:text-slate-600 text-[11px] font-bold flex items-center gap-0.5"
              >
                <span>Selesai</span>
                <span class="material-symbols-outlined text-sm">check</span>
              </button>
            </div>

            <!-- Search & Kategori Filter -->
            <div class="relative">
              <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                v-model="iconSearchQuery"
                type="text"
                placeholder="Cari ikon... (contoh: buku, hukum, medis, sains, komputer)"
                class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <!-- Filter Kategori Tabs -->
            <div class="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <button
                v-for="cat in iconCategories"
                :key="cat"
                type="button"
                @click="selectedIconCategory = cat"
                class="px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors"
                :class="selectedIconCategory === cat ? 'bg-primary text-white font-bold shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
              >
                {{ cat }}
              </button>
            </div>

            <!-- Grid Ikon -->
            <div class="grid grid-cols-7 sm:grid-cols-8 gap-1.5 max-h-48 overflow-y-auto p-1.5 bg-white rounded-xl border border-slate-200">
              <button
                v-for="item in filteredGenreIcons"
                :key="item.name"
                type="button"
                @click="categoryForm.icon = item.name"
                :title="item.label"
                class="aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all group relative border cursor-pointer"
                :class="categoryForm.icon === item.name ? 'bg-primary text-white border-primary ring-2 ring-primary/30 shadow-sm scale-105' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-primary/10 hover:text-primary hover:border-primary/20'"
              >
                <span class="material-symbols-outlined text-xl">{{ item.name }}</span>
              </button>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <span class="truncate">
                Terpilih: <strong class="text-primary font-bold">{{ getSelectedIconLabel }}</strong>
              </span>
              <button
                type="button"
                @click="isIconPickerOpen = false"
                class="px-3 py-1 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors text-xs shrink-0"
              >
                Gunakan Ikon
              </button>
            </div>
          </div>

          <!-- Quick Select Ikon Populer jika picker sedang tertutup -->
          <div v-else class="flex items-center gap-1.5 overflow-x-auto py-1 -mt-1 text-[11px]">
            <span class="text-[10px] text-slate-400 font-semibold whitespace-nowrap">Ikon Cepat:</span>
            <button
              v-for="quick in quickGenreIcons"
              :key="quick.name"
              type="button"
              @click="categoryForm.icon = quick.name"
              :title="quick.label"
              class="w-7 h-7 rounded-lg border transition-all flex items-center justify-center shrink-0"
              :class="categoryForm.icon === quick.name ? 'bg-primary text-white border-primary shadow-xs scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:text-primary hover:border-primary/40'"
            >
              <span class="material-symbols-outlined text-base">{{ quick.name }}</span>
            </button>
            <button
              type="button"
              @click="isIconPickerOpen = true"
              class="px-2 py-1 text-[10px] font-bold text-primary hover:underline whitespace-nowrap"
            >
              + Lainnya
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Lokasi Ruang / Lantai</label>
              <input
                v-model="categoryForm.location"
                type="text"
                placeholder="Lantai 2 - Sayap Barat"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Warna Tema (Hex)</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="categoryForm.color"
                  type="color"
                  class="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                />
                <input
                  v-model="categoryForm.color"
                  type="text"
                  class="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Deskripsi Rumpun / Genre</label>
            <textarea
              v-model="categoryForm.description"
              rows="3"
              placeholder="Penjelasan cakupan subjek keilmuan..."
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
            ></textarea>
          </div>

          <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              @click="isCategoryModalOpen = false"
              class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmittingCategory"
              class="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary-container font-bold shadow-sm flex items-center gap-1.5"
            >
              <span v-if="isSubmittingCategory" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              <span>{{ isSubmittingCategory ? 'Menyimpan...' : 'Simpan Genre' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 3: CATAT PEMINJAMAN BUKU BARU -->
    <div
      v-if="isLoanModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      @click.self="isLoanModalOpen = false"
    >
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        <!-- Header -->
        <div class="bg-primary text-white p-5 px-6 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-2xl text-secondary-container">add_task</span>
            <h3 class="font-serif font-bold text-lg">Catat Peminjaman Buku Manual</h3>
          </div>
          <button @click="isLoanModalOpen = false" class="text-white/80 hover:text-white">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="saveLoanForm" class="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          <!-- Pilih Buku -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Pilih Buku Katalog *</label>
            <select
              v-model="newLoanForm.bookId"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm font-semibold"
            >
              <option value="" disabled>-- Pilih buku yang tersedia --</option>
              <option
                v-for="b in availableBooksForLoan"
                :key="b.id"
                :value="b.id"
              >
                {{ b.title }} (Tersedia: {{ b.available }}/{{ b.stock }}) - {{ b.callNumber }}
              </option>
            </select>
            <p v-if="availableBooksForLoan.length === 0" class="text-[11px] text-rose-500 mt-1 font-semibold">
              Tidak ada buku yang memiliki stok tersedia untuk dipinjam saat ini.
            </p>
          </div>

          <!-- Nama Pemustaka & NIM -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Nama Lengkap Pemustaka *</label>
              <input
                v-model="newLoanForm.borrowerName"
                required
                type="text"
                placeholder="Contoh: Ahmad Dahlan"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">NIM / Nomor Anggota *</label>
              <input
                v-model="newLoanForm.borrowerNim"
                required
                type="text"
                placeholder="Contoh: 2108561055"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm font-mono"
              />
            </div>
          </div>

          <!-- Email / No Telp (Opsional) -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Email / Kontak Mahasiswa (Opsional)</label>
            <input
              v-model="newLoanForm.borrowerEmail"
              type="text"
              placeholder="Contoh: mahasiswa@kampus.ac.id / 08123456789"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 text-xs"
            />
          </div>

          <!-- Tanggal Pinjam & Durasi / Batas Kembali -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Tanggal Pinjam *</label>
              <input
                v-model="newLoanForm.borrowDate"
                type="date"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 text-xs font-mono"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Batas Tenggat Kembali *</label>
              <input
                v-model="newLoanForm.dueDate"
                type="date"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 text-xs font-mono"
              />
            </div>
          </div>

          <!-- Quick Duration Selector Buttons -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block font-bold text-slate-700">Pilihan Cepat Durasi:</label>
              <span v-if="selectedDuration" class="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">done</span>
                <span>Terpilih: {{ selectedDuration }} Hari</span>
              </span>
              <span v-else class="text-[11px] font-medium text-slate-400 italic">
                (Kustom Tanggal)
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="setLoanDuration(3)"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
                :class="selectedDuration === 3
                  ? 'bg-primary text-white shadow-md ring-2 ring-primary/30 scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'"
              >
                <span v-if="selectedDuration === 3" class="material-symbols-outlined text-sm">check_circle</span>
                <span v-else class="material-symbols-outlined text-sm text-slate-400">schedule</span>
                <span>3 Hari (Ujian/Tugas)</span>
              </button>

              <button
                type="button"
                @click="setLoanDuration(7)"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
                :class="selectedDuration === 7
                  ? 'bg-primary text-white shadow-md ring-2 ring-primary/30 scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'"
              >
                <span v-if="selectedDuration === 7" class="material-symbols-outlined text-sm">check_circle</span>
                <span v-else class="material-symbols-outlined text-sm text-slate-400">schedule</span>
                <span>7 Hari (Standar Mahasiswa)</span>
              </button>

              <button
                type="button"
                @click="setLoanDuration(14)"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
                :class="selectedDuration === 14
                  ? 'bg-primary text-white shadow-md ring-2 ring-primary/30 scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'"
              >
                <span v-if="selectedDuration === 14" class="material-symbols-outlined text-sm">check_circle</span>
                <span v-else class="material-symbols-outlined text-sm text-slate-400">schedule</span>
                <span>14 Hari (Dosen/Skripsi)</span>
              </button>
            </div>
          </div>

          <!-- Catatan Tambahan -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
            <textarea
              v-model="newLoanForm.notes"
              rows="2"
              placeholder="Catatan kondisi buku saat dipinjam, atau keterangan khusus..."
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
            ></textarea>
          </div>

          <!-- Submit Buttons -->
          <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              @click="isLoanModalOpen = false"
              class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmittingLoan"
              class="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary-container font-bold shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <span v-if="isSubmittingLoan" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              <span>{{ isSubmittingLoan ? 'Menyimpan...' : 'Simpan & Catat Peminjaman' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 4: GENERATE & EKSPOR LAPORAN PEMINJAMAN -->
    <div
      v-if="isExportModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      @click.self="isExportModalOpen = false"
    >
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden my-8">
        <!-- Header -->
        <div class="bg-emerald-800 text-white p-5 px-6 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-2xl text-emerald-200">description</span>
            <div>
              <h3 class="font-serif font-bold text-lg leading-tight">Generate Laporan Peminjaman</h3>
              <p class="text-[11px] text-emerald-100">Ekspor data sirkulasi ke file Excel (.xlsx) atau PDF (.pdf)</p>
            </div>
          </div>
          <button @click="isExportModalOpen = false" class="text-white/80 hover:text-white cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 sm:p-8 space-y-5 text-xs">
          <!-- Rentang Tanggal Spesifik -->
          <div>
            <label class="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-emerald-700">calendar_month</span>
              <span>Periode Tanggal Peminjaman *</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-slate-500 mb-1">Dari Tanggal Mulai:</label>
                <input
                  v-model="exportForm.startDate"
                  type="date"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/30 text-xs font-mono"
                />
              </div>

              <div>
                <label class="block text-[11px] text-slate-500 mb-1">Sampai Tanggal Akhir:</label>
                <input
                  v-model="exportForm.endDate"
                  type="date"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/30 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <!-- Filter Status Transaksi -->
          <div>
            <label class="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-emerald-700">tune</span>
              <span>Filter Status Transaksi</span>
            </label>
            <select
              v-model="exportForm.status"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/30 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">Semua Status (Aktif, Terlambat, & Selesai)</option>
              <option value="BORROWED">Hanya yang Sedang Dipinjam (Aktif)</option>
              <option value="OVERDUE">Hanya yang Terlambat (Overdue)</option>
              <option value="RETURNED">Hanya yang Sudah Dikembalikan (Selesai)</option>
            </select>
          </div>

          <!-- Live Preview Data Matching Counter -->
          <div class="p-4 rounded-2xl border transition-all" :class="exportMatchingLoans.length > 0 ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-200 text-amber-900'">
            <div class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-lg shrink-0" :class="exportMatchingLoans.length > 0 ? 'text-emerald-700' : 'text-amber-600'">
                {{ exportMatchingLoans.length > 0 ? 'fact_check' : 'warning' }}
              </span>
              <div>
                <div class="font-bold text-xs">
                  {{ exportMatchingLoans.length }} Catatan Peminjaman Ditemukan
                </div>
                <p class="text-[11px] mt-0.5 leading-relaxed opacity-90">
                  {{ exportMatchingLoans.length > 0
                    ? `Data siap diekspor untuk periode ${formatIndoDate(exportForm.startDate)} s/d ${formatIndoDate(exportForm.endDate)}.`
                    : 'Tidak ada data peminjaman yang cocok pada rentang tanggal dan status ini. Silakan sesuaikan kembali pilihan tanggal.' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Action Export Buttons -->
          <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              @click="isExportModalOpen = false"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 cursor-pointer"
            >
              Batal
            </button>

            <!-- Download Excel -->
            <button
              type="button"
              @click="handleExportExcel"
              :disabled="exportMatchingLoans.length === 0"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-base">table_view</span>
              <span>Download Excel (.xlsx)</span>
            </button>

            <!-- Download PDF -->
            <button
              type="button"
              @click="handleExportPdf"
              :disabled="exportMatchingLoans.length === 0"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-base">picture_as_pdf</span>
              <span>Download PDF (.pdf)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { exportLoansToExcel, exportLoansToPdf } from '~/utils/loanExport'

const { settings, fetchSettings, saveSettings, resetToDefault } = useSiteSettings()

const isAuthenticated = ref(false)
const passwordInput = ref('')
const showPassword = ref(false)
const loginError = ref('')
const successMessage = ref('')

// Navigasi Section Utama: website | books | genres | loans
const mainSection = ref<'website' | 'books' | 'genres' | 'loans'>('website')
const websiteTab = ref<'navbar' | 'hero' | 'footer'>('navbar')
const isSaving = ref(false)

// State Sirkulasi & Peminjaman Buku
const loansList = ref<any[]>([])
const loanFilterStatus = ref<'ALL' | 'BORROWED' | 'OVERDUE' | 'RETURNED'>('BORROWED')
const loanSearchQuery = ref('')
const isLoanModalOpen = ref(false)
const isSubmittingLoan = ref(false)
const selectedDuration = ref<number | null>(7)

// State Ekspor Laporan
const isExportModalOpen = ref(false)
const exportForm = reactive({
  startDate: '',
  endDate: '',
  status: 'ALL'
})

const newLoanForm = reactive({
  bookId: '',
  borrowerName: '',
  borrowerNim: '',
  borrowerEmail: '',
  borrowDate: '',
  dueDate: '',
  notes: ''
})

// State Form Pengaturan Website
const siteForm = reactive({
  operationalHoursWeekdays: '',
  operationalHoursWeekends: '',
  announcementText: '',
  showAnnouncement: true,
  brandName: '',
  brandSubtitle: '',
  brandLogoUrl: '',
  attendanceFormUrl: '',
  attendanceButtonText: '',

  heroBadgeText: '',
  heroBadgeIcon: '',
  heroHeadline: '',
  heroSubheadline: '',
  heroPopularKeywords: '',

  footerDescription: '',
  footerAccreditation: '',
  footerBuilding: '',
  footerAddress: '',
  footerPhone: '',
  footerEmail: '',
  footerCopyright: ''
})

// State Upload Logo Website (Otomatis WebP)
const logoFileInput = ref<HTMLInputElement | null>(null)
const isUploadingLogo = ref(false)
const uploadLogoError = ref('')

// State Kelola Buku
const booksList = ref<any[]>([])
const bookSearchQuery = ref('')
const bookFilterCategory = ref('')
const isBookModalOpen = ref(false)
const editingBookId = ref<number | null>(null)
const isSubmittingBook = ref(false)
const bookModalError = ref('')
const bookModalFormRef = ref<HTMLFormElement | null>(null)
const bookTitleInputRef = ref<HTMLInputElement | null>(null)
const bookAuthorInputRef = ref<HTMLInputElement | null>(null)

// State Cover Upload & URL
const coverInputMode = ref<'upload' | 'url'>('upload')
const coverFileInput = ref<HTMLInputElement | null>(null)
const isDraggingCover = ref(false)
const isUploadingCover = ref(false)
const uploadCoverError = ref('')

const bookForm = reactive({
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  year: 2024,
  pages: 300,
  categoryId: 1,
  discipline: 'Sains & Teknologi',
  shelfLocation: 'Lantai 1 - Rak Umum',
  callNumber: '',
  stock: 3,
  available: 3,
  coverUrl: '',
  synopsis: '',
  isFeatured: false,
  isLiterature: false
})

// State Kelola Genre / Kategori
const categoriesList = ref<any[]>([])
const isCategoryModalOpen = ref(false)
const editingCategoryId = ref<number | null>(null)
const isSubmittingCategory = ref(false)

const categoryForm = reactive({
  name: '',
  slug: '',
  icon: 'menu_book',
  description: '',
  location: 'Lantai 1',
  color: '#00236f'
})

// Pemilih Ikon Genre (Material Symbols)
const isIconPickerOpen = ref(false)
const iconSearchQuery = ref('')
const selectedIconCategory = ref('Semua')

const iconCategories = ['Semua', 'Umum', 'Sains & TI', 'Sosial & Hukum', 'Ekonomi', 'Sastra & Seni', 'Medis']

const quickGenreIcons = [
  { name: 'menu_book', label: 'Buku Umum' },
  { name: 'auto_stories', label: 'Sastra & Fiksi' },
  { name: 'terminal', label: 'Sains & Komputer' },
  { name: 'public', label: 'Sosial & Politik' },
  { name: 'trending_up', label: 'Ekonomi & Bisnis' },
  { name: 'gavel', label: 'Ilmu Hukum' },
  { name: 'history_edu', label: 'Humaniora & Sejarah' },
  { name: 'medical_services', label: 'Kedokteran & Kesehatan' }
]

const availableGenreIcons = [
  // Umum & Pustaka
  { name: 'menu_book', label: 'Buku Umum & Koleksi', category: 'Umum' },
  { name: 'auto_stories', label: 'Sastra, Fiksi & Puisi', category: 'Sastra & Seni' },
  { name: 'library_books', label: 'Perpustakaan & Monograf', category: 'Umum' },
  { name: 'collections_bookmark', label: 'Referensi & Kliping', category: 'Umum' },
  { name: 'import_contacts', label: 'Katalog & Panduan', category: 'Umum' },
  { name: 'school', label: 'Pendidikan & Pedagogi', category: 'Umum' },
  { name: 'bookmark', label: 'Koleksi Pilihan / Kanon', category: 'Umum' },
  { name: 'feed', label: 'Publikasi & Dokumen Resmi', category: 'Umum' },

  // Sains & TI
  { name: 'terminal', label: 'Sains Komputer & Informatika', category: 'Sains & TI' },
  { name: 'code', label: 'Rekayasa Perangkat Lunak', category: 'Sains & TI' },
  { name: 'memory', label: 'Sistem Embedded & IoT', category: 'Sains & TI' },
  { name: 'precision_manufacturing', label: 'Robotika & Mekatronika', category: 'Sains & TI' },
  { name: 'science', label: 'Sains Murni & Kimia', category: 'Sains & TI' },
  { name: 'biotech', label: 'Biologi & Bioteknologi', category: 'Sains & TI' },
  { name: 'engineering', label: 'Teknik & Rekayasa Mesin', category: 'Sains & TI' },
  { name: 'calculate', label: 'Matematika & Statistika', category: 'Sains & TI' },
  { name: 'rocket_launch', label: 'Astronomi & Antariksa', category: 'Sains & TI' },
  { name: 'solar_power', label: 'Fisika & Energi Baru', category: 'Sains & TI' },
  { name: 'database', label: 'Basis Data & Sistem Informasi', category: 'Sains & TI' },
  { name: 'nature', label: 'Biologi Lingkungan & Ekologi', category: 'Sains & TI' },
  { name: 'agriculture', label: 'Pertanian & Agroteknologi', category: 'Sains & TI' },

  // Sosial, Politik & Hukum
  { name: 'public', label: 'Ilmu Sosial & Politik', category: 'Sosial & Hukum' },
  { name: 'gavel', label: 'Ilmu Hukum & Peradilan', category: 'Sosial & Hukum' },
  { name: 'policy', label: 'Kebijakan Publik & Tata Kelola', category: 'Sosial & Hukum' },
  { name: 'balance', label: 'Konstitusi & Keadilan', category: 'Sosial & Hukum' },
  { name: 'diversity_3', label: 'Sosiologi & Antropologi', category: 'Sosial & Hukum' },
  { name: 'shield', label: 'Ketahanan & Keamanan Negara', category: 'Sosial & Hukum' },
  { name: 'handshake', label: 'Hubungan Internasional & Diplomasi', category: 'Sosial & Hukum' },
  { name: 'record_voice_over', label: 'Komunikasi Massa & Public Relations', category: 'Sosial & Hukum' },
  { name: 'newspaper', label: 'Jurnalistik & Pers Mahasiswa', category: 'Sosial & Hukum' },
  { name: 'travel_explore', label: 'Geografi & Geopolitik', category: 'Sosial & Hukum' },

  // Ekonomi & Bisnis
  { name: 'trending_up', label: 'Ekonomi Makro & Bisnis', category: 'Ekonomi' },
  { name: 'payments', label: 'Keuangan & Fiskal', category: 'Ekonomi' },
  { name: 'account_balance', label: 'Perbankan & Moneter', category: 'Ekonomi' },
  { name: 'storefront', label: 'Manajemen Bisnis & Pemasaran', category: 'Ekonomi' },
  { name: 'analytics', label: 'Riset Pasar & Ekonometrika', category: 'Ekonomi' },
  { name: 'savings', label: 'Akuntansi & Perpajakan', category: 'Ekonomi' },

  // Sastra, Humaniora & Seni
  { name: 'history_edu', label: 'Humaniora, Sejarah & Arkeologi', category: 'Sastra & Seni' },
  { name: 'palette', label: 'Seni Rupa & Desain Komunikasi Visual', category: 'Sastra & Seni' },
  { name: 'architecture', label: 'Arsitektur & Perencanaan Wilayah', category: 'Sastra & Seni' },
  { name: 'language', label: 'Linguistik & Ilmu Budaya', category: 'Sastra & Seni' },
  { name: 'music_note', label: 'Seni Musik & Komposisi', category: 'Sastra & Seni' },
  { name: 'theater_comedy', label: 'Seni Pertunjukan, Teater & Film', category: 'Sastra & Seni' },
  { name: 'lightbulb', label: 'Filsafat, Logika & Etika', category: 'Sastra & Seni' },
  { name: 'mosque', label: 'Studi Agama, Teologi & Peradaban', category: 'Sastra & Seni' },

  // Kedokteran & Kesehatan
  { name: 'medical_services', label: 'Kedokteran Klinis & Bedah', category: 'Medis' },
  { name: 'health_and_safety', label: 'Kesehatan Masyarakat & Epidemiologi', category: 'Medis' },
  { name: 'local_pharmacy', label: 'Farmasi & Farmakologi', category: 'Medis' },
  { name: 'psychology', label: 'Psikologi & Ilmu Perilaku', category: 'Medis' },
  { name: 'healing', label: 'Keperawatan & Fisioterapi', category: 'Medis' },
  { name: 'fitness_center', label: 'Ilmu Keolahragaan & Kesehatan Fisik', category: 'Medis' }
]

const filteredGenreIcons = computed(() => {
  let list = availableGenreIcons
  if (selectedIconCategory.value !== 'Semua') {
    list = list.filter(i => i.category === selectedIconCategory.value)
  }
  if (iconSearchQuery.value.trim()) {
    const q = iconSearchQuery.value.toLowerCase().trim()
    list = list.filter(i =>
      i.label.toLowerCase().includes(q) ||
      i.name.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    )
  }
  return list
})

const getSelectedIconLabel = computed(() => {
  const found = availableGenreIcons.find(i => i.name === categoryForm.icon)
  return found ? found.label : (categoryForm.icon || 'Buku Umum')
})

// Auto-generate slug dari nama jika belum diisi manual
watch(() => categoryForm.name, (newName) => {
  if (!editingCategoryId.value && newName) {
    categoryForm.slug = newName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

// Filter Buku Admin
const filteredAdminBooks = computed(() => {
  return booksList.value.filter((b) => {
    if (bookFilterCategory.value && b.category?.slug !== bookFilterCategory.value) {
      return false
    }
    if (bookSearchQuery.value.trim()) {
      const q = bookSearchQuery.value.toLowerCase().trim()
      const match =
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.callNumber.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

// Pagination Buku Admin (10 buku per halaman & tombol Next)
const bookCurrentPage = ref(1)
const bookPageSize = 10

const bookTotalPages = computed(() => {
  return Math.ceil(filteredAdminBooks.value.length / bookPageSize) || 1
})

const paginatedAdminBooks = computed(() => {
  const start = (bookCurrentPage.value - 1) * bookPageSize
  return filteredAdminBooks.value.slice(start, start + bookPageSize)
})

const goToBookPage = (page: number) => {
  if (page < 1 || page > bookTotalPages.value) return
  bookCurrentPage.value = page
}

// Reset halaman ke 1 jika filter atau pencarian buku berubah
watch([bookSearchQuery, bookFilterCategory], () => {
  bookCurrentPage.value = 1
})

const getBooksCountForCategory = (slug: string) => {
  return booksList.value.filter((b) => b.category?.slug === slug).length
}

const populateSiteForm = () => {
  Object.assign(siteForm, settings.value)
}

const loadData = async () => {
  try {
    const [booksRes, catsRes]: any = await Promise.all([
      $fetch('/api/books'),
      $fetch('/api/categories'),
      loadLoans()
    ])
    if (booksRes && booksRes.data) {
      booksList.value = booksRes.data
    }
    if (catsRes && catsRes.data) {
      categoriesList.value = catsRes.data
    }
  } catch (err) {
    console.error('Gagal memuat data buku/genre/peminjaman:', err)
  }
}

// Login & Logout
const handleLogin = () => {
  loginError.value = ''
  if (passwordInput.value === 'admin123') {
    isAuthenticated.value = true
    if (import.meta.client) {
      sessionStorage.setItem('perpusku_admin_auth', 'true')
    }
    populateSiteForm()
    loadData()
  } else {
    loginError.value = 'Kata sandi pengelola salah. Silakan coba lagi.'
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  passwordInput.value = ''
  if (import.meta.client) {
    sessionStorage.removeItem('perpusku_admin_auth')
  }
}

// Simpan Pengaturan Website
const saveWebsiteSettings = async () => {
  isSaving.value = true
  successMessage.value = ''
  try {
    await saveSettings(siteForm)
    successMessage.value = 'Pengaturan website berhasil disimpan dan langsung aktif di publik!'
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (err: any) {
    alert(err?.message || 'Gagal menyimpan pengaturan.')
  } finally {
    isSaving.value = false
  }
}

const confirmResetWebsite = async () => {
  if (!confirm('Kembalikan semua teks navbar, hero, dan footer ke setelan awal?')) return
  isSaving.value = true
  try {
    await resetToDefault()
    populateSiteForm()
    successMessage.value = 'Pengaturan website dikembalikan ke setelan awal.'
    setTimeout(() => { successMessage.value = '' }, 5000)
  } finally {
    isSaving.value = false
  }
}

// ==========================================
// UTILITAS: KONVERSI GAMBAR KE WEBP (CLIENT-SIDE)
// ==========================================
const convertImageToWebP = (
  file: File,
  maxWidth = 600,
  quality = 0.82
): Promise<{ blob: Blob; dataUrl: string; filename: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Format file gambar tidak valid atau rusak.'))
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Auto-resize proporsional jika lebih besar dari maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas tidak didukung di browser ini.'))
          return
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        const webpDataUrl = canvas.toDataURL('image/webp', quality)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal mengonversi gambar ke format WebP.'))
              return
            }
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image'
            const safeName = originalName.replace(/[^a-zA-Z0-9-_]/g, '_')
            const webpFilename = `${safeName}.webp`

            resolve({
              blob,
              dataUrl: webpDataUrl,
              filename: webpFilename
            })
          },
          'image/webp',
          quality
        )
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

// Logo Upload Handlers (Otomatis WebP)
const triggerLogoFilePicker = () => {
  uploadLogoError.value = ''
  logoFileInput.value?.click()
}

const handleLogoFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    uploadLogoError.value = 'File logo harus berupa gambar (JPG, PNG, WEBP).'
    return
  }

  uploadLogoError.value = ''
  isUploadingLogo.value = true

  try {
    const { blob, dataUrl, filename } = await convertImageToWebP(file, 400, 0.85)
    siteForm.brandLogoUrl = dataUrl

    const formData = new FormData()
    formData.append('file', blob, filename)

    const res: any = await $fetch('/api/upload?folder=branding', {
      method: 'POST',
      body: formData
    })

    if (res && res.url) {
      siteForm.brandLogoUrl = res.url
    }
  } catch (err: any) {
    console.warn('Gagal memproses upload logo ke WebP:', err)
    uploadLogoError.value = err?.message || 'Gagal mengunggah logo.'
  } finally {
    isUploadingLogo.value = false
    if (logoFileInput.value) logoFileInput.value.value = ''
  }
}

// Cover Upload Handlers (Otomatis WebP)
const triggerCoverFilePicker = () => {
  uploadCoverError.value = ''
  coverFileInput.value?.click()
}

const uploadImageFile = async (file: File) => {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    uploadCoverError.value = 'File yang dipilih harus berupa file gambar (JPG, PNG, WEBP).'
    return
  }
  if (file.size > 15 * 1024 * 1024) {
    uploadCoverError.value = 'Ukuran file gambar maksimal 15MB.'
    return
  }

  uploadCoverError.value = ''
  isUploadingCover.value = true

  try {
    // 1. Konversi ke WebP dan auto-resize proporsional (max-width 600px, quality 82%)
    const { blob, dataUrl, filename } = await convertImageToWebP(file, 600, 0.82)

    // Tampilkan preview instan
    bookForm.coverUrl = dataUrl

    // 2. Upload WebP Blob ke server
    const formData = new FormData()
    formData.append('file', blob, filename)

    const res: any = await $fetch('/api/upload?folder=books', {
      method: 'POST',
      body: formData
    })

    if (res && res.url) {
      bookForm.coverUrl = res.url
    }
  } catch (err: any) {
    console.warn('Gagal memproses gambar ke WebP:', err)
    uploadCoverError.value = err?.message || 'Gagal mengonversi gambar ke WebP.'
  } finally {
    isUploadingCover.value = false
    if (coverFileInput.value) {
      coverFileInput.value.value = ''
    }
  }
}

const handleCoverFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadImageFile(file)
  }
}

const handleCoverDrop = (e: DragEvent) => {
  isDraggingCover.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    uploadImageFile(file)
  }
}

const onBookCategoryChange = () => {
  const selected = categoriesList.value.find(c => c.id === Number(bookForm.categoryId))
  if (selected) {
    bookForm.discipline = selected.name
    if (!bookForm.shelfLocation || bookForm.shelfLocation === 'Lantai 1 - Rak Umum' || bookForm.shelfLocation === 'Lantai 1') {
      bookForm.shelfLocation = selected.location || 'Lantai 1 - Rak Umum'
    }
  }
}

// BUKU: Modal & CRUD
const openAddBookModal = () => {
  editingBookId.value = null
  bookModalError.value = ''
  coverInputMode.value = 'upload'
  uploadCoverError.value = ''
  Object.assign(bookForm, {
    title: '',
    author: '',
    isbn: '',
    publisher: 'Penerbit Kampus',
    year: new Date().getFullYear(),
    pages: 280,
    categoryId: categoriesList.value[0]?.id || 1,
    discipline: categoriesList.value[0]?.name || 'Sains & Teknologi',
    shelfLocation: 'Lantai 1 - Rak Umum',
    callNumber: '',
    stock: 3,
    available: 3,
    coverUrl: '',
    synopsis: '',
    isFeatured: false,
    isLiterature: false
  })
  isBookModalOpen.value = true
}

const openEditBookModal = (book: any) => {
  editingBookId.value = book.id
  bookModalError.value = ''
  uploadCoverError.value = ''
  coverInputMode.value = book.coverUrl && book.coverUrl.startsWith('http') ? 'url' : 'upload'
  Object.assign(bookForm, {
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    publisher: book.publisher || '',
    year: book.year,
    pages: book.pages,
    categoryId: book.categoryId,
    discipline: book.discipline,
    shelfLocation: book.shelfLocation,
    callNumber: book.callNumber,
    stock: book.stock,
    available: book.available,
    coverUrl: book.coverUrl || '',
    synopsis: book.synopsis,
    isFeatured: Boolean(book.isFeatured),
    isLiterature: Boolean(book.isLiterature)
  })
  isBookModalOpen.value = true
}

const saveBookForm = async () => {
  bookModalError.value = ''

  // Validasi wajib isi di sisi client
  if (!bookForm.title || !bookForm.title.trim()) {
    bookModalError.value = 'Judul Buku wajib diisi! Mohon masukkan judul buku di bagian atas form.'
    bookModalFormRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => { bookTitleInputRef.value?.focus() }, 150)
    return
  }

  if (!bookForm.author || !bookForm.author.trim()) {
    bookModalError.value = 'Nama Pengarang / Penulis wajib diisi! Mohon lengkapi nama penulis buku.'
    bookModalFormRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => { bookAuthorInputRef.value?.focus() }, 150)
    return
  }

  isSubmittingBook.value = true
  try {
    if (editingBookId.value) {
      await $fetch(`/api/books/${editingBookId.value}`, {
        method: 'PUT',
        body: bookForm
      })
      successMessage.value = `Buku "${bookForm.title}" berhasil diperbarui!`
    } else {
      await $fetch('/api/books', {
        method: 'POST',
        body: bookForm
      })
      successMessage.value = `Buku baru "${bookForm.title}" berhasil ditambahkan ke katalog!`
    }
    isBookModalOpen.value = false
    await loadData()
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (err: any) {
    const errorMsg =
      err?.data?.statusMessage ||
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      'Gagal menyimpan data buku. Pastikan server aktif dan form terisi dengan benar.'
    bookModalError.value = errorMsg
    bookModalFormRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isSubmittingBook.value = false
  }
}

const confirmDeleteBook = async (book: any) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}" dari katalog perpustakaan?`)) return
  try {
    await $fetch(`/api/books/${book.id}`, { method: 'DELETE' })
    successMessage.value = `Buku "${book.title}" berhasil dihapus!`
    await loadData()
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (err: any) {
    alert(err?.data?.message || err?.message || 'Gagal menghapus buku.')
  }
}

// GENRE: Modal & CRUD
const openAddCategoryModal = () => {
  editingCategoryId.value = null
  isIconPickerOpen.value = false
  iconSearchQuery.value = ''
  selectedIconCategory.value = 'Semua'
  Object.assign(categoryForm, {
    name: '',
    slug: '',
    icon: 'menu_book',
    description: '',
    location: 'Lantai 1 - Ruang Umum',
    color: '#00236f'
  })
  isCategoryModalOpen.value = true
}

const openEditCategoryModal = (cat: any) => {
  editingCategoryId.value = cat.id
  isIconPickerOpen.value = false
  iconSearchQuery.value = ''
  selectedIconCategory.value = 'Semua'
  Object.assign(categoryForm, {
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon || 'menu_book',
    description: cat.description || '',
    location: cat.location || 'Lantai 1',
    color: cat.color || '#00236f'
  })
  isCategoryModalOpen.value = true
}

const saveCategoryForm = async () => {
  isSubmittingCategory.value = true
  try {
    if (editingCategoryId.value) {
      await $fetch(`/api/categories/${editingCategoryId.value}`, {
        method: 'PUT',
        body: categoryForm
      })
      successMessage.value = `Genre "${categoryForm.name}" berhasil diperbarui!`
    } else {
      await $fetch('/api/categories', {
        method: 'POST',
        body: categoryForm
      })
      successMessage.value = `Genre baru "${categoryForm.name}" berhasil ditambahkan!`
    }
    isCategoryModalOpen.value = false
    await loadData()
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (err: any) {
    alert(err?.data?.message || err?.message || 'Gagal menyimpan genre.')
  } finally {
    isSubmittingCategory.value = false
  }
}

const confirmDeleteCategory = async (cat: any) => {
  if (!confirm(`Hapus genre "${cat.name}"? Pastikan tidak ada buku yang masih terikat dengan genre ini.`)) return
  try {
    await $fetch(`/api/categories/${cat.id}`, { method: 'DELETE' })
    successMessage.value = `Genre "${cat.name}" berhasil dihapus!`
    await loadData()
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (err: any) {
    alert(err?.data?.message || err?.message || 'Gagal menghapus genre.')
  }
}

// ==========================================
// SIRKULASI & PEMINJAMAN BUKU (ADMIN)
// ==========================================
const formatIndoDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const isOverdue = (loan: any): boolean => {
  if (!loan || loan.status === 'RETURNED' || !loan.dueDate) return false
  const due = new Date(loan.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

const getOverdueDays = (loan: any): number => {
  if (!loan || !loan.dueDate) return 0
  const due = new Date(loan.dueDate).getTime()
  const now = new Date().getTime()
  const diffTime = now - due
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

const getRemainingDays = (loan: any): number => {
  if (!loan || !loan.dueDate) return 0
  const due = new Date(loan.dueDate).getTime()
  const now = new Date().getTime()
  const diffTime = due - now
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

const availableBooksForLoan = computed(() => {
  return booksList.value.filter((b) => Number(b.available) > 0)
})

const activeLoansCount = computed(() => {
  return loansList.value.filter((l) => l.status !== 'RETURNED').length
})

const overdueLoansCount = computed(() => {
  return loansList.value.filter((l) => isOverdue(l)).length
})

const returnedLoansCount = computed(() => {
  return loansList.value.filter((l) => l.status === 'RETURNED').length
})

const filteredLoans = computed(() => {
  return loansList.value.filter((loan) => {
    // Filter status tab
    if (loanFilterStatus.value === 'BORROWED') {
      if (loan.status === 'RETURNED') return false
    } else if (loanFilterStatus.value === 'OVERDUE') {
      if (!isOverdue(loan)) return false
    } else if (loanFilterStatus.value === 'RETURNED') {
      if (loan.status !== 'RETURNED') return false
    }

    // Filter pencarian teks
    if (loanSearchQuery.value.trim()) {
      const q = loanSearchQuery.value.toLowerCase().trim()
      const matchBorrower =
        loan.borrowerName?.toLowerCase().includes(q) ||
        loan.borrowerNim?.toLowerCase().includes(q)
      const matchBook =
        loan.book?.title?.toLowerCase().includes(q) ||
        loan.book?.isbn?.toLowerCase().includes(q) ||
        loan.book?.callNumber?.toLowerCase().includes(q)
      if (!matchBorrower && !matchBook) return false
    }

    return true
  })
})

// Pagination Sirkulasi Peminjaman (10 data per halaman & tombol Next)
const loanCurrentPage = ref(1)
const loanPageSize = 10

const loanTotalPages = computed(() => {
  return Math.ceil(filteredLoans.value.length / loanPageSize) || 1
})

const paginatedLoans = computed(() => {
  const start = (loanCurrentPage.value - 1) * loanPageSize
  return filteredLoans.value.slice(start, start + loanPageSize)
})

const goToLoanPage = (page: number) => {
  if (page < 1 || page > loanTotalPages.value) return
  loanCurrentPage.value = page
}

// Reset halaman ke 1 jika filter atau pencarian peminjaman berubah
watch([loanSearchQuery, loanFilterStatus], () => {
  loanCurrentPage.value = 1
})

const loadLoans = async () => {
  try {
    const res: any = await $fetch('/api/loans')
    if (res && res.data) {
      loansList.value = res.data
    }
  } catch (err) {
    console.error('Gagal memuat data peminjaman:', err)
  }
}

const setLoanDuration = (days: number) => {
  selectedDuration.value = days
  const baseDate = newLoanForm.borrowDate ? new Date(newLoanForm.borrowDate) : new Date()
  const due = new Date(baseDate)
  due.setDate(due.getDate() + Number(days))
  newLoanForm.dueDate = due.toISOString().slice(0, 10)
}

// Sinkronisasi status tombol durasi jika admin mengubah input tanggal secara manual
watch(
  [() => newLoanForm.borrowDate, () => newLoanForm.dueDate],
  ([borrow, due]) => {
    if (!borrow || !due) {
      selectedDuration.value = null
      return
    }
    const b = new Date(borrow).getTime()
    const d = new Date(due).getTime()
    const diffDays = Math.round((d - b) / (1000 * 60 * 60 * 24))
    if ([3, 7, 14].includes(diffDays)) {
      selectedDuration.value = diffDays
    } else {
      selectedDuration.value = null
    }
  }
)

const openAddLoanModal = () => {
  selectedDuration.value = 7
  const today = new Date().toISOString().slice(0, 10)
  const defaultDue = new Date()
  defaultDue.setDate(defaultDue.getDate() + 7)

  newLoanForm.bookId = availableBooksForLoan.value[0]?.id || ''
  newLoanForm.borrowerName = ''
  newLoanForm.borrowerNim = ''
  newLoanForm.borrowerEmail = ''
  newLoanForm.borrowDate = today
  newLoanForm.dueDate = defaultDue.toISOString().slice(0, 10)
  newLoanForm.notes = ''

  isLoanModalOpen.value = true
}

const saveLoanForm = async () => {
  if (!newLoanForm.bookId || !newLoanForm.borrowerName.trim() || !newLoanForm.borrowerNim.trim()) {
    alert('Harap pilih buku, isi Nama Pemustaka, dan NIM.')
    return
  }

  isSubmittingLoan.value = true
  try {
    const res: any = await $fetch('/api/loans', {
      method: 'POST',
      body: newLoanForm
    })

    if (res && res.success) {
      successMessage.value = res.message || 'Peminjaman buku berhasil dicatat!'
      isLoanModalOpen.value = false
      await Promise.all([loadLoans(), loadData()])
      setTimeout(() => { successMessage.value = '' }, 5000)
    }
  } catch (err: any) {
    alert(err?.data?.message || err?.message || 'Gagal mencatat peminjaman.')
  } finally {
    isSubmittingLoan.value = false
  }
}

const handleReturnLoan = async (loan: any) => {
  const confirmMsg = `Tandai buku "${loan.book?.title || 'buku'}" yang dipinjam oleh ${loan.borrowerName} telah dikembalikan? Stok ketersediaan buku akan otomatis bertambah 1.`
  if (!confirm(confirmMsg)) return

  try {
    const res: any = await $fetch(`/api/loans/${loan.id}`, {
      method: 'PATCH',
      body: { action: 'return' }
    })
    successMessage.value = res?.message || 'Buku berhasil ditandai telah dikembalikan!'
    await Promise.all([loadLoans(), loadData()])
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (err: any) {
    alert(err?.data?.message || err?.message || 'Gagal mengembalikan buku.')
  }
}

const handleExtendLoan = async (loan: any) => {
  if (!confirm(`Perpanjang batas waktu peminjaman buku ini sebanyak 7 hari ke depan?`)) return

  try {
    const res: any = await $fetch(`/api/loans/${loan.id}`, {
      method: 'PATCH',
      body: { action: 'extend', additionalDays: 7 }
    })
    successMessage.value = res?.message || 'Tenggat peminjaman berhasil diperpanjang!'
    await loadLoans()
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (err: any) {
    alert(err?.data?.message || err?.message || 'Gagal memperpanjang batas waktu.')
  }
}

const handleDeleteLoan = async (loan: any) => {
  const isCurrentlyActive = loan.status !== 'RETURNED'
  const confirmMsg = isCurrentlyActive
    ? `Hapus transaksi peminjaman ini? Karena buku masih berstatus aktif dipinjam, stok buku akan dikembalikan otomatis.`
    : `Hapus catatan riwayat peminjaman ini secara permanen?`

  if (!confirm(confirmMsg)) return

  try {
    const res: any = await $fetch(`/api/loans/${loan.id}`, {
      method: 'DELETE'
    })
    successMessage.value = res?.message || 'Catatan peminjaman berhasil dihapus.'
    await Promise.all([loadLoans(), loadData()])
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (err: any) {
    alert(err?.data?.message || err?.message || 'Gagal menghapus peminjaman.')
  }
}

// ==========================================
// EKSPOR LAPORAN SIRKULASI (EXCEL & PDF)
// ==========================================
const openExportModal = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  exportForm.startDate = `${year}-${month}-01`
  exportForm.endDate = `${year}-${month}-${day}`
  exportForm.status = 'ALL'
  isExportModalOpen.value = true
}

const exportMatchingLoans = computed(() => {
  if (!exportForm.startDate || !exportForm.endDate) return []

  const start = new Date(exportForm.startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(exportForm.endDate)
  end.setHours(23, 59, 59, 999)

  return loansList.value.filter((loan) => {
    // Filter rentang tanggal pinjam
    const borrowTime = new Date(loan.borrowDate).getTime()
    if (isNaN(borrowTime) || borrowTime < start.getTime() || borrowTime > end.getTime()) {
      return false
    }

    // Filter status transaksi
    if (exportForm.status === 'BORROWED') {
      if (loan.status === 'RETURNED') return false
    } else if (exportForm.status === 'OVERDUE') {
      if (!isOverdue(loan)) return false
    } else if (exportForm.status === 'RETURNED') {
      if (loan.status !== 'RETURNED') return false
    }

    return true
  })
})

const getStatusLabel = (status: string) => {
  if (status === 'BORROWED') return 'Sedang Dipinjam'
  if (status === 'OVERDUE') return 'Terlambat (Overdue)'
  if (status === 'RETURNED') return 'Sudah Dikembalikan'
  return 'Semua Status'
}

const handleExportExcel = () => {
  try {
    exportLoansToExcel(exportMatchingLoans.value, {
      startDate: exportForm.startDate,
      endDate: exportForm.endDate,
      statusLabel: getStatusLabel(exportForm.status)
    })
  } catch (err: any) {
    alert(err?.message || 'Gagal mengekspor laporan ke Excel.')
  }
}

const handleExportPdf = () => {
  try {
    exportLoansToPdf(exportMatchingLoans.value, {
      startDate: exportForm.startDate,
      endDate: exportForm.endDate,
      statusLabel: getStatusLabel(exportForm.status)
    })
  } catch (err: any) {
    alert(err?.message || 'Gagal mengekspor laporan ke PDF.')
  }
}

onMounted(async () => {
  if (import.meta.client) {
    const cachedAuth = sessionStorage.getItem('perpusku_admin_auth')
    if (cachedAuth === 'true') {
      isAuthenticated.value = true
    }
  }

  await fetchSettings(true)
  populateSiteForm()
  if (isAuthenticated.value) {
    await loadData()
  }
})
</script>
