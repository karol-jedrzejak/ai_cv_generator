"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import { apiAssetUrl } from "@/lib/api/client";

export interface CVContent {
  summaryText: string;
  name: string;
  surname: string;
  phone: string;
  hometown: string;
  email: string;
  avatarUrl: string;
  role: string;
  roleStack: string;
  techstack: Record<string, string[]>;
  languages: Array<{ name: string; level: string }>;
  links: Array<{ label: string; url: string }>;
  WorkExperience: Array<{
    companyName: string;
    position: string;
    startYear: number | null;
    endYear: number | null;
    isCurrent: boolean;
    description: string[];
  }>;
  projects: Array<{
    projectName: string;
    role: string;
    techstack: string[];
    description: string[];
  }>;
  education: Array<{
    institutionName: string;
    fieldOfStudy: string;
    academicTitle: string;
  }>;
  courses: Array<{
    courseName: string;
    organization: string;
    year: number | null;
    description: string;
  }>;
  certifications: Array<{
    certificationName: string;
    organization: string;
    issuedYear: number | null;
    description: string;
  }>;
}

interface Props {
  content: CVContent;
  languageName: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

export function isCVContent(value: unknown): value is CVContent {
  if (!isRecord(value) || !isRecord(value.techstack)) return false;
  const isString = (item: unknown) => typeof item === "string";
  return (
    isString(value.summaryText) &&
    isString(value.name) &&
    isString(value.surname) &&
    isString(value.phone) &&
    isString(value.hometown) &&
    isString(value.email) &&
    isString(value.avatarUrl) &&
    isString(value.role) &&
    isString(value.roleStack) &&
    Object.values(value.techstack).every(isStringArray) &&
    Array.isArray(value.languages) &&
    value.languages.every(
      (item) => isRecord(item) && isString(item.name) && isString(item.level),
    ) &&
    Array.isArray(value.links) &&
    value.links.every(
      (item) => isRecord(item) && isString(item.label) && isString(item.url),
    ) &&
    Array.isArray(value.WorkExperience) &&
    value.WorkExperience.every(
      (item) =>
        isRecord(item) &&
        isString(item.companyName) &&
        isString(item.position) &&
        (item.startYear === null || Number.isInteger(item.startYear)) &&
        (item.endYear === null || Number.isInteger(item.endYear)) &&
        typeof item.isCurrent === "boolean" &&
        isStringArray(item.description),
    ) &&
    Array.isArray(value.projects) &&
    value.projects.every(
      (item) =>
        isRecord(item) &&
        isString(item.projectName) &&
        isString(item.role) &&
        isStringArray(item.techstack) &&
        isStringArray(item.description),
    ) &&
    Array.isArray(value.education) &&
    value.education.every(
      (item) =>
        isRecord(item) &&
        isString(item.institutionName) &&
        isString(item.fieldOfStudy) &&
        isString(item.academicTitle),
    ) &&
    Array.isArray(value.courses) &&
    value.courses.every(
      (item) =>
        isRecord(item) &&
        isString(item.courseName) &&
        isString(item.organization) &&
        (item.year === null || Number.isInteger(item.year)) &&
        isString(item.description),
    ) &&
    Array.isArray(value.certifications) &&
    value.certifications.every(
      (item) =>
        isRecord(item) &&
        isString(item.certificationName) &&
        isString(item.organization) &&
        (item.issuedYear === null || Number.isInteger(item.issuedYear)) &&
        isString(item.description),
    )
  );
}

export default function GeneratedCV({ content, languageName }: Props) {
  const isPolish = languageName === "Polski";
  const techCount = Object.values(content.techstack).reduce(
    (count, technologies) => count + technologies.length,
    0,
  );

  return (
    <Box
      className="cv-shell"
      sx={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fff",
        "@media print": { minHeight: 0 },
      }}
    >
      <Box
        className="cv-page"
        sx={{
          width: "min(210mm, 100%)",
          height: "297mm",
          display: "flex",
          bgcolor: "#fff",
          color: "#334155",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "9.5pt",
          lineHeight: 1.4,
          "& .MuiTypography-root, & .MuiChip-label": {
            fontFamily: "inherit",
          },
          boxShadow: "0 4px 8px rgba(0,0,0,.2), 0 6px 20px rgba(0,0,0,.19)",
          overflow: "hidden",
          "@media (max-width: 650px)": {
            height: "auto",
            minHeight: "297mm",
            flexDirection: "column",
          },
          "@media print": {
            width: "210mm",
            height: "297mm",
            minHeight: "297mm",
            flexDirection: "row",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        <Box
          component="aside"
          sx={{
            width: "60mm",
            flexShrink: 0,
            bgcolor: "#0f172a",
            color: "#f1f5f9",
            px: "6mm",
            py: "5mm",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            overflow: "hidden",
            "@media (max-width: 650px)": { width: "100%", overflow: "visible" },
            "@media print": { width: "60mm" },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
            {content.avatarUrl ? (
              <Box
                component="img"
                src={apiAssetUrl(content.avatarUrl)}
                alt={`${content.name} ${content.surname}`}
                sx={{
                  width: "40mm",
                  height: "40mm",
                  borderRadius: "50%",
                  border: "2px solid #38bdf8",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                aria-label={`${content.name} ${content.surname}`}
                sx={{
                  width: "40mm",
                  height: "40mm",
                  borderRadius: "50%",
                  border: "2px solid #38bdf8",
                  bgcolor: "#1e293b",
                  display: "grid",
                  placeItems: "center",
                  color: "#38bdf8",
                  fontSize: "24pt",
                  fontWeight: 700,
                }}
              >
                {content.name[0]}
              </Box>
            )}
          </Box>

          <SectionTitle>
            {isPolish ? "Dane kontaktowe" : "Contact"}
          </SectionTitle>
          <Stack spacing={0.75} sx={{ mb: 0.5 }}>
            <Contact
              label="Email"
              value={content.email}
              href={`mailto:${content.email}`}
            />
            <Contact
              label={isPolish ? "Telefon" : "Phone"}
              value={content.phone}
              href={`tel:${content.phone}`}
            />
            <Contact
              label={isPolish ? "Lokalizacja" : "Location"}
              value={content.hometown}
            />
            {content.links.slice(0, 4).map((link) => (
              <Contact
                key={`${link.label}-${link.url}`}
                label={link.label}
                value={link.url.replace(/^https?:\/\/(www\.)?/i, "")}
                href={link.url}
              />
            ))}
          </Stack>

          <SectionTitle>Tech Stack</SectionTitle>
          <Stack spacing={0.75}>
            {Object.entries(content.techstack).map(
              ([category, technologies]) => (
                <Box key={category}>
                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: "8pt",
                      fontWeight: 600,
                      mb: 0.4,
                    }}
                  >
                    {category}
                  </Typography>
                  <Stack
                    direction="row"
                    useFlexGap
                    sx={{ flexWrap: "wrap", gap: 0.35 }}
                  >
                    {technologies.map((technology) => (
                      <Chip
                        key={`${category}-${technology}`}
                        size="small"
                        label={technology}
                        sx={{
                          height: "auto",
                          maxWidth: "100%",
                          bgcolor: "#1e293b",
                          color: "#e2e8f0",
                          border: "1px solid #334155",
                          borderRadius: 1,
                          "& .MuiChip-label": {
                            whiteSpace: "normal",
                            px: 0.6,
                            py: 0.15,
                            fontSize: "7pt",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              ),
            )}
          </Stack>

          {techCount === 0 && (
            <Typography sx={{ fontSize: "8pt", color: "#cbd5e1" }}>
              -
            </Typography>
          )}

          <SectionTitle>{isPolish ? "Języki" : "Languages"}</SectionTitle>
          <Stack spacing={0.35}>
            {content.languages.slice(0, 4).map((language) => (
              <Box
                key={`${language.name}-${language.level}`}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                  fontSize: "8pt",
                }}
              >
                <span>{language.name}</span>
                <Box
                  component="span"
                  sx={{ color: "#38bdf8", fontWeight: 600 }}
                >
                  {language.level}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box
          component="main"
          sx={{
            width: "150mm",
            minWidth: 0,
            px: "7mm",
            py: "6mm",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            "@media (max-width: 650px)": {
              width: "100%",
              minHeight: "180mm",
              overflow: "visible",
            },
            "@media print": { width: "150mm", overflow: "hidden" },
          }}
        >
          <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <Box
              sx={{
                borderBottom: "2px solid #0284c7",
                pb: 1.25,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Typography
                component="h1"
                sx={{
                  color: "#0f172a",
                  fontSize: "20pt",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-.02em",
                  overflowWrap: "anywhere",
                }}
              >
                {content.name} {content.surname}
              </Typography>
              <Box
                sx={{
                  ml: "auto",
                  textAlign: "right",
                  flexShrink: 0,
                  maxWidth: "55%",
                }}
              >
                <Typography
                  sx={{
                    color: "#0284c7",
                    fontSize: "10pt",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {content.role}
                </Typography>
                <Typography
                  sx={{
                    color: "#475569",
                    fontSize: "7pt",
                    fontStyle: "italic",
                    textTransform: "uppercase",
                  }}
                >
                  {content.roleStack}
                </Typography>
              </Box>
            </Box>

            <SectionHeading>
              {isPolish ? "Podsumowanie" : "Professional Summary"}
            </SectionHeading>
            <Typography
              sx={{
                fontSize: "8.2pt",
                lineHeight: 1.35,
                color: "#475569",
                mb: 1.25,
                whiteSpace: "pre-wrap",
              }}
            >
              {content.summaryText}
            </Typography>

            {content.WorkExperience.length > 0 && (
              <Box sx={{ mb: 1.25 }}>
                <SectionHeading>
                  {isPolish ? "Doświadczenie zawodowe" : "Work Experience"}
                </SectionHeading>
                <Stack spacing={0.9}>
                  {content.WorkExperience.slice(0, 3).map(
                    (experience, index) => (
                      <Box key={`${experience.companyName}-${index}`}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "8.5pt",
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            {experience.position}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "7.5pt",
                              color: "#64748b",
                              flexShrink: 0,
                            }}
                          >
                            {experience.startYear ?? ""}
                            {experience.startYear && " – "}
                            {experience.isCurrent
                              ? isPolish
                                ? "obecnie"
                                : "Present"
                              : (experience.endYear ?? "")}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "8pt",
                            fontWeight: 600,
                            color: "#0284c7",
                            mb: 0.25,
                          }}
                        >
                          {experience.companyName}
                        </Typography>
                        <BulletList items={experience.description} />
                      </Box>
                    ),
                  )}
                </Stack>
              </Box>
            )}

            {content.projects.length > 0 && (
              <Box sx={{ mb: 1.25 }}>
                <SectionHeading>
                  {isPolish ? "Wybrane projekty" : "Selected Projects"}
                </SectionHeading>
                <Stack spacing={0.8}>
                  {content.projects.slice(0, 2).map((project, index) => (
                    <Box key={`${project.projectName}-${index}`}>
                      <Typography
                        sx={{
                          fontSize: "8pt",
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        {project.projectName}{" "}
                        {project.role && (
                          <Box
                            component="span"
                            sx={{
                              fontSize: "7pt",
                              fontWeight: 500,
                              fontStyle: "italic",
                            }}
                          >
                            · {project.role}
                          </Box>
                        )}
                      </Typography>
                      {project.techstack.length > 0 && (
                        <Typography
                          sx={{ color: "#0284c7", fontSize: "7pt", mb: 0.2 }}
                        >
                          {project.techstack.join(" · ")}
                        </Typography>
                      )}
                      <BulletList items={project.description} />
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {content.education.length > 0 && (
              <Box>
                <SectionHeading>
                  {isPolish ? "Edukacja" : "Education"}
                </SectionHeading>
                <Stack spacing={0.5}>
                  {content.education.slice(0, 2).map((item, index) => (
                    <Box key={`${item.institutionName}-${index}`}>
                      <Typography
                        sx={{
                          fontSize: "8pt",
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {item.institutionName}
                      </Typography>
                      <Typography sx={{ fontSize: "7.5pt", color: "#475569" }}>
                        {[item.academicTitle, item.fieldOfStudy]
                          .filter(Boolean)
                          .join(" · ")}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {(content.courses.length > 0 ||
              content.certifications.length > 0) && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1.5,
                  mt: 1,
                }}
              >
                {content.courses.length > 0 && (
                  <Box sx={{ minWidth: 0 }}>
                    <SectionHeading>
                      {isPolish ? "Kursy" : "Courses"}
                    </SectionHeading>
                    <Stack spacing={0.45}>
                      {content.courses.slice(0, 2).map((course, index) => (
                        <Box key={`${course.courseName}-${index}`}>
                          <Typography
                            sx={{
                              fontSize: "7.5pt",
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            {course.courseName}
                          </Typography>
                          <Typography
                            sx={{ fontSize: "7pt", color: "#475569" }}
                          >
                            {[course.organization, course.year]
                              .filter(Boolean)
                              .join(" · ")}
                          </Typography>
                          {course.description && (
                            <Typography
                              sx={{
                                fontSize: "7pt",
                                lineHeight: 1.25,
                                color: "#475569",
                              }}
                            >
                              {course.description}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
                {content.certifications.length > 0 && (
                  <Box sx={{ minWidth: 0 }}>
                    <SectionHeading>
                      {isPolish ? "Certyfikaty" : "Certifications"}
                    </SectionHeading>
                    <Stack spacing={0.45}>
                      {content.certifications
                        .slice(0, 2)
                        .map((certification, index) => (
                          <Box
                            key={`${certification.certificationName}-${index}`}
                          >
                            <Typography
                              sx={{
                                fontSize: "7.5pt",
                                fontWeight: 700,
                                color: "#0f172a",
                              }}
                            >
                              {certification.certificationName}
                            </Typography>
                            <Typography
                              sx={{ fontSize: "7pt", color: "#475569" }}
                            >
                              {[
                                certification.organization,
                                certification.issuedYear,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </Typography>
                            {certification.description && (
                              <Typography
                                sx={{
                                  fontSize: "7pt",
                                  lineHeight: 1.25,
                                  color: "#475569",
                                }}
                              >
                                {certification.description}
                              </Typography>
                            )}
                          </Box>
                        ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="h2"
      sx={{
        color: "#38bdf8",
        fontSize: "8.5pt",
        fontWeight: 700,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        borderBottom: "1px solid #334155",
        pb: 0.4,
      }}
    >
      {children}
    </Typography>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="h2"
      sx={{
        color: "#0f172a",
        fontSize: "9.5pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: ".03em",
        borderBottom: "1px solid #e2e8f0",
        pb: 0.35,
        mb: 0.7,
      }}
    >
      {children}
    </Typography>
  );
}

function Contact({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  if (!value) return null;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <Typography
        sx={{
          color: "#94a3b8",
          fontSize: "6.8pt",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      {href ? (
        <Box
          component="a"
          href={href}
          sx={{
            color: "inherit",
            fontSize: "7.5pt",
            overflowWrap: "anywhere",
            "&:hover": { color: "#7dd3fc" },
          }}
        >
          {value}
        </Box>
      ) : (
        <Typography sx={{ fontSize: "7.5pt", overflowWrap: "anywhere" }}>
          {value}
        </Typography>
      )}
    </Box>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <Box
      component="ul"
      sx={{
        pl: 1.8,
        color: "#475569",
        fontSize: "7.5pt",
        lineHeight: 1.3,
        "& li": { pl: 0.2, mb: 0.15 },
      }}
    >
      {items.map((item, index) => (
        <li key={`${index}-${item}`}>{item}</li>
      ))}
    </Box>
  );
}
