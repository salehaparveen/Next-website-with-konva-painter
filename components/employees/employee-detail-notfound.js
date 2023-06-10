import { Fragment } from "react";
import Link from "next/link";


function EmployeeNotFound() {
  return (
    <Fragment>
        
      <div className="row">
        <div className="col-12 text-center mt-3">
          
            <h3>Invalid Employee ID/Employee Not Found.</h3>
            <Link href="/employees" className="btn btn-secondary mt-3">
                Back
              </Link>
        </div>
      </div>
    </Fragment>
  );
}

export default EmployeeNotFound;
