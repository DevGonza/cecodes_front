// import axios from "axios";
import axios from "axios";
import React from "react";
import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const fechas = {
  enero: "",
  febrero: "",
  marzo: "",
  abril: "",
  mayo: "",
  junio: "",
  julio: "",
  agosto: "",
  septiembre: "",
  octubre: "",
  noviembre: "",
  diciembre: "",
};


const initialState = {
  ubicacion: "",
  año: "",
  planta: "",
  empresa: "",
  alcances: [
    {
      nombre: "Alcance 1",
      meta: 0,
      tipos: [
        {

        }
      ]
    },
    {
      nombre: "Alcance 2",
      meta: 0,
      tipos: [
        {

        }
      ]
    },
    {
      nombre: "Alcance 3",
      meta: 0,
      tipos: [
        {

        }
      ]
    }
  ]
};

const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [isOpen, setIsOpen] = useState(false);

  const urlBase ="http://localhost:8080/api/data"  // "https://carbonfoot.onrender.com/api/data";

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();

  const submitForm = async () => {
    if (
      !state.ubicacion ||
      !state.año ||
      !state.planta ||
      !state.empresa ||
      state.ubicacion.trim() === "" ||
      state.planta.trim() === "" ||
      state.empresa.trim() === ""
    ) {
      alert("Campos incompletos en la solapa Principal");
      return;
    }
    try {
      const jsonData = JSON.stringify(state); // Convertir el estado a JSON   
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicar que estás enviando JSON
        },
        body: jsonData, // Usar el estado en formato JSON como cuerpo de la solicitud
      };
  
      const response = await fetch(urlBase, options);
      
  
      handleModal();
    } catch (error) {
      console.error(error);
    }
  };

  const reiniciar = () => {
    setState(initialState);
    handleModal();
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ state, setState, handleModal, isOpen, submitForm, reiniciar }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthProvider };

export default AuthContext;
