import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import StyledRow from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useNavigate, useParams } from "react-router-dom";
import useBooking from "./useBooking";
import Spinner from "../../ui/Spinner";
import { statusToColor } from "./constants";
import { useCheckout } from "../check-in-out/useCheckout";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const navigate = useNavigate();
  const { isLoading, booking, isError, error } = useBooking();
  const moveBack = useMoveBack();
  const {
    isCheckingOut,
    checkout,
    isCheckoutError,
    checkoutError,
    checkoutResult,
  } = useCheckout();

  if (isLoading) {
    return <Spinner />;
  }

  const { id, status } = booking;

  return (
    <>
      <StyledRow type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{id}</Heading>
          <Tag color={statusToColor[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </StyledRow>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button
            variation="primary"
            onClick={() => navigate(`/checkin/${id}`)}
          >
            Go To Checkin
          </Button>
        )}
        {status === "checked-in" && (
          <Button variation="primary" onClick={() => checkout(id)} disabled={isCheckingOut}>
            <span>check out</span>
          </Button>
        )}
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
