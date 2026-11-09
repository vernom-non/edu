# Little Genius – Thế giới khám phá của em (EduExplore Cloud Production 24/7)

Nền tảng giáo dục tiểu học trực quan, tương tác đa giác quan và tư duy liên môn dành cho học sinh tiểu học (**Lớp 1 – Lớp 5**, đặc biệt tối ưu cho lộ trình **bé gái từ 8 tuổi trở lên / Lớp 3+**), được thiết kế để vận hành **24/7 trên hạ tầng Cloudflare (Workers + Static Assets + D1 + R2 + KV + Cron Triggers)**.

---

## 1. Triết lý Giáo dục & Kiến trúc Sư phạm

Little Genius vận hành theo chu trình khám phá 7 bước:

$$\text{QUAN SÁT} \rightarrow \text{TƯƠNG TÁC} \rightarrow \text{SUY LUẬN} \rightarrow \text{THỬ NGHIỆM} \rightarrow \text{HIỂU BẢN CHẤT} \rightarrow \text{VẬN DỤNG} \rightarrow \text{SÁNG TẠO}$$

- **8 Môn học Độc lập (`SUBJECTS_META`):**
  1. **Toán Tư Duy & Ứng Dụng (`math`)** – 3 chủ đề, 9 bài học, 4 phòng thí nghiệm mô phỏng 2D.
  2. **Tiếng Việt & Ngôn Ngữ Sáng Tạo (`vietnamese`)** – 2 chủ đề, 6 bài học, xưởng ghép câu & kể chuyện.
  3. **Tiếng Anh Giao Tiếp & Từ Vựng (`english`)** – 2 chủ đề, 6 bài học, hội thoại tình huống & phát âm chuẩn.
  4. **Khoa Học Tự Nhiên & Thí Nghiệm (`science`)** – 2 chủ đề, 6 bài học, mô phỏng vòng tuần hoàn nước & sinh học.
  5. **Lịch Sử, Địa Lý & Văn Hóa Việt Nam (`history_geo`)** – 2 chủ đề, 6 bài học, bản đồ di sản 3 miền & ứng xử văn minh.
  6. **Tư Duy Logic, Lập Trình & AI Cơ Bản (`logic_cs`)** – 2 chủ đề, 6 bài học, phân loại dữ liệu huấn luyện AI công bằng.
  7. **Nghệ Thuật, Âm Nhạc & Thiết Kế (`art_music`)** – 2 chủ đề, 6 bài học, vẽ đối xứng trục & pha màu quang học.
  8. **Kỹ Năng Sống, Tài Chính Nhí & An Toàn Số (`life_finance`)** – 1 chủ đề, 3 bài học, quản lý ngân sách 3 hũ thông minh.
- **Đấu trường 36 Dạng Bài tập Tương tác (`src/engine/exerciseBankEngine.ts`):** Bao phủ 6 nhóm nhận thức (Quan sát, Thao tác trực tiếp, Tư duy logic, Ngôn ngữ, Thí nghiệm mô phỏng, Sáng tạo mở) + **Bộ sinh biến thể có kiểm soát (6 chế độ tư duy phép nhân)**.
- **Cỗ máy Tò mò (`src/components/curiosity/CuriosityEngineView.tsx`):** 10 câu hỏi khám phá thế giới theo quy trình 7 bước + Mô phỏng 2D Kỹ sư Cầu đường (Kiểm thử tải trọng Cầu Dầm Phẳng vs. Cầu Giàn Tam Giác vs. Cầu Vòm).
- **5 Dự án Sáng tạo Liên môn (`src/components/projects/CreativeProjectsView.tsx`):** *Khu vườn của em*, *Cửa hàng bánh*, *Thành phố tương lai*, *Nhà thám hiểm vũ trụ*, *Nhà phát minh nhí*.

---

## 2. Kiến trúc Cloudflare Production 24/7

```text
Client Devices (Desktop / Tablet / Mobile PWA)
  │
  ▼
Cloudflare Global CDN + Static Assets (./dist, Offline Service Worker)
  │
  ▼
Cloudflare Workers (worker/index.ts — Web-standard Fetch & Scheduled Handler)
  ├── /api/health                 (Kiểm tra trạng thái hệ thống, phiên bản & kết nối D1)
  ├── /api/curriculum             (Phân phối chương trình học + KV Cache tốc độ cao)
  ├── /api/exercises/variant      (Sinh biến thể câu hỏi Toán học có kiểm soát)
  ├── /api/evaluate               (Chấm bài xác định + Socratic Tutor + Lưu D1 Idempotent)
  ├── /api/sync                   (Đồng bộ đa thiết bị + Giải quyết xung đột Offline-to-Online)
  ├── /api/auth/verify-turnstile  (Xác thực chống bot Cloudflare Turnstile)
  └── /api/parent/data            (Phụ huynh xuất JSON hoặc yêu cầu xóa dữ liệu của con)
```

| Dịch vụ Cloudflare | Vai trò trong Little Genius | Cấu hình trong `wrangler.jsonc` |
| :--- | :--- | :--- |
| **Cloudflare Workers** | Xử lý API, chấm bài xác định, kiểm tra bảo mật IDOR/XSS/Rate-limit | `main: "worker/index.ts"` |
| **Workers Static Assets** | Phân phối giao diện React 19 + Vite qua CDN toàn cầu kèm SPA Fallback | `assets.directory: "./dist"` |
| **Cloudflare D1 (SQLite)** | Cơ sở dữ liệu quan hệ chính (24 bảng chuẩn hóa, lưu tiến độ & bài làm) | Binding: `DB` (`migrations/0001` & `0002`) |
| **Cloudflare R2** | Lưu trữ media bài học và sản phẩm sáng tạo riêng tư của trẻ | Binding: `MEDIA_BUCKET` |
| **Cloudflare KV** | Cache cấu hình và danh mục chương trình học (`eventually consistent`) | Binding: `CONFIG_KV` |
| **Cron Triggers** | Chạy lúc `03:00 UTC` hằng ngày để dọn phiên hết hạn & tổng hợp thống kê | `crons: ["0 3 * * *"]` |

---

## 3. Cấu trúc Thư mục Dự án

```text
little-genius-eduexplore/
├── wrangler.jsonc                                 # Cấu hình Cloudflare Workers, D1, R2, KV, Cron (Dev/Staging/Prod)
├── migrations/
│   ├── 0001_little_genius_schema.sql              # 24 bảng D1 SQLite (Parents, Students, Curriculum, Variants, Audit...)
│   └── 0002_seed_ecosystem.sql                    # Dữ liệu khởi tạo 8 môn, 16 chủ đề, 36 mẫu bài tập & kỹ năng
├── worker/
│   ├── index.ts                                   # Cloudflare Worker API & Cron Scheduled Handler
│   └── security.ts                                # Bảo mật: CSP, Rate Limit, XSS Sanitizer, IDOR Guard, Backoff
├── .github/workflows/
│   └── cloudflare-ci-cd.yml                       # Pipeline GitHub Actions (Test -> D1 Verify -> Staging/Prod Deploy)
├── public/
│   ├── manifest.webmanifest                       # Cấu hình cài đặt ứng dụng PWA
│   └── sw.js                                      # Service Worker hỗ trợ học Offline khi mất mạng
└── src/
    ├── App.tsx                                    # Giao diện chính (Pastel Theme, Bạn đồng hành, Sổ tay nhà khoa học)
    ├── types/education.ts                         # Định nghĩa kiểu dữ liệu toàn hệ thống
    ├── data/
    │   ├── curriculumData.ts                      # 8 môn học, 16 chủ đề (48 bài học), 12 bài học mô phỏng sâu
    │   └── curiosityData.ts                       # 10 hành trình Cỗ máy Tò mò 7 bước
    ├── engine/
    │   ├── learningEngine.ts                      # Bộ chấm điểm xác định cho 12 mô phỏng & cá nhân hóa lộ trình
    │   ├── exerciseBankEngine.ts                  # Động cơ 36 dạng bài tập & Bộ sinh biến thể phép nhân 6 chế độ
    │   ├── socraticTutor.ts                       # Trợ giảng Socratic 6 tầng gợi mở + Bảo vệ PII trẻ em
    │   ├── learningEngine.test.ts                 # Kiểm thử thuật toán chấm điểm & Socratic Tutor
    │   ├── appRenderAndFlow.test.ts               # Kiểm thử SSR & luồng tương tác
    │   └── cloudflareAndEcosystem.test.ts         # Kiểm thử Worker Security, 36 bài tập, Offline Sync & 8 môn học
    ├── components/
    │   ├── simulations/InteractiveSimulations.tsx # 12 Phòng thí nghiệm mô phỏng 2D tương tác trực tiếp
    │   ├── classroom/InteractiveClassroom.tsx     # Phòng học 3 cột + Chế độ Tập trung
    │   ├── exercises/ExerciseBankArena.tsx        # Đấu trường 36 Dạng Bài tập + Biến thể Toán học
    │   ├── curiosity/CuriosityEngineView.tsx      # Cỗ máy Tò mò + Mô phỏng 2D Kỹ sư Cầu đường
    │   ├── projects/CreativeProjectsView.tsx      # 5 Dự án Sáng tạo Liên môn
    │   ├── studio/CreativeStudio.tsx              # Xưởng sáng tạo (Coding, Logic, Builder, Story, What-If)
    │   └── dashboards/RoleDashboards.tsx          # Tiến trình, Huy hiệu lành mạnh, Phụ huynh (Export/Delete), Giáo viên, Admin
    └── utils/
        ├── offlineSync.ts                         # Hàng đợi Offline & Thuật toán giải quyết xung đột đa thiết bị
        └── speechAndAudio.ts                      # Giọng đọc tiếng Việt (vi-VN), phát âm tiếng Anh & âm thanh
```

---

## 4. Hướng dẫn Chạy Local & Kiểm thử Tự động

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy máy chủ phát triển (Vite + Local API Middleware)
npm run dev

# 3. Kiểm tra 19 bài kiểm thử tự động (Unit, Security, Variant Generator, Offline Sync, SSR)
npm test

# 4. Kiểm tra tính toàn vẹn của Database Migration & Seed trên SQLite/D1
npm run d1:verify

# 5. Đóng gói bản Production và kiểm tra đóng gói Cloudflare Worker (Dry-run)
npm run build
npm run cf:dry-run
```

---

## 5. Hướng dẫn Triển khai Thực tế lên Cloudflare (24/7 Production)

### Bước 1: Đăng nhập Cloudflare & Khởi tạo Tài nguyên
```bash
# Đăng nhập tài khoản Cloudflare
npx wrangler login

# Tạo cơ sở dữ liệu D1 cho Staging và Production
npx wrangler d1 create little-genius-db-staging
npx wrangler d1 create little-genius-db-prod

# Tạo KV Namespace cho cấu hình & cache
npx wrangler kv namespace create CONFIG_KV
npx wrangler kv namespace create CONFIG_KV --env staging
npx wrangler kv namespace create CONFIG_KV --env production

# Tạo R2 Bucket lưu trữ media & sản phẩm sáng tạo của bé
npx wrangler r2 bucket create little-genius-media-staging
npx wrangler r2 bucket create little-genius-media-prod
```
> Sau khi chạy các lệnh trên, cập nhật `database_id` của D1 và `id` của KV vào tệp `wrangler.jsonc`.

### Bước 2: Chạy Migration & Seed Dữ liệu trên Cloudflare D1
```bash
# Áp dụng schema 24 bảng và dữ liệu khởi tạo lên môi trường Production
npx wrangler d1 execute little-genius-db-prod --remote --file=./migrations/0001_little_genius_schema.sql --env production
npx wrangler d1 execute little-genius-db-prod --remote --file=./migrations/0002_seed_ecosystem.sql --env production
```

### Bước 3: Thiết lập Khóa Bí mật (Secrets)
```bash
# Thiết lập khóa bí mật Turnstile (và AI_API_KEY nếu dùng AI thật)
npx wrangler secret put TURNSTILE_SECRET_KEY --env production
```

### Bước 4: Triển khai & Rollback Khẩn cấp
```bash
# Build giao diện tĩnh và triển khai lên Staging
npm run build
npm run cf:deploy:staging

# Triển khai chính thức lên Production 24/7
npm run build
npm run cf:deploy:production

# Rollback tức thì về phiên bản ổn định trước đó nếu phát hiện sự cố
npm run cf:rollback
```
