import "./App.css";
import { MapContainer, TileLayer } from "react-leaflet";
import React, { useEffect, useState } from "react";
import { LayersControl } from "react-leaflet/LayersControl";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import ReactWeather, { useOpenWeather } from "react-open-weather";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
function App() {
  const center = [51.505, -0.09];
  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const startingPosition = { lat: 40.7357, lng: -74.1724 };
  const [latlng, setLatLng] = useState(startingPosition);
  const openWeatherKey = '058d0a4d8e0854cbd38a034edce29b3e';
  const googlePlacesKey = 'AIzaSyDgWbaJbfYaTV3XpQ9OF1iL8wNfHcXrkh0'
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: openWeatherKey,
    lat: latlng.lat,
    lon: latlng.lng,
    lang: "en",
    unit: "metric",
  });
  useEffect(() => {
    if (location != null) {
      geocodeByAddress(location?.value?.description)//geocode address and updates value to latlng each time location, latlng changes 
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => setLatLng({ lat, lng }));
    }
  }, [location, latlng]);
  useEffect(() => {
    if (map != null) {
      map.setView(latlng, 10);//updates the view of map each time map, latlng changes 
    }
  }, [map, latlng]);
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
        }}
      >
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LayersControl position="topright"> 
            <LayersControl.Overlay name="Temperature">
              <TileLayer url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=058d0a4d8e0854cbd38a034edce29b3e" />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Wind Speed">
              <TileLayer url="https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=058d0a4d8e0854cbd38a034edce29b3e" />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Clouds ">
              <TileLayer url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=058d0a4d8e0854cbd38a034edce29b3e" />
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
        <div style={{ width: "40%" }}>
          <GooglePlacesAutocomplete
            apiKey={googlePlacesKey}
            selectProps={{
              location,
              onChange: setLocation,
            }}
          />
          <ReactWeather
            isLoading={isLoading}
            errorMessage={errorMessage}
            data={data}
            lang="en"
            locationLabel={
              location ? location?.value?.description : "New Jersey"
            }
            unitsLabels={{ temperature: "C", windSpeed: "Km/h" }}
            showForecast
          />
        </div>
      </div>
    </React.Fragment>
  );
}
export default App;
