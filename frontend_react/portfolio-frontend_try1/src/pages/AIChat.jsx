import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { analyticsAPI } from '../services/api';

export default function AIAssistant() {
  const { selectedPortfolio } = useStore();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm your AI investment assistant. Ask me anything about your portfolio, investment strategies, or market insights.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !selectedPortfolio) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await analyticsAPI.aiChatById(
        selectedPortfolio.id,
        input
      );

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.response || 'Unable to respond.' },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Try again.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    'Analyze my portfolio risk',
    'Suggest diversification strategies',
    'Is this a good time to invest?',
    'What are the top performing sectors?',
  ];

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-12rem)]">
      <h1 className="text-4xl font-bold gradient-text">AI Assistant</h1>

      <div className="glass-card h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && <Bot />}
                <div className="bg-white/5 p-4 rounded-xl max-w-2xl">
                  {m.content}
                </div>
                {m.role === 'user' && <User />}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && <p className="text-gray-400">AI is typing...</p>}
        </div>

        <div className="p-4 border-t border-white/10">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask something..."
            className="w-full p-3 bg-white/5 rounded-lg"
            disabled={!selectedPortfolio}
          />
        </div>
      </div>
    </div>
  );
}
