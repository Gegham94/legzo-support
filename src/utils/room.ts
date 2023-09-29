import moment from "moment-timezone";

export const blobToBase64 = async blob => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const formatTimestamp = timestamp => {
  const timestampFormat = isSameDay(new Date(timestamp * 1000), new Date())
    ? "HH:mm"
    : "DD.MM.YYYY";
  const result = moment.unix(timestamp).format(timestampFormat);
  return timestampFormat === "HH:mm" ? `Today, ${result}` : result;
};

export const formattedFilesBase64 = async files => {
  const formattedFilesBase64 = [];

  for (const file of files) {
    if (file?.blob) {
      await blobToBase64(file.blob).then(base64 => {
        const messageFile = {
          base64: base64,
          name: `${file.name}.${file.extension}`,
          size: file.size,
          type: file.type,
          extension: file.extension || file.type,
          ext: file.extension || file.type,
          url: file.url || file.localUrl,
          content: file.url || file.localUrl,
          audio: null,
          duration: null
        };

        if (file.audio) {
          messageFile.audio = true;
          messageFile.duration = file.duration;
        }

        formattedFilesBase64.push(messageFile);
      });
    }
  }

  return formattedFilesBase64;
};
