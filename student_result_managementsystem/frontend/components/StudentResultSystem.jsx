import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Download, Users, BookOpen, Award, BarChart3, GraduationCap, TrendingUp, Star, FileText, Search, Printer } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const StudentResultSystem = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, avgGPA: 0 });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMarksheet, setShowMarksheet] = useState(false);
  const [marksheetData, setMarksheetData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const studentsRes = await fetch(`${API_BASE}/students`);
      const studentsData = await studentsRes.json();
      setStudents(studentsData);

      const coursesRes = await fetch(`${API_BASE}/courses`);
      const coursesData = await coursesRes.json();
      setCourses(coursesData);

      const resultsRes = await fetch(`${API_BASE}/results`);
      const resultsData = await resultsRes.json();
      setResults(resultsData);

      const statsRes = await fetch(`${API_BASE}/analytics/dashboard`);
      const statsData = await statsRes.json();
      setStats({
        totalStudents: statsData.total_students,
        totalCourses: statsData.total_courses,
        avgGPA: statsData.average_gpa
      });
    } catch (error) {
      console.error('Error loading data:', error);
      loadMockData();
    }
    setLoading(false);
  };

  const loadMockData = () => {
    const mockStudents = [
      { id: 1, roll_no: 'S001', name: 'Alice Johnson', email: 'alice@example.com', phone: '1234567890' },
      { id: 2, roll_no: 'S002', name: 'Bob Smith', email: 'bob@example.com', phone: '1234567891' },
      { id: 3, roll_no: 'S003', name: 'Carol Davis', email: 'carol@example.com', phone: '1234567892' }
    ];
    
    const mockCourses = [
      { id: 1, code: 'CS101', name: 'Programming Fundamentals', credits: 4 },
      { id: 2, code: 'CS102', name: 'Data Structures', credits: 4 },
      { id: 3, code: 'MATH101', name: 'Calculus I', credits: 3 }
    ];

    const mockResults = [
      { id: 1, student_id: 1, course_id: 1, marks: 85, grade: 'A', gpa: 4.0 },
      { id: 2, student_id: 1, course_id: 2, marks: 78, grade: 'B+', gpa: 3.5 },
      { id: 3, student_id: 2, course_id: 1, marks: 92, grade: 'A+', gpa: 4.0 }
    ];

    setStudents(mockStudents);
    setCourses(mockCourses);
    setResults(mockResults);
    setStats({ totalStudents: mockStudents.length, totalCourses: mockCourses.length, avgGPA: 3.5 });
  };

  const calculateGrade = (marks) => {
    if (marks >= 90) return { grade: 'A+', gpa: 4.0 };
    if (marks >= 85) return { grade: 'A', gpa: 4.0 };
    if (marks >= 80) return { grade: 'A-', gpa: 3.7 };
    if (marks >= 75) return { grade: 'B+', gpa: 3.5 };
    if (marks >= 70) return { grade: 'B', gpa: 3.0 };
    if (marks >= 65) return { grade: 'B-', gpa: 2.7 };
    if (marks >= 60) return { grade: 'C+', gpa: 2.5 };
    if (marks >= 55) return { grade: 'C', gpa: 2.0 };
    if (marks >= 50) return { grade: 'C-', gpa: 1.7 };
    return { grade: 'F', gpa: 0.0 };
  };

  const handleAddStudent = async (student) => {
    try {
      const response = await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      
      if (response.ok) {
        await loadData();
        setShowModal(false);
        alert('Student added successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    }
  };

  const handleEditStudent = async (student) => {
    try {
      const response = await fetch(`${API_BASE}/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      
      if (response.ok) {
        await loadData();
        setShowModal(false);
        alert('Student updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student. Please try again.');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${API_BASE}/students/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await loadData();
          alert('Student deleted successfully!');
        } else {
          alert('Failed to delete student.');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  const handleAddCourse = async (course) => {
    try {
      const response = await fetch(`${API_BASE}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
      
      if (response.ok) {
        await loadData();
        setShowModal(false);
        alert('Course added successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course. Please try again.');
    }
  };

  const handleEditCourse = async (course) => {
    try {
      const response = await fetch(`${API_BASE}/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
      
      if (response.ok) {
        await loadData();
        setShowModal(false);
        alert('Course updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`${API_BASE}/courses/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await loadData();
          alert('Course deleted successfully!');
        } else {
          alert('Failed to delete course.');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please try again.');
      }
    }
  };

  const handleAddResult = async (result) => {
    try {
      const response = await fetch(`${API_BASE}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      
      if (response.ok) {
        await loadData();
        setShowModal(false);
        alert('Result added successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error adding result:', error);
      alert('Failed to add result. Please try again.');
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const generateMarksheet = (student) => {
    const studentResults = results.filter(r => r.student_id === student.id);
    const studentCourses = studentResults.map(r => ({
      ...courses.find(c => c.id === r.course_id),
      ...r
    }));
    
    const totalCredits = studentCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const totalGradePoints = studentCourses.reduce((sum, c) => sum + (c.gpa * (c.credits || 0)), 0);
    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
    
    setMarksheetData({
      student,
      courses: studentCourses,
      totalCredits,
      cgpa
    });
    setShowMarksheet(true);
  };

  const printMarksheet = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <GraduationCap size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Student Result Management</h1>
                <p className="text-blue-100 text-sm mt-1">Academic Excellence Portal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Star className="text-yellow-300" size={20} />
              <span className="text-sm font-medium">Academic Year 2025-26</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-72 bg-white shadow-xl min-h-screen border-r border-gray-100">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 ${
                currentPage === 'dashboard' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200 scale-105' 
                  : 'hover:bg-gray-50 text-gray-700 hover:scale-102'
              }`}
            >
              <BarChart3 size={22} />
              <span className="font-semibold">Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentPage('students')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 ${
                currentPage === 'students' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200 scale-105' 
                  : 'hover:bg-gray-50 text-gray-700 hover:scale-102'
              }`}
            >
              <Users size={22} />
              <span className="font-semibold">Students</span>
            </button>
            <button
              onClick={() => setCurrentPage('courses')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 ${
                currentPage === 'courses' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200 scale-105' 
                  : 'hover:bg-gray-50 text-gray-700 hover:scale-102'
              }`}
            >
              <BookOpen size={22} />
              <span className="font-semibold">Courses</span>
            </button>
            <button
              onClick={() => setCurrentPage('results')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 ${
                currentPage === 'results' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 scale-105' 
                  : 'hover:bg-gray-50 text-gray-700 hover:scale-102'
              }`}
            >
              <Award size={22} />
              <span className="font-semibold">Results</span>
            </button>
          </nav>

          <div className="p-4 mt-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <FileText size={32} className="mb-3" />
              <h3 className="font-bold text-lg mb-2">Quick Guide</h3>
              <p className="text-sm text-blue-100">Manage students, courses, and track academic performance efficiently.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-lg text-gray-600 font-medium">Loading amazing content...</p>
              </div>
            </div>
          ) : (
            <>
              {currentPage === 'dashboard' && (
                <Dashboard stats={stats} students={students} courses={courses} results={results} />
              )}
              {currentPage === 'students' && (
                <StudentsPage
                  students={students}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onAdd={() => openModal('addStudent')}
                  onEdit={(student) => openModal('editStudent', student)}
                  onDelete={handleDeleteStudent}
                  onViewResults={(student) => openModal('viewResults', student)}
                  onGenerateMarksheet={generateMarksheet}
                />
              )}
              {currentPage === 'courses' && (
                <CoursesPage
                  courses={courses}
                  onAdd={() => openModal('addCourse')}
                  onEdit={(course) => openModal('editCourse', course)}
                  onDelete={handleDeleteCourse}
                />
              )}
              {currentPage === 'results' && (
                <ResultsPage
                  students={students}
                  courses={courses}
                  results={results}
                  onAddResult={() => openModal('addResult')}
                  calculateGrade={calculateGrade}
                />
              )}
            </>
          )}
        </main>
      </div>

      {showModal && (
        <Modal
          type={modalType}
          item={selectedItem}
          students={students}
          courses={courses}
          results={results}
          onClose={() => setShowModal(false)}
          onAddStudent={handleAddStudent}
          onEditStudent={handleEditStudent}
          onAddCourse={handleAddCourse}
          onEditCourse={handleEditCourse}
          onAddResult={handleAddResult}
          calculateGrade={calculateGrade}
        />
      )}
      {showMarksheet && marksheetData && (
        <Marksheet
          data={marksheetData}
          onClose={() => setShowMarksheet(false)}
          onPrint={printMarksheet}
        />
      )}
    </div>
  );
};

const downloadMarksheetPDF = (data) => {
  const { student, courses, totalCredits, cgpa } = data;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Create PDF content as HTML
  const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Marksheet - ${student.name}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          padding: 40px;
          background: white;
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
        }
        
        .header {
          text-align: center;
          border-bottom: 4px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 36px;
          font-weight: bold;
        }
        
        h1 {
          font-size: 32px;
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        .subtitle {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .year {
          font-size: 14px;
          color: #9ca3af;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .info-box {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .info-item label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .info-item value {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }
        
        thead {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        }
        
        th {
          padding: 12px;
          text-align: left;
          font-size: 12px;
          font-weight: bold;
          color: #374151;
          text-transform: uppercase;
          border-bottom: 2px solid #d1d5db;
        }
        
        th.center {
          text-align: center;
        }
        
        td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        
        td.center {
          text-align: center;
        }
        
        tr:last-child td {
          border-bottom: none;
        }
        
        tbody tr:hover {
          background-color: #f9fafb;
        }
        
        .grade-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
        }
        
        .grade-a { background: #d1fae5; color: #065f46; }
        .grade-b { background: #dbeafe; color: #1e40af; }
        .grade-c { background: #fef3c7; color: #92400e; }
        .grade-f { background: #fee2e2; color: #991b1b; }
        
        .summary-box {
          background: linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%);
          padding: 20px;
          border-radius: 12px;
          border: 2px solid #e9d5ff;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 15px;
        }
        
        .summary-item {
          text-align: center;
        }
        
        .summary-item label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .summary-item value {
          display: block;
          font-size: 28px;
          font-weight: bold;
        }
        
        .summary-item.blue value { color: #2563eb; }
        .summary-item.green value { color: #059669; }
        .summary-item.purple value { color: #9333ea; }
        
        .grading-scale {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-top: 15px;
        }
        
        .scale-item {
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid;
        }
        
        .scale-item.green { background: #d1fae5; border-color: #a7f3d0; }
        .scale-item.blue { background: #dbeafe; border-color: #bfdbfe; }
        .scale-item.yellow { background: #fef3c7; border-color: #fde68a; }
        .scale-item.orange { background: #fed7aa; border-color: #fdba74; }
        .scale-item.red { background: #fee2e2; border-color: #fecaca; }
        
        .scale-item .grade {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .scale-item .range {
          font-size: 11px;
          color: #6b7280;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        
        .footer-left {
          font-size: 14px;
        }
        
        .footer-left label {
          display: block;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .footer-left value {
          display: block;
          font-weight: 600;
          color: #1f2937;
        }
        
        .signature-box {
          text-align: right;
        }
        
        .signature-line {
          border-top: 2px solid #1f2937;
          padding-top: 8px;
          margin-top: 50px;
          width: 200px;
          text-align: center;
        }
        
        .signature-line p {
          font-size: 12px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .footer-note {
          text-align: center;
          margin-top: 20px;
          font-size: 11px;
          color: #9ca3af;
        }
        
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo">🎓</div>
          <h1>Academic Marksheet</h1>
          <p class="subtitle">Student Result Management System</p>
          <p class="year">Academic Year 2024-25</p>
        </div>
        
        <!-- Student Information -->
        <div class="section">
          <h2 class="section-title">👤 Student Information</h2>
          <div class="info-box">
            <div class="info-grid">
              <div class="info-item">
                <label>Student Name</label>
                <value>${student.name}</value>
              </div>
              <div class="info-item">
                <label>Roll Number</label>
                <value>${student.roll_no}</value>
              </div>
              <div class="info-item">
                <label>Email Address</label>
                <value>${student.email}</value>
              </div>
              <div class="info-item">
                <label>Phone Number</label>
                <value>${student.phone}</value>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Academic Performance -->
        <div class="section">
          <h2 class="section-title">🏆 Academic Performance</h2>
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th class="center">Credits</th>
                <th class="center">Marks</th>
                <th class="center">Grade</th>
                <th class="center">GPA</th>
              </tr>
            </thead>
            <tbody>
              ${courses.map(course => `
                <tr>
                  <td><strong>${course.code}</strong></td>
                  <td>${course.name}</td>
                  <td class="center"><strong>${course.credits}</strong></td>
                  <td class="center"><strong>${course.marks}</strong></td>
                  <td class="center">
                    <span class="grade-badge grade-${course.grade.charAt(0).toLowerCase()}">${course.grade}</span>
                  </td>
                  <td class="center"><strong style="color: #9333ea;">${course.gpa}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <!-- Summary -->
        <div class="section">
          <h2 class="section-title">📊 Summary</h2>
          <div class="summary-box">
            <div class="summary-grid">
              <div class="summary-item blue">
                <label>Total Courses</label>
                <value>${courses.length}</value>
              </div>
              <div class="summary-item green">
                <label>Total Credits</label>
                <value>${totalCredits}</value>
              </div>
              <div class="summary-item purple">
                <label>CGPA</label>
                <value>${cgpa}</value>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Grading Scale -->
        <div class="section">
          <h2 class="section-title">📋 Grading Scale</h2>
          <div class="grading-scale">
            <div class="scale-item green">
              <div class="grade">A+ / A</div>
              <div class="range">85-100</div>
            </div>
            <div class="scale-item blue">
              <div class="grade">B+ / B</div>
              <div class="range">70-84</div>
            </div>
            <div class="scale-item yellow">
              <div class="grade">C+ / C</div>
              <div class="range">55-69</div>
            </div>
            <div class="scale-item orange">
              <div class="grade">C-</div>
              <div class="range">50-54</div>
            </div>
            <div class="scale-item red">
              <div class="grade">F</div>
              <div class="range">Below 50</div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-left">
            <label>Issue Date</label>
            <value>${currentDate}</value>
          </div>
          <div class="signature-box">
            <div class="signature-line">
              <p>Authorized Signature</p>
            </div>
          </div>
        </div>
        
        <div class="footer-note">
          <p>This is a computer-generated marksheet. No signature is required.</p>
          <p>Student Result Management System • Academic Excellence Portal</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([pdfContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Marksheet_${student.roll_no}_${student.name.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Show success message
  alert('Marksheet downloaded! Open the HTML file in your browser and use "Print to PDF" (Ctrl+P or Cmd+P) to save as PDF.');
};

const Marksheet = ({ data, onClose, onPrint }) => {
  const { student, courses, totalCredits, cgpa } = data;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header Buttons - Hidden in print */}
        <div className="flex justify-end gap-3 p-6 border-b print:hidden">
          <button
            onClick={() => downloadMarksheetPDF(data)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button
            onClick={onPrint}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Printer size={18} />
            Print Marksheet
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-300 transition-all"
          >
            Close
          </button>
        </div>

        {/* Marksheet Content - This will be printed */}
        <div className="p-12" id="marksheet-content">
          {/* Header */}
          <div className="text-center mb-8 border-b-4 border-blue-600 pb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-full">
                <GraduationCap size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Academic Marksheet</h1>
            <p className="text-lg text-gray-600">Student Result Management System</p>
            <p className="text-sm text-gray-500 mt-2">Academic Year 2024-25</p>
          </div>

          {/* Student Information */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={24} className="text-blue-600" />
              Student Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Student Name</p>
                <p className="text-lg font-semibold text-gray-800">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Roll Number</p>
                <p className="text-lg font-semibold text-gray-800">{student.roll_no}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email Address</p>
                <p className="text-lg font-semibold text-gray-800">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <p className="text-lg font-semibold text-gray-800">{student.phone}</p>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award size={24} className="text-purple-600" />
              Academic Performance
            </h2>
            <div className="overflow-hidden border-2 border-gray-200 rounded-xl">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Course Code</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Course Name</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">Credits</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">Marks</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">Grade</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">GPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600">{course.code}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{course.name}</td>
                      <td className="px-6 py-4 text-center font-semibold">{course.credits}</td>
                      <td className="px-6 py-4 text-center font-semibold">{course.marks}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full font-bold ${getGradeColor(course.grade)}`}>
                          {course.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-purple-600">{course.gpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Total Courses</p>
                  <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Total Credits</p>
                  <p className="text-3xl font-bold text-green-600">{totalCredits}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">CGPA</p>
                  <p className="text-3xl font-bold text-purple-600">{cgpa}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grading Scale */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Grading Scale</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <p className="font-bold text-green-700">A+ / A</p>
                <p className="text-xs text-gray-600">85-100</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <p className="font-bold text-blue-700">B+ / B</p>
                <p className="text-xs text-gray-600">70-84</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center">
                <p className="font-bold text-yellow-700">C+ / C</p>
                <p className="text-xs text-gray-600">55-69</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-center">
                <p className="font-bold text-orange-700">C-</p>
                <p className="text-xs text-gray-600">50-54</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center">
                <p className="font-bold text-red-700">F</p>
                <p className="text-xs text-gray-600">Below 50</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                <p className="font-semibold text-gray-800">{currentDate}</p>
              </div>
              <div className="text-right">
                <div className="border-t-2 border-gray-800 pt-2 px-8 mt-12">
                  <p className="text-sm font-semibold text-gray-800">Authorized Signature</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                This is a computer-generated marksheet. No signature is required.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Student Result Management System • Academic Excellence Portal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          #marksheet-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

const Dashboard = ({ stats }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <TrendingUp className="text-green-500" size={40} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <Users size={32} />
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Students</p>
              <p className="text-5xl font-bold mt-2">{stats.totalStudents}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-blue-100">
            <TrendingUp size={16} />
            <span className="text-sm">Active enrollment</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <BookOpen size={32} />
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Total Courses</p>
              <p className="text-5xl font-bold mt-2">{stats.totalCourses}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-green-100">
            <Star size={16} />
            <span className="text-sm">Available programs</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <Award size={32} />
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Average GPA</p>
              <p className="text-5xl font-bold mt-2">{stats.avgGPA.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-purple-100">
            <TrendingUp size={16} />
            <span className="text-sm">Academic excellence</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            Recent Activities
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 hover:bg-blue-100 transition-colors">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Users className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">System Active</p>
                <p className="text-sm text-gray-600 mt-1">Result management system is online and ready</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500 hover:bg-green-100 transition-colors">
              <div className="bg-green-500 p-2 rounded-lg">
                <Award className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Ready to Track Results</p>
                <p className="text-sm text-gray-600 mt-1">Add students, courses, and manage academic records</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500 hover:bg-purple-100 transition-colors">
              <div className="bg-purple-500 p-2 rounded-lg">
                <BookOpen className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">API Connected</p>
                <p className="text-sm text-gray-600 mt-1">Backend services running at localhost:8000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Star size={28} />
            Quick Stats
          </h3>
          <div className="space-y-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-orange-100">Total Enrollment</span>
                <span className="text-2xl font-bold">{stats.totalStudents}</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-orange-100">Active Courses</span>
                <span className="text-2xl font-bold">{stats.totalCourses}</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-orange-100">Success Rate</span>
                <span className="text-2xl font-bold">{stats.avgGPA > 0 ? '95%' : '0%'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentsPage = ({ students, searchTerm, setSearchTerm, onAdd, onEdit, onDelete, onViewResults, onGenerateMarksheet }) => {
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">Students Management</h2>
          <p className="text-gray-500 mt-1">Manage and track student information</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
        >
          <Plus size={20} />
          Add New Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-blue-600">{student.roll_no}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onGenerateMarksheet(student)}
                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-all"
                        title="Generate Marksheet"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={() => onViewResults(student)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                        title="View Results"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(student)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(student.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <Users className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No students found. Click "Add New Student" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CoursesPage = ({ courses, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">Courses Management</h2>
          <p className="text-gray-500 mt-1">Organize and manage academic courses</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
        >
          <Plus size={20} />
          Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-3 rounded-xl">
                <BookOpen className="text-white" size={28} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(course)}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">{course.code}</span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Star size={16} className="text-amber-500" />
                {course.credits} Credits
              </span>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">No courses available. Click "Add New Course" to create one.</p>
        </div>
      )}
    </div>
  );
};

const ResultsPage = ({ students, courses, results, onAddResult, calculateGrade }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getStudentResults = (studentId) => {
    return results.filter(r => r.student_id === studentId);
  };

  const calculateCGPA = (studentId) => {
    const studentResults = getStudentResults(studentId);
    if (studentResults.length === 0) return 0;
    const totalGPA = studentResults.reduce((sum, r) => sum + r.gpa, 0);
    return (totalGPA / studentResults.length).toFixed(2);
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'from-green-400 to-emerald-500';
    if (grade.startsWith('B')) return 'from-blue-400 to-indigo-500';
    if (grade.startsWith('C')) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">Results Management</h2>
          <p className="text-gray-500 mt-1">Track and manage student performance</p>
        </div>
        <button
          onClick={onAddResult}
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
        >
          <Plus size={20} />
          Add New Result
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Users className="text-purple-600" size={24} />
            Select Student
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {students.map((student) => {
              const cgpa = calculateCGPA(student.id);
              const resultsCount = getStudentResults(student.id).length;
              
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                    selectedStudent?.id === student.id
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      selectedStudent?.id === student.id ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-lg">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.roll_no}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm font-semibold text-purple-600 flex items-center gap-1">
                          <Award size={14} />
                          CGPA: {cgpa}
                        </span>
                        <span className="text-sm text-gray-500">
                          {resultsCount} {resultsCount === 1 ? 'Course' : 'Courses'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {students.length === 0 && (
              <p className="text-gray-500 text-center py-8">No students available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Award className="text-purple-600" size={24} />
            {selectedStudent ? `${selectedStudent.name}'s Results` : 'Student Results'}
          </h3>
          {selectedStudent ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {getStudentResults(selectedStudent.id).map((result) => {
                const course = courses.find(c => c.id === result.course_id);
                return (
                  <div key={result.id} className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">{course?.name || 'Unknown Course'}</h4>
                        <p className="text-sm text-gray-500 mt-1">{course?.code || 'N/A'}</p>
                      </div>
                      <div className={`bg-gradient-to-br ${getGradeColor(result.grade)} text-white px-4 py-2 rounded-xl text-center min-w-[80px]`}>
                        <p className="text-2xl font-bold">{result.grade}</p>
                        <p className="text-xs">GPA: {result.gpa}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 px-3 py-1 rounded-lg">
                          <span className="text-sm font-semibold text-blue-700">Marks: {result.marks}/100</span>
                        </div>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center gap-1 hover:bg-purple-50 px-3 py-1 rounded-lg transition-all">
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
              {getStudentResults(selectedStudent.id).length === 0 && (
                <div className="text-center py-16">
                  <Award className="mx-auto text-gray-300 mb-4" size={64} />
                  <p className="text-gray-500">No results available for this student</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">Please select a student to view their results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Modal = ({ type, item, students, courses, onClose, onAddStudent, onEditStudent, onAddCourse, onEditCourse, onAddResult, calculateGrade }) => {
  const [formData, setFormData] = useState(item || {});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    if (field === 'marks' && type === 'addResult') {
      const gradeData = calculateGrade(parseFloat(value));
      setFormData({ ...formData, marks: parseFloat(value), ...gradeData });
    }
  };

  const handleSave = () => {
    if (type === 'addStudent') onAddStudent(formData);
    if (type === 'editStudent') onEditStudent(formData);
    if (type === 'addCourse') onAddCourse(formData);
    if (type === 'editCourse') onEditCourse(formData);
    if (type === 'addResult') onAddResult(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto transform animate-scale-in">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          {type === 'addStudent' && <><Users className="text-green-600" size={28} />Add New Student</>}
          {type === 'editStudent' && <><Edit2 className="text-blue-600" size={28} />Edit Student</>}
          {type === 'addCourse' && <><BookOpen className="text-orange-600" size={28} />Add New Course</>}
          {type === 'editCourse' && <><Edit2 className="text-orange-600" size={28} />Edit Course</>}
          {type === 'addResult' && <><Award className="text-purple-600" size={28} />Add Result</>}
        </h3>

        <div className="space-y-4">
          {(type === 'addStudent' || type === 'editStudent') && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
                <input
                  type="text"
                  placeholder="S001"
                  value={formData.roll_no || ''}
                  onChange={(e) => handleChange('roll_no', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="1234567890"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </>
          )}

          {(type === 'addCourse' || type === 'editCourse') && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Code</label>
                <input
                  type="text"
                  placeholder="CS101"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name</label>
                <input
                  type="text"
                  placeholder="Programming Fundamentals"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Credits</label>
                <input
                  type="number"
                  placeholder="4"
                  value={formData.credits || ''}
                  onChange={(e) => handleChange('credits', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  min="1"
                  max="6"
                />
              </div>
            </>
          )}

          {type === 'addResult' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Student</label>
                <select
                  value={formData.student_id || ''}
                  onChange={(e) => handleChange('student_id', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="">Choose a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Course</label>
                <select
                  value={formData.course_id || ''}
                  onChange={(e) => handleChange('course_id', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="">Choose a course...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Marks (0-100)</label>
                <input
                  type="number"
                  placeholder="85"
                  value={formData.marks || ''}
                  onChange={(e) => handleChange('marks', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              {formData.marks && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Grade</p>
                      <p className="text-3xl font-bold text-purple-600">{formData.grade}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">GPA</p>
                      <p className="text-3xl font-bold text-pink-600">{formData.gpa}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {type !== 'viewResults' && (
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentResultSystem;