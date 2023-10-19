import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/FormTemplate.module.css";
import { useRouter } from "next/router";
import { z } from "zod";

const formSchema = z.object({
  formName: z.string().min(1, "Form name cannot be empty"),
});

export default function FormTemplate() {
  const [selectedElement, setSelectedElement] = useState("");
  const [formName, setFormName] = useState("");
  const [formElements, setFormElements] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const router = useRouter();

  const handleElementChange = (e) => {
    setSelectedElement(e.target.value);
  };

  const handleAddElement = () => {
    if (selectedElement) {
      let newElement = { type: selectedElement, value: "", options: [] };

      if (
        selectedElement === "checkbox" ||
        selectedElement === "radiobutton" ||
        selectedElement === "dropdown"
      ) {
        newElement.options.push({ label: "" });
      } else if (selectedElement === "textbox") {
        const textBoxElement = document.getElementById(
          `textBoxId-${formElements.length}`
        );
        if (textBoxElement) {
          newElement.value = textBoxElement.value;
        }
      }

      setFormElements([...formElements, newElement]);
      setSelectedElement("");
    }
  };

  const handleFormNameChange = (e) => {
    setFormName(e.target.value);
  };

  const handleLabelChange = (e, index) => {
    const newQuestion = e.target.value;
    const updatedFormElements = [...formElements];
    updatedFormElements[index].question = newQuestion;
    setFormElements(updatedFormElements);
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
        router.push("/");
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

  // checkboxes
  const handleCheckboxLabelChange = (e, elementIndex, optionIndex) => {
    const newLabel = e.target.value;
    const updatedFormElements = [...formElements];
    updatedFormElements[elementIndex].options[optionIndex].label = newLabel;
    setFormElements(updatedFormElements);
  };

  const handleAddCheckboxOption = (elementIndex, optionIndex) => {
    const updatedFormElements = [...formElements];
    const checkboxElement = updatedFormElements[elementIndex];

    if (checkboxElement && checkboxElement.type === "checkbox") {
      checkboxElement.options.splice(optionIndex + 1, 0, { label: "" });
      setFormElements(updatedFormElements);
    }
  };

  const handleRemoveCheckboxOption = (elementIndex, optionIndex) => {
    const updatedFormElements = [...formElements];
    const checkboxElement = updatedFormElements[elementIndex];

    if (checkboxElement && checkboxElement.type === "checkbox") {
      if (checkboxElement.options.length > 1) {
        checkboxElement.options.splice(optionIndex, 1);
        setFormElements(updatedFormElements);
      }
    }
  };

  // radio
  const handleRadioLabelChange = (e, elementIndex, optionIndex) => {
    const newLabel = e.target.value;
    const updatedFormElements = [...formElements];
    updatedFormElements[elementIndex].options[optionIndex].label = newLabel;
    setFormElements(updatedFormElements);
  };

  const handleAddRadioOption = (elementIndex, optionIndex) => {
    const updatedFormElements = [...formElements];
    const radioElement = updatedFormElements[elementIndex];

    if (radioElement && radioElement.type === "radiobutton") {
      radioElement.options.splice(optionIndex + 1, 0, { label: "" });
      setFormElements(updatedFormElements);
    }
  };

  const handleRemoveRadioOption = (elementIndex, optionIndex) => {
    const updatedFormElements = [...formElements];
    const radioElement = updatedFormElements[elementIndex];

    if (radioElement && radioElement.type === "radiobutton") {
      if (radioElement.options.length > 1) {
        radioElement.options.splice(optionIndex, 1);
        setFormElements(updatedFormElements);
      }
    }
  };

  // dropdown
  const handleDropDownLabelChange = (e, elementIndex, optionIndex) => {
    const newLabel = e.target.value;
    const updatedFormElements = [...formElements];
    updatedFormElements[elementIndex].options[optionIndex].label = newLabel;
    setFormElements(updatedFormElements);
  };

  const handleAddDropDownOption = (elementIndex, optionIndex) => {
    const updatedFormElements = [...formElements];
    const dropDownElement = updatedFormElements[elementIndex];

    if (dropDownElement && dropDownElement.type === "dropdown") {
      dropDownElement.options.splice(optionIndex + 1, 0, { label: "" });
      setFormElements(updatedFormElements);
    }
  };

  const handleRemoveDropDownOption = (elementIndex, optionIndex) => {
    const updatedFormElements = [...formElements];
    const dropDownElement = updatedFormElements[elementIndex];

    if (dropDownElement && dropDownElement.type === "dropdown") {
      if (dropDownElement.options.length > 1) {
        dropDownElement.options.splice(optionIndex, 1);
        setFormElements(updatedFormElements);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <Link className={styles.link} href="/">
          Home
        </Link>
      </div>

      <h2 className={styles.header}>Form Builder</h2>

      <div className={styles.formContainer}>
        <h3>Select an element from the dropdown to build the form </h3>
        <select
          className={styles.select}
          value={selectedElement}
          onChange={handleElementChange}
        >
          <option value="">Select an HTML element</option>
          <option value="dropdown">Dropdown</option>
          <option value="checkbox">Checkbox</option>
          <option value="textbox">Text Input</option>
          <option value="radiobutton">Radio Button</option>
        </select>
        <button className={styles.addButton} onClick={handleAddElement}>
          Add Element To The Form Below
        </button>
      </div>

      <div className={styles.formContainer}>
        <label className={styles.label} htmlFor="formName">
          Enter the Form Name:{" "}
        </label>
        <input
          type="text"
          className={styles.input}
          id="formName"
          placeholder="Enter the Form Name"
          value={formName}
          onChange={handleFormNameChange}
        />
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
          <div key={index} className={styles.formElement}>
            {element.type === "dropdown" && (
              <div className={styles.formElementContainer}>
                <div>
                  <input
                    type="text"
                    className={styles.labelInput}
                    value={element.question}
                    placeholder="Enter your question"
                    onChange={(e) => handleLabelChange(e, index)}
                  />
                </div>
                <label>Add Drop DownOptions</label>
                {element.options &&
                  element.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="text"
                        className={styles.optionInput}
                        value={option.label}
                        placeholder="Enter your text"
                        onChange={(e) =>
                          handleDropDownLabelChange(e, index, optionIndex)
                        }
                      />
                      <input
                        type="dropdown"
                        disabled={true}
                        id={`dropdownOption-${index}-${optionIndex}`}
                        name={`dropdownOption-${index}`}
                      />
                      <button
                        className={styles.optionButton}
                        onClick={() =>
                          handleAddDropDownOption(index, optionIndex)
                        }
                      >
                        +
                      </button>
                      <button
                        className={styles.optionButton}
                        onClick={() =>
                          handleRemoveDropDownOption(index, optionIndex)
                        }
                      >
                        -
                      </button>
                    </div>
                  ))}
              </div>
            )}
            {element.type === "checkbox" && (
              <div className={styles.formElementContainer}>
                <div>
                  <input
                    type="text"
                    value={element.question}
                    placeholder="Enter your question"
                    onChange={(e) => handleLabelChange(e, index)}
                  />
                </div>
                <label>Add Check Box Options</label>
                {element.options &&
                  element.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="text"
                        value={option.label}
                        className={styles.optionInput}
                        placeholder="Enter your text"
                        onChange={(e) =>
                          handleCheckboxLabelChange(e, index, optionIndex)
                        }
                      />
                      <input
                        type="checkbox"
                        disabled={true}
                        id={`checkboxOption-${index}-${optionIndex}`}
                        name={`checkboxOption-${index}`}
                      />
                      <button
                        className={styles.optionButton}
                        onClick={() =>
                          handleAddCheckboxOption(index, optionIndex)
                        }
                      >
                        +
                      </button>
                      <button
                        className={styles.optionButton}
                        onClick={() =>
                          handleRemoveCheckboxOption(index, optionIndex)
                        }
                      >
                        -
                      </button>
                    </div>
                  ))}
              </div>
            )}
            {element.type === "textbox" && (
              <div className={styles.formElementContainer}>
                <input
                  className={styles.optionInput}
                  type="text"
                  value={element.question}
                  placeholder="Enter your question"
                  onChange={(e) => handleLabelChange(e, index)}
                />
                <label className={styles.horizontalSpace}>Text Input </label>
              </div>
            )}
            {element.type === "radiobutton" && (
              <div className={styles.formElementContainer}>
                <div>
                  <input
                    className={styles.optionInput}
                    type="text"
                    value={element.question}
                    placeholder="Enter your question"
                    onChange={(e) => handleLabelChange(e, index)}
                  />
                </div>
                <label>Add Radio Options</label>
                {element.options &&
                  element.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        className={styles.optionInput}
                        type="text"
                        value={option.label}
                        placeholder="Enter your text"
                        onChange={(e) =>
                          handleRadioLabelChange(e, index, optionIndex)
                        }
                      />
                      <input
                        type="radio"
                        disabled={true}
                        id={`radioOption-${index}-${optionIndex}`}
                        name={`radioOption-${index}`}
                      />
                      <button
                        className={styles.optionButton}
                        onClick={() => handleAddRadioOption(index, optionIndex)}
                      >
                        +
                      </button>
                      <button
                        className={styles.optionButton}
                        onClick={() =>
                          handleRemoveRadioOption(index, optionIndex)
                        }
                      >
                        -
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.saveBtn}>
        <button className={styles.saveBtn} onClick={handleSave} type="submit">
          Publish Form
        </button>
      </div>
    </div>
  );
}
