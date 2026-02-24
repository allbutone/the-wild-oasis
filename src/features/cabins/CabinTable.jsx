import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getCabins } from "../../services/apiCabins.js";
import CabinRow from "./CabinRow.jsx";
import Spinner from "../../ui/Spinner.jsx";

const Table = styled.div`
  flex-grow: 1;
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

export default function CabinTable() {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins, // queryFn 是一个 return value 为 promise 的 function
  });
  if (isLoading) {
    return <Spinner></Spinner>
  }
  if (isError) {
    return <div>error occurred {error.message}</div>;
  }
  return (
    // role: div as a table
    <Table role="table">
      {/* header as table header */}
      <TableHeader role="row">
        {/* TableHeader 指定了 6 columns */}
        {/* first column 是 cabin thumbnail */}
        <div></div>
        <div>cabin_name</div>
        <div>capacity</div>
        <div>price</div>
        <div>discount</div>
        <div></div>
      </TableHeader>
      {data.map((cabin) => (
        <CabinRow cabin={cabin} key={cabin.id}></CabinRow>
      ))}
    </Table>
  );
}
