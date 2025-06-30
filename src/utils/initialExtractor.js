const InitialExtractor = (value) => {
  // Remove leading and trailing whitespaces
  value = value.trim();

  // Split the display name into an array of words
  const words = value.split(' ');

  // If there's only one word, return only the first letter
  if (words.length === 1) {
    return value.charAt(0).toUpperCase();
  }

  // If there are exactly two words, return the first letters of both words
  if (words.length === 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  // If there are more than two words, return the first letter of the first word and the first letter of the last word
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

export default InitialExtractor;
