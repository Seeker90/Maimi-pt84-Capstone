import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { customerAPI } from '../fetch';
import './../../lib/MessagingModal.css';

export const MessagingModal = ({ show, service, onClose, isProvider = false }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const abortControllerRef = useRef(null);

    const providerId = service?.provider?.id;
    const serviceId = service?.id;
    const customerName = useMemo(() => sessionStorage.getItem('userName') || 'You', []);
    const providerName = useMemo(() =>
        service?.provider?.businessName || service?.provider?.name || 'Provider',
        [service?.provider?.businessName, service?.provider?.name]
    );

    const fetchMessages = useCallback(async (showLoading = false) => {
        if (!providerId) return;

        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        if (showLoading) setIsLoading(true);

        try {
            const data = await customerAPI.getMessages(providerId);
            setMessages(data || []);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching messages:', error);
            }
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, [providerId]);

    useEffect(() => {
        if (!show || !providerId) return;

        fetchMessages(true);
        const interval = setInterval(() => fetchMessages(false), 5000);

        return () => {
            clearInterval(interval);
            abortControllerRef.current?.abort();
        };
    }, [show, providerId, fetchMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();
        const text = newMessage.trim();
        if (!text || !providerId) return;

        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
            id: tempId,
            message: text,
            senderType: 'customer',
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');
        setIsSending(true);

        try {
            await customerAPI.sendMessage(providerId, text, serviceId);
            await fetchMessages(false);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setNewMessage(text);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    }, [newMessage, providerId, serviceId, fetchMessages]);

    const handleDeleteMessage = useCallback(async (messageId) => {
        if (!window.confirm('Delete this message?')) return;

        setMessages(prev => prev.filter(m => m.id !== messageId));

        try {
            await customerAPI.deleteMessage(messageId);
        } catch (error) {
            console.error('Error deleting message:', error);
            fetchMessages(false);
            alert('Failed to delete message.');
        }
    }, [fetchMessages]);

    const handleClearConversation = useCallback(async () => {
        if (!window.confirm('Delete entire conversation? This cannot be undone.')) return;

        try {
            await customerAPI.deleteConversation(providerId);
            setMessages([]);
            onClose();
        } catch (error) {
            console.error('Error clearing conversation:', error);
            alert('Failed to clear conversation.');
        }
    }, [providerId, onClose]);

    if (!show || !service) return null;

    return (
        <div className="modal-backdrop-custom position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            onClick={onClose}>
            <div className="bg-white rounded-4 shadow-lg d-flex flex-column messaging-modal-container"
                onClick={(e) => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="mb-0 fw-semibold">
                        💬 {messages.length > 0 ? `Message ${providerName}` : `Start chat with ${providerName}`}
                    </h5>
                    <div className="d-flex gap-2">
                        {messages.length > 0 && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={handleClearConversation}
                            >
                                🗑️ Clear
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        />
                    </div>
                </div>
                <div className="flex-grow-1 overflow-auto p-3 messages-area">
                    {isLoading && messages.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="spinner-border spinner-border-sm text-primary" role="status" />
                            <p className="text-muted mt-2 mb-0">Loading...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted mb-0">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            {messages.map((msg) => (
                                <MessageItem
                                    key={msg.id}
                                    msg={msg}
                                    customerName={customerName}
                                    providerName={providerName}
                                    onDelete={handleDeleteMessage}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
                <div className="p-3 border-top">
                    <form onSubmit={handleSendMessage} className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={isSending}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="btn btn-primary btn-send px-4"
                            disabled={!newMessage.trim() || isSending}
                        >
                            {isSending ? (
                                <span className="spinner-border spinner-border-sm" role="status" />
                            ) : (
                                '📤'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const MessageItem = React.memo(({ msg, customerName, providerName, onDelete }) => {
    const isSent = msg.senderType === 'customer';

    return (
        <div className={`d-flex ${isSent ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`rounded-3 px-3 py-2 ${isSent ? 'message-sent text-white' : 'bg-light'}`}
                style={{ maxWidth: '80%' }}>
                <small className={`d-block fw-semibold ${isSent ? 'opacity-75' : 'text-muted'}`}>
                    {isSent ? customerName : (msg.providerName || providerName)}
                </small>
                <p className="mb-1">{msg.message}</p>
                <div className="d-flex justify-content-between align-items-center gap-3">
                    <small className={isSent ? 'opacity-75' : 'text-muted'}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </small>
                    {!msg.isOptimistic && (
                        <button
                            type="button"
                            className={`btn btn-sm p-0 border-0 ${isSent ? 'text-white opacity-75' : 'text-danger'}`}
                            onClick={() => onDelete(msg.id)}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});