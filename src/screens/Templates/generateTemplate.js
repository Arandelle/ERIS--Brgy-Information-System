export const generateFullTemplate = (
  templateTitle,
  systemLogo,
  tanzaLogo,
  content
) => `
  <html>
    <head>
      <title>${templateTitle}</title>
      <style>
         /* Tailwind-like utility classes */
        .bg-white { background-color: white; }
        .p-10 { padding: 2.5rem; }
        .flex { display: flex; }
        .flex-row { flex-direction: row; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .text-center { text-align: center; }
        .font-bold { font-weight: 700; }
        .uppercase { text-transform: uppercase; }
        .h-32 { height: 8rem; }
        .w-32 { width: 8rem; }
        .rounded-full { border-radius: 9999px; }
        .mr-4 { margin-right: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .bg-gray-200 { background-color: #e5e7eb; }
        .p-4 { padding: 1rem; }
        .font-semibold { font-weight: 600; }
        .flex-1 { flex: 1 1 0%; }
        .basis-1/4 { flex-basis: 25%; }
        .basis-1/2 { flex-basis: 50%; }
        .basis-3/4 { flex-basis: 75%; }
        .gap-4 { gap: 1rem; }
        .leading-none { line-height: 1; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .text-3xl { font-size: 1.875rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .font-bold { font-weight: 700; }
        .bg-blue-100 { background-color: #ebf8ff; }
        .whitespace-nowrap { white-space: nowrap; }
        .border-r-2 { border-right: 1px solid black; }
        .font-medium { font-weight: 500; }
        .font-thin { font-weight: 100; }
        ul { list-style-type: none !important; padding-left: 0 !important; }
        li { margin-left: 0 !important; }
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: auto; margin: 5mm; }
        }
      </style>
    </head>
    <body>
      ${generateBodyTemplate(systemLogo, tanzaLogo, content)}
    </body>
  </html>
`;

export const generateBodyTemplate = (systemLogo, tanzaLogo, content) => (
`  <div class="p-10">
    <div class="flex justify-center gap-4">
      <div class="flex-1 flex items-center justify-end" style="flex: 1 1 25%">
        <img
          src="${systemLogo}"
          alt="Logo"
          class="h-32 w-32 rounded-full mr-4"
        />
      </div>
      <div
        class="flex-1 flex items-center justify-center text-center bg-white p-4"
        style="flex: 1 1 50%"
      >
        <p class="text-sm">
          Republic of the Philippines
          <br />
          Province of Cavite
          <br />
          Municipality of Tanza
          <br />
          <span class="font-bold uppercase">Barangay Bagtas</span>
          <br />
          <span class="font-bold uppercase whitespace-nowrap">
            Office of the Barangay Chairman
          </span>
        </p>
      </div>
      <div class="flex-1" style="flex: 1 1 25%">
        <img src="${tanzaLogo}" alt="Logo" class="h-32 w-32 rounded-full" />
      </div>
    </div>
    <p class="text-center font-bold uppercase text-3xl p-12">
      Barangay Certification
    </p>
    <div class="flex justify-center">
      <div
        class="flex-1 bg-blue-100 p-4 text-center border-r-2"
        style="flex: 1 1 25%"
      >
        <ul class="list-none text-sm whitespace-nowrap leading-none font-medium">
          <li class="p-2">
            Manuel Clemente T. Mintu Jr.
            <span class="text-xs font-thin">Barangay Chairman</span>
          </li>
          <p class="text-xs p-2 font-thin">Barangay Counsilors</p>
          <p>
            <li>Ryan G. Mintu</li>
            <li>Emmanuel T. Salvador Jr.</li>
            <li>Luis G. Mercado</li>
            <li>Yolanda T. Romana</li>
            <li>Jenina T. Paminter</li>
            <li>Emmanuel G. Mercado</li>
            <li>Christopher I. Aron</li>
          </p>

          <p>
            <li class="p-2">
              Maria Angela A. Capuz
              <span class="text-xs font-thin">SK Chairperson</span>
            </li>
          </p>

          <p>
            <li class="p-2">
              Maria Leonilla B. Castillo
              <span class="text-xs font-thin">Barangay Secretary</span>
            </li>
          </p>
          <p>
            <li class="p-2">
              Dominga T. Molina
              <span class="text-xs font-thin">Barangay Treasurer</span>
            </li>
          </p>
        </ul>
      </div>
      <div
        class="flex-1 p-4"
        style="flex: 1 1 75%; position: relative; height: 200px;"
      >
        <div style="position: absolute; top: 50%; left: 0; width: 100%; height: 100%; background-image: url('${tanzaLogo}'); background-size: contain; background-position: center; background-repeat: no-repeat; opacity: 0.3;"></div>
        <div style="position: relative;">${content}</div>
      </div>
    </div>
  </div>`
);
