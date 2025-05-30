
type ToggleProps = {
  activeTab: 'popular' | 'newest';
  setActiveTab: (tab: 'popular' | 'newest') => void;
};

const Toggle = ({ activeTab, setActiveTab }: ToggleProps) => {
  // We declare a const useState, active and SetActive, to know which is active and set it, already passing the popular one as default.
  // Default styles (applied to all buttons).
  const baseClasses = "flex pb-2 w-full justify-center text-sm border-b-2 ";
  // Only classes that override when active.
  const activeClass = "border-[#FF6154] text-[#FF6154] font-bold border-b-4";
  // Class to set default color when disabled.
  const inactiveText = "text-gray-500 dark:text-[#f3f4f6]";
  return (
    <div className="flex w-full pt-0 md:hidden">
      <button
        onClick={() => setActiveTab('popular')}
          className={`${baseClasses} ${activeTab === 'popular' ? activeClass : inactiveText}`}
      >
        Popular
      </button>
      <button
        onClick={() => setActiveTab('newest')}
       className={`${baseClasses} ${activeTab === 'newest' ? activeClass : inactiveText}`}
      >
        Newest
      </button>
    </div>
  );
};

export default Toggle;

