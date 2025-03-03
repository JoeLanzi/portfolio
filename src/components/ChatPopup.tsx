"use client";

import React from "react";
import styles from "./ChatPopup.module.scss";
import { ToggleButton } from "@/once-ui/components";
import { usePathname } from "next/navigation";

export const PopChat: React.FC = () => {
  const pathname = usePathname() ?? "";

  const handleClick = () => {
    console.log("Chat icon clicked");
  };

  return (
    <div className={styles.chatCon} onClick={handleClick} title="AI Chat Coming Soon">
      <ToggleButton
        prefixIcon="chat"
        selected={pathname === "/chat"}
      />
    </div>
  );
};

export default PopChat;