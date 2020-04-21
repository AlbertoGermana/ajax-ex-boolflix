$(document).ready(function(){
    
    //al click del tasto Trova
    $('#find').on('click', cercaContenuto); //on.click di #find
    
    //alla pressione del tasto invio dentro la casella di ricerca
    $('#search').keypress(function (e) {
        var key = e.which;
        if(key == 13){
            cercaContenuto();
        }
    });  



    // ---------------------------------------------------------------
    // --------------------------- FUNZIONI --------------------------
    // ---------------------------------------------------------------
    function cercaContenuto(){
        // raccolgo il dato inserito nella input-text
        var ricerca = $('#search').val();
        // sostituisco gli spazi con +, cosi da agevolare la ricerca
        ricerca = ricerca.replace(" ","+")
        
        //cancella html dentro il div container
        $('#container-films').html('');
       
        //manda la richiesta
        $.ajax({
            url: "https://api.themoviedb.org/3/search/movie?",
            method: "GET",
            dataType: "json",
            data: {
                api_key: "3947dc4eaa205fcbba3061dfa648e63c",
                query: ricerca,
            },
            success: function (data) {
                for (var i = 0; i < data.results.length; i++) {
                    //uso handlebars per dinamicizzare i risultati in html
                    var source = $("#entry-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                    titolo: data.results[i].title, 
                    titoloOrig: data.results[i].original_title ,
                    voto: data.results[i].vote_average,
                    lingua: data.results[i].original_language
                    };
                    var html = template(context);
                    $('#container-films').append(html);  
                }
            },
            error: function(richiesta, stato, errori){
                console.log('ERRORE: ', richiesta, stato, errori);
            }
        });
    } 
})
