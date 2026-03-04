import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import CabinModal from "./CabinModal";
import Filter from "../ui/Filter";

function Cabins() {
  return (
    <>
      <StyledRow type="horizontal">
        <Heading as="h1">All cabins</Heading>
        {/* <p>filter / sort</p> */}
        <Filter fieldName={'discount'} options={[
          {value: 'all', label: 'All'},
          {value: 'with-discount', label: 'With Discount'},
          {value: 'no-discount', label: 'No Discount'},
        ]}/>
      </StyledRow>
      <StyledRow type="vertical">
        <CabinTable />
        <CabinModal />
      </StyledRow>
    </>
  );
}

export default Cabins;
