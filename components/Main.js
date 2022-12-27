import React, { useEffect, useState } from "react";
import SearchResult from "./SearchResult";
import { FixedSizeGrid as Grid } from "react-window";


function Main() {
  let historyList = [];
  const [pokeList, setPokeList] = useState([]);
  const [pokeData, setPokeData] = useState([]);
  const [autoCompleteList, setAutoCompleteList] = useState();
  const [searchItem, setSearchItem] = useState("");
  const [history, setHistory] = useState();

  useEffect(() => {
    newList();
  }, []);

  const newList = () => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=500&offset=0")
      .then((response) => response.json())
      .then((data) => {
        setPokeList(data.results);
        setPokeData(data.results);
      });
  };

  const autoComplete = (e) => {
    setSearchItem(e.target.value);
    const autoCompleteValue = pokeList.filter((poke) =>
      poke.name.startsWith(e.target.value)
    );
    setAutoCompleteList(autoCompleteValue);

    if (e.target.value === "") {
      setAutoCompleteList([]);
      setPokeData(pokeList);
    }
  };

  const searchResults = (data) => {
    const results = pokeList.filter((poke) => poke.name === data.name);
    sessionStorage.setItem(
      setHistory((historyList) => [...[historyList], results]),
      0
    );
    setSearchItem(data.name);
    setPokeData(results);
    setAutoCompleteList([]);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const search = pokeList.filter((poke) => poke.name === searchItem);
    setAutoCompleteList([]);
    setPokeData(search);
  };

  return (
    <div>
      <div>
        <form
          data-cy="pokemon-search-input"
          class="w-full max-w-sm flex justify-center"
          onSubmit={(e) => submitSearch(e)}
        >
          <div class="flex items-center border-b border-teal-500 py-2">
            <input
              id="search-input-id"
              class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Search..."
              value={searchItem}
              aria-label="Full name"
              onChange={autoComplete}
            />
          </div>
        </form>
      </div>

      <div class="flex justify-left">
        <ul class="bg-white rounded-lg border border-gray-200 w-80 text-gray-900">
          {autoCompleteList?.map((data) => (
            <li
              data-cy="pokemon-autosuggestion-list"
              class="px-3 py-2 border-b border-gray-200 w-full rounded-t-lg"
              onClick={() => searchResults(data)}
            >
              {data.name}
            </li>
          ))}
        </ul>
      </div>
      <SearchResult pokeData={pokeData} />
    </div>
  );
}
export default Main;
