import StyledForm from "../../ui/StyledForm";
import { StyledFormRow } from "../../ui/StyledFormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useSettings } from "./useSettings";
import { StyledFormLabel } from "../../ui/StyledFormLabel";
import { useUpdateSetting } from "./useUpdateSetting";
import toast from "react-hot-toast";
import { useRef, useState } from "react";

function UpdateSettingsForm() {
  const {
    isLoading,
    data = {}, // 指定初始值为  {}, 否则初始值为 undefined 时会造成解构报错
    isError,
    error,
  } = useSettings();
  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = data;

  const { isPending, mutate } = useUpdateSetting();
  const [changedField, setChangedField] = useState(null); // 哪个字段被修改了

  if (isLoading) return <Spinner />;

  function handleBlur(e, fieldName) {
    const fieldValue = e.target.value;
    // 如果 field value 并未发生修改, 什么都不做, 直接 return;
    if (String(data[fieldName]) === e.target.value) {
      return;
    }
    setChangedField(fieldName);
    mutate({ [fieldName]: fieldValue }, {onSettled: () => setChangedField(null)});
  }
  return (
    <StyledForm>
      <StyledFormRow>
        <StyledFormLabel htmlFor="min-nights">
          Minimum nights/booking
        </StyledFormLabel>
        <Input
          type="number"
          id="min-nights"
          defaultValue={minBookingLength}
          disabled={changedField === "minBookingLength" && isPending}
          onBlur={(e) => handleBlur(e, "minBookingLength")}
        />
        {changedField === "minBookingLength" && (
          <FieldChangeStatus changedField={changedField} />
        )}
      </StyledFormRow>
      <StyledFormRow>
        <StyledFormLabel htmlFor="max-nights">
          Maximum nights/booking
        </StyledFormLabel>
        <Input
          type="number"
          id="max-nights"
          defaultValue={maxBookingLength}
          disabled={changedField === "maxBookingLength" && isPending}
          onBlur={(e) => handleBlur(e, "maxBookingLength")}
        />
        {changedField === "maxBookingLength" && (
          <FieldChangeStatus changedField={changedField} />
        )}
      </StyledFormRow>
      <StyledFormRow>
        <StyledFormLabel htmlFor="max-guests">
          Maximum guests/booking
        </StyledFormLabel>
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxGuestsPerBooking}
          disabled={changedField === "maxGuestsPerBooking" && isPending}
          onBlur={(e) => handleBlur(e, "maxGuestsPerBooking")}
        />
        {changedField === "maxGuestsPerBooking" && (
          <FieldChangeStatus changedField={changedField} />
        )}
      </StyledFormRow>
      <StyledFormRow>
        <StyledFormLabel htmlFor="breakfast-price">
          Breakfast price
        </StyledFormLabel>
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          disabled={changedField === "breakfastPrice" && isPending}
          onBlur={(e) => handleBlur(e, "breakfastPrice")}
        />
        {changedField === "breakfastPrice" && (
          <FieldChangeStatus changedField={changedField} />
        )}
      </StyledFormRow>
    </StyledForm>
  );
}
function FieldChangeStatus({ changedField }) {
  return <span>{changedField ? "saving..." : "nothing changed..."}</span>;
}
export default UpdateSettingsForm;
