const express = require('express');
const app = express();
app.use(express.static("public"));
app.use(express.json());

const TOTAL_SEATS = 20;
const CHARACTERS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz23456789';
const CODE_LENGTH = 6;


const seats = new Map();            
const activeHoldCodes = new Map();  

function generateCode() {
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
        code += CHARACTERS[randomIndex];
    }
    return code;
}

function generateUniqueHoldCode() {
    let code;
    do {
        code = generateCode();
    } while (activeHoldCodes.has(code));
    return code;
}

app.post("/hold-seat", (req, res) => {

    const { email, seatNumber } = req.body;

    if (!email || !email.includes("@")) {
        return res.status(400).json({
            success: false,
            message: "Valid email is required"
        });
    }

    const seat = Number(seatNumber);

    if (
        !Number.isInteger(seat) ||
        seat < 1 ||
        seat > TOTAL_SEATS
    ) {
        return res.status(400).json({
            success: false,
            message: `Seat number must be between 1 and ${TOTAL_SEATS}`
        });
    }

    if (seats.has(seat)) {
        return res.status(409).json({
            success: false,
            message: "Seat is not available"
        });
    }

    const holdCode = generateUniqueHoldCode();

    seats.set(seat, {
        status: "held",
        email: email,
        holdCode: holdCode
    });

    activeHoldCodes.set(holdCode, {
        seatNumber: seat,
        email: email
    });

    return res.status(201).json({
        success: true,
        seatNumber: seat,
        holdCode: holdCode
    });
});

app.post("/confirm-seat", (req, res) => {

    const { email, holdCode } = req.body;
    const hold = activeHoldCodes.get(holdCode);

    if (!hold) {
        return res.status(404).json({
            success: false,
            message: "Invalid hold code"
        });
    }

    if (hold.email !== email) {
        return res.status(403).json({
            success: false,
            message: "Hold does not belong to this user"
        });
    }

    const seat = seats.get(hold.seatNumber);

    if (!seat || seat.status !== "held") {
        return res.status(409).json({
            success: false,
            message: "Seat cannot be confirmed"
        });
    }

    seat.status = "confirmed";

    activeHoldCodes.delete(holdCode);

    return res.status(200).json({
        success: true,
        seatNumber: hold.seatNumber,
        status: "confirmed"
    });
});

app.get("/seats", (req, res) => {

    const result = [];

    for (let i = 1; i <= TOTAL_SEATS; i++) {

        const seat = seats.get(i);

        result.push({
            seatNumber: i,
            status: seat ? seat.status : "available"
        });
    }

    res.json(result);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
    console.log(`Total seats: ${TOTAL_SEATS}`);
});