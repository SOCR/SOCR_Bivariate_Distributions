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
    var xdist = 0;// Stores what type of distribution X is, 0 = normal, 1 = poisson, 2 = gamma, 3 = chi-sq, 4 = t-dist, 5 = f-dist, 6 = beta, 7 = weibull, 8 = pareto, 9 = logistic, 10 = log-normal, 11 = gumbel, 12 = uniform, 13 = birthday, 14 = u-quadratic, 15 = arcsine, 16 = semicircle, 17 = max walk, 18 = final pos walk, 19 = cauchy, 20 = hyperbolic secant, 21 = irwin-hall, 22 = laplace, 23 = benford-mantissa, 24 = exp-log, 25 = beta prime, 26 = zeta, 27 = loglogistic, 28 = maxwell-bolzmnan, 29 = logarithmic, 30 = binomial, 31 = neg binom, 32 = hypgeometric, 33 = polya, 34 = finite order, 35 = matching hats, 36 = triangle, 37 = coupon collector, 38 = benford digit, 39 = beta binom, 40 = beta neg binom
    var ydist = 0;// Stores what type of distribution Y is, values same as X
    var zdist = 0;// Stores what type of distribution Z is, values same as X
    var bxy = [];// Stores matrix for bxy(x,y)
    var bxyCut = [];// Stores matrix for f(x,y) between bounds
    var Bxy = [];// Stores matrix for CDF of bxy(x,y), or B(x,y)
    var bxz = [];// Stores matrix for bxy(x,z)
    var bxzCut = [];// Stores matrix for f(x,z) between bounds
    var Bxz = [];// Stores matrix for CDF of bxy(x,z), or B(x,z)
    var byz = [];// Stores matrix for bxy(x,y)
    var byzCut = [];// Stores matrix for f(x,y) between bounds
    var Byz = [];// Stores matrix for CDF of bxy(x,y), or B(x,y)
    var tri = [];// Stores the tensor for trivariate PDF
    var triCut = [];// Stores the tensor for trivariate PDF between bounds
    var Tri = [];// Stores the tensor for trivariate CDF
    var trimax = 0;// Stores the max value of the trivariate distribution
    //var kappa = 0;// stores value for k for FGM
    var px1 = 0;// first parameter of distribution X
    var px2 = 1;// second parameter of distribution X
    var px3 = 0;// third parameter of distribution X
    var px4 = 0;// fourth parameter of distribution X
    var py1 = 0;// first parameter of distribution Y
    var py2 = 1;// second parameter of distribution Y
    var py3 = 0;// third parameter of distribution Y
    var py4 = 0;// fourth parameter of distribution Y
    var pz1 = 0;// first parameter of distribution Z
    var pz2 = 1;// second parameter of distribution Z
    var pz3 = 0;// third parameter of distribution Z
    var pz4 = 0;// fourth parameter of distribution Z
    var xmin = -4;// input value of x min
    var xmax = 4;// input value of x max
    var ymin = -4;// input value of y min
    var ymax = 4;// input value of y max
    var zmin = -4;// input value of z min
    var zmax = 4;// input value of z max
    var rhoxy = 0.5;// value of rho between x and y
    var rhoxz = 0.5;// value of rho between x and z
    var rhoyz = 0.5;// value of rho between y and z
    var cond1 = 0;// Conditional probability variable 1 - x|y / x|z / y|x / y|z / z|x / z|y
    var cond2 = 0;// Conditional probability variable 2 - min/max
    var c = [];// conditional distribution stored here
    var C = [];// conditional CDF stored here
    var old = [];// stores old values of rho in case the user enters an incorrect one
    var des = 0; //0 = marginal x, 1 = marginal y, 2 = x|y at ymin, 3 = x|y at ymax, 4 = y|x at xmin, 5 = y|x at xmax, 6 = cdf x, 7 = cdf y
    var numPoints = 100;// number of points per distribution, max = 500
    var sigmaStep = 5;// bounds how many sigmas away are the distributions calculated
    var out = 0;// value to be displayed in the P box
    var outtemp = [];// stores a temporary output text string
    var des3d = 0;// 0 = bivariate PDF, 1 = bivariate CDF
    var starting = 0;// used for initial settings to be displayed
    var output = [];// String array to store history of outputs
    var settingsOpen = false;// Logs if the settings menu is open
    var rulesOpen = false;// Logs of the rules window is open
    var instructions = [10, 10, 10];// Logs what instructions are visible
    var flattitle = ['Marginal of X', 'Marginal of Y', 'Marginal of Z', [['Conditional of X|Y = Y<sub>min</sub>', 'Conditional of X|Y = Y<sub>max</sub>'], ['Conditional of X|Z = Z<sub>min</sub>', 'Conditional of X|Z = Z<sub>max</sub>'], ['Conditional of Y|X = X<sub>min</sub>', 'Conditional of Y|X = X<sub>max</sub>'], ['Conditional of Y|Z = Z<sub>min</sub>', 'Conditional of Y|Z = Z<sub>max</sub>'], ['Conditional of Z|X = X<sub>min</sub>', 'Conditional of Z|X = X<sub>max</sub>'], ['Conditional of Z|Y = Y<sub>min</sub>', 'Conditional of Z|Y = Y<sub>max</sub>']], 'CDF of X', 'CDF of Y', 'CDF of Z'];// Stores the names of all 2d graphs
    // Stores the titles of all distributions, Update if any new ones are added
    var distTitle = ['Normal', 'Poisson', 'Gamma', 'Chi-Square', "Student's T", 'F-distribution', 'Beta', 'Weibull', 'Pareto', 'Logistic', 'Log-normal', 'Gumbel', 'Uniform', 'Birthday', 'U-Quadratic', 'Arcsine', 'Semicircle', 'Max Distane Walked', 'Final Position on a Walk', 'Cauchy', 'Hyperbolic Secant', 'Irwin-Hall', 'Laplace', 'Benford-Mantissa', 'Exponential-Logarithmic', 'Beta Prime', 'Zeta', 'Log Logistic', 'Maxwell-Boltzmann', 'Logarithmic', 'Binomial', 'Negative Binomial', 'Hypergeometric', 'Polya', 'Finite Order', 'Matching Hats', 'Trianglular', 'Coupon Collector', "Benford's Digit", 'Beta Binomial', 'Beta Negative Binomial'];
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
        else if(px1 <= 0 && (xdist == 1 || xdist == 2 || xdist == 3 || xdist == 4 || xdist == 5 || xdist == 6 || xdist == 7 || xdist == 8 || xdist == 13 || xdist == 16 || xdist == 17 || xdist == 18 || xdist == 19 || xdist == 21 || xdist == 25 || xdist == 27 || xdist == 28 || xdist == 32 || xdist == 33 || xdist == 34 || xdist == 37 || xdist == 39 || xdist == 40)){
            px1 = 1;
            $('#px1').replaceWith('<textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">' + px1 + '</textarea>');
        }
        else if((px1 <= 0 || px1 >= 1) && (xdist == 24 || xdist == 29 || xdist == 30 || xdist == 31)){
            px1 = 0.5;
            $('#px1').replaceWith('<textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">' + px1 + '</textarea>');
        }
        else if(px1 <= 1 && (xdist == 26 || xdist == 23 || xdist == 35 || xdist == 38)){
            px1 = 2;
            $('#px1').replaceWith('<textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">' + px1 + '</textarea>');
        }
        //PX2
        if(isNaN(px2) || (px2 <= 0 && (xdist == 0 || xdist == 2 || xdist == 5 || xdist == 6 || xdist == 7 || xdist == 8 || xdist == 9 || xdist == 10 || xdist == 11 || xdist == 13 || xdist == 20 || xdist == 22 || xdist == 24 || xdist == 25 || xdist == 27 || xdist == 30 || xdist == 31 || xdist == 37 || xdist == 39))){
            px2 = 1;
            $('#px2').replaceWith('<textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">' + px2 + '</textarea>');
        }
        else if((xdist == 12 || xdist == 14) && px1 >= px2){
            px2 = px1 + 5;
            $('#px2').replaceWith('<textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">' + px2 + '</textarea>');
        }
        else if((xdist == 32 || xdist == 34 || xdist == 37) && px2 > px1){
            px2 = px1;
            $('#px2').replaceWith('<textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">' + px2 + '</textarea>');
        }
        else if(xdist == 36 && px2 < px1){
            px2 = px1+1;
            $('#px2').replaceWith('<textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">' + px2 + '</textarea>');
        }
        else if(xdist == 40 && px2 <= 2){
            px2 = 3;
            $('#px2').replaceWith('<textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">' + px2 + '</textarea>');
        }
        else if(xdist == 33 && (px2 < 0 || px2 > 1)){
            px2 = 0.5;
            $('#px2').replaceWith('<textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">' + px2 + '</textarea>');
        }
        //PX3
        if((xdist == 32) && px3 > px1){
            px3 = px1;
            $('#px3').replaceWith('<textarea id = "px3" onfocus="this.select()" rows="1" maxlength="4">' + px3 + '</textarea>');
        }
        else if(xdist == 34 && px3 > px2){
            px3 = px2;
            $('#px3').replaceWith('<textarea id = "px3" onfocus="this.select()" rows="1" maxlength="4">' + px3 + '</textarea>');
        }
        else if(xdist == 36 && (px3 < px1 || px3 > px2)){
            px3 = (px1+px2)/2;
            $('#px3').replaceWith('<textarea id = "px3" onfocus="this.select()" rows="1" maxlength="4">' + px3 + '</textarea>');
        }
        else if(px3 <= 0 && (xdist == 39 || xdist == 40)){
            px3 = 1;
            $('#px3').replaceWith('<textarea id = "px3" onfocus="this.select()" rows="1" maxlength="4">' + px3 + '</textarea>');
        }
        //PX4
        if((xdist == 32) && px4 > px1){
            px4 = px1;
            $('#px4').replaceWith('<textarea id = "px4" onfocus="this.select()" rows="1" maxlength="4">' + px4 + '</textarea>');
        }
        //X min
        if(xmin >= xmax || isNaN(xmin) || (xmin < 0 && (xdist == 1 || xdist == 2 || xdist == 3 || xdist == 5 || xdist == 7 || xdist == 8 || xdist == 10 || xdist == 13 || xdist == 15 || xdist == 17 || xdist == 18 || xdist == 21 || xdist == 23 || xdist == 25 || xdist == 26 || xdist == 27 || xdist == 28 || xdist == 29 || xdist == 30 || xdist == 31 || xdist == 32 || xdist == 33 || xdist == 34 || xdist == 35 || xdist == 37 || xdist == 38 || xdist == 39 || xdist == 40))){
            xmin = 0;
            $('#xmin').replaceWith('<textarea id = "xmin" onfocus="this.select()" rows="1" maxlength="4">' + xmin + '</textarea>');
        }
        else if(xmin < px1-2 && xdist == 12){
            xmin = px1-2;
            $('#xmin').replaceWith('<textarea id = "xmin" onfocus="this.select()" rows="1" maxlength="4">' + xmin + '</textarea>');
        }
        //X max
        if(xmin >= xmax || isNaN(xmax) || (xmax < 0 && (xdist == 1 || xdist == 2 || xdist == 3 || xdist == 5 || xdist == 7 || xdist == 8 || xdist == 10 || xdist == 13 || xdist == 17 || xdist == 18 || xdist == 21 || xdist == 23 || xdist == 25 || xdist == 26 || xdist == 27 || xdist == 28 || xdist == 29 || xdist == 30 || xdist == 31 || xdist == 32 || xdist == 33 || xdist == 34 || xdist == 35 || xdist == 37 || xdist == 38 || xdist == 39 || xdist == 40))){
            xmax = xmin + 5;
            $('#xmax').replaceWith('<textarea id = "xmax" onfocus="this.select()" rows="1" maxlength="4">' + xmax + '</textarea>');
        }
        else if(xmax > 1 && (xdist == 6 || xdist == 15)){
            xmax = 1;
            $('#xmax').replaceWith('<textarea id = "xmax" onfocus="this.select()" rows="1" maxlength="4">' + xmax + '</textarea>');
        }
        else if(xmax > px2+2 && xdist == 12){
            xmax = px2+2;
            $('#xmax').replaceWith('<textarea id = "xmax" onfocus="this.select()" rows="1" maxlength="4">' + xmax + '</textarea>');
        }

                                                            //Y

        //PY1
        if(isNaN(py1)){
            py1 = 0;
            $('#py1').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py1 + '</textarea>');
        }
        else if(py1 <= 0 && (ydist == 1 || ydist == 2 || ydist == 3 ||  ydist == 4 ||  ydist == 5 ||  ydist == 6 ||  ydist == 7 ||  ydist == 8 ||  ydist == 13 ||  ydist == 16 ||  ydist == 17 ||  ydist == 18 || ydist == 19 ||  ydist == 21 || ydist == 25 || ydist == 27 || ydist == 28 || ydist == 32 || ydist == 33 || ydist == 34 || ydist == 37 || ydist == 39 ||  ydist == 40)){
            py1 = 1;
            $('#py1').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py1 + '</textarea>');
        }
        else if((py1 <= 0 || py1 >= 1) && (ydist == 24 || ydist == 29 || ydist == 30 || ydist == 31)){
            py1 = 0.5;
            $('#py1').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py1 + '</textarea>');
        }
        else if(py1 <= 1 && (ydist == 26 || ydist == 23 || ydist == 35 || ydist == 38)){
            py1 = 2;
            $('#py1').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py1 + '</textarea>');
        }
        //PY2
        if(isNaN(py2) || (py2 <= 0 && (ydist == 0 || ydist == 2 || ydist == 5 || ydist == 6 || ydist == 7 || ydist == 8 || ydist == 9 || ydist == 10 || ydist == 11 || ydist == 13 || ydist == 20 || ydist == 22 || ydist == 24 || ydist == 25 || ydist == 27 || ydist == 30 || ydist == 31 || ydist == 37 || ydist == 39))){
            py2 = 1;
            $('#py2').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py2 + '</textarea>');
        }
        else if((ydist == 12 || ydist == 14) && py1 >= py2){
            py2 = py1 + 5;
            $('#py2').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py2 + '</textarea>');
        }
        else if((ydist == 32 || ydist == 34 || ydist == 37) && py2 > py1){
            py2 = py1;
            $('#py2').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py2 + '</textarea>');
        }
        else if(py2 < py1 && ydist == 36){
            py2 = py1+1;
            $('#py2').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py2 + '</textarea>');
        }
        else if(py2 <= 2 && ydist == 40){
            py2 = 3;
            $('#py2').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py2 + '</textarea>');
        }
        else if(ydist == 33 && (py2 < 0 || py2 > 1)){
            py2 = 0.5;
            $('#py2').replaceWith('<textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">' + py2 + '</textarea>');
        }
        //PY3
        if((ydist == 32) && py3 > py1){
            py3 = py1;
            $('#py3').replaceWith('<textarea id = "py3" onfocus="this.select()" rows="1" maxlength="4">' + py3 + '</textarea>');
        }
        else if(ydist == 34 && py3 > py2){
            py3 = py2;
            $('#py3').replaceWith('<textarea id = "py3" onfocus="this.select()" rows="1" maxlength="4">' + py3 + '</textarea>');
        }
        else if(ydist == 36 && (py3 < py1 || py3 > py2)){
            py3 = (py1+py2)/2;
            $('#py3').replaceWith('<textarea id = "py3" onfocus="this.select()" rows="1" maxlength="4">' + py3 + '</textarea>');
        }
        else if(py3 <= 0 && (ydist == 39 || ydist == 40)){
            py3 = 1;
            $('#py3').replaceWith('<textarea id = "py3" onfocus="this.select()" rows="1" maxlength="4">' + py3 + '</textarea>');
        }
        //PY4
        if((ydist == 32 || ydist == 33) && py4 > py1){
            py4 = py1;
            $('#py3').replaceWith('<textarea id = "py4" onfocus="this.select()" rows="1" maxlength="4">' + py4 + '</textarea>');
        }
        //Y min
        if(ymin >= ymax || isNaN(ymin) || (ymin < 0 && (ydist == 1 || ydist == 2 || ydist == 3 || ydist == 5 || ydist == 7 || ydist == 8 || ydist == 10 || ydist == 13 || ydist == 15 || ydist == 17 || ydist == 18 || ydist == 21 || ydist == 23 || ydist == 25 || ydist == 26 || ydist == 27 || ydist == 28 || ydist == 29 || ydist == 30 || ydist == 31 || ydist == 32 || ydist == 33 || ydist == 34 || ydist == 35 || ydist == 37 || ydist == 38 || ydist == 39 || ydist == 40))){
            ymin = 0;
            $('#ymin').replaceWith('<textarea id = "ymin" onfocus="this.select()" rows="1" maxlength="4">' + ymin + '</textarea>');
        }
        else if(ymin < py1-2 && ydist == 12){
            ymin = py1-2;
            $('#ymin').replaceWith('<textarea id = "ymin" onfocus="this.select()" rows="1" maxlength="4">' + ymin + '</textarea>');
        }
        //Y max
        if(ymin >= ymax || isNaN(ymax) || (ymax < 0 && (ydist == 1 || ydist == 2 || ydist == 3 || ydist == 5 || ydist == 7 || ydist == 8 || ydist == 10 || ydist == 13 || ydist == 17 || ydist == 18 || ydist == 21 || ydist == 23 || ydist == 25 || ydist == 26 || ydist == 27 || ydist == 28 || ydist == 29 || ydist == 30 || ydist == 31 || ydist == 32 || xdist == 33 || ydist == 34 || ydist == 35 || ydist == 37 || ydist == 38 || ydist == 39 || ydist == 40))){
            ymax = ymin + 5;
            $('#ymax').replaceWith('<textarea id = "ymax" onfocus="this.select()" rows="1" maxlength="4">' + ymax + '</textarea>');
        }
        else if(ymax > 1 && (ydist == 6 || ydist == 15)){
            ymax = 1;
            $('#ymax').replaceWith('<textarea id = "ymax" onfocus="this.select()" rows="1" maxlength="4">' + ymax + '</textarea>');
        }
        else if(ymax > py2+2 && ydist == 12){
            ymax = py2+2;
            $('#ymax').replaceWith('<textarea id = "ymax" onfocus="this.select()" rows="1" maxlength="4">' + ymax + '</textarea>');
        }

                                                            //Z

        //PZ1
        if(isNaN(pz1)){
            pz1 = 0;
            $('#pz1').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz1 + '</textarea>');
        }
        else if(pz1 <= 0 && (zdist == 1 || zdist == 2 || zdist == 3 ||  zdist == 4 ||  zdist == 5 ||  zdist == 6 ||  zdist == 7 ||  zdist == 8 ||  zdist == 13 ||  zdist == 16 ||  zdist == 17 ||  zdist == 18 || zdist == 19 ||  zdist == 21 || zdist == 25 || zdist == 27 || zdist == 28 || zdist == 32 || zdist == 33 || zdist == 34 || zdist == 37 || zdist == 39 ||  zdist == 40)){
            pz1 = 1;
            $('#pz1').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz1 + '</textarea>');
        }
        else if((pz1 <= 0 || pz1 >= 1) && (zdist == 24 || zdist == 29 || zdist == 30 || zdist == 31)){
            pz1 = 0.5;
            $('#pz1').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz1 + '</textarea>');
        }
        else if(pz1 <= 1 && (zdist == 26 || zdist == 23 || zdist == 35 || zdist == 38)){
            pz1 = 2;
            $('#pz1').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz1 + '</textarea>');
        }
        //PZ2
        if(isNaN(pz2) || (pz2 <= 0 && (zdist == 0 || zdist == 2 || zdist == 5 || zdist == 6 || zdist == 7 || zdist == 8 || zdist == 9 || zdist == 10 || zdist == 11 || zdist == 13 || zdist == 20 || zdist == 22 || zdist == 24 || zdist == 25 || zdist == 27 || zdist == 30 || zdist == 31 || zdist == 37 || zdist == 39))){
            pz2 = 1;
            $('#pz2').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz2 + '</textarea>');
        }
        else if((zdist == 12 || zdist == 14) && pz1 >= pz2){
            pz2 = pz1 + 5;
            $('#pz2').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz2 + '</textarea>');
        }
        else if((zdist == 32 || zdist == 34 || zdist == 37) && pz2 > pz1){
            pz2 = pz1;
            $('#pz2').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz2 + '</textarea>');
        }
        else if(pz2 < pz1 && zdist == 36){
            pz2 = pz1+1;
            $('#pz2').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz2 + '</textarea>');
        }
        else if(pz2 <= 2 && zdist == 40){
            pz2 = 3;
            $('#pz2').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz2 + '</textarea>');
        }
        else if(zdist == 33 && (pz2 < 0 || pz2 > 1)){
            pz2 = 0.5;
            $('#pz2').replaceWith('<textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">' + pz2 + '</textarea>');
        }
        //PZ3
        if((zdist == 32) && pz3 > pz1){
            pz3 = pz1;
            $('#pz3').replaceWith('<textarea id = "pz3" onfocus="this.select()" rows="1" maxlength="4">' + pz3 + '</textarea>');
        }
        else if(zdist == 34 && pz3 > pz2){
            pz3 = pz2;
            $('#pz3').replaceWith('<textarea id = "pz3" onfocus="this.select()" rows="1" maxlength="4">' + pz3 + '</textarea>');
        }
        else if(zdist == 36 && (pz3 < pz1 || pz3 > pz2)){
            pz3 = (pz1+pz2)/2;
            $('#pz3').replaceWith('<textarea id = "pz3" onfocus="this.select()" rows="1" maxlength="4">' + pz3 + '</textarea>');
        }
        else if(pz3 <= 0 && (zdist == 39 || zdist == 40)){
            pz3 = 1;
            $('#pz3').replaceWith('<textarea id = "pz3" onfocus="this.select()" rows="1" maxlength="4">' + pz3 + '</textarea>');
        }
        //PZ4
        if((zdist == 32 || zdist == 33) && pz4 > pz1){
            pz4 = pz1;
            $('#pz3').replaceWith('<textarea id = "pz4" onfocus="this.select()" rows="1" maxlength="4">' + pz4 + '</textarea>');
        }
        //Z min
        if(zmin >= zmax || isNaN(zmin) || (zmin < 0 && (zdist == 1 || zdist == 2 || zdist == 3 || zdist == 5 || zdist == 7 || zdist == 8 || zdist == 10 || zdist == 13 || zdist == 15 || zdist == 17 || zdist == 18 || zdist == 21 || zdist == 23 || zdist == 25 || zdist == 26 || zdist == 27 || zdist == 28 || zdist == 29 || zdist == 30 || zdist == 31 || zdist == 32 || zdist == 33 || zdist == 34 || zdist == 35 || zdist == 37 || zdist == 38 || zdist == 39 || zdist == 40))){
            zmin = 0;
            $('#zmin').replaceWith('<textarea id = "zmin" onfocus="this.select()" rows="1" maxlength="4">' + zmin + '</textarea>');
        }
        else if(zmin < pz1-2 && zdist == 12){
            zmin = pz1-2;
            $('#zmin').replaceWith('<textarea id = "zmin" onfocus="this.select()" rows="1" maxlength="4">' + zmin + '</textarea>');
        }
        //Z max
        if(zmin >= zmax || isNaN(zmax) || (zmax < 0 && (zdist == 1 || zdist == 2 || zdist == 3 || zdist == 5 || zdist == 7 || zdist == 8 || zdist == 10 || zdist == 13 || zdist == 17 || zdist == 18 || zdist == 21 || zdist == 23 || zdist == 25 || zdist == 26 || zdist == 27 || zdist == 28 || zdist == 29 || zdist == 30 || zdist == 31 || zdist == 32 || xdist == 33 || zdist == 34 || zdist == 35 || zdist == 37 || zdist == 38 || zdist == 39 || zdist == 40))){
            zmax = zmin + 5;
            $('#zmax').replaceWith('<textarea id = "zmax" onfocus="this.select()" rows="1" maxlength="4">' + zmax + '</textarea>');
        }
        else if(zmax > 1 && (zdist == 6 || zdist == 15)){
            zmax = 1;
            $('#zmax').replaceWith('<textarea id = "zmax" onfocus="this.select()" rows="1" maxlength="4">' + zmax + '</textarea>');
        }
        else if(zmax > pz2+2 && zdist == 12){
            zmax = pz2+2;
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
    var poisson = function(des){//Poisson
        var t = [];
        var f = [];
        var F = [];
        var lambda = 0;
        if(des == 0){lambda = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){lambda = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){lambda = pz1;z = [];fz = [];Fz = [];}
        var tempdist = new PoissonDistribution(lambda);
        for(var i = 0; i <= 30; i++){
            t.push(i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var gamma = function(des){//Gamma
        var t = [];
        var f = [];
        var F = [];
        var shape = 0;
        var scale = 0;
        if(des == 0){shape = px1;scale = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){shape = py1;scale = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){shape = pz1;scale = pz2;z = [];fz = [];Fz = [];}
        var start = 0;
        if(shape < 1){start = 0.01}
        var tempdist = new GammaDistribution(shape, scale);
        var end = tempdist.maxValue;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var chisq = function(des){//Chi-sq
        var t = [];
        var f = [];
        var F = [];
        var dof = 0;
        if(des == 0){dof = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){dof = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){dof = pz1;z = [];fz = [];Fz = [];}
        var start = 0;
        if(dof == 1){start = 0.01;}
        var tempdist = new ChiSquareDistribution(dof);
        var end = tempdist.maxValue;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var t = function(des){//Student's t-distribution
        var t = [];
        var f = [];
        var F = [];
        var dof = 0;
        if(des == 0){dof = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){dof = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){dof = pz1;z = [];fz = [];Fz = [];}
        var tempdist = new StudentDistribution(dof);
        var start = tempdist.minValue;
        var end = tempdist.maxValue;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var fdist = function(des){//F-distribution
        var t = [];
        var f = [];
        var F = [];
        var d1 = 0;
        var d2 = 0;
        if(des == 0){d1 = px1;d2 = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){d1 = py1;d2 = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){d1 = pz1;d2 = pz2;z = [];fz = [];Fz = [];}
        var start = 0;
        if(d1 == 1){start = 0.001;}
        var tempdist = new FDistribution(d1, d2);
        var end = tempdist.maxValue;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var beta = function(des){//Beta
        var t = [];
        var f = [];
        var F = [];
        var alpha = 0;
        var beta = 0;
        if(des == 0){alpha = px1;beta = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){alpha = py1;beta = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){alpha = pz1;beta = pz2;z = [];fz = [];Fz = [];}
        var start = 0;
        var end = 1;
        if(alpha < 1 || beta < 1){start = 0.0001; end = 0.9999;}
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new BetaDistribution(alpha, beta);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var weibull = function(des){//Weibull
        var t = [];
        var f = [];
        var F = [];
        var shape = 0;
        var scale = 0;
        if(des == 0){shape = px1;scale = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){shape = py1;scale = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){shape = pz1;scale = pz2;z = [];fz = [];Fz = [];}
        var start = 0;
        var tempdist = new WeibullDistribution(shape, scale);
        var end = tempdist.maxValue;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var pareto = function(des){//Pareto
        var t = [];
        var f = [];
        var F = [];
        var shape = 0;
        var scale = 0;
        if(des == 0){shape = px1;scale = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){shape = py1;scale = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){shape = pz1;scale = pz2;z = [];fz = [];Fz = [];}
        var start = scale;
        var end = scale+10;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new ParetoDistribution(shape, scale);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var logistic = function(des){//Logistic
        var t = [];
        var f = [];
        var F = [];
        var mu = 0;
        var s = 0;
        if(des == 0){mu = px1;s = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){mu = py1;s = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){mu = pz1;s = pz2;z = [];fz = [];Fz = [];}
        var tempdist = new LogisticDistribution(mu, s);
        var start = tempdist.minValue;
        var end = tempdist.maxValue;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var lognormal = function(des){//Log-normal
        var t = [];
        var f = [];
        var F = [];
        var mu = 0;
        var sigma = 0;
        if(des == 0){mu = px1;sigma = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){mu = py1;sigma = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){mu = pz1;sigma = pz2;z = [];fz = [];Fz = [];}
        var start = 0.001;
        var tempdist = new LogNormalDistribution(mu, sigma);
        var end = tempdist.maxValue;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var gumbel = function(des){//Gumbel
        var t = [];
        var f = [];
        var F = [];
        var mu = 0;
        var scale = 0;
        if(des == 0){mu = px1;scale = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){mu = py1;scale = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){mu = pz1;scale = pz2;z = [];fz = [];Fz = [];}
        var start = mu-sigmaStep*scale;
        var end = mu+sigmaStep*scale;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new ExtremeValueDistribution(mu, scale);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var uniform = function(des){//Uniform
        var t = [];
        var f = [];
        var F = [];
        var left = 0;
        var right = 0;
        if(des == 0){left = px1;right = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){left = py1;right = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){left = pz1;right = pz2;z = [];fz = [];Fz = [];}
        var start = left-2;
        var end = right+2;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new UniformDistribution(left, right);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var bday = function(des){//Birthday
        var t = [];
        var f = [];
        var F = [];
        var days = 0;
        var sample = 0;
        if(des == 0){days = px1;sample = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){days = py1;sample = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){days = pz1;sample = pz2;z = [];fz = [];Fz = [];}
        var end = Math.min(days,sample);
        var tempdist = new BirthdayDistribution(days, sample);
        for(var i = 0; i <= end; i++){
            t.push(Math.floor(i));
            if(tempdist.density(t[i]) == 0 && tempdist.density(t[i-1]) == 0){f.push(0)}
            else{f.push(tempdist.density(t[i]));}
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var arcsine = function(des){//Arcsine
        var t = [];
        var f = [];
        var F = [];
        if(des == 0){x = [];fx = [];Fx = [];}
        else if(des == 1){y = [];fy = [];Fy = [];}
        else if(des == 2){z = [];fz = [];Fz = [];}
        var start = 0.004;
        var end = 0.996;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new ArcsineDistribution();
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var semicircle = function(des){//Semicircle
        var t = [];
        var f = [];
        var F = [];
        var r = 0;
        if(des == 0){r = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){r = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){r = pz1;z = [];fz = [];Fz = [];}
        var start = -r;
        var end = r;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new SemiCircleDistribution(r);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var finalwalk = function(des){//Max distance on a walk
        var t = [];
        var f = [];
        var F = [];
        var n = 0;
        if(des == 0){n = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){n = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){n = pz1;z = [];fz = [];Fz = [];}
        var tempdist = new WalkMaxDistribution(n);
        for(var i = 0; i <= 5+n; i++){
            t.push(i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var maxwalk = function(des){//Final position on a walk
        var t = [];
        var f = [];
        var F = [];
        var n = 0;
        if(des == 0){n = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){n = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){n = pz1;z = [];fz = [];Fz = [];}
        var tempdist = new WalkPositionDistribution(n);
        for(var i = 0; i <= n+5; i++){
            t.push(i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var cauchy = function(des){//Cauchy
        var t = [];
        var f = [];
        var F = [];
        var scale = 0;
        if(des == 0){scale = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){scale = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){scale = pz1;z = [];fz = [];Fz = [];}
        var start = -sigmaStep*scale;
        var end = sigmaStep*scale;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new CauchyDistribution(scale);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var hypsec = function(des){//Hyperbolic Secant
        var t = [];
        var f = [];
        var F = [];
        var loc = 0;
        var scale = 0;
        if(des == 0){loc = px1;scale = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){loc = py1;scale = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){loc = pz1;scale = pz2;z = [];fz = [];Fz = [];}
        var start = loc-sigmaStep*scale;
        var end = loc+sigmaStep*scale;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new HyperbolicSecantDistribution(loc, scale);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var irwin = function(des){//Irwin-Hall
        var t = [];
        var f = [];
        var F = [];
        var term = 0;
        if(des == 0){term = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){term = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){term = pz1;z = [];fz = [];Fz = [];}
        var start = 0;
        var end = term;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new IrwinHallDistribution(term);
        for(var i = 0; i < numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var laplace = function(des){//Laplace
        var t = [];
        var f = [];
        var F = [];
        var loc = 0;
        var scale = 0;
        if(des == 0){loc = px1;scale = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){loc = py1;scale = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){loc = pz1;scale = pz2;z = [];fz = [];Fz = [];}
        var start = loc-sigmaStep*scale;
        var end = loc+sigmaStep*scale;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new LaplaceDistribution(loc, scale);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var benmat = function(des){//Benford-Mantissa
        var t = [];
        var f = [];
        var F = [];
        var beta = 0;
        if(des == 0){beta = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){beta = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){beta = pz1;z = [];fz = [];Fz = [];}
        var start = 0.1;
        var end = 1;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new BenfordMantissaDistribution(beta);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var explog = function(des){//Exponential-Logarithmic
        var t = [];
        var f = [];
        var F = [];
        var shape = 0;
        var scale = 0;
        if(des == 0){shape = px1;scale = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){shape = py1;scale = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){shape = pz1;scale = pz2;z = [];fz = [];Fz = [];}
        var start = 0;
        var end = 4/scale;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new ExponentialLogarithmicDistribution(shape, scale);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var betaprime = function(des){//Beta Prime
        var t = [];
        var f = [];
        var F = [];
        var a = 0;
        var beta = 0;
        if(des == 0){a = px1;beta = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){a = py1;beta = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){a = pz1;beta = pz2;z = [];fz = [];Fz = [];}
        var start = 0;
        if(a < 1){start = 0.01;}
        var tempdist = new BetaPrimeDistribution(a, beta);
        var end = tempdist.maxValue;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var zeta = function(des){//Zeta
        var t = [];
        var f = [];
        var F = [];
        var a = 0;
        if(des == 0){a = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){a = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){a = pz1;z = [];fz = [];Fz = [];}
        var tempdist = new ZetaDistribution(a);
        for(var i = 0; i <= 20; i++){
            t.push(i+1);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var loglogistic = function(des){//LogLogistic
        var t = [];
        var f = [];
        var F = [];
        var scale = 0;
        var shape = 0;
        if(des == 0){scale = px1;shape = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){scale = py1;shape = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){scale = pz1;shape = pz2;z = [];fz = [];Fz = [];}
        var start = 0;
        if(shape < 1){start = 0.001;}
        var tempdist = new LogLogisticDistribution(scale, shape);
        var end = tempdist.maxValue;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var maxwell = function(des){//Maxwell-Boltzman
        var t = [];
        var f = [];
        var F = [];
        var a = 0;
        if(des == 0){a = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){a = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){a = pz1;z = [];fz = [];Fz = [];}
        var start = 0;
        var end = 5*a;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new MaxwellBoltzmannDistribution(a);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var logdist = function(des){//Logarithmic
        var t = [];
        var f = [];
        var F = [];
        var p = 0;
        if(des == 0){p = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){p = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){p = pz1;z = [];fz = [];Fz = [];}
        var end = 5+Math.floor(p*10);
        var tempdist = new LogarithmicDistribution(p);
        for(var i = 0; i <= end; i++){
            t.push(i+1);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var uquad = function(des){//U-Quadratic
        var t = [];
        var f = [];
        var F = [];
        var a = 0;
        var beta = 0;
        if(des == 0){a = px1;beta = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){a = py1;beta = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){a = pz1;beta = pz2;z = [];fz = [];Fz = [];}
        var start = a;
        var end = beta;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new UQuadraticDistribution(a, beta);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var binom = function(des){//Binomial
        var t = [];
        var f = [];
        var F = [];
        var trial = 0;
        var prob = 0;
        if(des == 0){trial = px2;prob = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){trial = py2;prob = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){trial = pz2;prob = pz1;z = [];fz = [];Fz = [];}
        var tempdist = new BinomialDistribution(trial, prob);
        for(var i = 0; i <= trial; i++){
            t.push(i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var negbinom = function(des){//Negative Binomial
        var t = [];
        var f = [];
        var F = [];
        var kay = 0;
        var p = 0;
        if(des == 0){p = px1;kay = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){p = py1;kay = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){p = pz1;kay = pz2;z = [];fz = [];Fz = [];}
        var tempdist = new NegativeBinomialDistribution(kay, p);
        var end = tempdist.maxValue;
        for(var i = 0; i <= end-kay; i++){
            t.push(i+kay);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var hypgeo = function(des){//Hypergeometric
        var t = [];
        var f = [];
        var F = [];
        var bign = 0;
        var kay = 0;
        var littlen = 0;
        if(des == 0){bign = px1;kay = px2;littlen = px3;x = [];fx = [];Fx = [];}
        else if(des == 1){bign = py1;kay = py2;littlen = py3;y = [];fy = [];Fy = [];}
        else if(des == 2){bign = pz1;kay = pz2;littlen = pz3;z = [];fz = [];Fz = [];}
        var start = Math.max(...[0, littlen + kay - bign]);
        var end = Math.min(...[kay, littlen]);
        var tempdist = new HypergeometricDistribution(bign, kay, littlen);
        for(var i = 0; i < end-start; i++){
            t.push(i+start);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var polya = function(des){//Polya
        var t = [];
        var f = [];
        var F = [];
        var r = 0;
        var p = 0;
        if(des == 0){r = px1;p = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){r = py1;p = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){r = pz1;p = pz2;z = [];fz = [];Fz = [];}
        var tempdist = new PolyaDistribution(r, p);
        for(var i = 0; i <= tempdist.maxValue-r; i++){
            t.push(i+r);
            f.push(tempdist.density(t[i]));
        }
        F = makeCDF(f, 1);
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var finiteorder = function(des){//Finite Order
        var t = [];
        var f = [];
        var F = [];
        var m = 0;
        var n = 0;
        var kay = 0;
        if(des == 0){m = px1;n = px2;kay = px3;x = [];fx = [];Fx = [];}
        else if(des == 1){m = py1;n = py2;y = [];kay = py3;fy = [];Fy = [];}
        else if(des == 2){m = pz1;n = pz2;z = [];kay = pz3;fz = [];Fz = [];}
        var tempdist = new FiniteOrderStatistic(m, n, kay);
        for(var i = 0; i <= (m-n+1-kay); i++){
            t.push(i+kay);
            f.push(tempdist.density(t[i]));
        }
        F = makeCDF(f, 1);
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var matching = function(des){//Matching hats
        var t = [];
        var f = [];
        var F = [];
        var hat = 0;
        if(des == 0){hat = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){hat = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){hat = pz1;z = [];fz = [];Fz = [];}
        var tempdist = new MatchDistribution(hat);
        for(var i = 0; i <= hat; i++){
            t.push(i);
            f.push(tempdist.density(t[i]));
        }
        F = makeCDF(f, 1);
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var triangle = function(des){//Triangular
        var t = [];
        var f = [];
        var F = [];
        var left = 0;
        var right = 0;
        var mid = 0;
        if(des == 0){left = px1;right = px2;mid = px3;x = [];fx = [];Fx = [];}
        else if(des == 1){left = py1;right = py2;mid = py3;y = [];fy = [];Fy = [];}
        else if(des == 2){left = pz1;right = pz2;mid = pz3;z = [];fz = [];Fz = [];}
        var start = left;
        var end = right;
        var step = Math.abs((end-start)/numPoints);
        var tempdist = new TriangleDistribution(left, right, mid);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
        }
        F = makeCDF(f, step);
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var coupon = function(des){//Coupon Collector
        var t = [];
        var f = [];
        var F = [];
        var m = 0;
        var kay = 0;
        if(des == 0){m = px1;kay = px2;x = [];fx = [];Fx = [];}
        else if(des == 1){m = py1;kay = py2;y = [];fy = [];Fy = [];}
        else if(des == 2){m = pz1;kay = pz2;z = [];fz = [];Fz = [];}
        var tempdist = new CouponDistribution(m, kay);
        for(var i = 0; i <= tempdist.maxValue-kay; i++){
            t.push(i+kay);
            f.push(tempdist.density(t[i]));
        }
        F = makeCDF(f, 1);
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var bendig = function(des){//Benford Digit
        var t = [];
        var f = [];
        var F = [];
        var beta = 0;
        if(des == 0){beta = px1;x = [];fx = [];Fx = [];}
        else if(des == 1){beta = py1;y = [];fy = [];Fy = [];}
        else if(des == 2){beta = pz1;z = [];fz = [];Fz = [];}
        var tempdist = new BenfordDigitDistribution(beta);
        for(var i = 0; i < beta; i++){
            t.push(i-1);
            f.push(tempdist.density(t[i]));
        }
        F = makeCDF(f, step);
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var betabinom = function(des){//Beta Binomial
        var t = [];
        var f = [];
        var F = [];
        var n = 0;
        var a = 0;
        var beta = 0;
        if(des == 0){n = px1;a = px2;beta = px3;x = [];fx = [];Fx = [];}
        else if(des == 1){n = py1;a = py2;beta = py3;y = [];fy = [];Fy = [];}
        else if(des == 2){n = pz1;a = pz2;beta = pz3;z = [];fz = [];Fz = [];}
        var tempdist = new BetaBinomialDistribution(a, beta, n);
        for(var i = 0; i <= n; i++){
            t.push(i);
            f.push(tempdist.density(t[i]));
        }
        F = makeCDF(f, 1);//If no CDF defined
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var betanegbinom = function(des){//Beta Negative Binomial
        var t = [];
        var f = [];
        var F = [];
        var kay = 0;
        var a = 0;
        var beta = 0;
        if(des == 0){kay = px1;a = px2;beta = px3;x = [];fx = [];Fx = [];}
        else if(des == 1){kay = py1;a = py2;beta = py3;y = [];fy = [];Fy = [];}
        else if(des == 2){kay = pz1;a = pz2;beta = pz3;z = [];fz = [];Fz = [];}
        var tempdist = new BetaNegativeBinomialDistribution(a, beta, kay);
        for(var i = 0; i < (tempdist.maxValue-kay); i++){
            t.push(i+kay);
            f.push(tempdist.density(t[i]));
        }
        F = makeCDF(f, 1);//If no CDF defined
        if(des == 0){x = t; fx = f; Fx = F}
        else if(des == 1){y = t; fy = f; Fy = F;}
        else if(des == 2){z = t; fz = f; Fz = F;}
    }
    var template = function(des){//Template for adding more distributions, copy as a new function then add references to distributions.js, or write in own functions for pdf/cdf. Note that the makeCDF function can be used to make the CDF from a pdf
        var t = [];
        var f = [];
        var F = [];
        var mu = 0;
        var sigma = 0;
        var blob = 0;
        var fish = 0;
        if(des == 0){mu = px1;sigma = px2;blob = px3;fish = px4;x = [];fx = [];Fx = [];}
        else if(des == 1){mu = py1;sigma = py2;blob = py3;fish = py4;y = [];fy = [];Fy = [];}
        else if(des == 2){mu = pz1;sigma = pz2;blob = pz3;fish = pz4;z = [];fz = [];Fz = [];}
        var tempdist = new Distribution();
        var start = tempdist.minValue;
        var end = tempdist.maxValue;
        var step = Math.abs((end-start)/numPoints);
        for(var i = 0; i <= numPoints; i++){
            t.push(start+step*i);
            f.push(tempdist.density(t[i]));
            F.push(tempdist.CDF(t[i]));
        }
        F = makeCDF(f, step);//If no CDF defined
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
        //FGM copula prep - finding kappa
        /*var deltax = x[1]-x[0];
        var deltay = y[1]-y[0];
        var temp1 = 0;
        for (var i = 0; i < x.length; i++){
            temp1 += deltax*x[i]*fx[i]*(2*Fx[i]-1);
        }
        var temp2 = 0;
        for (var i = 0; i < y.length;i++){
            temp2 += deltay*y[i]*fy[i]*(2*Fy[i]-1);
        }
        kappa = (temp1*temp2)/(rho*px2*py2);
        kappa = 1/kappa;*/
        //making bxy,B
        var b = [];
        var B = [];
        var copula = 0;
        var rho = 0;
        var ay = 0;
        var bee = 0;
        var max1 = 1;
        var max2 = 1;
        if (choice == 0){max1 = x.length;max2 = y.length;rho = rhoxy;}
        else if (choice == 1){max1 = x.length;max2 = z.length;rho = rhoxz;}
        else if (choice == 2){max1 = y.length;max2 = z.length;rho = rhoyz;}
        for (var i = 0; i < max1; i++){
            var temp3 = [];
            var temp5 = 0;
            for (var j = 0; j < max2; j++){
                    //FGM copula
                //copula = 1+kappa*(2*Fx[i]-1)*(2*Fy[j]-1);
                    //Exponential copula
                //copula = (1/(1-rho))*(2/(1-rho))*Math.sqrt(rho*Math.log(1-Fx[i])*Math.log(1-Fy[j]))*Math.exp((rho/(1-rho))*(Math.log(1-Fx[i])+Math.log(1-Fy[j])));
                    //Gaussian
                ay = Math.sqrt(2)*erfi(2*Fx[i]-1);
                bee = Math.sqrt(2)*erfi(2*Fy[j]-1);
                copula = (1/(Math.sqrt(1-rho*rho)))*Math.exp(-1*((ay*ay+bee*bee)*rho*rho-2*rho*ay*bee)/(2*(1-rho*rho)));
                if (choice == 0){fx[i]*fy[j]*copula}
                else if (choice == 1){fx[i]*fz[j]*copula}
                else if (choice == 2){fy[i]*fz[j]*copula}
                temp5 = fx[i]*fy[j]*copula;
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
        var topush = 0;
        for (var i = 0; i < x.length; i++){
            temp1 = [];
            temp3 = [];
            for (var j = 0; j < y.length; j++){
                temp2 = [];
                temp4 = [];
                for (var k = 0; k < z.length; k++){
                    topush = (bxy[i][j] + bxz[i][k] + byz[j][k])/3;
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
        outtemp.push('P(' + xmin + ' < X < ' + xmax + ' ∩ ' + ymin + ' < Y < ' + ymax + ' ∩ ' + zmin + ' < Z < ' + zmax + ') = ' + yeet.toFixed(3));
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
    var getDist = function(val, dir, choice){//Gets the row/col at a particular point from a particular b - to fix
        var min = 0;var max = 0;var delta = 0;
        if(dir == 0){
            min = x[0];
            max = x[x.length - 1];
            delta = x[1]-x[0];
        }
        else if(dir == 1){
            min = y[0];
            max = y[y.length - 1];
            delta = y[1]-y[0];
        }
        else if(dir == 2){
            min = z[0];
            max = z[z.length - 1];
            delta = z[1]-z[0];
        }
        if(val <= min && dir == 1){
            if(choice == 0){return bxy[0];}
            else if(choice == 1){return bxz[0];}
            else if(choice == 2){return byz[0];}
        }
        if(val <= min){
            if(choice == 0){return bxy[0];}
            else if(choice == 1){return bxz[0];}
            else if(choice == 2){return byz[0];}
        }
        if(val >= max && dir == 1){return b[x.length-1];}
        if(val >= max){return getCol(y.length-1);}
        var loc = Math.floor((val-min)/delta);//fix
        if(dir == 1){return b[loc];}
        return getCol(loc);
    }
    var getCol = function(col){//Returns a column from b - to fix
        var temp = [];
        for (var i = 0; i < x.length; i++){
            temp.push(b[i][col]);
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
            case 3:// All Conditionals - not yet implemented
                c = getDist(ymin, 0);
                var temp = makefuncut(x, c, xmin, xmax);
                C = makeCDF(c,x[1]-x[0]);
                scaleC();
                drawData(x, c, temp, 'X', 'P(x=X|Y=Ymin)');
                out = findCDF(x, C, xmax) - findCDF(x, C, xmin);
                updateOutput('P(' + xmin + ' < X < ' + xmax + ' | Y = ' + ymin + ') = ' + out.toFixed(3));
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
        }
    }
    var drawData = function(time, fun, funcut, xt, yt){// Draws the data on canvas
        var data = [];
        if(time.length > 75){
            data = [{
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
        }
        else{
            var temp = [];
            for (var i = 0; i < time.length; i++){
                if(funcut[i] == 0){temp.push('rgb(255,255,255)')}
                else{temp.push('rgb(255,0,0)');}
            }
            data = [{
                x: time,
                y: fun,
                type: 'bar',
                text: time,
                marker: {
                    color: temp,
                    opacity: 1,
                    line: {
                      color: 'rgb(0,0,255)',
                      width: 1.5
                    }
                  },
                name: ''
            }];
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
    var doAll = function(){//Does everything
        old = [rhoxy, rhoxz, rhoyz];
        px1 = Number($('#px1').val());
        px2 = Number($('#px2').val());
        px3 = Number($('#px3').val());
        px4 = Number($('#px4').val());
        py1 = Number($('#py1').val());
        py2 = Number($('#py2').val());
        py3 = Number($('#py3').val());
        py4 = Number($('#py4').val());
        pz1 = Number($('#pz1').val());
        pz2 = Number($('#pz2').val());
        pz3 = Number($('#pz3').val());
        pz4 = Number($('#pz4').val());
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
        var temp = "";
        outtemp = [];
		$('#cond1 option:selected').each(function(){
			temp += $(this).val();
        })
        cond1 = Number(temp);
        temp = "";
		$('#cond2 option:selected').each(function(){
			temp += $(this).val();
        })
        cond2 = Number(temp);
        check();
        switch(xdist){//Add additional cases for any distribution added
            case 0:
                px3 = 1;
                px4 = 1;
                normal(0);
                break;
            case 1:
                px2 = 1;
                px3 = 1;
                px4 = 1;
                poisson(0);
                break;
            case 2:
                px3 = 1;
                px4 = 1;
                gamma(0);
                break;
            case 3:
                px1 = Math.floor(px1);
                px2 = 1;
                px3 = 1;
                px4 = 1;
                chisq(0);
                break;
            case 4:
                px2 = 1;
                px3 = 1;
                px4 = 1;
                t(0);
                break;
            case 5:
                px1 = Math.floor(px1);
                px2 = Math.floor(px2);
                px3 = 1;
                px4 = 1;
                fdist(0);
                break;
            case 6:
                px3 = 1;
                px4 = 1;
                beta(0);
                break;
            case 7:
                px3 = 1;
                px4 = 1;
                weibull(0);
                break;
            case 8:
                px3 = 1;
                px4 = 1;
                pareto(0);
                break;
            case 9:
                px3 = 1;
                px4 = 1;
                logistic(0);
                break;
            case 10:
                px3 = 1;
                px4 = 1;
                lognormal(0);
                break;
            case 11:
                px3 = 1;
                px4 = 1;
                gumbel(0);
                break;
            case 12:
                px3 = 1;
                px4 = 1;
                uniform(0);
                break;
            case 13:
                px1 = Math.floor(px1);
                px2 = Math.floor(px2);
                px3 = 1;
                px4 = 1;
                bday(0);
                break;
            case 14:
                px3 = 1;
                px4 = 1;
                uquad(0);
                break;
            case 15:
                px1 = 1;
                px2 = 1;
                px3 = 1;
                px4 = 1;
                arcsine(0);
                break;
            case 16:
                px2 = 1;
                px3 = 1;
                px4 = 1;
                semicircle(0);
                break;
            case 17:
                px1 = Math.floor(px1);
                px2 = 1;
                px3 = 1;
                px4 = 1;
                finalwalk(0);
                break;
            case 18:
                px1 = Math.floor(px1);
                px2 = 1;
                px3 = 1;
                px4 = 1;
                maxwalk(0);
                break;
            case 19:
                px2 = 1;
                px3 = 1;
                px4 = 1;
                cauchy(0);
                break;
            case 20:
                px3 = 1;
                px4 = 1;
                hypsec(0);
                break;
            case 21:
                px1 = Math.floor(px1);
                px2 = 1;
                px3 = 1;
                px4 = 1;
                irwin(0);
                break;
            case 22:
                px3 = 1;
                px4 = 1;
                laplace(0);
                break;
            case 23:
                px2 = 1;
                px3 = 1;
                px4 = 1;
                benmat(0);
                break;
            case 24:
                px3 = 1;
                px4 = 1;
                explog(0);
                break;
            case 25:
                px3 = 1;
                px4 = 1;
                betaprime(0);
                break;
            case 26:
                px1 = Math.floor(px1);
                px2 = 1;
                px3 = 1;
                px4 = 1;
                zeta(0);
                break;
            case 27:
                px3 = 1;
                px4 = 1;
                loglogistic(0);
                break;
            case 28:
                px2 = 1;
                px3 = 1;
                px4 = 1;
                maxwell(0);
                break;
            case 29:
                px2 = 1;
                px3 = 1;
                px4 = 1;
                logdist(0);
                break;
            case 30:
                px2 = Math.floor(px2);
                px3 = 1;
                px4 = 1;
                binom(0);
                break;
            case 31:
                px2 = Math.floor(px2);
                px3 = 1;
                px4 = 1;
                negbinom(0);
                break;
            case 32:
                px1 = Math.floor(px1);
                px2 = Math.floor(px2);
                px3 = Math.floor(px3);
                px4 = 1;
                hypgeo(0);
                break;
            case 33:
                px1 = Math.floor(px1);
                px3 = 1;
                px4 = 1;
                polya(0);
                break;
            case 34:
                px1 = Math.floor(px1);
                px2 = Math.floor(px2);
                px3 = Math.floor(px3);
                px4 = 1;
                finiteorder(0);
                break;
            case 35:
                px1 = Math.floor(px1);
                px2 = 1;
                px3 = 1;
                px4 = 1;
                matching(0);
                break;
            case 36:
                px4 = 1;
                triangle(0);
                break;
            case 37:
                px1 = Math.floor(px1);
                px2 = Math.floor(px2);
                px3 = 1;
                px4 = 1;
                coupon(0);
                break;
            case 38:
                px2 = 1;
                px3 = 1;
                px4 = 1;
                bendig(0);
                break;
            case 39:
                px1 = Math.floor(px1);
                px4 = 1;
                betabinom(0);
                break;
            case 40:
                px1 = Math.floor(px1);
                px4 = 1;
                betanegbinom(0);
                break;
        }
        switch(ydist){//Add additional cases for any distribution added
            case 0:
                py3 = 1;
                py4 = 1;
                normal(1);
                break;
            case 1:
                py2 = 1;
                py3 = 1;
                py4 = 1;
                poisson(1);
                break;
            case 2:
                py3 = 1;
                py4 = 1;
                gamma(1);
                break;
            case 3:
                py1 = Math.floor(py1);
                py2 = 1;
                py3 = 1;
                py4 = 1;
                chisq(1);
                break;
            case 4:
                py2 = 1;
                t(1);
                break;
            case 5:
                py1 = Math.floor(py1);
                py2 = Math.floor(py2);
                py3 = 1;
                py4 = 1;
                fdist(1);
                break;
            case 6:
                py3 = 1;
                py4 = 1;
                beta(1);
                break;
            case 7:
                py3 = 1;
                py4 = 1;
                weibull(1);
                break;
            case 8:
                py3 = 1;
                py4 = 1;
                pareto(1);
                break;
            case 9:
                py3 = 1;
                py4 = 1;
                logistic(1);
                break;
            case 10:
                py3 = 1;
                py4 = 1;
                lognormal(1);
                break;
            case 11:
                py3 = 1;
                py4 = 1;
                gumbel(1);
                break;
            case 12:
                py3 = 1;
                py4 = 1;
                uniform(1);
                break;
            case 13:
                py1 = Math.floor(py1);
                py2 = Math.floor(py2);
                py3 = 1;
                py4 = 1;
                bday(1);
                break;
            case 14:
                py3 = 1;
                py4 = 1;
                uquad(1);
                break;
            case 15:
                py1 = 1;
                py2 = 1;
                py3 = 1;
                py4 = 1;
                arcsine(1);
                break;
            case 16:
                py2 = 1;
                py3 = 1;
                py4 = 1;
                semicircle(1);
                break;
            case 17:
                py1 = Math.floor(py1);
                py2 = 1;
                py3 = 1;
                py4 = 1;
                finalwalk(1);
                break;
            case 18:
                py1 = Math.floor(py1);
                py2 = 1;
                py3 = 1;
                py4 = 1;
                maxwalk(1);
                break;
            case 19:
                py2 = 1;
                py3 = 1;
                py4 = 1;
                cauchy(1);
                break;
            case 20:
                py3 = 1;
                py4 = 1;
                hypsec(1);
                break;
            case 21:
                py1 = Math.floor(py1);
                py2 = 1;
                py3 = 1;
                py4 = 1;
                irwin(1);
                break;
            case 22:
                py3 = 1;
                py4 = 1;
                laplace(1);
                break;
            case 23:
                py2 = 1;
                py3 = 1;
                py4 = 1;
                benmat(1);
                break;
            case 24:
                py3 = 1;
                py4 = 1;
                explog(1);
                break;
            case 25:
                py3 = 1;
                py4 = 1;
                betaprime(1);
                break;
            case 26:
                py1 = Math.floor(py1);
                py2 = 1;
                py3 = 1;
                py4 = 1;
                zeta(1);
                break;
            case 27:
                py3 = 1;
                py4 = 1;
                loglogistic(1);
                break;
            case 28:
                py2 = 1;
                py3 = 1;
                py4 = 1;
                maxwell(1);
                break;
            case 29:
                py2 = 1;
                py3 = 1;
                py4 = 1;
                logdist(1);
                break;
            case 30:
                py2 = Math.floor(py2);
                py3 = 1;
                py4 = 1;
                binom(1);
                break;
            case 31:
                py2 = Math.floor(py2);
                py3 = 1;
                py4 = 1;
                negbinom(1);
                break;
            case 32:
                py1 = Math.floor(py1);
                py2 = Math.floor(py2);
                py3 = Math.floor(py3);
                py4 = 1;
                hypgeo(1);
                break;
            case 33:
                py1 = Math.floor(py1);
                py3 = 1;
                py4 = 1;
                polya(1);
                break;
            case 34:
                py1 = Math.floor(py1);
                py2 = Math.floor(py2);
                py3 = Math.floor(py3);
                py4 = 1;
                finiteorder(1);
                break;
            case 35:
                py1 = Math.floor(py1);
                py2 = 1;
                py3 = 1;
                py4 = 1;
                matching(1);
                break;
            case 36:
                py4 = 1;
                triangle(1);
                break;
            case 37:
                py1 = Math.floor(py1);
                py2 = Math.floor(py2);
                py3 = 1;
                py4 = 1;
                coupon(1);
                break;
            case 38:
                py2 = 1;
                py3 = 1;
                py4 = 1;
                bendig(1);
                break;
            case 39:
                py1 = Math.floor(py1);
                py4 = 1;
                betabinom(1);
                break;
            case 40:
                py1 = Math.floor(py1);
                py4 = 1;
                betanegbinom(1);
                break;
        }
        switch(zdist){//Add additional cases for any distribution added
            case 0:
                pz3 = 1;
                pz4 = 1;
                normal(2);
                break;
            case 1:
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                poisson(2);
                break;
            case 2:
                pz3 = 1;
                pz4 = 1;
                gamma(2);
                break;
            case 3:
                pz1 = Math.floor(pz1);
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                chisq(2);
                break;
            case 4:
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                t(2);
                break;
            case 5:
                pz1 = Math.floor(pz1);
                pz2 = Math.floor(pz2);
                pz3 = 1;
                pz4 = 1;
                fdist(2);
                break;
            case 6:
                pz3 = 1;
                pz4 = 1;
                beta(2);
                break;
            case 7:
                pz3 = 1;
                pz4 = 1;
                weibull(2);
                break;
            case 8:
                pz3 = 1;
                pz4 = 1;
                pareto(2);
                break;
            case 9:
                pz3 = 1;
                pz4 = 1;
                logistic(2);
                break;
            case 10:
                pz3 = 1;
                pz4 = 1;
                lognormal(2);
                break;
            case 11:
                pz3 = 1;
                pz4 = 1;
                gumbel(2);
                break;
            case 12:
                pz3 = 1;
                pz4 = 1;
                uniform(2);
                break;
            case 13:
                pz1 = Math.floor(pz1);
                pz2 = Math.floor(pz2);
                pz3 = 1;
                pz4 = 1;
                bday(2);
                break;
            case 14:
                pz3 = 1;
                pz4 = 1;
                uquad(2);
                break;
            case 15:
                pz1 = 1;
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                arcsine(2);
                break;
            case 16:
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                semicircle(2);
                break;
            case 17:
                pz1 = Math.floor(pz1);
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                finalwalk(2);
                break;
            case 18:
                pz1 = Math.floor(pz1);
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                maxwalk(2);
                break;
            case 19:
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                cauchy(2);
                break;
            case 20:
                pz3 = 1;
                pz4 = 1;
                hypsec(2);
                break;
            case 21:
                pz1 = Math.floor(pz1);
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                irwin(2);
                break;
            case 22:
                pz3 = 1;
                pz4 = 1;
                laplace(2);
                break;
            case 23:
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                benmat(2);
                break;
            case 24:
                pz3 = 1;
                pz4 = 1;
                explog(2);
                break;
            case 25:
                pz3 = 1;
                pz4 = 1;
                betaprime(2);
                break;
            case 26:
                pz1 = Math.floor(pz1);
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                zeta(2);
                break;
            case 27:
                pz3 = 1;
                pz4 = 1;
                loglogistic(2);
                break;
            case 28:
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                maxwell(2);
                break;
            case 29:
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                logdist(2);
                break;
            case 30:
                pz2 = Math.floor(pz2);
                pz3 = 1;
                pz4 = 1;
                binom(2);
                break;
            case 31:
                pz2 = Math.floor(pz2);
                pz3 = 1;
                pz4 = 1;
                negbinom(2);
                break;
            case 32:
                pz1 = Math.floor(pz1);
                pz2 = Math.floor(pz2);
                pz3 = Math.floor(pz3);
                pz4 = 1;
                hypgeo(2);
                break;
            case 33:
                pz1 = Math.floor(pz1);
                pz3 = 1;
                pz4 = 1;
                polya(2);
                break;
            case 34:
                pz1 = Math.floor(pz1);
                pz2 = Math.floor(pz2);
                pz3 = Math.floor(pz3);
                pz4 = 1;
                finiteorder(2);
                break;
            case 35:
                pz1 = Math.floor(pz1);
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                matching(2);
                break;
            case 36:
                pz4 = 1;
                triangle(2);
                break;
            case 37:
                pz1 = Math.floor(pz1);
                pz2 = Math.floor(pz2);
                pz3 = 1;
                pz4 = 1;
                coupon(2);
                break;
            case 38:
                pz2 = 1;
                pz3 = 1;
                pz4 = 1;
                bendig(2);
                break;
            case 39:
                pz1 = Math.floor(pz1);
                pz4 = 1;
                betabinom(2);
                break;
            case 40:
                pz1 = Math.floor(pz1);
                pz4 = 1;
                betanegbinom(2);
                break;
        }
        makeB(0);
        makeB(1);
        makeB(2);
        maketri();
        updateGraph();//Updates 2D Graph
        updatePlot();//Updates 3D Graph
        updateTitles();
        $('main').hide(1000);
        $('#backdim').hide(1000);
        settingsOpen = false;
    }
    var dispI = function(){//Updates instructions in the Graph settings window
        for (var i = 10; i < distTitle.length+10; i++){
            if(i == instructions[0] || i == instructions[1] || i == instructions[2]){
                $('#' + i).show();
            }
            else{
                $('#' + i).hide();
            }
        }
    }
    var updateTitles = function(){//Updates graph titles
        if(des == 3){
            $('#flattitle').replaceWith('<h2 id = "flattitle">' + flattitle[des][cond1][cond2] + '</h2>');
        }
        else{$('#flattitle').replaceWith('<h2 id = "flattitle">' + flattitle[des] + '</h2>');}
        if(des3d == 0){$('#surftitle').replaceWith('<h2 id = "surftitle">Bivariate PDF: X - ' + distTitle[xdist] + ', Y - ' + distTitle[ydist] + '</h2>');}
        else if(des3d == 1){$('#surftitle').replaceWith('<h2 id = "surftitle">Bivariate PDF: X - ' + distTitle[xdist] + ', Z - ' + distTitle[zdist] + '</h2>');}
        else if(des3d == 2){$('#surftitle').replaceWith('<h2 id = "surftitle">Bivariate PDF: Y - ' + distTitle[ydist] + ', Z - ' + distTitle[zdist] + '</h2>');}
        else if(des3d == 3){$('#surftitle').replaceWith('<h2 id = "surftitle">Bivariate CDF: X - ' + distTitle[xdist] + ', Y - ' + distTitle[ydist] + '</h2>');}
        else if(des3d == 4){$('#surftitle').replaceWith('<h2 id = "surftitle">Bivariate CDF: X - ' + distTitle[xdist] + ', Z - ' + distTitle[zdist] + '</h2>');}
        else if(des3d == 5){$('#surftitle').replaceWith('<h2 id = "surftitle">Bivariate CDF: Y - ' + distTitle[ydist] + ', Z - ' + distTitle[zdist] + '</h2>');}
        
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
    $(document).on('change', '#xdist', function(){//Detects change in select menu for X and alters the page accordingly
        var temp = "";
		$('#xdist option:selected').each(function(){
			temp += $(this).val();
        })
        xdist = Number(temp);
        instructions[0] = xdist+10;
        dispI();
        switch (xdist){//Add other cases for any distribution added
            case 0:
                $('#x1').replaceWith('<td id = "x1">&mu;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&sigma;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 1:
                $('#x1').replaceWith('<td id = "x1">&lambda;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 2:
                $('#x1').replaceWith('<td id = "x1">k<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&theta;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 3:
                $('#x1').replaceWith('<td id = "x1">k<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 4:
                $('#x1').replaceWith('<td id = "x1">v<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 5:
                $('#x1').replaceWith('<td id = "x1">D1<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">D2<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 6:
                $('#x1').replaceWith('<td id = "x1">&alpha;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&beta;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 7:
                $('#x1').replaceWith('<td id = "x1">k<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&lambda;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 8:
                $('#x1').replaceWith('<td id = "x1">X<sub>m</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&alpha;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 9:
                $('#x1').replaceWith('<td id = "x1">&mu;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">s<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 10:
                $('#x1').replaceWith('<td id = "x1">&mu;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&sigma;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 11:
                $('#x1').replaceWith('<td id = "x1">&mu;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&beta;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 12:
                $('#x1').replaceWith('<td id = "x1">a<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">b<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">5</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 13:
                $('#x1').replaceWith('<td id = "x1">Days<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">Sample<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">5</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 14:
                $('#x1').replaceWith('<td id = "x1">a<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">b<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 15:
                $('#x1').replaceWith('<td id = "x1">N/A</td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 16:
                $('#x1').replaceWith('<td id = "x1">R<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                break;
            case 17:
                $('#x1').replaceWith('<td id = "x1">N<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 18:
                $('#x1').replaceWith('<td id = "x1">N<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 19:
                $('#x1').replaceWith('<td id = "x1">&gamma;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 20:
                $('#x1').replaceWith('<td id = "x1">Location<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">Scale<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 21:
                $('#x1').replaceWith('<td id = "x1">N<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 22:
                $('#x1').replaceWith('<td id = "x1">&mu;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">b<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 23:
                $('#x1').replaceWith('<td id = "x1">b<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 24:
                $('#x1').replaceWith('<td id = "x1">p<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&beta;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 25:
                $('#x1').replaceWith('<td id = "x1">&alpha;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&beta;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 26:
                $('#x1').replaceWith('<td id = "x1">s<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 27:
                $('#x1').replaceWith('<td id = "x1">&alpha;<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">&beta;<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 28:
                $('#x1').replaceWith('<td id = "x1">a<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 29:
                $('#x1').replaceWith('<td id = "x1">p<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 30:
                $('#x1').replaceWith('<td id = "x1">Prob<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 31:
                $('#x1').replaceWith('<td id = "x1">Prob<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">K<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 32:
                $('#x1').replaceWith('<td id = "x1">N<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">k<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">n<sub>X</sub> = <textarea id = "px3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 33:
                $('#x1').replaceWith('<td id = "x1">r<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">p<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 34:
                $('#x1').replaceWith('<td id = "x1">m<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">n<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">k<sub>X</sub> = <textarea id = "px3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 35:
                $('#x1').replaceWith('<td id = "x1">Hats<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 36:
                $('#x1').replaceWith('<td id = "x1">Left<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">Right<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">3</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">Middle<sub>X</sub> = <textarea id = "px3" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 37:
                $('#x1').replaceWith('<td id = "x1">m<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">k<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 38:
                $('#x1').replaceWith('<td id = "x1">b<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">N/A</td>');
                $('#x3').replaceWith('<td id = "x3">N/A</td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 39:
                $('#x1').replaceWith('<td id = "x1">n<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">a<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">b<sub>X</sub> = <textarea id = "px3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
            case 40:
                $('#x1').replaceWith('<td id = "x1">k<sub>X</sub> = <textarea id = "px1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x2').replaceWith('<td id = "x2">a<sub>X</sub> = <textarea id = "px2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x3').replaceWith('<td id = "x3">b<sub>X</sub> = <textarea id = "px3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#x4').replaceWith('<td id = "x4">N/A</td>');
                break;
        }
    })
    $(document).on('change', '#ydist', function(){//Detects change in select menu for Y and alters the page accordingly
        var temp = "";
		$('#ydist option:selected').each(function(){//Add other cases for any distributions added
			temp += $(this).val();
        })
        ydist = Number(temp);
        instructions[1] = ydist+10;
        dispI();
        switch (ydist){
            case 0:
                $('#y1').replaceWith('<td id = "y1">&mu;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&sigma;<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 1:
                $('#y1').replaceWith('<td id = "y1">&lambda;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 2:
                $('#y1').replaceWith('<td id = "y1">k<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&theta;<sub>X</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 3:
                $('#y1').replaceWith('<td id = "y1">k<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 4:
                $('#y1').replaceWith('<td id = "y1">v<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 5:
                $('#y1').replaceWith('<td id = "y1">D1<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">D2<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 6:
                $('#y1').replaceWith('<td id = "y1">&alpha;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&beta;<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 7:
                $('#y1').replaceWith('<td id = "y1">k<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&lambda;<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 8:
                $('#y1').replaceWith('<td id = "y1">Y<sub>m</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&alpha;<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 9:
                $('#y1').replaceWith('<td id = "y1">&mu;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">s<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 10:
                $('#y1').replaceWith('<td id = "y1">&mu;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&sigma;<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 11:
                $('#y1').replaceWith('<td id = "y1">&mu;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&beta;<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 12:
                $('#y1').replaceWith('<td id = "y1">a<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">b<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">5</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 13:
                $('#y1').replaceWith('<td id = "y1">Days<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">Sample<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">5</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 14:
                $('#y1').replaceWith('<td id = "y1">a<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">b<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 15:
                $('#y1').replaceWith('<td id = "y1">N/A</td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 16:
                $('#y1').replaceWith('<td id = "y1">R<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 17:
                $('#y1').replaceWith('<td id = "y1">N<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 18:
                $('#y1').replaceWith('<td id = "y1">N<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 19:
                $('#y1').replaceWith('<td id = "y1">&gamma;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 20:
                $('#y1').replaceWith('<td id = "y1">Location<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">Scale<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 21:
                $('#y1').replaceWith('<td id = "y1">N<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 22:
                $('#y1').replaceWith('<td id = "y1">&mu;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">b<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 23:
                $('#y1').replaceWith('<td id = "y1">b<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 24:
                $('#y1').replaceWith('<td id = "y1">p<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&beta;<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 25:
                $('#y1').replaceWith('<td id = "y1">&alpha;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&beta;<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 26:
                $('#y1').replaceWith('<td id = "y1">s<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 27:
                $('#y1').replaceWith('<td id = "y1">&alpha;<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">&beta;<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 28:
                $('#y1').replaceWith('<td id = "y1">a<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 29:
                $('#y1').replaceWith('<td id = "y1">p<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 30:
                $('#y1').replaceWith('<td id = "y1">Prob<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 31:
                $('#y1').replaceWith('<td id = "y1">Prob<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">K<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 32:
                $('#y1').replaceWith('<td id = "y1">N<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">k<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">n<sub>Y</sub> = <textarea id = "py3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 33:
                $('#y1').replaceWith('<td id = "y1">r<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">p<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 34:
                $('#y1').replaceWith('<td id = "y1">m<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">n<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">k<sub>Y</sub> = <textarea id = "py3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 35:
                $('#y1').replaceWith('<td id = "y1">Hats<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 36:
                $('#y1').replaceWith('<td id = "y1">Left<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">Right<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">3</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">Middle<sub>Y</sub> = <textarea id = "py3" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 37:
                $('#y1').replaceWith('<td id = "y1">m<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">k<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 38:
                $('#y1').replaceWith('<td id = "y1">b<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">N/A</td>');
                $('#y3').replaceWith('<td id = "y3">N/A</td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 39:
                $('#y1').replaceWith('<td id = "y1">n<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">a<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">b<sub>Y</sub> = <textarea id = "py3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
            case 40:
                $('#y1').replaceWith('<td id = "y1">k<sub>Y</sub> = <textarea id = "py1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y2').replaceWith('<td id = "y2">a<sub>Y</sub> = <textarea id = "py2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y3').replaceWith('<td id = "y3">b<sub>Y</sub> = <textarea id = "py3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#y4').replaceWith('<td id = "y4">N/A</td>');
                break;
        }
    })
    $(document).on('change', '#zdist', function(){//Detects change in select menu for Y and alters the page accordingly
        var temp = "";
		$('#zdist option:selected').each(function(){//Add other cases for any distributions added
			temp += $(this).val();
        })
        zdist = Number(temp);
        instructions[2] = zdist+10;
        dispI();
        switch (zdist){
            case 0:
                $('#y1').replaceWith('<td id = "z1">&mu;<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">&sigma;<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 1:
                $('#z1').replaceWith('<td id = "z1">&lambda;<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 2:
                $('#z1').replaceWith('<td id = "z1">k<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">&theta;<sub>X</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 3:
                $('#z1').replaceWith('<td id = "z1">k<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 4:
                $('#z1').replaceWith('<td id = "z1">v<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 5:
                $('#z1').replaceWith('<td id = "z1">D1<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">D2<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 6:
                $('#z1').replaceWith('<td id = "z1">&alpha;<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">&beta;<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 7:
                $('#z1').replaceWith('<td id = "z1">k<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">&lambda;<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 8:
                $('#z1').replaceWith('<td id = "z1">Z<sub>m</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">&alpha;<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 9:
                $('#z1').replaceWith('<td id = "z1">&mu;<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">s<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 10:
                $('#z1').replaceWith('<td id = "z1">&mu;<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">&sigma;<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 11:
                $('#z1').replaceWith('<td id = "z1">&mu;<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">&beta;<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 12:
                $('#z1').replaceWith('<td id = "z1">a<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">0</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">b<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">5</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 13:
                $('#z1').replaceWith('<td id = "z1">Dazs<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">Sample<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">5</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 14:
                $('#z1').replaceWith('<td id = "z1">a<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">b<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 15:
                $('#z1').replaceWith('<td id = "z1">N/A</td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 16:
                $('#z1').replaceWith('<td id = "z1">R<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 17:
                $('#z1').replaceWith('<td id = "z1">N<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 18:
                $('#z1').replaceWith('<td id = "z1">N<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 19:
                $('#z1').replaceWith('<td id = "z1">&gamma;<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 20:
                $('#z1').replaceWith('<td id = "z1">Location<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">Scale<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 21:
                $('#z1').replaceWith('<td id = "z1">N<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 22:
                $('#z1').replaceWith('<td id = "z1">&mu;<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">b<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 23:
                $('#z1').replaceWith('<td id = "z1">b<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 24:
                $('#z1').replaceWith('<td id = "z1">p<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">&beta;<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 25:
                $('#z1').replaceWith('<td id = "z1">&alpha;<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">&beta;<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 26:
                $('#z1').replaceWith('<td id = "z1">s<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 27:
                $('#z1').replaceWith('<td id = "z1">&alpha;<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">&beta;<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 28:
                $('#z1').replaceWith('<td id = "z1">a<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 29:
                $('#z1').replaceWith('<td id = "z1">p<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 30:
                $('#z1').replaceWith('<td id = "z1">Prob<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 31:
                $('#z1').replaceWith('<td id = "z1">Prob<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">K<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 32:
                $('#z1').replaceWith('<td id = "z1">N<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">k<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">n<sub>Z</sub> = <textarea id = "pz3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 33:
                $('#z1').replaceWith('<td id = "z1">r<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">p<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">0.5</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 34:
                $('#z1').replaceWith('<td id = "z1">m<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">n<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">k<sub>Z</sub> = <textarea id = "pz3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 35:
                $('#z1').replaceWith('<td id = "z1">Hats<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 36:
                $('#z1').replaceWith('<td id = "z1">Left<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">Right<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">3</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">Middle<sub>Z</sub> = <textarea id = "pz3" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 37:
                $('#z1').replaceWith('<td id = "z1">m<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">k<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 38:
                $('#z1').replaceWith('<td id = "z1">b<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">2</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">N/A</td>');
                $('#z3').replaceWith('<td id = "z3">N/A</td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 39:
                $('#z1').replaceWith('<td id = "z1">n<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">a<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">b<sub>Z</sub> = <textarea id = "pz3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
            case 40:
                $('#z1').replaceWith('<td id = "z1">k<sub>Z</sub> = <textarea id = "pz1" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z2').replaceWith('<td id = "z2">a<sub>Z</sub> = <textarea id = "pz2" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z3').replaceWith('<td id = "z3">b<sub>Z</sub> = <textarea id = "pz3" onfocus="this.select()" rows="1" maxlength="4">1</textarea></td>');
                $('#z4').replaceWith('<td id = "z4">N/A</td>');
                break;
        }
    })
    
                                                            //3D model
    var updatePlot = function(){// Uses Plotly to generate a 3d plot
        var data = [];
        if(des3d == 0){data = [{x: x,y: y,z: bxyCut,type: 'surface'}];updateOutput(outtemp[0]);}
        else if(des3d == 1){data = [{x: x,y: z,z: bxzCut,type: 'surface'}];updateOutput(outtemp[1]);}
        else if(des3d == 2){data = [{x: y,y: z,z: byzCut,type: 'surface'}];updateOutput(outtemp[2]);}
        else if(des3d == 3){data = [{x: x,y: y,z: Bxy,type: 'surface'}];updateOutput(outtemp[0]);}
        else if(des3d == 4){data = [{x: x,y: z,z: Bxz,type: 'surface'}];updateOutput(outtemp[1]);}
        else if(des3d == 5){data = [{x: y,y: z,z: Byz,type: 'surface'}];updateOutput(outtemp[2]);}
        else if(des3d == 6){
            var xdisp = [];
            var ydisp = [];
            var zdisp = [];
            var colours = [];
            var temp = 0;
            var temp1 = "";
            for (i = 0; i < x.length; i++){
                for (var j = 0; j < y.length; j++){
                    for (var k = 0; k < z.length; k++){
                        temp = Math.round(255*triCut[i][j][k]/trimax);
                        temp1 = temp.toString();
                        if(temp > 50){
                            xdisp.push(x[i]);
                            ydisp.push(y[j]);
                            zdisp.push(z[k]);
                            colours.push("rgb(0," + temp1 + ",0)");
                        }
                    }
                }
            }
            //alert(xdisp.length);
            data = [{
                x: xdisp,
                y: ydisp,
                z: zdisp,
                marker: {
                    size: 5,
                    symbol: 'circle',
                    color: colours,
                    line: {color: '#fff',width: 0},
                    opacity: 0.1
                },
                type: 'scatter3d'}];updateOutput(outtemp[3]);
        }
        else if(des3d == 7){
            var xdisp = [];
            var ydisp = [];
            var zdisp = [];
            var colours = [];
            var temp = 0;
            var temp1 = "";
            for (i = 0; i < x.length; i++){
                for (var j = 0; j < y.length; j++){
                    for (var k = 0; k < z.length; k++){
                        temp = Math.round(255*Tri[i][j][k]);
                        temp1 = temp.toString();
                        if(temp > 100){
                            xdisp.push(x[i]);
                            ydisp.push(y[j]);
                            zdisp.push(z[k]);
                            colours.push("rgb(0," + temp1 + ",0)");
                        }
                    }
                }
            }
            //alert(xdisp.length);
            data = [{
                x: xdisp,
                y: ydisp,
                z: zdisp,
                marker: {
                    size: 5,
                    symbol: 'circle',
                    color: colours,
                    line: {color: '#fff',width: 0},
                    opacity: 0.1
                },
                type: 'scatter3d'}];updateOutput(outtemp[3]);
        }
        
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
        doAll();
        starting++;
        dispI();
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