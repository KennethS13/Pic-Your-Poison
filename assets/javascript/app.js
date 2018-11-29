(document).ready(function($){

    if (sessionStorage.getItem('advertOnce') !== 'true') {
      $('.box').show();
    }else{
      $('.box').hide();
    }
     
    $('#refresh-page').on('click',function(){
    $('.box').hide();
    sessionStorage.setItem('advertOnce','true');
    });
      
    $('#reset-session').on('click',function(){
    $('.box').show();
    sessionStorage.setItem('advertOnce','');
    });
     
    });