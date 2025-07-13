# Note Scribe Previewer

A modern, interactive web application for creating, formatting, and exporting beautiful study notes with real-time preview and PDF export capabilities.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [PDF Export](#pdf-export)
- [Customization](#customization)
- [Deployment](#deployment)
- [Custom Domain](#custom-domain)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

**Note Scribe Previewer** is a web app designed to help you create, organize, and preview study notes in a clean, A4-paper-like format. It supports real-time editing, flexible formatting, and instant PDF export that matches the on-screen preview. Built for students, teachers, and professionals who want a seamless note-taking and exporting experience.

---

## Features

- 📝 **Rich Note Creation**: Add topics, notes, and images as content blocks.
- 🖥️ **Live Preview**: See your formatted notes in real time, exactly as they will appear in the exported PDF.
- 📄 **A4 Paper Layout**: Notes are displayed in a two-column, A4-style layout for professional output.
- 🔠 **Font Size Control**: Easily adjust font size for all content.
- 📏 **Column Gap Control**: Fine-tune the vertical gap between blocks in each column.
- 📤 **PDF Export**: Download your notes as a PDF that matches the live preview, including all formatting and images.
- ⚡ **Instant Feedback**: Toast notifications for actions like adding, removing, or exporting content.
- 🎨 **Modern UI**: Built with shadcn-ui and Tailwind CSS for a clean, responsive interface.

---

## Tech Stack

- [Vite](https://vitejs.dev/) (build tool)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [shadcn-ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) (for PDF export)

---

## Getting Started

### Prerequisites
- [Node.js & npm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# 1. Clone the repository
 git clone <YOUR_GIT_URL>

# 2. Navigate to the project directory
 cd <YOUR_PROJECT_NAME>

# 3. Install dependencies
 npm install

# 4. Start the development server
 npm run dev
```

The app will be available at `http://localhost:5173` (or as indicated in your terminal).

---

## Usage Guide

- **Add Content**: Use the input panel to add new content blocks (topic, notes, images).
- **Edit & Organize**: See your content blocks appear in the live preview. Delete blocks or adjust font size and column gaps as needed.
- **Live Preview**: The center panel shows your notes in a two-column, A4-paper style layout. All formatting updates in real time.
- **Export PDF**: Click the 'Download Final PDF' button to export your notes. The PDF will look exactly like the live preview.

---

## PDF Export

- The PDF export uses `html2canvas` and `jsPDF` to capture the A4 preview and generate a high-fidelity PDF.
- All formatting, font sizes, images, and column gaps are preserved in the exported file.
- The export is instant and works entirely in the browser—no server required.

---

## Customization

- **Font Size**: Use the dropdown in the Document Content panel to change the font size for all notes.
- **Column Gaps**: (If enabled) Use the sliders to adjust vertical spacing between blocks in each column.
- **Styling**: Modify Tailwind CSS classes or shadcn-ui components for further UI customization.

---

## Deployment

You can deploy this project using [Lovable](https://lovable.dev/projects/1be7557e-363c-4e11-9c54-6e20df69996c):

1. Open the [Lovable Project](https://lovable.dev/projects/1be7557e-363c-4e11-9c54-6e20df69996c).
2. Click on **Share → Publish**.

---

## Custom Domain

You can connect a custom domain to your Lovable project:

1. Go to **Project > Settings > Domains**.
2. Click **Connect Domain**.
3. Follow the [step-by-step guide](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide).

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed under the MIT License.
