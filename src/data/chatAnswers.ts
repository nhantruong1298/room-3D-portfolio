export interface ChatAnswerItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

/**
 * Chuẩn hóa chuỗi văn bản:
 * - Chuyển sang chữ thường
 * - Bỏ dấu tiếng Việt (NFD Unicode normalize + regex)
 * - Đổi ký tự đ/Đ thành d
 * - Bỏ ký tự dấu câu và ký hiệu đặc biệt
 * - Bỏ khoảng trắng thừa ở giữa và hai đầu
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[.,?!:;'"()\[\]{}_+\-*\\/<>@#$%^&=~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Danh sách câu hỏi gợi ý (chip) và nội dung đáp án viết sẵn
 */
export const CHAT_ANSWERS: ChatAnswerItem[] = [
  {
    id: 'career',
    question: 'Nhân làm nghề gì?',
    answer: `Nhân là một Software Engineer / Full Stack & Mobile Developer với hơn 5 năm kinh nghiệm thực chiến.

Chuyên môn chính của Nhân bao gồm phát triển ứng dụng web hiệu năng cao, ứng dụng di động đa nền tảng, kiến trúc hệ thống backend microservices và trải nghiệm đồ họa tương tác 3D WebGL/Three.js.`,
    keywords: [
      'nghe',
      'nghe gi',
      'lam gi',
      'cong viec',
      'chuyen mon',
      'vi tri',
      'developer',
      'engineer',
      'lap trinh',
      'lap trinh vien',
      'full stack',
      'mobile',
      'software',
      'role',
      'job',
      'career',
      'who is',
      'la ai',
    ],
  },
  {
    id: 'skills',
    question: 'Kỹ năng chính là gì?',
    answer: `Các kỹ năng nổi bật của Nhân bao gồm:
• Frontend: React 19, Next.js, TypeScript, Tailwind CSS, Three.js / WebGL.
• Mobile: React Native, Flutter, ứng dụng iOS & Android.
• Backend: Node.js, Express, NestJS, Golang, Python, RESTful API & GraphQL.
• Database & DevOps: PostgreSQL, MySQL, Redis, Docker, Kubernetes, CI/CD, AWS, GCP.`,
    keywords: [
      'ky nang',
      'skill',
      'skills',
      'cong nghe',
      'tech stack',
      'stack',
      'react',
      'typescript',
      'nextjs',
      'tailwind',
      'threejs',
      'node',
      'nodejs',
      'mobile',
      'database',
      'docker',
      'backend',
      'frontend',
      'chuyen sau',
    ],
  },
  {
    id: 'projects',
    question: 'Từng làm dự án nào?',
    answer: `Một số dự án tiêu biểu mà Nhân từng tham gia phát triển:
1. 3D Developer Room Portfolio: Phòng làm việc lập trình viên 3D tương tác isometric mô phỏng máy tính cá nhân bằng Three.js & React.
2. Enterprise SaaS Platform: Nền tảng quản lý quy mô lớn phục vụ hơn 500.000 người dùng hàng tháng với kiến trúc Microservices.
3. E-Commerce Mobile App: Ứng dụng thương mại điện tử đa nền tảng với hàng chục ngàn đơn hàng hoạt động ổn định.
4. AI Automation Suite: Tích hợp mô hình AI và tối ưu hóa quy trình phân tích dữ liệu tự động.`,
    keywords: [
      'du an',
      'project',
      'projects',
      'san pham',
      'tung lam',
      'kinh nghiem',
      'portfolio',
      'da lam',
      'san pham nao',
      'du an nao',
      'app',
      'ung dung',
      'web 3d',
    ],
  },
  {
    id: 'contact',
    question: 'Liên hệ như thế nào?',
    answer: `Bạn có thể liên hệ trực tiếp với Nhân qua các kênh sau:
• Email: nhantruong1298@gmail.com
• LinkedIn: https://linkedin.com/in/nhantruong
• GitHub: https://github.com/nhantruong
• Portfolio: https://nhantruong.dev

Nhân luôn sẵn sàng trao đổi về các cơ hội hợp tác và dự án công nghệ mới!`,
    keywords: [
      'lien he',
      'contact',
      'email',
      'mail',
      'gmail',
      'dien thoai',
      'so dien thoai',
      'phone',
      'sdt',
      'linkedin',
      'github',
      'trao doi',
      'hop tac',
      'connect',
      'o dau',
      'dia chi',
      'thong tin lien he',
    ],
  },
];

/**
 * Tìm câu trả lời phù hợp nhất dựa trên từ khóa xuất hiện trong câu hỏi đã chuẩn hóa.
 * Trả về nội dung answer hoặc null nếu không khớp từ khóa nào (score = 0).
 */
export function findBestMatchingAnswer(normalizedQuestion: string): string | null {
  if (!normalizedQuestion) return null;

  let highestScore = 0;
  let bestItem: ChatAnswerItem | null = null;

  for (const item of CHAT_ANSWERS) {
    let score = 0;
    for (const kw of item.keywords) {
      const normalizedKw = normalizeText(kw);
      if (!normalizedKw) continue;

      // Kiểm tra sự xuất hiện của từ khóa
      if (normalizedQuestion.includes(normalizedKw)) {
        // Cộng điểm ưu tiên cho từ khóa dài hơn / cụm từ
        score += normalizedKw.split(' ').length;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestItem = item;
    }
  }

  return highestScore > 0 && bestItem ? bestItem.answer : null;
}
