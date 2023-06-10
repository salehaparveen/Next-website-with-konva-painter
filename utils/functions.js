async function grabData(url, token, method) {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (response.status == 401) {
    return { statusCode: response.status, data: [] };
  }

  const data = await response.json();
  //console.log("function grabData(): ", data);
  var dataInJson = null;

  if (data.data) {
    dataInJson = JSON.parse(data.data);
  }

  return { statusCode: response.status, data: dataInJson, fullResponse: data };
}

export async function allCustomers(token) {
  const url = `${process.env.AWSAPIURL}/customer/list`;
  const method = "GET";

  return await grabData(url, token, method);
}

export async function customerById(id, token) {
  const url = `${process.env.AWSAPIURL}/customer/${id}`;
  const method = "GET";

  return await grabData(url, token, method);
}

export async function checkAddressIfExists(addressString, token) {
  const url = `${process.env.AWSAPIURL}/customer/check/address/${addressString}`;
  const method = "GET";

  return await grabData(url, token, method);
}

export async function getEstimatesByCustId(id, token) {
  const url = `${process.env.AWSAPIURL}/estimates/customer/${id}`;
  const method = "GET";

  return await grabData(url, token, method);
}

export async function getEstimateId(id, token) {
  const url = `${process.env.AWSAPIURL}/estimates/${id}`;
  const method = "GET";

  return await grabData(url, token, method);
}

export async function getAllEstimates(token) {
  const url = `${process.env.AWSAPIURL}/estimates/list`;
  const method = "GET";

  return await grabData(url, token, method);
}

//list all employees
export async function getAllEmployees(token) {
  const url = `${process.env.AWSAPIURL}/employee/list`;
  const method = "GET";

  return await grabData(url, token, method);
}

//get employee by id
export async function getEmployeeById(id, token) {
  const url = `${process.env.AWSAPIURL}/employee/${id}`;
  const method = "GET";

  return await grabData(url, token, method);
}

//get estimates by day
export async function getEstimatesLast7Days(token) {
  const date = new Date();
  const dateWithOffset = date.setTime(
    date.getTime() - date.getTimezoneOffset() * 60 * 1000
  );
  const week = getWeekStartEnd(dateWithOffset);
  //console.log("week: ", week);
  const url = `${process.env.AWSAPIURL}/charts/estimates/by/date/between/${week.start}:${week.end}`;
  const method = "GET";

  return await grabData(url, token, method);
}

export async function getEstimatesPerMonth(monthString, token) {
  const url = `${process.env.AWSAPIURL}/charts/estimates/by/date/beginswith/${monthString}`;
  const method = "GET";

  return await grabData(url, token, method);
}

export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
};

export const formatTheDateTime = (value) => {
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

function getWeekStartEnd(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(date);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
  return { start: startOfWeek.toISOString().split("T")[0], end: endOfWeek.toISOString().split("T")[0] };
}
