const createAutoComplete=(
    {
        root,
        label,
        renderOption,
        onOptionSelect,
        setInputValueOnOptionSelect,
        fetchData
    })=>{

    // const root=document.querySelector('.autocomplete');
    root.innerHTML=`
        <label ><b>Search For A ${label}</b></label>
        <input type="text" class="input" >
        <div class="dropdown">
        
        <div class="dropdown-menu">
        <div class="dropdown-content results">
            
        </div>

        </div>
        </div>
    `;

    const searchInput=root.querySelector('input');
    const dropdown=root.querySelector('.dropdown');
    const resultsWrapper=root.querySelector('.results');

    const onInput= async(e)=>{
        const items=await fetchData(e.target.value);
        console.log(items);
        dropdown.classList.add('is-active');
        if(items.length===0){
            resultsWrapper.innerHTML=`No  ${label} Found` ;
        }
        else{
                resultsWrapper.innerHTML='';
                for (const item of items) {
                    
                    const option=document.createElement('a');
                    option.classList.add('dropdown-item');
                    
                    option.innerHTML=renderOption(item);
                    option.addEventListener('click',(e)=>{
                        dropdown.classList.remove('is-active');
                        searchInput.value=setInputValueOnOptionSelect(item);
                        onOptionSelect(item);
                    })

                    resultsWrapper.appendChild(option);  
                }
        }
    
    }
    searchInput.addEventListener('input',debounce(onInput,700));

    // for closing the dropdown when user clicks some where else
    document.addEventListener('click',(e)=>{
        if(!root.contains(e.target)){
            dropdown.classList.remove('is-active');
        }
    })


}