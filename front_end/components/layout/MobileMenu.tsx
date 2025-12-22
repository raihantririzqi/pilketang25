interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (target: string) => void;
}

const MobileMenu = ({ isOpen, onClose, onNavigate }: MobileMenuProps) => {
  const menuItems = [
    { label: "Home", target: "hero-section" },
    { label: "Kandidat", target: "kandidat-section" },
    { label: "Rundown", target: "rundown-section" },
    { label: "Feedback", target: "feedback-section" },
    { label: "FAQ", target: "faq-section" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-[#fdf8f4] z-[100] flex flex-col items-center gap-6 pt-8 pb-12 shadow-2xl transition-transform duration-300 lg:hidden ${
        isOpen ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* HEADER */}
      <div className="w-full px-6 flex justify-between items-center mb-4">
        <div className="font-roster font-bold text-xl">NordByte</div>
        <button className="p-2" onClick={onClose}>
          <svg
            className="w-8 h-8 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* MENU */}
      <div className="flex flex-col items-center gap-6 font-retro text-xl w-full">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full text-center py-2 hover:bg-gray-100/50 transition-colors"
            onClick={() => onNavigate(item.target)}
          >
            {item.label}
          </button>
        ))}

        {/* LOGIN */}
        <div
          className="relative w-40 h-12 cursor-pointer group mt-2"
          onClick={onClose}
        >
          <div className="absolute w-40 h-12 bg-black rounded-sm"></div>
          <div className="absolute w-40 h-12 bg-navy z-10 -translate-x-1 -translate-y-1 rounded-sm flex items-center justify-center border-4 border-black transition-transform active:translate-x-0 active:translate-y-0">
            <span className="text-white font-bold text-xl">Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
