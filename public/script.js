const API_URL = "http://localhost:3000";
let selectedSeat = null;

async function loadSeats() {

    try {
         const response = await fetch(`/seats`);
         const seats = await response.json();
         displaySeats(seats);

    } catch (error) {

        showMessage(
            "Unable to connect to the server.",
            "error"
        );

    }
}


function displaySeats(seats) {

    const seatMap = document.getElementById("seatMap");

    seatMap.innerHTML = "";

    let availableSeats = 0;


    seats.forEach(seat => {

        const seatElement = document.createElement("div");

        seatElement.classList.add(
            "seat",
            seat.status
        );

        if (seat.status === "available") {

            availableSeats++;

        }

        seatElement.innerHTML = `
            <div class="seat-number">
                ${seat.seatNumber}
            </div>

            <div class="seat-status">
                ${seat.status}
            </div>
        `;

        if (seat.status === "available") {

            seatElement.addEventListener(
                "click",
                () => selectSeat(seat.seatNumber)
            );

        }


        seatMap.appendChild(seatElement);

    });

    const waitlistButton =
        document.getElementById("waitlistButton");


    if (availableSeats === 0) {

        waitlistButton.style.display = "inline-block";

    } else {

        waitlistButton.style.display = "none";

    }

}

function selectSeat(seatNumber) {

    selectedSeat = seatNumber;

    document
        .querySelectorAll(".seat")
        .forEach(seat => {

            seat.classList.remove("selected");

        });

    document
        .querySelectorAll(".seat")
        .forEach(seat => {

            const number =
                Number(
                    seat.querySelector(".seat-number").textContent
                );


            if (number === seatNumber) {

                seat.classList.add("selected");

            }

        });


    showMessage(
        `Seat ${seatNumber} selected.`,
        "success"
    );

}

document
    .getElementById("holdButton")
    .addEventListener("click", async () => {

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        if (!email) {

            showMessage(
                "Please enter your email address.",
                "error"
            );

            return;

        }


        if (!selectedSeat) {

            showMessage(
                "Please select an available seat.",
                "error"
            );

            return;

        }


        try {

            const response = await fetch(
                `${API_URL}/hold-seat`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        seatNumber: selectedSeat
                    })
                }
            );


            const data = await response.json();

            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Unable to hold seat.",
                    "error"
                );


                loadSeats();

                return;

            }

            showMessage(
                `
                Seat ${data.seatNumber} has been held.

                <div class="hold-code">
                    ${data.holdCode}
                </div>

                <p>
                    Save this hold code.
                </p>
                `,
                "success"
            );


            selectedSeat = null;


            loadSeats();


        } catch (error) {

            showMessage(
                "Unable to connect to the server.",
                "error"
            );

        }

    });


document
    .getElementById("waitlistButton")
    .addEventListener("click", () => {

        const email =
            document
                .getElementById("email")
                .value
                .trim();


        if (!email) {

            showMessage(
                "Please enter your email address.",
                "error"
            );

            return;

        }


        showMessage(
            `You have requested to join the waitlist using ${email}.`,
            "success"
        );

    });

function showMessage(text, type) {

    const message =
        document.getElementById("message");


    message.innerHTML = text;


    message.className =
        `message ${type}`;


    message.style.display = "block";

}


setInterval(() => {

    loadSeats();

}, 3000);

loadSeats();
