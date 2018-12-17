export default class Vector {
    constructor(x, y) {
        this._x = x || 0;
        this._y = y || 0; 
    }

    reset ( x, y ) {

		this._x = x;
		this._y = y;

		return this;

	};

	toString (decPlaces) {
	 	decPlaces = decPlaces || 3; 
		var scalar = Math.pow(10,decPlaces); 
		return "[" + Math.round (this._x * scalar) / scalar + ", " + Math.round (this._y * scalar) / scalar + "]";
	};
	
	clone () {
		return new Vector(this._x, this._y);
	};
	
	copyTo (v) {
		v.x = this._x;
		v.y = this._y;
	};
	
	copyFrom (v) {
		this._x = v.x;
		this._y = v.y;
	};	
	
	magnitude () {
		return Math.sqrt((this._x*this._x)+(this._y*this._y));
	};
	
	magnitudeSquared () {
		return (this._x*this._x)+(this._y*this._y);
	};
	
	normalise () {
		
		var m = this.magnitude();
				
		this._x = this._x/m;
		this._y = this._y/m;

		return this;	
	};
	
	reverse () {
		this._x = -this._x;
		this._y = -this._y;
		
		return this; 
	};
	
	plusEq (v) {
		this._x+=v.x;
		this._y+=v.y;
		
		return this; 
	};
	
	plusNew (v) {
		 return new Vector(this._x+v.x, this._y+v.y); 
	};
	
	minusEq (v) {
		this._x-=v.x;
		this._y-=v.y;
		
		return this; 
	};

	minusNew (v) {
	 	return new Vector(this._x-v.x, this._y-v.y); 
	};	
	
	multiplyEq (scalar) {
		this._x*=scalar;
		this._y*=scalar;
		
		return this; 
	};
	
	multiplyNew (scalar) {
		var returnvec = this.clone();
		return returnvec.multiplyEq(scalar);
	};
	
	divideEq (scalar) {
		this._x/=scalar;
		this._y/=scalar;
		return this; 
	};
	
	divideNew (scalar) {
		var returnvec = this.clone();
		return returnvec.divideEq(scalar);
	};

	dot (v) {
		return (this._x * v.x) + (this._y * v.y) ;
    };
    
    pos() {
        return {x: this._x, y: this._y};
    };
	
	angle (useRadians) {
		
		return Math.atan2(this._y,this._x) * (useRadians ? 1 : VectorConst.TO_DEGREES);
		
    };
    
    getDirection(v){
        const x = v._x - this._x;
        const y = v._y - this._y;
        return Math.atan2(x, y);
    }
	
	rotate (angle, useRadians) {
		
		var cosRY = Math.cos(angle * (useRadians ? 1 : VectorConst.TO_RADIANS));
		var sinRY = Math.sin(angle * (useRadians ? 1 : VectorConst.TO_RADIANS));
	
		VectorConst.temp.copyFrom(this); 

		this._x= (VectorConst.temp.x*cosRY)-(VectorConst.temp.y*sinRY);
		this._y= (VectorConst.temp.x*sinRY)+(VectorConst.temp.y*cosRY);
		
		return this; 
	};	
		
	equals (v) {
		return((this._x==v.x)&&(this._y==v.x));
	};
	
	isCloseTo (v, tolerance) {	
		if(this.equals(v)) return true;
		
		VectorConst.temp.copyFrom(this); 
		VectorConst.temp.minusEq(v); 
		
		return(VectorConst.temp.magnitudeSquared() < tolerance*tolerance);
	};
	
	rotateAroundPoint (point, angle, useRadians) {
		VectorConst.temp.copyFrom(this); 
		//trace("rotate around point "+t+" "+point+" " +angle);
		VectorConst.temp.minusEq(point);
		//trace("after subtract "+t);
		VectorConst.temp.rotate(angle, useRadians);
		//trace("after rotate "+t);
		VectorConst.temp.plusEq(point);
		//trace("after add "+t);
		this.copyFrom(VectorConst.temp);
		
	}; 
	
	isMagLessThan (distance) {
		return(this.magnitudeSquared()<distance*distance);
	};
	
	isMagGreaterThan (distance) {
		return(this.magnitudeSquared()>distance*distance);
	}
}

export const VectorConst = {
	TO_DEGREES : 180 / Math.PI,		
	TO_RADIANS : Math.PI / 180,
	temp : new Vector()
    };
