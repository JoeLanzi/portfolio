"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPopup.module.scss";
import { IconButton, Flex, Input, Heading, Text } from "@/once-ui/components";
import { sendChatMessage } from "@/app/api/chat";
import { useConversationStore } from "@/app/api/stores/useConversationStore";
import { INITIAL_MESSAGE } from "@/app/api/config/constants";
import ReactMarkdown from "react-markdown";

export const PopChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { chatMessages, setChatMessages } = useConversationStore();

  const chatContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    setChatMessages([
      {
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", text: INITIAL_MESSAGE }]
      }
    ]);
  }, [setChatMessages]);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      // Create a copy of the current messages first
      const currentMessages = [...chatMessages];
      
      // Create user message
      const userMessage = {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: message }]
      };
      
      // Add user message to our local copy
      const updatedMessages = [...currentMessages, userMessage];
      
      // Update state with the new array
      setChatMessages(updatedMessages);
      setMessage("");
      setIsSearching(true); // Set searching state to true when sending message
  
      try {
        // Send message to API
        await sendChatMessage(message, (data) => {
          const { event, data: eventData } = data;
          
          // Check for search-related events
          if (event === "tool_calls.web_search_call") {
            setIsSearching(true);
          }
          
          // Check for events that indicate search completion
          if (event === "tool_calls.web_search_call.done" || 
              event === "response.output_text.delta") {
            setIsSearching(false);
          }
  
          // Always work with a fresh copy of the current state
          const latestMessages = [...useConversationStore.getState().chatMessages];
  
          if (event === "response.output_text.delta" || event === "response.output_text.annotation.added") {
            const { delta, item_id, annotation } = eventData;
            const partial = typeof delta === "string" ? delta : "";
            
            // Find existing assistant message with this ID
            const assistantIndex = latestMessages.findIndex(
              msg => msg.type === "message" && msg.role === "assistant" && msg.id === item_id
            );
            
            if (assistantIndex === -1) {
              // No matching message found, create new one
              latestMessages.push({
                type: "message",
                role: "assistant",
                id: item_id,
                content: [{ type: "output_text", text: partial }]
              });
            } else {
              // Update existing message
              const contentItem = latestMessages[assistantIndex].content[0];
              if (contentItem && contentItem.type === "output_text") {
                contentItem.text += partial;
                if (annotation) {
                  contentItem.annotations = [...(contentItem.annotations ?? []), annotation];
                }
              }
            }
            
            // Update state with the new array
            setChatMessages([...latestMessages]);
          } else if (event === "response.output_item.added") {
            const { item } = eventData;
            if (item && item.content && item.content.text) {
              latestMessages.push({
                type: "message",
                role: "assistant",
                id: item.id,
                content: [{ type: "output_text", text: item.content.text }]
              });
              setChatMessages([...latestMessages]);
            }
          } else if (event === "response.output_item.done") {
            const { item } = eventData;
            const index = latestMessages.findIndex(msg => msg.id === item.id);
            if (index !== -1) {
              latestMessages[index].done = true;
              setChatMessages([...latestMessages]);
            }
            setIsSearching(false); // Ensure searching is set to false when done
          }
          
          // Scroll to bottom
          setTimeout(() => {
            if (chatContentRef.current) {
              chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
            }
          }, 100);
        });
      } catch (error) {
        console.error("Error sending message:", error);
        setChatMessages([
          ...updatedMessages,
          { 
            type: "message", 
            role: "assistant", 
            content: [{ type: "output_text", text: "An error occurred." }] 
          }
        ]);
        setIsSearching(false);
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
      <div className={`${styles.chatPanel} ${isOpen ? styles.open : ""} ${isExpanded ? styles.expanded : ""}`}>
        <div className={styles.expandButtonContainer}>
          <IconButton
            icon="expand"
            onClick={handleExpand}
            size="s"
            variant="ghost"
            aria-label="Expand chat"
            className={styles.expandButton}
          />
        </div>
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
            {chatMessages.map((msg, index) => (
              <Flex key={index} style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }} fillWidth>
                <div className={msg.role === "user" ? styles.userMessage : styles.replyMessage}>
                  <ReactMarkdown>
                    {msg.content && Array.isArray(msg.content) && msg.content[0] && 
                    typeof msg.content[0].text === 'string' ? msg.content[0].text : ''}
                  </ReactMarkdown>
                </div>
              </Flex>
            ))}
            {isSearching && (
              <div className={styles.searchingIndicator}>
                <Text>Using Search Skill </Text>
                <div className={styles.searchingDot}></div>
                <div className={styles.searchingDot}></div>
                <div className={styles.searchingDot}></div>
              </div>
            )}
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