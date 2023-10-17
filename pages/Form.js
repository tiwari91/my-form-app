import React from "react";
import Link from "next/link";

import PublishedFormTemplates from "../components/PublishedFormTemplates";
import PublishedFormBuilder from "../components/PublishedFormBuilder";

export default function Form() {
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

      <PublishedFormBuilder />

      <PublishedFormTemplates />
    </>
  );
}
