$(document).ready(function(){
    //al click del tasto Trova
    $('#find').on('click', function(){
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
                    console.log('ERRORE: Richiesta', richiesta);
                    console.log('ERRORE: Stato', stato);
                    console.log('ERRORE: Errori', errori);
                    
                }
            });



    
        //stampa i risultati in pagina
    })
   
})
