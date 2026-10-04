import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

// Khai báo hằng số API URL (Nếu rỗng thì tự động chạy ở chế độ giả lập)
const CHAT_API_URL = 'https://portfolio-chat.nhantruong1298.workers.dev';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

const INITIAL_BOT_MESSAGE: Message = {
  id: 'init-msg',
  sender: 'bot',
  text: 'Xin chào! Mình là trợ lý ảo của Nhân. Bạn muốn biết điều gì về Nhân? (Hỏi ngắn gọn nhé)',
  timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
};

const SUGGESTION_CHIPS = [
  'Nhân làm nghề gì?',
  'Kỹ năng chính là gì?',
  'Từng làm dự án nào?',
  'Liên hệ như thế nào?',
];

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Đếm số tin nhắn của khách
  const userMessagesCount = messages.filter((m) => m.sender === 'user').length;

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end',
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
      // Tự động focus vào ô nhập sau khi animation hoàn tất
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(true);
    }
  }, [messages, isLoading, isOpen, scrollToBottom]);

  // Phím Esc để đóng khung chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Xử lý gửi câu hỏi
  const handleSendMessage = async (textToSend?: string) => {
    const question = (textToSend ?? input).trim();
    if (!question || isLoading) return;

    if (question.length > 200) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Chế độ giả lập khi CHAT_API_URL rỗng
    if (!CHAT_API_URL || !CHAT_API_URL.trim()) {
      setTimeout(() => {
        const fakeBotMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `(Chế độ thử) Đây là câu trả lời mẫu cho: ${question}`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fakeBotMsg]);
        setIsLoading(false);
      }, 800);
      return;
    }

    // Kết nối API Cloudflare Worker thực tế
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data && typeof data.reply === 'string') {
        const botReplyMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botReplyMsg]);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error('[ChatWidget] Error calling chat API:', err);
      // Xử lý lỗi hoặc timeout
      const errorMsg: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Chatbot đang bận, bạn thử lại sau nhé.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ngăn sự kiện chạm/chuột lan truyền ra canvas 3D
  const stopPropagationProps = {
    onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
    onPointerMove: (e: React.PointerEvent) => e.stopPropagation(),
    onPointerUp: (e: React.PointerEvent) => e.stopPropagation(),
    onTouchStart: (e: React.TouchEvent) => e.stopPropagation(),
    onTouchMove: (e: React.TouchEvent) => e.stopPropagation(),
    onTouchEnd: (e: React.TouchEvent) => e.stopPropagation(),
    onWheel: (e: React.WheelEvent) => e.stopPropagation(),
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto"
      {...stopPropagationProps}
    >
      {/* Khung chat cửa sổ nổi */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3.5 flex flex-col overflow-hidden bg-slate-900/95 border border-sky-500/30 backdrop-blur-xl shadow-2xl shadow-sky-950/60 rounded-2xl
              w-[calc(100vw-24px)] max-h-[70vh] sm:w-[360px] sm:max-h-[520px] h-[500px]"
            role="dialog"
            aria-modal="true"
            aria-label="Khung trò chuyện với trợ lý của Nhân"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/70 select-none">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/40">
                  <Bot size={18} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                    Trợ lý của Nhân
                    <Sparkles size={12} className="text-sky-400" />
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-tight">Sẵn sàng hỗ trợ bạn</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                aria-label="Đóng khung chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Vùng tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap break-words leading-relaxed text-[13.5px] ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-br-xs shadow-md shadow-sky-900/30'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-xs shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {/* Bong bóng đang trả lời... */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="bg-slate-800/90 text-slate-400 border border-slate-700/60 px-3.5 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 mr-1">Đang trả lời</span>
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              {/* 4 Câu hỏi gợi ý dạng nút bấm (chip) chỉ hiện khi chưa có tin nhắn của khách */}
              {userMessagesCount === 0 && !isLoading && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[11px] text-slate-400 font-medium px-1">Gợi ý câu hỏi:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTION_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleSendMessage(chip)}
                        className="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-sky-950/80 text-sky-300 hover:text-sky-200 border border-sky-500/30 hover:border-sky-400/60 rounded-full transition-all text-left cursor-pointer active:scale-95"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Ô nhập & Nút gửi */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-slate-800 bg-slate-950/80 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLoading ? 'Đang chờ phản hồi...' : 'Nhập tin nhắn... (Enter để gửi)'}
                  maxLength={200}
                  disabled={isLoading}
                  aria-label="Nhập câu hỏi cho trợ lý ảo"
                  className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-sky-500 focus:outline-none rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Gửi tin nhắn"
                  className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-40 disabled:hover:bg-sky-500 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/30"
                >
                  <Send size={16} />
                </button>
              </div>

              {/* Bộ đếm ký tự */}
              <div className="flex justify-end px-1">
                <span className="text-[10px] text-slate-500 font-mono">
                  {input.length}/200
                </span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút chat tròn cố định góc phải dưới */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Đóng trợ lý chat' : 'Mở trợ lý chat'}
        className="w-13 h-13 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 shadow-lg shadow-sky-500/30 flex items-center justify-center cursor-pointer hover:brightness-110 transition-all border border-sky-200/40 relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} className="stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={24} className="stroke-[2.5]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse indicator khi đóng */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </span>
        )}
      </motion.button>
    </div>
  );
};
