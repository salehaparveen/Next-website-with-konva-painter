import Link from "next/link";
import { Fragment } from "react";

export default function NewEstimatesHeader() {
  return (
    <Fragment>
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col mb-3">
              <h3>New Estimate</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-auto me-auto d-flex align-items-center align-middle">
              <Link
                href="/estimates"
                className="btn btn-outline-secondary btn-sm"
              >
                Back
              </Link>
            </div>
            <div className="col-auto"></div>
          </div>
          <hr />
        </div>

        
      </div>
    </Fragment>
  );
}
