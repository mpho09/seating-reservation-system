const express = require('express');
const app = express();

const TOTAL_SEATS = 20;
const CHARACTERS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz23456789';
const CODE_LENGTH = 6;

function generateCode(){
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
        code += CHARACTERS[randomIndex];
    }
    return code;
}

