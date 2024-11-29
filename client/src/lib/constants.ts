export type TaxiTrip = {
  vendor_id: string;
  pickup_datetime: string;
  dropoff_datetime: string;
  passenger_count: number;
  trip_distance: number;
  pickup_longitude: number;
  pickup_latitude: number;
  dropoff_longitude: number;
  dropoff_latitude: number;
  payment_type: string;
  fare_amount: number;
  mta_tax: number;
  tip_amount: number;
  tolls_amount: number;
  total_amount: number;
  imp_surcharge: number;
  rate_code: number;
  store_and_fwd_flag?: string;
};

export type TaxiTripWithRoute = TaxiTrip & {
  coordinates: [number, number][];
  route_distance: number;
  route_duration: number;
  pickup_location_name: string;
  dropoff_location_name: string;
  id: number;
};

export type TripToDisplay = TaxiTripWithRoute & {
  color: string;
  customLabel?: string;
};

export const defaultColor = "#3b82f6";

export const apiUrl = "https://taxi-map-api.vercel.app";
