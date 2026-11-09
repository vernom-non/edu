// ============================================================================
// Little Genius – Dữ liệu 10 Hành Trình Tò Mò (Curiosity Engine Data)
// Tách biệt dữ liệu câu hỏi tò mò khỏi React component
// ============================================================================

export interface CuriosityTopic {
  id: string;
  icon: string;
  question: string;
  domain: string;
  predictionOptions: { id: string; text: string; isScientific: boolean }[];
  experimentVariableLabel: string;
  observationSummary: string;
  discoveryCore: string;
  scientificExplanation: string;
  realLifeApplication: string;
  simplificationDisclaimer: string;
}

export const CURIOSITY_10_LIBRARY: CuriosityTopic[] = [
  {
    id: 'cur-bridge',
    icon: '🌉',
    question: 'Làm sao xây một chiếc cầu chắc chắn?',
    domain: 'Kỹ thuật & Vật lý Lực',
    predictionOptions: [
      { id: 'p1', text: 'Kết hợp vật liệu bền (thép/bê tông), thêm trụ đỡ giảm nhịp cầu và khung giằng hình tam giác.', isScientific: true },
      { id: 'p2', text: 'Cầu càng dài và càng ít trụ đỡ thì càng ít bị võng.', isScientific: false },
    ],
    experimentVariableLabel: 'Thay đổi vật liệu, chiều dài nhịp cầu, số trụ đỡ và tải trọng xe',
    observationSummary: 'Khi tăng chiều dài nhịp cầu mà không có trụ đỡ giữa, độ võng tăng nhanh. Thêm trụ đỡ và giằng tam giác giúp phân tán lực nén và lực kéo.',
    discoveryCore: 'Hình tam giác là hình học cứng vững nhất vì không bị biến dạng khi chịu lực ở các đỉnh.',
    scientificExplanation: 'Trọng lực kéo mặt cầu xuống tạo ra lực uốn. Các trụ đỡ chia nhịp dài thành nhiều nhịp ngắn, còn khung giằng tam giác phân phối lực đều xuống móng cầu.',
    realLifeApplication: 'Quan sát cầu Nhật Tân, cầu Rồng hoặc cầu Long Biên, con sẽ thấy các khung thép hình tam giác và hệ dây văng/trụ đỡ vững chãi.',
    simplificationDisclaimer: 'Lưu ý mô hình đơn giản hóa: Mô phỏng 2D tính toán độ võng tương đối để minh họa nguyên lý nhịp cầu và trụ đỡ, không thay thế tính toán kết cấu xây dựng thực tế.',
  },
  {
    id: 'cur-moon',
    icon: '🌙',
    question: 'Vì sao trăng thay đổi hình dạng (Trăng tròn, Trăng khuyết)?',
    domain: 'Thiên văn học',
    predictionOptions: [
      { id: 'p1', text: 'Do Mặt Trăng quay quanh Trái Đất nên góc nhìn thấy phần Mặt Trăng được Mặt Trời chiếu sáng thay đổi.', isScientific: true },
      { id: 'p2', text: 'Do Mặt Trăng tự co nhỏ lại rồi phình to ra mỗi tháng.', isScientific: false },
    ],
    experimentVariableLabel: 'Thay đổi vị trí Mặt Trăng trên quỹ đạo 29,5 ngày quanh Trái Đất',
    observationSummary: 'Mặt Trăng luôn có một nửa được Mặt Trời chiếu sáng, nhưng từ Trái Đất ta chỉ nhìn thấy một phần của nửa sáng đó tùy ngày âm lịch.',
    discoveryCore: 'Mặt Trăng không tự phát sáng mà phản chiếu ánh sáng Mặt Trời!',
    scientificExplanation: 'Khi Mặt Trăng nằm ở phía đối diện Mặt Trời qua Trái Đất (ngày Rằm 15 âm lịch), ta thấy trọn vẹn nửa được chiếu sáng (Trăng tròn).',
    realLifeApplication: 'Con có thể nhìn lịch âm – dương và quan sát bầu trời đêm vào ngày mùng 1, mùng 8 và ngày 15 hàng tháng.',
    simplificationDisclaimer: 'Lưu ý mô hình: Khoảng cách và kích thước giữa Mặt Trời – Trái Đất – Mặt Trăng được thu gọn để hiển thị trên cùng một màn hình.',
  },
  {
    id: 'cur-rainbow',
    icon: '🌈',
    question: 'Vì sao cầu vồng có nhiều màu?',
    domain: 'Quang học & Ánh sáng',
    predictionOptions: [
      { id: 'p1', text: 'Ánh sáng trắng Mặt Trời đi qua các giọt nước mưa bị khúc xạ và tách thành dải 7 màu sắc.', isScientific: true },
      { id: 'p2', text: 'Do các đám mây tự sơn màu lên bầu trời sau cơn mưa.', isScientific: false },
    ],
    experimentVariableLabel: 'Chiếu tia sáng trắng qua giọt nước / lăng kính thủy tinh',
    observationSummary: 'Tia sáng trắng khi đi qua giọt nước bị bẻ cong (khúc xạ) ở các góc hơi khác nhau tùy theo màu sắc (Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím).',
    discoveryCore: 'Ánh sáng Mặt Trời tưởng như không màu nhưng thực chất là sự pha trộn của tất cả các màu sắc cầu vồng!',
    scientificExplanation: 'Hiện tượng tán sắc ánh sáng xảy ra khi ánh sáng truyền qua môi trường trong suốt như giọt mưa đóng vai trò như hàng triệu lăng kính nhỏ.',
    realLifeApplication: 'Khi tưới cây dưới nắng sớm và đứng quay lưng về phía Mặt Trời, con cũng có thể nhìn thấy cầu vồng nhỏ trong làn sương nước!',
    simplificationDisclaimer: 'Mô hình minh họa 7 dải màu tiêu biểu; trong thực tế phổ màu chuyển tiếp liên tục.',
  },
  {
    id: 'cur-ice',
    icon: '🧊',
    question: 'Vì sao băng nổi trên nước?',
    domain: 'Vật lý & Hóa học Nước',
    predictionOptions: [
      { id: 'p1', text: 'Khi đóng băng, các phân tử nước xếp thành cấu trúc lục giác rỗng làm băng nhẹ hơn cùng một thể tích nước lỏng.', isScientific: true },
      { id: 'p2', text: 'Vì băng nóng hơn nước.', isScientific: false },
    ],
    experimentVariableLabel: 'Hạ nhiệt độ nước xuống 0°C và quan sát mật độ phân tử',
    observationSummary: 'Ở 0°C, nước đóng băng và nở thể tích thêm khoảng 9%. Khối lượng riêng của băng (~0,92 g/cm³) nhỏ hơn nước lỏng (1,00 g/cm³).',
    discoveryCore: 'Hầu hết các chất rắn đều nặng hơn chất lỏng của nó, riêng Nước là ngoại lệ kỳ diệu của tự nhiên!',
    scientificExplanation: 'Nhờ băng nổi trên mặt hồ vào mùa đông, lớp băng phía trên giống như chiếc chăn cách nhiệt giữ cho nước bên dưới không bị đóng băng hoàn toàn, bảo vệ các loài cá!',
    realLifeApplication: 'Khi làm đá trong tủ lạnh, không nên đổ nước đầy tràn khay hay chai thủy tinh kín vì nước đóng băng sẽ nở ra.',
    simplificationDisclaimer: 'Mô hình biểu diễn mạng phân tử 2D đơn giản hóa từ cấu trúc tinh thể 3 chiều.',
  },
  {
    id: 'cur-bee',
    icon: '🐝',
    question: 'Làm thế nào con ong tìm được đường về và báo tin cho cả đàn?',
    domain: 'Sinh học & Tập tính Động vật',
    predictionOptions: [
      { id: 'p1', text: 'Ong định vị dựa vào vị trí Mặt Trời, mùi hương và nhảy "vũ điệu hình số 8" để chỉ hướng cho đàn.', isScientific: true },
      { id: 'p2', text: 'Ong rải vụn bánh mì dọc đường bay.', isScientific: false },
    ],
    experimentVariableLabel: 'Thay đổi góc của vườn hoa so với Mặt Trời và tổ ong',
    observationSummary: 'Góc nghiêng của đường chạy giữa hình số 8 so với phương thẳng đứng trong tổ trùng khớp với góc giữa vườn hoa và Mặt Trời!',
    discoveryCore: 'Loài ong sử dụng Hình học góc và Tọa độ Mặt Trời để truyền tin chính xác mà không cần lời nói!',
    scientificExplanation: 'Nhà khoa học Karl von Frisch đã giải mã ngôn ngữ vũ điệu của ong mật: thời gian lắc bụng cho biết khoảng cách, còn góc nghiêng cho biết hướng bay.',
    realLifeApplication: 'Các kỹ sư robot học hỏi cách định hướng của loài ong để thiết kế robot tự hành.',
    simplificationDisclaimer: 'Mô phỏng biểu diễn góc 2D trên mặt phẳng.',
  },
  {
    id: 'cur-plane',
    icon: '✈️',
    question: 'Vì sao máy bay nặng hàng chục tấn lại có thể bay trên bầu trời?',
    domain: 'Khí động lực học',
    predictionOptions: [
      { id: 'p1', text: 'Nhờ động cơ đẩy máy bay tiến nhanh về phía trước và hình dáng cánh máy bay tạo ra lực nâng lớn hơn trọng lực.', isScientific: true },
      { id: 'p2', text: 'Vì trên cao không còn lực hút của Trái Đất.', isScientific: false },
    ],
    experimentVariableLabel: 'Tăng vận tốc gió qua cánh máy bay và góc nghiêng cánh',
    observationSummary: 'Không khí lướt qua mặt trên cong của cánh nhanh hơn mặt dưới, tạo chênh lệch áp suất đẩy cánh máy bay hướng lên trên (Lực nâng).',
    discoveryCore: 'Bốn lực tác dụng lên máy bay: Lực đẩy (tiến tới), Lực cản (không khí), Trọng lực (kéo xuống) và Lực nâng (nâng lên).',
    scientificExplanation: 'Khi Lực nâng thắng Trọng lực và Lực đẩy thắng Lực cản, máy bay cất cánh bay lên bầu trời.',
    realLifeApplication: 'Con có thể gấp máy bay giấy có phần cánh hơi cong nhẹ và thử phóng ở các góc khác nhau để quan sát đường bay.',
    simplificationDisclaimer: 'Mô hình đơn giản hóa dòng khí 2D qua mặt cắt cánh.',
  },
  {
    id: 'cur-robot',
    icon: '🤖',
    question: 'Làm thế nào robot biết đi và tránh vật cản?',
    domain: 'Robotics & Lập trình',
    predictionOptions: [
      { id: 'p1', text: 'Nhờ sự kết hợp giữa Cảm biến (nhận biết môi trường), Bộ xử lý (chạy thuật toán) và Động cơ (cử động khớp).', isScientific: true },
      { id: 'p2', text: 'Do có người tí hon ngồi bên trong điều khiển.', isScientific: false },
    ],
    experimentVariableLabel: 'Thử nghiệm vòng lặp: Cảm nhận (Sense) → Suy nghĩ (Think) → Hành động (Act)',
    observationSummary: 'Cảm biến siêu âm/hồng ngoại đo khoảng cách tới bức tường, gửi số liệu về vi xử lý để kích hoạt động cơ đổi hướng.',
    discoveryCore: 'Mọi robot thông minh đều vận hành theo chu trình: Cảm biến → Thuật toán → Cơ cấu chấp hành.',
    scientificExplanation: 'Động cơ điện biến đổi năng lượng điện thành chuyển động quay các bánh xe hoặc khớp chân robot.',
    realLifeApplication: 'Robot hút bụi trong nhà tự động quay đầu khi chạm tường chính là nhờ nguyên lý này!',
    simplificationDisclaimer: 'Mô hình tập trung vào chu trình điều khiển logic cơ bản.',
  },
  {
    id: 'cur-lightning',
    icon: '⚡',
    question: 'Vì sao có sấm sét trong cơn giông và vì sao ta thấy chớp trước khi nghe tiếng sấm?',
    domain: 'Vật lý Điện & Âm thanh',
    predictionOptions: [
      { id: 'p1', text: 'Do phóng điện giữa các đám mây tích điện; ánh sáng truyền nhanh hơn âm thanh rất nhiều nên ta thấy chớp trước.', isScientific: true },
      { id: 'p2', text: 'Do chớp xảy ra trước, còn sấm xảy ra sau đó vài phút.', isScientific: false },
    ],
    experimentVariableLabel: 'Đếm số giây từ lúc thấy tia chớp đến lúc nghe tiếng sấm',
    observationSummary: 'Ánh sáng truyền với vận tốc ~300.000 km/s (thấy gần như tức thì), còn âm thanh trong không khí truyền với vận tốc ~340 m/s (khoảng 3 giây đi được 1 km).',
    discoveryCore: 'Nếu đếm được 6 giây từ lúc thấy chớp đến lúc nghe sấm, vị trí sét đánh cách ta khoảng 6 ÷ 3 = 2 km!',
    scientificExplanation: 'Các hạt băng và nước trong mây va chạm tạo điện tích. Khi hiệu điện thế quá lớn, dòng điện phóng qua không khí làm không khí giãn nở đột ngột phát ra tiếng nổ (sấm).',
    realLifeApplication: 'Quy tắc an toàn khi có giông sét: Ở trong nhà kiên cố, tránh đứng dưới cây cao đơn độc hoặc cánh đồng trống.',
    simplificationDisclaimer: 'Vận tốc âm thanh lấy xấp xỉ 340 m/s ở nhiệt độ phòng.',
  },
  {
    id: 'cur-leaf',
    icon: '🌿',
    question: 'Vì sao lá cây thường có màu xanh lục?',
    domain: 'Sinh học & Quang phổ',
    predictionOptions: [
      { id: 'p1', text: 'Vì chất diệp lục trong lá hấp thụ mạnh ánh sáng đỏ và xanh lam để quang hợp, đồng thời phản xạ ánh sáng xanh lục vào mắt ta.', isScientific: true },
      { id: 'p2', text: 'Vì nước mưa có màu xanh thấm vào lá.', isScientific: false },
    ],
    experimentVariableLabel: 'Quan sát sự hấp thụ ánh sáng của chất diệp lục (Chlorophyll)',
    observationSummary: 'Màu sắc của một vật mà mắt ta nhìn thấy chính là màu ánh sáng mà vật đó phản xạ lại!',
    discoveryCore: 'Lá cây màu xanh vì nó phản xạ ánh sáng xanh lục và dùng năng lượng ánh sáng đỏ/lam để chế tạo chất dinh dưỡng.',
    scientificExplanation: 'Vào mùa thu ở vùng ôn đới, khi cây giảm diệp lục, các sắc tố vàng (carotenoid) và đỏ (anthocyanin) vốn có sẵn trong lá mới lộ rõ ra.',
    realLifeApplication: 'Trồng nhiều cây xanh quanh nhà vừa tạo bóng mát vừa lọc không khí sạch.',
    simplificationDisclaimer: 'Mô hình tập trung vào sắc tố Chlorophyll a và b phổ biến nhất.',
  },
  {
    id: 'cur-saving',
    icon: '🐷',
    question: 'Làm thế nào để tiết kiệm tiền thông minh và đạt mục tiêu mơ ước?',
    domain: 'Kỹ năng sống & Tài chính Nhí',
    predictionOptions: [
      { id: 'p1', text: 'Đặt mục tiêu cụ thể, cất phần tiết kiệm ngay khi nhận được xu thưởng trước khi tiêu vào những món nhất thời.', isScientific: true },
      { id: 'p2', text: 'Tiêu hết trước rồi khi nào còn thừa mới tiết kiệm.', isScientific: false },
    ],
    experimentVariableLabel: 'Thử nghiệm tiết kiệm đều đặn 15 xu mỗi tuần trong 6 tuần',
    observationSummary: 'Mỗi tuần tích lũy 15 xu: sau 4 tuần có 60 xu, sau 6 tuần có 90 xu — đủ mua bộ kính hiển vi khoa học!',
    discoveryCore: 'Sức mạnh của sự tích lũy nhỏ đều đặn: Nhiều khoản nhỏ gộp lại theo thời gian sẽ tạo thành kết quả lớn!',
    scientificExplanation: 'Ghi chép thu – chi và phân biệt rõ Cần thiết (Needs) với Mong muốn (Wants) giúp ta làm chủ kế hoạch tài chính.',
    realLifeApplication: 'Áp dụng quy tắc 3 chiếc lọ: Chi tiêu thiết yếu – Tiết kiệm mục tiêu – Sẻ chia yêu thương.',
    simplificationDisclaimer: 'Sử dụng đơn vị Xu thông thái để minh họa kế hoạch tài chính phù hợp lứa tuổi tiểu học.',
  },
];
