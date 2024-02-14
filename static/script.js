// Existing code to fetch and display JSON
fetch('packages.json')
.then(response => response.json())
.then(data => {
    displayJson(data);
})
.catch(error => console.error('Error loading JSON:', error));

function displayJson(data) {
    const contentDiv = document.getElementById('jsonContent');
    contentDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
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

