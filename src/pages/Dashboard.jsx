import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Navbar from '../components/Navbar';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import ConfirmModal from '../components/ConfirmModal';

function Dashboard() {
  const [students, setStudents] = useLocalStorage('students', []);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, student: null });

  // 📊 Dynamic stats calculation matching exactly your form dropdown options
  const totalStudents = students.length;
  const csCount = students.filter(s => s.department === 'Computer Science').length;

  // Filtering all 5 specific branches including Computer Science now
  const coreEngineeringCount = students.filter(s =>
    ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'].includes(s.department)
  ).length;

  const maleCount = students.filter(s => s.gender === 'Male').length;
  const femaleCount = students.filter(s => s.gender === 'Female').length;

  // Calculate percentages for gender distribution visuals
  const malePercentage = totalStudents > 0 ? (maleCount / totalStudents) * 100 : 0;
  const femalePercentage = totalStudents > 0 ? (femaleCount / totalStudents) * 100 : 0;

  const handleAddOrUpdateStudent = (studentData) => {
    if (studentData.id) {
      setStudents(students.map(s => s.id === studentData.id ? studentData : s));
      setEditingStudent(null);
    } else {
      const newStudent = {
        ...studentData,
        id: Date.now().toString()
      };
      setStudents([...students, newStudent]);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (student) => {
    setDeleteModal({ isOpen: true, student });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.student) {
      setStudents(students.filter(s => s.id !== deleteModal.student.id));
      if (editingStudent && editingStudent.id === deleteModal.student.id) {
        setEditingStudent(null);
      }
    }
    setDeleteModal({ isOpen: false, student: null });
  };

  const handleCloseModal = () => {
    setDeleteModal({ isOpen: false, student: null });
  };

  const containerClass = `
    group flex flex-col justify-between p-6 border border-white/10 rounded-2xl 
    bg-white/5 backdrop-blur-md shadow-2xl text-left
    transition-all duration-300 ease-in-out select-none
    hover:bg-white hover:text-black hover:border-white hover:-translate-y-1 hover:shadow-white/5
  `;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-neutral-900 to-neutral-700">
      <Navbar totalStudents={students.length} />

      {/* Main Container */}
      <div className="w-full py-8 space-y-8">

        {/* 🎯 FLEX WRAPPER: Locked Form Position + 2x2 Clean Grid */}
        <div className="flex items-start w-full pr-8">

          {/* LEFT: Student Form (Position & Width 100% Locked) */}
          <div className="w-[900px] ml-10 flex-shrink-0">
            <StudentForm
              onSubmit={handleAddOrUpdateStudent}
              editingStudent={editingStudent}
              students={students}
            />
          </div>

          {/* 🔥 RIGHT: High-End 2x2 Grid (No commas, custom gender bars) */}
          <div className="flex-1 min-w-[400px] ml-8 grid grid-cols-2 gap-6 self-stretch">

            {/* CONTAINER 1: TOTAL STRENGTH */}
            <div className={containerClass}>
              <div>
                <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)] group-hover:scale-110 inline-block transition-transform duration-200">✨</span>
                <p className="text-xs font-black tracking-widest mt-4 text-white group-hover:text-black/60 transition-colors">TOTAL STRENGTH</p>
              </div>
              <div className="mt-6">
                <h3 className="text-6xl font-black tracking-tight text-white group-hover:text-black transition-colors">{totalStudents}</h3>
                <p className="text-xs font-bold mt-2 text-white/40 group-hover:text-black/40 transition-colors">ACTIVE STUDENT PROFILES LOADED</p>
              </div>
            </div>

            {/* CONTAINER 2: CS DEPARTMENT */}
            <div className={containerClass}>
              <div>
                <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)] group-hover:scale-110 inline-block transition-transform duration-200">💻</span>
                <p className="text-xs font-black tracking-widest mt-4 text-white group-hover:text-black/60 transition-colors">CS DEPARTMENT</p>
              </div>
              <div className="mt-6">
                <h3 className="text-6xl font-black tracking-tight text-white group-hover:text-black transition-colors">{csCount}</h3>
                <p className="text-xs font-bold mt-2 text-white/40 group-hover:text-black/40 transition-colors">SDE & TECH BRANCH ENROLLMENTS</p>
              </div>
            </div>

            {/* CONTAINER 3: CORE BRANCHES (HIGHLY READABLE - NO COMMAS) */}
            <div className={containerClass}>
              <div>
                <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)] group-hover:scale-110 inline-block transition-transform duration-200">⚙️</span>
                <p className="text-xs font-black tracking-widest mt-4 text-white group-hover:text-black/60 transition-colors">CORE BRANCHES</p>
              </div>
              <div className="mt-4 w-full">
                <h3 className="text-5xl font-black tracking-tight text-white group-hover:text-black transition-colors">{coreEngineeringCount}</h3>

                {/* Clean, high-contrast, tracking-widest text blocks for ultimate readability */}
                <div className="flex flex-wrap gap-2 mt-4 text-xs font-black tracking-widest">
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/5 group-hover:bg-black/10 group-hover:text-black group-hover:border-black/5 transition-all">COMPUTER SCIENCE</span>
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/5 group-hover:bg-black/10 group-hover:text-black group-hover:border-black/5 transition-all">ELECTRONICS</span>
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/5 group-hover:bg-black/10 group-hover:text-black group-hover:border-black/5 transition-all">MECHANICAL</span>
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/5 group-hover:bg-black/10 group-hover:text-black group-hover:border-black/5 transition-all">CIVIL</span>
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/5 group-hover:bg-black/10 group-hover:text-black group-hover:border-black/5 transition-all">ELECTRICAL</span>
                </div>
              </div>
            </div>

            {/* CONTAINER 4: GENDER METRICS (CLEAN TITLES - NO BRACKETS) */}
            <div className={containerClass}>
              <div>
                <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)] group-hover:scale-110 inline-block transition-transform duration-200">📊</span>
                <p className="text-xs font-black tracking-widest mt-4 text-white group-hover:text-black/60 transition-colors">GENDER DISTRIBUTIONS</p>
              </div>
              <div className="mt-4 space-y-4 w-full">
                {/* Male Block */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-black tracking-widest">
                    <span className="text-white/80 group-hover:text-black/80 transition-colors">MALE</span>
                    <span className="text-white group-hover:text-black transition-colors">{Math.round(malePercentage)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 group-hover:bg-black/10 rounded-full overflow-hidden transition-colors">
                    <div className="h-full bg-white group-hover:bg-black transition-all duration-500" style={{ width: `${malePercentage}%` }}></div>
                  </div>
                </div>

                {/* Female Block */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-black tracking-widest">
                    <span className="text-white/80 group-hover:text-black/80 transition-colors">FEMALE</span>
                    <span className="text-white group-hover:text-black transition-colors">{Math.round(femalePercentage)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 group-hover:bg-black/10 rounded-full overflow-hidden transition-colors">
                    <div className="h-full bg-white group-hover:bg-black transition-all duration-500" style={{ width: `${femalePercentage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* STUDENT TABLE WRAPPER */}
        {/* STUDENT TABLE WRAPPER */}
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
          <StudentTable
            students={students}
            onEdit={handleEditStudent}
            onDelete={handleDeleteClick}
          />
        </div>

      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        studentName={deleteModal.student?.fullName || ''}
      />
    </div>
  );
}

export default Dashboard;