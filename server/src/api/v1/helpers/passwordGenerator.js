const generator = require('generate-password');

const generatePassword = () => {
    const password = generator.generate({
        length: 10,
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
    });

    return password;
};

module.exports = generatePassword;
