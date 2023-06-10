import { Fragment } from "react";
import CustomerItem from "./customer-item";

function CustomerList(props) {
  const { items } = props;
  const itemCount = items.length;

  return (
    <div className="row">
      <div className="col">
        <hr />
        <table className="table table-bordered table-hover table-sm">
          <thead>
            <tr className="align-middle">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service Address</th>
              <th></th>
            </tr>
          </thead>

          {itemCount == 0 ? (
            <tbody>
              <tr className="text-center">
                <td colSpan={6}>
                  There are no customers yet. Add one to get started.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {items.map((customer,i) => (
                <CustomerItem key={i} item={customer} />
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

export default CustomerList;
