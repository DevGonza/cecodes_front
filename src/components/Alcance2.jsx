/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { dataAlcance2 } from '../data/data';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const SelectedAlcance2 = ({ item, alcance2, setAlcance2 }) => {
  const [optionSeletedValue, setOptionSelectedValue] = useState({});
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const { state, setState } = useAuth();

  const changeAlcance2 = (event, category, month, value) => {
    event.preventDefault();

    let newDataObject = alcance2.tipos;
    const findIndexType = newDataObject?.findIndex(
      (type) => type?.nombre === category
    );

    if (findIndexType !== undefined && findIndexType !== -1) {
      const updatedCategory = { ...newDataObject[findIndexType] };
      const updatedMeses = {
        ...updatedCategory.meses,
        [month.toLowerCase()]: value,
      };
      updatedCategory.meses = updatedMeses;

      const updatedDataObject = [...newDataObject];
      updatedDataObject[findIndexType] = updatedCategory;

      setAlcance2({
        ...alcance2,
        tipos: updatedDataObject,
      });
    } else {
      const newCategory = {
        nombre: category,
        subTipos: null,
        meses: {
          [month.toLowerCase()]: value,
        },
      };
      setAlcance2({
        ...alcance2,
        tipos: [...alcance2.tipos, newCategory],
      });
    }
  };

  const onView = (name) => {

    if (!name) {
      console.error('Nombre de clase no válido:', name);
      return;
    }
  
    const element = document.querySelector(`.${name}`);
    const iconElement = document.querySelector(`.${name}-icon`);
  
    if (!element || !iconElement) {
      console.error('No se encontraron elementos con la clase:', name);
      return;
    }
  
    // Aplica las clases toggle
    element.classList.toggle('arrow');
    iconElement.classList.toggle('rotate-180');
  };

  return (
    <>
      <h1
        className="font-bold border-b-2 pb-2 cursor-pointer"
        id={item.name}
        onClick={() => onView(item.name)}
      >
        {item.name === "Eléctricidad" ? (
        <>
        <div title="Este valor corresponde al consumo del sistema eléctrico nacional">
          {item.name + " (kWh)"}
          <i className={`fas fa-sort-down ${item.name}-icon duration-500 ml-2`}>
          </i>
        </div>
      </>
      ) : (
        <>
          {item.name+" (kWh)"}
          <i className={`fas fa-sort-down ${item.name}-icon duration-500 ml-2`}></i>
        </>
      )}
      </h1>

      <div
        className={`${item.name} ${
          !state?.newValues?.alcance2?.[item.name]?.fecha && 'arrow'
        }`}
      >
        {item.fecha.map((fecha) => (
          <div className="mt-2" key={fecha}>
            {fecha}
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-b-2 border-blue-400"
              value={
                state?.newValues?.alcance2?.[item.name]?.fecha?.[fecha]
                // currentSubCategory === item.name
                //   ? optionSeletedValue[fecha] || 0
                //   : 0
              }
              onChange={(e) => {
                const inputValue = e.target.value;
                if (!isNaN(inputValue) && inputValue >= 0) {
                  setOptionSelectedValue({
                    ...optionSeletedValue,
                    [fecha]: inputValue,
                  });
                  setCurrentSubCategory(item.name);
                  changeAlcance2(e, item.name, fecha, inputValue);
                  setState({
                    ...state,
                    newValues: {
                      ...state?.newValues,
                      alcance2: {
                        ...state?.newValues?.alcance2,
                        [item.name]: {
                          ...state?.newValues?.alcance2?.[item.name],
                          fecha: {
                            ...state?.newValues?.alcance2?.[item.name]?.fecha,
                            [fecha]: e.target.value,
                          },
                        },
                      },
                    },
                  });
                }
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

const Alcance2 = () => {
  const { state, setState } = useAuth();
  const [metaAlcance2, setMetaAlcance2] = useState('');
  const [alcance2, setAlcance2] = useState({
    nombre: 'Alcance 2',
    meta: null,
    tipos: [],
  });

  useEffect(() => {
    if (alcance2.tipos.length > 0) {
      let alcances = [...state.alcances];
      let alcance2Copy = { ...alcance2 };
      alcance2Copy.meta = metaAlcance2;
      let findIndexAlcance = alcances.findIndex(
        (alcance) => alcance.nombre === alcance2Copy.nombre
      );
      if (findIndexAlcance !== undefined && findIndexAlcance !== -1) {
        alcances[findIndexAlcance] = alcance2Copy;
        setState({
          ...state,
          alcances: alcances,
        });
      } else {
        setState({
          ...state,
          alcances: [...state.alcances, alcance2Copy],
        });
      }
    }
  }, [alcance2.tipos]);

  return (
    <div className="flex justify-center">
      <div className="w-1/2 bg-gray-100 p-5 rounded-lg shadow border-b-4 border-r-4 relative">
        <div className="absolute p-2 border border-blue-500 flex items-center gap-2 rounded">
          <h1 className="italic font-bold text-blue-500">Meta:</h1>
          <p
            className="italic"
            style={{
              width: metaAlcance2.length > 2 ? metaAlcance2.length * 15 : 40,
            }}
          >
            <input
              style={{
                width: metaAlcance2.length > 2 ? metaAlcance2.length * 15 : 40,
              }}
              className="meta-alcance1-input"
              type="number"
              min="0"
              id="meta-alcance1-input"
              value={state?.newValues?.alcance2Meta}
              onChange={(event) => {
                const inputValue = event.target.value;
                if (!isNaN(inputValue) && inputValue >= 0) {
                  setMetaAlcance2(inputValue);
                  setState({
                    ...state,
                    newValues: {
                      ...state?.newValues,
                      alcance2Meta: inputValue,
                    },
                  });
                }
              }}
            />
          </p>
        </div>

        <h1 className="font-bold text-center text-2xl">Alcance 2</h1>

        <div className="flex mt-8">
          {dataAlcance2.map((item, index) => (
            <div key={index} className="w-full text-center border-x px-3">
              <SelectedAlcance2
                item={item}
                alcance2={alcance2} // Puedes usar alcance1 aquí si es necesario
                setAlcance2={setAlcance2} // Puedes usar setAlcance1 aquí si es necesario
              />
            </div>
          ))}
        </div>

        <Link
          to="/alcance3"
          className="mt-5 bg-blue-800 text-white uppercase flex items-center font-bold right-5 gap-2 p-2 rounded-lg absolute top-0"
        >
          ALCANCE 3 <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default Alcance2;
