$(document).ready(function(){
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
    var poster = 'assets/img/img-not-found.png';
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
    $('#container-films').on('mouseenter', '.container-locandina',function(){
        $(this).children('.container-cover-locandina').hide();
        $(this).children('.container-info-locandina').fadeIn();

    }) 
     $('#container-films').on('mouseleave', '.container-locandina',function(){
        $(this).children('.container-cover-locandina').fadeIn();
        $(this).children('.container-info-locandina').hide();

    })

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
            /* dataType: "json", */
            data: {
                api_key: "3947dc4eaa205fcbba3061dfa648e63c",
                query: ricerca,
            },
            success: function (data) {
                for (var i = 0; i < data.results.length; i++) {
                    // converto i vota da 1 a 10 --> da 1 a 5
                    var filmTrovato = data.results[i];
                    var voto = Math.ceil((filmTrovato.vote_average) / 2);  
                   
                    var lingua, isFlagged, flagPath;
                    for (key in bandiere){
                        if(filmTrovato.original_language == key){
                            isFlagged = true;
                            flagPath = bandiere[key];                     
                        }else{
                            lingua = key;
                        }
                    }
                    if(isFlagged){
                        lingua = '<img src="' + flagPath + '">';
                    }
                    
                    if(filmTrovato.poster_path == null){
                    
                    }else{
                        poster = 'https://image.tmdb.org/t/p/w500/' + filmTrovato.poster_path;
                    }

                    //uso handlebars per dinamicizzare i risultati in html
                    var source = $("#entry-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                    titolo: filmTrovato.title, 
                    titoloOrig: filmTrovato.original_title ,
                    voto: creaStelle(voto),
                    lingua: lingua,
                    /* lingua: inserisciBandiera(bandiere, filmTrovato.original_language), */
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
            /* dataType: "json", */
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

                    var lingua, isFlagged, flagPath;
                    for (key in bandiere){
                        if(serieTvTrovata.original_language == key){
                            isFlagged = true;
                            flagPath = bandiere[key];                     
                        }else{
                            lingua = key;
                        }
                    }
                    if(isFlagged){
                        lingua = '<img src="' + flagPath + '">';
                    }

                    if(serieTvTrovata.poster_path == null){
                    
                    }else{
                        poster = 'https://image.tmdb.org/t/p/w500/' + serieTvTrovata.poster_path;
                    }

                    //uso handlebars per dinamicizzare i risultati in html
                    var source = $("#entry-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                    titolo: serieTvTrovata.name, 
                    titoloOrig: serieTvTrovata.original_name ,
                    voto: creaStelle(voto),
                    lingua: lingua,
                    /* lingua: inserisciBandiera(bandiere, serieTvTrovata.original_language), */
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
                }else{
                /*     console.log(oggetto);
                    console.log(key);
                    console.log(isFlagged);
                    console.log(flagPath); */
                    return key;
                }
            }
            if(isFlagged){
                return '<img src="' + flagPath + '">';
            }
    }
})
