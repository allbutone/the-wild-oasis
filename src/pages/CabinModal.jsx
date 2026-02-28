import CabinForm from "../features/cabins/CabinForm";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function CabinModal() {
  return (
    <>
      <Modal>
        {/* modal launch button 默认显示 */}
        {/* modal launch button 负责 launch modal content */}
        <Modal.LaunchButton>
          {/* custom modal launch button */}
          <Button variation="primary">add cabin</Button>
        </Modal.LaunchButton>
        {/* modal content 默认不显示 */}
        <Modal.Content>
          {/* custom modal content */}
          <CabinForm />
        </Modal.Content>
      </Modal>
    </>
  );
}
