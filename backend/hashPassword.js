const bcrypt = require('bcrypt');

const password = 'Admin@123';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }
    console.log('Password:', password);
    console.log('Hashed password:', hash);
    console.log('\nReplace the password hash in schema.sql INSERT statement with this hash');
});

// You can also use this to generate hashes for testing