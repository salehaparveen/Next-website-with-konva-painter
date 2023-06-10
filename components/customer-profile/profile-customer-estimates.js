import { Fragment } from "react";
import DisplayEstimates from "../estimates/displayestimates";

export default function ProfileCustomerEstimates(props) {
  const { items, count } = props;

  return (
    <Fragment>
      <div className="row">
        <div className="col">
          <h3>Estimates</h3>
          <hr />
        </div>
      </div>
      <div className="row">
        {count == 0 ? (
          <div className="col mt-3 mb-3 text-center">No estimates yet.</div>
        ) : (
          <DisplayEstimates data={items} />
        )}
      </div>
    </Fragment>
  );
}
