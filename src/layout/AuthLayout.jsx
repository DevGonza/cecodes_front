import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ModalSend from "../components/ModalSend";

const AuthLayout = () => {
  const [link, setLink] = useState("");
  const location = useLocation();

  useEffect(() => {
    for (let i = 0; i < 4; i++) {
      const target = `alcance${i}`;
      document.getElementById(`${target}`).classList.remove("border-blue-600");
    }
    if (link) {
      document.getElementById(link).classList.toggle("border-blue-600");
    }
  }, [link]);

  useEffect(() => {
    if (location.pathname !== "/") {
      for (let i = 0; i < 4; i++) {
        const target = `alcance${i}`;
        document
          .getElementById(`${target}`)
          .classList.remove("border-blue-600");
      }

      document
        .getElementById(location.pathname.split("/")[1])
        .classList.add("border-blue-600");

      document.getElementById("alcance0").classList.remove("border-blue-600");
    } else {
      document.getElementById("alcance0").classList.add("border-blue-600");
    }
  }, [location]);

  return (
    <>
      <div className="flex justify-center mt-5 mb-5">
        <ul className="flex bg-gray-100 rounded-lg shadow font-bold">
          <Link
            to="/"
            className="px-10 py-5 border-b-4 rounded-l-lg duration-300"
            id="alcance0"
            onClick={(e) => setLink(e.target.id)}
          >
            Principal
          </Link>
          <Link
            to="/alcance1"
            className="px-10 py-5 border-b-4 duration-300"
            id="alcance1"
            onClick={(e) => setLink(e.target.id)}
          >
            Alcance 1
          </Link>
          <Link
            to="/alcance2"
            className="px-10 py-5 border-b-4 duration-300"
            id="alcance2"
            onClick={(e) => setLink(e.target.id)}
          >
            Alcance 2
          </Link>
          <Link
            to="/alcance3"
            className="px-10 py-5 border-b-4 rounded-r-lg duration-300"
            id="alcance3"
            onClick={(e) => setLink(e.target.id)}
          >
            Alcance 3
          </Link>
        </ul>
      </div>
      <ModalSend />
      <Outlet />
    </>
  );
};

export default AuthLayout;
