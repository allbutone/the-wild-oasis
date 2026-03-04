import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import CabinModal from "./CabinModal";
import Filter from "../ui/Filter";
import { useSearchParams } from "react-router-dom";

function Cabins() {
  return (
    <>
      <StyledRow type="horizontal">
        <Heading as="h1">All cabins</Heading>
        {/* <p>filter / sort</p> */}
        <Filter />
      </StyledRow>
      <StyledRow type="vertical">
        <CabinTable />
        <CabinModal />
      </StyledRow>
    </>
  );
}

export default Cabins;
