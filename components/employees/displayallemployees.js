import Link from "next/link";
import { Fragment } from "react";
import { UserPlus } from "react-feather";
import EmployeeItem from "./employee-item";

export default function DisplayAllEmployees(props) {
  const { employees } = props;
  let itemCount = 0;
  if (employees) {
    itemCount = employees.length;
  }

  return (
    <Fragment>
      <div className="row">
        <div className="col-auto me-auto d-flex align-items-center">
          <h4 className="mb-0">Employees</h4>
        </div>
        <div className="col-auto">
          <Link href="/employees/new" className="btn btn-success">
            <div className=" d-flex align-items-center">
              <UserPlus size={16} />
              <span className="ms-2">Add New Employee</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <hr />
          <div className="mb-4">
            <p>
              Click/Tap on the Employee Name to manage the employee profile. 
            </p>
          </div>
          <table className="table table-bordered table-hover">
            <thead>
              <tr className="align-middle">
                <th>Employee Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                {/* <th></th> */}
              </tr>
            </thead>
            {itemCount == 0 ? (
              <tbody>
                <tr className="text-center">
                  <td colSpan={4}>
                    There are no employees yet. Add one to get started.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {employees.map((employee, i) => (
                  <EmployeeItem key={i} item={employee} />
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </Fragment>
  );
}
