import { useState, useEffect, useRef } from 'react';


const TableCustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-80" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 text-left border-2 border-white/20 bg-white/10 text-white rounded-xl flex justify-between items-center backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white/10 focus:border-white/40 transition-all duration-200 cursor-pointer text-sm"
      >
        <span className="truncate uppercase font-black tracking-widest text-xs">
          {value || placeholder}
        </span>
        <svg className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-neutral-900/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl max-h-64 overflow-y-auto scrollbar-none">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className="px-5 py-3.5 hover:bg-white/20 cursor-pointer text-white text-xs uppercase font-black tracking-widest transition-colors truncate"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main StudentTable Component
function StudentTable({ students, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = departmentFilter === '' || student.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const thClass = "px-6 py-5 text-left text-[12px] font-black text-white/60 uppercase tracking-[0.25em] border-b border-white/10 select-none";
  const tdClass = "px-6 py-5 text-sm font-extrabold text-white uppercase tracking-wider whitespace-nowrap";

  return (
   
    <div 
      id="custom-student-table-container"
      style={{ width: '100%', maxWidth: '1650px' }} 
      className="text-left border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-md shadow-2xl space-y-6 mx-auto"
    >
      
      {/* Table Header Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Registry Name Tracking Wider & Extra Bold */}
          <h2 className="text-2xl font-black text-white tracking-[0.25em] drop-shadow-md whitespace-nowrap select-none uppercase">
            📋 STUDENT PROFILES REGISTRY
          </h2>
          {departmentFilter && (
            <button 
              onClick={() => setDepartmentFilter('')}
              className="px-3 py-1 text-[10px] font-black bg-white/10 hover:bg-white hover:text-black border border-white/10 rounded-lg text-white tracking-widest uppercase cursor-pointer transition-all"
            >
              CLEAR FILTER ✕
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1 xl:justify-end max-w-4xl w-full">
          {/* Search Box - Big Size, Font Customization, No Commas */}
          <div className="flex-1 min-w-[320px]">
            <input
              type="text"
              placeholder="SEARCH BY NAME OR ROLL NUMBER OR EMAIL ADDRESS INTERACTION SYSTEM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 text-white bg-white/10 border-2 border-white/20 rounded-xl backdrop-blur-sm placeholder:uppercase placeholder:font-black placeholder:text-white/30 placeholder:tracking-widest focus:outline-none focus:ring-4 focus:ring-white/10 focus:border-white/40 transition-all duration-200 text-xs font-black tracking-widest"
            />
          </div>

          {/* Custom Select Filter Component */}
          <TableCustomSelect
            options={departments}
            value={departmentFilter}
            onChange={setDepartmentFilter}
            placeholder="SELECT DEPARTMENT"
          />
        </div>
      </div>

      {/* Dynamic Data Content Area */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
          <p className="text-white/40 text-base font-black tracking-widest uppercase">
            {students.length === 0 ? '⚠️ No profiles loaded in system database yet' : '🔍 No data matched search criteria'}
          </p>
        </div>
      ) : (
        <div className="w-full overflow-hidden border border-white/10 rounded-xl bg-neutral-900/40 backdrop-blur-sm shadow-inner">
          <div className="overflow-x-auto scrollbar-none">
            <table className="min-w-full divide-y divide-white/5 table-auto">
            <thead className="bg-white/5 backdrop-blur-md text-center [&_th]:text-center">
                <tr>
                  <th className={thClass}>Full Name</th>
                  <th className={thClass}>Roll Number</th>
                  <th className={thClass}>Department</th>
                  <th className={thClass}>Year</th>
                  <th className={thClass}>Email Address</th>
                  <th className={thClass}>Phone</th>
                  <th className={thClass}>DOB</th>
                  <th className={thClass}>Gender</th>
                  <th className={`${thClass} text-center`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {filteredStudents.map(student => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-white/5 transition-colors duration-150 group"
                  >
                    {/* Bolder and bigger texts inside rows */}
                    <td className={`${tdClass} text-base font-black`}>
                      {student.fullName}
                    </td>
                    <td className={tdClass}>{student.rollNumber}</td>
                    <td className={tdClass}>
                      <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-xs font-black tracking-widest">
                        {student.department}
                      </span>
                    </td>
                    <td className={tdClass}>{student.year}</td>
                    <td className={`${tdClass} text-white/70 lowercase text-xs`}>{student.email}</td>
                    <td className={tdClass}>{student.phone}</td>
                    <td className={tdClass}>{student.dob}</td>
                    <td className={tdClass}>
                      <span className={`text-xs px-3 py-1 rounded-lg font-black border tracking-widest ${
                        student.gender === 'Male' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : 'bg-pink-500/10 border-pink-500/20 text-pink-300'
                      }`}>
                        {student.gender}
                      </span>
                    </td>
                    
                    {/* Actions Controller Buttons - Form Button Heights Sync */}
                    <td className="px-6 py-5 whitespace-nowrap text-center font-medium">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => onEdit(student)}
                          className="px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl border-2 border-white/20 bg-white/10 text-white hover:bg-white hover:text-black hover:border-white hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => onDelete(student)}
                          className="px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl border-2 border-white/20 bg-white/10 text-white hover:bg-white hover:text-black hover:border-white hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Database Counter Stats Footer */}
      {filteredStudents.length > 0 && (
        <div className="w-full text-right text-xs font-black tracking-widest text-white/40 uppercase select-none pr-2">
          SHOWING {filteredStudents.length} OF {students.length} REGISTERED STUDENT ENROLLMENTS
        </div>
      )}

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default StudentTable;