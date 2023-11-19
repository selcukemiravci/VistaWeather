import React, { useState, useEffect } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { geoApiOptions, GEO_API_URL } from '../../api';
import { weatherApp_backend } from '../../../../declarations/weatherApp_backend';

// Utility function to flatten nested arrays.
function flattenArray(arr) {
  return arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []);
}

// Component to display search-related data.
const SearchData = ({ listData }) => {
  // Flatten the list data if it contains nested arrays.
  const flattenedListData = flattenArray(listData);

  // You can uncomment and use this section if you plan to display the list.
  // const listStyle = {
  //   listStyle: 'none',
  //   padding: '0',
  // };

  // return (
  //   <ul style={listStyle}>
  //     {flattenedListData.map((value, index) => (
  //       <li key={index}>{value}</li>
  //     ))}
  //   </ul>
  // );

  // For now, we return null since we're not displaying any list.
  return null;
};

// Main search component.
const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    // Fetch the listData when the component mounts.
    async function fetchListData() {
      try {
        const listDataFromBackend = await weatherApp_backend.fetchList();
        setListData(listDataFromBackend);
      } catch (error) {
        console.error('Failed to fetch list data:', error);
      }
    }

    fetchListData();
  }, []);

  // Load options for the async select input.
  const loadOptions = async (inputValue) => {
    try {
      const response = await fetch(
        `${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`,
        geoApiOptions
      );

      // Store the inputValue in Motoko backend.
      await weatherApp_backend.put(inputValue);

      const responseJson = await response.json();
      const optionsFromApi = responseJson.data.map((city) => ({
        value: `${city.latitude} ${city.longitude}`,
        label: `${city.name}, ${city.countryCode}`,
      }));

      // Combine API results with user search history.
      const userSearchHistory = listData.map(({ name }) => ({
        value: name, label: name
      }));

      return {
        options: [...optionsFromApi, ...userSearchHistory],
      };
    } catch (error) {
      console.error('Error loading options:', error);
      return { options: [] };
    }
  };

  // Handle selection of search data.
  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  // Styling for the container of the search component.
  const containerStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  };

  return (
    <div style={containerStyle}>
      <h2>🌤 VistaWeather</h2>
      <AsyncPaginate
        placeholder="Search for city"
        debounceTimeout={600}
        value={search}
        onChange={handleOnChange}
        loadOptions={loadOptions}
      />
      <SearchData listData={listData} />
    </div>
  );
};

export default Search;
