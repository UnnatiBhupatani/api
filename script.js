let currentPage = 1; 
const limit = 10; 
let editIndex = null;

async function fetchAndDisplayData(page = 1) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
    );
    const data = await response.json();

    
    const totalRecords = response.headers.get("X-Total-Count");
    const totalPages = Math.ceil(totalRecords / limit);

    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = "";

    data.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.userId}</td>
        <td>${user.id}</td>
        <td>${user.title}</td>
        <td>${user.body}</td>
        <td>
          <button data-bs-toggle="modal" data-bs-target="#myModal" onclick="updateData(${user.id})" class="btn btn-warning btn-sm">
            <i class="bi bi-pencil-square"></i>
          </button>
        </td>
        <td>
          <button onclick="deleteData(${user.id})" class="btn btn-danger btn-sm">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

 
    const prevButton = document.createElement("li");
    prevButton.classList.add("page-item");
    if (page === 1) prevButton.classList.add("disabled");
    prevButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${
      page - 1
    })">Previous</a>`;
    pagination.appendChild(prevButton);

    
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("li");
      pageButton.classList.add("page-item");
      if (page === i) pageButton.classList.add("active");
      pageButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
      pagination.appendChild(pageButton);
    }

  
    const nextButton = document.createElement("li");
    nextButton.classList.add("page-item");
    if (page === totalPages) nextButton.classList.add("disabled");
    nextButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${
      page + 1
    })">Next</a>`;
    pagination.appendChild(nextButton);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


function changePage(page) {
  if (page > 0 && page !== currentPage) {
    currentPage = page; // Update the current page
    fetchAndDisplayData(currentPage); // Fetch data for the new page
  }
}


async function addData() {
  let id = document.getElementById("id").value.trim();
  let userId = document.getElementById("userId").value.trim();
  let title = document.getElementById("title").value.trim();
  let body = document.getElementById("body").value.trim();

  if (editIndex !== null) {
 
    await fetch(`https://jsonplaceholder.typicode.com/posts/${editIndex}`, {
      method: "PUT",
      body: JSON.stringify({ id, userId, title, body }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Data updated",json);
        alert("Data updated successfully!");
        editIndex = null;
        document.getElementById("submit").textContent = "Submit";
        fetchAndDisplayData(currentPage); // Refresh data
        resetForm();
      });
  } else {
   
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({ title, body, userId }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((json) => {
         console.log("data added",json);
        alert("Data added successfully!");
       
        fetchAndDisplayData(currentPage); // Refresh data
        resetForm();
      });
  }
}


async function updateData(id) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    const user = await response.json();

    document.getElementById("id").value = user.id;
    document.getElementById("userId").value = user.userId;
    document.getElementById("title").value = user.title;
    document.getElementById("body").value = user.body;
    editIndex = id;

    document.getElementById("submit").textContent = "Update";
  } catch (error) {
    console.error("Error fetching data for update:", error);
  }
}


async function deleteData(id) {
  try {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    });
    console.log(`Data with id ${id} deleted`);
    alert(`Data with id ${id} deleted successfully!`);
    fetchAndDisplayData(currentPage); // Refresh data
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

// Reset Modal Form
function resetForm() {
  document.getElementById("id").value = "";
  document.getElementById("userId").value = "";
  document.getElementById("title").value = "";
  document.getElementById("body").value = "";
  document.getElementById("submit").textContent = "Submit";
  editIndex = null;
}

// Load initial data
window.onload = () => fetchAndDisplayData(currentPage);
