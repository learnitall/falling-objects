# Sources

This document describes the sources for all physics calculations,
environment/object specifications and helpful references.

**This document is an ugly work in progress meant to be a brain dump. Will be formalized
later on for proper/consistent formatting.**


## General Physics Information

* Reynold's Numbers in comparison to flow type: https://www.engineeringtoolbox.com/laminar-transitional-turbulent-flow-d_577.html


## Object Specifications

Sources for data used to create real-world objects in the sim

### Bowling Ball

* Mass and Reference Area:
  * The United States Bowling Congress 2016 [Equipment Specifications and Certifications Manual](http://usbcongress.http.internapcdn.net/usbcongress/bowl/equipandspecs/pdfs/ESManual.pdf)
    (used max allowed values).
  * 8.595" diameter used, which is a radius of 4.298" = 0.1092 meters and a reference area of 1.47 m^2
  * Used 16 lb or 7.25 kg ball
* Drag coefficient:
  * [Drag of a Sphere (NASA)](https://www.grc.nasa.gov/www/k-12/airplane/dragsphere.html)
  * [Drag Coefficient (The Engineering Toolbox)](https://www.engineeringtoolbox.com/drag-coefficient-d_627.html)
  * [Drag on Spheres (Penn State University)](http://www.mne.psu.edu/cimbala/me325web_Spring_2012/Labs/Drag/intro.pdf)
  * [Drag on a Baseball (NASA)](https://www.grc.nasa.gov/www/k-12/airplane/balldrag.html)
  * Drag coefficient for a sphere depends on the Reynold's number, which changes with both
    altitude and speed. For high Reynold's numbers (and therfore high velocities with turbulent flow)
    however, the drag coefficient of a smooth sphere is around 0.5, therefore that was the
    value used.

### Badminton Shuttlecock

* [Measurements of Aerodynamic Properties of Badminton
  Shuttlecocks](https://ac.els-cdn.com/S1877705810002742/1-s2.0-S1877705810002742-main.pdf?_tid=e688c092-ed85-499d-9509-c3c76214e452&acdnat=1524886270_a4a0f787af33459fc5d933d50e6abcc1)
* Study tested 10 total Shuttlecocks (five feathered and five synthetic)
  * Average mass: (5.215g + 4.867g + 6.231g + 5.25g + 4.595g + 4.913g + 5.244g + 5.12g +
    5.181g + 4.891g) / 10 = 51.507g / 10 = 5.1507g = 0.0051507kg ~ 0.00515kg
  * Average skirt diameter: (65mm + 63mm + 66mm + 68mm + 66mm + 65mm + 65mm + 66mm +
    65mm + 65mm) / 10 = 654mm / 10 = 65.4mm = 0.0654m ~ 0.065m
  * Average reference area = ((Average skirt diameter / 2) ^ 2) * pi =
    ((0.065m / 2) ^ 2) * pi = 0.0033 m^2
  * Average drag coefficient: 0.61 over 100km/h and 0.51 at 60km/h
    (we chose 0.61 though to support higher velocities)
  * Average total length: (84mm + 82mm + 83mm + 78mm + 85mm + 86mm + 80mm + 85mm +
    85mm + 85mm) / 10 = 833mm / 10 = 83.3mm = 0.0833 m ~ 0.083m

### Golf Ball

* Mass:
  * [Mass Of A Golf Ball (The Physics Factbook)](https://hypertextbook.com/facts/1999/ImranArif.shtml). Gives
    a list of five sources that all state a golf ball has an average mass of 0.045kg
* Reference Area:
  * [Leaderboard.com](http://www.leaderboard.com/glossary_balldiameter). States that the United States Golf
    Association specifies that a golf ball must be no less than 1.68 inches in diameter.
      * 1.68 inches = 0.042672 m
      * ((0.042672m / 2) ^ 2 ) * pi = 0.00143 m^2
* Drag Coefficient:
  * [Drag Coefficient (Eric Weisstein's World of Physics)](http://scienceworld.wolfram.com/physics/DragCoefficient.html)

### Ping Pong Ball

* Drag Coefficient:
  * Went with the known drag coefficient for a smooth sphere in turbulent flow (0.5). See the
    Bowling Ball section
* Mass and Reference Area:
  * [International Table Tennis Federation 2018 Handbook](https://www.ittf.com/handbook/). States that a ball shall
    weigh 2.7g (0.0027kg) and have a diameter of 40mm (which is a reference area of
    ((40mm / 2) ^ 2) * pi = ((0.04m / 2) ^ 2) * pi = 0.0013 m^2

### Baseball

* Drag Coefficient:
  * [Drag on a Baseball (NASA)](https://www.grc.nasa.gov/www/k-12/airplane/balldrag.html)
* Mass and Reference Area
  * [2018 Official Baseball Rules (MLB)](http://mlb.mlb.com/documents/0/8/0/268272080/2018_Official_Baseball_Rules.pdf)
  * States that a ball must weigh between 5 and 5.25 ounces (0.147 and 0.148 kg) and that a ball
    must be 9 to 9.25 inches in circumference (which is 9 in / (2 * pi) to 9.25 in / (2 * pi) =  1.432 to
    1.472 in = 0.0364 m to 0.0374 m. We will use the average of the two, which is 0.0369 m
  * Use 0.14 kg for mass and ((0.23 m / 2) ^ 2) * pi = 0.0415 m^2 ~ 0.0042 m^2 for reference area

### Football

* Drag Coefficient:
  * [The drag force on an American football (Tulane University)](http://mlb.mlb.com/documents/0/8/0/268272080/2018_Official_Baseball_Rules.pdf)
    * Showed that for speeds between 10 and 30 m/s (when the football is not spinning), the
      drag coefficient is in the range of 0.05-0.06. They stated that the drag coefficient is smaller
      by about 10% if the ball is spinning at 600rpm
    * We are going to assume the ball is not spinning when being dropped, and will therefore use
      (0.05 + 0.06) / 2 = 0.055 as the drag coefficient.
* Mass and Reference Area
  * [Official Playing Rules of the National Football League (2017)](https://operations.nfl.com/media/2725/2017-playing-rules.pdf)
    * States that the ball will weigh between 14 to 15 ounces (0.397 kg to 0.425 kg). We're going to cut it
      even and say 14.5 ounces or 0.411 kg
    * States that the ball will be a prolate spheroid with a long circumference of 28 to 28.5 inches and
      a short circumference of 21 to 21.25 inches. Using 28.25 inches for the long circumference and
      21.125 inches for the short circumference, the diameter of the ball along the long circumference
      (i.e. the overall height) would be (28.25 inches / pi) = (0.71755 m / pi) = 0.2284 m, and the diamter
      of the ball along the short circumference (i.e. the overall width) would be (21.125 inches / pi) =
      (0.537m / pi) = 0.171 m.
    * The reference area of the ball would be the center cross-sectional circle that is orthogonal to
      the laces (i.e. what you see when the ball is held in front of one's face by the laces). This
      circle would have the specified short diamter of 0.171m and therefore a total area of
      ((0.171m / 2) ^ 2) * pi = 0.0230 m^2

### Model Rocket

* Drag Coefficient:
  * [Terminal Velocity (NASA)](https://spaceflightsystems.grc.nasa.gov/education/rocket/termvr.html)
* Mass and Reference Area
  * Picked a model rocket to base values off of- the Alpha III from [EstesRockets](https://www.estesrockets.com/rockets/launch-sets/001427-alpha-iiir-launch-set)
  * Estimated weight is 34g = 0.034kg but this is without an engine. A B6-4 engine adds 6.24g = 0.00624 kg.
    This makes the total estimated mass 0.034kg + 0.00624kg = 0.0402 kg
      * [Estes Engine Chart](http://www2.estesrockets.com/pdf/Estes_Engine_Chart.pdf)
  * Diameter is 25 mm, making the reference area of the rocket ((25mm / 2) ^ 2) * pi =
    ((0.025m / 2) ^ 2) * pi = 0.00049 m^2
  * Diameter of the rocket with the fins on was estimated to be about 4.5 times the diameter of the
    rocket without fins: 0.025m * 4.5 = 0.1125m. Each fin was estimated to be 1.75 times in diameter
    of the rocket body.
  * Height of the rocket without fins is 12.1 inches (0.307 m). The extra height the fins
    added onto the body of the rocket was estimated to be 1.5 times the diameter of the rocket
    without fins: (0.025m * 1.5) + 0.307m = 0.3445m

### Sports Car (1995 McLaren F1 LM)

* Drag Coefficient
  * [1995 McLaren F1 LM (topspeed.com)](https://www.topspeed.com/cars/mclaren/1995-mclaren-f1-lm-ar11027.html)
    * States that the drag coefficient for the McLaren is 0.32
* Mass and Reference Area
  * [1995 McLaren F1 LM (supercars.net)](https://www.supercars.net/blog/1995-mclaren-f1-lm/)
    * States that the McLaren has a curb weight (total weight with all equipment and operating consumables) of
      2341 lbs = (2341 lbs / 9.81 m/s^2) kg = 238.63 kg
    * Also shows that it has a width of 71.7 in (1.82 m), a height of 44.1 in (1.12 m) and a length
      of 171.9 in (4.37 m).
    * An approximated frontal reference area can be calculated from
      width * height = 1.82 m * 1.12 m = 2.04 m^2
    * Approximated top-view dimensions (which will be used in the simulation) can be derived from
      width by length = 1.82 m by 4.37 m


## Environmental Factors

Sources for how different environmental factors are calculated/modeled

### Air Density

* [Earth Atmosphere Model (NASA)](https://www.grc.nasa.gov/www/k-12/airplane/atmosmet.html)
* Outlines a model that was created in the 60s based off of atmospheric data. The data was averaged
  and then fit to various equations.
* There are four variables:
  1. p: density (kg/m^3)
  2. P: pressure (k-Pa or kilo-Pascals)
  3. T: temperature (degrees celcius)
  4. h: altitude (meters)
* Air density is calculated using the standard Equation of State: p = P / (0.2869 * (T + 273.1))
  * Reference: [Equation of State (NASA)](https://www.grc.nasa.gov/www/k-12/airplane/eqstat.html)
* Temperature and Pressure are calculated using three different sets of equations, depending on the
  altitude:
  * Troposphere (h <= 11000):
    * T = 15.04 - 0.00649 * h
    * P = 101.29 * ((T + 273.1) / 288.08) ^ 5.256
  * Lower Stratosphere (11000 < h <= 25000)
    * T = -56.46
    * P = 22.65 * e ^ (1.73 - (0.000157 * h))
  * Upper Stratosphere (h > 25000)
    * T = -131.21 + 0.00299 * h
    * P = 2.488 * ((T + 273.1) / 216.6) ^ -11.388
* Max altitude that the sim will support is 100 km, as the International Aeronautic Federation accepts this as
  the official altitude where space begins (also known as the Karman line). This fact was pulled from
  [sciencing.com](https://sciencing.com/high-atmosphere-extend-earth-12392.html)