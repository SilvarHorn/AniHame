const fs = require('fs');
let code = fs.readFileSync('src/components/home/TrendingGrid.tsx', 'utf8');

code = code.replace(
  'const [isDragging, setIsDragging] = useState(false);',
  'const [isDragging, setIsDragging] = useState(false);\n  const [hasDragged, setHasDragged] = useState(false);'
);

const newMouseDown = `  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    
    // Ignore if clicking on the scrollbar (bottom 15px of the element)
    const rect = scrollRef.current.getBoundingClientRect();
    if (e.clientY >= rect.bottom - 15) return;
    
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };`;
code = code.replace(/  const handleMouseDown = \(e: MouseEvent\) => \{[\s\S]*?setScrollLeft\(scrollRef\.current\.scrollLeft\);\n  \};/, newMouseDown);

const newMouseMove = `  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll fast
    if (Math.abs(x - startX) > 5) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };`;
code = code.replace(/  const handleMouseMove = \(e: MouseEvent\) => \{[\s\S]*?scrollRef\.current\.scrollLeft = scrollLeft - walk;\n  \};/, newMouseMove);

const newCapture = `  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleClickCapture = (e: MouseEvent) => {
    if (hasDragged) {
      e.stopPropagation();
      e.preventDefault();
    }
  };`;
code = code.replace('  const handleMouseUp = () => {\n    setIsDragging(false);\n  };', newCapture);

code = code.replace(
  'onMouseMove={handleMouseMove}',
  'onMouseMove={handleMouseMove}\n          onClickCapture={handleClickCapture}'
);

fs.writeFileSync('src/components/home/TrendingGrid.tsx', code);
