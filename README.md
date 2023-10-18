## Getting Started


```bash
npm run install
npx prisma db push
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Overview

This project is designed to provide two key routes:

- **FormBuilder Route:** This route empowers users to create custom forms with a variety of HTML elements. Currently, it supports four elements for testing purposes.

- **FormTemplate Route:** This route is focused on creating new form templates based on recently published forms. If a form with the same name and identical questions exists, this feature will autofill the form. Please note that this feature is still a work in progress.

## Key Features

- Create custom forms with HTML elements.
- Supports various HTML elements for form building.
- Create new form templates based on recently published forms.
- Autofill forms with the same name and matching questions (in progress).
