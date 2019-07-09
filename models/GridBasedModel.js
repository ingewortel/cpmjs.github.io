/** The core CPM class. Can be used for two- or 
 * three-dimensional simulations. 
*/

"use strict"

import MersenneTwister from "mersennetwister"
import Grid2D from "../grid/Grid2D.js"
import Grid3D from "../grid/Grid3D.js"

class GridBasedModel {

	constructor( field_size, conf ){
		let seed = conf.seed || Math.floor(Math.random()*Number.MAX_SAFE_INTEGER)
		this.mt = new MersenneTwister( seed )
		if( !("torus" in conf) ){
			conf["torus"] = true
		}

		// Attributes based on input parameters
		this.ndim = field_size.length // grid dimensions (2 or 3)
		if( this.ndim != 2 && this.ndim != 3 ){
			throw("only 2D and 3D models are implemented!")
		}
		this.conf = conf // input parameter settings; see documentation.

		// Some functions/attributes depend on ndim:
		if( this.ndim == 2 ){
			this.grid = new Grid2D(field_size,conf.torus)
		} else {
			this.grid = new Grid3D(field_size,conf.torus)
		}
		// Pull up some things from the grid object so we don't have to access it
		// from the outside
		this.midpoint = this.grid.midpoint
		this.field_size = this.grid.field_size
		this.pixels = this.grid.pixels.bind(this.grid)
		this.pixti = this.grid.pixti.bind(this.grid)
		this.neighi = this.grid.neighi.bind(this.grid)
		this.extents = this.grid.extents
	}

	/* Get neighbourhood of position p */
	neigh(p, torus=this.conf.torus){
		let g = this.grid
		return g.neighi( g.p2i(p), torus ).map( function(i){ return g.i2p(i) } )
	}

	/* Get celltype/identity (pixt) or cellkind (pixk) of the cell at coordinates p or index i. */
	pixt( p ){
		return this.grid.pixti( this.grid.p2i(p) )
	}

	/* Change the pixel at position p (coordinates) into cellid t. 
	Update cell perimeters with Pup (optional parameter).*/

	setpix ( p, t ){
		this.grid.setpixi( this.grid.p2i(p), t )
	}

	/* ------------- MATH HELPER FUNCTIONS --------------- */
	random (){
		return this.mt.rnd()
	}

	/* Random integer number between incl_min and incl_max */
	ran (incl_min, incl_max) {
		return Math.floor(this.random() * (1.0 + incl_max - incl_min)) + incl_min
	}
	
	/* ------------- COMPUTING THE HAMILTONIAN --------------- */
	
	timeStep (){
		throw("implemented in subclasses")
	}
}

export default GridBasedModel 
