import React, { useState, useEffect } from 'react';

const gradePoints = {
  'A*': 10,
  'A': 10,
  'A-': 9,
  'B': 8,
  'B-': 7,
  'C': 6,
  'C-': 5,
  'F': 0, 
};

function App() {
  const [courses, setCourses] = useState([{ id: Date.now(), grade: '', credit: '' }]);
  const [spi, setSpi] = useState(null); 
  const [error, setError] = useState('');

  const [oldCpi, setOldCpi] = useState('');
  const [previousSemesters, setPreviousSemesters] = useState('');
  const [newCpi, setNewCpi] = useState(null); 

  const handleAddCourse = () => {
    setCourses([...courses, { id: Date.now(), grade: '', credit: '' }]);
    setSpi(null);
    setNewCpi(null);
    setError('');
  };

  const handleCourseChange = (id, field, value) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
    setSpi(null);
    setNewCpi(null);
    setError('');
  };

  const handleRemoveCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
      setSpi(null);
      setNewCpi(null);
      setError('');
    } else {
      setError("You must have at least one course.");
    }
  };

  const calculatePerformance = () => {
    let currentError = '';
    setSpi(null);
    setNewCpi(null);

    let totalGradePointsProduct = 0;
    let totalCredits = 0;
    let hasInvalidCourseInput = false;

    if (courses.length === 0 || (courses.length === 1 && courses[0].grade === '' && courses[0].credit === '')) {
        currentError = "Please add at least one course with valid grade and credits.";
        setError(currentError);
        return;
    }

    for (const course of courses) {
      const credit = parseFloat(course.credit);
      const grade = course.grade;

      if (!grade) {
        currentError = `Please select a grade for all courses.`;
        hasInvalidCourseInput = true;
        break;
      }
      if (isNaN(credit) || credit <= 0) {
        currentError = `Please enter a valid positive credit for all courses.`;
        hasInvalidCourseInput = true;
        break;
      }

      const point = gradePoints[grade];
      if (typeof point === 'undefined') {
        currentError = `Invalid grade '${grade}' selected. Please choose from the list.`;
        hasInvalidCourseInput = true;
        break;
      }
      
      totalGradePointsProduct += point * credit;
      totalCredits += credit;
    }

    if (hasInvalidCourseInput) {
      setError(currentError);
      return;
    }

    if (totalCredits === 0) {
      currentError = "Total credits for the current semester cannot be zero.";
      setError(currentError);
      return;
    }

    const currentSemesterSpi = totalGradePointsProduct / totalCredits;
    setSpi(currentSemesterSpi.toFixed(2));

    if (oldCpi.trim() !== '' && previousSemesters.trim() !== '') {
      const oldCpiValue = parseFloat(oldCpi);
      const prevSemCount = parseInt(previousSemesters, 10);
      let cpiErrorFound = false;

      if (isNaN(oldCpiValue) || oldCpiValue < 0 || oldCpiValue > 10) { 
        currentError += (currentError ? " " : "") + "Old CPI must be a number between 0 and 10.";
        cpiErrorFound = true;
      }
      if (isNaN(prevSemCount) || prevSemCount < 0 || !Number.isInteger(prevSemCount) || previousSemesters.includes('.')) {
        currentError += (currentError ? " " : "") + "Number of previous semesters must be a non-negative whole number (e.g., 0, 1, 2).";
        cpiErrorFound = true;
      }

      if (!cpiErrorFound) {
        const calculatedNewCpi = ((oldCpiValue * prevSemCount) + currentSemesterSpi) / (prevSemCount + 1);
        
        if (isNaN(calculatedNewCpi) || !isFinite(calculatedNewCpi)) {
             currentError += (currentError ? " " : "") + "Could not calculate New CPI with the provided values. Ensure inputs are valid.";
        } else {
            setNewCpi(calculatedNewCpi.toFixed(2));
        }
      }
    } else if (oldCpi.trim() !== '' || previousSemesters.trim() !== '') {
      currentError += (currentError ? " " : "") + "To calculate overall CPI, please provide both Old CPI and Number of Previous Semesters, or leave both blank.";
    }
    
    setError(currentError); 
  };

  useEffect(() => {
    if (courses.length === 0 || (courses.length === 1 && courses[0].grade === '' && courses[0].credit === '')) {
      setSpi(null);
      setNewCpi(null);
      setError('');
    }
  }, [courses]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center p-4 text-slate-100">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          Performance Calculator
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-sm break-words">
            {error}
          </div>
        )}

        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Calculate Overall CPI (Optional)</h2>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                <div className="flex-1">
                    <label htmlFor="oldCpi" className="block text-sm font-medium text-slate-300 mb-1">Old CPI (e.g., 7.5)</label>
                    <input
                        type="number"
                        id="oldCpi"
                        value={oldCpi}
                        onChange={(e) => {setOldCpi(e.target.value); setNewCpi(null); setError('');}}
                        placeholder="Your CPI before this sem"
                        step="0.01"
                        min="0"
                        max="10"
                        className="p-3 border border-slate-600 bg-slate-900 rounded-md w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="previousSemesters" className="block text-sm font-medium text-slate-300 mb-1">No. of Previous Semesters</label>
                    <input
                        type="number"
                        id="previousSemesters"
                        value={previousSemesters}
                        onChange={(e) => {setPreviousSemesters(e.target.value); setNewCpi(null); setError('');}}
                        placeholder="e.g., 2"
                        min="0"
                        step="1" 
                        className="p-3 border border-slate-600 bg-slate-900 rounded-md w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
            </div>
        </div>

        <h2 className="text-xl font-semibold text-sky-300 mb-3">Current Semester Courses</h2>
        <div className="space-y-4 mb-6">
          {courses.map((course, index) => (
            <div key={course.id} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 bg-slate-700 rounded-lg">
              <div className="w-full sm:w-1/12 text-center sm:text-left font-semibold text-sky-300">
                {index + 1}.
              </div>
              <select
                value={course.grade}
                onChange={(e) => handleCourseChange(course.id, 'grade', e.target.value)}
                className="p-3 border border-slate-600 bg-slate-900 rounded-md w-full sm:w-5/12 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              >
                <option value="" disabled>Select Grade</option>
                {Object.keys(gradePoints).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade} (Points: {gradePoints[grade]})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={course.credit}
                onChange={(e) => handleCourseChange(course.id, 'credit', e.target.value)}
                placeholder="Credits (e.g., 3)"
                min="0.5"
                step="0.5"
                className="p-3 border border-slate-600 bg-slate-900 rounded-md w-full sm:w-4/12 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {courses.length > 1 && (
                 <button
                    onClick={() => handleRemoveCourse(course.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md w-full sm:w-auto transition-colors duration-150"
                  >
                    Remove
                  </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
            <button
                onClick={handleAddCourse}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-150"
            >
                Add Course
            </button>
            <button
                onClick={calculatePerformance}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-150"
            >
                Calculate Performance
            </button>
        </div>

        {(spi !== null || newCpi !== null) && (
            <div className="mt-8 p-6 bg-slate-700 rounded-lg text-center shadow-inner space-y-6">
                {spi !== null && (
                    <div>
                        <h2 className="text-2xl font-semibold text-sky-300">Current Semester Performance Index (SPI):</h2>
                        <p className="text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                        {spi}
                        </p>
                    </div>
                )}
                {newCpi !== null && spi !== null && ( 
                     <div className="pt-4 border-t border-slate-600">
                        <h2 className="text-2xl font-semibold text-sky-300">New Overall Cumulative Performance Index (CPI):</h2>
                        <p className="text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {newCpi}
                        </p>
                    </div>
                )}
            </div>
        )}
        
        <footer className="mt-10 text-center text-xs text-slate-400">
          <p>Built with Frustration & Insomnia. Keep Suffering!</p>
        </footer>
      </div>
    </div>
  );
}

export default App;