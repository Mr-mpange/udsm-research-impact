import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Json } from '@/integrations/supabase/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatConversation {
  id: string;
  title: string | null;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export function useChatHistory() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setConversations(data.map(conv => ({
        ...conv,
        messages: (conv.messages as unknown as ChatMessage[]) || []
      })));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const createConversation = useCallback(async (initialMessage?: ChatMessage) => {
    if (!user) return null;

    const messages = initialMessage ? [initialMessage] : [];
    const title = initialMessage?.content.slice(0, 50) || 'New Conversation';

    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        title,
        messages: messages as unknown as Json
      })
      .select()
      .single();

    if (!error && data) {
      const newConv: ChatConversation = {
        ...data,
        messages: (data.messages as unknown as ChatMessage[]) || []
      };
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(data.id);
      return data.id;
    }
    return null;
  }, [user]);

  const updateConversation = useCallback(async (
    conversationId: string,
    messages: ChatMessage[],
    title?: string
  ) => {
    if (!user) return;

    const updateData: { messages: Json; title?: string; updated_at: string } = {
      messages: messages as unknown as Json,
      updated_at: new Date().toISOString()
    };
    
    if (title) {
      updateData.title = title;
    }

    const { error } = await supabase
      .from('chat_history')
      .update(updateData)
      .eq('id', conversationId)
      .eq('user_id', user.id);

    if (!error) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, messages, title: title || conv.title, updated_at: new Date().toISOString() }
            : conv
        )
      );
    }
  }, [user]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id);

    if (!error) {
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    }
  }, [user, currentConversationId]);

  const getCurrentMessages = useCallback(() => {
    if (!currentConversationId) return [];
    const conv = conversations.find(c => c.id === currentConversationId);
    return conv?.messages || [];
  }, [currentConversationId, conversations]);

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    isLoading,
    createConversation,
    updateConversation,
    deleteConversation,
    getCurrentMessages,
    refreshConversations: fetchConversations
  };
}
