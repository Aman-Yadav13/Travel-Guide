import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import { getPlacesData, getWeatherData } from "./api";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [filteredPlaces, setfilteredPlaces] = useState([]);
  const [childClicked, setchildClicked] = useState(null);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");
  const [autoComplete, setAutoComplete] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  //You can use multiple useeffects but each must serve its own function
  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating);
    setfilteredPlaces(filteredPlaces);
  }, [rating]);

  useEffect(() => {
    //If bounds only mentioned , it is an empty object and it may be clumsy , so better to check this way so that application works correctly

    //Earlier it was bounds.sw && bounds.ne but during debugging changed
    if (bounds) {
      //console.log(coordinates, bounds);
      setisLoading(true);

      //Weather data
      getWeatherData(coordinates.lat, coordinates.lng).then((data) =>
        setWeatherData(data)
      );

      if (coordinates.lat && bounds) {
        getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
          //console.log(data);
          setPlaces(
            data?.filter((place) => place.name && place.num_reviews > 0)
          );
          //Everytime we get new data , we need to reset filtered places to empty array
          setfilteredPlaces([]);
          setisLoading(false);
        });
      }
    }
  }, [type, bounds]);

  const onLoad = (autoC) => {
    setAutoComplete(autoC);
  };

  const onPlaceChanged = () => {
    //Information (google maps documentation)
    const lat = autoComplete.getPlace().geometry.location.lat();
    const lng = autoComplete.getPlace().location.lng();

    setCoordinates({ lat, lng });
  };

  return (
    <>
      <CssBaseline />
      <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setchildClicked={setchildClicked}
            weatherData={weatherData}
          />
          {/* If props going levels deep , use ReactContext or Redux */}
        </Grid>
      </Grid>
    </>
  );
};

export default App;
