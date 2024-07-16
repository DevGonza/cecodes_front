import React, { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const initialState = {
  ubicacion: "",
  año: "",
  planta: "",
  empresa: "",
  alcances: [
    {
      nombre: "Alcance 1",
      meta: 0,
      tipos: [],
    },
    {
      nombre: "Alcance 2",
      meta: 0,
      tipos: [],
    },
    {
      nombre: "Alcance 3",
      meta: 0,
      tipos: [],
    },
  ],
};

const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [isOpen, setIsOpen] = useState(false); // Para el modal de éxito
  const [isLoading, setIsLoading] = useState(false); // Para el loader

  const urlBase = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

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
      setIsLoading(true); // Activar loader

      const jsonData = JSON.stringify(state);
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      };

      const response = await fetch(urlBase, options);
      setIsLoading(false); // Desactivar loader después de recibir respuesta

      handleModal(); // Mostrar el modal de éxito
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Desactivar loader en caso de error
    }
  };

  const reiniciar = () => {
    setState(initialState);
    handleModal();
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ state, setState, handleModal, isOpen, isLoading, submitForm, reiniciar }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
export default AuthContext;
