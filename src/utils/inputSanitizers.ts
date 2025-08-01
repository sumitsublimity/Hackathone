function createInputSanitizer(regex: RegExp) {
  return function (e: React.FormEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    input.value = input.value.replace(regex, "");
  };
}

// Allow only alphabets and spaces (A-Z, a-z, space)
export const allowOnlyAlphabets = createInputSanitizer(/[^A-Za-z\s]/g);

// Allow only digits (0-9)
export const allowOnlyNumbers = createInputSanitizer(/[^0-9]/g);

// Allow only alphanumeric (A-Z, a-z, 0-9) without spaces
export const allowOnlyAlphanumericNoSpaces =
  createInputSanitizer(/[^A-Za-z0-9]/g);

// Allow alphanumeric with spaces
export const allowAlphanumericWithSpaces =
  createInputSanitizer(/[^A-Za-z0-9\s]/g);

export function allowNumWith2Decimals(
  event: React.FormEvent<HTMLInputElement>,
) {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  // Remove all non-numeric characters except decimal point
  value = value.replace(/[^\d.]/g, "");

  // Handle multiple decimal points - keep only the first one
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  // Limit to 2 decimal places
  if (value.includes(".")) {
    const [integer, decimal] = value.split(".");
    if (decimal.length > 2) {
      value = integer + "." + decimal.substring(0, 2);
    }
  }

  // Update input value if it changed
  if (input.value !== value) {
    const cursorPosition = input.selectionStart ?? value.length;

    input.value = value;
    // Try to maintain cursor position
    input.setSelectionRange(
      Math.min(cursorPosition, value.length),
      Math.min(cursorPosition, value.length),
    );
  }
}
