import React, { useContext } from "react";
import { SearchContext } from "./Context/SearchContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "./Components/Homepage";
import HotelList from "./Components/HotelList";
import { FormProvider } from "./Context/FormContext";
import Navbars from "./Components/Navbars";
import SearchBarSmall from "./Components/SearchBarSmall";
import MapComponent from "./Components/MapComponent";
import Footer from "./Components/Footer";
import DetailHotel from "./Components/Detail";

function App() {
  const value = useContext(SearchContext);
  console.log(value);
  return (
    <FormProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/HotelList" element={<><Navbars/><br/><SearchBarSmall/><HotelList /><br/><Footer/></>} />
          <Route path="/DetailHotel" element={<><Navbars/> <br/> <DetailHotel/> </>}/>
          <Route path="/maps" element={<MapComponent/>} />
        </Routes>
      </BrowserRouter>
    </FormProvider>
  );
}

export default App;
