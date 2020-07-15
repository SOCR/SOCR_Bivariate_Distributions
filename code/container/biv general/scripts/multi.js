$(document).ready(function(){
                                                            // Variable declaration
    var fx = [];// Stores PDF for x
    var fy = [];// Stores PDF for y
    var Fx = [];// Stores CDF for x
    var Fy = [];
    var x = [];// time array for x
    var y = [];// time array for y
    var xdist = "";// Stores what type of distribution X is, 0 = normal, 1 = poisson
    var ydist = "";// Stores what type of distribution Y is, values same as X
    var toDisp = [];// Stores what radio is selected
    var b = [];// Stores matrix for b(x,y)
    var bCut = [];// Stores matrix for f(x,y) between bounds
    var B = [];// Stores matrix for CDF of b(x,y), or B(x,y)
    var k = 0;// stores value for k
    var px1 = 0;// first parameter of distribution X
    var px2 = 0;// second parameter of distribution X
    var py1 = 1;// first parameter of distribution Y
    var py2 = 1;// second parameter of distribution X
    var mux = 0;// mean of X
    var muy = 0;// mean of Y
    var sigmax = 1;// std dev of X
    var sigmay = 1;// std dev of Y
    var xmin = -4;// input value of x min
    var xmax = 4;// input value of x max
    var ymin = -4;// input value of y min
    var ymax = 4;// input value of y max
    var rho = 0.5;// value of rho
    var maxx = 0; // max value of X
    var maxy = 0; // max value of Y
    var c = [];// conditional distribution stored here
    var C = [];// conditional CDF stored here
    var maxc = 0;// max of conditional prob
    var old = [];// stores old values to check if x,y,z need updating
    var des = 0; //0 = marginal x, 1 = marginal y, 2 = x|y at ymin, 3 = x|y at ymax, 4 = y|x at xmin, 5 = y|x at xmax, 6 = cdf x, 7 = cdf y
    var numPoints = 250;// number of points per distribution, max = 500
    var sigmaStep = 5;// bounds how many sigmas away are the distributions calculated
    var out = 0;// value to be displayed in the P box
    var des3d = 0;// 0 = bivariate PDF, 1 = bivariate CDF
    var starting = 0;// used for initial settings to be displayed
    var output = [];// String array to store history of outputs
    var changed = 0;// Detects if the distribution type was changed
    var $graph = $('#graph');// Canvas for 2d graph
    var settingsOpen = false;// Logs if the settings menu is open
                                                            //Functions
    var check = function(){// Checks if inputs are correct, if they are wrong it resets them to previously recorded values
        if(rho >= 1 || rho < 0 || isNaN(rho)){
            rho = old[4];
            $('#rho').replaceWith('<textarea id = "rho" onfocus="this.select()" rows="1" maxlength="4">' + rho + '</textarea>');
        }
        if(isNaN(px1)){
            px1 = old[0];
            $('#px1').replaceWith('<textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">' + px1 + '</textarea>');
        }
        if(isNaN(py1)){
            px2 = old[1];
            $('#px2').replaceWith('<textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">' + px2 + '</textarea>');
        }
        if(isNaN(px2)){
            px2 = old[2];
            $('#px2').replaceWith('<textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">' + px2 + '</textarea>');
        }
        if(isNaN(py2)){
            py2 = old[3];
            $('#py2').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py2 + '</textarea>');
        }
        if(xmin >= xmax || isNaN(xmin)){
            xmin = old[5];
            $('#xmin').replaceWith('<textarea id = "xmin" onfocus="this.select()" rows="1" maxlength="4">' + xmin + '</textarea>');
        }
        if(isNaN(xmax)){
            xmax = old[6];
            $('#xmax').replaceWith('<textarea id = "xmax" onfocus="this.select()" rows="1" maxlength="4">' + xmax + '</textarea>');
        }
        if(ymin >= ymax || isNaN(ymin)){
            ymin = old[7];
            $('#ymin').replaceWith('<textarea id = "ymin" onfocus="this.select()" rows="1" maxlength="4">' + ymin + '</textarea>');
        }
        if(isNaN(ymax)){
            ymax = old[8];
            $('#ymax').replaceWith('<textarea id = "ymax" onfocus="this.select()" rows="1" maxlength="4">' + ymax + '</textarea>');
        }
    }
    var checkUpdate = function(){// checks if any distribution parameters have been updated
        if(old[0] != mux){return 1;}
        if(old[1] != muy){return 1;}
        if(old[2] != sigmax){return 1;}
        if(old[3] != sigmay){return 1;}
        if(old[4] != rho){return 1;}
        return 0;
    }
                                                            //Distributions
    var normal = function(des){//Makes a nornal distribution
        var t = [];
        var f = [];
        var F = [];
        var mu = 0;
        var sigma = 0;
        if(des == 0){mu = mux;sigma = sigmax;x = [];fx = [];Fx = [];}
        else{mu = muy;sigma = sigmay;y = [];fy = [];Fy = [];}
        var start = mu-sigmaStep*sigma;
        var end = mu+sigmaStep*sigma;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push((1/(sigma*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*Math.pow(((t[i]-mu)/sigma),2)));
        }
        F = makeCDF(f,step);
        if(des == 0){x = t; fx = f; Fx = F}
        else{y = t; fy = f; Fy = F;}
    }
    var poisson = function(des){
        var t = [];
        var f = [];
        var F = [];
        var lambda = 0;
        if(des == 0){lambda = mux;x = [];fx = [];Fx = [];}
        else{lambda = muy;y = [];fy = [];Fy = [];}
        for(var i = 0; i <= 30; i++){
            t.push(i);
            f.push((Math.pow(lambda,i)*Math.exp(-lambda))/(factorials[i]));
        }
        F = makeCDF(f,1);
        if(des == 0){x = t; fx = f; Fx = F}
        else{y = t; fy = f; Fy = F;}
    }
    var template = function(des){//Template for adding more distributions, copy as a new function then add formulae for pdf and CDF
        var t = [];
        var f = [];
        var F = [];
        var mu = 0;
        var sigma = 0;
        if(des == 0){mu = mux;sigma = sigmax;x = [];fx = [];Fx = [];}
        else{mu = muy;sigma = sigmay;y = [];fy = [];Fy = [];}
        var start = mu-sigmaStep*sigma;
        var end = mu+sigmaStep*sigma;
        var step = Math.abs((end-start)/10);
        for(var i = 0; i < numPoints; i++){
            //Enter Formula here
        }
        F = makeCDF(f,step);
        if(des == 0){x = t; fx = f; Fx = F}
        else{y = t; fy = f; Fy = F;}
    }
                                                            //Bivariate making
    var makeB = function(){
        //finding k
        var deltax = x[1]-x[0];
        var deltay = y[1]-y[0];
        var temp1 = 0;
        for (var i = 0; i < x.length; i++){
            temp1 += deltax*x[i]*fx[i]*(2*Fx[i]-1);
        }
        var temp2 = 0;
        for (var i = 0; i < y.length;i++){
            temp2 += deltay*y[i]*fy[i]*(2*Fy[i]-1);
        }
        k = (temp1*temp2)/(rho*sigmax*sigmay);
        k = 1/k;
        //making b,B
        b = [];
        B = [];
        for (var i = 0; i < x.length; i++){
            var temp3 = [];
            var temp4 = [];
            for (var j = 0; j < y.length; j++){
                temp3.push(fx[i]*fy[j]*(1+k*(2*Fx[i]-1)*(2*Fy[j]-1)));
                temp4.push(Fx[i]*Fy[j]*(1+k*(1-Fx[i])*(1-Fy[j])));
            }
            b.push(temp3);
            B.push(temp4);
        }
    }
    var makebCut = function(){
        bCut = [];
        for (var i = 0; i < x.length; i++){
            var temp = [];
            for (var j = 0; j < y.length; j++){
                if(x[i] >= xmin && x[i] <= xmax && y[j] >= ymin && y[j] <= ymax){temp.push(b[i][j]);}
                else{temp.push(0);}
            }
            bCut.push(temp);
        }
        updateOutput('P(' + xmin + ' < X < ' + xmax + ' ∩ ' + ymin + ' < Y < ' + ymax + ') = ' + (sumMat(bCut)/sumMat(b)).toFixed(3));
    }
    var sumMat = function(mat){
        var temp = 0;
        for (var i = 0; i < x.length; i++){
            for (var j = 0; j < y.length; j++){
                temp += mat[i][j];
            }
        }
        return temp;
    }
    var makeCDF = function(f,step){//Makes CDF from given PDF
        var temp = 0;
        var F = [];
        for (var i = 0; i < f.length; i++){
            temp += f[i]*step;
            F.push(temp);
        }
        return F;
    }
                                                            //Auxillary functions
    var makeDisp = function(raw,max){// Adjusts function values to fit graph size
        var temp = [];
        for (i = 0; i < raw.length; i++){
            temp.push(raw[i]*350/max);
        }
        return temp;
    }
    var findCDF = function(t, F, val){
        var min = t[0];
        var max = t[t.length-1];
        if(val <= min){return F[0];}
        else if(val >= max){return F[F.length-1];}
        var temp = (val-min)/((max-min)/t.length);
        return F[Math.floor(temp)];
    }
    var getDist = function(val, dir){//Gets the row/col at a particular point from b(x,y)
        if(dir == 1){
            min = y[0];
            max = y[y.length - 1];
            delta = y[1]-y[0];
        }
        else{
            min = x[0];
            max = x[x.length - 1];
            delta = x[1]-x[0];
        }
        if(val <= min && dir == 0){return b[0];}
        if(val <= min){return getCol(0);}
        if(val >= max && dir == 0){return b[x.length-1];}
        if(val >= max){return getCol(y.length-1);}
        var loc = Math.floor((val-min)/delta);//fix
        if(dir == 0){return b[loc];}
        return getCol(loc);
    }
    var getCol = function(col){//Returns a column from b(x,y)
        var temp = [];
        for (var i = 0; i < x.length; i++){
            temp.push(b[i][col]);
        }
        return temp;
    }
    var updateOutput = function(txt){
        output.unshift(txt);
        $('#pout').replaceWith('<textarea id="pout" readonly>' + output.join("\n") + '</textarea>');
    }
    var updateGraph = function(){// Core function, coordinates other functions based on the radio selected
        $graph.drawRect({fillStyle: 'white',strokeStyle: 'white',strokeWidth: 4,x: 150, y: 100,fromCenter: true,width: 1000,height: 1000});//clears canvas
        switch (des){
            case 0:// Marginal of X
                drawAxis(0);
                toDisp = makeDisp(fx,maxx);
                drawData(toDisp);
                out = findCDF(x, Fx, xmax) - findCDF(x, Fx, xmin);
                updateOutput('P(' + xmin + ' < X < ' + xmax + ') = ' + out.toFixed(3));
                shadeIn(x, xmin, xmax);
                break;
            case 1:// Marginal of Y
                drawAxis(1);
                toDisp = makeDisp(fy,maxy);
                drawData(toDisp);
                out = findCDF(y, Fy, ymax) - findCDF(y, Fy, ymin);
                updateOutput('P(' + ymin + ' < Y < ' + ymax + ') = ' + out.toFixed(3));
                shadeIn(y, ymin, ymax);
                break;
            case 2:// p(X|Y=ymin)
                c = getDist(ymin, 0);
                maxc = Math.max(...c);
                drawAxis(2);
                toDisp = makeDisp(c,maxc);
                drawData(toDisp);
                C = makeCDF(c,x[1]-x[0]);
                out = findCDF(y, C, xmax) - findCDF(y, C, xmin);
                out = out/C[c.length-1];
                updateOutput('P(' + xmin + ' < X < ' + xmax + ' | Y = ' + ymin + ') = ' + out.toFixed(3));
                shadeIn(x, xmin, xmax);
                break;
            case 3:// p(X|Y=max)
                c = getDist(ymax, 0);
                maxc = Math.max(...c);
                drawAxis(2);
                toDisp = makeDisp(c,maxc);
                drawData(toDisp);
                C = makeCDF(c,x[1]-x[0]);
                out = findCDF(y, C, xmax) - findCDF(y, C, xmin);
                out = out/C[c.length-1];
                updateOutput('P(' + xmin + ' < X < ' + xmax + ' | Y = ' + ymax + ') = ' + out.toFixed(3));
                shadeIn(x, xmin, xmax);
                break;
            case 4:// p(Y|X=min)
                c = getDist(xmin, 1);
                maxc = Math.max(...c);
                drawAxis(3);
                toDisp = makeDisp(c,maxc);
                drawData(toDisp);
                C = makeCDF(c,y[1]-y[0]);
                out = findCDF(x, C, ymax) - findCDF(x, C, ymin);
                out = out/C[c.length-1];
                updateOutput('P(' + ymin + ' < Y < ' + ymax + ' | X = ' + xmin + ') = ' + out.toFixed(3));
                shadeIn(y, ymin, ymax);
                break;
            case 5:// p(Y|X=max)
                c = getDist(xmax, 1);
                maxc = Math.max(...c);
                drawAxis(3);
                toDisp = makeDisp(c,maxc);
                drawData(toDisp);
                C = makeCDF(c,y[1]-y[0]);
                out = findCDF(x, C, ymax) - findCDF(x, C, ymin);
                out = out/C[c.length-1];
                updateOutput('P(' + ymin + ' < Y < ' + ymax + ' | X = ' + xmax + ') = ' + out.toFixed(3));
                shadeIn(y, ymin, ymax);
                break;
            case 6:// CDF of X
                drawAxis(4);
                toDisp = makeDisp(Fx, 1);
                drawData(toDisp);
                out = findCDF(x, Fx, xmax) - findCDF(x, Fx, xmin);
                updateOutput('P(' + xmin + ' < X < ' + xmax + ') = ' + out.toFixed(3));
                shadeIn(x, xmin, xmax);
                break;
            case 7:// CDF of Y
                drawAxis(5);
                toDisp = makeDisp(Fy, 1);
                drawData(toDisp);
                out = findCDF(y, Fy, ymax) - findCDF(y, Fy, ymin);
                updateOutput('P(' + ymin + ' < Y < ' + ymax + ') = ' + out.toFixed(3));
                shadeIn(muy, sigmay, ymin, ymax);
                break;
        }
    }
    var drawAxis = function(dist){// Draws axis on canvas
        var temp = [];
        if(dist == 0){temp = x;tall = maxx;}
        else if(dist == 1){temp = y; tall = maxy;}
        else if(dist == 2){temp = x; tall = maxc;}
        else if(dist == 3){temp = y; tall = maxc;}
        else if(dist == 4){temp = x; tall = 1;}
        else if(dist == 5){temp = y; tall = 1;}
        var min = temp[0];
        var max = temp[temp.length - 1];
        $graph.drawPath({
            strokeStyle: '#000',
            strokeWidth: 1,
            x: 50, y: 370,
            p1: {
                type: 'line',
                rounded: true,
                endArrow: false,
                x1: -5, y1: 0,
                x2: 510, y2: 0
            },
            p2: {
                type: 'line',
                rounded: true,
                endArrow: false,
                x1: 0, y1: 5,
                x2: 0, y2: -360
            },
            p3: {
                type: 'line',
                rounded: true,
                endArrow: false,
                x1: 500, y1: 5,
                x2: 500, y2: -5
            },
            p4: {
                type: 'line',
                rounded: true,
                endArrow: false,
                x1: -5, y1: -350,
                x2: 5, y2: -350
            }
        }).drawText({
            text:min.toFixed(2).toString(),
            fontFamily:'serif',
            fontSize: 20,
            x: 50, y:390,
            fillStyle: '#000',
            strokeStyle: '#000',
            strokeWidth: 0
        }).drawText({
            text:'0',
            fontFamily:'serif',
            fontSize: 20,
            x: 25, y:370,
            fillStyle: '#000',
            strokeStyle: '#000',
            strokeWidth: 0
        }).drawText({
            text:max.toFixed(2).toString(),
            fontFamily:'serif',
            fontSize: 20,
            x: 550, y:390,
            fillStyle: '#000',
            strokeStyle: '#000',
            strokeWidth: 0
        }).drawText({
            text:tall.toFixed(3).toString(),
            fontFamily:'serif',
            fontSize: 20,
            x: 25, y:20,
            fillStyle: '#000',
            strokeStyle: '#000',
            strokeWidth: 0
        })
        for (var i = 10; i < 510; i+=10){
            $graph.drawPath({
                strokeStyle: '#ccc',
                strokeWidth: 1,
                x: 50, y: 370,
                p1: {
                    type: 'line',
                    rounded: true,
                    endArrow: false,
                    x1: i, y1: 5,
                    x2: i, y2: -360
                }
            })
        }
        for (var i = 10; i < 360; i+=10){
            $graph.drawPath({
                strokeStyle: '#ccc',
                strokeWidth: 1,
                x: 50, y: 370,
                p1: {
                    type: 'line',
                    rounded: true,
                    endArrow: false,
                    x1: -5, y1: -i,
                    x2: 510, y2: -i
                }
            })
        }
    }
    var drawData = function(data){// Draws the data on canvas
        var step = Math.round(500/data.length);
        for (var i = 0; i < data.length; i++){
            $graph.drawPath({
                strokeStyle: '#00F',
                strokeWidth: 1,
                x: 50, y: 370,
                p1:{
                    type: 'line',
                    rounded: false,
                    endArrow: false,
                    x1:i*step,y1:-data[i],
                    x2:(i+1)*step,y2:-data[i+1]
                }
            })
        }
    }
    var shadeIn = function(t, min, max){//Shades in a specified region of graph
        var lb = t[0];
        var ub = t[t.length-1];
        var delta = Math.abs((ub-lb)/500);
        var temp = 0;
        var i = 50;
        if(min < lb){min = lb};
        if(max > ub){max = ub};
        for (var i = 0; i <= 500; i++){
            if(lb+i*delta <= max && lb+i*delta >= min){
                temp = (i%Math.floor(500/t.length))*((toDisp[Math.floor(i*t.length/500)+1]-toDisp[Math.floor(i*t.length/500)])*(t.length/500)) + toDisp[Math.floor(i*t.length/500)];
                $graph.drawPath({
                    strokeStyle: 'rgba(255, 0, 0, 0.5)',
                    strokeWidth: 1,
                    x: 50, y: 370,
                    p1:{
                        type: 'line',
                        rounded: false,
                        endArrow: false,
                        x1:i,y1:0,
                        x2:i,y2:-temp
                    }
                })
            }
        }
    }
    var doAll = function(){
        old = [px1, py1, px2, py2, rho, xmin, xmax, ymin, ymax];
        px1 = Number($('#px1').val());
        py1 = Number($('#py1').val());
        px2 = Number($('#px2').val());
        py2 = Number($('#py2').val());
        rho = Number($('#rho').val());
        xmin = Number($('#xmin').val());
        xmax = Number($('#xmax').val());
        ymin = Number($('#ymin').val());
        ymax = Number($('#ymax').val());
        des = Number($("input[name='1']:checked").val());
        des3d = Number($("input[name='2']:checked").val());
        check();
        var updating = checkUpdate();
        if(updating == 1 || changed == 1){
            switch(Number(xdist)){//Add additional cases for any distribution added
                case 0:
                    mux = px1;
                    sigmax = px2;
                    normal(0);
                    break;
                case 1:
                    mux = px1;
                    sigmax = px1;
                    px2 = 1;
                    poisson(0);
                    break;
            }
            switch(Number(ydist)){//Add additional cases for any distribution added
                case 0:
                    muy = py1;
                    sigmay = py2;
                    normal(1);
                    break;
                case 1:
                    muy = py1;
                    sigmay = py1;
                    py2 = 1;
                    poisson(1);
                    break;
            }
            maxx = Math.max(...fx);
            maxy = Math.max(...fy);
            makeB();
        }
        changed = 0;
        makebCut();
        updateGraph();//Updates 2D Graph
        updatePlot();//Updates 3D Graph
        $('main').hide(1000);
        $('#backdim').hide(1000);
        settingsOpen = false;
    }
                                                            //Buttons
    $('#close').click(function(){//Does all the work updating everything
        doAll();
    })
    $('#show').click(function(){//Shows the settings menu
        $('#backdim').show(1000);
        $('main').show(1000);
        settingsOpen = true;
    })
    $('#backdim').click(function(){//Clicking outside the settings box
        doAll();
    })
    $(document).keyup(function(e){// Pressing Esc key
        if(e.which == 27 && settingsOpen) {
            doAll();
        }
    });
    $(document).on('change', '#xdist', function(){//Detects change in select menu for X and alters the page accordingly
        xdist = "";
        changed = 1;
		$('#xdist option:selected').each(function(){
			xdist += $(this).val();
        })
        switch (Number(xdist)){//Add other cases for any distribution added
            case 0:
                $('#x1').replaceWith('<td id = "x1">&mu;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&sigma;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                break;
            case 1:
                $('#x1').replaceWith('<td id = "x1">&lambda;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                break;
        }
    })
    $(document).on('change', '#ydist', function(){//Detects change in select menu for Y and alters the page accordingly
        ydist = "";
        changed = 1;
		$('#ydist option:selected').each(function(){//Add other cases for any distribution added
			ydist += $(this).val();
        })
        switch (Number(ydist)){
            case 0:
                $('#y1').replaceWith('<td id = "y1">&mu;<sub>X</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&sigma;<sub>X</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                break;
            case 1:
                $('#y1').replaceWith('<td id = "y1">&lambda;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                break;
        }
    })
                                                            //3D model
    var updatePlot = function(){// Uses Plotly to generate a 3d plot
        var toPlot = [];
        if(des3d == 0){toPlot = bCut;}
        else{toPlot = B}
        var data = [{
            x: y,
            y: x,
            z: toPlot,
            type: 'surface',
        }];
        var layout = {
            scene: {camera: {eye: {x: 2, y: 1, z: 0.75}}},
            autosize: true,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0,
                pad: 0
            }
        };
        Plotly.newPlot('surfacePlot', data, layout);
        Plotly.restyle('surfacePlot', {showscale: false});
    }
                                                            // On loading
    var initial = function(){// loads initial functions to be displayed
        if(starting != 0){return;}
        updateZCut();
        updateGraph(des);//Updates 2D Graph
        updatePlot();//Updates 3D Graph
        starting++;
    }
    initial();//running on load
    //Factorial array
    var factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1124000727777607680000, 25852016738884976640000, 620448401733239439360000, 15511210043330985984000000, 403291461126605635584000000, 10888869450418352160768000000, 304888344611713860501504000000, 8841761993739701954543616000000, 265252859812191058636308480000000, 8222838654177922817725562880000000, 263130836933693530167218012160000000, 8683317618811886495518194401280000000, 295232799039604140847618609643520000000, 10333147966386144929666651337523200000000, 371993326789901217467999448150835200000000, 13763753091226345046315979581580902400000000, 523022617466601111760007224100074291200000000, 20397882081197443358640281739902897356800000000, 815915283247897734345611269596115894272000000000, 33452526613163807108170062053440751665152000000000, 1405006117752879898543142606244511569936384000000000, 60415263063373835637355132068513997507264512000000000, 2658271574788448768043625811014615890319638528000000000, 119622220865480194561963161495657715064383733760000000000, 5502622159812088949850305428800254892961651752960000000000, 258623241511168180642964355153611979969197632389120000000000, 12413915592536072670862289047373375038521486354677760000000000, 608281864034267560872252163321295376887552831379210240000000000, 30414093201713378043612608166064768844377641568960512000000000000, 1551118753287382280224243016469303211063259720016986112000000000000, 80658175170943878571660636856403766975289505440883277824000000000000, 4274883284060025564298013753389399649690343788366813724672000000000000, 230843697339241380472092742683027581083278564571807941132288000000000000, 12696403353658275925965100847566516959580321051449436762275840000000000000, 710998587804863451854045647463724949736497978881168458687447040000000000000, 40526919504877216755680601905432322134980384796226602145184481280000000000000, 2350561331282878571829474910515074683828862318181142924420699914240000000000000, 138683118545689835737939019720389406345902876772687432540821294940160000000000000, 8320987112741390144276341183223364380754172606361245952449277696409600000000000000, 507580213877224798800856812176625227226004528988036003099405939480985600000000000000, 31469973260387937525653122354950764088012280797258232192163168247821107200000000000000, 1982608315404440064116146708361898137544773690227268628106279599612729753600000000000000, 126886932185884164103433389335161480802865516174545192198801894375214704230400000000000000, 8247650592082470666723170306785496252186258551345437492922123134388955774976000000000000000, 544344939077443064003729240247842752644293064388798874532860126869671081148416000000000000000, 36471110918188685288249859096605464427167635314049524593701628500267962436943872000000000000000, 2480035542436830599600990418569171581047399201355367672371710738018221445712183296000000000000000, 171122452428141311372468338881272839092270544893520369393648040923257279754140647424000000000000000, 11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000, 850478588567862317521167644239926010288584608120796235886430763388588680378079017697280000000000000000, 61234458376886086861524070385274672740778091784697328983823014963978384987221689274204160000000000000000, 4470115461512684340891257138125051110076800700282905015819080092370422104067183317016903680000000000000000, 330788544151938641225953028221253782145683251820934971170611926835411235700971565459250872320000000000000000, 24809140811395398091946477116594033660926243886570122837795894512655842677572867409443815424000000000000000000, 1885494701666050254987932260861146558230394535379329335672487982961844043495537923117729972224000000000000000000, 145183092028285869634070784086308284983740379224208358846781574688061991349156420080065207861248000000000000000000, 11324281178206297831457521158732046228731749579488251990048962825668835325234200766245086213177344000000000000000000, 894618213078297528685144171539831652069808216779571907213868063227837990693501860533361810841010176000000000000000000, 71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000, 5797126020747367985879734231578109105412357244731625958745865049716390179693892056256184534249745940480000000000000000000, 475364333701284174842138206989404946643813294067993328617160934076743994734899148613007131808479167119360000000000000000000, 39455239697206586511897471180120610571436503407643446275224357528369751562996629334879591940103770870906880000000000000000000, 3314240134565353266999387579130131288000666286242049487118846032383059131291716864129885722968716753156177920000000000000000000, 281710411438055027694947944226061159480056634330574206405101912752560026159795933451040286452340924018275123200000000000000000000, 24227095383672732381765523203441259715284870552429381750838764496720162249742450276789464634901319465571660595200000000000000000000, 2107757298379527717213600518699389595229783738061356212322972511214654115727593174080683423236414793504734471782400000000000000000000, 185482642257398439114796845645546284380220968949399346684421580986889562184028199319100141244804501828416633516851200000000000000000000, 16507955160908461081216919262453619309839666236496541854913520707833171034378509739399912570787600662729080382999756800000000000000000000, 1485715964481761497309522733620825737885569961284688766942216863704985393094065876545992131370884059645617234469978112000000000000000000000, 135200152767840296255166568759495142147586866476906677791741734597153670771559994765685283954750449427751168336768008192000000000000000000000, 12438414054641307255475324325873553077577991715875414356840239582938137710983519518443046123837041347353107486982656753664000000000000000000000, 1156772507081641574759205162306240436214753229576413535186142281213246807121467315215203289516844845303838996289387078090752000000000000000000000, 108736615665674308027365285256786601004186803580182872307497374434045199869417927630229109214583415458560865651202385340530688000000000000000000000, 10329978488239059262599702099394727095397746340117372869212250571234293987594703124871765375385424468563282236864226607350415360000000000000000000000, 991677934870949689209571401541893801158183648651267795444376054838492222809091499987689476037000748982075094738965754305639874560000000000000000000000, 96192759682482119853328425949563698712343813919172976158104477319333745612481875498805879175589072651261284189679678167647067832320000000000000000000000, 9426890448883247745626185743057242473809693764078951663494238777294707070023223798882976159207729119823605850588608460429412647567360000000000000000000000, 933262154439441526816992388562667004907159682643816214685929638952175999932299156089414639761565182862536979208272237582511852109168640000000000000000000000, 93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000]
                                                            //Testing
    $('#test').click(function(){
        var test1 = CDF(2,0.5,2);
        var test2 = sum();
        alert(test2);
    })
    var sum = function(){
        var temptemp = 0;
        for(var i = 0; i < numPoints; i++){for (var j = 0; j < numPoints; j++){temptemp += z[i][j];}}
        return temptemp;
    }
    var findMaxZ = function(){//Finds max of Z
        var tempy = 0;
        for(var i = 0; i < numPoints; i++){
            for (var j = 0; j < numPoints; j++){
                if(tempy < z[i][j]){
                    tempy = z[i][j];
                }
            }
        }
        return tempy;
    }
    
})