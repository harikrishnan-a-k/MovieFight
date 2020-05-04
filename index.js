//API key:cf73c17a

// storing reusable config object properties ina seperate object to avoid duplication.
const reusableConfigObject={
    label:'Movie',
    renderOption(movie){
        // add static image if movie poster image is N/A
        const imgSrc=movie.Poster==='N/A'?'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkC_LpRc_mUrfxr2K0l5ypSkoOhXA8tK1usXaic8vYbxRCwjCt&usqp=CAU':movie.Poster;


        return `<img src="${imgSrc}">
        <span> ${movie.Title}  (${movie.Year}) </span>
        
        `; 

    },
    
    setInputValueOnOptionSelect(movie){
        return ` ${movie.Title} (${movie.Year})`;
    },
    async fetchData(searchInput){
        const response= await axios.get('https://www.omdbapi.com/',{
            params:{
                apikey:'cf73c17a',
                s:searchInput
            }
        })
        if(response.data.Error){
            return [];
        }
         return response.data.Search;
    }

}

// calling createAutoComplete() to create one instance of auto Complete widget.
createAutoComplete({
    root:document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector('#leftResultDiv'),'left');
    },
    
    ...reusableConfigObject
       
});
createAutoComplete({
    root:document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector('#rightResultDiv'),'right');
        
    },
    ...reusableConfigObject
       
});

// varibales for storing movie data for comparison
let leftMovie;
let rightMovie;

// function to be called when user select a perticular movie from dropdown list.
const onMovieSelect=async (movie,fullResultDiv,side)=>{
    const response= await axios.get('https://www.omdbapi.com/',{
        params:{
            apikey:'cf73c17a',
            i:movie.imdbID
        }
    });
    console.log(response.data);
    fullResultDiv.innerHTML=movieTemplate(response.data);
    if(side==='left'){
        leftMovie=response.data;
    }
    else{
        rightMovie=response.data;
    }

    if(leftMovie&&rightMovie){
        runMovieCompare();
    }
}
const runMovieCompare=()=>{
    console.log('comparing movies');
    const leftStats=document.querySelectorAll('#leftResultDiv .notification');
    const rightStats=document.querySelectorAll('#rightResultDiv .notification');
    leftStats.forEach((leftStat,index)=>{
        const rightStat=rightStats[index];
        const leftStatValue=parseFloat(leftStat.dataset.value);
        const rightStatValue=parseFloat(rightStat.dataset.value);
        if(leftStatValue>rightStatValue){
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
            leftStat.classList.remove('is-warning');
            leftStat.classList.add('is-primary');
        }
        else{
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
            rightStat.classList.remove('is-warning');
            rightStat.classList.add('is-primary');
        }
    });
};

// function that generate movie details HTML
const movieTemplate=(movieDetail)=>{
    // deriving numerical values for comparision
    const dollars=parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
    const metascore=parseInt(movieDetail.Metascore);
    const imdbRating=parseFloat(movieDetail.imdbRating);
    const imdbVotes=parseInt(movieDetail.imdbVotes.replace(/,/g,''));
    const awards=movieDetail.Awards.split(' ').reduce((prev,word)=>{
        let value=parseInt(word);
        if(isNaN(value)){
            return prev;
        }
        else{
            return prev+value;
        }
    },0);

    return `
    <article class="media">
        <figure class="media-left">
        <p class="image">
            <img src="${movieDetail.Poster}" alt="">
        </p>
        </figure>
        <div class="media-content">
        <div class="content">
            <h1 class="has-text-primary">${movieDetail.Title} (${movieDetail.Year})</h1>
            <div ><strong class="has-text-primary">${movieDetail.Genre} </strong></div>
            <div ><strong class="has-text-primary"> Director: ${movieDetail.Director} </strong></div>
            <p class="has-text-info">${movieDetail.Plot}</p>
        </div>
        </div>
    </article>
    <article data-value=${awards} class="notification is-primary awards">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Meta Score</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
}

function resultsHeightAdjust(){
        const mediaLeft=document.querySelector('#leftResultDiv article.media');
        const mediaRight=document.querySelector('#rightResultDiv article.media');
        const mediaLeftHeight=mediaLeft.clientHeight;
        const mediaRightHeight=mediaRight.clientHeight;
        if(mediaLeftHeight>mediaRightHeight){
            mediaRight.style.height=`${mediaLeftHeight}px`;
        }
        else{
            mediaLeft.style.height=`${mediaRightHeight}px`;
        }
        console.log('height adjusted');
}
function resultsAwardsHeightAdjust(){
        const awardLeft=document.querySelector('#leftResultDiv article.awards');
        const awardRight=document.querySelector('#rightResultDiv article.awards');
        const awardLeftHeight=awardLeft.clientHeight;
        const awardRightHeight=awardRight.clientHeight;
        if(awardLeftHeight>awardRightHeight){
            awardRight.style.height=`${awardLeftHeight}px`;
        }
        else{
            awardLeft.style.height=`${awardRightHeight}px`;
        }
        console.log(' award height adjusted');
}

const targetNode = document.getElementById('rightResultDiv');
const targetNode2 = document.getElementById('leftResultDiv');
const config = {childList: true, subtree: true,attributes: true };
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    resultsHeightAdjust();
    resultsAwardsHeightAdjust();

};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
const observer2 = new MutationObserver(callback);
observer2.observe(targetNode2, config);