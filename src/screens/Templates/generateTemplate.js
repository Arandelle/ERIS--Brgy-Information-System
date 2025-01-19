export const generateFullTemplate = (
  templateTitle,
  content,
  templateData,
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
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
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
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
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

        /* Page layout specific styles */
        body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }
        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .content-wrapper {
          flex: 1;
          padding: 20px;
        }
        .footer-wrapper {
          width: 100%;
          margin-top: auto;
        }
        .footer-image {
          width: 100%;
          display: block;
        }

        @media print {
          body { margin: 0; padding: 0; }
          @page { 
            size: auto; 
            margin: 5mm;
          }
          .page-container {
            height: 100vh;
          }
          .footer-wrapper {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
      </style>
    </head>
    <body>
      ${generateBodyTemplate(content, templateData, templateTitle)}
    </body>
  </html>
`;

export const generateBodyTemplate = (template, templateData, templateTitle, isEdit = false) => {
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
    <div class="page-container">
      <div class="content-wrapper">
        <div class="flex justify-center gap-4">
          <div class="flex-1 flex items-center justify-end" style="flex: 1 1 25%">
            ${generateEditableImageInput('systemLogo', templateData.images.image1)}
          </div>
          <div class="flex-1 flex items-center justify-center text-center bg-white p-4" style="flex: 1 1 50%">
            <p class="text-sm">
              <span id="republic" ${editableStyle} ${editableAttribute}>${templateData.headers.republic}</span>
              <br />
              <span id="province" ${editableStyle} ${editableAttribute}>${templateData.headers.province}</span>
              <br />
              <span id="municipality" ${editableStyle} ${editableAttribute}>${templateData.headers.municipality}</span>
              <br />
              <span id="barangay" class="font-bold uppercase" ${editableStyle} ${editableAttribute}>${templateData.headers.barangay}</span>
              <br />
              <span id="office" class="font-bold uppercase whitespace-nowrap" ${editableStyle} ${editableAttribute}>
                ${templateData.headers.office}
              </span>
            </p>
          </div>
          <div class="flex-1" style="flex: 1 1 25%">
            ${generateEditableImageInput('tanzaLogo', templateData.images.image2)}
          </div>
        </div>
        <p id="certificationTitle" class="text-center font-bold uppercase text-3xl p-12">
          ${templateTitle}
        </p>
        <div class="flex justify-center">
          <div class="flex-1 bg-blue-100 text-center border-r-2" style="flex: 1 1 25%">
            <ul class="list-none text-sm whitespace-nowrap leading-none font-medium">
              <li class="p-2">
                <span id="chairman" ${editableStyle} ${editableAttribute}>${templateData.chairman}</span><br/>
                <span class="text-xs font-thin">Barangay Chairman</span>
              </li>
              <p>
                <li>
                  <span class="text-xs font-thin">Barangay Counsilors</span><br/>
                  <span id="counsilor1" ${editableStyle} ${editableAttribute}>${templateData.counsilors.counsilor1}</span>
                </li>
                <li id="counsilor2" ${editableStyle} ${editableAttribute}>${templateData.counsilors.counsilor2}</li>
                <li id="counsilor3" ${editableStyle} ${editableAttribute}>${templateData.counsilors.counsilor3}</li>
                <li id="counsilor4" ${editableStyle} ${editableAttribute}>${templateData.counsilors.counsilor4}</li>
                <li id="counsilor5" ${editableStyle} ${editableAttribute}>${templateData.counsilors.counsilor5}</li>
                <li id="counsilor6" ${editableStyle} ${editableAttribute}>${templateData.counsilors.counsilor6}</li>
                <li id="counsilor7" ${editableStyle} ${editableAttribute}>${templateData.counsilors.counsilor7}</li>
              </p>
              <p>
                <li class="p-2">
                  <span id="skChairperson" ${editableStyle} ${editableAttribute}>${templateData.skChairperson}</span><br/>
                  <span class="text-xs font-thin">SK Chairperson</span>
                </li>
              </p>
              <p>
                <li class="p-2">
                  <span id="secretary" ${editableStyle} ${editableAttribute}>${templateData.secretary}</span><br/>
                  <span class="text-xs font-thin">Barangay Secretary</span>
                </li>
              </p>
              <p>
                <li class="p-2">
                  <span id="treasurer" ${editableStyle} ${editableAttribute}>${templateData.treasurer}</span><br/>
                  <span class="text-xs font-thin">Barangay Treasurer</span>
                </li>
              </p>
            </ul>
          </div>
          <div class="flex-1 px-4" style="flex: 1 1 75%; position: relative; min-height: 200px;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${templateData.images.image3}'); background-size: contain; background-position: center; background-repeat: no-repeat; opacity: 0.3;"></div>
            <div style="position: relative;">${template.content || template}</div>
          </div>
        </div>
      </div>
      <div class="footer-wrapper">
        <img src="${templateData.images.image4}" class="footer-image" alt="footer" />
      </div>
    </div>
  `;
};