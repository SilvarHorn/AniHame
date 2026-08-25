import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface MarqueeTextProps {
  text: string;
  className?: string;
}

export function MarqueeText({ text, className }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        // Need to un-set isOverflowing briefly if we wanted to accurately measure, 
        // but since we keep the textRef as the first child and just read its scrollWidth vs container clientWidth
        // we can measure textRef.current.getBoundingClientRect().width vs containerRef.current.clientWidth
        
        const containerWidth = containerRef.current.clientWidth;
        // scrollWidth of a span might be weird, getBoundingClientRect is safer
        const textWidth = textRef.current.getBoundingClientRect().width;
        
        setIsOverflowing(textWidth > containerWidth);
      }
    };
    
    checkOverflow();
    const timeout = setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text]);

  return (
    <div ref={containerRef} className={cn("w-full overflow-hidden flex", className)}>
      <div 
        className={cn(
          "whitespace-nowrap flex items-center",
          isOverflowing ? "animate-marquee" : "w-full justify-center"
        )}
        style={isOverflowing ? { width: 'max-content' } : {}}
      >
        <span ref={textRef} className={isOverflowing ? "pr-8" : ""}>{text}</span>
        {isOverflowing && <span className="pr-8">{text}</span>}
      </div>
    </div>
  );
}
