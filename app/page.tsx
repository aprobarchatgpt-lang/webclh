"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { members, type Member } from "./members-data";

type PageKey =
  | "inicio"
  | "comunidad"
  | "cultura"
  | "capitales"
  | "miembros"
  | "beway"
  | "semana"
  | "organizaciones"
  | "ideas"
  | "contacto";

const pageLabels: Record<PageKey, string> = {
  inicio: "Inicio",
  comunidad: "Qué es CLH",
  cultura: "Cultura, visión y misión",
  capitales: "Los 4 pilares de la comunidad",
  miembros: "Nuestros miembros",
  beway: "Beway",
  semana: "Cumbre CLH × Beway",
  organizaciones: "Para organizaciones",
  ideas: "El Rincón de las Ideas",
  contacto: "Contacto",
};

const capitals = [
  {
    key: "personal",
    number: "01",
    name: "Capital Personal",
    short: "Claridad y dirección personal.",
    title: "Liderar empieza por saber quién eres y hacia dónde vas.",
    body: "Antes que líder, eres persona. El Capital Personal ayuda a cada miembro a construir una dirección propia, comprender sus fortalezas, ordenar sus prioridades y actuar desde valores que puedan sostenerse en el tiempo.",
    bullets: [
      "Desarrollar un plan estratégico personal y contrastarlo con personas capaces de acompañarlo con honestidad.",
      "Encontrar escucha, perspectiva y criterio ante decisiones difíciles o etapas de incertidumbre.",
      "Trabajar liderazgo, bienestar, pensamiento crítico y aprendizajes que rara vez aparecen en un programa académico.",
    ],
    close: "No buscamos respuestas prefabricadas. Creamos el espacio para que cada persona construya las suyas.",
  },
  {
    key: "relacional",
    number: "02",
    name: "Capital Relacional",
    short: "Confianza y colaboración.",
    title: "Una red valiosa se mide por lo que sus integrantes construyen juntos.",
    body: "El Capital Relacional transforma el contacto en confianza y la confianza en colaboración. CLH conecta a personas de diferentes países y disciplinas que pueden aportarse perspectiva, oportunidades y apoyo durante muchos años.",
    bullets: [
      "Crear conexiones intencionadas entre miembros con intereses, retos o capacidades complementarias.",
      "Compartir retroalimentación honesta sobre perfiles, proyectos y decisiones profesionales.",
      "Organizar el conocimiento de la comunidad para que la experiencia de una persona fortalezca a muchas otras.",
    ],
    close: "El valor de una conexión aparece cuando alguien decide ponerla al servicio de otra persona.",
  },
  {
    key: "profesional",
    number: "03",
    name: "Capital Profesional",
    short: "Experiencia aplicada a retos reales.",
    title: "La excelencia profesional se demuestra resolviendo problemas reales.",
    body: "El Capital Profesional combina formación con responsabilidad. Los miembros consolidan el aprendizaje cuando trabajan sobre retos, toman decisiones y entregan resultados junto a equipos internacionales.",
    bullets: [
      "Aprender de profesionales que comparten herramientas y decisiones nacidas de su experiencia.",
      "Participar en proyectos reales como Beway, con investigación, análisis y propuestas concretas.",
      "Elevar la calidad de las entregas con acompañamiento de perfiles sénior y equipos multidisciplinares.",
    ],
    close: "Cada proyecto debe dejar una evidencia visible de lo aprendido y de la capacidad de aportar.",
  },
  {
    key: "economico",
    number: "04",
    name: "Capital Económico",
    short: "Sostenibilidad e impacto compartido.",
    title: "Las ideas adquieren valor cuando encuentran un modelo que les permite crecer.",
    body: "El Capital Económico enseña a transformar una iniciativa en una estructura sostenible. Cada proyecto debe definir a quién ayuda, qué valor genera y cómo puede sostenerse en el tiempo.",
    bullets: [
      "Definir desde el comienzo la propuesta de valor, los recursos y un modelo viable de continuidad.",
      "Acordar responsabilidades, reconocimiento y toma de decisiones antes de iniciar la ejecución.",
      "Reinvertir el valor generado en nuevas experiencias y proyectos dentro del marco jurídico aprobado.",
    ],
    close: "El impacto se multiplica cuando el valor vuelve al ecosistema que ayudó a crearlo.",
  },
];

const memberSlug = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const memberInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : ""}`.toUpperCase();
};

const assetBase = import.meta.env.BASE_URL.replace(/\/$/, "");
const assetPath = (path: string) => path.startsWith("http") ? path : `${assetBase}${path.startsWith("/") ? path : `/${path}`}`;

const memberPilotProfiles: Record<string, {
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
}> = {
  "alberto-sanchez-prieto": {
    "status": "Perfil completo",
    "headline": "Innovación",
    "bio": "Siente un verdadero amor por la conexión entre jóvenes de distintos países y por la fuerza transformadora que puede surgir cuando comparten ideas, experiencias y oportunidades. Cree firmemente en el potencial del talento joven y en la motivación como motor para generar impacto.",
    "motivation": "Quiero construir junto al resto de miembros de CLH una red sólida y consolidada, pero, sobre todo, una comunidad con una misión y unos valores claros que nos permitan avanzar en la misma dirección. Un espacio desde el que podamos demostrar que los jóvenes tenemos la capacidad de coordinarnos, asumir responsabilidades y generar valor real cuando trabajamos con un propósito compartido.",
    "contribution": [
      "Puede aportar una visión internacional, nuevas ideas y, sobre todo, la resiliencia necesaria para llevarlas a la práctica, superar las dificultades y no abandonar el camino antes de convertirlas en resultados."
    ],
    "collaboration": "24 horas al dia",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Economia Colaborativa"
      },
      {
        "title": "Habilidades",
        "detail": "Imaginación"
      },
      {
        "title": "Idiomas",
        "detail": "Español, Ingles"
      }
    ],
    "video": "/videos/alberto-sanchez-prieto.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/albertosprietocolmenero/"
      }
    ]
  },
  "jorge-gregorio-garcia-heras": {
    "status": "Perfil completo",
    "headline": "Fundador de CLH | Estrategia, comunidad e innovación | España",
    "bio": "Jorge Gregorio García-Heras es cofundador de la Comunidad de Líderes Hispanoamericanos (CLH), una red internacional que conecta talento joven, universidades, profesionales y organizaciones. Impulsa iniciativas orientadas a transformar relaciones en oportunidades y proyectos reales entre España y Latinoamérica. Es cofundador de Beway, un ecosistema creado para acercar empresas y universitarios mediante retos, investigación, innovación y evidencias de ejecución. Su trabajo se centra en la visión estratégica, la creación de comunidad y la conexión de personas con capacidad, iniciativa y voluntad de construir juntas.",
    "motivation": "Un ecosistema internacional en el que el talento joven acceda a oportunidades reales, las empresas descubran nuevas perspectivas y las universidades colaboren en proyectos, investigación e innovación entre países.",
    "contribution": [
      "Visión estratégica, creación de comunidades internacionales y capacidad para conectar talento, universidades y empresas. Experiencia impulsando alianzas, coordinando equipos y convirtiendo ideas en proyectos concretos."
    ],
    "collaboration": "Disponible para alianzas estratégicas, proyectos internacionales, desarrollo de comunidad y colaboraciones puntuales con empresas, universidades y miembros de CLH y Beway.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "emprendimiento, innovación, liderazgo, talento joven, educación, tecnología, inteligencia artificial, desarrollo de comunidades, colaboración internacional"
      },
      {
        "title": "Habilidades",
        "detail": "visión estratégica, creación de comunidades, desarrollo de alianzas, liderazgo de equipos, comunicación, coordinación de proyectos, networking, desarrollo de negocio"
      },
      {
        "title": "Idiomas",
        "detail": "español, inglés"
      }
    ],
    "video": "/videos/jorge-gregorio-garcia-heras.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/jgreego/"
      }
    ]
  },
  "camila-calvo": {
    "status": "Perfil pendiente de completar",
    "headline": "Marketing",
    "bio": "Estudiante de Business Analytics & Marketing en Aden Business School. Experiencia en análisis de datos, compliance y operaciones a través de prácticas en Philips, Canal de Panamá y Scotiabank. Perfil orientado a business analytics, procesos y entornos corporativos.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/camila-calvo-de-la-guardia/"
      }
    ]
  },
  "cristobal-vargas-marchant": {
    "status": "Perfil pendiente de completar",
    "headline": "Economía",
    "bio": "Estudiante de Ingeniería Comercial con mención en Economía en la Universidad de Chile. Vice President \nde Corporate Finance en el Club de Finanzas FEN, con experiencia en análisis financiero, research macroeconómico y participación en iniciativas vinculadas a mercados de capitales e investment banking. Perfil orientado a finanzas corporativas, análisis estratégico y desarrollo profesional en entornos competitivos.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "video": "/videos/cristobal-vargas-marchant.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/crist%C3%B3bal-vargas-marchant-4289151b5/"
      }
    ]
  },
  "emily-torres-pineda": {
    "status": "Perfil pendiente de completar",
    "headline": "Derecho",
    "bio": "Estudiante de Jurisprudencia y Relaciones Internacionales en la Universidad del Rosario. Asistente de \ninvestigación en derechos humanos y derecho internacional. Coordinadora de semillero de investigación  y monitora académica en varias asignaturas jurídicas. Experiencia en Model United Nations (NHSMUN)  y en proyectos de investigación jurídica e inteligencia estratégica. Perfil orientado a política internacional, derecho internacional y liderazgo académico.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/emily-torres-pineda/"
      }
    ]
  },
  "federico-matz": {
    "status": "Perfil pendiente de completar",
    "headline": "Negocios Digitales",
    "bio": "Estudiante de Negocios Digitales en la Universidad de San Andrés con un perfil orientado a la intersección entre estrategia, creatividad y tecnología, combinando experiencia en marketing, emprendimiento y análisis de negocio con una mentalidad práctica de “aprender haciendo”, destacando por el desarrollo de proyectos con impacto real —como soluciones digitales en salud o e-commerce— y una fuerte capacidad de storytelling, análisis data-driven y visión de producto, posicionándose como un perfil versátil enfocado en construir soluciones innovadoras y diferenciales en entornos dinámicos.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/federico-matz/"
      }
    ]
  },
  "michelle-rogel": {
    "status": "Perfil completo",
    "headline": "Estudiante de Ingeniería Mecatrónica | Gestión de proyectos de ingeniería e impacto social | Voluntariado Corporativo",
    "bio": "Ingeniera en formación apasionada por liderar proyectos que generan impacto social, conectar personas y construir alianzas entre tecnología, empresas y comunidad.",
    "motivation": "Quiero formar parte de una comunidad donde podamos compartir conocimiento, colaborar en proyectos con impacto y desarrollar iniciativas que unan la innovación, la tecnología y el compromiso social. También busco seguir creciendo como líder y aprender de personas con diferentes experiencias.",
    "contribution": [
      "• Gestión y coordinación de proyectos.\n• Organización de voluntariados corporativos.\n• Planeación de eventos y experiencias.\n• Vinculación con organizaciones de la sociedad civil.\n• Automatización y mejora de procesos.\n• Trabajo en equipo y liderazgo.\n• Desarrollo de estrategias de impacto social."
    ],
    "collaboration": "Disponible para alianzas estratégicas, proyectos internacionales, desarrollo de comunidad y colaboraciones puntuales con empresas, universidades y miembros de CLH y Beway.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Innovación social, Ingeniería, Automatización, Inteligencia Artificial, Gestión de proyectos, Emprendimiento social, Liderazgo, Networking, Tecnología, Educación, Sustentabilidad, Voluntariado Corporativo, Desarrollo Comunitario."
      },
      {
        "title": "Habilidades",
        "detail": "* Project Management\n* Organización de eventos\n* Planeación estratégica\n* Liderazgo\n* Comunicación\n* Trabajo en equipo\n* Resolución de problemas\n* Manejo de IA (Claude, Codex)\n* Python\n* MATLAB\n* AutoCAD\n* Fusion 360\n* PLCs\n* Arduino\n* Análisis de datos\n* Microsoft Excel\n* Google Workspace"
      },
      {
        "title": "Idiomas",
        "detail": "🇲🇽 Español — Nativo\n🇺🇸 Inglés — Avanzado (C1)"
      }
    ],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/michelle-rogel-garc%C3%ADa-a37820219/"
      }
    ]
  },
  "renata-berho": {
    "status": "Perfil completo",
    "headline": "Ingeniería aeroespacial, innovación tecnológica y liderazgo juvenil",
    "bio": "Renata es estudiante de Ingeniería Aeroespacial en la Universidad Nacional de La Plata, apasionada por la ciencia, la tecnología y el desarrollo de soluciones innovadoras con impacto social. En 2026 fue seleccionada como delegada argentina para representar a su país en el Space Generation Congress en Turquía, uno de los principales encuentros internacionales de la comunidad espacial. También fue seleccionada para formar parte del Aspire Leaders Program, una iniciativa internacional de liderazgo impulsada por miembros de la comunidad de Harvard, y se destacó entre los 100 mejores postulantes del South American Business Forum. Es ganadora del Samsung Innovation Campus Capstone Project por AIDA, un asistente basado en inteligencia artificial orientado a la alfabetización digital de adultos mayores, y fue delegada argentina del National Youth Science Camp 2024. Actualmente impulsa proyectos vinculados a educación STEM, innovación y liderazgo juvenil, mientras complementa su formación con hockey sobre césped de alto rendimiento, desarrollando disciplina, trabajo en equipo y resiliencia.",
    "motivation": "Quiero impulsar proyectos que conecten jóvenes, tecnología e innovación, creando espacios de colaboración interdisciplinaria donde estudiantes puedan desarrollar soluciones de impacto en ciencia, educación y sostenibilidad mediante hackatones, comunidades y alianzas estratégicas.",
    "contribution": [
      "Experiencia en liderazgo juvenil, gestión de comunidades, organización de hackatones y proyectos STEM. Puedo aportar conocimientos en innovación tecnológica, inteligencia artificial, comunicación científica, desarrollo de iniciativas educativas y creación de alianzas internacionales."
    ],
    "collaboration": "5-6 horas/semana, disponible para proyectos, mentorías, eventos y colaboraciones estratégicas",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Innovación tecnológica, inteligencia artificial, ingeniería aeroespacial, ciencia y tecnología, educación STEM, liderazgo juvenil, exploración espacial, sostenibilidad, energía nuclear, comunidades globales"
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo de equipos, gestión de proyectos, organización de eventos, comunicación científica, programación, adaptabilidad, inteligencia artificial, análisis de datos, trabajo interdisciplinario, relaciones institucionales"
      },
      {
        "title": "Idiomas",
        "detail": "Español, inglés"
      }
    ],
    "video": "/videos/renata-berho.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/renata-berho-02264230a/"
      }
    ]
  },
  "santiago-narino-rivera": {
    "status": "Perfil completo",
    "headline": "Administración de Negocios Internacionales | Marketing Estratégico | Finanzas e Inversión | Estrategia e Innovación | IA aplicada a Negocios",
    "bio": "Soy estudiante de Administración de Negocios Internacionales con énfasis en Marketing y formación complementaria en Finanzas. Me apasiona desarrollar estrategias que impulsen el crecimiento de las organizaciones mediante la innovación, el análisis y la tecnología. He participado en proyectos de investigación, consultoría, competencias internacionales de emprendimiento y análisis de negocios, fortaleciendo habilidades en estrategia, finanzas, comercio internacional y gestión de proyectos. Actualmente, dedico parte de mi tiempo a impulsar iniciativas que conectan estudiantes y profesionales para generar oportunidades de aprendizaje, colaboración e impacto en Hispanoamérica. Creo en el liderazgo basado en la acción, el aprendizaje continuo y el uso de la inteligencia artificial como herramienta para transformar la forma en que las empresas toman decisiones y crean valor.",
    "motivation": "Quiero construir una red de jóvenes líderes que desarrollen proyectos de innovación, emprendimiento y transformación empresarial en Hispanoamérica. Me interesa impulsar alianzas entre universidades, empresas y organizaciones para generar oportunidades de aprendizaje, investigación aplicada y desarrollo profesional.",
    "contribution": [
      "Puedo aportar conocimientos en estrategia empresarial, innovación, análisis financiero, gestión de proyectos, comercio internacional, investigación de mercados y liderazgo de equipos. También disfruto conectar personas, estructurar iniciativas colaborativas y compartir herramientas de productividad y organización para proyectos de alto impacto."
    ],
    "collaboration": "Disponible para mentorías, proyectos estratégicos, iniciativas de innovación, investigación aplicada y colaboración interdisciplinaria. Aproximadamente 5–8 horas por semana.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Estrategia empresarial, innovación, emprendimiento, inteligencia artificial, finanzas, inversión, marketing, comercio internacional, liderazgo, investigación, transformación digital, productividad, desarrollo profesional."
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo, gestión de proyectos, pensamiento estratégico, análisis financiero, negociación, resolución de problemas, investigación de mercados, comunicación, trabajo en equipo, planificación, innovación."
      },
      {
        "title": "Idiomas",
        "detail": "Español, inglés, francés"
      }
    ],
    "video": "/videos/santiago-narino-rivera.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/santiago-nari%C3%B1o-rivera-10351429b/"
      }
    ]
  },
  "adrian-alava": {
    "status": "Perfil pendiente de completar",
    "headline": "Negocios Internacionales",
    "bio": "Estudiante de Negocios Internacionales en la Universidad Espíritu Santo (UEES), con excelente \nrendimiento académico y experiencia en operaciones financieras y comercio exterior. Actualmente realiza prácticas en Ocean Network Express, desarrollando conocimientos en logística y operaciones de importación/exportación. Destaca por su perfil analítico, liderazgo y capacidad de adaptación internacional, reforzados por experiencias como el NASA Space Apps Challenge, olimpíadas matemáticas y programas académicos en el extranjero. Interesado en finanzas, comercio internacional y desarrollo estratégico en entornos globales.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/adrian-alava-93a64b312/"
      }
    ]
  },
  "alexa-ramirez-garcia": {
    "status": "Perfil pendiente de completar",
    "headline": "Marketing",
    "bio": "Estudiante de International Business en el Tecnológico de Monterrey. Experiencia en comunicación, \nmarketing y desarrollo de campañas, con participación en proyectos de expansión internacional (KidZania) y programas de liderazgo (ESG Global Leadership Program). Fundadora de una iniciativa social enfocada en sostenibilidad y colaboradora en proyectos de impacto social y comunicación.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/alexaramirezg/"
      }
    ]
  },
  "byron-zambrano": {
    "status": "Perfil pendiente de completar",
    "headline": "Negocios Internacionales",
    "bio": "Estudiante de International Business en la Universidad Espíritu Santo (UEES). Actualmente pasante en  Rivedasa S.A. y con experiencia previa en logística internacional en Paccari Chocolate, participando en gestión de exportaciones y coordinación de eventos promocionales. Coordinador de UEES Leaders, con perfil orientado a negocios internacionales, liderazgo estudiantil y gestión operativa.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/byron-zambrano-47853230b/"
      }
    ]
  },
  "christopher-marroquin": {
    "status": "Perfil completo",
    "headline": "Emprendedor tecnológico | Creo sistemas útiles y oportunidades a través de la tecnología | El Salvador",
    "bio": "Soy estudiante de Ingeniería de Software y Negocios Digitales, desarrollador full-stack, programador competitivo y emprendedor tecnológico salvadoreño. Me apasiona aprender, conocer personas, resolver problemas y convertir ideas en proyectos que generen valor.\n\nDisfruto especialmente las lluvias de ideas, crear productos digitales, organizar eventos y encontrar formas de llevar una idea desde una conversación hasta una solución real. Como cofundador y líder general de C3, he impulsado competencias, plataformas y experiencias que conectan a jóvenes con aprendizaje, comunidad y oportunidades profesionales.\n\nMe considero una persona curiosa, proactiva y orientada a construir. Creo que la tecnología no solo sirve para desarrollar sistemas, sino también para conectar personas, crear experiencias y abrir oportunidades para otros.",
    "motivation": "Quiero construir comunidades, alianzas y proyectos que conecten a personas con nuevas oportunidades de aprendizaje, colaboración y crecimiento. Me interesa crear cosas nuevas, impulsar ideas innovadoras y convertirlas en iniciativas que generen un impacto real y positivo.",
    "contribution": [
      "Puedo aportar experiencia creando y coordinando equipos, organizando eventos y experiencias tecnológicas, desarrollando productos digitales y convirtiendo ideas en planes ejecutables. También puedo contribuir con creatividad, lluvias de ideas, gestión de proyectos, resolución de problemas y conexión con talento joven.\nPara conocer mas sobre mi trabajo, los invito a visitar mi sitio web y portafolio: https://christophermarroquin.dev/"
    ],
    "collaboration": "2 - 3 horas por semana, con disponibilidad para proyectos y colaboraciones",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Emprendimiento tecnológico, productos digitales, comunidades tecnológicas, innovación, liderazgo juvenil, educación STEM, eventos tecnológicos, alianzas internacionales"
      },
      {
        "title": "Habilidades",
        "detail": "Desarrollo full-stack, liderazgo de equipos, gestión de proyectos, organización de eventos, ideación, resolución de problemas, comunicación"
      },
      {
        "title": "Idiomas",
        "detail": "Español nativo, inglés profesional"
      }
    ],
    "video": "/videos/christopher-marroquin.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/christopher-marroquin23/?locale=es"
      }
    ]
  },
  "claudio-federico-buffardi-witzke": {
    "status": "Perfil completo",
    "headline": "Ingeniero Industrial en formación | Apasionado por la manufactura y los procesos | Bicicleta de montaña y enduro extremo",
    "bio": "Claudio es estudiante de Ingeniería Industrial en Ciudad de México. Tiene experiencia en logística retail por su paso por Farmatodo, la cadena farmacéutica más grande de Venezuela, donde coordinó entregas de proveedores a gran escala y redujo el inventario de devoluciones en un 30%. Cuenta con certificación Six Sigma Yellow Belt. Fuera del trabajo le gusta montar motos de enduro extremo y de bici montañera.",
    "motivation": "Una empresa de manufactura propia en Latinoamérica (aún explorando el sector), pero con claridad en el cómo — procesos eficientes, calidad y manufactura esbelta. Busco conocer a personas con experiencia en fábricas y producción industrial. Y quiero construir una familia.",
    "contribution": [
      "Experiencia en logística y cadena de suministro retail, mejora de procesos (Six Sigma), y distribución/comercialización de marcas internacionales en el mercado venezolano. También manejo de e-commerce ligero, marketing digital para nichos deportivos y análisis de datos con Excel e Inteligencia Artificial."
    ],
    "collaboration": "2-4 horas a la semana.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Inteligencia Artificial, Motos, Bicicleta de montaña, Golf, Tenis, Música."
      },
      {
        "title": "Habilidades",
        "detail": "Mejora de procesos (Six Sigma), análisis de datos, Excel, mecánica de motos, mantenimiento de bicicletas de montaña, ventas y negociación, networking"
      },
      {
        "title": "Idiomas",
        "detail": "Español, Inglés, Italiano"
      }
    ],
    "video": "/videos/claudio-federico-buffardi-witzke.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/claudio-buffardi/"
      }
    ]
  },
  "daniel-lopez": {
    "status": "Perfil completo",
    "headline": "Daniel López",
    "bio": "Me apasiona crear conexiones valiosas, aprender de otros y colaborar para crear cosas nuevas. Con visión innovadora, desarrollo productos funcionales y de calidad. Además, lidero equipos a nivel nacional e internacional, en busca del mejor resultado posible por medio de la co-creación.",
    "motivation": "Herramientas y soluciones que faciliten y optimicen procesos valiosos",
    "contribution": [
      "Ideas frescas, contactos y una visión de innovación y desarrollo constante"
    ],
    "collaboration": "Disponible para alianzas estratégicas, proyectos internacionales, desarrollo de comunidad y colaboraciones puntuales con empresas, universidades y miembros de CLH y Beway.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Programación\nNegocios\nEmprendimiento\nTecnología\nCompetencias"
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo\nComunicación\nGestión de equipos y recursos"
      },
      {
        "title": "Idiomas",
        "detail": "Inglés\nEspañol"
      }
    ],
    "video": "/videos/daniel-lopez.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/daniellopezdev/"
      }
    ]
  },
  "daniela-olmedo": {
    "status": "Perfil completo",
    "headline": "Consultoría · Finanzas · Curaduría",
    "bio": "Daniela forma parte del área de análisis financiero y macroeconómico de CLH. Participa en consultoría estratégica, desarrollo de propuestas e investigación, con un interés especial por proyectos que conectan disciplinas, personas y perspectivas distintas.\nDisfruta especialmente la etapa previa a cualquier solución: comprender un problema en profundidad, cuestionar supuestos y construir una visión clara. Su trabajo se centra en el análisis financiero y económico, la investigación aplicada y el desarrollo de propuestas estratégicas. Ha participado en proyectos y competencias de finanzas, donde consolidó un enfoque basado la evaluación de escenarios y la toma de decisiones con criterio.",
    "motivation": "Busca construir espacios donde la investigación, el pensamiento estratégico y la diversidad de perspectivas permitan abordar problemas complejos desde una mirada más amplia. Cree que las mejores ideas aparecen cuando distintas formas de pensar trabajan juntas hacia un mismo objetivo.",
    "contribution": [
      "Pensamiento analítico aplicado a finanzas y economía, capacidad para estructurar problemas complejos y convertir ideas en propuestas concretas. Experiencia en investigación, desarrollo de propuestas, comunicación, curaduría y coordinación de equipos multidisciplinares."
    ],
    "collaboration": "Disponible para colaborar con empresas y miembros de CLH en proyectos de análisis financiero, investigación económica y consultoría.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Consultoría, finanzas, análisis financiero, economía, economía conductual, estrategia, investigación, curaduría, psicología."
      },
      {
        "title": "Habilidades",
        "detail": "Análisis financiero, investigación, desarrollo de propuestas, pensamiento estratégico, estructuración de proyectos , gestión de iniciativas, curaduría, comunicación, redacción"
      },
      {
        "title": "Idiomas",
        "detail": "Español, ingles"
      }
    ],
    "video": "/videos/daniela-olmedo.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/daniela-olmedo-13a029318/"
      }
    ]
  },
  "fabian-rivera": {
    "status": "Perfil completo",
    "headline": "Ingeniería Industrial | Gestión de talento, liderazgo y desarrollo de personas",
    "bio": "Fabián Rivera es estudiante de Ingeniería Industrial Administrativa, apasionado por la gestión de talento, el liderazgo y la construcción de equipos de alto rendimiento. Cuenta con experiencia en procesos de atracción de talento, coordinación de equipos y desarrollo de proyectos, enfocándose en conectar personas con oportunidades de crecimiento. Se interesa por la mejora continua, la optimización de procesos y la creación de espacios donde las personas puedan aportar valor y desarrollar su potencial. Actualmente busca seguir fortaleciendo sus habilidades en recursos humanos, liderazgo y gestión estratégica de personas.",
    "motivation": "Quiero construir espacios donde el talento y las oportunidades puedan encontrarse naturalmente; donde las personas no tengan que perseguir oportunidades, sino donde las oportunidades lleguen a quienes tienen el potencial, las ganas y la visión para transformar su entorno.",
    "contribution": [
      "Experiencia en atracción de talento, entrevistas, gestión de proyectos y coordinación de equipos. Puedo aportar conocimientos en organización de procesos, identificación de perfiles, comunicación efectiva, liderazgo y creación de conexiones entre personas con objetivos comunes."
    ],
    "collaboration": "4-6 horas a la semana",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Gestión de talento, recursos humanos, liderazgo, desarrollo profesional, mejora continua, innovación, gestión de proyectos, networking, emprendimiento"
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo de equipos, comunicación efectiva, entrevistas y selección de talento, gestión de proyectos, organización, análisis de procesos, resolución de problemas, trabajo en equipo"
      },
      {
        "title": "Idiomas",
        "detail": "Español, inglés"
      }
    ],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/fabian-rivera-342ab8366/"
      }
    ]
  },
  "felipe-hernandez-marin": {
    "status": "Perfil completo",
    "headline": "Fundador y Director EcoSustainability Club - Farmacia + Administracción y Dirección de Empresas",
    "bio": "Apasionado por el mundo científico, tecnológico y empresarial, tanto por tradición familiar como por vocación personal, estudio Farmacia y ADE Bilingüe en la Universidad CEU San Pablo con el objetivo de mejorar la vida de las personas a través de la investigación, la innovación y el conocimiento.\n\nAl comenzar mi etapa universitaria, un grupo de compañeros y yo activamos el EcoSustainability Club, una iniciativa que busca acercar la sostenibilidad a estudiantes como nosotros. Entusiasmados por aprender y generar un impacto positivo en la sociedad, para nosotros, la sostenibilidad no es solo una palabra de moda o tendencia pasajera, sino que supone adoptar un compromiso con los demás. Así, nuestro Club Universitario nace con el objetivo de fomentar una sociedad respetuosa con la persona y el medioambiente en la que se promueva el bien común.\n\nMi objetivo es integrar ciencia, empresa, innovación y sostenibilidad para crear soluciones que transformen vidas y construyan un futuro próspero y mejor para todos.",
    "motivation": "Mi objetivo es construir una comunidad de jóvenes talentos en el ámbito de las ciencias de la salud conectando diferentes disciplinas transformando ideas en proyectos con impacto.",
    "contribution": [
      "Puedo aportar liderazgo y capacidad para convertir ideas en proyectos reales generando espacios en los que surjan nuevas oportunidades de colaboración. Mi formación en Farmacia y Dirección de Empresas me permite conectar el conocimiento científico con la estrategia, la innovación y el emprendimiento. Además, puedo contribuir con experiencia impulsando iniciativas estudiantiles, organizando actividades y creando comunidades con proyección internacional e impacto positivo."
    ],
    "collaboration": "Disponible para proyectos puntuales.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Ciencias de la salud, ciencias farmacéuticas, farmacología, innovación en salud, investigación biomédica, sostenibildiad, emprendimiento, relaciones internacionales, impacto social."
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo de equipos, emprendimiento, gestión sostenible, comunicación."
      },
      {
        "title": "Idiomas",
        "detail": "Español, Inglés"
      }
    ],
    "video": "/videos/felipe-hernandez-marin.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/felipe-hernandez-marin/"
      }
    ]
  },
  "fernando-fuentes": {
    "status": "Perfil completo",
    "headline": "Ingeniero de Software | Arquitecturas Distribuidas | Liderazgo Digital",
    "bio": "Fernando es un ingeniero de Software especializado en la construcción de sistemas nativos para la nube, con especialización en arquitecturas distribuidas y escalables para la era de la IA y los datos. Le gusta aprender continuamente y siempre buscar las experiencias más retadoras y que lo lleven a pensar fuera de la caja.",
    "motivation": "Me gustaría construir una red de investigación en toda Latinoamérica relacionada con la tecnología aplicada a diferentes áreas de la sociedad, como las finanzas, la biotecnología, la robótica y en general, cualquier disciplina que se impulse de la innovación como vehículo para el progreso de la humanidad.",
    "contribution": [
      "Amplia experiencia en la gestión, diseño y construcción de proyectos de software empresariales. Visión de liderazgo y perspectiva digital. Innovación y conocimientos científicos especializados en la computación."
    ],
    "collaboration": "6 horas a la semana, trabajo por proyectos",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Sistemas en la nube, Software, Hardware, Finanzas, liderazgo"
      },
      {
        "title": "Habilidades",
        "detail": "Desarrollo de Software, Arquitectura en la nube, Liderazgo digital"
      },
      {
        "title": "Idiomas",
        "detail": "Español, inglés"
      }
    ],
    "video": "/videos/fernando-fuentes.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/fernando-fuentes-aba154259/?locale=es"
      }
    ]
  },
  "gabriela-gallardo": {
    "status": "Perfil pendiente de completar",
    "headline": "Business",
    "bio": "Estudiante de Administración de Empresas en la Universidad Espíritu Santo. Experiencia en proyectos de \nestrategia y sostenibilidad, participando en iniciativas de compliance ambiental y competiciones internacionales de negocio (Global Scaling Challenge). Perfil orientado a estrategia, análisis y desarrollo empresarial.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/gabriela-gallardo-96a7842a5/"
      }
    ]
  },
  "german-benito-menendez": {
    "status": "Perfil pendiente de completar",
    "headline": "Farmacéutico | Trade Marketing en ISDIN | BioLynx | MSc Pharma Marketing & Commercial Leadership",
    "bio": "Germán es un farmacéutico especializado en marketing, actualmente trabajando en ISDIN, donde se encarga de estrategias de trade marketing orientadas a maximizar la visibilidad de marca en el punto de venta. Cursó un MSc en Pharma Marketing & Commercial Leadership, profundizando en la intersección entre ciencia, negocio y comunicación.\n\nForma parte de BioLynx, una comunidad científica de talento joven, y colabora activamente en el área de Expansión Internacional de CLH Global, donde busca y desarrolla alianzas estratégicas con marcas y organizaciones para los eventos de la comunidad. \n\nEs un apasionado de las nuevas tecnologías y la inteligencia artificial, y trata de aplicarlas a fondo tanto en su día a día personal como en su trabajo. \n\nLe motiva construir puentes entre el mundo farmacéutico y otros sectores, y cree en el poder de las redes internacionales para acelerar el crecimiento profesional de las nuevas generaciones.",
    "motivation": "Un modelo de \"partner progresivo\": empresas que empiezan con un coffee break o un stand y escalan hacia mentorías, CEO shadowing o proyectos conjuntos con la comunidad.",
    "contribution": [
      "Gestión de comunidad, eventos y redes sociales (experiencia en BioLynx); desarrollo de campañas de marketing digital (email marketing); aplicación de IA a negocio, flujos de trabajo y análisis; y gestión de relaciones comerciales con partners, incluyendo contacto en frío (outbound)."
    ],
    "collaboration": "2-4 horas a la semana, disponible todo el año, prefiero trabajar bajo proyectos/retos que me motiven a conseguir un objetivo",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Marketing, gestión de colaboraciones comerciales, gestión de proyectos, oratoria, inteligencia artificial, networking internacional, desarrollo de comunidades"
      },
      {
        "title": "Habilidades",
        "detail": "Marketing, gestión de comunidad, organización de eventos, gestión de redes sociales, email marketing, aplicación de IA a negocio, gestión de relaciones comerciales, contacto en frío (outbound)"
      },
      {
        "title": "Idiomas",
        "detail": "Español, Inglés, Italiano, Alemán (básico)"
      }
    ],
    "video": "/videos/german-benito-menendez.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/germanbenito21/"
      }
    ]
  },
  "ian-ruiz": {
    "status": "Perfil completo",
    "headline": "Emprendedor Digital",
    "bio": "Estudiante de Negocios Internacionales de la Universidad Espíritu Santo (Ecuador), Coordinador de Marketing del Hult Prize Ecuador 2026.",
    "motivation": "Me gustaría colaborar en cualquier proyecto promovido por la comunidad.",
    "contribution": [
      "Experiencia en gestión de proyectos de escala nacional e internacional."
    ],
    "collaboration": "2-4",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Inteligencia Artificial, Marketing, Inversión, Emprendimiento, Economía"
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo de equipos, Planificación Estratégica, Comunicación, Atención al detalle"
      },
      {
        "title": "Idiomas",
        "detail": "Español, Inglés"
      }
    ],
    "video": "/videos/ian-ruiz.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/ian-ruiz/?locale=es"
      }
    ]
  },
  "jose-humberto-leon-ledesma": {
    "status": "Perfil pendiente de completar",
    "headline": "Comunicación",
    "bio": "Estudiante de Entertainment Business Management en la Universidad Anáhuac Mayab. Presidente \nde la Sociedad de Alumnos de la Escuela de Comunicación y Dirección de Empresas de \nEntretenimiento. Experiencia en la industria del entretenimiento y hospitality con The Walt \nDisney Company y proyectos internacionales de entretenimiento, con perfil orientado a liderazgo \nde equipos, producción de experiencias y gestión de proyectos creativos.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/jos%C3%A9-humberto-le%C3%B3n-ledesma-1bb4111b7/"
      }
    ]
  },
  "josue-roberto-polanco": {
    "status": "Perfil pendiente de completar",
    "headline": "Tecnología",
    "bio": "Estudiante de Software Engineering and Digital Business en ESEN, enfocado en backend \ndevelopment, algoritmos y calidad de software. Co-fundador de Competitive Coding Club (C3), donde participa en la organización de competiciones nacionales de programación y en la creación de espacios para el desarrollo del talento técnico joven en El Salvador. Cuenta con experiencia en programación competitiva de nivel internacional (ICPC), formación de estudiantes en algoritmos y desarrollo backend con Python, FastAPI y Firebase, destacando por su pensamiento analítico, precisión técnica y capacidad de ejecución.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/roberto-polanco-0bb176354/"
      }
    ]
  },
  "juan-sebastian-gomez-vera": {
    "status": "Perfil completo",
    "headline": "Coordinador de Inteligencia Artificial y Automatización - CLH.",
    "bio": "Sebastian es Ingeniero oriundo de Bucaramanga pero actualmente viviendo en Bogotá. Una persona que busca siempre ser proactiva dentro de su constante  educación. Ve lo asombroso que pueden ser las pequeñas cosas y decide alegremente buscar aprender algo de cualquier persona que conoce.",
    "motivation": "Una red multicultural interdisciplinaria que ayude a impulsar conocimientos de tecnologías de vanguardia bajo criterios viabilidad aplicativa para mercados reales.",
    "contribution": [
      "Experiencia en investigación e implementación de conceptos de Inteligencia Artificial. Manejo de código y tecnologías aplicadas. Gestión de proyectos y soft skills de liderazgo y formación."
    ],
    "collaboration": "2",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Inteligencia Artificial, Gestión de Proyectos"
      },
      {
        "title": "Habilidades",
        "detail": "Análisis de Datos, Programación, Aprendizaje de Maquinas, Investigación"
      },
      {
        "title": "Idiomas",
        "detail": "Español, Inglés"
      }
    ],
    "video": "/videos/juan-sebastian-gomez-vera.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/juansgomezv/"
      }
    ]
  },
  "kevin-elias-luna-palacios": {
    "status": "Perfil pendiente de completar",
    "headline": "Ingenieria Informática",
    "bio": "Estudiante de Ingeniería de Software y Negocios Digitales en ESEN. Presidente de EduTECH ESEN, \nliderando iniciativas de educación tecnológica y alfabetización digital. Perfil orientado a ciberseguridad, tecnología y liderazgo en entornos formativos.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/kevin-luna-a0b024325/?locale=es"
      }
    ]
  },
  "krissia-alejandra-bueno": {
    "status": "Perfil pendiente de completar",
    "headline": "Business",
    "bio": "Estudiante de Economía y Negocios en ESEN. Experiencia en análisis económico y datos como asistente \nde cátedra en múltiples áreas y en entornos financieros. Perfil orientado a análisis, econometría y desarrollo académico.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/krissia-bueno-a61a4031a/"
      }
    ]
  },
  "larissa-arias-alamilla": {
    "status": "Perfil completo",
    "headline": "Ingeniera Industrial | Liderazgo, gestión de proyectos y mejora de procesos",
    "bio": "Estudiante de Ingeniería Industrial con experiencia en liderazgo, gestión de proyectos, planeación y coordinación de equipos. Me he desarrollado en espacios de liderazgo universitario, donde he participado en la organización de actividades formativas, proyectos de responsabilidad social y gestión de equipos multidisciplinarios. Como vicepresidenta del programa Impulsa durante la gestión 2026, fortalecí mis habilidades de comunicación, toma de decisiones, organización y trabajo colaborativo. También cuento con experiencia en proyectos relacionados con logística, optimización de procesos y análisis para la mejora de operaciones. Me caracterizo por mi iniciativa, compromiso y capacidad para conectar personas y áreas con el propósito de transformar ideas en proyectos concretos. Busco continuar desarrollándome profesionalmente, generar alianzas y participar en iniciativas que impulsen la innovación, el liderazgo y el impacto positivo en la sociedad.",
    "motivation": "Busco construir alianzas estratégicas y proyectos que conecten el talento joven con empresas y organizaciones, impulsando la innovación, el liderazgo y el impacto positivo. Estoy abierta a proyectos internacionales, desarrollo de comunidades y colaboraciones con miembros de CLH y BeWay.",
    "contribution": [
      "Conocimientos de Ingeniería Industrial, gestión y coordinación de proyectos, liderazgo de equipos, planeación, logística, mejora de procesos y organización. Experiencia en iniciativas de responsabilidad social y colaboración entre áreas."
    ],
    "collaboration": "4-5 horas a la semana",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Ingeniería Industrial, liderazgo, gestión de proyectos, logística, mejora de procesos, innovación, emprendimiento, responsabilidad social, desarrollo profesional, sostenibilidad."
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo, gestión de proyectos, trabajo en equipo, comunicación, planeación, organización, logística, mejora de procesos, resolución de problemas, toma de decisiones."
      },
      {
        "title": "Idiomas",
        "detail": "Español, Inglés"
      }
    ],
    "video": "/videos/larissa-arias-alamilla.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/larissa-arias-alamilla-7a3931374/"
      }
    ]
  },
  "leonardo-lozano": {
    "status": "Perfil completo",
    "headline": "Estudiante de Economía en USFQ | Datos, IA y automatización | The Panchonomist | USFQ DataHub | BI 40/45",
    "bio": "Soy estudiante de Economía en la Universidad San Francisco de Quito, con interés en análisis económico, investigación aplicada, ciencias sociales computacionales, automatización y uso de datos. Formo parte de la directiva de The Panchonomist, donde contribuyo a iniciativas académicas, eventos, Analytics y proyectos como Econ Challenge Jr. 2026. También colaboro con USFQ DataHub en proyectos relacionados con bases de datos abiertas, metadata e investigación aplicada. En CLH participo como Builder en Automatización e IA, con el objetivo de aportar a la profesionalización y escalabilidad de la comunidad desde la tecnología. Mi trayectoria académica incluye el Diploma Bilingüe del Bachillerato Internacional con 40/45, cuatro becas de mérito, la Lista del Canciller de la USFQ con GPA 4.0, y reconocimientos como Abanderado del Pabellón Nacional y Mejor Egresado.",
    "motivation": "Quiero construir sistemas, alianzas y proyectos que conecten economía, datos e IA para profesionalizar organizaciones, fortalecer redes universitarias y convertir información dispersa en herramientas útiles para la toma de decisiones.",
    "contribution": [
      "Aporto análisis económico, manejo de datos y pensamiento crítico para estructurar problemas, interpretar información y convertirla en propuestas aplicables. Puedo apoyar en investigación, automatización, organización de proyectos y comunicación clara de hallazgos."
    ],
    "collaboration": "2-3 horas/semana",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "inteligencia artificial, análisis económico, ciencia de datos, automatización, investigación aplicada, ciencias sociales computacionales, educación, liderazgo estudiantil, innovación, desarrollo organizacional"
      },
      {
        "title": "Habilidades",
        "detail": "análisis de datos, pensamiento crítico, investigación académica, Python, R, SQL, Microsoft Excel, automatización, organización de proyectos, comunicación escrita, liderazgo estudiantil, tutoría académica, trabajo en equipo"
      },
      {
        "title": "Idiomas",
        "detail": "Español Nativo, Inglés C1, Portugués Intermedio"
      }
    ],
    "video": "/videos/leonardo-lozano.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/leonardo-lozano-8a8710371/?locale=en"
      }
    ]
  },
  "lucia-maria-vizcarrondo": {
    "status": "Perfil pendiente de completar",
    "headline": "Marketing",
    "bio": "Estudiante de Marketing en la Universidad de Navarra, especializada en Comunicación Corporativa y \nparticipante del Global Program in Innovation & Entrepreneurship (GPIE), un programa selectivo centrado en \ninnovación y emprendimiento. Ha desarrollado experiencia en marketing hotelero, creación de contenido, \ngestión de eventos y posicionamiento de marca durante sus prácticas en Hotel El Convento, complementada \ncon certificaciones en marketing digital y SEO. Perfil con visión internacional, creativo, orientado a la comunicación \nestratégica, la innovación y el desarrollo de marcas.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/luc%C3%ADa-maria-vizcarrondo-0928613ab/"
      }
    ]
  },
  "manuel-losa": {
    "status": "Perfil completo",
    "headline": "Técnico y creativo",
    "bio": "Tras 3 años de estudios en ingeniería aeroespacial, Manuel es una persona cualificada y acostumbrada a buscar los detalles en toda tarea que se le requiere. La dificultad técnica de sus estudios también a generado un perfil muy creativo a la hora de solucionar problemas.",
    "motivation": "Me gustaría crear un portal de búsqueda de viviendas para estudiantes de erasmus.",
    "contribution": [
      "Puedo aportar capacidad de organización, automatización de procesos, contacto personal y resolución de problemas."
    ],
    "collaboration": "12 horas/semana",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Educación STEM"
      },
      {
        "title": "Habilidades",
        "detail": "análisis de datos, capacidad de liderazgo"
      },
      {
        "title": "Idiomas",
        "detail": "español, ingles, chino (básico), alemán (básico)"
      }
    ],
    "video": "/videos/manuel-losa.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/manuel-losa-l%C3%B3pez-7560913aa/"
      }
    ]
  },
  "maria-amo": {
    "status": "Perfil pendiente de completar",
    "headline": "Marketing",
    "bio": "Estudiante de Marketing en inglés en la Universidad Rey Juan Carlos, con experiencia internacional en \nEM Normandie Oxford, Disneyland Paris y Walt Disney World. Paid Media Intern en Havas Media España y Vicepresidenta de ESN URJC, con experiencia en campañas digitales, gestión de equipos, movilidad internacional y experiencia de cliente en entornos multiculturales. Perfil orientado a marketing estratégico, paid media, innovación y creación de experiencias internacionales de alto impacto.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/mar%C3%ADa-amo/"
      }
    ]
  },
  "maria-pia-olivera": {
    "status": "Perfil pendiente de completar",
    "headline": "Relaciones Internacionales",
    "bio": "Estudiante de Estudios Internacionales en Universidad ORT Uruguay. Formación en política internacional y análisis geopolítico, con certificaciones en política exterior y relaciones internacionales. Perfil orientado a análisis estratégico, relaciones internacionales y entorno político global.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/mar%C3%ADa-p%C3%ADa-olivera-coccaro-339928389/"
      }
    ]
  },
  "maria-victoria-llorach": {
    "status": "Perfil pendiente de completar",
    "headline": "Marketing",
    "bio": "",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": []
  },
  "martina-leich": {
    "status": "Perfil completo",
    "headline": "Estudiante de Comunicación | Comunicación estratégica, Publicidad y Marketing - Periodismo | Cultura, moda y arte | Uruguay",
    "bio": "Dentro de la carrera le interesan las áreas de Comunicación Estratégica, Publicidad y Marketing - Periodismo. La combinación de estas áreas le permiten comunicar a las audiencias con una base estratégica sólida. Le interesa explorar la cultura, la moda y el arte. Además, disfruta compartir espacios internacionales y multiculturales.\nEs una persona proactiva, flexible, tenaz y organizada; siempre busca dar su máximo en todo lo que hace, convencida de que de los desafíos surgen los mejores aprendizajes. Estas cualidades se reflejan tanto en su vida personal como en su vida profesional y busca compartirlas con quienes la rodean a través del liderazgo.",
    "motivation": "Una red de apoyo y colaboración multicultural.",
    "contribution": [
      "Tengo experiencia en gestión y creación de contenido para iniciativas institucionales y emprendimientos, así como en proyectos sociales. También en creación de capacitaciones y entrevistas. \nMi empatía y tenacidad me permite guiar proyectos, logrando grandes resultados. Soy una persona creativa, lo que me permite comunicar mensajes atractivos con especial atención al detalle –sin perder su profundidad–."
    ],
    "collaboration": "2 horas por semana, disponible para proyectos puntuales",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Cultura, moda, arte"
      },
      {
        "title": "Habilidades",
        "detail": "Empatía, dinamismo y energía, perseverancia, pensamiento crítico, trabajo en equipo, liderazgo, atención al detalle, criterio estético, flexibilidad, proactividad"
      },
      {
        "title": "Idiomas",
        "detail": "Español, inglés, portugués"
      }
    ],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/martina-leicht-05b44b340/"
      }
    ]
  },
  "miguel-angel": {
    "status": "Perfil pendiente de completar",
    "headline": "Tecnología",
    "bio": "Estudiante de Ingeniería en Systems Engineering en la Universidad Interamericana de Panamá, \ncon experiencia en infraestructura tecnológica, coordinación de proyectos y soporte IT. Actualmente realiza prácticas en Philips dentro del área de Infrastructure Services, desarrollando conocimientos en gestión de proyectos, operaciones tecnológicas y entornos corporativos internacionales. Destaca por su perfil técnico, orientación al detalle y capacidad de trabajo en equipo, combinando formación en ingeniería con interés por liderazgo y tecnología aplicada a negocio.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/miguel-mes-81458a285/"
      }
    ]
  },
  "milton-gorocica-rivas": {
    "status": "Perfil pendiente de completar",
    "headline": "Emprender",
    "bio": "Estudiante de International Business en la Universidad Anáhuac Mayab. Emprendedor y director de \nRancho El Prado, proyecto enfocado en hospitalidad, naturaleza y experiencias sostenibles. Expresidente de la Sociedad de Alumnos de la Facultad de Negocios, con perfil orientado a emprendimiento, liderazgo de equipos y desarrollo de proyectos turísticos.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/milton-gorocica-rivas-7a110a2b1/"
      }
    ]
  },
  "minerva-capcha": {
    "status": "Perfil pendiente de completar",
    "headline": "Derecho",
    "bio": "Estudiante de Marketing en la Universidad del Pacífico. Becaria del programa de Gestión de Inversiones \ny Mercado de Capitales de la Bolsa de Valores de Lima. Delegada en Harvard WorldMUN y activa en proyectos internacionales de diplomacia y negociación. Experiencia en investigación de mercado, economía conductual y estrategia de comunicación institucional. Perfil orientado a estrategia, finanzas, innovación y liderazgo internacional.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/capcha-minerva/"
      }
    ]
  },
  "nicole-ramirez": {
    "status": "Perfil pendiente de completar",
    "headline": "Expansión",
    "bio": "Estudiante de International Business en la Universidad Espíritu Santo (UEES), becada al 100% por \nmérito académico tras ganar INNOVA UEES 2023 con un proyecto de innovación de impacto. Destaca por su liderazgo, pensamiento crítico y capacidad de adaptación, combinando un perfil académico de alto rendimiento con interés en desarrollo de negocios y comercio internacional. Actualmente realiza prácticas como Executive Assistant Intern en RIVEDASA y participa activamente en apoyo académico como Teaching Assistant en Accounting II.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/nicole-ram%C3%ADrez-chica-4573bb305/"
      }
    ]
  },
  "oscar-jose-pleites": {
    "status": "Perfil pendiente de completar",
    "headline": "Tecnología",
    "bio": "Estudiante de Software Engineering and Digital Business en ESEN, especializado en algoritmos, \nbackend y programación competitiva de alto nivel. Co-fundador de Competitive Coding Club (C3), donde lidera la creación de competiciones técnicas y el desarrollo de comunidades tecnológicas en El Salvador. Destaca por su pensamiento estructurado, capacidad de liderazgo bajo presión y enfoque extremo en resolución de problemas complejos, correctness y ejecución técnica.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/osplei/"
      }
    ]
  },
  "priscila-bryan-serrano": {
    "status": "Perfil pendiente de completar",
    "headline": "Operaciones",
    "bio": "Estudiante de Florida State University con formación en finanzas, análisis de datos y gestión \nempresarial. Ha desarrollado experiencia en compañías internacionales como Philips y Ascendancy Fund, participando en análisis financiero, financiación inmobiliaria y gestión administrativa. Perfil analítico, adaptable y orientado a la resolución de problemas, con interés en innovación, tecnología aplicada a finanzas y desarrollo internacional.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/priscilla-bryan-serrano-65b022313/"
      }
    ]
  },
  "ricardo-corao": {
    "status": "Perfil pendiente de completar",
    "headline": "Ingenieria Industrial",
    "bio": "Estudiante de Ingeniería Industrial Administrativa en la USMA. Experiencia en operaciones y mejora de \nprocesos en EF y Haleon, participando en planificación, ejecución de proyectos internacionales y optimización industrial (Lean Six Sigma). Perfil orientado a operaciones, eficiencia y gestión de proyectos.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/ricardo-corao-837036331/"
      }
    ]
  },
  "sebastian-rotter-rochin": {
    "status": "Perfil completo",
    "headline": "Estudiante de Negocios Internacionales | Liderazgo Estratégico | Desarrollo Organizacional",
    "bio": "Sebastián Rotter es estudiante de Negocios Internacionales en la Universidad Anáhuac Mayab y cuenta con experiencia en liderazgo estudiantil, gestión de equipos y desarrollo organizacional. Actualmente se desempeña como Coordinador de Desarrollo Académico de la Sociedad de Alumnos de la Facultad de Economía y Negocios y es responsable del área de Espiritualidad y Trascendencia en el Programa de Liderazgo y Excelencia Vértice. Destaca por su capacidad para coordinar proyectos, organizar equipos multidisciplinarios y generar iniciativas que impulsen el crecimiento de las personas y las organizaciones. Su perfil bicultural, junto con su interés por la innovación, el marketing y la estrategia, le permiten desenvolverse en entornos colaborativos con una visión global y orientada a resultados.",
    "motivation": "Quiero ver la forma en que mi universidad trabaje de la mano con CLH para impulsar proyectos e iniciativas para el acercamiento a empresas.",
    "contribution": [
      "Liderazgo de equipos, organización de proyectos, desarrollo organizacional, planeación estratégica, coordinación de eventos, mejora de procesos, marketing, comunicación efectiva y creación de iniciativas que generen impacto en comunidades y organizaciones."
    ],
    "collaboration": "5 horas por semana",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Logística, IA, proyectos de desarrollo, investigación de mercado, consultoría, etc."
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo de equipos, diseño, desarrollo organizacional, trabajo en equipo, coordinación de proyectos ."
      },
      {
        "title": "Idiomas",
        "detail": "Español, Inglés y Chino Básico"
      }
    ],
    "video": "/videos/sebastian-rotter-rochin.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/sebasti%C3%A1n-rotter-rochin-7ba892256/"
      }
    ]
  },
  "sebastian-vigueras-araya": {
    "status": "Perfil completo",
    "headline": "Ingeniero en Industrias Eléctricas | Liderazgo Social Transformador | Chile",
    "bio": "Estudiante de Ingeniería UC con experiencia en investigación aplicada, prototipado e innovación tecnológica, ha sido reconocido en concursos de investigación e innovación y se ha desempeñado como profesor auxiliar en labores de docencia. Combina esta formación técnica con liderazgo estudiantil y una conciencia intercultural forjada en programas internacionales como Transforma e Impacta, además de un compromiso social que ha canalizado a través de la dirección de iniciativas de voluntariado y educación. Se destaca por un pensamiento crítico e innovador, orientado a optimizar procesos y desarrollar soluciones creativas frente a problemáticas técnicas y sociales.",
    "motivation": "Quiero construir una red con sentido: personas que prioricen entender la realidad y el problema antes que apurar una solución. Un espacio donde la empatía, la escucha activa y el pensamiento crítico guíen el trabajo, para crear soluciones que realmente respondan a las necesidades de quienes las viven.",
    "contribution": [
      "Ingeniero en formación con experiencia en investigación aplicada, prototipado e innovación tecnológica, reconocida en concursos UC. Perfil interdisciplinario (Eléctrica y Biomédica), con habilidades en docencia, liderazgo estudiantil y gestión de equipos, orientado a soluciones técnicas creativas y de alto impacto."
    ],
    "collaboration": "4hrs. semanales",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Gestión/Optimización de Operaciones, Administración de Proyectos, liderazgo Social"
      },
      {
        "title": "Habilidades",
        "detail": "Comunicación Efectiva, Liderazgo, Gestión de Equipos, Proactividad"
      },
      {
        "title": "Idiomas",
        "detail": "Español, Inglés"
      }
    ],
    "video": "/videos/sebastian-vigueras-araya.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/sebasti%C3%A1n-vigueras-araya-6680b9295/"
      }
    ]
  },
  "simon-ospina-lizcano": {
    "status": "Perfil completo",
    "headline": "Apasionado, Optimista y de Buen Humor",
    "bio": "Simón Ospina es un joven colombiano, estudiante de último año de Derecho (Jurisprudencia), con enorme interés en derecho público y ambiental. Es un hombre que cree en la interdisciplinariedad y la integralidad del ser humano para alcanzar resultados con propósitos, y que cree en las personas más allá de su carrera o contexto.",
    "motivation": "Quiero impulsar proyectos de networking y redes internacionales, donde se presenten oportunidades y eventos para jóvenes de LATAM.",
    "contribution": [
      "Simón aporta conocimiento técnico desde el Derecho, así como ganas de liderar, de aportar y de colaborar en distintas ramas de CLH como medios y proyectos de la comunidad."
    ],
    "collaboration": "Miembro de Equipo Jurídico y Equipo de Comunicaciones",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Sostenibilidad, Inteligencia Artificial, Datos, Bioética"
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo, Adaptabilidad, Resolución de Problemas, Oratoria"
      },
      {
        "title": "Idiomas",
        "detail": "Español e Inglés"
      }
    ],
    "video": "/videos/simon-ospina-lizcano.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/sim%C3%B3n-ospina-lizcano-200910233/"
      }
    ]
  },
  "sthefan-borace": {
    "status": "Perfil completo",
    "headline": "Marketing Digital | Growth & Business Strategy | Emprendimiento | Panamá",
    "bio": "Sthefan Borace es estudiante de Ingeniería Comercial y profesional en formación con experiencia en marketing digital, comunicación corporativa, emprendimiento y desarrollo de negocios. Actualmente trabaja en Philips apoyando iniciativas regionales para Latinoamérica y participa en proyectos de innovación, contenido educativo y transformación digital. También es cofundador de GatoCode, donde impulsa estrategias de crecimiento para empresas. Le apasiona construir soluciones que combinen tecnología, creatividad y estrategia para generar impacto en organizaciones y comunidades.",
    "motivation": "Una red de jóvenes, emprendedores y profesionales que colaboren en proyectos de innovación, tecnología, educación y desarrollo empresarial para generar oportunidades e impacto en Hispanoamérica.",
    "contribution": [
      "Experiencia en marketing digital, comunicación estratégica, creación de contenido, branding, emprendimiento, crecimiento de negocios, automatización con IA, gestión de proyectos y mentoría. Me gusta conectar personas, compartir conocimiento y desarrollar soluciones con impacto real."
    ],
    "collaboration": "Disponible para mentorías, proyectos de innovación, emprendimiento, marketing, comunicación estratégica y colaboración con comunidades de liderazgo.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "emprendimiento, inteligencia artificial, marketing digital, innovación, startups, liderazgo, educación, estrategia de negocios, crecimiento empresarial, tecnología, transformación digital"
      },
      {
        "title": "Habilidades",
        "detail": "Marketing digital, Comunicación estratégica, Growth Marketing, Creación de contenido, Branding, Business Strategy, Gestión de proyectos, Storytelling, Diseño de procesos, Inteligencia Artificial, Automatización, Liderazgo"
      },
      {
        "title": "Idiomas",
        "detail": "Español (nativo), Inglés (C1)"
      }
    ],
    "video": "/videos/sthefan-borace.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/sthefanborace/"
      }
    ]
  },
  "valeria-espinoza-leon": {
    "status": "Perfil pendiente de completar",
    "headline": "Negocios Internacionales",
    "bio": "Estudiante de Negocios Internacionales en la Universidad Espíritu Santo (UEES). Fundadora del vivero \nSan Cristóbal y participante en Hult Prize 2025 con el proyecto social Koralink. Experiencia en proyectos vinculados a sostenibilidad, gestión de iniciativas emprendedoras y liderazgo estudiantil. Perfil orientado a emprendimiento, sostenibilidad y negocios internacionales.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/valeria-espinoza-le%C3%B3n-4bb325306/"
      }
    ]
  },
  "valeria-riojas-davila": {
    "status": "Perfil completo",
    "headline": "Estudiante de Mercadotecnia estratégica | Negocios internacionales | Liderazgo | Gestión de Proyectos e Impacto Social",
    "bio": "Valeria Riojas es estudiante de Mercadotecnia Estratégica en la Universidad Anáhuac Mayab, con interés en los negocios internacionales, la comunidad, la estrategia y el liderazgo. Ha coordinado equipos multidisciplinarios y proyectos estudiantiles enfocados en el desarrollo organizacional, la formación de líderes y la organización de eventos de alto impacto. Se distingue por su capacidad para planificar, resolver problemas y generar entornos de colaboración. Disfruta desarrollar estrategias de comunicación, crear contenido y gestionar iniciativas que conecten personas con un propósito. Su objetivo profesional es contribuir al crecimiento de organizaciones mediante la innovación, el trabajo en equipo y una visión estratégica con impacto social.",
    "motivation": "Una red de colaboración entre jóvenes líderes, emprendedores y organizaciones para desarrollar proyectos de impacto social, innovación y emprendimiento. Busco impulsar iniciativas que generen crecimiento profesional, formación de líderes y oportunidades para transformar positivamente nuestras comunidades.",
    "contribution": [
      "Experiencia en liderazgo estudiantil, organización de eventos, gestión de proyectos, marketing estratégico, creación de contenido, coordinación de equipos, planeación, mejora de procesos, comunicación efectiva y desarrollo organizacional. Siempre dispuesto a colaborar, compartir aprendizajes y construir soluciones en equipo."
    ],
    "collaboration": "2 horas por semana en proyectos puntuales que busquen alcanzar objetivos específicos a corto y largo plazo.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Marketing estratégico, negocios internacionales, liderazgo, emprendimiento, innovación, inteligencia artificial, desarrollo organizacional, creación de contenido, gestión de proyectos, comercio internacional, sostenibilidad, impacto social, branding, transformación digital, animación digital y storytelling con propósito"
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo de equipos, gestión de proyectos, marketing digital, marketing estratégico, planeación estratégica, comunicación efectiva, organización, resolución de problemas, negociación, análisis de mercado, creación de contenido, trabajo en equipo, gestión de eventos, pensamiento analítico, adaptabilidad"
      },
      {
        "title": "Idiomas",
        "detail": "Español (nativo), inglés (avanzado), Francés (básico)"
      }
    ],
    "video": "/videos/valeria-riojas-davila.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/valeria-riojas-d/"
      }
    ]
  },
  "vivianna-reynold": {
    "status": "Perfil completo",
    "headline": "Estratega de marketing de contenidos y narrativa de marca | México",
    "bio": "Vivian es creadora de contenido y estratega de marketing digital. Con formación en finanzas, aporta una mirada analítica poco común al desarrollo de marca: diseña estrategias de contenido orientadas a la conversión, construye narrativas con voz propia y traduce conceptos complejos en historias cercanas. Su trabajo se ubica en la intersección entre la comunicación estratégica, el storytelling y el emprendimiento con propósito. Le interesa el marketing que no solo capta audiencias, sino que construye comunidad y significado a largo plazo.",
    "motivation": "Una red de creadores y proyectos hispanohablantes que apuesten por el contenido con propósito.",
    "contribution": [
      "Estrategia de marketing de contenidos y desarrollo de voz de marca: guiones para redes, arquitectura narrativa y análisis de audiencia. Aporto también una perspectiva financiera para medir y comunicar el valor de una marca."
    ],
    "collaboration": "Disponibilidad flexible entre semana por las tardes y fines de semana; abierta a proyectos puntuales y alianzas de mediano plazo.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "marketing de contenidos, storytelling de marca, comunicación digital, emprendimiento con propósito, estrategia en redes sociales, cultura Gen Z, finanzas aplicadas al branding"
      },
      {
        "title": "Habilidades",
        "detail": "estrategia de contenido, redacción y copywriting, desarrollo de voz de marca, storytelling, análisis financiero"
      },
      {
        "title": "Idiomas",
        "detail": "español, inglés"
      }
    ],
    "video": "/videos/vivianna-reynold.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "www.linkedin.com/in/vivianna-reynold-8120b1300"
      }
    ]
  },
  "yamel-fernandez": {
    "status": "Perfil pendiente de completar",
    "headline": "Marketing",
    "bio": "Estudiante de Comunicación Audiovisual en la Universidad Iberoamericana. Experiencia en fotografía y \nstorytelling visual, cubriendo eventos, retrato y proyectos sociales, incluyendo trabajos institucionales de alto nivel. Perfil creativo orientado a contenido, narrativa visual y producción audiovisual.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://linkedin.com/in/yamel-fernández-899617317/?skipRedirect=true"
      }
    ]
  },
  "anahi-ayala-monzon": {
    "status": "Perfil completo",
    "headline": "Ciencias Diplomáticas y Derecho | Diálogo, cooperación internacional y diplomacia deportiva | Paraguay",
    "bio": "Anahí Ayala Monzón estudia Ciencias Diplomáticas y Derecho, dos carreras que combina para comprender las relaciones internacionales desde la teoría y la práctica. Orienta su camino hacia el cruce entre el deporte, el derecho y la diplomacia, donde se encuentran su vocación profesional y su pasión personal. Hoy ese interés ya se traduce en acciones concretas. Representa a distintos países en simulaciones diplomáticas, colaborando tambien en la organización de eventos internacionales y deportivos. A la vez, sostiene un compromiso constante con causas ambientales y sociales a través del voluntariado. En el ámbito universitario, preside el Tribunal Electoral Independiente de su Club de Diplomacia. Además, es miembro fundadora y Secretaria de Finanzas de la Revista Diplomática Académica \"El Diplómata UC\", espacio que impulsa la construcción de articulos, debate de ideas y la vida institucional. Entiende la cooperación internacional como un ejercicio cotidiano de diálogo y representación, y el deporte como un lenguaje capaz de acercar culturas. Con esa base, aspira a seguir creciendo y a tender puentes cada vez más amplios entre las naciones.",
    "motivation": "Construir, junto a la comunidad, un sistema de investigación y redacción de artículos que forme a nuevos autores, e iniciativas que respondan a los intereses y necesidades de sus miembros. En equipo, abrir a más jóvenes espacios de cooperación internacional y diálogo entre naciones.",
    "contribution": [
      "Investigación y redacción de artículos académicos, experiencia en representación diplomática, organización de eventos internacionales y trabajo voluntario. Competencias en negociación, mediación intercultural y comunicación bilingüe, y liderazgo orientado a la cooperación internacional."
    ],
    "collaboration": "Disponible para proyectos y colaboraciones puntuales, según agenda académica.",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Diplomacia, derecho internacional, diplomacia deportiva, cooperación internacional, medioambiente y conservación, fortalecimiento democrático, liderazgo juvenil, investigación y escritura académica, inclusión social, compromiso social y voluntariado."
      },
      {
        "title": "Habilidades",
        "detail": "Negociación, oratoria, mediación intercultural, construcción de consensos, gestión de proyectos y eventos, liderazgo de equipos, análisis estratégico, comunicación bilingüe, gestión del tiempo y multitarea, y adaptabilidad."
      },
      {
        "title": "Idiomas",
        "detail": "Español, Guaraní e Inglés."
      }
    ],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/anahiayalazn/?locale=en"
      }
    ]
  },
  "ander-garcia": {
    "status": "Perfil pendiente de completar",
    "headline": "Derecho",
    "bio": "",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": []
  },
  "federico-lander": {
    "status": "Perfil completo",
    "headline": "Estudiante de Ingeniería en Dirección de Negocios | Apasionado por las finanzas, la innovación y desarrollo empresarial",
    "bio": "Estudiante de cuarto semestre de Ingeniería en Dirección de Negocios, con un fuerte interés en finanzas, desarrollo empresarial y liderazgo. Complementa su formación académica con su participación en la Sociedad de Ingeniería, el Programa de Liderazgo Empresarial y diversas actividades extracurriculares y de voluntariado.\nSe caracteriza por su disciplina, compromiso y disposición para aprender y asumir nuevos retos.",
    "motivation": "Me interesa construir una red de relaciones profesionales que genere oportunidades de aprendizaje y colaboración. Busco impulsar proyectos relacionados con finanzas y negocios.",
    "contribution": [
      "Perspectiva de un estudiante de negocios interesado en finanzas, liderazgo y desarrollo empresarial. Puedo compartir aprendizajes de proyectos académicos, networking, actividades de liderazgo y voluntariado, así como mi experiencia desarrollando habilidades técnicas y profesionales."
    ],
    "collaboration": "5 horas por semana",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "inteligencia artificial, mercado de valores, consultoría, deportes"
      },
      {
        "title": "Habilidades",
        "detail": "Análisis, resolución de problemas, trabajo en equipo, comunicación, liderazgo, organización, disciplina, pensamiento crítico, Excel, networking"
      },
      {
        "title": "Idiomas",
        "detail": "Español, inglés"
      }
    ],
    "video": "/videos/federico-lander.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://linkedin.com/in/federicolander29/es/?skipRedirect=true"
      }
    ]
  },
  "fran-rodgmont": {
    "status": "Perfil pendiente de completar",
    "headline": "Ingeniería Informática",
    "bio": "Estudiante de Computer Science en Universidad Don Bosco. Fundador de Obelysk, centrado en el desarrollo de infraestructura de inteligencia artificial y sistemas aplicados a digital assets. Perfil orientado a inteligencia artificial, arquitectura tecnológica y construcción de soluciones deep tech en entornos innovadores",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://linkedin.com/in/rodgmont/?skipRedirect=true"
      }
    ]
  },
  "gilberto-ceballos": {
    "status": "Perfil completo",
    "headline": "Estudiante de Derecho | Derecho Corporativo y M&A",
    "bio": "Gilberto Ceballos es estudiante de noveno semestre de Derecho en la Universidad Panamericana con sólida experiencia en derecho corporativo, M&A y reestructuras. Ha trabajado en prestigiosos bufetes como Garrido Licona, S.C. y Rios Zertuche, González Lutteroth y Rodríguez, S.C., desarrollando competencias en asesoramiento corporativo y análisis legal. Domina inglés, español y francés, lo que le permite desempeñarse en entornos multiculturales. Busca contribuir eficazmente como abogado ético y comprometido, manteniendo actualización constante sobre tendencias legales.",
    "motivation": "Proyectos de alto impacto en derecho corporativo e innovación legal; fortalecer mi práctica en reestructuras y financiero;\ncontribuir al desarrollo de soluciones legales éticas y estratégicas en contextos multiculturales.",
    "contribution": [
      "Experiencia en derecho corporativo y M&A, asesoramiento en constitución y operación de sociedades, redacción de contratos, comunicación multilingüe (inglés, español, francés) y análisis legal estratégico."
    ],
    "collaboration": "Siempre",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Derecho corporativo, M&A, Innovación legal, Derecho de tecnología, Entornos multiculturales, Liderazgo ético, Fútbol, Viajar, Gastronomía"
      },
      {
        "title": "Habilidades",
        "detail": "Análisis crítico, Comunicación efectiva, Trabajo en equipo, Liderazgo, Pensamiento estratégico, Resolución de problemas, Adaptabilidad multicultural, Negociación, Redacción y presentación de ideas, Gestión de proyectos, Atención al detalle"
      },
      {
        "title": "Idiomas",
        "detail": "Español, Inglés, Frances"
      }
    ],
    "video": "/videos/gilberto-ceballos.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/gilberto-ceballos-97aa94230/"
      }
    ]
  },
  "iker-guitierrez-de-jesus": {
    "status": "Perfil pendiente de completar",
    "headline": "Ingeniería Industrial",
    "bio": "Estudiante de Ingeniería Industrial y de Sistemas en el Tecnológico de Monterrey, con experiencia profesional como \nDigital Intern en El Puerto de Liverpool. Presidente de COPARMEX Capítulo Universitario Tec Santa Fe, donde lidera \niniciativas de vinculación empresarial, emprendimiento, formación profesional y liderazgo joven. Cuenta además con \nexperiencia en coordinación logística, organización de eventos y gestión de proyectos dentro de asociaciones estudiantiles. \nPerfil orientado a transformación digital, mejora de procesos, tecnología aplicada a la toma de decisiones y construcción de \nconexiones entre el entorno universitario y empresarial.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/iker-guti%C3%A9rrez-de-jes%C3%BAs-aa7b05244/"
      }
    ]
  },
  "ivo-gomez-de-segura": {
    "status": "Perfil pendiente de completar",
    "headline": "Relaciones Internacionales",
    "bio": "Estudiante de Business Administration & International Relations en IE University. Experiencia en ventas \ny consultoría de branding, con participación en proyectos en IEU Labs y entorno internacional (SMU). Perfil orientado a negocio, marketing y entornos internacionales.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/ivogomezdeseguragomez/?locale=es"
      }
    ]
  },
  "jorge-calderon": {
    "status": "Perfil completo",
    "headline": "Creo en el liderazgo que trasciende, en las decisiones que transforman y que su impacto puede cambiar el mundo",
    "bio": "Soy estudiante de Economía en la Universidad San Francisco de Quito (USFQ) y me apasiona comprender cómo funcionan los principios económicos en la práctica y cómo las instituciones influyen en la vida cotidiana. Me caracterizo por mi resiliencia, ambición y un fuerte deseo de crecimiento continuo.\n\nA lo largo de mi trayectoria académica y profesional, he consolidado habilidades clave en trabajo en equipo, comunicación y resolución de problemas. Como presidente del Consejo Estudiantil de la U.E. Liceo Panamericano Samborondón, se fomentó con éxito la cohesión grupal y se optimizó el desempeño del equipo. Así mismo la experiencia en el voluntariado me ayudó a comprender que lo más importante en esta vida, es el impacto y la huella imborrable que dejas a las personas que están en la comunidad.",
    "motivation": "Una familia, que se sienta conectada con los valores de CLH.",
    "contribution": [
      "Experiencia en proyectos de voluntariado, gestión de grupos, propuestas de acción."
    ],
    "collaboration": "2-3 horas a la semana",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Economía circular, instituciones, educación."
      },
      {
        "title": "Habilidades",
        "detail": "Responsabilidad, liderazgo."
      },
      {
        "title": "Idiomas",
        "detail": "Inglés, español. (Francés y mandarín básico)"
      }
    ],
    "video": "/videos/jorge-calderon.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "www.linkedin.com/in/jorgeandrscalderon"
      }
    ]
  },
  "karen-jimena-fonseca": {
    "status": "Perfil pendiente de completar",
    "headline": "Finanzas",
    "bio": "Estudiante de Finanzas y Relaciones Internacionales en la Universidad Externado de Colombia. \nLiderazgo en mercado de capitales como directora en Finvext Club y monitora académica, con experiencia en investigación y análisis financiero. Perfil orientado a inversión, asset management y mercados financieros.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/karen-jimena-fonseca/"
      }
    ]
  },
  "krissia-alejandra-bueno-clh-077": {
    "status": "Perfil pendiente de completar",
    "headline": "Miembro",
    "bio": "",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": []
  },
  "laura-nayeli-mendez-martinez": {
    "status": "Perfil pendiente de completar",
    "headline": "Negocios Internacionales",
    "bio": "Estudiante de Negocios Internacionales en el Tecnológico de Monterrey y participante de la quinta generación del \nEugenio Garza Sada Global Leadership Program. Vicepresidenta de SABGB Campus Monterrey, donde impulsa \niniciativas de formación profesional, vinculación empresarial, liderazgo estudiantil y experiencias relacionadas con \ncomercio internacional y nearshoring. Cofundadora de Música 0, proyecto social que combina cultura, \nparticipación universitaria y lucha contra el hambre. Perfil orientado a negocios globales, liderazgo con propósito, \norganización de eventos, creación de alianzas e impacto social.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/laura-nayeli-mendez-martinez-979627381/"
      }
    ]
  },
  "luz-aiyana-gonzalez-gordillo": {
    "status": "Perfil pendiente de completar",
    "headline": "Turismo Internacional",
    "bio": "Estudiante de Turismo Internacional en la Universidad Anáhuac Puebla, con formación complementaria en gestión \nde marcas de lujo y turismo sostenible. Actualmente es Secretaria General del Consejo Estudiantil GASTUR y \nNetworking Executive del programa Vértice Honors, donde desarrolla alianzas estratégicas, gestiona patrocinios \ny genera oportunidades para estudiantes de alto rendimiento. Cuenta además con experiencia en estrategia y \noperaciones turísticas, diseño de itinerarios personalizados y organización de iniciativas orientadas a la integración \nestudiantil. Perfil enfocado en liderazgo, relaciones institucionales, hospitalidad, turismo consciente y desarrollo de\n experiencias de alto impacto.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/aiyana-gonz%C3%A1lez/"
      }
    ]
  },
  "maria-jose-merida-acuna": {
    "status": "Perfil completo",
    "headline": "Emprendedora | Innovación e Inteligencia Artificial | Liderazgo | Relaciones Internacionales",
    "bio": "María José es emprendedora y estudiante de Relaciones Internacionales, apasionada por el liderazgo, la innovación y el uso estratégico de la inteligencia artificial para generar impacto. Ha desarrollado proyectos de impacto social, iniciativas de emprendimiento y transformación digital, combinando una visión global con la capacidad de convertir ideas en acciones. Cree en el aprendizaje continuo, la colaboración y la creación de oportunidades que conecten a jóvenes, empresas y organizaciones para resolver desafíos reales. Su propósito es impulsar iniciativas que fomenten la innovación, el liderazgo y el desarrollo sostenible.",
    "motivation": "Quiero construir una red de líderes, emprendedores y agentes de cambio que generen oportunidades para quienes no han tenido acceso a ellas. Mi propósito es conectar personas, organizaciones y empresas para impulsar proyectos que identifiquen, desarrollen y potencien talentos, utilizando la innovación, la inteligencia artificial y la colaboración como herramientas para crear un impacto sostenible y transformar comunidades en Hispanoamérica.",
    "contribution": [
      "Experiencia en desarrollo de negocios, marketing estratégico y ventas; implementación de herramientas de inteligencia artificial para optimizar procesos; liderazgo de proyectos, creación de alianzas, organización de iniciativas para jóvenes y una visión internacional enfocada en innovación, emprendimiento e impacto social."
    ],
    "collaboration": "3 horas",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Inteligencia Artificial, Desarrollo sostenibles, inversiones, emprendimientos, negocios, escritura intencional, filosofia"
      },
      {
        "title": "Habilidades",
        "detail": "Negociación, Liderazgo, Desarrolladora de estrategias, Adaptabilidad, Comunicacion asertiva, inteligencia cultural"
      },
      {
        "title": "Idiomas",
        "detail": "Español, Ingles y Frances"
      }
    ],
    "video": "/videos/maria-jose-merida-acuna.mp4",
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/maria-jose-merida-acu%C3%B1a-a6b0802ba/"
      }
    ]
  },
  "maria-lucia-masse-porras": {
    "status": "Perfil completo",
    "headline": "Banca de Inversión y Valoración de Empresas | Modelación Financiera | Finanzas Corporativas | Estudiante de Finanzas y Relaciones Internacionales",
    "bio": "María Lucía es estudiante de Finanzas y Relaciones Internacionales en la Universidad Externado de Colombia, con un marcado interés en Banca de Inversión, Finanzas Corporativas y Valoración de Empresas.\n\nSe caracteriza por ser una persona disciplinada, analítica y curiosa, motivada por comprender cómo las empresas crean valor y toman decisiones financieras estratégicas. Disfruta trabajar con datos, desarrollar análisis estructurados y abordar los problemas con un pensamiento crítico y una gran atención al detalle.\n\nSu objetivo es continuar desarrollándose como Analista de Banca de Inversión o Analista Financiera, aportando rigor analítico, sólidos fundamentos financieros y una visión orientada a la creación de valor a largo plazo.",
    "motivation": "Quiero impulsar proyectos que conecten las finanzas con el impacto empresarial y social, construir una red de personas con alto potencial y participar en iniciativas internacionales donde el conocimiento, la colaboración y la innovación generen valor.",
    "contribution": [
      "Análisis financiero, valoración de empresas y modelación financiera, además de una visión estratégica y colaborativa. Me gusta estructurar ideas, investigar, resolver problemas y aportar con disciplina, pensamiento crítico y enfoque en la creación de valor"
    ],
    "collaboration": "2 horas a la semana",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Finanzas y Economía"
      },
      {
        "title": "Habilidades",
        "detail": "Análisis financiero Valoración de empresas Modelación financiera Finanzas corporativas Pensamiento analítico Resolución de problemas Trabajo en equipo Liderazgo Comunicación efectiva Atención al detalle"
      },
      {
        "title": "Idiomas",
        "detail": "Español e Inglés"
      }
    ],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/mariamasse/"
      }
    ]
  },
  "mauricio-rodriguez-limon": {
    "status": "Perfil completo",
    "headline": "Emprendedor | E-commerce | Construyendo negocios digitales | Estudiante de Negocios Deportivos",
    "bio": "Mauricio es un emprendedor mexicano que inició su camino en los negocios a los 16 años. Es autodidacta y apasionado por construir empresas digitales, especialmente en e-commerce. Actualmente estudia Negocios Deportivos, combina su formación con el emprendimiento y busca crear proyectos con impacto a largo plazo.",
    "motivation": "Quiero construir empresas digitales de alcance global, desarrollar marcas con impacto y aprovechar la inteligencia artificial para transformar industrias. También busco crear una red de emprendedores, inversionistas y creadores que impulsen proyectos de alto crecimiento.",
    "contribution": [
      "Puedo compartir experiencia construyendo negocios desde cero, e-commerce, validación de ideas, marketing digital, ventas, creación de marca y el aprendizaje que he obtenido emprendiendo desde joven, incluyendo aciertos, errores y cómo ejecutar con recursos limitados."
    ],
    "collaboration": "Flexible, Disponible 2-6 Horas a la semana",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Emprendimiento, e-commerce, inteligencia artificial, startups, tecnología, marca personal, marketing digital, inversión, innovación, negocios digitales, productividad"
      },
      {
        "title": "Habilidades",
        "detail": "Emprendimiento, e-commerce, ventas, marketing digital, negociación, liderazgo, creación de contenido, resolución de problemas, networking, estrategia de negocios"
      },
      {
        "title": "Idiomas",
        "detail": "Español e Inglés"
      }
    ],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/mauricio-rodr%C3%ADguez-lim%C3%B3n-8651a9306/"
      }
    ]
  },
  "miguel-jose-taveras": {
    "status": "Perfil pendiente de completar",
    "headline": "Derecho",
    "bio": "Estudiante de Derecho en PUCMM y socio gerente de Kimaya Consulting, iniciativa enfocada en inclusión \nlaboral para personas con discapacidad. Perfil con fuerte implicación en derecho, política e impacto social, combinando liderazgo universitario, experiencia institucional y capacidad de emprendimiento.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/miguel-jos%C3%A9-taveras-ben%C3%ADtez-88b9a52a1/"
      }
    ]
  },
  "milla-allegra-balandran": {
    "status": "Perfil pendiente de completar",
    "headline": "Relaciones Internacionales",
    "bio": "Estudiante de doble grado en Derecho y Relaciones Internacionales en el Tecnológico de Monterrey. Activa  en liderazgo estudiantil y debate internacional a través de Model UN y el National Hispanic Institute, donde participa como JFL College Intern. Seleccionada para el Eugenio Garza Sada Global Leadership Program, con enfoque en liderazgo, asuntos internacionales y compromiso comunitario",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/millaallegraa/"
      }
    ]
  },
  "raphael-andersor-sanchez-pinto": {
    "status": "Perfil pendiente de completar",
    "headline": "Finanzas",
    "bio": "Estudiante de Economía en la Universidad del Pacífico y del programa Economics & Finance de la \nUniversity of London (dirección académica LSE). Director de Trascendencia Académica en la representación estudiantil (REUP) y miembro del consejo de facultad de Economía y Finanzas. Integrante de la sociedad honorífica Alpha Sigma Nu y vocero institucional de la universidad. Perfil orientado a análisis económico, finanzas y liderazgo estudiantil.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/raphael-sanchez-pinto/"
      }
    ]
  },
  "roberto-moran": {
    "status": "Perfil pendiente de completar",
    "headline": "Miembro",
    "bio": "",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": []
  },
  "rodrigo-lopez-bolanos": {
    "status": "Perfil pendiente de completar",
    "headline": "Business",
    "bio": "Estudiante de Economía y Negocios en ESEN. Perfil con fuerte liderazgo en iniciativas académicas, \ntecnológicas y de impacto social, destacando en formación en liderazgo, incidencia política y emprendimiento. Experiencia como capacitador y facilitador de equipos, con enfoque en innovación, comunicación y desarrollo de proyectos.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/rodrigo-l%C3%B3pez-161954250/"
      }
    ]
  },
  "sophia-de-leone": {
    "status": "Perfil pendiente de completar",
    "headline": "Negocios Digitales",
    "bio": "Estudiante de Negocios Digitales en University of Michigan (Ross) y Universidad de San Andrés. Experiencia en análisis financiero y operaciones en entorno tech, además de emprendimiento con una marca de producto sostenible. Perfil técnico con conocimientos en Python y SQL, orientado a product, business analytics y desarrollo de negocio en entornos internacionales.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/sophia-de-leone/?locale=es"
      }
    ]
  },
  "stephany-cajamarca": {
    "status": "Perfil pendiente de completar",
    "headline": "Negocios Internacionales",
    "bio": "Hult Prize. Emprendedora",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/stephany-cajamarca-7548ab3b0/"
      }
    ]
  },
  "valeria-aspiazu": {
    "status": "Perfil completo",
    "headline": "Especialista en liderazgo educativo para América Latina. | Escritora | Creadora y líder de proyectos.",
    "bio": "Profesional especialista en liderazgo educativo para América Latina, escritora y creadora de proyectos con impacto social. Mi trayectoria se ha caracterizado por impulsar iniciativas que promueven la educación, el liderazgo juvenil y el desarrollo sostenible, articulando esfuerzos entre la academia, organizaciones sociales y el sector privado. Como líder, creo en el poder de las ideas para transformar realidades y en la educación como el principal motor del cambio. He participado en el diseño y gestión de programas orientados al fortalecimiento de competencias, la formación de nuevos líderes y la construcción de comunidades comprometidas con el bien común. Mi vocación por la escritura y la comunicación me ha permitido inspirar, sensibilizar y movilizar a diferentes audiencias a través de contenidos con propósito. Actualmente continúo desarrollando proyectos que integran innovación, liderazgo y servicio, convencida de que el verdadero impacto se alcanza cuando las personas encuentran un propósito que trasciende sus propios intereses y contribuye positivamente a la sociedad.",
    "motivation": "Dentro de CLH me gustaría construir una red de colaboración que impulse proyectos con impacto en educación, liderazgo, innovación y desarrollo sostenible, promoviendo alianzas entre universidades, empresas, organizaciones sociales e instituciones públicas de América Latina. Aspiro a desarrollar iniciativas que fortalezcan la formación de líderes comprometidos con el bien común, capaces de transformar los desafíos de sus comunidades en oportunidades de crecimiento.\n\nUno de los proyectos que deseo impulsar es el programa que promueve el cuidado y bienestar de la salud mental SEAH y la revista EDUKT.",
    "contribution": [
      "Aspiro a contribuir a la comunidad CLH compartiendo mi experiencia en liderazgo educativo, gestión de proyectos de impacto social, comunicación estratégica y formación de jóvenes líderes. Creo en el poder de la colaboración para convertir las ideas en iniciativas sostenibles que respondan a los desafíos de nuestras comunidades. Desde mi experiencia como escritora y creadora de proyectos, puedo aportar metodologías para fortalecer la escritura como herramienta de influencia, reflexión y transformación social, el liderazgo con propósito, la creatividad, la construcción de alianzas entre academia, empresa, organizaciones sociales y sector público, además del desarrollo de estrategias que generen impacto. Asimismo, deseo compartir herramientas para la gestión de equipos, organización de eventos, conferencias y espacios de aprendizaje colaborativo, el diseño de programas formativos y la comunicación como instrumento para inspirar, movilizar personas y construir una cultura basada en principios, valores e innovación social con el objetivo de convertir ideas en proyectos sostenibles."
    ],
    "collaboration": "Actualmente cuento con una disponibilidad estimada de 3 a 4 horas semanales para colaborar activamente en los proyectos e iniciativas impulsados por la comunidad. Me interesa aportar con mi experiencia en liderazgo, educación, gestión de proyectos y const",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Liderazgo y desarrollo del talento, Educación e innovación educativa, Gestión de proyectos e innovación social, Emprendimiento y empresa, Comunicación estratégica y escritura, Cooperación internacional y Desarrollo Sostenible"
      },
      {
        "title": "Habilidades",
        "detail": "Liderazgo estratégico, Innovación social, Gestión y dirección de proyectos, Construcción de alianzas estratégicas, Comunicación para el cambio social, Desarrollo de ecosistemas de aprendizaje y liderazgo."
      },
      {
        "title": "Idiomas",
        "detail": "Español, Inglés."
      }
    ],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/valeria-aspiazu-51145221a/"
      }
    ]
  },
  "valeria-ocheita": {
    "status": "Perfil completo",
    "headline": "Estudiante creativa",
    "bio": "Valeria es una futura comunicadora dispuesta a enseñar que la comunicación va más allá de la simple idea de “escribir” o “leer”. Porque sabe que con el lenguaje se mueve el mundo y con el se pueden hacer muchas cosas.",
    "motivation": "Impulsar a ayudar a posicionar una marca, crear conexiones con audiencias y poder difundir correctamente el propósito de una empresa o marca.",
    "contribution": [
      "Desarrollar estrategias de comunicación alineadas con la marca u organización. \nCrear contenido creativo que conecte con la audiencia. \nAnalizar audiencias, y métricas clave"
    ],
    "collaboration": "2 horas",
    "evidence": [
      {
        "title": "Intereses",
        "detail": "Storytelling, organizaciones de eventos, branding, la creatividad e innovación de campañas"
      },
      {
        "title": "Habilidades",
        "detail": "Creatividad, pensamiento estratégico, comunicación efectiva."
      },
      {
        "title": "Idiomas",
        "detail": "Español, inglés"
      }
    ],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/valeria-ocheita-95931a380/"
      }
    ]
  },
  "yarey-coronel": {
    "status": "Perfil pendiente de completar",
    "headline": "Negocios Internacionales",
    "bio": "Estudiante de Negocios Internacionales en la Universidad Espíritu Santo (UEES), con destacado \nrendimiento académico y enfoque en comercio exterior, importación/exportación y análisis estratégico. Actualmente realiza prácticas en Generatrust Administradora de Fondos y Fideicomisos, complementando su formación con experiencia en gestión administrativa, facturación electrónica y análisis financiero. Perfil proactivo, orientado a liderazgo, entornos multiculturales y desarrollo de negocios internacionales.",
    "motivation": "",
    "contribution": [],
    "collaboration": "",
    "evidence": [],
    "links": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/yarey-coronel-88217834a/"
      }
    ]
  }
};

function Button({ children, onClick, variant = "primary", type = "button" }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "light" | "ghost"; type?: "button" | "submit" }) {
  return <button type={type} className={`button button-${variant}`} onClick={onClick}>{children}<span aria-hidden="true">↗</span></button>;
}

function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>;
}

function SectionTitle({ kicker, title, body, align = "left" }: { kicker: string; title: string; body?: string; align?: "left" | "center" }) {
  return <div className={`section-title section-title-${align}`}><Kicker>{kicker}</Kicker><h2>{title}</h2>{body && <p>{body}</p>}</div>;
}

function StatBand() {
  return <section className="stat-band" aria-label="Cifras de la comunidad">
    <div><strong>+100</strong><span>líderes</span></div>
    <div><strong>14</strong><span>países</span></div>
    <div><strong>40+</strong><span>universidades</span></div>
    <div><strong>1</strong><span>cultura compartida</span></div>
  </section>;
}

function PageHero({ eyebrow, title, body, image, children, status }: { eyebrow: string; title: string; body: string; image?: string; children?: ReactNode; status?: string }) {
  return <section className="page-hero">
    <div className="shell page-hero-grid">
      <div className="page-hero-copy">
        {status && <span className="status status-gold">{status}</span>}
        <Kicker>{eyebrow}</Kicker>
        <h1>{title}</h1>
        <p>{body}</p>
        {children && <div className="button-row">{children}</div>}
      </div>
      {image && <div className="page-hero-image"><img src={assetPath(image)} alt="" /></div>}
    </div>
  </section>;
}

function MiniForm({ kind, initialSolution = "" }: { kind: "reto" | "idea" | "contacto"; initialSolution?: string }) {
  const [sent, setSent] = useState(false);
  const [reason, setReason] = useState("comunidad");
  const [solution, setSolution] = useState(initialSolution);
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true); };
  if (sent) return <div className="form-success" role="status"><span>✓</span><h3>{kind === "reto" ? "Gracias por compartir el contexto." : kind === "idea" ? "Tu idea ya está en movimiento." : "Hemos recibido tu mensaje."}</h3><p>Esta confirmación muestra el comportamiento previsto. En la web final, la consulta se enviará al equipo responsable.</p><Button variant="secondary" onClick={() => setSent(false)}>Enviar otra respuesta</Button></div>;
  return <form className="prototype-form" onSubmit={submit}>
    <div className="field-grid">
      <label>Nombre y apellidos<input required placeholder="Escribe tu nombre" /></label>
      <label>{kind === "reto" ? "Correo profesional" : "Correo electrónico"}<input required type="email" placeholder="nombre@correo.com" /></label>
    </div>
    {kind === "reto" && <>
      <div className="field-grid"><label>Organización<input required placeholder="Nombre de la organización" /></label><label>País<input required placeholder="País" /></label></div>
      <label>Aplicación de interés<select required value={solution} onChange={(event) => setSolution(event.target.value)}><option value="" disabled>Selecciona una aplicación</option><option>Activación universitaria internacional</option><option>Investigación sobre jóvenes de 18 a 25 años</option><option>Programas de embajadores</option><option>Retos y proyectos con talento joven</option><option>Otra necesidad</option></select></label>
      <label>¿Qué quieres entender, activar o construir?<textarea required rows={5} placeholder="Cuéntanos el reto, los mercados de interés y el resultado que buscas." /></label>
    </>}
    {kind === "idea" && <>
      <div className="field-grid"><label>País<input required placeholder="País" /></label><label>Universidad u organización<input placeholder="Opcional" /></label></div>
      <label>Título de la idea<input required placeholder="Una frase que permita entenderla" /></label>
      <label>¿Qué problema has identificado?<textarea required rows={3} placeholder="Describe el problema con claridad." /></label>
      <label>¿Qué propones y qué parte estás dispuesto a liderar?<textarea required rows={5} placeholder="Explica el primer paso y tu papel." /></label>
      <label className="video-upload">Vídeo de presentación · máximo 1 minuto<input required type="file" accept="video/mp4,video/quicktime,video/webm" /><span>Resume el problema, tu propuesta y la parte que quieres liderar. Formatos: MP4, MOV o WebM.</span></label>
    </>}
    {kind === "contacto" && <>
      <label>Motivo de la consulta<select value={reason} onChange={(e) => setReason(e.target.value)}><option value="comunidad">Quiero conocer la comunidad</option><option value="empresa">Represento a una empresa o institución</option><option value="universidad">Represento a una universidad</option><option value="mentor">Quiero colaborar como profesional o mentor</option><option value="prensa">Prensa y otras consultas</option></select></label>
      {(reason === "empresa" || reason === "universidad") && <label>Organización<input required placeholder="Nombre de la organización" /></label>}
      <label>Mensaje<textarea required rows={5} placeholder="Comparte el contexto necesario para dirigir la consulta." /></label>
    </>}
    <label className="check"><input type="checkbox" required /><span>Acepto la política de privacidad y el tratamiento de estos datos para responder a mi solicitud.</span></label>
    {kind === "idea" && <label className="check"><input type="checkbox" required /><span>Confirmo que no comparto información confidencial de terceros.</span></label>}
    <Button type="submit">{kind === "reto" ? "Enviar el reto" : kind === "idea" ? "Presentar mi idea" : "Enviar consulta"}</Button>
  </form>;
}

function Inicio({ go }: { go: (page: PageKey) => void }) {
  return <>
    <section className="home-hero">
      <div className="shell home-hero-grid">
        <div className="home-hero-copy">
          <Kicker>Comunidad de Líderes Hispanoamericanos</Kicker>
          <h1>Las grandes oportunidades nacen cuando las personas adecuadas se encuentran.</h1>
          <p>CLH reúne a jóvenes líderes de España y Latinoamérica para crecer, colaborar y convertir ideas en proyectos con impacto.</p>
          <div className="button-row"><Button variant="light" onClick={() => go("comunidad")}>Descubre la comunidad</Button><Button variant="ghost" onClick={() => go("organizaciones")}>Colabora con CLH</Button></div>
        </div>
        <div className="hero-portraits" aria-label="Tres miembros de la Comunidad de Líderes Hispanoamericanos">
          <article><figure className="hero-portrait-placeholder" role="img" aria-label="Fotografía de Michelle Rogel pendiente de autorización"><span>MR</span></figure><div><strong>Michelle Rogel</strong><span>México</span></div></article>
          <article><figure className="hero-portrait-placeholder" role="img" aria-label="Fotografía de Camila Calvo pendiente de incorporar"><span>CC</span></figure><div><strong>Camila Calvo</strong><span>Panamá</span></div></article>
          <article><figure className="hero-portrait-placeholder" role="img" aria-label="Fotografía de Federico Matz pendiente de autorización"><span>FM</span></figure><div><strong>Federico Matz</strong><span>Argentina</span></div></article>
          <div className="portrait-metric"><strong>+100</strong><span>líderes · 14 países</span></div>
        </div>
      </div>
      <div className="shell"><StatBand /></div>
    </section>

    <section className="section shell">
      <SectionTitle kicker="Qué activa CLH" title="El talento crece cuando encuentra el entorno adecuado." body="Identificamos perfiles con iniciativa, los conectamos entre países y creamos espacios donde pueden aprender, aportar y construir junto a otros." />
      <div className="three-grid numbered-cards">
        {[
          ["01", "Personas que ya están construyendo", "Miembros que lideran asociaciones, proyectos, empresas e iniciativas desde etapas tempranas."],
          ["02", "Relaciones que se convierten en colaboración", "Una red donde las conexiones tienen intención, continuidad y reciprocidad."],
          ["03", "Ideas que avanzan hasta convertirse en realidad", "La comunidad aporta talento, criterio y estructura para que los proyectos no se queden en una conversación."],
        ].map((item) => <article key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></article>)}
      </div>
    </section>

    <section className="section dark-section">
      <div className="shell">
        <SectionTitle kicker="Los 4 pilares de la comunidad" title="Cuatro dimensiones que convierten el talento en capacidad real." body="El desarrollo personal fortalece el criterio; las relaciones crean oportunidades; los proyectos convierten el aprendizaje en experiencia; y la ejecución genera valor sostenible." />
        <div className="four-grid capital-summary">
          {capitals.map((capital) => <button key={capital.key} onClick={() => go("capitales")}><span>{capital.number}</span><h3>{capital.name}</h3><p>{capital.short}</p><b>Explorar <i>↗</i></b></button>)}
        </div>
      </div>
    </section>

    <section className="section shell">
      <SectionTitle kicker="Lo que construimos" title="La comunidad se demuestra en lo que construye." body="Organizamos el talento alrededor de proyectos que conectan países, universidades, empresas y personas con voluntad de transformar una idea en una solución real." />
      <div className="project-grid">
        <article className="project-card project-beway"><span className="status">En desarrollo · lanzamiento julio 2027</span><div><p className="project-index">Proyecto 01</p><h3>Beway</h3><p>Una plataforma para renovar la relación entre empresas y universitarios mediante embajadores, retos, investigación y evidencias reales.</p><Button variant="secondary" onClick={() => go("beway")}>Explora Beway</Button></div></article>
        <article className="project-card project-week"><span className="status">Madrid · Julio 2027</span><div><p className="project-index">Evento 02</p><h3>Cumbre CLH × Beway</h3><p>El gran encuentro internacional de CLH: conversaciones con directivos de grandes empresas, comunidad y presentación oficial de Beway.</p><Button variant="secondary" onClick={() => go("semana")}>Descubre la Cumbre</Button></div></article>
        <article className="project-card project-ideas"><span className="status">Abierto</span><div><p className="project-index">Iniciativa 03</p><h3>El Rincón de las Ideas</h3><p>Un espacio para presentar iniciativas y reunir a las personas capaces de hacerlas avanzar.</p><Button variant="secondary" onClick={() => go("ideas")}>Presenta tu idea</Button></div></article>
      </div>
    </section>

    <section className="international-section">
      <div className="shell international-grid">
        <div className="international-image"><img src={assetPath("/images/equipo.jpg")} alt="Equipo internacional trabajando de forma coordinada" /><span>14 países conectados</span></div>
        <div><Kicker>Presencia internacional</Kicker><h2>Una misma cultura, en distintos países.</h2><p>La dimensión internacional de CLH consiste en crear relaciones operativas entre personas que estudian, trabajan y construyen en contextos diferentes, pero comparten una misma exigencia.</p><p>Una oportunidad detectada en un país puede convertirse en una colaboración, una investigación o un proyecto entre varios mercados.</p><Button onClick={() => go("miembros")}>Conoce a nuestros miembros</Button></div>
      </div>
    </section>

    <section className="section shell org-teaser">
      <div><Kicker>Para organizaciones</Kicker><h2>Una red joven capaz de activarse en varios mercados.</h2></div>
      <div><p>CLH ayuda a empresas, universidades e instituciones a entender, alcanzar y colaborar con la nueva generación universitaria del mundo hispanohablante.</p><ul className="clean-list"><li>Activación universitaria internacional.</li><li>Investigación comparativa sobre jóvenes de 18 a 25 años.</li><li>Retos, embajadores y proyectos con talento en acción.</li></ul><Button onClick={() => go("organizaciones")}>Cuéntanos tu reto</Button></div>
    </section>

    <Closing go={go} title="Las personas adecuadas pueden cambiar la trayectoria de una idea." body="Si quieres conocer la comunidad, proponer una colaboración o activar un proyecto entre España y Latinoamérica, queremos escucharte." />
  </>;
}

function Comunidad({ go }: { go: (page: PageKey) => void }) {
  const values = ["Excelencia", "Visión", "Ejecución", "Impacto", "Liderazgo", "Criterio", "Valor"];
  return <>
    <PageHero eyebrow="La comunidad" title="Una comunidad para quienes ya han empezado a construir." body="CLH reúne a jóvenes de España y Latinoamérica que lideran proyectos, asociaciones e iniciativas desde etapas tempranas. Personas con visión, criterio, valores y capacidad para convertir una idea en movimiento." image="/images/equipo.jpg"><Button variant="light" onClick={() => go("miembros")}>Conoce a nuestros miembros</Button></PageHero>
    <section className="section shell split-story"><div><Kicker>Nuestro porqué</Kicker><h2>Todo comienza con un encuentro.</h2></div><div><p>A lo largo de la historia, muchos proyectos e iniciativas que han generado impacto comenzaron de la misma manera: con una conversación que abrió una puerta o un grupo de personas que decidió construir con una visión compartida.</p><p>CLH existe para crear esos encuentros de forma intencionada. Cuando las personas adecuadas se encuentran, las ideas encuentran impulso y las oportunidades encuentran a quienes pueden convertirlas en realidad.</p></div></section>
    <section className="section soft-section"><div className="shell"><SectionTitle kicker="Cultura" title="Una forma de construir con ambición, criterio y valores." body="Formar parte de CLH significa entrar en un estándar: cómo piensas, cómo te relacionas, cómo cumples tus compromisos y qué eres capaz de construir incluso cuando nadie está mirando." /><div className="value-cloud">{values.map((value) => <span key={value}>{value}</span>)}</div></div></section>
    <section className="section shell"><SectionTitle kicker="Dirección compartida" title="Visión, misión y propósito." /><div className="three-grid manifesto-cards"><article><span>01</span><h3>Visión</h3><p>Construir el ecosistema internacional de liderazgo joven hispanohablante más sólido, conectado y operativo de nuestra generación.</p></article><article><span>02</span><h3>Misión</h3><p>Identificar talento con iniciativa, conectarlo con personas complementarias y crear la estructura necesaria para ejecutar ideas con rigor.</p></article><article><span>03</span><h3>Propósito</h3><p>Poner el talento al servicio de algo más grande e impulsar proyectos que generen oportunidades y mejoren realidades concretas.</p></article></div></section>
    <section className="section dark-section"><div className="shell"><SectionTitle kicker="La experiencia" title="Una comunidad que conecta, aprende y ejecuta." /><div className="experience-grid">{[["Conversaciones", "Sesiones con profesionales, mentores y jóvenes que están tomando decisiones en distintos sectores."],["Equipos internacionales", "Proyectos con perfiles de varios países y disciplinas para resolver retos con perspectivas complementarias."],["Fuego real", "El aprendizaje se prueba en proyectos como Beway, iniciativas internas y colaboraciones con organizaciones."],["Experiencias presenciales", "La Cumbre CLH × Beway convierte las relaciones digitales en convivencia, aprendizaje y capacidad de construir juntos."]].map((item, i) => <article key={item[0]}><span>0{i+1}</span><h3>{item[0]}</h3><p>{item[1]}</p></article>)}</div></div></section>
    <section className="section shell commitment"><div><Kicker>Qué implica formar parte</Kicker><h2>La comunidad crece cuando cada miembro decide aportar.</h2><p>La pertenencia no se mide por estar dentro de un grupo, sino por la forma en la que cada persona ayuda a que el ecosistema avance.</p></div><ol><li>Generar conexiones y detectar talento alineado con la cultura.</li><li>Participar activamente en sesiones, proyectos e investigaciones.</li><li>Compartir recursos y abrir oportunidades desde su universidad o entorno.</li><li>Representar la cultura de CLH con responsabilidad y coherencia.</li></ol></section>
    <section className="section soft-section"><div className="shell access-grid"><div><Kicker>Acceso</Kicker><h2>El acceso se construye desde la afinidad y la aportación.</h2><p>La entrada a CLH se realiza principalmente mediante invitación directa. La comunidad identifica perfiles que ya están liderando, creando o movilizando a otras personas.</p></div><div className="access-card"><span>Vía abierta</span><h3>El Rincón de las Ideas</h3><p>Cualquier persona puede presentar una iniciativa con potencial. Las propuestas seleccionadas se conversan con el equipo y pueden desarrollarse junto a la comunidad.</p><Button onClick={() => go("ideas")}>Presenta una idea</Button></div></div></section>
    <section className="section shell"><SectionTitle kicker="Cómo nos organizamos" title="Una red internacional necesita responsabilidad compartida." /><div className="area-grid">{["Marketing y Comunicación", "Comunidad y Talento", "Expansión Internacional", "Operaciones y Eficiencia", "Tecnología", "Eventos y Experiencias", "Jurídico e Institucional", "Finanzas"].map((area, i) => <div key={area}><span>{String(i+1).padStart(2,"0")}</span><p>{area}</p></div>)}</div></section>
    <Closing go={go} title="Conoce a las personas que dan vida a la comunidad." body="Perfiles de distintos países y disciplinas unidos por una cultura común y por la voluntad de construir." primary="miembros" primaryLabel="Explora la comunidad" />
  </>;
}

function Cultura({ go }: { go: (page: PageKey) => void }) {
  const values = ["Excelencia", "Visión", "Ejecución", "Impacto", "Liderazgo", "Criterio", "Valor"];
  return <>
    <section className="culture-hero"><div className="shell"><Kicker>Cultura, visión y misión</Kicker><h1>Formar parte de CLH significa entrar en un estándar.</h1><p>Una forma reconocible de pensar, construir y aportar valor. El talento deja de ser una promesa cuando encuentra dirección, estructura y personas con la misma voluntad de ejecutar.</p><div className="culture-values">{values.map((value) => <span key={value}>{value}</span>)}</div></div></section>
    <section className="section shell culture-story"><div><Kicker>Cultura · La forma en la que construimos</Kicker><h2>El talento se demuestra en lo que eres capaz de materializar.</h2></div><div><p>CLH reúne a personas que miran el mundo con ambición, tienen una visión clara de hacia dónde quieren ir y entienden que las ideas solo tienen sentido cuando se construyen.</p><p>Aquí todo tiene dirección: las conversaciones, las conexiones y las oportunidades. Cuando una idea conecta con la comunidad, la comunidad se activa a su alrededor y el valor de cada persona se multiplica al encontrarse con el de los demás.</p><p>Construimos con criterio, ambición y valores, porque el verdadero crecimiento es el que puede sostenerse en el tiempo.</p></div></section>
    <section className="section culture-directions"><div className="shell"><SectionTitle kicker="La dirección compartida" title="Lo que estamos construyendo y lo que hacemos cada día." /><div className="culture-grid"><article><span>01</span><p>Visión</p><h3>Convertir CLH en el mayor sello de calidad del talento joven hispanohablante.</h3><small>Un hub internacional de emprendimiento y talento donde las ideas encuentran el entorno adecuado para desarrollarse y los proyectos nacen con vocación de impacto.</small></article><article><span>02</span><p>Misión</p><h3>Activar talento con iniciativa y darle la estructura necesaria para escalar.</h3><small>Conectamos perfiles complementarios y creamos un entorno donde las ideas pueden ejecutarse con rigor, generar valor y devolver nuevas oportunidades a la comunidad.</small></article><article><span>03</span><p>Propósito</p><h3>Poner el talento al servicio de algo más grande.</h3><small>Impulsamos una generación que quiere crecer, aportar, construir y dejar huella mediante proyectos con impacto económico y social.</small></article></div></div></section>
    <section className="section shell culture-standard"><div><Kicker>El sello CLH</Kicker><h2>Visión, criterio, valores y capacidad real de liderar y construir.</h2></div><div><p>Queremos que formar parte de CLH tenga significado inmediato. Que hable de quién eres, de cómo piensas, de cómo colaboras y de aquello que eres capaz de convertir en realidad incluso cuando nadie está mirando.</p><Button onClick={() => go("capitales")}>Conoce los 4 pilares</Button></div></section>
    <Closing go={go} title="La cultura no se declara: se reconoce en la forma de actuar." body="Conoce a las personas, los pilares y los proyectos que convierten esta visión en una comunidad viva." primary="miembros" primaryLabel="Conoce a nuestros miembros" />
  </>;
}

function Capitales({ go }: { go: (page: PageKey) => void }) {
  const [active, setActive] = useState(0);
  const capital = capitals[active];
  return <>
    <PageHero eyebrow="Los 4 pilares de la comunidad" title="Una forma completa de desarrollar criterio, relaciones, experiencia y capacidad de generar valor." body="CLH se construye sobre cuatro pilares conectados. Cada uno trabaja una dimensión distinta del liderazgo y todos se refuerzan entre sí." image="/images/equipo.jpg" />
    <section className="section shell"><SectionTitle kicker="Nuestro modelo" title="Los 4 pilares de la comunidad." body="Dentro de cada pilar hablamos de capital personal, capital relacional, capital profesional y capital económico. Selecciona uno para conocer cómo se desarrolla dentro de CLH." />
      <div className="capital-tabs" role="tablist" aria-label="Los 4 pilares de la comunidad">{capitals.map((item, i) => <button key={item.key} role="tab" aria-selected={active===i} className={active===i ? "active" : ""} onClick={() => setActive(i)}><span>{item.number}</span><strong>{item.name}</strong><small>{item.short}</small></button>)}</div>
      <div className="capital-detail" role="tabpanel"><div><span className="detail-number">{capital.number}</span><Kicker>{capital.name}</Kicker><h2>{capital.title}</h2><p>{capital.body}</p></div><div><p className="detail-label">Dentro de este capital</p><ul className="clean-list">{capital.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><blockquote>{capital.close}</blockquote></div></div>
    </section>
    <section className="section dark-section"><div className="shell capital-flow"><SectionTitle kicker="La secuencia" title="El desarrollo ocurre cuando las cuatro dimensiones avanzan juntas." /><div className="flow-line">{capitals.map((item, i) => <div key={item.key}><span>{item.number}</span><strong>{item.name.replace("Capital ","")}</strong>{i<capitals.length-1 && <i>→</i>}</div>)}</div><div className="button-row"><Button variant="light" onClick={() => go("comunidad")}>Conoce cómo se vive CLH</Button><Button variant="ghost" onClick={() => go("beway")}>Explora nuestros proyectos</Button></div></div></section>
  </>;
}

function MemberProfileDialog({ member, onClose, onConnect }: { member: Member; onClose: () => void; onConnect: () => void }) {
  const slug = member.slug || memberSlug(member.name);
  const profile = memberPilotProfiles[slug];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previousOverflow; };
  }, [onClose]);

  const fallback = {
    status: "Miembro de CLH",
    headline: member.area,
    bio: "",
    motivation: "",
    contribution: [] as string[],
    collaboration: "",
    evidence: [] as { title: string; detail: string }[],
    links: member.linkedIn ? [{ label: "LinkedIn", href: member.linkedIn }] : [] as { label: string; href: string }[],
  };
  const content = profile ?? fallback;

  return createPortal(
    <div className="member-profile-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <article className="member-profile-dialog" role="dialog" aria-modal="true" aria-labelledby={`member-profile-${slug}`}>
        <button className="member-profile-close" onClick={onClose} aria-label="Cerrar perfil">×</button>
        <div className="member-profile-media">
          <div className="member-profile-portrait">{member.image ? <img src={assetPath(member.image)} alt={`Retrato de ${member.name}`} /> : <div className="member-profile-initials" role="img" aria-label={`Iniciales de ${member.name}`}>{memberInitials(member.name)}</div>}</div>
          {profile?.video || member.video ? <div className="member-profile-video member-profile-video-ready"><video key={slug} controls playsInline preload="metadata" poster={member.image ? assetPath(member.image) : undefined} src={assetPath(profile?.video ?? member.video!)}>Tu navegador no permite reproducir este vídeo.</video><span>VÍDEO DE PRESENTACIÓN · 1 MINUTO</span></div> : null}
        </div>
        <div className="member-profile-heading">
          <div><p className="member-profile-status">{content.status}</p><h2 id={`member-profile-${slug}`}>{member.name}</h2><p>{content.headline}</p></div>
          <dl><div><dt>País</dt><dd>{member.country}</dd></div><div><dt>Rol en CLH</dt><dd>{member.role}</dd></div><div><dt>Área profesional</dt><dd>{member.area}</dd></div></dl>
        </div>
        {profile && <div className="member-profile-body">
          <section className="member-profile-about"><p className="member-profile-label">QUIÉN SOY</p><p>{content.bio}</p></section>
          <section><p className="member-profile-label">LO QUE ME MUEVE</p><p>{content.motivation}</p></section>
          <section><p className="member-profile-label">LO QUE PUEDO APORTAR</p><ul>{content.contribution.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><p className="member-profile-label">QUIERO COLABORAR EN</p><p>{content.collaboration}</p></section>
        </div>}
        {profile && <div className="member-profile-evidence">
          <div><p className="member-profile-label">{content.evidenceKicker ?? "EVIDENCIAS Y PARTICIPACIÓN"}</p><h3>{content.evidenceTitle ?? "La trayectoria se entiende mejor cuando puede verse."}</h3></div>
          <div className="member-evidence-list">
            {content.evidence.length > 0 ? content.evidence.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2,"0")}</span><div><h4>{item.title}</h4><p>{item.detail}</p></div></article>) : <article className="member-evidence-empty"><span>01</span><div><h4>Información pendiente</h4><p>El formulario recogerá un proyecto, la responsabilidad asumida, la acción personal y el resultado obtenido.</p></div></article>}
          </div>
        </div>}
        <footer className="member-profile-actions">
          <div>{content.links?.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>
          <Button onClick={onConnect}>Proponer una conexión</Button>
        </footer>
      </article>
    </div>,
    document.body,
  );
}

function Miembros({ go }: { go: (page: PageKey) => void }) {
  const [country, setCountry] = useState("Todos");
  const [area, setArea] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);
  const countries = ["Todos", ...Array.from(new Set(members.map((m) => m.country))).sort()];
  const areas = ["Todos", ...Array.from(new Set(members.map((m) => m.role))).sort()];
  const filtered = useMemo(() => members.filter((member) => (country === "Todos" || member.country === country) && (area === "Todos" || member.role === area) && member.name.toLowerCase().includes(search.toLowerCase())), [country, area, search]);

  useEffect(() => {
    const readMemberHash = () => {
      const [, slug] = window.location.hash.replace("#", "").split("/");
      setSelected(slug ? members.find((member) => member.slug === slug || memberSlug(member.name) === slug) ?? null : null);
    };
    readMemberHash();
    window.addEventListener("hashchange", readMemberHash);
    return () => window.removeEventListener("hashchange", readMemberHash);
  }, []);

  const openProfile = (member: Member) => {
    setSelected(member);
    window.history.pushState(null, "", `#miembros/${member.slug || memberSlug(member.name)}`);
  };
  const closeProfile = () => {
    setSelected(null);
    window.history.pushState(null, "", "#miembros");
  };
  return <>
    <PageHero eyebrow="Nuestros miembros" title="El valor de CLH está en las personas que deciden construir juntas." body="Más de 100 líderes jóvenes de España y Latinoamérica forman una red conectada por la iniciativa, el criterio y la voluntad de aportar." image="/images/comunidad.jpg" />
    <div className="shell"><StatBand /></div>
    <section className="section shell"><SectionTitle kicker="Directorio" title="Conoce a la comunidad." body="Filtra por país o posición dentro de CLH para descubrir a las personas que forman la comunidad. La fotografía y el perfil completo aparecen cuando el miembro ya ha facilitado y validado ese contenido." />
      <div className="filters"><label>País<select value={country} onChange={(e) => setCountry(e.target.value)}>{countries.map((item) => <option key={item}>{item}</option>)}</select></label><label>Rol en CLH<select value={area} onChange={(e) => setArea(e.target.value)}>{areas.map((item) => <option key={item}>{item}</option>)}</select></label><label className="search-field">Buscar por nombre<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ej. Federico" /></label><span className="result-count">{filtered.length} perfiles</span></div>
      <div className="member-grid">{filtered.map((member) => <article className={member.featured ? "member-card member-card-featured" : "member-card"} key={member.id}><div className="member-image">{member.image ? <img src={assetPath(member.image)} alt={`Retrato de ${member.name}`} /> : <div className="member-initials" role="img" aria-label={`Iniciales de ${member.name}`}>{memberInitials(member.name)}</div>}{member.featured && <span className="member-featured-label">Perfil completo de ejemplo</span>}</div><div><p className="member-country">{member.country}</p><h3>{member.name}</h3><p>{member.role}</p><button onClick={() => openProfile(member)}>Ver perfil <i>↗</i></button></div></article>)}</div>
      {filtered.length === 0 && <div className="empty-state"><h3>No encontramos perfiles con esos filtros.</h3><p>Prueba con otro país, rol o nombre.</p><Button variant="secondary" onClick={() => { setCountry("Todos"); setArea("Todos"); setSearch(""); }}>Limpiar filtros</Button></div>}
    </section>
    <section className="section soft-section"><div className="shell split-story"><div><Kicker>Lo que une perfiles diferentes</Kicker><h2>La diversidad tiene valor cuando existe una cultura común.</h2></div><div><p>CLH conecta perfiles de tecnología, empresa, derecho, ingeniería, comunicación, ciencias y relaciones internacionales.</p><p>La selección no se basa únicamente en notas o títulos, sino en la evidencia de iniciativa, responsabilidad y capacidad para movilizar a otras personas.</p><Button onClick={() => go("comunidad")}>Conoce cómo funciona la comunidad</Button></div></div></section>
    <Closing go={go} title="Formar parte empieza antes de recibir una invitación." body="El Rincón de las Ideas permite conocer a las personas a través de aquello que quieren poner en marcha." primary="ideas" primaryLabel="Presenta una idea" />
    {selected && <MemberProfileDialog member={selected} onClose={closeProfile} onConnect={() => { closeProfile(); go("contacto"); }} />}
  </>;
}

function Beway({ go }: { go: (page: PageKey) => void }) {
  const modules = [
    ["01", "Fichas de empresa desde la mirada joven", "Información clara sobre cultura, oportunidades, programas, formación y formas reales de participar."],
    ["02", "Embajadores universitarios", "Perfiles seleccionados para conectar iniciativas con universidades y comunidades locales."],
    ["03", "Retos y proyectos", "Las empresas plantean problemas concretos y equipos multidisciplinares desarrollan propuestas."],
    ["04", "Investigación con jóvenes verificados", "Encuestas y validaciones segmentadas por país, universidad o área de estudio."],
    ["05", "Perfiles basados en evidencias", "Vídeo, proyectos, fiabilidad y participación construyen una imagen más completa del talento."],
    ["06", "Preparación y conocimiento de la empresa", "Recorridos para comprender cultura, herramientas y procesos antes de participar."],
  ];
  const principles = ["Creamos comunidad", "Impulsamos la innovación", "Generamos oportunidades", "Construimos el futuro"];
  return <div className="beway-page">
    <section className="beway-hero"><div className="shell beway-hero-grid"><div className="beway-hero-copy"><span className="beway-status">Lanzamiento · Julio de 2027</span><p className="beway-kicker">Ecosistema de talento, innovación y oportunidades</p><h1>Empresas y universitarios conectados por lo que pueden construir juntos.</h1><p>Una plataforma impulsada desde CLH para activar proyectos, entender a la nueva generación y descubrir talento mediante evidencias reales de ejecución.</p><div className="button-row"><Button variant="light" onClick={() => go("organizaciones")}>Soy una empresa</Button><Button variant="ghost" onClick={() => document.getElementById("beway-modelo")?.scrollIntoView({behavior:"smooth"})}>Conocer el proyecto</Button></div></div><div className="beway-brand-lockup"><img src={assetPath("/images/beway-logo-light-fhd.jpg")} alt="BEWAY · Ecosistema de talento, innovación y oportunidades" /></div></div><div className="shell beway-principles">{principles.map((principle, i) => <div key={principle}><span>{String(i + 1).padStart(2, "0")}</span><strong>{principle}</strong></div>)}</div></section>
    <section className="section shell split-story"><div><Kicker>El punto de partida</Kicker><h2>La relación entre universidad y empresa necesita más espacios que una oferta de empleo.</h2></div><div><p>Las empresas necesitan entender cómo piensa la nueva generación, validar productos, activar su presencia en universidades y observar cómo trabaja una persona antes de contratarla.</p><p>Los universitarios necesitan conocer mejor a las organizaciones, aportar valor antes de graduarse y demostrar su capacidad a través de proyectos reales. Beway crea un canal continuo para que esas necesidades se encuentren.</p></div></section>
    <section id="beway-modelo" className="section soft-section"><div className="shell"><SectionTitle kicker="El modelo" title="Una infraestructura de colaboración entre empresas y universitarios." body="Cada módulo genera una interacción concreta y deja una evidencia que mejora la siguiente decisión." /><div className="module-grid">{modules.map((module) => <article key={module[0]}><span>{module[0]}</span><h3>{module[1]}</h3><p>{module[2]}</p></article>)}</div></div></section>
    <section className="section shell dual-audience"><div className="audience-card audience-company"><Kicker>Para empresas</Kicker><h2>Entender a la nueva generación y verla trabajar.</h2><p>Activar embajadores, plantear retos, validar una idea y descubrir perfiles a partir de su comportamiento dentro de proyectos.</p><ul className="clean-list"><li>Presencia universitaria coordinada.</li><li>Investigación sobre la generación de 18 a 25 años.</li><li>Retos con entregas estructuradas.</li><li>Talento demostrado en acción.</li></ul><Button onClick={() => go("organizaciones")}>Explorar una colaboración</Button></div><div className="audience-card audience-student"><Kicker>Para universitarios</Kicker><h2>Construir una trayectoria que se pueda ver.</h2><p>Cada participación puede convertirse en una evidencia: un reto resuelto, una investigación bien ejecutada, una idea desarrollada o una responsabilidad asumida.</p><p>La persona puede conocer empresas más allá de sus campañas institucionales y presentar su capacidad antes de que exista una vacante.</p></div></section>
    <section className="section dark-section"><div className="shell beway-community"><div><Kicker>La capa de comunidad</Kicker><h2>La colaboración continúa dentro de cada iniciativa.</h2><p>Beway conectará a los embajadores de una misma empresa, a los equipos que participan en un reto y a quienes desarrollan proyectos colectivos.</p></div><div className="product-diagram"><div><span>Empresa</span><strong>Reto concreto</strong></div><i>→</i><div><span>Equipo</span><strong>Trabajo compartido</strong></div><i>→</i><div><span>Evidencia</span><strong>Resultado visible</strong></div></div></div></section>
    <section className="section shell status-story"><div className="status-panel"><span className="status status-gold">Lanzamiento oficial · Julio de 2027</span><h2>La plataforma se está construyendo desde dentro.</h2><p>Durante 2026 y la primera mitad de 2027, equipos internacionales de CLH trabajan en grupos de tres y cuatro personas para analizar cómo distintas compañías se relacionan con los jóvenes y proponer soluciones desde la perspectiva de la generación de 18 a 25 años.</p><p>El lanzamiento oficial tendrá lugar en Madrid dentro de la Cumbre CLH × Beway, convirtiendo el encuentro presencial en el primer gran punto de activación de la plataforma.</p></div><aside><h3>Comunicación responsable</h3><p>No se presentará a ninguna compañía analizada como cliente o colaborador sin autorización escrita. Las funciones se anunciarán únicamente cuando exista una versión operativa.</p></aside></section>
    <Closing go={go} title="Las empresas pueden construir con la nueva generación." body="Si tu organización quiere validar una idea, activar embajadores o participar en el lanzamiento de Beway en julio de 2027, queremos escuchar vuestro reto." primary="organizaciones" primaryLabel="Conocer Beway como empresa" />
  </div>;
}

function Semana({ go }: { go: (page: PageKey) => void }) {
  const axes = [["01","Comunidad y bienvenida","Encuentro presencial y fortalecimiento de las relaciones que comenzaron antes de Madrid."],["02","Lanzamiento de Beway","Presentación de la plataforma, su visión y las primeras formas de participación para empresas y universitarios."],["03","Empresa e inteligencia artificial","Visitas, ponencias y aplicación de herramientas a contextos profesionales reales."],["04","Innovación, liderazgo y creatividad","Retos colaborativos, criterio, comunicación y toma de decisiones con perspectivas diferentes."],["05","Madrid, convivencia y cultura","Tiempo para descubrir la ciudad y crear recuerdos que den profundidad a las relaciones."]];
  const speakerTracks = [["01","Empresa e inteligencia artificial","Líderes que están transformando organizaciones y tomando decisiones en entornos de cambio."],["02","Innovación y emprendimiento","Personas capaces de convertir una oportunidad en una solución, un equipo y un modelo sostenible."],["03","Liderazgo y desarrollo","Profesionales con experiencia real en comunicación, criterio, negociación y construcción de equipos."],["04","Talento y futuro del trabajo","Responsables que conocen qué capacidades necesitarán las empresas y cómo pueden demostrarlas los jóvenes."]];
  return <>
    <PageHero status="Madrid · Julio de 2027" eyebrow="Cumbre CLH × Beway" title="Donde la comunidad, el talento y las grandes empresas miran hacia el mismo futuro." body="Un encuentro internacional con directivos de grandes empresas, conversaciones sobre liderazgo, innovación y futuro del trabajo, y la presentación oficial de la plataforma Beway." image="/images/madrid.jpg"><Button variant="light" onClick={() => go("contacto")}>Solicitar el dossier</Button><Button variant="ghost" onClick={() => go("organizaciones")}>Participar en la Cumbre</Button></PageHero>
    <div className="collaboration-line"><span>Un encuentro de</span><strong>CLH</strong><i>×</i><strong>BEWAY</strong></div>
    <section className="section shell split-story"><div><Kicker>Por qué existe</Kicker><h2>Una comunidad internacional necesita encontrarse para dar su siguiente gran paso.</h2></div><div><p>Las relaciones de CLH comienzan entre países, equipos y conversaciones digitales. La Cumbre CLH × Beway es el momento en el que esas relaciones adquieren profundidad, confianza y capacidad de ejecución.</p><p>En julio de 2027, Madrid unirá dos hitos: el gran encuentro de la comunidad y la presentación oficial de Beway, el proyecto que materializa su capacidad para construir junto a empresas y universitarios.</p></div></section>
    <section className="launch-moment"><div className="shell launch-grid"><div><Kicker>Hito central · Julio de 2027</Kicker><h2>El lanzamiento oficial de Beway.</h2><p>La plataforma se presentará ante miembros, ponentes, empresas, universidades y profesionales. No será únicamente una demostración: será el comienzo de una nueva etapa de activación, retos, investigación y colaboración internacional.</p><Button onClick={() => go("beway")}>Conoce la plataforma Beway</Button></div><div className="launch-points"><article><span>01</span><strong>Presentación</strong><p>Visión, propuesta de valor y recorrido construido desde CLH.</p></article><article><span>02</span><strong>Demostración</strong><p>Experiencia de plataforma y primeras formas de participación.</p></article><article><span>03</span><strong>Activación</strong><p>Retos, organizaciones y oportunidades que comenzarán después de Madrid.</p></article></div></div></section>
    <section className="section soft-section"><div className="shell"><SectionTitle kicker="La experiencia completa" title="Antes, Madrid y después del lanzamiento." body="La fase previa prepara las relaciones y el producto; la semana presencial concentra aprendizaje y presentación; la fase posterior convierte el impulso en actividad real." /><div className="phase-grid">{[["01","Pre · Conectar","Los participantes se conocen, forman equipos, exploran Beway y llegan con relaciones y objetivos en movimiento."],["02","Madrid · Lanzar","Comunidad, ponentes, visitas, retos y presentación oficial de Beway ante el ecosistema."],["03","Post · Construir","Activación de la plataforma, seguimiento de proyectos y próximos pasos con empresas y universitarios."]].map((item) => <article key={item[0]}><span>{item[0]}</span><p>{item[1]}</p><h3>{item[2]}</h3></article>)}</div></div></section>
    <section className="section shell"><SectionTitle kicker="Ejes de contenido" title="Una agenda diseñada para aprender, convivir, lanzar y construir." body="Las ponencias, conversaciones y visitas estarán conectadas con los retos reales que afrontan los miembros y con las oportunidades que Beway quiere activar." /><div className="agenda-list">{axes.map((item) => <article key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div></section>
    <section className="section speaker-section"><div className="shell"><SectionTitle kicker="Ponentes" title="Directivos de grandes empresas. Experiencia real para decisiones reales." body="La Cumbre CLH × Beway contará con directivos y profesionales capaces de compartir decisiones, herramientas y aprendizajes nacidos de la experiencia. Los nombres se publicarán a medida que se confirmen." /><div className="speaker-grid">{speakerTracks.map((item) => <article key={item[0]}><div className="speaker-placeholder"><span>{item[0]}</span><small>Directivo por confirmar</small></div><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div></div></section>
    <section className="section dark-section"><div className="shell org-week"><div><Kicker>Empresas e instituciones</Kicker><h2>Conocer el talento mientras piensa, decide y trabaja.</h2><p>Las organizaciones pueden proponer retos, recibir a los participantes, compartir una sesión o colaborar en contenidos, espacios, movilidad y becas.</p><Button variant="light" onClick={() => go("organizaciones")}>Proponer una colaboración</Button></div><div className="org-week-cards"><div><span>01</span><p>Reto estratégico o pregunta de investigación.</p></div><div><span>02</span><p>Visita a una organización y conversación con su equipo.</p></div><div><span>03</span><p>Sesión práctica con profesionales que toman decisiones reales.</p></div><div><span>04</span><p>Colaboración en el lanzamiento, espacios, movilidad, becas o actividades.</p></div></div></div></section>
    <section className="section shell practical"><SectionTitle kicker="Información práctica" title="Madrid será el punto de encuentro y de lanzamiento." /><div className="practical-grid"><div><span>Ciudad</span><strong>Madrid, España</strong></div><div><span>Fecha</span><strong>Julio de 2027</strong><small>Días exactos pendientes</small></div><div><span>Hito central</span><strong>Lanzamiento de Beway</strong><small>Presentación y activación</small></div><div><span>Participación</span><strong>Selección</strong><small>Plazas limitadas</small></div></div></section>
    <Closing go={go} title="Julio de 2027 será el comienzo de la siguiente etapa." body="Solicita el dossier o cuéntanos cómo quieres participar como miembro, ponente, organización, universidad o colaborador del lanzamiento." primary="contacto" primaryLabel="Solicitar el dossier" />
  </>;
}

function Organizaciones({ go }: { go: (page: PageKey) => void }) {
  const capabilities = [
    {
      number: "01",
      title: "Activación universitaria internacional",
      summary: "Estrategia común y ejecución local en los países seleccionados, con objetivos y métricas compartidas.",
      problem: "Construir una presencia universitaria coherente en varios mercados sin gestionar equipos aislados en cada país.",
      steps: ["Definimos países, públicos, objetivos y métricas comunes.", "CLH coordina responsables locales, calendario y activaciones.", "Comparamos resultados y aprendizajes entre mercados."],
      result: "Una hoja de ruta internacional, ejecución local coordinada y evidencias para decidir cómo continuar.",
    },
    {
      number: "02",
      title: "Investigación sobre jóvenes de 18 a 25 años",
      summary: "Encuestas, conversaciones y validaciones comparables entre países, universidades y perfiles.",
      problem: "Comprender qué piensa y cómo decide la nueva generación con información directa, comparable y situada en cada mercado.",
      steps: ["Convertimos la pregunta de negocio en una metodología clara.", "Activamos encuestas, entrevistas o grupos de conversación.", "Ordenamos patrones, diferencias y oportunidades accionables."],
      result: "Un informe con evidencias, conclusiones por mercado y recomendaciones útiles para la siguiente decisión.",
    },
    {
      number: "03",
      title: "Programas de embajadores",
      summary: "Perfiles alineados con la organización y seguimiento coordinado para una presencia humana en campus.",
      problem: "Crear una relación humana y sostenida con universidades a través de perfiles que comprendan la cultura de la organización.",
      steps: ["Definimos el perfil, el papel y los criterios de selección.", "Seleccionamos y preparamos embajadores en los campus prioritarios.", "Coordinamos actividad, acompañamiento y seguimiento."],
      result: "Una red de embajadores preparada, un calendario de activación y visibilidad sobre su participación e impacto.",
    },
    {
      number: "04",
      title: "Retos y proyectos con talento joven",
      summary: "Una necesidad concreta convertida en encargo para equipos internacionales con criterios de entrega.",
      problem: "Observar cómo piensa y ejecuta el talento joven mientras aporta una respuesta concreta a una necesidad real.",
      steps: ["Convertimos la necesidad en un reto con alcance y entregables.", "Formamos equipos complementarios y acompañamos la ejecución.", "Presentamos resultados, evidencias y aprendizajes."],
      result: "Una entrega concreta y una visión más completa de las capacidades demostradas por cada equipo.",
    },
    {
      number: "05",
      title: "Cumbre CLH × Beway",
      summary: "Ponencias, visitas, retos y espacios que conectan directamente a la comunidad con grandes empresas.",
      destination: "semana" as PageKey,
    },
  ];
  const [activeCapability, setActiveCapability] = useState<(typeof capabilities)[number] | null>(null);
  const [leadSolution, setLeadSolution] = useState("");

  useEffect(() => {
    if (!activeCapability) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveCapability(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeCapability]);

  const exploreCapability = (title: string) => {
    setLeadSolution(title);
    setActiveCapability(null);
    window.setTimeout(() => document.getElementById("form-reto")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return <>
    <PageHero eyebrow="Para organizaciones" title="Activa, entiende y conecta con la nueva generación universitaria en varios mercados." body="CLH coordina una red de más de 100 líderes jóvenes en 14 países y más de 40 universidades. Convertimos ese alcance en investigación, embajadores, retos y proyectos con ejecución local." image="/images/comunidad.jpg"><Button variant="light" onClick={() => document.getElementById("form-reto")?.scrollIntoView({behavior:"smooth"})}>Cuéntanos tu reto</Button><Button variant="ghost" onClick={() => document.getElementById("capacidades")?.scrollIntoView({behavior:"smooth"})}>Conoce nuestras capacidades</Button></PageHero>
    <section className="section shell split-story"><div><Kicker>Propuesta de valor</Kicker><h2>Coordinación central. Perspectiva joven. Ejecución entre países.</h2></div><div><p>Construir presencia universitaria en varios mercados suele exigir equipos y relaciones diferentes en cada país. CLH ya cuenta con una comunidad conectada, responsables locales y una cultura común.</p><p>Una organización puede utilizar esta infraestructura para comparar percepciones, activar campañas o trabajar con equipos internacionales sin empezar de cero en cada mercado.</p></div></section>
    <section id="capacidades" className="section soft-section"><div className="shell"><SectionTitle kicker="Capacidades" title="Una misma estructura, distintas formas de colaboración." /><div className="capability-list">{capabilities.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.summary}</p>{item.destination ? <button onClick={() => go(item.destination!)}>Conocer la Cumbre <i>↗</i></button> : <button aria-haspopup="dialog" onClick={() => setActiveCapability(item)}>Ver aplicación <i>↗</i></button>}</article>)}</div></div></section>
    <section className="section shell audience-split"><article><Kicker>Para empresas</Kicker><h2>Una relación más profunda con el talento y el consumidor joven.</h2><p>Trabajamos con áreas de Talento, Marketing, Innovación, Expansión e Investigación que necesiten comprender y activar a la generación universitaria en España y Latinoamérica.</p></article><article><Kicker>Para universidades e instituciones</Kicker><h2>Conectar oportunidades, proyectos y personas entre países.</h2><p>Colaboraciones para abrir experiencias internacionales, identificar talento e impulsar el liderazgo de estudiantes dentro de una red hispanohablante.</p></article></section>
    <section className="section dark-section"><div className="shell"><SectionTitle kicker="Cómo trabajamos" title="Del reto a una entrega concreta." /><div className="process-line">{[["01","Entendemos","Qué necesita la organización y qué decisión debe poder tomar."],["02","Diseñamos","Países, perfiles, metodología, calendario y criterios de calidad."],["03","Activamos","Coordinación central y ejecución adaptada a cada contexto."],["04","Entregamos","Resultados, aprendizajes y próximos pasos para continuar."]].map((item) => <div key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></div>)}</div></div></section>
    <section id="form-reto" className="section shell form-section"><div className="form-intro"><Kicker>Empecemos por el reto</Kicker><h2>Cuéntanos qué quieres entender, activar o construir.</h2><p>El equipo revisará el contexto y propondrá una primera conversación. Este formulario muestra los campos y el comportamiento previsto para la implementación.</p></div><MiniForm key={leadSolution || "reto-general"} kind="reto" initialSolution={leadSolution} /></section>
    {activeCapability && !activeCapability.destination && typeof document !== "undefined" && createPortal(<div className="capability-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveCapability(null); }}>
      <section className="capability-dialog" role="dialog" aria-modal="true" aria-labelledby="capability-dialog-title" onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
        <button className="capability-dialog-close" autoFocus onClick={() => setActiveCapability(null)} aria-label="Cerrar ficha">×</button>
        <span className="capability-dialog-number">Aplicación {activeCapability.number}</span>
        <h2 id="capability-dialog-title">{activeCapability.title}</h2>
        <p className="capability-dialog-summary">{activeCapability.problem}</p>
        <div className="capability-dialog-grid">
          <div><h3>Cómo la activamos</h3><ol>{activeCapability.steps?.map((step) => <li key={step}>{step}</li>)}</ol></div>
          <div className="capability-result"><h3>Resultado para la organización</h3><p>{activeCapability.result}</p></div>
        </div>
        <div className="capability-dialog-actions"><Button onClick={() => exploreCapability(activeCapability.title)}>Quiero explorar esta solución</Button><button onClick={() => setActiveCapability(null)}>Seguir consultando</button></div>
      </section>
    </div>, document.body)}
  </>;
}

function Ideas({ go }: { go: (page: PageKey) => void }) {
  return <>
    <PageHero eyebrow="El Rincón de las Ideas" title="Si crees que una idea merece existir, cuéntanosla." body="Presenta una iniciativa capaz de aportar valor a CLH o a la sociedad. Explícala con claridad y acompáñala de un vídeo de un minuto para que podamos conocerte también a ti." image="/images/ideas.jpg"><Button variant="light" onClick={() => document.getElementById("form-idea")?.scrollIntoView({behavior:"smooth"})}>Presentar una idea</Button></PageHero>
    <section className="section shell split-story"><div><Kicker>Qué buscamos</Kicker><h2>Iniciativa, criterio y voluntad de liderar el primer paso.</h2></div><div><p>La propuesta puede ser una dinámica, una investigación, un proyecto social, una colaboración, un recurso o una solución tecnológica.</p><p>No buscamos una presentación perfecta. Queremos entender qué problema has visto, por qué merece atención, qué propones y qué estás dispuesto a hacer para ponerlo en marcha.</p></div></section>
    <section className="section soft-section"><div className="shell"><SectionTitle kicker="El recorrido" title="Qué ocurre después de presentar una idea." /><div className="idea-process">{[["01","Presentas la idea","Explicas el problema, la propuesta y tu aportación; añades un vídeo de máximo 1 minuto."],["02","La comunidad la revisa","Analizamos su encaje con la cultura, su utilidad y la capacidad real de activarla."],["03","Conversamos","Si existe potencial, organizamos una conversación y definimos un primer paso."],["04","La idea encuentra equipo","CLH puede reunir perfiles complementarios y ayudar a estructurar su desarrollo."]].map((item) => <article key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div><p className="process-note">Presentar una idea no garantiza su selección ni la entrada en la comunidad. Sí garantiza una evaluación desde la cultura y los criterios de CLH.</p></div></section>
    <section id="form-idea" className="section shell form-section"><div className="form-intro"><Kicker>Tu propuesta</Kicker><h2>Convierte la intuición en un primer paso.</h2><p>La persona conserva la titularidad de su idea. El envío autoriza únicamente a CLH a revisarla y contactar con su autor. Cualquier desarrollo conjunto deberá acordarse por escrito.</p></div><MiniForm kind="idea" /></section>
    <Closing go={go} title="Las ideas avanzan cuando encuentran a las personas adecuadas." body="Si necesitas resolver una duda antes de compartirla, puedes hablar con el equipo." primary="contacto" primaryLabel="Contactar con CLH" />
  </>;
}

function Contacto() {
  const options = [["01","Quiero conocer la comunidad","Acceso, cultura y experiencia de CLH."],["02","Represento a una empresa o institución","Retos, investigación, embajadores, talento y alianzas."],["03","Represento a una universidad","Colaboraciones académicas, talento y proyectos internacionales."],["04","Quiero colaborar como profesional o mentor","Sesiones, acompañamiento y apertura de oportunidades."],["05","Prensa y otras consultas","Medios, invitaciones, proveedores y cuestiones generales."]];
  return <>
    <PageHero eyebrow="Contacto" title="Dinos qué quieres construir con CLH." body="Elige el motivo de tu consulta y comparte el contexto necesario. Así podremos dirigirla desde el principio a la persona adecuada." image="/images/comunidad.jpg" />
    <section className="section shell"><SectionTitle kicker="Selector de consulta" title="Una entrada distinta para cada conversación." /><div className="contact-options">{options.map((item) => <article key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div></section>
    <section className="section soft-section"><div className="shell form-section"><div className="form-intro"><Kicker>Formulario general</Kicker><h2>Comparte únicamente el contexto necesario.</h2><p>Los campos adicionales aparecen según el motivo. El teléfono será opcional y solo se solicitará cuando facilite una conversación institucional.</p><div className="direct-contact"><span>España y Latinoamérica</span></div></div><MiniForm kind="contacto" /></div></section>
  </>;
}

function Closing({ go, title, body, primary = "contacto", primaryLabel = "Contacta con CLH" }: { go: (page: PageKey) => void; title: string; body: string; primary?: PageKey; primaryLabel?: string }) {
  return <section className="closing"><div className="shell"><Kicker>Siguiente paso</Kicker><h2>{title}</h2><p>{body}</p><div className="button-row"><Button variant="light" onClick={() => go(primary)}>{primaryLabel}</Button><Button variant="ghost" onClick={() => go("ideas")}>Presenta una idea</Button></div></div></section>;
}

function Header({ page, go }: { page: PageKey; go: (page: PageKey) => void }) {
  const [open, setOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const nav = (target: PageKey) => { go(target); setOpen(false); setCommunityOpen(false); };
  return <header className="site-header"><div className="shell header-inner"><button className="brand" onClick={() => nav("inicio")} aria-label="Ir al inicio"><strong>CLH</strong><span>Comunidad de Líderes<br />Hispanoamericanos</span></button><button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Abrir menú"><span></span><span></span></button><nav className={open ? "main-nav open" : "main-nav"} aria-label="Navegación principal"><button className={page === "inicio" ? "active" : ""} onClick={() => nav("inicio")}>Inicio</button><div className="nav-group"><button className={["comunidad","capitales","miembros","cultura"].includes(page) ? "active" : ""} aria-expanded={communityOpen} onClick={() => setCommunityOpen(!communityOpen)}>La comunidad <span>⌄</span></button><div className={communityOpen ? "dropdown open" : "dropdown"}><button onClick={() => nav("comunidad")}>Qué es CLH</button><button onClick={() => nav("capitales")}>Los 4 pilares de la comunidad</button><button onClick={() => nav("miembros")}>Nuestros miembros</button><button onClick={() => nav("cultura")}>Cultura, visión y misión</button></div></div><button className={page === "beway" ? "active" : ""} onClick={() => nav("beway")}>Beway</button><button className={page === "semana" ? "active" : ""} onClick={() => nav("semana")}>Cumbre CLH × Beway</button><button className={page === "organizaciones" ? "active" : ""} onClick={() => nav("organizaciones")}>Organizaciones</button><button className={page === "ideas" ? "active" : ""} onClick={() => nav("ideas")}>El Rincón de las Ideas</button><button className="nav-cta" onClick={() => nav("contacto")}>Colabora con CLH <span>↗</span></button></nav></div></header>;
}

function Footer({ go }: { go: (page: PageKey) => void }) {
  return <footer className="footer"><div className="shell footer-grid"><div className="footer-about"><strong>CLH</strong><p>Una comunidad internacional sin ánimo de lucro que conecta a jóvenes líderes de España y Latinoamérica para convertir relaciones, ideas y talento en proyectos con impacto.</p></div><div><h3>Comunidad</h3><button onClick={() => go("comunidad")}>Qué es CLH</button><button onClick={() => go("capitales")}>Los 4 pilares</button><button onClick={() => go("miembros")}>Miembros</button><button onClick={() => go("cultura")}>Cultura, visión y misión</button></div><div><h3>Proyectos</h3><button onClick={() => go("beway")}>Beway</button><button onClick={() => go("semana")}>Cumbre CLH × Beway</button><button onClick={() => go("ideas")}>El Rincón de las Ideas</button></div><div><h3>Contacto</h3><button onClick={() => go("contacto")}>Enviar una consulta</button></div></div><div className="shell footer-bottom"><span>© 2026 Comunidad de Líderes Hispanoamericanos</span><div><button>Aviso legal</button><button>Privacidad</button><button>Cookies</button></div></div></footer>;
}

export default function Home() {
  const [page, setPage] = useState<PageKey>("inicio");
  const [banner, setBanner] = useState(true);

  useEffect(() => {
    const readHash = () => {
      const value = window.location.hash.replace("#", "").split("/")[0] as PageKey;
      if (value in pageLabels) setPage(value);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const go = (target: PageKey) => {
    setPage(target);
    window.history.pushState(null, "", `#${target}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let content: ReactNode;
  if (page === "inicio") content = <Inicio go={go} />;
  else if (page === "comunidad") content = <Comunidad go={go} />;
  else if (page === "cultura") content = <Cultura go={go} />;
  else if (page === "capitales") content = <Capitales go={go} />;
  else if (page === "miembros") content = <Miembros go={go} />;
  else if (page === "beway") content = <Beway go={go} />;
  else if (page === "semana") content = <Semana go={go} />;
  else if (page === "organizaciones") content = <Organizaciones go={go} />;
  else if (page === "ideas") content = <Ideas go={go} />;
  else content = <Contacto />;

  return <div className="site-root">
    {banner && <div className="announcement"><button onClick={() => go("semana")}><strong>Madrid · Julio de 2027</strong><span>Cumbre CLH × Beway · directivos, comunidad y presentación de la plataforma</span><i>↗</i></button><button className="announcement-close" aria-label="Cerrar aviso" onClick={() => setBanner(false)}>×</button></div>}
    <Header page={page} go={go} />
    <main key={page} className="page-transition">{content}</main>
    <Footer go={go} />
  </div>;
}
