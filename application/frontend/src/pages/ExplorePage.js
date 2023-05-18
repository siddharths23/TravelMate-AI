import React, { useState, useEffect } from "react";
import "../css/Explore.css";
import { createCompletion } from "../api";
import { useNavigate } from "react-router-dom";

function Explore() {
  const [fetchedDestinations, setFetchedDestinations] = useState([]);
  const navigate = useNavigate();

  const fetchDestinations = async () => {
    try {
      let cachedData = localStorage.getItem("destinations");
      let cacheTimestamp = localStorage.getItem("cacheTimestamp");

      if (cachedData && cacheTimestamp) {
        const currentTime = new Date().getTime();
        const cacheDuration = 10 * 60 * 100; // Cache duration in milliseconds (10 minutes)

        if (currentTime - cacheTimestamp < cacheDuration) {
          setFetchedDestinations(JSON.parse(cachedData));
          return;
        }
      }

      const countriesResponse = await fetch(
        "https://restcountries.com/v3.1/all"
      );
      const countries = await countriesResponse.json();

      const randomCountries = getRandomDestinations(countries);

      const unsplashApiKey = "0ADll0EcZE060DYt9xM6kPrbkH7fzXKGzEcFAHqfcy0";
      const unsplashUrl =
        "https://api.unsplash.com/search/photos?per_page=1&query=";

      const destinationsWithImages = await Promise.all(
        randomCountries.map(async (country, index) => {
          const delay = index * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));

          const imageUrlResponse = await fetch(
            `${unsplashUrl}${country.name}&client_id=${unsplashApiKey}`
          );
          const imageData = await imageUrlResponse.json();

          return {
            name: country.name,
            imageUrl: imageData.results[0]?.urls.small || "",
          };
        })
      );

      localStorage.setItem(
        "destinations",
        JSON.stringify(destinationsWithImages)
      );
      localStorage.setItem("cacheTimestamp", new Date().getTime());
      setFetchedDestinations(destinationsWithImages);
    } catch (error) {
      console.error("Error fetching destination data:", error);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  function getRandomDestinations(countries) {
    const randomIndexes = new Set();
    while (randomIndexes.size < 6) {
      randomIndexes.add(Math.floor(Math.random() * countries.length));
    }
    return Array.from(randomIndexes).map((index) => ({
      name: countries[index].name.common,
    }));
  }

  const generatePlan = async (destination) => {
    const prompt = `Generate a day to day travel plan in valid JSON format for visiting ${destination} with the following structure: {"Day 1": {"Place": "Some place", "Description": "Some description"}, "Day 2": {"Place": "Another place", "Description": "Another description"}, ...}`;

    try {
      const response = await createCompletion(prompt);
      navigate("/plan", {
        state: { plan: response, destinationName: destination },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="explore-container">
      <h1>Explore Destinations</h1>
      <div className="destination-grid">
        {fetchedDestinations.map((destination, index) => {
          return (
            <div
              key={index}
              className="destination-card"
              onClick={() => generatePlan(destination.name)}
            >
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="destination-image"
              />
              <div className="destination-name">
                <h3>{destination.name}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Explore;
