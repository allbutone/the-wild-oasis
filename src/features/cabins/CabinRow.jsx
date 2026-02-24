import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { delCabin } from "../../services/apiCabins.js";
import toast from "react-hot-toast";

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;
// toaster div 默认是 fixed 定位的, 因此其内的 toast div 可以使用 absolute 定位如下:
const StyledCloseButton = styled.span`
  position: absolute;
  top: -.5rem;
  right: -.5rem;
  border-radius: 50%;
  height: 2rem;
  width: 2rem;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  color: var(--color-grey-700);
  background-color: var(--color-grey-200);

  &:hover {
    color: var(--color-grey-200);
    background-color: var(--color-red-700);
  }
`;

export default function CabinRow({ cabin }) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: delCabin,
    onSuccess: (val) => {
      toast.success(`删除成功, 返回的结果是: ${val}`); // 测试可知: val 是 delCabin 的 return value
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err) => {
      // toast.error(`删除失败, 报错信息是: ${err.message}`);
      // 下面是带 dismiss 按钮的 toast
      toast((t) => (
        <span>
          oops! error occurred: <b>{err.message}</b>
          <StyledCloseButton onClick={() => toast.dismiss(t.id)}>
            &times;
          </StyledCloseButton>
        </span>
      ));
    },
  });
  return (
    <TableRow>
      <Img src={cabin.image} />
      <Cabin>{`id/${cabin.id}-name/${cabin.name}`}</Cabin>
      <div>{cabin.maxCapacity}</div>
      <Price>{formatCurrency(cabin.regularPrice)}</Price>
      <Discount>{formatCurrency(cabin.discount)}</Discount>
      <button onClick={() => mutate(cabin.id)} disabled={isPending}>
        delete
      </button>
    </TableRow>
  );
}
