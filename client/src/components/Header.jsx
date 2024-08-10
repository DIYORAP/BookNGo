import React from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className=" bg-slate-200 shadow-md">
      <div className=" flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-blue-700">Book</span>
            <span className="text-black">N</span>

            <span className="text-red-700">Go</span>
          </h1>
        </Link>
        <form
          action=""
          className="bg-slate-100 p-1 rounded-lg flex items-center"
        >
          <FaSearch className="w-4" />
          <input
            type="text"
            placeholder="    Search events..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <div className=" bg-blue-700 rounded-full ">
            <FaSearch className="text-white rounded-full cursor-pointer m-2" />
          </div>
        </form>

        <ul className="flex gap-4">
          <Link to="/">
            <li className=" sm:inlines  hover:underline">Find my tickets</li>
          </Link>
          <Link to="/create">
            <li className=" sm:inlines text-slate-700 hover:underline">
              Create Event
            </li>
          </Link>

          <Link to="/sign-up">Sign Up</Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-covers"
                src={currentUser.avatar}
                alt=""
              />
            ) : (
              <li className=" sm:inlines text-slate-700 hover:underline">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
