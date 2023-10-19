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
  const [id, setId] = useState("");
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

  const fetchLatestForm = async () => {
    try {
      const response = await fetch("/api/db/getLatestForm");
      if (response.ok) {
        const { form } = await response.json();
        setFormName(form.formName);

        const mergedFormElements = await checkForAutoFill(
          form.formName,
          form.formElements
        );

        if (mergedFormElements) {
          setFormElements([...mergedFormElements]);
          setId(form.id);
        } else {
          setFormElements([...form.formElements]);
        }
      } else {
        console.error("Failed to fetch the latest form.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // autofills the form
  const checkForAutoFill = async (formName, formElements) => {
    try {
      const response = await fetch(`/api/db/checkForm?formName=${formName}`);
      if (response.ok) {
        const { existingForm } = await response.json();

        const existingFormElements = existingForm?.formElements;
        const mergedFormElements = mergeFormElements(
          formElements,
          existingFormElements
        );

        return mergedFormElements;
      }
      return null;
    } catch (error) {
      console.error("Error checking form existence:", error);
      return null;
    }
  };

  const mergeFormElements = (formElements, existingFormElements) => {
    return formElements.map((formElement) => {
      const matchingExistingElement = existingFormElements.find(
        (existingElement) =>
          existingElement.question === formElement.question &&
          existingElement.type === formElement.type
      );

      if (matchingExistingElement) {
        formElement.options = matchingExistingElement.options;
        formElement.value = matchingExistingElement.value;
      }

      if (formElement.type === "dropdown") {
        formElement.selectedValue = matchingExistingElement.selectedValue;
      }
      return formElement;
    });
  };

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
    <div className={styles.container}>
      <div>
        <Link className={styles.link} href="/">
          Home
        </Link>
      </div>

      <h2 className={styles.header}>Form Template:</h2>

      <form>
        <div className={styles.formContainer}>
          <div>
            <label className={styles.label} htmlFor="formName">
              Form Name:
            </label>
            <input
              type="text"
              className={styles.input}
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
                    className={styles.labelInput}
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
                    className={styles.select}
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
                        className={styles.optionInput}
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
          <button className={styles.saveBtn} onClick={handleSave} type="submit">
            Save Form
          </button>
        </div>
      </form>
    </div>
  );
}
