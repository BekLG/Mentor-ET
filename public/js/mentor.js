let signINBtn=document.querySelectorAll('.indicator-button');
for(let i=0 ;i<signINBtn.length;i++){
    signINBtn[i].addEventListener('click',function(){
        for(let j=0 ;j < signINBtn.length;j++){
            signINBtn[j].classList.remove('active-btn');
        }
        this.classList.add('active-btn');
    })
}