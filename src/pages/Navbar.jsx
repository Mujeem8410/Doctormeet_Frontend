import React from 'react';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">DocMeet</h1>
      
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
