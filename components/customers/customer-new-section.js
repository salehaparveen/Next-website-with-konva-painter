import Link from "next/link";
import { UserPlus } from "react-feather";

function CustomerNewSection() {
  return (
    <div className="row">
      <div className="col-auto me-auto d-flex align-items-center">
        <h4 className="mb-0">Customers</h4>
      </div>
      <div className="col-auto">
        <Link href="/customers/new" className="btn btn-success">
          <div className=" d-flex align-items-center">
            <UserPlus size={16} />
            <span className="ms-2">Add New Customer</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default CustomerNewSection;
