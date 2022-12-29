import React from "react";

function Header() {
  return (
    <div>
      <nav class="relative w-full flex flex-wrap items-center justify-between pt-4 pb-2 bg-green hover:text-gray-700 focus:text-gray-700 shadow-lg">
        <div class="container-fluid w-full flex flex-wrap items-center justify-center px-6">
          <div class="container-fluid ">
            <h2 class="font-medium leading-tight text-4xl mt-0 mb-2 text-yellow-300 underline underline-offset-8	">
              Pokemon Search
            </h2>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
