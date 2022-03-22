import React, { useEffect } from "react";
import { KeyIcon, MailIcon, PhoneIcon } from "@heroicons/react/solid";
import { API } from "../../api/api";

export default function Home() {
  const [chests, setChests] = React.useState<
    { code: string; key: string; status: string; dificulty: string }[]
  >([]);

  const getChests = async () => {
    const { error, chests } = await API.getChests();

    window.localStorage.setItem("chests", JSON.stringify(chests));

    setChests(Object.assign([], [...chests]));
  };

  useEffect(() => {
    window.localStorage.getItem("chests");

    const chests = JSON.parse(window.localStorage.getItem("chests") || "[]");
    setChests(Object.assign([], [...chests]));
  }, []);

  const openChest = async (code: string) => {
    const { error, chest } = await API.openChest(code);

    if (error || !chest) {
      alert(error);
    } else {
      setChests(
        Object.assign(
          [],
          chests.map((chest) => (chest.code === code ? chest : chest))
        )
      );
      alert("OPPENED");
    }
  };

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {chests && chests.length > 0 ? (
        chests.map((chest) => (
          <li
            key={chest.code}
            className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
          >
            <div className="w-full flex items-center justify-between p-6 space-x-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="text-gray-900 text-sm font-medium truncate">
                    {chest.dificulty}
                  </h3>
                  <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                    {chest.status}
                  </span>
                </div>
                <p className="mt-1 text-gray-500 text-sm truncate">
                  {chest.code}
                </p>
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="w-0 flex-1 flex">
                  <p
                    onClick={() => openChest(chest.code)}
                    className="cursor-pointer relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                  >
                    <KeyIcon
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-3">Abrir</span>
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))
      ) : (
        <button
          type="button"
          onClick={() => getChests()}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Get Chests
        </button>
      )}
    </ul>
  );
}
