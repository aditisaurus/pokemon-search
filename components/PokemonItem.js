import React from "react";
import Image from "next/image";

function PokemonItem({ value }) {
  return (
    <div>
     
        <div
          class="max-w-sm rounded overflow-hidden shadow-sm"
          data-cy="pokemon-list"
        >
          <Image
            class="rounded-t-lg"
            src={
              `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/` +
              parseInt(value.url.split("/").slice(-2, -1)) +
              `.svg`
            }
            width={100}
            height={100}
            alt=""
          />
          <div class="px-6 py-4">
            <div class="font-bold text-white text-xl mb-2">{value.name} </div>
          </div>
        </div>
     
    </div>
  );
}

export default PokemonItem;
