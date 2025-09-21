import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Inbox from './inbox';
import './Message.css';
import {
  MDBCard,
  MDBIcon
} from 'mdb-react-ui-kit';
import Picker from 'emoji-picker-react';

interface Message {
  messageId: string;
  sender: string;
  messageText: string;
  sentAt: string;
}

function Message() {
  const { username, username2, conversation } = useParams<{ username: string; username2: string; conversation: string; }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [inbox, setInbox] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const messageDisplayRef = useRef<HTMLDivElement>(null);
  const defaultImageUrl = 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg'; 

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>(`http://localhost:8082/api/messages/${conversation}`);
        setMessages(response.data);

        const inboxresponse = await axios.get(`http://localhost:8082/api/inbox/conversation/${conversation}`);
        setInbox(inboxresponse.data);

        if(inboxresponse.data.length!==0){
          const readornot = await axios.patch(`http://localhost:8082/api/inbox/changeIsRead/${conversation}/${username}`);
          console.log("message read",readornot.data);
        }

        try {
          const image = await axios.get(`http://localhost:8082/api/images/${username2}`, {
          responseType: 'blob', 
        });
        if (image.data) {
          const imageUrl = URL.createObjectURL(image.data);
          setImageURL(imageUrl);
        }
        } catch (error) {
          console.error(`Error fetching image for ${username2}:`, error);
        }

        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (conversation) {
      fetchMessages();
    }
  }, [conversation, username, username2]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messageDisplayRef.current) {
      messageDisplayRef.current.scrollTop = messageDisplayRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    try {
      const currentDate = new Date().toISOString();
      await axios.post('http://localhost:8082/api/messages/save', {
        sender: username,
        receiver: username2,
        conversation: conversation,
        messageText: newMessage,
        sentAt: currentDate,
      });

      if (inbox.length !== 0) {
        const inboxresponse = await axios.post(`http://localhost:8082/api/inbox/${conversation}/${username}`, {
          conversationId: conversation,
          username: username,
          user2: username2,
          message: newMessage,
          read: true,
          archived: false,
        });
        const inboxresponse2 = await axios.post(`http://localhost:8082/api/inbox/${conversation}/${username2}`, {
          conversationId: conversation,
          username: username2,
          user2: username,
          message: newMessage,
          read: false,
          archived: false,
        });
        console.log('Message sent successfully:', inboxresponse.data, inboxresponse2.data);
      }else {
        const inboxresponse = await axios.post('http://localhost:8082/api/inbox', {
          conversationId: conversation,
          username: username,
          user2: username2,
          message: newMessage,
          read: false,
          archived: false,
        });

        const inboxresponse2 = await axios.post('http://localhost:8082/api/inbox', {
          conversationId: conversation,
          username: username2,
          user2: username,
          message: newMessage,
          read: false,
          archived: false,
        });
        console.log('Message sent successfully:', inboxresponse2.data, inboxresponse.data);
      }
      window.location.reload();
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className='msg-border'>
      <div className='messaging-platform'>
        <div className='message-full-div'>
        <Inbox />
          <div className='message-div'>
            <div className='msg-profile-div'>
              {imageURL ? (<img src={imageURL} alt="Uploaded" style={{ maxWidth: '100%' }} className='profile-image-msg' />):(<img src={defaultImageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} className='profile-image-msg' />)}
              <h2 className='user2-username'>@{username2}</h2>
              <hr className='horizontel' />
            </div>
            <div className='message-dispaly' ref={messageDisplayRef}>
              {messages.map((message) => (
                <div key={message.messageId} className={message.sender === username ? 'user1-message-div' : 'user2-message-div'}>
                  <MDBCard className={message.sender === username ? 'user1-message' : 'user2-message'}>
                    <p className={message.sender === username ? 'message-text' : 'message-text-1'}>
                      {message.messageText}
                    </p>
                    <p className={message.sender === username ? 'message-time' : 'message-time-1'}>
                      {new Date(message.sentAt).toLocaleString()}
                    </p>
                  </MDBCard>
                </div>
              ))}
            </div>
            <div className='footer-msg'>
              <button className='emoji-btn'><MDBIcon far icon="grin-alt" size='lg' onClick={() => setShowPicker((val) => !val)} /></button>
              {showPicker && (
                <div className='emoji-picker'>
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
              
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newMessage.trim() !== '') {
                    handleSendMessage();
                  }
                }}
                className='message-input'
              />
              <button onClick={handleSendMessage} className='message-send-btn' disabled={!newMessage.trim()}><MDBIcon fas icon="paper-plane" size='lg' style={{ color: '#FFFDFD' }} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
