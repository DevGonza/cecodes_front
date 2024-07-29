/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  dataActividadAgropecuaria,
  dataAlcance2,
  dataResiduos,
} from '../data/data';
import useAuth from '../hooks/useAuth';

const data = ['Actividad Agropecuaria', 'Residuos'];

function formatString(input) {
  return input.toLowerCase().replace(/\s+/g, '-');
}

const SelectedActividadAgropecuaria = ({
  reload,
  itemName,
  onView,
  item2,
  newObject,
  setNewObject,
}) => {
  const [optionSeleted, setOptionSelected] = useState('');
  const [optionSeletedValue, setOptionSelectedValue] = useState({});
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const changeCombustibles2 = (
    event,
    category,
    subCategory,
    subCategoryInferior,
    month,
    value
  ) => {
    event.preventDefault();
    let newDataObject = newObject.subTipos;
    let findIndexSub = newDataObject?.findIndex(
      (item) => item.nombre === subCategory
    );
    if (findIndexSub !== undefined && findIndexSub !== -1) {
      let findIndexSubInf = newDataObject[
        findIndexSub
      ].subTipoInferior.findIndex(
        (item) => item.nombre === subCategoryInferior
      );
      if (findIndexSubInf !== undefined && findIndexSubInf !== -1) {
        if (
          newDataObject[findIndexSub].subTipoInferior[findIndexSubInf].meses
        ) {
          newDataObject[findIndexSub].subTipoInferior[findIndexSubInf].meses = {
            ...newDataObject[findIndexSub].subTipoInferior[findIndexSubInf]
              .meses,
            [month.toLowerCase()]: value,
          };
        } else {
          newDataObject[findIndexSub].subTipoInferior[findIndexSubInf].meses = {
            [month.toLowerCase()]: value,
          };
        }
      } else {
        if (newDataObject[findIndexSub].subTipoInferior.length > 0) {
          newDataObject[findIndexSub].subTipoInferior = [
            ...newDataObject[findIndexSub].subTipoInferior,
            {
              nombre: subCategoryInferior,
              meses: {
                [month.toLowerCase()]: value,
              },
            },
          ];
        } else {
          newDataObject[findIndexSub].subTipoInferior = [
            {
              nombre: subCategoryInferior,
              meses: {
                [month.toLowerCase()]: value,
              },
            },
          ];
        }
      }
    } else {
      if (newDataObject.length > 0) {
        newDataObject = [
          ...newDataObject,
          {
            nombre: subCategory,
            meses: null,
            subTipoInferior: [
              {
                nombre: subCategoryInferior,
                meses: {
                  [month.toLowerCase()]: value,
                },
              },
            ],
          },
        ];
      } else {
        newDataObject = [
          {
            nombre: subCategory,
            meses: null,
            subTipoInferior: [
              {
                nombre: subCategoryInferior,
                meses: {
                  [month.toLowerCase()]: value,
                },
              },
            ],
          },
        ];
      }
    }
    setNewObject({
      ...newObject,
      subTipos: newDataObject,
    });
  };

  useEffect(() => {
    if (reload) {
      setOptionSelectedValue({});
    }
  }, [reload]);

  const { state, setState } = useAuth();

  return (
    <>
      <h1
        className="font-bold border-b pb-2 h-20 cursor-pointer items-center flex justify-center"
        id={item2.id}
        onClick={() => onView(item2.id)}
      >
        {item2.name}
        <i className={`fas fa-sort-up ${item2.id}-icon duration-500 ml-1`}></i>
      </h1>
  
      {item2.sub && (
        <select
          className="w-full text-center"
          id={item2.id}
          value={
            state?.newValues?.alcance3?.actividadAgropecuaria?.[
              formatString(itemName)
            ]?.[formatString(item2?.key)]?.selectedValue
          }
          onChange={(event) => {
            setOptionSelected(event.target.value);
            setState({
              ...state,
              newValues: {
                ...state?.newValues,
                alcance3: {
                  ...state?.newValues?.alcance3,
                  actividadAgropecuaria: {
                    ...state?.newValues?.alcance3?.actividadAgropecuaria,
                    [formatString(itemName)]: {
                      ...state?.newValues?.alcance3?.actividadAgropecuaria?.[
                        formatString(itemName)
                      ],
                      [formatString(item2?.key)]: {
                        ...state?.newValues?.alcance3?.actividadAgropecuaria?.[
                          formatString(itemName)
                        ]?.[formatString(item2?.key)],
                        selectedValue: event.target.value,
                      },
                    },
                  },
                },
              },
            });
          }}
        >
          <option>Selecciona</option>
          {item2.sub.map((e, k) => (
            <option key={k}>{e}</option>
          ))}
        </select>
      )}
  
      <div
        className={`${item2.id} ${isOpen ? '' : 'arrow'}`}
      >
        {item2.fecha.map((fecha, i) => (
          <div className="mt-3" key={i}>
            {fecha}
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-b-2 border-blue-400"
              value={
                state?.newValues?.alcance3?.actividadAgropecuaria?.[
                  formatString(itemName)
                ]?.[formatString(item2?.key)]?.fecha?.[fecha]
              }
              onChange={(e) => {
                const inputValue = e.target.value;
                if (!isNaN(inputValue) && inputValue >= 0) {
                  if (
                    itemName === 'Manejo de Estiércol' ||
                    itemName === 'Otras'
                  ) {
                    setOptionSelectedValue({
                      ...optionSeletedValue,
                      [fecha]: inputValue,
                    });
                    changeCombustibles2(
                      e,
                      newObject.nombre,
                      itemName,
                      optionSeleted,
                      fecha,
                      inputValue
                    );
                  } else {
                    setOptionSelectedValue({
                      ...optionSeletedValue,
                      [fecha]: inputValue,
                    });
                    changeCombustibles2(
                      e,
                      newObject.nombre,
                      itemName,
                      item2.name,
                      fecha,
                      inputValue
                    );
                  }
                  setCurrentSubCategory(item2.name);
                  setState({
                    ...state,
                    newValues: {
                      ...state?.newValues,
                      alcance3: {
                        ...state?.newValues?.alcance3,
                        actividadAgropecuaria: {
                          ...state?.newValues?.alcance3?.actividadAgropecuaria,
                          [formatString(itemName)]: {
                            ...state?.newValues?.alcance3
                              ?.actividadAgropecuaria?.[formatString(itemName)],
                            [formatString(item2?.key)]: {
                              ...state?.newValues?.alcance3
                                ?.actividadAgropecuaria?.[
                                formatString(itemName)
                              ]?.[formatString(item2?.key)],
                              fecha: {
                                ...state?.newValues?.alcance3
                                  ?.actividadAgropecuaria?.[
                                  formatString(itemName)
                                ]?.[formatString(item2?.key)]?.fecha,
                                [fecha]: e.target.value,
                              },
                            },
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

const ActividadAgropecuaria = ({
  alcance3,
  setAlcance3,
  dataActividadAgropecuaria,
  subCategory,
}) => {
  const [newObject, setNewObject] = useState({
    nombre: 'Actividad Agropecuaria',
    meses: null,
    subTipos: [],
  });

  useEffect(() => {
    if (newObject.subTipos.length > 0) {
      let findIndexTipo = alcance3.tipos.findIndex(
        (index) => index.nombre === 'Actividad Agropecuaria'
      );
      if (findIndexTipo !== undefined && findIndexTipo !== -1) {
        let newInfo = alcance3.tipos;
        newInfo[findIndexTipo] = newObject;
        setAlcance3({
          ...alcance3,
          tipos: newInfo,
        });
      } else {
        setAlcance3({
          ...alcance3,
          tipos: [...alcance3.tipos, newObject],
        });
      }
    }
  }, [newObject.subTipos.length]);

  let filter = [];
  let filter2 = [];

  for (let i = 0; i < dataActividadAgropecuaria.length; i++) {
    filter.push(dataActividadAgropecuaria[i]);
  }

  const filtro = filter.filter((e) => e.name === subCategory);
  filter2.push(filtro[0]);

  const onView = (name) => {
    console.log(name)
    document.querySelector(`.${name}`).classList.toggle('arrow');
    document.querySelector(`.${name}-icon`).classList.toggle('rotate-180');
  };

  {
    //console.log('item', dataActividadAgropecuaria);
  }
  return filter2.map((item, j) => (
    <div className="w-full mt-7 flex" key={j}>
      {item.sub.map((item2, k) => (
        <div className="w-full text-center border-x px-4" key={k}>
          <SelectedActividadAgropecuaria
            reload={item2}
            itemName={item.name}
            item2={item2}
            onView={onView}
            newObject={newObject}
            setNewObject={setNewObject}
          />
        </div>
      ))}
    </div>
  ));
};

const SelectedResiduos = ({
  reload,
  items,
  itemName,
  onView,
  item2,
  newObject,
  setNewObject,
}) => {
  const [optionSeleted, setOptionSelected] = useState('');
  const [optionSeletedValue, setOptionSelectedValue] = useState({});
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const { state, setState } = useAuth();

  const changeResiduosAndSub = (
    event,
    category,
    subCategory,
    subCategoryInferior,
    month,
    value
  ) => {
    event.preventDefault();
    let newDataObject = newObject.subTipos;
    let findIndexSub = newDataObject?.findIndex(
      (item) => item.nombre === subCategory
    );
    if (findIndexSub !== undefined && findIndexSub !== -1) {
      let findIndexSubInf = newDataObject[
        findIndexSub
      ].subTipoInferior.findIndex(
        (item) => item.nombre === subCategoryInferior
      );
      if (findIndexSubInf !== undefined && findIndexSubInf !== -1) {
        if (
          newDataObject[findIndexSub].subTipoInferior[findIndexSubInf].meses
        ) {
          newDataObject[findIndexSub].subTipoInferior[findIndexSubInf].meses = {
            ...newDataObject[findIndexSub].subTipoInferior[findIndexSubInf]
              .meses,
            [month.toLowerCase()]: value,
          };
        } else {
          newDataObject[findIndexSub].subTipoInferior[findIndexSubInf].meses = {
            [month.toLowerCase()]: value,
          };
        }
      } else {
        if (newDataObject[findIndexSub].subTipoInferior.length > 0) {
          newDataObject[findIndexSub].subTipoInferior = [
            ...newDataObject[findIndexSub].subTipoInferior,
            {
              nombre: subCategoryInferior,
              meses: {
                [month.toLowerCase()]: value,
              },
            },
          ];
        } else {
          newDataObject[findIndexSub].subTipoInferior = [
            {
              nombre: subCategoryInferior,
              meses: {
                [month.toLowerCase()]: value,
              },
            },
          ];
        }
      }
    } else {
      if (newDataObject.length > 0) {
        newDataObject = [
          ...newDataObject,
          {
            nombre: subCategory,
            meses: null,
            subTipoInferior: [
              {
                nombre: subCategoryInferior,
                meses: {
                  [month.toLowerCase()]: value,
                },
              },
            ],
          },
        ];
      } else {
        newDataObject = [
          {
            nombre: subCategory,
            meses: null,
            subTipoInferior: [
              {
                nombre: subCategoryInferior,
                meses: {
                  [month.toLowerCase()]: value,
                },
              },
            ],
          },
        ];
      }
    }
    setNewObject({
      ...newObject,
      subTipos: newDataObject,
    });
  };

  const changeResiduos = (event, category, subCategory, month, value) => {
    event.preventDefault();

    let newDataObject = newObject.subTipos;
    let findIndexSub = newDataObject?.findIndex(
      (item) => item.nombre === subCategory
    );

    if (findIndexSub !== undefined && findIndexSub !== -1) {
      if (newDataObject[findIndexSub].meses) {
        newDataObject[findIndexSub].meses = {
          ...newDataObject[findIndexSub].meses,
          [month.toLowerCase()]: value,
        };
      } else {
        newDataObject[findIndexSub].meses = {
          [month.toLowerCase()]: value,
        };
      }
    } else {
      if (newDataObject.length > 0) {
        newDataObject = [
          ...newDataObject,
          {
            nombre: subCategory,
            meses: {
              [month.toLowerCase()]: value,
            },
            subTipoInferior: null,
          },
        ];
      } else {
        newDataObject = [
          {
            nombre: subCategory,
            meses: {
              [month.toLowerCase()]: value,
            },
            subTipoInferior: null,
          },
        ];
      }
    }
    setNewObject({
      ...newObject,
      subTipos: newDataObject,
    });
  };

  useEffect(() => {
    if (reload) {
      setOptionSelectedValue({});
    }
  }, [reload]);

  return (
    <>
      {items.name ? (
        <>
          <h1
            className="font-bold border-b pb-2 cursor-pointer h-20"
            id={items.id}
            onClick={(e) => {
              onView(e.target.id);
            }}
          >
            {items.name}
            <i
              className={`fas fa-sort-down ${items.id}-icon duration-500 ml-1`}
            ></i>
          </h1>

          <div
            className={`${items.id} ${
              !state?.newValues?.alcance3?.residuos?.[formatString(itemName)]?.[
                formatString(items.name)
              ]?.fecha && 'arrow'
            }`}
          >
            {items.fechas.map((fecha, l) => (
              <div className="mt-3" key={l}>
                {fecha}
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-md border-b-2 border-blue-400"
                  value={
                    state?.newValues?.alcance3?.residuos?.[
                      formatString(itemName)
                    ]?.[formatString(items.name)]?.fecha?.[fecha]
                    // currentSubCategory === items.name
                    // ? optionSeletedValue[fecha] || 0
                    // : 0
                  }
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (!isNaN(inputValue) && inputValue >= 0) {
                      setOptionSelectedValue({
                        ...optionSeletedValue,
                        [fecha]: inputValue,
                      });
                      setCurrentSubCategory(items.name);
                      changeResiduosAndSub(
                        e,
                        'Residuos',
                        itemName,
                        items.name,
                        fecha,
                        e.target.value
                      );
                      setState((prevState) => ({
                        ...prevState,
                        newValues: {
                          ...prevState?.newValues,
                          alcance3: {
                            ...prevState?.newValues?.alcance3,
                            residuos: {
                              ...prevState?.newValues?.alcance3?.residuos,
                              [formatString(itemName)]: {
                                ...prevState?.newValues?.alcance3?.residuos?.[
                                  formatString(itemName)
                                ],
                                [formatString(items.name)]: {
                                  ...prevState?.newValues?.alcance3?.residuos?.[
                                    formatString(itemName)
                                  ]?.[formatString(items.name)],
                                  fecha: {
                                    ...prevState?.newValues?.alcance3
                                      ?.residuos?.[formatString(itemName)]?.[
                                      formatString(items.name)
                                    ]?.fecha,
                                    [fecha]: e.target?.value,
                                  },
                                },
                              },
                            },
                          },
                        },
                      }));
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-6 gap-5">
          {items.fechas.map((fecha, m) => (
            <div className="mt-3" key={m}>
              {fecha}
              <input
                type="number"
                min="0"
                className="w-full rounded-md border-b-2 border-blue-400"
                key={
                  state?.newValues?.alcance3?.residuos?.[formatString(itemName)]
                    ?.fecha?.[fecha]
                }
                value={
                  // currentSubCategory === itemName
                  //   ? optionSeletedValue[fecha] || 0
                  //   : 0
                  state?.newValues?.alcance3?.residuos?.[formatString(itemName)]
                    ?.fecha?.[fecha]
                }
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!isNaN(inputValue) && inputValue >= 0) {
                    setOptionSelectedValue({
                      ...optionSeletedValue,
                      [fecha]: inputValue,
                    });
                    setCurrentSubCategory(itemName);
                    changeResiduos(
                      e,
                      'Residuos',
                      itemName,
                      fecha,
                      e.target.value
                    );
                    setState((prevState) => ({
                      ...prevState,
                      newValues: {
                        ...prevState?.newValues,
                        alcance3: {
                          ...prevState?.newValues?.alcance3,
                          residuos: {
                            ...prevState?.newValues?.alcance3?.residuos,
                            [formatString(itemName)]: {
                              ...prevState?.newValues?.alcance3?.residuos?.[
                                formatString(itemName)
                              ],
                              fecha: {
                                ...prevState?.newValues?.alcance3?.residuos?.[
                                  formatString(itemName)
                                ]?.fecha,
                                [fecha]: e.target?.value,
                              },
                            },
                          },
                        },
                      },
                    }));
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
const Residuos = ({ alcance3, setAlcance3, dataResiduos, subCategory2 }) => {
  const [newObject, setNewObject] = useState({
    nombre: 'Residuos',
    meses: null,
    subTipos: [],
  });

  useEffect(() => {
    if (newObject.subTipos.length > 0) {
      let findIndexTipo = alcance3.tipos.findIndex(
        (index) => index.nombre === 'Residuos'
      );
      if (findIndexTipo !== undefined && findIndexTipo !== -1) {
        let newInfo = alcance3.tipos;
        newInfo[findIndexTipo] = newObject;
        setAlcance3({
          ...alcance3,
          tipos: newInfo,
        });
      } else {
        setAlcance3({
          ...alcance3,
          tipos: [...alcance3.tipos, newObject],
        });
      }
    }
  }, [newObject.subTipos.length]);

  let filter = [];
  let filter2 = [];

  for (let i = 0; i < dataResiduos.length; i++) {
    filter.push(dataResiduos[i]);
  }

  const filtro = filter.filter((e) => e.id === subCategory2);
  filter2.push(filtro[0]);

  const onView = (name) => {
    document.querySelector(`.${name}`).classList.toggle('arrow');
    document.querySelector(`.${name}-icon`).classList.toggle('rotate-180');
  };

  return filter2.map((item, n) => (
    <div className="w-full mt-7 flex" key={n}>
      {item.sub.map((items, o) => (
        <div className="w-full text-center border-x px-4" key={o}>
          <SelectedResiduos
            reload={items}
            itemName={item.name}
            items={items}
            onView={onView}
            newObject={newObject}
            setNewObject={setNewObject}
          />
        </div>
      ))}
    </div>
  ));
};

const Alcance3 = () => {
  const [category, setCategory] = useState('Actividad Agropecuaria');
  const [subCategory, setSubCategory] = useState('Transporte');
  const [subCategory2, setSubCategory2] = useState('residuoI1');

  const { submitForm, state, setState } = useAuth();
  const [metaAlcance3, setMetaAlcance3] = useState('');
  const [alcance3, setAlcance3] = useState({
    nombre: 'Alcance 3',
    meta: null,
    tipos: [],
  });

  useEffect(() => {
    if (alcance3.tipos.length > 0) {
      let alcances = [...state.alcances];
      let alcance3Copy = { ...alcance3 };
      alcance3Copy.meta = metaAlcance3;
      let findIndexAlcance = alcances.findIndex(
        (alcance) => alcance.nombre === alcance3Copy.nombre
      );
      if (findIndexAlcance !== undefined && findIndexAlcance !== -1) {
        alcances[findIndexAlcance] = alcance3Copy;
        setState({
          ...state,
          alcances: alcances,
        });
      } else {
        setState({
          ...state,
          alcances: [...state.alcances, alcance3Copy],
        });
      }
    }
  }, [alcance3.tipos]);

  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      document.getElementById(data[i]).classList.remove('bg-blue-600');
      document.getElementById(data[i]).classList.remove('text-white');
    }

    document.getElementById(category).classList.toggle('bg-blue-600');
    document.getElementById(category).classList.toggle('text-white');
  }, [category]);

  useEffect(() => {
    if (category === 'Actividad Agropecuaria') {
      for (let i = 0; i < dataActividadAgropecuaria.length; i++) {
        document
          .getElementById(dataActividadAgropecuaria[i].name)
          .classList.remove('border-b-blue-600');
      }

      document
        .getElementById(subCategory)
        .classList.toggle('border-b-blue-600');
    } else {
      for (let i = 0; i < dataResiduos.length; i++) {
        document
          .getElementById(dataResiduos[i].id)
          .classList.remove('border-b-blue-600');
      }

      document
        .getElementById(subCategory2)
        .classList.toggle('border-b-blue-600');
    }
  }, [subCategory, subCategory2]);

  return (
    <div className="flex justify-center">
      <div className="w-[95%] bg-gray-100 p-5 rounded-lg shadow border-b-4 border-r-4 relative">
        <div className="absolute p-2 border border-blue-500 flex items-center gap-2 rounded">
          <h1 className="italic font-bold text-blue-500">Meta:</h1>
          <p
            className="italic"
            style={{
              width: metaAlcance3.length > 2 ? metaAlcance3.length * 15 : 40,
            }}
          >
            <input
              style={{
                width: metaAlcance3.length > 2 ? metaAlcance3.length * 15 : 40,
              }}
              className="meta-alcance1-input"
              type="number"
              min="0"
              id="meta-alcance1-input"
              value={state?.newValues?.alcance3Meta}
              onChange={(event) => {
                const inputValue = event.target.value;
                if (!isNaN(inputValue) && inputValue >= 0) {
                  setMetaAlcance3(inputValue);
                  setState({
                    ...state,
                    newValues: {
                      ...state?.newValues,
                      alcance3Meta: inputValue,
                    },
                  });
                }
              }}
            />
          </p>
        </div>

        <h1 className="font-bold text-2xl text-center">Alcance 3</h1>

        <ul className="flex mt-5 border rounded-l-lg rounded-r-lg overflow-hidden">
          {data.map((item, p) => (
            <li
              className="w-full text-center border-r font-bold cursor-pointer"
              id={item}
              onClick={() => setCategory(item)}
              key={p}
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="flex">
          {(category === 'Actividad Agropecuaria' &&
            dataActividadAgropecuaria.map((item, q) => (
              <div className="w-full mt-5 flex" key={q}>
                <div
                  className="text-center w-full font-bold border-b-4 pb-2 cursor-pointer duration-200"
                  id={item.name}
                  onClick={() => setSubCategory(item.name)}
                >
                  <div>{item.name}</div>
                </div>
              </div>
            ))) ||
            (category === 'Residuos' &&
              dataResiduos.map((item, r) => (
                <div className="w-full mt-5 flex" key={r}>
                  <div
                    className="text-center w-full font-bold border-b-4 pb-2 cursor-pointer duration-200"
                    id={item.id}
                    onClick={() => setSubCategory2(item.id)}
                  >
                    <div>{item.name}</div>
                  </div>
                </div>
              )))}
        </div>
        <div>
          {category === 'Actividad Agropecuaria' && (
            <ActividadAgropecuaria
              alcance3={alcance3}
              setAlcance3={setAlcance3}
              dataActividadAgropecuaria={dataActividadAgropecuaria}
              subCategory={subCategory}
            />
          )}
          {category === 'Residuos' && (
            <Residuos
              reload={category === 'Residuos'}
              alcance3={alcance3}
              setAlcance3={setAlcance3}
              dataResiduos={dataResiduos}
              subCategory2={subCategory2}
            />
          )}
        </div>

        <button
          className="bg-blue-700 font-bold text-white rounded-md p-1 px-3 absolute top-5 right-4"
          onClick={submitForm}
        >
          ENVIAR <i className="fas fa-paper-plane ml-1"></i>{' '}
        </button>
      </div>
    </div>
  );
};

export default Alcance3;
