// ============================================================================
// Little Genius – Interactive Exercise Engine (36 Exercise Types across 6 Groups)
// & Controlled Parameterized Variant Generator (Sinh biến thể bài tập có kiểm soát)
// ============================================================================

export type ExerciseGroupId =
  | 'GROUP_1_OBSERVATION'
  | 'GROUP_2_VISUAL_MATH'
  | 'GROUP_3_LOGIC_REASONING'
  | 'GROUP_4_SCIENCE_LAB'
  | 'GROUP_5_LANGUAGE'
  | 'GROUP_6_CREATIVE_APPLIED';

export type InteractionEngineType =
  | 'item_sorter_selector'      // Dùng cho Nhóm 1 (Chọn vật, Ghép cặp, Tìm khác biệt, Phân loại, Sắp xếp, Hoàn thành hình)
  | 'visual_math_workbench'     // Dùng cho Nhóm 2 (Kéo thả tính, Cân bằng 2 vế, Phân số, Đồng hồ, Thước đo, Xây hình)
  | 'logic_detective_solver'    // Dùng cho Nhóm 3 (Tìm quy luật, Điền khuyết, Mê cung, Nhiều bước, Bắt lỗi lời giải, So sánh phương án)
  | 'science_inquiry_lab'       // Dùng cho Nhóm 4 (Giả thuyết, Thay đổi biến, Dự đoán, Quan sát, Ghi kết quả, Giải thích nguyên nhân)
  | 'language_evidence_studio'  // Dùng cho Nhóm 5 (Ghép câu, Sắp xếp truyện, Hội thoại, Đọc hiểu, Tìm bằng chứng, Viết sáng tạo)
  | 'creative_maker_canvas';    // Dùng cho Nhóm 6 (Thiết kế mô hình, Nghệ thuật, Lập kế hoạch, Giải quyết vấn đề, Ý tưởng mới, Giải thích sản phẩm)

export interface ExerciseSubTypeMeta {
  subTypeNumber: number; // 1 .. 36
  groupCode: ExerciseGroupId;
  groupTitle: string;
  name: string;
  engineType: InteractionEngineType;
  isOpenEnded: boolean;
  samplePrompt: string;
}

export const EXERCISE_36_CATALOG: ExerciseSubTypeMeta[] = [
  // NHÓM 1 – QUAN SÁT VÀ NHẬN BIẾT (1 - 6)
  { subTypeNumber: 1, groupCode: 'GROUP_1_OBSERVATION', groupTitle: 'Nhóm 1: Quan sát & Nhận biết', name: '1. Chọn vật thể phù hợp', engineType: 'item_sorter_selector', isOpenEnded: false, samplePrompt: 'Chọn tất cả các vật thể có khả năng dẫn điện hoặc thuộc nhóm năng lượng tái tạo.' },
  { subTypeNumber: 2, groupCode: 'GROUP_1_OBSERVATION', groupTitle: 'Nhóm 1: Quan sát & Nhận biết', name: '2. Ghép cặp hình ảnh', engineType: 'item_sorter_selector', isOpenEnded: false, samplePrompt: 'Ghép mỗi loài sinh vật với môi trường sống tự nhiên tương ứng.' },
  { subTypeNumber: 3, groupCode: 'GROUP_1_OBSERVATION', groupTitle: 'Nhóm 1: Quan sát & Nhận biết', name: '3. Tìm điểm khác biệt', engineType: 'item_sorter_selector', isOpenEnded: false, samplePrompt: 'Tìm đối tượng có tính chất hình học khác với các đối tượng còn lại trong nhóm.' },
  { subTypeNumber: 4, groupCode: 'GROUP_1_OBSERVATION', groupTitle: 'Nhóm 1: Quan sát & Nhận biết', name: '4. Phân loại đối tượng', engineType: 'item_sorter_selector', isOpenEnded: false, samplePrompt: 'Phân loại các vật phẩm vào 2 giỏ: Rác hữu cơ và Rác tái chế.' },
  { subTypeNumber: 5, groupCode: 'GROUP_1_OBSERVATION', groupTitle: 'Nhóm 1: Quan sát & Nhận biết', name: '5. Sắp xếp thứ tự', engineType: 'item_sorter_selector', isOpenEnded: false, samplePrompt: 'Sắp xếp các giai đoạn phát triển của cây đậu từ hạt mầm đến khi ra hoa.' },
  { subTypeNumber: 6, groupCode: 'GROUP_1_OBSERVATION', groupTitle: 'Nhóm 1: Quan sát & Nhận biết', name: '6. Hoàn thành hình ảnh', engineType: 'item_sorter_selector', isOpenEnded: false, samplePrompt: 'Chọn mảnh ghép đối xứng còn thiếu để hoàn thiện họa tiết cánh bướm.' },

  // NHÓM 2 – TOÁN HỌC TRỰC QUAN (7 - 12)
  { subTypeNumber: 7, groupCode: 'GROUP_2_VISUAL_MATH', groupTitle: 'Nhóm 2: Toán học Trực quan', name: '7. Kéo thả để tính toán', engineType: 'visual_math_workbench', isOpenEnded: false, samplePrompt: 'Thêm bớt các nhóm vật thể để thực hiện phép nhân và phép cộng trực quan.' },
  { subTypeNumber: 8, groupCode: 'GROUP_2_VISUAL_MATH', groupTitle: 'Nhóm 2: Toán học Trực quan', name: '8. Cân bằng hai vế phép tính', engineType: 'visual_math_workbench', isOpenEnded: false, samplePrompt: 'Điều chỉnh số lượng quả cân để hai vế biểu thức 3 × 4 = 6 + [?] cân bằng nhau.' },
  { subTypeNumber: 9, groupCode: 'GROUP_2_VISUAL_MATH', groupTitle: 'Nhóm 2: Toán học Trực quan', name: '9. Chia và ghép phân số', engineType: 'visual_math_workbench', isOpenEnded: false, samplePrompt: 'Chia thanh sô-cô-la thành 6 phần bằng nhau và chọn số phần tương đương với 1/2.' },
  { subTypeNumber: 10, groupCode: 'GROUP_2_VISUAL_MATH', groupTitle: 'Nhóm 2: Toán học Trực quan', name: '10. Thao tác trên đồng hồ', engineType: 'visual_math_workbench', isOpenEnded: false, samplePrompt: 'Xoay kim đồng hồ từ 8 giờ 15 phút thêm 30 phút và xác định thời điểm kết thúc.' },
  { subTypeNumber: 11, groupCode: 'GROUP_2_VISUAL_MATH', groupTitle: 'Nhóm 2: Toán học Trực quan', name: '11. Đo kích thước vật thể', engineType: 'visual_math_workbench', isOpenEnded: false, samplePrompt: 'Dịch chuyển thước đo cm để đo chính xác chiều dài chiếc bút chì và chiếc lá.' },
  { subTypeNumber: 12, groupCode: 'GROUP_2_VISUAL_MATH', groupTitle: 'Nhóm 2: Toán học Trực quan', name: '12. Xây hình theo yêu cầu', engineType: 'visual_math_workbench', isOpenEnded: true, samplePrompt: 'Xây dựng một hình bất kỳ trên lưới có diện tích đúng bằng 12 ô vuông.' },

  // NHÓM 3 – SUY LUẬN LOGIC (13 - 18)
  { subTypeNumber: 13, groupCode: 'GROUP_3_LOGIC_REASONING', groupTitle: 'Nhóm 3: Suy luận Logic', name: '13. Tìm quy luật', engineType: 'logic_detective_solver', isOpenEnded: false, samplePrompt: 'Khám phá quy luật tăng gấp đôi của dãy số: 3, 6, 12, 24, [?].' },
  { subTypeNumber: 14, groupCode: 'GROUP_3_LOGIC_REASONING', groupTitle: 'Nhóm 3: Suy luận Logic', name: '14. Điền phần còn thiếu', engineType: 'logic_detective_solver', isOpenEnded: false, samplePrompt: 'Điền con số còn thiếu vào ma trận tổng hàng ngang và cột dọc đều bằng 15.' },
  { subTypeNumber: 15, groupCode: 'GROUP_3_LOGIC_REASONING', groupTitle: 'Nhóm 3: Suy luận Logic', name: '15. Giải mê cung', engineType: 'logic_detective_solver', isOpenEnded: false, samplePrompt: 'Tìm chuỗi bước đi ngắn nhất đưa Robot vượt qua mê cung 5×5 không chạm vật cản.' },
  { subTypeNumber: 16, groupCode: 'GROUP_3_LOGIC_REASONING', groupTitle: 'Nhóm 3: Suy luận Logic', name: '16. Giải bài toán có nhiều bước', engineType: 'logic_detective_solver', isOpenEnded: false, samplePrompt: 'Bước 1 tính tổng số bánh trong 3 hộp, Bước 2 chia đều cho 6 bạn nhỏ.' },
  { subTypeNumber: 17, groupCode: 'GROUP_3_LOGIC_REASONING', groupTitle: 'Nhóm 3: Suy luận Logic', name: '17. Phát hiện lỗi trong lời giải', engineType: 'logic_detective_solver', isOpenEnded: false, samplePrompt: 'Bạn Nam giải: "Hình chữ nhật 5m × 3m có diện tích là (5+3)×2 = 16 m²". Hãy chỉ ra lỗi sai!' },
  { subTypeNumber: 18, groupCode: 'GROUP_3_LOGIC_REASONING', groupTitle: 'Nhóm 3: Suy luận Logic', name: '18. So sánh nhiều phương án giải quyết', engineType: 'logic_detective_solver', isOpenEnded: true, samplePrompt: 'So sánh cách trả 15.000đ bằng (3 tờ 5.000đ) và (1 tờ 10.000đ + 1 tờ 5.000đ).' },

  // NHÓM 4 – THÍ NGHIỆM KHOA HỌC (19 - 24)
  { subTypeNumber: 19, groupCode: 'GROUP_4_SCIENCE_LAB', groupTitle: 'Nhóm 4: Thí nghiệm Khoa học', name: '19. Đưa ra giả thuyết', engineType: 'science_inquiry_lab', isOpenEnded: true, samplePrompt: 'Đặt giả thuyết điều gì xảy ra nếu ta đặt viên nước đá vào cốc nước ấm.' },
  { subTypeNumber: 20, groupCode: 'GROUP_4_SCIENCE_LAB', groupTitle: 'Nhóm 4: Thí nghiệm Khoa học', name: '20. Thay đổi một biến số', engineType: 'science_inquiry_lab', isOpenEnded: false, samplePrompt: 'Giữ nguyên lượng nước tưới, chỉ thay đổi độ sáng đèn để kiểm tra tốc độ quang hợp.' },
  { subTypeNumber: 21, groupCode: 'GROUP_4_SCIENCE_LAB', groupTitle: 'Nhóm 4: Thí nghiệm Khoa học', name: '21. Dự đoán kết quả', engineType: 'science_inquiry_lab', isOpenEnded: false, samplePrompt: 'Dự đoán xem vật có khối lượng riêng nhỏ hơn nước (như băng đá, gỗ thông) sẽ chìm hay nổi.' },
  { subTypeNumber: 22, groupCode: 'GROUP_4_SCIENCE_LAB', groupTitle: 'Nhóm 4: Thí nghiệm Khoa học', name: '22. Quan sát mô phỏng', engineType: 'science_inquiry_lab', isOpenEnded: false, samplePrompt: 'Quan sát sự thay đổi độ võng của chiếc cầu khi tăng tải trọng xe từ 10 tấn lên 30 tấn.' },
  { subTypeNumber: 23, groupCode: 'GROUP_4_SCIENCE_LAB', groupTitle: 'Nhóm 4: Thí nghiệm Khoa học', name: '23. Ghi lại kết quả', engineType: 'science_inquiry_lab', isOpenEnded: true, samplePrompt: 'Ghi chép chiều cao cây đậu ở ngày thứ 3, ngày thứ 7 và ngày thứ 14 vào bảng số liệu.' },
  { subTypeNumber: 24, groupCode: 'GROUP_4_SCIENCE_LAB', groupTitle: 'Nhóm 4: Thí nghiệm Khoa học', name: '24. Giải thích nguyên nhân', engineType: 'science_inquiry_lab', isOpenEnded: true, samplePrompt: 'Giải thích vì sao khi nước đóng băng thể tích lại nở ra làm băng nhẹ hơn nước lỏng.' },

  // NHÓM 5 – NGÔN NGỮ (25 - 30)
  { subTypeNumber: 25, groupCode: 'GROUP_5_LANGUAGE', groupTitle: 'Nhóm 5: Ngôn ngữ & Đọc hiểu', name: '25. Ghép từ thành câu', engineType: 'language_evidence_studio', isOpenEnded: true, samplePrompt: 'Sắp xếp các cụm từ để tạo thành câu văn miêu tả bầu trời đêm đầy sao.' },
  { subTypeNumber: 26, groupCode: 'GROUP_5_LANGUAGE', groupTitle: 'Nhóm 5: Ngôn ngữ & Đọc hiểu', name: '26. Sắp xếp tranh thành câu chuyện', engineType: 'language_evidence_studio', isOpenEnded: false, samplePrompt: 'Sắp xếp 4 cảnh tranh theo đúng diễn biến: Gieo hạt → Tưới nước → Cây lớn → Thu hoạch.' },
  { subTypeNumber: 27, groupCode: 'GROUP_5_LANGUAGE', groupTitle: 'Nhóm 5: Ngôn ngữ & Đọc hiểu', name: '27. Hoàn thành đoạn hội thoại', engineType: 'language_evidence_studio', isOpenEnded: false, samplePrompt: 'Chọn lời đáp lịch sự bằng tiếng Anh khi bạn hỏi mượn chiếc bút màu.' },
  { subTypeNumber: 28, groupCode: 'GROUP_5_LANGUAGE', groupTitle: 'Nhóm 5: Ngôn ngữ & Đọc hiểu', name: '28. Đọc hiểu theo tình huống', engineType: 'language_evidence_studio', isOpenEnded: false, samplePrompt: 'Đọc bản thông báo chuyến dã ngoại bảo tàng và xác định giờ tập trung cùng vật dụng cần mang.' },
  { subTypeNumber: 29, groupCode: 'GROUP_5_LANGUAGE', groupTitle: 'Nhóm 5: Ngôn ngữ & Đọc hiểu', name: '29. Tìm bằng chứng trong bài đọc', engineType: 'language_evidence_studio', isOpenEnded: false, samplePrompt: 'Bấm chọn đúng câu văn trong bài đọc chứng minh loài ong giao tiếp bằng vũ điệu.' },
  { subTypeNumber: 30, groupCode: 'GROUP_5_LANGUAGE', groupTitle: 'Nhóm 5: Ngôn ngữ & Đọc hiểu', name: '30. Viết đoạn văn sáng tạo', engineType: 'language_evidence_studio', isOpenEnded: true, samplePrompt: 'Viết 2–3 câu kể về một phát minh tương lai mà em muốn chế tạo để giúp đỡ mọi người.' },

  // NHÓM 6 – SÁNG TẠO VÀ ỨNG DỤNG (31 - 36)
  { subTypeNumber: 31, groupCode: 'GROUP_6_CREATIVE_APPLIED', groupTitle: 'Nhóm 6: Sáng tạo & Ứng dụng', name: '31. Thiết kế mô hình', engineType: 'creative_maker_canvas', isOpenEnded: true, samplePrompt: 'Lắp ghép các khối hình để thiết kế nguyên mẫu chiếc cầu hoặc trạm năng lượng sạch.' },
  { subTypeNumber: 32, groupCode: 'GROUP_6_CREATIVE_APPLIED', groupTitle: 'Nhóm 6: Sáng tạo & Ứng dụng', name: '32. Tạo sản phẩm nghệ thuật', engineType: 'creative_maker_canvas', isOpenEnded: true, samplePrompt: 'Phối màu Pastel và họa tiết đối xứng để tạo huy hiệu riêng cho Câu lạc bộ Khoa học.' },
  { subTypeNumber: 33, groupCode: 'GROUP_6_CREATIVE_APPLIED', groupTitle: 'Nhóm 6: Sáng tạo & Ứng dụng', name: '33. Xây dựng kế hoạch', engineType: 'creative_maker_canvas', isOpenEnded: true, samplePrompt: 'Lập kế hoạch 4 bước chăm sóc khu vườn nhỏ hoặc tiết kiệm mua sách trong 1 tháng.' },
  { subTypeNumber: 34, groupCode: 'GROUP_6_CREATIVE_APPLIED', groupTitle: 'Nhóm 6: Sáng tạo & Ứng dụng', name: '34. Giải quyết vấn đề thực tế', engineType: 'creative_maker_canvas', isOpenEnded: true, samplePrompt: 'Đề xuất giải pháp giảm rác thải nhựa trong buổi liên hoan lớp học.' },
  { subTypeNumber: 35, groupCode: 'GROUP_6_CREATIVE_APPLIED', groupTitle: 'Nhóm 6: Sáng tạo & Ứng dụng', name: '35. Phát triển ý tưởng mới', engineType: 'creative_maker_canvas', isOpenEnded: true, samplePrompt: 'Kết hợp năng lượng mặt trời và cảm biến độ ẩm để tạo thiết bị tưới cây tự động.' },
  { subTypeNumber: 36, groupCode: 'GROUP_6_CREATIVE_APPLIED', groupTitle: 'Nhóm 6: Sáng tạo & Ứng dụng', name: '36. Giải thích sản phẩm của mình', engineType: 'creative_maker_canvas', isOpenEnded: true, samplePrompt: 'Thuyết trình ngắn gọn vì sao thiết kế của con lại hữu ích và hoạt động hiệu quả.' },
];

// ============================================================================
// HỆ THỐNG SINH BIẾN THỂ BÀI TẬP CÓ KIỂM SOÁT (CONTROLLED VARIANT GENERATOR)
// Thay đổi cả cách tư duy và bối cảnh thực tế, không chỉ đổi số cơ học!
// ============================================================================
export type MultiplicationCognitiveMode =
  | 'visual_array'     // 1. Nhân bằng hình ảnh (Hàng × Cột khay bánh)
  | 'equal_groups'     // 2. Nhân bằng cách nhóm vật thể (Các giỏ dâu tây)
  | 'shopping_math'    // 3. Nhân trong bài toán mua hàng (Tiệm bánh/sách)
  | 'area_grid'        // 4. Nhân để tính diện tích (Luống hoa chữ nhật)
  | 'logic_riddle'     // 5. Nhân để giải câu đố suy luận
  | 'model_builder';   // 6. Nhân để xây dựng mô hình khối

export interface GeneratedExerciseVariant {
  id: string;
  cognitiveMode: MultiplicationCognitiveMode;
  difficulty: 1 | 2 | 3;
  title: string;
  contextStory: string;
  questionPrompt: string;
  factorA: number;
  factorB: number;
  expectedProduct: number;
  allowCommutativeSwap: boolean;
  hints: string[];
  explanationAfterCompletion: string;
  verifiedSolvable: true;
}

/**
 * Sinh biến thể bài tập Phép Nhân có kiểm soát theo 6 bối cảnh tư duy khác nhau
 * Đảm bảo tham số hợp lý, luôn giải được và có kiểm tra đáp án bằng thuật toán
 */
export function generateControlledMultiplicationVariant(
  mode: MultiplicationCognitiveMode,
  difficulty: 1 | 2 | 3 = 2,
  seedIndex = 0
): GeneratedExerciseVariant {
  const PAIRS_BY_DIFFICULTY: Record<1 | 2 | 3, [number, number][]> = {
    1: [
      [2, 3],
      [2, 4],
      [3, 3],
      [2, 5],
    ],
    2: [
      [3, 4],
      [4, 5],
      [3, 6],
      [4, 4],
    ],
    3: [
      [6, 4],
      [5, 7],
      [6, 6],
      [7, 4],
    ],
  };

  const pairs = PAIRS_BY_DIFFICULTY[difficulty];
  const [a, b] = pairs[Math.abs(seedIndex) % pairs.length];
  const product = a * b;

  switch (mode) {
    case 'visual_array':
      return {
        id: `var-mul-array-${difficulty}-${a}x${b}`,
        cognitiveMode: mode,
        difficulty,
        title: 'Biến thể 1: Nhân bằng Hình ảnh Mảng (Khay bánh Cupcake)',
        contextStory: `Trong tiệm bánh Pastel, cô đầu bếp xếp bánh cupcake thành ${a} hàng đều nhau, mỗi hàng có ${b} chiếc bánh.`,
        questionPrompt: `Con hãy xếp khay bánh ${a} hàng × ${b} cột và cho biết có tất cả bao nhiêu chiếc bánh?`,
        factorA: a,
        factorB: b,
        expectedProduct: product,
        allowCommutativeSwap: true,
        hints: [
          `Mỗi hàng có ${b} chiếc bánh. Có ${a} hàng như vậy nghĩa là cộng ${b} lặp lại ${a} lần.`,
          `Con có thể đếm theo hàng: ${Array.from({ length: a }, (_, i) => (i + 1) * b).join(' → ')}.`,
        ],
        explanationAfterCompletion: `Bản chất phép nhân trên mảng hình ảnh: ${a} hàng × ${b} bánh mỗi hàng = ${product} chiếc bánh (${b} được lấy ${a} lần).`,
        verifiedSolvable: true,
      };

    case 'equal_groups':
      return {
        id: `var-mul-groups-${difficulty}-${a}x${b}`,
        cognitiveMode: mode,
        difficulty,
        title: 'Biến thể 2: Nhân bằng Nhóm Vật thể (Giỏ Dâu Tây)',
        contextStory: `Bạn Linh hái dâu tây trong vườn và chia đều vào ${a} chiếc giỏ mây, mỗi giỏ có đúng ${b} quả dâu chín đỏ.`,
        questionPrompt: `Tổng số quả dâu tây trong ${a} giỏ (mỗi giỏ ${b} quả) là bao nhiêu?`,
        factorA: a,
        factorB: b,
        expectedProduct: product,
        allowCommutativeSwap: false,
        hints: [
          `Ở đây ${b} quả được lấy ${a} lần: ${Array.from({ length: a }, () => b).join(' + ')}.`,
          `Ta viết gọn phép cộng các nhóm bằng nhau thành phép nhân: ${b} × ${a} = ${product}.`,
        ],
        explanationAfterCompletion: `Khi các nhóm có số lượng bằng nhau (${a} giỏ, mỗi giỏ ${b} quả), phép nhân giúp tính tổng nhanh chóng mà không cần cộng từng giỏ một: ${a} × ${b} = ${product}.`,
        verifiedSolvable: true,
      };

    case 'shopping_math':
      return {
        id: `var-mul-shop-${difficulty}-${a}x${b}`,
        cognitiveMode: mode,
        difficulty,
        title: 'Biến thể 3: Nhân trong Bài toán Mua hàng Thực tế',
        contextStory: `Tại hiệu sách Thiếu nhi, mỗi quyển sổ vẽ nhỏ có giá ${b} xu thông thái. Bạn Mai mua ${a} quyển sổ để tặng nhóm bạn dự án khoa học.`,
        questionPrompt: `Bạn Mai cần trả tất cả bao nhiêu xu cho ${a} quyển sổ (giá ${b} xu/quyển)?`,
        factorA: a,
        factorB: b,
        expectedProduct: product,
        allowCommutativeSwap: true,
        hints: [
          `Tổng tiền = Đơn giá 1 quyển (${b} xu) × Số lượng mua (${a} quyển).`,
          `Thử nhẩm ${b} × ${a}: kết quả là ${product} xu.`,
        ],
        explanationAfterCompletion: `Trong tài chính và mua sắm, Tổng chi phí = Đơn giá (${b} xu) × Số lượng (${a}) = ${product} xu.`,
        verifiedSolvable: true,
      };

    case 'area_grid':
      return {
        id: `var-mul-area-${difficulty}-${a}x${b}`,
        cognitiveMode: mode,
        difficulty,
        title: 'Biến thể 4: Nhân để Tính Diện tích Khu vườn',
        contextStory: `Khu vườn hoa oải hương hình chữ nhật có chiều rộng ${a} mét và chiều dài ${b} mét. Mỗi ô vuông 1m × 1m trồng được 1 khóm hoa.`,
        questionPrompt: `Diện tích khu vườn (${a}m × ${b}m) bằng bao nhiêu mét vuông (m²)?`,
        factorA: a,
        factorB: b,
        expectedProduct: product,
        allowCommutativeSwap: true,
        hints: [
          `Chia khu vườn thành lưới ô vuông 1 m²: có ${a} dải ngang, mỗi dải có ${b} ô vuông.`,
          `Diện tích S = ${a} × ${b} = ${product} m².`,
        ],
        explanationAfterCompletion: `Phép nhân hai độ dài (${a}m × ${b}m) tạo ra đại lượng hai chiều là Diện tích: ${product} m².`,
        verifiedSolvable: true,
      };

    case 'logic_riddle':
      return {
        id: `var-mul-riddle-${difficulty}-${a}x${b}`,
        cognitiveMode: mode,
        difficulty,
        title: 'Biến thể 5: Nhân để Giải Câu đố Suy luận Mật mã',
        contextStory: `Chiếc rương kho báu tri thức có mật mã là một số. Biết rằng số đó gấp ${a} lần số cánh của một bông hoa ${b} cánh.`,
        questionPrompt: `Mật mã mở chiếc rương kho báu (${a} lần của ${b}) là số nào?`,
        factorA: a,
        factorB: b,
        expectedProduct: product,
        allowCommutativeSwap: true,
        hints: [
          `"Gấp ${a} lần của ${b}" nghĩa là lấy ${b} nhân với ${a}.`,
          `Kiểm tra lại: nếu lấy mật mã chia cho ${a} thì phải ra đúng ${b}.`,
        ],
        explanationAfterCompletion: `Trong ngôn ngữ toán học, "gấp ${a} lần của ${b}" tương ứng với phép nhân ${b} × ${a} = ${product}.`,
        verifiedSolvable: true,
      };

    case 'model_builder':
      return {
        id: `var-mul-model-${difficulty}-${a}x${b}`,
        cognitiveMode: mode,
        difficulty,
        title: 'Biến thể 6: Nhân để Xây dựng Mô hình Tháp Khối',
        contextStory: `Để dựng mô hình tòa tháp xanh, con cần xây ${a} tầng bằng nhau, mỗi tầng lắp ghép từ ${b} khối gỗ vuông.`,
        questionPrompt: `Con hãy chọn bất kỳ thiết kế tầng × khối mỗi tầng nào có tổng đúng bằng ${product} khối gỗ!`,
        factorA: a,
        factorB: b,
        expectedProduct: product,
        allowCommutativeSwap: true,
        hints: [
          `Con có thể xây ${a} tầng × ${b} khối, hoặc ${b} tầng × ${a} khối, hoặc bất kỳ cặp thừa số nào nhân với nhau bằng ${product}!`,
        ],
        explanationAfterCompletion: `Một tổng số khối (${product}) có thể được thiết kế thành nhiều cấu trúc mô hình khác nhau dựa trên các ước số của ${product}!`,
        verifiedSolvable: true,
      };
  }
}

/**
 * Thuật toán chấm điểm chuẩn xác cho biến thể bài tập sinh tự động
 */
export function verifyGeneratedVariantSubmission(
  variant: GeneratedExerciseVariant,
  submittedFactorA: number,
  submittedFactorB: number,
  submittedProduct: number
): {
  isCorrect: boolean;
  feedback: string;
  proof: string;
} {
  const actualProduct = submittedFactorA * submittedFactorB;

  if (submittedProduct !== variant.expectedProduct) {
    return {
      isCorrect: false,
      feedback: `Kết quả con chọn là ${submittedProduct}, chưa bằng đáp án đúng (${variant.expectedProduct}). Con hãy kiểm tra lại ${variant.factorA} nhóm × ${variant.factorB} nhé!`,
      proof: `Mục tiêu: ${variant.factorA} × ${variant.factorB} = ${variant.expectedProduct}.`,
    };
  }

  // Với bài toán thiết kế mô hình mở (model_builder), chấp nhận mọi cặp thừa số có tích bằng expectedProduct!
  if (variant.cognitiveMode === 'model_builder' && actualProduct === variant.expectedProduct) {
    return {
      isCorrect: true,
      feedback: `Sáng tạo tuyệt vời! Mô hình ${submittedFactorA} tầng × ${submittedFactorB} khối sử dụng đúng ${variant.expectedProduct} khối gỗ!`,
      proof: `${submittedFactorA} × ${submittedFactorB} = ${variant.expectedProduct}.`,
    };
  }

  const factorsMatch =
    (submittedFactorA === variant.factorA && submittedFactorB === variant.factorB) ||
    (variant.allowCommutativeSwap &&
      submittedFactorA === variant.factorB &&
      submittedFactorB === variant.factorA);

  if (!factorsMatch) {
    return {
      isCorrect: false,
      feedback: `Tổng tích ${submittedProduct} đã đúng, nhưng mô hình đang để ${submittedFactorA} × ${submittedFactorB} thay vì ${variant.factorA} × ${variant.factorB}.`,
      proof: `Cần biểu diễn đúng bối cảnh ${variant.factorA} × ${variant.factorB} = ${variant.expectedProduct}.`,
    };
  }

  return {
    isCorrect: true,
    feedback: `Chính xác tuyệt đối! ${variant.explanationAfterCompletion}`,
    proof: `${submittedFactorA} × ${submittedFactorB} = ${submittedProduct}.`,
  };
}
