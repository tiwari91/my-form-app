import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/FormTemplate.module.css";
import { z } from "zod";

const formSchema = z.object({
  formName: z.string().min(1, "Form name cannot be empty"),
});

export default function FormTemplate() {
  const [formName, setFormName] = useState("");
  const [formElements, setFormElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formSaving, setFormSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (loading && !formSaving) {
      fetchLatestForm();
    }
  }, [loading, formSaving]);

  const handleFormNameChange = (e) => {
    setFormName(e.target.value);
  };

  const handleCheckboxChange = (e, index, optionIndex) => {
    const isChecked = e.target.checked;
    const updatedFormElements = [...formElements];
    updatedFormElements[index].options[optionIndex].isChecked = isChecked;
    setFormElements(updatedFormElements);
  };

  const handleTextboxChange = (e, index) => {
    const newValue = e.target.value;
    const updatedFormElements = [...formElements];
    updatedFormElements[index].value = newValue;
    setFormElements(updatedFormElements);
  };

  const handleRadioChange = (e, index, optionIndex) => {
    const updatedFormElements = [...formElements];
    updatedFormElements[index].options.forEach((option, i) => {
      option.isChecked = i === optionIndex;
    });
    setFormElements(updatedFormElements);
  };

  const handleDropdownChange = (e, index) => {
    const selectedValue = e.target.value;
    const updatedFormElements = [...formElements];
    updatedFormElements[index].selectedValue = selectedValue;
    setFormElements(updatedFormElements);
  };

  const fetchLatestForm = async () => {
    try {
      const response = await fetch("/api/db/getLatestForm");
      if (response.ok) {
        const { form } = await response.json();
        setFormName(form.formName);
        setFormElements([...form.formElements]);

        // const existingForm = await checkForExistingForm(form.formName);

        // if (!existingForm) {
        //   setFormName(form.formName);

        //   const existingForm = await checkForAutoFill(form.formName);
        //   if (existingForm) {
        //     setFormElements([...existingForm.formElements]);
        //     await saveMergedForm(form.formName, existingForm.formElements);
        //   } else {
        //     setFormElements([...form.formElements]);
        //   }
        // }
      } else {
        console.error("Failed to fetch the latest form.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // to avoid saving duplicate
  const checkForExistingForm = async (formName) => {
    try {
      const response = await fetch(
        `/api/db/checkForExistingForm?formName=${formName}
        )}`
      );
      if (response.ok) {
        const { existingForm } = await response.json();
        return existingForm;
      }
      return null;
    } catch (error) {
      console.error("Error checking for existing form:", error);
      return null;
    }
  };

  // autofills the form
  const checkForAutoFill = async (formName) => {
    try {
      const response = await fetch(`/api/db/checkForm?formName=${formName}`);
      if (response.ok) {
        const { existingForm } = await response.json();
        return existingForm;
      }
      return null;
    } catch (error) {
      console.error("Error checking form existence:", error);
      return null;
    }
  };

  const saveMergedForm = async (formName, mergedFormElements) => {
    try {
      const formData = {
        formName,
        formElements: mergedFormElements,
      };

      const response = await fetch("/api/db/saveForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Form saved successfully.");
      } else {
        console.error("Failed to save the form.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = {
      formName,
      formElements,
    };

    try {
      formSchema.parse(formData);
      setFormSaving(true);

      const response = await fetch("/api/db/saveFormTemplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/");
        setFormSaving(false);
      } else {
        console.error("Failed to save the form.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors);
      } else {
        console.error("Error:", error);
      }
    } finally {
      setFormSaving(true);
    }
  };

  return (
    <div>
      <div>
        <Link href="/">Home</Link>
      </div>

      <h2>Form Template:</h2>

      <form>
        <div className={styles.formContainer}>
          <div>
            <label htmlFor="formName">Form Name:</label>
            <input
              type="text"
              placeholder="Enter the Form Name"
              value={formName}
              onChange={handleFormNameChange}
            />
          </div>
          {validationErrors.length > 0 && (
            <div className={styles.errorMessage}>
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}
          {formElements.map((element, index) => (
            <div key={index}>
              {element.type === "textbox" && (
                <div className={styles.formElementContainer}>
                  <div>{element.question}</div>
                  <input
                    type="text"
                    id={`textBoxId-${index}`}
                    name={`textBoxName-${index}`}
                    value={element.value}
                    onChange={(e) => handleTextboxChange(e, index)}
                  />
                </div>
              )}

              {element.type === "dropdown" && (
                <div className={styles.formElementContainer}>
                  <div>{element.question}</div>
                  <select
                    id={`dropdownId-${index}`}
                    value={element.selectedValue}
                    onChange={(e) => handleDropdownChange(e, index)}
                  >
                    {element.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {element.type === "checkbox" && (
                <div className={styles.formElementContainer}>
                  <div>{element.question}</div>
                  {element.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="checkbox"
                        id={`checkboxId-${index}-${optionIndex}`}
                        name={`checkboxName-${index}`}
                        checked={option.isChecked}
                        onChange={(e) =>
                          handleCheckboxChange(e, index, optionIndex)
                        }
                      />
                      {option.label}
                    </div>
                  ))}
                </div>
              )}

              {element.type === "radiobutton" && (
                <div className={styles.formElementContainer}>
                  <div>{element.question}</div>
                  {element.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="radio"
                        id={`radioId1-${index}`}
                        name={`radioGroup-${index}`}
                        checked={option.isChecked}
                        onChange={(e) =>
                          handleRadioChange(e, index, optionIndex)
                        }
                      />
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.saveBtn}>
          <button onClick={handleSave} type="submit">
            Save Form
          </button>
        </div>
      </form>
    </div>
  );
}
