import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TripToDisplay, defaultColor } from "@/lib/constants";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { ChromePicker } from "react-color";
import { addActiveTrips } from "@/lib/redux/TripSlice";
import { useDispatch } from "react-redux";

type Props = {
  type: "add" | "edit";
  trip: TripToDisplay;
};

const AddTripDialog = ({ type, trip }: Props) => {
  const dispatch = useDispatch();
  const [label, setLabel] = useState(trip.customLabel || "");
  const [color, setColor] = useState(trip.color || defaultColor);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    dispatch(addActiveTrips([{ ...trip, customLabel: label, color }]));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} className="capitalize ">
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">{type} Trip</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-y-2"
        >
          <Label>Label</Label>
          <Input
            type="text"
            placeholder="Type your custom label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Label>Color</Label>
          <ChromePicker
            color={color}
            onChangeComplete={(color) => setColor(color.hex)}
          />

          <Button size={"sm"} className="w-fit ml-auto">
            {type == "add" ? "Add" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddTripDialog;
