import { Routes, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
              <h1 className="text-4xl font-extrabold text-blue-500 mb-4">Portfolio App Ready</h1>
              <p className="text-slate-400 max-w-md mb-6">
                React + Vite + Tailwind frontend initialized.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/admin/login"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
