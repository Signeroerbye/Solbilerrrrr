





/* Search button */
const searchBtn = document.getElementById('search_button')

/* Find de to dato felter */
var dateFromField = document.getElementById("date_from");
var dateToField = document.getElementById("date_to");

/* Find det element, som skal indeholde listen af biler */
var carsList = document.getElementById("cars_list");

/* Find den skabelon, vi skal kopiere for hver bil vi vil vise */
var carTemplate = document.getElementById("car_template");

/* Find vores "Søg"-knap */
var searchButton = document.getElementById("search_button");

/* SÆT STARTVÆRDIER --------------------------------------------------------- */

/* Dags dato på formen åååå-mm-dd:
 * https://devdocs.io/javascript/global_objects/date/date
 * https://devdocs.io/javascript/global_objects/date/toisostring
 * https://devdocs.io/javascript/global_objects/string/split
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#referring_to_array_elements
 */
var todaysDate = new Date().toISOString().split("T")[0];

dateFromField.value = todaysDate;
dateToField.value = todaysDate;

/* DEFINÉR FUNKTIONER --------------------------- */

function beregnPeriodeIDage()
{
   var dateFrom = new Date(dateFromField.value);
   var dateTo = new Date(dateToField.value);


   var differenceInMilliseconds = dateTo.getTime() - dateFrom.getTime();

   var millisecondsInADay = 1000 * 60 * 60 * 24;

   /* Vi deler differencen med antal millisekunder på et døgn for at få et antal
    * dage og afrunder med Math.round for at sikre at vi får et helt antal dage:
    * https://devdocs.io/javascript/global_objects/math/round
    *
    * ...og lægger 1 til det beregnede tal for at sikre at perioden er inkl
    * start- og slutdato. Dvs. hvis man henter og afleverer samme dag tæller det
    * som én dag.
    */
   var _lejeperiodeIDage =
      Math.round(differenceInMilliseconds / millisecondsInADay) + 1;

   return _lejeperiodeIDage;
}

function beregnLejeprisen(dailySurcharge = 0, _lejeperiodeIDage)
{
   var baseRentalPrice = 295;
   var dailyRentalPrice = 100;
   var vatRate = 0.25;

   var resultExclVat =
      baseRentalPrice + _lejeperiodeIDage * (dailyRentalPrice + dailySurcharge);
   var resultInclVat = resultExclVat * (1 + vatRate);

   return resultInclVat;
}

/* Pæn formatering af prisen */
function formatPrice(number)
{
   /* Fejlhåndtering — i tilfælde af at noget går galt et sted i beregningen*/
   if (Number.isNaN(number))
   {
      return "Ukendt pris";
   } else
   {
      return number.toLocaleString("da-DK", {
         style: "currency",
         currency: "DKK"
      });
   }
}

function showCar(carObject, _lejeperiodeIDage)
{

   var carNode = carTemplate.content.cloneNode(true);

   var rentalPrice = beregnLejeprisen(
      carObject.dailySurcharge,
      _lejeperiodeIDage
   );

   carNode.querySelector("img").src = carObject.imageSrc;
   carNode.querySelector("img").alt = `Billede af ${carObject.name}`;
   carNode.querySelector("h1").innerText = carObject.name;
   carNode.querySelector(".category").innerText = carObject.category;
   carNode.querySelector(".person_count").innerText = carObject.personCount;
   carNode.querySelector(".luggage_count").innerText = carObject.luggageCount;
   carNode.querySelector(".price").innerText = formatPrice(rentalPrice);

   const url = new URL("extras.html", window.location)
   url.searchParams.append("car", carObject.name);
   url.searchParams.append("days", _lejeperiodeIDage);
   url.searchParams.append("price", rentalPrice);
   const searchBtn = document.getElementById('search_button')

   carNode.querySelector("a").href = url.toString();

   carsList.appendChild(carNode);
}

searchBtn.addEventListener("click", () =>
{
   searchBtn.innerText = 'Scroll ned'

   setTimeout(() =>
   {
      searchBtn.innerText = 'Søg'
   }, 2000)
})

function handleSearch(event)
{

   event.preventDefault();

   carsList.innerHTML = "";

   var requiredPersonCount = document.getElementById("person_count").value;

   var requiredLuggageCount = document.getElementById("luggage_count").value;

   var _lejeperiodeIDage = beregnPeriodeIDage();


   fetch("https://api.jsonbin.io/v3/b/6193a0d70ddbee6f8b0c5901", {
      headers: {
         "X-Master-Key":
            "$2b$10$pcW/97aYBuS2xn7WxaR6juFE.tmkl9bIGIgai5/50Ce39fsKeoMsy",
         "X-Bin-Meta": false,
      },
   })
      .then(function (response)
      {
         return response.json();
      })
      .then(function (cars)
      {


         for (var car of cars)
         {
            if (
               car.personCount >= Number(requiredPersonCount) &&
               car.luggageCount >= Number(requiredLuggageCount)
            )
            {
               showCar(car, _lejeperiodeIDage);
            }
         }
      })
      /* API fejl svar*/
      .catch(function (error)
      {
         carsList.innerHTML = `<p class="error-message">fejl: "${error.message}".</p>`;
      });
}

/* HÅNDTÉRING AF EVENTS --------------------- */

searchButton.addEventListener("click", handleSearch);
