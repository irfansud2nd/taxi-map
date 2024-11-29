import Navbar from "./components/Navbar";
import TaxiTripMap from "./components/TaxiTripMap";
import ReduxProvider from "./components/ReduxProvider";

function App() {
  return (
    <div className="min-h-screen w-full grid grid-rows-[auto_1fr]">
      <ReduxProvider>
        <Navbar />
        <TaxiTripMap />
      </ReduxProvider>
    </div>
  );
}

export default App;
