import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import { LatLngBoundsExpression } from "leaflet";
import {
  TaxiTripWithRoute,
  TripToDisplay,
  apiUrl,
  defaultColor,
} from "../lib/constants";
import { countDuration, formatDate, roundDecimal } from "../lib/functions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import L from "leaflet";
import axios from "axios";
import { addActiveTrips, setSearchResultTrips } from "@/lib/redux/TripSlice";

const FitBounds = ({ tripsToDisplay }: { tripsToDisplay: TripToDisplay[] }) => {
  const map = useMap();

  useEffect(() => {
    if (tripsToDisplay.length === 0) return;

    const bounds: LatLngBoundsExpression = tripsToDisplay.flatMap((trip) => [
      [Number(trip.pickup_latitude), Number(trip.pickup_longitude)],
      [Number(trip.dropoff_latitude), Number(trip.dropoff_longitude)],
    ]);

    map.fitBounds(bounds);
  }, [tripsToDisplay, map]);

  return null;
};

const DetailInfo = ({ trip }: { trip: TripToDisplay }) => {
  const info = [
    {
      label: "Label",
      value: trip.customLabel || "-",
    },
    {
      label: "Pickup Location",
      value: trip.pickup_location_name,
    },
    {
      label: "Pickup Time",
      value: formatDate(trip.pickup_datetime),
    },
    {
      label: "Dropoff Location",
      value: trip.dropoff_location_name,
    },
    {
      label: "Dropoff Time",
      value: formatDate(trip.dropoff_datetime),
    },
    {
      label: "Trip Distance",
      value: roundDecimal(trip.trip_distance) + " Miles",
    },
    {
      label: "Trip Duration",
      value:
        countDuration(trip.pickup_datetime, trip.dropoff_datetime) + " Minutes",
    },
    {
      label: "Fare",
      value: "$" + roundDecimal(trip.fare_amount),
    },
    {
      label: "Tip",
      value: "$" + roundDecimal(trip.tip_amount),
    },
    {
      label: "Tolls",
      value: "$" + roundDecimal(trip.tolls_amount),
    },
    {
      label: "Total",
      value: "$" + roundDecimal(trip.total_amount),
    },
    {
      label: "Payment Method",
      value: trip.payment_type,
    },
  ];

  return (
    <Tooltip sticky opacity={1}>
      {info.map(({ label, value }) => (
        <p className="flex items-center" key={label}>
          <span className="w-full mr-2">{label}</span>
          <span className="font-semibold">{value}</span>
        </p>
      ))}
    </Tooltip>
  );
};

const createMarkerIcon = (hexColor: string) => {
  const markerHtmlStyles = `
  background-color: ${hexColor};
  width: 2rem;
  height: 2rem;
  display: block;
  left: -1rem;
  top: -1rem;
  position: relative;
  border-radius: 2rem 2rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

  return L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`,
  });
};

const TaxiTripMap = () => {
  const tripsToDisplay = useSelector((state: RootState) => state.trip.active);

  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const result = await axios.get(apiUrl);
      let data = result.data.data.map((item: TaxiTripWithRoute, i: number) => ({
        ...item,
        color: defaultColor,
        customLabel: `Trip ` + i,
      }));

      dispatch(addActiveTrips(data));
      dispatch(setSearchResultTrips(result.data.data));
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MapContainer center={[0, 0]} zoom={12} className="w-full h-full z-10">
      <FitBounds tripsToDisplay={tripsToDisplay} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {tripsToDisplay.map((trip, index) => (
        <React.Fragment key={index}>
          <Marker
            position={[
              Number(trip.pickup_latitude),
              Number(trip.pickup_longitude),
            ]}
            icon={createMarkerIcon(trip.color)}
          >
            <DetailInfo trip={trip} />
          </Marker>
          <Marker
            position={[
              Number(trip.dropoff_latitude),
              Number(trip.dropoff_longitude),
            ]}
            icon={createMarkerIcon(trip.color)}
          >
            <DetailInfo trip={trip} />
          </Marker>
          <Polyline
            key={`${trip.id}-${trip.color}`}
            positions={trip.coordinates}
            color={trip.color}
            weight={7}
          >
            <DetailInfo trip={trip} />
          </Polyline>
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default TaxiTripMap;
