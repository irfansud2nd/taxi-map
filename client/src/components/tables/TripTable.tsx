import { RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/functions";
import { Button } from "../ui/button";
import { TripToDisplay } from "@/lib/constants";
import AddTripDialog from "../AddTripDialog";
import { removeActiveTrips } from "@/lib/redux/TripSlice";

const TripTable = ({ active }: { active?: boolean }) => {
  const { active: activeTrips, searchResult } = useSelector(
    (state: RootState) => state.trip
  );
  const dispatch = useDispatch();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {active && <TableHead>Label</TableHead>}
          <TableHead>Pickup</TableHead>
          <TableHead>Dropoff</TableHead>
          <TableHead>Distance</TableHead>
          <TableHead>Fare</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {((active ? activeTrips : searchResult) as TripToDisplay[]).map(
          (trip, i) => (
            <TableRow key={i}>
              {active && <TableCell>{trip.customLabel || "-"}</TableCell>}
              <TableCell className="whitespace-nowrap">
                <span className="border-b block">
                  {trip.pickup_location_name}
                </span>
                <span>{formatDate(trip.pickup_datetime)}</span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <span className="border-b block">
                  {trip.dropoff_location_name}
                </span>
                <span>{formatDate(trip.dropoff_datetime)}</span>
              </TableCell>
              <TableCell>{trip.trip_distance} Miles</TableCell>
              <TableCell>${trip.fare_amount}</TableCell>
              <TableCell>${trip.total_amount}</TableCell>
              <TableCell className="flex gap-2">
                {active ? (
                  <>
                    <AddTripDialog type="edit" trip={trip} />
                    <Button
                      onClick={() => dispatch(removeActiveTrips([trip.id]))}
                      size={"sm"}
                    >
                      Delete
                    </Button>
                  </>
                ) : activeTrips.find((item) => item.id == trip.id) ? (
                  <Button size={"sm"} disabled>
                    Added
                  </Button>
                ) : (
                  <AddTripDialog type="add" trip={trip} />
                )}
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};
export default TripTable;
