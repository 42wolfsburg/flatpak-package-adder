// Existing code to fetch and display JSON
fetch('packages.json')
.then(response => response.json())
.then(data => {
    displayJson(data);
})
.catch(error => console.error('Error loading JSON:', error));

function deleteElement(index) {
    // Assuming 'data' is your JSON array
    data = document.getElementById('jsonTable').getElementsByTagName('tbody')[0].rows[index]
    document.getElementById('jsonTable').getElementsByTagName('tbody')[0].deleteRow(index); // Remove the row from the table

    console.log(data.cells[0].innerText, data.cells[1].innerText, data.cells[2].innerText)
    fetch('/delete_element', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.cells[0].innerText, package_name: data.cells[1].innerText, category: data.cells[2].innerText }),
    })
}

function displayJson(data) {
    const tableBody = document.getElementById('jsonTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; // Clear existing table rows

    data["packages"].forEach((item, index) => {
        let row = tableBody.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);

        cell1.innerHTML = item.name;
        cell2.innerHTML = item.package_name;
        cell3.innerHTML = item.category;

        // Create a delete button
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('onclick', `deleteElement(${index})`); // Set the onclick attribute to call deleteElement function
        cell4.appendChild(deleteButton);
    });
}

// New code for adding elements
document.getElementById('addElementBtn').addEventListener('click', () => {
    document.getElementById('addElementForm').style.display = 'block';
});

document.getElementById('submitBtn').addEventListener('click', () => {
    const newNameValue = document.getElementById('name').value;
    const newPackage_nameValue = document.getElementById('package_name').value;
    const newCategoryValue = document.getElementById('category').value;
    
    // Send a POST request to the Flask server
    fetch('/add_element', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newNameValue, package_name: newPackage_nameValue, category: newCategoryValue }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success === false) {
            alert('Error adding element\n' + data.message);
            return;
        }
        console.log('Success:', data);
        // Reload or update the page content as needed
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

