var faqs = document.querySelectorAll('.faq img');

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
        
    });
}
