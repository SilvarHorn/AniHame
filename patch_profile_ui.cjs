const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const searchStr = `            <div className="w-full md:w-auto">
              <form onSubmit={handleEmailAuth} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white outline-none w-full sm:w-48"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white outline-none w-full sm:w-48"
                />
                <button type="submit" onClick={() => setAuthMode('login')} className="px-4 py-2 bg-primary text-[#0B0C0F] font-bold rounded-lg shrink-0">Log In</button>
                <button type="button" onClick={handleGoogleLogin} className="px-4 py-2 bg-white text-black font-bold rounded-lg shrink-0">Google</button>
              </form>
              {authError && <div className="text-red-400 text-sm mt-2 text-right">{authError}</div>}
            </div>`;

const replaceStr = `            <div className="w-full md:w-auto">
              <form onSubmit={handleEmailAuth} className="flex flex-col items-end gap-3">
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-end">
                  {authMode === 'register' && (
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white outline-none w-full sm:w-36"
                      required
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white outline-none w-full sm:w-48"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-end">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white outline-none w-full sm:w-48"
                    required
                  />
                  {authMode === 'register' && (
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white outline-none w-full sm:w-48"
                      required
                    />
                  )}
                </div>
                
                <div className="flex items-center gap-3 w-full justify-end mt-2">
                  <button 
                    type="button" 
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} 
                    className="text-xs text-gray-400 hover:text-primary transition-colors px-2"
                  >
                    {authMode === 'login' ? 'Create an account' : 'Already have an account? Log In'}
                  </button>
                  <button type="submit" className="px-5 py-2 bg-primary text-[#0B0C0F] font-bold rounded-lg shrink-0">
                    {authMode === 'login' ? 'Log In' : 'Sign Up'}
                  </button>
                  {authMode === 'login' && (
                    <button type="button" onClick={handleGoogleLogin} className="px-5 py-2 bg-white text-black font-bold rounded-lg shrink-0">
                      Google
                    </button>
                  )}
                </div>
              </form>
              {authError && <div className="text-red-400 text-sm mt-2 text-right">{authError}</div>}
            </div>`;

content = content.replace(searchStr, replaceStr);
fs.writeFileSync('src/pages/Profile.tsx', content);
