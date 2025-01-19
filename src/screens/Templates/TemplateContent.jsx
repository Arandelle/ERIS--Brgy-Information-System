import footer from "../../assets/images/footer.jpg"

export const templateContent = (
  template,
  templateData,
  templateTitle,
  isEdit = false,
  handleImageChange,
  images
) => {
  const editableStyle = isEdit
    ? "border-2 border-dashed border-black p-1 focus:outline-none"
    : {};
  const editableAttribute = isEdit && { contentEditable: true };

  const generateEditableImageInput = (imageId, imageSrc) =>
    isEdit ? (
      <label className="relative inline-block cursor-pointer">
        <input
          type="file"
          onChange={(e) => handleImageChange(e, imageId)}
          className="hidden"
        />
        <img
          id={imageId}
          src={images[`${imageId}Preview`] || imageSrc}
          alt="Editable Logo"
          className={`h-32 w-32 rounded-full cursor-pointer ${editableStyle}`}
        />
      </label>
    ) : (
      <img
        src={imageSrc || images[`${imageId}Preview`]}
        alt="Logo"
        className="h-32 w-32 rounded-full"
      />
    );
  return (
    <div className="h-[290mm] flex flex-col justify-between">
      <main className="p-5">
        <header className="flex justify-center gap-4">
          <div
            className="flex-1 flex items-center justify-end"
            style={{ flex: "1 1 25%" }}
          >
            {generateEditableImageInput("image1", templateData.images.image1)}
          </div>
          <div
            className="flex-1 flex items-center justify-center text-center bg-white p-4"
            style={{ flex: "1 1 50%" }}
          >
            <p className="text-sm">
              <span
                id="republic"
                className={`${editableStyle}`}
                {...editableAttribute}
              >
                {templateData.headers.republic}
              </span>
              <br />
              <span
                id="province"
                className={`${editableStyle}`}
                {...editableAttribute}
              >
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
                className={`font-bold uppercase ${editableStyle}`}
                {...editableAttribute}
              >
                {templateData.headers.barangay}
              </span>
              <br />
              <span
                id="office"
                className={`font-bold uppercase whitespace-nowrap ${editableStyle}`}
                {...editableAttribute}
              >
                {templateData.headers.office}
              </span>
            </p>
          </div>
          <div className="flex-1" style={{ flex: "1 1 25%" }}>
            {generateEditableImageInput("image2", templateData.images.image2)}
          </div>
        </header>
        <p
          id="certificationTitle"
          className="text-center font-bold uppercase text-3xl p-12"
        >
          {templateTitle}
        </p>
      {/** button for add image3 */}
       <section className="place-self-center">
          {isEdit && 
              <label className="border-2 border-dashed border-black cursor-pointer p-2">
                Edit background image
                <input type="file" className="hidden"
                  onChange={(e) => handleImageChange(e, "image3")}
                />
              </label>
              }
       </section>
  
        <section className="flex justify-center">
          <aside
            className="flex-1 bg-blue-100 text-center border-r-2"
            style={{ flex: "1 1 25%" }}
          >
            <ul className="list-none space-y-2 text-sm whitespace-nowrap leading-none font-medium">
              <li className="p-2">
                <span
                  id="chairman"
                  className={`${editableStyle} text-xs font-semibold`}
                  {...editableAttribute}
                >
                  {templateData.chairman}
                </span>
                <br />
                <span className="text-[0.70rem] text-xs font-thin">Barangay Chairman</span>
              </li>
              <div>
                <p className=" text-[0.70rem] font-thin p-2">Barangay Counsilors</p>
                {Object.keys(templateData.counsilors).map((key, index) => (
                  <li
                    key={index}
                    id={key}
                    className={`${editableStyle} text-xs font-semibold`}
                    {...editableAttribute}
                  >
                    {templateData.counsilors[key]}
                  </li>
                ))}
              </div>
              <li className="p-2">
                <span
                  id="skChairperson"
                  className={`${editableStyle} text-xs font-semibold`}
                  {...editableAttribute}
                >
                  {templateData.skChairperson}
                </span>
                <br /> <span className="text-[0.70rem] font-thin">SK Chairperson</span>
              </li>
              <li className="p-2">
                <span
                  id="secretary"
                  className={`${editableStyle} text-xs font-semibold`}
                  {...editableAttribute}
                >
                  {templateData.secretary}
                </span>
                <br />
                <span className="text-[0.70rem] font-thin">Barangay Secretary</span>
              </li>
              <li className="p-2">
                <span
                  id="treasurer"
                  className={`${editableStyle} text-xs font-semibold`}
                  {...editableAttribute}
                >
                  {templateData.treasurer}
                </span>
                <br />
                <span className="text-[0.70rem] font-thin">Barangay Treasurer</span>
              </li>
            </ul>
          </aside>
          {/** whole paper */}
          <article
            className="flex-1 px-4"
            style={{ flex: "1 1 75%", position: "relative", height: "200px" }}
          >
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100mm",
                backgroundImage: `url(${images.image3Preview || templateData.images.image3})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 0.3,
              }}
            ></div>
            <div
              style={{ position: "relative" }}
              className="space-y-4"
              dangerouslySetInnerHTML={{ __html: template.content || template }}
            ></div>
          </article>
        </section>
      </main>
      <footer className="px-5">
         <img src={footer} className="w-full" />
        </footer>
    </div>
  );
};
