# Falling Objects - Model Description

This is a high level description of the model used in Falling Objects. It is intended for
audiences who aren't necessarily technical, but anyone looking to understand how this simulation
functions is encouraged to read.

    This simulation is still under active development, therefore the information provided in
    this document is subject to change.


## General Overview

The goal of this simulation is to allow users to understand the behavior of falling objects
by giving them the ability to adjust the factors that influence and object's fall. These
factors can be segmented into two parts: environmental and object properties.

Environmental factors are considered to be the following:

* Acceleration due to Gravity
* Atmospheric Density

Users are given the ability to change these factors through sliders found in the control panel, wherein
users are given a range of values to choose from. The range for acceleration due to gravity is from 0 to
Jupiter's gravity at 24.97 m/s^2. The range for atmospheric density is from 0 (no air resistence) to
Earth's air desnity at sea level (1.2 kg/m^3). Changes to these values apply immediatly to the object
that is falling and will stay persistent when the object that is falling is changed.

Object factors are considered to be the following:

* Mass
* Drag Coefficient
* Area
* Terminal Velocity

A collection of objects (based off of estimated values) is provided for the users to interact with.
Only one object can be dropped at at time, therefore when a user changes the object they would like
to drop the simulation is pseudo-reset, where the current drop is canceled and the simulation will be
setup to drop the new object.


## Numerical Calculations

The most important calculation in this simulation is determining the speed of a falling object, taking
into account acceleration due to gravity and the influence of drag. This is done by first calculating the
total net force acting on the object (vertically):

![Net force equals force of gravity minus force of drag.](https://github.com/learnitall/falling-objects/blob/master/assets/fnet-forces.jpg)

![Net force equals mass times acceleration due to gravity minus one half times the drag coefficient times air density times velocity squared times area.](https://github.com/learnitall/falling-objects/blob/master/assets/fnet.jpg)

For an explanation of the above symbols:

    (Drag Force) = (0.5)*(Drag Coefficient)*(Air Density)*((Velocity)^2)*(Reference Area)

Also note that the positive direction of motion is downward, and the value for velocity that referenced
above is the last known velocity of the object.

The net force acting on the object can now be used to find the total acceleration of the object:

![Total acceleration equals net force divided by mass](https://github.com/learnitall/falling-objects/blob/master/assets/at.jpg)

Which can then be used to find total velocity:

![Total velocity equals total acceleration times time](https://github.com/learnitall/falling-objects/blob/master/assets/vt-drag.jpg)

Since drag is toggleable in this simulation, a falling object's speed must also be calculated without
the influence of air resistance. This can be done by letting the acceleration due to gravity be the
total acceleration acting on the object:

![total velocity equals acceleration due to gravity times time](https://github.com/learnitall/falling-objects/blob/master/assets/vt-no-drag.jpg)

As stated earlier, the velocity of the object is the main objective, however the force calculations
will be used to display a free body diagram of the object, so that users may understand the relationships
between the force of weight and drag.


## Future Additions

This simulation only provides one model and screen, however future additions could include:

* Screen allowing users to manually adjust object properties.
* Screen allowing users to manually adjust the altitude of the falling object, with the option of keeping
  the altitude constant or have it change as the object falls.