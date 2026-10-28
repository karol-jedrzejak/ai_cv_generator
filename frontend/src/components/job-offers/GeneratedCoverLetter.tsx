'use client';

import { Box, Chip, Stack, Typography } from '@mui/material';

export interface CoverLetterContent {
  paragraphs: string[];
  name: string;
  surname: string;
  phone: string;
  hometown: string;
  email: string;
  role: string;
  roleStack: string;
  techstack: Record<string, string[]>;
}

interface Props {
  content: CoverLetterContent;
  languageName: string | null;
}

export function isCoverLetterContent(
  content: unknown,
): content is CoverLetterContent {
  if (!content || typeof content !== 'object') return false;
  const value = content as Record<string, unknown>;
  return (
    Array.isArray(value.paragraphs) &&
    value.paragraphs.every((paragraph) => typeof paragraph === 'string') &&
    typeof value.name === 'string' &&
    typeof value.surname === 'string' &&
    typeof value.phone === 'string' &&
    typeof value.hometown === 'string' &&
    typeof value.email === 'string' &&
    typeof value.role === 'string' &&
    typeof value.roleStack === 'string' &&
    !!value.techstack &&
    typeof value.techstack === 'object' &&
    Object.values(value.techstack).every(
      (technologies) =>
        Array.isArray(technologies) &&
        technologies.every((technology) => typeof technology === 'string'),
    )
  );
}

export default function GeneratedCoverLetter({ content, languageName }: Props) {
  const isPolish = languageName === 'Polski';

  return (
    <Box
      className="cover-letter-shell"
      sx={{
        minHeight: '100dvh',
        bgcolor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        '@media print': { minHeight: 0 },
      }}
    >
      <Box
        className="cover-letter-page"
        sx={{
          width: 'min(210mm, 100%)',
          minHeight: '297mm',
          display: 'flex',
          bgcolor: '#fff',
          color: '#334155',
          fontFamily: "'Poppins', sans-serif",
          fontSize: '9.5pt',
          lineHeight: 1.45,
          '& .MuiTypography-root, & .MuiChip-label': {
            fontFamily: 'inherit',
          },
          boxShadow: '0 4px 8px rgba(0,0,0,.2), 0 6px 20px rgba(0,0,0,.19)',
          overflow: 'hidden',
          '@media (max-width: 650px)': { flexDirection: 'column' },
          '@media print': {
            flexDirection: 'row',
            width: '210mm',
            height: '297mm',
            minHeight: '297mm',
            boxShadow: 'none',
            overflow: 'hidden',
          },
        }}
      >
        <Box
          component="aside"
          sx={{
            width: '60mm',
            flexShrink: 0,
            bgcolor: '#0f172a',
            color: '#f1f5f9',
            p: '6mm',
            display: 'flex',
            flexDirection: 'column',
            '@media print': { width: '60mm' },
            '@media (max-width: 650px)': {
              width: '100%',
              minHeight: 0,
            },
          }}
        >
          <Typography
            component="h2"
            sx={{
              color: '#38bdf8',
              fontSize: '9pt',
              fontWeight: 700,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              borderBottom: '1px solid #334155',
              pb: 0.75,
              mb: 1.5,
            }}
          >
            {isPolish ? 'Dane kontaktowe' : 'Contact'}
          </Typography>
          <Stack spacing={1.25} sx={{ mb: 3 }}>
            <ContactItem
              label="Email"
              value={content.email}
              href={`mailto:${content.email}`}
            />
            <ContactItem
              label={isPolish ? 'Telefon' : 'Phone'}
              value={content.phone}
              href={`tel:${content.phone}`}
            />
            <ContactItem
              label={isPolish ? 'Lokalizacja' : 'Location'}
              value={content.hometown}
            />
          </Stack>

          <Typography
            component="h2"
            sx={{
              color: '#38bdf8',
              fontSize: '9pt',
              fontWeight: 700,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              borderBottom: '1px solid #334155',
              pb: 0.75,
              mb: 1.5,
            }}
          >
            Tech Stack
          </Typography>
          <Stack spacing={1.5}>
            {Object.entries(content.techstack).map(
              ([category, technologies]) => (
                <Box key={category}>
                  <Typography
                    sx={{
                      color: '#cbd5e1',
                      fontSize: '8.5pt',
                      fontWeight: 600,
                      mb: 0.75,
                    }}
                  >
                    {category}
                  </Typography>
                  <Stack
                    direction="row"
                    useFlexGap
                    sx={{ flexWrap: 'wrap', gap: 0.5 }}
                  >
                    {technologies.map((technology) => (
                      <Chip
                        key={technology}
                        size="small"
                        label={technology}
                        sx={{
                          height: 'auto',
                          maxWidth: '100%',
                          bgcolor: '#1e293b',
                          color: '#e2e8f0',
                          border: '1px solid #334155',
                          borderRadius: 1,
                          '& .MuiChip-label': {
                            whiteSpace: 'normal',
                            px: 0.75,
                            py: 0.25,
                            fontSize: '7.5pt',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              ),
            )}
          </Stack>
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: '7mm',
            '@media (max-width: 650px)': { p: 2 },
          }}
        >
          <Box
            sx={{
              borderBottom: '2px solid #0284c7',
              pb: 1.5,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography
              component="h1"
              sx={{
                color: '#0f172a',
                fontSize: '20pt',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-.02em',
                overflowWrap: 'anywhere',
              }}
            >
              {content.name} {content.surname}
            </Typography>
            <Box sx={{ ml: 'auto', textAlign: 'right', flexShrink: 0 }}>
              <Typography
                sx={{
                  color: '#0284c7',
                  fontSize: '9pt',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.04em',
                }}
              >
                {content.role}
              </Typography>
              <Typography
                sx={{
                  color: '#475569',
                  fontSize: '7.5pt',
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                }}
              >
                {content.roleStack}
              </Typography>
            </Box>
          </Box>

          <Typography
            component="h2"
            sx={{
              my: 3,
              color: '#0284c7',
              fontSize: '16pt',
              fontWeight: 700,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '.12em',
            }}
          >
            {isPolish ? 'List motywacyjny' : 'Cover Letter'}
          </Typography>

          <Stack
            component="section"
            spacing={2.25}
            sx={{ color: '#334155', fontSize: '10pt', lineHeight: 1.7 }}
          >
            <Typography
              component="p"
              key={`start`}
              sx={{
                color: 'inherit',
                font: 'inherit',
                lineHeight: 'inherit',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
              }}
            >
              {isPolish ? 'Szanowni Państwo,': 'Dear Hiring Manager,'}
            </Typography>
            {content.paragraphs.map((paragraph, index) => (
              <Typography
                component="p"
                key={`${index}-${paragraph}`}
                sx={{
                  color: 'inherit',
                  font: 'inherit',
                  lineHeight: 'inherit',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                }}
              >
                {paragraph}
              </Typography>
            ))}
            <Typography
              component="p"
              key={`end`}
              sx={{
                color: 'inherit',
                font: 'inherit',
                lineHeight: 'inherit',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
                marginTop: 2,
                textAlign: 'right',
              }}
            >
              {isPolish ? 'Z poważaniem,': 'Best Regards,'}<br/>
              <b>{content.name} {content.surname}</b>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function ContactItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Typography
        sx={{
          color: '#94a3b8',
          fontSize: '7.5pt',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      {href ? (
        <Box
          component="a"
          href={href}
          sx={{
            color: 'inherit',
            fontSize: '8.5pt',
            overflowWrap: 'anywhere',
            '&:hover': { color: '#7dd3fc' },
          }}
        >
          {value}
        </Box>
      ) : (
        <Typography sx={{ fontSize: '8.5pt', overflowWrap: 'anywhere' }}>
          {value}
        </Typography>
      )}
    </Box>
  );
}
