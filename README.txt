/* Vuslat – Afet Yardım ve Gönüllü Eşleştirme Sistemi */

Vuslat, afet durumlarında ihtiyaç sahipleri ile yardım etmek isteyen gönüllüleri bir araya getiren, lojistik kaynak takibi ve acil durum çağrılarını tek bir merkezden yöneten modern bir yardımlaşma platformudur.

* Özellikler : 

 -> Afetzede ve Gönüllü rolleriyle ihtiyaç-yardım eşleştirme sistemi
 -> Gönüllüler ve afetzedeler arasında anlık mesajlaşma ve iletişim
 -> Komuta Merkezi: Tüm sistemi yöneten, istatistikleri ve acil çağrıları takip eden yönetici paneli
 -> Lojistik ve Kaynak Takibi: Stok yönetimi ve ihtiyaç duyulan malzemelerin anlık takibi
 -> SOS (Beni Ara): Afetzedeler için tek tıkla acil durum çağrısı oluşturma özelliği
 -> Mobil, tablet ve masaüstü ile tam uyumlu modern, glassmorphism destekli karanlık tema
 -> Rate Limit, JSON boyutu sınırı ve Girdi Doğrulama ile public seviyede üst düzey güvenlik

* Kullanılan Teknolojiler :

    Frontend : 

   -> React.js
   -> Vite
   -> Vanilla CSS (Dark & Glassmorphism)
   -> Lucide React

    Backend :

   -> Node.js
   -> Express.js
   -> PostgreSQL (NeonDB)
   -> JWT & BcryptJS

* Geliştirici : Eren Söğütlü

-----------------------------------------------------------------------------------------------------------------

/* Vuslat – Disaster Relief and Volunteer Matching System */

Vuslat is a modern relief platform that brings together those in need (survivors) and volunteers who want to help during disasters, managing logistics resource tracking and emergency calls from a single center.

* Features : 

 -> Matching system for survivors and volunteers based on specific roles
 -> Real-time messaging and communication between volunteers and survivors
 -> Command Center: Admin panel managing the entire system, tracking statistics and emergency calls
 -> Logistics and Resource Tracking: Inventory management and real-time tracking of needed materials
 -> SOS (Call Me): One-click emergency call creation feature for survivors
 -> Modern, glassmorphism-supported dark theme fully responsive with mobile, tablet, and desktop
 -> High-level security with Rate Limiting, JSON payload limits, and Input Validation

* Technologies Used : 

    Frontend : 

   -> React.js 
   -> Vite 
   -> Vanilla CSS (Dark & Glassmorphism)
   -> Lucide React

    Backend : 

   -> Node.js 
   -> Express.js 
   -> PostgreSQL (NeonDB)
   -> JWT & BcryptJS

* Developer : Eren Söğütlü

-----------------------------------------------------------------------------------------------------------------

## Kurulum ve Çalıştırma

### 1. Gerekli Paketlerin Yüklenmesi

Frontend için:

```bash
cd frontend
npm install
```

Backend için:

```bash
cd backend
npm install
```

---

### 2. Çevre Değişkenleri Ayarları (.env)

Backend için `backend` dizininde `.env` dosyasını oluşturup bilgileri girin:

```env
DATABASE_URL=your_postgresql_database_url
JWT_GIZLI_ANAHTAR=your_secret_key
PORT=5000
```

---

### 3. Projeyi Çalıştırma

Kurulum tamamlandıktan sonra iki ayrı terminal kullanın:

#### Backend (Arka Yüz)

```bash
cd backend
node sunucu.js
```

> Sunucu: http://localhost:5000

---

#### Frontend (Ön Yüz)

```bash
cd frontend
npm run dev
```

> Uygulama: http://localhost:5173

-----------------------------------------------------------------------------------------------------------------

## Installation and Operation

### 1. Installing Required Packages

For frontend:

```bash
cd frontend
npm install
```

For backend:

```bash
cd backend
npm install
```

---

### 2. Environment Variables Settings (.env)

Create an `.env` file in the `backend` directory and fill in the contents:

```env
DATABASE_URL=your_postgresql_database_url
JWT_GIZLI_ANAHTAR=your_secret_key
PORT=5000
```

---

### 3. Running the Project

Once the installation is complete, use two separate terminals:

#### Backend

```bash
cd backend
node sunucu.js
```

> Server: http://localhost:5000

---

#### Frontend

```bash
cd frontend
npm run dev
```

> Application: http://localhost:5173