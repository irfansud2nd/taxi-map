import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InputFilter, PaymentFilter } from "./InputFilter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TripTable from "./tables/TripTable";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSearchResultTrips } from "@/lib/redux/TripSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Filter = {
  bottom: number | string;
  top: number | string;
  active: boolean;
};

export type PaymentType = "CSH" | "CRD";

const ManageTrips = () => {
  const [time, setTime] = useState<Filter>({
    bottom: 0,
    top: 0,
    active: false,
  });
  const [fare, setFare] = useState<Filter>({
    bottom: 0,
    top: 0,
    active: false,
  });
  const [distance, setDistance] = useState<Filter>({
    bottom: 0,
    top: 0,
    active: false,
  });
  const [paymentType, setPaymentType] = useState<PaymentType[]>(["CSH", "CRD"]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const limit = 5;

  const handleSubmit = async () => {
    try {
      let url = import.meta.env.VITE_API_URL;
      console.log({ url });

      // ADD INDEX
      url += `?index=${page * limit - limit},${page * limit - 1}`;

      // ADD PAYMENT TYPES
      url += `&paymentType=${paymentType.join(",")}`;

      // ADD PICKUP TIME
      if (time.active) {
        url += `&pickupTime=${time.bottom},${time.top}`;
      }

      // ADD FARE
      if (fare.active) {
        url += `&fare=${fare.bottom},${fare.top}`;
      }

      // ADD DISTANCE
      if (distance.active) {
        url += `&distance=${distance.bottom},${distance.top}`;
      }
      setLoading(true);
      const result = await axios.get(url);

      dispatch(setSearchResultTrips(result.data.data));
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [page]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Manage Trips</Button>
      </SheetTrigger>
      <SheetContent side={"top"} className="overflow-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Manage Trips</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="add" className="w-full mt-1">
          <TabsList className="w-full">
            <TabsTrigger value="add">Add Trip</TabsTrigger>
            <TabsTrigger value="displayed">Displayed Trip</TabsTrigger>
          </TabsList>
          <TabsContent value="add">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Filter</AccordionTrigger>
                <AccordionContent className="pb-2 px-1">
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <InputFilter
                      value={time}
                      setValue={setTime}
                      label="Pickup Time"
                      type="date"
                    />
                    <InputFilter
                      value={fare}
                      setValue={setFare}
                      label="Fare"
                      type="number"
                    />
                    <InputFilter
                      value={distance}
                      setValue={setDistance}
                      label="Distance"
                      type="number"
                    />
                    <div className="flex border-b pb-1">
                      <PaymentFilter
                        value={paymentType}
                        setValue={setPaymentType}
                        type="CRD"
                      />
                      <PaymentFilter
                        value={paymentType}
                        setValue={setPaymentType}
                        type="CSH"
                      />
                    </div>
                    <Button
                      size={"sm"}
                      className="w-fit ml-auto"
                      disabled={loading}
                    >
                      {loading ? "Searching..." : "Search"}
                    </Button>
                  </form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {loading ? (
              <p className="w-full text-center my-2">Searching data...</p>
            ) : (
              <>
                <TripTable />
                <div className="flex gap-x-2 justify-center items-center">
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    disabled={page === 1}
                    onClick={() => {
                      setPage((prev) => prev - 1);
                    }}
                  >
                    <ChevronLeft />
                  </Button>
                  <p>Page {page}</p>
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => {
                      setPage((prev) => prev + 1);
                    }}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="displayed">
            <TripTable active />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default ManageTrips;
