import React from "react";
import Navbars from "./Navbars";
import SearchBar from "./SearchBar";
import SliderImage from "./SliderImage";
import Footer from "./Footer";

export const Homepage = () => {
  return (
    <React.Fragment>
      <Navbars /><br/>
      <SearchBar/>
      <SliderImage/>
      <Footer/>
    </React.Fragment>
  );
};
