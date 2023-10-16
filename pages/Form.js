import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Form() {
  const [forms, setForm] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchForm();
  }, []);

  const fetchForm = async () => {
    try {
      const response = await fetch("/api/db/getForm");
      if (response.ok) {
        const data = await response.json();
        setForm(data.forms);
      } else {
        console.error("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleUserData = (userId) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <Link href="/FormBuilder">Form Builder</Link>
        </div>
        <div>
          <Link href="/FormTemplate">Create a New Template</Link>
        </div>
      </div>

      <div>
        <h2>Forms: </h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {forms.map((form) => (
            <div
              key={form.id}
              style={{
                margin: "10px",
                padding: "10px",
                border: "1px solid #ccc",
              }}
            >
              <button onClick={() => toggleUserData(form.id)}>
                {form.formName}
              </button>
              {selectedUserId === form.id && (
                <div>
                  <p>Form Name: {form.formName}</p>
                  <p>Published: {form.createdAt}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
