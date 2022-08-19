var geoInfo;
var holidays = [];
var weekends = [];
var holidayList = $('#holidays-container');
var color = 1;

var testButton = document.getElementsByClassName('redirect')

var calendar
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',

    });
    calendar.render();
});


// A function that takes in 3 strings, and displays them in the table
function addHoliday(startDate, endDate, holidayName) {
    if (startDate != undefined) {
        holidayList.append('<div class="pl-1 bg-green-' + color + '00">' + startDate + '</div>');
        holidayList.append('<div class="pl-1 bg-green-' + color + '00">' + endDate + '</div>');
        holidayList.append('<div data-startDate="' + startDate + '" class="pl-1 bg-green-' + color + '00 col-span-2 redirect" id="' + holidayName + '">' + holidayName + '</div>');
        
        $(document).ready(function(){
            $('div.redirect').click(function(e){
                calendar.gotoDate(moment(e.target.dataset.startdate, 'M-D-YYYY').format('YYYY-MM-DD'));
            });
          });
            
        // Use the global "color" variable to toggle the row color
        if (color === 1) {
            color++
        } else {
            color--
        }
    }
};

// A function that takes in the list of holidays taken from the APIs
// and populates the holiday table with the appropriate data
function populatePage(apiData) {
    // Populate the local information section
    $('#flag')[0].src = geoInfo.flag
    $('#current-location')[0].textContent = geoInfo.country
    $('#current-sublocation')[0].textContent = geoInfo.city
    $('#current-date')[0].textContent = moment().format('MMMM D, yyyy');

    // Call the function to enter each holiday into the table
    for (var i = 0; i < apiData.length; i++) {
        addHoliday(apiData[i].startDate, apiData[i].endDate, apiData[i].name)
    }
}

// A function that calls all the necessary geographical and holiday related details from the APIs
async function populateVars() {
    // Fetch the geolocation info and store it in an object
    const geoFetch = await fetch('https://ipwho.is/').then(response => response.json());
    geoInfo = {
        'country': geoFetch.country,
        'countryCode': geoFetch.country_code,
        'flag': geoFetch.flag.img,
        'city': geoFetch.city + ', ' + geoFetch.region_code
    }

    // Fetch the list of upcoming holidays and store it in an object
    const holidayFetch = await fetch('https://date.nager.at/api/v3/NextPublicHolidays/' + geoInfo.countryCode).then(response => response.json());
    for (var i = 0; i < holidayFetch.length; i++) {
        holidays.push({
            'name': holidayFetch[i].localName,
            'unixDate': moment(holidayFetch[i].date).format('x')
        })
    }

    // Set the years to search for the start and end dates of extended weekends
    var thisYear = moment().format('yyyy') + '/' + geoInfo.countryCode
    var nextYear = (parseInt(thisYear) + 1) + '/' + geoInfo.countryCode

    // Fetch the extended weekends from the API
    const thisYearFetch = await fetch('https://date.nager.at/api/v3/LongWeekend/' + thisYear).then(response => response.json());
    const nextYearFetch = await fetch('https://date.nager.at/api/v3/LongWeekend/' + nextYear).then(response => response.json());
    
    // Create an array of start and end dates for each extended weekend in the years searched 
    for (var i = 0; i < thisYearFetch.length; i++) {
        weekends.push([moment(thisYearFetch[i].startDate).format('x'), moment(thisYearFetch[i].endDate).format('x')])
    }
    for (var i = 0; i < nextYearFetch.length; i++) {
        weekends.push([moment(nextYearFetch[i].startDate).format('x'), moment(nextYearFetch[i].endDate).format('x')])
    }

    // Iterate through the list of holidays
    for (var i = 0; i < holidays.length; i++) {
        var holidayCheck =  parseInt(holidays[i].unixDate)

        // For each holiday, iterate through all the extended weekends
        for (var j = 0; j < weekends.length; j++) {
            var startCheck = parseInt(weekends[j][0])
            var endCheck = parseInt(weekends[j][1])

            // When the holiday lies within the dates of the extended weekend, 
            // store those dates in that holiday's object
            if (holidayCheck >= startCheck && holidayCheck <= endCheck) {
                holidays[i]['startDate'] = moment(parseInt(weekends[j][0])).format('M/D/yy')
                holidays[i]['endDate'] = moment(parseInt(weekends[j][1])).format('M/D/yy')
            }
        }
    }

    // Use the completed data pull to populate the page
    populatePage(holidays)
}

// Call the function to pull data from the APIs
populateVars()
