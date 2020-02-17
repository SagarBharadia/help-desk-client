import React from 'react'
import Cookie from 'js-cookie';
import axios from 'axios';

function Protected(permission, Component, props) {
    // See if token exists and if it does then send request to see permission is allowed

    // If token doesn't exist, redirect to login route with callback to route they were trying to access

    // If token exists send request to API to see if allowed or not.

    return (
        <div>
            
        </div>
    )
}

export default Protected;
