const input = document.querySelectorAll('input');
const select = document.querySelectorAll('select')
const edit = document.querySelector('.edit');
const save = document.querySelector('.save');
const interviewlist = document.querySelector('.interview-id');
const form = document.querySelector('#user');

select.forEach(ip => {
    if (ip.id == "participants")
        ip.disabled = true
})

// disable input by default
input.forEach(ip => {
    ip.disabled= true;
});

//enable input
const enableinput = ()=>{
    input.forEach(ip => {
        if(ip.id === 'interview_id'){
            ip.disabled = true;
        }
        else {
            ip.disabled = false;
        }
    }); 
};

// lets the user enter data
edit.addEventListener('click',e=>{
    e.preventDefault();
    edit.classList.add('d-none');
    save.classList.remove('d-none');
    enableinput();
})

//gets data entered by the user
save.addEventListener('click',async e=>{
    e.preventDefault();
    save.classList.add('d-none');
    edit.classList.remove('d-none');
    let changes = []
    input.forEach(ip => {
        ip.disabled=true;
        changes.push(ip.value)
    })
    let finalChanges = JSON.stringify(changes)
    await fetch(`http://localhost:3000/interview/${finalChanges[0]}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                year: parseInt(finalChanges[1].split('-')[0]),
                month: parseInt(finalChanges[1].split('-')[1]),
                day: parseInt(finalChanges[1].split('-')[2]),
                shours: parseInt(finalChanges[2].split(':')[0]),
                sminutes: parseInt(finalChanges[2].split(':')[1]),
                ehours: parseInt(finalChanges[3].split(':')[0]),
                eminutes: parseInt(finalChanges[3].split(':')[1]),
            }
        }).then(res => response = res)
})

// change interview
let options = document.querySelectorAll('option');
interviewlist.addEventListener('click',e=>{
    options.forEach(op=>{
        if(op.selected && op.value.length > 5){
            var index = op.value;
        }
        displayintinfo(index)
    })
})

const displayintinfo = async (index) => {
    if (index == 0 || index == undefined)
        return
    var interview
    await fetch(`http://localhost:3000/interviews/interview/${index}`)
        .then(res => res.json())
        .then(data => interview = data)
    // console.log(interview)
    document.getElementById('interview_id').value = index
    document.getElementById('on_date').value = interview.date
    document.getElementById('starttime').value = interview.start_time
    document.getElementById('endtime').value = interview.end_time
    var participant_list = document.getElementById('participants')

    while (participant_list.options.length>0)
        participant_list.remove(participant_list.length-1)

    for (let i = 0; i<interview.members.length; i++){
        var option = document.createElement("option")
        option.text = `${interview.members[i]._id}: ${interview.members[i].name}`
        participant_list.add(option)
    }
}

let button = document.getElementById('edit_button')
button.addEventListener('click', e=> {
    e.preventDefault()

    if (document.getElementById('interview_id').value!=''){
        const href = 'http://localhost:3000/interviews/edit/' + document.getElementById('interview_id').value

        window.location.replace(href)
    }
})