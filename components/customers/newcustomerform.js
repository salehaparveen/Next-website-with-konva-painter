import Link from "next/link";
import React, { Fragment, useState, useEffect } from "react";
import Notification from "../ui/notification";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { CustomerAddressForm } from "../customer-detail/address";
import { Plus } from "react-feather";

async function sendCustomerData(customerData) {
  const response = await fetch("/api/customer/new-user", {
    method: "POST",
    body: JSON.stringify(customerData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

async function sendAddressData(addressData) {
  const response = await fetch(
    `/api/customer/check-address?addressString=${addressData}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

async function sendEmailData(email) {
  const response = await fetch("/api/customer/check-email", {
    method: "POST",
    body: JSON.stringify(email),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

function NewCustomerForm() {
  const router = useRouter();

  const [enteredFirstName, setFirstName] = useState("");
  const [enteredLastName, setLastName] = useState("");
  const [enteredPhone, setPhone] = useState("");
  const [enteredEmail, setEmail] = useState("");
  const [addressFoundError, setAddressFoundError] = useState();

  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();
  const [requestSuccessMsg, setSuccessMsg] = useState();
  const [requestPendingMsg, setPendingMsg] = useState();

  const [addressOk, setAddressOk] = useState(true);
  const [notValidAddressIndex, setNotValidAddressIndex] = useState();
  const [emailFound, setEmailFound] = useState();

  let addresses = [];
  const [createdAddress, setCreateAddress] = useState({ items: addresses });
  const [count, setCounter] = useState(0);

  const newAddressButtonClick = () => {
    const counter = count + 1;
    const addressObj = {
      street: "",
      city: "",
      addressState: "NJ",
      zipcode: "",
    };
    let newItems = createdAddress.items.slice();
    newItems.push(addressObj);

    setCounter(counter);
    setCreateAddress({
      items: newItems,
    });
  };

  useEffect(() => {
    if (requestStatus === "error") {
      const timer = setTimeout(() => {
        setRequestStatus(null);
        setRequestError(null);
      }, 4000);

      return () => clearTimeout(timer);
    }

    if (requestStatus === "success") {
      const timer = setTimeout(() => {
        router.replace("/customers");
      }, 2000);
    }
  }, [requestStatus]);

  const removeAddressHandler = (index) => {
    let newItems = createdAddress.items.slice();
    newItems.splice(index, 1);

    setCreateAddress({
      items: newItems,
    });
    setCounter(count - 1);

    if (notValidAddressIndex == index) {
      setAddressFoundError(null);
      setNotValidAddressIndex(null);
      setAddressOk(true);
    }
  };

  const addDataHandler = async (index, value, fieldName) => {
    setAddressFoundError(null);

    let newItems = createdAddress.items.slice();
    if (fieldName == "street") {
      newItems[index].street = value.trim().toUpperCase();
    }

    if (fieldName == "city") {
      newItems[index].city = value.trim().toUpperCase();
    }

    if (fieldName == "addressState") {
      newItems[index].addressState = value.trim().toUpperCase();
    }

    if (fieldName == "zip") {
      newItems[index].zipcode = value.trim();
    }

    if (
      newItems[index].street !== "" &&
      newItems[index].city !== "" &&
      newItems[index].addressState !== "" &&
      newItems[index].zipcode !== ""
    ) {
      const addressString = `${newItems[index].street
        .split(" ")
        .join("")}${newItems[index].city.split(" ").join("")}${
        newItems[index].addressState
      }${newItems[index].zipcode}`;

      setPendingMsg("Checking Address");
      setRequestStatus("pending");

      const checkData = await sendAddressData(addressString);
      if (checkData.status == 401) {
        signOut();
        router.push("/login");
        return;
      }

      if (!checkData.ok) {
        setRequestError(
          checkData.statusText ||
            "Something went wrong! Refresh page and try again."
        );
        setRequestStatus("error");
      } else {
        const addressFoundData = await checkData.json();

        if (addressFoundData.addressFound) {
          setAddressFoundError(addressFoundData.addressObject);
          setRequestStatus(null);
          setAddressOk(false);
          setNotValidAddressIndex(index);
        } else {
          setRequestStatus("");
          setAddressOk(true);
        }
      }
    }
    setCreateAddress({
      items: newItems,
    });
  };

  async function checkEmail(value) {
    if (!value) {
      return;
    }

    setRequestStatus("pending");
    setPendingMsg("Checking Email Address...");

    const processData = await sendEmailData({
      email: value.trim().toUpperCase(),
    });

    if (processData.status == 401) {
      signOut();
      router.push("/login");
      return;
    }

    if (!processData.ok) {
      setRequestError(
        processData.statusText ||
          "Something went wrong! Refresh page and try again."
      );
      setRequestStatus("error");
    } else {
      const pData = await processData.json();

      if (pData.found) {
        setRequestStatus(null);
        setEmailFound(pData);
        setEmail("");
      } else {
        setEmailFound(null);
        setRequestStatus(null);
      }
    }
  }

  async function saveCustomerHandler(event) {
    event.preventDefault();

    // optional: add client-side validation

    setRequestStatus("pending");
    setPendingMsg("Saving New Customer Information");

    const addresses = createdAddress;

    const processData = await sendCustomerData({
      firstName: enteredFirstName.toUpperCase(),
      lastName: enteredLastName.toUpperCase(),
      phoneNumber: enteredPhone ? enteredPhone : "",
      email: enteredEmail ? enteredEmail.toUpperCase() : "",
      serviceAddress: addresses,
    });

    if (processData.status == 401) {
      signOut();
      router.push("/login");
      return;
    }

    if (!processData.ok) {
      setRequestError(
        processData.statusText ||
          "Something went wrong! Refresh page and try again."
      );
      setRequestStatus("error");
    } else {
      const pData = await processData.json();

      if (pData.success) {
        setRequestStatus("success");
        setSuccessMsg(pData.message);
      } else {
        if (pData.addressError) {
          setAddressFoundError(pData.addressError);
        }

        setRequestError(pData.message);
        setRequestStatus("error");
      }
    }
  }

  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: requestPendingMsg,
      message: "Your request is being processed.",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Success!",
      message: requestSuccessMsg,
    };
  }

  if (requestStatus === "error") {
    notification = {
      status: "error",
      title: "Error!",
      message: requestError,
    };
  }

  return (
    <Fragment>
      <form onSubmit={saveCustomerHandler}>
        <div className="row">
          <div className="col-7 mt-3">
            <div className="row">
              <div className="col">
                <label htmlFor="firstname" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  aria-label="First name"
                  required
                  value={enteredFirstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
              <div className="col">
                <label htmlFor="lastname" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last name"
                  aria-label="Last name"
                  required
                  value={enteredLastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <label htmlFor="phonenumber" className="form-label">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone Number"
                  aria-label="Phone Number"
                  value={enteredPhone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
              <div className="col">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email Address"
                  aria-label="Email Address"
                  value={enteredEmail}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailFound(null);
                  }}
                  onBlur={(event) => checkEmail(event.target.value)}
                />
                {emailFound && (
                  <div className="text-danger small-text m-2">
                    Email address belongs to another customer.
                    <Link
                      href={`/customers/profile/${emailFound.customerId}`}
                      className="alert-link d-inline-block"
                    >
                      View Profile
                    </Link>
                    .
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <div className="row">
              <div className="col">
                <hr />
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={newAddressButtonClick}
                >
                  <Plus size={12} /> Add Service Address
                </button>
              </div>
            </div>
            {addressFoundError && (
              <div className="row">
                <div className="col alert alert-warning ms-2 me-2 mt-3 small-text">
                  <h5>WARNING:</h5>
                  <p>
                    Customer(s) with similar addresses where found. See below:{" "}
                  </p>
                  <ul>
                    {addressFoundError.map((item, i) => (
                      <li key={i}>
                        {item.address} -
                        <Link
                          href={`/customers/profile/${item.customer}`}
                          className="alert-link"
                        >
                          View Customer
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p>
                    This information is to help you to make an informed decision
                    about creating a new customer with the same address.
                  </p>
                </div>
              </div>
            )}
            <div className="row mt-3">
              {createdAddress.items.map((item, i) => (
                <CustomerAddressForm
                  addressNumber={i + 1}
                  key={i + 1}
                  containerIndex={i}
                  onRemoveBtnClick={removeAddressHandler}
                  address={item}
                  addDataHandler={addDataHandler}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <div className="row mt-3">
              <div className="col">
                <hr />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-auto me-auto">
                <Link href="/customers" className="btn btn-secondary">
                  Back
                </Link>
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {notification && (
          <Notification
            status={notification.status}
            title={notification.title}
            message={notification.message}
          />
        )}
      </form>
    </Fragment>
  );
}

export default NewCustomerForm;
