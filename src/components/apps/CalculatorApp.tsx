import React, { useState } from 'react';
import { solarSound } from '../../utils/solarSound';
import { SoundPackId } from '../../types/launcher';

interface CalculatorAppProps {
  soundEnabled: boolean;
  soundPack?: SoundPackId;
}

export const CalculatorApp: React.FC<CalculatorAppProps> = ({ soundEnabled, soundPack = 'solar-harmonix' }) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    solarSound.playTypingSound(soundEnabled, soundPack, digit);
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    solarSound.playTypingSound(soundEnabled, soundPack, '.');
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    solarSound.playTypingSound(soundEnabled, soundPack, 'Enter');
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    solarSound.playTypingSound(soundEnabled, soundPack, 'Enter');
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      let result = currentValue;

      switch (operator) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          break;
      }

      setPrevValue(result);
      setDisplay(String(Number(result.toFixed(6))));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator === '=' ? null : nextOperator);
  };

  const keys = [
    { label: 'C', action: clearAll, type: 'action' },
    { label: '±', action: () => setDisplay(String(-parseFloat(display))), type: 'action' },
    { label: '%', action: () => setDisplay(String(parseFloat(display) / 100)), type: 'action' },
    { label: '÷', action: () => performOperation('÷'), type: 'op' },

    { label: '7', action: () => inputDigit('7'), type: 'num' },
    { label: '8', action: () => inputDigit('8'), type: 'num' },
    { label: '9', action: () => inputDigit('9'), type: 'num' },
    { label: '×', action: () => performOperation('×'), type: 'op' },

    { label: '4', action: () => inputDigit('4'), type: 'num' },
    { label: '5', action: () => inputDigit('5'), type: 'num' },
    { label: '6', action: () => inputDigit('6'), type: 'num' },
    { label: '-', action: () => performOperation('-'), type: 'op' },

    { label: '1', action: () => inputDigit('1'), type: 'num' },
    { label: '2', action: () => inputDigit('2'), type: 'num' },
    { label: '3', action: () => inputDigit('3'), type: 'num' },
    { label: '+', action: () => performOperation('+'), type: 'op' },

    { label: '0', action: () => inputDigit('0'), type: 'num', wide: true },
    { label: '.', action: inputDecimal, type: 'num' },
    { label: '=', action: () => performOperation('='), type: 'equal' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-end p-4 select-none">
      {/* LCD Glass Screen */}
      <div className="glass-panel rounded-3xl p-5 mb-4 text-right border border-white/70 shadow-lg">
        <div className="text-[11px] font-mono text-amber-700/80 h-4">
          {prevValue !== null && operator ? `${prevValue} ${operator}` : '☀️ Sol Calc'}
        </div>
        <div className="font-mono font-bold text-3xl text-slate-900 tracking-tight overflow-x-auto no-scrollbar">
          {display}
        </div>
      </div>

      {/* Tactile Crystal Buttons Matrix */}
      <div className="grid grid-cols-4 gap-2.5">
        {keys.map((k, i) => (
          <button
            key={i}
            onClick={k.action}
            className={`h-14 rounded-2xl font-display font-bold text-base transition-all duration-100 flex items-center justify-center active:scale-90 shadow-sm ${
              k.wide ? 'col-span-2' : ''
            } ${
              k.type === 'equal'
                ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md'
                : k.type === 'op'
                ? 'bg-amber-100/80 text-amber-900 border border-amber-300/50 hover:bg-amber-200'
                : k.type === 'action'
                ? 'bg-white/60 text-slate-700 border border-white/80 hover:bg-white'
                : 'glass-panel bg-white/70 text-slate-800 border border-white/80 hover:bg-white'
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
};
