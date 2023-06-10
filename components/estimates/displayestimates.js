import Link from "next/link";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <div className="col">
      <input
        type="text"
        id="search"
        className="form-control"
        placeholder="Search By Estimate Number/Customer Name/Service Address"
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

function DisplayEstimates(props) {
  const { data } = props;
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
        fontSize: "14px",
        backgroundColor: "#436900",
        color: "#fff"
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
        borderRightColor: tableBorderColor
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
        fontSize: "14px"
      },
    },
  };

  const columns = [
    {
      selector: (row) => (
        <Link
          href={`/estimates/${row.id}:${row.estimateNumber}`}
          className="btn btn-success btn-sm"
        >
          OPEN
        </Link>
      ),
      width: "90px",
    },
    {
      name: "Estimate No.",
      sortable: true,
      selector: (row) => row.estimateNumber,
      width: "140px"
    },
    {
      name: "Customer",
      selector: (row) => row.customerDetails.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Service Address",
      selector: (row) => row.serviceAddress,
      sortable: true,
      wrap: true,
    },
    {
      name: "is Additional Copy?",
      selector: (row) => (row.relatedEstimateId) ? 'YES' : 'NO',
      wrap: true
    },
    {
      name: "Main Estimate No.",
      selector: (row) => (row.relatedEstimateId) ? (
        <Link
          href={`/estimates/${row.relatedEstimateId}:${row.relatedEstimateNumber}`}
          className="link-success"
        >
          #{row.relatedEstimateNumber}
        </Link>
      ): '',
      wrap: true
    },
    {
      name: "Additional Copies",
      selector: (row) => row.additionalCopies
      ? row.additionalCopies.map((item, i) => (
        <Link href={`/estimates/${item}`} key={i} className="link-success mb-2 d-block">#{item.split(":")[1]}</Link>
        ))
      : "",
      wrap: true,
    }

  ];

  const filteredItems = data.filter(
    (item) =>
      (item.estimateNumber &&
        item.estimateNumber.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.customerDetails.name &&
        item.customerDetails.name
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (item.serviceAddress &&
        item.serviceAddress.toLowerCase().includes(filterText.toLowerCase()))
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

export default DisplayEstimates;
