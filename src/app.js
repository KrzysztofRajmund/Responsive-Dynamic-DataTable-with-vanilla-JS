//DOM ELEMENTS
const input = document.getElementById("input");
const name = document.getElementById("name");
const city = document.getElementById("city");
const companyId = document.getElementById("companyId");


//FETCH COMPANIES
let dataTable = new Array();
let dataIncome = [];
let currentPage = 1

const fetchCompanies = async () => {
  try {
    const response = await fetch(
      `https://recruitment.hal.skygate.io/companies`
    );
    let data = await response.json();
    dataTable.push(data);
    dataTable = dataTable[0];

    pagination(dataTable,currentPage);
    console.log(dataTable, "fetch companies");

  } catch (error) {
    console.log(error);
  }
};

//PAGINATION + ADD COMPANY
let tableElement = document.getElementById("tableBody")
let itemsPerPage = 30;

const pagination = (dataTable,currentPage) => {
  tableElement.innerHTML="";
  currentPage--;
  let numberOfPages = Math.ceil(dataTable.length / itemsPerPage);
  let startPagination = currentPage * itemsPerPage;
  let endPagination = startPagination + itemsPerPage;
  let paginatedItems = dataTable.slice(startPagination,endPagination)
  let pageItem

  for (let i = 0; i < paginatedItems.length; i++){
    pageItem = paginatedItems[i];
    const trBody = document.createElement("tr");
    trBody.setAttribute("id", `"${pageItem.id}-td"`);
    trBody.innerHTML = `
<td>${pageItem.id}</td>
<td>${pageItem.name.toUpperCase()}</td>
<td>${pageItem.city}</td> 
`;
    fetchIncome(`${pageItem.id}`);
    tableBody.append(trBody);
  
  }
  paginationButtons(numberOfPages);
}


//PAGINATION BUTTONS
let buttonDiv = document.getElementById("pagination")

const paginationButtons = (numberOfPages) => {
buttonDiv.innerText = "";

for (let i = 1; i < numberOfPages + 1; i++ ){
  
let button = document.createElement("button")
button.setAttribute("class","paginationButton")
button.innerText = i

button.addEventListener("click",()=>{
  currentPage = i;
  pagination(dataTable,currentPage);
})
buttonDiv.appendChild(button)
  }
}


// SECOND METHOD OF ADDING COMPANY !!!

// const addCompanies = async (dataTable) => {

//   for (let company of dataTable) {
//    const response = await fetch(
//           `https://recruitment.hal.skygate.io/incomes/` + company.id
//         )
//         let dataIncome = await response.json();

//   company = [company]
//   company.push(dataIncome)
// console.log(company,"company")
// console.log(company[1].incomes,"company incomes")

// let sum = 0;
//   company[1].incomes.forEach((item) => {
//     sum = sum + parseFloat(item.value);
//   });

// const trBody = document.createElement("tr");
//   trBody.setAttribute("id", `"${company[0].id}-td"`);
//   trBody.innerHTML = `
// <td>${company[0].id}</td>
// <td>${company[0].name.toUpperCase()}</td>
// <td>${company[0].city}</td> 
// <td>\$${sum.toFixed(2)}</td> 
// <td>\$${sum.toFixed(2)}</td> 
// <td>\$${sum.toFixed(2)}</td> 

// `;
// document.getElementById("tableBody").append(trBody);
//   }
// };


//FUNCTIONS SORTING
let order = true

//name
const nameSortHandler = () => {

  if (order === true){
  dataTable.sort((a, b) => {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  })};
  if (order === false){
    dataTable.sort((b, a) =>{
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    })};

    order=!order

  let tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  pagination(dataTable,currentPage);
};

//city
const citySortHandler = () => {
  if (order === true){
  dataTable.sort((a,b) =>{

  let cityA = a.city.toUpperCase();
  let cityB = b.city.toUpperCase();

  if (cityA < cityB){
    return -1;
  }
  if (cityA > cityB) {
    return 1;
  }
  return 0;

})};

if (order === false) {
  dataTable.sort((b,a)=>{
    
    let cityA = a.city.toUpperCase();
    let cityB = b.city.toUpperCase();

    if (cityA < cityB){
      return -1
    }

    if (cityA > cityB){
      return 1
    }
    return 0
  })
}
  order=!order
  let tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  pagination(dataTable,currentPage);
};

//company ID
const companyIdSortHandler = () => {

  if (order === true){
  dataTable.sort((a, b) => {
  return a.id - b.id}
  )};

 if (order === false){
    dataTable.sort((b,a) =>{
  return a.id - b.id}
    )};

    order=!order
  
  let tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  pagination(dataTable,currentPage);
};

//FETCH INCOMES OF COMPANY X SECOND METHOD !!!

const fetchIncome = async (id) => {
  try {
    const response = await fetch(
      `https://recruitment.hal.skygate.io/incomes/` + id
    );

    const dataIncome = await response.json();

    //total income
    let sum = 0;
    dataIncome.incomes.forEach((item) => {
      sum = sum + parseFloat(item.value);
    });

    //average income
    const averageIncome = sum / dataIncome.incomes.length;

    //last month income
    const sortedDates = dataIncome.incomes.sort(function (a, b) {
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
  
    // printing incomes
    const trBody = document.createElement("tr");
    trBody.setAttribute("class","incomeClass");
    trBody.innerHTML = `
   <td><strong>Total:</strong>\$${sum.toFixed(2)}</td>
   <td><strong>Average:</strong>\$${averageIncome.toFixed(2)}</td>
   <td><strong>Last month:</strong>\$${lastMonthIncome.toFixed(2)}</td>
     
    `;
    document.getElementById(`"${dataIncome.id}-td"`).append(trBody);
  } catch (error) {
    console.log(error);
  }
};

//FETCH INCOMES OF COMPANY X SECOND METHOD !!!

// const fetchIncome2 = (id) => {
//   fetch(`https://recruitment.hal.skygate.io/incomes/` + id)
//   .then(response => response.json())
//   .then(data => {console.log(data, "fetchIncome2")
//   //total income
//   let sum = 0;
//   data.incomes.forEach((item) => {
//     sum = sum + parseFloat(item.value);
//   });
  
//  // printing incomes
//  const trBody = document.createElement("tr");

//  trBody.innerHTML = `
// <td><strong>Total:</strong>\$${sum.toFixed(2)}</td>   
//  `;
//  document.getElementById(`"${data.id}-td"`).append(trBody);}) 
// }


//FILTERING INPUT

const inputHandler = () => {
 
  let tr, td, i, textValue, filter, input, tBody, trIncome

  input = document.getElementById("input")
  filter = input.value.toUpperCase();
  tBody = document.getElementById("tableBody")
  tr = tBody.getElementsByTagName("tr")
  

  for (i= 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1]
    
    if (td){
      textValue = td.innerText || td.textContent

        // if(textValue.toUpperCase().indexOf(filter) > -1) --> indexOf FILTERING METHOD

        if(textValue.toUpperCase().includes(filter.slice(1,15)))
         {
          tr[i].style.display = "";
         
        }
        else{
          tr[i].style.display = "none";
         
        }

    }
  }
}


//EVENTS
document.addEventListener("DOMContentLoaded", () => fetchCompanies());
name.addEventListener("click", nameSortHandler);
city.addEventListener("click", citySortHandler);
companyId.addEventListener("click", companyIdSortHandler);
input.addEventListener("keyup", inputHandler);
