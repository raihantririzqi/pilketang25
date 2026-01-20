"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per character
  delay?: number; // initial delay before typing starts
  showCursor?: boolean;
}

const TypingText = ({
  text,
  className = "",
  speed = 100,
  delay = 500,
  showCursor = true,
}: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Initial delay before typing
    const startTimer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsDone(true);
    }
  }, [displayedText, isTyping, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isDone && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block ml-1"
        >
          |
        </motion.span>
      )}
      {/* Invisible placeholder to prevent layout shift */}
      <span className="invisible">{text.slice(displayedText.length)}</span>
    </span>
  );
};

export default TypingText;
