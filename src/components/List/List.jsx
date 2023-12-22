import React, { useState, useEffect, createRef } from "react";
import {
  CircularProgress,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import useStyles from "./styles";
import PlaceDetails from "../PlaceDetails/PlaceDetails";

const List = ({
  places,
  childClicked,
  isLoading,
  type,
  setType,
  rating,
  setRating,
}) => {
  const classes = useStyles();
  //Debug time changes {
  // const [type, setType] = useState("restaurants");
  // const [rating, setRating] = useState("");
  // }

  //console.log({ childClicked }); // lets u know what u console logged
  //console.log( childClicked );

  //State field thats going to contain all the references
  //element references state
  const [elRefs, setElRefs] = useState([]); //No places so set up to empty list
  useEffect(() => {
    //Array constructor used to construct as many elements as there are places
    //.fill fills up the array  , _ signifies that we are not gonna use the first parameter
    //returning accessed refs and return the thing and if doesnt exist yet , we create a ref
    //Usually u only need to make one ref , but in this case , we do need to make as many as there are places

    //Note: You will get an error that you dont have places initially so you cannot create refs , it can be sorted implementing circular progress which is loading
    const refs = Array(places?.length);
    setElRefs((refs) =>
      Array(places?.length)
        .fill()
        .map((_, i) => refs[i] || createRef())
    );
  }, [places]);
  //Now we can use these references in place details

  return (
    <div className={classes.container}>
      <Typography variant="h4">
        Restaurants, Hotels & Attractions around you
      </Typography>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
          <FormControl className={classes.formControl}>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <MenuItem value="restaurants">Restaurants</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
              }}
            >
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={3}>Above 3.0</MenuItem>
              <MenuItem value={4}>Above 4.0</MenuItem>
              <MenuItem value={4.5}>Above 4.5</MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={3} className={classes.list}>
            {places?.map((place, i) => (
              <Grid item key={i} xs={12}>
                <PlaceDetails
                  place={place}
                  selected={Number(childClicked) === i}
                  refProp={elRefs[i]}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default List;
