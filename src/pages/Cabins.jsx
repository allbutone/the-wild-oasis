import { useEffect, useState } from "react";
import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";
import { getCabins } from "../services/apiCabins.js";
import CabinTable from "../features/cabins/CabinTable";
import Button from "../ui/Button";
import CabinForm from "../features/cabins/CabinForm";

function Cabins() {
  const [showForm, setShowForm] = useState(false);
  // useEffect(() => {
  //   getCabins().then((cabins) => console.log(cabins));
  // }, []);
  return (
    <>
      <StyledRow type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <p>filter / sort</p>
      </StyledRow>
      <StyledRow type="vertical">
        <CabinTable />
        <Button onClick={() => setShowForm(s => !s)}>toggle add form</Button>
        {showForm && <CabinForm />}
      </StyledRow>
    </>
  );
}

export default Cabins;
