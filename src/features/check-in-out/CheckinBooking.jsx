import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import StyledRow from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import useBooking from "../bookings/useBooking";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";
import Checkin from "../../pages/Checkin";
import Checkbox from "../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import { useCheckin } from "./useCheckin";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  const { isLoading, booking, isError, error } = useBooking();

  // state associated with controlled checkbox
  const [confirmPaid, setConfirmPaid] = useState(false);

  const {checkin, isCheckingIn, isCheckingError, checkInError} = useCheckin();

  // 当 booking 加载完毕后, 需要将 state 'confirmPaid' 和 booking.isPaid 进行同步
  useEffect(() => {
    // 当 component mount 的时候, 会执行一次 setup fn, 此时 booking 依然是 undefined
    if (booking) {
      setConfirmPaid(booking.isPaid);
    }
  }, [booking]);

  if (isLoading) {
    return <Spinner />;
  }

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  function handleCheckin() {
    checkin(booking.id);
  }

  return (
    <>
      <StyledRow type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </StyledRow>

      <BookingDataBox booking={booking} />
      <Checkbox
        id="confirm"
        checked={confirmPaid}
        onChange={() => setConfirmPaid((v) => !v)}
        disabled={confirmPaid}
      >
        customer {guests.fullName} has paid {formatCurrency(totalPrice)}
      </Checkbox>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
