export interface ChatAnswerItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Normalize a text string:
 * - Convert to lowercase
 * - Strip Vietnamese diacritics (NFD Unicode normalize + regex)
 * - Replace đ/Đ with d
 * - Remove punctuation and special symbols
 * - Collapse extra whitespace and trim both ends
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
 * Suggested questions (chips) and their pre-written answers
 */
export const CHAT_ANSWERS: ChatAnswerItem[] = [
  {
    id: 'career',
    question: 'What does Nhan do?',
    answer: `Nhan is a Flutter Developer with 5 years of experience building production mobile apps for Android and iOS, mainly in fintech and money transfer. He can own a feature end to end, from Figma design to release on the App Store and Google Play.`,
  },
  {
    id: 'skills',
    question: 'What are his main skills?',
    answer: `Nhan's main skills:
• Languages: Dart, Kotlin, JavaScript.
• Frameworks: Flutter, ReactJS; state management with Bloc, Provider.
• Backend & services: Firebase, Supabase, REST API integration.
• Tools: CodeMagic CI/CD, Git, Figma.`,
  },
  {
    id: 'projects',
    question: 'What projects has he worked on?',
    answer: `Some of Nhan's key projects:
• DCOM Money Express (SupoTech): money transfer app; built card management, deposits/withdrawals, KYC and notifications.
• TranSwap: international money transfer, currency exchange and virtual credit card app.
• FreeTrip: app connecting singles who love to travel.
• A scholarship management app and a kindergarten management app.`,
  },
  {
    id: 'contact',
    question: 'How can I contact him?',
    answer: `You can reach Nhan directly through:
• Email: nhantruong1298@gmail.com
• Phone: +84 772050598

Nhan is always open to discussing new collaboration opportunities and tech projects!`,
  },
];
