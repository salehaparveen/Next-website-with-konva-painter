
import EstimateItem from "./estimate-item";

function EstimatesList(props) {
  const { items, itemCount } = props;

  return (
    <div className="row">
      <div className="col">
        <hr />
        <table className="table table-bordered table-hover  table-sm">
          <thead>
            <tr className="align-middle">
              <th>Estimate Number</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Service Address</th>
              <th>{" "}</th>
            </tr>
          </thead>

          {itemCount == 0 ? (
            <tbody>
              <tr className="text-center">
                <td colSpan={4}>No Estimates Found. Add one to get started.</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {items.map((estimate) => (
                <EstimateItem key={estimate.id} item={estimate} />
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

export default EstimatesList;
