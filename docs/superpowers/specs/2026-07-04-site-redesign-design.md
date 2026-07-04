# Site Redesign — Anthropic-Style Editorial Tasarım

**Tarih:** 2026-07-04
**Durum:** Kullanıcı onaylı tasarım (görsel kararlar visual companion ile doğrulandı)
**Kapsam:** Tam görsel dönüşüm + agresif içerik sadeleştirme. Hibrit uygulama: `style.css` sıfırdan, `index.html` yeniden yapılandırılır, `script.js` davranışları korunarak güncellenir.

## 1. Hedef

Mevcut neon/glassmorphism/efekt-yoğun tasarımı, anthropic.com'dan ilham alan sakin, editoryal, okunabilirlik odaklı bir tasarımla değiştirmek. Statik hosting, framework'süz vanilla stack, üç dilli i18n ve erişilebilirlik davranışları aynen korunur.

## 2. Tasarım Sistemi

### Renk paleti

| Token | Açık tema | Koyu tema |
|---|---|---|
| `--bg` | `#faf9f5` (krem) | `#1f1e1b` (sıcak antrasit) |
| `--text` | `#191919` | `#f0efe9` |
| `--text-secondary` | `#555550` | `#b5b3a7` |
| `--accent` (buton/vurgu) | `#d97757` (terracotta) | `#d97757` |
| `--accent-text` (link/metin vurgusu) | `#b0552f` (erişilebilir kontrast) | `#e08d6d` |
| `--surface` (kart) | `#ffffff` | `#262521` |
| `--border` | `#e8e6dd` | `#3a3833` |

- Glassmorphism, gradyan arkaplanlar, neon glow, `pulse-glow` tamamen kaldırılır.
- Butonlar ve kartlar 8px köşe yarıçapı (hap/pill şekli yok — kullanıcı tercihi).
- `meta[name="theme-color"]` iki temanın `--bg` değerleriyle senkronize edilir (`script.js` mevcut mekanizması).
- Metin vurgu renkleri WCAG AA kontrastını sağlamalı; `#d97757` yalnızca büyük yüzeylerde (buton zemini) kullanılır.

### Tipografi

- Başlıklar: **Source Serif 4** (Google Fonts), `--font-display` CSS değişkeni üzerinden tanımlanır — ileride lisanslı Tiempos'a tek satırla takas edilebilir olmalı.
- Gövde: **Inter** (mevcut).
- **Outfit** fontu ve Google Fonts isteğinden kaldırılır.
- Emoji'li başlıklar (🚀 🔥 🛠 🤝 📫) kaldırılır; başlıklar sade metin.

## 3. Sayfa Yapısı (index.html)

Yeni bölüm sırası (tek scroll):

1. **Navbar** — logo metni **"İsmail ÇELİK"** (`./ismail` yerine). Linkler, dil seçici, tema anahtarı, Ctrl+K tetikleyicisi, mobil menü aynen kalır.
2. **Hero** — eyebrow + serif başlık + 2-3 cümle bio + 2 CTA ("Projeleri Gör" terracotta dolu, "İletişim" çerçeveli) + CV indirme linkleri (sade metin linki, EN/TR). Fotoğraf küçük ve efektsiz; yıldırım animasyonu ve `expertise-tags` kaldırılır. **WebGL shader kalır** (bkz. §5).
3. **Updates** — posts.json'dan sade zaman çizelgesi/liste (tarih solda, içerik sağda). Karusel görünümü kalkar. "Load more" ve detay modalı davranışı korunur. LinkedIn CTA sade metin linkine döner.
4. **Seçili İşler** — öne çıkan 5 proje, 2 sütunlu sade beyaz/koyu kart ızgarası (kullanıcı seçimi: kart ızgarası). Durum nokta+renk, teknolojiler küçük gri metin, linkler sade. Öne çıkanlar: Gemini RAG Knowledge Assistant, Factory RAG Assistant, Netelsan Cloud, Netelsan Hırsız Alarm Sistemi, PCB Anomaly Detection. Kalan 7 proje tek satırlık kompakt liste (ad — teknolojiler — varsa link).
5. **Sertifikalar** — kompakt liste + mevcut "tümünü gör" modalı (focus trap korunur).
6. **Beceriler** — GIF ve ikon ızgaraları tamamen kalkar; gruplu düz metin (Mobile / Backend / AI & Data / Cloud & DevOps / Diğer). skillicons.dev, simpleicons ve GitHub GIF bağımlılıkları tamamen kaldırılır; footer sosyal linkleri sade metin linki olduğu için ikon gerektirmez (gerekirse Lucide kullanılır — zaten yüklü).
7. **Hakkımda** — 3 bio kartı yerine 2-3 paragraf düz yazı (mevcut kart içerikleri tek anlatıya birleştirilir).
8. **İletişim / Footer** — "Birlikte çalışalım" başlığı; Email, LinkedIn, GitHub sade metin linkleri. `status: optimized` rozeti ve "From Neural Data to Pixel Perfection" mottosu kaldırılır. Telif satırı kalır.

### Kaldırılan bölümler

- Hugging Face Trending (`#huggingface`) — tamamı.
- "What I'm Working On" 6'lı kart ızgarası, work-feature paneli, work-roadmap.
- İki tech-stack ızgarası (`#tech`, `#tech-expanding`) — GIF'ler ve skillicons dahil.
- "Collaborative Strategy" + terminal animasyonu (`#perspective`) — tamamı.
- Hero scroll göstergesi (fare animasyonu) — kaldırılır.

## 4. Davranış (script.js)

**Korunur:** i18n motoru ve `data-i18n`/`data-i18n-with-icon` mekanizması, tema anahtarı + localStorage, komut paleti (aç/kapa, klavye araması, focus dönüşü), sertifika modalı + focus trap, updates renderer + load-more + detay modalı, mobil menü + scroll kilidi, `posts.json` fail-soft yükleme.

**Değişir:**
- Silinen bölümlere ait kod ve komut paleti kayıtları kaldırılır (HF, tech grid, perspective; yıldırım efekti kodu).
- Updates renderer yeni zaman çizelgesi markup'ını üretir (shape kontrolleri ve güvenli render korunur).
- Yeni/değişen tüm UI metinleri **üç dilde** (en/tr/fr) sözlüklere eklenir; silinen bölümlerin anahtarları temizlenir.
- Sertifika veri seti aynen kalır; yalnızca render markup'ı sadeleşir.

## 5. WebGL Hero (kullanıcı kararı: kalıyor)

- Fragment shader renkleri yeni palete uyarlanır: zeminle aynı ton ailesinde, düşük kontrastlı, yavaş akan sıcak doku (krem üzerinde kum/terracotta; antrasit üzerinde koyu sıcak tonlar). Metinle yarışmaz.
- Tema değişince shader paleti de değişir (mevcut tema-shader senkron mekanizması varsa korunur, yoksa uniform ile bağlanır).
- `prefers-reduced-motion` ve WebGL2 yoksa: statik `--bg` fallback (mevcut fallback davranışı korunur).

## 6. Dokümantasyon Güncellemeleri (kullanıcı isteği)

Uygulama sırasında repo'daki .md dosyaları yeni duruma uyarlanır:
- **AGENTS.md** — tasarım dili tanımı (glassmorphism/gradyan referansları → editoryal sistem), kaldırılan bölümler/CDN'ler (skillicons GIF'leri), font listesi, bölüm envanteri güncellenir.
- **CLAUDE.md** — tech stack/CDN listesi ve test kontrol listesi yeni bölümlere göre güncellenir (HF/tech-grid referansları çıkar, updates zaman çizelgesi girer).
- **README.md** — varsa tasarım/özellik anlatımı yeni tasarıma göre düzeltilir.

## 7. Hata Yönetimi

- `posts.json` yüklenemezse kullanıcı-dostu fallback mesajı (mevcut davranış, yeni stille).
- Shader başlatılamazsa sessizce statik zemine düşer; konsola yalnızca geliştirme amaçlı log.

## 8. Test

Otomatik test yok; CLAUDE.md manuel kontrol listesi uygulanır:
- Tema (koyu ↔ açık) ve `theme-color` senkronu; dil (en/tr/fr) — silinen anahtarlar dahil üç dilde eksiksizlik.
- Hero animasyonu + reduced-motion + WebGL'siz fallback.
- Komut paleti: aç/kapa, arama, komut çalıştırma (silinen bölümler listede olmamalı).
- Sertifika modalı: focus trap, overlay kapatma. Updates: zaman çizelgesi, load-more, detay modalı.
- Mobil menü + scroll kilidi; mobil/masaüstü responsive düzen.
- Dış linklerde `rel="noopener noreferrer"` korunmuş olmalı.

## 9. Kapsam Dışı

- CV PDF üretimi (`scripts/generate_cv_pdfs.py`) ve `posts.json` şeması değişmez.
- Yeni framework, bundler, analytics, backend yok. Yeni CDN yok (Google Fonts'a Source Serif 4 eklenmesi mevcut kalıbın içinde; skillicons/GIF kaynakları azalır).
