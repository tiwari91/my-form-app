import React, { useState, useEffect } from "react";
import styles from "../styles/FormTemplate.module.css";
import { formatDate } from "../util/dateUtils";

export default function PublishedFormTemplates() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    fetchFormTemplates();
  }, []);

  const fetchFormTemplates = async () => {
    try {
      const response = await fetch("/api/db/getFormTemplates");
      if (response.ok) {
        const data = await response.json();
        setForms(data.forms);
      } else {
        console.error("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormChange = (event) => {
    const selectedFormId = event.target.value;
    const selectedForm = forms.find((form) => form.id === selectedFormId);

    setSelectedForm(selectedForm);
  };

  return (
    <>
      <div>
        <h2>Published Forms Templates:</h2>
        <select onChange={handleFormChange}>
          <option value="">Select Form Templates</option>
          {forms.map((form) => (
            <option key={form.id} value={form.id}>
              {form.formName}
            </option>
          ))}
        </select>
      </div>

      {selectedForm && (
        <div>
          <div className={styles.formContainer}>
            <p>Form Name: {selectedForm.formName}</p>
            <p>Published: {formatDate(selectedForm.createdAt)}</p>
            {selectedForm.formElements.map((element, index) => (
              <div key={index}>
                {element.type === "textbox" && (
                  <div className={styles.formElementContainer}>
                    <div>{element.question}</div>
                    <input
                      type="text"
                      value={element.value}
                      disabled={!element.editable}
                    />
                  </div>
                )}
                {element.type === "dropdown" && (
                  <div className={styles.formElementContainer}>
                    <div>{element.question}</div>
                    <select
                      value={element.selectedValue}
                      disabled={!element.editable}
                    >
                      {element.options &&
                        element.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option.label}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                {(element.type === "checkbox" ||
                  element.type === "radiobutton") && (
                  <div className={styles.formElementContainer}>
                    <div>{element.question}</div>
                    {element.options &&
                      element.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <input
                            type={
                              element.type === "checkbox" ? "checkbox" : "radio"
                            }
                            checked={option.isChecked}
                            disabled={!option.editable}
                          />
                          {option.label}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
