import Link from "next/link";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { formatPhoneNumber } from "../../utils/functions";

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <div className="col">
      <input
        type="text"
        id="search"
        className="form-control"
        placeholder="Search By Name, Email, Phone Number"
        value={filterText}
        onChange={onFilter}
      />
    </div>

    {filterText && (
      <div className="col">
        <button
          type="button"
          className="btn btn-warning btn-sm ms-2"
          onClick={onClear}
        >
          X
        </button>
      </div>
    )}
  </>
);

function DisplayCustomers(props) {
  const { customers } = props;
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const tableBorderColor = "#dee2e6";

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: tableBorderColor,
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "#436900",
        color: "#fff",
      },
    },
    headCells: {
      style: {
        "&:first-of-type": {
          borderLeftStyle: "solid",
          borderLeftWidth: "1px",
          borderLeftColor: tableBorderColor,
        },
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: tableBorderColor,
      },
    },
    cells: {
      style: {
        "&:first-of-type": {
          borderLeftStyle: "solid",
          borderLeftWidth: "1px",
          borderLeftColor: tableBorderColor,
        },
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: tableBorderColor,
        padding: "1rem",
        fontSize: "12px",
      },
    },
  };

  const columns = [
    {
      name: "",
      selector: (row) => (
        <Link href={`/customers/profile/${row.id}`} className="btn btn-success btn-sm">
          OPEN
        </Link>
      ),
      width: "90px"
    },
    {
      name: "Name",
      selector: (row) => `${row.firstname} ${row.lastname}`,
      sortable: true,
      wrap: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: "Phone",
      selector: (row) => (row.phone ? formatPhoneNumber(row.phone) : ""),
    },
    {
      name: "Service Address",
      selector: (row) =>
        row.serviceAddress
          ? row.serviceAddress.items.map((item, i) => (
              <div key={i}>
                <p>
                  <b>Address #{i + 1}</b>
                  <br />
                  {item.street}
                  <br />
                  {item.city},{item.addressState} {item.zipcode}
                </p>
              </div>
            ))
          : "",
      sortable: true,
      wrap: true,
    },
  ];

  const filteredItems = customers.filter(
    (item) =>
      (item.firstname &&
        item.firstname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.lastname &&
        item.lastname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email &&
        item.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.phone && item.phone.includes(filterText))
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <div className="data-table-customers">
      <DataTable
        columns={columns}
        data={filteredItems}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        persistTableHead
        customStyles={customStyles}
      />
    </div>
  );
}

export default DisplayCustomers;
