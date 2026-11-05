export function generateId({ separator = "-", length = 10, prefix, includeLowercase = false, includeUppercase = true, includeNumbers = true }: { separator?: string, length?: number, prefix: string, includeLowercase?: boolean; includeUppercase?: boolean; includeNumbers?: boolean }) {
    let lowercase = "qwertzuiopasdfghjklyxcvbnm";
    let uppercase = "QWERTZUIOPASDFGHJKLYXCVBNM";
    let numbers = "0123456789"

    let letters = "";

    letters += includeLowercase ? lowercase : ""
    letters += includeUppercase ? uppercase : ""
    letters += includeNumbers ? numbers : ""

    let result = `${prefix}`;

    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * letters.length);
        result += letters[index];
    }

    return result;
}