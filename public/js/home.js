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
const windowHeight = window.innerHeight;

function checkScroll() {
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const rect = section.getBoundingClientRect();
    const distance = windowHeight - rect.top;

    if (distance >= 0 && distance <= windowHeight) {
      section.classList.add('shown');
    }
  }
}

window.addEventListener('scroll', checkScroll);
checkScroll();

