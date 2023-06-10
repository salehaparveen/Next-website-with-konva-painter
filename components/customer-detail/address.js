import { Fragment, useState } from "react";
import { X } from "react-feather";

export function CustomerAddressForm(props) {
  const { street, city, addressState, zipcode } = props.address;
  const addressNumber = props.addressNumber;
  const containerIndex = props.containerIndex;

  const [streetValue, setStreetValue] = useState(street);
  const [cityValue, setCityValue] = useState(city);
  const [addressStateValue, setAddressStateValue] = useState(addressState);
  const [zipcodeValue, setZipcodeValue] = useState(zipcode);

  function removeContainerBtnHandler() {
    props.onRemoveBtnClick(containerIndex);
  }

  function setContainerValue(value, fieldName) {
    props.addDataHandler(containerIndex, value, fieldName);
  }

  return (
    <Fragment>
      <div className="col-xs-6 col-md-4 border mb-3 ms-3 me-2 p-3">
        {addressNumber && (
          <div className="row">
            <div className="col-auto me-auto">
              <h6>
                <u>Service Address #{addressNumber}</u>
              </h6>
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={removeContainerBtnHandler}
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        <div className="row mt-3">
          <div className="col">
            <label htmlFor="Address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              aria-label="Address"
              required
              value={streetValue}
              onChange={(e) => setStreetValue(e.target.value.toUpperCase())}
              onBlur={(event) => setContainerValue(event.target.value, "street")}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="City"
              aria-label="City"
              required
              value={cityValue}
              onChange={(e) => setCityValue(e.target.value.toUpperCase())}
              onBlur={(event) =>
                setContainerValue(event.target.value, "city")
              }
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-6">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <select
              className="form-select"
              required
              value={addressStateValue}
              onChange={(e) => setAddressStateValue(e.target.value.toUpperCase())}
              onBlur={(event) =>
                setContainerValue(event.target.value, "addressState")}
            >
              <option value="NJ">NJ</option>
              <option value="NY">NY</option>
            </select>
          </div>
          <div className="col-6">
            <label htmlFor="zipcode" className="form-label">
              Zip Code
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Zip Code"
              aria-label="Zip Code"
              required
              value={zipcodeValue}
              onChange={(e) => setZipcodeValue(e.target.value.toUpperCase())}
              onBlur={(event) => setContainerValue(event.target.value, "zip")}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
