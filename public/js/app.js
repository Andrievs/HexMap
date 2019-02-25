var socket = io.connect('http://localhost:3000');
var currentlayer = 'Main';
var currentX;
var currentY;
var currentFill;
var currentFillHexcode;
var currentTagName;
var currentTagPath;
var currentTagFill;
var currentTagStrokeColor;
var currentTagStrokeWidth;
var currentText;
var currentInfo;

socket.on('allHexes', function(data){
    var p = data;
});

// Instantiate api handler
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000,
});

window.addEventListener('load', () => { 
    // Compile Handlebar Templates
    const errorTemplate = Handlebars.compile($('#error-template').html());
    const submenuTemplate = Handlebars.compile($('#submenu-template').html());
    const fillsTemplate = Handlebars.compile($('#fills-template').html());
    const tagsTemplate = Handlebars.compile($('#tags-template').html());
  
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
        if ($('#Hex-edit-form').form('is valid')) {
            currentText = document.getElementById("Hex-Text").value;
            currentInfo = document.getElementById("Hex-Info").value;
            currentFill = document.getElementById("Hex-fill-select").value;
            currentTag = document.getElementById("Hex-detail-select").value;
            await api.post('/newhex', {currentX, currentY, currentlayer, currentFill, currentTag, currentText, currentInfo});
            var modal = document.getElementById('myModal');
            modal.style.display = "none";
            redraw(currentlayer);
            return false;
        }
        return true;
    };

    router.add('', async () => {
        try {
            const hexes = await api.get('/layer/main');
            const layers = await api.get('/layers');
            const layersData = layers.data;
            const tags = await api.get('/tags');
            const tagsData = tags.data;
            const fills = await api.get('/fills');
            const fillsData = fills.data;
            let submenu = submenuTemplate(layersData);
            let fill = fillsTemplate(fillsData);
            let tag = tagsTemplate(tagsData);
            $('#submenu').html(submenu);
            $('#hex-fill').html(fill);
            $('#hex-tag').html(tag);
            drawHexes(hexes);
            addDropdown();
            $('.submit').click(newHex);
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
function drawHexes(hexes){
    const draw = SVG('main');
    const Hex = Honeycomb.extendHex({
        size: 100,
        orientation: 'flat',
        fill: 'transparent',
        fillName: '',
        tag: ``,
        tagName: '',
        tagcolor: 'black',
        tagfill: 'none',
        tagwidth: 1,
        text: '',
        info: '',
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
            .path(this.tag)
            .fill(this.tagfill)
            .stroke({ color: this.tagcolor, width: this.tagwidth })
            .translate(centerPosition.x, centerPosition.y)
            
            this.glow = draw
            .text(`${this.text}`)
            .stroke({ color: '#FFFFFF', width: 7 })
            .font({
                size: fontSize,
                anchor: 'middle',
                leading: 1.4,
                fill: '#000000',
            })
            .translate(centerPosition.x, centerPosition.y - fontSize + this.size*0.6)
            
            this.title = draw
            .text(`${this.text}`)
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
            this.title
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
        grid.push(Hex(row.Xcoord, row.Ycoord, { text: row.Text, fill: row.Hexcode, fillName: row.FillName, tag: row.Path, tagName: row.TagName, tagcolor: row.Color, tagfill: row.Fill, tagwidth: row.Width, info: row.Info }))
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
            currentInfo = hex.info;
            currentText = hex.text;
            currentX = hex.x;
            currentY = hex.y;
            currentTagName = hex.tagName;
            currentTagPath = hex.tag;
            currentTagFill = hex.tagfill;
            currentTagStrokeColor = hex.tagcolor;
            currentTagStrokeWidth = hex.tagwidth;
            hex.highlight()
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginRight = "250px";
            document.getElementById("hex-coord").innerHTML = `#${currentX},${currentY}`;
            document.getElementById("hex-info").innerHTML = `${currentInfo}`;
            document.getElementById("data").style.display = "block";
        } else if (hexInv) {
            currentFill = '';
            currentFillHexcode = '';
            currentInfo = '';
            currentTagName = '';
            currentTagPath = '';
            currentTagFill = '';
            currentTagStrokeColor = '';
            currentTagStrokeWidth = '';
            currentText = '';
            currentX = hexInv.x;
            currentY = hexInv.y;
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginRight = "250px";
            document.getElementById("hex-coord").innerHTML = `#${currentX},${currentY}`;
            document.getElementById("hex-info").innerHTML = `${currentInfo}`;
            document.getElementById("data").style.display = "none";
        }
    });
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}


async function redraw(name){
    currentlayer = name;
    closeNav();
    var myNode = document.getElementById("main");
    myNode.removeChild(myNode.firstChild);
    const hexes = await api.get('/layer/'+name);
    drawHexes(hexes);
    addDropdown();
}

function change_color(select) {
    var style = select.options[select.selectedIndex].style.cssText;
    select.setAttribute("style", `${style}`)
}

async function change_tag(select) {
    var name = select.options[select.selectedIndex].textContent;
    const tag = await api.get('/tag/'+name);
    const tagData = tag.data;
    var DetailPreview = document.getElementById("Hex-detail-preview");
    DetailPreview.setAttribute("d", tagData[0].Path)
    DetailPreview.setAttribute("fill", tagData[0].Fill)
    DetailPreview.setAttribute("stroke", tagData[0].Color)
    DetailPreview.setAttribute("stroke-width", tagData[0].Width)
}

function addDropdown(){
    var dropdown = document.getElementById("dropdown-btn");
    var dropdowns = document.getElementById("dropdown-container");

    dropdown.addEventListener("click", function() {
        this.classList.toggle("active");
        if (dropdowns.style.display === "block") {
            dropdowns.style.display = "none";
        } else {
            dropdowns.style.display = "block";
        }
    });

    //add modal view interaction
    var modal = document.getElementById('myModal');
    var btn = document.getElementById("hex-edit");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        document.getElementById("hex-edit-title").innerHTML = 'Edit/Create Hex #' + currentX + ',' + currentY;
        document.getElementById("Hex-Text").value = currentText;
        document.getElementById("Hex-Info").value = currentInfo;
        var FillSelector = document.getElementById("Hex-fill-select");
        FillSelector.value = currentFill;
        FillSelector.setAttribute("style", `background-color: ${currentFillHexcode}`)
        document.getElementById("Hex-detail-select").value = currentTagName;
        var DetailPreview = document.getElementById("Hex-detail-preview");
        DetailPreview.setAttribute("d", currentTagPath)
        DetailPreview.setAttribute("fill", currentTagFill)
        DetailPreview.setAttribute("stroke", currentTagStrokeColor)
        DetailPreview.setAttribute("stroke-width", currentTagStrokeWidth)
        modal.style.display = "block";
        closeNav();
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

