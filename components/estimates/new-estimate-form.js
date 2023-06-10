import { useRouter } from "next/router";
import { Fragment, useState, useEffect } from "react";
import NewEstimatesHeader from "./new-header";
import { signIn, useSession } from "next-auth/react";
import Notification from "../ui/notification";
import Swal from "sweetalert2";

async function saveEstimateData(data) {
  const response = await fetch("/api/estimate/save-estimate", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

async function checkEstimate(data) {
  const response = await fetch(
    "/api/estimate/check-estimate-by-service-address",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

export default function EstimateForm(props) {
  const router = useRouter();
  const { customers } = props;
  const [selectedCustomer, setSelectedCustomer] = useState();

  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();
  const [requestSuccessMsg, setSuccessMsg] = useState();

  // const fenceType = [
  //   {
  //     text: "Chain Link",
  //     checked: false,
  //     other: false,
  //     additionalText: ''
  //   },
  //   {
  //     text: "PVC",
  //     checked: false,
  //     other: false,
  //     additionalText: ''
  //   },
  //   {
  //     text: "Aluminum",
  //     checked: false,
  //     other: false,
  //     additionalText: ''
  //   },
  //   {
  //     text: "Wood",
  //     checked: false,
  //     other: false,
  //   },
  //   {
  //     text: "Other",
  //     checked: false,
  //     other: true,
  //   },
  // ];

  const fenceType = {
    isChainLink: false,
    isPVC: false,
    isAluminum: false,
    isWood: false,
    isOther: false,
    otherText: ''
  }

  const custToProvideOpt = [
    {
      text: "Permit",
      checked: true,
    },
    {
      text: "Survey",
      checked: true,
    },
    {
      text: "Property Markers",
      checked: true,
    },
  ];

  const additionalInfoOptions = [
    {
      text: "Top of Fence To",
      options: [
        {
          text: "Follow ground",
          selected: false,
          value: "follow-ground",
          name: "topFenceOpt",
        },
        {
          text: "Be Level",
          selected: false,
          value: "be-level",
          name: "topFenceOpt",
        },
      ],
    },
    {
      text: "Cleaning",
      options: [
        {
          text: "YES",
          selected: false,
          value: true,
          name: "cleaningOpt",
        },
        {
          text: "NO",
          selected: false,
          value: false,
          name: "cleaningOpt",
        },
      ],
    },
    {
      text: "Fence Take Down/Away",
      options: [
        {
          text: "YES",
          selected: false,
          value: true,
          name: "fenceTakeDownOpt",
        },
        {
          text: "NO",
          selected: false,
          value: false,
          name: "fenceTakeDownOpt",
        },
      ],
    },
    {
      text: "Core Drilling (Asphalt / Concrete / Paver)",
      options: [
        {
          text: "YES",
          selected: false,
          value: true,
          name: "coreDrillingOpt",
        },
        {
          text: "NO",
          selected: false,
          value: false,
          name: "coreDrillingOpt",
        },
      ],
    },
    {
      text: "Customer will Clear Area Prior Installation",
      options: [
        {
          text: "YES",
          selected: false,
          value: true,
          name: "custCleanOpt",
        },
        {
          text: "NO",
          selected: false,
          value: false,
          name: "custCleanOpt",
        },
      ],
    },
  ];

  async function dropdownHandler(value) {
    if (value.length > 0) {
      setRequestStatus("pending");

      if (value == "new-customer") {
        router.push("/customers/new");
        return;
      }

      const customerId = value.split(":")[0];
      const serviceAddress = value.split(":")[1];

      const checkResult = await checkEstimate({
        serviceAddress: serviceAddress,
      });

      if (checkResult.status == 401) {
        signIn();
      }

      if (checkResult.ok) {
        const checkResponse = await checkResult.json();

        if (checkResponse.count > 0) {
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-danger ms-3",
            },
            buttonsStyling: false,
          });

          const showAlert = await swalWithBootstrapButtons.fire({
            title: "Wait!",
            html: "There is already an estimate in <strong>DRAFT</strong>. You cannot create multiple estimates for the same service address.",
            icon: "error",
            showCancelButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            allowEnterKey: false,
          });

          if (showAlert.isConfirmed) {
            setRequestStatus("");
          }
        } else {
          const data = {
            newRecord: true,
            existingEstimateNumber: "",
            estimateTableId: "",
            customerId: customerId,
            serviceAddress: serviceAddress,
            fenceOptions: fenceType,
            toProvideOptions: custToProvideOpt,
            additionalOptions: additionalInfoOptions,
            description: "",
            price: "",
            deposit: "",
            balance: "",
            status: "DRAFT",
          };

          const result = await saveEstimateData(data);

          if (result.status == 401) {
            signIn();
          }

          if (result.ok) {
            const response = await result.json();
            //console.log(response);
            const redirectToURL = `/estimates/${response.estimatedTableId}:${response.estimateNumberString}`;
            router.replace(redirectToURL);
            return;
          }

          const redirectToURL = `/estimates/${response.estimatedTableId}:${response.estimateNumberString}`;
          router.replace(redirectToURL);
          return;
        }
      }
    }
  }

  //notifications setup
  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Please wait...",
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
      <NewEstimatesHeader />
      <div className="row mt-3">
        <div className="col">
          <h6 className="mb-3 text-bg-success p-2">
            &gt;&gt; Select a customer:
          </h6>
          <select
            className="form-select"
            required
            value={selectedCustomer}
            onChange={(e) => dropdownHandler(e.target.value)}
          >
            <option value="">---- Select Customer ----</option>
            {customers.map((customer) => (
              <optgroup
                key={customer.id}
                value={customer.id}
                // label={`${customer.firstname} ${customer.lastname} - EMAIL:  ${(customer.email) ? customer.email : 'N/A'} `}
                label={`${customer.firstname} ${customer.lastname}`}
              >
                {customer.serviceAddress.items.map((item, i) => (
                  <option
                    key={i}
                    value={`${customer.id}:${item.street} ${item.city} ${item.addressState}, ${item.zipcode}`}
                  >
                    {/* {customer.firstname} {customer.lastname} : {item.street} {item.city}, {item.addressState}{" "}
                    {item.zipcode} */}
                    Service Address: {item.street} {item.city},{" "}
                    {item.addressState} {item.zipcode}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value="new-customer">*Create New Customer*</option>
          </select>
        </div>
      </div>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
    </Fragment>
  );
}
