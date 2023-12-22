import React from "react";
import GoogleMapReact from "google-map-react";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import mapStyles from "./mapStyles";
//Some material ui components are still being worked on , therefore importing from lab not core
import Rating from "@material-ui/lab/Rating";
import useStyles from "./styles";
import { useState } from "react";

const Map = ({
  setCoordinates,
  setBounds,
  coordinates,
  places,
  setchildClicked,
  weatherData,
}) => {
  const classes = useStyles();
  const isDesktop = useMediaQuery("(min-width:600px)"); //true if width more than 600px
  //Lifting the state up -> We want the child state to take to the parent component of both list and map which is app component , you could also solve using redux or context

  //{
  // const [childClicked, setchildClicked] = useState(null);
  // }

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        // Styling of map from https://snazzymaps.com
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        onChange={(e) => {
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
        }}
        onChildClick={(child) => setchildClicked(child)}
      >
        {places?.map((place, i) => (
          <div
            className={classes.markerContainer}
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            key={i}
          >
            {!isDesktop ? (
              <LocationOnOutlinedIcon color="primary" fontSize="large" />
            ) : (
              <Paper elevation={3} className={classes.paper}>
                <Typography
                  className={classes.typography}
                  variant="subtitle2"
                  gutterBottom
                >
                  {" "}
                  {place.name}
                </Typography>
                <img
                  className={classes.pointer}
                  src={
                    place.photo
                      ? place.photo.images.large.url
                      : "https://media-cdn.tripadvisor.com/media/photo-s/11/fa/54/9c/cbd.jpg"
                  }
                  alt={place.name}
                />
                <Rating size="small" value={Number(place.rating)} readOnly />
              </Paper>
            )}
          </div>
        ))}
        {weatherData?.list?.map((data, i) => (
          <div key={i} lat={data.coord.lat} lng={data.coord.lon}>
            <img
              height="80"
              src={`https://openweathermap.org/img/w/${data.weather[0].icon.png}`}
            />
          </div>
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
