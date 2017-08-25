import React from 'react';
const Theme = (props) => {
    const handleThemeChange = (event) => {
      props.changeTheme(event.currentTarget.value);
    }
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