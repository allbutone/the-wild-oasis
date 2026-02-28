import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import CabinForm from "./CabinForm";
import { useDelCabin } from "./useDelCabin";
import toast from "react-hot-toast";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateOrUpdateCabin } from "./useCreateOrUpdateCabin";
import Modal from "../../ui/Modal";

const StyledCabinTableRow = styled.div`
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
  top: -0.5rem;
  right: -0.5rem;
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

export default function CabinTableRow({ cabin }) {
  const { mutate, isDeleting } = useDelCabin();
  const { mutate: createOrUpdate, isPending } = useCreateOrUpdateCabin();

  const { id, name, maxCapacity, regularPrice, discount, description, image } =
    cabin;

  function handleDuplicate() {
    createOrUpdate({
      name: `copy of ${cabin.name}`,
      maxCapacity,
      regularPrice,
      discount,
      description,
      image,
    });
  }
  function handleDel() {
    mutate(cabin.id, {
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
  }

  return (
    // StyledCabinTableRow 通过 6 column 展示 6 fields of cabin 如下
    <StyledCabinTableRow>
      {/* column1 */}
      <Img src={image} />
      {/* column2 */}
      <Cabin>{`${id}-${name}`}</Cabin>
      {/* column3 */}
      <div>{maxCapacity}</div>
      {/* column4 */}
      <Price>{formatCurrency(regularPrice)}</Price>
      {/* column5 */}
      <Discount>{formatCurrency(discount)}</Discount>
      {/* column6 */}
      {/* 只有 6 columns, 因此这两个 button 就只好合并到一个 column (由 div 充当) 中了 */}
      <div>
        <button onClick={handleDuplicate} disabled={isPending}>
          <HiSquare2Stack />
        </button>
        <Modal>
          <Modal.LaunchButton>
            <button>
              <HiPencil />
            </button>
          </Modal.LaunchButton>
          <Modal.Content>
            {/* 传入 props 'cabin', CabinForm 内的 form 在提交时会执行 update 操作 */}
            {/* 不传 props 'cabin', CabinForm 内的 form 在提交时会执行 save 操作 */}
            {/* Modal.Content 为自己的 children (即这里的 CabinForm) 注入了 props 'onClose' 用于关闭 modal */}
            {/* 在 CabinForm 内, 如果有 props 'onClose', 会这么处理: */}
            {/* 1. form submit 后, 会执行 onClose() */}
            {/* 2. form cancel 会直接执行 onClose() */}
            <CabinForm cabin={cabin} />
          </Modal.Content>
        </Modal>

        <button onClick={handleDel} disabled={isDeleting}>
          <HiTrash />
        </button>
      </div>
    </StyledCabinTableRow>
  );
}
