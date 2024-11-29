import { Filter, PaymentType } from "./ManageTrips";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const InputFilter = ({
  value,
  setValue,
  label,
  type,
}: {
  value: Filter;
  setValue: React.Dispatch<React.SetStateAction<Filter>>;
  label: string;
  type: "number" | "date";
}) => {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <Checkbox
          checked={value.active}
          onCheckedChange={(value) =>
            setValue((prev) => ({ ...prev, active: !!value }))
          }
        />
        <Label>{label}</Label>
      </div>
      <div className="flex items-center pb-1 border-b">
        <Input
          type={type}
          placeholder="Start"
          required={value.active}
          value={value.bottom}
          min={type == "date" ? "2014-01-01" : undefined}
          max={type == "date" ? "2014-12-31" : undefined}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, bottom: e.target.value }))
          }
        />
        <span className="mx-2">-</span>
        <Input
          type={type}
          placeholder="Finish"
          required={value.active}
          value={value.top}
          min={
            type == "date"
              ? "2014-01-01"
              : value.active
              ? Number(value.bottom) + 1
              : undefined
          }
          max={type == "date" ? "2014-12-31" : undefined}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, top: e.target.value }))
          }
        />
      </div>
    </>
  );
};

const PaymentFilter = ({
  value,
  setValue,
  type,
}: {
  value: PaymentType[];
  setValue: React.Dispatch<React.SetStateAction<PaymentType[]>>;
  type: PaymentType;
}) => {
  return (
    <div className="flex items-center">
      <Checkbox
        className="mr-2"
        checked={value.includes(type)}
        onCheckedChange={(value) =>
          value
            ? setValue((prev) => [...prev, type])
            : setValue((prev) => prev.filter((item) => item !== type))
        }
        required={value.length === 0}
      />
      <Label className="mr-2">{type == "CRD" ? "Credit" : "Cash"}</Label>
    </div>
  );
};

export { InputFilter, PaymentFilter };
