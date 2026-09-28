import React, { useState } from 'react';
import { Send, Sparkles, Smile, ArrowLeft } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface MessagesAppProps {
  soundEnabled: boolean;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export const MessagesApp: React.FC<MessagesAppProps> = ({ soundEnabled }) => {
  const [activeContact, setActiveContact] = useState<'elena' | 'team'>('elena');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'them',
      text: 'Are you heading to the coastal overlook for the sunset photography session?',
      time: '2:15 PM',
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'Yes! The solar tracker says golden hour starts in about 30 minutes. Bringing the 50mm f/1.4 lens.',
      time: '2:18 PM',
    },
    {
      id: 'm3',
      sender: 'them',
      text: 'Perfect, the lighting is going to be sensational! The UV index is dropping nicely too. See you there ☀️',
      time: '2:20 PM',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    solarSound.playTap(soundEnabled);
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated reply after 1.2s
    setTimeout(() => {
      solarSound.playLaunch(soundEnabled);
      const replyOptions = [
        "Absolutely agreed! The sunlight is gorgeous right now. ☀️",
        "Got it, looking forward to it!",
        "The Sunny UI glass reflections look so crisp today!",
        "See you at the sun ridge!",
      ];
      const randomReply = replyOptions[Math.floor(Math.random() * replyOptions.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'them',
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden">
      {/* Contact Header */}
      <div className="p-3.5 border-b border-amber-200/50 flex items-center justify-between bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center font-bold text-sm shadow-md border border-white">
            EV
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-slate-900">
              Elena Vance
            </h4>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active in Daylight</span>
            </div>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
          SOLAR BEAM
        </span>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {messages.map((m) => {
          const isMe = m.sender === 'me';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  isMe
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-br-xs'
                    : 'glass-panel bg-white/70 text-slate-800 rounded-bl-xs border border-white/80'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">
                {m.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Message Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-amber-200/50 bg-white/60 backdrop-blur-md flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Send radiant message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/80 border border-amber-200/60 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md disabled:opacity-40 hover:scale-105 active:scale-95 transition-all"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
};
