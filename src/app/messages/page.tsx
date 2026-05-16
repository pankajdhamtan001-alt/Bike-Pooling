"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faUserCircle, 
  faPaperPlane, 
  faSearch, 
  faPhoneAlt, 
  faVideo,
  faEllipsisV,
  faInfoCircle,
  faPaperclip,
  faSmile
  
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Messages() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState('');
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  
  // Mock conversation data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      user: {
        name: 'Alex Johnson',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        online: true,
        lastSeen: null
      },
      unread: 2,
      lastMessage: {
        text: 'Are we still meeting at the university entrance?',
        time: '10:42 AM',
        sent: false
      },
      messages: [
        { id: 1, text: "Hi Alex, I'm looking forward to our ride tomorrow!", time: '9:30 AM', sent: true },
        { id: 2, text: "Hi! Me too. What time should we meet?", time: '9:35 AM', sent: false },
        { id: 3, text: "I was thinking 8:30 AM at the university entrance. Does that work?", time: '9:40 AM', sent: true },
        { id: 4, text: "Are we still meeting at the university entrance?", time: '10:42 AM', sent: false }
      ]
    },
    {
      id: 2,
      user: {
        name: 'Sarah Miller',
        image: 'https://randomuser.me/api/portraits/women/65.jpg',
        online: false,
        lastSeen: '2 hours ago'
      },
      unread: 0,
      lastMessage: {
        text: 'Thanks for the ride yesterday!',
        time: 'Yesterday',
        sent: false
      },
      messages: [
        { id: 1, text: "Hi Sarah, I just arrived at the meeting point.", time: 'Yesterday', sent: true },
        { id: 2, text: "I'll be there in 5 minutes!", time: 'Yesterday', sent: false },
        { id: 3, text: "Great ride, thanks!", time: 'Yesterday', sent: true },
        { id: 4, text: "Thanks for the ride yesterday!", time: 'Yesterday', sent: false }
      ]
    },
    {
      id: 3,
      user: {
        name: 'Michael Torres',
        image: 'https://randomuser.me/api/portraits/men/91.jpg',
        online: true,
        lastSeen: null
      },
      unread: 0,
      lastMessage: {
        text: "I'll post a new ride next week if you're interested.",
        time: '2 days ago',
        sent: true
      },
      messages: [
        { id: 1, text: "Hi Michael, do you have any rides planned for next week?", time: '2 days ago', sent: false },
        { id: 2, text: "Hey there! Not yet, but I'm planning to go to downtown on Wednesday.", time: '2 days ago', sent: true },
        { id: 3, text: "That would be perfect for me!", time: '2 days ago', sent: false },
        { id: 4, text: "I'll post a new ride next week if you're interested.", time: '2 days ago', sent: true }
      ]
    }
  ]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || activeConversation === null) return;
    
    // Update the conversation with the new message
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === activeConversation) {
          const newMessage = {
            id: conv.messages.length + 1,
            text: message,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            sent: true
          };
          
          return {
            ...conv,
            lastMessage: {
              text: message,
              time: 'Just now',
              sent: true
            },
            messages: [...conv.messages, newMessage]
          };
        }
        return conv;
      });
    });
    
    // Clear the input
    setMessage('');
  };

  const markAsRead = (conversationId: number) => {
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unread: 0
          };
        }
        return conv;
      });
    });
  };

  useEffect(() => {
    // Redirect if not logged in
    if (!session && typeof window !== 'undefined') {
      router.push('/login?redirect=/messages');
    }
    
    // Set first conversation as active by default
    if (conversations.length > 0 && activeConversation === null) {
      setActiveConversation(conversations[0].id);
      markAsRead(conversations[0].id);
    }
    
    setIsMounted(true);
  }, [session, router, conversations, activeConversation]);

  useEffect(() => {
    // Mark conversation as read when selected
    if (activeConversation) {
      markAsRead(activeConversation);
    }
  }, [activeConversation]);

  if (!isMounted || !session) {
    return <div className="loading">Loading...</div>;
  }

  const activeConvo = conversations.find(c => c.id === activeConversation);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex h-[calc(80vh-64px)]">
              {/* Left sidebar - Conversations list */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h1 className="text-xl font-bold flex items-center">
                    <FontAwesomeIcon icon={faComments} className="mr-2 text-primary" />
                    Messages
                  </h1>
                  <div className="mt-3 relative">
                    <input 
                      type="text" 
                      placeholder="Search messages" 
                      className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="overflow-y-auto flex-grow">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id} 
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${activeConversation === conversation.id ? 'bg-primary bg-opacity-5' : ''}`}
                      onClick={() => setActiveConversation(conversation.id)}
                    >
                      <div className="flex items-start">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden relative">
                            {conversation.user.image ? (
                              <div className="w-12 h-12 relative">
                                <Image 
                                  src={conversation.user.image} 
                                  alt={conversation.user.name} 
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/default-avatar.png';
                                  }}
                                />
                              </div>
                            ) : (
                              <FontAwesomeIcon icon={faUserCircle} className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                          {conversation.user.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0 ml-3">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-medium truncate">{conversation.user.name}</h3>
                            <span className="text-xs text-gray-500">{conversation.lastMessage.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {conversation.lastMessage.sent ? 'You: ' : ''}{conversation.lastMessage.text}
                          </p>
                        </div>
                        {conversation.unread > 0 && (
                          <div className="ml-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right area - Selected conversation */}
              {activeConvo ? (
                <div className="w-2/3 flex flex-col">
                  {/* Conversation header */}
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden relative mr-3">
                        {activeConvo.user.image ? (
                          <div className="w-10 h-10 relative">
                            <Image 
                              src={activeConvo.user.image} 
                              alt={activeConvo.user.name} 
                              width={40}
                              height={40}
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/default-avatar.png';
                              }}
                            />
                          </div>
                        ) : (
                          <FontAwesomeIcon icon={faUserCircle} className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h2 className="font-medium">{activeConvo.user.name}</h2>
                        <p className="text-xs text-gray-500">
                          {activeConvo.user.online ? 'Online' : `Last seen ${activeConvo.user.lastSeen}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="text-gray-600 hover:text-primary cursor-pointer" title="Call">
                        <FontAwesomeIcon icon={faPhoneAlt} />
                      </button>
                      <button className="text-gray-600 hover:text-primary cursor-pointer" title="Video call">
                        <FontAwesomeIcon icon={faVideo} />
                      </button>
                      <button className="text-gray-600 hover:text-primary cursor-pointer" title="More options">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Messages area */}
                  <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                    <div className="flex justify-center mb-4">
                      <div className="text-xs text-center text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                    
                    {activeConvo.messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`mb-4 flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                      >
                        {!msg.sent && (
                          <div className="w-8 h-8 rounded-full overflow-hidden relative mr-2 self-end">
                            {activeConvo.user.image ? (
                              <div className="w-8 h-8 relative">
                                <Image 
                                  src={activeConvo.user.image} 
                                  alt={activeConvo.user.name} 
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/default-avatar.png';
                                  }}
                                />
                              </div>
                            ) : (
                              <FontAwesomeIcon icon={faUserCircle} className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                        )}
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sent 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                        }`}>
                          <p>{msg.text}</p>
                          <div className={`text-xs mt-1 text-right ${
                            msg.sent ? 'text-primary-light' : 'text-gray-500'
                          }`}>
                            {msg.time}
                          </div>
                        </div>
                        {msg.sent && (
                          <div className="w-8 h-8 rounded-full ml-2 self-end flex-shrink-0"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Message input */}
                  <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 flex items-center">
                    <button 
                      type="button" 
                      className="text-gray-500 hover:text-primary mr-3 cursor-pointer" 
                      title="Attach file"
                    >
                      <FontAwesomeIcon icon={faPaperclip} />
                    </button>
                    <div className="flex-grow relative">
                      <input 
                        type="text" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..." 
                        className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-2 text-gray-500 hover:text-primary cursor-pointer"
                        title="Insert emoji"
                      >
                        <FontAwesomeIcon icon={faSmile} />
                      </button>
                    </div>
                    <button 
                      type="submit" 
                      disabled={!message.trim()}
                      className={`ml-3 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                        message.trim() 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      title="Send message"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="w-2/3 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">
                      <FontAwesomeIcon icon={faComments} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-700">Your Messages</h2>
                    <p className="text-gray-500 mt-2 max-w-md">
                      Select a conversation to start messaging or start a new conversation with your ride partners.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Message Safety Tips</h2>
            <div className="text-gray-600 space-y-2">
              <p className="flex items-start">
                <FontAwesomeIcon icon={faInfoCircle} className="text-primary mr-2 mt-1" />
                Only communicate through our platform to ensure your safety and privacy.
              </p>
              <p className="flex items-start">
                <FontAwesomeIcon icon={faInfoCircle} className="text-primary mr-2 mt-1" />
                Never share personal financial information or send money outside the app.
              </p>
              <p className="flex items-start">
                <FontAwesomeIcon icon={faInfoCircle} className="text-primary mr-2 mt-1" />
                If you ever feel uncomfortable, you can block a user or report inappropriate behavior.
              </p>
            </div>
            <div className="mt-4">
              <Link href="/help" className="text-primary font-medium hover:underline cursor-pointer">
                Learn more about messaging safety
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 