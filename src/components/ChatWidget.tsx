import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { CHAT_ANSWERS, normalizeText } from '../data/chatAnswers';

// Cloudflare Worker API URL (every typed question is sent here for Gemini to answer)
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
  text: "Hi! I'm Nhan's assistant. Pick a question below or type a short question of your own.",
  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
};

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  // 3-second cooldown countdown between sends
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Cache answers from this session in component memory (no localStorage/sessionStorage)
  const sessionAnswersCacheRef = useRef<Map<string, string>>(new Map());

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Count the visitor's messages
  const userMessagesCount = messages.filter((m) => m.sender === 'user').length;

  // Handle the 3-second cooldown countdown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  // Scroll to the latest message
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end',
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
      // Auto-focus the input after opening
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

  // Esc key closes the chat window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const getTimeString = () =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // 1. Chip click: show the question, then the pre-written answer. NO network call.
  const handleChipClick = (question: string, answer: string) => {
    if (isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: getTimeString(),
    };

    const botMsg: Message = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: answer,
      timestamp: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setCooldownSeconds(3);
  };

  // 2. Visitor types their own question (max 200 characters)
  const handleSendCustomQuestion = async () => {
    const rawQuestion = input.trim();
    if (!rawQuestion || isLoading || cooldownSeconds > 0) return;

    if (rawQuestion.length > 200) return;

    // a. Normalize the question (lowercase, strip diacritics, extra whitespace and punctuation)
    const normalized = normalizeText(rawQuestion);

    // Add the visitor's message to the list
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawQuestion,
      timestamp: getTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // b. If Gemini already answered this question in this session, reuse it. NO network call.
    if (sessionAnswersCacheRef.current.has(normalized)) {
      // Use the cached answer from the in-memory Map, NO network call
      const cachedAnswer = sessionAnswersCacheRef.current.get(normalized)!;
      const botMsg: Message = {
        id: `bot-${Date.now() + 1}`,
        sender: 'bot',
        text: cachedAnswer,
        timestamp: getTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setCooldownSeconds(3);
      return;
    }

    // Start waiting for the reply
    setIsLoading(true);

    // Error message when Gemini can't be reached (no local keyword matching)
    const showErrorReply = () => {
      const botMsg: Message = {
        id: `bot-${Date.now() + 1}`,
        sender: 'bot',
        text: 'The chatbot is busy, please try again in a few minutes. You can also pick a suggested question below, or contact Nhan directly at nhantruong1298@gmail.com.',
        timestamp: getTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    };

    // c. Send the question to CHAT_API_URL
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: rawQuestion }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data && typeof data.reply === 'string') {
        const replyText = data.reply;

        // Store the (normalized question → reply) pair in the in-memory Map
        sessionAnswersCacheRef.current.set(normalized, replyText);

        const botReplyMsg: Message = {
          id: `bot-${Date.now() + 1}`,
          sender: 'bot',
          text: replyText,
          timestamp: getTimeString(),
        };
        setMessages((prev) => [...prev, botReplyMsg]);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err) {
      console.warn('[ChatWidget] Gemini request failed or timed out:', err);
      // d. Show an error if the fetch fails, times out or returns invalid data
      showErrorReply();
    } finally {
      setIsLoading(false);
      setCooldownSeconds(3);
    }
  };

  // Stop touch/mouse events from propagating to the 3D canvas
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

  const isInputDisabled = isLoading || cooldownSeconds > 0;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto"
      {...stopPropagationProps}
    >
      {/* Floating chat window */}
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
            aria-label="Chat with Nhan's assistant"
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
                    Nhan's Assistant
                    <Sparkles size={12} className="text-sky-400" />
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Ready to help
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl whitespace-pre-line break-words leading-relaxed text-[13.5px] ${
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

              {/* Typing indicator bubble */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="bg-slate-800/90 text-slate-400 border border-slate-700/60 px-3.5 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 mr-1">Typing</span>
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              {/* 4 suggested question chips below the greeting */}
              {userMessagesCount === 0 && !isLoading && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[11px] text-slate-400 font-medium px-1">Suggested questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CHAT_ANSWERS.map((chipItem) => (
                      <button
                        key={chipItem.id}
                        type="button"
                        onClick={() => handleChipClick(chipItem.question, chipItem.answer)}
                        className="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-sky-950/80 text-sky-300 hover:text-sky-200 border border-sky-500/30 hover:border-sky-400/60 rounded-full transition-all text-left cursor-pointer active:scale-95"
                      >
                        {chipItem.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestion chip strip (shown above the input once there are messages) */}
            {userMessagesCount > 0 && (
              <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-800/70 bg-slate-950/40">
                {CHAT_ANSWERS.map((chipItem) => (
                  <button
                    key={chipItem.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleChipClick(chipItem.question, chipItem.answer)}
                    className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-slate-800/90 hover:bg-sky-950 text-sky-300 hover:text-sky-100 border border-sky-500/25 rounded-full transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {chipItem.question}
                  </button>
                ))}
              </div>
            )}

            {/* Input & send button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCustomQuestion();
              }}
              className="p-3 border-t border-slate-800 bg-slate-950/80 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isLoading
                      ? 'Waiting for reply...'
                      : cooldownSeconds > 0
                      ? `Wait ${cooldownSeconds}s to send again...`
                      : 'Type a question... (max 200 characters)'
                  }
                  maxLength={200}
                  disabled={isInputDisabled}
                  aria-label="Type a question for the assistant"
                  className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-sky-500 focus:outline-none rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isInputDisabled || !input.trim()}
                  aria-label="Send message"
                  className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-40 disabled:hover:bg-sky-500 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/30"
                >
                  <Send size={16} />
                </button>
              </div>

              {/* Character counter & cooldown status */}
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-slate-500">
                  {cooldownSeconds > 0 ? (
                    <span className="text-amber-400/90 font-mono">Wait {cooldownSeconds}s</span>
                  ) : (
                    <span>Press Enter to send</span>
                  )}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {input.length}/200
                </span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Round chat button fixed at the bottom-right corner */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
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

        {/* Pulse indicator when closed */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </span>
        )}
      </motion.button>
    </div>
  );
};
