var faqs = document.querySelectorAll('.faq img');
let isRotated = false;

for (var i = 0; i < faqs.length; i++) {
    faqs[i].addEventListener('click', function() {
        
        // Close all other faqs
        for (var j = 0; j < faqs.length; j++) {
            if (faqs[j] !== this && faqs[j].nextElementSibling.style.display === 'block') {
                faqs[j].nextElementSibling.style.display = 'none';
                faqs[j].style.transform = "rotate(0deg)";
               }
        }
       
        // Toggle the display of the clicked faq
        this.nextElementSibling.style.display = (this.nextElementSibling.style.display == 'block') ? 'none' : 'block';
        this.style.transform = "rotate(180deg)";
        if(this.nextElementSibling.style.display == 'none'){
            this.style.transform = "rotate(0deg)";
        }
        
    });
}
//scroll efect
const sections = document.querySelectorAll('.s-effect');
const leftParagraphs = document.querySelectorAll('.effect-l');
const rightParagraphs = document.querySelectorAll('.effect-r'); // added a new const for right paragraphs

const windowHeight = window.innerHeight;

function checkScrollArea(array, className) { // combined the two scroll functions into one and added new parameters
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const rect = element.getBoundingClientRect();
        const distance = windowHeight - rect.top;
        if (distance >= 0 && distance <= windowHeight) {
            element.classList.add(className);
        }
    }
}

window.addEventListener('scroll', function() { 
    checkScrollArea(sections, 'shown'); // changed to one function call
    checkScrollArea(leftParagraphs, 'shown'); // changed to one function call
    checkScrollArea(rightParagraphs, 'shown'); // added the right paragraphs to the function call
});

checkScrollArea(sections, 'shown');
checkScrollArea(leftParagraphs, 'shown');
checkScrollArea(rightParagraphs, 'shown');
