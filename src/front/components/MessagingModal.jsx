import React, { useState, useEffect } from 'react';
import { customerAPI } from '../fetch';
import '../lib/MessagingModal.css';

export const MessagingModal = ({ show, service, onClose, isProvider = false }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (show && service) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
            return () => clearInterval(interval);
        }
    }, [show, service]);

    useEffect(() => {
        // Mark messages as read when modal opens
        if (show && messages.length > 0) {
            messages.forEach(msg => {
                if (!msg.isRead && msg.senderType !== (isProvider ? 'provider' : 'customer')) {
                    // Mark as read
                }
            });
        }
    }, [show, messages, isProvider]);

    const fetchMessages = async () => {
        if (!service) return;
        setIsLoading(true);
        try {
            const data = await customerAPI.getMessages(service.provider.id);
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !service) return;

        setIsSending(true);
        try {
            await customerAPI.sendMessage(
                service.provider.id,
                newMessage,
                service.id
            );
            setNewMessage('');
            await fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (window.confirm('Delete this message?')) {
            try {
                await customerAPI.deleteMessage(messageId);
                await fetchMessages();
            } catch (error) {
                console.error('Error deleting message:', error);
                alert('Failed to delete message.');
            }
        }
    };

    const handleClearConversation = async () => {
        if (window.confirm('Delete entire conversation? This cannot be undone.')) {
            try {
                await customerAPI.deleteConversation(service.provider.id);
                setMessages([]);
                onClose();
            } catch (error) {
                console.error('Error clearing conversation:', error);
                alert('Failed to clear conversation.');
            }
        }
    };

    if (!show || !service) return null;

    const customerName = sessionStorage.getItem('userName') || 'You';
    const providerName = service.provider.businessName || service.provider.name;

    // Determine if this is the initial message or a reply
    const hasExistingMessages = messages.length > 0;
    const headerText = hasExistingMessages
        ? (isProvider ? `Reply to Customer` : `Message ${providerName}`)
        : `Message with ${providerName}`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="messaging-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5 className="modal-title">
                        💬 {headerText}
                    </h5>
                    <div className="d-flex gap-2">
                        {messages.length > 0 && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={handleClearConversation}
                                title="Delete entire conversation"
                            >
                                🗑️ Clear
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                </div>

                <div className="modal-body messages-container">
                    {isLoading && messages.length === 0 ? (
                        <div className="text-center py-4">
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted mt-2">Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-muted">
                                No messages yet. Start the conversation!
                            </p>
                        </div>
                    ) : (
                        <div className="messages-list">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`message-item ${msg.senderType === 'customer'
                                        ? 'message-sent'
                                        : 'message-received'
                                        }`}
                                >
                                    <div className="message-content">
                                        <strong className="message-sender">
                                            {msg.senderType === 'customer' ? customerName : (msg.providerName || providerName)}
                                        </strong>
                                        <p className="message-text">{msg.message}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="message-time">
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </small>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-link text-danger p-0"
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                title="Delete message"
                                                style={{ fontSize: '0.75rem' }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <form onSubmit={handleSendMessage} className="message-form">
                        <input
                            type="text"
                            className="form-control message-input"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={isSending}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary btn-send"
                            disabled={!newMessage.trim() || isSending}
                        >
                            {isSending ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-1"
                                        role="status"
                                    ></span>
                                    Sending...
                                </>
                            ) : (
                                '📤 Send'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
