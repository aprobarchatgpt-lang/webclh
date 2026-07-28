import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const csvPath =
  process.argv[2] || "/workspace/scratch/Miembros-Grid view.csv";
const imagesDir = path.join(root, "public/images/members");
const videosDir = path.join(root, "public/videos");
const membersPath = path.join(root, "app/members-data.ts");
const pagePath = path.join(root, "app/page.tsx");

const leaderIds = new Set([
  "CLH-005",
  "CLH-008",
  "CLH-028",
  "CLH-041",
  "CLH-025",
  "CLH-011",
  "CLH-034",
]);

function parseCsv(source) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, ""));
  return rows
    .filter((values) => values.some(Boolean))
    .map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])),
    );
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function attachment(value) {
  const match = value.match(/^(.*) \((https:\/\/[^)]+)\)$/s);
  return match ? { name: match[1].trim(), url: match[2] } : null;
}

function fileKind(name) {
  const extension = path.extname(name).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".heic"].includes(extension)) return "image";
  if ([".mp4", ".mov", ".m4v"].includes(extension)) return "video";
  return "unknown";
}

function normalizedRole(row) {
  if (row["ID miembro"] === "CLH-010") return "Finanzas";
  if (row["ID miembro"] === "CLH-076" || row["ID miembro"] === "CLH-075") {
    return "Cofundador";
  }
  if (leaderIds.has(row["ID miembro"])) return row["Rol en CLH"];
  return row["Rol en CLH"] || "Miembro";
}

function rank(row) {
  if (["CLH-076", "CLH-075"].includes(row["ID miembro"])) return 0;
  if (leaderIds.has(row["ID miembro"])) return 1;
  if (normalizedRole(row) !== "Miembro") return 2;
  return 3;
}

function existingAsset(directory, slug, extensions) {
  for (const extension of extensions) {
    const candidate = path.join(directory, `${slug}.${extension}`);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function download(url, destination) {
  execFileSync("curl", ["--fail", "--location", "--silent", "--show-error", url, "-o", destination], {
    stdio: "inherit",
  });
}

function normalizeImage(source, destination) {
  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      source,
      "-vf",
      "scale=1200:1500:force_original_aspect_ratio=increase,crop=1200:1500",
      "-quality",
      "82",
      destination,
    ],
    { stdio: "inherit" },
  );
}

function normalizeVideo(source, destination) {
  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      source,
      "-map",
      "0:v:0",
      "-map",
      "0:a:0?",
      "-vf",
      "scale='min(1080,iw)':-2",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "24",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      destination,
    ],
    { stdio: "inherit" },
  );
}

fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(videosDir, { recursive: true });

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
if (rows.length !== 75) {
  throw new Error(`Se esperaban 75 registros y se han encontrado ${rows.length}.`);
}

const seenSlugs = new Set();
for (const row of rows) {
  let slug = row["Slug web"].trim() || slugify(row["Nombre completo"]);
  if (seenSlugs.has(slug)) slug = `${slug}-${row["ID miembro"].toLowerCase()}`;
  seenSlugs.add(slug);
  row.__slug = slug;
  row.__role = normalizedRole(row);
}

rows.sort(
  (left, right) =>
    rank(left) - rank(right) ||
    left["Nombre completo"].localeCompare(right["Nombre completo"], "es", {
      sensitivity: "base",
    }),
);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "clh-members-"));
const failures = [];

for (const row of rows) {
  let imageAttachment = attachment(row["Foto - URL Drive"]);
  let videoAttachment = attachment(row["Vídeo - URL Drive"]);

  if (row["ID miembro"] === "CLH-057") {
    if (imageAttachment && fileKind(imageAttachment.name) === "video") {
      [imageAttachment, videoAttachment] = [videoAttachment, imageAttachment];
    }
  }

  if (imageAttachment) {
    const rawImage = path.join(tempDir, `${row.__slug}-image${path.extname(imageAttachment.name)}`);
    const outputImage = path.join(imagesDir, `${row.__slug}.webp`);
    try {
      download(imageAttachment.url, rawImage);
      normalizeImage(rawImage, outputImage);
    } catch (error) {
      failures.push(`${row["ID miembro"]}: foto`);
    }
  }

  if (videoAttachment) {
    const rawVideo = path.join(tempDir, `${row.__slug}-video${path.extname(videoAttachment.name)}`);
    const outputVideo = path.join(videosDir, `${row.__slug}.mp4`);
    try {
      download(videoAttachment.url, rawVideo);
      normalizeVideo(rawVideo, outputVideo);
    } catch (error) {
      failures.push(`${row["ID miembro"]}: vídeo`);
    }
  }
}

const members = rows.map((row) => {
  const slug = row.__slug;
  const image = existingAsset(imagesDir, slug, ["webp", "jpg", "jpeg", "png"]);
  const video = existingAsset(videosDir, slug, ["mp4"]);
  return {
    id: row["ID miembro"],
    name: row["Nombre completo"].trim(),
    country: row["País"].trim(),
    university: row["Universidad / Organización"].trim(),
    area: row["Área principal"].trim() || row["Formación / Puesto"].trim(),
    role: row.__role,
    slug,
    image: image ? `/images/members/${path.basename(image)}` : null,
    ...(video ? { video: `/videos/${path.basename(video)}` } : {}),
    linkedIn: row.LinkedIn.trim() || null,
    featured: row["ID miembro"] === "CLH-075",
  };
});

const membersSource = `export type Member = {
  id: string;
  name: string;
  country: string;
  university: string;
  area: string;
  role: string;
  slug: string;
  image: string | null;
  video?: string;
  linkedIn: string | null;
  featured?: boolean;
};

export const members: Member[] = ${JSON.stringify(members, null, 2)};
`;
fs.writeFileSync(membersPath, membersSource);

const profiles = Object.fromEntries(
  rows.map((row) => {
    const member = members.find((entry) => entry.id === row["ID miembro"]);
    const links = row.LinkedIn.trim()
      ? [{ label: "LinkedIn", href: row.LinkedIn.trim() }]
      : [];
    return [
      row.__slug,
      {
        status:
          row["Estado del perfil"] === "Completo"
            ? "Perfil completo"
            : "Perfil pendiente de completar",
        headline:
          row["Titular del perfil"].trim() ||
          row["Formación / Puesto"].trim() ||
          row.__role,
        bio:
          row["Bio pública breve"].trim() ||
          row["Bio existente - referencia interna"].trim(),
        motivation: row["Qué quiero construir"].trim(),
        contribution: row["Qué puedo aportar"].trim()
          ? [row["Qué puedo aportar"].trim()]
          : [],
        collaboration: row["Disponibilidad para colaborar"].trim(),
        evidence: [
          ["Intereses", row.Intereses.trim()],
          ["Habilidades", row.Habilidades.trim()],
          ["Idiomas", row.Idiomas.trim()],
        ]
          .filter(([, detail]) => detail)
          .map(([title, detail]) => ({ title, detail })),
        ...(member?.video ? { video: member.video } : {}),
        links,
      },
    ];
  }),
);

const pageSource = fs.readFileSync(pagePath, "utf8");
const start = pageSource.indexOf("const memberPilotProfiles:");
const end = pageSource.indexOf("\n\nfunction Button", start);
if (start < 0 || end < 0) throw new Error("No se encontró memberPilotProfiles.");

const declaration = `const memberPilotProfiles: Record<string, {
  status: string;
  headline: string;
  bio: string;
  motivation: string;
  contribution: string[];
  collaboration: string;
  evidence: { title: string; detail: string }[];
  evidenceKicker?: string;
  evidenceTitle?: string;
  video?: string;
  links?: { label: string; href: string }[];
}> = ${JSON.stringify(profiles, null, 2)};`;

fs.writeFileSync(
  pagePath,
  `${pageSource.slice(0, start)}${declaration}${pageSource.slice(end)}`,
);

fs.rmSync(tempDir, { recursive: true, force: true });

const counts = {
  records: members.length,
  founders: rows.filter((row) => rank(row) === 0).length,
  leaders: rows.filter((row) => rank(row) === 1).length,
  areas: rows.filter((row) => rank(row) === 2).length,
  members: rows.filter((row) => rank(row) === 3).length,
  images: members.filter((member) => member.image).length,
  videos: members.filter((member) => member.video).length,
  failures,
};

console.log(JSON.stringify(counts, null, 2));
