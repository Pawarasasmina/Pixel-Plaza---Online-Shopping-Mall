import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import "../styles/itemlist.css";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products")
      .then((res) => {
        setItems(res.data);
        filterItems(res.data, location.search);
      })
      .catch(() => {
        console.log("Error while getting data");
      });
  }, []);

  useEffect(() => {
    filterItems(items, location.search);
  }, [location.search, items]);

  const filterItems = (items, searchQuery) => {
    const queryParams = new URLSearchParams(searchQuery);
    const searchQueryParam = queryParams.get("search") || "";
    const categoryQueryParam = queryParams.get("category") || "";

    let filtered = items;

    // Filter by search query
    if (searchQueryParam.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQueryParam.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQueryParam.toLowerCase())
      );
    }

    // Filter by category
    if (categoryQueryParam.trim()) {
      filtered = filtered.filter((item) => item.category === categoryQueryParam);
    }

    setFilteredItems(filtered);
  };

  const itemlist =
    filteredItems.length === 0
      ? "No items Found"
      : filteredItems.map((item, index) => (
          <ItemCard key={index} item={item} />
        ));

  return (
    <div className="w-[100vw]"> 
      <div className="item-list">{itemlist}</div>
    </div>
  );
};

export default ItemList;
