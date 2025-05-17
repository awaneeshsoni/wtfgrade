
import React, { useState, useEffect } from 'react';

const gradePoints = {
  'A+': 10,
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

  const handleAddCourse = () => {
    setCourses([...courses, { id: Date.now(), grade: '', credit: '' }]);
    setSpi(null); 
    setError('');
  };

  const handleCourseChange = (id, field, value) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
    setSpi(null); 
    setError('');
  };

  const handleRemoveCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
      setSpi(null); 
      setError('');
    } else {
      setError("You must have at least one course.");
    }
  };

  const calculateSpi = () => {
    setError('');
    let totalGradePointsProduct = 0;
    let totalCredits = 0;
    let hasInvalidInput = false;

    if (courses.length === 0) {
        setError("Please add at least one course.");
        setSpi(null);
        return;
    }

    for (const course of courses) {
      const credit = parseFloat(course.credit);
      const grade = course.grade;

      if (!grade) {
        setError(`Please select a grade for all courses.`);
        hasInvalidInput = true;
        break;
      }
      if (isNaN(credit) || credit <= 0) {
        setError(`Please enter a valid positive credit for all courses.`);
        hasInvalidInput = true;
        break;
      }

      const point = gradePoints[grade];
      if (typeof point === 'undefined') {
        setError(`Invalid grade '${grade}' selected. Please choose from the list.`);
        hasInvalidInput = true;
        break;
      }
      
      totalGradePointsProduct += point * credit;
      totalCredits += credit;
    }

    if (hasInvalidInput) {
      setSpi(null);
      return;
    }

    if (totalCredits === 0) {
      setError("Total credits cannot be zero. Please enter valid credits.");
      setSpi(null);
      return;
    }

    const calculatedSpi = totalGradePointsProduct / totalCredits;
    setSpi(calculatedSpi.toFixed(2)); 
  };

  useEffect(() => {
    if (courses.length === 0 || (courses.length === 1 && courses[0].grade === '' && courses[0].credit === '')) {
      setSpi(null);
    }
  }, [courses]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center p-4 text-slate-100">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          SPI Calculator
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-sm">
            {error}
          </div>
        )}

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
                Add Another Course
            </button>
            <button
                onClick={calculateSpi}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-150"
            >
                Calculate SPI
            </button>
        </div>


        {spi !== null && (
          <div className="mt-8 p-6 bg-slate-700 rounded-lg text-center shadow-inner">
            <h2 className="text-2xl font-semibold text-sky-300">Your Semester Performance Index (SPI) is:</h2>
            <p className="text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {spi}
            </p>
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