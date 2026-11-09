-- ============================================================================
-- Little Genius (EduExplore) – Cloudflare D1 Seed Data
-- Migration: 0002_seed_ecosystem.sql
-- Khởi tạo 8 lĩnh vực môn học, 16 chủ đề, 36 khuôn mẫu bài tập, kỹ năng & hồ sơ mẫu
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. Phụ huynh & Hồ sơ con mẫu (Không cần email riêng cho trẻ)
INSERT OR IGNORE INTO parents (id, email_hash, display_name, password_hash, mfa_enabled, consent_verified, daily_limit_minutes_default)
VALUES ('parent-01', 'sha256_parent_demo_hash', 'Mẹ của Bắp', 'pbkdf2_demo_hash', 1, 1, 45);

INSERT OR IGNORE INTO students (id, parent_id, nickname, birth_year, grade_level, is_active)
VALUES ('student-bap-01', 'parent-01', 'Bé Bắp', 2018, 3, 1);

INSERT OR IGNORE INTO student_profiles (student_id, avatar_role, pastel_theme, daily_limit_minutes, voice_guide_enabled, reduced_motion, large_text, public_sharing_allowed)
VALUES ('student-bap-01', 'young_scientist', 'lavender_mint', 45, 1, 0, 0, 0);

-- 2. Tám (8) Lĩnh vực Môn học Chuyên sâu
INSERT OR IGNORE INTO subjects (id, code, name, lab_title, description, pastel_color, display_order) VALUES
('math', 'TOAN_TU_DUY', 'Toán học và Tư duy số', 'Phòng Thí Nghiệm Toán & Mô Hình Số', 'Khám phá bản chất phép tính, phân số, hình học phẳng và tư duy đại số qua thao tác trực quan.', 'amber', 1),
('science', 'KHOA_HOC', 'Khoa học và Thí nghiệm', 'Phòng Thí Nghiệm Khoa Học Tự Nhiên', 'Đặt giả thuyết, điều chỉnh biến số ánh sáng, nhiệt độ, lực và quan sát hiện tượng tự nhiên.', 'emerald', 2),
('vietnamese', 'TIENG_VIET', 'Tiếng Việt và Đọc hiểu', 'Xưởng Ngôn Ngữ & Sáng Tác Truyện', 'Giàu vốn từ, đọc hiểu sâu qua tình huống, tìm bằng chứng trong văn bản và viết sáng tạo.', 'rose', 3),
('english', 'TIENG_ANH', 'Tiếng Anh và Giao tiếp', 'Không Gian Giao Tiếp Tiếng Anh Tình Huống', 'Phản xạ nghe – nói tự nhiên qua ngữ cảnh căn phòng, cửa hàng, du lịch và thuyết trình nhí.', 'sky', 4),
('history_geo_civics_it', 'LS_DL_THE_GIOI', 'Lịch sử, Địa lý và Thế giới', 'Trạm Khám Phá Việt Nam & Địa Cầu', 'Bản đồ tương tác, dòng chảy lịch sử, văn hóa các châu lục và bảo vệ môi trường bền vững.', 'indigo', 5),
('tech_ai_coding', 'CONG_NGHE_AI', 'Công nghệ, AI và Lập trình', 'Phòng Lab Robot, Thuật Toán & AI Nhí', 'Lập trình khối lệnh, gỡ lỗi thuật toán, hiểu nguyên lý AI học từ dữ liệu và an toàn số.', 'violet', 6),
('art_music_design', 'NGHE_THUAT', 'Nghệ thuật, Âm nhạc và Thiết kế', 'Studio Màu Sắc, Nhịp Điệu & Thiết Kế', 'Pha trộn màu sắc, đối xứng hình học trong mỹ thuật, nhịp phách âm nhạc và thiết kế đồ họa.', 'pink', 7),
('logic_lifeskills_finance', 'LOGIC_TAI_CHINH', 'Logic, Kỹ năng sống và Tài chính cơ bản', 'Học Viện Tư Duy Logic & Tài Chính Thông Thái', 'Suy luận nhiều bước, lập kế hoạch ngân sách, phân biệt Cần và Muốn, giải quyết vấn đề thực tế.', 'teal', 8);

-- 3. Mười sáu (16) Chủ đề (2 Chủ đề cho mỗi môn học)
INSERT OR IGNORE INTO topics (id, subject_id, title, recommended_min_age, grade_band, summary, related_subject_ids_json, display_order) VALUES
('topic-math-1', 'math', 'Phân số, Phép nhân & Mô hình diện tích', 8, 'Lớp 3 - Lớp 4', 'Hiểu bản chất phép nhân và phân số tương đương qua lưới ô vuông và chia bánh.', '["science","logic_lifeskills_finance"]', 1),
('topic-math-2', 'math', 'Hình học phẳng, Đo lường & Tối ưu hóa', 8, 'Lớp 3 - Lớp 5', 'Chu vi, diện tích, góc, đồng hồ và bài toán tối ưu cùng chu vi khác diện tích.', '["art_music_design","tech_ai_coding"]', 2),
('topic-sci-1', 'science', 'Vòng tuần hoàn nước, Thời tiết & Khí hậu', 8, 'Lớp 3 - Lớp 5', 'Sự chuyển thể của nước, mây mưa, băng nổi trên nước và cầu vồng.', '["math","history_geo_civics_it"]', 1),
('topic-sci-2', 'science', 'Sinh태 học, Cây xanh, Lực & Chuyển động', 8, 'Lớp 3 - Lớp 5', 'Quang hợp, chuỗi thức ăn, trọng lực các hành tinh và kết cấu cầu chịu lực.', '["tech_ai_coding","math"]', 2),
('topic-vn-1', 'vietnamese', 'Từ ngữ giàu hình ảnh & Cấu trúc câu', 8, 'Lớp 2 - Lớp 4', 'Ghép từ thành câu, biện pháp so sánh – nhân hóa và miêu tả sinh động.', '["art_music_design","english"]', 1),
('topic-vn-2', 'vietnamese', 'Đọc hiểu tìm bằng chứng & Viết sáng tạo', 8, 'Lớp 3 - Lớp 5', 'Phân tích tình huống truyện, tìm chi tiết chứng minh và tự sáng tác kết thúc mở.', '["history_geo_civics_it","logic_lifeskills_finance"]', 2),
('topic-en-1', 'english', 'Situational Vocabulary & Prepositions', 8, 'Lớp 3 - Lớp 4', 'Từ vựng gắn liền đồ vật trong phòng học, công viên và giới từ chỉ vị trí.', '["vietnamese","art_music_design"]', 1),
('topic-en-2', 'english', 'Interactive Dialogues & Story Reading', 8, 'Lớp 3 - Lớp 5', 'Hoàn thành hội thoại giao tiếp, đọc hiểu thông điệp tiếng Anh và phản xạ nghe.', '["vietnamese","history_geo_civics_it"]', 2),
('topic-soc-1', 'history_geo_civics_it', 'Bản đồ Địa lý & Di sản Lịch sử Việt Nam', 8, 'Lớp 3 - Lớp 5', 'Khám phá 3 miền Bắc – Trung – Nam, quần đảo Hoàng Sa – Trường Sa và danh nhân.', '["vietnamese","science"]', 1),
('topic-soc-2', 'history_geo_civics_it', 'Kỳ quan Thế giới & Môi trường Bền vững', 8, 'Lớp 3 - Lớp 5', 'Các châu lục, bảo vệ rừng đầu nguồn và ứng phó biến đổi khí hậu.', '["science","logic_lifeskills_finance"]', 2),
('topic-tech-1', 'tech_ai_coding', 'Tư duy Thuật toán & Lập trình Khối lệnh', 8, 'Lớp 3 - Lớp 5', 'Chuỗi lệnh tuần tự, vòng lặp, điều kiện và gỡ lỗi (debug) hành trình của Robot.', '["math","logic_lifeskills_finance"]', 1),
('topic-tech-2', 'tech_ai_coding', 'Trí tuệ Nhân tạo (AI) & An toàn Không gian mạng', 8, 'Lớp 3 - Lớp 5', 'Cách máy tính học nhận diện mẫu hình và quy tắc bảo vệ thông tin cá nhân.', '["science","logic_lifeskills_finance"]', 2),
('topic-art-1', 'art_music_design', 'Pha trộn Màu sắc Pastel & Đối xứng Hình học', 8, 'Lớp 3 - Lớp 5', 'Màu cơ bản, màu thứ cấp, hòa sắc ấm – lạnh và trục đối xứng trong thiết kế.', '["math","science"]', 1),
('topic-art-2', 'art_music_design', 'Nhịp điệu Âm nhạc & Thiết kế Không gian', 8, 'Lớp 3 - Lớp 5', 'Tiết tấu âm thanh, tỷ lệ hài hòa và thiết kế poster/sản phẩm sáng tạo.', '["math","vietnamese"]', 2),
('topic-logic-1', 'logic_lifeskills_finance', 'Suy luận Logic & Giải quyết Vấn đề Nhiều bước', 8, 'Lớp 3 - Lớp 5', 'Tìm quy luật, cân thăng bằng, phát hiện lỗi lập luận và so sánh các phương án.', '["math","tech_ai_coding"]', 1),
('topic-logic-2', 'logic_lifeskills_finance', 'Tài chính Nhí: Ngân sách, Tiết kiệm & Cần vs Muốn', 8, 'Lớp 3 - Lớp 5', 'Lập kế hoạch chi tiêu, tính tiền thừa, tiết kiệm có mục tiêu và tiêu dùng thông thái.', '["math","vietnamese"]', 2);

-- 4. Ba mươi sáu (36) Khuôn mẫu Bài tập (6 Nhóm × 6 Dạng bài)
INSERT OR IGNORE INTO activity_templates (id, group_code, sub_type_number, name, interaction_engine, supports_open_ended) VALUES
('tpl-01', 'GROUP_1_OBSERVATION', 1, 'Chọn vật thể phù hợp', 'object_selector', 0),
('tpl-02', 'GROUP_1_OBSERVATION', 2, 'Ghép cặp hình ảnh', 'pair_matcher', 0),
('tpl-03', 'GROUP_1_OBSERVATION', 3, 'Tìm điểm khác biệt', 'difference_spotter', 0),
('tpl-04', 'GROUP_1_OBSERVATION', 4, 'Phân loại đối tượng', 'category_sorter', 0),
('tpl-05', 'GROUP_1_OBSERVATION', 5, 'Sắp xếp thứ tự', 'sequence_orderer', 0),
('tpl-06', 'GROUP_1_OBSERVATION', 6, 'Hoàn thành hình ảnh', 'pattern_completer', 0),
('tpl-07', 'GROUP_2_VISUAL_MATH', 7, 'Kéo thả để tính toán', 'manipulative_counter', 0),
('tpl-08', 'GROUP_2_VISUAL_MATH', 8, 'Cân bằng hai vế phép tính', 'equation_balancer', 0),
('tpl-09', 'GROUP_2_VISUAL_MATH', 9, 'Chia và ghép phân số', 'fraction_slicer', 0),
('tpl-10', 'GROUP_2_VISUAL_MATH', 10, 'Thao tác trên đồng hồ', 'analog_clock_lab', 0),
('tpl-11', 'GROUP_2_VISUAL_MATH', 11, 'Đo kích thước vật thể', 'interactive_ruler', 0),
('tpl-12', 'GROUP_2_VISUAL_MATH', 12, 'Xây hình theo yêu cầu', 'grid_shape_builder', 1),
('tpl-13', 'GROUP_3_LOGIC_REASONING', 13, 'Tìm quy luật', 'rule_finder', 0),
('tpl-14', 'GROUP_3_LOGIC_REASONING', 14, 'Điền phần còn thiếu', 'missing_element_solver', 0),
('tpl-15', 'GROUP_3_LOGIC_REASONING', 15, 'Giải mê cung', 'algorithmic_maze', 0),
('tpl-16', 'GROUP_3_LOGIC_REASONING', 16, 'Giải bài toán có nhiều bước', 'multi_step_planner', 0),
('tpl-17', 'GROUP_3_LOGIC_REASONING', 17, 'Phát hiện lỗi trong lời giải', 'error_detective', 0),
('tpl-18', 'GROUP_3_LOGIC_REASONING', 18, 'So sánh nhiều phương án giải quyết', 'strategy_comparator', 1),
('tpl-19', 'GROUP_4_SCIENCE_LAB', 19, 'Đưa ra giả thuyết', 'hypothesis_builder', 1),
('tpl-20', 'GROUP_4_SCIENCE_LAB', 20, 'Thay đổi một biến số', 'variable_controller', 0),
('tpl-21', 'GROUP_4_SCIENCE_LAB', 21, 'Dự đoán kết quả', 'outcome_predictor', 0),
('tpl-22', 'GROUP_4_SCIENCE_LAB', 22, 'Quan sát mô phỏng', 'simulation_observer', 0),
('tpl-23', 'GROUP_4_SCIENCE_LAB', 23, 'Ghi lại kết quả', 'data_logger', 1),
('tpl-24', 'GROUP_4_SCIENCE_LAB', 24, 'Giải thích nguyên nhân', 'causal_explainer', 1),
('tpl-25', 'GROUP_5_LANGUAGE', 25, 'Ghép từ thành câu', 'sentence_assembler', 1),
('tpl-26', 'GROUP_5_LANGUAGE', 26, 'Sắp xếp tranh thành câu chuyện', 'story_board_sequencer', 0),
('tpl-27', 'GROUP_5_LANGUAGE', 27, 'Hoàn thành đoạn hội thoại', 'dialogue_builder', 0),
('tpl-28', 'GROUP_5_LANGUAGE', 28, 'Đọc hiểu theo tình huống', 'situational_reader', 0),
('tpl-29', 'GROUP_5_LANGUAGE', 29, 'Tìm bằng chứng trong bài đọc', 'evidence_highlighter', 0),
('tpl-30', 'GROUP_5_LANGUAGE', 30, 'Viết đoạn văn sáng tạo', 'creative_writer', 1),
('tpl-31', 'GROUP_6_CREATIVE_APPLIED', 31, 'Thiết kế mô hình', 'blueprint_designer', 1),
('tpl-32', 'GROUP_6_CREATIVE_APPLIED', 32, 'Tạo sản phẩm nghệ thuật', 'art_studio_canvas', 1),
('tpl-33', 'GROUP_6_CREATIVE_APPLIED', 33, 'Xây dựng kế hoạch', 'project_planner', 1),
('tpl-34', 'GROUP_6_CREATIVE_APPLIED', 34, 'Giải quyết vấn đề thực tế', 'real_world_solver', 1),
('tpl-35', 'GROUP_6_CREATIVE_APPLIED', 35, 'Phát triển ý tưởng mới', 'innovation_pitcher', 1),
('tpl-36', 'GROUP_6_CREATIVE_APPLIED', 36, 'Giải thích sản phẩm của mình', 'portfolio_presenter', 1);

-- 5. Kỹ năng & Đồ thị Tiên quyết (Knowledge Graph Skills)
INSERT OR IGNORE INTO skills (id, subject_id, code, name, description, difficulty_tier) VALUES
('skill-math-add', 'math', 'MATH_ADD_10', 'Phép cộng và tách gộp số', 'Gộp và tách nhóm vật thể trong phạm vi 20', 1),
('skill-math-mul', 'math', 'MATH_MUL_ARRAY', 'Phép nhân qua mảng trực quan', 'Hiểu phép nhân là tổng các nhóm bằng nhau và diện tích hình chữ nhật', 2),
('skill-math-frac', 'math', 'MATH_FRAC_EQ', 'Phân số và phân số tương đương', 'Chia phần bằng nhau và nhận biết 1/2 = 2/4 = 3/6', 3),
('skill-math-area', 'math', 'MATH_GEO_OPT', 'Chu vi, Diện tích và Tối ưu hình học', 'Phân biệt chu vi với diện tích và tìm diện tích lớn nhất khi cùng chu vi', 4),
('skill-sci-water', 'science', 'SCI_WATER_CYCLE', 'Chuyển thể của nước & Tuần hoàn tự nhiên', 'Bốc hơi, ngưng tụ và mưa dựa trên nhiệt độ và gió', 2),
('skill-tech-algo', 'tech_ai_coding', 'TECH_ALGO_LOOP', 'Thuật toán tuần tự & Gỡ lỗi chương trình', 'Lập chuỗi lệnh điều khiển nhân vật và phát hiện bước sai', 2),
('skill-art-color', 'art_music_design', 'ART_COLOR_SYMMETRY', 'Pha màu Pastel & Trục đối xứng', 'Kết hợp màu cơ bản và thiết kế hình đối xứng hài hòa', 2),
('skill-fin-budget', 'logic_lifeskills_finance', 'FIN_SMART_BUDGET', 'Quản lý ngân sách & Phân biệt Cần – Muốn', 'Cân đối thu chi và tính tiền thừa chính xác', 2);

INSERT OR IGNORE INTO skill_prerequisites (skill_id, prerequisite_skill_id) VALUES
('skill-math-mul', 'skill-math-add'),
('skill-math-frac', 'skill-math-mul'),
('skill-math-area', 'skill-math-mul'),
('skill-fin-budget', 'skill-math-add');
