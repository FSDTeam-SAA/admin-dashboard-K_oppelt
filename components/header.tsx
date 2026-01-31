function Header() {
  return (
    <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200 px-6 flex items-center justify-end gap-4">
      <button
        type="button"
        className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10V7a2 2 0 10-4 0v3a5 5 0 00-3 4.58l-.46 3.68A1 1 0 007.53 20h8.94a1 1 0 00.99-1.24l-.46-3.68A5 5 0 0014 10z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20a3 3 0 006 0" />
        </svg>
      </button>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="font-semibold text-slate-800">Rani</p>
          <p className="text-slate-400 text-xs">@Admin</p>
        </div>
        <img
          src="https://i.pravatar.cc/150?u=rani"
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
        />
      </div>
    </header>
  );
}

export default Header;
