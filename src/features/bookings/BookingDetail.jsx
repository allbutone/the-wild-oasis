import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import StyledRow from "../../ui/Row";
import Heading from "../../ui/Heading";
import StyledSpan from "../../ui/Span";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useNavigate, useParams } from "react-router-dom";
import useBooking from "./useBooking";
import Spinner from "../../ui/Spinner";
import { statusToColor } from "./constants";
import { useCheckoutBooking } from "../check-in-out/useCheckoutBooking";
import { useDeleteBooking } from "../check-in-out/useDeleteBooking";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

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
  } = useCheckoutBooking();

  const {
    isDeleting,
    del: deleteBooking,
    isDeleteError,
    deleteError,
    deleteResult,
  } = useDeleteBooking();

  if (isLoading) {
    return <Spinner />;
  }

  const { id, status } = booking;

  return (
    <>
      <StyledRow type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{id}</Heading>
          <StyledSpan color={statusToColor[status]}>{status.replace("-", " ")}</StyledSpan>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </StyledRow>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button
            $variation="primary"
            onClick={() => navigate(`/checkin/${id}`)}
          >
            Go To Checkin
          </Button>
        )}
        {status === "checked-in" && (
          <Button
            $variation="primary"
            onClick={() => checkout(id)}
            disabled={isCheckingOut}
          >
            <span>check out</span>
          </Button>
        )}
        {/* 只有 status 为 checked-out 的 booking 才可以被删除 */}
        {status === "checked-out" && (
          <Modal>
            <Modal.LaunchButton launches="confirm-delete-booking">
              {/* Modal.LaunchButton 为其 children 注入了 props 'onClick' 来打开 launches 指定的 Modal.Content */}
              <Button $variation="primary" disabled={isDeleting}>
                <span>delete</span>
              </Button>
            </Modal.LaunchButton>
            <Modal.Content name={"confirm-delete-booking"}>
              {/* Modal.Content 为其 children 注入了 props 'onClose' 来关闭 Modal.Content */}
              {/* 因此 ConfirmDelete 没必要指定 props 'onClose' */}
              <ConfirmDelete
                onConfirm={() => deleteBooking(id, { onSettled: moveBack })}
              />
            </Modal.Content>
          </Modal>
        )}
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
