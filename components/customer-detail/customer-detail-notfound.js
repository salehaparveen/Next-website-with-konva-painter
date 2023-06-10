import { Fragment } from "react";
import Link from "next/link";
import CustomerDetailTitle from "./customer-detail-title";


function CustomerDetailNotFound() {
  return (
    <Fragment>
        <CustomerDetailTitle />
      <div className="row">
        <div className="col-12 text-center mt-3">
          
            <h3>Invalid Customer ID/Customer Not Found.</h3>
            <Link href="/customers" className="btn btn-secondary mt-3">
                Back
              </Link>
        </div>
      </div>
    </Fragment>
  );
}

export default CustomerDetailNotFound;
