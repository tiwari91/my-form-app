import React, { useState, useEffect } from "react";
import styles from "../styles/FormTemplate.module.css";
import { formatDate } from "../util/dateUtils";

export default function PublishedFormBuilder() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    fetchFormBuilder();
  }, []);

  const fetchFormBuilder = async () => {
    try {
      const response = await fetch("/api/db/getForm");
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
    <div className={styles.container}>
      <div>
        <h2>Published Form Builders:</h2>
        <select onChange={handleFormChange}>
          <option value="">Select Form Builder</option>
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
                    {element.options &&
                      element.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <input
                            type="text"
                            value={option.label}
                            disabled={!option.editable}
                          />
                        </div>
                      ))}
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
                            checked={option.selected}
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
    </div>
  );
}
