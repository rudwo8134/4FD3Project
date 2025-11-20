import { NextRequest, NextResponse } from "next/server";

// Explicitly use Node.js runtime
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log("POST /api/parse-resume called");
  try {
    // Dynamically require pdf-parse/lib/pdf-parse.js to avoid index.js issues
    // (index.js checks !module.parent and tries to read a test file if true, causing crash in Next.js)
    const pdf = require("pdf-parse/lib/pdf-parse.js");

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(`File received: ${file.name}, size: ${file.size}`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Buffer created, parsing PDF...");
    const data = await pdf(buffer);
    const text = data.text;
    console.log("PDF parsed successfully, text length:", text.length);

    // Parse the text based on the known format
    const parsedData = parseResumeText(text);
    console.log("Resume parsed:", parsedData.name);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Error parsing resume:", error);
    return NextResponse.json(
      { error: "Failed to parse resume: " + error.message },
      { status: 500 }
    );
  }
}

function parseResumeText(text: string) {
  // Initialize data structure
  const data = {
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "Software Engineer", // Default or extracted
    experience: [] as any[],
    education: [] as string[],
    skills: [] as string[],
    summary: "",
  };

  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length > 0) {
    data.name = lines[0];
  }

  // Extract Contact Info (usually 2nd line)
  // "329 Coronation Road, Whitby, ON | (647) 530-8134 | rudwo8134@gmail.com"
  const contactLine = lines.find((l) => l.includes("|") && l.includes("@"));
  if (contactLine) {
    const parts = contactLine.split("|").map((s) => s.trim());
    if (parts.length >= 3) {
      data.location = parts[0];
      data.phone = parts[1];
      data.email = parts[2];
    } else if (parts.length === 2) {
      // Try to guess
      if (parts[0].includes("@")) data.email = parts[0];
      else data.phone = parts[0]; // Simplified assumption
    }
  }

  // Extract Sections
  const sections: { [key: string]: string[] } = {
    SUMMARY: [],
    EXPERIENCE: [],
    EDUCATION: [],
    SKILLS: [],
    PROJECTS: [],
  };

  let currentSection = "SUMMARY";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();

    if (upperLine === "EXPERIENCE") {
      currentSection = "EXPERIENCE";
      continue;
    } else if (upperLine === "EDUCATION") {
      currentSection = "EDUCATION";
      continue;
    } else if (upperLine === "SKILLS") {
      currentSection = "SKILLS";
      continue;
    } else if (upperLine.includes("KEY PROJECTS") || upperLine === "PROJECTS") {
      currentSection = "PROJECTS";
      continue;
    } else if (line.includes(data.name) || line === contactLine) {
      continue;
    }

    sections[currentSection].push(line);
  }

  // Process Summary
  data.summary = sections["SUMMARY"].join(" ");

  // Process Experience
  const expLines = sections["EXPERIENCE"];
  let currentExp: any = null;

  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i];
    // Check if line is a date range (e.g., "2021 - Present", "2019 - 2021")
    if (/^\d{4}\s*-\s*(Present|\d{4})/.test(line)) {
      if (currentExp) {
        data.experience.push(currentExp);
      }
      currentExp = {
        duration: line,
        company: "",
        position: "",
        location: "",
        description: "",
      };

      // The next line usually contains Company | Position | Location
      if (i + 1 < expLines.length) {
        const nextLine = expLines[i + 1];
        if (nextLine.includes("|")) {
          const parts = nextLine.split("|").map((s) => s.trim());
          if (parts.length >= 2) {
            currentExp.company = parts[0];
            currentExp.position = parts[1];
            if (parts.length > 2) currentExp.location = parts[2];
          } else {
            currentExp.company = nextLine;
          }
          i++; // Skip next line as we processed it
        }
      }
    } else if (currentExp) {
      // Append to description
      if (!line.includes("|")) {
        // Avoid appending header lines if logic failed
        currentExp.description += (currentExp.description ? " " : "") + line;
      }
    }
  }
  if (currentExp) data.experience.push(currentExp);

  // Process Education
  data.education = sections["EDUCATION"];

  // Process Skills
  // Let's try to split by commas for the skills section
  data.skills = sections["SKILLS"]
    .join(",")
    .split(/[,•]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.includes(":")); // Filter out labels like "Programming Languages:"

  return data;
}
