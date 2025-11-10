import fs from "fs";

export const deleteLocalFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("Local file deleted:", filePath);
    }
  });
};