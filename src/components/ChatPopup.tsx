"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./ChatPopup.module.scss";
import { IconButton, Flex, Input, Heading, Text } from "@/once-ui/components";
import { sendChatMessage, INITIAL_MESSAGE } from "@/app/api";
import type { ChatMessageItem } from "@/app/api";
import { useConversationStore } from "@/app/api/stores/useConversationStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const INTERNAL_CHAT_HOSTS = new Set([
  "joelanzi.com",
  "www.joelanzi.com",
  "localhost:3000",
  "localhost:3001",
]);

function getChatErrorMessage(errorData: unknown): string {
  const fallback = "The chat ran into an error. Please try again in a moment.";

  if (!errorData || typeof errorData !== "object") {
    return fallback;
  }

  const message = typeof (errorData as { message?: unknown }).message === "string"
    ? (errorData as { message: string }).message
    : "";
  const code = typeof (errorData as { code?: unknown }).code === "string"
    ? (errorData as { code: string }).code
    : "";

  if (code === "insufficient_quota" || /quota|billing/i.test(message)) {
    return "The chat is temporarily unavailable because the OpenAI API quota has been exceeded. Please check billing or try again later.";
  }

  return message || fallback;
}

function getInternalHref(href?: string): string | null {
  if (!href) {
    return null;
  }

  if (href.startsWith("/")) {
    return href;
  }

  if (href.startsWith("#")) {
    return href;
  }

  try {
    const url = new URL(href);
    if (INTERNAL_CHAT_HOSTS.has(url.host)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return null;
  }

  return null;
}

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
    const initialAssistantMessage: ChatMessageItem = {
      type: "message",
      role: "assistant",
      content: [{ type: "output_text", text: INITIAL_MESSAGE }],
    };

    setChatMessages([initialAssistantMessage]);
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
      const userMessage: ChatMessageItem = {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: message }],
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

          // Stop the loading state once text starts streaming or the response finishes.
          if (
            event === "error" ||
            event === "response.failed" ||
            event === "response.incomplete" ||
            event === "response.output_text.delta" ||
            event === "response.completed" ||
            event === "done"
          ) {
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
                content: [{ type: "output_text", text: partial }],
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
                content: [{ type: "output_text", text: item.content.text }],
              });
              setChatMessages([...latestMessages]);
            }
          } else if (event === "error" || event === "response.failed" || event === "response.incomplete") {
            const errorText = getChatErrorMessage(eventData);
            const lastMessage = latestMessages[latestMessages.length - 1];

            if (
              lastMessage?.type === "message" &&
              lastMessage.role === "assistant" &&
              lastMessage.content?.[0]?.text === errorText
            ) {
              return;
            }

            latestMessages.push({
              type: "message",
              role: "assistant",
              content: [{ type: "output_text", text: errorText }],
            });
            setChatMessages([...latestMessages]);
          } else if (event === "response.output_item.done") {
            const { item } = eventData;
            const index = latestMessages.findIndex(msg => msg.id === item.id);
            if (index !== -1) {
              latestMessages[index].done = true;
              setChatMessages([...latestMessages]);
            }
            setIsSearching(false);
          }
          
          // Scroll to bottom
          setTimeout(() => {
            if (chatContentRef.current) {
              chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
            }
          }, 100);
        }, {
          pathname: window.location.pathname,
          title: document.title,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        setChatMessages([
          ...updatedMessages,
          {
            type: "message",
            role: "assistant",
            content: [{ type: "output_text", text: "An error occurred." }],
          },
        ]);
        setIsSearching(false);
      }
    }
  };

  const renderMessageText = (message: ChatMessageItem) => {
    const text =
      message.content &&
      Array.isArray(message.content) &&
      message.content[0] &&
      typeof message.content[0].text === "string"
        ? message.content[0].text
        : "";

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            (() => {
              const internalHref = getInternalHref(href);

              if (internalHref) {
                if (internalHref.startsWith("#")) {
                  return <a href={internalHref}>{children}</a>;
                }

                return <Link href={internalHref}>{children}</Link>;
              }

              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            })()
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    );
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
                  {renderMessageText(msg)}
                </div>
              </Flex>
            ))}
            {isSearching && (
              <div className={styles.searchingIndicator}>
                <Text>Thinking</Text>
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
