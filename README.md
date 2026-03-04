# StudentManagement – Frontend (Angular)

This is the **Angular 21** frontend application for the StudentManagement system.

It provides a dashboard for:

* Viewing uploaded files from the backend
* Manually triggering:
  * **Records generation**
  * **Excel to CSV conversion**
  * **CSV to Database upload**
* Monitoring file size, last modified date, and processing state

This README contains everything needed to install, run, understand, and maintain the frontend.

---

# Tech Stack

* **Angular CLI 21.2.0**
* **Standalone Components Architecture**
* **TypeScript**
* **SCSS Styling**
* **HttpClient (REST API integration)**

Backend runs on:

```
http://localhost:8080
```

Frontend runs on:

```
http://localhost:4200
```

---

# Architecture

This project uses **Angular Standalone Components**.

Each component imports its own dependencies.

## Project Structure

```
src/
 └── app/
      ├── components/
      │     └── dashboard/
      │           ├── dashboard.component.ts
      │           ├── dashboard.component.html
      │           └── dashboard.component.scss
(the rest of components)
      │
      ├── services/
      │     └── file.service.ts
      │
      ├── app.component.ts
      └── main.ts
```

---

## Architecture Overview

### Dashboard Component

Responsible for:

* Fetching file list from backend
* Displaying files in a table(all the csv and excel generated)
* Manual trigger buttons:
  * Convert Excel → CSV
  * Upload CSV → DB
* Showing processing state

### File Service

Handles all HTTP communication:

* GET `/api/files`
* POST `/api/files/convert`
* POST `/api/files/upload`

### Backend Communication

All communication happens via Angular HttpClient:

```ts
http://localhost:8080/api/files
```
---

### User Action Required

* **Generate records based on the number of records you need**
* **Convert excel file(generated records) to CSV**
* **Upload csv file to DB**

---

# UI Screens
<img width="1920" height="1080" alt="Screenshot (512)" src="https://github.com/user-attachments/assets/728935fa-ad23-449f-9b42-f8dd5472b64f" />
<img width="1920" height="1080" alt="Screenshot (510)" src="https://github.com/user-attachments/assets/5f518a65-fa9a-4690-8426-1240b74aadb2" />
<img width="1920" height="1080" alt="Screenshot (508)" src="https://github.com/user-attachments/assets/ccc61f08-d16f-47d0-a205-7dd872654ce8" />
<img width="1920" height="1080" alt="Screenshot (505)" src="https://github.com/user-attachments/assets/b8defe7f-5fa3-44e7-842d-391575a8a980" />
<img width="1920" height="1080" alt="Screenshot (504)" src="https://github.com/user-attachments/assets/59d9342a-2805-491c-8f67-d2184b112851" />
<img width="1920" height="1080" alt="Screenshot (501)" src="https://github.com/user-attachments/assets/cda128b4-4c8d-4255-861e-db05f041b3b4" />
<img width="1920" height="1080" alt="Screenshot (519)" src="https://github.com/user-attachments/assets/a145d317-d614-468f-afce-8bfd7d322729" />
<img width="1920" height="1080" alt="Screenshot (517)" src="https://github.com/user-attachments/assets/d54c73d9-417a-43e6-bd06-0250861af669" />
<img width="1920" height="1080" alt="Screenshot (514)" src="https://github.com/user-attachments/assets/dda96d75-9cdf-4025-a73f-62533271552f" />

# Installation Guide

## Clone Repository

```bash
git clone https://github.com/Tillern/Student-Data-Frontend.git
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
ng serve
```

Then open:

```
LOCAL: http://localhost:4200
```

---

# Backend Requirement

Backend must be running on:

```
LOCAL: http://localhost:8080 or equivalemt
```

If backend is not running, you will see:

```
ERR_CONNECTION_REFUSED
```

---

# API Endpoints Used

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| GET    | `/api/files`         | Fetch all files        |
| POST   | `/api/files/convert` | Convert Excel to CSV   |
| POST   | `/api/files/upload`  | Upload CSV to Database |

---

# Development Commands

## Generate Component

```bash
ng generate component component-name
```

---

## Build for Production

```bash
ng build
```

Build output:

```
dist/
```
---

# Styling

* Uses SCSS
* Clean table layout
* Processing state indicators
* Button-based manual triggers
* Responsive design

All component styles are inside:

---

# Manual Testing Checklist

* [ ] Backend running
* [ ] Frontend running
* [ ] Enter number of records and generate
* [ ] Generated files load on refresh(listed)
* [ ] Excel to CSV works
* [ ] CSV to DB works
* [ ] Processing indicator shows correctly with progress on specific actions
* [ ] No console errors

---

# Production Deployment

1. Build:

```bash
ng build --configuration production
```

2. Deploy contents of:

```
dist/student-management/
```

To:

* Nginx
* Apache
* Any static hosting

---

# Maintainer Notes

* Angular 21 Standalone architecture
* No NgModules
* Component-level imports
* Clean service separation
* Backend-driven file management

