import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import CabinForm from "./CabinForm";
import { useDelCabin } from "./useDelCabin";
import toast from "react-hot-toast";
import {
  HiEllipsisVertical,
  HiPencil,
  HiSquare2Stack,
  HiTrash,
} from "react-icons/hi2";
import { useCreateOrUpdateCabin } from "./useCreateOrUpdateCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

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
    //  根据文档: https://tanstack.com/query/v4/docs/framework/react/reference/useMutation
    //  mutate(variabled, options) 返回值为 void, 并没有返回想要的 promise
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
    <Table.Row>
      {/* column1 */}
      <Img src={image} />
      {/* column2 */}
      <Cabin>{`${name}(${id})`}</Cabin>
      {/* column3 */}
      <div>{maxCapacity}</div>
      {/* column4 */}
      <Price>{formatCurrency(regularPrice)}</Price>
      {/* column5 */}
      <Discount>{formatCurrency(discount)}</Discount>
      {/* column6 */}
      {/* 只有 6 columns, 因此这些 buttons 就只好合并到一个 column 中了 */}
      <div>
        <Menus.LaunchButton id={cabin.id}>
          <HiEllipsisVertical />
        </Menus.LaunchButton>
        <Modal>
          <Menus.MenuList id={cabin.id}>
            <Menus.Menu onClick={handleDuplicate}>
              <HiSquare2Stack />
              <span>copy</span>
            </Menus.Menu>
            {/* 使用 Menus.Menu 充当 Modal.LaunchButton 才能打开 Modal.Content */}
            {/* 为此需要将 Menus.Menu 放在 Modal 下, 这样才能通过 ModalContext 切换 Modal.Content */}
            <Modal.LaunchButton launches="cabin-form">
              <Menus.Menu>
                <HiPencil />
                <span>edit</span>
              </Menus.Menu>
            </Modal.LaunchButton>
            <Modal.LaunchButton launches="cabin-delete-confirm">
              <Menus.Menu>
                <HiTrash />
                <span>delete</span>
              </Menus.Menu>
            </Modal.LaunchButton>
          </Menus.MenuList>
          <Modal.Content name="cabin-form">
            {/* 传入 props 'cabin', CabinForm 内的 form 在提交时会执行 update 操作 */}
            {/* 不传 props 'cabin', CabinForm 内的 form 在提交时会执行 save 操作 */}
            {/* Modal.Content 为自己的 children (即这里的 CabinForm) 注入了 props 'onClose' 用于关闭 Modal.Content */}
            {/* 在 CabinForm 内, 如果有 props 'onClose', 会这么处理: */}
            {/* 1. form submit 后, 会执行 onClose() */}
            {/* 2. form cancel 会直接执行 onClose() */}
            <CabinForm cabin={cabin} />
          </Modal.Content>
          <Modal.Content name="cabin-delete-confirm">
            {/* ConfirmDelete 是 starter code 提供的 */}
            {/* Modal.Content 为 children (即这里的 ConfirmDelete) 注入了 props 'onClose' 用于关闭 Modal.Content, ConfirmDelete 内可以按需调用 */}
            {/* 按理说, 应该将 handleDel 挪到 ConfirmDelete 内, 这样当 user confirm 后, ConfirmDelete 会执行 handleDel() */}
            {/* handlDel 所调用的 mutate, 其 onSucess 内可以 onClose(), 就可以实现 delete cabin -> close modal 的顺序执行 */}
            {/* 不过, 观察后发现, 其实不需要这么做, 因为 user confirm 后, 执行 handleDel() 后, cabin row 不存在了 */}
            {/* 其内的 Modal 也就随之消失, 实现了 "Modal 在 delete cabin 后自动关闭" 的效果 */}
            <ConfirmDelete onConfirm={handleDel} disabled={isDeleting} />
          </Modal.Content>
        </Modal>
      </div>
    </Table.Row>
  );
}
