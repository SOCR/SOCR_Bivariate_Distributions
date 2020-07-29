$(document).ready(function(){
                                                            // Variable declaration
    var x = [];// Stores distribution X
    var y = [];// Stores distribution Y
    var toDisp = [];// Stores what radio is selected
    var z = [];// Stores matrix for f(x,y)
    var zCut = [];// Stores matrix for f(x,y) between bounds
    var zCDF = [];// Stores matrix for CDF of f(x,y)
    var mux = 0;// mean of X
    var muy = 0;// mean of Y
    var sigmax = 1;// std dev of X
    var sigmay = 1;// std dev of Y
    var xmin = -4;// input value of x min
    var xmax = 4;// input value of x max
    var ymin = -4;// input value of y min
    var ymax = 4;// input value of y max
    var rho = 0.5;// value of rho
    var t1 = [];// time array for x
    var t2 = [];// time array for y
    var c = [];// conditional distribution stored here
    var old = [];// stores old values to check if x,y,z need updating
    var des = 0; //0 = marginal x, 1 = marginal y, 2 = x|y at ymin, 3 = x|y at ymax, 4 = y|x at xmin, 5 = y|x at xmax, 6 = cdf x, 7 = cdf y
    var numPoints = 250;// number of points per distribution, max = 500
    var sigmaStep = 5;// bounds how many sigmas away are the distributions calculated
    var out = 0;// value to be displayed in the P box
    var des3d = 0;// 0 = bivariate PDF, 1 = bivariate CDF
    var starting = 0;// used for initial settings to be displayed
    var output = [];// String array to store history of outputs
    var settingsOpen = false;// Logs if the settings menu is open
                                                            //Functions
    var check = function(){// Checks if inputs are correct, if they are wrong it resets them to previously recorded values
        if(rho >= 1 || rho < 0 || isNaN(rho)){
            rho = old[4];
            $('#rho').replaceWith('<textarea id = "rho" onfocus="this.select()" rows="1" maxlength="4">' + rho + '</textarea>');
        }
        if(isNaN(mux)){
            mux = old[0];
            $('#mux').replaceWith('<textarea id = "mux" onfocus="this.select()" rows="1" maxlength="4">' + mux + '</textarea>');
        }
        if(isNaN(muy)){
            muy = old[1];
            $('#muy').replaceWith('<textarea id = "muy" onfocus="this.select()" rows="1" maxlength="4">' + muy + '</textarea>');
        }
        if(sigmax <=0 || isNaN(sigmax)){
            sigmax = old[2];
            $('#six').replaceWith('<textarea id = "six" onfocus="this.select()" rows="1" maxlength="4">' + sigmax + '</textarea>');
        }
        if(sigmay <=0 || isNaN(sigmay)){
            sigmay = old[3];
            $('#siy').replaceWith('<textarea id = "siy" onfocus="this.select()" rows="1" maxlength="4">' + sigmay + '</textarea>');
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
    var makeTea = function(mu,sigma){// Makes array to use in creating the distribution
        var t = [];
        var lb = mu-sigmaStep*sigma;
        var ub = mu+sigmaStep*sigma;
        var delta = Math.abs((ub-lb)/numPoints);
        for (var i = lb; i < ub; i += delta){
            t.push(i).toFixed(6);
        }
        return t;
    }
    var makeCDFZ = function(){// Makes bivariate normal distribution CDF
        zCDF = [];
        var temp1 = [];
        for (var i = 0; i <= numPoints; i++){
            temp1 = [];
            for(var j = 0; j <= numPoints; j++){
                temp1.push(BVN(t1[i], t2[j]));
            }
            zCDF.push(temp1);
        }
    }
    var makeZ = function(){//Makes Z function from CDF of Z
        //binorm pdf and define it explicitly
        var temp = [];
        var temp1 = [];
        z = [];
        makeCDFZ();
        for (var i = 0; i < numPoints; i++){
            temp = [];
            temp1 = [];
            for (var j = 0; j < numPoints; j++){
                var power = Math.pow(((t1[i]-mux)/sigmax),2) + Math.pow(((t2[j]-muy)/sigmay),2) - (2*rho*(t1[i]-mux)*(t2[j]-muy))/(sigmax*sigmay);
                var whole = (1/(2*Math.PI*sigmax*sigmay*Math.pow((1-Math.pow(rho,2)),0.5))*Math.exp((-power)/(2*(1-Math.pow(rho,2)))));
                temp.push(whole);
            }
            z.push(temp);
        }
    }
    var updateZCut = function(){//Updates the cut PDF array of Z
        zCut = [];
        for (var i = 0; i < numPoints; i++){
            var temp = [];
            for (var j = 0; j < numPoints; j++){
                if(t1[i] >= xmin && t1[i] <= xmax && t2[j] >= ymin && t2[j] <= ymax){temp.push(z[i][j]);}
                else{temp.push(0);}
            }
            zCut.push(temp);
        }
        updateOutput('P(' + xmin + ' < X < ' + xmax + ' ∩ ' + ymin + ' < Y < ' + ymax + ') = ' + (sumMat(zCut)/sumMat(z)).toFixed(3));
    }
    var sumMat = function(mat){
        var temp = 0;
        for (var i = 0; i < numPoints; i++){
            for (var j = 0; j < numPoints; j++){
                temp += mat[i][j];
            }
        }
        return temp;
    }
    var CDF = function(mu, sigma, val){// Calculates value of p(x <= val) for given mu and sigma in a distribution
        var temp1 = (val-mu)/sigma;
        var temp = normalCDF(temp1);
        return temp;
    }
    var makeCDF = function(mu, sigma){// makes CDF to display for x or y
        var lb = mu-sigmaStep*sigma;
        var ub = mu+sigmaStep*sigma;
        var delta = Math.abs((ub-lb)/numPoints);
        var temp = [];
        for (i = 0; i < numPoints; i++){
            temp.push(CDF(mu, sigma, (lb+i*delta)));
        }
        return temp;
    }
    var normalCDF = function(X){//returns CDF value at X
        // using Hastings algorithm with maximal error=10^{-6}
        var T=1/(1+.2316419*Math.abs(X));
        var D=0.3989423*Math.exp(-X*X/2);
        var Prob=D*T*(.3193815+T*(-0.3565638+T*(1.781478+T*(-1.821256+T*1.330274))));
        if (X>0) {Prob=1-Prob;}
        return Prob;
    }
    var binormalCDF = function(x,y,Rh){//Returns bivariate cdf value of adjusted to (0,1) Norm Dist X and Y
        with (Math){
            var s=(1-normalCDF(x))*(1-normalCDF(y));
            var sqr2pi=sqrt(2*PI);
            var h0=exp(-x*x/2)/sqr2pi;
            var k0=exp(-y*y/2)/sqr2pi;
            var h1=-x*h0;
            var k1=-y*k0;
            var factor=Rh*Rh/2;
            s=s+Rh*h0*k0+factor*h1*k1;
            var n=2;
            while ((n*(1-abs(Rh))<5)&&(n<101)) {
                factor=factor*Rh/(n+1);
                h2=-x*h1-(n-1)*h0;
                k2=-y*k1-(n-1)*k0;
                s=s+factor*h2*k2;
                h0=h1;
                k0=k1;
                h1=h2;
                k1=k2;
                n=n+1;
            }
            var v=0;
            if (Rh>.95) {
                v=1-normalCDF(max(h,k))
                s=v+20*(s-v)*(1-Rh);
            } else if ((Rh<-.95)&&(h+k<0)) {
                v=abs(normalCDF(h)-normalCDF(k))
                s=v+20*(s-v)*(1+Rh);
            }
        }
        return s;
    }
    var BVN = function(X,Y) {// Returns bivariate cdf value for a given X and Y
        var Prob=0;
        h=-(X-mux)/sigmax;
        k=-(Y-muy)/sigmay;   
        Prob=binormalCDF(h,k,rho);
        Prob=Math.round(100000*Prob)/100000;
        return(Prob);
    }
    var getDist = function(val, dir){//requires mu/sigma of x or y, val = value of y or x at which to take distribution from, dir = 0 for x, 1 for y
        //Gets the row/col at a particular point from f(x,y)
        var min = 0;var max = 0;var delta = 0;
        if(dir == 1){
            min = t1[0];
            max = t1[t1.length - 1];
            delta = t1[1]-t1[0];
        }
        else{
            min = t2[0];
            max = t2[t2.length - 1];
            delta = t2[1]-t2[0];
        }
        if(val <= min && dir == 1){return z[0];}
        if(val <= min){return getCol(0);}
        if(val >= max && dir == 1){return z[t1.length-1];}
        if(val >= max){return getCol(t2.length-1);}
        var loc = Math.floor((val-min)/delta);//fix
        if(dir == 1){return z[loc];}
        return getCol(loc);
    }
    var getCol = function(col){//Returns a column from f(x,y)
        var temp = [];
        for (var i = 0; i < numPoints; i++){
            temp.push(z[i][col]);
        }
        return temp;
    }
    var updateOutput = function(txt){
        output.unshift(txt);
        $('#pout').replaceWith('<textarea id="pout" readonly>' + output.join("\n") + '</textarea>');
    }
    var makefuncut = function(time, dist, min, max){//Makes a cut version of the 1D function for the display
        var temp = [];
        for (var i = 0; i < time.length; i++){
            if(time[i] >= min && time[i] <= max){
                temp.push(dist[i]);
            }
            else{temp.push(0);}
        }
        return temp;
    }
    var updateGraph = function(opt){// Core function, coordinates other functions based on the radio selected
        switch (opt){
            case 0:// Marginal of X
                var temp = makefuncut(t1, x, xmin, xmax);
                drawData(t1, x, temp, 'X', 'P(x=X)');
                out = CDF(mux, sigmax, xmax) - CDF(mux, sigmax, xmin);
                updateOutput('P(' + xmin + ' < X < ' + xmax + ') = ' + out.toFixed(3));
                break;
            case 1:// Marginal of Y
                var temp = makefuncut(t2, y, ymin, ymax);
                drawData(t2, y, temp, 'Y', 'P(y=Y)');
                out = CDF(muy, sigmay, ymax) - CDF(muy, sigmay, ymin);
                $('#pout').replaceWith('P(' + ymin + ' < Y < ' + ymax + ') = ' + out.toFixed(3));
                break;
            case 2:// p(X|Y=ymin)
                c = getDist(ymin, 0);
                var temp = makefuncut(t1, c, xmin, xmax);
                drawData(t1, c, temp, 'X', 'P(x=X|Y=Ymin)');
                out = CDF((mux + rho*(sigmax/sigmay)*(ymin-muy)), sigmax*Math.sqrt(1-rho*rho), xmax) - CDF((mux + rho*(sigmax/sigmay)*(ymin-muy)), sigmax*Math.sqrt(1-rho*rho), xmin);
                updateOutput('P(' + xmin + ' < X < ' + xmax + ' | Y = ' + ymin + ') = ' + out.toFixed(3));
                break;
            case 3:// p(X|Y=max)
                c = getDist(ymax, 0);
                var temp = makefuncut(t1, c, xmin, xmax);
                drawData(t1, c, temp, 'X', 'P(x=X|Y=Ymax)');
                out = CDF((mux + rho*(sigmax/sigmay)*(ymax-muy)), sigmax*Math.sqrt(1-rho*rho), xmax) - CDF((mux + rho*(sigmax/sigmay)*(ymax-muy)), sigmax*Math.sqrt(1-rho*rho), xmin);
                updateOutput('P(' + xmin + ' < X < ' + xmax + ' | Y = ' + ymax + ') = ' + out.toFixed(3));
                break;
            case 4:// p(Y|X=min)
                c = getDist(xmin, 1);
                var temp = makefuncut(t2, c, ymin, ymax);
                drawData(t2, c, temp, 'Y', 'P(y=Y|X=Xmin)');
                out = CDF((muy + rho*(sigmay/sigmax)*(xmin-mux)), sigmay*Math.sqrt(1-rho*rho), ymax) - CDF((muy + rho*(sigmay/sigmax)*(xmin-mux)), sigmay*Math.sqrt(1-rho*rho), ymin);
                updateOutput('P(' + ymin + ' < Y < ' + ymax + ' | X = ' + xmin + ') = ' + out.toFixed(3));
                break;
            case 5:// p(Y|X=max)
                c = getDist(xmax, 1);
                var temp = makefuncut(t2, c, ymin, ymax);
                drawData(t2, c, temp, 'Y', 'P(y=Y|X=Xmax)');
                out = CDF((muy + rho*(sigmay/sigmax)*(xmax-mux)), sigmay*Math.sqrt(1-rho*rho), ymax) - CDF((muy + rho*(sigmay/sigmax)*(xmax-mux)), sigmay*Math.sqrt(1-rho*rho), ymin);
                updateOutput('P(' + ymin + ' < Y < ' + ymax + ' | X = ' + xmax + ') = ' + out.toFixed(3));
                shadeIn(muy, sigmay, ymin, ymax);
                break;
            case 6:// CDF of X
                var cdf = makeCDF(mux, sigmax);
                var temp = makefuncut(t1, cdf, xmin, xmax);
                drawData(t1, cdf, temp, 'X', 'P(x≤X)');
                out = CDF(mux, sigmax, xmax) - CDF(mux, sigmax, xmin);
                updateOutput('P(' + xmin + ' < X < ' + xmax + ') = ' + out.toFixed(3));
                break;
            case 7:// CDF of Y
                var cdf = makeCDF(muy, sigmay);
                var temp = makefuncut(t2, cdf, ymin, ymax);
                drawData(t2, cdf, temp, 'Y', 'P(y≤Y)');
                out = CDF(muy, sigmay, ymax) - CDF(muy, sigmay, ymin);
                updateOutput('P(' + ymin + ' < Y < ' + ymax + ') = ' + out.toFixed(3));
                break;
        }
    }
    var drawData = function(time, fun, funcut, xt, yt){// Draws the data on canvas
        var data = [{
            x: time,
            y: fun,
            mode: 'lines',
            type: 'scatter',
            line: {color: 'rgb(0, 0, 255)'},
            name: ''
        },
        {
            x: time,
            y: funcut,
            fill: 'tozeroy',
            fillcolor: '#ffaaaa',
            type: 'scatter',
            line: {color: 'rgb(0, 0, 255)'},
            mode: 'none',
            name: '',
            hoverinfo:'none'
        }];
        var temp = [];
        for (var i = 0; i < time.length; i++){
            if(funcut[i] == 0){temp.push('rgb(255,255,255)')}
            else{temp.push('rgb(255,0,0)');}
        }
        var layout = {
            autosize: true,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0,
                pad: 0
            },
            xaxis: {
              title: xt,
              showticklabels: true,
            },
            yaxis: {
              title: yt,
            },
            showlegend: false,
            barmode: 'relative'
        };
        Plotly.newPlot('graph', data, layout);
        Plotly.relayout('graph', {'xaxis.autorange': true,'yaxis.autorange': true});
    }
    var doAll = function(){// Does everything
        old = [mux, muy, sigmax, sigmay, rho, xmin, xmax, ymin, ymax];
        mux = Number($('#mux').val());
        muy = Number($('#muy').val());
        sigmax = Number($('#six').val());
        sigmay = Number($('#siy').val());
        rho = Number($('#rho').val());
        xmin = Number($('#xmin').val());
        xmax = Number($('#xmax').val());
        ymin = Number($('#ymin').val());
        ymax = Number($('#ymax').val());
        des = Number($("input[name='1']:checked").val());
        des3d = Number($("input[name='2']:checked").val());
        check();
        var updating = checkUpdate();
        if(updating == 1){
            t1 = makeTea(mux,sigmax);
            t2 = makeTea(muy,sigmay);
            makeZ();
            x = getDist(mux,sigmax,mux,0);
            y = getDist(muy,sigmay,muy,1);
            maxx = Math.max(...x);
            maxy = Math.max(...y);
        }
        updateZCut();
        updateGraph(des);//Updates 2D Graph
        updatePlot();//Updates 3D Graph
        $('main').hide(1000);
        $('#backdim').hide(1000);
        settingsOpen = false
    }
                                                            //Buttons
    $('#close').click(function(){//X button
        doAll();
    })
    $('#backdim').click(function(){//Clicking outside the settings box
        doAll();
    })
    $(document).keyup(function(e){// Pressing Esc key
        if(e.which == 27 && settingsOpen) {
            doAll();
        }
    });
    $('#show').click(function(){//Shows the settings menu
        $('#backdim').show(1000);
        $('main').show(1000);
        settingsOpen = true;
    })
                                                            //3D model
    var updatePlot = function(){// Uses Plotly to generate a 3d plot
        var toPlot = [];
        if(des3d == 0){toPlot = zCut;}
        else{toPlot = zCDF}
        var data = [{
            x: t1,
            y: t2,
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
        t1 = makeTea(mux,sigmax);
        t2 = makeTea(muy,sigmay);
        makeZ();
        x = getDist(mux,sigmax,mux,0);
        y = getDist(muy,sigmay,muy,1);
        maxx = Math.max(...x);
        maxy = Math.max(...y);
        updateZCut();
        updateGraph(des);//Updates 2D Graph
        updatePlot();//Updates 3D Graph
        starting++;
    }
    initial();//running on load
})