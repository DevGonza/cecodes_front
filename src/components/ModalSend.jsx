import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import Spinner from "./Spinner"; // Componente de spinner, implementa tu propio estilo

export default function ModalSend() {
  const { isOpen, handleModal, reiniciar, isLoading } = useContext(AuthContext);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner />
        </div>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={handleModal}
        >
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-gray-900 text-center"
                >
                  Se envió correctamente
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    El envío del formulario se realizó correctamente. Gracias por participar en las respuestas de este formulario.
                  </p>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center font-bold rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={reiniciar}
                  >
                    Reiniciar Formulario
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
