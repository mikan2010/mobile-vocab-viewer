import React from "react";

export function Input(props) {
  return (
    <input
      {...props}
      className={`border rounded-md p-2 w-full ${props.className || ''}`}
    />
  );
}
