export const getAgeFromBirthdate = (birthdate) => {
    if (!birthdate) return 'N/A'; // null or undefined check

    // API gives YYYY-MM-DD
    const [year, month, day] = birthdate.split('-').map(Number);

    const birthDate = new Date(year, month - 1, day); // JS months are 0-indexed
    if (isNaN(birthDate)) return 'Invalid Date';

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};
