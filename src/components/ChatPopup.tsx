"use client";

import React, { useState } from "react";
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
      setMessages([...messages, { type: "user", text: message }]);
      setMessage("");

      // Simulate AI reply
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "reply", text: "AI Chat is not available at this time but it is coming soon!" },
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
          <div className={styles.chatContent}>
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