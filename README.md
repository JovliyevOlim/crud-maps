# 📌 React CRUD + Map Polygon Editor

Interaktiv **Users CRUD (ShadCN UI bilan)** va **Map Polygon Drawing
(Leaflet + Turf.js)** funksionalligi bo'lgan kichik demo loyiha.

## 🚀 Ishga tushirish

### 1️⃣ **Repository'ni clone qilish**

- git branch:  main

``` bash
git clone  https://github.com/JovliyevOlim/crud-maps.git
cd crud-maps
```

### 2️⃣ **Node version**

> **Node.js: `v20.x`** ishlatilgan.\
> Aniqlash uchun:

``` bash
node -v
```

### 3️⃣ **Dependencies o'rnatish**

``` bash
npm install
```

### 4️⃣ **Development server ishga tushirish**

``` bash
npm run dev
```

# 🧱 **Loyiha arxitekturasi**

    src/
     ├── components/
     │    ├── ui/
     │    ├── users/
     │    └── maps/
     ├── store/
     │    ├── users.store.ts
     │    └── modal.store.ts
     ├── pages/
     │    ├── Maps.tsx
     │    └── Users.tsx
     ├── hooks/
     ├── lib/
     └── App.tsx

## 📦 Technologies / Used Libraries

### Core

- **React 19**
- **React Router DOM** – client-side routing
- **TypeScript**
- **TailwindCSS** – UI styling

### CRUD

- **Formik** + **Yup** – form handling & validation

### State Management

- **Zustand** – lightweight global store

### Map & GIS

- **Leaflet** – interactive map engine
- **React-Leaflet** – React bindings for Leaflet
- **@turf/turf** – polygon area calculation & GIS utilities

### UI & UX

- **Shadcn UI**

### Optional (If used)

- **Dexie** – IndexedDB local storage

# 🔥 **Funksionallar**

### USERS CRUD

- Create / Edit / Delete\
- Toast notifications\
- Formik + Yup\
- Search + Pagination

### MAP POLYGON

- Create / Edit / Delete\
- Vertex bosib polygon chizish\
- Turf.js → polygon area hisoblash\
- Polygon saqlash

# 📥 Quick Start

1. `npm install`
2. `npm run dev`
3. `/users` & `/maps`

