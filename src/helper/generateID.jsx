export async function generateUniqueBarangayID(type) {

    const prefixType = {
      admins: "AD",
      responders: "RS",
      users: "BM",
      emergency: "ER",
      awareness: "AW",
      hotlines: "HL",
      certification: "CT",
      templates: "TP",
      anonymous: "AN",
      incident: "IR"
    }
    const prefix = prefixType[type];
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const generatedId = `${prefix}${year}${month}${day}-${milliseconds}${random}`;
    return generatedId;
  }