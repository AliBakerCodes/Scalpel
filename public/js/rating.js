function changeNumber(){
    var elements= document.querySelectorAll('.rating_bar');
    
    for(i=0; elements.length; i++){
    var rating=elements[i].innerHTML;
    
    if(rating==1){
        elements[i].innerHTML="⭐☆☆☆☆"
    }else if(rating==2){
        elements[i].innerHTML="⭐⭐☆☆☆"
    }else if (rating==3){
        elements[i].innerHTML="⭐⭐⭐☆☆"
    } else if(rating==4){
        elements[i].innerHTML="⭐⭐⭐⭐☆"
    } else {
        elements[i].innerHTML="⭐⭐⭐⭐⭐"
    }
    };
  
}
changeNumber();

