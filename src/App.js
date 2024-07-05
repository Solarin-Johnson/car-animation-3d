import { useState } from "react";
import "./App.scss";
import Gallery from "./layout/gallery";
import Header from "./layout/header/header";

function App() {
  const [details, setDetails] = useState([]);
  return (
    <div className="container">
      <Header details={details} />
      <Gallery detailsOpened={setDetails} />
    </div>
  );
}

export default App;
