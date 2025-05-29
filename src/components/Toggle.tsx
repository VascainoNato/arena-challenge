import { useState } from "react";

const Toggle = () => {
  const [activeTab, setActiveTab] = useState<'popular' | 'newest'>('popular');
  const baseClasses = "flex pb-2 w-full justify-center text-sm border-b-2";
  const activeClass = "product-hunt-border-color product-hunt-text-color font-semibold border-b-4";
  const inactiveClass = "text-gray-500";

    return (
    <div className="flex w-full pt-0 md:hidden">
      <button
        onClick={() => setActiveTab('popular')}
        className={`${baseClasses} ${activeTab === 'popular' ? activeClass : inactiveClass}`}
      >
        Popular
      </button>
      <button
        onClick={() => setActiveTab('newest')}
        className={`${baseClasses} ${activeTab === 'newest' ? activeClass : inactiveClass}`}
      >
        Newest
      </button>
    </div>
  );
};

export default Toggle;
