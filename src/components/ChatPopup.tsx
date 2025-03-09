"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPopup.module.scss";
import { IconButton, Flex, Input, Heading, Text } from "@/once-ui/components";
import { sendChatMessage } from "@/app/api";

export const PopChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { type: "reply", text: "You can ask any questions about my portfolio, projects, blogs, and my resume!" },
  ]);

  const chatContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClick = () => {
    console.log("Chat icon clicked");
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      // Append user's message
      setMessages((prev) => [...prev, { type: "user", text: message }]);
      setMessage("");

      try {
        // Send message to the API and get the reply
        const reply = await sendChatMessage(message);
        setMessages((prev) => [...prev, { type: "reply", text: reply.message }]);  // Update this line to use reply.message
      } catch (error) {
        setMessages((prev) => [...prev, { type: "reply", text: "An error occurred.." }]);
      }
    }
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <div className={styles.chatCon}>
          <IconButton
            icon="chat"
            onClick={handleClick}
            tooltip="AI Chat"
            size="s"
            variant="ghost"
          />
        </div>
      )}

      {/* Chat panel */}
      <div className={`${styles.chatPanel} ${isOpen ? styles.open : ""}`}>
        <div className={styles.closeButtonContainer}>
          <IconButton
            icon="close"
            onClick={handleClose}
            size="s"
            variant="ghost"
            aria-label="Close chat"
            className={styles.closeButton}
          />
        </div>
        <Flex direction="column" fillWidth style={{ overflowY: "auto" }}>
          <div className={styles.header}>
            <Heading variant="heading-strong-l">AI Chat</Heading>
          </div>
          <div className={styles.chatContent} ref={chatContentRef}>
            {messages.map((msg, index) => (
              <Flex key={index} style={{ justifyContent: msg.type === "user" ? "flex-end" : "flex-start" }} fillWidth>
                <div className={msg.type === "user" ? styles.userMessage : styles.replyMessage}>
                  <Text>{msg.text}</Text>
                </div>
              </Flex>
            ))}
          </div>
          <div className={styles.inputContainer}>
            <Input
              id="chat-input"
              label="Type a message"
              value={message}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              hasSuffix={
                <IconButton
                  onClick={handleSendMessage}
                  variant="ghost"
                  size="s"
                  icon="send"
                >
                </IconButton>
              }
            />
          </div>
        </Flex>
      </div>
    </>
  );
};

export default PopChat;