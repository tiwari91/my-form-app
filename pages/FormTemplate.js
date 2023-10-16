import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/FormTemplate.module.css";

export default function FormTemplate() {
  const [formName, setFormName] = useState("");
  const [formElements, setFormElements] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      fetchLatestForm();
    }
  }, [loading]);

  const handleCheckboxChange = (e, index) => {
    const isChecked = e.target.checked;
    const updatedFormElements = [...formElements];
    updatedFormElements[index].isChecked = isChecked;
    setFormElements(updatedFormElements);
  };

  const handleTextboxChange = (e, index) => {
    const newValue = e.target.value;
    const updatedFormElements = [...formElements];
    updatedFormElements[index].value = newValue;
    setFormElements(updatedFormElements);
  };

  const handleRadioChange = (e, index, value) => {
    const updatedFormElements = [...formElements];
    updatedFormElements[index].selectedValue = value;
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
        const existingForm = await checkFormExistence(form.formName);
        console.log("existingForm", existingForm);
        if (existingForm) {
          setFormElements([...existingForm.formElements]);
          setFetched(true);
          await saveMergedForm(form.formName, existingForm.formElements);
        } else {
          setFormElements([...form.formElements]);
        }
      } else {
        console.error("Failed to fetch the latest form.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      console.log("false");
      setLoading(false);
    }
  };

  const checkFormExistence = async (formName) => {
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

  const handleSave = async () => {
    const formData = {
      formName,
      formElements,
    };

    try {
      formSchema.parse(formData);

      const response = await fetch("/api/db/saveForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/Form");
      } else {
        console.error("Failed to save the form.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors);
      } else {
        console.error("Error:", error);
      }
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
                    onChange={(e) => handleDropdownChange(e, index)}
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
                    onChange={(e) => handleCheckboxChange(e, index)}
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
                    onChange={(e) => handleTextboxChange(e, index)}
                  />
                </div>
              )}
              {element.type === "radiobutton" && (
                <div>
                  <input
                    type="radio"
                    id={`radioId1-${index}`}
                    name={`radioGroup-${index}`}
                    value="radioValue1"
                    checked={element.selectedValue === "radioValue1"}
                    onChange={(e) =>
                      handleRadioChange(index, index, "radioValue1")
                    }
                  />
                  <label htmlFor={`radioId1-${index}`}>Radio 1</label>
                  <input
                    type="radio"
                    id={`radioId2-${index}`}
                    name={`radioGroup-${index}`}
                    value="radioValue2"
                    checked={element.selectedValue === "radioValue2"}
                    onChange={(e) =>
                      handleRadioChange(index, index, "radioValue2")
                    }
                  />
                  <label htmlFor={`radioId2-${index}`}>Radio 2</label>
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
