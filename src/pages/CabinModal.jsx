import { useState } from "react";
import CabinForm from "../features/cabins/CabinForm";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function CabinModal() {
  const [showCabinModal, setShowCabinModal] = useState(false);
  return (
    <div>
      <Button onClick={() => setShowCabinModal((s) => !s)}>add cabin</Button>
      {showCabinModal && (
        <Modal onClose={() => setShowCabinModal(false)}>
          <CabinForm onClose={() => setShowCabinModal(false)}/>
        </Modal>
      )}
    </div>
  );
}
