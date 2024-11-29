export const formatDate = (inputDate: number | string) => {
  const formattedDate = new Date(inputDate);
  const date = formattedDate.getDate().toString().padStart(2, "0");
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
  let year = formattedDate.getFullYear().toString();

  const hour = formattedDate.getHours().toString().padStart(2, "0");
  const minute = formattedDate.getMinutes().toString().padStart(2, "0");

  let result = `${date} ${month} ${year}, ${hour}:${minute}`;

  return result;
};

export const countDuration = (pickup: string, dropoff: string) => {
  const pickupTime = new Date(pickup).getTime();
  const dropoffTime = new Date(dropoff).getTime();

  return Math.round((dropoffTime - pickupTime) / (1000 * 60));
};

export const roundDecimal = (value: string | number) => {
  return Number(value).toFixed(2);
};
