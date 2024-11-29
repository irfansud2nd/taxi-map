import ManageTrips from "./ManageTrips";

const Navbar = () => {
  return (
    <nav className="w-full h-fit p-2 bg-slate-200">
      <div className="xl:container xl:mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Taxi Trip</h1>
        <ManageTrips />
      </div>
    </nav>
  );
};
export default Navbar;
