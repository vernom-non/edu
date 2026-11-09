// ============================================================================
// Little Genius (EduExplore) – Dữ liệu Hệ Sinh Thái 8 Lĩnh Vực Môn Học,
// 16 Chủ Đề (48 Bài Học trong Bản Đồ Kiến Thức) & 12 Phòng Thí Nghiệm Tương Tác
// Tách biệt hoàn toàn dữ liệu học liệu khỏi mã nguồn giao diện React
// ============================================================================

import type {
  CurriculumTopicNode,
  GradeMeta,
  Lesson,
  SubjectMeta,
} from '../types/education.ts';

export const GRADES_META: GradeMeta[] = [
  {
    id: 1,
    name: 'Lớp 1',
    ageRange: '6 – 7 tuổi',
    tagline: 'Làm quen con số, âm vần và thế giới quanh em qua thao tác chạm – kéo trực quan.',
    focusSkills: [
      'Phép cộng, trừ trong phạm vi 10 qua vật thật',
      'Nhận diện âm vần, ghép từ gắn với hình ảnh',
      'Quan sát cây cối, vật nuôi và thời tiết',
    ],
  },
  {
    id: 2,
    name: 'Lớp 2',
    ageRange: '7 – 8 tuổi',
    tagline: 'Đo lường thời gian, dựng câu kể chuyện và khám phá môi trường sống.',
    focusSkills: [
      'Xem đồng hồ kim (giờ đúng, giờ hơn 15, giờ rưỡi)',
      'Đặt câu Ai làm gì? Ở đâu? từ bức tranh',
      'Tìm hiểu cơ thể người và an toàn giao thông',
    ],
  },
  {
    id: 3,
    name: 'Lớp 3 (Trọng tâm 8+ tuổi)',
    ageRange: '8 – 9 tuổi',
    tagline: 'Khởi đầu hành trình Little Genius: Phân số, Thí nghiệm cây xanh, AI nhí, Nghệ thuật & Tài chính.',
    focusSkills: [
      'Chia phần bằng nhau & phân số tương đương (1/2, 1/3, 1/4)',
      'Thí nghiệm ánh sáng – nước, pha màu Pastel & đối xứng',
      'Giao tiếp tiếng Anh tình huống & quản lý ngân sách thông thái',
    ],
  },
  {
    id: 4,
    name: 'Lớp 4 (Mở rộng 9–10 tuổi)',
    ageRange: '9 – 10 tuổi',
    tagline: 'Thí nghiệm khoa học tự nhiên, bản đồ Việt Nam – Thế giới, lập trình và suy luận nhiều bước.',
    focusSkills: [
      'Mô phỏng vòng tuần hoàn của nước và kết cấu cầu chịu lực',
      'Bản đồ địa lý 3 miền Bắc – Trung – Nam & thế giới',
      'Huấn luyện AI phân loại dữ liệu & an toàn thông tin số',
    ],
  },
  {
    id: 5,
    name: 'Lớp 5 (Nâng cao 10–11 tuổi)',
    ageRange: '10 – 11 tuổi',
    tagline: 'Hình học tối ưu, dự án liên môn, thiết kế thành phố tương lai và tư duy sáng tạo.',
    focusSkills: [
      'Bản chất Chu vi và Diện tích hình học qua lưới đơn vị',
      'Tối ưu hóa bài toán thực tế (cùng chu vi khác diện tích)',
      'Thiết kế dự án sáng tạo liên môn và thuyết trình ý tưởng',
    ],
  },
];

export const SUBJECTS_META: SubjectMeta[] = [
  {
    id: 'math',
    code: 'TOAN',
    name: 'Toán học và Tư duy số',
    labTitle: 'Phòng thí nghiệm Toán học & Mô hình số',
    description:
      'Kéo thả vật thể, chia bánh phân số, xoay kim đồng hồ và co giãn hình học để tự nhìn thấy vì sao công thức đúng.',
    accentColor: 'text-amber-700',
    bgSoft: 'bg-amber-50/90',
    borderSoft: 'border-amber-200',
    badgeText: 'bg-amber-100 text-amber-900',
    relatedSubjects: ['science', 'logic_lifeskills_finance', 'tech_ai_coding'],
  },
  {
    id: 'science',
    code: 'KHOA_HOC',
    name: 'Khoa học và Thí nghiệm',
    labTitle: 'Phòng thí nghiệm Khoa học Tự nhiên Ảo',
    description:
      'Đặt giả thuyết, điều chỉnh nhiệt độ Mặt Trời, sức gió, ánh sáng và lượng nước để quan sát quy luật tự nhiên.',
    accentColor: 'text-emerald-700',
    bgSoft: 'bg-emerald-50/90',
    borderSoft: 'border-emerald-200',
    badgeText: 'bg-emerald-100 text-emerald-900',
    relatedSubjects: ['math', 'history_geo_civics_it', 'tech_ai_coding'],
  },
  {
    id: 'vietnamese',
    code: 'TIENG_VIET',
    name: 'Tiếng Việt và Đọc hiểu',
    labTitle: 'Xưởng Ngôn ngữ, Đọc hiểu & Sáng tác',
    description:
      'Quan sát tranh sinh động, kéo thả từ ngữ dựng câu, tìm bằng chứng trong bài đọc và sáng tạo kết thúc truyện.',
    accentColor: 'text-rose-700',
    bgSoft: 'bg-rose-50/90',
    borderSoft: 'border-rose-200',
    badgeText: 'bg-rose-100 text-rose-900',
    relatedSubjects: ['english', 'art_music_design', 'history_geo_civics_it'],
  },
  {
    id: 'english',
    code: 'TIENG_ANH',
    name: 'Tiếng Anh và Giao tiếp',
    labTitle: 'Không gian Tiếng Anh Tình huống',
    description:
      'Chạm vào đồ vật nghe phát âm chuẩn, tìm vật theo ngữ cảnh và hoàn thành hội thoại giao tiếp tự nhiên.',
    accentColor: 'text-sky-700',
    bgSoft: 'bg-sky-50/90',
    borderSoft: 'border-sky-200',
    badgeText: 'bg-sky-100 text-sky-900',
    relatedSubjects: ['vietnamese', 'art_music_design'],
  },
  {
    id: 'history_geo_civics_it',
    code: 'LS_DL_THE_GIOI',
    name: 'Lịch sử, Địa lý và Thế giới',
    labTitle: 'Trạm Khám phá Việt Nam & Địa cầu',
    description:
      'Tương tác trên bản đồ Việt Nam, dòng chảy lịch sử, khám phá các châu lục và bảo vệ môi trường sống.',
    accentColor: 'text-indigo-700',
    bgSoft: 'bg-indigo-50/90',
    borderSoft: 'border-indigo-200',
    badgeText: 'bg-indigo-100 text-indigo-900',
    relatedSubjects: ['science', 'vietnamese', 'logic_lifeskills_finance'],
  },
  {
    id: 'tech_ai_coding',
    code: 'CONG_NGHE_AI',
    name: 'Công nghệ, AI và Lập trình',
    labTitle: 'Phòng Lab Robot, Thuật toán & AI Nhí',
    description:
      'Lập trình khối lệnh, gỡ lỗi thuật toán, khám phá cách AI học nhận diện dữ liệu và bảo vệ an toàn số.',
    accentColor: 'text-violet-700',
    bgSoft: 'bg-violet-50/90',
    borderSoft: 'border-violet-200',
    badgeText: 'bg-violet-100 text-violet-900',
    relatedSubjects: ['math', 'science', 'logic_lifeskills_finance'],
  },
  {
    id: 'art_music_design',
    code: 'NGHE_THUAT',
    name: 'Nghệ thuật, Âm nhạc và Thiết kế',
    labTitle: 'Studio Màu sắc Pastel, Nhịp điệu & Thiết kế',
    description:
      'Pha trộn màu sắc, sáng tạo họa tiết đối xứng, khám phá nhịp phách âm nhạc và thiết kế không gian thẩm mỹ.',
    accentColor: 'text-pink-700',
    bgSoft: 'bg-pink-50/90',
    borderSoft: 'border-pink-200',
    badgeText: 'bg-pink-100 text-pink-900',
    relatedSubjects: ['math', 'vietnamese', 'science'],
  },
  {
    id: 'logic_lifeskills_finance',
    code: 'LOGIC_TAI_CHINH',
    name: 'Logic, Kỹ năng sống và Tài chính cơ bản',
    labTitle: 'Học viện Tư duy Logic & Tài chính Thông thái',
    description:
      'Giải bài toán suy luận nhiều bước, phân biệt Cần vs Muốn, lập kế hoạch tiết kiệm và xử lý tình huống đời sống.',
    accentColor: 'text-teal-700',
    bgSoft: 'bg-teal-50/90',
    borderSoft: 'border-teal-200',
    badgeText: 'bg-teal-100 text-teal-900',
    relatedSubjects: ['math', 'tech_ai_coding', 'vietnamese'],
  },
];

// ============================================================================
// BẢN ĐỒ CHƯƠNG TRÌNH 8 MÔN × 2 CHỦ ĐỀ × 3 BÀI HỌC = 48 BÀI HỌC CHUYÊN SÂU
// Bắt đầu từ trọng tâm Lớp 3 (8+ tuổi) và mở rộng linh hoạt theo năng lực
// ============================================================================
export const CURRICULUM_TOPICS_MAP: CurriculumTopicNode[] = [
  // 1. TOÁN HỌC VÀ TƯ DUY SỐ
  {
    id: 'topic-math-1',
    subjectId: 'math',
    title: 'Chủ đề 1: Số học Trực quan, Phép nhân & Phân số Tương đương',
    minAge: 8,
    gradeBand: 'Lớp 1 – Lớp 3 (8+ tuổi)',
    summary: 'Hiểu bản chất tách – gộp, phép nhân qua mảng và phân số bằng nhau qua diện tích.',
    lessons: [
      {
        id: 'map-math-1-1',
        title: 'Bài 1: Tách – Gộp nhóm đối tượng và quy luật phép cộng',
        grade: 1,
        objective: 'Giải thích vì sao đổi chỗ hai nhóm vật thể thì tổng không thay đổi.',
        linkedInteractiveLessonId: 'lesson-g1-math-fruit-addition',
        tiers: {
          basic: 'Gộp 3 quả táo đỏ và 2 quả táo xanh trong giỏ.',
          applied: 'Tìm số táo còn thiếu khi biết tổng bằng 7.',
          reasoning: 'Chứng minh 4 + 3 = 3 + 4 trên thanh mô hình.',
          creative: 'Tìm tất cả các cặp số tự nhiên có tổng bằng 6.',
        },
      },
      {
        id: 'map-math-1-2',
        title: 'Bài 2: Làm quen Phân số qua mô hình chia bánh công bằng',
        grade: 3,
        objective: 'Phân biệt vai trò của Mẫu số (tổng phần bằng nhau) và Tử số (số phần chọn).',
        linkedInteractiveLessonId: 'lesson-g3-math-fraction-cake',
        tiers: {
          basic: 'Chia bánh thành 4 phần bằng nhau và lấy 1 phần (1/4).',
          applied: 'So sánh trực quan vì sao miếng bánh 1/4 nhỏ hơn miếng bánh 1/2.',
          reasoning: 'Giải thích sai lầm khi chia các phần không bằng nhau.',
          creative: 'Thiết kế chiếc bánh 8 phần cho 4 người bạn cùng thưởng thức.',
        },
      },
      {
        id: 'map-math-1-3',
        title: 'Bài 3: Khám phá Phân số tương đương (1/2 = 2/4 = 3/6 = 4/8)',
        grade: 3,
        objective: 'Nhận ra các phân số viết khác nhau nhưng biểu diễn cùng một lượng bánh.',
        linkedInteractiveLessonId: 'lesson-g3-math-fraction-cake',
        tiers: {
          basic: 'Ghép 2 miếng 1/4 để so sánh với 1 miếng 1/2.',
          applied: 'Tìm phân số có mẫu số bằng 6 tương đương với 1/3.',
          reasoning: 'Vì sao nhân cả tử và mẫu với cùng một số thì giá trị phân số không đổi?',
          creative: 'Tạo bộ sưu tập 3 phân số bằng nhau trên đĩa bánh tròn.',
        },
      },
    ],
  },
  {
    id: 'topic-math-2',
    subjectId: 'math',
    title: 'Chủ đề 2: Đo lường Thời gian, Hình học phẳng & Tối ưu Diện tích',
    minAge: 8,
    gradeBand: 'Lớp 2 – Lớp 5 (8–11 tuổi)',
    summary: 'Đọc đồng hồ kim theo hệ cơ số 60, phân biệt Chu vi – Diện tích và giải bài toán tối ưu.',
    lessons: [
      {
        id: 'map-math-2-1',
        title: 'Bài 1: Đồng hồ kim và quy luật bước nhảy 5 phút',
        grade: 2,
        objective: 'Hiểu vì sao kim dài chỉ số 6 lại là 30 phút (6 × 5 = 30).',
        linkedInteractiveLessonId: 'lesson-g2-math-clock-time',
        tiers: {
          basic: 'Đặt đồng hồ chỉ 7 giờ đúng và 7 giờ 30 phút.',
          applied: 'Tính thời gian từ 7 giờ 15 phút đến 7 giờ 45 phút.',
          reasoning: 'Phát hiện lỗi nhầm lẫn giữa kim ngắn (giờ) và kim dài (phút).',
          creative: 'Lập thời gian biểu một ngày cuối tuần cân bằng học tập và vui chơi.',
        },
      },
      {
        id: 'map-math-2-2',
        title: 'Bài 2: Bản chất Chu vi và Diện tích trên lưới ô vuông đơn vị',
        grade: 5,
        objective: 'Phân biệt đường bao quanh (Chu vi) và số ô vuông phủ kín bên trong (Diện tích).',
        linkedInteractiveLessonId: 'lesson-g5-math-geometry-area-perimeter',
        tiers: {
          basic: 'Tạo hình chữ nhật kích thước 4m × 3m để có diện tích 12 m².',
          applied: 'Tìm tất cả các hình chữ nhật có cùng diện tích 12 m².',
          reasoning: 'Phát hiện lỗi lấy công thức chu vi (a+b)×2 để trả lời cho diện tích.',
          creative: 'Thiết kế mảnh vườn hoa có diện tích 16 m² theo nhiều hình dáng.',
        },
      },
      {
        id: 'map-math-2-3',
        title: 'Bài 3: Bài toán Tối ưu – Cùng độ dài hàng rào, hình nào rộng nhất?',
        grade: 5,
        objective: 'Khám phá với cùng Chu vi P = 16m, hình vuông 4×4 cho diện tích lớn nhất.',
        linkedInteractiveLessonId: 'lesson-g5-math-geometry-area-perimeter',
        tiers: {
          basic: 'So sánh diện tích của hình 7×1 (S=7) và hình 6×2 (S=12).',
          applied: 'Thử nghiệm 5×3 (S=15) và 4×4 (S=16) cùng có chu vi 16m.',
          reasoning: 'Rút ra quy luật: Khi hai cạnh càng gần bằng nhau thì diện tích càng lớn.',
          creative: 'Ứng dụng nguyên lý tối ưu vào Dự án Khu vườn của em.',
        },
      },
    ],
  },

  // 2. KHOA HỌC VÀ THÍ NGHIỆM
  {
    id: 'topic-sci-1',
    subjectId: 'science',
    title: 'Chủ đề 1: Nước, Thời tiết & Sự chuyển thể trong Tự nhiên',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 4 (8–10 tuổi)',
    summary: 'Thí nghiệm sự bốc hơi, ngưng tụ, mưa và tìm hiểu vì sao băng nổi trên mặt nước.',
    lessons: [
      {
        id: 'map-sci-1-1',
        title: 'Bài 1: Nhiệt năng Mặt Trời và hiện tượng Bốc hơi (Evaporation)',
        grade: 4,
        objective: 'Quan sát tốc độ bốc hơi thay đổi khi tăng nhiệt độ Mặt Trời.',
        linkedInteractiveLessonId: 'lesson-g4-science-water-cycle',
        tiers: {
          basic: 'Tăng nhiệt độ từ 18°C lên 32°C và quan sát mặt biển.',
          applied: 'Giải thích vì sao quần áo phơi ngày nắng có gió lại nhanh khô.',
          reasoning: 'Phân biệt hơi nước (khí trong suốt) với sương mù/mây.',
          creative: 'Thiết kế thí nghiệm làm muối từ nước biển dưới ánh nắng.',
        },
      },
      {
        id: 'map-sci-1-2',
        title: 'Bài 2: Ngưng tụ thành mây và hiện tượng Mưa rơi (Condensation & Rain)',
        grade: 4,
        objective: 'Hiểu vì sao hơi nước bay lên cao gặp lạnh lại tạo thành mây và mưa.',
        linkedInteractiveLessonId: 'lesson-g4-science-water-cycle',
        tiers: {
          basic: 'Điều chỉnh gió cấp 2–4 đưa hơi nước lên tầng khí quyển lạnh.',
          applied: 'Giải thích các giọt nước đọng bên ngoài cốc nước đá.',
          reasoning: 'Vì sao không phải đám mây nào trên trời cũng gây mưa ngay?',
          creative: 'Vẽ sơ đồ vòng tuần hoàn nước cho Sổ tay Nhà khoa học.',
        },
      },
      {
        id: 'map-sci-1-3',
        title: 'Bài 3: Bảo vệ nguồn nước sạch và hệ sinh thái sông hồ',
        grade: 4,
        objective: 'Vận dụng kiến thức vòng tuần hoàn nước để bảo vệ nguồn nước ngọt.',
        linkedInteractiveLessonId: 'lesson-g4-science-water-cycle',
        tiers: {
          basic: 'Theo dõi dòng chảy từ núi về sông và đại dương.',
          applied: 'Nhận biết tác hại khi nguồn nước sông bị ô nhiễm rác thải nhựa.',
          reasoning: 'Tác động của rừng đầu nguồn đối với nguồn nước ngầm.',
          creative: 'Đề xuất 3 giải pháp tiết kiệm nước sạch tại gia đình.',
        },
      },
    ],
  },
  {
    id: 'topic-sci-2',
    subjectId: 'science',
    title: 'Chủ đề 2: Sinh học Thực vật, Quang hợp & Cân bằng Sinh thái',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Thử nghiệm biến số ánh sáng và độ ẩm đối với sự nảy mầm, quang hợp và ra hoa.',
    lessons: [
      {
        id: 'map-sci-2-1',
        title: 'Bài 1: Ánh sáng Mặt Trời và nhà máy Quang hợp ở lá cây',
        grade: 3,
        objective: 'Thử nghiệm mức ánh sáng để lá cây tổng hợp chất dinh dưỡng xanh tốt.',
        linkedInteractiveLessonId: 'lesson-g3-science-plant-growth',
        tiers: {
          basic: 'Chỉnh ánh sáng từ 20% lên 70% để quan sát màu sắc lá.',
          applied: 'Giải thích vì sao cây đặt trong phòng tối lâu ngày bị vàng lá.',
          reasoning: 'Vai trò của chất diệp lục (Chlorophyll) tạo nên màu xanh của lá.',
          creative: 'Thiết kế góc ban công đón nắng cho chậu cây gia vị.',
        },
      },
      {
        id: 'map-sci-2-2',
        title: 'Bài 2: Độ ẩm đất và sự hô hấp của bộ rễ cây',
        grade: 3,
        objective: 'Khám phá vì sao tưới quá ít nước cây héo, tưới quá nhiều cây ngập úng.',
        linkedInteractiveLessonId: 'lesson-g3-science-plant-growth',
        tiers: {
          basic: 'So sánh cây ở mức nước 20% (khô) và 95% (ngập úng).',
          applied: 'Tìm khoảng độ ẩm cân bằng (45% – 80%) giúp cây nở hoa.',
          reasoning: 'Vì sao rễ cây nằm dưới đất vẫn cần không khí (oxy) để thở?',
          creative: 'Lập nhật ký quan sát hạt đậu nảy mầm trong 7 ngày.',
        },
      },
      {
        id: 'map-sci-2-3',
        title: 'Bài 3: Chuỗi thức ăn và sự gắn kết giữa Thực vật – Động vật',
        grade: 4,
        objective: 'Hiểu vị trí của cây xanh là mắt xích khởi đầu trong chuỗi thức ăn tự nhiên.',
        linkedInteractiveLessonId: 'lesson-g3-science-plant-growth',
        tiers: {
          basic: 'Sắp xếp chuỗi thức ăn: Cỏ xanh → Châu chấu → Chim sâu.',
          applied: 'Dự đoán điều gì xảy ra nếu một mắt xích biến mất.',
          reasoning: 'Vì sao bảo vệ đa dạng sinh học giúp khu vườn khỏe mạnh?',
          creative: 'Thiết kế khu vườn sinh thái thu hút ong và bướm thụ phấn.',
        },
      },
    ],
  },

  // 3. TIẾNG VIỆT VÀ ĐỌC HIỂU
  {
    id: 'topic-vn-1',
    subjectId: 'vietnamese',
    title: 'Chủ đề 1: Từ ngữ Giàu Hình ảnh, Cấu trúc Câu & Miêu tả Sinh động',
    minAge: 8,
    gradeBand: 'Lớp 2 – Lớp 4 (8–10 tuổi)',
    summary: 'Ghép từ thành câu linh hoạt, sử dụng từ chỉ đặc điểm, hoạt động và biện pháp so sánh.',
    lessons: [
      {
        id: 'map-vn-1-1',
        title: 'Bài 1: Dựng câu Ai làm gì? Ở đâu? từ bức tranh thiên nhiên',
        grade: 2,
        objective: 'Ghép các cụm từ thành câu hoàn chỉnh theo nhiều trật tự hợp lý.',
        linkedInteractiveLessonId: 'lesson-g2-vietnamese-story-builder',
        tiers: {
          basic: 'Ghép câu: "Chú mèo vàng đang nằm ngủ dưới gốc cây xanh."',
          applied: 'Đảo trạng ngữ lên đầu câu: "Dưới gốc cây xanh, chú mèo nhỏ nằm sưởi nắng."',
          reasoning: 'Nhận biết câu thiếu chủ ngữ hoặc vị ngữ và cách sửa.',
          creative: 'Viết thêm một câu miêu tả tiếng chim hót trên cành cây.',
        },
      },
      {
        id: 'map-vn-1-2',
        title: 'Bài 2: Mở rộng câu bằng từ ngữ gợi tả âm thanh và màu sắc',
        grade: 3,
        objective: 'Làm câu văn sinh động hơn nhờ từ láy và hình ảnh so sánh.',
        linkedInteractiveLessonId: 'lesson-g2-vietnamese-story-builder',
        tiers: {
          basic: 'Chọn từ gợi tả phù hợp với nắng sớm, tán lá và chú mèo.',
          applied: 'So sánh câu kể giản đơn và câu có hình ảnh miêu tả.',
          reasoning: 'Vì sao từ ngữ giàu hình ảnh giúp người đọc dễ hình dung bức tranh?',
          creative: 'Miêu tả góc học tập hoặc thú cưng yêu thích của em.',
        },
      },
      {
        id: 'map-vn-1-3',
        title: 'Bài 3: Liên kết các câu văn thành đoạn văn ngắn mạch lạc',
        grade: 3,
        objective: 'Sắp xếp trình tự Mở đầu – Diễn biến – Kết thúc cho đoạn văn.',
        linkedInteractiveLessonId: 'lesson-g2-vietnamese-story-builder',
        tiers: {
          basic: 'Sắp xếp 3 câu văn theo đúng trình tự thời gian.',
          applied: 'Chọn câu mở đoạn và câu kết đoạn phù hợp.',
          reasoning: 'Phát hiện từ nối giúp hai câu văn gắn kết tự nhiên.',
          creative: 'Tự sáng tác đoạn kết ấm áp cho câu chuyện chú mèo và chim nhỏ.',
        },
      },
    ],
  },
  {
    id: 'topic-vn-2',
    subjectId: 'vietnamese',
    title: 'Chủ đề 2: Đọc hiểu Tình huống, Tìm Bằng chứng & Kể chuyện Sáng tạo',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Đọc sâu hiểu kỹ, gạch chân chi tiết bằng chứng trong bài đọc và phát triển ý tưởng.',
    lessons: [
      {
        id: 'map-vn-2-1',
        title: 'Bài 1: Tìm bằng chứng trong bài đọc để trả lời câu hỏi Vì sao?',
        grade: 3,
        objective: 'Dẫn chứng chính xác chi tiết trong văn bản thay vì đoán mò.',
        linkedInteractiveLessonId: 'lesson-g2-vietnamese-story-builder',
        tiers: {
          basic: 'Tìm chi tiết cho biết thời tiết trong bức tranh rất dễ chịu.',
          applied: 'Giải thích tâm trạng nhân vật dựa vào hành động trong truyện.',
          reasoning: 'Phân biệt chi tiết có thật trong bài đọc và suy đoán cá nhân.',
          creative: 'Đặt một câu hỏi thú vị cho bạn cùng lớp về câu chuyện.',
        },
      },
      {
        id: 'map-vn-2-2',
        title: 'Bài 2: Đọc hiểu tình huống giao tiếp lịch sự và giàu cảm xúc',
        grade: 4,
        objective: 'Lựa chọn lời nói phù hợp khi nhờ giúp đỡ, cảm ơn và khích lệ bạn bè.',
        linkedInteractiveLessonId: 'lesson-g2-vietnamese-story-builder',
        tiers: {
          basic: 'Hoàn thành lời đối thoại giữa Sóc Nâu và Chim Sơn Ca.',
          applied: 'Chuyển câu cầu khiến thành lời đề nghị nhẹ nhàng, lịch sự.',
          reasoning: 'Vì sao lời nói ấm áp giúp giải quyết hiểu lầm hiệu quả?',
          creative: 'Viết lời nhắn động viên bản thân trong Sổ tay Nhà khoa học.',
        },
      },
      {
        id: 'map-vn-2-3',
        title: 'Bài 3: Sáng tác truyện ngắn từ nhân vật và bối cảnh tự chọn',
        grade: 5,
        objective: 'Xây dựng cốt truyện hoàn chỉnh có thử thách và thông điệp nhân văn.',
        linkedInteractiveLessonId: 'lesson-g2-vietnamese-story-builder',
        tiers: {
          basic: 'Chọn nhân vật, bối cảnh và tình huống thử thách.',
          applied: 'Viết lời giải quyết vấn đề thông minh cho nhân vật chính.',
          reasoning: 'Rút ra bài học ý nghĩa từ hành trình của nhân vật.',
          creative: 'Xuất bản câu chuyện vào Bộ sưu tập sáng tạo của em.',
        },
      },
    ],
  },

  // 4. TIẾNG ANH VÀ GIAO TIẾP
  {
    id: 'topic-en-1',
    subjectId: 'english',
    title: 'Chủ đề 1: Situational Vocabulary – My Study Room & Daily World',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 4 (8–10 tuổi)',
    summary: 'Học từ vựng và giới từ chỉ vị trí (in, on, under) trực tiếp qua đồ vật và phát âm chuẩn.',
    lessons: [
      {
        id: 'map-en-1-1',
        title: 'Bài 1: Objects in My Study Room (Book, Apple, Clock, Backpack)',
        grade: 3,
        objective: 'Nhận diện đồ vật, nghe phát âm chuẩn và nối từ với hình ảnh thực tế.',
        linkedInteractiveLessonId: 'lesson-g3-english-room-explorer',
        tiers: {
          basic: 'Chạm vào Book, Apple, Clock để nghe và lặp lại phát âm.',
          applied: 'Tìm đúng đồ vật theo câu gợi ý tiếng Anh.',
          reasoning: 'Phân biệt danh từ số ít và cách dùng mạo từ a/an/the.',
          creative: 'Mô tả 3 đồ vật trên bàn học của chính con bằng tiếng Anh.',
        },
      },
      {
        id: 'map-en-1-2',
        title: 'Bài 2: Prepositions of Place in Action (ON the desk, UNDER the chair)',
        grade: 3,
        objective: 'Sử dụng chính xác giới từ ON, IN, UNDER trong câu miêu tả vị trí.',
        linkedInteractiveLessonId: 'lesson-g3-english-room-explorer',
        tiers: {
          basic: 'Thực hành mẫu câu "The book is ON the desk."',
          applied: 'Trả lời câu hỏi "Where is the backpack?" → "It is UNDER the chair."',
          reasoning: 'So sánh sự khác nhau giữa ON (tiếp xúc bề mặt) và IN (bên trong).',
          creative: 'Đố vui tìm đồ vật giấu kín trong căn phòng cùng bạn.',
        },
      },
      {
        id: 'map-en-1-3',
        title: 'Bài 3: Colors, Shapes & Describing Favorite Items',
        grade: 4,
        objective: 'Kết hợp tính từ chỉ màu sắc và kích thước trước danh từ tiếng Anh.',
        linkedInteractiveLessonId: 'lesson-g3-english-room-explorer',
        tiers: {
          basic: 'Ghép cụm từ: "red apple", "blue book", "round clock".',
          applied: 'Sắp xếp đúng trật tự: Adjective + Noun trong câu.',
          reasoning: 'Vì sao tiếng Anh đặt tính từ trước danh từ ("red apple" thay vì "apple red")?',
          creative: 'Giới thiệu góc sáng tạo của em bằng 3 câu tiếng Anh.',
        },
      },
    ],
  },
  {
    id: 'topic-en-2',
    subjectId: 'english',
    title: 'Chủ đề 2: Interactive Dialogues, Science English & Storytelling',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Hội thoại tình huống mua sắm, khám phá khoa học bằng tiếng Anh và đọc hiểu truyện.',
    lessons: [
      {
        id: 'map-en-2-1',
        title: 'Bài 1: Polite Conversations – Asking & Sharing at School',
        grade: 3,
        objective: 'Giao tiếp lịch sự với "Can I borrow...?", "Here you are", "Thank you!".',
        linkedInteractiveLessonId: 'lesson-g3-english-room-explorer',
        tiers: {
          basic: 'Nghe và chọn câu trả lời phù hợp trong hội thoại lớp học.',
          applied: 'Hoàn thành đoạn hội thoại mượn sách và bút màu.',
          reasoning: 'Nhận biết ngữ điệu lịch sự khi đặt câu hỏi trong tiếng Anh.',
          creative: 'Đóng vai hội thoại tại Cửa hàng bánh nhí bằng tiếng Anh.',
        },
      },
      {
        id: 'map-en-2-2',
        title: 'Bài 2: Science in English – Sun, Water, Plants & Space',
        grade: 4,
        objective: 'Kết nối thuật ngữ khoa học tiếng Anh (Evaporation, Gravity, Plant) với mô hình.',
        linkedInteractiveLessonId: 'lesson-g3-english-room-explorer',
        tiers: {
          basic: 'Nhận diện các từ Sun, Cloud, Rain, Tree, Flower.',
          applied: 'Đọc câu mô tả ngắn: "Plants need sunlight and water to grow."',
          reasoning: 'Đoán nghĩa từ mới dựa vào ngữ cảnh hình ảnh thí nghiệm.',
          creative: 'Viết nhãn song ngữ Việt – Anh cho sơ đồ cây xanh.',
        },
      },
      {
        id: 'map-en-2-3',
        title: 'Bài 3: Reading Comprehension – The Little Explorer’s Diary',
        grade: 5,
        objective: 'Đọc đoạn nhật ký ngắn bằng tiếng Anh và tìm thông tin chi tiết.',
        linkedInteractiveLessonId: 'lesson-g3-english-room-explorer',
        tiers: {
          basic: 'Đọc đoạn văn ngắn về căn phòng của bạn nhỏ.',
          applied: 'Tìm câu bằng chứng trả lời câu hỏi "What is on the wall?".',
          reasoning: 'Tóm tắt ý chính của đoạn văn bằng sơ đồ tư duy.',
          creative: 'Viết 3–4 câu nhật ký tiếng Anh về khám phá mới hôm nay.',
        },
      },
    ],
  },

  // 5. LỊCH SỬ, ĐỊA LÝ VÀ THẾ GIỚI
  {
    id: 'topic-soc-1',
    subjectId: 'history_geo_civics_it',
    title: 'Chủ đề 1: Bản đồ Việt Nam Tương tác, Địa hình & Di sản Văn hóa',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Khám phá Bắc – Trung – Nam, quần đảo Hoàng Sa & Trường Sa và lịch sử dựng nước.',
    lessons: [
      {
        id: 'map-soc-1-1',
        title: 'Bài 1: Đất nước hình chữ S – Ba miền Bắc, Trung, Nam',
        grade: 4,
        objective: 'Xác định vị trí Thủ đô Hà Nội, Cố đô Huế, TP. Hồ Chí Minh trên bản đồ.',
        linkedInteractiveLessonId: 'lesson-g4-social-vietnam-map-civics',
        tiers: {
          basic: 'Chạm vào từng miền trên bản đồ để xem đặc điểm địa hình.',
          applied: 'Phân biệt đồng bằng châu thổ sông Hồng và sông Cửu Long.',
          reasoning: 'Vì sao khí hậu và cây trồng ở mỗi miền lại có nét đặc trưng riêng?',
          creative: 'Thiết kế hành trình du lịch khám phá 3 di sản Việt Nam.',
        },
      },
      {
        id: 'map-soc-1-2',
        title: 'Bài 2: Chủ quyền Biển đảo Việt Nam – Quần đảo Hoàng Sa và Trường Sa',
        grade: 4,
        objective: 'Nhận thức rõ vị trí và ý nghĩa thiêng liêng của vùng biển đảo Tổ quốc.',
        linkedInteractiveLessonId: 'lesson-g4-social-vietnam-map-civics',
        tiers: {
          basic: 'Xác định vị trí Quần đảo Hoàng Sa và Trường Sa trên Biển Đông.',
          applied: 'Tìm hiểu đời sống và vai trò của ngư dân, chiến sĩ hải đảo.',
          reasoning: 'Vai trò của biển Đông đối với khí hậu và kinh tế Việt Nam.',
          creative: 'Viết bức thư ngắn gửi các chú bộ đội và các bạn nhỏ ngoài đảo xa.',
        },
      },
      {
        id: 'map-soc-1-3',
        title: 'Bài 3: Dòng thời gian Lịch sử & Danh nhân Văn hóa Việt Nam',
        grade: 5,
        objective: 'Sắp xếp các mốc lịch sử tiêu biểu và lòng biết ơn thế hệ đi trước.',
        linkedInteractiveLessonId: 'lesson-g4-social-vietnam-map-civics',
        tiers: {
          basic: 'Tìm hiểu truyền thuyết Đền Hùng và truyền thống dựng nước.',
          applied: 'Gắn các di tích lịch sử với đúng vùng địa lý tương ứng.',
          reasoning: 'Bài học về tinh thần đoàn kết và hiếu học của dân tộc.',
          creative: 'Làm thẻ thông tin giới thiệu một di tích lịch sử ở quê hương em.',
        },
      },
    ],
  },
  {
    id: 'topic-soc-2',
    subjectId: 'history_geo_civics_it',
    title: 'Chủ đề 2: Công dân Toàn cầu, Môi trường Bền vững & Văn hóa Thế giới',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Tìm hiểu các châu lục, đại dương, bảo vệ rừng và ứng xử văn minh.',
    lessons: [
      {
        id: 'map-soc-2-1',
        title: 'Bài 1: Khám phá các Châu lục và Đại dương trên Trái Đất',
        grade: 4,
        objective: 'Định vị Việt Nam trong khu vực Đông Nam Á và châu Á.',
        linkedInteractiveLessonId: 'lesson-g4-social-vietnam-map-civics',
        tiers: {
          basic: 'Nhận biết châu Á, châu Âu, châu Phi, châu Mỹ, châu Đại Dương, châu Nam Cực.',
          applied: 'So sánh khí hậu vùng xích đạo và vùng cực.',
          reasoning: 'Vì sao các múi giờ trên thế giới lại có ngày và đêm lệch nhau?',
          creative: 'Chọn một quốc gia em muốn tìm hiểu và ghi 3 điều thú vị.',
        },
      },
      {
        id: 'map-soc-2-2',
        title: 'Bài 2: Rừng xanh, Biến đổi Khí hậu và Hành động của Em',
        grade: 4,
        objective: 'Hiểu mối liên hệ giữa độ che phủ rừng và việc phòng chống thiên tai.',
        linkedInteractiveLessonId: 'lesson-g4-social-vietnam-map-civics',
        tiers: {
          basic: 'Phân loại rác tái chế, rác hữu cơ và rác còn lại.',
          applied: 'Quan sát tác dụng giữ đất giữ nước của rừng cây đầu nguồn.',
          reasoning: 'Giải thích vì sao tiết kiệm điện và giảm túi nilon giúp bảo vệ Trái Đất.',
          creative: 'Lập kế hoạch "Một tuần sống xanh" cùng gia đình.',
        },
      },
      {
        id: 'map-soc-2-3',
        title: 'Bài 3: Đạo đức & Văn hóa ứng xử nơi công cộng và trên mạng',
        grade: 5,
        objective: 'Thực hành tôn trọng sự khác biệt, trung thực và bảo vệ an toàn cá nhân.',
        linkedInteractiveLessonId: 'lesson-g4-social-vietnam-map-civics',
        tiers: {
          basic: 'Nhận diện hành vi lịch sự, tôn trọng bạn bè.',
          applied: 'Xử lý tình huống khi nhận được tin nhắn lạ trên Internet.',
          reasoning: 'Phân tích hậu quả của việc chia sẻ thông tin chưa kiểm chứng.',
          creative: 'Thiết kế bộ quy tắc 5 điều Công dân số thông thái.',
        },
      },
    ],
  },

  // 6. CÔNG NGHỆ, AI VÀ LẬP TRÌNH
  {
    id: 'topic-tech-1',
    subjectId: 'tech_ai_coding',
    title: 'Chủ đề 1: Tư duy Thuật toán, Lập trình Khối lệnh & Gỡ lỗi (Debugging)',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Xây dựng chuỗi lệnh điều khiển Robot, sử dụng vòng lặp và tìm sửa lỗi trong chương trình.',
    lessons: [
      {
        id: 'map-tech-1-1',
        title: 'Bài 1: Thuật toán là gì? Lập trình chuỗi lệnh đưa Robot vượt mê cung',
        grade: 3,
        objective: 'Hiểu thuật toán là dãy các bước rõ ràng theo thứ tự để giải quyết nhiệm vụ.',
        linkedInteractiveLessonId: 'lesson-g4-tech-ai-coding-lab',
        tiers: {
          basic: 'Sắp xếp các lệnh Tiến, Rẽ phải, Rẽ trái để Robot thu thập sao.',
          applied: 'Tìm đường đi ngắn nhất tránh các chướng ngại vật trên lưới.',
          reasoning: 'Điều gì xảy ra nếu đặt sai thứ tự 2 khối lệnh?',
          creative: 'Tự thiết kế một bản đồ mê cung mới thử thách Robot.',
        },
      },
      {
        id: 'map-tech-1-2',
        title: 'Bài 2: Thám tử Gỡ lỗi (Debugging) – Phát hiện và sửa bước lệnh sai',
        grade: 4,
        objective: 'Rèn kỹ năng đọc hiểu đoạn lệnh có sẵn, tìm đúng vị trí gây lỗi và sửa lại.',
        linkedInteractiveLessonId: 'lesson-g4-tech-ai-coding-lab',
        tiers: {
          basic: 'Chạy thử chuỗi lệnh để xem Robot bị vướng ở ô nào.',
          applied: 'Thay thế khối lệnh sai bằng khối lệnh đúng.',
          reasoning: 'Vì sao lỗi (bug) trong lập trình là cơ hội để học hỏi chứ không đáng sợ?',
          creative: 'Viết hướng dẫn 3 bước kiểm tra chương trình trước khi chạy.',
        },
      },
      {
        id: 'map-tech-1-3',
        title: 'Bài 3: Tối ưu hóa bằng Vòng lặp (Loops) & Điều kiện (If – Else)',
        grade: 5,
        objective: 'Rút gọn chuỗi lệnh lặp lại bằng khối Lặp (Repeat) và câu lệnh điều kiện.',
        linkedInteractiveLessonId: 'lesson-g4-tech-ai-coding-lab',
        tiers: {
          basic: 'Gộp 4 lệnh "Tiến lên" liên tiếp thành "Lặp 4 lần: Tiến lên".',
          applied: 'Sử dụng điều kiện "Nếu gặp đá → Rẽ hướng khác".',
          reasoning: 'So sánh số khối lệnh trước và sau khi dùng vòng lặp.',
          creative: 'Lập trình Robot tự động chăm sóc khu vườn thông minh.',
        },
      },
    ],
  },
  {
    id: 'topic-tech-2',
    subjectId: 'tech_ai_coding',
    title: 'Chủ đề 2: Trí tuệ Nhân tạo (AI) Học Như Thế Nào & Đạo đức Công nghệ',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Thử nghiệm huấn luyện AI phân loại vật thể sạch/rác nhựa và hiểu giới hạn của AI.',
    lessons: [
      {
        id: 'map-tech-2-1',
        title: 'Bài 1: Dạy Robot AI phân biệt Sinh vật biển và Rác thải nhựa',
        grade: 4,
        objective: 'Hiểu AI học từ các ví dụ mẫu (dữ liệu huấn luyện) do con người cung cấp.',
        linkedInteractiveLessonId: 'lesson-g4-tech-ai-coding-lab',
        tiers: {
          basic: 'Cung cấp các mẫu hình Cá, Sao biển, Rùa và Chai nhựa cho AI học.',
          applied: 'Kiểm tra độ chính xác của AI khi phân loại vật thể mới.',
          reasoning: 'Vì sao nếu dữ liệu mẫu bị thiếu hoặc sai thì AI sẽ đoán nhầm?',
          creative: 'Đề xuất ý tưởng dùng AI giúp làm sạch đại dương.',
        },
      },
      {
        id: 'map-tech-2-2',
        title: 'Bài 2: AI có thể nhầm lẫn không? Kiểm chứng thông tin thông minh',
        grade: 4,
        objective: 'Hiểu AI chỉ là công cụ tính toán xác suất, con người cần kiểm tra lại kết quả.',
        linkedInteractiveLessonId: 'lesson-g4-tech-ai-coding-lab',
        tiers: {
          basic: 'Quan sát trường hợp túi nilon trong suốt trông giống con sứa biển.',
          applied: 'Bổ sung thêm đặc điểm nhận dạng để AI phân biệt tốt hơn.',
          reasoning: 'Vì sao không nên tin tuyệt đối hay nhờ AI làm hộ toàn bộ bài tập?',
          creative: 'Viết cẩm nang "Sử dụng AI như người bạn trợ lý thông minh".',
        },
      },
      {
        id: 'map-tech-2-3',
        title: 'Bài 3: Bảo mật Mật khẩu & Quyền riêng tư trong Kỷ nguyên Số',
        grade: 5,
        objective: 'Thiết lập thói quen bảo vệ dữ liệu cá nhân và nhận diện rủi ro trực tuyến.',
        linkedInteractiveLessonId: 'lesson-g4-tech-ai-coding-lab',
        tiers: {
          basic: 'Phân biệt thông tin có thể chia sẻ và thông tin bí mật cá nhân.',
          applied: 'Đánh giá độ mạnh của mật khẩu và nguyên tắc không dùng chung mật khẩu.',
          reasoning: 'Vì sao các nền tảng giáo dục chuẩn mực không thu thập email riêng của trẻ?',
          creative: 'Thiết kế huy hiệu "Hiệp sĩ An toàn Số" cho lớp học.',
        },
      },
    ],
  },

  // 7. NGHỆ THUẬT, ÂM NHẠC VÀ THIẾT KẾ
  {
    id: 'topic-art-1',
    subjectId: 'art_music_design',
    title: 'Chủ đề 1: Pha trộn Màu sắc Pastel, Hòa sắc & Trục Đối xứng Hình học',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Khám phá nguyên lý pha màu cơ bản thành màu thứ cấp, sắc độ Pastel và vẽ đối xứng gương.',
    lessons: [
      {
        id: 'map-art-1-1',
        title: 'Bài 1: Phép màu Pha trộn – Từ 3 màu cơ bản tạo ra thế giới sắc màu Pastel',
        grade: 3,
        objective: 'Tự pha Đỏ + Vàng = Cam, Vàng + Lam = Lục, Đỏ + Lam = Tím và thêm Trắng tạo màu Pastel.',
        linkedInteractiveLessonId: 'lesson-g3-art-color-symmetry-studio',
        tiers: {
          basic: 'Pha trộn 2 màu cơ bản và thêm sắc trắng để tạo màu Pastel dịu mắt.',
          applied: 'Chọn bảng màu hài hòa cho bức tranh khu vườn mùa xuân.',
          reasoning: 'Vì sao màu Pastel có thêm sắc trắng lại tạo cảm giác nhẹ nhàng, dễ tập trung?',
          creative: 'Tạo bảng màu cá nhân mang phong cách riêng của em.',
        },
      },
      {
        id: 'map-art-1-2',
        title: 'Bài 2: Nghệ thuật Đối xứng Gương (Symmetry) trong Tự nhiên & Thiết kế',
        grade: 3,
        objective: 'Vẽ họa tiết trên lưới đối xứng gương để tạo hình cánh bướm, bông tuyết và hoa văn.',
        linkedInteractiveLessonId: 'lesson-g3-art-color-symmetry-studio',
        tiers: {
          basic: 'Tô màu các ô bên trái trục đối xứng và quan sát hình phản chiếu bên phải.',
          applied: 'Hoàn thành họa tiết đối xứng hoàn chỉnh qua trục dọc.',
          reasoning: 'Tìm mối liên hệ giữa trục đối xứng trong Mỹ thuật và Hình học.',
          creative: 'Thiết kế huy hiệu hoặc họa tiết trang trí khăn tay đối xứng.',
        },
      },
      {
        id: 'map-art-1-3',
        title: 'Bài 3: Tỷ lệ, Bố cục & Thiết kế Poster Khoa học – Nghệ thuật',
        grade: 4,
        objective: 'Sắp xếp hình ảnh chính, phụ và khoảng trống hài hòa trong bản thiết kế.',
        linkedInteractiveLessonId: 'lesson-g3-art-color-symmetry-studio',
        tiers: {
          basic: 'Chọn bố cục cân đối cho tấm thiệp hoặc bảng tên dự án.',
          applied: 'Kết hợp màu nền sáng và chữ đậm để dễ đọc (độ tương phản).',
          reasoning: 'Vì sao thiết kế tốt cần hạn chế quá nhiều chi tiết gây rối mắt?',
          creative: 'Thiết kế bìa Sổ tay Nhà khoa học của riêng em.',
        },
      },
    ],
  },
  {
    id: 'topic-art-2',
    subjectId: 'art_music_design',
    title: 'Chủ đề 2: Nhịp điệu Âm nhạc, Toán học trong Giai điệu & Sáng tạo Không gian',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Khám phá mối liên hệ giữa phân số/nhịp phách âm nhạc và thiết kế mô hình 2D.',
    lessons: [
      {
        id: 'map-art-2-1',
        title: 'Bài 1: Nhịp phách Âm nhạc và Phân số (Nhịp 4/4 và độ dài nốt nhạc)',
        grade: 3,
        objective: 'Nhận ra nốt tròn (1), nốt trắng (1/2) và nốt đen (1/4) tuân theo đúng quy luật phân số.',
        linkedInteractiveLessonId: 'lesson-g3-art-color-symmetry-studio',
        tiers: {
          basic: 'Xếp 4 phách nhịp vào một ô nhịp hoàn chỉnh.',
          applied: 'Kết hợp 1 phách dài (1/2) và 2 phách ngắn (1/4 + 1/4).',
          reasoning: 'Vì sao Âm nhạc và Toán học lại gắn bó mật thiết với nhau?',
          creative: 'Sáng tác chuỗi tiết tấu vui tươi gồm 4 phách.',
        },
      },
      {
        id: 'map-art-2-2',
        title: 'Bài 2: Thiết kế Kiến trúc Xanh & Không gian Sống Thân thiện',
        grade: 4,
        objective: 'Kết hợp các khối hình học và màu sắc tự nhiên để thiết kế ngôi nhà mơ ước.',
        linkedInteractiveLessonId: 'lesson-g3-art-color-symmetry-studio',
        tiers: {
          basic: 'Chọn hình khối cho mái nhà, cửa sổ đón nắng và vườn cây.',
          applied: 'Phối màu Pastel mát mẻ cho phòng đọc sách.',
          reasoning: 'Vì sao cửa sổ lớn giúp tiết kiệm điện chiếu sáng ban ngày?',
          creative: 'Lưu bản thiết kế vào dự án Thành phố tương lai.',
        },
      },
      {
        id: 'map-art-2-3',
        title: 'Bài 3: Thuyết trình Ý tưởng Thiết kế & Cảm thụ Nghệ thuật',
        grade: 5,
        objective: 'Trình bày lý do lựa chọn màu sắc, hình khối và công năng của sản phẩm.',
        linkedInteractiveLessonId: 'lesson-g3-art-color-symmetry-studio',
        tiers: {
          basic: 'Đặt tên cho tác phẩm nghệ thuật vừa sáng tạo.',
          applied: 'Nêu 2 điểm em tâm đắc nhất trong bản thiết kế.',
          reasoning: 'Lắng nghe góp ý để cải tiến sản phẩm hoàn thiện hơn.',
          creative: 'Trưng bày tác phẩm trong Bộ sưu tập cá nhân.',
        },
      },
    ],
  },

  // 8. LOGIC, KỸ NĂNG SỐNG VÀ TÀI CHÍNH CƠ BẢN
  {
    id: 'topic-logic-1',
    subjectId: 'logic_lifeskills_finance',
    title: 'Chủ đề 1: Suy luận Logic, Phát hiện Lỗi sai & Giải quyết Vấn đề Nhiều bước',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Tìm quy luật dãy hình/số, cân thăng bằng, bắt lỗi lập luận và so sánh chiến lược.',
    lessons: [
      {
        id: 'map-logic-1-1',
        title: 'Bài 1: Tìm quy luật ẩn giấu & Suy luận từ manh mối',
        grade: 3,
        objective: 'Phân tích mối quan hệ giữa các phần tử để tìm bước tiếp theo chính xác.',
        linkedInteractiveLessonId: 'lesson-g3-finance-smart-budget-lab',
        tiers: {
          basic: 'Tìm số và hình tiếp theo trong dãy có quy luật tăng đều.',
          applied: 'Giải bài toán cân thăng bằng tìm khối lượng vật ẩn.',
          reasoning: 'Giải thích quy luật bằng lời thay vì chỉ đoán mò.',
          creative: 'Tự tạo một dãy quy luật mới đố Trợ giảng và bạn bè.',
        },
      },
      {
        id: 'map-logic-1-2',
        title: 'Bài 2: Thám tử Logic – Phát hiện lỗi sai trong lời giải có sẵn',
        grade: 4,
        objective: 'Đọc phản biện một lời giải toán/khoa học để chỉ ra bước lập luận chưa đúng.',
        linkedInteractiveLessonId: 'lesson-g3-finance-smart-budget-lab',
        tiers: {
          basic: 'Kiểm tra phép tính tiền thừa trong hóa đơn mua hàng.',
          applied: 'Tìm bước nhầm lẫn khi một bạn tính diện tích bằng công thức chu vi.',
          reasoning: 'Vì sao kỹ năng tự kiểm tra lại kết quả là thói quen của nhà khoa học giỏi?',
          creative: 'Sửa lại lời giải sai thành lời giải mẫu rõ ràng.',
        },
      },
      {
        id: 'map-logic-1-3',
        title: 'Bài 3: Lập kế hoạch Giải quyết Vấn đề Thực tế theo Nhiều phương án',
        grade: 5,
        objective: 'So sánh ưu – nhược điểm của các phương án khác nhau trước khi ra quyết định.',
        linkedInteractiveLessonId: 'lesson-g3-finance-smart-budget-lab',
        tiers: {
          basic: 'Liệt kê 2 cách sắp xếp thời gian hoàn thành dự án khoa học.',
          applied: 'So sánh chi phí và độ bền của 2 phương án vật liệu.',
          reasoning: 'Hiểu rằng trong cuộc sống có nhiều giải pháp tốt tùy vào mục tiêu.',
          creative: 'Áp dụng vào Dự án Nhà phát minh nhí.',
        },
      },
    ],
  },
  {
    id: 'topic-logic-2',
    subjectId: 'logic_lifeskills_finance',
    title: 'Chủ đề 2: Tài chính Thông thái – Phân biệt Cần vs Muốn, Ngân sách & Tiết kiệm',
    minAge: 8,
    gradeBand: 'Lớp 3 – Lớp 5 (8–11 tuổi)',
    summary: 'Quản lý ngân sách xu thông minh, ưu tiên nhu cầu thiết yếu, tiết kiệm và sẻ chia.',
    lessons: [
      {
        id: 'map-logic-2-1',
        title: 'Bài 1: Cần thiết (Needs) hay Mong muốn (Wants)? Lập ngân sách 100 xu',
        grade: 3,
        objective: 'Phân biệt vật품 thiết yếu cho học tập/sức khỏe với đồ chơi nhất thời và giữ ngân sách không vượt mức.',
        linkedInteractiveLessonId: 'lesson-g3-finance-smart-budget-lab',
        tiers: {
          basic: 'Phân loại các món đồ vào giỏ CẦN THIẾT và giỏ MONG MUỐN.',
          applied: 'Phân bổ ngân sách 100 xu sao cho đủ đồ dùng học tập và dành ít nhất 20 xu tiết kiệm.',
          reasoning: 'Điều gì xảy ra nếu tiêu hết toàn bộ tiền vào đồ chơi ngay từ đầu?',
          creative: 'Lập kế hoạch sử dụng tiền mừng tuổi hợp lý.',
        },
      },
      {
        id: 'map-logic-2-2',
        title: 'Bài 2: Tính toán Mua bán, Giá trị Đồng tiền & Kiểm tra Tiền thừa',
        grade: 3,
        objective: 'Thực hành cộng trừ tiền tệ chính xác qua các tình huống mua hàng và cửa hàng bánh.',
        linkedInteractiveLessonId: 'lesson-g3-finance-smart-budget-lab',
        tiers: {
          basic: 'Chọn các mệnh giá tiền để trả đúng giá cuốn sách.',
          applied: 'Tính số tiền thừa nhận lại khi đưa tờ mệnh giá lớn hơn.',
          reasoning: 'So sánh giá trị sử dụng lâu dài của một cuốn sách khoa học với món đồ dùng một lần.',
          creative: 'Vận hành Dự án Cửa hàng bánh của em.',
        },
      },
      {
        id: 'map-logic-2-3',
        title: 'Bài 3: Ba chiếc lọ Tài chính Nhí: Chi tiêu thông minh – Tiết kiệm – Sẻ chia',
        grade: 5,
        objective: 'Xây dựng thói quen đặt mục tiêu tiết kiệm dài hạn và biết chia sẻ giúp đỡ cộng đồng.',
        linkedInteractiveLessonId: 'lesson-g3-finance-smart-budget-lab',
        tiers: {
          basic: 'Chia 100 xu vào 3 chiếc lọ: Thiết yếu (60%), Tiết kiệm (25%), Sẻ chia (15%).',
          applied: 'Tính số tuần cần tiết kiệm để mua được bộ kính lúp khoa học.',
          reasoning: 'Vì sao việc lập kế hoạch trước giúp chúng ta tự chủ và tự tin hơn?',
          creative: 'Thiết kế mục tiêu tiết kiệm của riêng em trong tháng này.',
        },
      },
    ],
  },
];

// ============================================================================
// 12 BÀI HỌC TƯƠNG TÁC TRỰC TIẾP (BAO PHỦ ĐẦY ĐỦ CẢ 8 LĨNH VỰC MÔN HỌC)
// ============================================================================
export const INITIAL_LESSONS: Lesson[] = [
  // ==========================================================================
  // 1. TOÁN LỚP 1: PHÉP CỘNG BẰNG KÉO THẢ TRÁI CÂY
  // ==========================================================================
  {
    id: 'lesson-g1-math-fruit-addition',
    slug: 'lop-1-toan-phep-cong-keo-tha-trai-cay',
    grade: 1,
    minAge: 6,
    subjectId: 'math',
    topicTitle: 'Phép cộng trong phạm vi 10 (Gộp hai nhóm đối tượng)',
    title: 'Gộp táo vào giỏ – Vì sao 3 + 2 = 5?',
    subtitle:
      'Tự tay đặt từng quả táo vào hai rổ, gộp chung vào giỏ lớn và khám phá nhiều cách tạo ra cùng một tổng.',
    simulationType: 'math_fruit_addition',
    estimatedMinutes: 12,
    difficulty: 1,
    version: '1.2.0',
    status: 'approved',
    prerequisiteKnowledge: 'Đếm số lượng vật thể từ 1 đến 10.',
    evaluationCriteria: 'Đặt đúng số quả vào 2 nhóm, tính đúng tổng và giải thích được quy tắc đếm tiếp.',
    relatedSubjects: ['science', 'logic_lifeskills_finance'],
    visualSummaryPoints: [
      'Dấu cộng (+) nghĩa là GỘP THÊM hai nhóm vật thể lại với nhau.',
      'Dấu bằng (=) cho biết số lượng ở hai bên là như nhau.',
      'Cùng một tổng (như 6 quả táo) có thể được tạo thành từ nhiều cách gộp khác nhau (1+5, 2+4, 3+3).',
    ],
    scientificFactNote:
      'Tính chất giao hoán và bản chất tập hợp của phép cộng số tự nhiên: |A ∪ B| = |A| + |B| khi hai tập hợp rời nhau.',
    modelSimplificationNote:
      'Mô hình sử dụng các quả táo có kích thước đồng nhất để học sinh tập trung vào số lượng (đếm) thay vì khối lượng.',
    learningOutcomes: [
      {
        id: 'lo-g1-1',
        code: 'TOAN1-CONG-01',
        description: 'Thao tác gộp hai nhóm vật thể và nêu được phép tính cộng tương ứng.',
        stage: 'TUONG_TAC',
      },
      {
        id: 'lo-g1-2',
        code: 'TOAN1-CONG-02',
        description: 'Giải thích được vì sao 3 + 2 = 5 bằng cách đếm tiếp từ 3.',
        stage: 'HIEU_BAN_CHAT',
      },
      {
        id: 'lo-g1-3',
        code: 'TOAN1-CONG-03',
        description: 'Tìm được nhiều cặp số khác nhau có cùng tổng bằng 6.',
        stage: 'SANG_TAO',
      },
    ],
    initialSimulationState: {
      basketA: 1,
      basketB: 1,
      userNumericAnswer: 2,
    },
    tasks: [
      {
        id: 'task-g1-fruit-1',
        title: 'Hoạt động 1: Khám phá phép cộng 3 + 2',
        pedagogyStage: 'TUONG_TAC',
        instruction:
          'Con hãy đặt đúng 3 quả táo đỏ vào Rổ Trái, 2 quả táo xanh vào Rổ Phải, rồi chọn kết quả tổng số táo trong giỏ.',
        question: 'Khi gộp 3 quả táo và 2 quả táo vào chung một giỏ, ta có tất cả bao nhiêu quả táo?',
        targetDescription: 'Rổ Trái = 3, Rổ Phải = 2, Tổng = 5',
        validatorType: 'fruit_sum',
        expectedConfig: {
          targetA: 3,
          targetB: 2,
          targetSum: 5,
          requireSpecificGroups: true,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Gợi mở quan sát',
            questionPrompt:
              'Con nhìn vào Rổ Trái xem đã có đủ 3 quả táo đỏ chưa? Rổ Phải đã có 2 quả táo xanh chưa?',
            visualActionSuggestion: 'Bấm nút "+ Thêm táo" hoặc kéo táo vào từng rổ cho đúng số lượng 3 và 2.',
          },
          {
            level: 2,
            stageLabel: 'Hướng dẫn đếm tiếp',
            questionPrompt:
              'Trong rổ đầu đã có 3 quả rồi. Nếu thêm 1 quả là 4, thêm 1 quả nữa là mấy nhỉ?',
            visualActionSuggestion: 'Chạm vào từng quả táo trên thanh gộp để nghe đếm 1, 2, 3... 4, 5!',
          },
          {
            level: 3,
            stageLabel: 'Từng bước hoàn thành',
            questionPrompt:
              '3 quả táo gộp với 2 quả táo cho ta một hàng gồm 5 quả. Con hãy chọn số 5 ở ô kết quả nhé!',
            visualActionSuggestion: 'Đặt Rổ Trái = 3, Rổ Phải = 2 và chọn đáp án số 5.',
          },
        ],
        coreEssenceExplanation:
          'Phép cộng 3 + 2 = 5 nghĩa là gộp một nhóm 3 vật với một nhóm 2 vật. Thay vì phải đếm lại từ 1, con có thể giữ 3 trong đầu rồi đếm tiếp: 4, 5!',
        whyItWorks:
          'Số lượng vật không tự sinh ra hay mất đi khi ta gộp hai rổ vào một giỏ chung.',
        reflectionChoices: [
          {
            id: 'ref-g1-a',
            text: 'Vì khi có 3 quả táo, thêm 2 quả nữa ta đếm tiếp 4, 5 nên có tất cả 5 quả.',
            isConceptualCorrect: true,
            feedback: 'Đúng bản chất! Con đã hiểu phép cộng chính là gộp thêm và đếm tiếp!',
          },
          {
            id: 'ref-g1-b',
            text: 'Vì con học thuộc lòng trên bảng viết vậy.',
            isConceptualCorrect: false,
            feedback: 'Trong Toán học, mình không cần học vẹt đâu! Chính số quả táo trong giỏ đã chứng minh 3 gộp với 2 là 5 đấy.',
          },
        ],
      },
      {
        id: 'task-g1-fruit-2',
        title: 'Hoạt động 2: Thử nghiệm phép cộng 4 + 3',
        pedagogyStage: 'THU_NGHIEM',
        instruction:
          'Bây giờ con hãy xếp 4 quả táo vào Rổ Trái, 3 quả táo vào Rổ Phải và tìm tổng số táo nhé!',
        question: '4 quả táo thêm 3 quả táo bằng mấy quả táo?',
        targetDescription: 'Rổ Trái = 4, Rổ Phải = 3, Tổng = 7',
        validatorType: 'fruit_sum',
        expectedConfig: {
          targetA: 4,
          targetB: 3,
          targetSum: 7,
          requireSpecificGroups: true,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Gợi mở',
            questionPrompt: 'Con đã điều chỉnh Rổ Trái lên 4 quả và Rổ Phải lên 3 quả chưa?',
            visualActionSuggestion: 'Dùng nút + ở Rổ Trái để có 4 quả và ở Rổ Phải để có 3 quả.',
          },
          {
            level: 2,
            stageLabel: 'Đếm tiếp từ 4',
            questionPrompt: 'Bắt đầu từ 4 quả ở rổ đầu, mình đếm thêm 3 bước nữa: 5, 6, ... rồi đến số mấy?',
            visualActionSuggestion: 'Nhìn vào thanh biểu diễn 7 khối táo phía dưới.',
          },
        ],
        coreEssenceExplanation:
          'Khi gộp 4 và 3, ta đếm tiếp 3 bước từ 4: 5, 6, 7. Vậy 4 + 3 = 7.',
        whyItWorks: 'Gộp 4 đơn vị và 3 đơn vị tạo thành 7 đơn vị.',
        reflectionChoices: [
          {
            id: 'ref-g1-2a',
            text: 'Nếu đổi chỗ thành 3 quả ở Rổ Trái và 4 quả ở Rổ Phải thì tổng vẫn là 7 quả.',
            isConceptualCorrect: true,
            feedback: 'Phát hiện quá thông minh! Đổi chỗ hai rổ thì tổng số táo trong giỏ vẫn không đổi (4 + 3 = 3 + 4 = 7)!',
          },
          {
            id: 'ref-g1-2b',
            text: 'Đổi chỗ hai rổ thì tổng số táo sẽ bị thay đổi.',
            isConceptualCorrect: false,
            feedback: 'Con thử đổi 3 và 4 trên mô hình mà xem, tổng số táo trong giỏ lớn vẫn là 7 quả đấy!',
          },
        ],
      },
      {
        id: 'task-g1-fruit-3',
        title: 'Hoạt động 3 (Tư duy mở): Tự chọn cách tách – gộp được 6 quả táo',
        pedagogyStage: 'SANG_TAO',
        instruction:
          'Mẹ cần tất cả 6 quả táo trong giỏ lớn. Con có thể tự chọn bất kỳ số táo ở Rổ Trái và Rổ Phải miễn sao tổng bằng 6!',
        question: 'Hãy tạo một cách gộp hai rổ bất kỳ để có tổng đúng bằng 6 quả táo.',
        targetDescription: 'Bất kỳ cặp số nào có Tổng = 6 (ví dụ 1+5, 2+4, 3+3, 4+2, 5+1)',
        validatorType: 'fruit_sum',
        expectedConfig: {
          targetA: 3,
          targetB: 3,
          targetSum: 6,
          requireSpecificGroups: false,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Khuyến khích nhiều cách giải',
            questionPrompt:
              'Nếu Rổ Trái con để 2 quả táo, thì cần thêm mấy quả ở Rổ Phải để chạm mốc 6 quả?',
            visualActionSuggestion: 'Con có thể thử 2 + 4, hoặc 3 + 3, hoặc 5 + 1 đều được công nhận đúng!',
          },
        ],
        coreEssenceExplanation:
          'Một số có thể được tách hoặc gộp theo nhiều cách khác nhau: 6 = 1 + 5 = 2 + 4 = 3 + 3 = 4 + 2 = 5 + 1.',
        whyItWorks:
          'Mọi cặp số bù nhau khi gộp lại đều cho cùng một tổng số lượng.',
        reflectionChoices: [
          {
            id: 'ref-g1-3a',
            text: 'Có nhiều cặp số khác nhau (như 2 + 4 hoặc 3 + 3) đều cho kết quả bằng 6.',
            isConceptualCorrect: true,
            feedback: 'Xuất sắc! Trong Toán học luôn có nhiều con đường dẫn tới kết quả đúng!',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 2. TOÁN LỚP 2: ĐỒNG HỒ TƯƠNG TÁC HỌC CÁCH XEM GIỜ
  // ==========================================================================
  {
    id: 'lesson-g2-math-clock-time',
    slug: 'lop-2-toan-dong-ho-tuong-tac-xem-gio',
    grade: 2,
    minAge: 7,
    subjectId: 'math',
    topicTitle: 'Đo lường thời gian – Xem đồng hồ kim (Giờ đúng, Giờ hơn 15, Giờ rưỡi)',
    title: 'Chiếc đồng hồ kỳ diệu – Vì sao số 6 lại là 30 phút?',
    subtitle:
      'Kéo kim giờ và kim phút, quan sát các vạch 5 phút trên mặt đồng hồ để hiểu bản chất cách đọc giờ.',
    simulationType: 'math_clock_time',
    estimatedMinutes: 15,
    difficulty: 1,
    version: '1.1.0',
    status: 'approved',
    prerequisiteKnowledge: 'Đếm thêm 5 (5, 10, 15, 20... đến 60).',
    evaluationCriteria: 'Phân biệt đúng kim ngắn (giờ) và kim dài (phút), đặt chính xác mốc giờ.',
    relatedSubjects: ['science', 'logic_lifeskills_finance'],
    visualSummaryPoints: [
      'Kim NGẮN chỉ GIỜ (đi chậm), kim DÀI chỉ PHÚT (đi nhanh).',
      'Mỗi khoảng cách giữa 2 số liền nhau trên đồng hồ bằng 5 phút.',
      'Khi kim dài chỉ số 6, tức là đã đi được 6 × 5 = 30 phút (hay còn gọi là "giờ rưỡi").',
    ],
    scientificFactNote:
      'Hệ đếm cơ số 60 cho phút và giây bắt nguồn từ thiên văn học cổ đại; 1 vòng kim phút = 60 phút = 1 giờ.',
    modelSimplificationNote:
      'Mô hình làm nổi bật vòng số phút (05, 10, 15... 55) bên ngoài vòng số giờ (1..12) để học sinh thấy rõ mối liên hệ nhân 5.',
    learningOutcomes: [
      {
        id: 'lo-g2-1',
        code: 'TOAN2-GIO-01',
        description: 'Phân biệt chính xác vai trò của kim ngắn (giờ) và kim dài (phút).',
        stage: 'QUAN_SAT',
      },
      {
        id: 'lo-g2-2',
        code: 'TOAN2-GIO-02',
        description: 'Đặt và đọc được giờ đúng, giờ hơn 15 phút và giờ rưỡi (30 phút).',
        stage: 'TUONG_TAC',
      },
    ],
    initialSimulationState: {
      hour: 7,
      minute: 0,
      dayPeriod: 'morning',
    },
    tasks: [
      {
        id: 'task-g2-clock-1',
        title: 'Hoạt động 1: Đặt đồng hồ 7 giờ 30 phút sáng (7 giờ rưỡi)',
        pedagogyStage: 'TUONG_TAC',
        instruction:
          'Buổi học bắt đầu lúc 7 giờ 30 phút sáng. Con hãy xoay kim giờ về 7 và kim phút về vị trí 30 phút nhé!',
        question: 'Để đồng hồ chỉ 7 giờ 30 phút, kim ngắn và kim dài phải chỉ vào đâu?',
        targetDescription: '7 giờ 30 phút (Kim giờ = 7, Kim phút = 30 / số 6)',
        validatorType: 'clock_time',
        expectedConfig: {
          targetHour: 7,
          targetMinute: 30,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Gợi mở phân biệt hai kim',
            questionPrompt:
              'Kim ngắn chỉ giờ cần ở số 7. Còn 30 phút thì kim dài phải đi được mấy phần của vòng tròn?',
            visualActionSuggestion: 'Thử đếm theo vòng ngoài: số 1 là 5 phút, số 2 là 10 phút... số mấy là 30 phút?',
          },
          {
            level: 2,
            stageLabel: 'Đếm bước 5 phút',
            questionPrompt:
              'Mỗi số cách nhau 5 phút: 5, 10, 15, 20, 25, 30! Vậy 30 phút ứng với số 6 ở đáy đồng hồ.',
            visualActionSuggestion: 'Chọn Giờ = 7 và Phút = 30 trên bảng điều khiển hoặc bấm trực tiếp vào mặt đồng hồ.',
          },
        ],
        coreEssenceExplanation:
          'Một vòng đồng hồ có 12 số chia đều cho 60 phút. Mỗi số ứng với 5 phút. Vì 6 × 5 = 30 và 30 phút bằng đúng một nửa vòng tròn (1/2 giờ), nên người ta còn gọi 7 giờ 30 phút là "7 giờ rưỡi".',
        whyItWorks: '60 phút chia làm 12 khoảng bằng nhau thì mỗi khoảng là 5 phút.',
        reflectionChoices: [
          {
            id: 'ref-g2-1a',
            text: 'Vì từ số 12 đến số 6 có 6 khoảng, mỗi khoảng 5 phút nên 6 × 5 = 30 phút (nửa giờ).',
            isConceptualCorrect: true,
            feedback: 'Chuẩn xác! Con đã hiểu vì sao số 6 trên đồng hồ lại biểu thị 30 phút!',
          },
          {
            id: 'ref-g2-1b',
            text: 'Số 6 nghĩa là 6 phút.',
            isConceptualCorrect: false,
            feedback: 'Số 6 là con số dành cho kim giờ. Với kim phút, mỗi số lớn gấp 5 phút nên số 6 là 30 phút nhé!',
          },
        ],
      },
      {
        id: 'task-g2-clock-2',
        title: 'Hoạt động 2: Giờ ra chơi – 9 giờ 15 phút',
        pedagogyStage: 'THU_NGHIEM',
        instruction:
          'Chuông báo giờ tập thể dục giữa giờ lúc 9 giờ 15 phút. Con hãy chỉnh đồng hồ đến 9 giờ 15 phút nhé!',
        question: 'Ở thời điểm 9 giờ 15 phút, kim dài chỉ vào con số mấy trên mặt đồng hồ?',
        targetDescription: '9 giờ 15 phút (Kim giờ = 9, Kim phút = 15 / số 3)',
        validatorType: 'clock_time',
        expectedConfig: {
          targetHour: 9,
          targetMinute: 15,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Gợi mở đếm 5',
            questionPrompt: 'Từ số 12 (0 phút), con đếm thêm 5, 10, 15 thì dừng ở số mấy?',
            visualActionSuggestion: 'Nhìn vào số 3 bên phải mặt đồng hồ (3 × 5 = 15 phút).',
          },
        ],
        coreEssenceExplanation:
          'Khi kim phút chỉ vào số 3, nó đã đi được 3 khoảng 5 phút: 3 × 5 = 15 phút (bằng 1/4 vòng đồng hồ).',
        whyItWorks: '3 khoảng × 5 phút/khoảng = 15 phút.',
        reflectionChoices: [
          {
            id: 'ref-g2-2a',
            text: 'Kim dài chỉ vào số 3 vì 3 khoảng 5 phút bằng 15 phút.',
            isConceptualCorrect: true,
            feedback: 'Tuyệt vời! Con không bao giờ bị nhầm giữa số giờ và số phút nữa rồi!',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 3. TOÁN LỚP 3 (8+ TUỔI): HỌC PHÂN SỐ BẰNG MÔ HÌNH CHIA BÁNH
  // ==========================================================================
  {
    id: 'lesson-g3-math-fraction-cake',
    slug: 'lop-3-toan-hoc-phan-so-bang-mo-hinh-chia-banh',
    grade: 3,
    minAge: 8,
    subjectId: 'math',
    topicTitle: 'Làm quen với Phân số & Khám phá Phân số tương đương (1/2, 1/3, 1/4)',
    title: 'Chia bánh công bằng – Khám phá 1/2, 1/4 và vì sao 2/4 = 1/2',
    subtitle:
      'Tự tay cắt chiếc bánh pizza thành các phần bằng nhau, tô màu phần được chọn và so sánh trực quan các phân số.',
    simulationType: 'math_fraction_cake',
    estimatedMinutes: 15,
    difficulty: 2,
    version: '1.3.0',
    status: 'approved',
    prerequisiteKnowledge: 'Phép chia thành các phần bằng nhau.',
    evaluationCriteria: 'Biểu diễn đúng tử số, mẫu số và tạo được phân số tương đương.',
    relatedSubjects: ['art_music_design', 'science'],
    visualSummaryPoints: [
      'MẪU SỐ (số ở dưới) cho biết cả chiếc bánh được chia thành bao nhiêu phần BẰNG NHAU.',
      'TỬ SỐ (số ở trên) cho biết số phần bánh mà ta lấy hoặc tô màu.',
      'Nếu chia nhỏ chiếc bánh gấp đôi và cũng lấy số phần gấp đôi (như 2/4 so với 1/2), lượng bánh thực tế là BẰNG NHAU.',
    ],
    scientificFactNote:
      'Phân số a/b (với b > 0) biểu diễn tỷ lệ diện tích hình quạt tròn: góc ở tâm θ = (a/b) × 360°.',
    modelSimplificationNote:
      'Chiếc bánh được mô hình hóa bằng hình tròn phẳng chia các góc bằng nhau tuyệt đối để dễ so sánh diện tích.',
    learningOutcomes: [
      {
        id: 'lo-g3-1',
        code: 'TOAN3-PS-01',
        description: 'Biểu diễn được các phân số đơn giản 1/2, 1/3, 1/4 bằng thao tác chia và chọn phần.',
        stage: 'TUONG_TAC',
      },
      {
        id: 'lo-g3-2',
        code: 'TOAN3-PS-02',
        description: 'Nhận biết và giải thích được phân số tương đương (2/4 = 1/2, 2/6 = 1/3) qua diện tích bánh.',
        stage: 'HIEU_BAN_CHAT',
      },
    ],
    initialSimulationState: {
      totalSlices: 4,
      shadedSlices: 1,
    },
    tasks: [
      {
        id: 'task-g3-frac-1',
        title: 'Hoạt động 1: Chia chiếc bánh để lấy đúng 1/4',
        pedagogyStage: 'TUONG_TAC',
        instruction:
          'Có 4 bạn nhỏ cùng chia đều một chiếc bánh. Con hãy chia bánh thành 4 phần bằng nhau và chọn 1 phần cho bạn Bắp nhé!',
        question: 'Hãy biểu diễn phân số 1/4 trên chiếc bánh.',
        targetDescription: 'Chia 4 phần bằng nhau (Mẫu số = 4), chọn 1 phần (Tử số = 1)',
        validatorType: 'fraction_value',
        expectedConfig: {
          numerator: 1,
          denominator: 4,
          requireExactDenominator: true,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Hiểu Mẫu số và Tử số',
            questionPrompt:
              'Trong phân số 1/4, số 4 ở dưới (mẫu số) cho biết chiếc bánh cần được cắt thành mấy phần bằng nhau?',
            visualActionSuggestion: 'Chọn tổng số phần cắt = 4, rồi bấm vào miếng bánh để chỉ tô màu đúng 1 miếng.',
          },
        ],
        coreEssenceExplanation:
          'Phân số 1/4 gồm Mẫu số 4 (cả chiếc bánh chia làm 4 phần bằng nhau) và Tử số 1 (lấy ra 1 phần trong số đó).',
        whyItWorks: 'Khi chia càng nhiều phần bằng nhau, mỗi miếng bánh riêng lẻ sẽ càng nhỏ đi (1/4 nhỏ hơn 1/2).',
        reflectionChoices: [
          {
            id: 'ref-g3-1a',
            text: 'Miếng bánh 1/4 nhỏ hơn miếng bánh 1/2 vì cùng 1 chiếc bánh mà chia cho 4 người thì mỗi phần phải nhỏ hơn chia cho 2 người.',
            isConceptualCorrect: true,
            feedback: 'Rất sâu sắc! Nhiều bạn hay nhầm 4 lớn hơn 2 nên tưởng 1/4 lớn hơn 1/2, nhưng con đã nhìn thấy rõ trên chiếc bánh!',
          },
          {
            id: 'ref-g3-1b',
            text: '1/4 lớn hơn 1/2 vì số 4 lớn hơn số 2.',
            isConceptualCorrect: false,
            feedback: 'Con nhìn chiếc bánh so sánh bên cạnh nhé: Chia làm 4 phần thì mỗi miếng chỉ bằng một nửa của miếng 1/2 thôi!',
          },
        ],
      },
      {
        id: 'task-g3-frac-2',
        title: 'Hoạt động 2 (Khám phá bản chất): Ghép phần để tạo phân số bằng 1/2',
        pedagogyStage: 'SUY_LUAN',
        instruction:
          'Thử thách thú vị: Con có thể chia bánh thành 2 phần, 4 phần, 6 phần hoặc 8 phần tùy ý, miễn sao phần bánh được tô màu bằng đúng một nửa chiếc bánh (tương đương 1/2)!',
        question: 'Hãy tạo một phân số bất kỳ có lượng bánh bằng đúng 1/2 chiếc bánh (ví dụ 1/2, 2/4, 3/6 hoặc 4/8).',
        targetDescription: 'Bất kỳ phân số nào tương đương 1/2 (1/2, 2/4, 3/6, 4/8)',
        validatorType: 'fraction_value',
        expectedConfig: {
          numerator: 1,
          denominator: 2,
          requireExactDenominator: false,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'So sánh diện tích trực quan',
            questionPrompt:
              'Nếu con cắt chiếc bánh thành 4 phần bằng nhau, con cần tô màu mấy phần để che kín đúng nửa hình tròn?',
            visualActionSuggestion: 'Thử cắt 4 phần và tô màu 2 phần (2/4), hoặc cắt 6 phần và tô màu 3 phần (3/6)!',
          },
        ],
        coreEssenceExplanation:
          'Các phân số 1/2, 2/4, 3/6, 4/8 tuy viết bằng các con số khác nhau nhưng đều biểu diễn CÙNG MỘT LƯỢNG BÁNH (nửa chiếc bánh). Ta gọi đó là các phân số bằng nhau (phân số tương đương).',
        whyItWorks:
          'Khi ta chia nhỏ mỗi miếng bánh đi k lần và cũng lấy số miếng gấp k lần, diện tích bánh không thay đổi.',
        reflectionChoices: [
          {
            id: 'ref-g3-2a',
            text: 'Ăn 2 phần của chiếc bánh chia 4 (2/4) cũng no bằng ăn 1 phần của chiếc bánh chia 2 (1/2).',
            isConceptualCorrect: true,
            feedback: 'Chính xác tuyệt đối! Đó chính là ý nghĩa thực tế của phân số bằng nhau!',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 4. KHOA HỌC LỚP 4: MÔ PHỎNG VÒNG TUẦN HOÀN CỦA NƯỚC
  // ==========================================================================
  {
    id: 'lesson-g4-science-water-cycle',
    slug: 'lop-4-khoa-hoc-mo-phong-vong-tuan-hoan-cua-nuoc',
    grade: 4,
    minAge: 8,
    subjectId: 'science',
    topicTitle: 'Nước và các hiện tượng tự nhiên – Vòng tuần hoàn của nước',
    title: 'Vì sao trời mưa mà nước biển không bao giờ cạn?',
    subtitle:
      'Điều chỉnh nhiệt độ Mặt Trời và sức gió để quan sát sự chuyển thể của nước: Bốc hơi → Ngưng tụ thành mây → Mưa → Chảy về biển.',
    simulationType: 'science_water_cycle',
    estimatedMinutes: 15,
    difficulty: 2,
    version: '1.2.0',
    status: 'approved',
    prerequisiteKnowledge: 'Nhận biết nước ở thể lỏng, hơi nước và mây mưa.',
    evaluationCriteria: 'Thiết lập đủ điều kiện nhiệt độ và gió để kích hoạt đủ 3 giai đoạn chu trình nước.',
    relatedSubjects: ['history_geo_civics_it', 'math'],
    visualSummaryPoints: [
      'BỐC HƠI (Evaporation): Mặt Trời chiếu nắng làm nước ở sông, hồ, biển nóng lên và biến thành hơi nước bay lên cao.',
      'NGƯNG TỤ (Condensation): Lên cao gặp không khí lạnh, hơi nước biến thành vô số hạt nước nhỏ li ti tụ lại thành đám mây.',
      'MƯA (Precipitation): Khi các hạt nước trong mây tụ lại quá nặng, chúng rơi xuống đất tạo thành mưa, thấm xuống đất và chảy ra sông biển.',
    ],
    scientificFactNote:
      'Kiến thức khoa học thực tế: Nước không tự nhiên mất đi mà tuần hoàn liên tục nhờ năng lượng bức xạ Mặt Trời và trọng lực Trái Đất. Hơi nước trong không khí thực chất là chất khí trong suốt không nhìn thấy bằng mắt thường; đám mây trắng ta nhìn thấy là các giọt nước lỏng hoặc tinh thể băng cực nhỏ đã ngưng tụ.',
    modelSimplificationNote:
      'Lưu ý mô hình đơn giản hóa: Trong mô phỏng này, các mũi tên và hạt hơi nước bay lên được vẽ màu xanh nhạt để học sinh dễ quan sát đường đi của hơi nước (trong thực tế hơi nước hoàn toàn trong suốt). Thời gian quá trình cũng được tua nhanh từ nhiều ngày xuống vài giây.',
    learningOutcomes: [
      {
        id: 'lo-g4-1',
        code: 'KH4-NUOC-01',
        description: 'Thực nghiệm thay đổi nhiệt độ Mặt Trời và gió để kích hoạt 3 giai đoạn Bốc hơi, Ngưng tụ, Mưa.',
        stage: 'THU_NGHIEM',
      },
      {
        id: 'lo-g4-2',
        code: 'KH4-NUOC-02',
        description: 'Phân biệt được hơi nước (thể khí) và mây/mưa (các giọt nước lỏng/rắn ngưng tụ).',
        stage: 'HIEU_BAN_CHAT',
      },
    ],
    initialSimulationState: {
      sunTempC: 18,
      windLevel: 1,
      cloudAltitude: 2500,
      observedProcesses: [],
    },
    tasks: [
      {
        id: 'task-g4-water-1',
        title: 'Thí nghiệm: Kích hoạt trọn vẹn Vòng tuần hoàn của nước',
        pedagogyStage: 'THU_NGHIEM',
        instruction:
          'Con hãy tăng nhiệt độ Mặt Trời lên ít nhất 28°C, tăng sức gió lên mức 2 trở lên, và bấm quan sát đủ 3 hiện tượng: Bốc hơi → Ngưng tụ → Mưa nhé!',
        question: 'Điều gì xảy ra khi Mặt Trời chiếu nắng ấm áp và gió đưa hơi nước lên tầng không khí lạnh trên cao?',
        targetDescription: 'Nhiệt độ Mặt Trời >= 28°C, Sức gió >= 2, kích hoạt đủ Bốc hơi + Ngưng tụ + Mưa',
        validatorType: 'water_cycle_state',
        expectedConfig: {
          minSunTempC: 28,
          minWindLevel: 2,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Quan sát nhiệt độ',
            questionPrompt:
              'Khi trời lạnh (dưới 20°C), nước biển bốc hơi rất ít. Con hãy kéo thanh Nhiệt độ Mặt Trời lên 30°C – 35°C xem mặt biển có hiện tượng gì nhé!',
            visualActionSuggestion: 'Kéo thanh Nhiệt độ Mặt Trời sang phải (>= 28°C) và Sức gió >= 2.',
          },
          {
            level: 2,
            stageLabel: 'Quan sát ngưng tụ trên cao',
            questionPrompt:
              'Khi hơi nước đã bay lên cao gặp lạnh, con hãy bấm vào các giai đoạn Bốc hơi → Ngưng tụ → Mưa trên mô phỏng để theo dõi toàn bộ chu trình!',
            visualActionSuggestion: 'Đảm bảo cả 3 bước Bốc hơi, Ngưng tụ và Mưa đều đã sáng đèn đã quan sát.',
          },
        ],
        coreEssenceExplanation:
          'Nhờ nhiệt lượng của Mặt Trời, nước lỏng bốc hơi thành khí bay lên cao. Càng lên cao nhiệt độ càng giảm làm hơi nước ngưng tụ thành các hạt nước nhỏ tạo mây. Khi hạt nước đủ lớn và nặng, trọng lực kéo chúng rơi xuống thành mưa, chảy về sông biển và bắt đầu vòng tuần hoàn mới.',
        whyItWorks:
          'Sự chuyển thể Lỏng ↔ Khí do thay đổi nhiệt độ kết hợp với trọng lực giữ lượng nước trên Trái Đất tuần hoàn khép kín.',
        reflectionChoices: [
          {
            id: 'ref-g4-1a',
            text: 'Nước biển không cạn vì nước bốc hơi lên tạo mây, mưa xuống đất rồi lại theo sông suối chảy về biển.',
            isConceptualCorrect: true,
            feedback: 'Chính xác! Đó chính là vòng tuần hoàn khép kín kỳ diệu của thiên nhiên!',
          },
          {
            id: 'ref-g4-1b',
            text: 'Mây là khói bay từ mặt biển lên.',
            isConceptualCorrect: false,
            feedback: 'Không phải khói đâu nhé! Mây được tạo thành từ vô số hạt nước lỏng nhỏ li ti (hoặc tinh thể băng) do hơi nước gặp lạnh ngưng tụ lại đấy!',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 5. TOÁN LỚP 5: GIẢI BÀI TOÁN CHU VI & DIỆN TÍCH BẰNG THAY ĐỔI KÍCH THƯỚC HÌNH
  // ==========================================================================
  {
    id: 'lesson-g5-math-geometry-area-perimeter',
    slug: 'lop-5-toan-chu-vi-va-dien-tich-hinh-hoc-tuong-tac',
    grade: 5,
    minAge: 8,
    subjectId: 'math',
    topicTitle: 'Hình học phẳng & Đo lường – Chu vi và Diện tích hình chữ nhật, hình vuông',
    title: 'Kéo giãn mảnh vườn – Phân biệt tận gốc Chu vi và Diện tích',
    subtitle:
      'Kéo thay đổi chiều dài và chiều rộng trên lưới ô vuông để tự khám phá vì sao hai hình có cùng chu vi nhưng diện tích lại khác nhau!',
    simulationType: 'math_geometry_area',
    estimatedMinutes: 18,
    difficulty: 3,
    version: '1.4.0',
    status: 'approved',
    prerequisiteKnowledge: 'Bảng nhân và khái niệm hình chữ nhật, hình vuông.',
    evaluationCriteria: 'Thiết kế đúng diện tích yêu cầu và tìm được hình có diện tích cực đại khi cố định chu vi.',
    relatedSubjects: ['art_music_design', 'science'],
    visualSummaryPoints: [
      'CHU VI (P) là tổng độ dài đường viền bao quanh bên ngoài hình: P = (dài + rộng) × 2.',
      'DIỆN TÍCH (S) là tổng số ô vuông đơn vị phủ kín bên trong bề mặt hình: S = dài × rộng.',
      'Hai hình chữ nhật có CÙNG CHU VI (cùng độ dài hàng rào) có thể có DIỆN TÍCH RẤT KHÁC NHAU! Khi hình càng gần hình vuông thì diện tích càng lớn.',
    ],
    scientificFactNote:
      'Bất đẳng thức Cô-si (AM-GM) trong hình học sơ cấp: Với chu vi P = 2(a+b) cố định, diện tích S = a×b đạt giá trị lớn nhất khi a = b (hình vuông).',
    modelSimplificationNote:
      'Mỗi ô lưới đại diện cho 1 mét vuông (1 m²) và mỗi cạnh ô lưới dài 1 mét (1 m) để học sinh đếm trực tiếp đối chiếu với công thức.',
    learningOutcomes: [
      {
        id: 'lo-g5-1',
        code: 'TOAN5-HH-01',
        description: 'Giải thích được công thức S = a × b thông qua số hàng và số cột ô vuông đơn vị.',
        stage: 'HIEU_BAN_CHAT',
      },
      {
        id: 'lo-g5-2',
        code: 'TOAN5-HH-02',
        description: 'Thiết kế được nhiều hình có cùng diện tích hoặc cùng chu vi và tối ưu hóa diện tích.',
        stage: 'VAN_DUNG',
      },
    ],
    initialSimulationState: {
      widthUnits: 4,
      heightUnits: 2,
    },
    tasks: [
      {
        id: 'task-g5-geo-1',
        title: 'Hoạt động 1: Thiết kế bồn hoa có Diện tích đúng bằng 12 m²',
        pedagogyStage: 'TUONG_TAC',
        instruction:
          'Nhà trường cần làm một bồn hoa hình chữ nhật có diện tích đúng bằng 12 ô vuông (12 m²). Con hãy kéo chiều dài và chiều rộng để đạt diện tích 12 m² nhé!',
        question: 'Hãy thay đổi kích thước hình chữ nhật để có Diện tích S = 12 ô vuông (con có thể chọn 4×3, 3×4, 6×2 hoặc 2×6).',
        targetDescription: 'Diện tích S = 12 (ví dụ: 4×3, 3×4, 6×2, 2×6)',
        validatorType: 'geometry_rect',
        expectedConfig: {
          targetArea: 12,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Liên hệ phép nhân với lưới ô vuông',
            questionPrompt:
              'Diện tích là tổng số ô vuông bên trong. Nếu mỗi hàng có 4 ô vuông, thì cần mấy hàng để có đủ 12 ô vuông?',
            visualActionSuggestion: 'Thử kéo Chiều dài = 4 và Chiều rộng = 3 (hoặc 6 và 2) rồi đếm số ô vuông bên trong.',
          },
        ],
        coreEssenceExplanation:
          'Thay vì phải đếm từng ô vuông 1, 2, 3... đến 12, ta thấy có b hàng, mỗi hàng có a ô vuông nên tổng số ô vuông là a × b. Đó là lý do Diện tích hình chữ nhật = Chiều dài × Chiều rộng!',
        whyItWorks: 'Phép nhân chính là phép cộng lặp lại số ô vuông trên mỗi hàng.',
        reflectionChoices: [
          {
            id: 'ref-g5-1a',
            text: 'Vì hình được xếp bởi các hàng ô vuông bằng nhau, lấy số ô mỗi hàng nhân với số hàng sẽ ra tổng số ô vuông phủ kín hình.',
            isConceptualCorrect: true,
            feedback: 'Tuyệt vời! Con đã hiểu tận gốc vì sao diện tích lại là Dài × Rộng!',
          },
          {
            id: 'ref-g5-1b',
            text: 'Diện tích là độ dài hàng rào bao quanh hình.',
            isConceptualCorrect: false,
            feedback: 'Độ dài hàng rào bao quanh là CHU VI, còn số ô vuông phủ kín bề mặt bên trong mới là DIỆN TÍCH nhé!',
          },
        ],
      },
      {
        id: 'task-g5-geo-2',
        title: 'Hoạt động 2 (Bài toán Tối ưu thực tế): Có 16m hàng rào, làm sao rào được mảnh vườn rộng nhất?',
        pedagogyStage: 'VAN_DUNG',
        instruction:
          'Bác nông dân có đúng 16 m hàng rào (Chu vi P = 16 m). Con hãy thử các hình có Chu vi = 16 m (như 7×1, 6×2, 5×3, 4×4) và dừng lại ở hình cho DIỆN TÍCH LỚN NHẤT nhé!',
        question: 'Với Chu vi cố định P = 16 m, kích thước nào cho Diện tích lớn nhất (S = 16 m²)?',
        targetDescription: 'Chu vi P = 16 và Diện tích đạt cực đại S = 16 (Hình vuông 4 × 4)',
        validatorType: 'geometry_rect',
        expectedConfig: {
          targetPerimeter: 16,
          targetArea: 16,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'So sánh các phương án cùng chu vi 16',
            questionPrompt:
              'Để Chu vi = 16 thì (Dài + Rộng) phải bằng 8. Con hãy thử trên mô phỏng: 7×1 có diện tích 7; 6×2 có diện tích 12; 5×3 có diện tích 15. Còn nếu Dài = 4, Rộng = 4 thì sao?',
            visualActionSuggestion: 'Chỉnh Chiều dài = 4 và Chiều rộng = 4 để kiểm tra chu vi và diện tích!',
          },
        ],
        coreEssenceExplanation:
          'Cùng chu vi 16 m: hình 7×1 chỉ có diện tích 7 m², hình 6×2 có diện tích 12 m², hình 5×3 có diện tích 15 m², còn hình vuông 4×4 đạt diện tích lớn nhất là 16 m²!',
        whyItWorks:
          'Khi tổng hai cạnh không đổi (a + b = 8), tích của chúng (a × b) lớn nhất khi hai cạnh bằng nhau (a = b = 4).',
        reflectionChoices: [
          {
            id: 'ref-g5-2a',
            text: 'Hai hình có cùng chu vi chưa chắc đã có cùng diện tích; khi chiều dài và chiều rộng bằng nhau (hình vuông) thì diện tích lớn nhất.',
            isConceptualCorrect: true,
            feedback: 'Tư duy toán học xuất sắc! Đây là nguyên lý tối ưu được ứng dụng rất nhiều trong kiến trúc và đời sống!',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 6. TIẾNG VIỆT: DỰNG CÂU & ĐỌC HIỂU BẰNG HÌNH ẢNH
  // ==========================================================================
  {
    id: 'lesson-g2-vietnamese-story-builder',
    slug: 'lop-2-tieng-viet-dung-cau-ke-chuyen-qua-tranh',
    grade: 3,
    minAge: 8,
    subjectId: 'vietnamese',
    topicTitle: 'Từ và Câu – Quan sát tranh, ghép từ dựng câu và sáng tạo kết thúc truyện',
    title: 'Bức tranh kể chuyện: Chú mèo nhỏ dưới gốc cây',
    subtitle:
      'Quan sát bức tranh sinh động, chọn từ ngữ ghép thành câu hoàn chỉnh theo nhiều cách diễn đạt hợp lý và tự chọn cái kết cho câu chuyện.',
    simulationType: 'vietnamese_story_builder',
    estimatedMinutes: 15,
    difficulty: 1,
    version: '1.0.0',
    status: 'approved',
    prerequisiteKnowledge: 'Nhận biết từ chỉ sự vật, hoạt động và nơi chốn.',
    evaluationCriteria: 'Ghép thành câu đủ chủ ngữ – vị ngữ có nghĩa hợp lý với bức tranh.',
    relatedSubjects: ['english', 'art_music_design'],
    visualSummaryPoints: [
      'Một câu văn trọn vẹn thường trả lời câu hỏi: Ai (con gì, cái gì)? và Làm gì (hoặc thế nào, ở đâu)?',
      'Cùng một bức tranh, chúng ta có nhiều cách sắp xếp từ ngữ khác nhau để diễn đạt miễn là câu có nghĩa và tự nhiên.',
      'Mỗi câu chuyện đều có Mở đầu → Diễn biến → Kết thúc.',
    ],
    scientificFactNote:
      'Ngữ pháp tiếng Việt: Cấu trúc Chủ ngữ – Vị ngữ và trạng ngữ chỉ nơi chốn linh hoạt (có thể đứng đầu hoặc cuối câu).',
    modelSimplificationNote:
      'Các thẻ từ được phân màu theo nhóm (Sự vật, Hoạt động, Đặc điểm/Nơi chốn) để hỗ trợ học sinh nhận biết thành phần câu trực quan.',
    learningOutcomes: [
      {
        id: 'lo-vn-1',
        code: 'TV2-CAU-01',
        description: 'Ghép được các thẻ từ thành câu miêu tả đúng bức tranh với nhiều phương án hợp lý.',
        stage: 'TUONG_TAC',
      },
      {
        id: 'lo-vn-2',
        code: 'TV2-TRUYEN-02',
        description: 'Sắp xếp trình tự câu chuyện và lựa chọn kết thúc nhân văn, sáng tạo.',
        stage: 'SANG_TAO',
      },
    ],
    initialSimulationState: {
      selectedWords: ['Chú mèo vàng', 'đang nằm ngủ', 'dưới gốc cây xanh'],
      chosenEnding: 'ending_share',
    },
    tasks: [
      {
        id: 'task-vn-1',
        title: 'Hoạt động: Ghép từ tạo câu miêu tả bức tranh',
        pedagogyStage: 'SANG_TAO',
        instruction:
          'Con hãy quan sát cảnh chú mèo dưới gốc cây, bấm chọn các thẻ từ để tạo thành một câu văn hoàn chỉnh và chọn một kết thúc đẹp cho câu chuyện nhé!',
        question: 'Hãy ghép một câu miêu tả chú mèo trong tranh (con có thể đặt "Dưới gốc cây..." lên đầu câu hoặc cuối câu đều được!).',
        targetDescription: 'Câu có đủ đối tượng (mèo), hoạt động (nằm ngủ/sưởi nắng) và nơi chốn (gốc cây)',
        validatorType: 'vietnamese_sentence',
        expectedConfig: {
          validPatterns: [
            'chú mèo vàng đang nằm ngủ dưới gốc cây',
            'dưới gốc cây xanh chú mèo vàng đang nằm ngủ',
            'chú mèo đang nằm ngủ dưới gốc cây xanh',
          ],
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Gợi mở cấu trúc câu',
            questionPrompt:
              'Trong bức tranh có con vật gì? Nó đang làm gì và ở đâu? Con hãy chọn đủ cả 3 ý đó nhé!',
            visualActionSuggestion: 'Chọn thẻ "Chú mèo vàng", "đang nằm ngủ" và "dưới gốc cây xanh".',
          },
        ],
        coreEssenceExplanation:
          'Khi viết câu văn, ta kết hợp phần chỉ sự vật (Chú mèo vàng), phần chỉ hoạt động (đang nằm ngủ) và phần chỉ nơi chốn (dưới gốc cây xanh). Đảo "Dưới gốc cây xanh, chú mèo vàng đang nằm ngủ" câu văn vẫn rất hay!',
        whyItWorks: 'Ngôn ngữ linh hoạt giúp bức tranh hiện lên sống động trong tâm trí người đọc.',
        reflectionChoices: [
          {
            id: 'ref-vn-1a',
            text: 'Có thể viết theo nhiều cách khác nhau miễn là câu đủ ý, rõ nghĩa và phù hợp với bức tranh.',
            isConceptualCorrect: true,
            feedback: 'Đúng vậy! Viết văn là sáng tạo, không có một khuôn mẫu cứng nhắc duy nhất!',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 7. KHOA HỌC: QUÁ TRÌNH CÂY PHÁT TRIỂN
  // ==========================================================================
  {
    id: 'lesson-g3-science-plant-growth',
    slug: 'lop-3-khoa-hoc-qua-trinh-cay-phat-trien',
    grade: 3,
    minAge: 8,
    subjectId: 'science',
    topicTitle: 'Thực vật và Môi trường – Điều kiện để cây xanh quang hợp và phát triển',
    title: 'Phòng thí nghiệm Cây Đậu Nhỏ – Nhiều nước hơn có phải lúc nào cũng tốt?',
    subtitle:
      'Tự điều chỉnh lượng ánh sáng Mặt Trời và lượng nước tưới mỗi ngày để tìm ra điểm cân bằng giúp cây nảy mầm, vươn cao và nở hoa.',
    simulationType: 'science_plant_growth',
    estimatedMinutes: 14,
    difficulty: 2,
    version: '1.1.0',
    status: 'approved',
    prerequisiteKnowledge: 'Nhận biết các bộ phận của cây (rễ, thân, lá, hoa).',
    evaluationCriteria: 'Điều chỉnh ánh sáng (50–85%) và độ ẩm (45–80%) vào ngưỡng cân bằng sinh học.',
    relatedSubjects: ['math', 'logic_lifeskills_finance'],
    visualSummaryPoints: [
      'Cây xanh cần ÁNH SÁNG để lá quang hợp chế tạo chất dinh dưỡng.',
      'Cây cần NƯỚC vừa đủ để vận chuyển khoáng chất từ rễ lên thân và lá.',
      'Thiếu nước cây sẽ héo, nhưng tưới QUÁ NHIỀU nước làm rễ bị ngập úng không hô hấp được!',
    ],
    scientificFactNote:
      'Quang hợp sử dụng ánh sáng, nước và khí CO2 để tổng hợp chất hữu cơ và giải phóng khí O2. Rễ cây cũng cần oxy trong các khe đất để hô hấp.',
    modelSimplificationNote:
      'Mô hình rút gọn 14 ngày sinh trưởng thành thanh trượt tức thời và chuẩn hóa độ ẩm đất/ánh sáng theo thang 0% – 100%.',
    learningOutcomes: [
      {
        id: 'lo-plant-1',
        code: 'KH3-CAY-01',
        description: 'Thử nghiệm các mức ánh sáng và nước khác nhau để rút ra điều kiện sống tối ưu của cây.',
        stage: 'THU_NGHIEM',
      },
    ],
    initialSimulationState: {
      lightLevel: 30,
      waterLevel: 25,
      daysSimulated: 14,
    },
    tasks: [
      {
        id: 'task-plant-1',
        title: 'Thí nghiệm: Chăm sóc cây đậu phát triển khỏe mạnh và ra hoa',
        pedagogyStage: 'THU_NGHIEM',
        instruction:
          'Con hãy điều chỉnh Ánh sáng (khoảng 50% – 85%) và Độ ẩm nước tưới (khoảng 45% – 80%) để cây đậu phát triển xanh tốt và nở hoa sau 14 ngày nhé!',
        question: 'Mức ánh sáng và lượng nước nào giúp cây phát triển khỏe mạnh mà không bị héo hay ngập úng?',
        targetDescription: 'Ánh sáng 50%–85% và Nước tưới 45%–80%',
        validatorType: 'plant_optimal',
        expectedConfig: {
          minLight: 50,
          maxLight: 85,
          minWater: 45,
          maxWater: 80,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Quan sát màu lá và rễ',
            questionPrompt:
              'Con nhìn xem lá cây đang vàng (thiếu nắng) hay đất đang sũng nước (quá 80% nước)? Hãy đưa cả hai thanh trượt vào vùng cân bằng nhé!',
            visualActionSuggestion: 'Chỉnh Ánh sáng khoảng 70% và Lượng nước khoảng 65%.',
          },
        ],
        coreEssenceExplanation:
          'Sự sống cần sự cân bằng: Đủ ánh sáng giúp lá quang hợp tạo thức ăn, đủ nước giúp cây tươi tốt nhưng vẫn giữ khe thoáng trong đất cho bộ rễ thở.',
        whyItWorks: 'Quang hợp và hô hấp ở rễ cần đồng thời ánh sáng, nước và không khí.',
        reflectionChoices: [
          {
            id: 'ref-plant-1a',
            text: 'Cây cần lượng ánh sáng và nước cân bằng vừa đủ; quá ít hay quá nhiều đều có hại cho cây.',
            isConceptualCorrect: true,
            feedback: 'Hoàn toàn chính xác! Đó là tư duy khoa học thực nghiệm!',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 8. TIẾNG ANH: HỌC QUA TÌNH HUỐNG
  // ==========================================================================
  {
    id: 'lesson-g3-english-room-explorer',
    slug: 'lop-3-tieng-anh-hoc-qua-tinh-huong-my-room',
    grade: 3,
    minAge: 8,
    subjectId: 'english',
    topicTitle: 'Situational English – Objects in My Study Room & Prepositions (in, on, under)',
    title: 'Welcome to Bắp’s Study Room – Tìm đồ vật & Hội thoại tình huống',
    subtitle:
      'Bấm vào các đồ vật trong phòng để nghe phát âm tiếng Anh chuẩn, tìm đồ vật theo lời gợi ý và ghép câu hội thoại.',
    simulationType: 'english_room_explorer',
    estimatedMinutes: 12,
    difficulty: 1,
    version: '1.0.0',
    status: 'approved',
    prerequisiteKnowledge: 'Làm quen bảng chữ cái và lời chào tiếng Anh cơ bản.',
    evaluationCriteria: 'Khám phá đủ từ vựng mục tiêu và hiểu câu miêu tả vị trí với giới từ ON / UNDER.',
    relatedSubjects: ['vietnamese', 'art_music_design'],
    visualSummaryPoints: [
      'Gắn trực tiếp từ tiếng Anh với hình ảnh vật thể (Book, Apple, Clock, Backpack) thay vì dịch máy móc.',
      'Sử dụng giới từ chỉ vị trí trong ngữ cảnh: ON the desk (trên bàn), UNDER the chair (dưới ghế).',
    ],
    scientificFactNote:
      'Phương pháp tiếp thu ngôn ngữ tự nhiên (Comprehensible Input): Liên kết âm thanh + hình ảnh + hành động giúp ghi nhớ từ vựng lâu gấp 3 lần.',
    modelSimplificationNote:
      'Sử dụng Web Speech API phát âm giọng tiếng Anh (en-US) trực tiếp khi học sinh chạm vào từng đồ vật.',
    learningOutcomes: [
      {
        id: 'lo-en-1',
        code: 'EN3-ROOM-01',
        description: 'Nghe, nhận diện và sử dụng được từ vựng đồ vật cùng câu hỏi Where is the...?',
        stage: 'TUONG_TAC',
      },
    ],
    initialSimulationState: {
      foundObjectIds: ['book'],
    },
    tasks: [
      {
        id: 'task-en-1',
        title: 'Situation Mission: Find the Book, the Red Apple, and the Wall Clock!',
        pedagogyStage: 'TUONG_TAC',
        instruction:
          'Con hãy bấm vào ít nhất 3 đồ vật trong phòng: quyển sách (Book), quả táo đỏ (Apple) và chiếc đồng hồ (Clock) để nghe phát âm và hoàn thành hội thoại nhé!',
        question: 'Can you tap and explore the Book, the Apple, and the Clock in the room?',
        targetDescription: 'Khám phá đủ 3 đồ vật: book, apple, clock',
        validatorType: 'english_situational',
        expectedConfig: {
          requiredItems: ['book', 'apple', 'clock'],
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Gợi ý tìm đồ vật',
            questionPrompt:
              'Look at the desk and the wall! Hãy bấm vào quyển sách (Book), quả táo (Apple) trên bàn và chiếc đồng hồ (Clock) trên tường nhé!',
            visualActionSuggestion: 'Chạm trực tiếp vào 3 đồ vật trên hình minh họa căn phòng.',
          },
        ],
        coreEssenceExplanation:
          'Khi con nhìn thấy quả táo trên bàn và nói "The apple is ON the desk", não bộ liên kết trực tiếp hình ảnh với câu tiếng Anh tự nhiên!',
        whyItWorks: 'Học qua ngữ cảnh thực tế giúp phản xạ nghe – nói nhanh nhạy.',
        reflectionChoices: [
          {
            id: 'ref-en-1a',
            text: '"The book is ON the desk" nghĩa là quyển sách nằm ở trên mặt bàn.',
            isConceptualCorrect: true,
            feedback: 'Awesome! Con nắm rất vững giới từ ON trong tình huống thực tế!',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 9. LỊCH SỬ, ĐỊA LÝ & THẾ GIỚI: BẢN ĐỒ VIỆT NAM & CÔNG DÂN SỐ
  // ==========================================================================
  {
    id: 'lesson-g4-social-vietnam-map-civics',
    slug: 'lop-4-lich-su-dia-ly-dao-duc-tin-hoc-ban-do-viet-nam',
    grade: 4,
    minAge: 8,
    subjectId: 'history_geo_civics_it',
    topicTitle: 'Bản đồ Việt Nam tương tác & Quy tắc An toàn trên Internet',
    title: 'Hành trình xuyên Việt & Công dân số thông thái',
    subtitle:
      'Khám phá 3 miền Bắc – Trung – Nam cùng quần đảo Hoàng Sa, Trường Sa trên bản đồ tương tác và giải quyết tình huống an toàn mạng.',
    simulationType: 'social_vietnam_map',
    estimatedMinutes: 15,
    difficulty: 2,
    version: '1.0.0',
    status: 'approved',
    prerequisiteKnowledge: 'Nhận biết tên đất nước Việt Nam và Thủ đô Hà Nội.',
    evaluationCriteria: 'Xác định đúng vùng địa lý trên bản đồ và chọn phương án bảo mật thông tin cá nhân.',
    relatedSubjects: ['science', 'tech_ai_coding'],
    visualSummaryPoints: [
      'Lãnh thổ Việt Nam gồm phần đất liền hình chữ S (Bắc Bộ, Trung Bộ, Nam Bộ) và vùng biển đảo rộng lớn (trong đó có hai quần đảo Hoàng Sa và Trường Sa).',
      'Quy tắc An toàn Internet: Không chia sẻ mật khẩu, địa chỉ nhà, số điện thoại cho người lạ và luôn hỏi ý kiến bố mẹ/thầy cô khi gặp thông tin đáng ngờ.',
    ],
    scientificFactNote:
      'Kiến thức Địa lý & Lịch sử chuẩn chương trình GDPT 2018 môn Lịch sử và Địa lý lớp 4 – 5 và môn Tin học tiểu học.',
    modelSimplificationNote:
      'Bản đồ tương tác chia thành các vùng chính (Bắc Bộ, Trung Bộ, Nam Bộ và Quần đảo Hoàng Sa – Trường Sa) để học sinh tiểu học dễ thao tác chạm.',
    learningOutcomes: [
      {
        id: 'lo-soc-1',
        code: 'LSDL4-VN-01',
        description: 'Xác định được các vùng miền và quần đảo Hoàng Sa, Trường Sa trên bản đồ Việt Nam.',
        stage: 'QUAN_SAT',
      },
      {
        id: 'lo-soc-2',
        code: 'TH4-AT-02',
        description: 'Chọn được cách ứng xử an toàn khi gặp tin nhắn lạ trên Internet.',
        stage: 'VAN_DUNG',
      },
    ],
    initialSimulationState: {
      selectedRegionId: 'north',
      ethicsChoiceId: 'safe_verify',
    },
    tasks: [
      {
        id: 'task-soc-1',
        title: 'Khám phá Thủ đô Hà Nội (Miền Bắc) & Xử lý tình huống An toàn số',
        pedagogyStage: 'VAN_DUNG',
        instruction:
          'Con hãy chọn vùng Bắc Bộ (nơi có Thủ đô Hà Nội và Đền Hùng) trên bản đồ Việt Nam, đồng thời chọn cách xử lý an toàn khi có người lạ trên mạng hỏi địa chỉ nhà và mật khẩu nhé!',
        question: 'Đâu là vùng có Thủ đô Hà Nội và cách ứng xử đúng đắn khi dùng Internet?',
        targetDescription: 'Vùng = Bắc Bộ (north) & Hành vi = Từ chối cung cấp thông tin cá nhân và báo người lớn (safe_verify)',
        validatorType: 'vietnam_region_ethics',
        expectedConfig: {
          expectedRegion: 'north',
          expectedEthics: 'safe_verify',
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Quan sát bản đồ và quy tắc an toàn',
            questionPrompt:
              'Thủ đô Hà Nội nằm ở miền nào của đất nước hình chữ S? Và khi người lạ xin mật khẩu/địa chỉ nhà, con có nên đưa không?',
            visualActionSuggestion: 'Chọn "Miền Bắc (Bắc Bộ)" trên bản đồ và chọn phương án "Không chia sẻ thông tin cá nhân, hỏi bố mẹ/thầy cô".',
          },
        ],
        coreEssenceExplanation:
          'Hiểu rõ bản đồ Tổ quốc giúp ta thêm yêu quê hương Việt Nam từ đất liền tới biển đảo Hoàng Sa, Trường Sa; đồng thời nắm vững quy tắc bảo mật giúp con an toàn trên không gian mạng.',
        whyItWorks: 'Kiến thức địa lý – lịch sử kết hợp kỹ năng công dân số toàn diện.',
        reflectionChoices: [
          {
            id: 'ref-soc-1a',
            text: 'Tuyệt đối giữ bí mật mật khẩu, địa chỉ nhà, số điện thoại và báo cho bố mẹ hoặc thầy cô khi gặp tin nhắn lạ.',
            isConceptualCorrect: true,
            feedback: 'Chính xác! Con là một Công dân số tiểu học rất thông thái và cảnh giác!',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 10. CÔNG NGHỆ, AI VÀ LẬP TRÌNH: HUẤN LUYỆN AI & GỠ LỖI THUẬT TOÁN
  // ==========================================================================
  {
    id: 'lesson-g4-tech-ai-coding-lab',
    slug: 'lop-4-cong-nghe-ai-va-lap-trinh-robot-ai-nhi',
    grade: 4,
    minAge: 8,
    subjectId: 'tech_ai_coding',
    topicTitle: 'Trí tuệ Nhân tạo (AI) & Tư duy Thuật toán – Dạy Robot Bảo vệ Đại dương',
    title: 'Huấn luyện AI phân loại Sinh vật biển & Gỡ lỗi đường đi cho Robot',
    subtitle:
      'Gán nhãn dữ liệu mẫu để dạy AI phân biệt Sinh vật biển với Rác thải nhựa, đồng thời sửa lỗi (debug) chuỗi lệnh điều khiển tàu ngầm nhí.',
    simulationType: 'tech_ai_pattern_lab',
    estimatedMinutes: 15,
    difficulty: 2,
    version: '1.0.0',
    status: 'approved',
    prerequisiteKnowledge: 'Nhận biết chuỗi hành động theo thứ tự và phân loại nhóm đồ vật.',
    evaluationCriteria: 'Huấn luyện đủ mẫu dữ liệu đúng cho AI (>= 4 mẫu) và chọn đúng lệnh sửa lỗi thuật toán.',
    relatedSubjects: ['math', 'science', 'logic_lifeskills_finance'],
    visualSummaryPoints: [
      'TRÍ TUỆ NHÂN TẠO (AI) không tự nhiên biết mọi thứ; nó học cách nhận diện mẫu (Pattern) từ các dữ liệu ví dụ do con người dạy.',
      'Nếu dữ liệu dạy cho AI bị sai hoặc thiếu đa dạng, AI sẽ phân loại nhầm (ví dụ: nhầm túi nilon trong suốt với con sứa biển!).',
      'GỠ LỖI (Debugging) là quá trình tìm ra bước lệnh sai trong thuật toán và sửa lại cho chính xác.',
    ],
    scientificFactNote:
      'Kiến thức Khoa học Máy tính: Học máy có giám sát (Supervised Machine Learning) dựa trên tập dữ liệu được gán nhãn (Labeled Dataset) để phân lớp đối tượng.',
    modelSimplificationNote:
      'Mô hình rút gọn quá trình huấn luyện mạng nơ-ron thành bộ đếm mẫu đặc trưng trực quan để học sinh 8+ tuổi hiểu ngay mối quan hệ Nhân – Quả giữa Dữ liệu và Kết quả dự đoán.',
    learningOutcomes: [
      {
        id: 'lo-tech-1',
        code: 'TECH4-AI-01',
        description: 'Gán nhãn đúng tập dữ liệu mẫu để huấn luyện AI phân biệt sinh vật biển và rác nhựa.',
        stage: 'THU_NGHIEM',
      },
      {
        id: 'lo-tech-2',
        code: 'TECH4-DEBUG-02',
        description: 'Phát hiện và sửa được bước lệnh sai trong chương trình điều khiển Robot.',
        stage: 'SUY_LUAN',
      },
    ],
    initialSimulationState: {
      aiTrainedCorrectCount: 2,
      debugFixedCommand: 'TURN_LEFT',
    },
    tasks: [
      {
        id: 'task-tech-ai-1',
        title: 'Thí nghiệm AI & Thuật toán: Dạy AI đạt 4/4 mẫu chuẩn và Sửa lỗi lệnh cho Robot',
        pedagogyStage: 'THU_NGHIEM',
        instruction:
          'Con hãy phân loại đúng cả 4 mẫu vật dưới biển (Cá heo, Rùa biển → Sinh vật biển; Chai nhựa, Túi nilon → Rác cần thu gom) và chọn khối lệnh sửa lỗi "Rẽ Phải tránh đá ngầm (TURN_RIGHT)" cho tàu ngầm nhé!',
        question: 'Làm thế nào để Robot AI vừa nhận diện đúng rác nhựa vừa không va vào đá ngầm?',
        targetDescription: 'Gán nhãn đúng 4/4 mẫu huấn luyện AI và chọn lệnh sửa lỗi TURN_RIGHT',
        validatorType: 'tech_ai_classifier',
        expectedConfig: {
          minTrainedSamples: 4,
          expectedDebugCommand: 'TURN_RIGHT',
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Kiểm tra dữ liệu dạy AI',
            questionPrompt:
              'Con xem cả 4 thẻ vật thể biển đã được gán đúng nhãn "Bảo vệ (Sinh vật)" hay "Thu gom (Rác nhựa)" chưa?',
            visualActionSuggestion: 'Bấm phân loại đủ 4 mẫu vật và chọn khối lệnh sửa lỗi "Rẽ Phải tránh đá (TURN_RIGHT)".',
          },
        ],
        coreEssenceExplanation:
          'Máy tính và AI chỉ thông minh khi con người cung cấp dữ liệu chuẩn xác và viết thuật toán rõ ràng. Con người luôn đóng vai trò kiểm tra và định hướng cho công nghệ!',
        whyItWorks:
          'Dữ liệu huấn luyện đúng + Thuật toán không lỗi = Hệ thống thông minh đáng tin cậy.',
        reflectionChoices: [
          {
            id: 'ref-tech-1a',
            text: 'AI học từ dữ liệu mẫu do con người dạy; nếu dữ liệu mẫu sai thì AI cũng sẽ dự đoán sai.',
            isConceptualCorrect: true,
            feedback: 'Xuất sắc! Con đã nắm được nguyên lý cốt lõi nhất của Trí tuệ Nhân tạo!',
          },
          {
            id: 'ref-tech-1b',
            text: 'AI tự biết hết mọi thứ và không bao giờ nhầm lẫn.',
            isConceptualCorrect: false,
            feedback: 'AI vẫn có thể nhầm túi nilon với con sứa nếu chưa được học kỹ đấy! Vì vậy con người luôn phải kiểm chứng kết quả của AI nhé.',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 11. NGHỆ THUẬT, ÂM NHẠC VÀ THIẾT KẾ: STUDIO MÀU PASTEL & ĐỐI XỨNG
  // ==========================================================================
  {
    id: 'lesson-g3-art-color-symmetry-studio',
    slug: 'lop-3-nghe-thuat-pha-mau-pastel-va-doi-xung-guong',
    grade: 3,
    minAge: 8,
    subjectId: 'art_music_design',
    topicTitle: 'Mỹ thuật & Thiết kế – Pha màu Pastel, Hòa sắc & Họa tiết Đối xứng Gương',
    title: 'Studio Sắc màu Pastel & Đôi cánh Bướm Đối xứng',
    subtitle:
      'Pha trộn các màu cơ bản cùng sắc trắng để tạo bảng màu Pastel dịu mắt và thiết kế họa tiết đối xứng qua trục gương.',
    simulationType: 'art_color_symmetry_studio',
    estimatedMinutes: 14,
    difficulty: 1,
    version: '1.0.0',
    status: 'approved',
    prerequisiteKnowledge: 'Nhận biết 3 màu cơ bản: Đỏ (Hồng), Vàng, Xanh lam.',
    evaluationCriteria: 'Pha được màu thứ cấp Pastel và tạo họa tiết có ít nhất 3 cặp ô đối xứng qua trục dọc.',
    relatedSubjects: ['math', 'science'],
    visualSummaryPoints: [
      'BA MÀU CƠ BẢN (Đỏ, Vàng, Lam) khi pha với nhau tạo ra màu thứ cấp: Đỏ + Vàng = Cam; Vàng + Lam = Xanh lục; Đỏ + Lam = Tím.',
      'MÀU PASTEL được tạo ra khi kết hợp màu sắc với sắc Trắng sáng, mang lại cảm giác nhẹ nhàng, thanh lịch.',
      'ĐỐI XỨNG TRỤC (Symmetry): Hai nửa hình giống hệt nhau như soi gương qua đường thẳng ở giữa.',
    ],
    scientificFactNote:
      'Quang học & Lý thuyết màu: Pha màu sắc tố (Subtractive Color Mixing) trong hội họa kết hợp cùng phép biến hình Đối xứng trục trong hình học phẳng.',
    modelSimplificationNote:
      'Lưới thiết kế đối xứng tự động kiểm tra các cặp tọa độ (x, y) và (width - 1 - x, y) qua trục giữa.',
    learningOutcomes: [
      {
        id: 'lo-art-1',
        code: 'ART3-COLOR-01',
        description: 'Pha trộn được các sắc thái màu Pastel từ màu gốc.',
        stage: 'TUONG_TAC',
      },
      {
        id: 'lo-art-2',
        code: 'ART3-SYM-02',
        description: 'Sáng tạo được họa tiết đối xứng cân đối trên lưới thiết kế.',
        stage: 'SANG_TAO',
      },
    ],
    initialSimulationState: {
      mixedColorCode: 'lavender',
      symmetryCellsCount: 2,
    },
    tasks: [
      {
        id: 'task-art-1',
        title: 'Hoạt động Sáng tạo: Pha màu Pastel & Tô ít nhất 4 ô họa tiết Đối xứng',
        pedagogyStage: 'SANG_TAO',
        instruction:
          'Con hãy chọn một công thức pha màu Pastel yêu thích (như Tím Lavender, Xanh Mint hoặc Cam Đào) và bấm tô ít nhất 4 cặp ô trên bảng vẽ đối xứng cánh bướm nhé!',
        question: 'Làm thế nào để tạo ra màu Tím Lavender hoặc Xanh Mint Pastel và vẽ đôi cánh đối xứng cân bằng?',
        targetDescription: 'Chọn bảng màu Pastel và tạo >= 4 cặp ô đối xứng trên lưới',
        validatorType: 'art_symmetry_mix',
        expectedConfig: {
          minSymmetryPairs: 4,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Gợi mở pha màu và đối xứng',
            questionPrompt:
              'Con hãy bấm vào các ô trên lưới vẽ cánh bướm! Mỗi khi con tô 1 ô bên trái, ô đối xứng bên phải sẽ cùng tỏa sáng. Hãy tô đủ ít nhất 4 cặp ô nhé!',
            visualActionSuggestion: 'Bấm chọn màu Pastel và chạm vào ít nhất 4 ô trên lưới đối xứng.',
          },
        ],
        coreEssenceExplanation:
          'Nghệ thuật và Toán học luôn song hành: Sự pha trộn tỷ lệ màu sắc tạo nên hòa sắc êm dịu, còn phép đối xứng trục tạo nên vẻ đẹp cân đối của cánh bướm, bông hoa và kiến trúc.',
        whyItWorks:
          'Mọi điểm cách đều trục đối xứng tạo nên sự cân bằng thị giác tự nhiên.',
        reflectionChoices: [
          {
            id: 'ref-art-1a',
            text: 'Hình đối xứng trục có hai nửa bên trái và bên phải giống nhau như soi gương qua đường trục ở giữa.',
            isConceptualCorrect: true,
            feedback: 'Tuyệt vời! Con vừa có con mắt thẩm mỹ tinh tế vừa hiểu rõ hình học đối xứng!',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 12. LOGIC, KỸ NĂNG SỐNG & TÀI CHÍNH: NGÂN SÁCH THÔNG THÁI (CẦN VS MUỐN)
  // ==========================================================================
  {
    id: 'lesson-g3-finance-smart-budget-lab',
    slug: 'lop-3-logic-ky-nang-song-tai-chinh-can-va-muon',
    grade: 3,
    minAge: 8,
    subjectId: 'logic_lifeskills_finance',
    topicTitle: 'Tài chính cơ bản & Tư duy Quyết định – Phân biệt Cần vs Muốn & Lập Ngân sách',
    title: 'Thử thách 100 Xu Thông Thái – Chi tiêu, Tiết kiệm & Sẻ chia',
    subtitle:
      'Phân biệt món đồ CẦN THIẾT (Needs) và MONG MUỐN (Wants), lập kế hoạch sử dụng 100 xu sao cho đủ đồ dùng học tập và có khoản tiết kiệm.',
    simulationType: 'finance_smart_budget_lab',
    estimatedMinutes: 15,
    difficulty: 2,
    version: '1.0.0',
    status: 'approved',
    prerequisiteKnowledge: 'Phép cộng và phép trừ trong phạm vi 100.',
    evaluationCriteria: 'Tổng chi tiêu không vượt quá 100 xu, chọn đủ ít nhất 2 món Cần thiết và để dành ít nhất 20 xu tiết kiệm.',
    relatedSubjects: ['math', 'vietnamese'],
    visualSummaryPoints: [
      'THỨ CẦN THIẾT (Needs): Những thứ quan trọng phục vụ trực tiếp cho sức khỏe, học tập và an toàn (như sách vở, bữa ăn dinh dưỡng, áo ấm).',
      'THỨ MONG MUỐN (Wants): Những thứ mang lại niềm vui thêm nhưng chưa có ngay cũng không sao (như đồ chơi mới, kẹo ngọt, sticker lấp lánh).',
      'QUY TẮC TIẾT KIỆM THÔNG THÁI: Luôn ưu tiên Thứ Cần Thiết trước, dành một phần vào Lọ Tiết Kiệm cho mục tiêu lớn, rồi mới cân nhắc Thứ Mong Muốn trong giới hạn ngân sách.',
    ],
    scientificFactNote:
      'Kinh tế học hành vi & Giáo dục tài chính trẻ em (Financial Literacy): Rèn luyện khả năng trì hoãn sự thỏa mãn tức thời (Delayed Gratification) và tối ưu hóa nguồn lực hữu hạn.',
    modelSimplificationNote:
      'Quy đổi đơn vị tiền tệ thành "Xu thông thái" (100 xu) để học sinh lớp 3 dễ dàng liên hệ với tỷ lệ phần trăm (100%).',
    learningOutcomes: [
      {
        id: 'lo-fin-1',
        code: 'FIN3-BUDGET-01',
        description: 'Phân biệt được nhu cầu Cần thiết (Needs) và Mong muốn (Wants) trong tình huống thực tế.',
        stage: 'SUY_LUAN',
      },
      {
        id: 'lo-fin-2',
        code: 'FIN3-SAVE-02',
        description: 'Lập được bảng phân bổ ngân sách 100 xu cân đối giữa Chi tiêu thiết yếu và Tiết kiệm.',
        stage: 'VAN_DUNG',
      },
    ],
    initialSimulationState: {
      selectedBudgetItems: ['notebook'],
    },
    tasks: [
      {
        id: 'task-fin-1',
        title: 'Hoạt động: Lập kế hoạch 100 Xu cho năm học mới (Tiết kiệm >= 20 xu)',
        pedagogyStage: 'VAN_DUNG',
        instruction:
          'Con có ngân sách 100 xu. Hãy chọn mua ít nhất 2 món đồ CẦN THIẾT cho việc học tập/sức khỏe, có thể chọn thêm món yêu thích nhưng phải giữ lại ít nhất 20 xu trong Lọ Tiết Kiệm (Tổng chi <= 80 xu) nhé!',
        question: 'Cách chọn giỏ hàng nào giúp con vừa đủ đồ dùng thiết yếu vừa tiết kiệm được từ 20 xu trở lên?',
        targetDescription: 'Chọn >= 2 món Cần thiết (Needs), Tổng chi <= 80 xu (Tiết kiệm >= 20 xu)',
        validatorType: 'finance_budget_balance',
        expectedConfig: {
          maxTotalSpend: 80,
          minNeedsCount: 2,
          minSavedCoins: 20,
        },
        socraticHints: [
          {
            level: 1,
            stageLabel: 'Kiểm tra giỏ hàng và Lọ Tiết Kiệm',
            questionPrompt:
              'Con nhìn xem mình đã chọn đủ ít nhất 2 món có nhãn [CẦN THIẾT] chưa? Và số xu còn lại trong Lọ Tiết Kiệm có đạt từ 20 xu trở lên không?',
            visualActionSuggestion: 'Chọn Sách khoa học (25 xu) + Bộ dụng cụ học tập (20 xu) để còn dư 55 xu tiết kiệm!',
          },
        ],
        coreEssenceExplanation:
          'Khi nguồn lực (số xu) có giới hạn, người quản lý tài chính thông thái luôn ưu tiên nhu cầu Cần thiết trước và giữ lại một khoản tiết kiệm dự phòng trước khi mua sắm theo cảm xúc.',
        whyItWorks:
          'Tổng ngân sách (100 xu) = Chi tiêu Cần thiết + Chi tiêu Mong muốn + Khoản Tiết kiệm (>= 20 xu).',
        reflectionChoices: [
          {
            id: 'ref-fin-1a',
            text: 'Ưu tiên mua những món Cần thiết trước và trích một phần tiết kiệm giúp ta luôn chủ động và đạt được mục tiêu lớn.',
            isConceptualCorrect: true,
            feedback: 'Quá tuyệt vời! Con đã suy nghĩ chín chắn như một chuyên gia kế hoạch nhí!',
          },
          {
            id: 'ref-fin-1b',
            text: 'Cứ mua hết đồ chơi đắt tiền trước, thiếu đồ dùng học tập tính sau.',
            isConceptualCorrect: false,
            feedback: 'Nếu mua hết đồ chơi trước thì khi đến lớp mình sẽ thiếu sách vở cần thiết mất! Hãy ưu tiên thứ Cần thiết trước nhé.',
          },
        ],
      },
    ],
  },
];
