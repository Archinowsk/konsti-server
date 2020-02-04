export interface Group {
  id: string; // Group id
  size: number; // Group size
  pref: ReadonlyArray<string>; // Game wishes (game id)
}

export interface Event {
  id: string; // game id
  min: number; // game min players
  max: number; // game max players
  groups: ReadonlyArray<Group>; // groups signed for the game
}

export interface ListItem {
  id: string; // group id
  size: number; // group size
  event: string; // game id for the signed game
  gain: number; // preference: 1st choice => 1, 2nd choice => 0.5, 3rd choice => 0.33
}

export interface Input {
  groups: ReadonlyArray<Group>;
  events: ReadonlyArray<Event>;
  list: ReadonlyArray<ListItem>;
  updateL: Function;
}

export interface OpaAssignResult {
  id: string; // group id
  assignment: string; // assigned game id
}

export type OpaAssignResults = ReadonlyArray<OpaAssignResult>;
