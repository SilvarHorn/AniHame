const fs = require('fs');

let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const customGradFunc = `
  const updateCustomGradient = (field: 'type' | 'dir' | 'c1' | 'c2', val: string) => {
    let t = gradType;
    let d = gradDir;
    let c1 = gradColor1;
    let c2 = gradColor2;
    if (field === 'type') t = val;
    if (field === 'dir') d = val;
    if (field === 'c1') c1 = val;
    if (field === 'c2') c2 = val;
    updateGradient(t, d, c1, c2);
    if (!isEditing) setIsEditing(true);
  };
`;

content = content.replace(
  "    setBgGradient(str);\n  };\n",
  "    setBgGradient(str);\n  };\n" + customGradFunc
);

// Add Custom Theme Color UI
const customThemeUI = `
                {/* Custom Color Picker */}
                <div 
                  className={cn(
                    "relative w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 transition-transform cursor-pointer flex items-center justify-center",
                    !['#8AD7D0', '#FF8A65', '#9575CD', '#4DB6AC', '#F06292', '#64B5F6'].includes(themeColor) 
                      ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-gray-900 border-transparent" 
                      : "border-dashed border-gray-500 hover:scale-110 hover:border-gray-400"
                  )}
                  style={{ backgroundColor: !['#8AD7D0', '#FF8A65', '#9575CD', '#4DB6AC', '#F06292', '#64B5F6'].includes(themeColor) ? themeColor : 'transparent' }}
                  title="Custom Color"
                >
                  {['#8AD7D0', '#FF8A65', '#9575CD', '#4DB6AC', '#F06292', '#64B5F6'].includes(themeColor) && (
                    <span className="text-gray-400 text-xs font-bold">+</span>
                  )}
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => {
                      setThemeColor(e.target.value);
                      if (!isEditing) setIsEditing(true);
                    }}
                    className="absolute -inset-4 w-16 h-16 cursor-pointer opacity-0"
                  />
                </div>
`;

content = content.replace(
  "                ))} \n              </div>\n            </div>",
  "                ))} " + customThemeUI + "\n              </div>\n            </div>"
);

// Ensure the replace happens correctly. Wait, the original code doesn't have a space before '\n              </div>'
// Let's do it safer:
content = content.replace(
  "                ))}\n              </div>",
  "                ))}\n" + customThemeUI + "\n              </div>"
);

// Add Custom Gradient Builder UI
const customGradientUI = `
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <label className="block text-xs font-medium text-gray-400 mb-2">Build Custom Gradient</label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Color 1</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="color" value={gradColor1} onChange={(e) => updateCustomGradient('c1', e.target.value)} className="w-8 h-8 rounded bg-transparent cursor-pointer" />
                        <span className="text-xs text-gray-400 uppercase">{gradColor1}</span>
                      </div>
                    </div>
                    {gradType !== 'solid' && (
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Color 2</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input type="color" value={gradColor2} onChange={(e) => updateCustomGradient('c2', e.target.value)} className="w-8 h-8 rounded bg-transparent cursor-pointer" />
                          <span className="text-xs text-gray-400 uppercase">{gradColor2}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select value={gradType} onChange={(e) => updateCustomGradient('type', e.target.value)} className="bg-gray-800 text-xs text-gray-300 px-2 py-1.5 rounded outline-none flex-1 border border-white/5">
                      <option value="solid">Solid</option>
                      <option value="linear">Linear</option>
                      <option value="radial">Radial</option>
                    </select>
                    {gradType !== 'solid' && (
                      <input type="text" value={gradDir} onChange={(e) => updateCustomGradient('dir', e.target.value)} placeholder="e.g. to right, 45deg" className="bg-gray-800 text-xs text-gray-300 px-2 py-1.5 rounded outline-none flex-1 border border-white/5" />
                    )}
                  </div>
                </div>
`;

content = content.replace(
  "              </div>\n            </div>",
  customGradientUI + "\n              </div>\n            </div>"
);

fs.writeFileSync('src/pages/Profile.tsx', content);
