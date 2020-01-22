import React from 'react';

const useForm = initialValues => {
  const [values, setValues] = React.useState(initialValues);
  return [
    values,
    e => {
        console.log(e.target.value);
      setValues({
        ...values,
        [e.target.name] : e.target.value
      });
    }
 ]; 
}

export default useForm;