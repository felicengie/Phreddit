import React from 'react';

const ErrorMessage = ({ message }) => (
    <div className="error-message" style={{ color: 'red' }}>
        {message}
    </div>
);

export default ErrorMessage;