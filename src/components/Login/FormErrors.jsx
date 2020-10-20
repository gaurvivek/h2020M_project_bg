import React from "react";
import { FormHelperText } from "@material-ui/core";

const errorStyle = { margin: 0, paddingTop: "10px" };

export const FormErrors = ({ show, formErrors, fieldName }) => {
  if (
    show &&
    formErrors[fieldName] !== undefined &&
    formErrors[fieldName].length > 0
  ) {
    const errors = formErrors[fieldName];
    return (
      <FormHelperText className="error-class" style={errorStyle} error>
        {errors}
      </FormHelperText>
    );
  } else {
    return <FormHelperText className="error-class" style={errorStyle}>&nbsp;</FormHelperText>;
  }
};
