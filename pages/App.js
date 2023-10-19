import React from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import PublishedFormTemplates from "../components/PublishedFormTemplates";
import PublishedFormBuilder from "../components/PublishedFormBuilder";

export default function App() {
  return (
    <div className={styles.container}>
      <div className={styles.topLinks}>
        <Link className={styles.link} href="/FormBuilder">
          Form Builder
        </Link>
        <Link className={styles.link} href="/FormTemplate">
          Create a New Template
        </Link>
      </div>

      <h1 className={styles.heading}></h1>
      <PublishedFormBuilder />
      <PublishedFormTemplates />
    </div>
  );
}
