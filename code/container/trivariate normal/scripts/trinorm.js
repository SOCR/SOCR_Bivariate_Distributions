$(document).ready(function(){
    /*
    How to add a new distribution:
    1. xdist comment - add number for distribution and the name for it
    2. Add name of distribution to distTitle
    3. Update the relevant sections in the check() function
    4. Copy the template function and change it up, rename it to a new function
        Note: do not use k for any new variable declaration, it is already in use
    5. Update the 2 switch statements in the doAll() function to call upon the new function created in step 4, using the case number in xdist comment section. Important: set all unused variables to 1!
    6. Update the 2 switch statements in the $(document).on('change') functions, using the case number in xdist comment section - these will change the input sections to match the distribution parameters. Important: set all unused inputs to N/A
    7. Add the distribution to the two <select> sections in index.html. Be sure to have the value match the number in the xdist comment section
    8. Add a <li id = "X"> with X matching the number in the xdist comment section to the <ul> section in the mainContainer section. Follow a similar style as in the previous list items
    */
                                                            // Variable declaration
    var fx = [];// Stores PDF for x
    var fy = [];// Stores PDF for y
    var fz = [];// Stores PDF for z
    var Fx = [];// Stores CDF for x
    var Fy = [];// Stores CDF for y
    var Fz = [];// Stores CDF for z
    var x = [];// time array for x
    var y = [];// time array for y
    var z = [];// time array for z
    var bxy = [];// Stores matrix for bxy(x,y)
    var bxyCut = [];// Stores matrix for f(x,y) between bounds
    var Bxy = [];// Stores matrix for CDF of bxy(x,y), or B(x,y)
    var bxz = [];// Stores matrix for bxz(x,z)
    var bxzCut = [];// Stores matrix for f(x,z) between bounds
    var Bxz = [];// Stores matrix for CDF of bxz(x,z), or B(x,z)
    var byz = [];// Stores matrix for byz(x,y)
    var byzCut = [];// Stores matrix for f(x,y) between bounds
    var Byz = [];// Stores matrix for CDF of byz(x,y), or B(x,y)
    var tri = [];// Stores the tensor for trivariate PDF
    var triCut = [];// Stores the tensor for trivariate PDF between bounds
    var Tri = [];// Stores the tensor for trivariate CDF
    var trimax = 0;// Stores the max value of the trivariate distribution
    var px1 = 0;// first parameter of distribution X
    var px2 = 1;// second parameter of distribution X
    var py1 = 0;// first parameter of distribution Y
    var py2 = 1;// second parameter of distribution Y
    var pz1 = 0;// first parameter of distribution Z
    var pz2 = 1;// second parameter of distribution Z
    var xmin = -4;// input value of x min
    var xmax = 4;// input value of x max
    var ymin = -4;// input value of y min
    var ymax = 4;// input value of y max
    var zmin = -4;// input value of z min
    var zmax = 4;// input value of z max
    var rhoxy = 0.5;// value of rho between x and y
    var rhoxz = 0.5;// value of rho between x and z
    var rhoyz = 0.5;// value of rho between y and z
    var cond1 = 0;// Bivariate Conditional probability variable 1 - xy|z, xz|y, yz|x
    var cond2 = 0;// Bivariate Conditional probability variable 2 - min/max
    var cond3 = 0;// Univariate Conditional probability variable 1 - x|yz, y|xz, z|xy
    var cond4 = 0;// Univariate Conditional probability variable 2 - xmin/xmax/ymin/ymax
    var cond5 = 0;// Univariate Conditional probability variable 3 - ymin/ymax/zmin/zmax
    var cond6 = 0;// Univariate Conditional probability variable 1 - x|, y|, z|
    var cond7 = 0;// Univariate Conditional probability variable 2 - xmin/xmax/ymin/ymax/zmin/zmax
    var iter = 0;
    var c = [];// conditional distribution stored here
    var C = [];// conditional CDF stored here
    var old = [];// stores old values of rho in case the user enters an incorrect one
    var numPoints = 100;// number of points per distribution, max = 500
    var sigmaStep = 5;// bounds how many sigmas away are the distributions calculated
    var out = 0;// value to be displayed in the P box
    var outtemp = [];// stores a temporary output text string
    var des = 0; //0 = marginal x, 1 = marginal y, 2 = marginal z, 3 = trivariate conditional, 4 = cdf x, 5 = cdf y, 6 = cdf z, 7 = bivariate conditional
    var des3d = 0;// 0 = XY PDF, 1 = XZ PDF, 2 = YZ PDF, 3 = XY CDF, 4 = XZ CDF, 5 = YZ CDF, 6 = Conditional bivariate
    var des4d = 0;// 0 = XYZ PDF, 1 = XYZ CDF
    var starting = 0;// used for initial settings to be displayed
    var output = [];// String array to store history of outputs
    var settingsOpen = false;// Logs if the settings menu is open
    var rulesOpen = false;// Logs of the rules window is open
    var pointsshown = 0;
    var pointstot = 0;
    var cutprob = 0;
    var flattitle = ['Marginal of X', 'Marginal of Y', 'Marginal of Z', [
    [['Conditional of X|Y = Ymin ∩ Z = Zmin', 'Conditional of X|Y = Ymin ∩ Z = Zmax'], ['Conditional of X|Y = Ymax ∩ Z = Zmin', 'Conditional of X|Y = Ymax ∩ Z = Zmax']],
    [['Conditional of Y|X = Xmin ∩ Z = Zmin', 'Conditional of Y|X = Xmin ∩ Z = Zmax'], ['Conditional of Y|X = Xmax ∩ Z = Zmin', 'Conditional of Y|X = Xmax ∩ Z = Zmax']],
    [['Conditional of Z|X = Xmin ∩ Y = Ymin', 'Conditional of Z|X = Xmin ∩ Y = Ymax'], ['Conditional of Z|X = Xmax ∩ Y = Ymin', 'Conditional of Z|X = Xmax ∩ Y = Ymax']]
    ],'CDF of X', 'CDF of Y', 'CDF of Z', [
    ['Conditional of X|Y = Ymin', 'Conditional of X|Y = Ymax', 'Conditional of X|Z = Zmin', 'Conditional of X|Z = Zmax'], 
    ['Conditional of Y|X = Xmin', 'Conditional of Y|X = Xmax', 'Conditional of Y|Z = Zmin', 'Conditional of Y|Z = Zmax'],
    ['Conditional of Z|X = Xmin', 'Conditional of Z|X = Xmax', 'Conditional of Z|Y = Ymin', 'Conditional of Z|Y = Ymax']]];// Stores the names of all 2d graphs
    // Stores the titles of all distributions, Update if any new ones are added
    var surftitle = ['Bivariate PDF: XY', 'Bivariate PDF: XZ', 'Bivariate PDF: YZ', 'Bivariate CDF: XY', 'Bivariate CDF: XZ', 'Bivariate CDF: YZ',[
    ['Conditional Bivariate PDF: XY|Z = Zmin', 'Conditional Bivariate PDF: XY|Z = Zmax'],
    ['Conditional Bivariate PDF: XZ|Y = Ymin', 'Conditional Bivariate PDF: XZ|Y = Ymax'],
    ['Conditional Bivariate PDF: YZ|X = Xmin', 'Conditional Bivariate PDF: YZ|X = Xmax']]];
    var trititle = ['Trivariate PDF', 'Trivariate CDF'];
                                                            //Functions
    var check = function(){// Checks if inputs are correct, if they are wrong it resets them to previously recorded values. Add the appropriate checks if more distributions are added
        //Rho
        if(rhoxy >= 1 || rhoxy < 0 || isNaN(rhoxy)){
            rhoxy = old[0];
            $('#rhoxy').replaceWith('<textarea id = "rhoxy" onfocus="this.select()" rows="1" maxlength="4">' + rhoxy + '</textarea>');
        }
        if(rhoxz >= 1 || rhoxz < 0 || isNaN(rhoxz)){
            rhoxz = old[1];
            $('#rhoxz').replaceWith('<textarea id = "rhoxz" onfocus="this.select()" rows="1" maxlength="4">' + rhoxz + '</textarea>');
        }
        if(rhoyz >= 1 || rhoyz < 0 || isNaN(rhoyz)){
            rhoyz = old[2];
            $('#rhoyz').replaceWith('<textarea id = "rhoyz" onfocus="this.select()" rows="1" maxlength="4">' + rhoyz + '</textarea>');
        }
                                                            //X
        //PX1
        if(isNaN(px1)){
            px1 = 0;
            $('#px1').replaceWith('<textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">' + px1 + '</textarea>');
        }
        //PX2
        if(isNaN(px2) || px2 <= 0){
            px2 = 1;
            $('#px2').replaceWith('<textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">' + px2 + '</textarea>');
        }
        //X min
        if(xmin >= xmax || isNaN(xmin)){
            xmin = 0;
            $('#xmin').replaceWith('<textarea id = "xmin" onfocus="this.select()" rows="1" maxlength="4">' + xmin + '</textarea>');
        }
        //X max
        if(xmin >= xmax || isNaN(xmax)){
            xmax = xmin + 5;
            $('#xmax').replaceWith('<textarea id = "xmax" onfocus="this.select()" rows="1" maxlength="4">' + xmax + '</textarea>');
        }

                                                            //Y

        //PY1
        if(isNaN(py1)){
            py1 = 0;
            $('#py1').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py1 + '</textarea>');
        }
        //PY2
        if(isNaN(py2) || py2 <= 0){
            py2 = 1;
            $('#py2').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py2 + '</textarea>');
        }
        //Y min
        if(ymin >= ymax || isNaN(ymin)){
            ymin = 0;
            $('#ymin').replaceWith('<textarea id = "ymin" onfocus="this.select()" rows="1" maxlength="4">' + ymin + '</textarea>');
        }
        //Y max
        if(ymin >= ymax || isNaN(ymax)){
            ymax = ymin + 5;
            $('#ymax').replaceWith('<textarea id = "ymax" onfocus="this.select()" rows="1" maxlength="4">' + ymax + '</textarea>');
        }

                                                            //Z

        //PZ1
        if(isNaN(pz1)){
            pz1 = 0;
            $('#pz1').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz1 + '</textarea>');
        }
        //PZ2
        if(isNaN(pz2) || pz2 <= 0){
            pz2 = 1;
            $('#pz2').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz2 + '</textarea>');
        }
        //Z min
        if(zmin >= zmax || isNaN(zmin)){
            zmin = 0;
            $('#zmin').replaceWith('<textarea id = "zmin" onfocus="this.select()" rows="1" maxlength="4">' + zmin + '</textarea>');
        }
        //Z max
        if(zmin >= zmax || isNaN(zmax)){
            zmax = zmin + 5;
            $('#zmax').replaceWith('<textarea id = "zmax" onfocus="this.select()" rows="1" maxlength="4">' + zmax + '</textarea>');
        }
    }
                                                            //Distributions
    var normal = function(des){//Normal
        var t = [];
        var f = [];
        var F = [];
        var mu = 0;
        var sigma = 0;
        if(des == 0){mu = px1;sigma = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){mu = py1;sigma = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){mu = pz1;sigma = pz2;z = [];fz = [];Fz = [];}
        var start = mu-sigmaStep*sigma;
        var end = mu+sigmaStep*sigma;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new NormalDistribution(mu,sigma);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        //F = makeCDF(f, step);
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
                                                            //Bivariate making
    var erfi = function(inputX){//Inverse Error Function, code by Lance Pitt found on Stack Overflow: https://stackoverflow.com/questions/12556685/is-there-a-javascript-implementation-of-the-inverse-error-function-akin-to-matl
        var _a = ((8*(Math.PI - 3)) / ((3*Math.PI)*(4 - Math.PI)));
        var _x = parseFloat(inputX);
        var signX = ((_x < 0) ? -1.0 : 1.0 );
        var oneMinusXsquared = 1.0 - (_x * _x);
        var LNof1minusXsqrd  = Math.log( oneMinusXsquared );
        var PI_times_a       = Math.PI * _a ;
        var firstTerm  = Math.pow(((2.0 / PI_times_a) + (LNof1minusXsqrd / 2.0)), 2);
        var secondTerm = (LNof1minusXsqrd / _a);
        var thirdTerm  = ((2 / PI_times_a) + (LNof1minusXsqrd / 2.0));
        var primaryComp = Math.sqrt( Math.sqrt( firstTerm - secondTerm ) - thirdTerm );
        var scaled_R = signX * primaryComp ;
        return scaled_R ;
    }
    var makeB = function(choice){
        //making bxy,B
        var b = [];
        var B = [];
        var rho = 0;
        var max1 = 1;
        var max2 = 1;
        if (choice == 0){max1 = x.length;max2 = y.length;rho = rhoxy;}
        else if (choice == 1){max1 = x.length;max2 = z.length;rho = rhoxz;}
        else if (choice == 2){max1 = y.length;max2 = z.length;rho = rhoyz;}
        for (var i = 0; i < max1; i++){
            var temp3 = [];
            var temp5 = 0;
            for (var j = 0; j < max2; j++){
                if (choice == 0){
                    var zee = Math.pow((x[i]-px1)/px2,2) + Math.pow((y[j]-py1)/py2,2) - (2*rho*(x[i]-px1)*(y[j]-py1))/(px2*py2);
                    temp5 = (1/(2*Math.PI*px2*py2*Math.sqrt(1-rho*rho)))*Math.exp(-zee/(2*(1-rho*rho)));
                }
                else if (choice == 1){
                    var zee = Math.pow((x[i]-px1)/px2,2) + Math.pow((z[j]-pz1)/pz2,2) - (2*rho*(x[i]-px1)*(z[j]-pz1))/(px2*pz2);
                    temp5 = (1/(2*Math.PI*px2*pz2*Math.sqrt(1-rho*rho)))*Math.exp(-zee/(2*(1-rho*rho)));
                }
                else if (choice == 2){
                    var zee = Math.pow((y[i]-py1)/py2,2) + Math.pow((z[j]-pz1)/pz2,2) - (2*rho*(y[i]-py1)*(z[j]-pz1))/(py2*pz2);
                    temp5 = (1/(2*Math.PI*py2*pz2*Math.sqrt(1-rho*rho)))*Math.exp(-zee/(2*(1-rho*rho)));
                }
                if(temp5 < 0){temp5 = 0;}
                temp3.push(temp5);
            }
            b.push(temp3);
        }
        B = makeBigB(b, choice);
        bCut = makebCut(b, choice);
        if (choice == 0){bxy = b;bxyCut = bCut;Bxy = B;}
        else if (choice == 1){bxz = b;bxzCut = bCut;Bxz = B;}
        else if (choice == 2){byz = b;byzCut = bCut;Byz = B;}
    }
    var makeBigB = function(b, choice){//Makes CDF of bxy
        var temp = [];
        var temp1 = 0;
        var temp2 = [];
        var max1 = 1;
        var max2 = 1;
        var ret = [];
        if (choice == 0){max1 = x.length;max2 = y.length;}
        else if (choice == 1){max1 = x.length;max2 = z.length;}
        else if (choice == 2){max1 = y.length;max2 = z.length;}
        for (var j = 0; j < max2; j++){
            temp2.push(b[0][j]);
        }
        var temp3 = 0;
        for (var i = 0; i < max1; i++){
            temp = [];
            temp1 = 0;
            for (var j = 0; j < max2; j++){
                temp1 += b[i][j];
                temp2[j] += temp1;
                temp3 = temp2[j];
                temp.push(temp3);
            }
            ret.push(temp);
        }
        var scale = ret[max1-1][max2-1];
        for (var i = 0; i < max1; i++){
            for (var j = 0; j < max2; j++){
                ret[i][j] = ret[i][j]/scale;
            }
        }
        return ret;
    }
    var makebCut = function(b, choice){//makes a cut version of b, bounded by x and y min and max
        var max1 = 1;
        var max2 = 1;
        var ret = [];
        var amin = 0;
        var amax = 0;
        var bmin = 0;
        var bmax = 0;
        var moo = [];
        var baa = [];
        var t1 = "";
        var t2 = "";
        if (choice == 0){max1 = x.length;max2 = y.length;amin = xmin;amax = xmax;bmin = ymin;bmax = ymax;moo = x;baa = y;t1 = "X";t2 = "Y";}
        else if (choice == 1){max1 = x.length;max2 = z.length;amin = xmin;amax = xmax;bmin = zmin;bmax = zmax;moo = x;baa = z;t1 = "X";t2 = "Z";}
        else if (choice == 2){max1 = y.length;max2 = z.length;amin = ymin;amax = ymax;bmin = zmin;bmax = zmax;moo = y;baa = z;t1 = "Y";t2 = "Z";}
        for (var i = 0; i < max1; i++){
            var temp = [];
            for (var j = 0; j < max2; j++){
                if(moo[i] >= amin && moo[i] <= amax && baa[j] >= bmin && baa[j] <= bmax){temp.push(b[i][j]);}
                else{temp.push(0);}
            }
            ret.push(temp);
        }
        var temp1 = (sumMat(ret)/sumMat(b));
        if(isNaN(temp1)){temp1 = 0;}
        outtemp.push('P(' + amin + ' < ' + t1 + ' < ' + amax + ' ∩ ' + bmin + ' < ' + t2 + ' < ' + bmax + ') = ' + temp1.toFixed(3));
        return ret;
    }
    var sumMat = function(mat){//Sums a matrix
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
    var maketri = function(){//Makes Trivariate tensors
        tri = [];
        triCut = [];
        Tri = [];
        trimax = 0;
        var temp1 = [];
        var temp2 = [];
        var temp3 = [];
        var temp4 = [];
        var w = 0;
        var topush = 0;
        for (var i = 0; i < x.length; i++){
            temp1 = [];
            temp3 = [];
            for (var j = 0; j < y.length; j++){
                temp2 = [];
                temp4 = [];
                for (var k = 0; k < z.length; k++){
                    w = x[i]*x[i]*(rhoyz*rhoyz-1)+y[j]*y[j]*(rhoxz*rhoxz-1)+z[k]*z[k]*(rhoxy*rhoxy-1) + 2*(x[i]*y[j]*(rhoxy-rhoxz*rhoyz) + x[i]*z[k]*(rhoxz-rhoxy*rhoyz) + y[j]*z[k]*(rhoyz-rhoxy*rhoxz));
                    topush = Math.exp(-w/(2*(rhoyz*rhoyz + rhoxz*rhoxz + rhoxy*rhoxy - 2*rhoxy*rhoxz*rhoyz-1)))/(Math.sqrt(8)*Math.pow(Math.PI,1.5)*Math.sqrt(1 - rhoyz*rhoyz - rhoxz*rhoxz - rhoxy*rhoxy + 2*rhoxy*rhoxz*rhoyz));
                    temp2.push(topush);
                    if(topush > trimax){trimax = topush;}
                    if(x[i] < xmin || x[i] > xmax || y[j] < ymin || y[j] > ymax || z[k] < zmin || z[k] > zmax){temp4.push(0);}
                    else{temp4.push(topush);}
                }
                temp1.push(temp2);
                temp3.push(temp4);
            }
            tri.push(temp1);
            triCut.push(temp3);
        }
        makeTriBig();
        var yeet = sumMat3(triCut)/sumMat3(tri);
        if(isNaN(yeet)){yeet = 0;}
        updateOutput('P(' + xmin + ' < X < ' + xmax + ' ∩ ' + ymin + ' < Y < ' + ymax + ' ∩ ' + zmin + ' < Z < ' + zmax + ') = ' + yeet.toFixed(3));
    }
    var makeTriBig = function(){//Makes Trifariate CDF tensor
        var temp1 = [];
        var temp2 = [];
        var temp3 = [];
        var temp4 = 0;
        for (var k = 0; k < z.length; k++){
            temp1.push(tri[0][0][k]);
        }
        for (var i = 0; i < x.length; i++){
            temp2 = [];
            for (var j = 0; j < y.length;j++){
                temp3 = [];
                temp4 = 0;
                for (var k = 0; k < z.length; k++){
                    temp4 += tri[i][j][k];
                    temp1[k] += temp4;
                    temp3.push(temp1[k]);
                }
                temp2.push(temp3);
            }
            Tri.push(temp2);
        }
        var scale = Tri[x.length-1][y.length-1][z.length-1];
        for (var i = 0; i < x.length; i++){
            for (var j = 0; j < y.length; j++){
                for (var k = 0; k < z.length; k++){
                    Tri[i][j][k] = Tri[i][j][k]/scale;
                }
            }
        }
    }
    var sumMat3 = function(trimat){//Returns the sum of the 3D tensor
        var ret = 0;
        for (i = 0; i < x.length; i++){
            for (var j = 0; j < y.length; j++){
                for (var k = 0; k < z.length; k++){
                    ret += trimat[i][j][k];
                }
            }
        }
        return ret;
    }
                                                            //Auxillary functions
    var findCDF = function(t, F, val){//Finds value of CDF given a t and F array at at given value
        var min = t[0];
        var max = t[t.length-1];
        if(val <= min){return 0;}
        else if(val >= max){return 1;}
        var temp = (val-min)/((max-min)/(t.length-1));
        var temp1 = F[Math.floor(temp)];
        var temp2 = F[Math.ceil(temp)];
        if(temp1 < 0.0001 || temp2 < 0.0001){return 0;}
        var step1 = (Math.ceil(temp)-Math.floor(temp))/Math.floor(temp);
        var step2 = (temp2-temp1)/temp1;
        return temp1+step1*step2;
    }
    var scaleC = function(){
        var scale = C[C.length-1];
        for (var i = 0; i < C.length; i++){
            C[i] = C[i]/scale;
        }
    }
    var getDistTri = function(){//Gets the x/y/z array from trivariate tensor
        var xminloc = Math.floor((xmin-x[0])/(x[1]-x[0]));
        if(xminloc < 0){xminloc = 0;}
        else if(xminloc >= x.length){xminloc = x.length-1;}
        var xmaxloc = Math.floor((xmax-x[0])/(x[1]-x[0]));
        if(xmaxloc < 0){xmaxloc = 0;}
        else if(xmaxloc >= x.length){xmaxloc = x.length-1;}
        var yminloc = Math.floor((ymin-y[0])/(y[1]-y[0]));
        if(yminloc < 0){yminloc = 0;}
        else if(yminloc >= x.length){yminloc = x.length-1;}
        var ymaxloc = Math.floor((ymax-y[0])/(y[1]-y[0]));
        if(ymaxloc < 0){ymaxloc = 0;}
        else if(ymaxloc >= x.length){ymaxloc = x.length-1;}
        var zminloc = Math.floor((zmin-z[0])/(z[1]-z[0]));
        if(zminloc < 0){zminloc = 0;}
        else if(zminloc >= x.length){zminloc = x.length-1;}
        var zmaxloc = Math.floor((zmax-z[0])/(z[1]-z[0]));
        if(zmaxloc < 0){zmaxloc = 0;}
        else if(zmaxloc >= x.length){zmaxloc = x.length-1;}
        if(cond3 == 0 && cond4 == 0 && cond5 == 0){return getx(yminloc, zminloc)}
        else if(cond3 == 0 && cond4 == 0 && cond5 == 1){return getx(yminloc, zmaxloc)}
        else if(cond3 == 0 && cond4 == 1 && cond5 == 0){return getx(ymaxloc, zminloc)}
        else if(cond3 == 0 && cond4 == 1 && cond5 == 1){return getx(ymaxloc, zmaxloc)}
        else if(cond3 == 1 && cond4 == 0 && cond5 == 0){return gety(xminloc, zminloc)}
        else if(cond3 == 1 && cond4 == 0 && cond5 == 1){return gety(xminloc, zmaxloc)}
        else if(cond3 == 1 && cond4 == 1 && cond5 == 0){return gety(xmaxloc, zminloc)}
        else if(cond3 == 1 && cond4 == 1 && cond5 == 1){return gety(xmaxloc, zmaxloc)}
        else if(cond3 == 2 && cond4 == 0 && cond5 == 0){return tri[xminloc][yminloc]}
        else if(cond3 == 2 && cond4 == 0 && cond5 == 1){return tri[xminloc][ymaxloc]}
        else if(cond3 == 2 && cond4 == 1 && cond5 == 0){return tri[xmaxloc][yminloc]}
        else if(cond3 == 2 && cond4 == 1 && cond5 == 1){return tri[xmaxloc][ymaxloc]}
    }
    var getx = function(ypos, zpos){//Gets the x array from trivatiate tensor
        var temp = [];
        for (var i = 0; i < x.length; i++){
            temp.push(tri[i][ypos][zpos]);
        }
        return temp;
    }
    var gety = function(xpos, zpos){//Gets the y array from trivariate tensor
        var temp = [];
        for (var i = 0; i < y.length; i++){
            temp.push(tri[xpos][i][zpos]);
        }
        return temp;
    }
    var getDist = function(){//Gets array from a bivariate matrix
        var val = 0;
        var temp = [];
        var mat = [];
        var dir = 0;
        if(cond6 == 0 && cond7 == 0){mat = bxy;val = ymin;temp = y;dir = 1;}
        else if(cond6 == 0 && cond7 == 0){mat = bxy;val = ymax;temp = y;dir = 0;}
        else if(cond6 == 0 && cond7 == 1){mat = bxz;val = zmin;temp = z;dir = 1;}
        else if(cond6 == 0 && cond7 == 2){mat = bxz;val = zmax;temp = z;dir = 0;}
        else if(cond6 == 1 && cond7 == 0){mat = bxy;val = xmin;temp = x;dir = 1;}
        else if(cond6 == 1 && cond7 == 0){mat = bxy;val = xmax;temp = x;dir = 0;}
        else if(cond6 == 1 && cond7 == 1){mat = byz;val = zmin;temp = z;dir = 1;}
        else if(cond6 == 1 && cond7 == 2){mat = byz;val = zmax;temp = z;dir = 0;}
        else if(cond6 == 2 && cond7 == 0){mat = bxz;val = xmin;temp = x;dir = 1;}
        else if(cond6 == 2 && cond7 == 0){mat = bxz;val = xmax;temp = x;dir = 0;}
        else if(cond6 == 2 && cond7 == 1){mat = byz;val = ymin;temp = y;dir = 1;}
        else if(cond6 == 2 && cond7 == 2){mat = byz;val = ymax;temp = y;dir = 0;}
        var loc = Math.floor((val-temp[0])/(temp[1]-temp[0]));
        if(loc < 0){loc = 0;}
        else if(loc >= temp.length){loc = temp.length - 1;}
        return getArr(mat, loc, dir);
    }
    var getArr = function(mat, loc, dir){//Gets array from a given matrix in a given direction at a given location
        var temp = [];
        var end = 0;
        if(dir == 1){end = (mat[0]).length;}
        else{end = mat.length;}
        for (var i = 0; i < end; i++){
            if(dir == 0){temp.push(mat[i][loc]);}
            else{temp.push(mat[loc][i]);}
        }
        return temp;
    }
    var updateOutput = function(txt){//Updates the output box
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
    var updateGraph = function(){// Core function, coordinates other functions based on the radio selected
        switch (des){
            case 0:// Marginal of X
                var temp = makefuncut(x, fx, xmin, xmax);
                drawData(x, fx, temp, 'X', 'P(x=X)');
                out = findCDF(x, Fx, xmax) - findCDF(x, Fx, xmin);
                updateOutput('P(' + xmin + ' < X < ' + xmax + ') = ' + out.toFixed(3));
                break;
            case 1:// Marginal of Y
                var temp = makefuncut(y, fy, ymin, ymax);
                drawData(y, fy, temp, 'Y', 'P(y=Y)');
                out = findCDF(y, Fy, ymax) - findCDF(y, Fy, ymin);
                updateOutput('P(' + ymin + ' < Y < ' + ymax + ') = ' + out.toFixed(3));
                break;
            case 2:// Marginal of Z
                var temp = makefuncut(z, fz, zmin, zmax);
                drawData(z, fz, temp, 'Z', 'P(z=Z)');
                out = findCDF(z, Fz, zmax) - findCDF(z, Fz, zmin);
                updateOutput('P(' + zmin + ' < Z < ' + zmax + ') = ' + out.toFixed(3));
                break;
            case 3:// All Conditionals from trivariate
                c = getDistTri();
                var temp = makefuncut(x, c, xmin, xmax);
                C = makeCDF(c,x[1]-x[0]);
                scaleC();
                out = findCDF(x, C, xmax) - findCDF(x, C, xmin);
                var temp1 = [xmin + ' < X < ' + xmax, ymin + ' < Y < ' + ymax, zmin + ' < Z < ' + zmax];
                var temp2 = [[['Y = ' + ymin + ' ∩ Z = ' + zmin, 'Y = ' + ymin + ' ∩ Z = ' + zmax], ['Y = ' + ymax + ' ∩ Z = ' + zmin, 'Y = ' + ymax + ' ∩ Z = ' + zmax]],
                             [['X = ' + xmin + ' ∩ Z = ' + zmin, 'X = ' + xmin + ' ∩ Z = ' + zmax], ['X = ' + xmax + ' ∩ Z = ' + zmin, 'X = ' + xmax + ' ∩ Z = ' + zmax]],
                             [['X = ' + xmin + ' ∩ Y = ' + ymin, 'X = ' + xmin + ' ∩ Y = ' + ymax], ['X = ' + xmax + ' ∩ Y = ' + ymin, 'X = ' + xmax + ' ∩ Y = ' + ymax]]];
                updateOutput('P(' + temp1[cond3] + ' | ' + temp2[cond3][cond4][cond5] + ') = ' + out.toFixed(3));
                var temp3 = ['X', 'Y', 'Z'];
                var temp4 = ['x=X', 'y=Y', 'z=Z'];
                drawData(x, c, temp, temp3[cond3], 'P(' + temp4[cond3] + ' | ' + temp2[cond3][cond4][cond5] + ')');
                break;
            case 4:// CDF of X
                var temp = makefuncut(x, Fx, xmin, xmax);
                drawData(x, Fx, temp, 'X', 'P(x≤X)');
                out = findCDF(x, Fx, xmax) - findCDF(x, Fx, xmin);
                updateOutput('P(' + xmin + ' < X < ' + xmax + ') = ' + out.toFixed(3));
                break;
            case 5:// CDF of Y
                var temp = makefuncut(y, Fy, ymin, ymax);
                drawData(y, Fy, temp, 'Y', 'P(y≤Y)');
                out = findCDF(y, Fy, ymax) - findCDF(y, Fy, ymin);
                updateOutput('P(' + ymin + ' < Y < ' + ymax + ') = ' + out.toFixed(3));
                break;
            case 6:// CDF of Z
                var temp = makefuncut(z, Fz, zmin, zmax);
                drawData(z, Fz, temp, 'Z', 'P(z≤Z)');
                out = findCDF(z, Fz, zmax) - findCDF(z, Fz, zmin);
                updateOutput('P(' + zmin + ' < Z < ' + zmax + ') = ' + out.toFixed(3));
                break;
            case 7://All bivariate conditionals
                c = getDist();
                var temp = makefuncut(x, c, xmin, xmax);
                C = makeCDF(c,x[1]-x[0]);
                scaleC();
                out = findCDF(x, C, xmax) - findCDF(x, C, xmin);
                var temp1 = [xmin + ' < X < ' + xmax, ymin + ' < Y < ' + ymax, zmin + ' < Z < ' + zmax];
                var temp2 = [['Y = ' + ymin, 'Y = ' + ymax, 'Z = ' + zmin, 'Z = ' + zmax], ['X = ' + xmin, 'X = ' + xmax, 'Z = ' + zmin, 'Z = ' + zmax], ['X = ' + xmin, 'X = ' + xmax, 'Y = ' + ymin, 'Y = ' + ymax]];
                updateOutput('P(' + temp1[cond6] + ' | ' + temp2[cond6][cond7] + ') = ' + out.toFixed(3));
                var temp3 = ['X', 'Y', 'Z'];
                var temp4 = ['x=X', 'y=Y', 'z=Z'];
                drawData(x, c, temp, temp3[cond6], 'P(' + temp4[cond6] + ' | ' + temp2[cond6][cond7] + ')');
                break;
        }
    }
    var drawData = function(time, fun, funcut, xt, yt){// Draws the data on canvas
        var temp = [];
        for (var i = 0; i < time.length; i++){
            if(funcut[i] == 0){temp.push('rgb(255,255,255)')}
            else{temp.push('rgb(255,0,0)');}
        }
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
    var doAll = function(){//Does everything
        old = [rhoxy, rhoxz, rhoyz];
        px1 = Number($('#px1').val());
        px2 = Number($('#px2').val());
        py1 = Number($('#py1').val());
        py2 = Number($('#py2').val());
        pz1 = Number($('#pz1').val());
        pz2 = Number($('#pz2').val());
        rhoxy = Number($('#rhoxy').val());
        rhoxz = Number($('#rhoxz').val());
        rhoyz = Number($('#rhoyz').val());
        xmin = Number($('#xmin').val());
        xmax = Number($('#xmax').val());
        ymin = Number($('#ymin').val());
        ymax = Number($('#ymax').val());
        zmin = Number($('#zmin').val());
        zmax = Number($('#zmax').val());
        des = Number($("input[name='1']:checked").val());
        des3d = Number($("input[name='2']:checked").val());
        des4d = Number($("input[name='3']:checked").val());
        var temp = "";
        outtemp = [];
		$('#cond1 option:selected').each(function(){
			temp += $(this).val();
        });
        cond1 = Number(temp);
        temp = "";
		$('#cond2 option:selected').each(function(){
			temp += $(this).val();
        });
        cond2 = Number(temp);
        temp = "";
		$('#cond3 option:selected').each(function(){
			temp += $(this).val();
        });
        cond3 = Number(temp);
        temp = "";
		$('#cond4 option:selected').each(function(){
			temp += $(this).val();
        });
        cond4 = Number(temp);
        temp = "";
		$('#cond5 option:selected').each(function(){
			temp += $(this).val();
        });
        cond5 = Number(temp);
        temp = "";
		$('#cond6 option:selected').each(function(){
			temp += $(this).val();
        });
        cond6 = Number(temp);
        temp = "";
		$('#cond7 option:selected').each(function(){
			temp += $(this).val();
        });
        cond7 = Number(temp);
        normal(0);
        normal(1);
        normal(2);
        check();
        makeB(0);
        makeB(1);
        makeB(2);
        maketri();
        updateGraph();//Updates 2D Graph
        updatePlot();//Updates 3D Graph
        updateTriPlot();//Updates Trivariate plot
        updateTitles();
        var moo = 'Iteration ' + iter;
        updateOutput(moo);
        iter++;
        $('#trimax').replaceWith('<b id = "trimax">' + trimax.toFixed(3) + '</b>');
        $('#pointsshown').replaceWith('<b id = "pointsshown">' + pointsshown + '</b>');
        $('#pointstot').replaceWith('<b id = "pointstot">' + pointstot + '</b>');
        $('#cutprob').replaceWith('<b id = "cutprob">' + cutprob.toFixed(3) + '</b>');
        $('main').hide(1000);
        $('#backdim').hide(1000);
        settingsOpen = false;
    }
    var updateTitles = function(){//Updates graph titles
        if(des == 3){
            $('#flattitle').replaceWith('<h2 id = "flattitle">' + flattitle[des][cond3][cond4][cond5] + '</h2>');
        }
        else if(des == 7){
            $('#flattitle').replaceWith('<h2 id = "flattitle">' + flattitle[des][cond6][cond7] + '</h2>');
        }
        else{$('#flattitle').replaceWith('<h2 id = "flattitle">' + flattitle[des] + '</h2>');}
        if(des3d == 6){$('#surftitle').replaceWith('<h2 id = "surftitle">' + surftitle[des3d][cond1][cond2] + '</h2>');}
        else{$('#surftitle').replaceWith('<h2 id = "surftitle">' + surftitle[des3d] + '</h2>');}
        $('#trititle').replaceWith('<h2 id = "trititle">' + trititle[des4d] + '</h2>');
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
        if (settingsOpen){doAll();}
        else if(rulesOpen){$('#rules').hide(1000);$('#backdim').hide(1000);rulesOpen = false;}
    })
    $('#showR').click(function(){//Sgows the rules
        $('#backdim').show(1000);
        $('#rules').show(1000);
        rulesOpen = true;
    })
    $('#closeR').click(function(){//Does all the work updating everything
        $('#rules').hide(1000);
        $('#backdim').hide(1000);
        rulesOpen = false;
    })
    $(document).keyup(function(e){// Pressing Esc key
        if(e.which == 27 && settingsOpen) {
            doAll();
        }
        else if(e.which == 27 && rulesOpen){
            $('#rules').hide(1000);
            $('#backdim').hide(1000);
            rulesOpen = false;
        }
    });
    $(document).on('change', '#cond3', function(){//Updates conditions based on the user selected option
        var temp = "";
		$('#cond3 option:selected').each(function(){
			temp += $(this).val();
        })
        cond3 = Number(temp);
        if(cond3 == 0){
            $('#cond4').replaceWith('<select id = "cond4"><option value="0" selected>Y = Ymin</option><option value="1">Y = Ymax</option></select>');
            $('#cond5').replaceWith('<select id = "cond5"><option value="0" selected>Z = Zmin</option><option value="1">Z = Zmax</option></select>');
        }
        else if(cond3 == 1){
            $('#cond4').replaceWith('<select id = "cond4"><option value="0" selected>X = Xmin</option><option value="1">X = Xmax</option></select>');
            $('#cond5').replaceWith('<select id = "cond5"><option value="0" selected>Z = Zmin</option><option value="1">Z = Zmax</option></select>');
        }
        else{
            $('#cond4').replaceWith('<select id = "cond4"><option value="0" selected>X = Xmin</option><option value="1">X = Xmax</option></select>');
            $('#cond5').replaceWith('<select id = "cond5"><option value="0" selected>Y = Ymin</option><option value="1">Y = Ymax</option></select>');
        }
    })
    $(document).on('change', '#cond6', function(){//Updates conditions based on the user selected option
        var temp = "";
		$('#cond6 option:selected').each(function(){
			temp += $(this).val();
        })
        cond6 = Number(temp);
        if(cond6 == 0){
            $('#cond7').replaceWith('<select id = "cond7"><option value="0" selected>Y = Ymin</option><option value="1">Y = Ymax</option><option value="2">Z = Zmin</option><option value="3">Z = Zmax</option></select>');
        }
        else if(cond6 == 1){
            $('#cond7').replaceWith('<select id = "cond7"><option value="0" selected>X = Xmin</option><option value="1">X = Xmax</option><option value="2">Z = Zmin</option><option value="3">Z = Zmax</option></select>');
        }
        else{
            $('#cond7').replaceWith('<select id = "cond7"><option value="0" selected>X = Xmin</option><option value="1">X = Xmax</option><option value="2">Y = Ymin</option><option value="3">Y = Ymax</option></select>');
        }
    })
    
                                                            //3D models
    var updatePlot = function(){// Uses Plotly to generate a bivariate plot
        var data = [];
        var layout = {};
        if(des3d == 0){
            data = [{x: x,y: y,z: bxyCut,type: 'surface'}];
            updateOutput(outtemp[0]);
            layout ={
                autosize: true,
                margin: {l:0,r:0,b:0,t:0,pad:0},
                scene:{
                    xaxis:{title:{text:'X'}},
                    yaxis:{title:{text:'Y'}},
                    zaxis:{title:{text:'P(x=X ∩ y=Y)'}}
                }
            };
        }
        else if(des3d == 1){
            data = [{x: x,y: z,z: bxzCut,type: 'surface'}];
            updateOutput(outtemp[1]);
            layout ={
                autosize: true,
                margin: {l:0,r:0,b:0,t:0,pad:0},
                scene:{
                    xaxis:{title:{text:'X'}},
                    yaxis:{title:{text:'Z'}},
                    zaxis:{title:{text:'P(x=X ∩ z=Z)'}}
                }
            };
        }
        else if(des3d == 2){
            data = [{x: y,y: z,z: byzCut,type: 'surface'}];
            updateOutput(outtemp[2]);
            layout ={
                autosize: true,
                margin: {l:0,r:0,b:0,t:0,pad:0},
                scene:{
                    xaxis:{title:{text:'Y'}},
                    yaxis:{title:{text:'Z'}},
                    zaxis:{title:{text:'P(y=Y ∩ z=Z)'}}
                }
            };
        }
        else if(des3d == 3){
            data = [{x: x,y: y,z: Bxy,type: 'surface'}];
            updateOutput(outtemp[0]);
            layout ={
                autosize: true,
                margin: {l:0,r:0,b:0,t:0,pad:0},
                scene:{
                    xaxis:{title:{text:'X'}},
                    yaxis:{title:{text:'Y'}},
                    zaxis:{title:{text:'P(x≤X ∩ y≤Y)'}}
                }
            };
        }
        else if(des3d == 4){
            data = [{x: x,y: z,z: Bxz,type: 'surface'}];
            updateOutput(outtemp[1]);
            layout ={
                autosize: true,
                margin: {l:0,r:0,b:0,t:0,pad:0},
                scene:{
                    xaxis:{title:{text:'X'}},
                    yaxis:{title:{text:'Z'}},
                    zaxis:{title:{text:'P(x≤X ∩ z≤Z)'}}
                }
            };
        }
        else if(des3d == 5){
            data = [{x: y,y: z,z: Byz,type: 'surface'}];
            updateOutput(outtemp[2]);
            layout ={
                autosize: true,
                margin: {l:0,r:0,b:0,t:0,pad:0},
                scene:{
                    xaxis:{title:{text:'Y'}},
                    yaxis:{title:{text:'Z'}},
                    zaxis:{title:{text:'P(y≤Y ∩ z≤Z)'}}
                }
            };
        }
        else if(des3d == 6){
            var xout = [];
            var yout = [];
            if(cond1 == 0){xout = x; yout = y;}
            else if(cond1 == 1){xout = x; yout = z;}
            else{xout = y, yout = z;}
            var b = [];
            b = getbiv();
            data = [{x: xout,y: yout,z: b,type: 'surface'}];
            var temp1 = [['X', 'Y'], ['X', 'Z'], ['Y', 'Z']];
            var temp2 = [['P(x=X ∩ y=Y | Z=' + zmin, 'P(x=X ∩ y=Y | Z=' + zmax], ['P(x=X ∩ z=Z | Y=' + ymin, 'P(x=X ∩ z=Z | Y=' + ymax], ['P(y=Y ∩ z=Z | X=' + xmin, 'P(y=Y ∩ z=Z | X=' + xmax]];
            layout ={
                autosize: true,
                margin: {l:0,r:0,b:0,t:0,pad:0},
                scene:{
                    xaxis:{title:{text:temp1[cond1][0]}},
                    yaxis:{title:{text:temp1[cond1][1]}},
                    zaxis:{title:{text:temp2[cond1][cond2]}}
                }
            };
        }
        
        Plotly.newPlot('surfacePlot', data, layout);
        Plotly.restyle('surfacePlot', {showscale: false});
    }
    var getbiv = function(){//Gets the bivariate matrix from the trivariate tensor
        var xout = [];
        var yout = [];
        var pos = 0;
        if(cond1 == 0){
            xout = x;
            yout = y;
            if(cond2 == 0){pos = Math.floor((zmin-z[0])/(z[1]-z[0]));if(pos < 0){pos = 0}}
            else{pos = Math.floor((zmax-z[0])/(z[1]-z[0]));if(pos >= z.length){pos = z.length-1}}
        }
        else if(cond1 == 1){
            xout = x;
            yout = z;
            if(cond2 == 0){pos = Math.floor((ymin-y[0])/(y[1]-y[0]));if(pos < 0){pos = 0}}
            else{pos = Math.floor((ymax-y[0])/(y[1]-y[0]));if(pos >= y.length){pos = y.length-1}}
        }
        else{
            xout = y,
            yout = z;
            if(cond2 == 0){pos = Math.floor((xmin-x[0])/(x[1]-x[0]));if(pos < 0){pos = 0}}
            else{pos = Math.floor((ymax-x[0])/(x[1]-x[0]));if(pos >= x.length){pos = x.length-1}}
        }
        var temp = [];
        var temp2 = [];
        var temp1 = [];
        var temp3 = [];
        for (var i = 0; i < xout.length; i++){
            temp = [];
            temp2 = [];
            for (var j = 0; j < yout.length; j++){
                if(cond1 == 0){temp.push(triCut[i][j][pos]);temp2.push(tri[i][j][pos]);}
                else if(cond1 == 1){temp.push(triCut[i][pos][j]);temp2.push(tri[i][pos][j]);}
                else{temp.push(triCut[pos][i][j]);temp2.push(tri[pos][i][j]);}
            }
            temp1.push(temp);
            temp3.push(temp2);
        }
        var yeet = sumMat(temp1)/sumMat(temp3);
        if(cond1 == 0 && cond2 == 0){updateOutput('P(' + xmin + ' < X < ' + xmax + ' ∩ ' + ymin + ' < Y < ' + ymax + ' | Z = ' + zmin + ') = ' + yeet.toFixed(3) + '');}
        else if(cond1 == 0 && cond2 == 1){updateOutput('P(' + xmin + ' < X < ' + xmax + ' ∩ ' + ymin + ' < Y < ' + ymax + ' | Z = ' + zmax + ') = ' + yeet.toFixed(3) + '');}
        else if(cond1 == 1 && cond2 == 0){updateOutput('P(' + xmin + ' < X < ' + xmax + ' ∩ ' + zmin + ' < Z < ' + zmax + ' | Y = ' + ymin + ') = ' + yeet.toFixed(3) + '');}
        else if(cond1 == 1 && cond2 == 1){updateOutput('P(' + xmin + ' < X < ' + xmax + ' ∩ ' + zmin + ' < Z < ' + zmax + ' | Y = ' + ymax + ') = ' + yeet.toFixed(3) + '');}
        else if(cond1 == 2 && cond2 == 0){updateOutput('P(' + ymin + ' < Y < ' + ymax + ' ∩ ' + zmin + ' < Z < ' + zmax + ' | X = ' + xmin + ') = ' + yeet.toFixed(3) + '');}
        else if(cond1 == 2 && cond2 == 1){updateOutput('P(' + ymin + ' < Y < ' + ymax + ' ∩ ' + zmin + ' < Z < ' + zmax + ' | X = ' + xmax + ') = ' + yeet.toFixed(3) + '');}
        return temp1;
    }
    var updateTriPlot = function(){//Updates the trivariate plot using Plotly
        var xdisp = [];
        var ydisp = [];
        var zdisp = [];
        var colours = [];
        var temp = 0;
        var temp1 = "";
        for (i = 0; i < x.length; i++){
            for (var j = 0; j < y.length; j++){
                for (var k = 0; k < z.length; k++){
                    if(des4d == 0){temp = Math.round(255-255*triCut[i][j][k]/trimax);}
                    else{temp = Math.round(255-255*Tri[i][j][k]);}
                    temp1 = temp.toString();
                    if((temp < 250 && des4d == 0) || temp < 50){
                        xdisp.push(x[i]);
                        ydisp.push(y[j]);
                        zdisp.push(z[k]);
                        colours.push("rgb(" + 255 + "," + temp1 + "," + temp1 + ")");
                    }
                }
            }
        }
        data = [{
            x: xdisp,
            y: ydisp,
            z: zdisp,
            mode: 'markers',
            marker: {
                size: 1,
                symbol: 'circle',
                color: colours,
                opacity: 0.2
            },
            type: 'scatter3d'
        }];
        pointsshown = xdisp.length;
        pointstot = (x.length-1)*(y.length-1)*(z.length-1);
        if(des4d == 0){cutprob = 5*trimax/255;}
        else{cutprob = 205/255;}
        var layout = {
            scene:{
                xaxis:{title:{text:'X'},range:[px1-sigmaStep*px2,px1+sigmaStep*px2]},
                yaxis:{title:{text:'Y'},range:[py1-sigmaStep*py2,py1+sigmaStep*py2]},
                zaxis:{title:{text:'Z'},range:[pz1-sigmaStep*pz2,pz1+sigmaStep*pz2]},
                camera:{eye:{x:2,y:1,z:0.75}}
            },
            autosize: true,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0,
                pad: 0
            }
        };
        Plotly.newPlot('triPlot', data, layout);
    }
                                                            // On loading
    var initial = function(){// loads initial functions to be displayed
        if(starting != 0){return;}
        doAll();
        starting++;
    }
    initial();//running on load
    $('main').draggable();
                                                            // Testing button
    $('#test').click(function(){
        var temp69 = 0;
        for (var i = 0; i < c.length;i++){
            temp69 += c[i];
        }
        var temp420 = sumMat(b);
        alert(temp69/temp420);
        var min = x[0];
        var max = x[x.length-1];
        var val = xmin;
        var temp = (val-min)/((max-min)/x.length);
        var temp1 = fx[Math.floor(temp)];
        var temp2 = fx[Math.ceil(temp)];
        var step1 = (Math.ceil(temp)-Math.floor(temp))/Math.floor(temp);
        var step2 = (temp2-temp1)/temp1;
        alert(temp1+step1*step2);
        val = xmax;
        var temp = (val-min)/((max-min)/x.length);
        var temp1 = fx[Math.floor(temp)];
        var temp2 = fx[Math.ceil(temp)];
        var step1 = (Math.ceil(temp)-Math.floor(temp))/Math.floor(temp);
        var step2 = (temp2-temp1)/temp1;
        alert(temp1+step1*step2);
    })
})