/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */
// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

async function fetchAndDisplayTrail() {
    const tableElement = document.getElementById('trailtable');
    if (!tableElement) return;

    const tableBody = tableElement.querySelector('tbody');
    if (!tableBody) return;

    const response = await fetch('/trail', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    tableBody.innerHTML = '';

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}



async function resetTrail() {
    const response = await fetch("/initiate-trail", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('initTrailMsg');
        messageElement.textContent = "Action Successful!";
        fetchTableData();
    } else {
        alert("Action could not be completed!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const nextBtn = document.getElementById("next");

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            window.location.href = "main.html";
        });
    }
});

async function insertTrail(event) {
    event.preventDefault();

    const trailId = document.getElementById('insertTrailId').value;
    const regionId = document.getElementById('insertRegionId').value;
    const name = document.getElementById('insertTrailName').value;
    const length = document.getElementById('insertLength').value;
    const sport = document.getElementById('insertSport').value;
    const terrain = document.getElementById('insertTerrain').value;
    const start = document.getElementById('insertStart').value;
    const end = document.getElementById('insertEnd').value;

    const response = await fetch('/insert-trail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            trailId,
            regionId,
            name,
            length,
            sport,
            terrain,
            start,
            end
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertTrailMessage');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function updateTrail(event) {
    event.preventDefault();

    const trailId = document.getElementById('updateTrailId').value;
    const regionId = document.getElementById('updateRegionId').value;
    const name = document.getElementById('updateTrailName').value;
    const length = document.getElementById('updateLength').value;
    const sport = document.getElementById('updateSport').value;
    const terrain = document.getElementById('updateTerrain').value;
    const start = document.getElementById('updateStart').value;
    const end = document.getElementById('updateEnd').value;

    const response = await fetch('/update-trail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            trailId,
            regionId,
            name,
            length,
            sport,
            terrain,
            start,
            end
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateTrailMessage');

    if (responseData.success) {
        messageElement.textContent = "Trail updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating Trail!";
    }
}

async function deleteTrail(event) {
    event.preventDefault();

    const trailId = document.getElementById('deleteTrailID').value;

    const response = await fetch('/delete-trail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            trailId
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteTrailMsg');

    if (responseData.success) {
        messageElement.textContent = "The record was successfully deleted";
        fetchTableData();
    } else {
        messageElement.textContent = "Action unsuccessful!";
    }
}

async function resetUser() {
    const response = await fetch("/initiate-user", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('initUserMsg');
        messageElement.textContent = "Action Successful!";
        fetchTableData();
    } else {
        alert("Action could not be completed!");
    }
}

async function createUser(event) {
    event.preventDefault();

    const username = document.getElementById('insertUsername').value;
    const email = document.getElementById('insertEmail').value;
    const phoneNum = document.getElementById('insertPhoneNum').value;
    const hometown = document.getElementById('insertHometown').value;

    const response = await fetch('/create-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            phoneNum,
            hometown
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('createUserMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Username, email, or phone number in use!";
    }
}

async function resetGroup() {
    const response = await fetch("/initiate-group", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('initGroupMsg');
        messageElement.textContent = "Action Successful!";
        fetchTableData();
    } else {
        alert("Action could not be completed!");
    }
}

async function createGroup(event) {
    event.preventDefault();

    const groupID = document.getElementById('insertGroupID').value;
    const username = document.getElementById('insertUsername').value;
    const experience = document.getElementById('insertExperience').value;

    const response = await fetch('/create-group', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            groupID,
            username,
            experience,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('createGroupMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        updateTrail(responseData.data);
        fetchTableData();
    } else {
        messageElement.textContent = "GroupID in use!";
    }
}

async function fetchAndDisplayLargestGroup() {
    const tableElement = document.getElementById('largest-group');
    if (!tableElement) return; // Prevents crash if the table doesn't exist

    const tableBody = tableElement.querySelector('tbody');
    if (!tableBody) return; // Prevents crash if tbody is missing

    try {
        const response = await fetch('/largest-group', {
            method: 'GET'
        });

        const responseData = await response.json();
        const largestGroupData = responseData.data;

        tableBody.innerHTML = ''; // Clear previous data

        largestGroupData.forEach(rowData => {
            const row = tableBody.insertRow();
            rowData.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
    } catch (error) {
        console.error('Error fetching trail data:', error);
    }
}

async function fetchAndDisplayProfessionalGroup() {
    const tableElement = document.getElementById('professional-group');
    if (!tableElement) return; // Prevents crash if the table doesn't exist

    const tableBody = tableElement.querySelector('tbody');
    if (!tableBody) return; // Prevents crash if tbody is missing

    try {
        const response = await fetch('/professional-group', {
            method: 'GET'
        });

        const responseData = await response.json();
        const professionalGroupData = responseData.data;

        tableBody.innerHTML = ''; // Clear previous data

        professionalGroupData.forEach(rowData => {
            const row = tableBody.insertRow();
            rowData.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
    } catch (error) {
        console.error('Error fetching trail data:', error);
    }
}

// fetching Ends

async function handleTrailSelection(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    let conditions = [];

    let col1 = formData.get('col1');
    let op1 = formData.get('op1');
    let val1 = formData.get('val1');
    let conn1 = formData.get('conn1');

    if (col1 && op1 && val1) {
        conditions.push({
            column: col1,
            operator: op1,
            value: val1,
            connector: conn1
        });
    }

    let col2 = formData.get('col2');
    let op2 = formData.get('op2');
    let val2 = formData.get('val2');
    let conn2 = formData.get('conn2');

    if (col2 && op2 && val2) {
        conditions.push({
            column: col2,
            operator: op2,
            value: val2,
            connector: conn2
        });
    }

    const response = await fetch('/trail-select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conditions })
    });

    const data = await response.json();
    if (data.success) {
        const resultsDiv = document.getElementById("trailSelectResults");
        const tableHtml = createHtmlTableFromRows(data.data, data.meta);
        resultsDiv.innerHTML = tableHtml;
    } else {
        alert("Error performing selection");
    }
}

async function handleTrailProjection(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const cols = formData.getAll('cols');

    const response = await fetch('/trail-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns: cols })
    });

    const data = await response.json();
    if (data.success) {
        const resultsDiv = document.getElementById("trailProjectionResults");
        const tableHtml = createHtmlTableFromRows(data.data, data.meta);
        resultsDiv.innerHTML = tableHtml;
    } else {
        alert("Error performing projection");
    }
}

async function resetRegion() {
    const response = await fetch("/initiate-region", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('initRegionMsg');
        messageElement.textContent = "Action Successful!";
        fetchTableData();
    } else {
        alert("Action could not be completed!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const nextBtn = document.getElementById("next");

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            window.location.href = "main.html";
        });
    }
});

async function insertRegion(event) {
    event.preventDefault();

    const regionId = document.getElementById('regionInsertRegionId').value;
    const terrain = document.getElementById('regionInsertTerrain').value;
    const city = document.getElementById('regionInsertCity').value;
    const phone = document.getElementById('regionInsertPhone').value;

    const response = await fetch('/insert-region', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            regionId,
            terrain,
            city,
            phone
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertRegionMessage');

    if (responseData.success) {
        messageElement.textContent = "Region inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function fetchAndDisplayRegion() {
    const tableElement = document.getElementById('regiontable');
    if (!tableElement) return;

    const tableBody = tableElement.querySelector('tbody');
    if (!tableBody) return;

    const response = await fetch('/region', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    tableBody.innerHTML = '';

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


async function fetchAndDisplayJoin() {
    const tableElement = document.getElementById('join-table');
    if (!tableElement) return;

    const tableBody = tableElement.querySelector('tbody');
    if (!tableBody) return;

    const response = await fetch('/join', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    tableBody.innerHTML = '';

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


async function fetchAndDisplayUserGroups() {
    const tableElement = document.getElementById('user-groups');
    if (!tableElement) return;

    const tableBody = tableElement.querySelector('tbody');
    if (!tableBody) return;

    const response = await fetch('/user-groups', {
        method: 'GET'
    });

    const responseData = await response.json();
    const userGroups = responseData.data;

    tableBody.innerHTML = '';

    userGroups.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function addUser(event) {
    event.preventDefault();

    const groupID = document.getElementById('insertGroupID').value;
    const username = document.getElementById('insertUsername').value;

    const response = await fetch('/add-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            groupID,
            username
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('addUserMsg');

    if (responseData.success) {
        messageElement.textContent = "User inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "User or group does not exist!";
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    const initTrailBtn = document.getElementById("initTrailBtn");
    if (initTrailBtn) {
        initTrailBtn.addEventListener("click", resetTrail);
    }

    const insertTrailForm = document.getElementById("insertTrail");
    if (insertTrailForm) {
        insertTrailForm.addEventListener("submit", insertTrail);
    }

    const updateTrailBtn = document.getElementById("updateTrail");
    if (updateTrailBtn) {
        updateTrailBtn.addEventListener("submit", updateTrail);
    }

    const deleteTrailBtn = document.getElementById("deleteTrail");
    if (deleteTrailBtn) {
        deleteTrailBtn.addEventListener("submit", deleteTrail)
    }

    const initUserBtn = document.getElementById("initUserBtn");
    if (initUserBtn) {
        initUserBtn.addEventListener("click", resetUser);
    }

    const createUserBtn = document.getElementById("createUser");
    if (createUserBtn) {
        createUserBtn.addEventListener("submit", createUser);
    }

    const initGroupBtn = document.getElementById("initGroupBtn");
    if (initGroupBtn) {
        initGroupBtn.addEventListener("click", resetGroup);
    }

    const createGroupBtn = document.getElementById("createGroup");
    if (createGroupBtn) {
        createGroupBtn.addEventListener("submit", createGroup);
    }
    const trailSelectForm = document.getElementById("trailSelectForm");
    if (trailSelectForm) {
        trailSelectForm.addEventListener("submit", handleTrailSelection);
    }

    const trailProjectionForm = document.getElementById("trailProjectionForm");
    if (trailProjectionForm) {
        trailProjectionForm.addEventListener("submit", handleTrailProjection);
    }

    const initRegionBtn = document.getElementById("initRegionBtn");
    if (initRegionBtn) {
        initRegionBtn.addEventListener("click", resetRegion);
    }

    const insertRegionForm = document.getElementById("insertRegion");
    if (insertRegionForm) {
        insertRegionForm.addEventListener("submit", insertRegion);
    }

    const addUserForm = document.getElementById("addUser");
    if (addUserForm) {
        addUserForm.addEventListener("submit", addUser);
    }
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayTrail();
    fetchAndDisplayLargestGroup();
    fetchAndDisplayProfessionalGroup();
    fetchAndDisplayRegion();
    fetchAndDisplayJoin();
    fetchAndDisplayUserGroups();
}

function createHtmlTableFromRows(rows, meta) {
    if (!rows || rows.length === 0) {
        return "<p>No results found.</p>";
    }

    let html = "<table border='1' style='border-collapse: collapse;'><thead><tr>";
    meta.forEach(col => {
        html += `<th>${col.name}</th>`;
    });
    html += "</tr></thead><tbody>";

    rows.forEach(row => {
        html += "<tr>";
        meta.forEach(col => {
            html += `<td style="padding: 6px 10px;">${row[col.name] !== null ? row[col.name] : ""}</td>`;
        });
        html += "</tr>";
    });

    html += "</tbody></table>";
    return html;
}
  
document.addEventListener("DOMContentLoaded", () => {
    const btnAllSports = document.getElementById("btnDivisionAllSports");
    if (btnAllSports) {
      btnAllSports.addEventListener("click", fetchDivisionRegionsAllSports);
    }
  });
  
  async function fetchDivisionRegionsAllSports() {
    try {
      const response = await fetch('/division-regions-all-sports');
      const data = await response.json();
      const resultDiv = document.getElementById("divisionResults");
  
      if (data.success) {
        const html = createHtmlTableFromRows(data.data, data.meta);
        resultDiv.innerHTML = html;
      } else {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
      }
    } catch (error) {
      console.error("Error fetching division results:", error);
    }
}
 