import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Beaker } from 'lucide-react';
import { LinkedInMode } from './components/LinkedInMode';

const LabPlayground = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-serif flex flex-col p-8 md:p-16 selection:bg-km-red selection:text-white">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-16 border-b border-gray-200 pb-8">
        <div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-gray-400 hover:text-km-red transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Exit Labs
          </button>
          <div className="flex items-center gap-4">
            <Beaker className="w-12 h-12 text-km-red" />
            <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tighter leading-none">
              Secret<br/>Labs.
            </h1>
          </div>
        </div>
        
        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-km-red text-white text-[10px] font-bold uppercase tracking-widest">
            Isolated Environment
          </span>
          <p className="mt-4 text-sm italic opacity-60 max-w-[200px]">
            Experiments built here stay here. They do not affect the main production workspace.
          </p>
        </div>
      </div>

      {/* Lab Canvas Area */}
      <div className="flex-1 relative max-w-6xl w-full mx-auto">
        <LinkedInMode />
      </div>

    </div>
  );
};

export default LabPlayground;
