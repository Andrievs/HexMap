var currentLayer = 'Main';
var currentX;
var currentY;
var currentFill;
var currentFillHexcode;
var currentDetailName;
var currentDetailPath;
var currentDetailFill;
var currentDetailStrokeColor;
var currentDetailStrokeWidth;
var currentTitle;
var currentAbstract;
var currentInfo;
var currentHyperlink;

// Instantiate api handler
const api = axios.create({
    baseURL: 'http://hexmap-env.hwkrg2e2dp.us-east-2.elasticbeanstalk.com/api',
    timeout: 5000,
});

// Compile Handlebar Templates
var errorTemplate;
var submenuTemplate;
var fillsTemplate;
var detailsTemplate;
var fillsEditTemplate;
var detailsEditTemplate;

window.addEventListener('load', () => { 
    errorTemplate = Handlebars.compile($('#error-template').html());
    submenuTemplate = Handlebars.compile($('#submenu-template').html());
    fillsTemplate = Handlebars.compile($('#fills-template').html());
    detailsTemplate = Handlebars.compile($('#details-template').html());
    fillsEditTemplate = Handlebars.compile($('#fills-edit-template').html());
    detailsEditTemplate = Handlebars.compile($('#details-edit-template').html());
    // Router Declaration
    const router = new Router({
        mode: 'history',
        page404: (path) => {
        const html = errorTemplate({
            color: 'yellow',
            title: 'Error 404 - Page NOT Found!',
            message: `The path '/${path}' does not exist on this site`,
        });
        $('#main').html(html);
        },
    });

    // Display Error Banner
    const showError = (error) => {
        const { title, message } = error.response.data;
        const html = errorTemplate({ color: 'red', title, message });
        $('#main').html(html);
    };
  

    const newHex = async () => {
        if ($('#Hex-edit-form')[0].checkValidity()) {
            currentTitle = document.getElementById("Hex-Title").value;
            currentAbstract = document.getElementById("Hex-Abstract").value;
            currentInfo = document.getElementById("Hex-Info").value;
            currentHyperlink = document.getElementById("Hex-Hyperlink").value;
            currentFill = document.getElementById("Hex-fill-select").value;
            currentDetail = document.getElementById("Hex-detail-select").value;
            console.log('newhex post')
            await api.post('/newhex', {currentX, currentY, currentLayer, currentFill, currentDetail, currentTitle, currentAbstract, currentInfo, currentHyperlink});
            var modal = document.getElementById('HexModal');
            modal.style.display = "none";
            redraw(currentLayer);
            return false;
        }
        return true;
    };

    const newFill = async () => {
        if ($('#Fill-edit-form')[0].checkValidity()) {
            var name = document.getElementById("Fill-edit-select").value;
            const newName = document.getElementById("New-Fill-Name").value;
            const Hexcode =  document.getElementById("Fill-color").value;
            if(name == "New" && newName != "")
            {
                name = newName;
                await api.post('/newfill', {name, Hexcode});
                var modal = document.getElementById('FillModal');
                modal.style.display = "none";
                redraw(currentLayer);
            } else {
                await api.post('/newfill', {name, Hexcode});
                var modal = document.getElementById('FillModal');
                modal.style.display = "none";
                redraw(currentLayer);
            }
            return false;
        }
        return true;
    };

    const newDescription = async () => {
        if ($('#Detail-edit-form')[0].checkValidity()) {
            var name = document.getElementById("Details-edit-select").value;
            const newName = document.getElementById("New-Detail-Name").value;
            const FillColor =  document.getElementById("Detail-Fill-color").value;
            const StrokeColor =  document.getElementById("Detail-Stroke-color").value;
            const StrokeWidth =  document.getElementById("Detail-Stroke-width").value;
            const Path =  document.getElementById("Detail-Path").value;
            if(name == "New" && newName != "")
            {
                name = newName;
                await api.post('/newdetail', {name, FillColor, StrokeColor, StrokeWidth, Path});
                var modal = document.getElementById('DetailModal');
                modal.style.display = "none";
                redraw(currentLayer);
            } else {
                await api.post('/newdetail', {name, FillColor, StrokeColor, StrokeWidth, Path});
                var modal = document.getElementById('DetailModal');
                modal.style.display = "none";
                redraw(currentLayer);
            }
            return false;
        }
        return true;
    };

    router.add('', async () => {
        try {
            const hexes = await api.get('/layer/main');
            const layers = await api.get('/layers');
            const layersData = layers.data;
            const details = await api.get('/details');
            const detailsData = details.data;
            const fills = await api.get('/fills');
            const fillsData = fills.data;
            let submenu = submenuTemplate(layersData);
            let fill = fillsTemplate(fillsData);
            let detail = detailsTemplate(detailsData);
            let fillEdit = fillsEditTemplate(fillsData);
            let detailEdit = detailsEditTemplate(detailsData);
            $('#submenu').html(submenu);
            $('#hex-fill').html(fill);
            $('#hex-detail').html(detail);
            $('#fill-select').html(fillEdit);
            $('#detail-select').html(detailEdit);
            $('#submitDetail').click(newDescription);
            $('#submitFill').click(newFill);
            $('#submitHex').click(newHex);
            drawHexes(hexes);
            addDropdown();
        } catch (error) {
            showError(error);
        } finally {
            $('.loading').removeClass('loading');
        }
    });
    
    // Navigate app to current url
    router.navigateTo(window.location.pathname);
    
    // Highlight Active Menu on Refresh/Page Reload
    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');
    
    /*$('a').on('click', (event) => {
        // Block browser page load
        event.preventDefault();
    
        // Highlight Active Menu on Click
        const target = $(event.target);
        $('.item').removeClass('active');
        target.addClass('active');
    
        // Navigate to clicked url
        const href = target.attr('href');
        const path = href.substr(href.lastIndexOf('/'));
        router.navigateTo(path);
    });*/
});

function preview() {
    var fillColor = document.getElementById("Detail-Fill-color").value;
    var strokeColor = document.getElementById("Detail-Stroke-color").value;
    var strokeWidth = document.getElementById("Detail-Stroke-width").value;
    var path = document.getElementById("Detail-Path").value;

    var DetailPreview = document.getElementById("Detail-preview");
    DetailPreview.setAttribute("d", path)
    DetailPreview.setAttribute("fill", fillColor)
    DetailPreview.setAttribute("stroke", strokeColor)
    DetailPreview.setAttribute("stroke-width", strokeWidth)
}

function drawHexes(hexes){
    const draw = SVG('main');
    const Hex = Honeycomb.extendHex({
        size: 100,
        orientation: 'flat',
        fill: 'transparent',
        fillName: '',
        detail: ``,
        detailName: '',
        detailcolor: 'black',
        detailfill: 'none',
        detailwidth: 1,
        title: '',
        abstract: '',
        info: '',
        hyperlink: '',
        render(draw) {
            const position = this.toPoint()
            const centerPosition = this.center().add(position)
            const corners = this.corners()
            const fontSize = 20
                        
            this.filling = draw
            .polygon(corners.map(({ x, y }) => `${x},${y}`))
            .fill(this.fill)
            .stroke({ width: 3, color: '#000000' })
            .translate(position.x, position.y)

            this.number = draw
            .text(`${this.x},${this.y}`)
            .font({
                size: fontSize,
                anchor: 'middle',
                leading: 1.4,
                fill: '#000000'
            })
            .translate(centerPosition.x, centerPosition.y - fontSize - this.size*0.7)
            
            this.details = draw
            .path(this.detail)
            .fill(this.detailfill)
            .stroke({ color: this.detailcolor, width: this.detailwidth })
            .translate(centerPosition.x, centerPosition.y)
            
            this.glow = draw
            .text(`${this.title}`)
            .stroke({ color: '#FFFFFF', width: 7 })
            .font({
                size: fontSize,
                anchor: 'middle',
                leading: 1.4,
                fill: '#000000',
            })
            .translate(centerPosition.x, centerPosition.y - fontSize + this.size*0.6)
            
            this.titleText = draw
            .text(`${this.title}`)
            .font({
                size: fontSize,
                anchor: 'middle',
                leading: 1.4,
                fill: '#000000',
            })
            .translate(centerPosition.x, centerPosition.y - fontSize + this.size*0.6)
        
        },
        highlight() {
            this.filling
            .stop(true, true)
            .fill({ opacity: 1, color: 'red' })
            .animate(100)
            .fill({ opacity: 1, color: `${this.fill}` })
        },
        clear() {
            this.filling
            .clear();
            this.number
            .clear();
            this.details
            .clear();
            this.glow
            .clear();
            this.titleText
            .clear();
        }
    });

    const HexInv = Honeycomb.extendHex({
        size: 100,
        orientation: 'flat',
        render(draw) {
            const position = this.toPoint()
            const centerPosition = this.center().add(position)
            const corners = this.corners()
            const fontSize = 25
                        
            this.filling = draw
            .polygon(corners.map(({ x, y }) => `${x},${y}`)) 
            .fill('transparent')
            .stroke({ width: 3, color: 'transparent' })
            .translate(position.x, position.y)
        },
        clear() {
            this.filling
            .clear();
        }
    });

    const Grid = Honeycomb.defineGrid(Hex);
    const GridInvis = Honeycomb.defineGrid(HexInv);

    //You can draw a grid in the shape of hexagon/rectangle/triangle/parolelogram
    const girdInv = GridInvis.hexagon({
        radius: 20,
        onCreate(hex) {
            hex.render(draw)
        }
    })
    const grid = Grid();
    hexes.data.forEach(row => {
        grid.push(Hex(row.Xcoord, row.Ycoord, { title: row.Title, fill: row.Hexcode, fillName: row.FillName, detail: row.Path, detailName: row.DetailName, detailcolor: row.Color, detailfill: row.Fill, detailwidth: row.Width, abstract: row.Abstract, info: row.Info, hyperlink: row.Hyperlink }))
    })

    grid.forEach(hex => {
        hex.render(draw)
    })

    // Expose to window namespase for testing purposes
    window.zoomTiger = svgPanZoom('#'+draw.node.id, {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: false,
        center: true,
        minZoom: 0.1,
        maxZoom: 10,
        dblClickZoomEnabled: false,
    });
    
    document.getElementById("main").childNodes[0].childNodes[1].addEventListener('click', ({ offsetX, offsetY }) => {
        var pan = svgPanZoom('#'+draw.node.id).getPan()
        var zoom = svgPanZoom('#'+draw.node.id).getZoom()
        const hexCoordinates = Grid.pointToHex([(offsetX - pan.x)/zoom, (offsetY - pan.y)/zoom])
        const hex = grid.get(hexCoordinates)
        const hexCoordinatesInv = GridInvis.pointToHex([(offsetX - pan.x)/zoom, (offsetY - pan.y)/zoom])
        const hexInv = girdInv.get(hexCoordinatesInv)
    
        if (hex) {
            currentFill = hex.fillName;
            currentFillHexcode = hex.fill;
            currentAbstract = hex.abstract;
            currentTitle = hex.title;
            currentInfo = hex.info;
            currentHyperlink = hex.hyperlink;
            currentX = hex.x;
            currentY = hex.y;
            currentDetailName = hex.detailName;
            currentDetailPath = hex.detail;
            currentDetailFill = hex.detailfill;
            currentDetailStrokeColor = hex.detailcolor;
            currentDetailStrokeWidth = hex.detailwidth;
            hex.highlight()
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginRight = "250px";
            document.getElementById("hex-coord").innerHTML = `#${currentX},${currentY}`;
            document.getElementById("hex-abstract").innerHTML = `${currentAbstract}`;
            document.getElementById("hex-info").innerHTML = `${currentInfo}`;
            document.getElementById("hex-hyperlink").innerHTML = `${currentHyperlink}`;
            document.getElementById("data").style.display = "block";
        } else if (hexInv) {
            currentFill = '';
            currentFillHexcode = '';
            currentAbstract = '';
            currentInfo = '';
            currentHyperlink = '';
            currentDetailName = '';
            currentDetailPath = '';
            currentDetailFill = '';
            currentDetailStrokeColor = '';
            currentDetailStrokeWidth = '';
            currentTitle = '';
            currentX = hexInv.x;
            currentY = hexInv.y;
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginRight = "250px";
            document.getElementById("hex-coord").innerHTML = `#${currentX},${currentY}`;
            document.getElementById("hex-abstract").innerHTML = `${currentAbstract}`;
            document.getElementById("hex-info").innerHTML = `${currentInfo}`;
            document.getElementById("hex-hyperlink").innerHTML = `${currentHyperlink}`;
            document.getElementById("data").style.display = "none";
        }
    });
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}


async function redraw(name){
    currentLayer = name;
    closeNav();
    var myNode = document.getElementById("main");
    myNode.removeChild(myNode.firstChild);
    const hexes = await api.get('/layer/'+name);
    const layers = await api.get('/layers');
    const layersData = layers.data;
    const details = await api.get('/details');
    const detailsData = details.data;
    const fills = await api.get('/fills');
    const fillsData = fills.data;
    let submenu = submenuTemplate(layersData);
    let fill = fillsTemplate(fillsData);
    let detail = detailsTemplate(detailsData);
    let fillEdit = fillsEditTemplate(fillsData);
    $('#submenu').html(submenu);
    $('#hex-fill').html(fill);
    $('#hex-detail').html(detail);
    $('#fill-select').html(fillEdit);
    drawHexes(hexes);
    addDropdown();
}

function change_color(select) {
    var style = select.options[select.selectedIndex].style.cssText;
    select.setAttribute("style", `${style}`)
}

function change_fill_select(select) {
    var style = select.options[select.selectedIndex].style.cssText;
    var color = select.options[select.selectedIndex].attributes[1].value;
    select.setAttribute("style", `${style}`)
    var selected = select.options[select.selectedIndex].value;
    var nameFiled = document.getElementById("hiden-fill-name-field");
    var deleteBtn = document.getElementById("deleteFill");
    document.getElementById("Fill-color").value = color;
    if(selected == "New"){
        nameFiled.style.display = 'block';
        deleteBtn.style.display = 'none';
    }
    else{
        nameFiled.style.display = 'none';
        deleteBtn.style.display = 'inline';
    }
}

function change_detail_select(select) {
    var fill = select.options[select.selectedIndex].attributes[1].value;
    var color = select.options[select.selectedIndex].attributes[2].value;
    var width = select.options[select.selectedIndex].attributes[3].value;
    var path = select.options[select.selectedIndex].attributes[4].value;
    var selected = select.options[select.selectedIndex].value;
    var nameFiled = document.getElementById("hiden-detail-name-field");
    var deleteBtn = document.getElementById("deleteDetail");
    document.getElementById("Detail-Fill-color").value = fill;
    document.getElementById("Detail-Stroke-color").value = color;
    document.getElementById("Detail-Stroke-width").value = width;
    document.getElementById("Detail-Path").value = path;
    var DetailPreview = document.getElementById("Detail-preview");
    DetailPreview.setAttribute("d", path)
    DetailPreview.setAttribute("fill", fill)
    DetailPreview.setAttribute("stroke", color)
    DetailPreview.setAttribute("stroke-width", width)
    if(selected == "New"){
        nameFiled.style.display = 'block';
        deleteBtn.style.display = 'none';
    }
    else{
        nameFiled.style.display = 'none';
        deleteBtn.style.display = 'inline';
    }
}

async function change_detail(select) {
    var name = select.options[select.selectedIndex].textContent;
    const detail = await api.get('/detail/'+name);
    const detailData = detail.data;
    var DetailPreview = document.getElementById("Hex-detail-preview");
    DetailPreview.setAttribute("d", detailData[0].Path)
    DetailPreview.setAttribute("fill", detailData[0].Fill)
    DetailPreview.setAttribute("stroke", detailData[0].Color)
    DetailPreview.setAttribute("stroke-width", detailData[0].Width)
}

function addDropdown(){
    var dropdown = document.getElementById("dropdown-btn");
    var dropdowns = document.getElementById("dropdown-container")
    

    dropdown.addEventListener("click", function() {
        this.classList.toggle("active");
        if (dropdowns.style.display === "block") {
            dropdowns.style.display = "none";
        } else {
            dropdowns.style.display = "block";
        }
    });

    //add modal view interaction
    var modalHex = document.getElementById('HexModal');
    var modalFill = document.getElementById('FillModal');
    var modalDetail = document.getElementById('DetailModal');
    var btn = document.getElementById("hex-edit");
    var fillBtn = document.getElementById("edit-fill-btn");
    var descriptionBtn = document.getElementById("edit-description-btn");
    var spanHex = document.getElementById("hexClose");
    var spanFill = document.getElementById("fillClose");
    var spanDetail = document.getElementById("detailClose");

    btn.onclick = function() {
        document.getElementById("hex-edit-title").innerHTML = 'Edit/Create Hex #' + currentX + ',' + currentY;
        document.getElementById("Hex-Title").value = currentTitle;
        document.getElementById("Hex-Abstract").value = currentAbstract;
        document.getElementById("Hex-Info").value = currentInfo;
        document.getElementById("Hex-Hyperlink").value = currentHyperlink;
        var FillSelector = document.getElementById("Hex-fill-select");
        FillSelector.value = currentFill;
        FillSelector.setAttribute("style", `background-color: ${currentFillHexcode}`)
        document.getElementById("Hex-detail-select").value = currentDetailName;
        var DetailPreview = document.getElementById("Hex-detail-preview");
        DetailPreview.setAttribute("d", currentDetailPath)
        DetailPreview.setAttribute("fill", currentDetailFill)
        DetailPreview.setAttribute("stroke", currentDetailStrokeColor)
        DetailPreview.setAttribute("stroke-width", currentDetailStrokeWidth)
        closeNav();
        modalFill.style.display = "none";
        modalDetail.style.display = "none";
        modalHex.style.display = "block";
    }

    fillBtn.onclick = function() {
        closeNav();
        modalHex.style.display = "none";
        modalDetail.style.display = "none";
        modalFill.style.display = "block";
    }

    descriptionBtn.onclick = function() {
        closeNav();
        modalFill.style.display = "none";
        modalHex.style.display = "none";
        modalDetail.style.display = "block";
    }

    spanHex.onclick = function() {
        modalHex.style.display = "none";
    }

    spanFill.onclick = function() {
        modalFill.style.display = "none";
    }

    spanDetail.onclick = function() {
        modalDetail.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modalHex || event.target == modalFill || event.target == modalDetail) {
            modalHex.style.display = "none";
            modalFill.style.display = "none";
            modalDetail.style.display = "none";
        }
    }
}

async function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;
    await api.post('/login', {id_token});
}

async function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

