import CabinForm from "../features/cabins/CabinForm";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import CabinTable from "../features/cabins/CabinTable";

export default function CabinModal() {
  return (
    <div>
      <Modal>
        {/* modal launch button 默认显示 */}
        {/* modal launch button 负责 launch modal content */}
        <Modal.LaunchButton launches="cabin-form">
          {/* custom modal launch button */}
          <Button variation="primary">add cabin</Button>
        </Modal.LaunchButton>
        {/* modal content 默认不显示 */}
        <Modal.Content name="cabin-form">
          {/* custom modal content */}
          {/* props 'cabin' 需要传入 */}
          {/* props 'onClose' 不需要传入, 因为 Modal.Content 内部通过 cloneElement 为 CabinForm 注入了 onClose, props 'onClose' 是有值的 */}
          <CabinForm />
        </Modal.Content>

        {/* Modal 支持指定多组  */}
        {/* modal launch button + modal content */}
        {/* shows: which modal content to show */}
        {/* 测试如下: */}
        {/* 
        <Modal.LaunchButton shows="cabin-table">
          <Button variation="primary">show cabins</Button>
        </Modal.LaunchButton>
        <Modal.Content name="cabin-table">
          <CabinTable />
        </Modal.Content> 
        */}
      </Modal>
    </div>
  );
}
