#!/usr/bin/env node
/**
 * Create Admin Account
 * 
 * Creates the first administrator account for the KOICA DX Center platform.
 * This script can be run to create a new admin user or to promote an existing user to admin.
 */

const User = require('../models/User');
const db = require('../database');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function createAdmin() {
    try {
        console.log('\n🔐 KOICA DX Center - Admin Account Creator\n');
        console.log('This will create a new administrator account.\n');

        // Get admin details
        const email = await question('Admin Email: ');
        const password = await question('Password (min 8 chars): ');
        const fullName = await question('Full Name: ');

        // Validation
        if (!email || !email.includes('@')) {
            console.error('❌ Invalid email address');
            process.exit(1);
        }

        if (!password || password.length < 8) {
            console.error('❌ Password must be at least 8 characters');
            process.exit(1);
        }

        if (!fullName) {
            console.error('❌ Full name is required');
            process.exit(1);
        }

        // Connect to database
        await db.connect();

        // Check if user already exists
        const existing = await User.findByEmail(email);
        if (existing) {
            console.error(`❌ User with email ${email} already exists`);

            const promote = await question('Would you like to promote this user to admin? (yes/no): ');
            if (promote.toLowerCase() === 'yes') {
                await db.run('UPDATE users SET role = ? WHERE email = ?', ['admin', email]);
                console.log('✅ User promoted to admin successfully!');
            }

            await db.close();
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            email,
            password,
            fullName,
            role: 'admin'
        });

        console.log('\n✅ Admin account created successfully!');
        console.log('\nAdmin Details:');
        console.log('  Email:', admin.email);
        console.log('  Name:', admin.full_name);
        console.log('  Role:', admin.role);
        console.log('  ID:', admin.id);

        await db.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error creating admin:', error.message);
        await db.close();
        process.exit(1);
    }
}

// Run
createAdmin();
