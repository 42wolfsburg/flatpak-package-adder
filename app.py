from flask import Flask, request, jsonify, send_from_directory
import os
import json
import requests

app = Flask(__name__, static_folder='static', static_url_path='/static')

# Serve your index.html
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Serve static files
@app.route('/<path:path>')
def static_file(path):
    return send_from_directory('.', path)

@app.route('/app.py')
def no():
    return "no", 404

def verify_package(package):
    if "name" not in package:
        return False, "Name is required"
    if "package_name" not in package:
        return False, "Package_name is required"
    if "category" not in package:
        return False, "Category is required"
    
    if package["name"] == "":
        return False, "Name cannot be empty"
    if package["package_name"] == "":
        return False, "Package_name cannot be empty"
    if package["category"] == "":
        return False, "Category cannot be empty"

    resp = requests.get('https://flathub.org/apps/' + package["package_name"])
    if resp.status_code != 200:
        return False, "Package not found"

    return True, "Valid package"

#
@app.route('/delete_element', methods=['POST'])
def delete_element():
    if request.method == 'POST':
        new_data = request.json
        json_file_path = 'packages.json'

        # Load existing data
        if os.path.exists(json_file_path):
            with open(json_file_path, 'r') as file:
                data = json.load(file)
        else:
            data = []

        
        package_index = next((i for i, package in enumerate(data["packages"]) if package["package_name"] == new_data["package_name"]), None)

        # Check if a package was found
        if package_index is not None:
            # Remove the package from the list
            del data["packages"][package_index]
            print(f"Package '{new_data['package_name']}' deleted.")
        else:
            print("Package not found.")         
        
        # Save the updated data
        with open(json_file_path, 'w') as file:
            json.dump(data, file, indent=4)
        
        return jsonify({"success": True, "message": "Element deleted successfully"}), 200

        

# API endpoint to add an element to the JSON file
@app.route('/add_element', methods=['POST'])
def add_element():
    if request.method == 'POST':
        new_data = request.json
        json_file_path = 'packages.json' # Make sure this path is correct
        
        # Verify the new element
        is_valid, message = verify_package(new_data)
        if not is_valid:
            return jsonify({"success": False, "message": message}), 400


        # Load existing data
        if os.path.exists(json_file_path):
            with open(json_file_path, 'r') as file:
                data = json.load(file)
        else:
            data = []

        print(new_data)
        # Add the new element
        data["packages"].append(new_data)
        
        # Save the updated data
        with open(json_file_path, 'w') as file:
            json.dump(data, file, indent=4)
    
        os.system('systemctl restart ftpkg-catalog.service')

        return jsonify({"success": True, "message": "Element added successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0')
