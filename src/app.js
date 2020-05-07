//DOM ELEMENTS
const input = document.getElementById("input");
const name = document.getElementById("name");
const city = document.getElementById("city");
const companyId = document.getElementById("companyId");
const totalIncome = document.getElementById("totalIncome");
const averageIncome = document.getElementById("averageIncome");
const lastMonthIncome = document.getElementById("lastMonthIncome");

//GLOBAL VAR
let table = new Array();
let currentPage = 1;

//FETCH COMPANIES
const fetchCompanies = async () => {
  try {
    const response = await fetch(
      `https://recruitment.hal.skygate.io/companies`
    );
    let data = await response.json();

    data.forEach((company) => {
      gettingIncomes(company);
    });
  } catch (error) {
    console.log(error);
  }
};

//GETTING INCOMES
const gettingIncomes = async (company) => {
  const response = await fetch(
    `https://recruitment.hal.skygate.io/incomes/` + company.id
  );

  const data = await response.json();
  company.income = data;
  table.push(company);
  pagination(table, currentPage);
};

//PAGINATION + ADD COMPANY WITH INCOME
let tableElement = document.getElementById("tableBody");
let itemsPerPage = 30;

const pagination = (table, currentPage) => {
  tableElement.innerHTML = "";
  currentPage--;
  let numberOfPages = Math.ceil(table.length / itemsPerPage);
  let startPagination = currentPage * itemsPerPage;
  let endPagination = startPagination + itemsPerPage;
  let paginatedItems = table.slice(startPagination, endPagination);
  let pageItem;

  for (let i = 0; i < paginatedItems.length; i++) {
    pageItem = paginatedItems[i];

    //total income
    let sum = 0;
    pageItem.income.incomes.forEach((item) => {
      sum = sum + parseFloat(item.value);
    });

    //average income
    const averageIncome = sum / pageItem.income.incomes.length;

    //last month income
    const sortedDates = pageItem.income.incomes.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    const firstLastMonthDate = sortedDates[0].date;
    const firstLastMonthDateSliced = firstLastMonthDate.slice(0, 7);

    let filtered = sortedDates.filter(
      (a) => a.date.slice(0, 7) === firstLastMonthDateSliced
    );

    let lastMonthIncome = 0;
    for (let el of filtered) {
      lastMonthIncome = lastMonthIncome + parseFloat(el.value);
    }

    //printing
    const trBody = document.createElement("tr");
    trBody.setAttribute("id", `"${pageItem.id}-td"`);
    trBody.innerHTML = `
<td>${pageItem.id}</td>
<td>${pageItem.name.toUpperCase()}</td>
<td>${pageItem.city}</td> 
<td>${sum.toFixed(2)}</td>
<td>${averageIncome.toFixed(2)}</td>
<td>${lastMonthIncome.toFixed(2)}</td>
`;
    tableElement.append(trBody);
  }
  paginationButtons(numberOfPages);
};

//INPUT FILTER
const inputHandler = () => {
  console.log("input clicked");
  let tr, td, i, textValue, filter, input, tBody;

  input = document.getElementById("input");
  filter = input.value.toUpperCase();
  tBody = document.getElementById("tableBody");
  tr = tBody.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];

    if (td) {
      textValue = td.innerText || td.textContent;
      // if(textValue.toUpperCase().indexOf(filter) > -1) --> indexOf FILTERING METHOD
      if (textValue.toUpperCase().includes(filter.slice(1, 15))) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
};

// PAGINATION BUTTONS
let buttonDiv = document.getElementById("pagination");

const paginationButtons = (numberOfPages) => {
  buttonDiv.innerText = "";

  for (let i = 1; i < numberOfPages + 1; i++) {
    let button = document.createElement("button");
    button.setAttribute("class", "paginationButton");
    button.innerText = i;

    button.addEventListener("click", () => {
      currentPage = i;
      pagination(table, currentPage);
    });
    buttonDiv.appendChild(button);
  }
};

//DYNAMIC FUNCTION SORTING
let order = true;

//name
const nameSortHandler = () => {
  let key = "name";
  sortTable(key);
};
//city
const citySortHandler = () => {
  let key = "city";
  sortTable(key);
};
//id
const companyIdSortHandler = () => {
  let key = "id";
  sortTable(key);
};

const sortTable = (key) => {
  if (order === true) table.sort(compareValues(key));
  if (order === false) table.sort(compareValues(key, "desc"));

  order = !order;
  pagination(table, currentPage);
};

const compareValues = (key, order = "asc") => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
};

//TABLE SORTING - INCOME

//totalIncome
const totalIncomeSortHandler = () => {
  const totalTD = 3;
  tableSortingIncome(totalTD);
};
//averageIncome
const averageIncomeSortHandler = () => {
  const averageTD = 4;
  tableSortingIncome(averageTD);
};
//lastMonthIncome
const lastMonthIncomeSortHandler = () => {
  const lastMonthTD = 5;
  tableSortingIncome(lastMonthTD);
};

const tableSortingIncome = (td) => {
  console.log("clicked");
  let tbody,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    order,
    orderCount = 0;
  tbody = document.getElementById("tableBody");

  switching = true;
  order = "asc";

  while (switching) {
    switching = false;
    rows = tbody.rows;
    for (i = 0; i < rows.length - 1; i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[td];
      y = rows[i + 1].getElementsByTagName("TD")[td];

      if (order == "asc") {
        if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (order == "dsc") {
        if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      orderCount++;
    } else {
      if (orderCount == 0 && (order = "asc")) {
        order = "dsc";
        switching = true;
      }
    }
  }
};

//EVENTS
document.addEventListener("DOMContentLoaded", () => fetchCompanies());
name.addEventListener("click", nameSortHandler);
city.addEventListener("click", citySortHandler);
companyId.addEventListener("click", companyIdSortHandler);
totalIncome.addEventListener("click", totalIncomeSortHandler);
averageIncome.addEventListener("click", averageIncomeSortHandler);
lastMonthIncome.addEventListener("click", lastMonthIncomeSortHandler);
input.addEventListener("keyup", inputHandler);
