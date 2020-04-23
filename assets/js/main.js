$(document).ready(function(){
    
    // ----------------- effetti grafici di mouse over e mouse leave ----------------
    $('#container-films').on('mouseenter', '.container-locandina',function(){
        $(this).children('.container-cover-locandina').hide();
        $(this).children('.container-info-locandina').fadeIn();

    }) 
    $('#container-films').on('mouseleave', '.container-locandina',function(){
        $(this).children('.container-cover-locandina').fadeIn();
        $(this).children('.container-info-locandina').hide();
    })
    // ------------------------------------------------------------------------------
    
    
    //al click del tasto Trova
    $('#find').on('click', function(){
        var ricerca = $('#search').val(); // catturo valore scritto nell'input
        $('#container-films').html(''); // svuoto l'html
        // controllo se l'utente seleziona la ricerca su tutto, film o serie tv
        if($('#tipologia').val() == "all"){ // se cerca tutto
            cerca("film", ricerca); // avvio funzione di ricerca per film
            cerca("serie", ricerca); // avvio funzione di ricerca per serie
        }else{
            cerca($('#tipologia').val(), ricerca); // avvio funzione di ricerca in base a ciò che ha scelto
        }

    }); //on.click di #find
    
    //alla pressione del tasto invio dentro la casella di ricerca
    $('#search').keypress(function (e) {
        var key = e.which;
        if(key == 13){
            var ricerca = $('#search').val(); // catturo valore scritto nell'input
            $('#container-films').html(''); // svuoto l'html
            // controllo se l'utente seleziona la ricerca su tutto, film o serie tv
            if($('#tipologia').val() == "all"){ // se cerca tutto
                cerca("film", ricerca); // avvio funzione di ricerca per film
                cerca("serie", ricerca); // avvio funzione di ricerca per serie
            }else{
                cerca($('#tipologia').val(), ricerca); // avvio funzione di ricerca in base a ciò che ha scelto
            }
        }
    });

    // ---------------------------------------------------------------
    // --------------------------- FUNZIONI --------------------------
    // --------------------------------------------------------------- 
    
    // Questa funzione cerca un film o una serieTv. Bisogna specificare se si cerca SerieTv o film e il titolo di ciò che si vuole cercare.
    function cerca(filmOserie, query){
        var urlInserito;
        
        if(filmOserie == 'film'){
            urlInserito = 'https://api.themoviedb.org/3/search/movie?';
        }else if (filmOserie == 'serie'){
            urlInserito = 'https://api.themoviedb.org/3/search/tv?';
        }
        // chiamata ajax per interrogare sito TheMovieDb
        $.ajax({
            url: urlInserito,
            method: "GET",
            data: {
                api_key: "3947dc4eaa205fcbba3061dfa648e63c",
                query: query,
            },  
            success: function(data){
                // ciclo ogni risultato della query
                for (var i = 0; i < data.results.length; i++) {
                    var titolo, titoloOrig;
                    if(filmOserie == 'film'){ // controllo se ho cercato tra film o serieTv
                        titolo = data.results[i].title; // e gli assegno i rispettivi valori alle var
                        titoloOrig = data.results[i].original_title; // e gli assegno i rispettivi valori alle var
                    }else if (filmOserie == 'serie'){ // controllo se ho cercato tra film o serieTv
                        titolo = data.results[i].name;// e gli assegno i rispettivi valori alle var
                        titoloOrig = data.results[i].original_name; // e gli assegno i rispettivi valori alle var
                    }

                    // converto i voti da 1 a 10 --> da 1 a 5
                    var voto = Math.ceil((data.results[i].vote_average) / 2);  
                    // descrizione del film o telefilm
                    var overview = data.results[i].overview;
                    overview = overview.substring(0, 200) + "..."; //gli imposto limite caratteri
                    // dò immagine predefinita quando non è trovata sul server
                    var poster = 'assets/img/img-not-found.png';
                    if(data.results[i].poster_path){
                        poster = 'https://image.tmdb.org/t/p/w300' + data.results[i].poster_path;
                    }
                    // valorizzo "lingua" con il valore della lingua prelevato dal risultato della query
                    var lingua = data.results[i].original_language;

                    //uso handlebars per dinamicizzare i risultati in html
                    var source = $("#entry-template").html();
                    var template = Handlebars.compile(source);
                    
                    var context = {
                    titolo: titolo, // titolo varia se è film o serieTV
                    titoloOrig: titoloOrig, // titoloOrig varia se è film o serieTV
                    voto: creaStelle(voto), // richiamo funzione per stampare stelle in base al voto
                    lingua: inserisciBandiera(lingua), // richiamo funzione per stampare bandiere in base al codice restituito dal risultato della query
                    poster: poster, // immagine di copertina dell'oggetto
                    overview: overview // descrizione del film-serieTv
                    };
                    var html = template(context);
                    $('#container-films').append(html); // appendo oggetto all'html                   
                }
            },
        })  
    }
    
    // Funzione che converte un numero da 1 a 5 in stelle. Il numero deve essere passato come argomento
    function creaStelle(punteggio){
        var votoStelle = "";
        for(var i = 0; i < punteggio; i++){ //aggiungo stelline piene tante quanto è il numero
            votoStelle += '<i class="fas fa-star"></i>';
        }
        for(var j = 0; j < (5 - punteggio); j++){ // aggiungo stelline vuote tante quanto la differenza tra il massimo di stelle (5) e il valore passato come argomento della funzione
            votoStelle += '<i class="far fa-star"></i>';
        }
        return votoStelle;
    }

    // Funzione che converte il codice della lingua passato come argomento in bandierina (se esiste in db)
    function inserisciBandiera(valore){
        if (valore === "de" || valore === "en" || valore === "es" || valore === "fr" || valore === "it" || valore === "ja" || valore === "pt" || valore === "zh"){ // controllo se il valore è uguale a uno di quelli in db
          var bandiera = "<img src='assets/img/" + valore + ".png' alt=''>"; //gli specifilo l'url dell'immagine
          return bandiera;
        } else{
          return valore;
        }
      }
})
