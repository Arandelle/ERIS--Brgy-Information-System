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
        .border-dashed { border: 2px dashed #000; }
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

export const generateBodyTemplate = (systemLogo, tanzaLogo, content, isEdit = false) => {
  const editableStyle = isEdit ? ' style="border: 1px dashed #000; padding: 4px;"' : '';
  const editableAttribute = isEdit ? ' contenteditable="true"' : '';
  const imageStyle = isEdit ? ' style="border: 1px dashed #000; cursor: pointer;"' : '';
  const generateEditableImageInput = (imageId, imageSrc) => isEdit ? `
    <label style="position: relative; display: inline-block; cursor: pointer;">
      <input type="file" 
        onchange="document.getElementById('${imageId}').src = URL.createObjectURL(this.files[0])" 
        style="display: none;" 
      />
      <img 
        id="${imageId}" 
        src="${imageSrc}" 
        alt="Editable Logo" 
        class="h-32 w-32 rounded-full"
        ${imageStyle}
      />
    </label>
  ` : `<img src="${imageSrc}" alt="Logo" class="h-32 w-32 rounded-full" />`;

  return `
    <div class="p-10">
      <div class="flex justify-center gap-4">
        <div class="flex-1 flex items-center justify-end" style="flex: 1 1 25%">
          ${generateEditableImageInput('systemLogo', systemLogo)}
        </div>
        <div
          class="flex-1 flex items-center justify-center text-center bg-white p-4"
          style="flex: 1 1 50%"
        >
          <p class="text-sm"${editableStyle} ${editableAttribute}>
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
          ${generateEditableImageInput('tanzaLogo', tanzaLogo)}
        </div>
      </div>
      <p class="text-center font-bold uppercase text-3xl p-12"${editableStyle} ${editableAttribute}>
        Barangay Certification
      </p>
      <div class="flex justify-center">
        <div
          class="flex-1 bg-blue-100 p-4 text-center border-r-2"
          style="flex: 1 1 25%"
        >
          <ul class="list-none text-sm whitespace-nowrap leading-none font-medium">
            <li class="p-2"${editableStyle} ${editableAttribute}>
              Manuel Clemente T. Mintu Jr. </br>
              <span class="text-xs font-thin">Barangay Chairman</span>
            </li>
            <p${editableStyle}>
              <li ${editableStyle} ${editableAttribute}>
              <span class="text-xs font-thin">Barangay Counsilors</span> </br>
              Ryan G. Mintu
              </li>
              <li ${editableStyle} ${editableAttribute}>Emmanuel T. Salvador Jr.</li>
              <li ${editableStyle} ${editableAttribute}>Luis G. Mercado</li>
              <li ${editableStyle} ${editableAttribute}>Yolanda T. Romana</li>
              <li ${editableStyle} ${editableAttribute}>Jenina T. Paminter</li>
              <li ${editableStyle} ${editableAttribute}>Emmanuel G. Mercado</li>
              <li ${editableStyle} ${editableAttribute}>Christopher I. Aron</li>
            </p>
            <p>
              <li class="p-2"${editableStyle} ${editableAttribute}>
                Maria Angela A. Capuz </br>
                <span class="text-xs font-thin">SK Chairperson</span>
              </li>
            </p>
            <p>
              <li class="p-2"${editableStyle} ${editableAttribute}>
                Maria Leonilla B. Castillo </br>
                <span class="text-xs font-thin">Barangay Secretary</span>
              </li>
            </p>
            <p>
              <li class="p-2"${editableStyle} ${editableAttribute}>
                Dominga T. Molina </br>
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
    </div>`;
};

