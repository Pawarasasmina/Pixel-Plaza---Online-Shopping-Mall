import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../utils/Loading";

//icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClose,
  faFile,
  faIdCardAlt,
  faIdCard,
  faPortrait,
  faSearch,
  faShop,
} from "@fortawesome/free-solid-svg-icons";

const Shoppanel = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const floors = [1, 2, 3, 4];

  //for shop calculations
  const [allocatedShops, setAllocatedShops] = useState(0);
  const [totalShops, setTotalShops] = useState(40);
  const [remainingShops, setRemainingShops] = useState(totalShops);

  const handleShopClickUpdate = (shop) => {
    setSelectedShop(shop); // Pass the full shop object
  };

  const handleClosePopup = () => {
    setSelectedShop(null);
  };

  const handleSaveDetails = async (updatedShop) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/shops/updateDetails/${updatedShop.floorID}`,
        updatedShop
      );
      if (response.status === 200) {
        console.log("Updated Shop:", response.data.shop);
        setSelectedShop(null);
        // Update the shop list with the new details
        setShops((prevShops) =>
          prevShops.map((shop) =>
            shop.floorID === updatedShop.floorID ? updatedShop : shop
          )
        );
      } else {
        console.error("Failed to update shop details:", response.data.message);
        alert("Error updating data on this form");
      }
    } catch (error) {
      console.error("Error saving shop details:", error);
    }
  };

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/shops/get");
        setShops(response.data);
        setIsLoading(false);

        // Calculate shop counts
        const allocatedShopsCount = response.data.filter(
          (shop) => shop.shopName
        ).length;
        const totalShopsCount = 40;
        const remainingShopsCount = totalShopsCount - allocatedShopsCount;

        // Update state with calculated values
        setAllocatedShops(allocatedShopsCount);
        setTotalShops(totalShopsCount);
        setRemainingShops(remainingShopsCount);
      } catch (error) {
        console.error("Error fetching customer data", error);
        alert("Fetching data function is not working");
        setIsLoading(true);
      }
    };

    fetchShopDetails();
  }, []);

  const UpdateShopFormPopup = ({ shop, onClose, onSave }) => {
    // Convert ISO date string to yyyy-mm-dd
    const formatDateFromISO = (isoString) => {
      if (!isoString) return "";
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2); // Add leading zero for months
      const day = `0${date.getDate()}`.slice(-2); // Add leading zero for days
      return `${year}-${month}-${day}`;
    };

    const generateShopID = (floorID) => {
      const newShopID = `SHOP-${floorID}`;
      setShopID(newShopID); // Set the generated ID to the state
    };

    const [shopName, setShopName] = useState(shop.shopName || "");
    const [shopID, setShopID] = useState(shop.shopID || "");
    const [assignDate, setAssignDate] = useState(
      formatDateFromISO(shop.assignDate) || ""
    ); // Format ISO date
    const [description, setDescription] = useState(shop.description || "");

    // Convert yyyy-mm-dd to ISO format
    const parseDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString();
    };

    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedShop = {
        ...shop,
        shopName,
        shopID,
        assignDate: parseDate(assignDate), // Convert back to ISO
        description,
      };
      onSave(updatedShop);
    };

    return (
      <div className="fixed inset-0 bg-baseextra7 bg-opacity-40 flex justify-center items-center z-40">
        <div className="bg-white w-[50vw] p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-russoone text-2xl">Update Shop Details</h3>
            <button
              onClick={onClose}
              className="bg-baseextra2 text-white px-4 py-2 rounded-full"
            >
              <FontAwesomeIcon
                icon={faClose}
                className="items-center justify-center"
              />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center w-auto h-auto">
              <div className="mb-1 w-[20rem]">
                <label
                  htmlFor="floorID"
                  className="block text-lg font-ibmplexsans font-medium text-gray-700"
                >
                  <FontAwesomeIcon icon={faIdCardAlt} className="mx-2" />
                  Floor ID:
                </label>
                <div className="mt-1 h-10 w-[20rem] text-start justify-center block border border-gray-300 rounded-md shadow-sm p-2 drop-shadow-md">
                  {shop?.floorID}
                </div>
              </div>

              <div className="mb-1 w-[20rem]">
                <label
                  htmlFor="assignDate"
                  className="block text-lg font-ibmplexsans font-medium text-gray-700"
                >
                  <FontAwesomeIcon icon={faCalendar} className="mx-2" />
                  Assign Date
                </label>
                <input
                  id="assignDate"
                  type="date"
                  value={assignDate} // Value is in yyyy-mm-dd format
                  onChange={(e) => setAssignDate(e.target.value)}
                  className="mt-1 h-10 w-[20rem] block border border-gray-300 rounded-md shadow-sm p-3 drop-shadow-md"
                />
              </div>
            </div>

            <div className="flex justify-between items-center w-auto h-auto mt-4">
              <div className="mb-4">
                <label
                  htmlFor="shopName"
                  className="block text-lg font-ibmplexsans font-medium text-gray-700"
                >
                  <FontAwesomeIcon icon={faShop} className="mx-2" />
                  Shop Name
                </label>
                <input
                  id="shopName"
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="mt-1 h-10 w-[20rem] block border border-gray-300 rounded-md shadow-sm p-3 drop-shadow-md"
                  required
                />
              </div>

              <div className="mb-4 w-[20rem] flex items-center">
                <label
                  htmlFor="shopID"
                  className="block text-lg font-ibmplexsans font-medium text-gray-700"
                >
                  <FontAwesomeIcon icon={faIdCard} className="mx-2" />
                  Shop ID
                </label>
                <div className="flex">
                  <input
                    id="shopID"
                    type="text"
                    value={shopID}
                    onChange={(e) => setShopID(e.target.value)}
                    className="mt-1 h-10 block border border-gray-300 rounded-md shadow-sm p-3 drop-shadow-md w-full"
                    readOnly
                  />
                  
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-lg font-ibmplexsans font-medium text-gray-700"
              >
                <FontAwesomeIcon icon={faFile} className="mx-2" />
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm drop-shadow-md p-2"
                rows="5"
              />
            </div>

            <div className="flex justify-center p-5">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen w-[100vw] bg-baseextra6 items-center">
      <div className="fixed h-[10rem] w-[100vw] bg-baseextra6 flex flex-col items-center cursor-default justify-between z-40">
        {/* System Performance Bar */}
        <div className=" h-[6rem] w-[100vw] bg-baseextra6 flex items-center justify-center z-40">
          <div className="flex h-[6rem] w-[20vw] bg-dark items-center justify-center">
            <h2
              className="font-ibmplexsans text-2xl text-light font-semibold"
              style={{ fontWeight: "300" }}
            >
              System Performance
            </h2>
          </div>
          <div className="flex h-[6rem] w-[80vw] bg-dark items-center justify-center p-5 ">
            <div className="flex h-auto w-[20vw] bg-dark items-center justify-center p-5 space-x-5">
              <h2 className="font-ibmplexsans text-sm text-center text-baseextra7"></h2>
            </div>
            <div className="flex h-auto w-[20vw] bg-dark items-center justify-center p-5 space-x-5">
              <h2 className="font-ibmplexsans text-sm text-center text-light">
                Allocated Shops :
              </h2>
              <div className="flex h-[2rem] w-[6vw] bg-baseextra2 text-baseextra6 items-center justify-center p-5 rounded-xl">
                {allocatedShops}/40
              </div>
            </div>
            <div className="flex h-auto w-[20vw] bg-dark items-center justify-center p-5 space-x-5">
              <h2 className="font-ibmplexsans text-sm text-center text-light">
                Remaining Shops :
              </h2>
              <div className="flex h-[2rem] w-[6vw] bg-baseextra2 items-center text-baseextra6 justify-center p-5 rounded-xl">
                {remainingShops}/40
              </div>
            </div>
            <div className="flex h-auto w-[20vw] bg-dark items-center justify-center p-5 space-x-5">
              <h2 className="font-ibmplexsans text-sm text-center text-light">
                All Shops :
              </h2>
              <div className="flex h-[2rem] w-[6vw] bg-baseextra2 items-center text-baseextra6 justify-center p-5 rounded-xl">
                {totalShops}
              </div>
            </div>
          </div>
        </div>

        {/* Operation Bar */}
        <div className="flex h-[5rem] w-[100vw] bg-baseextra6 items-center justify-center drop-shadow-lg">
          <div className="flex h-[5rem] w-[40vw] bg-dark items-center justify-center drop-shadow-lg">
            <div className="flex w-[35vw] h-[3rem] bg-baseextra6 items-center justify-start drop-shadow-lg rounded-full p-5">
              <FontAwesomeIcon icon={faSearch} className="mx-2" />
              <span className="opacity-60">Search by Shop Name</span>
            </div>
          </div>
          <div className="flex h-[5rem] w-[60vw] bg-dark justify-center items-center p-5 drop-shadow-lg space-x-5">
            <button className="h-[3rem] w-[12vw] bg-primary rounded-3xl drop-shadow-lg hover:scale-110 transition-transform duration-200 ease-out">
              <span className="font-ibmplexsans text-md text-light">Fetch</span>
            </button>
            <button className="h-[3rem] w-[12vw] bg-primary rounded-3xl drop-shadow-lg hover:scale-110 transition-transform duration-200 ease-out">
              <span className="font-ibmplexsans text-md text-light">
                Add a Shop
              </span>
            </button>
            <button className="h-[3rem] w-[12vw] bg-primary rounded-3xl drop-shadow-lg hover:scale-110 transition-transform duration-200 ease-out">
              <span className="font-ibmplexsans text-md text-light">
                Update Shop
              </span>
            </button>

            <button className="h-[3rem] w-[12vw] bg-primary rounded-3xl drop-shadow-lg hover:scale-110 transition-transform duration-200 ease-out">
              <span className="font-ibmplexsans text-md text-light">
                Remove
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-auto-auto">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 h-auto w-full p-5 pt-44">
            {floors.map((floor, index) => {
              return (
                <div key={index} className="relative flex h-auto w-auto p-5">
                  <div className="flex flex-col h-auto w-[50vw] justify-start items-start p-5 border-2 border-baseextra7 rounded-2xl">
                    <div className="flex w-full h-auto items-start">
                      <h2 className="font-russoone text-3xl text-baseextra4 text-start ml-10">
                        Floor: {floor}
                      </h2>
                    </div>
                    <div className="flex flex-col w-full h-auto items-start justify-start p-5 space-y-5">
                      <div className="grid grid-cols-5 gap-2 w-full justify-start items-start">
                        {shops.slice(index * 10, index * 10 + 5).map((shop) => (
                          <div
                            key={shop._id}
                            onClick={() => handleShopClickUpdate(shop)}
                            className={`flex flex-col h-28 w-28 p-2 rounded-b-xl cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out hover:drop-shadow-xl ${
                              shop.shopName
                                ? "bg-gradient-to-t from-green-700 to-green-400"
                                : "bg-gray-500"
                            }`}
                          >
                            <h2 className="font-russoone text-md text-yellow-400">
                              {shop.floorID || "Empty"}
                            </h2>
                            <h2 className="font-ibmplexsans text-sm text-baseextra6">
                              {shop.shopName || "Empty"}
                            </h2>
                            <h2
                              className="font-ibmplexsans text-xs text-baseextra6 mt-1"
                              style={{
                                fontWeight: 200,
                              }}
                            >
                              {shop.shopKeeperName || "Empty"}
                            </h2>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col w-[40vw] h-10 bg-gray-500" />
                      <div className="grid grid-cols-5 gap-2 w-full justify-center">
                        {shops
                          .slice(index * 10 + 5, (index + 1) * 10)
                          .map((shop) => (
                            <div
                              key={shop._id}
                              onClick={() => handleShopClickUpdate(shop)}
                              className={`flex flex-col h-28 w-28 p-2 rounded-t-xl cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out ${
                                shop.shopName
                                  ? "bg-gradient-to-b from-green-700 to-green-400"
                                  : "bg-gray-500"
                              }`}
                            >
                              <h2 className="font-russoone text-md text-yellow-400">
                                {shop.floorID || "Empty"}
                              </h2>
                              <h2 className="font-ibmplexsans text-sm text-baseextra6">
                                {shop.shopName || "Empty"}
                              </h2>
                              <h2 className="font-ibmplexsans text-xs text-baseextra6">
                                {shop.shopKeeperName || "Empty"}
                              </h2>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Render the UpdateShopFormPopup conditionally */}
      {selectedShop && (
        <UpdateShopFormPopup
          shop={selectedShop}
          onClose={handleClosePopup}
          onSave={handleSaveDetails}
        />
      )}
    </div>
  );
};

export default Shoppanel;
