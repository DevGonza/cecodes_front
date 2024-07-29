import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
  let year = [];
  const thisYear = new Date().getFullYear();
  const { state, setState } = useAuth();

  const optionYear = Number(thisYear) - 2015;

  for (let i = 0; i < optionYear + 1; i++) {
    year.push(Number(thisYear) - i);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
        errors: {
          ...prevState.errors,
          [name]: true,
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
        errors: {
          ...prevState.errors,
          [name]: false,
        },
      }));
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2 bg-gray-100 p-5 rounded-lg shadow border-b-4 border-r-4">
        <h1 className="font-bold text-center text-2xl mb-10">
          <i className="fas fa-calculator mr-2"></i>
          Bienvenido a la calculadora de carbono
        </h1>
        <div className="grid justify-center mt-3">
          <label className="font-semibold text-center">Nombre de Empresa</label>
          <div className="relative">
            <input
              type="text"
              name="empresa"
              className="bg-gray-200 p-2 mt-3 font-semibold rounded-lg pl-8"
              placeholder="Empresa"
              value={state.empresa}
              onChange={handleInputChange}
              required 
            />
            <i className="fas fa-industry absolute left-2 top-6"></i>
          </div>
        </div>

        <div className="grid justify-center mt-3">
          <label className="font-semibold text-center">Indique la Sede</label>
          <div className="relative">
            <input
              type="text"
              name="planta"
              className="bg-gray-200 p-2 mt-3 font-semibold rounded-lg pl-8"
              placeholder="Planta"
              value={state.planta}
              onChange={handleInputChange}
              required 
            />
            <i className="fas fa-industry absolute left-2 top-6"></i>
          </div>
        </div>

        <div className="grid justify-center mt-3">
          <label className="font-semibold">
            Indica la ubicación de la Sede
          </label>
          <div className="relative">
            <input
              type="text"
              name="ubicacion"
              className="mt-3 bg-gray-200 p-2 rounded-lg font-semibold w-full pl-7"
              placeholder="Ubicación"
              value={state.ubicacion}
              onChange={handleInputChange}
              required 
            />
            <i className="fas fa-globe-americas absolute left-2 top-6"></i>
          </div>
        </div>

        <div className="grid justify-center mt-5 mb-3">
          <label className="font-semibold mb-5 text-center">
            Seleccione el año de medición
          </label>
          <div className="flex justify-center gap-8">
            <select
              name="año"
              className="bg-gray-200 p-2 rounded-lg font-semibold w-full"
              value={state.año}
              onChange={handleInputChange}
              required 
            >
              <option>Selecciona un año</option>
              {year.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center m-5">
          <Link
            to="/alcance1"
            className="mt-5 bg-blue-800 text-white uppercase font-bold flex items-center gap-2 p-2 rounded-lg"
          >
            Alcance 1<i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
