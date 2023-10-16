import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/FormTemplate.module.css";

export default function FormTemplate() {
  const [formName, setFormName] = useState("");
  const [formElements, setFormElements] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchLatestForm();
  }, []);

  const fetchLatestForm = async () => {
    try {
      const response = await fetch("/api/db/getLatestForm");
      if (response.ok) {
        const { form } = await response.json();
        setFormName(form.formName);
        console.log("formElements", form.formElements);
        setFormElements(form.formElements);
      } else {
        console.error("Failed to fetch the latest form.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div>
        <Link href="/Form">Home</Link>
      </div>

      <h2>Form Template:</h2>

      <form>
        <div>
          <div>
            <label htmlFor="formName">Form Name:</label>
            <input
              type="text"
              placeholder="Enter the Form Name"
              value={formName}
            />
          </div>
          {formElements.map((element, index) => (
            <div key={index}>
              {element.type === "dropdown" && (
                <div>
                  <label htmlFor={`dropdownId-${index}`}>Dropdown Label</label>
                  <select
                    id={`dropdownId-${index}`}
                    value={element.selectedValue}
                    //    onChange={(e) => handleDropdownChange(e, index)}
                  >
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                </div>
              )}

              {element.type === "checkbox" && (
                <div>
                  <label htmlFor={`checkboxId-${index}`}>Checkbox Label</label>
                  <input
                    type="checkbox"
                    id={`checkboxId-${index}`}
                    name={`checkboxName-${index}`}
                    checked={element.isChecked}
                    // onChange={(e) => handleCheckboxChange(e, index)}
                  />
                </div>
              )}
              {element.type === "textbox" && (
                <div>
                  <label htmlFor={`textBoxId-${index}`}>Textbox Label</label>
                  <input
                    type="text"
                    id={`textBoxId-${index}`}
                    name={`textBoxName-${index}`}
                    value={element.value}
                    // onChange={(e) => handleTextboxChange(e, index)}
                  />
                </div>
              )}
              {element.type === "radiobutton" && (
                <div>
                  <input
                    type="radio"
                    id={`radioId1-${index}`}
                    name={`radioGroup-${index}`} // Add a unique name for this group
                    value="radioValue1"
                    checked={element.selectedValue === "radioValue1"} // Check if selectedValue matches
                    //  onChange={(e) => handleRadioChange(index, e.target.value)}
                  />
                  <label htmlFor={`radioId1-${index}`}>Radio 1</label>
                  <input
                    type="radio"
                    id={`radioId2-${index}`}
                    name={`radioGroup-${index}`} // Add the same unique name
                    value="radioValue2"
                    checked={element.selectedValue === "radioValue2"} // Check if selectedValue matches
                    //    onChange={(e) => handleRadioChange(index, e.target.value)}
                  />
                  <label htmlFor={`radioId2-${index}`}>Radio 2</label>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.saveBtn}>
          <button type="submit">Save Form</button>
        </div>
      </form>
    </div>
  );
}
