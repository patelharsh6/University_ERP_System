// src/pages/student/Messages.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Messages.css';
import {
  FiMessageCircle, FiSearch, FiSend, FiPaperclip, FiSmile,
  FiPlus, FiMoreVertical, FiPhone, FiVideo, FiChevronLeft,
  FiCheck, FiCheckCircle, FiEdit2, FiTrash2, FiX, FiUser,
  FiMic, FiImage, FiFile, FiStar, FiArchive, FiFilter
} from 'react-icons/fi';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const contacts = [
  {
    id: 1,
    name: 'Dr. Rajesh Sharma',
    role: 'Faculty – DBMS',
    avatar: null,
    avatarColor: '#2563eb',
    initials: 'RS',
    online: true,
    lastMessage: 'Please submit the assignment by Friday.',
    lastTime: '10:24 AM',
    unread: 2,
    messages: [
      { id: 1, from: 'them', text: 'Hello Harsh, hope you are doing well!', time: '9:00 AM', status: 'read' },
      { id: 2, from: 'me', text: 'Good morning, Sir! Yes, doing great.', time: '9:05 AM', status: 'read' },
      { id: 3, from: 'them', text: 'I wanted to remind you about the DBMS project submission.', time: '9:10 AM', status: 'read' },
      { id: 4, from: 'them', text: 'Please submit the assignment by Friday.', time: '10:24 AM', status: 'delivered' },
    ],
  },
  {
    id: 2,
    name: 'Prof. Anita Verma',
    role: 'Faculty – AI/ML',
    avatar: null,
    avatarColor: '#0d9488',
    initials: 'AV',
    online: false,
    lastMessage: 'Great work on the lab report!',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'Hi Harsh, I reviewed your lab report.', time: 'Yesterday 2:00 PM', status: 'read' },
      { id: 2, from: 'them', text: 'Great work on the lab report!', time: 'Yesterday 2:01 PM', status: 'read' },
      { id: 3, from: 'me', text: 'Thank you so much, Ma\'am! I worked really hard on it.', time: 'Yesterday 2:15 PM', status: 'read' },
    ],
  },
  {
    id: 3,
    name: 'Student Council',
    role: 'Group · 24 members',
    avatar: null,
    avatarColor: '#8b5cf6',
    initials: 'SC',
    online: true,
    lastMessage: 'Tech-Fest registrations close tomorrow!',
    lastTime: 'Mon',
    unread: 5,
    messages: [
      { id: 1, from: 'them', text: 'Hey everyone! Just a reminder:', time: 'Mon 10:00 AM', status: 'read' },
      { id: 2, from: 'them', text: 'Tech-Fest registrations close tomorrow!', time: 'Mon 10:01 AM', status: 'read' },
      { id: 3, from: 'me', text: 'Already registered! Can\'t wait 🎉', time: 'Mon 10:30 AM', status: 'read' },
    ],
  },
  {
    id: 4,
    name: 'Exam Cell',
    role: 'Official · Admin',
    avatar: null,
    avatarColor: '#ef4444',
    initials: 'EC',
    online: false,
    lastMessage: 'Your hall ticket is now available.',
    lastTime: 'Sun',
    unread: 1,
    messages: [
      { id: 1, from: 'them', text: 'Dear Student, your hall ticket for the upcoming mid-semester exams is now available.', time: 'Sun 8:00 AM', status: 'delivered' },
      { id: 2, from: 'them', text: 'Your hall ticket is now available.', time: 'Sun 8:01 AM', status: 'delivered' },
    ],
  },
  {
    id: 5,
    name: 'Priya Mehta',
    role: 'Classmate · CE-VI-A',
    avatar: null,
    avatarColor: '#f59e0b',
    initials: 'PM',
    online: true,
    lastMessage: 'Did you finish the networking assignment?',
    lastTime: 'Fri',
    unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'Hey! Did you finish the networking assignment?', time: 'Fri 5:00 PM', status: 'read' },
      { id: 2, from: 'me', text: 'Almost done! Just finishing chapter 5 notes.', time: 'Fri 5:10 PM', status: 'read' },
      { id: 3, from: 'them', text: 'Same here! Let\'s compare notes tomorrow.', time: 'Fri 5:12 PM', status: 'read' },
    ],
  },
  {
    id: 6,
    name: 'Library Dept.',
    role: 'Official · University',
    avatar: null,
    avatarColor: '#6366f1',
    initials: 'LB',
    online: false,
    lastMessage: 'Book return reminder: 2 days left.',
    lastTime: 'Thu',
    unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'This is a friendly reminder that you have 2 books due for return.', time: 'Thu 9:00 AM', status: 'read' },
      { id: 2, from: 'them', text: 'Book return reminder: 2 days left.', time: 'Thu 9:01 AM', status: 'read' },
    ],
  },
];

const MessageStatus = ({ status }) => {
  if (status === 'sent') return <FiCheck size={12} style={{ color: '#94a3b8' }} />;
  if (status === 'delivered') return <><FiCheck size={12} /><FiCheck size={12} style={{ marginLeft: '-6px', color: '#94a3b8' }} /></>;
  if (status === 'read') return <FiCheckCircle size={12} style={{ color: '#2563eb' }} />;
  return null;
};

const Avatar = ({ contact, size = 44 }) => (
  <div
    className="msg-avatar"
    style={{
      width: size,
      height: size,
      background: `linear-gradient(135deg, ${contact.avatarColor}cc, ${contact.avatarColor})`,
      fontSize: size * 0.35,
    }}
  >
    {contact.initials}
    {contact.online && <span className="online-dot" />}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [allContacts, setAllContacts] = useState(contacts);
  const [showMobileList, setShowMobileList] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact]);

  const filteredContacts = allContacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'Unread') return matchesSearch && c.unread > 0;
    if (activeFilter === 'Official') return matchesSearch && c.role.includes('Official');
    return matchesSearch;
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setAllContacts(prev =>
      prev.map(c =>
        c.id === selectedContact.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, lastTime: 'Just now' }
          : c
      )
    );
    setSelectedContact(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));
    setMessageInput('');
  };

  const handleContactSelect = (contact) => {
    // Mark unread as read
    setAllContacts(prev =>
      prev.map(c => c.id === contact.id ? { ...c, unread: 0 } : c)
    );
    setSelectedContact({ ...contact, unread: 0 });
    setShowMobileList(false);
  };

  const totalUnread = allContacts.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="messages-page">
      {/* LEFT PANEL – Conversation List */}
      <aside className={`messages-sidebar ${showMobileList ? 'mobile-show' : 'mobile-hide'}`}>
        {/* Sidebar Header */}
        <div className="msb-header">
          <div className="msb-title-row">
            <h2 className="msb-title">
              <FiMessageCircle /> Messages
              {totalUnread > 0 && <span className="total-badge">{totalUnread}</span>}
            </h2>
            <button className="icon-btn" title="New Message">
              <FiEdit2 size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="msb-search">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search messages…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="filter-chips">
            {['All', 'Unread', 'Official'].map(f => (
              <button
                key={f}
                className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Contact List */}
        <div className="contact-list">
          {filteredContacts.length === 0 ? (
            <div className="empty-search">
              <FiSearch size={32} />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''} ${contact.unread > 0 ? 'has-unread' : ''}`}
                onClick={() => handleContactSelect(contact)}
              >
                <Avatar contact={contact} size={46} />
                <div className="contact-info">
                  <div className="contact-name-row">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-time">{contact.lastTime}</span>
                  </div>
                  <div className="contact-preview-row">
                    <span className="contact-preview">{contact.lastMessage}</span>
                    {contact.unread > 0 && (
                      <span className="unread-badge">{contact.unread}</span>
                    )}
                  </div>
                  <span className="contact-role">{contact.role}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* RIGHT PANEL – Chat View */}
      <main className={`messages-chat ${!showMobileList ? 'mobile-show' : 'mobile-hide'}`}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <button className="back-btn mobile-only" onClick={() => setShowMobileList(true)}>
                <FiChevronLeft size={20} />
              </button>
              <Avatar contact={selectedContact} size={40} />
              <div className="chat-header-info">
                <h3>{selectedContact.name}</h3>
                <span>{selectedContact.online ? '🟢 Online' : selectedContact.role}</span>
              </div>
              <div className="chat-header-actions">
                <button className="icon-btn" title="Voice Call"><FiPhone size={18} /></button>
                <button className="icon-btn" title="Video Call"><FiVideo size={18} /></button>
                <button className="icon-btn" title="More"><FiMoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              <div className="date-divider"><span>Today</span></div>
              {selectedContact.messages.map(msg => (
                <div key={msg.id} className={`msg-bubble-wrap ${msg.from === 'me' ? 'sent' : 'received'}`}>
                  {msg.from !== 'me' && <Avatar contact={selectedContact} size={32} />}
                  <div className="msg-bubble">
                    <p>{msg.text}</p>
                    <div className="msg-meta">
                      <span className="msg-time">{msg.time}</span>
                      {msg.from === 'me' && <MessageStatus status={msg.status} />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
              <div className="input-row">
                <button className="icon-btn attach-btn" title="Attach file"><FiPaperclip size={18} /></button>
                <div className="input-wrapper">
                  <textarea
                    className="chat-input"
                    placeholder={`Message ${selectedContact.name}…`}
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={1}
                  />
                  <button className="icon-btn emoji-btn" title="Emoji"><FiSmile size={18} /></button>
                </div>
                <button
                  className={`send-btn ${messageInput.trim() ? 'active' : ''}`}
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  title="Send"
                >
                  {messageInput.trim() ? <FiSend size={18} /> : <FiMic size={18} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="chat-empty-state">
            <div className="empty-icon"><FiMessageCircle size={48} /></div>
            <h3>Select a conversation</h3>
            <p>Choose a contact from the left panel to start messaging</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
