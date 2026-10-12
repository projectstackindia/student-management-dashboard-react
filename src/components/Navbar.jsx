function Navbar({ totalStudents }) {
  return (
    <nav className="w-full bg-white/5 backdrop-blur-md border-b border-white/10 shadow-2xl select-none">
      {/* max-w-none se restriction hataya taaki layout table aur cards ke saath right edge tak match kare */}
      <div className="w-full mx-auto px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT: Branding/Title Title tracking uppercase */}
          <div className="flex items-center">
            <h1 className="text-xl font-black text-white tracking-[0.25em] uppercase drop-shadow-md">
              🎓 STUDENT MANAGEMENT SYSTEM
            </h1>
          </div>
          
          {/* RIGHT: Total Counter Clean Layout */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 border-2 border-white/20 bg-white/10 text-white rounded-xl px-6 py-3 backdrop-blur-sm shadow-lg transition-all duration-300 hover:bg-white hover:text-black hover:border-white">
              <span className="text-xs font-black tracking-[0.2em] uppercase">
                TOTAL STUDENTS :
              </span>
              <span className="text-base font-black tracking-tight filter drop-shadow-sm">
                {totalStudents}
              </span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;