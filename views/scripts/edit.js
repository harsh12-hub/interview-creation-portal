const list_A = document.getElementById('list_A')
const list_B = document.getElementById('list_B')
const submit = document.querySelector('.submit')
const errors = document.getElementById('errors')

list_A.addEventListener('click', e=> {
        let sel = list_A.selectedIndex
        list_B.add(list_A.options[sel])
})

list_B.addEventListener('click', e=> {
    let sel = list_B.selectedIndex
    list_A.add(list_B.options[sel])
})

submit.addEventListener('click', async e=>{
    e.preventDefault()
    new_list = list_A.options
    fin_list = []
    for (let i = 0; i<new_list.length; i++){
        fin_list.push(new_list[i].value)
    }
    var response
    if (new_list.length<2){
        errors.innerHTML="Must have atleast 2 participants in interview!"
    }
    else{
        temp = window.location.href.split('/')
        // console.log(new_list)
        await fetch(`http://localhost:3000/interview/${temp[temp.length-1]}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                students: fin_list
            }
        }).then(res => response = res)

        console.log(response.body)
    }
})