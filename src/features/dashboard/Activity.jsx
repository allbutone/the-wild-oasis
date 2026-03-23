import styled from "styled-components";
import Span from "../../ui/Span";
import { FlagImg } from "../../ui/FlagImg";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
import CheckoutButton from "../check-in-out/CheckoutButton";
import { useCheckoutBooking } from "../check-in-out/useCheckoutBooking";

const StyledActivity = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const GuestDiv = styled.div`
  font-weight: 500;
`;

export default function Activity({ booking }) {
  const {
    isCheckingOut,
    checkout,
    isCheckoutError,
    checkoutError,
    checkoutResult,
  } = useCheckoutBooking();

  console.log(`activity:`, booking);
  const { id, status, guests, numNights } = booking;
  return (
    <StyledActivity>
      {/* 第一列: 状态, 即将签到/即将签出 */}
      {status === "unconfirmed" && <Span>Arriving</Span>}
      {status === "checked-in" && <Span>Departing</Span>}
      {/* 第二列: 展示 guest 的 country flag */}
      <FlagImg src={guests.countryFlag} alt={`flag of ${guests.countryFlag}`} />
      {/* 第三列: 展示 guest 的 fullName */}
      <GuestDiv>{guests.fullName}</GuestDiv>
      {/* 第四列: guest 住了多少晚 */}
      <div>{numNights} nights</div>
      {/* 第五列: 对应的签到/签出操作按钮 */}
      {/* 如果是签到的话, <Button> 会渲染为一个 <button>, 得通过 onClick 来实现签到*/}
      {/* 但我们已经有了 route "checkin/:bookingId" 可以复用 */}
      {/* 为此, 需要让 <button> 变成一个 react router 的 <Link> 才行 */}
      {/* 此时使用 Styled Component 的好处就凸显了, 可以添加 props 'as' */}
      {/* 将其变身为 Link, 之后就可以使用 Link 的 props 'to' 来实现 route 跳转了 */}
      {status === "unconfirmed" && (
        <Button
          size="small"
          variation="primary"
          as={Link}
          to={`/checkin/${id}`}
        >
          Check in
        </Button>
      )}
      {status === "checked-in" && (
        <Button
          size="small"
          $variation="primary"
          onClick={() => checkout(id)}
          disabled={isCheckingOut}
        >
          <span>check out</span>
        </Button>
      )}
    </StyledActivity>
  );
}
