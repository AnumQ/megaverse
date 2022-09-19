export const getEmojiFromString = (el: string) => {
  switch (el) {
    case "SPACE":
      return "🌌";
    case "RIGHT_COMETH":
      return "☄️";
    case "POLYANET":
      return "🪐";
    case "UP_COMETH":
      return "☄️";
    case "WHITE_SOLOON":
      return "🌕";
    case "LEFT_COMETH":
      return "☄️";
    case "BLUE_SOLOON":
      return "🌕";
    case "PURPLE_SOLOON":
      return "🌕";
    case "DOWN_COMETH":
      return "☄️";
    case "RED_SOLOON":
      return "🌕";
    case "PURPLE_SOLOON":
      return "🌕";
    default:
      return "🌌";
  }
};

export const getEmojiFromObject = (el: { type: number } | null) => {
  if (el === null) {
    return "🌌";
  }

  switch (el.type) {
    case 0:
      return "🪐";
    case 2:
      return "☄️";

    default:
      return "0";
  }
};
