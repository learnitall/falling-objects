# Projectile Motion - Implementation Notes

This document contains miscellaneous notes related to the implementation of Falling Objects.
It supplements the internal (source code) documentation, and (hopefully) provides insight
into "big picutre" implementatoin issues. The audience for this document is software
developers who are familiar with JavaScript and PhET simulation development (as described
in [PhET Development Overview](http://bit.ly/phet-html5-development-overview)).

First, read [model.md](https://github.com/learnitall/falling-objects/blob/master/doc/model.md),
which provides a high-level description of the simulation model.


## Objects

The various falling objects are implemented using the [Item.js](https://github.com/learnitall/falling-objects/blob/master/js/falling-objects/model/Item.js)
model. The term 'Item' was used to represent objects, as the term 'Object' is a reserved
keyword.
