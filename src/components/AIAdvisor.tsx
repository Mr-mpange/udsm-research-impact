import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  "Which UDSM papers influence Europe most?",
  "Which topics should we invest in for 2027 impact?",
  "Suggest new collaboration targets in Asia.",
  "What's our current Q1 publication trend?",
  "Which authors have the highest h-index growth?"
];

// Simulated AI responses
const getAIResponse = (question: string): string => {
  const responses: Record<string, string> = {
    "Which UDSM papers influence Europe most?": `Based on our analysis, the most influential UDSM papers in Europe are:

1. **"Climate Change Impact on African Agriculture"** - 8,920 citations from UK, Germany, and Netherlands
2. **"Sustainable Water Management in Tanzania"** - High engagement from Nordic countries
3. **"Renewable Energy Systems for East Africa"** - Strong collaboration with German institutions

The UK and Germany show the highest readership, with Oxford and Max Planck being key institutional partners.`,
    
    "Which topics should we invest in for 2027 impact?": `Our predictive analytics suggest focusing on:

🔹 **AI in Healthcare** (45% growth rate, 89% confidence)
   - Aligns with WHO priorities and Gates Foundation interests
   
🔹 **Climate Adaptation** (38% growth, 92% confidence)
   - Strong EU funding opportunities expected
   
🔹 **Digital Agriculture** (32% growth, 84% confidence)
   - Africa's emerging tech sector is driving demand

Strategic recommendation: Increase collaboration with Asian tech institutions (NUS Singapore, IIT Delhi) for maximum impact.`,
    
    "Suggest new collaboration targets in Asia.": `Based on AI similarity scoring, recommended Asian partners:

1. **NUS Singapore** (92% match)
   - Strong Health Sciences alignment
   - Existing Southeast Asian network
   
2. **University of Tokyo** (85% match)
   - Marine Biology synergies
   - Potential for joint PhD programs
   
3. **Tsinghua University** (88% match)
   - Engineering collaboration opportunities
   - Access to Chinese research funding

Action: Initiate MoU discussions with NUS Singapore as priority.`,

    "What's our current Q1 publication trend?": `Q1 publication analysis:

📊 **Current Distribution:**
- Q1: 423 papers (28%)
- Q2: 567 papers (37%)
- Q3: 389 papers (25%)
- Q4: 156 papers (10%)

📈 **Trend:** Q1 publications have grown 15.6% YoY

**Top Q1 Journals:**
1. Lancet Global Health
2. Nature Communications
3. Environmental Science & Technology

Recommendation: Focus on converting Q2 papers to Q1 through targeted journal selection.`,

    "Which authors have the highest h-index growth?": `Top performers by h-index growth (2023-2024):

1. **Prof. Amani Mwangi** (Engineering)
   - h-index: 34 (+4)
   - Recent breakthrough in renewable energy systems
   
2. **Prof. Joseph Kimathi** (Natural Sciences)
   - h-index: 31 (+3)
   - Climate research gaining traction
   
3. **Dr. Fatima Hassan** (Medicine)
   - h-index: 28 (+5)
   - Highest growth rate, malaria research

These researchers are driving 40% of our citation growth.`
  };

  return responses[question] || `I've analyzed the query "${question}" against our research database.

Based on current UDSM research metrics:
- Total Citations: 156,789
- Active Collaborations: 892
- Global Impact Index: 78.4

For more specific insights, please try one of the suggested questions or refine your query.`;
};

export default function AIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm the UDSM Research Intelligence Advisor. I can help you analyze research impact, identify collaboration opportunities, and provide strategic insights. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-cyan text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[420px] max-h-[600px] glass-panel overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-cyan/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">
                    AI Research Advisor
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Powered by UDSM Intelligence
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin max-h-[380px]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-secondary/20 text-secondary' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-xl ${
                    message.role === 'user'
                      ? 'bg-secondary/20 text-foreground'
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted p-3 rounded-xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce animation-delay-200" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce animation-delay-400" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 3).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {q.length > 35 ? q.substring(0, 35) + '...' : q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about research impact..."
                  className="flex-1 px-4 py-2 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="rounded-xl bg-gradient-to-r from-primary to-cyan hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
