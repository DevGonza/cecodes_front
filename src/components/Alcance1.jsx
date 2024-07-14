/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
  dataCombustibles,
  dataEmisionesFugitivas,
  dataGasesRefrigerantes,
} from '../data/data';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Alcance1.css';

function formatString(input) {
  return input.toLowerCase().replace(/\s+/g, '-');
}
const subData = [
  { key: 'aguasResidualesDomesticas', name: 'Aguas Residuales Domesticas' },
  { key: 'aguasResidualesIndustriales', name: 'Aguas Residuales Industriales' },
  { key: 'lodos', name: 'Lodos' },
  { key: 'otrasEmisiones', name: 'Otras Emisiones' },
];

const SelectedCombustibles = ({
  reload,
  item,
  data,
  newObject,
  setNewObject,
}) => {
  const [optionSeleted, setOptionSelected] = useState('');
  const [optionSeletedValue, setOptionSelectedValue] = useState({});
  const [currentSubCategory, setCurrentSubCategory] = useState(null);

  const { state, setState } = useAuth();

  const changeCombustibles = (
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
        newDataObject[findIndexSub].subTipoInferior = [
          {
            nombre: subCategoryInferior,
            meses: {
              [month.toLowerCase()]: value,
            },
          },
        ];
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

  const onViewCombustibles = (name, data) => {
    document.querySelector(`.${name.id}`).classList.remove('arrow');
    document.querySelector(`.${name.id}-icon`).classList.remove('hidden');
    document.querySelector(`.${name.id}-icon`).classList.add('rotate-180');
  };

  useEffect(() => {
    if (reload) {
      setOptionSelectedValue({});
    }
  }, [reload]);

  return (
    <>
      <div>
        <select
          className="w-full text-center"
          id={data.name === 'Gas Natural' ? 'Gas' : data.name}
          value={
            state?.newValues?.alcance1?.[item.name]?.[data?.name]?.[
              data?.name + 'SelectedValue'
            ]
          }
          onChange={(e) => {
            e.preventDefault();
            onViewCombustibles(e.target, data);
            setOptionSelected(e.target.value);
            setState({
              ...state,
              newValues: {
                ...state?.newValues,
                alcance1: {
                  ...state?.newValues?.alcance1,
                  [item.name]: {
                    ...state?.newValues?.alcance1?.[item?.name],
                    [data?.name]: {
                      ...state?.newValues?.alcance1?.[item?.name]?.[data?.name],
                      [data?.name + 'SelectedValue']: e.target.value,
                    },
                  },
                },
              },
            });
          }}
        >
          <option>{data.name}</option>
          {data.sub.map((subData, index) => (
            <option key={index}>{subData}</option>
          ))}
        </select>
      </div>

      <ul
        className={`${data.name === 'Gas Natural' ? 'Gas' : data.name} ${
          !state?.newValues?.alcance1?.[item.name]?.[data?.name]?.[
            data?.name + 'SelectedValue'
          ] && 'arrow'
        }`}
      >
        {data.fecha.map((fecha, index) => (
          <li key={index} className="mt-5 px-3">
            {fecha}
            <input
              type="number"
              min="0"
              id={fecha}
              className="w-full border-b mt-1 border-blue-400 rounded-md outline-none px-2"
              value={
                (item.name,
                state?.newValues?.alcance1?.[item.name]?.[data?.name]?.fecha?.[
                  fecha
                ])
              }
              onChange={(e) => {
                const inputValue = e.target.value;
                if (!isNaN(inputValue) && inputValue >= 0) {
                  setState({
                    ...state,
                    newValues: {
                      ...state?.newValues,
                      alcance1: {
                        ...state?.newValues?.alcance1,
                        [item.name]: {
                          ...state?.newValues?.alcance1?.[item?.name],
                          [data?.name]: {
                            ...state?.newValues?.alcance1?.[item?.name]?.[
                              data?.name
                            ],
                            fecha: {
                              ...state?.newValues?.alcance1?.[item?.name]?.[
                                data?.name
                              ]?.fecha,
                              [fecha]: e.target.value,
                            },
                          },
                        },
                      },
                    },
                  });
                  setOptionSelectedValue({
                    ...optionSeletedValue,
                    [fecha]: inputValue,
                  });
                  setCurrentSubCategory(data.name);
                  changeCombustibles(
                    e,
                    item.name,
                    data.name,
                    optionSeleted,
                    fecha,
                    inputValue
                  );
                }
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
};
const Combustibles = ({ alcance1, setAlcance1 }) => {
  const [newObject, setNewObject] = useState({
    nombre: 'Combustibles',
    meses: null,
    subTipos: [],
  });

  const onCloseCombustibles = (name) => {
    document.querySelector(`.${name}`).classList.add('arrow');
    document.querySelector(`.${name}-icon`).classList.add('hidden');
    document.querySelector(`.${name}-icon`).classList.remove('rotate-180');
  };

  useEffect(() => {
    if (newObject.subTipos.length > 0) {
      let findIndexTipo = alcance1.tipos.findIndex(
        (index) => index.nombre === 'Combustibles'
      );
      if (findIndexTipo !== undefined && findIndexTipo !== -1) {
        let newInfo = alcance1.tipos;
        newInfo[findIndexTipo] = newObject;
        setAlcance1({
          ...alcance1,
          tipos: newInfo,
        });
      } else {
        setAlcance1({
          ...alcance1,
          tipos: [...alcance1.tipos, newObject],
        });
      }
    }
  }, [newObject.subTipos]);

  return dataCombustibles.map((item, i) => (
    <div className="mt-5 flex" key={i}>
      {item.sub.map((data, index) => (
        <div key={index} className="w-full text-center border-x">
          <h1 className="font-bold flex items-center justify-center gap-2 cursor-pointer border-b">
            {data.name}
            <i
              className={`fas fa-sort-down ${
                data.name === 'Gas Natural' ? 'Gas' : data.name
              }-icon duration-500 hidden`}
              id={data.name === 'Gas Natural' ? 'Gas' : data.name}
              onClick={(e) => {
                e.preventDefault();
                onCloseCombustibles(e.target.id);
              }}
            ></i>
          </h1>
          <SelectedCombustibles
            reload={data}
            item={item}
            data={data}
            newObject={newObject}
            setNewObject={setNewObject}
          />
        </div>
      ))}
    </div>
  ));
};

const SelectedEmisiones = ({
  reload,
  subFilter,
  subItem,
  onView,
  item,
  newObject,
  setNewObject,
}) => {
  const { state, setState } = useAuth();

  const [optionSeletedValue, setOptionSelectedValue] = useState({});
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const changeCombustibles = (
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

  return (
    <>
      <h1
        className="font-semibold text-sm border-b-2 h-16 flex items-center justify-center gap-2 cursor-pointer"
        id={subFilter.id}
        onClick={(e) => onView(e.target.id)}
      >
        {subFilter.name}
        <i className={`fas fa-sort-down ${subFilter.id}-icon duration-500`}></i>
      </h1>

      <div
        className={`${subFilter.id} ${
          !state?.newValues?.emisiones?.[formatString(subItem)]?.[
            formatString(subFilter?.name)
          ] && 'arrow'
        }`}
      >
        {subFilter.fecha.map((fecha, index) => (
          <div key={index} className="mt-2 px-2">
            {fecha}
            <input
              type="number"
              min="0"
              className="rounded-md border-b-2 border-blue-400 w-full"
              key={
                state?.newValues?.emisiones?.[formatString(subItem)]?.[
                  formatString(subFilter?.name)
                ]?.fecha[fecha]
              }
              value={
                state?.newValues?.emisiones?.[formatString(subItem)]?.[
                  formatString(subFilter?.name)
                ]?.fecha[fecha]
              }
              onChange={(event) => {
                const inputValue = event.target.value;
                if (!isNaN(inputValue) && inputValue >= 0) {
                  setOptionSelectedValue({
                    ...optionSeletedValue,
                    [fecha]: inputValue,
                  });
                  setCurrentSubCategory(subFilter.name);
                  changeCombustibles(
                    event,
                    item.name,
                    subItem,
                    subFilter.name,
                    fecha,
                    inputValue
                  );
                  setState({
                    ...state,
                    newValues: {
                      ...state?.newValues,
                      emisiones: {
                        ...state?.newValues?.emisiones,
                        [formatString(subItem)]: {
                          ...state?.newValues?.emisiones?.[
                            formatString(subItem)
                          ],
                          [formatString(subFilter?.name)]: {
                            ...state?.newValues?.emisiones?.[
                              formatString(subItem)
                            ]?.[formatString(subFilter?.name)],
                            fecha: {
                              ...state?.newValues?.emisiones?.[
                                formatString(subItem)
                              ]?.[formatString(subFilter?.name)]?.fecha,
                              [fecha]: event.target.value,
                            },
                          },
                        },
                      },
                    },
                  });

                  // changeMonthValue(item.name, filter.name, subFilter.name, fecha, inputValue);
                }
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
const Emisiones = ({ alcance1, setAlcance1 }) => {
  const [newObject, setNewObject] = useState({
    nombre: 'Emisiones Fugitivas',
    meses: null,
    subTipos: [],
  });

  useEffect(() => {
    if (newObject.subTipos.length > 0) {
      let findIndexTipo = alcance1.tipos.findIndex(
        (index) => index.nombre === 'Emisiones Fugitivas'
      );
      if (findIndexTipo !== undefined && findIndexTipo !== -1) {
        let newInfo = alcance1.tipos;
        newInfo[findIndexTipo] = newObject;
        setAlcance1({
          ...alcance1,
          tipos: newInfo,
        });
      } else {
        setAlcance1({
          ...alcance1,
          tipos: [...alcance1.tipos, newObject],
        });
      }
    }
  }, [newObject.subTipos.length]);

  const [subCategory, setSubCategory] = useState({
    key: 'aguasResidualesDomesticas',
    name: 'Aguas Residuales Domesticas',
  });

  const onView = (name) => {
    document.querySelector(`.${name}`).classList.toggle('arrow');
    document.querySelector(`.${name}-icon`).classList.toggle('rotate-180');
  };

  let filter = [];
  let filter2 = [];

  for (let i = 0; i < dataEmisionesFugitivas.length; i++) {
    filter.push({ data: dataEmisionesFugitivas[i].sub });
  }

  for (let i = 0; i < subData.length; i++) {
    filter2.push(filter[0].data[i]);
  }

  const filtrado = filter2.filter((e) => e.name === subCategory.name);

  return dataEmisionesFugitivas.map((item, index) => (
    <div key={index}>
      <div className="mt-5 flex">
        {item.sub.map((data, i) => (
          <div
            style={
              data.name === subCategory.name
                ? { borderBottomColor: '#242b57' }
                : {}
            }
            key={i}
            className="w-full text-center border-b-4 cursor-pointer duration-200"
            id={`${data.name}`}
            onClick={() => setSubCategory(subData[i])}
          >
            <h1 className="font-bold">{data.name}</h1>
          </div>
        ))}
      </div>
      <div>
        {filtrado.map((filter, index) => (
          <div
            key={index}
            style={{ display: 'grid', gap: 10 }}
            className="mt-5"
          >
            <h1 className="font-bold text-center">{filter.name}</h1>
            <div className="flex mt-5">
              {filter.sub.map((subFilter, index) => (
                <div key={index} className="w-full border-x px-2 text-center">
                  <SelectedEmisiones
                    reload={subFilter}
                    item={item}
                    subItem={filter.name}
                    newObject={newObject}
                    setNewObject={setNewObject}
                    subFilter={subFilter}
                    onView={onView}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ));
};

const SelectedGases = ({
  reload,
  subItem,
  itemName,
  newObject,
  setNewObject,
}) => {
  const [optionSeleted, setOptionSelected] = useState('');
  const [optionSeletedValue, setOptionSelectedValue] = useState({});
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const { state, setState } = useAuth();

  const changeCombustibles = (
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
        newDataObject[findIndexSub].subTipoInferior = [
          {
            nombre: subCategoryInferior,
            meses: {
              [month.toLowerCase()]: value,
            },
          },
        ];
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

  const onViewSelect = (name, data) => {
    document.querySelector(`.${name.id}`).classList.remove('arrow');
    document.querySelector(`.${name.id}-icon`).classList.add('rotate-180');
  };

  useEffect(() => {
    if (reload) {
      setOptionSelectedValue({});
    }
  }, [reload]);

  return (
    <>
      <div>
        <select
          className="w-full text-center"
          id={subItem.id}
          value={
            state?.newValues?.gasses?.[formatString(subItem?.name)]?.[
              formatString(subItem?.name) + 'SelectedValue'
            ]
          }
          onChange={(e) => {
            setOptionSelected(e.target.value);
            onViewSelect(e.target, subItem);
            setState({
              ...state,
              newValues: {
                ...state?.newValues,
                gasses: {
                  ...state?.newValues?.gasses,
                  [formatString(subItem?.name)]: {
                    ...state?.newValues?.gasses?.[formatString(subItem?.name)],
                    [formatString(subItem?.name) + 'SelectedValue']:
                      e.target.value,
                  },
                },
              },
            });
          }}
        >
          <option>Seleccione</option>
          {subItem.sub.map((e, i) => (
            <option key={i}>{e}</option>
          ))}
        </select>
      </div>

      <div
        className={`${subItem.id} ${
          !state?.newValues?.gasses?.[formatString(subItem?.name)]?.fecha &&
          'arrow'
        }`}
      >
        {subItem.fecha.map((fecha, j) => (
          <div className="mt-3" key={j}>
            {fecha}

            <input
              type="number"
              min="0"
              className="w-full border-b-2 rounded-md border-blue-400"
              value={
                state?.newValues?.gasses?.[formatString(subItem?.name)]
                  ?.fecha?.[fecha]

                // currentSubCategory === subItem.name
                //   ? optionSeletedValue[fecha] || 0
                //   : 0
              }
              onChange={(event) => {
                const inputValue = event.target.value;
                if (!isNaN(inputValue) && inputValue >= 0) {
                  setOptionSelectedValue({
                    ...optionSeletedValue,
                    [fecha]: inputValue,
                  });
                  setCurrentSubCategory(subItem.name);
                  changeCombustibles(
                    event,
                    itemName,
                    subItem.name,
                    optionSeleted,
                    fecha,
                    inputValue
                  );
                  setState({
                    ...state,
                    newValues: {
                      ...state?.newValues,
                      gasses: {
                        ...state?.newValues?.gasses,
                        [formatString(subItem?.name)]: {
                          ...state?.newValues?.gasses?.[
                            formatString(subItem?.name)
                          ],
                          fecha: {
                            ...state?.newValues?.gasses?.[
                              formatString(subItem?.name)
                            ]?.fecha,
                            [fecha]: event.target.value,
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

const Gases = ({ alcance1, setAlcance1 }) => {
  const [newObject, setNewObject] = useState({
    nombre: 'Gases Refrigerantes',
    meses: null,
    subTipos: [],
  });

  useEffect(() => {
    if (newObject.subTipos.length > 0) {
      let findIndexTipo = alcance1.tipos.findIndex(
        (index) => index.nombre === 'Gases Refrigerantes'
      );
      if (findIndexTipo !== undefined && findIndexTipo !== -1) {
        let newInfo = alcance1.tipos;
        newInfo[findIndexTipo] = newObject;
        setAlcance1({
          ...alcance1,
          tipos: newInfo,
        });
      } else {
        setAlcance1({
          ...alcance1,
          tipos: [...alcance1.tipos, newObject],
        });
      }
    }
  }, [newObject.subTipos.length]);

  const onView = (name) => {
    document.querySelector(`.${name}`).classList.toggle('arrow');
    document.querySelector(`.${name}-icon`).classList.toggle('rotate-180');
  };

  return dataGasesRefrigerantes.map((item, z) => (
    <div key={z} className="flex mt-5">
      {item.sub.map((subItem, r) => (
        <div key={r} className="w-full text-center border-x px-2">
          <h1
            className="font-bold border-b-2 pb-2 h-24 flex justify-center items-center cursor-pointer gap-2"
            id={subItem.id}
            onClick={(e) => onView(e.target.id)}
          >
            {subItem.name}
            <i
              className={`fas fa-sort-down ${subItem.id}-icon duration-500`}
            ></i>
          </h1>
          <SelectedGases
            reload={subItem}
            subItem={subItem}
            itemName={item.name}
            newObject={newObject}
            setNewObject={setNewObject}
          />
        </div>
      ))}
    </div>
  ));
};

const Alcance1 = () => {
  const [metaAlcance1, setMetaAlcance1] = useState('');
  const [category, setCategory] = useState('Combustibles');

  const [alcance1, setAlcance1] = useState({
    nombre: 'Alcance 1',
    meta: null,
    tipos: [],
  });

  const { state, setState } = useAuth();

  useEffect(() => {
    if (alcance1.tipos.length > 0) {
      let alcances = [...state.alcances];
      let alcance1Copy = { ...alcance1 };
      alcance1Copy.meta = metaAlcance1;
      let findIndexAlcance = alcances.findIndex(
        (alcance) => alcance.nombre === alcance1Copy.nombre
      );
      if (findIndexAlcance !== undefined && findIndexAlcance !== -1) {
        alcances[findIndexAlcance] = alcance1Copy;
        setState({
          ...state,
          alcances: alcances,
        });
      } else {
        setState({
          ...state,
          alcances: [...state.alcances, alcance1Copy],
        });
      }
    }
  }, [alcance1.tipos]);

  return (
    <div className="flex justify-center">
      <div className="w-[95%] bg-gray-100 p-5 rounded-lg shadow border-b-4 border-r-4 relative">
        <div className="absolute p-2 border border-blue-500 flex items-center gap-2 rounded">
          <h1 className="italic font-bold text-blue-500">Meta:</h1>
          <p
            className="italic"
            style={{
              width: metaAlcance1.length > 2 ? metaAlcance1.length * 15 : 40,
            }}
          >
            <input
              style={{
                width: metaAlcance1.length > 2 ? metaAlcance1.length * 15 : 40,
              }}
              className="meta-alcance1-input"
              type="number"
              min="0"
              id="meta-alcance1-input"
              value={state?.newValues?.alcance1Meta}
              onChange={(event) => {
                const inputValue = event.target.value;
                if (!isNaN(inputValue) && inputValue >= 0) {
                  setMetaAlcance1(inputValue);
                  setState({
                    ...state,
                    newValues: {
                      ...state?.newValues,
                      alcance1Meta: inputValue,
                    },
                  });
                }
              }}
            />
          </p>
        </div>
        <h1 className="font-bold text-2xl text-center">Alcance 1</h1>
        <div className="mt-8">
          <ul className="flex font-bold">
            <li
              style={
                category === 'Combustibles'
                  ? { backgroundColor: '#242b57', color: 'white' }
                  : {}
              }
              className="w-full border text-center duration-200 cursor-pointer rounded-l-lg"
              id="Combustibles"
              onClick={(e) => setCategory(e.target.id)}
            >
              Combustibles
            </li>
            <li
              style={
                category === 'Emisiones'
                  ? { backgroundColor: '#242b57', color: 'white' }
                  : {}
              }
              className="w-full border text-center duration-200 cursor-pointer"
              id="Emisiones"
              onClick={(e) => setCategory(e.target.id)}
            >
              Emisiones Fugitivas
            </li>
            <li
              style={
                category === 'Gases'
                  ? { backgroundColor: '#242b57', color: 'white' }
                  : {}
              }
              className="w-full border text-center duration-200 cursor-pointer rounded-r-lg"
              id="Gases"
              onClick={(e) => setCategory(e.target.id)}
            >
              Gases Refrigerantes
            </li>
          </ul>
        </div>

        <div>
          {category === 'Emisiones' && (
            <Emisiones
              alcance1={alcance1}
              setAlcance1={setAlcance1}
              state={state}
              setState={setState}
            />
          )}
          {category === 'Combustibles' && (
            <Combustibles
              alcance1={alcance1}
              setAlcance1={setAlcance1}
              state={state}
              setState={setState}
            />
          )}
          {category === 'Gases' && (
            <Gases
              alcance1={alcance1}
              setAlcance1={setAlcance1}
              state={state}
              setState={setState}
            />
          )}
        </div>

        <Link
          to="/alcance2"
          className="mt-5 bg-blue-800 text-white uppercase flex items-center font-bold right-5 gap-2 p-2 rounded-lg absolute top-0"
        >
          ALCANCE 2 <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default Alcance1;
