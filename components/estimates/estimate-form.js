import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
//import { useIdleTimer } from "react-idle-timer";
import { signIn, useSession } from "next-auth/react";
import { formatPhoneNumber, formatTheDateTime } from "../../utils/functions";
import Link from "next/link";
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

async function sendDeleteRequest(data) {
  const response = await fetch("/api/estimate/delete-estimate", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

async function emailPDFRequest(data) {
  const response = await fetch("/api/estimate/send-over-email", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export default function ExistingEstimateForm(props) {
  const router = useRouter();
  const { estimateData, customerData } = props;

  const fenceType = estimateData.fenceOptions;

  const { isChainLink, isPVC, isAluminum, isWood, isOther, otherText } =
    estimateData;

  const custToProvideOpt = estimateData.toProvideOptions;
  const additionalInfoOptions = estimateData.additionalOptions;

  const [chainLinkStatus, setChainLink] = useState({
    checked: isChainLink == 1 ? true : false,
  });
  const [pvcStatus, setPVC] = useState({ checked: isPVC == 1 ? true : false });
  const [aluminumStatus, setAluminum] = useState({
    checked: isAluminum == 1 ? true : false,
  });
  const [woodStatus, setWood] = useState({
    checked: isWood == 1 ? true : false,
  });
  const [otherStatus, setOther] = useState({
    checked: isOther == 1 ? true : false,
  });
  const [otherStatusValue, setOtherValue] = useState(otherText);

  const [selectedFenceType, setSelectedFenceType] = useState({
    items: fenceType,
  });
  const [selectedCustomerToProvideOpt, setCustomerToProvideOpt] = useState({
    items: custToProvideOpt,
  });
  // const [selectedFenceTypeOtherText, setFenceTypeOtherText] = useState();

  const [selectedAdditionalInfo, setAdditionalInfo] = useState({
    items: additionalInfoOptions,
  });

  const [enteredDescription, setEstimateDescription] = useState(
    estimateData.description
  );
  const [enteredTotalPrice, setTotalPrice] = useState(estimateData.price);
  const [enteredDepositAmt, setDepositAmount] = useState(estimateData.deposit);
  const [enteredBalanceAmt, setBalanceAmount] = useState(estimateData.balance);

  const [estimateTableId, setEstimateTableId] = useState(
    estimateData.estimateTableId
  );

  //console.log(enteredBalanceAmt);
  const startingPercentageAmout =
    enteredBalanceAmt &&
    enteredTotalPrice &&
    Number(enteredBalanceAmt) != 0 &&
    Number(enteredTotalPrice) != 0
      ? Math.abs((enteredBalanceAmt / enteredTotalPrice) * 100 - 100)
      : "";

  const [depositPercentage, setDepositPercentage] = useState(
    startingPercentageAmout
  );

  let formattedDate;

  if (estimateData.updatedDate) {
    formattedDate = formatTheDateTime(estimateData.updatedDate);
  }

  //const [estimateStatus, setEstimateStatus] = useState(estimateData.status);
  const [lastAutoSaveDate, setLastAutoSaveDate] = useState(formattedDate);

  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();
  const [requestSuccessMsg, setSuccessMsg] = useState();

  //const { data: session } = useSession();

  const pdfURL = `${process.env.NEXT_PUBLIC_AWSRESTAPIURL}/generatePDF/${estimateData.id}:${estimateData.estimateNumber}`;
  const drawingURL = `drawing/${estimateData.id}:${estimateData.estimateNumber}`;
  const currentURL = `/estimates/${estimateData.id}:${estimateData.estimateNumber}`;

  //console.log(estimateData.additionalCopies);

  let mainEstimateUrl = "";
  if (estimateData.relatedEstimateId && estimateData.relatedEstimateNumber) {
    mainEstimateUrl = `/estimates/${estimateData.relatedEstimateId}:${estimateData.relatedEstimateNumber}`;
  }

  const calculateDepositAmout = (value) => {
    if (value != 0) {
      const depositamount = (enteredTotalPrice * value) / 100;
      const balanceToPay = enteredTotalPrice - depositamount;
      setDepositPercentage(value);
      setDepositAmount(depositamount.toFixed(2));
      setBalanceAmount(balanceToPay.toFixed(2));
    } else {
      setDepositPercentage("0");
      setDepositAmount(null);
      setBalanceAmount(null);
    }
  };

  const priceAmountHandler = (value) => {
    if (value != 0 && value != 0.0 && enteredDepositAmt && enteredBalanceAmt) {
      setDepositPercentage("0");
      setDepositAmount(null);
      setBalanceAmount(null);
    } else {
      setTotalPrice(value);
    }
  };

  function customerToProvideChange(index, e) {
    let newItems = selectedCustomerToProvideOpt.items.slice();
    newItems[index].checked = !newItems[index].checked;
    setCustomerToProvideOpt({
      items: newItems,
    });
  }

  function additionalInfoHandler(parentIndex, childIndex) {
    let newArr = selectedAdditionalInfo.items;
    let currentOpts = newArr[parentIndex].options;
    const selectedValue = currentOpts[childIndex].value;
    currentOpts.forEach((item) => {
      selectedValue == item.value
        ? (item.selected = true)
        : (item.selected = false);
    });
    setAdditionalInfo({
      items: newArr,
    });
  }

  // const handleOnIdle = (event) => {
  //   // console.log('user is idle', event)
  //   // console.log('last active', getLastActiveTime());
  //   saveAllInfo().then(console.log("saved"));
  // };

  // const handleOnActive = event => {
  //   console.log('user is active', event)
  //   console.log('time remaining', getRemainingTime())
  // }

  // const handleOnAction = event => {
  //   console.log('user did something', event)
  // }

  // const { getRemainingTime, getLastActiveTime } = useIdleTimer({
  //   timeout: 60000,
  //   onIdle: handleOnIdle,
  //   // onActive: handleOnActive,
  //   // onAction: handleOnAction,
  //   debounce: 500,
  // });

  async function saveAllInfo(estStatus) {
    validateData().then((res) => {
      if (res) {
        //return must be true
        let defaultStatusEstimate = "DRAFT";
        if (estStatus) {
          defaultStatusEstimate = estStatus;
        }

        setRequestStatus("pending");

        const newFenceType = {
          isChainLink: chainLinkStatus.checked,
          isPVC: pvcStatus.checked,
          isAluminum: aluminumStatus.checked,
          isWood: woodStatus.checked,
          isOther: otherStatus.checked,
          otherText: otherStatusValue ? otherStatusValue : "",
        };

        const data = {
          newRecord: false,
          existingEstimateNumber: estimateData.estimateNumber,
          estimateTableId: estimateData.id,
          customerId: customerData.id,
          fenceOptions: newFenceType,
          toProvideOptions: selectedCustomerToProvideOpt.items,
          additionalOptions: selectedAdditionalInfo.items,
          description: enteredDescription ? enteredDescription : "",
          price: Number(enteredTotalPrice).toFixed(2),
          deposit: Number(enteredDepositAmt).toFixed(2),
          balance: Number(enteredBalanceAmt).toFixed(2),
          status: defaultStatusEstimate,
        };

        saveEstimateData(data).then((result) => {
          if (result.status == 401) {
            signIn();
            return;
          }

          if (!result.ok) {
            setRequestError(
              result.statusText ||
                "Something went wrong! Refresh page and try again."
            );
            setRequestStatus("error");
          } else {
            setRequestStatus(null);
            router.push(currentURL);
          }
        });
      }
    });
  }

  async function deleteEstimateBtn() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger ms-3",
        cancelButton: "btn btn-light ms-3",
      },
      buttonsStyling: false,
    });

    const askToConfirm = await swalWithBootstrapButtons.fire({
      title: "Delete Estimate",
      html: "Are you sure you want to <strong>DELETE</strong> this estimate? This action cannot be reverted.",
      icon: "warning",
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "No, Cancel",
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
    });

    if (askToConfirm.isConfirmed) {
      setRequestStatus("pending");

      const result = await sendDeleteRequest({
        estimateId: estimateData.id,
        estimateNumber: estimateData.estimateNumber,
        relatedEstimateId: estimateData.relatedEstimateId,
        relatedEstimateNumber: estimateData.relatedEstimateNumber
      });

      if (result.status == 401) {
        signIn();
      }

      if (!result.ok) {
        swalWithBootstrapButtons.fire(
          "Ooops!",
          result.statusText ||
            "Something went wrong! Refresh page and try again.",
          "error"
        );
      } else {
        const response = await result.json();
        const showAlert = await swalWithBootstrapButtons.fire(
          "Done!",
          response.message,
          "success"
        );

        if (showAlert.isConfirmed) {
          router.push("/estimates");
        }
      }
    }
  }

  const validateData = async (e) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger ms-3",
        cancelButton: "btn btn-light ms-3",
      },
      buttonsStyling: false,
    });

    let alertMsg = "";

    if (!enteredTotalPrice) {
      if (e) {
        e.preventDefault();
      }
      alertMsg = "Price is missing.";
    } else if (!enteredDepositAmt) {
      if (e) {
        e.preventDefault();
      }
      alertMsg = "Deposit is missing. ";
    } else if (!enteredDescription) {
      if (e) {
        e.preventDefault();
      }
      alertMsg = "Description is missing.";
    } else if (
      !chainLinkStatus.checked &&
      !aluminumStatus.checked &&
      !pvcStatus.checked &&
      !woodStatus.checked &&
      !otherStatus.checked
    ) {
      if (e) {
        e.preventDefault();
      }
      alertMsg = "Fence Type is missing.";
    }

    if (alertMsg != "") {
      const showAlert = await swalWithBootstrapButtons.fire(
        "Wait...",
        alertMsg.concat(
          "<br />Make sure you hit the 'Save' button after you provided the required information."
        ),
        "warning"
      );
      return false;
    }

    return true;
  };

  //send PDF over Email
  async function sendPDFOverEmail() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-info ms-3",
        cancelButton: "btn btn-light ms-3",
      },
      buttonsStyling: false,
    });

    const askToConfirm = await swalWithBootstrapButtons.fire({
      title: "Send PDF over Email",
      html: "Are you sure you want to <strong>SEND</strong> this estimate over email? Before continuing, make sure you hit the 'SAVE' button. ",
      icon: "info",
      confirmButtonText: "Yes, Send it!",
      cancelButtonText: "No, Cancel",
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
    });

    if (askToConfirm.isConfirmed) {
      setRequestStatus("pending");

      const result = await emailPDFRequest({
        estimateId: estimateData.id,
        estimateNumber: estimateData.estimateNumber,
        customerEmail: customerData.email,
      });

      if (result.status == 401) {
        signIn();
      }

      if (!result.ok) {
        swalWithBootstrapButtons.fire(
          "Ooops!",
          result.statusText ||
            "Something went wrong! Refresh page and try again.",
          "error"
        );
      } else {
        const response = await result.json();
        const showAlert = await swalWithBootstrapButtons.fire(
          "Done!",
          response.message,
          "success"
        );
        setRequestStatus(null);

        if (showAlert.isConfirmed) {
          router.push(currentURL);
        }
      }
    }
  }

  //Create Copy Button Handler
  async function createCopyBtnHandler() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-secondary ms-3",
        cancelButton: "btn btn-light ms-3",
      },
      buttonsStyling: false,
    });

    const askToConfirm = await swalWithBootstrapButtons.fire({
      title: "Create Copy",
      html: "Are you sure you want to <strong>CREATE A COPY</strong> of this estimate?",
      icon: "warning",
      confirmButtonText: "Yes, Create it!",
      cancelButtonText: "No, Cancel",
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
    });

    if (askToConfirm.isConfirmed) {
      setRequestStatus("pending");

      const data = {
        newRecord: true,
        existingEstimateNumber: "",
        estimateTableId: "",
        customerId: customerData.id,
        serviceAddress: estimateData.serviceAddress,
        fenceOptions: "",
        toProvideOptions: selectedCustomerToProvideOpt.items,
        additionalOptions: selectedAdditionalInfo.items,
        description: enteredDescription,
        price: "",
        deposit: "",
        balance: "",
        status: "DRAFT",
        relatedEstimateId: estimateData.id,
        relatedEstimateNumber: estimateData.estimateNumber,
        drawing: estimateData.drawing,
      };

      const result = await saveEstimateData(data);

      if (result.status == 401) {
        signIn();
      }

      if (!result.ok) {
        swalWithBootstrapButtons.fire(
          "Ooops!",
          result.statusText ||
            "Something went wrong! Refresh page and try again.",
          "error"
        );
      } else {
        const response = await result.json();
        const showAlert = await swalWithBootstrapButtons.fire(
          "Done!",
          "Copy has been created successfully.<br /><br />Click 'OK' to go to the new created estimate.",
          "success"
        );
        setRequestStatus(null);

        if (showAlert.isConfirmed) {
          const newEstimateLink = `/estimates/${response.estimatedTableId}:${response.estimateNumberString}`;
          router.push(newEstimateLink);
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
      <div
        className="row sticky-top bg-black p-3 rounded-bottom"
        style={{ marginTop: "-20px" }}
      >
        <div className="col-auto me-auto">
          <Link href="/estimates" className="btn btn-light  btn-sm">
            Back
          </Link>
          <button
            type="button"
            className="btn btn-danger ms-3 btn-sm"
            onClick={(e) => deleteEstimateBtn()}
          >
            Delete
          </button>
        </div>
        <div className="col-auto">
          {estimateData.relatedEstimateId ? (
            <Link
              href={mainEstimateUrl}
              className="btn btn-primary btn-sm  me-3"
            >
              View Main Estimate
            </Link>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm  me-3"
              onClick={createCopyBtnHandler}
            >
              Create Copy
            </button>
          )}

          <Link
            href={pdfURL}
            target="_blank"
            role="button"
            className="btn btn-warning me-3 btn-sm"
            onClick={(e) => validateData(e)}
          >
            View & Print PDF
          </Link>

          {customerData.email &&
            enteredDescription &&
            enteredTotalPrice &&
            enteredDepositAmt && (
              // <Link
              //   className="btn btn-info btn-sm  me-3"
              //   href={`/estimates/email-it/${estimateData.id}:${estimateData.estimateNumber}`}
              // >
              //   Send Estimate via Email
              // </Link>
              <button type="button" className="btn btn-info btn-sm me-3" onClick={sendPDFOverEmail}>
                Send Estimate via Email
              </button>
            )}

          <Link href={drawingURL} className="btn btn-light btn-sm me-3">
            Drawing/Sketch
          </Link>

          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => saveAllInfo()}
          >
            Save
          </button>
        </div>
      </div>

      {estimateData.estimateNumber && (
        <div className="row mt-3">
          <h3>
            Estimate Number: {estimateData.estimateNumber}
            {/* {estimateStatus && (
              <small>
                <span className="badge rounded-pill text-bg-secondary fs-6 ms-3 small-text">
                  {estimateStatus}
                </span>
              </small>
            )} */}
            {lastAutoSaveDate && (
              <div className="text-muted fs-6 mt-2 fw-light  small-text">
                Last saved on: {lastAutoSaveDate}
              </div>
            )}
          </h3>
          

          {estimateData.additionalCopies && (
            <div className="text-small">
              <hr />
              Related Estimate(s):
              <ul>
              {estimateData.additionalCopies.map((item, i) => (
                <li key={i}>
                  <Link href={`/estimates/${item}`} className="link-success">#{item.split(":")[1]}</Link>
                </li>
              ))}
              </ul>
              <hr />
            </div>
          )}
        </div>
      )}
      <div className="row mt-3">
        <div className="col">
          <h6 className="mb-3 text-bg-success p-2">&gt;&gt; Customer:</h6>
          <div>{customerData.name}</div>
          <div>{customerData.address}</div>
          <div>
            <b>Phone: </b>
            {customerData.phone ? formatPhoneNumber(customerData.phone) : "N/A"}
            <br />
            <b>Email: </b>
            {customerData.email ? customerData.email : "N/A"}
          </div>
          <div>
            <b>Service Address: </b>
            {estimateData.serviceAddress}
          </div>
        </div>
        <div className="col">
          <h6 className="mb-3 text-bg-success p-2">&gt;&gt; Price:</h6>
          <div className="mb-2">
            <div className="col-3 d-inline-block  text-end me-3">
              <label className="form-check-label ">
                <strong>Price:</strong>
              </label>
            </div>
            <div className="col-4 d-inline-block">
              <div className="input-group mb-3">
                <span className="input-group-text">$</span>
                <input
                  type="text"
                  className="form-control  text-end"
                  aria-label="Amount (to the nearest dollar)"
                  value={enteredTotalPrice}
                  onChange={(e) => priceAmountHandler(e.target.value)}
                />
              </div>
            </div>
          </div>
          {enteredTotalPrice && Number(enteredTotalPrice) != 0.0 && (
            <div>
              <div className="mb-3">
                <div className="col-3 d-inline-block  text-end me-3">
                  <label className="form-check-label">
                    <strong>Deposit (%):</strong>
                  </label>
                </div>

                <div className="col-4 d-inline-block">
                  <select
                    className="form-select text-end"
                    value={depositPercentage}
                    onChange={(e) => calculateDepositAmout(e.target.value)}
                  >
                    <option value="0">0%</option>
                    <option value="20">20%</option>
                    <option value="25">25%</option>
                    <option value="30">30%</option>
                    <option value="35">35%</option>
                    <option value="40">40%</option>
                    <option value="45">45%</option>
                    <option value="50">50%</option>
                    <option value="55">55%</option>
                    <option value="60">60%</option>
                    <option value="65">65%</option>
                    <option value="70">70%</option>
                    <option value="75">75%</option>
                    <option value="80">80%</option>
                    <option value="85">85%</option>
                    <option value="90">90%</option>
                  </select>
                </div>
              </div>
              {depositPercentage && depositPercentage != "0" && (
                <div className="mb-2 ">
                  <div className="col-3 d-inline-block  text-end me-3">
                    <label className="form-check-label">
                      <strong>Deposit Amount:</strong>
                    </label>
                  </div>

                  <div className="col-4 d-inline-block text-end">
                    <span>${enteredDepositAmt}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {enteredBalanceAmt &&
            enteredTotalPrice &&
            Number(enteredTotalPrice) != 0.0 &&
            depositPercentage && (
              <div className="mb-2">
                <div className="col-3 d-inline-block   text-end me-3">
                  <label className="form-check-label">
                    <strong>Balance:</strong>
                  </label>
                </div>
                <div className="col-4 d-inline-block">
                  <div className=" d-flex align-items-center flex-row-reverse">
                    ${enteredBalanceAmt}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col mt-3">
          <h6 className="mb-3 text-bg-success p-2">&gt;&gt; Fence Type:</h6>
          <hr />

          <div>
            <input
              className="form-check-input me-2"
              type="checkbox"
              onChange={(e) => setChainLink({ checked: e.target.checked })}
              checked={chainLinkStatus.checked}
            />
            <label className="form-check-label">Chain Link</label>
          </div>

          <div>
            <input
              className="form-check-input me-2"
              type="checkbox"
              onChange={(e) => setPVC({ checked: e.target.checked })}
              checked={pvcStatus.checked}
            />
            <label className="form-check-label">PVC</label>
          </div>

          <div>
            <input
              className="form-check-input me-2"
              type="checkbox"
              onChange={(e) => setAluminum({ checked: e.target.checked })}
              checked={aluminumStatus.checked}
            />
            <label className="form-check-label">Aluminum</label>
          </div>

          <div>
            <input
              className="form-check-input me-2"
              type="checkbox"
              onChange={(e) => setWood({ checked: e.target.checked })}
              checked={woodStatus.checked}
            />
            <label className="form-check-label">Wood</label>
          </div>

          <div>
            <div className="col-2 d-inline-block">
              <input
                className="form-check-input me-2"
                type="checkbox"
                onChange={(e) => setOther({ checked: e.target.checked })}
                checked={otherStatus.checked}
              />
              <label className="form-check-label">Other</label>
            </div>

            {otherStatus.checked && (
              <div className="col-8 d-inline-block">
                <input
                  type="text"
                  className="form-control ms-2"
                  value={otherStatusValue}
                  onChange={(event) => setOtherValue(event.target.value)}
                />
              </div>
            )}
          </div>

          <h6 className="mt-4 mb-3  text-bg-success p-2">
            &gt;&gt; Customer To Provide:
          </h6>
          <hr />

          {selectedCustomerToProvideOpt.items.map((item, i) => (
            <div className="form-check" key={i}>
              {
                <div>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={customerToProvideChange.bind(this, i)}
                    checked={item.checked}
                  />
                  <label className="form-check-label">{item.text}</label>
                </div>
              }
            </div>
          ))}
        </div>
        <div className="col mt-3">
          <h6 className="mb-3  text-bg-success p-2">
            &gt;&gt; Additional Info:
          </h6>
          <hr />
          {selectedAdditionalInfo.items.map((item, i) => (
            <div className="row mt-3" key={i}>
              <label className="col-sm-4 col-form-label text-end">
                <strong>{item.text}: </strong>
              </label>

              <div className="col-sm-8">
                {item.options.map((option, index) => (
                  <div className="form-check" key={index}>
                    {
                      <div>
                        <input
                          className="form-check-input"
                          type="radio"
                          name={option.name}
                          value={option.value}
                          onChange={() => additionalInfoHandler(i, index)}
                          checked={option.selected}
                        />
                        <label className="form-check-label">
                          {option.text}
                        </label>
                      </div>
                    }
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="row mt-4 mb-3">
        <div className="col">
          <h6 className="mb-3  text-bg-success p-2">&gt;&gt; Description:</h6>
          <hr />
          <textarea
            className="form-control"
            rows={6}
            value={enteredDescription}
            onChange={(e) => setEstimateDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <hr />
        </div>
      </div>
      <div className="row text-muted">
        <div className="col">
          <u>METADATA:</u>
        </div>
      </div>
      <div className="row text-muted">
        <div className="col">
          <div>
            <b>Estimate created on </b>
            {formatTheDateTime(estimateData.createdDate)} <b>BY</b>{" "}
            {estimateData.createdBy}.
          </div>

          {estimateData.updatedDate && (
            <div>
              <b>The last update was on: </b>
              {formatTheDateTime(estimateData.updatedDate)} <b>BY</b>{" "}
              {estimateData.updatedBy}.
            </div>
          )}

          {estimateData.sendEmailDate && (
            <div>
              <b>Emailed to customer on </b>
              {formatTheDateTime(estimateData.sendEmailDate)} <b>BY</b>{" "}
              {estimateData.whoSendEmail}.
            </div>
          )}
        </div>
      </div>
      <div className=" end-container"></div>
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
