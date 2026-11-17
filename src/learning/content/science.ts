// Little Genius – Focused Learning: Bản đồ chủ đề môn Khoa học
import type { FocusLesson, FocusTopic } from '../types.ts';

export const SCIENCE_TOPICS: FocusTopic[] = [
  {
    id: 'science-t1',
    subject: 'science',
    order: 1,
    title: 'Cơ thể người & các giác quan',
    icon: '🫀',
    lessons: [
      { id: 'science-t1-l1', title: 'Năm giác quan kỳ diệu', objective: 'Nhận biết vai trò của 5 giác quan và cách bảo vệ các giác quan.' },
      { id: 'science-t1-l2', title: 'Hệ hô hấp và tuần hoàn', objective: 'Hiểu đường đi của không khí và máu trong cơ thể.' },
      { id: 'science-t1-l3', title: 'Bộ xương và cơ bắp', objective: 'Biết tư thế ngồi học đúng để bảo vệ cột sống.' },
    ],
  },
  {
    id: 'science-t2',
    subject: 'science',
    order: 2,
    title: 'Dinh dưỡng, sức khỏe & vệ sinh',
    icon: '🥗',
    lessons: [
      { id: 'science-t2-l1', title: 'Bốn nhóm chất dinh dưỡng', objective: 'Phân loại thực phẩm theo nhóm chất và thiết kế bữa ăn cân đối.' },
      { id: 'science-t2-l2', title: 'An toàn vệ sinh thực phẩm', objective: 'Biết cách chọn thực phẩm tươi sạch và ăn chín uống sôi.' },
      { id: 'science-t2-l3', title: 'Giấc ngủ và vận động mỗi ngày', objective: 'Hiểu vì sao trẻ em cần ngủ đủ giấc và tập thể dục.' },
    ],
  },
  {
    id: 'science-t3',
    subject: 'science',
    order: 3,
    title: 'Thực vật & quá trình phát triển',
    icon: '🌱',
    lessons: [
      { id: 'science-t3-l1', title: 'Vì sao cây cần ánh sáng và nước?', objective: 'Thử nghiệm điều kiện ánh sáng, nước đối với sự quang hợp và phát triển của cây.' },
      { id: 'science-t3-l2', title: 'Rễ, thân, lá, hoa và quả', objective: 'Xác định chức năng của từng bộ phận trên cây xanh.' },
      { id: 'science-t3-l3', title: 'Hành trình từ hạt mầm thành cây', objective: 'Sắp xếp các giai đoạn nảy mầm và lớn lên của thực vật.' },
    ],
  },
  {
    id: 'science-t4',
    subject: 'science',
    order: 4,
    title: 'Động vật & môi trường sống',
    icon: '🐬',
    lessons: [
      { id: 'science-t4-l1', title: 'Vì sao động vật có môi trường sống khác nhau?', objective: 'Liên hệ đặc điểm cơ thể của loài vật với môi trường sống (cạn, nước, không trung).' },
      { id: 'science-t4-l2', title: 'Chuỗi thức ăn trong tự nhiên', objective: 'Hiểu mối liên hệ thức ăn giữa thực vật, động vật ăn cỏ và động vật ăn thịt.' },
      { id: 'science-t4-l3', title: 'Bảo vệ các loài động vật hoang dã', objective: 'Biết những việc nên làm để giữ gìn ngôi nhà chung của muôn loài.' },
    ],
  },
  {
    id: 'science-t5',
    subject: 'science',
    order: 5,
    title: 'Nước & các trạng thái của nước',
    icon: '💧',
    lessons: [
      { id: 'science-t5-l1', title: 'Điều gì xảy ra khi nước đóng băng hay sôi?', objective: 'Quan sát sự chuyển thể rắn – lỏng – khí của nước theo nhiệt độ.' },
      { id: 'science-t5-l2', title: 'Vì sao vật nổi hoặc chìm?', objective: 'Dự đoán và thử nghiệm các vật nổi hay chìm trong nước.' },
      { id: 'science-t5-l3', title: 'Tiết kiệm và bảo vệ nguồn nước sạch', objective: 'Nhận biết tầm quan trọng của nước sạch đối với sự sống.' },
    ],
  },
  {
    id: 'science-t6',
    subject: 'science',
    order: 6,
    title: 'Thời tiết, mây, mưa & vòng tuần hoàn nước',
    icon: '🌦️',
    lessons: [
      { id: 'science-t6-l1', title: 'Vì sao có mưa? – Vòng tuần hoàn nước', objective: 'Hiểu 4 quá trình: bay hơi, ngưng tụ thành mây, mưa rơi và dòng chảy.' },
      { id: 'science-t6-l2', title: 'Vì sao cầu vồng xuất hiện sau cơn mưa?', objective: 'Khám phá hiện tượng ánh sáng Mặt Trời chiếu qua những giọt nước mưa.' },
      { id: 'science-t6-l3', title: 'Ứng phó an toàn khi có giông bão', objective: 'Thực hành kỹ năng phòng tránh thiên tai an toàn.' },
    ],
  },
  {
    id: 'science-t7',
    subject: 'science',
    order: 7,
    title: 'Ánh sáng, âm thanh, lực & nam châm',
    icon: '🧲',
    lessons: [
      { id: 'science-t7-l1', title: 'Nam châm hút những vật nào?', objective: 'Thử nghiệm và phân biệt vật bằng sắt/thép bị nam châm hút với nhựa, gỗ, nhôm.' },
      { id: 'science-t7-l2', title: 'Vì sao bóng của vật thay đổi độ dài?', objective: 'Quan sát hướng chiếu sáng và sự thay đổi bóng từ sáng tới chiều.' },
      { id: 'science-t7-l3', title: 'Âm thanh truyền đi như thế nào?', objective: 'Hiểu âm thanh sinh ra từ sự rung động và truyền qua không khí, nước, vật rắn.' },
    ],
  },
  {
    id: 'science-t8',
    subject: 'science',
    order: 8,
    title: 'Trái Đất, Mặt Trăng, Mặt Trời & Hệ Mặt Trời',
    icon: '🌍',
    lessons: [
      { id: 'science-t8-l1', title: 'Vì sao Mặt Trăng thay đổi hình dạng?', objective: 'Hiểu Mặt Trăng phản chiếu ánh sáng Mặt Trời và các pha tròn – khuyết.' },
      { id: 'science-t8-l2', title: 'Vì sao có ngày và đêm trên Trái Đất?', objective: 'Giải thích hiện tượng ngày và đêm nhờ sự tự quay của Trái Đất.' },
      { id: 'science-t8-l3', title: 'Các hành tinh trong Hệ Mặt Trời', objective: 'Nhận biết Trái Đất và các hành tinh quay quanh Mặt Trời.' },
    ],
  },
];

export const SCIENCE_LESSONS: FocusLesson[] = [];
