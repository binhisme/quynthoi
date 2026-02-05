
import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import FloatingHearts from './components/FloatingHearts.tsx';

const App: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ top: '0px', left: '0px' });
  const [aiMessage, setAiMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hàm di chuyển nút "Hông" - Đảm bảo chỉ trong khung trắng
  const moveNoButton = useCallback(() => {
    if (!containerRef.current || !noButtonRef.current) return;

    // Lấy kích thước thực tế của khung card trắng (containerRef)
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const btnWidth = noButtonRef.current.offsetWidth;
    const btnHeight = noButtonRef.current.offsetHeight;

    // Vùng an toàn (padding 30px để không sát mép cong của card)
    const padding = 30;
    
    // Tính toán giới hạn tối đa mà nút có thể nằm trong
    const maxX = containerWidth - btnWidth - padding;
    const maxY = containerHeight - btnHeight - padding;

    // Tọa độ ngẫu nhiên mới
    const randomX = Math.max(padding, Math.random() * maxX);
    const randomY = Math.max(padding, Math.random() * maxY);

    setNoButtonPos({
      top: `${randomY}px`,
      left: `${randomX}px`
    });
    setIsMoved(true);
  }, []);

  const handleYes = async () => {
    setIsAccepted(true);
    setIsLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Hãy viết một lời tỏ tình siêu ngọt ngào cho Quỳn. Hãy nói rằng tui sẽ luôn trân trọng những khoảnh khắc bên nhau. Kết thúc bằng lời mời đi trà sữa.",
        config: {
            temperature: 1.0,
            systemInstruction: "Bạn là người yêu của Quỳn, đang cực kỳ hạnh phúc. Hãy dùng văn phong ngọt ngào, ấm áp nhưng vẫn trẻ trung của Gen Z Việt Nam."
        }
      });
      setAiMessage(response.text || "Tui biết là Quỳn không nỡ từ chối mà! Thương Quỳn nhất!");
    } catch (error) {
      console.error("Gemini Error:", error);
      setAiMessage("Hạnh phúc quá không nói nên lời luôn nè Quỳn ơi! Iu Quỳn nhất trên đời! ❤️");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-pink-50 overflow-hidden">
      <FloatingHearts count={25} />

      {!isAccepted ? (
        /* KHUNG TRẮNG CHÍNH (Container) */
        <div 
          ref={containerRef}
          className="relative z-10 text-center bg-white/95 backdrop-blur-md p-10 rounded-[3rem] shadow-[0_20px_60px_rgba(255,182,193,0.4)] border-4 border-pink-200 max-w-sm w-full min-h-[550px] flex flex-col items-center justify-center overflow-hidden transition-all duration-500"
        >
          {/* Khu vực nội dung */}
          <div className="flex-1 flex flex-col items-center justify-center w-full pointer-events-none mb-6">
            <div className="relative mb-6 animate-pulse-slow">
              <span className="text-[120px] leading-none drop-shadow-2xl inline-block filter saturate-150">
                ❤️
              </span>
              <div className="absolute inset-0 bg-pink-300 blur-3xl opacity-40 -z-10 rounded-full scale-125"></div>
            </div>

            <h1 className="text-3xl md:text-4xl font-pacifico text-pink-600 mb-2 leading-tight drop-shadow-sm px-2">
              Quỳn quỳn có iu tui hông? 🥺
            </h1>
          </div>
          
          {/* Khu vực các nút - Xóa 'relative' ở đây để nút Hông bay tự do trong Card chính */}
          <div className="flex justify-center items-center w-full h-32">
            <button
              onClick={handleYes}
              className="bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-4 px-12 rounded-full shadow-[0_10px_25px_rgba(244,63,94,0.4)] transform transition active:scale-95 text-2xl z-10"
            >
              Cóoooo ❤️
            </button>

            <button
              ref={noButtonRef}
              onMouseEnter={moveNoButton}
              onClick={moveNoButton}
              style={{ 
                position: isMoved ? 'absolute' : 'relative',
                top: isMoved ? noButtonPos.top : 'auto',
                left: isMoved ? noButtonPos.left : 'auto',
                transition: isMoved ? 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
                marginLeft: isMoved ? '0' : '1.5rem',
                zIndex: 50 // Cao hơn tất cả để luôn nhìn thấy
              }}
              className="bg-white border-2 border-pink-100 text-gray-500 font-bold py-2 px-6 rounded-full shadow-md text-lg cursor-default whitespace-nowrap hover:bg-pink-50 transition-colors"
            >
              Hông...
            </button>
          </div>
        </div>
      ) : (
        /* Màn hình sau khi đồng ý */
        <div className="z-10 text-center max-w-lg w-full p-4 animate-pop-in">
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border-t-8 border-pink-400 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50"></div>

            <div className="w-24 h-24 mx-auto mb-6 bg-pink-50 rounded-full flex items-center justify-center shadow-inner">
               <span className="text-5xl animate-bounce">🥰</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-pacifico text-pink-600 mb-6">
              Hí hí, biết mà!
            </h2>
            
            <div className="text-lg text-pink-800 leading-relaxed italic mb-8 min-h-[120px] flex items-center justify-center bg-pink-50/50 p-6 rounded-2xl border border-pink-100">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-heartbeat text-4xl mb-2 text-pink-500">💓</div>
                  <p className="text-xs font-bold text-pink-400 uppercase tracking-widest">Đang tải yêu thương...</p>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{aiMessage}</p>
              )}
            </div>

            <button 
              onClick={() => { setIsAccepted(false); setAiMessage(""); setIsMoved(false); }}
              className="text-pink-300 hover:text-pink-500 transition-colors text-xs uppercase tracking-widest font-bold"
            >
              Hỏi lại lần nữa?
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.5) rotate(-5deg); }
          70% { transform: scale(1.05) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        .animate-pop-in {
          animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s infinite ease-in-out;
        }
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
