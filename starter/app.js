// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(curr) {
            sum += curr.value;
        });

        data.totals[type] = sum;
    };

    var vOrderAsc = function() {
        data.allItems.exp.sort(function(a, b) {
            if (a.value > b.value){
                return 1;
            }
            if (a.value < b.value) {
                return -1;
            }
            return 0;
        });

        data.allItems.inc.sort(function(a, b) {
            if (a.value > b.value){
                return 1;
            }
            if (a.value < b.value) {
                return -1;
            }
            return 0;
        });
    };

    var vOrderDesc = function() {
        data.allItems.exp.sort(function(a, b) {
            if (a.value < b.value){
                return 1;
            }
            if (a.value > b.value) {
                return -1;
            }
            return 0;
        });

        data.allItems.inc.sort(function(a, b) {
            if (a.value < b.value){
                return 1;
            }
            if (a.value > b.value) {
                return -1;
            }
            return 0;
        });
    };

    var dOrderAsc = function() {
        data.allItems.exp.sort(function(a, b) {
            if (a.description > b.description){
                return 1;
            }
            if (a.description < b.description) {
                return -1;
            }
            return 0;
        });

        data.allItems.inc.sort(function(a, b) {
            if (a.description > b.description){
                return 1;
            }
            if (a.description < b.description) {
                return -1;
            }
            return 0;
        });
    };

    var dOrderDesc = function() {
        data.allItems.exp.sort(function(a, b) {
            if (a.description < b.description){
                return 1;
            }
            if (a.description > b.description) {
                return -1;
            }
            return 0;
        });

        data.allItems.inc.sort(function(a, b) {
            if (a.description < b.description){
                return 1;
            }
            if (a.description > b.description) {
                return -1;
            }
            return 0;
        });
    };

    var highestID = function(type) {
        var max, i;
        max = data.allItems[type][0].id;
        for (i = 0; i < data.allItems[type].length; i++) {
            if (data.allItems[type][i].id >  max) {
                max = data.allItems[type][i].id;
            }
        }
        return max;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1

    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID, max;

            // Create new ID - WE GOT A PROBLEM!!!!!!!!!!
            // SOLUTION: GET THE HIGHEST ID VALUE 

            if (data.allItems[type].length > 0) {
                max = highestID(type);
                ID = max + 1;
                //ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // Calculate the percentage of the income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
           var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
           });
           return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        orderBy: function(byWhat) {
            if (byWhat === 'vAsc') {
                vOrderAsc();
            } else if (byWhat === 'vDesc') {
                vOrderDesc();
            } else if (byWhat === 'dAsc') {
                dOrderAsc();
            } else if (byWhat === 'dDesc') {
                dOrderDesc();
            }
            
        },

        getData: function() {
            return {
                incUI: data.allItems.inc,
                expUI: data.allItems.exp
            }
        },

        testing: function() {
            console.log(data);
        }
    };

})();

// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        orderType: '.orderby__type'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
        
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        deleteListItemToOrder: function(data) {
            var i;
            for (i = 0; i < data.incUI.length; i++) {
                var el = document.getElementById('inc-' + data.incUI[i].id);
                el.parentNode.removeChild(el);
            }

            for (i = 0; i < data.expUI.length; i++) {
                var el = document.getElementById('exp-' + data.expUI[i].id);
                el.parentNode.removeChild(el);
            }
            
        },

        displayOrderedList: function(data) {
            ////////////// NOW THE GAME BEGINS RSRSRS //////////////
            var i, html, newHtml;
            for (i = 0; i < data.expUI.length; i ++) {
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                newHtml = html.replace('%id%', data.expUI[i].id);
                newHtml = newHtml.replace('%description%', data.expUI[i].description);
                newHtml = newHtml.replace('%value%', formatNumber(data.expUI[i].value, 'exp'));

                document.querySelector('.expenses__list').insertAdjacentHTML('beforeend', newHtml);
            }

            for (i = 0; i < data.incUI.length; i ++) {
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                newHtml = html.replace('%id%', data.incUI[i].id);
                newHtml = newHtml.replace('%description%', data.incUI[i].description);
                newHtml = newHtml.replace('%value%', formatNumber(data.incUI[i].value, 'inc'));

                document.querySelector('.income__list').insertAdjacentHTML('beforeend', newHtml);
            }
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var now, year, month, months;
            now = new Date();

            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + 
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        clearFields: function() {
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();

        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMstrings();

    var setupEventListeners = function() {
        //var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

        document.querySelector(DOM.orderType).addEventListener('change', ctrlOrder);

    };
    
    var updateBudget = function() {
        var budget;
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        var percentages;
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        // 2. Read percentages from the budget controller
        percentages = budgetCtrl.getPercentages();
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function() {
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget control
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            // 4. Clear the fields
            UICtrl.clearFields();
            // 5. Calculate and update budget
            updateBudget();
            // 6. Calculate and update the percentages
            //updatePercentages();
        }

        // 7. Order the array
       ctrlOrder();
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, ID, type;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            // 3. Update and show the new budget
            updateBudget();
            // 4. Calculate and update the percentages
            updatePercentages();
        }
    };

   var ctrlOrder = function() {
        var bw, data;
        bw = document.querySelector(DOM.orderType).value;
        data = budgetCtrl.getData();
        budgetCtrl.orderBy(bw);
        UICtrl.deleteListItemToOrder(data);
        UICtrl.displayOrderedList(data);
        updatePercentages();
    };

    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();

