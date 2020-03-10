import mongoose = require('mongoose');
import Types = mongoose.Types;
import ObjectId = Types.ObjectId;

export interface Game {
  _id: ObjectId;
  gameId: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  mins: number;
  tags: readonly string[];
  genres: readonly string[];
  styles: readonly string[];
  language: string;
  endTime: string;
  people: string;
  minAttendance: number;
  maxAttendance: number;
  gameSystem: string;
  englishOk: boolean;
  childrenFriendly: boolean;
  ageRestricted: boolean;
  beginnerFriendly: boolean;
  intendedForExperiencedParticipants: boolean;
  popularity: number;
  shortDescription: string;
  revolvingDoor: boolean;
  programType: string;
}

export interface KompassiGame {
  title: string;
  description: string;
  category_title: string;
  formatted_hosts: string;
  room_name: string;
  length: number;
  start_time: string;
  end_time: string;
  language: string;
  rpg_system: string;
  no_language: boolean;
  english_ok: boolean;
  children_friendly: boolean;
  age_restricted: boolean;
  beginner_friendly: boolean;
  intended_for_experienced_participants: boolean;
  min_players: number;
  max_players: number;
  identifier: string;
  tags: readonly string[];
  genres: readonly string[];
  styles: readonly string[];
  short_blurb: string;
  revolving_door: boolean;
  three_word_description: string;
  is_beginner_friendly: boolean;
}

export interface GameWithPlayerCount {
  game: Game;
  players: number;
}
