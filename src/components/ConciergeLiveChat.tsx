import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Headphones } from 'lucide-react';

interface ConciergeLiveChatProps {
  onOpenTracking: () => void;
  onOpenHelp: () => void;
}

interface Message {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  time: string;
}

export const ConciergeLiveChat: React.FC<ConciergeLiveChatProps> = ({
  onOpenTracking,
  onOpenHelp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'concierge',
      text: 'Selamat datang di Sigma Haute Couture. Saya Isabella, Senior Client Concierge Anda di Pacific Place SCBD. Bagaimana saya dapat membantu Anda hari ini?',
      time: '08:00 WIB',
    },
  ]);

  const quickPrompts = [
    'How do I track my delivery status?',
    'What are the 14-day refund rules?',
    'Do you deliver same-day in Jakarta?',
    'Can I get sizing advice for gowns?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Instant smart concierge reply
    setTimeout(() => {
      let replyText =
        'Terima kasih atas pesan Anda. Silakan hubungi hotline concierge kami di (021) 5088 7446 atau WhatsApp +62 811 8900 7446 untuk pendampingan pribadi secara instan.';

      const lower = text.toLowerCase();
      if (lower.includes('track') || lower.includes('resi') || lower.includes('delivery') || lower.includes('status')) {
        replyText =
          'Anda dapat memantau status pesanan dan nomor resi kurir (JNE / SiCepat / Paxel) secara real-time melalui dashboard "Track Order" di menu atas.';
      } else if (lower.includes('refund') || lower.includes('return') || lower.includes('pengembalian')) {
        replyText =
          'Kami menyediakan garansi pengembalian 14 hari kerja dengan tag utuh. Silakan buka menu "Help & Concierge" → "Submit Return Request" untuk penjemputan paket gratis.';
      } else if (lower.includes('size') || lower.includes('ukuran') || lower.includes('fit')) {
        replyText =
          'Semua produk Sigma menggunakan standar couture Eropa. Anda dapat melihat tabel panduan ukuran dalam centimeter di detail produk atau berkonsultasi via WhatsApp concierge kami.';
      } else if (lower.includes('same-day') || lower.includes('jakarta') || lower.includes('ongkir')) {
        replyText =
          'Tersedia kurir VIP Instant GoSend / GrabExpress (maksimal 3 jam) untuk wilayah Jabodetabek, serta complimentary delivery untuk seluruh pesanan di atas Rp 3.000.000.';
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'concierge',
        text: replyText,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative px-4 py-3 bg-[#121212] hover:bg-[#2A2927] text-white shadow-xl transition-all flex items-center gap-2.5 border border-[#333]"
          aria-label="Open Client Concierge Chat"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <span className="text-xs uppercase tracking-widest font-semibold font-sans">
            Concierge
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[500px] bg-white border border-[#DDD] shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn">
          {/* Top Bar */}
          <div className="px-4 py-3 bg-[#121212] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#2A2927] rounded-full flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-serif-display text-sm font-semibold tracking-wide block">
                  Sigma Private Concierge
                </span>
                <span className="text-[10px] text-[#A6A29A] block">
                  Pacific Place SCBD · Active Now
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#AAA] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-2 bg-[#FAF9F6] border-b border-[#E8E4DB] flex gap-2 text-[10px] overflow-x-auto no-scrollbar">
            <button
              onClick={onOpenTracking}
              className="whitespace-nowrap px-2 py-1 bg-white border border-[#D9D4CB] text-[#121212] hover:border-[#121212]"
            >
              Track My Order
            </button>
            <button
              onClick={onOpenHelp}
              className="whitespace-nowrap px-2 py-1 bg-white border border-[#D9D4CB] text-[#121212] hover:border-[#121212]"
            >
              Refund Rules
            </button>
            <a
              href="https://api.whatsapp.com/send?phone=6281189007446"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap px-2 py-1 bg-emerald-700 text-white"
            >
              WhatsApp
            </a>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F6]/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#121212] text-white'
                      : 'bg-white border border-[#E0DBD2] text-[#333] shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-[#999] mt-0.5 font-mono px-1">
                  {m.time}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-[#FAF9F6] border-t border-[#E8E4DB] flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap text-[10px] px-2 py-1 bg-white border border-[#DDD] text-[#555] hover:text-[#121212] hover:border-[#121212]"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-3 bg-white border-t border-[#E8E4DB]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about fabrics, sizing, resi..."
                className="flex-1 text-xs p-2 border border-[#D9D4CB] focus:outline-none focus:border-[#121212]"
              />
              <button
                type="submit"
                className="p-2 bg-[#121212] text-white hover:bg-[#333] transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
