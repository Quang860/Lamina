import React from 'react';
import { motion } from 'motion/react';
import { Activity, TrendingUp, TrendingDown, Minus, MessageSquare, Users } from 'lucide-react';
import { cn } from '../App';

interface SentimentDashboardProps {
  config: {
    symbol: "string";
    sentimentScore: "number";
    bullishPercentage: "number";
    bearishPercentage: "number";
    neutralPercentage: "number";
    keyKeywords: "string"[];
    summary: "string";
    timeframe?: "string";
    context?: "string";
    reflexivityState?: "string";
    reflexivityIntensity?: "number"; // 0-100
    tippingPointWarning?: "string";
  };
}

export const SentimentDashboard: React.FC<SentimentDashboardProps> = ({ config }) => {
  const {
    symbol,
    sentimentScore,
    bullishPercentage,
    bearishPercentage,
    neutralPercentage,
    keyKeywords,
    summary,
    timeframe,
    context,
    reflexivityState,
    reflexivityIntensity,
    tippingPointWarning
  } = config;

  const getSentimentColor = (score: "number") => {
    if (score >= 60) return 'text-emerald-400';
    if (score <= 40) return 'text-rose-400';
    return 'text-slate-400';
  };

  const getSentimentLabel = (score: "number") => {
    if (score >= 80) return 'Cực kỳ Lạc quan (Tham lam)';
    if (score >= 60) return 'Lạc quan';
    if (score <= 20) return 'Cực kỳ Bi quan (Sợ hãi)';
    if (score <= 40) return 'Bi quan';
    return 'Trung lập';
  };

  const getSentimentBg = (score: "number") => {
    if (score >= 60) return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30';
    if (score <= 40) return 'from-rose-500/20 to-rose-500/5 border-rose-500/30';
    return 'from-slate-500/20 to-slate-500/5 border-slate-500/30';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl"
    >
      {/* Header */}
      <div className={cn("px-5 py-4 border-b bg-gradient-to-r", getSentimentBg(sentimentScore))}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-xl sm:text-2xl">
                  Tâm lý đám đông: {symbol}
                </h3>
                {timeframe && (
                  <span className="px-2 py-0.5 bg-white/10 border border-white/10 rounded text-[10px] font-bold text-white/70 uppercase tracking-widest">
                    {timeframe}
                  </span>
                )}
                {context && (
                  <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-[10px] font-bold text-purple-300 uppercase tracking-widest max-w-[200px] truncate" title={context}>
                    Góc độ: {context}
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-300 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Quét từ Fireant, F247, Facebook
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={cn("text-4xl sm:text-5xl font-black tracking-tighter", getSentimentColor(sentimentScore))}>
              {sentimentScore}
            </div>
            <div className="text-sm sm:text-base font-medium text-slate-300 uppercase tracking-wider">
              {getSentimentLabel(sentimentScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm sm:text-base font-medium mb-2">
            <span className="text-rose-400 flex items-center gap-1"><TrendingDown className="w-4 h-4" /> Bi quan ({bearishPercentage}%)</span>
            <span className="text-slate-400 flex items-center gap-1"><Minus className="w-4 h-4" /> Trung lập ({neutralPercentage}%)</span>
            <span className="text-emerald-400 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Lạc quan ({bullishPercentage}%)</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${bearishPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-rose-600 to-rose-400"
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${neutralPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-to-r from-slate-600 to-slate-400"
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${bullishPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            />
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-sm sm:text-base font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Từ khóa nổi bật
          </p>
          <div className="flex flex-wrap gap-2">
            {(keyKeywords || []).map((kw, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm sm:text-base font-medium rounded-lg"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-purple-900/20 to-fuchsia-900/10 rounded-xl p-5 border border-purple-500/20">
          <p className="text-lg sm:text-xl text-slate-200 leading-relaxed italic">
            "{summary}"
          </p>
        </div>

        {/* Reflexivity & Tipping Point */}
        {(reflexivityState || tippingPointWarning) && (
          <div className="mt-4 space-y-4">
            {reflexivityState && (
              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30 relative overflow-hidden">
                {/* Visual Loop Background */}
                <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10 pointer-events-none">
                   <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                     <path d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
                     <path d="M90 50 L95 50 L90 55 Z" fill="currentColor" />
                   </svg>
                </div>

                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm sm:text-base font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Vòng lặp phản thân (Reflexivity)
                  </p>
                  {reflexivityIntensity !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-blue-300/60 uppercase font-bold">Cường độ</span>
                      <div className="w-16 h-1.5 bg-blue-500/10 rounded-full overflow-hidden border border-blue-500/20">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${reflexivityIntensity}%` }}
                          className="h-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-lg sm:text-xl text-slate-200 leading-relaxed relative z-10">
                  {reflexivityState}
                </p>
              </div>
            )}
            {tippingPointWarning && (
              <div className="bg-rose-900/20 rounded-xl p-4 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)] relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full" />
                <p className="text-sm sm:text-base font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" /> Cảnh báo Điểm gãy (Tipping Point)
                </p>
                <p className="text-lg sm:text-xl text-rose-200/90 leading-relaxed font-medium">
                  {tippingPointWarning}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Legend / Note */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Chú thích:</span> Kết quả phân tích tâm lý được tổng hợp theo thời gian thực từ các nguồn tin tức và mạng xã hội. 
            Sự khác biệt về điểm số giữa các lần truy vấn có thể xảy ra do: 
            <span className="text-emerald-400/80"> (1) Khung thời gian:</span> Tâm lý Ngắn hạn (phản ứng với tin tức tức thời) thường biến động mạnh hơn Tâm lý Trung/Dài hạn (dựa trên nền tảng cơ bản). 
            <span className="text-purple-400/80"> (2) Nguồn dữ liệu:</span> Trọng số giữa tin tức chính thống (Cafef, Vietstock) và mạng xã hội (F247, Facebook) thay đổi tùy theo ngữ cảnh câu hỏi.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
