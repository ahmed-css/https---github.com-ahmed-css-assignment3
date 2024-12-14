// API Endpoint
const apiUrl = 'https://data.gov.bh/api/explore/v2.1/catalog/datasets/01-statistics-of-students-nationalities_updated/records?where=colleges%20like%20%22IT%22%20AND%20the_programs%20like%20%22bachelor%22&limit=100';

// Fetch data from the API
async function fetchData() {
    const errorMessage = document.getElementById('error-message');
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.records && data.records.length > 0) {
            populateTable(data.records.map(record => record.fields));
        } else {
            throw new Error("No data available from API.");
        }
    } catch (error) {
        console.error('Error fetching data from API:', error);
        errorMessage.textContent = "Loading local data as fallback...";
        errorMessage.style.display = "block";
        fetchLocalData();
    }
}

// Fetch data from local JSON file
async function fetchLocalData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        populateTable(data);
    } catch (error) {
        console.error('Error fetching local data:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = "Failed to load local data.";
    }
}

// Populate table with data
function populateTable(records) {
    const tableBody = document.getElementById('data-table');
    tableBody.innerHTML = ''; // Clear any existing rows

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.year || "N/A"}</td>
            <td>${record.semester || "N/A"}</td>
            <td>Number of students enrolled in bachelor programs</td>
            <td>${record.nationality || "N/A"}</td>
            <td>${record.colleges || "N/A"}</td>
            <td>${record.number_of_students || "N/A"}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch data on page load
fetchData();
