import { Fragment } from "react";
import { formatPhoneNumber } from "../../utils/functions";

export default function ProfileCustomerInfo(props) {
  const { firstname, lastname, email, phone, serviceAddress } = props.item;

  const name = `${firstname} ${lastname}`;

  return (
    <Fragment>
      <div className="row">
        <div className="col-6 mt-3 mb-3">
          <table className="table table-borderless small align-middle">
            <tbody>
              <tr>
                <th className="table-light text-end">Name:</th>
                <td>{name}</td>
              </tr>
              <tr>
                <th className="table-light text-end">Email:</th>
                <td>{email}</td>
              </tr>
              <tr>
                <th className="table-light text-end">Phone:</th>
                <td>{formatPhoneNumber(phone)}</td>
              </tr>
              <tr>
                <th className="table-light text-end">Service Address:</th>
                <td>
                  {serviceAddress &&
                    serviceAddress.items.map((item, i) => (
                      <div>
                        <p>
                          <b>Address #{i + 1}</b>
                          <br />
                          {item.street} {item.city}, {item.addressState}{" "}
                          {item.zipcode}
                        </p>
                      </div>
                    ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
}
