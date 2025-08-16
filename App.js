import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";  // Import Line chart from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [tempHistory, setTempHistory] = useState([]);  // For storing temperature history
  const [summary, setSummary] = useState("");  // For plain English summary

  // Function to get weather data by city
  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setError("");  // Clear previous errors
      const response = await fetch(
        `https://weather-api-2893022.us-central1.run.app/getWeather?city=${city}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }

      const data = await response.json();
      setWeather(data);
      setTempHistory([...tempHistory, data.main.temp]);  // Add new temperature to history
      setLastUpdated(new Date().toLocaleString()); // Update last fetched time
      setSummary(generateWeatherSummary(data));  // Generate plain English summary
    } catch (err) {
      setWeather(null);
      setError("Could not fetch weather data. Try a valid city name.");
    }
  };

  // Function to summarize weather in plain English
  const generateWeatherSummary = (data) => {
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    return `The current weather is ${description} with a temperature of ${temp}°C. The humidity is ${humidity}% and the wind speed is ${windSpeed} m/s.`;
  };

  // Chart.js data for temperature history
  const chartData = {
    labels: tempHistory.map((_, index) => `Update ${index + 1}`),
    datasets: [
      {
        label: "Temperature History (°C)",
        data: tempHistory,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        padding: "0",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "40px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          minHeight: "80vh",  // Adjusting the height to take more space
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",  // Space out the content
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#4a4a4a" }}>
          🌦️ Weather Dashboard
        </h2>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          style={{
            padding: "12px",
            width: "100%",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={getWeather}
          style={{
            padding: "12px 25px",
            backgroundColor: "#4a90e2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
          Get Weather
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "15px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        {weather && (
          <div style={{ marginTop: "20px", color: "#333" }}>
            <h3>{weather.name}</h3>
            <img
              alt="weather icon"
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              style={{ width: "80px" }}
            />
            <p>🌤 Condition: {weather.weather[0].description}</p>
            <p>🌡️ Temperature: {weather.main.temp}°C</p>
            <p>🔻 Min Temp: {weather.main.temp_min}°C</p>
            <p>🔺 Max Temp: {weather.main.temp_max}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🎈 Pressure: {weather.main.pressure} hPa</p>
            <p>🌊 Sea Level: {weather.main.sea_level || "N/A"} hPa</p>
            <p>🗻 Ground Level: {weather.main.grnd_level || "N/A"} hPa</p>
            <p>🌬️ Wind Speed: {weather.wind.speed} m/s</p>
            <p>🧭 Wind Direction: {weather.wind.deg}°</p>

            <p><strong>Last Updated: {lastUpdated}</strong></p>
            <p>{summary}</p>
          </div>
        )}

        {/* Chart.js for temperature history */}
        {tempHistory.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h4>Temperature History</h4>
            <Line data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
