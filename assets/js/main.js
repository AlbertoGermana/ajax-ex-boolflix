$(document).ready(function(){
    
    // ------------------------------------------------------------------------------
    // ----------------- effetti grafici di mouse over e mouse leave ----------------
    // ------------------------------------------------------------------------------
    $('#container-films').on('mouseenter', '.container-locandina',function(){
        $(this).children('.container-cover-locandina').hide();
        $(this).children('.container-info-locandina').fadeIn();

    }) 
     $('#container-films').on('mouseleave', '.container-locandina',function(){
        $(this).children('.container-cover-locandina').fadeIn();
        $(this).children('.container-info-locandina').hide();
    })
    // ------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------
    
    
    // oggetto che contiene per ogni key il codice lingua e per ogni valore il link corrispondente
    var bandiere = {
        de: 'assets/img/de.png',
        en: 'assets/img/en.png',
        es: 'assets/img/es.png',
        it: 'assets/img/it.png',
        fr: 'assets/img/fr.png',
        ja: 'assets/img/ja.png',
        pt: 'assets/img/pt.png',
        zh: 'assets/img/zh.png'
    }
    
    //al click del tasto Trova
    $('#find').on('click', function(){
        cercaFilm();
        cercaTeleFilm();
    }); //on.click di #find
    
    //alla pressione del tasto invio dentro la casella di ricerca
    $('#search').keypress(function (e) {
        var key = e.which;
        if(key == 13){
            cercaFilm();
            cercaTeleFilm();
        }
    });

    // ---------------------------------------------------------------
    // --------------------------- FUNZIONI --------------------------
    // ---------------------------------------------------------------
    function cercaFilm(){
        // raccolgo il dato inserito nella input-text
        var ricerca = $('#search').val();
        
        //cancella html dentro il div container
        $('#container-films').html('');
       
        //manda la richiesta
        $.ajax({
            url: "https://api.themoviedb.org/3/search/movie?",
            method: "GET",
            data: {
                api_key: "3947dc4eaa205fcbba3061dfa648e63c",
                query: ricerca,
            },
            success: function (data) {
                for (var i = 0; i < data.results.length; i++) {
                    // converto i vota da 1 a 10 --> da 1 a 5
                    var filmTrovato = data.results[i];
                    var voto = Math.ceil((filmTrovato.vote_average) / 2);  
                    

                    // do immagine predefinita quando non è trovata sul server
                    var poster = 'assets/img/img-not-found.png';
                    // se il path viene trovato allora lo concateno all'endpoint dell'url
                    if(filmTrovato.poster_path){
                        poster = 'https://image.tmdb.org/t/p/w300' + filmTrovato.poster_path;
                    }

                    //uso handlebars per dinamicizzare i risultati in html
                    var source = $("#entry-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                    titolo: data.results[i].title, 
                    titoloOrig: data.results[i].original_title ,
                    voto: creaStelle(voto),
                    /* lingua: lingua, */
                    lingua: inserisciBandiera(bandiere, filmTrovato.original_language),
                    poster: poster
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
    function cercaTeleFilm(){
        // raccolgo il dato inserito nella input-text
        var ricerca = $('#search').val();
        
        //cancella html dentro il div container
        $('#container-films').html('');
       
        //manda la richiesta
        $.ajax({
            url: "https://api.themoviedb.org/3/search/tv?",
            method: "GET",
            data: {
                api_key: "3947dc4eaa205fcbba3061dfa648e63c",
                query: ricerca,
            },
            success: function (data) {
                //ciclo ogni risultato
                for (var i = 0; i < data.results.length; i++) {
                    var serieTvTrovata = data.results[i];
                    // converto i vota da 1 a 10 --> da 1 a 5
                    var voto = Math.ceil((serieTvTrovata.vote_average) / 2);  
                    
                    // se il path viene trovato allora lo concateno all'endpoint dell'url
                    var poster = 'assets/img/img-not-found.png';
                    if(serieTvTrovata.poster_path){
                        poster = 'https://image.tmdb.org/t/p/w300' + serieTvTrovata.poster_path;
                    }

                    //uso handlebars per dinamicizzare i risultati in html
                    var source = $("#entry-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                    titolo: serieTvTrovata.name, 
                    titoloOrig: serieTvTrovata.original_name ,
                    voto: creaStelle(voto),
                    /* lingua: lingua, */
                    lingua: inserisciBandiera(bandiere, serieTvTrovata.original_language),
                    poster: poster
                    };
                    var html = template(context);
                    $('#container-films').append(html);  
                    
                
                }//fine ciclo di ogni risultato
            },//fine "success"
            error: function(richiesta, stato, errori){
                console.log('ERRORE: ', richiesta, stato, errori);
            }
        });
    }
    function creaStelle(punteggio){
        var votoStelle = "";
        for(var i = 0; i < punteggio; i++){
            votoStelle += '<i class="fas fa-star"></i>';
        }
        for(var j = 0; j < (5 - punteggio); j++){
            votoStelle += '<i class="far fa-star"></i>';
        }
        return votoStelle;
    }

    function inserisciBandiera(oggetto, sorgente){
        var isFlagged, flagPath;
            for (key in oggetto){
                console.log(oggetto);
                console.log(key);
                console.log(sorgente);
                if(sorgente == [key]){
                    isFlagged = true;
                    flagPath = oggetto[key];
                }
            }
            if(isFlagged){
                return '<img src="' + flagPath + '">';
            }else{
                return sorgente;
            }
    }
})
