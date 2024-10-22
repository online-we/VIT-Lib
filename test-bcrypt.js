const bcrypt = require('bcryptjs');

const password = 'pass1'; // The original password
const hashedPassword = '$2b$10$oENavwJnrLy/hroBb16PBu9II.kGjI2iHsQzoRpSAuGZ.owmcBRwG'; // The hashed password

// Compare the password
bcrypt.compare(password, hashedPassword)
    .then(isMatch => {
        console.log('Password Match:', isMatch); // Should log true if the password matches
    })
    .catch(err => console.log(err));
