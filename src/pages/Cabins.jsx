import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import CabinModal from "./CabinModal";
import Filter from "../ui/Filter";
import Sort from "../ui/Sort";

function Cabins() {
  return (
    <>
      <StyledRow type="horizontal">
        <Heading as="h1">All cabins</Heading>
        {/* <p>filter / sort</p> */}
        <Filter
          fieldName={"discount"}
          options={[
            { value: "all", label: "All", default: true },
            { value: "with-discount", label: "With Discount" },
            { value: "no-discount", label: "No Discount" },
          ]}
        />
        <Sort
          options={[
            { value: "name-asc", label: "sort by name, asc" },
            { value: "name-desc", label: "sort by name, desc" },
            { value: "maxCapacity-asc", label: "sort by maxCapacity, asc" },
            { value: "maxCapacity-desc", label: "sort by maxCapacity, desc" },
            { value: "regularPrice-asc", label: "sort by regularPrice, asc" },
            { value: "regularPrice-desc", label: "sort by regularPrice, desc" },
            { value: "discount-asc", label: "sort by discount, asc" },
            { value: "discount-desc", label: "sort by discount, desc" },
          ]}
        />
      </StyledRow>
      <StyledRow type="vertical">
        <CabinTable />
        <CabinModal />
      </StyledRow>
    </>
  );
}

export default Cabins;
