import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ConversationForm.css';

interface Conversation {
  conversationId: string;
  user1: string;
  user2:string;
  startedAt:Date;
}

const ConversationForm: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const registeruser = sessionStorage.getItem('username');
  const [user1, setUser1] = useState<string>(String(registeruser));
  const [user2, setUser2] = useState<string>(username);
  const [startedAt, setStartedAt] = useState<string>(new Date().toISOString().split('T')[0]);
  const [conversations, setConversation] = useState<Conversation | null>(null);
  const [conversations1, setConversation1] = useState<Conversation | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get<Conversation>(
          `http://localhost:8082/api/conversations/${registeruser}/${username}`
        );
        if (response.data) {
          setConversation(response.data);
        } else {
          try {
            const response1 = await axios.get<Conversation>(
              `http://localhost:8082/api/conversations/${username}/${registeruser}`
            );
            setConversation1(response1.data);
          } catch (error) {
            console.error('Error fetching Conversation:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching Conversation:', error);
      }
    };
    if (!conversations) {
      fetchConversation();
    }
  }, [username, registeruser, conversations]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (conversations?.conversationId) {
      window.location.href = `http://localhost:3000/Message/${user1}/${user2}/${conversations.conversationId}`;
    } else if (conversations1?.conversationId) {
      window.location.href = `http://localhost:3000/Message/${user1}/${user2}/${conversations1.conversationId}`;
    } else {
      try {
        const response = await axios.post('http://localhost:8082/api/conversations', {
          user1,
          user2,
          startedAt,
        });
        console.log('Conversation created:');
        window.location.reload();
        alert('Request Accepted!!!');
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={user1} onChange={(e) => setUser1(e.target.value)} style={{ display: 'none' }} required />
        <br />
        <input type="text" value={user2} onChange={(e) => setUser2(e.target.value)} style={{ display: 'none' }} required />
        <br />
        <input type="date" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} style={{ display: 'none' }} required />
        <br />
        {(!conversations && !conversations1) ? (
          <button type="submit" className="request-button">
            Request Contact
          </button>
        ) : (
          <button type="submit" className="contact-button">
            Contact me
          </button>
        )}
      </form>
    </div>
  );
};

export default ConversationForm;
