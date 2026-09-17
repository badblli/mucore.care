# Mucore Care

> **Mucore Care**, Lazca “muççore” (nasılsın?) kelimesinden esinlenmiştir.  
> Amaç, ailelerin evde hasta bakım sürecini kolayca takip etmesini, ilaç ve randevu hatırlatmaları almasını ve günlük sağlık verilerini düzenli kaydetmesini sağlamaktır.

---

## Proje Durumu

Erken aşama bir prototiptir; gerçek hasta verileriyle veya klinik kullanımda kullanılmamalıdır. Kimlik doğrulama, yetkilendirme ve veri gizliliği üretim kullanımı için ayrıca doğrulanmalıdır.

## 🎯 Amaç
- Hastanın genel bilgilerini (tanılar, ameliyatlar, alerjiler, cihazlar) saklamak  
- Günlük vital ölçümleri (tansiyon, şeker, ateş, nabız, SpO₂) kaydetmek  
- İlaç çizelgesi oluşturmak ve saatinde bildirim göndermek  
- Bakım kayıtlarını (su alımı, beslenme, idrar/bez değişimi, yara durumu) takip etmek  
- Nörolojik durum (bilinç, konuşma, motor beceri, ağrı) günlüğü tutmak  
- Doktor ve randevu bilgilerini kaydetmek, hatırlatıcı kurmak  
- Çoklu kullanıcı desteği (owner, caregiver, viewer roller)  
- Mobil uygulamaya benzer, basit ve anlaşılır UI/UX ile erişim sağlamak  

---

## 🖥️ Teknoloji Yığını
- **Next.js 15 (LTS)** – App Router, TypeScript  
- **TailwindCSS + shadcn/ui** – modern ve erişilebilir UI bileşenleri  
- **Supabase** – PostgreSQL veritabanı + kimlik doğrulama + dosya depolama  
- **OneSignal** – web push bildirimleri (ilaç ve randevu hatırlatma)  
- **Vercel Cron Jobs** – saatli görevler (ilaç/randevu kontrolü)  
- **React Hook Form + Zod** – form yönetimi & doğrulama  
- **TanStack Query** – veri önbellekleme ve senkronizasyon  
- **dayjs + timezone** – tarih/saat yönetimi (UTC kayıt, TR gösterim)  

---

## 🎨 Renk Paleti
- Ana (Mavi – güven & teknoloji): **#2563EB**  
- Yardımcı (Yeşil – sağlık & iyileşme): **#10B981**  
- Nötr (Açık gri – arka plan): **#F9FAFB**  
- Vurgulu (Turuncu – uyarılar, kritik değerler): **#F59E0B**  
- Yazı (Koyu gri – okunabilirlik): **#111827**  

---

## 🚀 Özellikler
- 📋 **Hasta Kartı** – genel bilgiler, cihazlar, bakım notları  
- 📊 **Vital Ölçümler** – tansiyon, şeker, ateş, nabız, SpO₂ kaydı & grafikler  
- 💊 **İlaç Takibi** – doz, saatler, yemek ilişkisi, otomatik bildirim  
- 🧾 **Bakım Günlüğü** – sıvı alımı, beslenme, idrar/bez değişimi, yara kontrolü  
- 🧠 **Nörolojik Durum** – bilinç seviyesi, konuşma, motor beceriler, ağrı notları  
- 📅 **Randevu Takibi** – doktor bilgileri, tarih/saat, hatırlatma  
- 🔔 **Bildirimler** – ilaç saati yaklaşınca bakıcıya, gecikince aileye uyarı  
- 📱 **Mobil Benzeri UI** – PWA desteği, offline kayıt  

---

## 📂 Dizin Yapısı (öneri)
```
/app
  /login
  /dashboard
  /patients/[id]/(tabs)/{overview|vitals|care|neuro|meds|appointments|report}
  /settings
/components
/lib (supabaseClient.ts, onesignal.ts, validators.ts, tz.ts)
/server (cron.ts, push.ts, queries.ts)
/styles (globals.css)
```

---

## ✅ MVP Yol Haritası
1. Supabase bağlantısı ve tablo şemaları  
2. Hasta kartı oluşturma ve düzenleme  
3. Vital, bakım, nörolojik günlük formları  
4. İlaç tanımlama & günlük çizelge oluşturma  
5. İlaç/randevu hatırlatıcı cron job + OneSignal push  
6. Dashboard’da günlük özet & kritik değer uyarıları  
7. PWA yapılandırması (ana ekrana ekle, offline destek)  

---

## 🔧 Kurulum
```bash
# Projeyi indir
git clone https://github.com/badblli/mucore.care.git
cd mucore.care

# Bağımlılıkları yükle
npm install

# Çalıştır
npm run dev
```

`.env.local` dosyası örneği:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ONESIGNAL_APP_ID=...
ONESIGNAL_REST_API_KEY=...
```

---

## 🗄️ Supabase Tablo Şeması (SQL)

```sql
-- Tenancy & profiles
create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table profiles (
  id uuid primary key,        -- maps to auth.users.id
  tenant_id uuid references tenants(id) on delete cascade,
  role text check (role in ('owner','caregiver','viewer')) not null,
  created_at timestamptz default now()
);

-- Patients
create table patients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  name text not null,
  national_id text,
  dob date,
  sex text,
  diagnoses text,
  allergies text,
  chronic text,
  devices jsonb,
  care_notes text,
  timezone text default 'Europe/Istanbul',
  created_at timestamptz default now()
);

-- Settings (thresholds)
create table settings (
  patient_id uuid primary key references patients(id) on delete cascade,
  bp_high_sys int default 160,
  bp_high_dia int default 100,
  bp_emergency_sys int default 180,
  bp_emergency_dia int default 110,
  glucose_high int default 250,
  glucose_low int default 70,
  med_reminder_ahead_min int default 10
);

-- Vitals
create table vitals (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  ts_utc timestamptz not null,
  bp_sys int,
  bp_dia int,
  glucose int,
  temp numeric(4,1),
  pulse int,
  spo2 int,
  note text
);

-- Care logs
create table care_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  ts_utc timestamptz not null,
  intake_ml int,
  urine_count int,
  stool text,
  feeding text,
  wound boolean,
  wound_note text,
  note text
);

-- Neuro logs
create table neuro_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  ts_utc timestamptz not null,
  consciousness text,
  speech text,
  motor_left text,
  motor_right text,
  pain_note text,
  note text
);

-- Medications
create table meds (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  name text not null,
  dose text not null,
  route text,
  with_food boolean,
  times text[] not null,
  stock_count int,
  note text
);

-- Planned / actual administrations
create table med_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  med_id uuid references meds(id) on delete cascade,
  ts_planned_utc timestamptz not null,
  ts_given_utc timestamptz,
  given boolean default false,
  note text
);

-- Doctors & Appointments
create table doctors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  name text not null,
  specialty text,
  phone text,
  hospital text,
  note text
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  doctor_id uuid references doctors(id) on delete set null,
  title text not null,
  start_utc timestamptz not null,
  end_utc timestamptz,
  location text,
  note text,
  remind_min int default 120
);

-- Devices (push)
create table devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  patient_id uuid references patients(id) on delete cascade,
  onesignal_pid text not null,
  platform text,
  created_at timestamptz default now()
);
```

---

## 📌 Notlar
- Varsayılan dil **Türkçe**’dir.  
- Tarih/saat UTC olarak kaydedilir, ekranda **Europe/Istanbul** olarak gösterilir.  
- UI/UX mobil öncelikli, büyük butonlar ve renk kodlu uyarılar içerir.  
- Uygulama PWA olarak kullanılabilir ve ileride mobil uygulama (React Native/Expo) sürümü planlanmaktadır.  
