import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import CabinModal from "./CabinModal";

function Cabins() {
  return (
    <>
      <StyledRow type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <p>filter / sort</p>
      </StyledRow>
      <StyledRow type="vertical">
        <CabinTable />
        <CabinModal />
      </StyledRow>
    </>
  );
}

export default Cabins;
