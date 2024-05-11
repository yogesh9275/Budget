function saveData() {
    category = []
    var monthValue = document.getElementById("month").value.trim(); // Get the entered month value
    var savingGoals = document.getElementById("saving-goals").value;
    savingGoals = parseInt(savingGoals);
    var startBalance = document.getElementById("start-balance").value;
    startBalance = parseInt(startBalance);
    var endBalance = document.getElementById("end-balance").value;
    endBalance = parseInt(endBalance);
    var summary = document.getElementById("summary").value;

     // Split the value into year and month parts
    var year = monthValue.substring(0, 4);
    var month = monthValue.substring(5, 7);

     // Convert month number to month name
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthName = monthNames[parseInt(month, 10) - 1];

     // Format the output string
    month = monthName + "-" + year;
    console.log(month);
    

    // Extract data from Expense Details table
    var expenseData = [];
    var category = [];
    var expenseRows = document.querySelectorAll(".Expense-Details tr");

    expenseRows.forEach(function(row) {
        var cells = row.querySelectorAll("td");
        if (cells.length > 0) {
            var notes = cells[4].querySelector("textarea[name='notes-list[]']").value.trim(); // Corrected to get notes
            var expense = {
                month: month,
                savings_goals: savingGoals,
                start_balance: startBalance,
                end_balance: endBalance,
                summary: summary,
                category: cells[0].innerText.trim(),
                expected: parseInt(cells[1].querySelector("input[name='expected-wages[]']").value.trim(), 10),
                actual: parseInt(cells[2].querySelector("input[name='actual-wages[]']").value.trim(), 10),
                difference: parseInt(cells[3].querySelector("input[name='difference-wages[]']").value.trim(), 10),
                notes: notes
            };
            category.push(expense.category);
            expenseData.push(expense);
        }
    });

    // Print data to console
    console.log("Monthly Expense Data:");
    console.log(expenseData);
    console.log("Category Data:");
    console.log(category);

    const data = {
        category: category,
        month: month,
        expense: expenseData,
    };

    const csrftoken = getCookie('csrftoken');

    $.ajax({
        url: '/Expense/', // Update with your URL
        type: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log("Expenses data sent successfully.");
            if (response.success == true) {
                console.log("Data is Updated in Expense Database.");
                highlightDifference();

            } else {
                console.log("No Data is Updated in Expense Database.");
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
    
}

//Prompt to perform CRUD operations actions.
function showDatePicker() {
    var datePicker = document.getElementById("datePicker");
    datePicker.style.display = "block";
  }
  
function hideDatePicker() {
    var datePicker = document.getElementById("datePicker");
    datePicker.style.display = "none";
  }
  
function getDate() {
    var selectedDate = document.getElementById("selectedDate").value;
    var selectedcategory = document.getElementById("category-select").value;
    // Split the value into year and month parts
    var year = selectedDate.substring(0, 4);
    var month = selectedDate.substring(5, 7);

    // Convert month number to month name
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthName = monthNames[parseInt(month, 10) - 1];

    // Format the output string
    month = monthName + "-" + year;
    console.log(month);
    console.log(selectedcategory);
    hideDatePicker();



    const data = {
        month: month,
        category : selectedcategory
    };
    console.log(data);
    const csrftoken = getCookie('csrftoken');
    var dataList =[];
    $.ajax({
        url: '/get_expenses/', // Update with your URL
        type: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log("Expenses data sent successfully.");
            console.log(response);
            dataList.push(response.expenses);
            console.log(dataList[0].summary);
            clearHTMLValues();
            fillHTMLWithData(dataList[0]);
            highlightDifference();
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
  }


function getDelete(){
    var selectedDate = document.getElementById("selectedDate").value;
    var selectedcategory = document.getElementById("category-select").value;
    // Split the value into year and month parts
    var year = selectedDate.substring(0, 4);
    var month = selectedDate.substring(5, 7);

    // Convert month number to month name
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthName = monthNames[parseInt(month, 10) - 1];

    // Format the output string
    month = monthName + "-" + year;
    console.log(month);
    console.log(selectedcategory);
    hideDatePicker();


    const data = {
       month: month,
       category : selectedcategory
    };
    console.log(data);
    const csrftoken = getCookie('csrftoken');
    $.ajax({
        url: '/delete_expense/', // Update with your URL
        type: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log("Data to Delete sent successfully.");
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}


  function convertDate(dateString) {
     // Split the date string into month and year
     const [monthName, year] = dateString.split('-');

     // Convert month name to a numeric value
     const month = new Date(Date.parse(monthName + " 1, " + year)).getMonth() + 1;
 
     // Format the month and year
     const formattedMonth = month.toString().padStart(2, '0');
     const formattedYear = year.padStart(4, '0');
 
     // Return the formatted date
     return formattedYear + '-' + formattedMonth;
}
//clear HTML DATA
function clearHTMLValues() {
    document.getElementById('month').value = "";
    document.getElementById('start-balance').value = "";
    document.getElementById('end-balance').value = "";
    document.getElementById('saving-goals').value = "";
    document.getElementById('summary').value = "";
    
    for (var index = 1; index <= 10; index++) {
        document.getElementById("expected-" + index).value = "";
        document.getElementById("actual-" + index).value = "";
        document.getElementById("difference-" + index).value = "";
        document.getElementById("notes-" + index).value = "";
    }
}

function highlightDifference() {
    // Get the total number of difference input elements
    var totalDifferences = 10; // Assuming there are 10 difference input elements

    // Iterate over each difference input element
    for (var index = 1; index <= totalDifferences; index++) {
        // Get the difference input element by its ID
        // Get the element
        var differenceElement = document.getElementById("difference-" + index);

        // Get the value and convert it to a number
        var value = parseFloat(differenceElement.value);

        // Check if the value is a valid number and not NaN, and it's not 0
        if (!isNaN(value) && value !== 0) {
            // Add the positive or negative class based on the value
            if (value > 0) {
                differenceElement.classList.add("positive");
            } else {
                differenceElement.classList.add("negative");
            }
        }

    }
}

// Call the function to highlight the differences
//highlightDifference();


function fillHTMLWithData(dataList) {
    var monthElement = document.getElementById('month');
    var startBalanceElement = document.getElementById('start-balance');
    var endBalanceElement = document.getElementById('end-balance');
    var savingsGoalsElement = document.getElementById('saving-goals');
    var summaryElement = document.getElementById('summary');
    
    var categories = ['Wages', 'Other Income', 'Rent/Mortgage', 'Groceries', 'Restaurants', 'Insurance', 'Utilities', 'Gas', 'Entertainment', 'Loans'];
    
    categories.forEach(function(category, index) {
        var categoryData = dataList.find(function(data) {
            return data.category === category;
        });

        if (categoryData) {
            var expectedElement = document.getElementById("expected-" + (index + 1));
            var actualElement = document.getElementById("actual-" + (index + 1));
            var differenceElement = document.getElementById("difference-" + (index + 1));
            var notesElement = document.getElementById("notes-" + (index + 1));

            if (expectedElement && actualElement && differenceElement && notesElement) {
                var date = convertDate(categoryData.month);
                monthElement.value = date;
                expectedElement.value = categoryData.expected;
                actualElement.value = categoryData.actual;
                differenceElement.value = categoryData.difference;
                notesElement.value = categoryData.notes;
                savingsGoalsElement.value = categoryData.savings_goals;
                startBalanceElement.value = categoryData.start_balance;
                endBalanceElement.value = categoryData.end_balance;
                summaryElement.value = categoryData.summary;
            } else {
                console.log("HTML elements not found for category: " + category);
            }
        } else {
            console.log("Data not found for category: " + category);
        }
    });
}


// Example data (list of dictionaries)
// var dataList = [
//     { category: 'Category 1', expected: 100, actual: 90, difference: 10, notes: 'Note 1' },
//     { category: 'Category 2', expected: 200, actual: 180, difference: 20, notes: 'Note 2' },
//     { category: 'Category 3', expected: 300, actual: 270, difference: 30, notes: 'Note 3' }
// ];

// Call the function to fill HTML components with data
// fillHTMLWithData(dataList);

// Function to get CSRF token from cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

