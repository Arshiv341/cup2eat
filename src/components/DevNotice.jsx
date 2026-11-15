import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { BRAND } from '../theme/brand';

const DevNotice = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <aside aria-label="Reference Information Notice" className="bg-[#142B21] text-[#EAE3D9] border-b border-[#2A4836] px-4 py-2 text-xs flex items-center justify-between">
      <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
        <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />
        <span>
          <strong className="text-[#D4AF37] font-bold">Cup2Eat Reference Notice:</strong> Bulk packaging tiers (100 ML Hot / 150 ML Cold / Chocolate Coated) and ingredient declarations reflect current promotional references. Custom cafe supply and confirmed specifications can be enquired directly via WhatsApp.
        </span>
      </div>
      <button 
        onClick={() => setDismissed(true)} 
        className="text-[#A4BCAD] hover:text-[#FBF9F5] p-1 rounded"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};

export default DevNotice;
