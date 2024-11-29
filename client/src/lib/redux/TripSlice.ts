import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaxiTripWithRoute, TripToDisplay } from "../constants";

const reduceData = <T extends Record<string, any>>(
  data: T[],
  key: keyof T = "id"
): T[] => {
  const reducedData = Object.values(
    data.reduce((acc, obj) => {
      acc[obj[key]] = obj;
      return acc;
    }, {} as Record<string, T>)
  );
  return reducedData;
};

const initialState: {
  active: TripToDisplay[];
  searchResult: TaxiTripWithRoute[];
} = {
  active: [],
  searchResult: [],
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    addActiveTrips: (state, action: PayloadAction<TripToDisplay[]>) => {
      let data = reduceData([...state.active, ...action.payload]);
      state.active = data;
    },
    removeActiveTrips: (state, action: PayloadAction<number[]>) => {
      state.active = state.active.filter(
        (item) => !action.payload.includes(item.id)
      );
    },
    setSearchResultTrips: (
      state,
      action: PayloadAction<TaxiTripWithRoute[]>
    ) => {
      state.searchResult = action.payload;
    },
  },
});

export const { addActiveTrips, removeActiveTrips, setSearchResultTrips } =
  tripSlice.actions;

export default tripSlice.reducer;
