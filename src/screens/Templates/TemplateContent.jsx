import React from "react";

export const templateContent = (
  systemLogo,
  tanzaLogo,
  template,
  templateData,
  templateTitle,
  isEdit = false
) => {
  const editableStyle = isEdit
    ? "border-2 border-dashed border-black p-1 focus:outline-none"
    : {};
  const editableAttribute = isEdit && { contentEditable: true };

  const generateEditableImageInput = (imageId, imageSrc) =>
    isEdit ? (
      <label
        className="relative inline-block cursor-pointer"
      >
        <input
          type="file"
          onChange={(e) =>
            (document.getElementById(imageId).src = URL.createObjectURL(
              e.target.files[0]
            ))
          }
         className="hidden"
        />
        <img
          id={imageId}
          src={imageSrc}
          alt="Editable Logo"
          className={`h-32 w-32 rounded-full cursor-pointer ${editableStyle}`}
        />
      </label>
    ) : (
      <img src={imageSrc} alt="Logo" className="h-32 w-32 rounded-full" />
    );

  return (
    <div className="p-10">
      <div className="flex justify-center gap-4">
        <div
          className="flex-1 flex items-center justify-end"
          style={{ flex: "1 1 25%" }}
        >
          {generateEditableImageInput("systemLogo", systemLogo)}
        </div>
        <div
          className="flex-1 flex items-center justify-center text-center bg-white p-4"
          style={{ flex: "1 1 50%" }}
        >
          <p className="text-sm">
            <span id="republic" className={`${editableStyle}`} {...editableAttribute}>
              {templateData.headers.republic}
            </span>
            <br />
            <span id="province" className={`${editableStyle}`} {...editableAttribute}>
              {templateData.headers.province}
            </span>
            <br />
            <span
              id="municipality"
              className={`${editableStyle}`}
              {...editableAttribute}
            >
              {templateData.headers.municipality}
            </span>
            <br />
            <span
              id="barangay"
              className="font-bold uppercase"
              className={`${editableStyle}`}
              {...editableAttribute}
            >
              {templateData.headers.barangay}
            </span>
            <br />
            <span
              id="office"
              className="font-bold uppercase whitespace-nowrap"
              className={`${editableStyle}`}
              {...editableAttribute}
            >
              {templateData.headers.office}
            </span>
          </p>
        </div>
        <div className="flex-1" style={{ flex: "1 1 25%" }}>
          {generateEditableImageInput("tanzaLogo", tanzaLogo)}
        </div>
      </div>
      <p
        id="certificationTitle"
        className="text-center font-bold uppercase text-3xl p-12"
      >
        {templateTitle}
      </p>
      <div className="flex justify-center">
        <div
          className="flex-1 bg-blue-100 p-4 text-center border-r-2"
          style={{ flex: "1 1 25%" }}
        >
          <ul className="list-none text-sm whitespace-nowrap leading-none font-medium">
            <li className="p-2">
              <span id="chairman" className={`${editableStyle}`} {...editableAttribute}>
                {templateData.chairman}
              </span>
              <br />
              <span className="text-xs font-thin">Barangay Chairman</span>
            </li>
            <span className="text-xs font-thin">Barangay Counsilors</span>
            {Object.keys(templateData.counsilors).map((key, index) => (
              <li
                key={index}
                id={key}
                className={`${editableStyle}`}
                {...editableAttribute}
              >
                {templateData.counsilors[key]}
              </li>
            ))}

            <li className="p-2">
              <span
                id="skChairperson"
                className={`${editableStyle}`}
                {...editableAttribute}
              >
                {templateData.skChairperson}
              </span>
              <br />
              <span className="text-xs font-thin">SK Chairperson</span>
            </li>
            <li className="p-2">
              <span id="secretary" className={`${editableStyle}`} {...editableAttribute}>
                {templateData.secretary}
              </span>
              <br />
              <span className="text-xs font-thin">Barangay Secretary</span>
            </li>
            <li className="p-2">
              <span id="treasurer" className={`${editableStyle}`} {...editableAttribute}>
                {templateData.treasurer}
              </span>
              <br />
              <span className="text-xs font-thin">Barangay Treasurer</span>
            </li>
          </ul>
        </div>
        <div
          className="flex-1 p-4"
          style={{ flex: "1 1 75%", position: "relative", height: "200px" }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${tanzaLogo})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.3,
            }}
          ></div>
          <div
            style={{ position: "relative" }}
            dangerouslySetInnerHTML={{ __html: template.content || template }}
          ></div>
        </div>
      </div>
    </div>
  );
};
