import { useEffect } from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { getCabins } from "../services/apiCabins.js";
import CabinTable from "../features/cabins/CabinTable";

function Cabins() {
  // useEffect(() => {
  //   getCabins().then((cabins) => console.log(cabins));
  // }, []);
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <p>filter / sort</p>
      </Row>
      <Row type="horizontal">
        <CabinTable />
      </Row>
    </>
  );
}

export default Cabins;
