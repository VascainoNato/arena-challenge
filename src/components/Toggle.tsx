import { useState } from "react";

const Toggle = () => {
  const [activeTab, setActiveTab] = useState<'popular' | 'newest'>('popular');

  // Default styles (aplicado a todos os botões)
  const baseClasses = "flex pb-2 w-full justify-center text-sm border-b-2 text-gray-500";

  // Apenas as classes que sobrescrevem quando está ativo
  const activeClass = "border-[#FF6154] text-[#FF6154] font-bold border-b-4";

  return (
    <div className="flex w-full pt-0 md:hidden">
      <button
        onClick={() => setActiveTab('popular')}
        className={`${baseClasses} ${activeTab === 'popular' ? activeClass : ''}`}
      >
        Popular
      </button>
      <button
        onClick={() => setActiveTab('newest')}
        className={`${baseClasses} ${activeTab === 'newest' ? activeClass : ''}`}
      >
        Newest
      </button>
    </div>
  );
};

export default Toggle;
