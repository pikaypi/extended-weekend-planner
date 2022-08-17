$('#current-date')[0].textContent = moment().format('MMMM D, yy');
var holidayList = $('#holidays-container');
var color = 1;


function addHoliday(startDate, endDate, holidayName) {
    holidayList.append('<div class="pl-1 bg-green-' + color + '00">' + startDate + '</div>');
    holidayList.append('<div class="pl-1 bg-green-' + color + '00">' + endDate + '</div>');
    holidayList.append('<div class="pl-1 bg-green-' + color + '00 col-span-2">' + holidayName + '</div>');
    if (color === 1) {
        color++
    } else {
        color--
    }
};



addHoliday('9/3/22', '9/5/22', 'Labor Day');
addHoliday('10/10/22', '10/12/22', 'Columbus Day');
addHoliday('11/10/22', '11/12/22', `Veterans' Day`);
addHoliday('11/25/22', '11/28/22', 'Thanskgiving')