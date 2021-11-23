document.getElementById("rental-price").innerText = Number(sessionStorage.getItem("price"))+ Number(sessionStorage.getItem("extras-price"));
document.getElementById("rental-car").innerText = sessionStorage.getItem("rental-car");
document.getElementById("rental-days").innerText = sessionStorage.getItem("days");
document.getElementById("extras-list").innerText = sessionStorage.getItem("extras-list");
document.getElementById("extras-price").innerText = sessionStorage.getItem("extras-price");

