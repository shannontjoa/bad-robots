// @flow
import React from 'react';

const Theme = (props: { changeTheme: string => void }) => {
  const handleThemeChange = (event) => {
    props.changeTheme(event.currentTarget.value);
  };

  /* eslint-disable jsx-a11y/label-has-for */
  return (
    <section className="Status">
      <div>
        <label>Theme</label>
      </div>
      <select name="theme" onChange={handleThemeChange}>
        <option value="default">Default</option>
        <option value="mobile">Mobile OS</option>
      </select>
    </section>
  );
};

export default Theme;
