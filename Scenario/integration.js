import http from 'k6/http';
import { check } from 'k6';

//Create a new user
export default function () {
    let postData = {
        "name": "morpheus",
        "job": "leader"
    };

    // Send a request to create a new user
    let createResponse = http.post('https://reqres.in/api/users/', JSON.stringify(postData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Check if the user creation was successful
    check(createResponse, {
        'Create user status is 201': (r) => r.status === 201,
        'Create user contains ID': (r) => {
            let createdData = JSON.parse(r.body);
            if (!createdData.hasOwnProperty('id')) {
                console.error('Response does not contain ID property:', r.body);
                return false;
            }
            if (isNaN(Number(createdData.id))) {
                console.error('ID is not a number:', createdData.id);
                return false;
            }
            return true;
        },
    });

    // Get the ID of the created user for the update test
    let assetId = JSON.parse(createResponse.body).id;

    // Log the full response of the create user request
    console.log('Full Create Response:', createResponse.body);

    // Update the user information
    let updateData = {
        "name": "morpheus",
        "job": "zion resident"
    };

     // Send a request to update the user information
    let updateResponse = http.put(`https://reqres.in/api/users/${assetId}`, JSON.stringify(updateData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Check if the user information was updated successfully
    check(updateResponse, {
        'Update user status is 200': (r) => r.status === 200,
        'Update user contains updated data': (r) => {
            let updatedData = JSON.parse(r.body);
            return updatedData.name === "morpheus";
        },
    });

    // Log the full response of the update user request
    console.log('Full Update Response:', updateResponse.body);
}
