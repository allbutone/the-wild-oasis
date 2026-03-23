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
import { useCheckinBooking } from "./useCheckinBooking";
import { useSettings } from "../settings/useSettings";

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
  const {
    isLoading: isLoadingSettings,
    data: settings = {}, // 指定初始值为  {}, 否则初始值为 undefined 时会造成解构报错
    isError: isSettingError,
    error: settingError,
  } = useSettings();

  // 记录 customer 是否已经付款
  // total price = cabinPrice(人数*每晚价格) + extrasPrice(人数*多少晚*早餐价格)
  const [confirmPaid, setConfirmPaid] = useState(false);

  // 记录 customer 是否需要订早餐
  const [needBreakfast, setNeedBreakfast] = useState(false);

  const { checkin, isCheckingIn, isCheckinError, checkInError } =
    useCheckinBooking();

  // 当 booking 加载完毕后, 需要:
  // 1. 将 state 'confirmPaid' 和 booking.isPaid 进行同步
  // 2. 将 state 'needBreakfast' 和 booking.hasBreakfast 进行同步
  useEffect(() => {
    // booking is undefined when initially mounted
    if (booking) {
      setConfirmPaid(booking.isPaid); // 勾选 "has paid" checkbox
      setNeedBreakfast(booking.hasBreakfast); // 勾选 "order breakfast" checkbox
    }
  }, [booking]);

  if (isLoading || isLoadingSettings) {
    return <Spinner />;
  }

  // destruction 的缺点:
  // 使用 `booking.numGuests` 更清楚归属关系
  // 但使用 destructure 出来的 `numGuests` 就不知道来自哪里了
  const totalPriceForBreakfast =
    settings.breakfastPrice * booking.numGuests * booking.numNights;

  function handleCheckin() {
    // 付款后才能 checkin
    if (confirmPaid) {
      const commonUpdate = {
        isPaid: true, // 已经付款才能 checkin, 因此 isPaid 需要更新为 true
        status: "checked-in",
      };
      if (!booking.hasBreakfast && needBreakfast) {
        // 如果之前没有预订早饭, 但现在(checkin 时)预订了
        checkin({
          bookingId: booking.id,
          fieldsToUpdate: {
            // cabinPrice: booking.cabinPrice, // cabin 费用不变, 无需更新
            extrasPrice: totalPriceForBreakfast, // 更新早饭费用
            hasBreakfast: true,
            totalPrice: booking.cabinPrice + totalPriceForBreakfast, // 更新总费用
            ...commonUpdate,
          },
        });
      } else {
        checkin({ bookingId: booking.id, fieldsToUpdate: { ...commonUpdate } });
      }
    }
  }

  return (
    <>
      <StyledRow type="horizontal">
        <Heading as="h1">Check in booking #{booking.id}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </StyledRow>

      <BookingDataBox booking={booking} />

      <Checkbox
        id="breakfast"
        checked={needBreakfast}
        onChange={() => {
          // 如果 booking.hasBreakfast 是 true, 那么 needBreakfast 为 true, "order breakfast" checkbox 默认是无法勾选的
          // 如果 booking.hasBreakfast 为 false, 那么 needBreakfast 为 false, "order breakfast" checkbox 可以勾选
          //     此时 "order breakfast" checkbox 在 on change 时, 需要将 needBreakfast 设置为 true
          setNeedBreakfast(true);
          // 之后需要将 "has paid" checkbox 反选, 以便确认 customer 支付的价格包含了 breakfast
          setConfirmPaid(false);
        }}
        disabled={needBreakfast}
      >
        order breakfast for {formatCurrency(totalPriceForBreakfast)} (
        {formatCurrency(settings.breakfastPrice)} * {booking.numGuests}guests *{" "}
        {booking.numNights}nights)
      </Checkbox>
      <Checkbox
        id="confirm"
        checked={confirmPaid}
        onChange={() => setConfirmPaid((v) => !v)}
        disabled={confirmPaid}
      >
        customer {booking.guests.fullName} has paid{" "}
        {needBreakfast
          ? `${formatCurrency(booking.cabinPrice + totalPriceForBreakfast)} for cabin ${formatCurrency(booking.cabinPrice)} and breakfast ${formatCurrency(totalPriceForBreakfast)}`
          : `${formatCurrency(booking.cabinPrice)} (for cabin)`}
      </Checkbox>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{booking.id}
        </Button>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
