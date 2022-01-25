import * as build from "./build.js"

$(document).ready(function(){
    ['Home','Lost','Found','Account','Logistics','main-bar','load','pauseWindow'].map( d => {
        let g = document.createElement("div");
        g.setAttribute("id", d);
        let c = 'holder';
        if(d == 'main-bar')
            c = 'slide';
        g.setAttribute("class", c);
        document.getElementById('build').appendChild(g);
    })

    build.lostContent([1,2,3,4,5,6])

    $(document).on('click','#AccessForm', (e) => {
        e.preventDefault();
        build.ulog(e);
    })
    $(document).on('click','#bb',function(e){
        e.preventDefault();
        const p = $('#getIfno');
        const c = $('#bb');
        if(p.attr('type') == 'text'){
            p.get(0).setAttribute('type','password');
            c.html("<i class='fas fa-eye'></i>");
        }else{
            p.get(0).setAttribute('type','text');
            c.html("<i class='fas fa-eye-slash'></i>");
        }

    });
    $(document).on('click','#document', (e) => {
        e.preventDefault(e);
        $('#pro-file').click();
    });
    $(document).on('click','#NextForm', (e) => {
        e.preventDefault(e);
        build.createAccount();
    });
    $(document).on('click','#show-login', (e) => {
        e.preventDefault(e);
        $('#log-in').css('display','block')
        $('#create-account').css('display','none')
    });
    $(document).on('click','#show-create', (e) => {
        e.preventDefault(e);
        $('#log-in').css('display','none')
        $('#create-account').css('display','block')
    });
    $(document).on('click','#found', (e) => {
        e.preventDefault(e);
        if(!e.currentTarget.attributes[2].value){
            build.pausePage({ 'msg' : 'Please Sign In', 'timer' : false, 'icon' : 2})
            window.assign.location('#Account')
        }else
            build.found([ 'lost', 'lostId', e.currentTarget.attributes[1].value ])
    });
    $(document).on('click','.input', (e) => {
         $('.input').css('borderBottom','1px solid rgba(234,234,234,1)');
    });
    $(document).on('click','#mainDir', function(){
        document.querySelectorAll('#mainDir').forEach( n => {
            n.style.color = "#fff";
        })
         $(this).css('color','#FFC300');
    });
});