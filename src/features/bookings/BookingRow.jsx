import styled from "styled-components";
import { format, isToday } from "date-fns";

import StyledSpan from "../../ui/Span";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import Menus from "../../ui/Menus";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEllipsisHorizontal,
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { statusToColor } from "./constants";
import { useCheckoutBooking } from "../check-in-out/useCheckoutBooking";
import { useDeleteBooking } from "../check-in-out/useDeleteBooking";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function BookingRow({
  booking: {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
}) {
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
  const navigate = useNavigate();
  // map status to color, status 只能是 'unconfirmed'/'checked-in'/'checked-out'

  return (
    <>
      {/* column1 */}
      <Cabin>
        {cabinName}(id:{bookingId})
      </Cabin>

      {/* column2 */}
      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      {/* column3 */}
      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      {/* column4 */}
      {/* Tag 是一个 styled component, 会根据 props 'color' 来展示 status 对应的 color */}
      <StyledSpan color={statusToColor[status]}>{status.replace("-", " ")}</StyledSpan>

      {/* column5 */}
      <Amount>{formatCurrency(totalPrice)}</Amount>

      {/* column6 */}
      <Menus.LaunchButton id={bookingId}>
        <HiEllipsisHorizontal />
      </Menus.LaunchButton>
      <Modal>
        <Menus.MenuList id={bookingId}>
          <Menus.Menu onClick={() => navigate(`/bookings/${bookingId}`)}>
            <HiEye />
            <span>show details</span>
          </Menus.Menu>
          {/* 只有 status 为 unconfirmed 的 booking 可以被 check in
          其他(checked-in 和 checked-out) 都是不可以 办理 checkin 的 */}
          {status === "unconfirmed" && (
            <Menus.Menu onClick={() => navigate(`/checkin/${bookingId}`)}>
              <HiArrowDownOnSquare />
              <span>check in</span>
            </Menus.Menu>
          )}
          {status === "checked-in" && (
            <Menus.Menu onClick={() => checkout(bookingId)}>
              <HiArrowUpOnSquare />
              <span>check out</span>
            </Menus.Menu>
          )}
          {status === "checked-out" && (
            <Modal.LaunchButton launches={"confirm-delete-booking"}>
              {/* 不要为 Menu 指定 onClick, 因为 Menu 充当 Modal.LaunchButton 的 children */}
              {/* 而 Modal.LaunchButton 会为 children (即 Menu) 注入 props 'onClick' 来打开 launches 对应的 Modal.Content */}
              <Menus.Menu>
                <HiTrash />
                <span>delete</span>
              </Menus.Menu>
            </Modal.LaunchButton>
          )}
        </Menus.MenuList>
        {/* 不要将 Modal.Content 定义在 MenuList 内 */}
        {/* 否则, Menu 的 onClick 会执行 props 'onClick' 之后 close MenuList, 导致 MenuList 内的 Modal.Content 随之消失 */}
        {/* 那么 Modal.LaunchButton (由 Menu 充当) 就无法正常打开 Modal.Content */}
        {/* Modal.Content 定义在 MenuList 之外, 意味着 Modal 也得定义到 Modal 外 */}
        <Modal.Content name={"confirm-delete-booking"}>
          {/* Modal.Content 为其 children 注入了 props 'onClose' 来关闭 Modal.Content */}
          {/* 因此 ConfirmDelete 没必要指定 props 'onClose' */}
          <ConfirmDelete onConfirm={() => deleteBooking(bookingId)} />
        </Modal.Content>
      </Modal>
    </>
  );
}

export default BookingRow;
