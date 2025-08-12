import * as React from 'react';
import { User, Bot, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import { ChatMessage as ChatMessageType } from '../lib/types';

interface ChatMessageProps {
  message: ChatMessageType;
  isTyping?: boolean;
}





export function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };





  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {isUser ? 'Sie' : 'Lernbegleiter'}
            </span>
            {message.timestamp && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(message.timestamp)}
              </span>
            )}
          </div>
          
          <div className="prose prose-sm max-w-none">
            {isTyping ? (
              <div className="flex items-center gap-2">
                <span>Denkt nach</span>
                <div className="loading-dots">
                  <span style={{ '--i': 0 } as React.CSSProperties}></span>
                  <span style={{ '--i': 1 } as React.CSSProperties}></span>
                  <span style={{ '--i': 2 } as React.CSSProperties}></span>
                </div>
              </div>
            ) : (
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  a: ({ href, children, ...props }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 underline"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 pl-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 pl-4">{children}</ol>,
                  li: ({ children }) => <li className="mb-1 ml-0">{children}</li>,
                  code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-100 p-3 rounded overflow-x-auto mb-2">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">{children}</blockquote>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mb-1">{children}</h3>,
                  br: () => <br className="leading-tight" />,
                  hr: () => <hr className="my-2 border-gray-300" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
