
const ServerData = new(function(){})() // New class
function getKey(object,value){ //Get Array keys
    return Object.keys(object).find(key => object[key] == value);
}
async function bindAuth(extra){
    let { method, body, header, link, data } = extra
    let pop = { method }
    if(method == "POST")
        pop.body = JSON.stringify(body)
    if(header)
        pop.headers = { 'Content-type': 'application/json; charset=UTF-8' }

    try {
        const response = await fetch( link, pop );
        if(data == 'json')
            return await response.json();
        if(data == 'text')
            return await response.text();

    } catch (error) {
        console.error(error);
    }
}
const createGraph = (graph_data) => {

    let dateValue = graph_data.map( b => b.date );
    let countValue = graph_data.map( b => Number(b.count) );
    var barColors = [ "red", "green", "blue", "orange", "brown" ];
    new Chart('graph', {
        type : "bar",
        data : {
            labels : dateValue,
            datasets : [{
              backgroundColor : barColors,
              data : countValue
            }]
        },
        options : {
            responsive : true,
            title : {
                display : true,
                text : "Number Found To Dates",
                fontSize :20
            },

            tooltips : {
                    mode : 'index',
                    intersect: true
            },
            animation : {
                animateScale : true,
                animateRotate : true
            }
        }
    });
}

export const pausePage = function(c){
    let { msg, timer, icon } = c
    let a = msg.split('.').map( p =>  `<h3>${ p }</h3>` )
    const img = ['./Images/undraunu7k.svg','./Images/undraw_transfer_money_rywa.svg','./undraw/undraw_Playful_cat_re_bxiu.svg']
    let r = img[icon]
    $('#pauseWindow').css('display','block')
    const p = `<div id = 'pauseWindowInfo'>
                    <img src = '${ r }' class = 'load-pause' >
                    ${ a.join('.') }
                    <button id = 'nowGo'>
                        OK
                    </button>
                </div>`
    document.getElementById('pauseWindow').innerHTML = p
    if(timer){
        setTimeout(
            function(){
                $('#pauseWindow').css('display','none')
            },
             4000
        );
    }
}

export const found = async(e) => {
    let found = await bindAuth({ 'method' : 'POST', 'link' : `http://localhost/lost/php/index.php`, 'header' : true, 'body' : { 'update_found' : true, 'table' : e[0], 'id' : e[1], 'index' : e[2] }, 'data' : 'json' })
    if(found){
        build.pausePage({ 'msg' : 'Item Updated', 'timer' : true, 'icon' : 2})
        lostContent([2,3])
    }
}

export const createAccount = async(e) => {
    const f_name = $('#Get_fname').val();
    const l_name = $('#Get_lname').val();
    const password = $('#Get_password').val();
    const r_password = $('#Get_r_password').val();
    const telephone = $('#Get_telephone').val();
    const email = $('#Get_email').val();
    const img = document.getElementById('pro-file').files[0]

    if(!f_name || !l_name || !telephone || !email || !password || !r_password){
        if(!telephone) $('#Get_telephone').css('borderBottom','2px solid red');
        if(!email) $('#Get_email').css('borderBottom','2px solid red');
        if(!password) $('#Get_password').css('borderBottom','2px solid red');
        if(!f_name) $('#Get_fname').css('borderBottom','2px solid red');
        if(!l_name) $('#Get_lname').css('borderBottom','2px solid red');
        if(!password) $('#Get_password').css('borderBottom','2px solid red');
        if(!r_password) $('#Get_r_password').css('borderBottom','2px solid red');
    }else{
        const frmD = new formData();
        frmD.append('create',true)
        frmD.append('name',`${ f_name }, ${l_name}`)
        frmD.append('img',img)
        frmD.append('password',password)
        frmD.append('telephone',telephone)
        frmD.append('email',email)

        let create = await bindAuth({ 'method' : 'POST', 'link' : `http://localhost/lost/php/index.php`, 'header' : true, 'body' : frmD, 'data' : 'json' })
        $('#feedback').append(create.feedback)
        if(create.success)
            setTimeout(
                function(){
                    $('#create-account').css('display','none')
                    $('#log-in').css('display','block')
                },2000
            )
    }
}
export const ulog = async(e) => {
    const telephone = $('#GetTel').val();
    const password = $('#getIfno').val();
    if(!password || !telephone){
        if(!telephone) $('#GetTel').css('borderBottom','2px solid red');
        if(!password) $('#getIfno').css('borderBottom','2px solid red');
    }else{
        let logIn = await bindAuth({ 'method' : 'POST', 'link' : `http://localhost/lost/php/index.php`, 'header' : true, 'body' : { 'login' : true, 'email' : telephone, 'password' : password }, 'data' : 'json' })
        $('#feedback').append(logIn.feedback)
        if(logIn.identity)
            setTimeout(
                function(){
                    lostContent([4])
                },2000
            )

    }
}

export const lostContent = async(no_panel) => {
    //Check whether the user is logged on
    let build = await bindAuth({ 'method' : 'POST', 'link' : `http://localhost/lost/php/index.php`, 'header' : true, 'body' : { 'open' : true }, 'data' : 'json' })

    let account = (!build.user) ? 'Sign In' : 'Account';

    //Build : main bar
    if(no_panel.includes(6)){
        let bodyContent = `
            <a href = '#Home' id = 'mainDir' >
                <span id = 'cons'><i class='fas fa-home'></i></span>
                <p>Home</p>
            </a>
            <a href = '#Lost' id = 'mainDir'>
                <span id = 'cons'><i class='fas fa-clipboard-list'></i></span>
                <p>Lost Items</p>
            </a>
            <a href = '#Found' id = 'mainDir'>
                <span id = 'cons'><i class='fas fa-clipboard-list'></i></span>
                <p>Found Items</p>
            </a>
            <a href = '#Account' id = 'mainDir'>
                <span id = 'cons'><i class='fas fa-user'></i></span>
                <p>${ account }</p>
            </a>
            <a href = '#Logistics' id = 'mainDir'>
                <span id = 'cons'><i class='fas fa-chart-area'></i></span>
                <p>Stats</p>
            </a>`
        $('#main-bar').html(bodyContent)
    }
    //Build : Home Page
    if(no_panel.includes(1)){

        let bodyContent = `
            <div class="Navigation">
                <a href = "#about" class = 'bin'>
                    #About Us
                </a>
                <a href = "#contact" class = 'bin'>
                    #Contact
                </a>
            </div>
            <div class = 'welcome-header'>
                <img id = 'movie' src="https://static.turbosquid.com/Preview/2015/12/04__09_15_20/10.png958d83ad-e07c-44f3-b6a4-75474c61d180DefaultHQ.jpg" data-large="https://static.turbosquid.com/Preview/2015/12/04__09_15_20/10.png958d83ad-e07c-44f3-b6a4-75474c61d180Large.jpg" data-default="https://static.turbosquid.com/Preview/2015/12/04__09_15_20/10.png958d83ad-e07c-44f3-b6a4-75474c61d180DefaultHQ.jpg" data-zoom="https://static.turbosquid.com/Preview/2015/12/04__09_15_20/10.png958d83ad-e07c-44f3-b6a4-75474c61d180Zoom.jpg" alt="droid 3d 3ds" data-description="" data-turntable="0" data-zoomheight="1200" data-zoomwidth="1200" data-mview="false" data-blendstartcolor="" data-blendendcolor="">
                <h1>Welcome To Benedicta Lost and Found</h1>
            </div>
            <div class = 'main-header'>
                <img src = './Images/undraw_lost_online_re_upmy.svg' class = 'avatar-undraw'>
                <h2>You have lost valuables? <span>Tell us! Sorted!</span></h2>
                <h4>We reunite people with their lost credentials, motor vehicles, and even their lost relatives. Tell us when you lose your valuables. Chances are, we can help.</h4>
            </div>
            <div class = 'main-header'>
                <img src = './Images/undraw_lost_re_xqjt.svg' class = 'avatar-undraw-c'>
                <h2>Found a lost item? <span>Tells us! Sorted!</span></h2>
                <h4>We store lost items and have a robust system of identifying their owners. We reunite lost and found items with their owners. Either bring lost and found items to the centre nearest to you, or tell us and we will collect it from you.</h4>
            </div>
            <div class = "container-fluid">
                <div id = 'info'>
                    <h3>Lost and Found Centre. <br><span> We save  you time & money. </span> We eliminate the sting of stress</h3>
                </div>
                <section>
                    <div class="single-feature">
                        <i class="icon-safebox"></i>
                        <h3>Fast &amp; Easy</h3>
                        <p>Do you have a mobile phone? If so, all you need to send us an SMS and we will reply immediately telling you whether we have your item or not.
                        We could also courier your item to you at a small fee, which you pay via MPESA! See, we make it easy for you, no stress!</p>
                    </div>
                    <div class="single-feature">
                        <i class="icon-bitcoin"></i>
                        <h3>No strings attached</h3>
                        <p>Create an account on our web application or download our mobile app and get interacting with us.
                            You can report lost items using the apps, and you can use the apps to search our records.</p>
                    </div>
                    <div class = "single-feature">
                        <i class="icon-exchange"></i>
                        <h3>We got your back</h3>
                        <p>We are a nationalwide organisation, so, we are where you are. Request a delivery to your door and you can consider it done.
                        Again, it's all hassle free.</p>
                    </div>
                    <div class = "single-feature">
                        <i class="icon-wallet"></i>
                        <h3>100% Secure</h3>
                        <p>We use top notch data protection mechanisms are sure to verify everything using our tried and tested methods. This is how we are able to reunite lost and found items to their rightful owners.</p>
                    </div>
                </section>
            </div>
            <div class = "cryptos-about-area">
                <div>
                        <h1>Let’s change <br><span>our country</span> together</h1>
                        <h3>Replacing a lost document is a lengthy process. It costs time and money, and stressfull to say the least. Relevant government dockets waste time and valuable resources replacing documents, storing lost vehicles and persons. Recovery, replacement, is far from a pleasant experience. We are changing all that with technology. </h3>
                        <h3>There is a level of integrity required on everyone to make this a success. If you find a lost document, call us, email us, etc to collect it, or bring it to us. We will do the rest. If you have lost a document, or a commodity such as a car, check with us. We might just have it. Let us be our borther's and sister's keeper. Change begins with you and me! </h3>
                </div>
            </div>
            <div class="section-heading">
                <h3 class="mb-4">Our progress in a nutshell</h3>
                <iframe width = "420" height = "315"
                        src="https://lostandfounddc.co.ke/videos/lfdc.mp4">
                </iframe>
            </div>
            <div id = "about">
                <div class="single-step d-flex">
                    <div class="quantity"><h2>01</h2></div>
                    <div class="step-content">
                        <h3>Create Account</h3>
                        <p>Create an account. All you need is your email address and a (Safaricom) mobile phone number. Having an account enables you to interact with us digitally.</p>
                    </div>
                </div>
                <div class="single-step d-flex">
                    <div class="quantity"><h2>02</h2></div>
                    <div class="step-content">
                        <h3>Report a lost item</h3>
                        <p>Sign in, and provide as much detail as possible about your lost item.</p>
                    </div>
                </div>
                <div class="single-step d-flex">
                    <div class="quantity"><h2>03</h2></div>
                    <div class="step-content">
                        <h3>Request Delivery</h3>
                        <p>Have you found your item in our custody? Simply send message to us, pay a small fee, and we will deliver it to you.</p>
                    </div>
                </div>
            </div>
            <div id = 'contact'>
                <div class="section-heading">
                    <h3>Get <span>in touch</span><br>with us</h3>
                    <p>We are here to help. Either email us, call us, or come speak to us.</p>
                </div>
                <p>Please feel free to contact us. We will get back to you within 24 hours.</p>
                <section>
                    <div class="contact-social-info d-flex mt-50 mb-50">
                        <a href="#"><i class="fa fa-pinterest" aria-hidden="true"></i></a>
                        <a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                        <a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                        <a href="#"><i class="fa fa-dribbble" aria-hidden="true"></i></a>
                        <a href="#"><i class="fa fa-behance" aria-hidden="true"></i></a>
                        <a href="#"><i class="fa fa-linkedin" aria-hidden="true"></i></a>
                    </div>
                    <div class="single-contact-info d-flex">
                        <div class="contact-icon mr-15">
                            <i class="fa fa-map"></i>
                        </div>
                        <p>Baraka Plaza, Second Floor Room 1, Nakuru, Kenya</p>
                    </div>
                    <div class="single-contact-info d-flex">
                        <div class="contact-icon mr-15">
                            <i class="fa fa-phone"></i>
                        </div>
                        <p>Main: 0722839808 or 0722165012 <br> Out of Hours: 0722165012</p>
                    </div>
                    <div class="single-contact-info d-flex">
                        <div class="contact-icon mr-15">
                            <i class="fa fa-envelope-o"></i>
                        </div>
                        <p>info@lostandfounddc.co.ke, lawkarani8@gmail.com</p>
                    </div>
                </section>
                <section>
                    <form action="#" method="post">
                        <input type="text" class="form-control" id="name" placeholder="Name">
                        <input type="email" class="form-control" id="email" placeholder="E-mail">
                        <textarea name="message" class="form-control" id="message" cols="30" rows="10" placeholder="Message"></textarea>
                        <button class="btn cryptos-btn btn-2 mt-30" type="submit">Contact Us</button>
                    </form>
                </section>
            </div>
        `
        $('#Home').html(bodyContent)
    }
    // Build : lost Items
    if(no_panel.includes(2)){
        //Check whether the user is logged on
        let lost_data = await bindAuth({ 'method' : 'POST', 'link' : `http://localhost/lost/php/index.php`, 'header' : true, 'body' : { 'lost' : true }, 'data' : 'json' })
        let post_items = lost_data.data.map( l => {
            let bodyContent = `
                <div id = 'contain-lost'>
                    <img src = '${ l.image }'>
                    <div>
                        <p>Item</p>
                        ${ l.item }
                    </div>
                    <div>
                        ${ l.description.split('.').map( i => `<h4> ${ i } </h4>`).join('.') }
                    </div>
                    <div>
                        <p><i class="fa fa-map"></i> ${ l.area } </p>
                    </div>
                    <div>
                        <p><i class="fa fa-phone"></i> ${ l.telephone } </p>
                    </div>
                    <button id = 'found' i = '${ l.index }' u = '${ lost_data.user }'>
                        Found
                    </button>
                </div>
            `
            return bodyContent
        })
        console.log(post_items)
        $('#Lost').html("<div id = 'title'><h3>Items users have lost posted here.</h3></div>")
        $('#Lost').append(post_items.join(','))

    }
    // Build : found Items
    if(no_panel.includes(3)){
        //Check whether the user is logged on
        let found_data = await bindAuth({ 'method' : 'POST', 'link' : `http://localhost/lost/php/index.php`, 'header' : true, 'body' : { 'found' : true }, 'data' : 'json' })

        let post_items = found_data.map( l => {
            let bodyContent = `
                <div id = 'contain-lost'>
                    <img src = '${ l.image }'>
                    <div>
                        <p>Item</p>
                        ${ l.item }
                    </div>
                    <div>
                        ${ l.description.split('.').map( i => `<h4> ${ i } </h4>`).join('.') }
                    </div>
                    <div>
                        <p><i class="fa fa-calender"></i> Found on ${ l.date } </p>
                    </div>
                    <div>
                        <p><i class="fa fa-phone"></i> ${ l.telephone } </p>
                    </div>
                    <button id = 'found' i = ${ l.index }>
                        Collect
                    </button>
                </div>
            `
            return bodyContent
        })
        $('#Found').html("<div id = 'title'><h3>Look at items found by other users here.</h3></div>")
        $('#Found').append(post_items.join(','))
    }
    if(no_panel.includes(5)){
        let graph_data = await bindAuth({ 'method' : 'POST', 'link' : `http://localhost/lost/php/index.php`, 'header' : true, 'body' : { 'graph' : true }, 'data' : 'json' })

        let pin = `<canvas id = "graph" style = "width:50%;max-width:500px" >
            </canvas>
            <div id = 'string-data'>
                <h2>Items found</h2>
                <div>`;
                pin += graph_data.map( g => g.img.map( (i,k) => `<img src= '${ i }'><h3>${ g.item[k] }</h3>${ g.description[k].split('.').map( r => `<h3>${ r }</h3>`).join('') }`) ).join('')
        pin += `</div>
            </div>`
        $('#Logistics').html(pin)
        createGraph(graph_data)
    }
    // Build : Account
    if(no_panel.includes(4)){
        let tab_string = ''
        if(!build.user){
            tab_string += `<div id = 'log-in'>
                                <img class = 'avatar-undraw' src = 'https://ukoapp.co.ke/public/undraw/undraw_access_account_99n5.svg'>
                                <div id = 'feedback'></div>
                                <form accept-charset=utf-8>
                                    <span class='title'>LogIn Here</span><br>
                                    <div id = 'input-div'>
                                        <div class='i'>
                                            <i class='fas fa-user'></i>
                                        </div>
                                        <input reset = '#GetTel' type='telephone' placeholder = 'Enter Telephone or Email' id = 'GetTel' class = 'input' required />
                                    </div>
                                    <div id = 'input-div'>
                                       <div class = 'i'>
                                            <i class = 'fas fa-lock'></i>
                                       </div>
                                       <input type = 'password' placeholder = 'Enter Password' class = 'input' id = 'getIfno' required />
                                       <button type = 'button' id = 'bb' class = 'b-form' name = 'bb' ><i class = 'fas fa-eye'></i></button>
                                    </div>
                                    <button type = 'submit' name = 'AccessForm'  id = 'AccessForm' class = 'sendIfno'>Login</button>
                                    <button id = 'show-create' class = 'add-info'>Create Account</button>
                                </form>
                                </div>
                            <div id = 'create-account'>
                            <img class = 'avatar-undraw' src = 'https://ukoapp.co.ke/public/undraw/undraw_upload_image_iwej.svg'>
                            <form accept-charset = utf-8 id = 'personal'>
                            <p class = 'title'>Create Account</p><br>
                            <div id='input-div'>
                                <input type='text' placeholder = 'First Name' id='Get_fname' class = 'input' required />
                                <input type='text' placeholder = 'Last Name' id='Get_lname' class = 'input' required />
                                <input type='telephone' placeholder = 'Telephone' id='Get_telephone' class = 'input' required />
                                <input type='email' placeholder = 'Email' id='Get_email' class = 'input' required />
                                <input type='password' placeholder = 'Password' id='Get_password' class = 'input' required />
                                <input type='password' placeholder = 'Repeat Password' id='Get_r_password' class = 'input' required />
                                <p>upload profile image</p>
                                    <button id='document' class = 'pdf'>
                                        <i class = 'fas fa-copy'></i>
                                        Upload
                                    </button>
                                <input type = 'file' id='pro-file'>
                                <button type='submit' name='NextForm'  id='NextForm' class='sendIfno'>Create Account</button>
                                <button id = 'show-login' class = 'add-info'>SignIn</button>
                            </div>
                            </form>
                            </div>`;
        }
        $('#Account').html(tab_string)
    }
    const movie = ["https://static.turbosquid.com/Preview/2015/12/04__09_15_20/10.png958d83ad-e07c-44f3-b6a4-75474c61d180DefaultHQ.jpg",'https://static.turbosquid.com/Preview/2015/12/04__09_15_20/01.png443deee2-751e-48d7-9d68-cea07b5a4063DefaultHQ.jpg','https://static.turbosquid.com/Preview/2015/12/04__09_15_20/02.pngbb2906cb-6f09-4a9f-a0fe-8223ff4585d9DefaultHQ.jpg','https://static.turbosquid.com/Preview/2015/12/04__09_15_20/03.pnga37b65b2-d87b-47f1-8483-413391f508bbDefaultHQ.jpg','https://static.turbosquid.com/Preview/2015/12/04__09_15_20/04.png4e824815-9bcc-4302-a59b-a6be3322a4d8DefaultHQ.jpg','https://static.turbosquid.com/Preview/2015/12/04__09_15_20/07.pngc04e8c94-9b4a-4de0-9105-62350de058d4DefaultHQ.jpg','https://static.turbosquid.com/Preview/2015/12/04__09_15_20/08.png5014476c-e70b-4949-945c-7b6c8ee23007DefaultHQ.jpg','https://static.turbosquid.com/Preview/2015/12/04__09_15_20/09.pngdc415f1a-ee7b-4e74-aa33-2782f4429b67DefaultHQ.jpg']
    let k = 0;
    setInterval(
        function(){
            document.querySelector('#movie').src = movie[k]
            k++
            if(k == 8)
                k = 0
        },500
    )
}