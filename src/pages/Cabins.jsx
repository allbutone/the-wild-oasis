import { useEffect } from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { getCabins } from "../services/cabinOperations";

function Cabins() {
  useEffect(() => {
    getCabins().then((cabins) => console.log(cabins));
  }, []);
  return (
    <Row type="horizontal">
      <Heading as="h1">All cabins</Heading>
      <p>TEST</p>
      <img src="https://zzudlfaityyrmtxwajxy.supabase.co/storage/v1/object/sign/cabin-images/cabin-001.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMmFlYzY2OC03ODVkLTQ0ZDEtYTNmNi01MmUzZjNkZWM3ODIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjYWJpbi1pbWFnZXMvY2FiaW4tMDAxLmpwZyIsImlhdCI6MTc3MTA1ODE0NiwiZXhwIjoxODAyNTk0MTQ2fQ.1UXMRz0f0DsvzPP_p-Q0YKuOG3DT3B_ibVTC6ezHWbg" />
    </Row>
  );
}

export default Cabins;
