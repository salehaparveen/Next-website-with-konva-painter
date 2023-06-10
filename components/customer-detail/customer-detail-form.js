import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import Notification from "../ui/notification";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import CustomerDetailNotFound from "./customer-detail-notfound";
import CustomerDetailTitle from "./customer-detail-title";
import { CustomerAddressForm } from "../customer-detail/address";
import { Plus } from "react-feather";

async function sendCustomerData(customerData) {
  const response = await fetch("/api/customer/update-user", {
    method: "POST",
    body: JSON.stringify(customerData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

function ExistingCustomerForm(props) {
  if (!props.itemFound) {
    return (
      <Fragment>
        <CustomerDetailNotFound />
      </Fragment>
    );
  }

  const { firstname, lastname, email, phone, serviceAddress, id } = props.item;

  const router = useRouter();

  const [enteredFirstName, setFirstName] = useState(firstname);
  const [enteredLastName, setLastName] = useState(lastname);
  const [enteredPhone, setPhone] = useState(phone);
  const [enteredEmail, setEmail] = useState(email);
  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();
  const [requestSuccessMsg, setSuccessMsg] = useState();
  const currentURL = `/customers/${id}`;

  let addresses = [];

  if (serviceAddress) {
    addresses = serviceAddress.items;
  }

  const [createdAddress, setCreateAddress] = useState({ items: addresses });
  const [count, setCounter] = useState(addresses.count);

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

  const removeAddressHandler = (index) => {
    let newItems = createdAddress.items.slice();
    newItems.splice(index, 1);

    setCreateAddress({
      items: newItems,
    });
    setCounter(count - 1);
    //console.log("clicked - index: ", index );
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
        setRequestStatus(null);
        router.push(currentURL);
        
      }, 2000);
    }
  }, [requestStatus]);

  const addDataHandler = (index, value, fieldName) => {
    let newItems = createdAddress.items.slice();
    if (fieldName == "street") {
      newItems[index].street = value.toUpperCase();
    }

    if (fieldName == "city") {
      newItems[index].city = value.toUpperCase();
    }

    if (fieldName == "addressState") {
      newItems[index].addressState = value.toUpperCase();
    }

    if (fieldName == "zip") {
      newItems[index].zipcode = value;
    }
    setCreateAddress({
      items: newItems,
    });

    //console.log("newItems: ", newItems );
  };

  async function saveCustomerHandler(event) {
    event.preventDefault();

    // optional: add client-side validation

    setRequestStatus("pending");

    const addresses = createdAddress;

    const processData = await sendCustomerData({
      firstname: enteredFirstName.toUpperCase(),
      lastname: enteredLastName.toUpperCase(),
      phone: enteredPhone ? enteredPhone : "",
      email: enteredEmail ? enteredEmail.toUpperCase() : "",
      serviceAddress: addresses,
      idToUpdate: id,
    });

    if (processData.status == 401) {
      signOut();
      router.replace("/login");
      return;
    }

    if (!processData.ok) {
      let errorMsg = "";

      if (processData.status == 422) {
        const pData = await processData.json();
        errorMsg = pData.message;
      } else {
        errorMsg = processData.statusText;
      }

      setRequestError(
        errorMsg || "Something went wrong! Refresh page and try again."
      );
      setRequestStatus("error");
    } else {
      const pData = await processData.json();
      setRequestStatus("success");
      setSuccessMsg(pData.message);
      
    }
  }

  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Saving customer data...",
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
        <div
          className="row sticky-top bg-black p-3 rounded-bottom"
          style={{ marginTop: "-20px" }}
        >
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
        <CustomerDetailTitle />

        <div className="row">
          <div className="col-6 mt-3">
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
                  onChange={(event) => setEmail(event.target.value)}
                />
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

        <div className="row mt-3">
          <div className="col">
            <hr />
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

export default ExistingCustomerForm;
