// Little Genius – Focused Learning: Bản đồ chủ đề môn Câu đố & Tư duy logic
import type { FocusLesson, FocusTopic } from '../types.ts';

export const LOGIC_TOPICS: FocusTopic[] = [
  {
    id: 'logic-t1',
    subject: 'logic',
    order: 1,
    title: 'Dãy số bí ẩn & Quy luật số',
    icon: '🔢',
    lessons: [
      { id: 'logic-t1-l1', title: 'Khám phá quy luật dãy số nhân đôi', objective: 'Nhận ra quy luật cộng thêm hoặc nhân lên trong dãy số và tự tạo dãy số mới.' },
      { id: 'logic-t1-l2', title: 'Dãy số đan xen hai quy luật', objective: 'Phân tích dãy số ở vị trí chẵn và vị trí lẻ.' },
      { id: 'logic-t1-l3', title: 'Bậc thang số học', objective: 'Tìm số còn thiếu trong tháp số theo quy luật tổng hai ô dưới bằng ô trên.' },
    ],
  },
  {
    id: 'logic-t2',
    subject: 'logic',
    order: 2,
    title: 'Quy luật hình ảnh, màu sắc & Vật khác biệt',
    icon: '🎨',
    lessons: [
      { id: 'logic-t2-l1', title: 'Chuỗi hình ảnh và màu sắc lặp lại', objective: 'Xác định chu kỳ lặp của hình dạng, màu sắc và điền hình tiếp theo.' },
      { id: 'logic-t2-l2', title: 'Tìm vật thể khác biệt', objective: 'So sánh đặc điểm chung để tìm ra phần tử không cùng nhóm.' },
      { id: 'logic-t2-l3', title: 'Bảng ma trận hình học 3×3', objective: 'Suy luận theo hàng và cột để chọn mảnh ghép còn thiếu.' },
    ],
  },
  {
    id: 'logic-t3',
    subject: 'logic',
    order: 3,
    title: 'Sudoku trẻ em & Ô logic',
    icon: '🧩',
    lessons: [
      { id: 'logic-t3-l1', title: 'Sudoku 4×4: Không trùng hàng, cột, khối', objective: 'Giải bảng Sudoku 4×4 bằng phương pháp loại trừ từng hàng, cột và ô 2×2.' },
      { id: 'logic-t3-l2', title: 'Sudoku biểu tượng trái cây', objective: 'Điền biểu tượng còn thiếu vào bảng 4×4 có nghiệm duy nhất.' },
      { id: 'logic-t3-l3', title: 'Ô vuông kỳ diệu', objective: 'Điền số sao cho tổng mỗi hàng và mỗi cột đều bằng nhau.' },
    ],
  },
  {
    id: 'logic-t4',
    subject: 'logic',
    order: 4,
    title: 'Mê cung & Tìm đường ngắn nhất',
    icon: '🗺️',
    lessons: [
      { id: 'logic-t4-l1', title: 'Lập kế hoạch vượt mê cung', objective: 'Tìm đường đi ngắn nhất từ điểm xuất phát tới đích mà không đi vào ngõ cụt.' },
      { id: 'logic-t4-l2', title: 'Robot nhặt sao theo lệnh', objective: 'Sắp xếp chuỗi lệnh di chuyển để thu thập đủ sao.' },
      { id: 'logic-t4-l3', title: 'Cây cầu một chiều', objective: 'Tìm lộ trình đi qua các điểm đúng quy tắc.' },
    ],
  },
  {
    id: 'logic-t5',
    subject: 'logic',
    order: 5,
    title: 'Ghép hình Tangram & Tư duy không gian',
    icon: '📐',
    lessons: [
      { id: 'logic-t5-l1', title: 'Ghép hình từ các mảnh tam giác và vuông', objective: 'Tưởng tượng phép xoay và ghép các mảnh hình phẳng.' },
      { id: 'logic-t5-l2', title: 'Hình phản chiếu qua gương', objective: 'Nhận diện hình đối xứng qua trục dọc và trục ngang.' },
      { id: 'logic-t5-l3', title: 'Đếm khối lập phương ẩn', objective: 'Quan sát hình khối 3D và đếm đủ cả những khối bị che khuất.' },
    ],
  },
  {
    id: 'logic-t6',
    subject: 'logic',
    order: 6,
    title: 'Suy luận từ các manh mối',
    icon: '🕵️‍♀️',
    lessons: [
      { id: 'logic-t6-l1', title: 'Thám tử nhí: Kết hợp các manh mối', objective: 'Loại trừ các khả năng mâu thuẫn để tìm ra đáp án duy nhất đúng.' },
      { id: 'logic-t6-l2', title: 'Ai về đích trước?', objective: 'Sắp xếp thứ tự dựa trên các câu so sánh gián tiếp.' },
      { id: 'logic-t6-l3', title: 'Chiếc hộp bí mật nào chứa kho báu?', objective: 'Phân tích lời gợi ý đúng – sai để mở đúng chiếc hộp.' },
    ],
  },
  {
    id: 'logic-t7',
    subject: 'logic',
    order: 7,
    title: 'Tìm lỗi trong kế hoạch & Sửa phương án',
    icon: '🛠️',
    lessons: [
      { id: 'logic-t7-l1', title: 'Phát hiện bước sai trong quy trình', objective: 'Tìm bước bị ngược thứ tự hoặc sai quy tắc trong một kế hoạch.' },
      { id: 'logic-t7-l2', title: 'Cân bằng hai đĩa cân', objective: 'Suy luận khối lượng từ trạng thái thăng bằng của cân.' },
      { id: 'logic-t7-l3', title: 'Kiểm tra điều kiện đủ', objective: 'Nhận biết khi nào đã đủ thông tin để kết luận.' },
    ],
  },
  {
    id: 'logic-t8',
    subject: 'logic',
    order: 8,
    title: 'Câu đố mở & Tư duy sáng tạo',
    icon: '💡',
    lessons: [
      { id: 'logic-t8-l1', title: 'Ba cách sử dụng một chiếc hộp & Giải pháp mở', objective: 'Tư duy linh hoạt để tìm nhiều phương án hợp lý cho một vấn đề thực tế.' },
      { id: 'logic-t8-l2', title: 'Làm sao xây cầu bằng ít vật liệu hơn?', objective: 'Tối ưu hóa kết cấu tam giác để tiết kiệm vật liệu mà vẫn vững chắc.' },
      { id: 'logic-t8-l3', title: 'Nếu một quy tắc thay đổi thì sao?', objective: 'Dự đoán kết quả mới khi thay đổi một quy tắc ban đầu.' },
    ],
  },
];

export const LOGIC_LESSONS: FocusLesson[] = [];
