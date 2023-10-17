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

  const handleAddElement = () => {
    if (selectedElement) {
      let newElement = { type: selectedElement, value: "", options: [] };

      if (selectedElement === "dropdown") {
        // Handle dropdown selection
        const dropdownElement = document.getElementById(
          `dropdownId-${formElements.length}`
        );
        if (dropdownElement) {
          newElement.value = dropdownElement.value;
        }
      } else if (selectedElement === "checkbox") {
        newElement.options.push({ label: "" });
      } else if (selectedElement === "textbox") {
        // Handle text box input
        const textBoxElement = document.getElementById(
          `textBoxId-${formElements.length}`
        );
        if (textBoxElement) {
          newElement.value = textBoxElement.value;
        }
      } else if (selectedElement === "radiobutton") {
        newElement.options.push({ label: "" });
        // // Handle radio button selection
        // const radioElement1 = document.getElementById(
        //   `radioId1-${formElements.length}`
        // );
        // const radioElement2 = document.getElementById(
        //   `radioId2-${formElements.length}`
        // );

        // if (radioElement1 && radioElement2) {
        //   newElement.value = {
        //     radio1: radioElement1.checked,
        //     radio2: radioElement2.checked,
        //   };
        // }
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

  return (
    <div>
      <div>
        <Link href="/Form">Home</Link>
      </div>

      <h2>Form Builder</h2>

      <div className={styles.formContainer}>
        <h3>Select an element from the dropdown to build the form </h3>
        <select value={selectedElement} onChange={handleElementChange}>
          <option value="">Select an HTML element</option>
          {/* <option value="dropdown">Dropdown</option> */}
          <option value="checkbox">Checkbox</option>
          <option value="textbox">Text Input</option>
          <option value="radiobutton">Radio Button</option>
        </select>
        <button className={styles.horizontalSpace} onClick={handleAddElement}>
          Add Element To The Form Below
        </button>
      </div>

      <div className={styles.formContainer}>
        <label htmlFor="formName">Enter the Form Name: </label>
        <input
          type="text"
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
            {/* {element.type === "dropdown" && (
              <div>
                <input
                  type="text"
                  value={element.question}
                  placeholder="Enter your question"
                  onChange={(e) => handleLabelChange(e, index)}
                />
                <select
                  className={styles.horizontalSpace}
                  id={`dropdownId-${index}`}
                  value={element.selectedValue}
                  onChange={(e) => handleDropdownChange(e, index)}
                >
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>
            )} */}
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
                        onClick={() =>
                          handleAddCheckboxOption(index, optionIndex)
                        }
                      >
                        +
                      </button>
                      <button
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
              <div>
                <input
                  type="text"
                  value={element.question}
                  placeholder="Enter your question"
                  onChange={(e) => handleLabelChange(e, index)}
                />
                <label className={styles.horizontalSpace}>Text Input </label>

                {/* <input
                  type="text"
                  id={`textBoxId-${index}`}
                  name={`textBoxName-${index}`}
                  value={element.value}
                  onChange={(e) => handleTextboxChange(e, index)}
                /> */}
              </div>
            )}
            {element.type === "radiobutton" && (
              <div>
                <div>
                  <input
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
                        onClick={() => handleAddRadioOption(index, optionIndex)}
                      >
                        +
                      </button>
                      <button
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
        <button onClick={handleSave} type="submit">
          Publish Form
        </button>
      </div>
    </div>
  );
}
