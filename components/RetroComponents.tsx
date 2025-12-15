import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: LucideIcon;
}

export const RetroButton: React.FC<ButtonProps> = ({ children, variant = 'primary', icon: Icon, className = '', ...props }) => {
  const baseStyle = "font-['VT323'] text-xl uppercase tracking-wider px-6 py-2 border-2 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-white box-glow-pink hover:drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]",
    secondary: "border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black box-glow-cyan hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]",
    danger: "border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]",
    ghost: "border-transparent text-gray-400 hover:text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export const RetroInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input 
      {...props}
      className={`bg-[#0f0f1a]/80 border-2 border-[#ff00ff]/50 focus:border-[#00ffff] text-[#00ffff] p-3 font-['Share_Tech_Mono'] outline-none placeholder-gray-600 w-full transition-colors ${props.className}`}
    />
  );
};

export const RetroCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#1a1a2e]/90 border border-[#ff00ff]/30 p-6 backdrop-blur-sm shadow-[4px_4px_0px_0px_rgba(255,0,255,0.3)] ${className}`}>
      {children}
    </div>
  );
};

export const RetroHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-8 text-center">
    <h1 className="text-4xl md:text-6xl font-['VT323'] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#ff00ff] to-[#aa00aa] drop-shadow-[2px_2px_0px_rgba(0,255,255,0.5)]">
      {title}
    </h1>
    {subtitle && (
      <p className="text-[#00ffff] font-['Share_Tech_Mono'] mt-2 text-sm md:text-base tracking-widest text-glow-cyan">
        {subtitle}
      </p>
    )}
  </div>
);
