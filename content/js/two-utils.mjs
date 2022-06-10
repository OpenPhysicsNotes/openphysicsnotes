
import Two from '/js/two.module.js';

/**
 * represents a numeric interval
 */
export class Interval {

	min = 0;
	max = 0;

	/**
	 * @param {number} min
	 * @param {number} max
	 * @returns {Interval}
	 */
	static create(min, max) {
		return new Interval(min, max);
	}

	/**
	 * @param {number} min
	 * @param {number} max
	 */
	constructor(min, max) {
		this.min = min;
		this.max = max;
	}

	/**
	 * @param {number} t
	 * @returns {number}
	 */
	lerp(t) {
		return this.min + t * (this.max - this.min);
	}

	/**
	 * inverse lerp
	 * @param {number} x
	 * @returns {number}
	 */
	inverseLerp(x) {
		return (x - this.min) / (this.max - this.min);
	}
}

let plotDefaultColors = [
	'#ff0000',
	'#00ff00',
	'#0000ff',
	'#ffff00',
	'#ff00ff',
	'#00ffff',
	'#000000',
	'#ffffff'
];
let plotDefaultColors_counter = 0;

/**
 * 
 * @param {number} x 
 * @returns {number}
 */
function inv01Number(x) {
	//return x * 2 - 1;
	return 1 - x;
}

/**
 * 
 * A cartesian plot of a function.
 * 
 * @class PlotCartesianXYFunc
 */
export class PlotCartesianXYFunc extends Two.Group {
	
	/**
	 * @type { (x : number) => number }
	 */
	func = (x) => x;

	/**
	 * @type { string }
	 */
	color = '#000000';

	/**
	 * @type { string }
	 */
	//fill = 'transparent';

	/**
	 * @type { Two.Path | null }
	 * @private
	 */
	m_stroke_path = null;

	/**
	 * @returns {Two.Path | null}
	 */
	get stroke_path() {
		return this.m_stroke_path;
	}

	/**
	 * @param {Two.Path | null} value
	 */
	set stroke_path(value) {
		if (this.m_stroke_path !== null) {
			this.remove(this.m_stroke_path);
		}

		this.m_stroke_path = value;

		if (this.m_stroke_path !== null) {
			this.add(this.m_stroke_path);
		}

		return this.m_stroke_path;
	}

	/**
	 * @type { Two.Path | null }
	 * @private
	 */
	m_fill_path = null;

	get fill_path() {
		return this.m_fill_path;
	}

	set fill_path(value) {
		if (this.m_fill_path !== null) {
			this.remove(this.m_fill_path);
		}

		this.m_fill_path = value;

		if (this.m_fill_path !== null) {
			this.add(this.m_fill_path);
		}

		return this.m_fill_path;
	}

	/**
	 *
	 */
	constructor(func = (x) => x) {
		super();

		this.func = func;

		this.color = plotDefaultColors[plotDefaultColors_counter];
		plotDefaultColors_counter++;
		if (plotDefaultColors_counter >= plotDefaultColors.length) {
			plotDefaultColors_counter = 0;
		}

		this.fill = "blue";
	}
};

class AxisOptions {

	/**
	 * @type {boolean}
	 * @default true
	 */
	show = true;

	/**
	 * number, 'min', 'max'
	 * @type {number | string}
	 * @default 0
	 */
	position = 0;

	/**
	 * @type {boolean}
	 * @default true
	 */
	arrow = true;

	/**
	 * @type { string }
	 * @default 'gray'
	 */
	stroke = 'gray';

	/**
	 * @type { string }
	 */
	label = '';

	constructor(label = '') {
		this.label = label;
	}
}

/**
 * A Plot
 */
export class Plot extends Two.Group {
	/**
	 * @type {Two}
	 */
	two;

	/**
	 * @type { PlotCartesianXYFunc[] }
	 */
	functions = [];

	N = 100;

	x_range = new Interval(-0.25, 1);
	y_range = new Interval(-0.25, 1);

	/**
	 * 
	 * @param {Two.Vector} vec 
	 * @returns 
	 */
	vec_to_pixel_space(vec) {
		let x = this.x_range.inverseLerp(vec.x) * this.W;
		let y = inv01Number(this.y_range.inverseLerp(vec.y)) * this.H;

		return new Two.Vector(x, y);
	}

	/**
	 * @param { number } x
	 * @param { number } y
	 * @returns { Two.Vector }
	 */
	to_pixel_space_vec(x, y) {
		return this.vec_to_pixel_space(new Two.Vector(x, y));
	}

	W = 300;
	H = 200;

	x_axis_options = new AxisOptions('x');
	y_axis_options = new AxisOptions('y');

	/**
	 * @param {Two} two
	*/
	constructor(two) {
		super();

		console.assert(two instanceof Two, 'two must be instance of Two');
		this.two = two;
		two.add(this);
	}

	/**
	 * @param {PlotCartesianXYFunc} func
	 * @returns {Plot}
	 */
	add_func(func) {
		this.functions.push(func);

		this.add(func);

		return this;
	}

	/**
	 * 
	 * @param { (x : number) => number } func 
	 * @returns { PlotCartesianXYFunc }
	 */
	add_XY_func(func) {
		let f = new PlotCartesianXYFunc(func);
		this.add_func(f);

		f.fill = "#ff000020";

		return f;
	}

	/**
	 * 
	 * @param { (t) => Two.Vector } func
	 * @returns { Two.Vector[] }
	 */
	to_vertices(func, interval = new Interval(0, 1), N = this.
	N) {

		/**
		* @type {Two.Vector[]}
		*/
		let vertices = [];

		for (let i = 0; i <= this.N; i++) {
			let t = i / this.N;
			vertices.push(func(t));
		}

		return vertices;
	}

	/**
	 * 
	 * @param { Two.Vector[] } vertices
	 * @return { Two.Path }
	 */
	to_path(vertices) {
		
		let path = new Two.Path(vertices);

		return path;
	}

	render() {
		for (let func of this.functions) {
			let f = (t) => {
				let x = this.x_range.lerp(t);
				let y = func.func(x);

				let v = this.to_pixel_space_vec(x, y);
				return v;
			};

			let vertices = this.to_vertices(f);

			let path = this.to_path(vertices);
			func.stroke_path = path;
			path.stroke = func.color;
			path.fill = "none";

			vertices.unshift(this.to_pixel_space_vec(this.x_range.min, 0));
			vertices.push(this.to_pixel_space_vec(this.x_range.max, 0));

			let fill = new Two.Path(vertices);
			func.fill_path = fill;
			fill.fill = func.fill;
			fill.stroke = "none";
		}

		this.make_clipping_mask();
		this.make_axes();
	}

	make_clipping_mask() {
		let path = new Two.Path([
			new Two.Vector(0, 0),
			new Two.Vector(this.W, 0),
			new Two.Vector(this.W, this.H),
			new Two.Vector(0, this.H)
		]);

		path.fill = '#ffffff';
		path.stroke = '#000000';

		this.mask = path;
	}

	make_axes() {
		let pa = this.to_pixel_space_vec(this.x_range.min, 0);
		let pb = this.to_pixel_space_vec(this.x_range.max, 0);

		/**
		 * @type {Two.Line | Two.Path}
		 */
		let axis = null;

		if (this.x_axis_options.arrow) {
			axis = this.two.makeArrow(pa.x, pa.y, pb.x, pb.y, 10);
		} else {
			axis = new Two.Path([
				pa,
				pb
			]);
		}

		axis.stroke = 'grey';

		this.add(axis);

		let fontSize = this.H / 10;

		// draw the axis label
		let label = new Two.Text(this.x_axis_options.label, pb.x-fontSize * 0.5, pb.y + fontSize * 1);
		label.fill = this.x_axis_options.stroke;
		label.stroke = 'none';
		label.linewidth = 0;
		//label.fontSize = fontSize;
		label.size = fontSize;
		label.alignment = 'right';
		label.baseline = 'middle';
		
		this.add(label);

		let pa2 = this.to_pixel_space_vec(0, this.y_range.min);
		let pb2 = this.to_pixel_space_vec(0, this.y_range.max);

		if (this.y_axis_options.arrow) {
			axis = this.two.makeArrow(pa2.x, pa2.y, pb2.x, pb2.y, 10);
		} else {
			axis = new Two.Path([
				pa2,
				pb2
			]);
		}

		axis.stroke = 'grey';

		this.add(axis);

		label = new Two.Text(this.y_axis_options.label, pb2.x + fontSize * 1, pb2.y + fontSize * 0.5);
		label.fill = this.y_axis_options.stroke;
		label.stroke = 'none';
		label.linewidth = 0;
		//label.fontSize = fontSize;
		label.size = fontSize;
		label.alignment = 'right';
		label.baseline = 'middle';

		this.add(label);
	}
}