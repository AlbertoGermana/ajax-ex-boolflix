/* 
Milestone 5 (Opzionale):
Partendo da un film o da una serie, richiedere all'API quali sono gli attori che fanno parte del cast aggiungendo alla nostra scheda Film / Serie SOLO i primi 5 restituiti dall’API con Nome e Cognome, e i generi associati al film con questo schema: “Genere 1, Genere 2, …”.

*/
$(document).ready(function(){
    $('#filters').hide();
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
    

    // ---------------- dichiarazione variabili globali -----------------------------
    var api_key = "3947dc4eaa205fcbba3061dfa648e63c";
     
    var arrayGeneriFilm = [];//array che contiene id e nome dei generi dei film
    var arrayGeneriSerie = []; //array che contiene id e nome dei generi delle serie
    var arrayId = []; // array che contiene gli id dei risultati

    var objCastFiltrato = [];// array di oggetti che contiene gli attori dei film-serie trovati
    var filmTrovati = [];
    var serieTrovate = [];
    var arrayGeneriFilmSerie = unisciArray(arrayGeneriFilm,arrayGeneriSerie); //array che contiene id e nome dei generi di tutti
    // ------------------------------------------------------------------------------

    // ------------------------ richiamo funzioni -----------------------------------
    /* popolaLingua(); */ // richiamo funzione che popola l'array "arrayLingue"
    popolaGeneriSerie(); // richiamo funzione che popola l'array "arrayGeneriSerie"
    popolaGeneriFilm(); // richiamo funzione che popola l'array "arrayGeneriFilm"
    // ------------------------------------------------------------------------------

    $('#container-logo').on('click', function(){
        console.log('film trovati: '+ filmTrovati.length);
        console.log('serie trovate' + serieTrovate.length);
    })

    // ------------------------ gestisco eventi -------------------------------------

    //al click del tasto Trova
    $('#find').on('click', function(){
        arrayId = [];
        popolaFiltroGeneri();
        var ricerca = $('#search').val(); // catturo valore scritto nell'input
        $('#container-films').html(''); // svuoto l'html
        // controllo se l'utente seleziona la ricerca su tutto, film o serie tv
        if($('#tipologia').val() == "all"){ // se cerca tutto
            cercaFilm(ricerca); // avvio funzione di ricerca per film
            cercaSerie(ricerca); // avvio funzione di ricerca per serie
        }else if($('#tipologia').val() == "film"){
            cercaFilm(ricerca); // avvio funzione di ricerca per film
        }else{
            cercaSerie(ricerca); // avvio funzione di ricerca per serie
        }
        //azzero la notifica di quante serie o film sono stati trovati
        $('#filmFound').html('');
        $('#serieFound').html('');
        
    }); //on.click di #find

    //alla pressione del tasto invio dentro la casella di ricerca
    $('#search').keypress(function (e) {
        var key = e.which;
        if(key == 13){
            arrayId = [];
            popolaFiltroGeneri();
            var ricerca = $('#search').val(); // catturo valore scritto nell'input
            $('#container-films').html(''); // svuoto l'html
            // controllo se l'utente seleziona la ricerca su tutto, film o serie tv
            if($('#tipologia').val() == "all"){ // se cerca tutto
                cercaFilm(ricerca); // avvio funzione di ricerca per film
                cercaSerie(ricerca); // avvio funzione di ricerca per serie
            }else if($('#tipologia').val() == "film"){
                cercaFilm(ricerca); // avvio funzione di ricerca per film
            }else{
                cercaSerie(ricerca); // avvio funzione di ricerca per serie
            }
        //azzero la notifica di quante serie o film sono stati trovati
        $('#filmFound').html('');
        $('#serieFound').html('');
        }

    });
        
    //alla selezione del genere:
    $('#select_generi').on('change', function(){
        //salvo il valore selezionato
       var selezionato = $('#select_generi').val();
       //per ogni elemento (film o serie)
        $('#container-films').each(function(){
            //se il valore selezionato è "all"
            if(selezionato == "all"){
                //mostra tutte le locandine
                $(".container-locandina").show();
            }else{
                //altrimenti per ogni locandina 
                $(".container-locandina").each(function(){
                    //controlla se ha la classe uguale al valore salvato
                    if($(this).hasClass(selezionato)){
                        $(this).show(); //se si mostrale
                    }else{
                        $(this).hide(); //se no nascondile
                    }
                })
            }
       })   
    })


    //uso handlebars per dinamicizzare i risultati in html
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);
  
    



    // ---------------------------------------------------------------
    // --------------------------- FUNZIONI --------------------------
    // --------------------------------------------------------------- 
     
    
    // ---------------- FUNZIONE CERCA SERIE ----------------------
    // Questa funzione cerca una serieTv.
    function cercaSerie(query){
        // chiamata ajax per interrogare sito TheMovieDb
        serieTrovate = [];
        $.ajax({
            url: 'https://api.themoviedb.org/3/search/tv?',
            method: "GET",
            data: {
                api_key: api_key,
                query: query
            },  
            success: function(data){
                var oggetto = data.results;
                // ciclo ogni risultato della query
                for (var i = 0; i < oggetto.length; i++) {
                    //inserisco l'id del risultato dentro l'array 
                    arrayId.push(oggetto[i].id);
                    // converto i voti da 1 a 10 --> da 1 a 5
                    var voto = Math.ceil((oggetto[i].vote_average) / 2);  
                   
                    // dò immagine predefinita quando non è trovata sul server
                    var poster = 'assets/img/img-not-found.png';
                    if(oggetto[i].poster_path){
                        poster = 'https://image.tmdb.org/t/p/w300' + oggetto[i].poster_path;
                    }

                    // descrizione del film o telefilm
                    var overview = oggetto[i].overview;
                    overview = overview.substring(0, 200) + "..."; //gli imposto limite caratteri

                    //variabile che racoglie il codice id dei generi di quel film-serie
                    var generi = convertiGeneri(oggetto[i].genre_ids, arrayGeneriFilmSerie);//richiamo funzione che converte i codici dei generi e restituisce parole             
                    var context = {
                    titolo: oggetto[i].name, // titolo varia se è film o serieTV
                    titoloOrig: oggetto[i].original_name, // titoloOrig varia se è film o serieTV
                    voto: creaStelle(voto), // richiamo funzione per stampare stelle in base al voto
                    lingua: inserisciBandiera(oggetto[i].original_language), // richiamo funzione per stampare bandiere in base al codice restituito dal risultato della query
                    genere: generi,
                    datageneri: generiPerDataAttribute(generi),
                    idElemento: oggetto[i].id,
                    poster: poster, // immagine di copertina dell'oggetto
                    overview: overview // descrizione del film-serieTv
                    };
                    // appendo oggetto all'html    
                    $('#container-films').append(template(context)); 
                    
                    //popolo array con gli id delle serie trovate
                    serieTrovate.push(oggetto[i].id)    
                }  

                //stampo in html il numero di risultati 
                $('#serieFound').append('Serie trovate: ' + serieTrovate.length);

                // per ogni id degli elementi salvati nell'array, avvio funzione cosi da restituire gli attori e salvarli nelle variabili (vedi dentro la funzione)
                for (var i = 0; i < arrayId.length; i++) {
                    castFilmSerie(arrayId[i], "serie");
                };
                
                
      
            },
            error: function(){}
        })  
    }
    
// ---------------- FUNZIONE CERCA FILM ----------------------
    // Questa funzione cerca un film o una serieTv. Bisogna specificare se si cerca SerieTv o film e il titolo di ciò che si vuole cercare.
    function cercaFilm(query){
        // chiamata ajax per interrogare sito TheMovieDb
        filmTrovati = [];
        $.ajax({
            url: 'https://api.themoviedb.org/3/search/movie?',
            method: "GET",
            data: {
                api_key: api_key,
                query: query
            },  
            success: function(data){
                var oggetto = data.results;
                // ciclo ogni risultato della query
                for (var i = 0; i < oggetto.length; i++) {
                    //inserisco l'id del risultato dentro l'array 
                    arrayId.push(oggetto[i].id);
                    // converto i voti da 1 a 10 --> da 1 a 5
                    var voto = Math.ceil((oggetto[i].vote_average) / 2);  
                   
                    // dò immagine predefinita quando non è trovata sul server
                    var poster = 'assets/img/img-not-found.png';
                    if(oggetto[i].poster_path){
                        poster = 'https://image.tmdb.org/t/p/w300' + oggetto[i].poster_path;
                    }

                    // descrizione del film o telefilm
                    var overview = oggetto[i].overview;
                    overview = overview.substring(0, 200) + "..."; //gli imposto limite caratteri

                    //variabile che racoglie il codice id dei generi di quel film-serie
                    var generi = convertiGeneri(oggetto[i].genre_ids, arrayGeneriFilmSerie);//richiamo funzione che converte i codici dei generi e restituisce parole             
                    var context = {
                    titolo: oggetto[i].title, // titolo varia se è film o serieTV
                    titoloOrig: oggetto[i].original_title, // titoloOrig varia se è film o serieTV
                    voto: creaStelle(voto), // richiamo funzione per stampare stelle in base al voto
                    lingua: inserisciBandiera(oggetto[i].original_language), // richiamo funzione per stampare bandiere in base al codice restituito dal risultato della query
                    genere: generi,
                    datageneri: generiPerDataAttribute(generi),
                    idElemento: oggetto[i].id,
                    poster: poster, // immagine di copertina dell'oggetto
                    overview: overview // descrizione del film-serieTv
                    };
                    // appendo oggetto all'html    
                    $('#container-films').append(template(context)); 
                    
                    //popolo array con gli id dei film trovati
                    filmTrovati.push(oggetto[i].id)
                    
                    
                }  
                //stampo in html il numero di risultati 
                $('#filmFound').append('Film trovati: ' + filmTrovati.length);
                
                // per ogni id degli elementi salvati nell'array, avvio funzione cosi da restituire gli attori e salvarli nelle variabili (vedi dentro la funzione)
                for (var i = 0; i < arrayId.length; i++) {
                    castFilmSerie(arrayId[i], "film");
                };
                
            },
            error: function(){}
        })  
    }

    // ---------------- FUNZIONE CONVERTI VOTO IN STELLE ----------------------
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


    // ---------------- FUNZIONE LINGUA BANDIERE ----------------------
    // Funzione che converte il codice della lingua passato come argomento in bandierina (se esiste in db)
    function inserisciBandiera(valore){
        if (valore === "de" || valore === "en" || valore === "es" || valore === "fr" || valore === "it" || valore === "ja" || valore === "pt" || valore === "zh"){ // controllo se il valore è uguale a uno di quelli in db
          var bandiera = "<img src='assets/img/" + valore + ".png' alt=''>"; //gli specifilo l'url dell'immagine
          return bandiera;
        } else{
          return valore;
        }
    }




    
    // ---------------- FUNZIONE POPOLA ARRAY GENERI SERIE ----------------------
    function popolaGeneriSerie(){
        $.ajax({
            url: 'https://api.themoviedb.org/3/genre/tv/list',
            method: "GET",
            data: {
                api_key: api_key
            },  
            success: function(data){
                // ciclo ogni risultato della query
                for (var i = 0; i < data.genres.length; i++) {
                    arrayGeneriSerie.push({
                        'id': data.genres[i].id,
                        'name': data.genres[i].name
                    })
                }
            },
            error: function(req, err){
                console.log("errore", err);
            } 
        })  
    }
    
    // ---------------- FUNZIONE POPOLA ARRAY GENERI FILM ----------------------
    function popolaGeneriFilm(){
        $.ajax({
            url: 'https://api.themoviedb.org/3/genre/movie/list',
            method: "GET",
            data: {
                api_key: api_key
            },  
            success: function(data){
                // ciclo ogni risultato della query
                for (var i = 0; i < data.genres.length; i++) {
                    arrayGeneriFilm.push({
                        'id': data.genres[i].id,
                        'name': data.genres[i].name
                    })
                }
            },
            error: function(req, err){
                console.log("errore", err);
            } 
        })  
    }
    
    // ---------------- FUNZIONE UNISCE ARRAY GENERI SERIE ----------------------
    // funzione che unisce due array e toglie doppioni
    function unisciArray(arrayUno, arrayDue) {  
        for (var i = 0; i < arrayDue.length; i++){
            for (var j = 0; j < arrayUno.length; j++){
                if(!arrayDue[i]==arrayUno[j]){
                    arrayUno.push(arrayDue[i]);
                }
            }
        }
        return arrayUno;
    }
    
    
    // ---------------- FUNZIONE CONVERTI CODICI GENERI IN PAROLE  ----------------------
    // funzione che converte i codici dei generi in genere a lettere
    function convertiGeneri(arrayDaConvertire, arrayCodiciParole){
        var generi = "";
        for (var i = 0; i < arrayDaConvertire.length; i++) {
            for(var j = 0; j < arrayCodiciParole.length; j++){
                if(arrayDaConvertire[i] == arrayCodiciParole[j].id){
                    generi += arrayCodiciParole[j].name + ", ";
                }
            }
        }
        generi = generi.slice(0, generi.length - 2); // cancello l'ultima virgola
        return generi
    }
    
    // ---------------- FUNZIONE GENERI PER CLASSE HTML  ----------------------
    //funzione che prende la stringa dei generi separati con la "," ed elimina la ",". Così da poterla aggiungere al data-attribute
    function generiPerDataAttribute(stringaGeneri){
        stringaGeneri = stringaGeneri.replace(",", ""); // cancello l'ultima virgola
        return stringaGeneri
    }


    // ---------------- FUNZIONE SALVA 5 ATTORI ----------------------
    //funzione che prende id film-serie prelevato da html e lo utilizza per risalire al cast
    function castFilmSerie(idFilmSerie, tipo){
        var attori = []; //array dove verranno inseriti gli attori
        if (tipo === "film"){
            tipo = 'movie';
        }else if(tipo === "serie"){
            tipo = 'tv';
        }
        $.ajax({
            url: 'https://api.themoviedb.org/3/'+ tipo + '/' + idFilmSerie + '/credits',
            method: "GET",
            data: {
                api_key: api_key,
            },  
            success: function(data){
                // ciclo ogni risultato della query
                var maxCast = 5; // massimo di attori
                var stringaAttori = "";
                for (var i = 0; i < data.cast.length; i++) {
                    if(i == maxCast){ //se i arriva al maxCast
                        i = data.cast.length; // cambia i al max dell'array
                    }else{
                        attori.push(data.cast[i].name); // aggiungo all'array
                        stringaAttori += data.cast[i].name + ", " //aggiungo alla stringa
                    }
                }
                stringaAttori = stringaAttori.slice(0, stringaAttori.length - 2);
                objCastFiltrato.push(
                    {
                        'id': idFilmSerie,
                        'actors': stringaAttori
                    });
                },
                error: function(req, err){
                    console.log("errore", err);
                } 
        }) 
    }
    
    function popolaFiltroGeneri(){
        //popolo il filtro dei generi
        $('#filters').fadeIn(); //mostro la select
        $('#select_generi').append('<option value="all">--- all ---</option>') //gli appendo subito la categoria "all"
        for(var i = 0; i < arrayGeneriFilmSerie.length; i++){
            //creo gli elementi della select prelevandoli dall'array
            $('#select_generi').append(
                '<option value="' + arrayGeneriFilmSerie[i].name + '">' + arrayGeneriFilmSerie[i].name + '</option>'
            )
        }
    };


})    



/* 
todo:
aggiungere data-attr per  e generi
tramite select filtrare i data-attribute

popolare l'oggetto contenente id e attori
per ogni elemento in html avente quell'ID dai con handlebars quegli attori

- controllo se si fa una ricerca vuota

*/