// Function to add or remove the 'active' and 'highlight' classes for labels based on input focus and content
function handleInputFocusBlur(e) {
    var input = e.target,
        label = input.previousElementSibling;

    if (e.type === 'keyup') {
        if (input.value === '') {
            label.classList.remove('active', 'highlight');
        } else {
            label.classList.add('active', 'highlight');
        }
    } else if (e.type === 'blur') {
        if (input.value === '') {
            label.classList.remove('active', 'highlight');
        } else {
            label.classList.remove('highlight');
        }
    } else if (e.type === 'focus') {
        if (input.value === '') {
            label.classList.remove('highlight');
        } else {
            label.classList.add('highlight');
        }
    }
}

// Add event listeners to input and textarea elements with class 'form'
var formInputs = document.querySelectorAll('.form input, .form textarea');
formInputs.forEach(function (input) {
    input.addEventListener('keyup', handleInputFocusBlur);
    input.addEventListener('blur', handleInputFocusBlur);
    input.addEventListener('focus', handleInputFocusBlur);
});

// Function to handle tab navigation
function handleTabClick(e) {
    e.preventDefault();

    var tab = e.target.parentElement,
        tabs = tab.parentElement.children,
        target = e.target.getAttribute('href').substring(1),
        tabContents = document.querySelectorAll('.tab-content > div');

    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    tab.classList.add('active');

    for (var j = 0; j < tabContents.length; j++) {
        tabContents[j].style.display = 'none';
    }

    document.getElementById(target).style.display = 'block';
}

// Add event listener to tab links
var tabLinks = document.querySelectorAll('.tab a');
tabLinks.forEach(function (link) {
    link.addEventListener('click', handleTabClick);
});
