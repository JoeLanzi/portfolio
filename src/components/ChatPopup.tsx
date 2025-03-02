"use client";

import React from "react";
import styles from "./ChatPopup.module.scss";
import chatIcon from '../components/resources/chat.png';
import Image from 'next/image';

export const PopChat: React.FC = () => {
  const handleClick = () => {
    console.log("Chat icon clicked");
  };

  return (
    <div className={styles.chatCon} onClick={handleClick} title="AI Chat Coming Soon">
      <Image
        src={chatIcon}
        alt="Chat Icon"
        className={styles.chatIcon}
      />
    </div>
  );
};

export default PopChat;