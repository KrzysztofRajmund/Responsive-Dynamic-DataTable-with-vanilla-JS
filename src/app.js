//DOM ELEMENTS
const input = document.getElementById("input");
const name = document.getElementById("name");
const city = document.getElementById("city");
const companyId = document.getElementById("companyId");

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
<td>\$${sum.toFixed(2)}</td>
<td>\$${averageIncome.toFixed(2)}</td>
<td>\$${lastMonthIncome.toFixed(2)}</td>
`;
    tableBody.append(trBody);
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

//FUNCTIONS SORTING
let order = true;


//name
const nameSortHandler = () => {
  if (order === true) {
    table.sort((a, b) => {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  if (order === false) {
    table.sort((b, a) => {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  order = !order;

  pagination(table, currentPage);
};

//city
const citySortHandler = () => {
  if (order === true) {
    table.sort((a, b) => {
      let cityA = a.city.toUpperCase();
      let cityB = b.city.toUpperCase();

      if (cityA < cityB) {
        return -1;
      }
      if (cityA > cityB) {
        return 1;
      }
      return 0;
    });
  }

  if (order === false) {
    table.sort((b, a) => {
      let cityA = a.city.toUpperCase();
      let cityB = b.city.toUpperCase();

      if (cityA < cityB) {
        return -1;
      }

      if (cityA > cityB) {
        return 1;
      }
      return 0;
    });
  }
  order = !order;
  pagination(table, currentPage);
};

// company ID
const companyIdSortHandler = () => {
  if (order === true) {
    table.sort((a, b) => {
      return a.id - b.id;
    });
  }

  if (order === false) {
    table.sort((b, a) => {
      return a.id - b.id;
    });
  }

  order = !order;

  pagination(table, currentPage);
};


//EVENTS
document.addEventListener("DOMContentLoaded", () => fetchCompanies());
name.addEventListener("click", nameSortHandler);
city.addEventListener("click", citySortHandler);
companyId.addEventListener("click", companyIdSortHandler);
input.addEventListener("keyup", inputHandler);
