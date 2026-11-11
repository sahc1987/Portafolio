import { CONTACT, LINKS, STACKS } from './shared';
import type { Content } from './types';

export const es = {
  locale: 'es',
  profile: {
    name: 'Saúl Hernández',
    headline: 'Desarrollador Full Stack',
    pitch:
      'Construyo aplicaciones web de producción de principio a fin con React, TypeScript, Node.js y Java. Siete años en software como desarrollador, líder de equipo y líder de QA; desde 2020 dirijo una tienda UPS Store y construí el software con el que opera.',
    location: 'San Salvador, El Salvador',
    availability:
      'Disponible para trabajo remoto desde El Salvador, o presencial e híbrido en San Salvador.',
    ...CONTACT,
  },
  projects: [
    {
      slug: 'complete-pool-app',
      title: 'Complete Pool App',
      kind: 'client',
      summary:
        'Sistema de operaciones para una empresa de mantenimiento de piscinas: agenda, trabajo de campo, cotizaciones, facturas y planilla, en web y móvil.',
      problem:
        'Complete Pool Service trabajaba en papel: trabajos, cotizaciones, facturas y horas del personal vivían en cuadernos y hojas de cálculo, sin un solo lugar para todo.',
      built: [
        'App web con Next.js App Router y Server Actions, más una app móvil en Expo para gerentes y técnicos de campo sobre los mismos contratos.',
        'Tres roles (Propietario, Administrador, Trabajador) con trabajos recurrentes, mapa de ruta diario y un flujo de enviar, aprobar o marcar el trabajo terminado.',
        'Cotizaciones que el cliente aprueba con firma en pantalla, y facturas con PDF y enlaces de pago QR mediante Stripe.',
        'Inventario con solicitudes de material desde el campo, horas de planilla y un panel de KPIs para el propietario.',
      ],
      hardParts: [
        'Reglas de roles aplicadas en el servidor: solo puedes gestionar roles inferiores al tuyo y nunca se puede eliminar al último gerente.',
        'Pagos parciales y reversiones que mantienen correcto el saldo de cada factura.',
        'Esquemas Zod compartidos para que web y móvil validen los datos exactamente igual.',
        'Seguridad a nivel de fila en PostgreSQL sobre Supabase, con JWT de acceso y refresh tokens rotativos para móvil.',
      ],
      stack: STACKS.pool,
      links: { demo: LINKS.poolDemo, repo: LINKS.poolRepo },
      diagram: 'pool-app',
      diagramLabel:
        'Arquitectura: la app web en Next.js y la app móvil en Expo comparten contratos Zod y llaman a la misma capa de servidor, que usa Prisma sobre PostgreSQL y Storage de Supabase, NextAuth y Stripe.',
      note: 'En pruebas de aceptación con el propietario. La demo en vivo es de solo lectura.',
    },
    {
      slug: 'ecommerce',
      title: 'Plataforma Ecommerce',
      kind: 'personal',
      summary:
        'Tienda en línea de uso general con tienda para clientes, back office para el personal y app móvil sobre una sola API, construida con la seguridad primero.',
      problem:
        'La mayoría de tutoriales de tiendas omiten lo que falla en producción: dos personas comprando la última unidad, doble clic en el pago, reembolsos y abuso. Construí una tienda que lo resuelve.',
      built: [
        'Tienda web, back office para personal y administradores, y una app React Native, todo sobre una API en Node.js y Express.',
        'Variantes de producto con su propio SKU, stock y precio; carritos de invitado con reserva temporal de stock.',
        'Pagos con tarjeta vía Stripe y contra entrega, envíos con rastreo, cancelaciones, devoluciones y reembolsos.',
        'Panel de KPIs, asistente de configuración inicial y SEO con datos schema.org.',
      ],
      hardParts: [
        'Los pedidos se crean dentro de una transacción con bloqueo de filas, así las compras simultáneas no pueden sobrevender stock.',
        'Llaves de idempotencia: un pago repetido crea un solo pedido, no dos.',
        'Autenticación JWT en cookie httpOnly, bcrypt, cabeceras Helmet, límite de solicitudes por IP y validación de imágenes por magic bytes.',
        'Pruebas en cada capa: node:test para la API, Vitest para web y Jest para móvil.',
      ],
      stack: STACKS.ecommerce,
      links: { repo: LINKS.ecommerceRepo },
      diagram: 'ecommerce',
      diagramLabel:
        'Arquitectura: la tienda web, el back office y la app React Native llaman a una API Express, que usa PostgreSQL con bloqueo de filas, Redis, Stripe y Cloudinary.',
      note: 'Código en GitHub; la demo en vivo viene pronto.',
    },
    {
      slug: 'centraldesk',
      title: 'CentralDesk',
      kind: 'internal',
      summary:
        'Portal de operaciones que usan a diario cuatro tiendas UPS Store: renovación de buzones, rastreo de paquetes, reclamos, trabajos de impresión, horarios y ventas.',
      problem:
        'Como Gerente General veía al equipo saltar entre hojas de cálculo, formularios en papel y varios sitios de transportistas. Las renovaciones se atrasaban, los reclamos se perdían y nadie tenía una vista del día.',
      built: [
        'Un portal con acceso por tienda, búsqueda global, notificaciones y un panel de inicio con ventas, trabajos de impresión y envíos.',
        'Renovación de buzones con recordatorios por correo que incluyen enlaces de pago de Stripe, y detección de expedientes de buzón incompletos.',
        'Formularios diarios (reclamos, exenciones, reembolsos, apertura y cierre), cotizaciones y trabajos de impresión, y rastreo con varios transportistas.',
        'Reloj de asistencia, horarios, horas extra y solicitudes de vacaciones para el personal.',
      ],
      hardParts: [
        'Permisos por rol (propietario, gerente, asociado) con datos separados por tienda; el propietario ve las cuatro.',
        'Pagos de renovación confirmados por webhooks de Stripe, con confirmación manual como respaldo.',
        'Datos de ventas y asistencia integrados desde el POS y el reloj de asistencia.',
      ],
      stack: STACKS.centraldesk,
      links: {},
      diagram: 'centraldesk',
      diagramLabel:
        'Arquitectura: el portal en React llama a una API REST en Node.js y Express, que se conecta al POS, al reloj de asistencia, a las APIs de rastreo de transportistas, a Stripe y al correo.',
      note: 'Herramienta interna: sin enlace público ni capturas. Con gusto la explico en una entrevista.',
    },
    {
      slug: 'hospital-app',
      title: 'Sistema de Gestión Hospitalaria',
      kind: 'learning',
      summary:
        'Proyecto de aprendizaje con Spring Boot: back office de hospital para pacientes, citas, ingresos, laboratorio, farmacia, facturación y planilla.',
      problem:
        'Quería práctica real con Spring Boot moderno y Java 21 en un dominio con reglas de verdad: quién puede ver datos clínicos y qué nunca debe traslaparse.',
      built: [
        'API en Spring Boot con Spring Security y JWT, y un panel en React y TypeScript.',
        'Siete roles, de recepción a médico a recursos humanos, cada uno ve solo los módulos que necesita.',
        'Citas en espacios libres, ingresos a habitaciones, exámenes de laboratorio, stock de farmacia, facturas detalladas y planilla mensual.',
      ],
      hardParts: [
        'Los permisos viven en la base de datos y la API los revisa en cada solicitud; los administradores los cambian desde una matriz de acceso.',
        'Reglas de negocio: sin citas traslapadas, sin ingresos a una habitación llena, sin cerrar una consulta sin diagnóstico, sin pagos mayores a lo adeudado.',
        'Migraciones con Flyway, caché con Redis y Docker Compose para todo el stack.',
      ],
      stack: STACKS.hospital,
      links: { repo: LINKS.hospitalRepo },
      diagram: 'hospital-app',
      diagramLabel:
        'Arquitectura: el panel en React llama a una API Spring Boot que revisa una tabla de permisos por rol en cada solicitud, sobre PostgreSQL con Flyway y Redis.',
      note: 'Proyecto de aprendizaje, no se usa en producción.',
    },
  ],
  experience: [
    {
      slug: 'independent',
      company: 'Independiente',
      role: 'Desarrollador Full Stack',
      location: 'Remoto',
      start: '2023',
      end: null,
      highlights: [
        'Trabajos de pequeña escala para negocios locales y proyectos personales de portafolio, desarrollados de principio a fin.',
        'Diseñé y construí Complete Pool App para Complete Pool Service Inc.: requisitos, modelo de datos, desarrollo, pruebas y despliegue.',
        'Construí una plataforma ecommerce full stack con un proceso de pago transaccional que no sobrevende.',
      ],
      stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL'],
    },
    {
      slug: 'ups-store',
      company: 'The UPS Store, Brickell',
      role: 'Gerente General',
      location: 'Miami, FL',
      start: '2020-10',
      end: null,
      highlights: [
        'Dirijo la operación diaria de una de las tres tiendas UPS Store con mejor desempeño en Florida, según reportes de la franquicia UPS.',
        'Responsable de P&L, inventario, proveedores, desarrollo del personal y clientes empresariales en el corredor de Brickell.',
        'Construí CentralDesk, el portal de operaciones que hoy usan a diario cuatro tiendas.',
      ],
      stack: ['React', 'Node.js', 'Express'],
    },
    {
      slug: 'telus',
      company: 'Telus International',
      role: 'Desarrollador Full Stack',
      start: '2019-03',
      end: '2020-09',
      highlights: [
        'Desarrollé y mantuve front ends en React y TypeScript.',
        'Construí una aplicación full stack (React, Node.js, Cassandra) para gestionar las APIs de la plataforma publicadas a través de un gateway Kong a cargo del equipo de infraestructura.',
        'Mantuve pipelines de CI/CD en Jenkins y OpenShift, y paneles en Tableau Server con KPIs de calidad de releases.',
      ],
      stack: ['React', 'TypeScript', 'Node.js', 'Cassandra', 'Jenkins', 'OpenShift', 'Docker'],
    },
    {
      slug: 'omnisport',
      company: 'Omnisport El Salvador',
      role: 'Líder de Equipo y Líder de QA',
      location: 'El Salvador',
      start: '2017-09',
      end: '2019-03',
      highlights: [
        'Lideré a 5 desarrolladores y 3 testers desde los requisitos hasta la puesta en producción.',
        'Definí la estrategia de pruebas de extremo a extremo: planes de prueba, suites de regresión y releases de parches.',
        'Saqué adelante un rezago de aproximadamente 50 proyectos detenidos en pruebas y aceptación del cliente.',
      ],
      stack: ['Java', 'JSF', 'JPA', 'Oracle DB', 'WebLogic'],
    },
    {
      slug: 'mitratech',
      company: 'Mitratech Holdings',
      role: 'Líder de Equipo e Ingeniero de Software',
      start: '2013-11',
      end: '2017-08',
      highlights: [
        'Lideré hasta 12 desarrolladores y testers en proyectos para clientes.',
        'Migré la implementación de HotDocs, sistema de generación de documentos, de solo Internet Explorer a una versión compatible con cualquier navegador.',
        'Coordiné la planificación de sprints y resolví errores críticos en producción de software legal.',
      ],
      stack: ['Java', 'JavaScript', 'HotDocs', '.NET / C#', 'SQL Server', 'Oracle'],
    },
  ],
  services: [
    {
      slug: 'frontend',
      title: 'Desarrollo frontend',
      description: 'Interfaces responsivas y accesibles con React, Next.js y TypeScript.',
    },
    {
      slug: 'backend',
      title: 'Desarrollo backend',
      description: 'APIs REST y servicios con Node.js, Express, Java y Spring Boot.',
    },
    {
      slug: 'databases',
      title: 'Bases de datos',
      description:
        'Diseño de esquemas y consultas en PostgreSQL, MySQL y MongoDB, con Redis para caché.',
    },
    {
      slug: 'cloud',
      title: 'Nube y entrega',
      description: 'Docker, CI/CD y despliegues en AWS, con pruebas integradas en el pipeline.',
    },
  ],
  skills: [
    {
      slug: 'frontend',
      label: 'Frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Angular', 'Tailwind CSS', 'HTML5', 'CSS3'],
    },
    {
      slug: 'backend',
      label: 'Backend',
      skills: [
        'Node.js',
        'Express',
        'Java',
        'Spring Boot',
        'Hibernate / JPA',
        'Prisma',
        'C# / .NET',
        'APIs REST',
      ],
    },
    {
      slug: 'databases',
      label: 'Bases de datos',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle', 'SQL Server', 'Cassandra', 'Redis'],
    },
    {
      slug: 'devops',
      label: 'DevOps y Cloud',
      skills: [
        'Docker',
        'Kubernetes',
        'OpenShift',
        'Jenkins',
        'CI/CD',
        'AWS',
        'Google Cloud',
        'Git',
      ],
    },
    {
      slug: 'quality',
      label: 'Pruebas y Calidad',
      skills: [
        'Planificación de pruebas',
        'Pruebas de regresión',
        'UAT',
        'Postman',
        'REST Assured',
        'Jest',
        'Vitest',
        'Jira',
        'TestRail',
        'Zephyr',
        'SonarQube',
      ],
    },
  ],
  education: {
    institution: 'Universidad de El Salvador',
    degree: 'Ingeniería de Sistemas Informáticos',
    start: '2008',
    end: '2013',
  },
  cv: { locale: 'es', path: '/cv/CV_Saul_Hernandez_ES.pdf', label: 'Descargar CV (PDF)' },
  ui: {
    metaTitle: 'Saúl Hernández · Desarrollador Full Stack',
    metaDescription:
      'Desarrollador full stack en San Salvador. React, TypeScript, Node.js y Java. Proyectos, experiencia y CV.',
    skipToContent: 'Saltar al contenido',
    nav: {
      label: 'Secciones',
      about: 'Sobre mí',
      services: 'Servicios',
      hireMe: 'Contrátame',
      projects: 'Proyectos',
      experience: 'Experiencia',
      skills: 'Habilidades',
      contact: 'Contacto',
    },
    sections: {
      servicesEyebrow: 'Qué hago',
      services: 'Cómo puedo ayudar a tu equipo',
      servicesIntro: 'Las partes de un producto web que he construido y puesto en producción.',
      projectsEyebrow: '01 / Trabajo',
      projects: 'Proyectos',
      projectsIntro:
        'Cuatro proyectos, cada uno etiquetado por lo que es. Abre un caso de estudio para ver el problema, lo que construí y las partes difíciles.',
      experienceEyebrow: '02 / Currículum',
      experience: 'Experiencia',
      skillsEyebrow: '03 / Herramientas',
      skills: 'Habilidades',
      education: 'Educación',
      contactEyebrow: 'Contacto',
      contact: 'Trabajemos juntos',
      contactIntro:
        '¿Buscas un desarrollador full stack? La forma más rápida de contactarme es por correo. Respondo en español o inglés.',
    },
    cta: {
      downloadCv: 'Descargar CV',
      email: 'Correo',
      linkedin: 'LinkedIn',
      whatsapp: 'WhatsApp',
      github: 'GitHub',
    },
    kinds: {
      client: 'Proyecto para cliente',
      internal: 'Herramienta interna',
      personal: 'Proyecto personal',
      learning: 'Proyecto de aprendizaje Spring Boot',
    },
    caseStudy: {
      open: 'Leer caso de estudio',
      problem: 'El problema',
      built: 'Lo que construí',
      hardParts: 'Partes difíciles resueltas',
      stack: 'Stack',
      demo: 'Demo en vivo',
      repo: 'Código',
    },
    hero: {
      greeting: 'Hola, soy',
      viewWork: 'Ver mi trabajo',
      contactMe: 'Contáctame',
      status: 'Disponible para roles full stack',
      photoAlt: 'Retrato de Saúl Hernández',
      stackLabel: 'El stack con el que entrego',
    },
    about: {
      eyebrow: 'Sobre mí',
      title: 'Construyo software que hace funcionar negocios reales',
      body: [
        'Soy desarrollador full stack de San Salvador. Pasé siete años construyendo y probando software empresarial en Mitratech, Omnisport y Telus International, liderando equipos de desarrolladores y testers.',
        'Desde 2020 dirijo una tienda UPS Store en Miami. En lugar de alejarme del código, construí el portal con el que hoy operan cuatro tiendas cada día. Regreso a El Salvador y vuelvo al software a tiempo completo.',
      ],
      stats: [
        { value: '7+', label: 'Años en software' },
        { value: '12', label: 'Mayor equipo liderado' },
        { value: '2', label: 'Idiomas: español e inglés' },
      ],
      info: {
        location: 'Ubicación',
        email: 'Correo',
        whatsapp: 'WhatsApp',
        whatsappValue: 'Envíame un mensaje',
        languages: 'Idiomas',
        languagesValue: 'Español (nativo), inglés (profesional)',
        availability: 'Disponibilidad',
        availabilityValue: 'Remoto, o presencial e híbrido en San Salvador',
      },
    },
    present: 'Presente',
    theme: { toLight: 'Cambiar a tema claro', toDark: 'Cambiar a tema oscuro' },
    language: { switchTo: 'EN, view in English', short: 'EN' },
    footer: {
      tagline: 'Desarrollador full stack que construye software web de principio a fin.',
      quickLinks: 'Enlaces rápidos',
      follow: 'Sígueme',
      builtWith: 'Hecho con Next.js, desplegado en AWS.',
      source: 'Código fuente',
      social: 'Redes',
    },
  },
} as const satisfies Content;
