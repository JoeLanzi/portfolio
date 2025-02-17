"use client";

import React, { useEffect, useState } from "react";
import { Column, Flex, Text } from "@/once-ui/components";
import classNames from "classnames";
import styles from "./about.module.scss";

interface TableOfContentsProps {
  structure: {
    title: string;
    display: boolean;
    items: string[];
  }[];
  about: {
    tableOfContent: {
      display: boolean;
      subItems: boolean;
    };
  };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure, about }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = 80; // adjust to match any fixed header, etc.
      const scrollPosition = window.scrollY + offset;
      
      // Check if we're scrolled to bottom – if yes, set the last section active.
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setActiveSection(structure.filter(s => s.display).pop()?.title || null);
        return;
      }
  
      let currentActive = structure[0]?.title;
      structure.forEach((section) => {
        if (!section.display) return;
        const element = document.getElementById(section.title);
        if (element) {
          // Use the midpoint of each section
          const sectionMid = element.offsetTop + element.offsetHeight / 2;
          if (sectionMid <= scrollPosition) {
            currentActive = section.title;
          }
        }
      });
      setActiveSection(currentActive);
    };
  
    window.addEventListener("scroll", handleScroll);
    // initialize on mount
    handleScroll();
  
    return () => window.removeEventListener("scroll", handleScroll);
  }, [structure]);

  const scrollTo = (id: string, offset: number) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (!about.tableOfContent.display) return null;

  return (
    <Column
      left="0"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
      }}
      position="fixed"
      paddingLeft="24"
      gap="32"
      hide="m"
    >
      {structure
        .filter((section) => section.display)
        .map((section, sectionIndex) => (
          <Column key={sectionIndex} gap="12">
            <Flex
              cursor="interactive"
              className={classNames(styles.hover, {
                [styles.active]: activeSection === section.title,
              })}
              gap="8"
              vertical="center"
              onClick={() => scrollTo(section.title, 80)}
            >
              <Flex height="1" minWidth="16" background="neutral-strong"></Flex>
              <Text>{section.title}</Text>
            </Flex>
            {about.tableOfContent.subItems && (
              <>
                {section.items.map((item, itemIndex) => (
                  <Flex
                    hide="l"
                    key={itemIndex}
                    style={{ cursor: "pointer" }}
                    className={classNames(styles.hover, {
                      [styles.active]: activeSection === item,
                    })}
                    gap="12"
                    paddingLeft="24"
                    vertical="center"
                    onClick={() => scrollTo(item, 80)}
                  >
                    <Flex height="1" minWidth="8" background="neutral-strong"></Flex>
                    <Text>{item}</Text>
                  </Flex>
                ))}
              </>
            )}
          </Column>
        ))}
    </Column>
  );
};

export default TableOfContents;