const fs = require('fs');
let code = fs.readFileSync('src/components/home/TrendingGrid.tsx', 'utf8');

const oldMouseDown = `  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };`;

const newMouseDown = `  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    
    // Ignore if clicking on the scrollbar (bottom 15px of the element)
    const rect = scrollRef.current.getBoundingClientRect();
    if (e.clientY >= rect.bottom - 15) return;
    
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };`;

code = code.replace(oldMouseDown, newMouseDown);

// Also add select-none to the wrapper to prevent any text selection highlights
code = code.replace(
  'className={`flex gap-3 overflow-x-auto dotted-scrollbar pb-4 ${isDragging ? \'cursor-grabbing select-none\' : \'cursor-grab snap-x snap-mandatory\'}`}',
  'className={`flex gap-3 overflow-x-auto dotted-scrollbar pb-4 select-none ${isDragging ? \'cursor-grabbing\' : \'cursor-grab snap-x snap-mandatory\'}`}'
);

fs.writeFileSync('src/components/home/TrendingGrid.tsx', code);
