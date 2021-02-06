import empty from './empty.json';
import singlesun from './singlesun.json';

export interface MapItem {
	version: number;
	name: string;
	size: number;
	friction: number;
	stars: Array<StarItem>;
	planets: Array<PlanetItem>;
	asteroids: Array<AsteroidItem>;
	spawn: Array<SpawnItem>;
}

export interface StarItem {
	x: number | string;
	y: number | string;
	diameter: number | string;
	mass: number | string;
	color: string;
}

export interface PlanetItem {
	x: number | string;
	y: number | string;
	diameter: number | string;
	mass: number | string;
	color: string;
}

export interface AsteroidItem {
	x: number | string;
	y: number | string;
	diameter: number | string;
	mass: number | string;
	color: string;
}

export interface SpawnItem {
	x: number;
	y: number;
	width: number;
	height: number;
}

export const maps: Array<MapItem> = [empty as MapItem, singlesun as MapItem];

export default maps;
