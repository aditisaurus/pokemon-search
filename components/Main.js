import React, { useEffect, useState, PureComponent } from "react";
import PokemonItem from "./PokemonItem";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeGrid } from "react-window";
import { FixedSizeList as List } from "react-window";
import Image from "next/image";

function Main() {
  const [limit, setLimit] = useState(25);
  const [offset, setOffset] = useState(-25);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [pokeList, setPokeList] = useState([]);
  const [pokeData, setPokeData] = useState([]);
  const [autoCompleteList, setAutoCompleteList] = useState();
  const [searchItem, setSearchItem] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    newList();
  }, []);
  //const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index) => !!pokeData[index];
  const newList = async () => {
    new Promise(function (resolve, reject) {
      fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset + 25}`
      )
        .then((response) => response.json())
        .then((data) => {
          setPokeList([...pokeList, ...data.results]);
          setPokeData([...pokeData, ...data.results]);
          setOffset(offset + 25);
        });
    });
  };

  const loadMoreItems = (startIndex, stopIndex) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${
            offset + 25
          }`
        )
          .then((response) => response.json())
          .then((data) => {
            setPokeList([...pokeList, ...data.results]);
            setPokeData([...pokeData, ...data.results]);
            setOffset(offset + 25);
          });
        resolve();
      }, 2500)
    );
  };

  const handleAutoComplete = (e) => {
    setSearchItem(e.target.value);
    console.log(pokeList, " Testing Pokelist");
    const autoCompleteValue = pokeList.filter((poke) =>
      poke.name.startsWith(e.target.value)
    );
    console.log(autoCompleteValue, " Testing List");
    setAutoCompleteList(autoCompleteValue);
    setPokeData(autoCompleteValue);
    window.scrollTo(0, 0);
    if (e.target.value === "") {
      setAutoCompleteList([]);
      setPokeData(pokeList);
    }
  };

  const handleAutoCompleteSearch = (data) => {
    const results = pokeList.filter((poke) => poke.name === data.name);
    setSearchItem(data.name);
    //sessionStorage.setItem(history, [...history, ...results]);
    setPokeData(results);
    setAutoCompleteList([]);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const search = pokeList.filter((poke) => poke.name === searchItem);
    //sessionStorage.setItem(history, setHistory([...history, ...search]));
    setAutoCompleteList([]);
    setPokeData(search);
  };

  const Cell = ({ columnIndex, rowIndex, style }) => (
    <div
      className={
        columnIndex % 2
          ? rowIndex % 2 === 0
            ? "GridItemOdd"
            : "GridItemEven"
          : rowIndex % 2
          ? "GridItemOdd"
          : "GridItemEven"
      }
      style={style}
    >
      <div
        class="max-w-sm rounded overflow-hidden shadow-sm"
        data-cy="pokemon-list"
      >
        {pokeData[columnIndex + 1 + rowIndex * 5 - 1] !== undefined ? (
          <>
            <Image
              class="rounded-t-lg justify-center"
              src={
                `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/` +
                parseInt(
                  pokeData[columnIndex + 1 + rowIndex * 5 - 1]?.url
                    .split("/")
                    .slice(-2, -1)
                ) +
                `.svg`
              }
              width={50}
              height={50}
              alt=""
            />
            <div class="px-6 py-4">
              <div class="font-bold text-white text-xl mb-2">
                {pokeData[columnIndex + 1 + rowIndex * 5 - 1]?.name}{" "}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div>
        <header>
          <nav class="navbar navbar-expand-lg shadow-lg py-2 bg-green relative flex items-center w-full justify-between">
            <div class="px-6 w-full flex flex-wrap items-center justify-between">
              <div
                class="navbar-collapse collapse grow items-center"
                id="navbarSupportedContentY"
              >
                <div class="flex space-x-2 justify-center">
                  <div>
                    <button
                      type="button"
                      class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Dark
                    </button>
                  </div>
                  <ul class="navbar-nav mr-auto lg:flex lg:flex-row">
                    <li class="nav-item">
                      <a
                        class="nav-link block pr-2 lg:px-2 py-2 text-gray-600 hover:text-gray-700 focus:text-gray-700 transition duration-150 ease-in-out"
                        href="#!"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                      >
                        Home
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>
      <div>
        <form
          data-cy="pokemon-search-input"
          class="w-full max-w-xlg flex justify-center py-10"
          onSubmit={(e) => submitSearch(e)}
        >
          <div class="flex items-center border-b border-teal-500">
            <input
              id="search-input-id"
              class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Search..."
              value={searchItem}
              aria-label="Full name"
              onChange={handleAutoComplete}
            />
          </div>
        </form>
      </div>

      <div class="flex justify-center min-w-sm z-index: 999">
        <ul class="bg-white rounded-lg  border-gray-200 w-80 text-gray-900">
          {autoCompleteList?.map((data) => (
            <li
              data-cy="pokemon-autosuggestion-list"
              class="px-3 py-2 border-b border-gray-200 w-full rounded-t-lg"
              onClick={() => handleAutoCompleteSearch(data)}
            >
              {data.name}
            </li>
          ))}
        </ul>
      </div>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={500}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeGrid
            height={140000}
            width={1400}
            rowHeight={175}
            columnWidth={300}
            rowCount={1000}
            columnCount={5}
            onItemsRendered={({
              visibleRowStartIndex,
              visibleColumnStartIndex,
              visibleRowStopIndex,
              overscanRowStopIndex,
              overscanRowStartIndex,
            }) => {
              onItemsRendered({
                visibleColumnStartIndex: visibleColumnStartIndex,
                overscanStartIndex: overscanRowStartIndex,
                overscanStopIndex: overscanRowStopIndex,
                visibleStartIndex: visibleRowStartIndex,
                visibleStopIndex: visibleRowStopIndex,
              });
            }}
            ref={ref}
          >
            {Cell}
          </FixedSizeGrid>
        )}
      </InfiniteLoader>
    </div>
  );
}
export default Main;
