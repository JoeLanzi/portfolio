"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPopup.module.scss";
import { IconButton, Flex, Input, Heading, Text } from "@/once-ui/components";
import { usePathname } from "next/navigation";

export const PopChat: React.FC = () => {
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { type: "reply", text: "AI Chat is not available at this time but it is coming soon!" },
  ]);
  const [aiReplyCount, setAiReplyCount] = useState(0);

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

  const handleSendMessage = () => {
    if (message.trim()) {
      // Append user's message
      setMessages((prev) => [...prev, { type: "user", text: message }]);
      setMessage("");

      // Simulate AI reply after a 1s delay
      setTimeout(() => {
        const newCount = aiReplyCount + 1;
        setAiReplyCount(newCount);

        let replyText = "";
        if (newCount === 1) {
          replyText = "The AI Chat will be coming soon...";
        } else if (newCount === 2) {
          replyText = "Hey! I'm still working on this.. Come back later...";
        } else if (newCount === 3 || newCount === 4) {
          replyText = "...";
        } else if (newCount === 5) {
          replyText = "So you think you're funny huh!? But really the AI Chat feature will be coming soon! Please wait!";
        } else if (newCount >= 6 && newCount < 10) {
          replyText = "...";
        } else if (newCount === 10) {
          replyText = "OK OK! Email me so you can work on this since you really want this feature!";
        } else {
          replyText = "...";
        }

        setMessages((prev) => [
          ...prev,
          { type: "reply", text: replyText },
        ]);
      }, 1000);
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
            className={pathname === "/chat" ? styles.active : ""}
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
            />
          </div>
        </Flex>
      </div>
    </>
  );
};

export default PopChat;