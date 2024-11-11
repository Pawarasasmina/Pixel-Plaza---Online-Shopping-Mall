import axios from "axios";
import React, { useEffect, useState } from "react";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";

const Mapmodel = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShopsDetails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/shops/get");
        setShops(response.data);
        console.log("Data fetching Successfully");
      } catch (error) {
        console.log("Error Fetching data :", error);
        alert("Error Fetching Data to the frontend");
      }
    };

    fetchShopsDetails();
  }, []);

  return (
    <div className="relative h-auto w-auto">
      {/* Sidebar */}
      <div className="fixed flex-col h-[100vh] rounded-3xl w-[25vw] border-r-2 bg-baseextra2 left-0 top-0 z-40">
        {/* Sidebar content here */}
      </div>

      <div className="ml-[25vw] mt-[6rem] flex flex-col h-auto w-[75vw] justify-center items-center bg-transparent overflow-x-scroll overflow-y-hidden">
        <div className="flex flex-col h-auto w-auto">
          <h2
            className="font-ibmplexsans text-3xl text-baseextra7"
            style={{
              fontWeight: 400,
            }}
          >
            Floor 01
          </h2>
          {/* Floor 01 Shopping Map */}
          <div className="flex flex-col w-[75vw] h-[80vh] scale-75 bg-baseextra6 items-center justify-center border-4 border-baseextra7 mt-10 rounded-xl p-0">
            <div className="flex w-[75vw] h-[30vh] bg-transparent items-center justify-center rounded-t-xl space-x-2">
              {shops.slice(0, 5).map((shop, index) => (
                <div
                  key={index}
                  className="flex w-[14vw] h-[25vh] items-center justify-center bg-baseextra4 rounded-2xl"
                >
                  {/* Your content for each shop goes here */}
                </div>
              ))}
            </div>

            <div className="flex w-[75vw] h-[15vh] bg-baseextra7 bg-opacity-30 items-center justify-center">
              <div className="flex  h-[10vh] bg-slate-800 items-center justify-center rounded-l-full ml-2">
                <FontAwesomeIcon
                  icon={faAngleDoubleLeft}
                  className="mx-2 h-8 text-baseextra6"
                />
                <h2 className="flex font-ibmplexsans text-baseextra6 text-md">
                  to the staircases and lift area for 02, 03, 04 Floors
                </h2>
              </div>
              <div className="flex w-[14vw] h-[15vh] bg-transparent items-center justify-center">
                <div className="flex w-20 h-20 bg-orange-500 rounded-full" />
              </div>

              <div className="flex h-[10vh] bg-slate-800 items-center justify-center rounded-r-full mr-2">
                <FontAwesomeIcon
                  icon={faAngleDoubleRight}
                  className="mx-2 h-8 text-baseextra6"
                />
                <h2 className="flex font-ibmplexsans text-baseextra6 text-md">
                  Exit and Entrance
                </h2>
              </div>
            </div>

            <div className="flex w-[75vw] h-[30vh] bg-transparent items-center justify-center rounded-t-xl space-x-2 p-0">
              {shops.slice(5, 10).map((shop, index) => (
                <div
                  key={index}
                  className="flex w-[14vw] h-[25vh] items-center justify-center bg-baseextra4 rounded-2xl"
                >
                  {/* Your content for each shop goes here */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floor 02 Section */}
        <div className="flex w-[75vw] h-auto mt-12 justify-start">
          <h2
            className="font-ibmplexsans text-3xl text-baseextra7"
            style={{
              fontWeight: 400,
            }}
          >
            Floor 02
          </h2>
        </div>

        {/* Floor 02 Shopping Map */}
        <div className="flex flex-col w-[75vw] h-[80vh] scale-75 items-center justify-center border-4 border-baseextra7 mt-10 rounded-xl p-0">
          <div className="flex w-[75vw] h-[30vh] bg-transparent items-center justify-center rounded-t-xl space-x-2">
            {shops.slice(10, 15).map((shop, index) => (
              <div
                key={index}
                className="flex w-[14vw] h-[25vh] items-center justify-center bg-baseextra4 rounded-2xl"
              >
                {/* Your content for each shop goes here */}
              </div>
            ))}
          </div>

          <div className="flex w-[75vw] h-[15vh] bg-baseextra7 bg-opacity-30 items-center justify-center">
            <div className="flex h-[10vh] bg-slate-800 items-center justify-center rounded-l-full ml-2">
              <FontAwesomeIcon
                icon={faAngleDoubleLeft}
                className="mx-2 h-8 text-baseextra6"
              />
              <h2 className="flex font-ibmplexsans text-baseextra6 text-md">
                to the staircases and lift area for 03, 04 Floors
              </h2>
            </div>
            <div className="flex w-[14vw] h-[15vh] bg-transparent items-center justify-center">
              <div className="flex w-20 h-20 bg-orange-500 rounded-full" />
            </div>

            <div className="flex w-[35vw] h-[10vh] bg-slate-800 items-center justify-center rounded-r-full mr-2">
              <FontAwesomeIcon
                icon={faAngleDoubleRight}
                className="mx-2 h-8 text-baseextra6"
              />
              <h2 className="flex font-ibmplexsans text-baseextra6 text-md">
                to the Floor 01, Exit and Entrance
              </h2>
            </div>
          </div>

          <div className="flex w-[75vw] h-[30vh] bg-transparent items-center justify-center rounded-b-xl space-x-2">
            {shops.slice(15, 20).map((shop, index) => (
              <div
                key={index}
                className="flex w-[14vw] h-[25vh] items-center justify-center bg-baseextra4 rounded-2xl"
              >
                {/* Your content for each shop goes here */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapmodel;
