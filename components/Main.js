import React, { useEffect, useState, createRef } from "react";
import Header from "./Header";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeGrid } from "react-window";

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
  const mainRef = createRef();

  useEffect(() => {
    newList();
  }, []);

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
    const autoCompleteValue = pokeList.filter((poke) =>
      poke.name.startsWith(e.target.value)
    );
    setAutoCompleteList(autoCompleteValue.slice(0, 5));
    setPokeData(autoCompleteValue);
    mainRef.current?.scrollToItem({
      columnIndex: 0,
      rowIndex: 0,
    });
    if (e.target.value === "") {
      setAutoCompleteList([]);
      setPokeData(pokeList);
    }
  };
  const handleSearchHistory = () => {
    setAutoCompleteList(history);
  };
  const handleAutoCompleteSearch = (data) => {
    const results = pokeList.filter((poke) => poke.name === data.name);
    setSearchItem(data.name);
    sessionStorage.setHistory(history, [...history, ...results]);
    console.log(history);
    setPokeData(results);
    setAutoCompleteList([]);
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const search = pokeList.filter((poke) => poke.name === searchItem);
    sessionStorage.setItem(history, setHistory([...history, ...search]));
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
        class="max-w-md rounded overflow-hidden shadow-sm"
        ref={columnIndex + 1 + rowIndex * 5 - 1 === 0 ? mainRef : null}
      >
        {pokeData[columnIndex + 1 + rowIndex * 5 - 1] !== undefined ? (
          <>
            <Image
              data-cy="pokemon-list"
              class="rounded-t-lg justify-center pl-10 "
              src={
                `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/` +
                parseInt(
                  pokeData[columnIndex + 1 + rowIndex * 5 - 1]?.url
                    .split("/")
                    .slice(-2, -1)
                ) +
                `.svg`
              }
              width={100}
              height={100}
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
      <Header />
      <div>
        <form
          data-cy="pokemon-search-input"
          class="w-full max-w-xlg flex justify-center py-5 pb-4 pt-8 my-2"
          onSubmit={(e) => handleSubmitSearch(e)}
        >
          <div class="flex items-center border-b border-yellow-300">
            <input
              id="search-input-id"
              class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2  leading-tight focus:outline-none"
              type="text"
              placeholder="Search..."
              value={searchItem}
              aria-label="Full name"
              onChange={handleAutoComplete}
              onClick={handleSearchHistory}
            />
          </div>
        </form>
      </div>

      <div class="flex justify-center min-w-md z-999 px-0 pt-0 ">
        <ul class="bg-white rounded-md  border-gray-200 w-55 text-gray-900">
          {autoCompleteList?.map((data) => (
            <li
              data-cy="pokemon-autosuggestion-list"
              class="px-3 py-2 border-b border-gray-200 w-full cursor-pointer rounded-t-lg"
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
            width={1600}
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
            ref={mainRef}
          >
            {Cell}
          </FixedSizeGrid>
        )}
      </InfiniteLoader>
    </div>
  );
}
export default Main;
