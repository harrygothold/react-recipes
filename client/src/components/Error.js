import React from "react";

const Error = ({ error }) => error && <p>{error.message}</p>;

export default Error;
