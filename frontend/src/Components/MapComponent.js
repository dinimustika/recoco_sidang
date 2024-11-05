import React from "react";

function MapComponent() {
  return (
    <iframe
      src="http://localhost:5000/map"
      style={{ border: "none", width: "100%", height: "100%" }}
      title="Map"
    />
  );
}

export default MapComponent;
