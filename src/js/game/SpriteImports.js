// blocks
import grass from '../../../sprites/Sprites/Blocks/BackgroundTile.png';
import fragile from '../../../sprites/Sprites/Blocks/ExplodableBlock.png';
import steel from '../../../sprites/Sprites/Blocks/SolidBlock.png';

// bomb
import bomb1 from '../../../sprites/Sprites/Bomb/Bomb_f01.png';
import bomb2 from '../../../sprites/Sprites/Bomb/Bomb_f02.png';
import bomb3 from '../../../sprites/Sprites/Bomb/Bomb_f03.png';

// player
import front1 from '../../../sprites/Sprites/Bomberman/Front/Bman_F_f00.png';
import front2 from '../../../sprites/Sprites/Bomberman/Front/Bman_F_f02.png';
import front3 from '../../../sprites/Sprites/Bomberman/Front/Bman_F_f06.png';

import back1 from '../../../sprites/Sprites/Bomberman/Back/Bman_B_f00.png';
import back2 from '../../../sprites/Sprites/Bomberman/Back/Bman_B_f02.png';
import back3 from '../../../sprites/Sprites/Bomberman/Back/Bman_B_f06.png';

import right1 from '../../../sprites/Sprites/Bomberman/Right/Bman_F_f00.png';
import right2 from '../../../sprites/Sprites/Bomberman/Right/Bman_F_f03.png';
import right3 from '../../../sprites/Sprites/Bomberman/Right/Bman_F_f06.png';

import left1 from '../../../sprites/Sprites/Bomberman/Left/Bman_F_f00.png';
import left2 from '../../../sprites/Sprites/Bomberman/Left/Bman_F_f03.png';
import left3 from '../../../sprites/Sprites/Bomberman/Left/Bman_F_f06.png';

// creep
import frontC1 from '../../../sprites/Sprites/Creep/Front/Creep_F_f00.png';
import frontC2 from '../../../sprites/Sprites/Creep/Front/Creep_F_f02.png';
import frontC3 from '../../../sprites/Sprites/Creep/Front/Creep_F_f05.png';

import backC1 from '../../../sprites/Sprites/Creep/Back/Creep_B_f00.png';
import backC2 from '../../../sprites/Sprites/Creep/Back/Creep_B_f02.png';
import backC3 from '../../../sprites/Sprites/Creep/Back/Creep_B_f05.png';

import rightC1 from '../../../sprites/Sprites/Creep/Side/Creep_S_f00.png';
import rightC2 from '../../../sprites/Sprites/Creep/Side/Creep_S_f05.png';
import rightC3 from '../../../sprites/Sprites/Creep/Side/Creep_S_f06.png';

// flame
import flame1 from '../../../sprites/Sprites/Flame/Flame_f00.png';
import flame2 from '../../../sprites/Sprites/Flame/Flame_f01.png';
import flame3 from '../../../sprites/Sprites/Flame/Flame_f02.png';

export const fieldSprites = {
	grassBrick: grass,
	fragileBrick: fragile,
	steelBrick: steel
};

export const playerSprites = {
	down: [
		front1,
		front2,
		front3
	],

	up: [
		back1,
		back2,
		back3
	],

	right: [
		right1,
		right2,
		right3
	],

	left: [
		left1,
		left2,
		left3
	]
};

export const creepSprites = {
	down: [
		frontC1,
		frontC2,
		frontC3
	],

	up: [
		backC1,
		backC2,
		backC3
	],

	right: [
		rightC1,
		rightC2,
		rightC3
	]
};

export const bombSprites = [
	bomb1,
	bomb2,
	bomb3
];

export const flameSprites = [
	flame1,
	flame2,
	flame3
];
