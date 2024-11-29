const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const serverless = require("serverless-http");

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const stringToArray = (string) => {
  if (!string) return [];
  return string.split(",");
};

app.get("/", async (req, res) => {
  const { index, paymentType, pickupTime, fare, distance } = req.query;

  const indexArr = index?.length ? stringToArray(index) : [0, 4];
  let getData = supabase
    .from("trips")
    .select("*")
    .range(indexArr[0], indexArr[1])
    .order("pickup_datetime", { ascending: false });

  if (paymentType?.length) {
    const paymentTypeArr = stringToArray(paymentType);
    getData = getData.in("payment_type", paymentTypeArr);
  }

  if (pickupTime?.length) {
    const pickupTimeArr = stringToArray(pickupTime);
    getData = getData
      .gte("pickup_datetime", pickupTimeArr[0] + " 00:00:00")
      .lte("pickup_datetime", pickupTimeArr[1] + " 23:59:59");
  }

  if (fare?.length) {
    const fareArr = stringToArray(fare);
    getData = getData
      .gte("fare_amount", fareArr[0])
      .lte("fare_amount", fareArr[1]);
  }

  if (distance?.length) {
    const distanceArr = stringToArray(distance);
    getData = getData
      .gte("trip_distance", distanceArr[0])
      .lte("trip_distance", distanceArr[1]);
  }

  try {
    const { data, error } = await getData;
    if (error) throw error;

    res.status(200).json({
      data: data.map((item) => ({
        ...item,
        coordinates: JSON.parse(item.coordinates),
      })),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;
