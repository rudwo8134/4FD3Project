import { NextResponse } from "next/server";

// List of common job titles for suggestions
const JOB_TITLES = [
  // Software & Engineering
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "Data Engineer",
  "Cloud Engineer",
  "Site Reliability Engineer",
  "QA Engineer",
  "Systems Architect",
  "Embedded Systems Engineer",
  "Game Developer",
  "Machine Learning Engineer",

  // Data & Analytics
  "Data Scientist",
  "Data Analyst",
  "Business Analyst",
  "Business Intelligence Developer",
  "AI Researcher",
  "Statistician",
  "Database Administrator",

  // Product & Design
  "Product Manager",
  "Project Manager",
  "Product Owner",
  "Scrum Master",
  "UX Designer",
  "UI Designer",
  "Product Designer",
  "Graphic Designer",
  "Web Designer",
  "Art Director",
  "Creative Director",

  // Marketing & Sales
  "Marketing Manager",
  "Social Media Manager",
  "Content Strategist",
  "SEO Specialist",
  "Digital Marketing Specialist",
  "Sales Representative",
  "Account Manager",
  "Account Executive",
  "Customer Success Manager",
  "Sales Engineer",

  // IT & Support
  "IT Support Specialist",
  "System Administrator",
  "Network Engineer",
  "Cybersecurity Analyst",
  "Information Security Manager",
  "Help Desk Technician",

  // HR & Operations
  "Human Resources Manager",
  "Recruiter",
  "Talent Acquisition Specialist",
  "Operations Manager",
  "Office Manager",
  "Executive Assistant",

  // Finance
  "Financial Analyst",
  "Accountant",
  "Auditor",
  "Controller",
  "Finance Manager",
  "Practical Nurse",
  "Registered Nurse",
  "Nurse Practitioner",
  "Nurse Manager",
  "Nurse Educator",
  "Nurse Administrator",
  "Nurse Consultant",
  "Nurse Director",
  "Nurse Leader",
  "Nurse Specialist",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();
    if (!q) return NextResponse.json({ results: [] });

    const results = JOB_TITLES.filter((title) =>
      title.toLowerCase().includes(q)
    )
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(q);
        const bStarts = b.toLowerCase().startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      })
      .slice(0, 10);

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
