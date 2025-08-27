import { format, isValid, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format date to specified format string
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format pattern (default: 'yyyy-MM-dd HH:mm:ss')
 * @returns {string} Formatted date string or error message
 */
function formatDate(date, formatString = 'yyyy-MM-dd HH:mm:ss') {
    try {
        // Handle null, undefined, empty string cases
        if (date === null || date === undefined || date === '' || date === 0) {
            return 'No Date';
        }

        const parsedDate = new Date(date);

        // Check if the date is valid
        if (!isValid(parsedDate)) {
            return 'Invalid Date';
        }

        // Check for Unix epoch (1 January 1970) which might indicate null/default date
        if (parsedDate.getTime() === 0) {
            return 'No Date';
        }

        // Check if the format string is valid by attempting to format the date
        const formattedDate = format(parsedDate, formatString, {
            locale: id,
        });

        return formattedDate;
    } catch (error) {
        console.error(error);
        return 'Invalid Format'; // Handle invalid format error
    }
}

/**
 * Calculate age from birth date
 * @param {string|Date} birthDate - Birth date
 * @param {string|Date} referenceDate - Reference date (default: current date)
 * @param {string} unit - Unit of age ('years', 'months', 'days', 'detailed')
 * @returns {number|string|object} Age in specified unit or error message
 */
function getAge(birthDate, referenceDate = new Date(), unit = 'years') {
    try {
        // Handle null, undefined, empty string cases for birth date
        if (birthDate === null || birthDate === undefined || birthDate === '' || birthDate === 0) {
            return 'No Birth Date';
        }

        const parsedBirthDate = new Date(birthDate);
        const parsedReferenceDate = new Date(referenceDate);

        // Check if both dates are valid
        if (!isValid(parsedBirthDate)) {
            return 'Invalid Birth Date';
        }

        if (!isValid(parsedReferenceDate)) {
            return 'Invalid Reference Date';
        }

        // Check for Unix epoch (1 January 1970) which might indicate null/default date
        if (parsedBirthDate.getTime() === 0) {
            return 'No Birth Date';
        }

        // Check if birth date is in the future
        if (parsedBirthDate > parsedReferenceDate) {
            return 'Birth date cannot be in the future';
        }

        // Check for unrealistic birth dates (before 1900 or too old)
        const year1900 = new Date('1900-01-01');
        if (parsedBirthDate < year1900) {
            return 'Birth date too old';
        }

        switch (unit.toLowerCase()) {
            case 'years':
                return differenceInYears(parsedReferenceDate, parsedBirthDate);

            case 'months':
                return differenceInMonths(parsedReferenceDate, parsedBirthDate);

            case 'days':
                return differenceInDays(parsedReferenceDate, parsedBirthDate);

            case 'detailed': {
                const years = differenceInYears(parsedReferenceDate, parsedBirthDate);

                // Calculate remaining months after subtracting full years
                const yearAdjustedDate = new Date(parsedBirthDate);
                yearAdjustedDate.setFullYear(yearAdjustedDate.getFullYear() + years);
                const months = differenceInMonths(parsedReferenceDate, yearAdjustedDate);

                // Calculate remaining days after subtracting full months
                const monthAdjustedDate = new Date(yearAdjustedDate);
                monthAdjustedDate.setMonth(monthAdjustedDate.getMonth() + months);
                const days = differenceInDays(parsedReferenceDate, monthAdjustedDate);

                return {
                    years,
                    months,
                    days,
                    formatted: `${years} tahun, ${months} bulan, ${days} hari`,
                };
            }

            default:
                return 'Invalid unit. Use: years, months, days, or detailed';
        }
    } catch (error) {
        console.error(error);
        return 'Error calculating age';
    }
}

/**
 * Get age with formatted text in Indonesian
 * @param {string|Date} birthDate - Birth date
 * @param {string|Date} referenceDate - Reference date (default: current date)
 * @returns {string} Formatted age text
 */
function getAgeText(birthDate, referenceDate = new Date()) {
    const ageData = getAge(birthDate, referenceDate, 'detailed');

    if (typeof ageData === 'string') {
        return ageData; // Return error message
    }

    const { years, months, days } = ageData;

    // Format age text based on values
    if (years === 0 && months === 0) {
        return `${days} hari`;
    } else if (years === 0) {
        return days > 0 ? `${months} bulan, ${days} hari` : `${months} bulan`;
    } else {
        if (months === 0 && days === 0) {
            return `${years} tahun`;
        } else if (days === 0) {
            return `${years} tahun, ${months} bulan`;
        } else {
            return `${years} tahun, ${months} bulan, ${days} hari`;
        }
    }
}

/**
 * Check if person is adult (18+ years old)
 * @param {string|Date} birthDate - Birth date
 * @param {number} adultAge - Age threshold for adult (default: 18)
 * @returns {boolean|string} True if adult, false if not, or error message
 */
function isAdult(birthDate, adultAge = 18) {
    const age = getAge(birthDate);

    if (typeof age === 'string') {
        return age; // Return error message
    }

    return age >= adultAge;
}

/**
 * Get age category based on age ranges
 * @param {string|Date} birthDate - Birth date
 * @returns {string} Age category or error message
 */
function getAgeCategory(birthDate) {
    const age = getAge(birthDate);

    if (typeof age === 'string') {
        return age; // Return error message
    }

    if (age < 1) return 'Bayi (0-11 bulan)';
    if (age < 5) return 'Balita (1-4 tahun)';
    if (age < 13) return 'Anak (5-12 tahun)';
    if (age < 18) return 'Remaja (13-17 tahun)';
    if (age < 30) return 'Dewasa Muda (18-29 tahun)';
    if (age < 60) return 'Dewasa (30-59 tahun)';
    return 'Lansia (60+ tahun)';
}

/**
 * Calculate next birthday information
 * @param {string|Date} birthDate - Birth date
 * @param {string|Date} referenceDate - Reference date (default: current date)
 * @returns {object|string} Next birthday info or error message
 */
function getNextBirthday(birthDate, referenceDate = new Date()) {
    try {
        // Handle null, undefined, empty string cases
        if (birthDate === null || birthDate === undefined || birthDate === '' || birthDate === 0) {
            return 'No Birth Date';
        }

        const parsedBirthDate = new Date(birthDate);
        const parsedReferenceDate = new Date(referenceDate);

        if (!isValid(parsedBirthDate) || !isValid(parsedReferenceDate)) {
            return 'Invalid date';
        }

        // Check for Unix epoch (1 January 1970) which might indicate null/default date
        if (parsedBirthDate.getTime() === 0) {
            return 'No Birth Date';
        }

        // Check for unrealistic birth dates
        const year1900 = new Date('1900-01-01');
        if (parsedBirthDate < year1900) {
            return 'Birth date too old';
        }

        const currentYear = parsedReferenceDate.getFullYear();
        let nextBirthday = new Date(parsedBirthDate);
        nextBirthday.setFullYear(currentYear);

        // If birthday has passed this year, set to next year
        if (nextBirthday <= parsedReferenceDate) {
            nextBirthday.setFullYear(currentYear + 1);
        }

        const daysUntilBirthday = differenceInDays(nextBirthday, parsedReferenceDate);
        const nextAge = differenceInYears(nextBirthday, parsedBirthDate);

        return {
            nextBirthdayDate: nextBirthday,
            daysUntilBirthday,
            nextAge,
            formatted: formatDate(nextBirthday, 'dd MMMM yyyy'),
            message:
                daysUntilBirthday === 0
                    ? 'Selamat ulang tahun!'
                    : `${daysUntilBirthday} hari lagi menuju ulang tahun ke-${nextAge}`,
        };
    } catch (error) {
        console.error(error);
        return 'Error calculating next birthday';
    }
}

// Export all functions
export { formatDate, getAge, getAgeText, isAdult, getAgeCategory, getNextBirthday };

// // ===============================
// // CONTOH PENGGUNAAN
// // ===============================

// // Format date examples
// console.log('=== FORMAT DATE EXAMPLES ===');
// console.log('Default format:', formatDate('2024-01-15T10:30:00'));
// console.log('Custom format:', formatDate('2024-01-15', 'dd MMMM yyyy'));
// console.log('Time only:', formatDate(new Date(), 'HH:mm:ss'));
// console.log('Indonesian format:', formatDate('2024-01-15', 'EEEE, dd MMMM yyyy'));

// // Age calculation examples
// console.log('\n=== AGE CALCULATION EXAMPLES ===');
// const birthDate = '1990-05-15';
// const currentDate = '2024-08-27';

// console.log('Age in years:', getAge(birthDate, currentDate, 'years'));
// console.log('Age in months:', getAge(birthDate, currentDate, 'months'));
// console.log('Age in days:', getAge(birthDate, currentDate, 'days'));
// console.log('Detailed age:', getAge(birthDate, currentDate, 'detailed'));

// // Age text examples
// console.log('\n=== AGE TEXT EXAMPLES ===');
// console.log('Age text:', getAgeText('1990-05-15', '2024-08-27'));
// console.log('Baby age:', getAgeText('2024-07-15', '2024-08-27'));
// console.log('Child age:', getAgeText('2020-03-10', '2024-08-27'));

// // Age category examples
// console.log('\n=== AGE CATEGORY EXAMPLES ===');
// console.log('Adult category:', getAgeCategory('1990-05-15'));
// console.log('Child category:', getAgeCategory('2015-08-20'));
// console.log('Teen category:', getAgeCategory('2008-12-01'));

// // Adult check examples
// console.log('\n=== ADULT CHECK EXAMPLES ===');
// console.log('Is adult (1990):', isAdult('1990-05-15'));
// console.log('Is adult (2010):', isAdult('2010-05-15'));
// console.log('Is adult custom age (2010, 16):', isAdult('2010-05-15', 16));

// // Next birthday examples
// console.log('\n=== NEXT BIRTHDAY EXAMPLES ===');
// const nextBirthday = getNextBirthday('1990-12-25', '2024-08-27');
// console.log('Next birthday info:', nextBirthday);

// // Error handling examples
// console.log('\n=== ERROR HANDLING EXAMPLES ===');
// console.log('Invalid date:', formatDate('invalid-date'));
// console.log('Invalid birth date:', getAge('not-a-date'));
// console.log('Future birth date:', getAge('2030-01-01'));
// console.log('Null date:', formatDate(null));
// console.log('Empty string date:', formatDate(''));
// console.log('Zero timestamp:', formatDate(0));
// console.log('Null birth date:', getAge(null));
// console.log('Empty birth date:', getAge(''));
// console.log('1970 birth date (epoch):', getAge(new Date(0)));
// console.log('Very old birth date:', getAge('1850-01-01'));

// // Real-world usage example
// console.log('\n=== REAL-WORLD USAGE EXAMPLE ===');
// const userData = {
//     name: 'John Doe',
//     birthDate: '1995-03-20',
//     registrationDate: '2024-01-15T09:30:00',
// };

// const userAge = getAge(userData.birthDate);
// const userAgeText = getAgeText(userData.birthDate);
// const userCategory = getAgeCategory(userData.birthDate);
// const isUserAdult = isAdult(userData.birthDate);
// const registrationFormatted = formatDate(userData.registrationDate, 'dd MMM yyyy, HH:mm');
// const nextBday = getNextBirthday(userData.birthDate);

// console.log(`User: ${userData.name}`);
// console.log(`Age: ${userAge} tahun (${userAgeText})`);
// console.log(`Category: ${userCategory}`);
// console.log(`Is Adult: ${isUserAdult}`);
// console.log(`Registered: ${registrationFormatted}`);
// console.log(`Next Birthday: ${nextBday.message}`);
