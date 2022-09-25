import React from 'react';

const fieldTypes = {
  text: ({value, onChange, placeholder}) => (
    <input
      className="form-control form-control-lg"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  ),
  textarea: ({value, onChange, placeholder}) => (
    <textarea
      className="form-control form-control-lg"
      placeholder={placeholder}
      value={value}
      rows="6"
      onChange={onChange}
    />
  ),
  password: ({value, onChange}) => (
    <input
      className="form-control form-control-lg"
      value={value}
      onChange={onChange}
      type="password"
    />
  ),
};

export default fieldTypes;
